"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

type Category = 'vasomotor' | 'sleep' | 'psychological' | 'cognitive' | 'urogenital' | 'sexual' | 'physical' | 'social';

interface Question {
  id: number;
  category: Category;
  text: string;
}

interface CategoryInfo {
  name: string;
  icon: string;
  description: string;
}

const CATEGORIES: Record<Category, CategoryInfo> = {
  vasomotor: { name: '혈관운동 증상', icon: '🔥', description: '안면홍조, 발한' },
  sleep: { name: '수면 장애', icon: '😴', description: '불면증, 피로' },
  psychological: { name: '정서적 증상', icon: '💭', description: '우울, 불안' },
  cognitive: { name: '인지 기능', icon: '🧠', description: '기억력, 집중력' },
  urogenital: { name: '비뇨생식기', icon: '🌸', description: '질 건조, 요실금' },
  sexual: { name: '성기능 변화', icon: '💕', description: '성욕, 만족도' },
  physical: { name: '신체적 증상', icon: '💪', description: '통증, 피로' },
  social: { name: '사회적 영향', icon: '👥', description: '일상, 자존감' }
};

const QUESTIONS: Question[] = [
  // 1. 혈관운동 증상 (4문항)
  { id: 1, category: 'vasomotor', text: '갑자기 얼굴이나 상체가 뜨거워지는 느낌이 있다 (안면홍조)' },
  { id: 2, category: 'vasomotor', text: '밤에 땀을 많이 흘려서 잠에서 깨는 경우가 있다' },
  { id: 3, category: 'vasomotor', text: '이유 없이 갑자기 열이 오르는 느낌이 든다' },
  { id: 4, category: 'vasomotor', text: '가슴이 두근거리거나 답답한 느낌이 있다' },

  // 2. 수면 장애 (4문항)
  { id: 5, category: 'sleep', text: '잠들기가 어렵고 한참 뒤척인다' },
  { id: 6, category: 'sleep', text: '자다가 자주 깬다' },
  { id: 7, category: 'sleep', text: '일찍 깨서 다시 잠들기 어렵다' },
  { id: 8, category: 'sleep', text: '충분히 자도 개운하지 않고 피곤하다' },

  // 3. 정서적 증상 (4문항)
  { id: 9, category: 'psychological', text: '기분이 쉽게 우울해지거나 가라앉는다' },
  { id: 10, category: 'psychological', text: '이유 없이 불안하거나 초조하다' },
  { id: 11, category: 'psychological', text: '사소한 일에도 쉽게 짜증이 나고 예민해진다' },
  { id: 12, category: 'psychological', text: '감정 변화가 심하고 통제가 어렵다' },

  // 4. 인지 기능 (4문항)
  { id: 13, category: 'cognitive', text: '기억력이 예전만 못하다고 느낀다' },
  { id: 14, category: 'cognitive', text: '집중하기가 어렵고 정신이 흐려진다' },
  { id: 15, category: 'cognitive', text: '깜빡깜빡 잊어버리는 일이 많아졌다' },
  { id: 16, category: 'cognitive', text: '머리가 멍하고 사고가 느려진 느낌이다' },

  // 5. 비뇨생식기 증상 (4문항)
  { id: 17, category: 'urogenital', text: '질이 건조하고 불편하다' },
  { id: 18, category: 'urogenital', text: '부부관계 시 통증이나 불편함이 있다' },
  { id: 19, category: 'urogenital', text: '화장실을 자주 가게 된다' },
  { id: 20, category: 'urogenital', text: '웃거나 기침할 때 소변이 새는 경우가 있다' },

  // 6. 성기능 변화 (4문항)
  { id: 21, category: 'sexual', text: '성욕이나 성적 관심이 줄어들었다' },
  { id: 22, category: 'sexual', text: '성적으로 흥분되기 어렵다' },
  { id: 23, category: 'sexual', text: '부부관계에서 만족감이 줄어들었다' },
  { id: 24, category: 'sexual', text: '부부관계를 피하고 싶을 때가 많다' },

  // 7. 신체적 증상 (4문항)
  { id: 25, category: 'physical', text: '관절이나 근육이 아프고 뻐근하다' },
  { id: 26, category: 'physical', text: '쉽게 피곤하고 기력이 없다' },
  { id: 27, category: 'physical', text: '특별한 이유 없이 체중이 늘었다' },
  { id: 28, category: 'physical', text: '두통이나 어지러움이 자주 있다' },

  // 8. 사회적 영향 (4문항)
  { id: 29, category: 'social', text: '증상 때문에 일이나 가사에 지장이 있다' },
  { id: 30, category: 'social', text: '사람 만나기가 귀찮고 외출이 줄었다' },
  { id: 31, category: 'social', text: '여성으로서의 자신감이 떨어진다' },
  { id: 32, category: 'social', text: '전반적으로 삶의 질이 나빠졌다고 느낀다' },
];

