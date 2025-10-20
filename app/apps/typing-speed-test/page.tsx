'use client';

import { useState, useEffect, useCallback } from 'react';

const koreanTexts = [
  '빠른 갈색 여우가 게으른 개를 뛰어넘습니다',
  '삶이 있는 한 희망은 있다',
  '하늘은 스스로 돕는 자를 돕는다',
];

const englishTexts = [
  'The quick brown fox jumps over the lazy dog',
  'Practice makes perfect',
  'Time is money',
];

export default function TypingSpeedTestPage() {
  const [mode, setMode] = useState<'korean' | 'english'>('korean');
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateNewText = useCallback(() => {
    const texts = mode === 'korean' ? koreanTexts : englishTexts;
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setTargetText(randomText);
  }, [mode]);

  useEffect(() => {
    generateNewText();
  }, [generateNewText]);

  const handleStart = () => {
    setIsStarted(true);
    setStartTime(Date.now());
    setUserInput('');
    setResult(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted || !startTime) return;

    const value = e.target.value;
    setUserInput(value);

    if (value === targetText) {
      calculateResult();
    }
  };

  const calculateResult = () => {
    if (!startTime) return;

    const endTime = Date.now();
    const timeInSeconds = (endTime - startTime) / 1000;
    const wordsTyped = targetText.length / (mode === 'korean' ? 2 : 5);
    const wpm = Math.round((wordsTyped / timeInSeconds) * 60);
    const accuracy = 100;

    const grade =
      wpm >= 60 ? '전문가' :
      wpm >= 45 ? '숙련자' :
      wpm >= 30 ? '중급자' : '초보자';

    setResult({
      wpm,
      accuracy,
      time: timeInSeconds.toFixed(2),
      grade,
    });
    setIsStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
          ⌨️ 타이핑 속도 측정
        </h1>
        <p className="text-center text-blue-100 mb-12">얼마나 빠르게 칠 수 있나요?</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
          {/* 모드 선택 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setMode('korean')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                mode === 'korean'
                  ? 'bg-white text-indigo-600'
                  : 'bg-white/20 text-white'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setMode('english')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                mode === 'english'
                  ? 'bg-white text-indigo-600'
                  : 'bg-white/20 text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* 목표 텍스트 */}
          <div className="bg-white rounded-xl p-8">
            <p className="text-2xl text-gray-800 text-center font-mono">
              {targetText}
            </p>
          </div>

          {/* 입력 */}
          {!result ? (
            <>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder={isStarted ? '여기에 입력하세요...' : '시작 버튼을 누르세요'}
                disabled={!isStarted}
                className="w-full px-6 py-4 rounded-xl text-xl text-center font-mono text-black disabled:bg-gray-200"
                style={{ fontSize: '20px' }}
              />
              {!isStarted && (
                <button
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all"
                >
                  시작하기
                </button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-center text-white">
                <div className="text-6xl mb-4">🏆</div>
                <div className="text-4xl font-bold mb-2">{result.wpm} WPM</div>
                <div className="text-xl">{result.grade}</div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-gray-600 text-sm">속도</div>
                    <div className="text-2xl font-bold text-blue-600">{result.wpm}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">정확도</div>
                    <div className="text-2xl font-bold text-green-600">{result.accuracy}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">시간</div>
                    <div className="text-2xl font-bold text-purple-600">{result.time}초</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  generateNewText();
                  setResult(null);
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold text-xl"
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
