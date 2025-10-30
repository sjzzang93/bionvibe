# 이혼 예방 사전진단 앱 - Cursor 작업 가이드

## 📋 현재 상태

### ✅ 완료된 작업
1. **apps.json에 앱 추가** - `divorce-prevention` (id)
2. **기본 데이터 구조** - `lib/divorce-prevention-data.ts` (34문항까지)
3. **13개 도메인 정의** 완료

### 🚧 남은 작업 (Cursor에서 진행)

## 1️⃣ 65문항 데이터 완성

**파일**: `lib/divorce-prevention-data.ts`

**현재 상태**: 34문항 작성됨
**목표**: 65문항 완성 + level 속성 추가

### 작업 방법:

각 도메인별 5문항이 되도록 나머지 31문항 추가:

```typescript
// 예시: 의사소통 도메인 (현재 3개 → 5개로 확장)
{
  id: 'C04',
  domain: '의사소통',
  audience: 'both',
  type: 'likert5',
  text: '감정을 솔직하게 표현한다.',
  level: 'intermediate',
  reverse: false,
  weight: 1.0
},
{
  id: 'C05',
  domain: '의사소통',
  audience: 'both',
  type: 'likert5',
  text: '대화할 때 방어적이거나 회피한다.',
  level: 'advanced',
  reverse: true,
  weight: 1.1
}
```

### Level 분배 규칙:
- **basic**: 도메인당 2개 (24문항 총합)
- **intermediate**: 도메인당 1개 (36문항 총합 - basic 포함)
- **advanced**: 나머지 (65문항 전체)

**패턴**:
- 1번, 2번 문항: `level: 'basic'`
- 3번 문항: `level: 'intermediate'`
- 4번, 5번 문항: `level: 'advanced'`

---

## 2️⃣ 점수 계산 로직 구현

**파일**: `lib/divorce-prevention-score.ts` (새로 생성)

```typescript
import { Answer, Question, ScoreBreakdown, QUESTIONS, RISK_TIERS, DOMAINS } from './divorce-prevention-data';

export function calculateScore(answers: Answer[]): ScoreBreakdown {
  const domainScores: Record<string, number> = {};
  const redFlags: string[] = [];

  // 도메인별 점수 계산
  DOMAINS.forEach((domain) => {
    const domainQuestions = QUESTIONS.filter(q => q.domain === domain);
    let domainTotal = 0;
    let domainMax = 0;

    domainQuestions.forEach((question) => {
      const answer = answers.find(a => a.questionId === question.id);
      if (!answer) return;

      let score = 0;
      if (question.type === 'likert5') {
        score = typeof answer.value === 'number' ? answer.value : 0;
        // reverse인 경우 점수 반전 (1→5, 2→4, 3→3, 4→2, 5→1)
        if (question.reverse) {
          score = 6 - score;
        }
      } else if (question.type === 'boolean') {
        score = answer.value === true ? (question.reverse ? 1 : 5) : (question.reverse ? 5 : 1);
      }

      // weight 적용
      const weightedScore = score * (question.weight || 1.0);
      domainTotal += weightedScore;
      domainMax += 5 * (question.weight || 1.0);

      // red flag 감지
      if (question.redFlag && score >= 4) {
        redFlags.push(question.text);
      }
    });

    // 0~100 정규화
    domainScores[domain] = domainMax > 0 ? Math.round((domainTotal / domainMax) * 100) : 0;
  });

  // 전체 점수 (도메인 평균)
  const total = Math.round(
    Object.values(domainScores).reduce((sum, score) => sum + score, 0) / DOMAINS.length
  );

  // 위험도 티어 결정
  let riskTier = RISK_TIERS.find(tier => total >= tier.range[0] && total <= tier.range[1])?.tier || 'LOW';

  // red flag 오버라이드
  if (redFlags.length >= 3) {
    riskTier = 'IMMEDIATE';
  } else if (redFlags.length >= 1) {
    riskTier = riskTier === 'LOW' ? 'CAUTION' : riskTier;
  }

  return {
    domainScores,
    total,
    riskTier,
    redFlags
  };
}
```

---

## 3️⃣ 메인 페이지 생성

**파일**: `app/apps/divorce-prevention/page.tsx` (새로 생성)

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, AlertTriangle, Shield } from 'lucide-react';
import { QUESTIONS, DOMAINS, type Answer, type TestLevel } from '@/lib/divorce-prevention-data';
import { calculateScore } from '@/lib/divorce-prevention-score';

