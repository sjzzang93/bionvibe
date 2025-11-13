'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';

// 질문 인터페이스
interface Question {
  id: number;
  category: 'RAM' | 'CPU' | 'GPU' | 'Storage' | 'Network' | 'Battery' | 'Security' | 'System';
  question: string;
  emoji: string;
}

// 12개의 핵심 질문들 (각 영역별 1-2개)
const questions: Question[] = [
  { id: 1, category: 'RAM', emoji: '🧠', question: '한 가지 일에 오래 집중하고 중요한 일정을 잘 기억한다' },
  { id: 2, category: 'CPU', emoji: '⚡', question: '문제를 논리적으로 분석하고 빠르게 결정할 수 있다' },
  { id: 3, category: 'GPU', emoji: '✨', question: '새로운 아이디어를 자주 떠올리고 창의적으로 생각한다' },
  { id: 4, category: 'Storage', emoji: '📚', question: '새로운 것을 배우는 것이 즐겁고 과거 경험을 잘 활용한다' },
  { id: 5, category: 'Network', emoji: '👥', question: '다른 사람과 소통하고 공감하는 것이 편하다' },
  { id: 6, category: 'Battery', emoji: '🔋', question: '하루를 활기차게 시작하고 피로를 잘 관리한다' },
  { id: 7, category: 'Security', emoji: '🛡️', question: '감정이 안정적이고 스트레스를 잘 해소한다' },
  { id: 8, category: 'System', emoji: '⚙️', question: '규칙적인 생활을 하고 목표를 끝까지 완수한다' },
  { id: 9, category: 'RAM', emoji: '🧠', question: '여러 정보를 동시에 처리하는 것이 어렵지 않다' },
  { id: 10, category: 'CPU', emoji: '⚡', question: '장기적인 계획을 세우고 실행하는 것이 자연스럽다' },
  { id: 11, category: 'Battery', emoji: '🔋', question: '충분한 체력이 있고 피곤할 때 빨리 회복된다' },
  { id: 12, category: 'Security', emoji: '🛡️', question: '나 자신을 긍정적으로 생각하고 자신감이 있다' },
];

// 카테고리별 설명
const categoryInfo: Record<string, { name: string; description: string; emoji: string }> = {
  RAM: { name: '기억력·집중력', description: '정보를 기억하고 한 가지에 집중하는 능력', emoji: '🧠' },
  CPU: { name: '사고력·문제해결', description: '논리적으로 생각하고 문제를 해결하는 능력', emoji: '⚡' },
  GPU: { name: '창의력·상상력', description: '새로운 아이디어를 떠올리고 창의적으로 생각하는 능력', emoji: '✨' },
  Storage: { name: '학습능력·경험치', description: '새로운 것을 배우고 경험을 활용하는 능력', emoji: '📚' },
  Network: { name: '소통·공감', description: '다른 사람과 소통하고 공감하는 능력', emoji: '👥' },
  Battery: { name: '에너지·체력', description: '활력을 유지하고 피로를 관리하는 능력', emoji: '🔋' },
  Security: { name: '감정·자기관리', description: '감정을 안정적으로 유지하고 스트레스를 관리하는 능력', emoji: '🛡️' },
  System: { name: '생활습관·목표달성', description: '규칙적인 생활을 하고 목표를 완수하는 능력', emoji: '⚙️' },
};

