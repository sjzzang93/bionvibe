"use client";

import { useState, useRef, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

export default function ReflexTest() {
  const [testMode, setTestMode] = useState<'menu' | 'ready' | 'wait' | 'click' | 'result'>('menu');
  const [currentRound, setCurrentRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_ROUNDS = 10;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTest = () => {
    setTestMode('ready');
    setCurrentRound(1);
    setReactionTimes([]);
    setTooEarly(false);
    prepareRound();
  };

  const prepareRound = () => {
    setTestMode('wait');
    setTooEarly(false);

    // 1-4초 랜덤 대기
    const waitTime = 1000 + Math.random() * 3000;

    timeoutRef.current = setTimeout(() => {
      setTestMode('click');
      setStartTime(performance.now());
    }, waitTime);
  };

  const handleClick = (e: React.PointerEvent) => {
    e.preventDefault();
    
    if (testMode === 'wait') {
      // 너무 일찍 클릭
      setTooEarly(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => {
        if (currentRound < TOTAL_ROUNDS) {
          prepareRound();
        } else {
          setTestMode('result');
        }
      }, 1000);
    } else if (testMode === 'click') {
      // 반응 시간 측정
      const reactionTime = Math.round(performance.now() - startTime);
      const newTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newTimes);

      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(currentRound + 1);
        setTimeout(() => {
          prepareRound();
        }, 300);
      } else {
        setTestMode('result');
      }
    }
  };

  const calculateStats = () => {
    if (reactionTimes.length === 0) return { avg: 0, best: 0, worst: 0 };

    const avg = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
    const best = Math.min(...reactionTimes);
    const worst = Math.max(...reactionTimes);

    return { avg, best, worst };
  };

  const getGrade = (avg: number) => {
    if (avg === 0) return { grade: '-', text: '데이터 없음', emoji: '😶' };
    if (avg < 200) return { grade: 'S+', text: '천재적!', emoji: '🚀' };
    if (avg < 250) return { grade: 'S', text: '매우 빠름', emoji: '⚡' };
    if (avg < 300) return { grade: 'A', text: '빠름', emoji: '🎯' };
    if (avg < 350) return { grade: 'B', text: '평균 이상', emoji: '👍' };
    if (avg < 400) return { grade: 'C', text: '평균', emoji: '😊' };
    return { grade: 'D', text: '연습 필요', emoji: '🌱' };
  };

  const stats = calculateStats();
  const gradeInfo = getGrade(stats.avg);

  return (
    <PremiumLayout theme="orange">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-200 via-red-200 to-orange-200 bg-clip-text text-transparent">
            ⚡ 반사신경 테스트
          </h1>
          <p className="text-xl text-white/80">당신의 반응 속도를 측정하세요</p>
        </div>

        {/* Menu Screen */}
        {testMode === 'menu' && (
          <PremiumCard hover gradient className="text-center animate-slideUp">
            <div className="text-8xl mb-8 animate-float">⏱️</div>
            <h2 className="text-3xl font-bold text-white mb-6">반사신경을 테스트하세요!</h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              화면이 초록색으로 변하면 최대한 빠르게 클릭하세요!<br />
              총 {TOTAL_ROUNDS}라운드로 진행됩니다.
            </p>
            
            <PremiumButton
              onClick={startTest}
              variant="success"
              size="lg"
              icon="🚀"
              fullWidth
            >
              테스트 시작하기
            </PremiumButton>

            <div className="mt-8 text-white/60 text-sm">
              💡 Tip: 모바일에서는 화면을 터치하세요
            </div>
          </PremiumCard>
        )}

        {/* Test Screen */}
        {(testMode === 'ready' || testMode === 'wait' || testMode === 'click') && (
          <div className="space-y-6 animate-fadeIn">
            {/* Progress */}
            <PremiumCard className="text-center">
              <div className="text-white text-lg font-bold mb-2">
                라운드 {currentRound} / {TOTAL_ROUNDS}
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentRound / TOTAL_ROUNDS) * 100}%` }}
                ></div>
              </div>
            </PremiumCard>

            {/* Click Area */}
            <div
              className="relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 border-4"
              style={{
                height: '400px',
                backgroundColor: testMode === 'click' ? '#10b981' : testMode === 'wait' ? '#dc2626' : '#374151',
                borderColor: testMode === 'click' ? '#10b981' : testMode === 'wait' ? '#dc2626' : '#6b7280',
                boxShadow: testMode === 'click' 
                  ? '0 0 60px rgba(16, 185, 129, 0.6)' 
                  : testMode === 'wait' 
                    ? '0 0 60px rgba(220, 38, 38, 0.6)'
                    : '0 20px 60px rgba(0, 0, 0, 0.5)',
                touchAction: 'none',
              }}
              onPointerDown={handleClick}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {testMode === 'ready' && (
                  <div className="text-center animate-fadeIn">
                    <div className="text-6xl mb-4">🎯</div>
                    <div className="text-white text-3xl font-bold">준비하세요...</div>
                  </div>
                )}
                
                {testMode === 'wait' && !tooEarly && (
                  <div className="text-center animate-fadeIn">
                    <div className="text-6xl mb-4">⏳</div>
                    <div className="text-white text-3xl font-bold">대기 중...</div>
                    <div className="text-white/70 text-lg mt-2">초록색으로 변할 때까지 기다리세요</div>
                  </div>
                )}

                {testMode === 'wait' && tooEarly && (
                  <div className="text-center animate-shake">
                    <div className="text-6xl mb-4">❌</div>
                    <div className="text-white text-3xl font-bold">너무 빨라요!</div>
                    <div className="text-white/70 text-lg mt-2">초록색으로 변할 때까지 기다리세요</div>
                  </div>
                )}

                {testMode === 'click' && (
                  <div className="text-center animate-pulse-fast">
                    <div className="text-8xl mb-4">👆</div>
                    <div className="text-white text-4xl font-bold">지금 클릭!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Result Screen */}
        {testMode === 'result' && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient className="text-center">
              <div className="text-8xl mb-6 animate-bounce-slow">{gradeInfo.emoji}</div>
              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-200 to-red-200 bg-clip-text text-transparent">
                {gradeInfo.grade}
              </div>
              <div className="text-2xl text-white mb-2">{gradeInfo.text}</div>
              <div className="text-white/70">평균 반응 속도</div>
              <div className="text-5xl font-bold text-white mt-2">{stats.avg}ms</div>
            </PremiumCard>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
              <PremiumCard hover className="text-center">
                <div className="text-green-400 text-sm font-bold mb-2">⚡ 최고 기록</div>
                <div className="text-4xl font-bold text-white">{stats.best}ms</div>
              </PremiumCard>

              <PremiumCard hover className="text-center">
                <div className="text-blue-400 text-sm font-bold mb-2">📊 평균 기록</div>
                <div className="text-4xl font-bold text-white">{stats.avg}ms</div>
              </PremiumCard>

              <PremiumCard hover className="text-center">
                <div className="text-orange-400 text-sm font-bold mb-2">🐌 최저 기록</div>
                <div className="text-4xl font-bold text-white">{stats.worst}ms</div>
              </PremiumCard>
            </div>

            <PremiumCard hover>
              <h3 className="text-white font-bold mb-4 text-center">📈 라운드별 기록</h3>
              <div className="space-y-3">
                {reactionTimes.map((time, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="text-white/70 font-bold w-24">Round {idx + 1}</div>
                    <div className="flex-1 bg-white/10 rounded-full h-8 overflow-hidden relative">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((time / 500) * 100, 100)}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{time}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>

            <div className="text-center">
              <PremiumButton
                onClick={() => setTestMode('menu')}
                variant="primary"
                size="lg"
                icon="🔄"
              >
                다시 테스트하기
              </PremiumButton>
            </div>

            {/* Related Apps */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <RelatedApps 
                relatedAppIds={['typing-speed-test', 'eye-test', 'iq-test', 'focus-timer']} 
                currentAppId="reflex-test" 
              />
            </div>
          </div>
        )}
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse-fast {
          animation: pulse-fast 0.5s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
