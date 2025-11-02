"use client";

import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

// 3D 룰렛 컴포넌트
function Wheel3D({ items, isSpinning, onSpinComplete }: { items: string[]; isSpinning: boolean; onSpinComplete: (result: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const spinStartTime = useRef(0);
  const targetRotation = useRef(0);
  const hasCompleted = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isSpinning && velocity === 0) {
      // 스핀 시작
      spinStartTime.current = state.clock.elapsedTime;
      const randomSpins = 5 + Math.random() * 3; // 5-8바퀴
      targetRotation.current = rotation + randomSpins * Math.PI * 2 + Math.random() * Math.PI * 2;
      setVelocity(0.5);
      hasCompleted.current = false;
    }

    if (velocity > 0) {
      // 감속
      const newVelocity = Math.max(0, velocity - delta * 0.3);
      setVelocity(newVelocity);

      // 회전
      const newRotation = rotation + newVelocity;
      setRotation(newRotation);
      groupRef.current.rotation.z = newRotation;

      // 완료
      if (newVelocity === 0 && !hasCompleted.current) {
        hasCompleted.current = true;
        const normalizedRotation = newRotation % (Math.PI * 2);
        const segmentAngle = (Math.PI * 2) / items.length;
        const selectedIndex = Math.floor(((Math.PI * 2 - normalizedRotation) / segmentAngle) % items.length);
        onSpinComplete(items[selectedIndex]);
      }
    }
  });

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
  ];

  return (
    <group ref={groupRef}>
      {items.map((item, index) => {
        const angle = (index / items.length) * Math.PI * 2;
        const nextAngle = ((index + 1) / items.length) * Math.PI * 2;
        const midAngle = (angle + nextAngle) / 2;

        // 룰렛 조각
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.arc(0, 0, 2, angle, nextAngle, false);
        shape.lineTo(0, 0);

        const extrudeSettings = {
          depth: 0.2,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.05,
          bevelSegments: 3
        };

        return (
          <group key={index}>
            <mesh rotation={[0, 0, 0]}>
              <extrudeGeometry args={[shape, extrudeSettings]} />
              <meshStandardMaterial color={colors[index % colors.length]} />
            </mesh>
            <Text
              position={[
                Math.cos(midAngle) * 1.3,
                Math.sin(midAngle) * 1.3,
                0.3
              ]}
              rotation={[0, 0, midAngle + Math.PI / 2]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="black"
            >
              {item}
            </Text>
          </group>
        );
      })}

      {/* 중앙 원 */}
      <mesh position={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 테두리 */}
      <mesh position={[0, 0, -0.05]}>
        <ringGeometry args={[2, 2.2, 64]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 화살표 표시
function Arrow() {
  return (
    <mesh position={[0, 2.5, 0.3]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.2, 0.5, 3]} />
      <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export default function RandomWheel() {
  const [items, setItems] = useState<string[]>(['선택지 1', '선택지 2', '선택지 3', '선택지 4']);
  const [newItem, setNewItem] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = {
    '점심 메뉴': ['김치찌개', '된장찌개', '라면', '피자', '치킨', '햄버거', '초밥', '짜장면'],
    '오늘 할 일': ['운동하기', '독서하기', '청소하기', '요리하기', '산책하기', '영화보기'],
    '벌칙': ['노래부르기', '애교하기', '춤추기', '푸쉬업 10개', '스쿼트 20개', '1분 플랭크'],
    '여행지': ['제주도', '부산', '강릉', '경주', '전주', '속초', '여수', '통영'],
    '취미': ['그림그리기', '악기연주', '요리', '사진촬영', '등산', '요가', '독서', '게임']
  };

  const addItem = () => {
    if (newItem.trim() && items.length < 12) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const spin = () => {
    if (items.length < 2 || isSpinning) return;
    setIsSpinning(true);
    setResult(null);
  };

  const handleSpinComplete = (selectedItem: string) => {
    setIsSpinning(false);
    setResult(selectedItem);
  };

  const loadTemplate = (templateName: string) => {
    setItems(templates[templateName as keyof typeof templates]);
    setShowTemplates(false);
  };

  return (
    <PremiumLayout theme="orange">
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-orange-200 via-yellow-200 to-red-200 bg-clip-text text-transparent px-2">
            🎡 랜덤 룰렛
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 px-2">3D 룰렛으로 공정한 선택을!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* 왼쪽: 3D 룰렛 */}
          <div className="order-1">
            <PremiumCard hover className="mb-4">
              <div className="h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-blue-900/50 touch-none">
                <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    <Wheel3D
                      items={items}
                      isSpinning={isSpinning}
                      onSpinComplete={handleSpinComplete}
                    />
                    <Arrow />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Suspense>
                </Canvas>
              </div>
            </PremiumCard>

            <PremiumButton
              onClick={spin}
              disabled={isSpinning || items.length < 2}
              variant="primary"
              size="lg"
              icon="🎲"
              fullWidth
            >
              {isSpinning ? '돌리는 중...' : '룰렛 돌리기!'}
            </PremiumButton>

            {result && (
              <PremiumCard hover gradient className="mt-4 animate-bounce-slow">
                <div className="text-center py-2">
                  <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🎉</div>
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2">결과</h3>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent break-words px-2">
                    {result}
                  </div>
                </div>
              </PremiumCard>
            )}
          </div>

          {/* 오른쪽: 설정 */}
          <div className="space-y-4 order-2">
            <PremiumCard hover>
              <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">➕ 항목 추가</h3>
              <div className="flex gap-2 mb-3 sm:mb-4">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  placeholder="새 항목 입력"
                  maxLength={15}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-black font-bold text-sm sm:text-base"
                  style={{ fontSize: '16px' }}
                  disabled={items.length >= 12}
                />
                <PremiumButton
                  onClick={addItem}
                  disabled={!newItem.trim() || items.length >= 12}
                  variant="success"
                  size="md"
                >
                  추가
                </PremiumButton>
              </div>
              <p className="text-white/70 text-xs sm:text-sm">
                최대 12개까지 ({items.length}/12)
              </p>
            </PremiumCard>

            <PremiumCard hover>
              <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">📝 현재 항목 ({items.length}개)</h3>
              <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/10 rounded-lg px-3 sm:px-4 py-2 hover:bg-white/20 transition-all"
                  >
                    <span className="text-white font-bold text-sm sm:text-base break-words flex-1 mr-2">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 2}
                      className="text-red-300 hover:text-red-100 disabled:text-gray-500 disabled:cursor-not-allowed text-lg sm:text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </PremiumCard>

            <PremiumCard hover>
              <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">🎨 템플릿</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(templates).map((template) => (
                  <button
                    type="button"
                    key={template}
                    onClick={() => loadTemplate(template)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 sm:py-3 px-2 sm:px-3 rounded-lg transition-all text-xs sm:text-sm active:scale-95"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </PremiumCard>
          </div>
        </div>

        {/* Related Apps */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="random-wheel" className="mt-8" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
