'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type Color = 'white' | 'black';
type Piece = { type: PieceType; color: Color } | null;
type Board = Piece[][];
type GameMode = 'menu' | 'play' | 'learn';

const PIECE_SYMBOLS: Record<Color, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
};

const INITIAL_BOARD: Board = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ],
];

export default function ChessPage() {
  const [board, setBoard] = useState<Board>(() => 
    INITIAL_BOARD.map(row => row.map(piece => piece ? { ...piece } : null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Color>('white');
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<[number, number][]>([]);
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [showRules, setShowRules] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({
    white: [],
    black: []
  });

  // 기물별 이동 가능한 위치 계산
  const getPossibleMoves = useCallback((board: Board, row: number, col: number): [number, number][] => {
    const piece = board[row][col];
    if (!piece || piece.color !== currentPlayer) return [];

    const moves: [number, number][] = [];
    const { type, color } = piece;

    const isValidSquare = (r: number, c: number) => 
      r >= 0 && r < 8 && c >= 0 && c < 8;

    const isEmptyOrEnemy = (r: number, c: number) => {
      if (!isValidSquare(r, c)) return false;
      const target = board[r][c];
      return target === null || target.color !== color;
    };

    switch (type) {
      case 'pawn': {
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;

        // 앞으로 1칸
        if (isValidSquare(row + direction, col) && board[row + direction][col] === null) {
          moves.push([row + direction, col]);

          // 초기 위치에서 2칸
          if (row === startRow && board[row + 2 * direction][col] === null) {
            moves.push([row + 2 * direction, col]);
          }
        }

        // 대각선 공격
        for (const dc of [-1, 1]) {
          const newRow = row + direction;
          const newCol = col + dc;
          if (
            isValidSquare(newRow, newCol) &&
            board[newRow][newCol] !== null &&
            board[newRow][newCol]?.color !== color
          ) {
            moves.push([newRow, newCol]);
          }
        }
        break;
      }

      case 'rook': {
        // 상하좌우
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          let r = row + dr;
          let c = col + dc;
          while (isValidSquare(r, c)) {
            if (board[r][c] === null) {
              moves.push([r, c]);
            } else {
              if (board[r][c]?.color !== color) {
                moves.push([r, c]);
              }
              break;
            }
            r += dr;
            c += dc;
          }
        }
        break;
      }

      case 'bishop': {
        // 대각선
        for (const [dr, dc] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          let r = row + dr;
          let c = col + dc;
          while (isValidSquare(r, c)) {
            if (board[r][c] === null) {
              moves.push([r, c]);
            } else {
              if (board[r][c]?.color !== color) {
                moves.push([r, c]);
              }
              break;
            }
            r += dr;
            c += dc;
          }
        }
        break;
      }

      case 'queen': {
        // 룩 + 비숍
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          let r = row + dr;
          let c = col + dc;
          while (isValidSquare(r, c)) {
            if (board[r][c] === null) {
              moves.push([r, c]);
            } else {
              if (board[r][c]?.color !== color) {
                moves.push([r, c]);
              }
              break;
            }
            r += dr;
            c += dc;
          }
        }
        break;
      }

      case 'knight': {
        // L자 이동
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        for (const [dr, dc] of knightMoves) {
          const r = row + dr;
          const c = col + dc;
          if (isEmptyOrEnemy(r, c)) {
            moves.push([r, c]);
          }
        }
        break;
      }

      case 'king': {
        // 8방향 1칸
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (isEmptyOrEnemy(r, c)) {
              moves.push([r, c]);
            }
          }
        }
        break;
      }
    }

    return moves;
  }, [currentPlayer]);

  // 체스판 클릭 처리
  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];

    // 기물 선택
    if (selectedSquare === null) {
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);
        setPossibleMoves(getPossibleMoves(board, row, col));
      }
      return;
    }

    // 같은 칸 클릭 (선택 취소)
    if (selectedSquare[0] === row && selectedSquare[1] === col) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    // 이동 시도
    const [selectedRow, selectedCol] = selectedSquare;
    const isValidMove = possibleMoves.some(([r, c]) => r === row && c === col);

    if (isValidMove) {
      const newBoard = board.map(row => row.map(piece => piece ? { ...piece } : null));
      const movingPiece = newBoard[selectedRow][selectedCol];
      const capturedPiece = newBoard[row][col];

      // 잡은 기물 기록
      if (capturedPiece) {
        setCapturedPieces(prev => ({
          ...prev,
          [currentPlayer]: [...prev[currentPlayer], capturedPiece]
        }));
      }

      // 이동
      newBoard[row][col] = movingPiece;
      newBoard[selectedRow][selectedCol] = null;

      // 폰 프로모션 (퀸으로 자동 승급)
      if (movingPiece?.type === 'pawn') {
        if ((movingPiece.color === 'white' && row === 0) || 
            (movingPiece.color === 'black' && row === 7)) {
          newBoard[row][col] = { type: 'queen', color: movingPiece.color };
        }
      }

      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else if (piece && piece.color === currentPlayer) {
      // 다른 자신의 기물 선택
      setSelectedSquare([row, col]);
      setPossibleMoves(getPossibleMoves(board, row, col));
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  // 게임 리셋
  const resetGame = () => {
    setBoard(INITIAL_BOARD.map(row => row.map(piece => piece ? { ...piece } : null)));
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setPossibleMoves([]);
    setCapturedPieces({ white: [], black: [] });
  };

  // 메인 메뉴
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 p-4 flex flex-col items-center justify-center">
        <Link href="/" className="absolute top-4 left-4 text-gray-300 hover:text-white">
          ← 홈
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">♔ 체스</h1>
        <p className="text-gray-300 mb-8 text-center max-w-md">
          서양의 고전 전략 게임<br/>
          상대의 킹을 체크메이트하면 승리!
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
              setGameMode('learn');
              resetGame();
            }}
            className="w-full bg-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-purple-600 transition-colors shadow-lg"
          >
            🎓 학습 모드
          </button>
        </div>

        {/* 규칙 모달 */}
        {showRules && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">📖 체스 규칙</h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-bold text-lg mb-2">🎯 목표</h3>
                  <p>상대의 킹을 체크메이트하면 승리합니다. 체크메이트는 킹이 공격받고 있으며 도망갈 수 없는 상태입니다.</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">♟️ 기물 이동</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">♟</span>
                      <div>
                        <strong>폰(Pawn):</strong> 앞으로 1칸, 처음엔 2칸 가능. 대각선으로만 공격. 맨 끝에 도달하면 퀸으로 승급.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">♜</span>
                      <div>
                        <strong>룩(Rook):</strong> 가로/세로 직선으로 원하는 만큼 이동.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">♞</span>
                      <div>
                        <strong>나이트(Knight):</strong> L자 모양 (2칸+1칸). 다른 기물을 뛰어넘을 수 있음.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">♝</span>
                      <div>
                        <strong>비숍(Bishop):</strong> 대각선으로 원하는 만큼 이동.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">♛</span>
                      <div>
                        <strong>퀸(Queen):</strong> 가로/세로/대각선 모든 방향으로 원하는 만큼. 가장 강력한 기물.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">♚</span>
                      <div>
                        <strong>킹(King):</strong> 모든 방향으로 1칸씩. 보호가 최우선.
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">⚔️ 특수 규칙</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>체크:</strong> 킹이 공격받는 상태. 반드시 피해야 함</li>
                    <li><strong>체크메이트:</strong> 체크 상태에서 피할 방법이 없음 → 패배</li>
                    <li><strong>스테일메이트:</strong> 합법적인 수가 없지만 체크 아님 → 무승부</li>
                    <li><strong>캐슬링:</strong> 킹과 룩의 특수 이동 (이 게임에서는 미구현)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm">
                    <strong>💡 초보자 팁:</strong> 
                    중앙을 장악하고, 기물을 발전시키며, 킹을 안전하게 지키세요. 
                    상대의 기물을 공격하기 전에 내 기물이 안전한지 확인하세요!
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* 상단 UI */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setGameMode('menu')}
            className="text-gray-300 hover:text-white font-medium"
          >
            ← 메뉴
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {currentPlayer === 'white' ? '⚪' : '⚫'} 차례
            </h2>
            <p className="text-gray-400 text-sm">
              {currentPlayer === 'white' ? '백' : '흑'}의 턴
            </p>
          </div>

          <button
            onClick={resetGame}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            다시하기
          </button>
        </div>

        {/* 잡은 기물 표시 (흑이 잡은 백 기물) */}
        <div className="mb-2 bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg">
          <p className="text-gray-300 text-sm mb-1">⚫ 흑이 잡은 기물:</p>
          <div className="flex gap-1 flex-wrap text-2xl">
            {capturedPieces.black.length > 0 
              ? capturedPieces.black.map((piece, i) => (
                  <span key={i}>{PIECE_SYMBOLS[piece!.color][piece!.type]}</span>
                ))
              : <span className="text-gray-500 text-sm">없음</span>
            }
          </div>
        </div>

        {/* 체스판 */}
        <div className="inline-block mx-auto bg-gray-800 p-2 sm:p-4 rounded-xl shadow-2xl" style={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            className="grid grid-cols-8 gap-0"
            style={{ 
              width: 'min(90vw, 600px)',
              height: 'min(90vw, 600px)',
            }}
          >
            {board.map((row, i) => 
              row.map((piece, j) => {
                const isLight = (i + j) % 2 === 0;
                const isSelected = selectedSquare && selectedSquare[0] === i && selectedSquare[1] === j;
                const isPossibleMove = possibleMoves.some(([r, c]) => r === i && c === j);

                return (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => handleSquareClick(i, j)}
                    className={`
                      relative flex items-center justify-center text-3xl sm:text-5xl
                      transition-all
                      ${isLight ? 'bg-amber-100' : 'bg-amber-700'}
                      ${isSelected ? 'ring-4 ring-yellow-400' : ''}
                      ${isPossibleMove ? 'ring-4 ring-green-400' : ''}
                      hover:opacity-80
                    `}
                  >
                    {piece && PIECE_SYMBOLS[piece.color][piece.type]}
                    
                    {/* 가능한 이동 위치 표시 */}
                    {isPossibleMove && !piece && (
                      <div className="absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-green-500/50" />
                    )}
                    {isPossibleMove && piece && (
                      <div className="absolute inset-0 border-4 border-red-500 pointer-events-none" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 잡은 기물 표시 (백이 잡은 흑 기물) */}
        <div className="mt-2 bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg">
          <p className="text-gray-300 text-sm mb-1">⚪ 백이 잡은 기물:</p>
          <div className="flex gap-1 flex-wrap text-2xl">
            {capturedPieces.white.length > 0 
              ? capturedPieces.white.map((piece, i) => (
                  <span key={i}>{PIECE_SYMBOLS[piece!.color][piece!.type]}</span>
                ))
              : <span className="text-gray-500 text-sm">없음</span>
            }
          </div>
        </div>

        {/* 힌트 */}
        {gameMode === 'learn' && (
          <div className="mt-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">💡 체스 전략</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>오프닝:</strong> 중앙 폰을 움직이고 나이트/비숍을 발전시키세요</li>
              <li>• <strong>중반전:</strong> 기물을 활발하게 움직이고 상대 약점을 공략하세요</li>
              <li>• <strong>엔드게임:</strong> 킹을 적극 활용하고 폰을 승급시키세요</li>
              <li>• <strong>기물 가치:</strong> 폰(1) &lt; 나이트/비숍(3) &lt; 룩(5) &lt; 퀸(9)</li>
            </ul>
          </div>
        )}

        {/* 조작 안내 */}
        {selectedSquare === null && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              🖱️ 이동할 기물을 클릭한 후, 이동할 위치를 클릭하세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

