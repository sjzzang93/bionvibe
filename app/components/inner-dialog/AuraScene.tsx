"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { DomainScore, DOMAIN_INFO } from '@/lib/inner-dialog-data';

interface AuraSceneProps {
  domainScores: DomainScore[];
  compositeIndices: {
    wellbeing: number;
    vitality: number;
    growth: number;
    stability: number;
    balance: number;
  };
}

// 점수를 HSL 색상으로 변환 (0-100 → Hue 0-120, 낮을수록 빨강, 높을수록 초록)
function scoreToColor(score: number): string {
  const hue = (score / 100) * 120; // 0 (red) to 120 (green)
  const saturation = 70;
  const lightness = 50 + (score / 100) * 20; // 50-70
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// 중앙 오라 구체
function CentralAura({ overallScore }: { overallScore: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const color = useMemo(() => scoreToColor(overallScore), [overallScore]);
  const emissiveIntensity = useMemo(() => 0.2 + (overallScore / 100) * 0.5, [overallScore]);

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        distort={0.3}
        speed={2}
        roughness={0.3}
        metalness={0.8}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

// 위성 객체 (5개 핵심 도메인)
function SatelliteObject({
  domain,
  score,
  position,
  index,
}: {
  domain: string;
  score: number;
  position: [number, number, number];
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const speed = 0.5 + index * 0.1;

      // 공전 애니메이션
      const radius = 4;
      const angle = time * speed + (index * Math.PI * 2) / 5;
      meshRef.current.position.x = Math.cos(angle) * radius;
      meshRef.current.position.z = Math.sin(angle) * radius;
      meshRef.current.position.y = Math.sin(time * 0.5 + index) * 0.5;

      // 자전 애니메이션
      meshRef.current.rotation.y = time * 2;
    }
  });

  const color = useMemo(() => scoreToColor(score), [score]);
  const size = useMemo(() => 0.3 + (score / 100) * 0.5, [score]);

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5 + (score / 100) * 0.5}
        metalness={0.6}
        roughness={0.4}
      />
    </mesh>
  );
}

// 배경 파티클
function BackgroundParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8B5CF6" transparent opacity={0.6} />
    </points>
  );
}

// 메인 씬
export default function AuraScene({ domainScores, compositeIndices }: AuraSceneProps) {
  // 전체 평균 점수
  const overallScore = useMemo(() => {
    return Math.round(
      domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length
    );
  }, [domainScores]);

  // 5개 위성 도메인 선택 (STR, ENG, BUR, EMO, PUR)
  const satelliteDomains = useMemo(() => {
    return ['STR', 'ENG', 'BUR', 'EMO', 'PUR'].map(domain => {
      const domainScore = domainScores.find(d => d.domain === domain);
      return {
        domain,
        score: domainScore?.score || 0,
        name: DOMAIN_INFO[domain as keyof typeof DOMAIN_INFO]?.name || domain,
      };
    });
  }, [domainScores]);

  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-purple-900 via-indigo-900 to-black rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* 조명 */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />

        {/* 배경 파티클 */}
        <BackgroundParticles />

        {/* 중앙 오라 구체 */}
        <CentralAura overallScore={overallScore} />

        {/* 위성 객체들 */}
        {satelliteDomains.map((sat, index) => (
          <SatelliteObject
            key={sat.domain}
            domain={sat.domain}
            score={sat.score}
            position={[0, 0, 0]}
            index={index}
          />
        ))}

        {/* 컨트롤 */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* 오버레이 정보 */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-sm font-semibold mb-2">전체 점수: {overallScore}/100</div>
        <div className="space-y-1 text-xs">
          {satelliteDomains.map(sat => (
            <div key={sat.domain} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: scoreToColor(sat.score) }}
              />
              <span>{sat.name}: {sat.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 복합 지수 정보 */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
        <div className="font-semibold mb-2">복합 지수</div>
        <div className="space-y-1">
          <div>웰빙: {compositeIndices.wellbeing}</div>
          <div>활력: {compositeIndices.vitality}</div>
          <div>성장: {compositeIndices.growth}</div>
          <div>안정: {compositeIndices.stability}</div>
          <div>균형: {compositeIndices.balance}</div>
        </div>
      </div>

      {/* 인터랙션 안내 */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
        드래그로 회전 | 스크롤로 확대/축소
      </div>
    </div>
  );
}
