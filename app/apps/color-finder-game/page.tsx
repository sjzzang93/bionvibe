'use client';

import { useState, useEffect } from 'react';

import RelatedApps from '@/app/components/RelatedApps';
interface GameState {
  level: number;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  gameOver: boolean;
  bestScore: number;
}

export default function ColorFinderGamePage() {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    timeLeft: 30,
    isPlaying: false,
    gameOver: false,
    bestScore: 0,
  });

  const [gridSize, setGridSize] = useState(3); // 3x3부터 시작
  const [targetIndex, setTargetIndex] = useState(0);
  const [baseColor, setBaseColor] = useState({ r: 150, g: 150, b: 150 });

  // 베스트 스코어 로드
  useEffect(() => {
    const saved = localStorage.getItem('colorFinderBestScore');
    if (saved) {
      setGameState((prev) => ({ ...prev, bestScore: parseInt(saved) }));
    }
  }, []);

  // 타이머
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeLeft <= 1) {
            endGame(prev.score);
            return { ...prev, timeLeft: 0, isPlaying: false, gameOver: true };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.isPlaying, gameState.timeLeft]);

  const endGame = (finalScore: number) => {
    if (finalScore > gameState.bestScore) {
      localStorage.setItem('colorFinderBestScore', finalScore.toString());
      setGameState((prev) => ({ ...prev, bestScore: finalScore }));
    }
  };

  const generateColors = () => {
    // 랜덤 베이스 컬러 생성
    const r = Math.floor(Math.random() * 200) + 50;
    const g = Math.floor(Math.random() * 200) + 50;
    const b = Math.floor(Math.random() * 200) + 50;
    setBaseColor({ r, g, b });

    // 타겟 타일 랜덤 선택
    const totalTiles = gridSize * gridSize;
    setTargetIndex(Math.floor(Math.random() * totalTiles));
  };

  const startGame = () => {
    setGameState({
      level: 1,
      score: 0,
      timeLeft: 30,
      isPlaying: true,
      gameOver: false,
      bestScore: gameState.bestScore,
    });
    setGridSize(3);
    generateColors();
  };

  const handleTileClick = (index: number) => {
    if (!gameState.isPlaying) return;

    if (index === targetIndex) {
      // 정답!
      const newScore = gameState.score + gameState.level * 10;
      const newLevel = gameState.level + 1;
      const newGridSize = Math.min(3 + Math.floor(newLevel / 3), 8); // 최대 8x8

      setGameState((prev) => ({
        ...prev,
        score: newScore,
        level: newLevel,
        timeLeft: prev.timeLeft + 2, // 보너스 시간 2초
      }));
      setGridSize(newGridSize);
      generateColors();
    } else {
      // 오답
      setGameState((prev) => ({
        ...prev,
        timeLeft: Math.max(0, prev.timeLeft - 3), // 패널티 -3초
      }));
    }
  };

  const getDifferenceValue = () => {
    // 레벨이 올라갈수록 색 차이가 작아짐
    return Math.max(10, 50 - gameState.level * 2);
  };

  const getTileColor = (index: number) => {
    const diff = getDifferenceValue();
    if (index === targetIndex) {
      // 타겟 타일은 약간 다른 색
      return `rgb(${baseColor.r + diff}, ${baseColor.g + diff}, ${baseColor.b + diff})`;
    }
    return `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
            🎨🔍
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
            색깔 찾기 게임
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-2">
            다른 색깔을 찾아보세요!
          </p>
        </header>

        {!gameState.isPlaying && !gameState.gameOver && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">게임 방법</h2>
            <div className="text-white/90 space-y-3 mb-6 text-left max-w-md mx-auto">
              <p>🎯 <strong>목표:</strong> 미묘하게 다른 색깔을 찾으세요!</p>
              <p>⏱️ <strong>시간:</strong> 30초 시작, 정답 시 +2초</p>
              <p>❌ <strong>패널티:</strong> 오답 시 -3초</p>
              <p>📈 <strong>난이도:</strong> 레벨이 오르면 더 어려워져요!</p>
              <p>🏆 <strong>최고 점수:</strong> {gameState.bestScore}점</p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-2xl text-white text-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 touch-manipulation"
            >
              🎮 게임 시작!
            </button>
          </div>
        )}

        {gameState.gameOver && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="text-6xl mb-4">
              {gameState.score > gameState.bestScore ? '🎉' : '😊'}
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {gameState.score > gameState.bestScore ? '새로운 기록!' : '게임 종료!'}
            </h2>
            <div className="space-y-2 mb-6">
              <p className="text-2xl text-white">최종 점수: <span className="font-bold text-yellow-300">{gameState.score}점</span></p>
              <p className="text-xl text-white/80">최고 레벨: {gameState.level}단계</p>
              <p className="text-xl text-white/80">최고 기록: {gameState.bestScore}점</p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-2xl text-white text-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 touch-manipulation"
            >
              🔄 다시 도전!
            </button>
          </div>
        )}

        {gameState.isPlaying && (
          <>
            {/* 게임 정보 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 text-center">
                <div className="text-sm text-white/70 mb-1">레벨</div>
                <div className="text-3xl font-bold text-white">{gameState.level}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 text-center">
                <div className="text-sm text-white/70 mb-1">점수</div>
                <div className="text-3xl font-bold text-yellow-300">{gameState.score}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 text-center">
                <div className="text-sm text-white/70 mb-1">시간</div>
                <div className={`text-3xl font-bold ${gameState.timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-green-300'}`}>
                  {gameState.timeLeft}s
                </div>
              </div>
            </div>

            {/* 색깔 타일 그리드 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/20 shadow-2xl">
              <div
                className="grid gap-2 sm:gap-3 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  maxWidth: '500px',
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTileClick(index)}
                    className="aspect-square rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl touch-manipulation"
                    style={{
                      backgroundColor: getTileColor(index),
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-white/70 mt-4 text-sm sm:text-base">
                {gridSize}x{gridSize} 그리드 - 다른 색을 찾으세요!
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </main>
  );
}
