"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

const TECHNIQUES = {
  pomodoro: {
    name: '뽀모도로',
    work: 25,
    break: 5,
    icon: '🍅',
    color: 'from-red-500 to-orange-500',
    description: '25분 집중 + 5분 휴식'
  },
  deepWork: {
    name: '딥워크',
    work: 90,
    break: 20,
    icon: '🧠',
    color: 'from-purple-500 to-indigo-500',
    description: '90분 몰입 + 20분 휴식'
  },
  short: {
    name: '짧은 집중',
    work: 15,
    break: 3,
    icon: '⏱️',
    color: 'from-blue-500 to-cyan-500',
    description: '15분 집중 + 3분 휴식'
  }
};

export default function FocusTimer() {
  const [technique, setTechnique] = useState<keyof typeof TECHNIQUES>('pomodoro');
  const [phase, setPhase] = useState<'work' | 'break' | 'idle'>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTechnique = TECHNIQUES[technique];

  const startTimer = () => {
    setPhase('work');
    setTimeLeft(currentTechnique.work * 60);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setPhase('idle');
    setTimeLeft(0);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      if (phase === 'work') {
        setPhase('break');
        setTimeLeft(currentTechnique.break * 60);
      } else {
        setPhase('work');
        setTimeLeft(currentTechnique.work * 60);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, phase, currentTechnique]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = phase !== 'idle' 
    ? ((phase === 'work' ? currentTechnique.work * 60 : currentTechnique.break * 60) - timeLeft) / 
      (phase === 'work' ? currentTechnique.work * 60 : currentTechnique.break * 60) * 100
    : 0;

  return (
    <PremiumLayout theme="purple">
      
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            ⏰ 집중 타이머
          </h1>
          <p className="text-xl text-white/80">효율적인 시간 관리로 생산성 UP!</p>
        </div>

        {/* Technique Selection */}
        {phase === 'idle' && (
          <div className="mb-8 animate-slideUp">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">기법 선택</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {Object.entries(TECHNIQUES).map(([key, tech]) => (
                <button
        type="button"
                  key={key}
                  onClick={() => setTechnique(key as keyof typeof TECHNIQUES)}
                  className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-300 ${
                    technique === key 
                      ? 'scale-105 shadow-2xl' 
                      : 'scale-100 hover:scale-105'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${tech.color.split(' ')[1]}, ${tech.color.split(' ')[3]})`,
                    boxShadow: technique === key 
                      ? `0 20px 40px rgba(0, 0, 0, 0.4)` 
                      : '0 10px 20px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="text-6xl mb-4">{tech.icon}</div>
                  <h3 className="text-white text-2xl font-bold mb-2">{tech.name}</h3>
                  <p className="text-white/80 text-sm">{tech.description}</p>
                  {technique === key && (
                    <div className="absolute top-2 right-2 text-2xl">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timer Display */}
        <PremiumCard hover gradient className="mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="text-center">
            {/* Phase Display */}
            <div className="text-2xl md:text-3xl font-bold text-white mb-6">
              {phase === 'idle' && '시작 준비'}
              {phase === 'work' && '🎯 집중 시간'}
              {phase === 'break' && '☕ 휴식 시간'}
            </div>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={phase === 'work' ? '#a855f7' : '#06b6d4'} />
                    <stop offset="100%" stopColor={phase === 'work' ? '#ec4899' : '#3b82f6'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-5xl md:text-7xl font-bold">
                  {phase === 'idle' ? formatTime(currentTechnique.work * 60) : formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              {phase === 'idle' ? (
                <PremiumButton
                  onClick={startTimer}
                  variant="success"
                  size="lg"
                  icon="▶️"
                  className="w-48"
                >
                  시작하기
                </PremiumButton>
              ) : (
                <>
                  <PremiumButton
                    onClick={() => setIsRunning(!isRunning)}
                    variant="primary"
                    size="lg"
                    icon={isRunning ? '⏸️' : '▶️'}
                  >
                    {isRunning ? '일시정지' : '계속'}
                  </PremiumButton>
                  <PremiumButton
                    onClick={resetTimer}
                    variant="danger"
                    size="lg"
                    icon="⏹️"
                  >
                    중지
                  </PremiumButton>
                </>
              )}
            </div>
          </div>
        </PremiumCard>

        {/* Tips */}
        <PremiumCard className="mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-4 text-white/80 text-sm">
            <div className="flex items-start gap-0 sm:gap-1.5 md:gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-bold mb-1">집중 팁</div>
                <p className="text-xs">• 휴대폰은 멀리 두기</p>
                <p className="text-xs">• 방해 금지 모드 설정</p>
                <p className="text-xs">• 집중할 작업 미리 정하기</p>
              </div>
            </div>
            <div className="flex items-start gap-0 sm:gap-1.5 md:gap-3">
              <span className="text-2xl">☕</span>
              <div>
                <div className="font-bold mb-1">휴식 팁</div>
                <p className="text-xs">• 스트레칭하기</p>
                <p className="text-xs">• 눈 운동하기 (20-20-20 규칙)</p>
                <p className="text-xs">• 물 마시기</p>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* Related Apps */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <RelatedApps currentAppSlug="focus-timer" className="mt-8" />
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
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
    </PremiumLayout>
  );
}
