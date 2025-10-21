"use client";

import { useState } from "react";

import AppFooter from "@/app/components/AppFooter";
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
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors">
        <div className="mx-auto max-w-[520px] px-4 py-6">
          {/* 상단 배너 제거됨 */}

          {/* 결과 카드 */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border-2 border-purple-200 dark:border-purple-700">
            <header className="text-center mb-8">
              <div className="text-6xl mb-4">🧠</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent mb-2">
                IQ 테스트 결과
              </h1>
              <p className="text-gray-600 dark:text-gray-400">총 {questions.length}문항 중 {correctCount}문항 정답</p>
            </header>

            {/* IQ 점수 */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/30 rounded-2xl p-8 mb-6 border border-purple-200 dark:border-purple-700">
              <div className="text-center">
                <div className="text-sm text-gray-900 dark:text-gray-200 font-medium mb-2">당신의 IQ는</div>
                <div className={`text-7xl font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent mb-4`}>
                  {iq}
                </div>
                <div className="inline-block bg-white dark:bg-gray-700 rounded-full px-6 py-2 border-2 border-purple-300 dark:border-purple-600 mb-3">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{level.level}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{level.description}</div>
              </div>
            </div>

            {/* IQ 분포도 */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">📊 IQ 분포 기준</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white">
                  <span className="font-medium">140 이상</span>
                  <span className="text-black">천재 (상위 0.4%)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white">
                  <span className="font-medium">130-139</span>
                  <span className="text-black">최우수 (상위 2%)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white">
                  <span className="font-medium">120-129</span>
                  <span className="text-black">우수 (상위 10%)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white">
                  <span className="font-medium">110-119</span>
                  <span className="text-black">평균 상</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white">
                  <span className="font-medium">90-109</span>
                  <span className="text-black">평균 (68%)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white">
                  <span className="font-medium">80-89</span>
                  <span className="text-black">평균 하</span>
                </div>
              </div>
            </div>

            {/* 다시하기 버튼 */}
            <button
              onClick={restart}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🔄 다시 테스트하기
            </button>

            {/* 추천 섹션 제거됨 */}
          </section>

          {/* 하단 배너 */}
        </div>
      </main>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="mx-auto max-w-[520px] px-4 py-6">
        {/* 상단 배너 제거됨 */}

        {/* 문제 카드 */}
        <section className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
          <header className="text-center mb-6">
            <div className="text-5xl mb-3">🧠</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent mb-2">
              초간단 IQ 테스트
            </h1>
            <p className="text-gray-600">총 {questions.length}문항</p>
          </header>

          {/* 진행률 바 */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>문제 {currentQuestion + 1} / {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 문제 */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-2xl p-6 mb-6 border border-purple-200">
              <div className="text-xl font-semibold text-gray-800 text-center whitespace-pre-line">
                {questions[currentQuestion].question}
              </div>
            </div>

            {/* 선택지 */}
            <div className="grid grid-cols-1 gap-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="p-4 text-lg font-medium text-gray-700 bg-white border-2 border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 hover:scale-105"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 하단 배너 제거됨 */}
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}

