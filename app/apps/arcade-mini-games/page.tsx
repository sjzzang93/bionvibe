'use client';

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';

type GameType = 'home' | 'tictactoe' | 'memory' | 'snake';

export default function MiniArcadePage() {
  const [currentGame, setCurrentGame] = useState<GameType>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 py-8 px-4 transition-colors">
      {/* 홈 화면 */}
      {currentGame === 'home' && (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
            🕹️ 미니 아케이드
          </h1>
          <p className="text-center text-purple-200 mb-12">
            심심할 때 즐기는 간단한 게임들
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            <button
        type="button"
              onClick={() => setCurrentGame('tictactoe')}
              className="bg-gradient-to-br from-red-500 to-pink-600 p-8 rounded sm:rounded-lg md:rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="text-6xl mb-4">⭕❌</div>
              <h3 className="text-2xl font-bold text-white mb-2">틱택토</h3>
              <p className="text-red-100 text-sm">클래식 3목 게임</p>
            </button>

            <button
        type="button"
              onClick={() => setCurrentGame('memory')}
              className="bg-gradient-to-br from-green-500 to-teal-600 p-8 rounded sm:rounded-lg md:rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="text-6xl mb-4">🃏</div>
              <h3 className="text-2xl font-bold text-white mb-2">기억력 게임</h3>
              <p className="text-green-100 text-sm">카드 짝 맞추기</p>
            </button>

            <button
        type="button"
              onClick={() => setCurrentGame('snake')}
              className="bg-gradient-to-br from-yellow-500 to-orange-600 p-8 rounded sm:rounded-lg md:rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="text-6xl mb-4">🐍</div>
              <h3 className="text-2xl font-bold text-white mb-2">스네이크</h3>
              <p className="text-yellow-100 text-sm">클래식 뱀 게임</p>
            </button>
          </div>
        </div>
      )}

      {/* 틱택토 게임 */}
      {currentGame === 'tictactoe' && <TicTacToe onBack={() => setCurrentGame('home')} />}

      {/* 기억력 게임 */}
      {currentGame === 'memory' && <MemoryGame onBack={() => setCurrentGame('home')} />}

      {/* 스네이크 게임 */}
      {currentGame === 'snake' && <SnakeGame onBack={() => setCurrentGame('home')} />}
    </div>
  );
}

// 틱택토 게임
function TicTacToe({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
      [0, 4, 8], [2, 4, 6], // 대각선
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) setWinner(gameWinner);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="max-w-lg mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all"
      >
        ← 돌아가기
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">⭕❌ 틱택토</h2>
        
        {winner && (
          <div className="bg-green-500 text-white text-center py-4 rounded-lg mb-6 text-2xl font-bold">
            🎉 {winner} 승리!
          </div>
        )}
        
        {!winner && board.every(cell => cell !== null) && (
          <div className="bg-yellow-500 text-white text-center py-4 rounded-lg mb-6 text-2xl font-bold">
            무승부!
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((cell, index) => (
            <button
        type="button"
              key={index}
              onClick={() => handleClick(index)}
              className="aspect-square bg-white/90 hover:bg-white rounded-xl text-5xl font-bold flex items-center justify-center transition-all hover:scale-105"
              style={{ minHeight: '80px' }}
            >
              {cell === 'X' && <span className="text-red-500">❌</span>}
              {cell === 'O' && <span className="text-blue-500">⭕</span>}
            </button>
          ))}
        </div>

        <button
        type="button"
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm hover:shadow-lg transition-all"
        >
          다시 시작
        </button>
      </div>
    </div>
  );
}

