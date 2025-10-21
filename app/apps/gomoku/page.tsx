'use client';

import { useState, useCallback, useEffect } from 'react';
import AppFooter from '@/app/components/AppFooter';
import Link from 'next/link';

type Cell = 'empty' | 'black' | 'white';
type Board = Cell[][];
type GameMode = 'tutorial' | 'play' | 'learn';

const BOARD_SIZE = 15;
const EMPTY: Cell = 'empty';
const BLACK: Cell = 'black';
const WHITE: Cell = 'white';

// AI 난이도
type Difficulty = 'easy' | 'normal' | 'hard';

export default function GomokuPage() {
  const [board, setBoard] = useState<Board>(() => 
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [winner, setWinner] = useState<'black' | 'white' | 'draw' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [aiThinking, setAiThinking] = useState(false);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);

  // 승리 체크
  const checkWinner = useCallback((board: Board, row: number, col: number, player: Cell): boolean => {
    const directions = [
      [0, 1],   // 가로
      [1, 0],   // 세로
      [1, 1],   // 대각선 \
      [1, -1],  // 대각선 /
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      
      // 양방향 체크
      for (let dir = -1; dir <= 1; dir += 2) {
        let r = row + dx * dir;
        let c = col + dy * dir;
        
        while (
          r >= 0 && r < BOARD_SIZE &&
          c >= 0 && c < BOARD_SIZE &&
          board[r][c] === player
        ) {
          count++;
          r += dx * dir;
          c += dy * dir;
        }
      }
      
      if (count >= 5) return true;
    }
    
    return false;
  }, []);

  // AI 이동 (간단한 전략)
  const getAiMove = useCallback((board: Board, difficulty: Difficulty): [number, number] | null => {
    // 빈 칸 찾기
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === EMPTY) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) return null;

    // 쉬움: 랜덤
    if (difficulty === 'easy') {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // 보통/어려움: 전략적 이동
    // 1. 승리 가능한 수 찾기
    for (const [row, col] of emptyCells) {
      const testBoard = board.map(r => [...r]);
      testBoard[row][col] = WHITE;
      if (checkWinner(testBoard, row, col, WHITE)) {
        return [row, col];
      }
    }

    // 2. 상대 막기
    for (const [row, col] of emptyCells) {
      const testBoard = board.map(r => [...r]);
      testBoard[row][col] = BLACK;
      if (checkWinner(testBoard, row, col, BLACK)) {
        return [row, col];
      }
    }

    // 3. 중앙 부근 선호 (어려움 모드)
    if (difficulty === 'hard') {
      const center = Math.floor(BOARD_SIZE / 2);
      emptyCells.sort((a, b) => {
        const distA = Math.abs(a[0] - center) + Math.abs(a[1] - center);
        const distB = Math.abs(b[0] - center) + Math.abs(b[1] - center);
        return distA - distB;
      });
      return emptyCells[0];
    }

    // 4. 랜덤
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }, [checkWinner]);

  // AI 턴 처리
  useEffect(() => {
    if (gameMode === 'play' && currentPlayer === 'white' && !winner && !aiThinking) {
      setAiThinking(true);
      
      setTimeout(() => {
        const move = getAiMove(board, difficulty);
        if (move) {
          handleCellClick(move[0], move[1]);
        }
        setAiThinking(false);
      }, 500);
    }
  }, [currentPlayer, winner, gameMode, board, difficulty, aiThinking]);

  // 셀 클릭 핸들러
  const handleCellClick = (row: number, col: number) => {
    if (winner || board[row][col] !== EMPTY || aiThinking) return;
    if (gameMode === 'play' && currentPlayer === 'white') return; // AI 턴

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setLastMove([row, col]);

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      return;
    }

    // 무승부 체크
    const isFull = newBoard.every(row => row.every(cell => cell !== EMPTY));
    if (isFull) {
      setWinner('draw');
      return;
    }

    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  // 게임 리셋
  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer('black');
    setWinner(null);
    setLastMove(null);
    setAiThinking(false);
  };

  // 메인 메뉴
  if (gameMode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 flex flex-col items-center justify-center">
        <Link href="/" className="absolute top-4 left-4 text-gray-600 hover:text-gray-900">
          ← 홈
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">🔵 오목</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          검은 돌과 흰 돌을 번갈아 놓아 가로, 세로, 대각선으로<br/>
          5개를 먼저 연결하면 승리!
        </p>

        <div className="space-y-4 w-full max-w-md">
          <button
            onClick={() => setShowRules(true)}
            className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            📖 규칙 배우기
          </button>

          <button
            onClick={() => {
              setGameMode('play');
              resetGame();
            }}
            className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            🎮 AI와 대전
          </button>

          <button
            onClick={() => {
              setGameMode('tutorial');
              resetGame();
            }}
            className="w-full bg-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-purple-600 transition-colors shadow-lg"
          >
            👥 2인 대전
          </button>
        </div>

        {/* 규칙 모달 */}
        {showRules && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-lg max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">📖 오목 규칙</h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-bold text-lg mb-2">🎯 목표</h3>
                  <p>가로, 세로, 대각선 중 하나의 방향으로 자신의 돌 5개를 먼저 연결하면 승리!</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">🎮 진행 방법</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>검은 돌(●)이 먼저 시작합니다</li>
                    <li>흰 돌(○)과 번갈아가며 놓습니다</li>
                    <li>한 번 놓은 돌은 옮길 수 없습니다</li>
                    <li>빈 칸 어디든 놓을 수 있습니다</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">💡 전략 팁</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>양쪽이 열린 3개 연결을 만들면 유리합니다</li>
                    <li>상대방의 4개 연결을 막아야 합니다</li>
                    <li>여러 방향으로 동시에 위협하세요</li>
                    <li>중앙 부근이 전략적으로 유리합니다</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm">
                    <strong>금수:</strong> 정식 오목에서는 흑(선공)에게만 3-3, 4-4, 6목 이상의 금수가 있지만, 
                    이 게임에서는 금수 없이 간단하게 즐길 수 있습니다.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRules(false)}
                className="w-full mt-6 bg-gray-800 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-900 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 게임 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* 상단 UI */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setGameMode(null)}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← 메뉴
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {winner 
                ? winner === 'draw' 
                  ? '무승부!' 
                  : `${winner === 'black' ? '●' : '○'} 승리!`
                : `${currentPlayer === 'black' ? '●' : '○'} 차례`
              }
            </h2>
            {aiThinking && (
              <p className="text-sm text-gray-600 mt-1">AI가 생각 중...</p>
            )}
          </div>

          <button
            onClick={resetGame}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors text-sm sm:text-base"
          >
            다시하기
          </button>
        </div>

        {/* 난이도 선택 (AI 모드) */}
        {gameMode === 'play' && !winner && (
          <div className="flex justify-center gap-2 mb-4">
            <span className="text-gray-700 font-medium self-center">난이도:</span>
            {(['easy', 'normal', 'hard'] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  difficulty === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {level === 'easy' ? '쉬움' : level === 'normal' ? '보통' : '어려움'}
              </button>
            ))}
          </div>
        )}

        {/* 오목판 */}
        <div className="bg-amber-200 p-2 sm:p-4 rounded-xl shadow-2xl inline-block mx-auto" style={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            className="grid gap-0 bg-amber-600 p-2"
            style={{ 
              gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              width: 'min(90vw, 600px)',
              height: 'min(90vw, 600px)',
            }}
          >
            {board.map((row, i) => 
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  disabled={winner !== null || aiThinking}
                  className={`
                    border border-gray-800/30 
                    flex items-center justify-center
                    hover:bg-amber-500/30 transition-colors
                    ${lastMove?.[0] === i && lastMove?.[1] === j ? 'ring-2 ring-red-500' : ''}
                  `}
                  style={{ 
                    aspectRatio: '1/1',
                    minHeight: '20px',
                    minWidth: '20px',
                  }}
                >
                  {cell === 'black' && (
                    <div className="w-[80%] h-[80%] rounded-full bg-gradient-to-br from-gray-800 to-black shadow-lg" />
                  )}
                  {cell === 'white' && (
                    <div className="w-[80%] h-[80%] rounded-full bg-gradient-to-br from-white to-gray-200 shadow-lg border border-gray-300" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-2">💡 팁</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 양쪽이 열린 3개 연결(三)을 만들면 거의 승리입니다</li>
            <li>• 상대의 4개 연결은 반드시 막아야 합니다</li>
            <li>• 여러 방향에서 동시에 위협하는 수를 노리세요</li>
          </ul>
        </div>

      {/* 제작자 서명 */}
      <AppFooter />
      </div>
    </div>
  );
}

