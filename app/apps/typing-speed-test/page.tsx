'use client';

import { useState, useEffect, useCallback } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';

const koreanTexts = [
  '빠른 갈색 여우가 게으른 개를 뛰어넘습니다',
  '삶이 있는 한 희망은 있다',
  '하늘은 스스로 돕는 자를 돕는다',
  '노력은 결코 배신하지 않는다',
  '시작이 반이다',
];

const englishTexts = [
  'The quick brown fox jumps over the lazy dog',
  'Practice makes perfect',
  'Time is money',
  'Knowledge is power',
  'Actions speak louder than words',
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
    <PremiumLayout theme="blue">
      <div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          <PremiumHeader 
            icon="⌨️"
            title="타이핑 속도 측정"
            subtitle="얼마나 빠르게 칠 수 있나요?"
            gradient="from-blue-200 via-cyan-200 to-indigo-200"
          />

          <PremiumCard className="max-w-3xl mx-auto" gradient>
            <div className="space-y-6">
              {/* 모드 선택 */}
              <div className="flex gap-4 justify-center">
                {['korean', 'english'].map((m) => (
                  <button
        type="button"
                    key={m}
                    onClick={() => setMode(m as 'korean' | 'english')}
                    className={`px-8 py-4 rounded-xl font-bold transition-all ${
                      mode === m
                        ? 'bg-white text-blue-600 scale-110 shadow-2xl'
                        : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                    }`}
                  >
                    {m === 'korean' ? '한국어' : 'English'}
                  </button>
                ))}
              </div>

              {/* 목표 텍스트 */}
              <div className="bg-white rounded sm:rounded-lg md:rounded-2xl p-8 shadow-xl border-4 border-blue-200">
                <p className="text-3xl text-gray-900 text-center font-mono leading-relaxed">
                  {targetText}
                </p>
              </div>

              {/* 입력 */}
              {!result ? (
                <div className="space-y-6">
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder={isStarted ? '여기에 입력하세요...' : '시작 버튼을 누르세요'}
                    disabled={!isStarted}
                    className={`w-full px-6 py-5 rounded sm:rounded-lg md:rounded-2xl text-2xl text-center font-mono border-4 transition-all ${
                      isStarted 
                        ? 'text-gray-900 bg-white border-green-400 shadow-lg' 
                        : 'text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed'
                    }`}
                    autoFocus={isStarted}
                  />
                  {!isStarted && (
                    <PremiumButton
                      onClick={handleStart}
                      fullWidth
                      size="lg"
                      variant="success"
                    >
                      🚀 시작하기
                    </PremiumButton>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 메인 결과 */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded sm:rounded-lg md:rounded-2xl p-10 text-center text-white shadow-2xl">
                    <div className="text-8xl mb-6 animate-bounce-slow">🏆</div>
                    <div className="text-6xl font-black mb-4">{result.wpm} WPM</div>
                    <div className="text-3xl font-bold bg-white/20 rounded-full px-6 py-2 inline-block">
                      {result.grade}
                    </div>
                  </div>

                  {/* 상세 통계 */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/20 rounded sm:rounded-lg md:rounded-2xl p-6 text-center hover:scale-105 transition-all">
                      <div className="text-white/70 text-sm mb-2">타이핑 속도</div>
                      <div className="text-4xl font-black text-blue-200">{result.wpm}</div>
                      <div className="text-white/60 text-xs mt-1">WPM</div>
                    </div>
                    <div className="bg-white/20 rounded sm:rounded-lg md:rounded-2xl p-6 text-center hover:scale-105 transition-all">
                      <div className="text-white/70 text-sm mb-2">정확도</div>
                      <div className="text-4xl font-black text-green-200">{result.accuracy}%</div>
                      <div className="text-white/60 text-xs mt-1">Perfect!</div>
                    </div>
                    <div className="bg-white/20 rounded sm:rounded-lg md:rounded-2xl p-6 text-center hover:scale-105 transition-all">
                      <div className="text-white/70 text-sm mb-2">소요 시간</div>
                      <div className="text-4xl font-black text-purple-200">{result.time}</div>
                      <div className="text-white/60 text-xs mt-1">초</div>
                    </div>
                  </div>

                  {/* 등급 설명 */}
                  <div className="bg-white/10 rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/20">
                    <h4 className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-lg">📊 타이핑 등급 기준</h4>
                    <div className="space-y-2 text-white/80 text-sm">
                      <div className="flex justify-between">
                        <span>🏆 전문가</span>
                        <span>60 WPM 이상</span>
                      </div>
                      <div className="flex justify-between">
                        <span>⭐ 숙련자</span>
                        <span>45-59 WPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>👍 중급자</span>
                        <span>30-44 WPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🌱 초보자</span>
                        <span>30 WPM 미만</span>
                      </div>
                    </div>
                  </div>

                  <PremiumButton
                    onClick={() => {
                      generateNewText();
                      setResult(null);
                    }}
                    fullWidth
                    size="lg"
                  >
                    🔄 다시 도전
                  </PremiumButton>
                </div>
              )}
            </div>
          </PremiumCard>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