// 기억력 게임
function MemoryGame({ onBack }: { onBack: () => void }) {
  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🥝', '🍉', '🍒'];
  const [cards] = useState(() => [...emojis, ...emojis].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const resetGame = () => {
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all"
      >
        ← 돌아가기
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-4">🃏 기억력 게임</h2>
        <p className="text-center text-white/80 mb-6">시도 횟수: {moves}</p>

        {matched.length === cards.length && (
          <div className="bg-green-500 text-white text-center py-4 rounded-lg mb-6 text-xl font-bold">
            🎉 완료! {moves}번 만에 성공!
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map((emoji, index) => (
            <button
        type="button"
              key={index}
              onClick={() => handleClick(index)}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all ${
                flipped.includes(index) || matched.includes(index)
                  ? 'bg-white'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105'
              }`}
              style={{ minHeight: '70px' }}
            >
              {(flipped.includes(index) || matched.includes(index)) ? emoji : '🎴'}
            </button>
          ))}
        </div>

        <button
        type="button"
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm hover:shadow-lg transition-all"
        >
          다시 시작
        </button>
      </div>
    </div>
  );
}

// 스네이크 게임
function SnakeGame({ onBack }: { onBack: () => void }) {
  const [snake, setSnake] = useState<{x: number; y: number}[]>([{x: 10, y: 10}]);
  const [food, setFood] = useState({x: 15, y: 15});
  const [direction, setDirection] = useState({x: 1, y: 0});
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(150);

  const GRID_SIZE = 20;

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y
        };

        // 벽 충돌 체크
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // 자기 몸 충돌 체크
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // 음식 먹기
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          });
          // 속도 증가
          setSpeed(s => Math.max(50, s - 5));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [isPlaying, direction, food, gameOver, speed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch(e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({x: 0, y: -1});
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({x: 0, y: 1});
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({x: -1, y: 0});
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({x: 1, y: 0});
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  const startGame = () => {
    setSnake([{x: 10, y: 10}]);
    setFood({x: 15, y: 15});
    setDirection({x: 1, y: 0});
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setSpeed(150);
  };

  const handleDirButton = (dir: {x: number; y: number}) => {
    if (!isPlaying) return;
    if (dir.x !== 0 && direction.x === 0) setDirection(dir);
    if (dir.y !== 0 && direction.y === 0) setDirection(dir);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all"
        style={{ minHeight: '44px' }}
      >
        ← 돌아가기
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-4 md:p-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">🐍 스네이크</h2>
        
        <div className="text-center mb-4">
          <div className="text-xl md:text-2xl font-bold text-yellow-300">점수: {score}</div>
        </div>

        {/* 게임 보드 */}
        <div className="bg-gray-900 rounded-xl p-2 mb-4 mx-auto" style={{ maxWidth: '400px' }}>
          <div 
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              aspectRatio: '1'
            }}
          >
            {Array.from({length: GRID_SIZE * GRID_SIZE}).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              const isSnake = snake.some(s => s.x === x && s.y === y);
              const isHead = snake[0].x === x && snake[0].y === y;
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={idx}
                  className={`aspect-square ${
                    isHead ? 'bg-green-400' :
                    isSnake ? 'bg-green-600' :
                    isFood ? 'bg-red-500' :
                    'bg-gray-800'
                  }`}
                  style={{ border: '0.5px solid rgba(255,255,255,0.05)' }}
                />
              );
            })}
          </div>
        </div>

        {/* 컨트롤 */}
        {!isPlaying ? (
          <button
        type="button"
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm hover:shadow-lg transition-all mb-4"
            style={{ minHeight: '48px' }}
          >
            {gameOver ? `게임 오버! 다시 시작 (점수: ${score})` : '게임 시작'}
          </button>
        ) : (
          <>
            {/* 모바일 방향키 */}
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto mb-4">
              <div />
              <button
        type="button"
                onClick={() => handleDirButton({x: 0, y: -1})}
                className="bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 text-2xl"
                style={{ minHeight: '44px' }}
              >
                ⬆️
              </button>
              <div />
              <button
        type="button"
                onClick={() => handleDirButton({x: -1, y: 0})}
                className="bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 text-2xl"
                style={{ minHeight: '44px' }}
              >
                ⬅️
              </button>
              <div />
              <button
        type="button"
                onClick={() => handleDirButton({x: 1, y: 0})}
                className="bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 text-2xl"
                style={{ minHeight: '44px' }}
              >
                ➡️
              </button>
              <div />
              <button
        type="button"
                onClick={() => handleDirButton({x: 0, y: 1})}
                className="bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 text-2xl"
                style={{ minHeight: '44px' }}
              >
                ⬇️
              </button>
              <div />
            </div>
          </>
        )}

        <p className="text-white/60 text-xs md:text-sm text-center">
          💡 키보드 방향키 또는 버튼으로 조작
        </p>
      </div>
    </div>
  );
}