// 점수별 개선 제안
const getImprovementTips = (category: string, score: number): string[] => {
  const tips: Record<string, Record<string, string[]>> = {
    RAM: {
      low: ['📝 중요한 일은 바로 메모하는 습관 들이기', '🎯 한 번에 하나씩 집중하기', '⏰ 포모도로 기법 (25분 집중 + 5분 휴식) 활용'],
      medium: ['📱 핸드폰 알림 끄고 집중 시간 만들기', '🧘 명상으로 집중력 향상', '✅ To-do 리스트로 기억 보조'],
      high: ['💪 현재 수준 유지하며 더 긴 집중 시간 도전', '📚 독서량 늘려서 집중력 강화'],
    },
    CPU: {
      low: ['🤔 작은 결정부터 빠르게 내리는 연습', '📊 문제를 글로 적어서 정리하기', '🎲 선택지를 3개 이하로 줄이기'],
      medium: ['📖 논리 퍼즐이나 체스로 사고력 훈련', '💭 결정 전 장단점 정리하는 습관', '🗓️ 주간 계획 세우기'],
      high: ['🎯 장기 목표 설정하고 전략 수립', '📝 복잡한 문제 분석 연습'],
    },
    GPU: {
      low: ['🎨 새로운 취미 시작하기 (그림, 음악, 글쓰기)', '🌟 일상에서 다르게 해보기', '💡 "만약에...?" 질문 던지기'],
      medium: ['📸 일상 관찰하고 기록하기', '🎭 다양한 분야 경험해보기', '🤝 창의적인 사람들과 교류'],
      high: ['🚀 아이디어 실행에 옮기기', '✨ 창작 활동 꾸준히 하기'],
    },
    Storage: {
      low: ['📚 매일 10분 독서하기', '✍️ 배운 내용 정리하는 습관', '🔄 복습 주기 만들기'],
      medium: ['🎓 온라인 강의로 새로운 분야 배우기', '📝 경험 일기 쓰기', '🤓 관심 분야 깊이 파고들기'],
      high: ['🎯 배운 것을 가르쳐보기', '📊 지식 체계화하기'],
    },
    Network: {
      low: ['👋 먼저 인사하기', '👂 경청 연습하기', '💬 하루 한 명과 의미있는 대화'],
      medium: ['🤝 그룹 활동 참여하기', '💌 안부 연락 주기적으로', '🎭 타인 입장에서 생각해보기'],
      high: ['👥 깊은 관계 만들기', '🌐 네트워킹 확장'],
    },
    Battery: {
      low: ['😴 규칙적인 수면 패턴', '🚶 가벼운 산책이나 스트레칭', '💧 물 충분히 마시기'],
      medium: ['🏃 주 3회 운동하기', '🥗 영양 균형 잡힌 식사', '😌 충분한 휴식 시간'],
      high: ['💪 체력 향상 운동', '⚡ 에너지 최적화'],
    },
    Security: {
      low: ['🧘 하루 5분 명상', '📔 감정 일기 쓰기', '🤗 긍정적인 셀프토크'],
      medium: ['😊 스트레스 해소 취미 만들기', '💆 정기적인 휴식', '🎯 자기 긍정 확인'],
      high: ['🌟 자존감 유지하기', '🛡️ 심리적 안정 지속'],
    },
    System: {
      low: ['⏰ 기상 시간 고정하기', '✅ 작은 목표부터 달성', '📅 루틴 하나 만들기'],
      medium: ['🎯 주간 계획 세우기', '📊 목표 진행도 체크', '🔄 루틴 확장하기'],
      high: ['🚀 장기 목표 실행', '⚙️ 시스템 최적화'],
    },
  };

  const level = score < 40 ? 'low' : score < 70 ? 'medium' : 'high';
  return tips[category]?.[level] || [];
};