export default function DivorcePreventionPage() {
  const [testLevel, setTestLevel] = useState<TestLevel | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 레벨별 질문 필터링
  const getQuestions = () => {
    if (!testLevel) return [];
    if (testLevel === 'basic') {
      return QUESTIONS.filter(q => q.level === 'basic');
    } else if (testLevel === 'intermediate') {
      return QUESTIONS.filter(q => q.level === 'basic' || q.level === 'intermediate');
    } else {
      return QUESTIONS; // 전체
    }
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentStep];

  const handleAnswer = (value: number | boolean) => {
    const newAnswers = [...answers, { questionId: currentQuestion.id, value }];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 결과 계산
      setShowResult(true);
    }
  };

  const result = showResult ? calculateScore(answers) : null;

  // 레벨 선택 화면
  if (!testLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-purple-600 hover:text-purple-700 mb-6 inline-block">
            ← 홈으로
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ❤️‍🩹 이혼 예방 사전진단
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              결혼 생활의 위험 신호를 조기에 발견하세요
            </p>
          </div>

          {/* 레벨 선택 */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => setTestLevel('basic')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">간단 검사</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">24문항 · 약 5분</p>
              <p className="text-gray-500 text-xs">핵심 영역만 빠르게 체크</p>
            </button>

            <button
              onClick={() => setTestLevel('intermediate')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">중간 검사</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">36문항 · 약 8분</p>
              <p className="text-gray-500 text-xs">균형잡힌 상세 분석</p>
            </button>

            <button
              onClick={() => setTestLevel('advanced')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-5xl mb-4">🔬</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">심화 검사</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">65문항 · 약 12분</p>
              <p className="text-gray-500 text-xs">모든 영역 종합 진단</p>
            </button>
          </div>

          {/* 면책 고지 */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">⚠️ 중요한 안내</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  본 도구는 교육·참고용 자가 점검이며, 의료·법률·심리 진단을 대체하지 않습니다.
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  위험 신호가 의심될 경우 즉시 전문기관(112, 1366, 1393) 또는 전문가와 상의하십시오.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (showResult && result) {
    const tierInfo = RISK_TIERS.find(t => t.tier === result.riskTier);

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            진단 결과
          </h1>

          {/* 전체 위험도 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <div className="text-center mb-6">
              <div className={`inline-block px-6 py-3 rounded-full ${tierInfo?.color} text-white font-bold text-xl mb-4`}>
                {tierInfo?.label}
              </div>
              <div className="text-6xl font-black text-gray-900 dark:text-white">
                {result.total}<span className="text-3xl text-gray-500">/100</span>
              </div>
            </div>

            {/* Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">⚠️ 즉시 주의가 필요한 신호</h3>
                    <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
                      {result.redFlags.map((flag, i) => (
                        <li key={i}>• {flag}</li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-700">
                      <p className="text-sm font-bold text-red-900 dark:text-red-300 mb-2">긴급 연락처:</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">112</span>
                        <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">1366 (여성긴급전화)</span>
                        <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">1393 (정신건강)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 도메인별 점수 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">영역별 점수</h2>
            <div className="space-y-4">
              {DOMAINS.map((domain) => {
                const score = result.domainScores[domain] || 0;
                return (
                  <div key={domain}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{domain}</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{score}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          score < 40 ? 'bg-green-500' :
                          score < 60 ? 'bg-yellow-500' :
                          score < 80 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setTestLevel(null);
                setCurrentStep(0);
                setAnswers([]);
                setShowResult(false);
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              다시 검사하기
            </button>
            <Link
              href="/"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all text-center"
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 질문 화면
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {currentStep + 1} / {questions.length}
            </span>
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-6">
          <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-3">
            {currentQuestion.domain}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {currentQuestion.text}
          </h2>

          {/* 답변 버튼 */}
          {currentQuestion.type === 'likert5' ? (
            <div className="space-y-3">
              {[
                { value: 1, label: '전혀 그렇지 않다' },
                { value: 2, label: '그렇지 않다' },
                { value: 3, label: '보통이다' },
                { value: 4, label: '그렇다' },
                { value: 5, label: '매우 그렇다' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 rounded-xl p-4 text-left font-semibold text-gray-900 dark:text-white transition-all"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 font-bold text-red-900 dark:text-red-300 transition-all"
              >
                예
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 border-2 border-green-300 dark:border-green-700 rounded-xl p-6 font-bold text-green-900 dark:text-green-300 transition-all"
              >
                아니오
              </button>
            </div>
          )}
        </div>

        {/* 이전 버튼 */}
        {currentStep > 0 && (
          <button
            onClick={() => {
              setCurrentStep(currentStep - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-semibold"
          >
            ← 이전 질문
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 4️⃣ Cursor에서 할 일

### ✅ 체크리스트

- [ ] `lib/divorce-prevention-data.ts`에 나머지 31문항 추가 (65문항 완성)
- [ ] 모든 문항에 level 속성 추가 (basic/intermediate/advanced 규칙 따르기)
- [ ] `lib/divorce-prevention-score.ts` 파일 생성 및 위 코드 복사
- [ ] `app/apps/divorce-prevention/page.tsx` 파일 생성 및 위 코드 복사
- [ ] 로컬호스트에서 테스트 (`http://localhost:3000/apps/divorce-prevention`)
- [ ] 스타일 조정 및 버그 수정

---

## 🎯 빠른 시작 명령어

### Cursor에서 실행:

```bash
# 1. 문항 확장 (AI에게 요청)
"lib/divorce-prevention-data.ts에서 각 도메인별로 5문항이 되도록 나머지 문항 추가해줘.
패턴: 1,2번은 level: 'basic', 3번은 'intermediate', 4,5번은 'advanced'"

# 2. 파일 생성
"lib/divorce-prevention-score.ts 파일을 CURSOR_GUIDE에 있는 코드로 생성해줘"
"app/apps/divorce-prevention/page.tsx 파일을 CURSOR_GUIDE에 있는 코드로 생성해줘"

# 3. 테스트
npm run dev
# → http://localhost:3000/apps/divorce-prevention 접속
```

---

## 📞 문의

작업 중 문제가 생기면 Claude Code에게 다시 요청하세요!
