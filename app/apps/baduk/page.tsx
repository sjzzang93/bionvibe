'use client';

import { useState, useCallback } from 'react';
import AppFooter from '@/app/components/AppFooter';
import Link from 'next/link';

type Stone = 'empty' | 'black' | 'white';
type Board = Stone[][];
type GameMode = 'menu' | 'play' | 'tutorial';

const BOARD_SIZE = 9; // 9x9 바둑판 (초보자용)

export default function BadukPage() {
  const [board, setBoard] = useState<Board>(() => 
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('empty'))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [showRules, setShowRules] = useState(false);
  const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 });
  const [passCount, setPassCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);

  // 연결된 돌 그룹 찾기 (BFS)
  const getGroup = useCallback((board: Board, row: number, col: number): [number, number][] => {
    const color = board[row][col];
    if (color === 'empty') return [];

    const visited = new Set<string>();
    const group: [number, number][] = [];
    const queue: [number, number][] = [[row, col]];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const key = `${r},${c}`;

      if (visited.has(key)) continue;
      visited.add(key);
      group.push([r, c]);

      // 4방향 체크
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 && nr < BOARD_SIZE &&
          nc >= 0 && nc < BOARD_SIZE &&
          board[nr][nc] === color &&
          !visited.has(`${nr},${nc}`)
        ) {
          queue.push([nr, nc]);
        }
      }
    }

    return group;
  }, []);

  // 그룹의 활로(liberty) 개수 계산
  const countLiberties = useCallback((board: Board, group: [number, number][]): number => {
    const liberties = new Set<string>();

    for (const [r, c] of group) {
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 && nr < BOARD_SIZE &&
          nc >= 0 && nc < BOARD_SIZE &&
          board[nr][nc] === 'empty'
        ) {
          liberties.add(`${nr},${nc}`);
        }
      }
    }

    return liberties.size;
  }, []);

  // 따낸 돌 제거
  const removeCapturedStones = useCallback((board: Board, opponent: 'black' | 'white'): number => {
    let captured = 0;
    const newBoard = board.map(row => [...row]);

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (newBoard[i][j] === opponent) {
          const group = getGroup(newBoard, i, j);
          if (countLiberties(newBoard, group) === 0) {
            // 이 그룹을 제거
            for (const [r, c] of group) {
              newBoard[r][c] = 'empty';
              captured++;
            }
          }
        }
      }
    }

    if (captured > 0) {
      setBoard(newBoard);
    }

    return captured;
  }, [getGroup, countLiberties]);

  // 돌 놓기
  const handlePlaceStone = (row: number, col: number) => {
    if (gameOver || board[row][col] !== 'empty') return;

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;

    // 자살수 체크 (활로가 없는 수는 놓을 수 없음)
    const myGroup = getGroup(newBoard, row, col);
    const myLiberties = countLiberties(newBoard, myGroup);

    // 상대 돌을 따낼 수 있는지 체크
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    let willCapture = false;

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (
        nr >= 0 && nr < BOARD_SIZE &&
        nc >= 0 && nc < BOARD_SIZE &&
        newBoard[nr][nc] === opponent
      ) {
        const opponentGroup = getGroup(newBoard, nr, nc);
        if (countLiberties(newBoard, opponentGroup) === 0) {
          willCapture = true;
          break;
        }
      }
    }

    // 자살수는 상대를 따낼 수 있을 때만 허용
    if (myLiberties === 0 && !willCapture) {
      alert('자살수는 놓을 수 없습니다!');
      return;
    }

    setBoard(newBoard);
    setLastMove([row, col]);

    // 상대 돌 따내기
    const captured = removeCapturedStones(newBoard, opponent);
    if (captured > 0) {
      setCapturedStones(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + captured
      }));
    }

    setPassCount(0);
    setCurrentPlayer(opponent);
  };

  // 패스
  const handlePass = () => {
    const newPassCount = passCount + 1;
    setPassCount(newPassCount);

    if (newPassCount >= 2) {
      setGameOver(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  // 게임 리셋
  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('empty')));
    setCurrentPlayer('black');
    setCapturedStones({ black: 0, white: 0 });
    setPassCount(0);
    setGameOver(false);
    setLastMove(null);
  };

  // 메인 메뉴
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-slate-200 p-4 flex flex-col items-center justify-center">
        <Link href="/" className="absolute top-4 left-4 text-gray-600 hover:text-gray-900">
          ← 홈
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">⚫⚪ 바둑</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          동양의 가장 오래된 전략 게임<br/>
          흑과 백이 번갈아 돌을 놓아 영역을 차지합니다
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
            🎮 2인 대전
          </button>

          <button
            onClick={() => {
              setGameMode('tutorial');
              resetGame();
            }}
            className="w-full bg-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-purple-600 transition-colors shadow-lg"
          >
            🎓 튜토리얼 모드
          </button>
        </div>

        {/* 규칙 모달 */}
        {showRules && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-lg max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">📖 바둑 규칙</h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-bold text-lg mb-2">🎯 목표</h3>
                  <p>더 많은 영역을 차지한 쪽이 승리합니다. 영역은 빈 교차점과 잡은 돌의 합으로 계산됩니다.</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">🎮 기본 규칙</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>흑이 먼저 시작합니다</li>
                    <li>돌은 선의 교차점에 놓습니다</li>
                    <li>한 번 놓은 돌은 옮길 수 없습니다</li>
                    <li>활로가 없는 돌은 잡힙니다</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">🔴 활로(氣)</h3>
                  <p className="mb-2">돌이나 돌 그룹에 연결된 빈 교차점입니다.</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>활로가 0이 되면 그 돌은 잡혀서 제거됩니다</li>
                    <li>연결된 같은 색 돌끼리 활로를 공유합니다</li>
                    <li>자살수(활로를 0으로 만드는 수)는 금지됩니다</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">✋ 패스와 종료</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>차례에 돌을 놓지 않고 패스할 수 있습니다</li>
                    <li>양쪽이 연속으로 패스하면 게임이 종료됩니다</li>
                    <li>종료 후 영역을 계산하여 승부를 가립니다</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm">
                    <strong>💡 초보자 팁:</strong> 이 게임은 9x9 간단한 버전입니다. 
                    모서리와 변을 먼저 차지하고, 상대의 돌을 둘러싸서 잡으세요!
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
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-slate-200 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* 상단 UI */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setGameMode('menu')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← 메뉴
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {gameOver 
                ? '게임 종료!' 
                : `${currentPlayer === 'black' ? '⚫' : '⚪'} 차례`
              }
            </h2>
            {passCount === 1 && <p className="text-sm text-orange-600">1회 패스됨</p>}
          </div>

          <button
            onClick={resetGame}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors text-sm sm:text-base"
          >
            다시하기
          </button>
        </div>

        {/* 잡은 돌 표시 */}
        <div className="flex justify-around mb-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl">
          <div className="text-center">
            <div className="text-3xl mb-1">⚫</div>
            <p className="text-sm text-gray-600">잡은 돌</p>
            <p className="text-xl font-bold">{capturedStones.black}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">⚪</div>
            <p className="text-sm text-gray-600">잡은 돌</p>
            <p className="text-xl font-bold">{capturedStones.white}</p>
          </div>
        </div>

        {/* 바둑판 */}
        <div className="bg-amber-700 p-4 rounded-xl shadow-2xl inline-block mx-auto" style={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            className="relative bg-amber-600 p-4"
            style={{ 
              width: 'min(90vw, 600px)',
              height: 'min(90vw, 600px)',
            }}
          >
            {/* 바둑판 선 */}
            <div 
              className="grid gap-0 absolute inset-4"
              style={{ 
                gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
              }}
            >
              {board.map((row, i) => 
                row.map((stone, j) => (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => handlePlaceStone(i, j)}
                    disabled={gameOver}
                    className={`
                      relative border-r border-b border-gray-800/40
                      ${i === 0 ? 'border-t' : ''}
                      ${j === 0 ? 'border-l' : ''}
                      hover:bg-yellow-500/20 transition-colors
                      ${lastMove?.[0] === i && lastMove?.[1] === j ? 'bg-red-500/20' : ''}
                    `}
                  >
                    {stone !== 'empty' && (
                      <div 
                        className={`
                          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[80%] h-[80%] rounded-full shadow-lg
                          ${stone === 'black' 
                            ? 'bg-gradient-to-br from-gray-800 to-black' 
                            : 'bg-gradient-to-br from-white to-gray-200 border-2 border-gray-300'
                          }
                        `}
                      />
                    )}
                    
                    {/* 화점 표시 (9x9에서는 중앙과 모서리에 있음) */}
                    {((i === 2 && j === 2) || (i === 2 && j === 6) || 
                      (i === 6 && j === 2) || (i === 6 && j === 6) ||
                      (i === 4 && j === 4)) && stone === 'empty' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-800" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        {!gameOver && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handlePass}
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg"
            >
              ✋ 패스
            </button>
          </div>
        )}

        {/* 게임 종료 메시지 */}
        {gameOver && (
          <div className="mt-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">🏁 게임 종료!</h3>
            <p className="text-gray-700 mb-4">
              양쪽이 패스했습니다. 영역을 세어 승부를 가리세요!
            </p>
            <div className="flex justify-center gap-8 text-lg">
              <div>
                <p className="text-gray-600">흑이 잡은 돌</p>
                <p className="text-2xl font-bold">{capturedStones.black}</p>
              </div>
              <div>
                <p className="text-gray-600">백이 잡은 돌</p>
                <p className="text-2xl font-bold">{capturedStones.white}</p>
              </div>
            </div>
          </div>
        )}

        {/* 힌트 */}
        {!gameOver && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">💡 바둑 팁</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 모서리와 변이 영역을 만들기 쉽습니다</li>
              <li>• 상대 돌을 완전히 둘러싸면 잡을 수 있습니다</li>
              <li>• 연결을 유지하고 상대의 연결을 끊으세요</li>
              <li>• 활로 1인 돌(단수)은 위험합니다!</li>
            </ul>
          </div>
        )}

      {/* 제작자 서명 */}
      <AppFooter />
      </div>
    </div>
  );
}

