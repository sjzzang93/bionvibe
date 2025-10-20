"use client";

import { useState, useRef, useEffect } from 'react';

export default function ReflexTest() {
  const [testMode, setTestMode] = useState<'menu' | 'ready' | 'wait' | 'click' | 'result'>('menu');
  const [currentRound, setCurrentRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_ROUNDS = 5;

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

  const handleClick = (e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault(); // 기본 동작 방지로 딜레이 제거
    
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
      // 반응 시간 측정 (performance.now()로 더 정확)
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

  const getGrade = (avgTime: number) => {
    if (avgTime < 180) return { grade: 'S+', color: 'purple', text: '신의 경지! 🔥' };
    if (avgTime < 220) return { grade: 'S', color: 'blue', text: '초인적 반응속도!' };
    if (avgTime < 270) return { grade: 'A+', color: 'green', text: '프로게이머 수준!' };
    if (avgTime < 320) return { grade: 'A', color: 'cyan', text: '매우 빠른 반응!' };
    if (avgTime < 370) return { grade: 'B', color: 'yellow', text: '평균 이상' };
    if (avgTime < 420) return { grade: 'C', color: 'orange', text: '평균 수준' };
    return { grade: 'D', color: 'red', text: '연습이 필요해요' };
  };

  if (testMode === 'result') {
    const stats = calculateStats();
    const gradeInfo = getGrade(stats.avg);

    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">⚡</h1>
              <h2 className="text-2xl font-bold text-gray-800">순발력 테스트 결과</h2>
            </header>

            {/* 등급 */}
            <div className={`mb-6 p-6 rounded-xl text-center border-4 ${
              gradeInfo.color === 'purple' ? 'bg-purple-50 border-purple-400' :
              gradeInfo.color === 'blue' ? 'bg-blue-50 border-blue-400' :
              gradeInfo.color === 'green' ? 'bg-green-50 border-green-400' :
              gradeInfo.color === 'cyan' ? 'bg-cyan-50 border-cyan-400' :
              gradeInfo.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' :
              gradeInfo.color === 'orange' ? 'bg-orange-50 border-orange-400' :
              'bg-red-50 border-red-400'
            }`}>
              <div className="text-7xl font-bold mb-3" style={{
                background: gradeInfo.color === 'purple' ? 'linear-gradient(135deg, #a855f7, #9333ea)' :
                           gradeInfo.color === 'blue' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
                           gradeInfo.color === 'green' ? 'linear-gradient(135deg, #10b981, #059669)' :
                           gradeInfo.color === 'cyan' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' :
                           gradeInfo.color === 'yellow' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                           gradeInfo.color === 'orange' ? 'linear-gradient(135deg, #f97316, #ea580c)' :
                           'linear-gradient(135deg, #ef4444, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {gradeInfo.grade}
              </div>
              <div className="text-xl font-semibold text-gray-700 mb-2">{gradeInfo.text}</div>
              <div className="text-4xl font-bold text-black">{stats.avg}ms</div>
            </div>

            {/* 통계 */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200 text-center">
                <div className="text-sm text-gray-600 mb-1">평균</div>
                <div className="text-2xl font-bold text-black">{stats.avg}</div>
                <div className="text-xs text-gray-500">ms</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 text-center">
                <div className="text-sm text-gray-600 mb-1">최고</div>
                <div className="text-2xl font-bold text-black">{stats.best}</div>
                <div className="text-xs text-gray-500">ms</div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-lg p-4 border border-red-200 text-center">
                <div className="text-sm text-gray-600 mb-1">최저</div>
                <div className="text-2xl font-bold text-black">{stats.worst}</div>
                <div className="text-xs text-gray-500">ms</div>
              </div>
            </div>

            {/* 각 라운드 기록 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">📊 라운드별 기록</h3>
              <div className="space-y-2">
                {reactionTimes.map((time, i) => (
                  <div key={i} className="flex justify-between items-center bg-white rounded p-3">
                    <span className="font-semibold text-gray-700">Round {i + 1}</span>
                    <span className={`font-bold ${
                      time === stats.best ? 'text-black' :
                      time === stats.worst ? 'text-black' :
                      'text-gray-800'
                    }`}>
                      {time}ms {time === stats.best ? '🏆' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 반응속도 비교 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">📈 반응속도 비교</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-white rounded p-3">
                  <div className="flex justify-between">
                    <span>세계 최고 기록</span>
                    <span className="font-bold text-black">120-180ms</span>
                  </div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="flex justify-between">
                    <span>프로 게이머</span>
                    <span className="font-bold text-black">180-250ms</span>
                  </div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="flex justify-between">
                    <span>운동선수</span>
                    <span className="font-bold text-black">250-300ms</span>
                  </div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="flex justify-between">
                    <span>일반 성인 평균</span>
                    <span className="font-bold text-black">300-400ms</span>
                  </div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="flex justify-between">
                    <span>고령자 평균</span>
                    <span className="font-bold text-black">450-550ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 개선 팁 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">💡 순발력 향상 팁</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="bg-white rounded p-3">
                  🎮 반응속도 게임: 꾸준한 연습이 중요
                </div>
                <div className="bg-white rounded p-3">
                  ⚽ 스포츠 활동: 탁구, 배드민턴 추천
                </div>
                <div className="bg-white rounded p-3">
                  ☕ 카페인: 적당량 섭취 시 반응속도 향상
                </div>
                <div className="bg-white rounded p-3">
                  😴 충분한 수면: 피로는 반응속도 저하
                </div>
                <div className="bg-white rounded p-3">
                  🧘 집중력 훈련: 명상, 집중력 게임
                </div>
              </div>
            </div>

            <button
              onClick={() => setTestMode('menu')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              다시 테스트
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8">
            
            <p className="text-xs text-gray-500 text-center px-4">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="mx-auto max-w-[600px] px-4 py-6">
        <div className="mb-4">
          
        </div>

        {testMode === 'menu' ? (
          <section className="bg-white rounded-2xl shadow-xl p-6">
            <header className="text-center mb-6">
              <h1 className="text-4xl font-bold text-black mb-2">⚡</h1>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">순발력 테스트</h2>
              <p className="text-gray-600">당신의 반응속도를 측정하세요</p>
            </header>

            <div className="mb-6 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border-2 border-purple-300">
              <h3 className="font-bold text-black mb-3 text-lg">🎯 테스트 방법</h3>
              <ol className="space-y-2 text-black">
                <li>1. 빨간색 화면이 나타날 때까지 대기</li>
                <li>2. 화면이 초록색으로 바뀌면 즉시 클릭!</li>
                <li>3. 총 5라운드 진행</li>
                <li>4. 너무 일찍 클릭하면 실패!</li>
              </ol>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-black mb-2">📊 반응속도 기준</h3>
              <div className="text-sm text-black space-y-1">
                <div>• 180ms 이하: 신의 경지 (S+)</div>
                <div>• 180-220ms: 초인 (S)</div>
                <div>• 220-270ms: 프로게이머 (A+)</div>
                <div>• 270-320ms: 매우 빠름 (A)</div>
                <div>• 320-370ms: 평균 이상 (B)</div>
                <div>• 370ms 이상: 연습 필요</div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <h3 className="font-bold text-black mb-2">💡 최고 기록 팁</h3>
              <div className="text-sm text-black space-y-1">
                <div>• 집중력을 최대한 유지하세요</div>
                <div>• 마우스/터치를 준비하세요</div>
                <div>• 편안한 자세로 시작하세요</div>
                <div>• 화면만 응시하세요</div>
              </div>
            </div>

            <button
              onClick={startTest}
              className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-2xl rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              시작하기
            </button>
          </section>
        ) : testMode === 'ready' || testMode === 'wait' ? (
          <section 
            onPointerDown={handleClick}
            onTouchStart={handleClick}
            className="bg-red-600 rounded-2xl shadow-xl p-12 cursor-pointer min-h-[500px] flex flex-col items-center justify-center touch-none select-none"
            style={{ touchAction: 'none' }}
          >
            <div className="text-center">
              <h2 className="text-white text-4xl font-bold mb-4">
                {tooEarly ? '너무 빨라요! 😅' : '대기 중...'}
              </h2>
              <p className="text-white text-xl mb-6">
                {tooEarly ? '초록색이 될 때까지 기다리세요' : '초록색으로 바뀌면 클릭!'}
              </p>
              <div className="text-white text-6xl font-bold">
                {currentRound} / {TOTAL_ROUNDS}
              </div>
            </div>
          </section>
        ) : (
          <section 
            onPointerDown={handleClick}
            onTouchStart={handleClick}
            className="bg-green-600 rounded-2xl shadow-xl p-12 cursor-pointer min-h-[500px] flex flex-col items-center justify-center touch-none select-none"
            style={{ touchAction: 'none' }}
          >
            <div className="text-center">
              <h2 className="text-white text-5xl font-bold mb-6 animate-pulse">
                클릭!
              </h2>
              <div className="text-white text-7xl font-bold">
                ⚡
              </div>
            </div>
          </section>
        )}

        {testMode !== 'menu' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setTestMode('menu');
              }}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow hover:shadow-lg transition-all"
            >
              취소
            </button>
          </div>
        )}

        <footer className="mt-6 space-y-3 pb-8">
          
          <p className="text-xs text-gray-500 text-center px-4">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </footer>
      </div>
    </main>
  );
}