const SCALE_OPTIONS = [
  { value: 1, label: '전혀 그렇지 않다', color: 'bg-green-500' },
  { value: 2, label: '그렇지 않다', color: 'bg-lime-500' },
  { value: 3, label: '보통이다', color: 'bg-yellow-500' },
  { value: 4, label: '그렇다', color: 'bg-orange-500' },
  { value: 5, label: '매우 그렇다', color: 'bg-red-500' },
];

const RESULTS = {
  normal: {
    emoji: '🟢',
    title: '갱년기 초기 또는 정상 범위',
    color: 'from-green-400 to-emerald-500',
    status: '양호',
    description: '갱년기 증상이 거의 없거나 매우 경미합니다. 현재 상태를 잘 유지하고 예방에 신경 쓰면 좋습니다.',
    advice: [
      '규칙적인 운동 (주 3회, 30분 이상)',
      '균형 잡힌 식단 (칼슘, 비타민D)',
      '스트레스 관리',
      '정기 검진 (연 1회)'
    ]
  },
  mild: {
    emoji: '🟡',
    title: '경도 갱년기 증상',
    color: 'from-yellow-400 to-orange-400',
    status: '주의',
    description: '갱년기 증상이 있지만 일상생활에 큰 지장은 없는 수준입니다. 생활 습관 개선으로 증상을 완화할 수 있습니다.',
    advice: [
      '유산소 + 근력 운동',
      '콩, 두부 등 식물성 에스트로겐 섭취',
      '충분한 수면 (7-8시간)',
      '명상, 요가 등 이완 활동',
      '카페인, 매운 음식 줄이기'
    ],
    checkups: ['부인과 검진', '골밀도 검사 (골다공증 예방)']
  },
  moderate: {
    emoji: '🟠',
    title: '중등도 갱년기 증상',
    color: 'from-orange-400 to-red-400',
    status: '관리 필요',
    warning: '⚠️ 전문의 상담 권장',
    description: '갱년기 증상이 뚜렷하고 일상생활에 불편함을 주는 수준입니다. 전문의 상담을 통해 적극적인 관리가 필요합니다.',
    advice: [
      '산부인과 전문의 상담 (필수)',
      '호르몬 치료 고려',
      '비호르몬 치료 옵션 상담',
      '한방 치료 병행 가능',
      '영양제 복용 (이소플라본, 감마리놀렌산)'
    ],
    checkups: [
      '부인과 정밀 검진',
      '유방암 검진 (유방촬영)',
      '골밀도 검사',
      '혈액 검사 (호르몬 수치)'
    ]
  },
  severe: {
    emoji: '🔴',
    title: '심한 갱년기 증상',
    color: 'from-red-500 to-rose-600',
    status: '즉시 치료 필요',
    warning: '🚨 즉시 병원 방문',
    description: '갱년기 증상이 매우 심각하여 삶의 질이 크게 저하된 상태입니다. 즉시 전문의 진료를 받아야 합니다.',
    advice: [
      '즉시 산부인과 방문 (필수)',
      '호르몬 대체 요법 적극 고려',
      '정신건강의학과 협진 (우울/불안)',
      '수면 클리닉 방문 (불면증)',
      '약물 치료 시작'
    ],
    emergency: [
      '단기 약물 치료로 증상 완화',
      '정기적인 모니터링',
      '가족의 이해와 지원'
    ]
  },
  critical: {
    emoji: '🔴🔴',
    title: '극심한 갱년기 증상 - 긴급 치료 필요',
    color: 'from-red-600 to-pink-700',
    status: '응급',
    warning: '🚨🚨 응급 - 즉시 병원',
    description: '매우 심각한 수준의 갱년기 증상으로 즉각적인 의료 개입이 필요합니다. 지체하지 말고 바로 병원을 방문하세요.',
    advice: [
      '24시간 이내 병원 방문',
      '종합병원 갱년기 클리닉 추천',
      '다학제 치료 (산부인과, 정신건강의학과, 내과)',
      '집중적인 약물 치료',
      '입원 치료 고려'
    ],
    contacts: [
      '대한폐경학회 상담: 02-3273-1173',
      '보건복지상담센터: 129',
      '여성긴급전화: 1366'
    ]
  }
};

