'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';


export default function PuzzleGamesPage() {
  const [currentGame, setCurrentGame] = useState<'home' | 'sliding' | 'sudoku' | '2048'>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-8 px-4">
      {/* 애드센스 상단 */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/10 rounded-xl p-4">
          
        </div>
      </div>

      {currentGame === 'home' && <GameHome onSelectGame={setCurrentGame} />}
      {currentGame === 'sliding' && <SlidingPuzzle onBack={() => setCurrentGame('home')} />}
      {currentGame === 'sudoku' && <SudokuGame onBack={() => setCurrentGame('home')} />}
      {currentGame === '2048' && <Game2048 onBack={() => setCurrentGame('home')} />}
    </div>
  );
}

function GameHome({ onSelectGame }: { onSelectGame: (game: 'sliding' | 'sudoku' | '2048') => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
        🧩 퍼즐 게임 모음
      </h1>
      <p className="text-center text-purple-100 mb-12">두뇌를 자극하는 다양한 퍼즐 게임</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => onSelectGame('sliding')}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <div className="text-6xl mb-4">🔢</div>
          <h3 className="text-2xl font-bold text-white mb-2">슬라이딩 퍼즐</h3>
          <p className="text-blue-100 text-sm">숫자를 순서대로</p>
        </button>

        <button
          onClick={() => onSelectGame('sudoku')}
          className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-white mb-2">스도쿠</h3>
          <p className="text-green-100 text-sm">논리 퍼즐</p>
        </button>

        <button
          onClick={() => onSelectGame('2048')}
          className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <div className="text-6xl mb-4">🎲</div>
          <h3 className="text-2xl font-bold text-white mb-2">2048</h3>
          <p className="text-orange-100 text-sm">숫자 합치기</p>
        </button>
      </div>
    </div>
  );
}

