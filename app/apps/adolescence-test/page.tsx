"use client";

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdSenseInArticle from '@/app/components/AdSenseInArticle';
import AdOverlay from '@/app/components/AdOverlay';

type Category = 'physical' | 'emotional' | 'parent' | 'peer' | 'academic' | 'identity' | 'romance' | 'independence';

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
  physical: { name: '신체적 변화', icon: '🧘', description: '2차 성징, 신체 성장' },
  emotional: { name: '정서적 변화', icon: '💭', description: '감정 기복, 우울/불안' },
  parent: { name: '부모 관계', icon: '👨‍👩‍👦', description: '갈등, 독립 욕구' },
  peer: { name: '친구 관계', icon: '👥', description: '또래 압력, 소속감' },
  academic: { name: '학업 스트레스', icon: '📚', description: '성적, 진로 고민' },
  identity: { name: '자아 정체성', icon: '🪞', description: '자기 이해, 가치관' },
  romance: { name: '이성 관심', icon: '💝', description: '연애, 외모 의식' },
  independence: { name: '독립성', icon: '🦅', description: '자율성, 책임감' }
};

const QUESTIONS: Question[] = [
  // 신체적 변화 (4문항)
  { id: 1, category: 'physical', text: '최근 1년간 키나 몸무게가 급격히 변했다' },
  { id: 2, category: 'physical', text: '거울을 보는 횟수가 많아졌다' },
  { id: 3, category: 'physical', text: '내 외모가 마음에 들지 않는다' },
  { id: 4, category: 'physical', text: '갑자기 피곤하거나 나른할 때가 많다' },

  // 정서적 변화 (4문항)
  { id: 5, category: 'emotional', text: '별것 아닌 일에도 쉽게 화가 난다' },
  { id: 6, category: 'emotional', text: '이유 없이 슬프거나 우울할 때가 있다' },
  { id: 7, category: 'emotional', text: '감정 조절이 잘 안 된다' },
  { id: 8, category: 'emotional', text: '작은 일에도 쉽게 짜증이 난다' },

  // 부모 관계 (4문항)
  { id: 9, category: 'parent', text: '부모님과 대화하기가 불편하다' },
  { id: 10, category: 'parent', text: '부모님이 날 이해하지 못한다고 느낀다' },
  { id: 11, category: 'parent', text: '부모님의 간섭이 싫다' },
  { id: 12, category: 'parent', text: '부모님과 자주 다툰다' },

  // 친구 관계 (4문항)
  { id: 13, category: 'peer', text: '친구들이 나를 어떻게 생각하는지 많이 신경 쓴다' },
  { id: 14, category: 'peer', text: '친구들과 어울리지 못할까봐 불안하다' },
  { id: 15, category: 'peer', text: '친구 관계 때문에 스트레스를 받는다' },
  { id: 16, category: 'peer', text: 'SNS나 메신저 확인을 자주 한다' },

  // 학업 스트레스 (4문항)
  { id: 17, category: 'academic', text: '공부 때문에 스트레스를 많이 받는다' },
  { id: 18, category: 'academic', text: '성적이 걱정된다' },
  { id: 19, category: 'academic', text: '미래가 불안하다' },
  { id: 20, category: 'academic', text: '학교 가기 싫을 때가 많다' },

  // 자아 정체성 (4문항)
  { id: 21, category: 'identity', text: '내가 누구인지 잘 모르겠다' },
  { id: 22, category: 'identity', text: '무엇을 좋아하는지 잘 모르겠다' },
  { id: 23, category: 'identity', text: '어떤 사람이 되고 싶은지 고민이 많다' },
  { id: 24, category: 'identity', text: '나만의 생각과 가치관을 찾고 싶다' },

  // 이성 관심 (4문항)
  { id: 25, category: 'romance', text: '이성이 신경 쓰인다' },
  { id: 26, category: 'romance', text: '외모를 꾸미는 데 관심이 많아졌다' },
  { id: 27, category: 'romance', text: '좋아하는 사람이 있다' },
  { id: 28, category: 'romance', text: '연애에 대해 자주 생각한다' },

  // 독립성 (4문항)
  { id: 29, category: 'independence', text: '내 일은 내가 결정하고 싶다' },
  { id: 30, category: 'independence', text: '혼자만의 공간과 시간이 필요하다' },
  { id: 31, category: 'independence', text: '어른 취급받고 싶다' },
  { id: 32, category: 'independence', text: '부모님 허락 없이 하고 싶은 게 많다' },
];

