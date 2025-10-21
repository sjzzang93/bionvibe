"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

import AppFooter from "@/app/components/AppFooter";
const TECHNIQUES = {
  pomodoro: {
    name: '뽀모도로',
    work: 25,
    break: 5,
    longBreak: 15,
    cycles: 4,
    description: '25분 집중 + 5분 휴식, 최고 효율의 시간관리법',
    icon: '🍅',
    color: 'red'
  },
  deepWork: {
    name: '딥워크',
    work: 90,
    break: 20,
    longBreak: 30,
    cycles: 2,
    description: '90분 몰입 + 20분 휴식, 창의적 작업에 최적',
    icon: '🧠',
    color: 'purple'
  },
  ultradian: {
    name: '울트라디안',
    work: 52,
    break: 17,
    longBreak: 17,
    cycles: 3,
    description: '52분 집중 + 17분 휴식, 자연스러운 생체 리듬',
    icon: '⚡',
    color: 'yellow'
  },
  short: {
    name: '짧은 집중',
    work: 15,
    break: 3,
    longBreak: 10,
    cycles: 6,
    description: '15분 집중 + 3분 휴식, 빠른 작업 완료',
    icon: '⏱️',
    color: 'blue'
  }
};

export default function FocusTimer() {
  const [technique, setTechnique] = useState<keyof typeof TECHNIQUES>('pomodoro');
  const [phase, setPhase] = useState<'work' | 'break' | 'longBreak' | 'idle'>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTechnique = TECHNIQUES[technique];

  const handlePhaseComplete = useCallback(() => {
    if (phase === 'work') {
      setCompletedCycles(c => c + 1);
      if (currentCycle + 1 >= currentTechnique.cycles) {
        // 장시간 휴식
        setPhase('longBreak');
        setTimeLeft(currentTechnique.longBreak * 60);
        setCurrentCycle(0);
      } else {
        // 짧은 휴식
        setPhase('break');
        setTimeLeft(currentTechnique.break * 60);
        setCurrentCycle(c => c + 1);
      }
      playSound();
    } else {
      // 휴식 끝, 다시 작업
      setPhase('work');
      setTimeLeft(currentTechnique.work * 60);
      playSound();
    }
  }, [phase, currentCycle, currentTechnique]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          if (phase === 'work') {
            setTotalWorkTime(t => t + 1);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, phase, handlePhaseComplete]);

  const playSound = () => {
    // 간단한 알림음 (실제로는 오디오 파일 사용)
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    }
  };

  const startTimer = () => {
    if (phase === 'idle') {
      setPhase('work');
      setTimeLeft(currentTechnique.work * 60);
      setCurrentCycle(0);
      setCompletedCycles(0);
      setTotalWorkTime(0);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPhase('idle');
    setTimeLeft(0);
    setCurrentCycle(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const getProgress = (): number => {
    const totalTime = phase === 'work' ? currentTechnique.work * 60 :
                     phase === 'longBreak' ? currentTechnique.longBreak * 60 :
                     currentTechnique.break * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const phaseColor = phase === 'work' ? 'from-red-500 to-orange-500' :
                     phase === 'longBreak' ? 'from-green-500 to-emerald-500' :
                     phase === 'break' ? 'from-blue-500 to-cyan-500' :
                     'from-gray-500 to-gray-600';

  const phaseName = phase === 'work' ? '집중 시간' :
                   phase === 'longBreak' ? '긴 휴식' :
                   phase === 'break' ? '짧은 휴식' :
                   '대기 중';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="mx-auto max-w-[600px] px-4 py-6">
        <div className="mb-4">
          
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-6">
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">⏰</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">집중력 타이머</h2>
            <p className="text-gray-600">과학적 시간관리로 생산성 극대화</p>
          </header>

          {/* 기법 선택 */}
          {phase === 'idle' && (
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-3">집중 기법 선택</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(TECHNIQUES).map(([key, tech]) => (
                  <button
                    key={key}
                    onClick={() => setTechnique(key as keyof typeof TECHNIQUES)}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      technique === key
                        ? `bg-gradient-to-br from-${tech.color}-50 to-${tech.color}-100 border-${tech.color}-400 shadow-lg`
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{tech.icon}</div>
                    <div className="font-bold text-gray-800 mb-1">{tech.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{tech.work}분 + {tech.break}분</div>
                    <div className="text-xs text-gray-500">{tech.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 타이머 */}
          <div className="mb-6">
            <div className={`p-8 rounded-2xl bg-gradient-to-br ${phaseColor} text-white shadow-2xl`}>
              <div className="text-center mb-4">
                <div className="text-xl font-semibold mb-2 opacity-90">{phaseName}</div>
                <div className="text-7xl font-bold tracking-tight mb-4">
                  {phase === 'idle' ? formatTime(currentTechnique.work * 60) : formatTime(timeLeft)}
                </div>
                {phase !== 'idle' && (
                  <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-1000"
                      style={{ width: `${getProgress()}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {phase !== 'idle' && (
                <div className="text-center text-sm opacity-90">
                  <div className="mb-1">사이클: {currentCycle + 1} / {currentTechnique.cycles}</div>
                  <div>완료한 집중: {completedCycles}회</div>
                </div>
              )}
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="col-span-2 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {phase === 'idle' ? '시작' : '재개'}
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="col-span-2 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                일시정지
              </button>
            )}
            <button
              onClick={resetTimer}
              className="py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              초기화
            </button>
          </div>

          {/* 통계 */}
          {totalWorkTime > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">📊 오늘의 집중력</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600 mb-1">총 집중</div>
                  <div className="text-xl font-bold text-black">{formatTotalTime(totalWorkTime)}</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600 mb-1">완료</div>
                  <div className="text-xl font-bold text-black">{completedCycles}회</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600 mb-1">생산성</div>
                  <div className="text-xl font-bold text-black">
                    {totalWorkTime > 60 ? Math.round((completedCycles / (totalWorkTime / 60)) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 집중력 향상 팁 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-lg text-gray-800 mb-3">💡 집중력 향상 팁</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="bg-white rounded p-3">
                <span className="font-semibold">🎯 단일 작업:</span> 멀티태스킹 금지, 한 번에 하나만
              </div>
              <div className="bg-white rounded p-3">
                <span className="font-semibold">📵 방해 요소 차단:</span> 알림 끄기, 조용한 환경
              </div>
              <div className="bg-white rounded p-3">
                <span className="font-semibold">💧 수분 섭취:</span> 물 마시기, 뇌 활성화
              </div>
              <div className="bg-white rounded p-3">
                <span className="font-semibold">🧘 짧은 스트레칭:</span> 휴식 시간 활용
              </div>
              <div className="bg-white rounded p-3">
                <span className="font-semibold">🎵 백색소음:</span> 커피숍 소리, 빗소리 추천
              </div>
            </div>
          </div>

          {/* 기법별 장점 */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
            <h3 className="font-bold text-lg text-gray-800 mb-3">⚡ 기법별 추천 용도</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-white rounded p-2">
                <span className="font-semibold">🍅 뽀모도로:</span> 사무 업무, 공부, 일반 작업
              </div>
              <div className="bg-white rounded p-2">
                <span className="font-semibold">🧠 딥워크:</span> 프로그래밍, 글쓰기, 창의적 작업
              </div>
              <div className="bg-white rounded p-2">
                <span className="font-semibold">⚡ 울트라디안:</span> 자연스러운 리듬, 장시간 작업
              </div>
              <div className="bg-white rounded p-2">
                <span className="font-semibold">⏱️ 짧은 집중:</span> 빠른 업무, 가벼운 작업
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-gray-800 mb-3">🧠 집중력의 과학</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
              <div className="font-semibold text-black mb-1">뇌파 알파파 (8-13Hz)</div>
              <div className="text-black">편안하고 집중된 상태, 학습 최적</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="font-semibold text-black mb-1">뇌파 베타파 (13-30Hz)</div>
              <div className="text-black">적극적 사고, 문제 해결 상태</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-50 rounded-lg">
              <div className="font-semibold text-black mb-1">울트라디안 리듬</div>
              <div className="text-black">90-120분 주기의 자연스러운 집중 사이클</div>
            </div>
          </div>
        </div>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}