function SlidingPuzzle({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<(number | null)[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, null];
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setBoard(shuffled);
    setMoves(0);
  };

  const handleClick = (index: number) => {
    const nullIndex = board.indexOf(null);
    const validMoves = [
      nullIndex - 3, nullIndex + 3, // 위아래
      nullIndex % 3 !== 0 ? nullIndex - 1 : -1, // 왼쪽
      nullIndex % 3 !== 2 ? nullIndex + 1 : -1, // 오른쪽
    ];

    if (validMoves.includes(index)) {
      const newBoard = [...board];
      [newBoard[index], newBoard[nullIndex]] = [newBoard[nullIndex], newBoard[index]];
      setBoard(newBoard);
      setMoves(moves + 1);
    }
  };

  const isWon = board.every((val, idx) => idx === 8 || val === idx + 1);

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="mb-6 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30" style={{ minHeight: "44px" }}>
        ← 돌아가기
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-4">🔢 슬라이딩 퍼즐</h2>
        <p className="text-center text-white/80 mb-6">이동 횟수: {moves}</p>

        {isWon && (
          <div className="bg-green-500 text-white text-center py-4 rounded-lg mb-6">
            🎉 완료! {moves}번 만에 성공!
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm mx-auto">
          {board.map((num, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`aspect-square rounded-xl text-3xl font-bold flex items-center justify-center transition-all ${
                num === null ? 'bg-white/10' : 'bg-white hover:scale-105'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold"
        >
          새 게임
        </button>
      </div>
    </div>
  );
}

// 스도쿠 게임
function SudokuGame({ onBack }: { onBack: () => void }) {
  // 초기 스도쿠 퍼즐 (0은 빈 칸)
  const initialPuzzles = [
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
  ];

  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [board, setBoard] = useState<number[][]>([]);
  const [original, setOriginal] = useState<boolean[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const newGame = useCallback(() => {
    const puzzle = initialPuzzles[puzzleIndex];
    setBoard(puzzle.map(row => [...row]));
    setOriginal(puzzle.map(row => row.map(cell => cell !== 0)));
    setSelected(null);
  }, [puzzleIndex, initialPuzzles]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  const handleCellClick = (row: number, col: number) => {
    if (!original[row][col]) {
      setSelected([row, col]);
    }
  };

  const handleNumberClick = (num: number) => {
    if (selected) {
      const [row, col] = selected;
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = num;
      setBoard(newBoard);
    }
  };

  const handleClear = () => {
    if (selected) {
      const [row, col] = selected;
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = 0;
      setBoard(newBoard);
    }
  };

  const isComplete = () => {
    return board.every(row => row.every(cell => cell !== 0));
  };

  const getCellColor = (row: number, col: number) => {
    if (selected && selected[0] === row && selected[1] === col) {
      return 'bg-blue-300';
    }
    if (original[row][col]) {
      return 'bg-gray-300';
    }
    return 'bg-white';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-6 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30" style={{ minHeight: "44px" }}>
        ← 돌아가기
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">🎯 스도쿠</h2>

        {isComplete() && (
          <div className="bg-green-500 text-white text-center py-4 rounded-lg mb-4">
            🎉 완료! 축하합니다!
          </div>
        )}

        {/* 스도쿠 보드 */}
        <div className="bg-white p-2 rounded-xl mb-6 inline-block mx-auto" style={{ display: 'block', maxWidth: '100%' }}>
          <div className="grid grid-cols-9 gap-0" style={{ aspectRatio: '1/1', maxWidth: '450px', margin: '0 auto' }}>
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  className={`aspect-square flex items-center justify-center font-bold text-lg sm:text-xl border border-gray-400 ${getCellColor(i, j)} ${
                    (i % 3 === 2 && i !== 8) && (j % 3 === 2 && j !== 8) ? 'border-r-2 border-b-2 border-black' :
                    (i % 3 === 2 && i !== 8) ? 'border-b-2 border-black' :
                    (j % 3 === 2 && j !== 8) ? 'border-r-2 border-black' : ''
                  }`}
                  disabled={original[i][j]}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 숫자 버튼 */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
              disabled={!selected}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all"
            disabled={!selected}
          >
            지우기
          </button>
        </div>

        {/* 새 게임 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setPuzzleIndex(0);
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold"
          >
            퍼즐 1
          </button>
          <button
            onClick={() => {
              setPuzzleIndex(1);
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold"
          >
            퍼즐 2
          </button>
        </div>
      </div>
    </div>
  );
}

// 2048 게임
function Game2048({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const newGame = useCallback(() => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, []);

  const addNewTile = (board: number[][]) => {
    const empty: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) empty.push([i, j]);
      }
    }
    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];
      board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = useCallback((direction: string) => {
    if (gameOver) return;

    const newBoard = board.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const moveLeft = (row: number[]) => {
      const filtered = row.filter(x => x !== 0);
      const merged: number[] = [];
      let i = 0;
      while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          i += 2;
        } else {
          merged.push(filtered[i]);
          i++;
        }
      }
      while (merged.length < 4) merged.push(0);
      return merged;
    };

    if (direction === 'ArrowLeft') {
      for (let i = 0; i < 4; i++) {
        const newRow = moveLeft(newBoard[i]);
        if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = newRow;
      }
    } else if (direction === 'ArrowRight') {
      for (let i = 0; i < 4; i++) {
        const reversed = [...newBoard[i]].reverse();
        const newRow = moveLeft(reversed).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = newRow;
      }
    } else if (direction === 'ArrowUp') {
      for (let j = 0; j < 4; j++) {
        const col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const newCol = moveLeft(col);
        if (JSON.stringify(newCol) !== JSON.stringify(col)) moved = true;
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = newCol[i];
        }
      }
    } else if (direction === 'ArrowDown') {
      for (let j = 0; j < 4; j++) {
        const col = [newBoard[3][j], newBoard[2][j], newBoard[1][j], newBoard[0][j]];
        const newCol = moveLeft(col);
        if (JSON.stringify(newCol) !== JSON.stringify(col)) moved = true;
        for (let i = 0; i < 4; i++) {
          newBoard[3 - i][j] = newCol[i];
        }
      }
    }

    if (moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      // 게임 오버 체크
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board, gameOver, score]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const isGameOver = (board: number[][]) => {
    // 빈 칸이 있으면 게임 계속
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
      }
    }
    // 합칠 수 있는 타일이 있으면 게임 계속
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j < 3 && board[i][j] === board[i][j + 1]) return false;
        if (i < 3 && board[i][j] === board[i + 1][j]) return false;
      }
    }
    return true;
  };

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: 'bg-gray-200',
      2: 'bg-yellow-100',
      4: 'bg-yellow-200',
      8: 'bg-orange-300',
      16: 'bg-orange-400',
      32: 'bg-orange-500 text-white',
      64: 'bg-red-400 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-yellow-700 text-white',
      2048: 'bg-yellow-800 text-white',
    };
    return colors[value] || 'bg-black text-white';
  };

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="mb-6 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30" style={{ minHeight: "44px" }}>
        ← 돌아가기
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-4">🎲 2048</h2>
        <p className="text-center text-white/80 mb-6">점수: {score}</p>

        {gameOver && (
          <div className="bg-red-500 text-white text-center py-4 rounded-lg mb-6">
            💀 게임 오버! 점수: {score}
          </div>
        )}

        <div className="bg-gray-300 p-2 rounded-xl mb-6 max-w-sm mx-auto">
          <div className="grid grid-cols-4 gap-2">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-2xl ${getTileColor(cell)}`}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))
            )}
          </div>
        </div>

        <p className="text-white text-center mb-4 text-sm">
          ⌨️ 키보드 화살표 또는 버튼으로 이동
        </p>

        {/* 모바일 컨트롤 */}
        <div className="grid grid-cols-3 gap-2 mb-4 max-w-xs mx-auto">
          <div></div>
          <button
            onClick={() => move('ArrowUp')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => move('ArrowLeft')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg"
          >
            ←
          </button>
          <button
            onClick={() => move('ArrowDown')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg"
          >
            ↓
          </button>
          <button
            onClick={() => move('ArrowRight')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg"
          >
            →
          </button>
        </div>

        <button
          onClick={newGame}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold"
        >
          새 게임
        </button>
      </div>
    </div>
  );
}