const SCALE_OPTIONS = [
  { value: 1, label: '전혀 그렇지 않다' },
  { value: 2, label: '그렇지 않다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그렇다' },
  { value: 5, label: '매우 그렇다' },
];

type ResultLevel = 'beginning' | 'low' | 'moderate' | 'high' | 'critical';

interface ResultInfo {
  title: string;
  emoji: string;
  description: string;
  advice: string[];
  warning?: string;
  contacts?: { name: string; number: string }[];
  color: string;
}

const RESULTS: Record<ResultLevel, ResultInfo> = {
  beginning: {
    title: '사춘기 준비 단계',
    emoji: '🌱',
    description: '아직 사춘기 초기 단계예요. 신체적, 정서적 변화가 시작되는 시기입니다. 지금은 자연스러운 변화를 이해하고 받아들이는 것이 중요해요.',
    advice: [
      '자신의 변화를 자연스럽게 받아들이기',
      '부모님과 대화 유지하기',
      '건강한 생활습관 만들기'
    ],
    color: 'from-green-400 to-emerald-500'
  },
  low: {
    title: '사춘기 적응 중',
    emoji: '🌿',
    description: '사춘기의 변화를 경험하고 있지만 비교적 잘 적응하고 있어요. 가끔 감정 기복이나 부모님과의 갈등이 있을 수 있지만 정상적인 과정입니다.',
    advice: [
      '감정을 표현하는 건강한 방법 찾기',
      '친구들과 좋은 관계 유지하기',
      '취미 활동으로 스트레스 해소하기'
    ],
    color: 'from-blue-400 to-cyan-500'
  },
  moderate: {
    title: '사춘기 한창 진행 중',
    emoji: '🌊',
    description: '전형적인 사춘기 특징들을 많이 경험하고 있어요. 감정의 기복, 부모님과의 갈등, 자아 정체성 고민이 활발한 시기입니다.',
    advice: [
      '감정을 일기나 그림으로 표현하기',
      '신뢰할 수 있는 어른과 대화하기',
      '규칙적인 운동과 충분한 수면',
      '자신만의 스트레스 해소법 찾기'
    ],
    color: 'from-purple-400 to-indigo-500'
  },
  high: {
    title: '힘든 사춘기 겪는 중',
    emoji: '🌀',
    description: '사춘기의 여러 어려움을 많이 경험하고 있어요. 정서적 부담이 크고, 관계나 학업에서 스트레스가 높은 상태입니다.',
    advice: [
      '부모님이나 선생님께 도움 요청하기',
      '학교 상담실 이용 고려하기',
      '친구들과 감정 나누기',
      '전문가 상담 권장'
    ],
    warning: '🔶 주의 필요',
    contacts: [
      { name: '청소년상담복지센터', number: '1388' },
      { name: '학교 상담실', number: '상담 가능' }
    ],
    color: 'from-orange-400 to-red-500'
  },
  critical: {
    title: '전문적 도움이 필요해요',
    emoji: '🆘',
    description: '현재 매우 힘든 시기를 보내고 있어요. 정서적 어려움이 크고, 일상생활에 지장을 줄 수 있는 수준입니다.',
    advice: [
      '즉시 부모님께 알리기',
      '전문 상담 받기 (필수)',
      '정신건강의학과 방문 고려',
      '혼자 고민하지 않기'
    ],
    warning: '🔴 즉시 도움 필요',
    contacts: [
      { name: '청소년전화', number: '1388' },
      { name: '자살예방상담전화', number: '1393' },
      { name: '정신건강위기상담전화', number: '1577-0199' }
    ],
    color: 'from-red-500 to-pink-600'
  }
};

function getResultLevel(score: number): ResultLevel {
  if (score <= 54) return 'beginning';
  if (score <= 76) return 'low';
  if (score <= 103) return 'moderate';
  if (score <= 128) return 'high';
  return 'critical';
}

const ENCOURAGEMENTS = [
  { at: 8, message: '벌써 1/4 완료! 조금만 더 힘내요! 💪' },
  { at: 16, message: '절반 완료! 잘하고 있어요! 🎉' },
  { at: 24, message: '거의 다 왔어요! 조금만 더! 🚀' },
];

