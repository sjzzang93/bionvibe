'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import Link from 'next/link';

interface Question {
  id: number;
  question: string;
  part: 'A' | 'B';
  threshold: number; // 문제가 있다고 판단하는 점수 기준
}

// WHO ASRS-v1.1 기반 18개 질문
const questions: Question[] = [
  // Part A: 핵심 증상 (1-6번)
  {
    id: 1,
    question: "일을 마무리하는 데 어려움이 있습니까? (세부사항까지 완료하기 어려움)",
    part: 'A',
    threshold: 2
  },
  {
    id: 2,
    question: "체계적인 일을 할 때 순서대로 하기가 어렵습니까?",
    part: 'A',
    threshold: 2
  },
  {
    id: 3,
    question: "약속이나 해야 할 일을 잊어버린 적이 얼마나 자주 있습니까?",
    part: 'A',
    threshold: 2
  },
  {
    id: 4,
    question: "골치 아픈 일은 피하거나 미루는 경우가 얼마나 자주 있습니까?",
    part: 'A',
    threshold: 2
  },
  {
    id: 5,
    question: "오래 앉아 있어야 할 때 손발을 만지작거리거나 꼼지락거립니까?",
    part: 'A',
    threshold: 3
  },
  {
    id: 6,
    question: "마치 모터가 달린 것처럼 과도하게 활동적이거나 무언가를 하지 않으면 안 될 것 같이 느낍니까?",
    part: 'A',
    threshold: 3
  },

  // Part B: 추가 증상 (7-18번)
  {
    id: 7,
    question: "부주의한 실수를 저지르는 경우가 얼마나 자주 있습니까? (일, 학업 등에서)",
    part: 'B',
    threshold: 3
  },
  {
    id: 8,
    question: "지루하거나 반복적인 일을 할 때 집중력을 유지하기 어렵습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 9,
    question: "누군가 직접 이야기하는데도 듣지 못한 적이 얼마나 자주 있습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 10,
    question: "집이나 직장에서 물건을 잘못 두거나 찾는 데 어려움이 있습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 11,
    question: "주변의 활동이나 소음 때문에 주의가 산만해지는 경우가 얼마나 자주 있습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 12,
    question: "회의나 모임 중에 자리에서 일어나는 경우가 얼마나 자주 있습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 13,
    question: "안절부절 못하거나 침착하지 못하다고 느낍니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 14,
    question: "여가 시간을 편안하게 보내기 어렵습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 15,
    question: "사회적 상황에서 너무 많이 말하는 경우가 있습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 16,
    question: "대화를 할 때 상대방이 말을 끝내기 전에 먼저 말을 끝내는 경우가 있습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 17,
    question: "자신의 차례를 기다리기 어려울 때가 얼마나 자주 있습니까?",
    part: 'B',
    threshold: 3
  },
  {
    id: 18,
    question: "바쁜 사람을 방해하거나 끼어드는 경우가 얼마나 자주 있습니까?",
    part: 'B',
    threshold: 3
  }
];

const answerOptions = [
  { text: "전혀 아님", value: 0, color: "from-green-500 to-emerald-500" },
  { text: "거의 아님", value: 1, color: "from-blue-500 to-cyan-500" },
  { text: "가끔", value: 2, color: "from-yellow-500 to-amber-500" },
  { text: "자주", value: 3, color: "from-orange-500 to-red-500" },
  { text: "매우 자주", value: 4, color: "from-red-500 to-rose-600" }
];

interface ADHDResult {
  partAScore: number;
  partBScore: number;
  totalScore: number;
  partAPositive: number; // Part A에서 threshold 이상인 항목 수
  partBPositive: number; // Part B에서 threshold 이상인 항목 수
  severity: string;
  description: string;
  recommendations: string[];
}

