'use client';

import { useState, useEffect } from 'react';
import AppFooter from "@/app/components/AppFooter";
import dynamic from 'next/dynamic';


export default function MultiplicationGamePage() {
  const [mode, setMode] = useState<'menu' | 'practice' | 'speed'>('menu');
  const [level, setLevel] = useState(2);
  const [question, setQuestion] = useState({ a: 0, b: 0 });
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && mode === 'speed' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft, mode]);

  const generateQuestion = () => {
    if (mode === 'practice') {
      setQuestion({ a: level, b: Math.floor(Math.random() * 9) + 1 });
    } else {
      setQuestion({
        a: Math.floor(Math.random() * 9) + 1,
        b: Math.floor(Math.random() * 9) + 1,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswer = parseInt(answer);
    const correct = question.a * question.b;

    if (userAnswer === correct) {
      setScore(score + 1);
    }
    setTotal(total + 1);
    setAnswer('');
    generateQuestion();
  };

  const startSpeedMode = () => {
    setMode('speed');
    setScore(0);
    setTotal(0);
    setTimeLeft(60);
    setIsPlaying(true);
    generateQuestion();
  };

  const startPracticeMode = (selectedLevel: number) => {
    setMode('practice');
    setLevel(selectedLevel);
    setScore(0);
    setTotal(0);
    generateQuestion();
  };

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 py-8 px-4 transition-colors">
        <div className="max-w-4xl mx-auto">
          {/* 애드센스 상단 */}
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            
            {/* 제작자 서명 */}
            <AppFooter />

          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
            ✖️ 구구단 게임
          </h1>
          <p className="text-center text-purple-100 mb-12">재미있게 구구단을 마스터하세요!</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 연습 모드 */}
            <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">📚 연습 모드</h2>
              <p className="text-white/80 text-center mb-6">원하는 단을 선택해서 연습하세요</p>
              <div className="grid grid-cols-3 gap-0 sm:gap-1.5 md:gap-3">
                {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => startPracticeMode(num)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-2xl hover:shadow-lg transition-all hover:scale-105"
                  >
                    {num}단
                  </button>
                ))}
              </div>
            </div>

            {/* 스피드 모드 */}
            <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">⚡ 스피드 모드</h2>
              <p className="text-white/80 text-center mb-6">60초 안에 최대한 많이 맞추세요!</p>
              <div className="flex flex-col items-center">
                <div className="text-6xl mb-6">🏃</div>
                <button
                  onClick={startSpeedMode}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all"
                >
                  시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setMode('menu')}
          className="mb-6 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30"
        >
          ← 메뉴로
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-8">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-white">
              <div className="text-lg">점수</div>
              <div className="text-3xl font-bold">{score}/{total}</div>
            </div>
            {mode === 'speed' && (
              <div className="text-white">
                <div className="text-lg">남은 시간</div>
                <div className="text-3xl font-bold text-yellow-300">{timeLeft}초</div>
              </div>
            )}
            {mode === 'practice' && (
              <div className="text-white">
                <div className="text-3xl font-bold">{level}단 연습</div>
              </div>
            )}
          </div>

          {/* 문제 */}
          {(isPlaying || mode === 'practice') ? (
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded sm:rounded-lg md:rounded-2xl p-12 mb-6">
                <div className="text-center text-6xl font-bold text-gray-800 mb-8">
                  {question.a} × {question.b} = ?
                </div>
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  autoFocus
                  placeholder="정답 입력"
                  className="w-full px-6 py-4 text-center text-4xl font-bold border-4 border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-300"
                  style={{ fontSize: '36px' }}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-xl"
              >
                확인
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>
              <div className="text-white text-3xl font-bold mb-4">게임 종료!</div>
              <div className="text-white text-xl mb-6">
                최종 점수: {score}/{total} ({total > 0 ? Math.round((score / total) * 100) : 0}%)
              </div>
              <button
                onClick={startSpeedMode}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-xl"
              >
                다시 도전
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

