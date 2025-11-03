'use client';

import RelatedApps from '@/app/components/RelatedApps';
import { useState } from 'react';
import Link from 'next/link';
import { Heart, AlertTriangle, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { QUESTIONS, DOMAINS, SAFETY_HOTLINES, type Answer, type TestLevel } from '@/lib/divorce-prevention-data';
import { calculateScore, getTopVulnerableAreas, getRecommendationsByTier } from '@/lib/divorce-prevention-score';

export default function DivorcePreventionPage() {
  const [testLevel, setTestLevel] = useState<TestLevel | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 레벨별 질문 필터링
  const getQuestions = () => {
    if (!testLevel) return [];
    const levelMap: Record<TestLevel, TestLevel[]> = {
      'basic': ['basic'],
      'intermediate': ['basic', 'intermediate'],
      'advanced': ['basic', 'intermediate', 'advanced']
    };
    return QUESTIONS.filter(q => levelMap[testLevel].includes(q.level));
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentStep];
  const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

  const handleAnswer = (value: number | boolean) => {
    const newAnswers = [...answers, { questionId: currentQuestion.id, value }];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleRestart = () => {
    setTestLevel(null);
    setCurrentStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  const result = showResult ? calculateScore(answers) : null;

  // 레벨 선택 화면
  if (!testLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 mb-6 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            홈으로
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">간단 검사</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">13문항 · 약 5분</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">핵심 영역만 빠르게 체크</p>
            </button>

            <button
              onClick={() => setTestLevel('intermediate')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">중간 검사</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">23문항 · 약 8분</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">균형잡힌 상세 분석</p>
            </button>

            <button
              onClick={() => setTestLevel('advanced')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-5xl mb-4">🔬</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">심화 검사</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">34문항 · 약 12분</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">모든 영역 종합 진단</p>
            </button>
          </div>

          {/* 면책 고지 */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-1" />
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
    const tierInfo = { tier: result.riskTier, label: '', color: '', range: [0, 0] as [number, number] };
    if (result.riskTier === 'LOW') {
      tierInfo.label = '낮음';
      tierInfo.color = 'bg-green-500';
    } else if (result.riskTier === 'CAUTION') {
      tierInfo.label = '주의';
      tierInfo.color = 'bg-yellow-500';
    } else if (result.riskTier === 'HIGH') {
      tierInfo.label = '높음';
      tierInfo.color = 'bg-orange-500';
    } else {
      tierInfo.label = '즉시 도움 필요';
      tierInfo.color = 'bg-red-600';
    }

    const topVulnerable = getTopVulnerableAreas(result.domainScores, 3);
    const recommendations = getRecommendationsByTier(result.riskTier);

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            진단 결과
          </h1>

          {/* 전체 위험도 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <div className="text-center mb-6">
              <div className={`inline-block px-6 py-3 rounded-full ${tierInfo.color} text-white font-bold text-xl mb-4`}>
                {tierInfo.label}
              </div>
              <div className="text-6xl font-black text-gray-900 dark:text-white">
                {result.total}<span className="text-3xl text-gray-500 dark:text-gray-400">/100</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                점수가 높을수록 건강한 관계입니다
              </p>
            </div>

            {/* Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">⚠️ 즉시 주의가 필요한 신호</h3>
                    <ul className="space-y-1 text-sm text-red-800 dark:text-red-200 mb-4">
                      {result.redFlags.map((flag, i) => (
                        <li key={i}>• {flag}</li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-red-200 dark:border-red-700">
                      <p className="text-sm font-bold text-red-900 dark:text-red-300 mb-2">긴급 연락처:</p>
                      <div className="flex flex-wrap gap-3">
                        {SAFETY_HOTLINES.map((hotline) => (
                          <span key={hotline.number} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                            {hotline.number} ({hotline.name})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 상위 취약 영역 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">상위 취약 영역 TOP 3</h2>
            <div className="space-y-4">
              {topVulnerable.map((area, index) => (
                <div key={area.domain}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {index + 1}. {area.domain}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{area.score}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        area.score < 40 ? 'bg-red-500' :
                        area.score < 60 ? 'bg-orange-500' :
                        area.score < 80 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${area.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 맞춤 권장 사항 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">맞춤 권장 사항</h2>
            <ul className="space-y-3">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-purple-500 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
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
                  className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl p-4 text-left font-semibold text-gray-900 dark:text-white transition-all"
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
            onClick={handlePrevious}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            이전 질문
          </button>
        )}
      </div>

    <RelatedApps currentAppSlug="divorce-prevention" />

    </div>
  );
}