export default function MenopauseTestPage() {
  const [stage, setStage] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setStage('result'), 500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<Category, number> = {
      vasomotor: 0,
      sleep: 0,
      psychological: 0,
      cognitive: 0,
      urogenital: 0,
      sexual: 0,
      physical: 0,
      social: 0
    };

    QUESTIONS.forEach(q => {
      categoryScores[q.category] += answers[q.id] || 0;
    });

    const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);

    return { totalScore, categoryScores };
  };

  const getResultLevel = (score: number) => {
    if (score <= 51) return 'normal';
    if (score <= 76) return 'mild';
    if (score <= 102) return 'moderate';
    if (score <= 128) return 'severe';
    return 'critical';
  };

  // 시작 화면
  if (stage === 'intro') {
    return (
      <PremiumLayout theme="pink">
        
        <AdOverlay /><div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
          <PremiumCard className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="text-5xl sm:text-6xl md:text-7xl">🌸</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                나의 갱년기 지수 체크
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-pink-200">
                갱년기, 혼자 고민하지 마세요
              </p>
            </div>

            <div className="flex justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-pink-300">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-pink-100">⏱️ 약 5-7분</div>
                <div className="text-xs sm:text-sm">소요 시간</div>
              </div>
              <div className="w-px bg-pink-500/30"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-pink-100">32개</div>
                <div className="text-xs sm:text-sm">질문</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
              {Object.values(CATEGORIES).map((cat, idx) => (
                <div key={idx} className="bg-white/10 p-3 sm:p-4 rounded-xl">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{cat.icon}</div>
                  <div className="text-pink-100 font-medium text-xs sm:text-sm">{cat.name}</div>
                </div>
              ))}
            </div>

            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-pink-200">
              <p className="font-bold mb-2">💡 이 검사는</p>
              <ul className="text-left space-y-1 text-xs sm:text-sm">
                <li>✓ 의학적으로 검증된 검사 (Greene Scale 기반)</li>
                <li>✓ 8가지 주요 증상 영역 분석</li>
                <li>✓ 맞춤형 관리 방법 제공</li>
              </ul>
            </div>

            <PremiumButton
              onClick={() => setStage('test')}
              className="w-full py-4 sm:py-6 text-base sm:text-lg"
            >
              검사 시작하기 →
            </PremiumButton>

            <p className="text-xs text-pink-400/70">
              ⚠️ 본 검사는 의학적 진단이 아닙니다
            </p>
          </PremiumCard>
        </div>
      </PremiumLayout>
    );
  }

  // 질문 화면
  if (stage === 'test') {
    const question = QUESTIONS[currentQuestion];
    const category = CATEGORIES[question.category];
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
      <PremiumLayout theme="pink">
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-2xl w-full space-y-4 sm:space-y-6">
            {/* 진행바 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm text-pink-300">
                <span>진행률</span>
                <span className="font-bold">{currentQuestion + 1} / {QUESTIONS.length}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <PremiumCard className="space-y-4 sm:space-y-6">
              {/* 카테고리 */}
              <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-white/10">
                <div className="text-2xl sm:text-3xl">{category.icon}</div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-pink-100">{category.name}</div>
                  <div className="text-xs sm:text-sm text-pink-300">{category.description}</div>
                </div>
              </div>

              {/* 질문 */}
              <div>
                <div className="text-xs sm:text-sm text-pink-400 mb-2">Q{currentQuestion + 1}</div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-6 sm:mb-8 leading-tight">
                  {question.text}
                </h2>

                {/* 답변 버튼들 */}
                <div className="space-y-2 sm:space-y-3">
                  {SCALE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-left ${
                        answers[question.id] === option.value
                          ? 'border-pink-400 bg-pink-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-pink-200 hover:border-pink-500/50 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          answers[question.id] === option.value
                            ? 'border-pink-400 bg-pink-400'
                            : 'border-white/30'
                        }`}>
                          {answers[question.id] === option.value && (
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white"/>
                          )}
                        </div>
                        <span className="font-medium text-sm sm:text-base">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 네비게이션 */}
              <div className="flex gap-3 pt-4">
                {currentQuestion > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    ← 이전
                  </button>
                )}
              </div>
            </PremiumCard>
          </div>
        </div>
      </PremiumLayout>
    );
  }

  // 결과 화면
  const { totalScore, categoryScores } = calculateResults();
  const resultLevel = getResultLevel(totalScore);
  const result = RESULTS[resultLevel];

  return (
    <PremiumLayout theme="pink">
      <div className="min-h-screen p-3 sm:p-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* 총점 */}
          <PremiumCard className="text-center space-y-4 sm:space-y-6">
            <div className="text-6xl sm:text-7xl md:text-8xl">{result.emoji}</div>
            <div>
              <div className={`text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r ${result.color} bg-clip-text text-transparent mb-2`}>
                {totalScore}점
              </div>
              <div className="text-xs sm:text-sm text-pink-400">총 160점 중</div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{result.title}</h2>
              {result.warning && (
                <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 border border-red-500/30 rounded-full text-xs sm:text-sm text-red-300 font-bold">
                  {result.warning}
                </div>
              )}
            </div>
            <p className="text-sm sm:text-base md:text-lg text-pink-200 leading-relaxed">
              {result.description}
            </p>
          </PremiumCard>

          {/* 영역별 점수 */}
          <PremiumCard>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">📊 영역별 분석</h3>
            <div className="space-y-3 sm:space-y-4">
              {(Object.keys(categoryScores) as Category[]).map(cat => {
                const score = categoryScores[cat];
                const maxScore = 20;
                const percentage = (score / maxScore) * 100;
                const category = CATEGORIES[cat];

                return (
                  <div key={cat}>
                    <div className="flex justify-between mb-2 text-xs sm:text-sm">
                      <span className="text-pink-100 flex items-center gap-2">
                        <span className="text-lg sm:text-xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </span>
                      <span className="text-pink-300 font-bold">{score} / {maxScore}</span>
                    </div>
                    <div className="h-3 sm:h-4 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          percentage < 40 ? 'bg-green-500' :
                          percentage < 60 ? 'bg-yellow-500' :
                          percentage < 80 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </PremiumCard>

          {/* 맞춤 조언 */}
          <PremiumCard>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">💡 맞춤 관리 방법</h3>
            <div className="space-y-3 sm:space-y-4">
              {result.advice.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-pink-100">
                  <span className="text-pink-400 flex-shrink-0">→</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* 추천 검진 */}
          {result.checkups && (
            <PremiumCard>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">🔬 받아야 할 검사</h3>
              <div className="space-y-2 sm:space-y-3">
                {result.checkups.map((checkup, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-pink-100">
                    <span className="text-pink-400">✓</span>
                    <span>{checkup}</span>
                  </div>
                ))}
              </div>
            </PremiumCard>
          )}

          {/* 긴급 연락처 */}
          {result.contacts && (
            <PremiumCard className="bg-red-500/10 border-red-500/30">
              <h3 className="text-xl sm:text-2xl font-bold text-red-300 mb-4 sm:mb-6">🚨 긴급 연락처</h3>
              <div className="space-y-2 sm:space-y-3">
                {result.contacts.map((contact, idx) => (
                  <div key={idx} className="text-sm sm:text-base text-red-200">
                    {contact}
                  </div>
                ))}
              </div>
            </PremiumCard>
          )}

          {/* 의료 면책 조항 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 text-xs sm:text-sm text-pink-300">
            <p className="font-bold mb-2">⚠️ 중요 안내</p>
            <p>
              본 검사는 의학적 진단 도구가 아니며, 교육 및 정보 제공 목적으로만 사용됩니다.
              정확한 진단과 치료를 위해서는 반드시 전문의와 상담하시기 바랍니다.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <PremiumButton
              onClick={() => {
                setStage('intro');
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="flex-1"
            >
              다시 하기 🔄
            </PremiumButton>
            <PremiumButton
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: '갱년기 자가진단 결과',
                    text: `나의 갱년기 지수: ${totalScore}점 (${result.title})`,
                    url: window.location.href
                  });
                } else {
                  alert('공유 기능은 모바일에서 사용 가능합니다.');
                }
              }}
              className="flex-1"
            >
              결과 공유하기 📤
            </PremiumButton>
          </div>

          <div className="mt-8">
            <RelatedApps currentAppSlug="menopause-test" />
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
