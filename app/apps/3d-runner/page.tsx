'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

// 게임 상태 타입
type GameState = 'start' | 'playing' | 'gameover';

// 플레이어 컴포넌트
function Player({
  position,
  isJumping
}: {
  position: [number, number, number];
  isJumping: boolean;
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color={isJumping ? "#22d3ee" : "#06b6d4"}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

// 장애물 컴포넌트
function Obstacle({ position, type }: { position: [number, number, number]; type: number }) {
  const colors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#ec4899'];
  const color = colors[type % colors.length];

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[0.8, type === 0 ? 1.5 : 0.8, 0.8]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
    </mesh>
  );
}

// 바닥 컴포넌트
function Ground() {
  return (
    <>
      {/* 메인 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 그리드 라인들 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, -0.49, -i * 5]} receiveShadow>
          <boxGeometry args={[6, 0.02, 0.1]} />
          <meshStandardMaterial color="#334155" emissive="#334155" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </>
  );
}

// 3D 씬 컴포넌트
function GameScene({
  gameState,
  playerLane,
  isJumping,
  obstacles,
  onCollision
}: {
  gameState: GameState;
  playerLane: number;
  isJumping: boolean;
  obstacles: Array<{ id: number; lane: number; z: number; type: number }>;
  onCollision: () => void;
}) {
  const playerRef = useRef<THREE.Mesh>(null);

  // 플레이어 위치 계산
  const playerX = (playerLane - 1) * 2; // -2, 0, 2
  const playerY = isJumping ? 1.5 : 0;

  // 충돌 감지
  useEffect(() => {
    if (gameState !== 'playing') return;

    obstacles.forEach(obstacle => {
      // 플레이어와 장애물이 같은 레인에 있고, z 위치가 비슷할 때
      if (obstacle.lane === playerLane && obstacle.z > -2 && obstacle.z < 2) {
        // 점프 중이 아니면 충돌
        if (!isJumping) {
          onCollision();
        }
      }
    });
  }, [obstacles, playerLane, isJumping, gameState, onCollision]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 8]} />

      {/* 조명 */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#06b6d4" />

      {/* 플레이어 */}
      <Player position={[playerX, playerY, 0]} isJumping={isJumping} />

      {/* 장애물들 */}
      {obstacles.map(obstacle => (
        <Obstacle
          key={obstacle.id}
          position={[(obstacle.lane - 1) * 2, 0, obstacle.z]}
          type={obstacle.type}
        />
      ))}

      {/* 바닥 */}
      <Ground />

      {/* 레인 표시선 */}
      <mesh position={[-3, -0.48, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.02, 100]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[3, -0.48, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.02, 100]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </>
  );
}

// 메인 페이지 컴포넌트
export default function Runner3DPage() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [playerLane, setPlayerLane] = useState(1); // 0: 왼쪽, 1: 중앙, 2: 오른쪽
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [obstacles, setObstacles] = useState<Array<{ id: number; lane: number; z: number; type: number }>>([]);
  const [gameSpeed, setGameSpeed] = useState(0.1);

  const obstacleIdRef = useRef(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const jumpTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 로컬스토리지에서 최고 기록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('runner3d-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // 게임 시작
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setDistance(0);
    setPlayerLane(1);
    setObstacles([]);
    setGameSpeed(0.1);
    obstacleIdRef.current = 0;
  };

  // 점프
  const jump = () => {
    if (!isJumping && gameState === 'playing') {
      setIsJumping(true);

      // 점프 사운드 재생
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2W57OahUhENTKXh8bllHwU7k9n0ynUrBSh+zPLaizsKGGS56+2gURQNSqPh8rtlHgU7k9n0ynUrBSh+zPLaizsKGGS56+2gURQNSqPh8rtlHgU7k9n0ynUrBSh+zPLaizsKGGS56+2gURQNSqPh8rtlHg==');
      audio.volume = 0.3;
      audio.play().catch(() => {});

      if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
      jumpTimeoutRef.current = setTimeout(() => {
        setIsJumping(false);
      }, 500);
    }
  };

  // 왼쪽 이동
  const moveLeft = () => {
    if (gameState === 'playing' && playerLane > 0) {
      setPlayerLane(prev => prev - 1);
      playMoveSound();
    }
  };

  // 오른쪽 이동
  const moveRight = () => {
    if (gameState === 'playing' && playerLane < 2) {
      setPlayerLane(prev => prev + 1);
      playMoveSound();
    }
  };

  // 이동 사운드
  const playMoveSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2W57OahUhENTKXh8bllHwU7k9n0ynUrBSh+zPLaizsKGGS56+2gURQNSqPh8rtlHgU7k9n0ynUrBSh+zPLaizsKGGS56+2gURQNSqPh8rtlHg==');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  // 게임 오버 사운드
  const playGameOverSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////w==');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // 충돌 처리
  const handleCollision = () => {
    setGameState('gameover');
    playGameOverSound();

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('runner3d-highscore', score.toString());
    }

    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  // 키보드 컨트롤
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'start') {
        if (e.code === 'Space') startGame();
        return;
      }

      if (gameState === 'gameover') {
        if (e.code === 'Space') startGame();
        return;
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') moveLeft();
      if (e.code === 'ArrowRight' || e.code === 'KeyD') moveRight();
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, playerLane, isJumping]);

  // 게임 루프
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      // 장애물 이동
      setObstacles(prev => {
        const moved = prev
          .map(obs => ({ ...obs, z: obs.z + gameSpeed }))
          .filter(obs => obs.z < 5);

        // 새 장애물 생성 (랜덤)
        if (Math.random() < 0.02) {
          const newObstacle = {
            id: obstacleIdRef.current++,
            lane: Math.floor(Math.random() * 3),
            z: -50,
            type: Math.floor(Math.random() * 5)
          };
          moved.push(newObstacle);
        }

        return moved;
      });

      // 점수 증가
      setScore(prev => prev + 1);
      setDistance(prev => prev + 0.1);

      // 속도 증가 (최대 0.3까지)
      setGameSpeed(prev => Math.min(prev + 0.0001, 0.3));

    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, gameSpeed]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* 헤더 */}
      <div className="p-6 text-center border-b border-slate-700">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          🏃 3D Runner Game
        </h1>
        <p className="text-slate-400 mt-2">피하고, 점프하고, 살아남아라!</p>
      </div>

      {/* 3D 캔버스 */}
      <div className="relative w-full h-[500px] bg-slate-950">
        <Canvas shadows>
          <GameScene
            gameState={gameState}
            playerLane={playerLane}
            isJumping={isJumping}
            obstacles={obstacles}
            onCollision={handleCollision}
          />
        </Canvas>

        {/* 스코어 오버레이 */}
        {gameState === 'playing' && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">
              {score.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">
              {distance.toFixed(1)}m
            </div>
          </div>
        )}

        {/* 최고 기록 */}
        {highScore > 0 && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg">
            <div className="text-sm text-slate-400">최고 기록</div>
            <div className="text-xl font-bold text-yellow-400">
              {highScore.toLocaleString()}
            </div>
          </div>
        )}

        {/* 시작 화면 */}
        {gameState === 'start' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-5xl font-bold mb-6 animate-pulse bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                3D Runner
              </h2>
              <div className="mb-8 space-y-2 text-slate-300">
                <p>⬅️ ➡️ : 좌우 이동 (A, D)</p>
                <p>⬆️ SPACE : 점프 (W)</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-bold text-xl transform hover:scale-105 transition-all shadow-lg shadow-cyan-500/50"
              >
                🎮 게임 시작
              </button>
            </div>
          </div>
        )}

        {/* 게임 오버 화면 */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center bg-slate-900/90 p-10 rounded-2xl border-2 border-red-500/50">
              <h2 className="text-5xl font-bold mb-6 text-red-500">
                💥 Game Over
              </h2>
              <div className="mb-6">
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {score.toLocaleString()}
                </div>
                <div className="text-slate-400">
                  거리: {distance.toFixed(1)}m
                </div>
                {score === highScore && highScore > 0 && (
                  <div className="text-yellow-400 font-bold mt-2 animate-pulse">
                    🏆 새로운 최고 기록!
                  </div>
                )}
              </div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-bold text-xl transform hover:scale-105 transition-all shadow-lg shadow-cyan-500/50"
              >
                🔄 다시 하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 모바일 컨트롤 */}
      <div className="p-6 lg:hidden">
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={moveLeft}
            className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:scale-95 rounded-xl font-bold text-2xl shadow-lg border border-slate-600"
          >
            ⬅️
          </button>
          <button
            onClick={jump}
            className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 rounded-xl font-bold text-2xl shadow-lg shadow-cyan-500/30"
          >
            ⬆️
          </button>
          <button
            onClick={moveRight}
            className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:scale-95 rounded-xl font-bold text-2xl shadow-lg border border-slate-600"
          >
            ➡️
          </button>
        </div>
      </div>

      {/* 게임 설명 */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">🎮 게임 방법</h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <h4 className="font-bold text-white mb-2">조작법</h4>
              <ul className="space-y-2">
                <li>⬅️ ➡️ 화살표 또는 A, D: 좌우 이동</li>
                <li>⬆️ 화살표, W, SPACE: 점프</li>
                <li>모바일: 화면 하단 버튼 사용</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">게임 규칙</h4>
              <ul className="space-y-2">
                <li>🚧 다가오는 장애물을 피하세요</li>
                <li>⏱️ 시간이 지날수록 속도 증가</li>
                <li>🏆 최고 기록에 도전하세요</li>
                <li>💯 거리와 점수를 획득하세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 팁 */}
        <div className="mt-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-700/30">
          <h4 className="font-bold text-cyan-400 mb-3">💡 게임 팁</h4>
          <ul className="space-y-2 text-slate-300">
            <li>✨ 점프 타이밍을 잘 맞추면 장애물을 쉽게 피할 수 있어요</li>
            <li>✨ 레인 변경과 점프를 적절히 조합하세요</li>
            <li>✨ 속도가 빨라질수록 더 빠른 반응이 필요해요</li>
            <li>✨ 앞을 미리 보고 전략적으로 움직이세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
