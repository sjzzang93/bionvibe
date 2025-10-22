"use client";

import { useState } from "react";
import Link from "next/link";
import AppFooter from "@/app/components/AppFooter";
import RelatedApps from "@/app/components/RelatedApps";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: '⬜ ⬛ ⬜ ⬛ ⬜ ? → 다음에 올 도형은?',
    options: ['⬛', '⬜', '🔴', '🟡'],
    correct: 0
  },
  {
    id: 2,
    question: '🍎 🍊 🍎 🍊 🍎 ? → 다음에 올 과일은?',
    options: ['🍎', '🍊', '🍌', '🍇'],
    correct: 1
  },
  {
    id: 3,
    question: '2, 4, 6, 8, ? → 다음 숫자는?',
    options: ['9', '10', '11', '12'],
    correct: 1
  },
  {
    id: 4,
    question: '고양이 : 야옹 = 개 : ?',
    options: ['멍멍', '음메', '꼬끼오', '야옹'],
    correct: 0
  },
  {
    id: 5,
    question: '▲를 180도 돌리면?',
    options: ['▲', '▼', '◀', '▶'],
    correct: 1
  },
  {
    id: 6,
    question: '큰 반대말은?',
    options: ['높은', '작은', '많은', '적은'],
    correct: 1
  },
  {
    id: 7,
    question: '🌞 🌙 🌞 🌙 🌞 ? → 다음은?',
    options: ['🌞', '🌙', '⭐', '☁️'],
    correct: 1
  },
  {
    id: 8,
    question: '1, 2, 4, 8, ? → 다음 숫자는?',
    options: ['12', '14', '16', '18'],
    correct: 2
  },
  {
    id: 9,
    question: '모든 새는 날 수 있다. 펭귄은 새다. 펭귄은 날 수 있다?',
    options: ['맞다', '틀리다', '모르겠다', '가끔'],
    correct: 1
  },
  {
    id: 10,
    question: '🔴 🔵 🔴 🔵 ? → 다음 색은?',
    options: ['🔴', '🔵', '🟡', '🟢'],
    correct: 0
  },
  {
    id: 11,
    question: '5 + 5 = ?',
    options: ['8', '9', '10', '11'],
    correct: 2
  },
  {
    id: 12,
    question: '여름 다음 계절은?',
    options: ['봄', '가을', '겨울', '여름'],
    correct: 1
  },
  {
    id: 13,
    question: '🐶 🐱 🐶 🐱 🐶 ? → 다음은?',
    options: ['🐶', '🐱', '🐭', '🐹'],
    correct: 1
  },
  {
    id: 14,
    question: '10 - 3 = ?',
    options: ['5', '6', '7', '8'],
    correct: 2
  },
  {
    id: 15,
    question: '◼️를 90도 돌리면?',
    options: ['◼️', '◻️', '🔶', '🔷'],
    correct: 0
  },
  {
    id: 16,
    question: '1, 3, 5, 7, ? → 다음은?',
    options: ['8', '9', '10', '11'],
    correct: 1
  },
  {
    id: 17,
    question: '빠른 반대말은?',
    options: ['높은', '낮은', '느린', '작은'],
    correct: 2
  },
  {
    id: 18,
    question: '⭐ ⭐⭐ ⭐⭐⭐ ? → 다음은?',
    options: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'],
    correct: 3
  },
  {
    id: 19,
    question: '3 × 2 = ?',
    options: ['4', '5', '6', '7'],
    correct: 2
  },
  {
    id: 20,
    question: '🌸 🌺 🌸 🌺 🌸 ? → 다음은?',
    options: ['🌸', '🌺', '🌻', '🌹'],
    correct: 1
  }
];