export default function ADHDTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ADHDResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [cardFlip, setCardFlip] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    // 카드 플립 애니메이션
    setCardFlip(true);
    setTimeout(() => {
      setCardFlip(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResult(newAnswers);
      }
    }, 300);
  };

  const calculateResult = (finalAnswers: number[]) => {
    let partAScore = 0;
    let partBScore = 0;
    let partAPositive = 0;
    let partBPositive = 0;

    questions.forEach((question, index) => {
      const answer = finalAnswers[index];

      if (question.part === 'A') {
        partAScore += answer;
        if (answer >= question.threshold) {
          partAPositive++;
        }
      } else {
        partBScore += answer;
        if (answer >= question.threshold) {
          partBPositive++;
        }
      }
    });

    const totalScore = partAScore + partBScore;

    // ASRS 기준: Part A에서 4개 이상이면 ADHD 가능성 높음
    let severity = "";
    let description = "";
    let recommendations: string[] = [];

    if (partAPositive >= 4) {
      severity = "높음";
      description = "ADHD 증상이 나타날 가능성이 높습니다. 전문가의 정확한 진단이 필요합니다.";
      recommendations = [
        "정신건강의학과 전문의 상담을 권장합니다",
        "종합적인 ADHD 검사를 받아보세요",
        "일상생활에서 체계적인 일정 관리가 도움이 될 수 있습니다",
        "충분한 수면과 규칙적인 운동을 실천하세요",
        "스트레스 관리와 마음챙김 명상을 시도해보세요"
      ];
    } else if (partAPositive >= 2 || partBPositive >= 6) {
      severity = "중간";
      description = "일부 ADHD 증상이 나타나고 있습니다. 전문가 상담을 고려해보세요.";
      recommendations = [
        "증상이 일상생활에 지장을 준다면 전문가 상담을 받아보세요",
        "규칙적인 생활 습관을 만들어보세요",
        "할 일 목록과 알림을 적극 활용하세요",
        "한 번에 하나의 일에 집중하는 연습을 하세요",
        "충분한 휴식과 운동을 병행하세요"
      ];
    } else {
      severity = "낮음";
      description = "현재 ADHD 증상은 경미하거나 나타나지 않습니다.";
      recommendations = [
        "현재 상태를 잘 유지하고 있습니다",
        "규칙적인 생활 습관을 계속 유지하세요",
        "스트레스 관리에 신경 쓰세요",
        "증상이 나타나면 조기에 대응하세요",
        "정기적인 자기 점검을 해보세요"
      ];
    }

    setResult({
      partAScore,
      partBScore,
      totalScore,
      partAPositive,
      partBPositive,
      severity,
      description,
      recommendations
    });
    setShowResult(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setShowResult(false);
  };

  if (showResult && result) {
    const severityColor =
      result.severity === "높음" ? "from-red-500 to-rose-600" :
      result.severity === "중간" ? "from-yellow-500 to-orange-500" :
      "from-green-500 to-emerald-500";

    return (
      <PremiumLayout theme="blue">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>돌아가기</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8 md:mb-12 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent px-4">
              🧠 ADHD 검사 결과
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 px-4">WHO ASRS-v1.1 기반 분석 결과</p>
          </div>

          {/* Result Card */}
          <PremiumCard hover gradient className="mb-8 animate-slideUp">
            <div className="text-center mb-8 md:mb-10">
              <div className={`inline-block px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r ${severityColor} text-white text-xl md:text-3xl font-bold mb-6 shadow-lg animate-bounce-slow`}>
                증상 가능성: {result.severity}
              </div>

              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 px-4 leading-relaxed">
                {result.description}
              </p>

              {/* 점수 표시 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border border-blue-400/30">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {result.partAPositive}/6
                  </div>
                  <div className="text-sm md:text-base text-white/80">Part A 양성 항목</div>
                  <div className="text-xs text-white/60 mt-1">(4개 이상 시 주의)</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border border-purple-400/30">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {result.partBPositive}/12
                  </div>
                  <div className="text-sm md:text-base text-white/80">Part B 양성 항목</div>
                  <div className="text-xs text-white/60 mt-1">(6개 이상 시 주의)</div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border border-green-400/30">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {result.totalScore}/72
                  </div>
                  <div className="text-sm md:text-base text-white/80">총점</div>
                  <div className="text-xs text-white/60 mt-1">(Part A + B)</div>
                </div>
              </div>
            </div>

            {/* 권장사항 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10 mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl md:text-3xl">💡</span> 권장사항
              </h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-white/90 group hover:translate-x-2 transition-transform duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-blue-400 text-xl flex-shrink-0 group-hover:scale-125 transition-transform">•</span>
                    <span className="text-sm md:text-base leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 중요 안내 */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border border-amber-400/30 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <div className="text-sm md:text-base text-white/90 leading-relaxed">
                  <strong className="text-amber-300">중요:</strong> 이 검사는 자가 진단 도구이며, 정확한 ADHD 진단은 정신건강의학과 전문의의 종합적인 평가가 필요합니다.
                  검사 결과가 높게 나왔다면 전문가 상담을 받아보시기 바랍니다.
                </div>
              </div>
            </div>

            <div className="text-center">
              <PremiumButton
                onClick={resetTest}
                variant="primary"
                size="lg"
                icon="🔄"
              >
                다시 검사하기
              </PremiumButton>
            </div>
          </PremiumCard>

          {/* Related Apps */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <RelatedApps currentAppSlug="adhd-test" className="mt-8" />
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.05); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }

          .animate-slideUp {
            animation: slideUp 0.8s ease-out forwards;
          }

          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </PremiumLayout>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <PremiumLayout theme="blue">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 mb-8 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>돌아가기</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent px-4">
            🧠 ADHD 자가진단
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 px-4">WHO ASRS-v1.1 성인 ADHD 검사</p>
          <p className="text-sm text-white/60 px-4 mt-2">18문항 • 약 3분 소요</p>
        </div>

        <PremiumCard hover gradient className={`animate-slideUp ${cardFlip ? 'card-flip' : ''}`}>
          {/* Progress Bar */}
          <div className="mb-6 md:mb-10">
            <div className="flex justify-between text-white mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium">문항 {currentQuestion + 1} / {questions.length}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${question.part === 'A' ? 'bg-red-500/30 border border-red-400/50' : 'bg-blue-500/30 border border-blue-400/50'}`}>
                  Part {question.part}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="relative w-full bg-white/10 rounded-full h-3 md:h-4 overflow-hidden backdrop-blur-sm border border-white/20">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8 md:mb-10 px-2">
            <div className="inline-block mb-4">
              <div className="text-5xl md:text-7xl mb-4 animate-float">
                {question.part === 'A' ? '🎯' : '📝'}
              </div>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed">
              {question.question}
            </h2>
            <p className="text-sm text-white/60 mt-4">
              지난 6개월 동안 얼마나 자주 이런 경험을 하셨나요?
            </p>
          </div>

          {/* Options - 5점 척도 */}
          <div className="space-y-3">
            {answerOptions.map((option, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="w-full group relative"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideUp 0.5s ease-out forwards'
                }}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${option.color} rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300`}></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 text-left hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 transform-gpu">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center text-white font-bold text-base md:text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      {option.value}
                    </div>
                    <div className="flex-1">
                      <span className="text-white text-base sm:text-lg md:text-xl font-medium group-hover:translate-x-1 transition-transform duration-300 inline-block">
                        {option.text}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-xs md:text-sm text-white/50">
            0점(전혀 아님)부터 4점(매우 자주)까지 선택해주세요
          </div>
        </PremiumCard>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .card-flip {
          animation: flipOut 0.3s ease-in-out;
        }

        @keyframes flipOut {
          0% { transform: perspective(1000px) rotateY(0deg); }
          100% { transform: perspective(1000px) rotateY(90deg); }
        }
      `}</style>
    </PremiumLayout>
  );
}