// 간단한 점수 표시 컴포넌트
const ScoreBar = ({ label, score, emoji }: { label: string; score: number; emoji: string }) => {
  const getColor = (score: number) => {
    if (score >= 85) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-blue-500 to-cyan-500';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    if (score >= 30) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getStatus = (score: number) => {
    if (score >= 85) return '우수';
    if (score >= 70) return '양호';
    if (score >= 50) return '보통';
    if (score >= 30) return '개선필요';
    return '주의필요';
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className="text-white font-bold">{label}</span>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black font-mono bg-gradient-to-r ${getColor(score)} bg-clip-text text-transparent`}>
            {Math.round(score)}
          </div>
          <div className="text-xs text-slate-400">{getStatus(score)}</div>
        </div>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor(score)} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

// 메인 컴포넌트
export default function LifeOSChecker() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const [showStart, setShowStart] = useState(true);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, number> = {
      RAM: 0,
      CPU: 0,
      GPU: 0,
      Storage: 0,
      Network: 0,
      Battery: 0,
      Security: 0,
      System: 0,
    };

    const categoryCounts: Record<string, number> = {
      RAM: 0,
      CPU: 0,
      GPU: 0,
      Storage: 0,
      Network: 0,
      Battery: 0,
      Security: 0,
      System: 0,
    };

    questions.forEach((q, idx) => {
      categoryScores[q.category] += answers[idx];
      categoryCounts[q.category]++;
    });

    // 0-100 스케일로 정규화
    const normalizedScores: Record<string, number> = {};
    Object.keys(categoryScores).forEach(cat => {
      normalizedScores[cat] = (categoryScores[cat] / (categoryCounts[cat] * 4)) * 100;
    });

    const avgScore = Object.values(normalizedScores).reduce((a, b) => a + b, 0) / Object.keys(normalizedScores).length;

    return {
      categoryScores: normalizedScores,
      avgScore,
    };
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(-1));
    setShowResult(false);
    setShowStart(true);
  };

  // 시작 화면
  if (showStart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-all group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>돌아가기</span>
          </Link>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>

            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-7xl mb-6">💻</div>
                <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  인생 OS 체커
                </h1>
                <p className="text-xl text-slate-300 mb-6">
                  나의 현재 상태를 간단하게 점검하세요
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-blue-500/30">
                <h3 className="text-white font-bold mb-4 text-center">✨ 8가지 영역 점검</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>🧠</span> 기억력·집중력
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>⚡</span> 사고력·문제해결
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>✨</span> 창의력·상상력
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>📚</span> 학습능력·경험치
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>👥</span> 소통·공감
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>🔋</span> 에너지·체력
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>🛡️</span> 감정·자기관리
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>⚙️</span> 생활습관·목표달성
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowStart(false)}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                시작하기 ({questions.length}개 질문)
              </button>

              <div className="mt-6 text-center text-slate-400 text-sm">
                <p>⏱️ 약 2분 소요 • 📊 즉시 결과 확인</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (showResult) {
    const results = calculateResults();

    const getSystemStatus = (score: number) => {
      if (score >= 85) return { text: '우수', color: 'text-green-400', emoji: '🌟' };
      if (score >= 70) return { text: '양호', color: 'text-blue-400', emoji: '😊' };
      if (score >= 50) return { text: '보통', color: 'text-yellow-400', emoji: '🙂' };
      if (score >= 30) return { text: '개선 필요', color: 'text-orange-400', emoji: '😐' };
      return { text: '주의 필요', color: 'text-red-400', emoji: '😟' };
    };

    const status = getSystemStatus(results.avgScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 pb-20">
        <div className="max-w-6xl mx-auto py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-all group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>돌아가기</span>
          </Link>

          {/* 전체 점수 */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-slate-400 mb-3 text-sm">종합 점수</div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-7xl">{status.emoji}</div>
                  <div className={`text-8xl font-black font-mono ${status.color}`}>
                    {Math.round(results.avgScore)}
                  </div>
                </div>
                <div className={`text-2xl font-bold ${status.color} mb-6`}>
                  {status.text}
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden max-w-md mx-auto">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000"
                    style={{ width: `${results.avgScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 영역별 점수 */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                영역별 점수
              </h3>
              <div className="grid gap-4">
                {Object.entries(results.categoryScores).map(([category, score]) => {
                  const info = categoryInfo[category];
                  return (
                    <ScoreBar
                      key={category}
                      label={info.name}
                      score={score}
                      emoji={info.emoji}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 개선 제안 */}
          {Object.entries(results.categoryScores).some(([_, score]) => score < 70) && (
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">💡</span>
                  개선 방법
                </h3>

                <div className="space-y-6">
                  {Object.entries(results.categoryScores)
                    .filter(([_, score]) => score < 70)
                    .map(([category, score]) => {
                      const info = categoryInfo[category];
                      const tips = getImprovementTips(category, score);

                      return (
                        <div key={category} className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-5 border border-white/10">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{info.emoji}</span>
                            <div>
                              <h4 className="text-white font-bold text-lg">{info.name}</h4>
                              <p className="text-slate-400 text-sm">{info.description}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {tips.map((tip, idx) => (
                              <div key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                                <span className="text-blue-400 mt-0.5">▸</span>
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl p-4 border border-blue-500/30">
                  <p className="text-slate-300 text-sm text-center">
                    💪 <strong>작은 변화부터 시작하세요!</strong> 한 번에 1-2가지 영역에 집중하는 것이 효과적입니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative flex gap-4">
              <button
                onClick={resetTest}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
              >
                🔄 재진단하기
              </button>
              <Link
                href="/"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all text-center border border-white/10 hover:border-white/20"
              >
                🏠 홈으로
              </Link>
            </div>
          </div>

          {/* Related Apps */}
          <div className="mt-12">
            <RelatedApps currentAppSlug="life-os-checker" />
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .bg-grid-pattern {
            background-image:
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
      </div>
    );
  }

  // 질문 화면
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-all group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>돌아가기</span>
        </Link>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>

          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* 진행률 */}
            <div className="mb-8">
              <div className="flex justify-between text-white mb-3 font-mono">
                <span className="text-sm">Progress</span>
                <span className="text-sm font-bold">{currentQuestion + 1} / {questions.length}</span>
              </div>
              <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-white/10">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="text-right mt-1 text-slate-400 text-sm font-mono">{Math.round(progress)}%</div>
            </div>

            {/* 질문 */}
            <div className="mb-10">
              <div className="text-6xl mb-6 text-center">{question.emoji}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed text-center">
                {question.question}
              </h2>
            </div>

            {/* 답변 옵션 */}
            <div className="space-y-3">
              {[
                { score: 4, label: '매우 그렇다', gradient: 'from-green-600 to-emerald-600' },
                { score: 3, label: '그렇다', gradient: 'from-blue-600 to-cyan-600' },
                { score: 2, label: '보통이다', gradient: 'from-yellow-600 to-orange-600' },
                { score: 1, label: '아니다', gradient: 'from-orange-600 to-red-600' },
                { score: 0, label: '전혀 아니다', gradient: 'from-red-600 to-pink-600' },
              ].map((option) => (
                <button
                  type="button"
                  key={option.score}
                  onClick={() => handleAnswer(option.score)}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                    answers[currentQuestion] === option.score
                      ? 'scale-105 shadow-2xl'
                      : 'hover:scale-102 hover:shadow-xl'
                  }`}
                >
                  {answers[currentQuestion] === option.score && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-20 blur-xl`}></div>
                  )}
                  <div className={`relative bg-gradient-to-r ${option.gradient} p-5 ${
                    answers[currentQuestion] === option.score ? '' : 'opacity-70 group-hover:opacity-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-lg">{option.label}</span>
                      {answers[currentQuestion] === option.score && (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 네비게이션 */}
            <div className="flex gap-4 mt-8">
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border border-white/10"
                >
                  ← 이전
                </button>
              )}
              {answers[currentQuestion] !== -1 && (
                <button
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    } else {
                      setShowResult(true);
                    }
                  }}
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all"
                >
                  {currentQuestion === questions.length - 1 ? '결과 보기 →' : '다음 →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