export default function IQTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const [iq, setIQ] = useState(0);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      calculateIQ(newAnswers);
    }
  };

  const calculateIQ = (userAnswers: number[]) => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correct) {
        correctCount++;
      }
    });

    // IQ 계산: 70 ~ 150 범위
    // 20문항 기준: 정답률에 따라 IQ 산출
    const percentage = (correctCount / questions.length) * 100;
    let calculatedIQ = 0;

    if (percentage >= 95) calculatedIQ = 145 + Math.floor(Math.random() * 6); // 145-150
    else if (percentage >= 90) calculatedIQ = 135 + Math.floor(Math.random() * 10); // 135-144
    else if (percentage >= 85) calculatedIQ = 125 + Math.floor(Math.random() * 10); // 125-134
    else if (percentage >= 80) calculatedIQ = 120 + Math.floor(Math.random() * 5); // 120-124
    else if (percentage >= 75) calculatedIQ = 115 + Math.floor(Math.random() * 5); // 115-119
    else if (percentage >= 70) calculatedIQ = 110 + Math.floor(Math.random() * 5); // 110-114
    else if (percentage >= 65) calculatedIQ = 105 + Math.floor(Math.random() * 5); // 105-109
    else if (percentage >= 60) calculatedIQ = 100 + Math.floor(Math.random() * 5); // 100-104
    else if (percentage >= 55) calculatedIQ = 95 + Math.floor(Math.random() * 5); // 95-99
    else if (percentage >= 50) calculatedIQ = 90 + Math.floor(Math.random() * 5); // 90-94
    else if (percentage >= 45) calculatedIQ = 85 + Math.floor(Math.random() * 5); // 85-89
    else if (percentage >= 40) calculatedIQ = 80 + Math.floor(Math.random() * 5); // 80-84
    else if (percentage >= 35) calculatedIQ = 75 + Math.floor(Math.random() * 5); // 75-79
    else calculatedIQ = 70 + Math.floor(Math.random() * 5); // 70-74

    setIQ(calculatedIQ);
    setShowResult(true);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(-1));
    setShowResult(false);
    setIQ(0);
  };

  const getIQLevel = (iq: number): { level: string; description: string; color: string } => {
    if (iq >= 140) return {
      level: '천재',
      description: '상위 0.4% 수준의 뛰어난 지능',
      color: 'from-purple-500 to-purple-500'
    };
    if (iq >= 130) return {
      level: '최우수',
      description: '상위 2% 수준의 매우 우수한 지능',
      color: 'from-blue-500 to-purple-500'
    };
    if (iq >= 120) return {
      level: '우수',
      description: '상위 10% 수준의 우수한 지능',
      color: 'from-green-500 to-blue-500'
    };
    if (iq >= 110) return {
      level: '평균 상',
      description: '평균보다 높은 지능',
      color: 'from-teal-500 to-green-500'
    };
    if (iq >= 90) return {
      level: '평균',
      description: '일반적인 평균 수준의 지능',
      color: 'from-yellow-500 to-teal-500'
    };
    if (iq >= 80) return {
      level: '평균 하',
      description: '평균보다 약간 낮은 지능',
      color: 'from-orange-500 to-yellow-500'
    };
    return {
      level: '기초',
      description: '기초 수준의 지능',
      color: 'from-red-500 to-orange-500'
    };
  };

  if (showResult) {
    const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
    const level = getIQLevel(iq);

    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* 배경 애니메이션 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative mx-auto max-w-[520px] px-4 py-8 sm:py-12">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 mb-6 sm:mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">돌아가기</span>
          </Link>

          {/* 결과 카드 - Glassmorphism + 3D */}
          <section 
            className="relative bg-white/10 dark:bg-white/5 backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20 hover:border-white/30 transition-all duration-500"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(168, 85, 247, 0.3)'
            }}
          >
            {/* 반짝이는 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-3xl sm:rounded-[2rem] pointer-events-none"></div>

            <header className="relative text-center mb-8 sm:mb-10 animate-fadeIn">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce inline-block" 
                   style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.8)' }}>
                🧠
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3 sm:mb-4 drop-shadow-2xl">
                IQ 테스트 결과
              </h1>
              <p className="text-base sm:text-lg text-white/80 font-medium">
                총 {questions.length}문항 중 <span className="text-yellow-300 font-bold">{correctCount}문항</span> 정답
              </p>
            </header>

            {/* IQ 점수 - 메가 3D 카드 */}
            <div 
              className="relative bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 border-2 border-white/30 hover:border-white/50 transition-all duration-500 group"
              style={{
                transform: 'perspective(1000px) translateZ(20px)',
                boxShadow: '0 20px 60px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* 3D 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative text-center">
                <div className="text-sm sm:text-base text-white/90 font-bold mb-3 sm:mb-4 tracking-wider uppercase">당신의 IQ는</div>
                <div 
                  className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r ${level.color} bg-clip-text text-transparent mb-4 sm:mb-6 animate-pulse`}
                  style={{ 
                    textShadow: '0 0 40px rgba(168, 85, 247, 0.8)',
                    filter: 'drop-shadow(0 10px 20px rgba(168, 85, 247, 0.6))'
                  }}
                >
                  {iq}
                </div>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl rounded-full px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/40 mb-3 sm:mb-4 hover:scale-110 transition-transform duration-300"
                     style={{ boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)' }}>
                  <span className="text-xl sm:text-2xl md:text-3xl">✨</span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-white">{level.level}</span>
                  <span className="text-xl sm:text-2xl md:text-3xl">✨</span>
                </div>
                <div className="text-sm sm:text-base text-white/80 font-medium leading-relaxed">
                  {level.description}
                </div>
              </div>
            </div>

            {/* IQ 분포도 - 3D 카드 */}
            <div 
              className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-6 sm:mb-8 border border-white/30 hover:border-white/40 transition-all duration-500"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 15px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              <h3 className="text-lg sm:text-xl font-black text-white mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl">📊</span>
                <span>IQ 분포 기준</span>
              </h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-purple-600/50 to-purple-700/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                     style={{ boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)' }}>
                  <span className="font-bold text-white">140 이상</span>
                  <span className="text-yellow-300 font-bold">천재 (상위 0.4%)</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                     style={{ boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
                  <span className="font-bold text-white">130-139</span>
                  <span className="text-blue-200 font-bold">최우수 (상위 2%)</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-600/50 to-blue-600/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                     style={{ boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }}>
                  <span className="font-bold text-white">120-129</span>
                  <span className="text-green-200 font-bold">우수 (상위 10%)</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-teal-600/50 to-green-600/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                     style={{ boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)' }}>
                  <span className="font-bold text-white">110-119</span>
                  <span className="text-teal-200 font-bold">평균 상</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-yellow-600/50 to-teal-600/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                     style={{ boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)' }}>
                  <span className="font-bold text-white">90-109</span>
                  <span className="text-yellow-200 font-bold">평균 (68%)</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-orange-600/50 to-yellow-600/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                     style={{ boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)' }}>
                  <span className="font-bold text-white">80-89</span>
                  <span className="text-orange-200 font-bold">평균 하</span>
                </div>
              </div>
            </div>

            {/* 다시하기 버튼 - 3D 슈퍼 버튼 */}
            <button
        type="button"
              onClick={restart}
              className="relative w-full py-4 sm:py-5 md:py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-black text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 hover:scale-105 active:scale-95 border-2 border-white/30 group overflow-hidden"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 40px rgba(236, 72, 153, 0.5)'
              }}
            >
              {/* 반짝이는 배경 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span>다시 테스트하기</span>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </section>

          {/* 연관 웹앱 추천 */}
          <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <RelatedApps 
              relatedAppIds={['mbti-test', 'eq-test', 'memory-game', 'brain-teaser', 'concentration-test']} 
              currentAppId="iq-test" 
            />
          </div>
        </div>

        {/* CSS 애니메이션 */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -50px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(50px, 50px) scale(1.05); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </main>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-[520px] px-4 py-8 sm:py-12">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 mb-6 sm:mb-8 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">돌아가기</span>
        </Link>

        {/* 문제 카드 - Glassmorphism + 3D */}
        <section 
          className="relative bg-white/10 backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20 hover:border-white/30 transition-all duration-500"
          style={{
            transform: 'perspective(1000px) rotateX(2deg)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(168, 85, 247, 0.3)'
          }}
        >
          {/* 반짝이는 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-3xl sm:rounded-[2rem] pointer-events-none"></div>

          <header className="relative text-center mb-6 sm:mb-8 animate-fadeIn">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 animate-bounce inline-block"
                 style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.8)' }}>
              🧠
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2 sm:mb-3 drop-shadow-2xl">
              초간단 IQ 테스트
            </h1>
            <p className="text-base sm:text-lg text-white/80 font-medium">총 {questions.length}문항</p>
          </header>

          {/* 진행률 바 - 3D 스타일 */}
          <div className="relative mb-6 sm:mb-8">
            <div className="flex justify-between text-sm sm:text-base text-white/90 mb-2 sm:mb-3 font-bold">
              <span>문제 {currentQuestion + 1} / {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="relative w-full bg-white/10 backdrop-blur-sm rounded-full h-4 sm:h-5 overflow-hidden border border-white/20"
                 style={{ boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)' }}>
              <div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${progress}%`,
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)'
                }}
              >
                {/* 반짝이는 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* 문제 - 3D 카드 */}
          <div className="mb-6 sm:mb-8">
            <div 
              className="relative bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-white/30 hover:border-white/50 transition-all duration-500 group"
              style={{
                transform: 'perspective(1000px) translateZ(20px)',
                boxShadow: '0 20px 60px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative text-xl sm:text-2xl md:text-3xl font-bold text-white text-center whitespace-pre-line leading-relaxed"
                   style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
                {questions[currentQuestion].question}
              </div>
            </div>

            {/* 선택지 - 3D 버튼들 */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
        type="button"
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="relative p-4 sm:p-5 md:p-6 text-base sm:text-lg md:text-xl font-bold text-white bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border-2 border-white/30 rounded-xl sm:rounded-2xl hover:from-purple-500/40 hover:to-pink-500/40 hover:border-white/50 transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden"
                  style={{
                    transform: 'perspective(1000px) translateZ(5px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* 호버 시 반짝이는 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      
      {/* 제작자 서명 */}
      <AppFooter />
    </main>
  );
}