export default function AdolescenceTestPage() {
  const [stage, setStage] = useState<'intro' | 'test' | 'ad' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showEncouragement, setShowEncouragement] = useState(false);

  // 로컬스토리지에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('adolescence-test-progress');
    if (saved) {
      const data = JSON.parse(saved);
      if (confirm('이전 진행 상황을 이어서 하시겠습니까?')) {
        setAnswers(data.answers);
        setCurrentQuestion(data.currentQuestion);
        if (data.stage === 'result') {
          setStage('result');
        } else {
          setStage('test');
        }
      } else {
        localStorage.removeItem('adolescence-test-progress');
      }
    }
  }, []);

  // 진행 상황 저장
  useEffect(() => {
    if (stage !== 'intro') {
      localStorage.setItem('adolescence-test-progress', JSON.stringify({
        stage,
        currentQuestion,
        answers
      }));
    }
  }, [stage, currentQuestion, answers]);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: value };
    setAnswers(newAnswers);

    // 16번 질문 후 광고 보여주기
    if (currentQuestion + 1 === 16) {
      setCurrentQuestion(currentQuestion + 1);
      setStage('ad');
      return;
    }

    // 격려 메시지
    const encouragement = ENCOURAGEMENTS.find(e => e.at === currentQuestion + 1);
    if (encouragement) {
      setShowEncouragement(true);
      setTimeout(() => {
        setShowEncouragement(false);
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setStage('result');
        }
      }, 2000);
    } else {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStage('result');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const categoryScores: Record<Category, number> = {
      physical: 0,
      emotional: 0,
      parent: 0,
      peer: 0,
      academic: 0,
      identity: 0,
      romance: 0,
      independence: 0
    };

    QUESTIONS.forEach(q => {
      if (answers[q.id]) {
        categoryScores[q.category] += answers[q.id];
      }
    });

    return { totalScore, categoryScores };
  };

  const handleRestart = () => {
    setStage('intro');
    setCurrentQuestion(0);
    setAnswers({});
    localStorage.removeItem('adolescence-test-progress');
  };

  // 시작 화면
  if (stage === 'intro') {
    return (
      <PremiumLayout theme="purple">
        <AdOverlay />
        <div className="min-h-screen p-4">
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <PremiumCard className="max-w-2xl w-full text-center space-y-8">
              <div className="space-y-4">
                <div className="text-6xl">🧠</div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  나의 사춘기 지수 체크
                </h1>
                <p className="text-xl text-purple-200">
                  청소년기의 나를 이해하는 첫걸음
                </p>
              </div>

              <div className="flex justify-center gap-8 text-purple-300">
                <div>
                  <div className="text-2xl font-bold text-purple-100">⏱️ 약 5분</div>
                  <div className="text-sm">소요 시간</div>
                </div>
                <div className="w-px bg-purple-500/30"></div>
                <div>
                  <div className="text-2xl font-bold text-purple-100">32개</div>
                  <div className="text-sm">질문</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-purple-100 font-medium">{cat.name}</div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-sm text-purple-200">
                <p className="font-medium mb-2">📋 안내사항</p>
                <ul className="text-left space-y-1 text-xs">
                  <li>• 본 검사는 전문적인 진단 도구가 아니며, 참고용으로만 사용하시기 바랍니다</li>
                  <li>• 심각한 정서적 어려움이 있다면 전문가의 도움을 받으시기 바랍니다</li>
                  <li>• 모든 데이터는 로컬에만 저장되며 외부로 전송되지 않습니다</li>
                </ul>
              </div>

              <PremiumButton onClick={() => setStage('test')} className="w-full py-6 text-lg">
                검사 시작하기 🚀
              </PremiumButton>
            </PremiumCard>
          </div>

          <div className="mt-8 max-w-2xl mx-auto pb-8">
            <RelatedApps currentAppSlug="adolescence-test" />
          </div>
        </div>
      </PremiumLayout>
    );
  }

  // 격려 메시지 화면
  if (showEncouragement) {
    const encouragement = ENCOURAGEMENTS.find(e => e.at === currentQuestion + 1);
    return (
      <PremiumLayout theme="purple">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white">{encouragement?.message}</h2>
          </div>
        </div>
      </PremiumLayout>
    );
  }

  // 광고 화면 (16번 질문 후)
  if (stage === 'ad') {
    return (
      <PremiumLayout theme="purple">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6">
            <PremiumCard className="text-center space-y-6">
              <div className="text-6xl">☕</div>
              <h2 className="text-3xl font-bold text-white">잠깐 쉬어가요!</h2>
              <p className="text-purple-200">
                절반을 완료했어요! 잠시 휴식 후 계속하시겠어요?
              </p>
              <div className="text-sm text-purple-400">
                진행률: 50% (16/32)
              </div>
            </PremiumCard>

            {/* 광고 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <AdSenseInArticle className="min-h-[250px]" />
            </div>

            <PremiumCard>
              <PremiumButton
                onClick={() => setStage('test')}
                className="w-full py-4"
              >
                계속하기 🚀
              </PremiumButton>
            </PremiumCard>
          </div>
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
      <PremiumLayout theme="purple">
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-2xl w-full space-y-4 sm:space-y-6">
            {/* 진행바 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm text-purple-300">
                <span>진행률</span>
                <span className="font-bold">{currentQuestion + 1} / {QUESTIONS.length}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <PremiumCard className="space-y-4 sm:space-y-6">
              {/* 카테고리 */}
              <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-white/10">
                <div className="text-2xl sm:text-3xl">{category.icon}</div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-purple-100">{category.name}</div>
                  <div className="text-xs sm:text-sm text-purple-300">{category.description}</div>
                </div>
              </div>

              {/* 질문 */}
              <div>
                <div className="text-xs sm:text-sm text-purple-400 mb-2">Q{currentQuestion + 1}</div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-6 sm:mb-8 leading-tight">{question.text}</h2>

                {/* 답변 버튼들 */}
                <div className="space-y-2 sm:space-y-3">
                  {SCALE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-left ${
                        answers[question.id] === option.value
                          ? 'border-purple-400 bg-purple-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-purple-200 hover:border-purple-500/50 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          answers[question.id] === option.value
                            ? 'border-purple-400 bg-purple-400'
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
                <PremiumButton
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="secondary"
                  className="flex-1"
                >
                  이전
                </PremiumButton>
                {answers[question.id] && (
                  <PremiumButton
                    onClick={() => handleAnswer(answers[question.id])}
                    className="flex-1"
                  >
                    {currentQuestion === QUESTIONS.length - 1 ? '결과 보기' : '다음'}
                  </PremiumButton>
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
    <PremiumLayout theme="purple">
      <div className="min-h-screen p-3 sm:p-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* 총점 */}
          <PremiumCard className="text-center space-y-4 sm:space-y-6">
            <div className="text-6xl sm:text-7xl md:text-8xl">{result.emoji}</div>
            <div>
              <div className={`text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r ${result.color} bg-clip-text text-transparent mb-2`}>
                {totalScore}점
              </div>
              <div className="text-xs sm:text-sm text-purple-400">총 160점 중</div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{result.title}</h2>
              {result.warning && (
                <div className="inline-block px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 font-bold">
                  {result.warning}
                </div>
              )}
            </div>
            <p className="text-lg text-purple-200 leading-relaxed">
              {result.description}
            </p>
          </PremiumCard>

          {/* 영역별 점수 */}
          <PremiumCard>
            <h3 className="text-2xl font-bold text-white mb-6">📊 영역별 분석</h3>
            <div className="space-y-4">
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const score = categoryScores[key as Category];
                const percentage = (score / 20) * 100;
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-purple-100">{cat.name}</span>
                      </div>
                      <span className="font-bold text-white">{score}/20</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </PremiumCard>

          {/* 조언 */}
          <PremiumCard>
            <h3 className="text-2xl font-bold text-white mb-6">💡 이렇게 해보세요</h3>
            <ul className="space-y-3">
              {result.advice.map((advice, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400"/>
                  </div>
                  <span className="text-purple-100">{advice}</span>
                </li>
              ))}
            </ul>
          </PremiumCard>

          {/* 긴급 연락처 */}
          {result.contacts && (
            <PremiumCard className="bg-red-500/10 border-2 border-red-500/30">
              <h3 className="text-2xl font-bold text-white mb-6">📞 도움이 필요하면 연락하세요</h3>
              <div className="grid gap-4">
                {result.contacts.map((contact, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 rounded-lg p-4">
                    <span className="font-medium text-purple-100">{contact.name}</span>
                    <a href={`tel:${contact.number}`} className="text-2xl font-bold text-red-300 hover:text-red-200">
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
            </PremiumCard>
          )}

          {/* 버튼들 */}
          <div className="flex gap-4">
            <PremiumButton onClick={handleRestart} variant="secondary" className="flex-1">
              다시 검사하기
            </PremiumButton>
            <PremiumButton
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: '나의 사춘기 지수 체크',
                    text: `나의 사춘기 지수: ${totalScore}점 (${result.title})`,
                    url: window.location.href
                  });
                } else {
                  alert('공유 기능은 모바일에서 사용 가능합니다.');
                }
              }}
              className="flex-1"
            >
              결과 공유하기
            </PremiumButton>
          </div>

          <div className="mt-8">
            <RelatedApps currentAppSlug="adolescence-test" />
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
