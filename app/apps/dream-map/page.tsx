"use client";

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

// 꿈의 요소 타입
const DREAM_ELEMENTS = {
  people: { color: '#FF69B4', icon: '👥', name: '사람' },
  places: { color: '#87CEEB', icon: '🏠', name: '장소' },
  objects: { color: '#FFD700', icon: '📦', name: '사물' },
  emotions: { color: '#9370DB', icon: '❤️', name: '감정' },
  actions: { color: '#32CD32', icon: '🏃', name: '행동' },
  symbols: { color: '#FF4500', icon: '✨', name: '상징' }
};

// 꿈 해석 데이터베이스
const DREAM_INTERPRETATIONS = {
  '비행': { meaning: '자유에 대한 갈망, 현실 탈출 욕구', category: 'actions' },
  '떨어지는': { meaning: '통제력 상실에 대한 불안', category: 'actions' },
  '물': { meaning: '감정의 상태, 무의식', category: 'symbols' },
  '불': { meaning: '열정, 분노, 변화', category: 'symbols' },
  '길': { meaning: '인생의 방향, 선택', category: 'places' },
  '집': { meaning: '자아, 안전, 가족', category: 'places' },
  '부모님': { meaning: '권위, 보호, 과거', category: 'people' },
  '친구': { meaning: '자신의 다른 측면, 사회적 관계', category: 'people' },
  '동물': { meaning: '본능, 원초적 욕구', category: 'objects' },
  '돈': { meaning: '가치, 자존감, 성공', category: 'objects' },
  '행복': { meaning: '만족, 성취감', category: 'emotions' },
  '두려움': { meaning: '회피하고 싶은 것, 불안', category: 'emotions' },
  '죽음': { meaning: '끝과 새로운 시작, 변화', category: 'symbols' },
  '시험': { meaning: '자기 평가, 압박감', category: 'actions' },
  '쫓기는': { meaning: '회피, 스트레스, 압박', category: 'actions' },
  '학교': { meaning: '학습, 성장, 과거', category: 'places' }
};

interface DreamNode {
  id: string;
  name: string;
  category: string;
  position: THREE.Vector3;
  connections: string[];
  intensity: number;
  interpretation?: string;
}

interface DreamHistory {
  id: string;
  date: string;
  text: string;
  nodes: number;
  mainThemes?: string[];
}

export default function DreamMap() {
  const [dreamText, setDreamText] = useState('');
  const [dreamHistory, setDreamHistory] = useState<DreamHistory[]>([]);
  const [dreamMap, setDreamMap] = useState<DreamNode[] | null>(null);
  const [selectedNode, setSelectedNode] = useState<DreamNode | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // 로컬 스토리지에서 꿈 기록 불러오기
  useEffect(() => {
    const savedHistory = localStorage.getItem('dreamHistory');
    if (savedHistory) {
      setDreamHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 3D 꿈 지도 렌더링
  useEffect(() => {
    if (!canvasRef.current || !dreamMap) return;

    // Scene 설정
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2e);
    scene.fog = new THREE.FogExp2(0x0a0a2e, 0.002);
    sceneRef.current = scene;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 30, 50);

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    controls.minDistance = 10;
    controlsRef.current = controls;

    // 조명
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // 별 배경
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 500;
      const y = (Math.random() - 0.5) * 500;
      const z = (Math.random() - 0.5) * 500;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 꿈 노드 생성
    const nodeMap = new Map<string, THREE.Mesh>();
    const connectionLines: THREE.Line[] = [];

    dreamMap.forEach((node) => {
      // 노드 구체
      const geometry = new THREE.SphereGeometry(node.intensity, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: DREAM_ELEMENTS[node.category as keyof typeof DREAM_ELEMENTS]?.color || 0xffffff,
        emissive: DREAM_ELEMENTS[node.category as keyof typeof DREAM_ELEMENTS]?.color || 0xffffff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(node.position);
      mesh.userData = node;

      // 노드 빛
      const light = new THREE.PointLight(
        DREAM_ELEMENTS[node.category as keyof typeof DREAM_ELEMENTS]?.color || 0xffffff,
        1,
        20
      );
      light.position.copy(node.position);
      scene.add(light);

      scene.add(mesh);
      nodeMap.set(node.id, mesh);

      // 라벨 (스프라이트)
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      if (context) {
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(node.name, 128, 40);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(node.position);
      sprite.position.y += node.intensity + 2;
      sprite.scale.set(10, 2.5, 1);
      scene.add(sprite);
    });

    // 연결선 생성
    dreamMap.forEach((node) => {
      node.connections.forEach((targetId) => {
        const targetNode = dreamMap.find(n => n.id === targetId);
        if (targetNode) {
          const points = [];
          points.push(node.position);

          // 곡선 경로 생성
          const midPoint = new THREE.Vector3(
            (node.position.x + targetNode.position.x) / 2,
            Math.max(node.position.y, targetNode.position.y) + 5,
            (node.position.z + targetNode.position.z) / 2
          );

          const curve = new THREE.QuadraticBezierCurve3(
            node.position,
            midPoint,
            targetNode.position
          );

          const curvePoints = curve.getPoints(50);
          const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
          const material = new THREE.LineBasicMaterial({
            color: 0x4169e1,
            opacity: 0.5,
            transparent: true
          });

          const line = new THREE.Line(geometry, material);
          scene.add(line);
          connectionLines.push(line);
        }
      });
    });

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(nodeMap.values()));

      // 호버 효과
      nodeMap.forEach((mesh) => {
        (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.3;
      });

      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object as THREE.Mesh;
        (hoveredMesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.8;
        canvasRef.current!.style.cursor = 'pointer';
      } else {
        canvasRef.current!.style.cursor = 'default';
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(nodeMap.values()));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        setSelectedNode(clickedMesh.userData as DreamNode);
      }
    };

    canvasRef.current.addEventListener('mousemove', onMouseMove);
    canvasRef.current.addEventListener('click', onClick);

    // 애니메이션
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // 노드 부유 효과
      let time = Date.now() * 0.001;
      nodeMap.forEach((mesh, id) => {
        const node = dreamMap.find(n => n.id === id);
        if (node) {
          mesh.position.y = node.position.y + Math.sin(time + mesh.position.x) * 0.5;
          mesh.rotation.y += 0.01;
        }
      });

      // 별 회전
      stars.rotation.y += 0.0002;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      camera.aspect = canvasRef.current!.clientWidth / canvasRef.current!.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 클린업
    return () => {
      // 애니메이션 취소
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      // 이벤트 리스너 제거
      const currentCanvas = canvasRef.current;
      if (currentCanvas) {
        currentCanvas.removeEventListener('mousemove', onMouseMove);
        currentCanvas.removeEventListener('click', onClick);
      }
      window.removeEventListener('resize', handleResize);

      // controls cleanup
      if (controls) {
        controls.dispose();
      }

      // renderer cleanup
      if (renderer && renderer.domElement) {
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      // scene cleanup
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
          if (object instanceof THREE.Points) {
            object.geometry?.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
          if (object instanceof THREE.Line) {
            object.geometry?.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
          if (object instanceof THREE.Sprite) {
            if (object.material) {
              if (object.material.map) {
                object.material.map.dispose();
              }
              object.material.dispose();
            }
          }
          if (object instanceof THREE.Light) {
            object.dispose?.();
          }
        });
      }

      // refs 초기화
      sceneRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, [dreamMap]);

  // 꿈 텍스트 분석
  const analyzeDream = () => {
    if (!dreamText) {
      alert('꿈 내용을 입력해주세요!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 키워드 추출
      const keywords: { word: string; category: string; count: number }[] = [];

      Object.entries(DREAM_INTERPRETATIONS).forEach(([keyword, data]) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = dreamText.match(regex);
        if (matches) {
          keywords.push({
            word: keyword,
            category: data.category,
            count: matches.length
          });
        }
      });

      // 추가 키워드 자동 감지 (간단한 NLP 시뮬레이션)
      const commonWords = ['나', '내가', '꿈', '있었다', '했다', '것', '그'];
      const words = dreamText.split(/\s+/).filter(word =>
        word.length > 1 && !commonWords.includes(word)
      );

      words.forEach(word => {
        if (!keywords.find(k => k.word === word)) {
          // 카테고리 추측
          let category = 'symbols';
          if (word.includes('씨') || word.includes('님')) category = 'people';
          else if (word.includes('에서') || word.includes('로')) category = 'places';
          else if (word.includes('하다') || word.includes('했')) category = 'actions';

          keywords.push({
            word,
            category,
            count: 1
          });
        }
      });

      // 노드 생성
      const nodes: DreamNode[] = [];
      const nodePositions: THREE.Vector3[] = [];

      keywords.forEach((keyword, index) => {
        // 3D 공간에 노드 배치 (스파이럴 패턴)
        const angle = (index / keywords.length) * Math.PI * 4;
        const radius = 10 + index * 2;
        const height = Math.sin(index * 0.5) * 10;

        const position = new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );

        nodePositions.push(position);

        nodes.push({
          id: `node-${index}`,
          name: keyword.word,
          category: keyword.category,
          position,
          connections: [],
          intensity: 1 + keyword.count * 0.5,
          interpretation: DREAM_INTERPRETATIONS[keyword.word as keyof typeof DREAM_INTERPRETATIONS]?.meaning
        });
      });

      // 연결 관계 생성 (근접성 기반)
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = node.position.distanceTo(otherNode.position);
            if (distance < 20) {
              node.connections.push(otherNode.id);
            }
          }
        });
      });

      setDreamMap(nodes);

      // 꿈 기록 저장
      const newDream = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        text: dreamText,
        nodes: nodes.length,
        mainThemes: [...new Set(keywords.map(k => k.category))]
      };

      const updatedHistory = [newDream, ...dreamHistory].slice(0, 10);
      setDreamHistory(updatedHistory);
      localStorage.setItem('dreamHistory', JSON.stringify(updatedHistory));

      setLoading(false);
    }, 2000);
  };

  // 패턴 분석
  const analyzePatterns = () => {
    const patterns: { [key: string]: number } = {};

    dreamHistory.forEach(dream => {
      dream.mainThemes?.forEach((theme: string) => {
        patterns[theme] = (patterns[theme] || 0) + 1;
      });
    });

    return Object.entries(patterns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  return (
    <PremiumLayout theme="purple">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              꿈 지도 제작기
            </span>
          </h1>
          <p className="text-xl text-white/80">
            꿈을 3D 맵으로 시각화하고 숨겨진 의미를 발견하세요
          </p>
        </div>

        {!dreamMap ? (
          <div className="space-y-8">
            <PremiumCard hover gradient className="animate-slideUp">
              <h3 className="text-white text-2xl font-bold mb-6 text-center">
                🌙 꿈 내용 입력
              </h3>

              <textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="오늘 꾼 꿈을 자세히 적어주세요... (예: 하늘을 날아다니는 꿈을 꿨어요. 구름 위를 걷고 있었는데...)"
                className="w-full h-40 px-4 py-3 rounded-lg text-black resize-none"
              />

              <div className="mt-4 text-white/70 text-sm">
                💡 팁: 구체적인 인물, 장소, 사물, 감정, 행동을 포함하면 더 정확한 지도가 생성됩니다.
              </div>

              <PremiumButton
                onClick={analyzeDream}
                variant="primary"
                size="lg"
                icon="🗺️"
                fullWidth
                disabled={loading}
                className="mt-6"
              >
                {loading ? '꿈 분석 중...' : '꿈 지도 생성'}
              </PremiumButton>
            </PremiumCard>

            {/* 꿈 기록 */}
            {dreamHistory.length > 0 && (
              <PremiumCard hover>
                <h3 className="text-white text-2xl font-bold mb-6 text-center">
                  📚 최근 꿈 기록
                </h3>

                <div className="space-y-3">
                  {dreamHistory.slice(0, 5).map((dream) => (
                    <div
                      key={dream.id}
                      className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer"
                      onClick={() => setDreamText(dream.text)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white/70 text-sm">{dream.date}</span>
                        <span className="text-white/50 text-xs">{dream.nodes}개 요소</span>
                      </div>
                      <p className="text-white/90 text-sm line-clamp-2">{dream.text}</p>
                      <div className="flex gap-2 mt-2">
                        {dream.mainThemes?.map((theme: string) => (
                          <span
                            key={theme}
                            className="px-2 py-1 bg-white/20 rounded-full text-xs text-white/80"
                          >
                            {DREAM_ELEMENTS[theme as keyof typeof DREAM_ELEMENTS]?.icon}
                            {DREAM_ELEMENTS[theme as keyof typeof DREAM_ELEMENTS]?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 패턴 분석 */}
                {dreamHistory.length >= 3 && (
                  <div className="mt-6 p-4 bg-purple-500/20 rounded-lg">
                    <h4 className="text-white font-bold mb-3">🔍 반복 패턴 발견</h4>
                    <div className="flex flex-wrap gap-2">
                      {analyzePatterns().map(([theme, count]) => (
                        <span
                          key={theme}
                          className="px-3 py-1 bg-white/20 rounded-full text-sm text-white"
                        >
                          {DREAM_ELEMENTS[theme as keyof typeof DREAM_ELEMENTS]?.name} ({count}회)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </PremiumCard>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* 3D 꿈 지도 */}
            <PremiumCard hover gradient>
              <h3 className="text-white text-2xl font-bold mb-4 text-center">
                🌌 3D 꿈 지도
              </h3>
              <div
                ref={canvasRef}
                className="w-full h-[500px] rounded-lg overflow-hidden"
                style={{ touchAction: 'none' }}
              />
              <div className="mt-4 text-center text-white/70 text-sm">
                🖱️ 마우스로 회전 | 스크롤로 확대/축소 | 클릭으로 상세 정보
              </div>
            </PremiumCard>

            {/* 선택된 노드 정보 */}
            {selectedNode && (
              <PremiumCard hover className="animate-slideUp">
                <h3 className="text-white text-xl font-bold mb-4">
                  📍 {selectedNode.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {DREAM_ELEMENTS[selectedNode.category as keyof typeof DREAM_ELEMENTS]?.icon}
                    </span>
                    <div>
                      <div className="text-white/70 text-sm">카테고리</div>
                      <div className="text-white font-bold">
                        {DREAM_ELEMENTS[selectedNode.category as keyof typeof DREAM_ELEMENTS]?.name}
                      </div>
                    </div>
                  </div>

                  {selectedNode.interpretation && (
                    <div className="p-4 bg-purple-500/20 rounded-lg">
                      <div className="text-white/70 text-sm mb-2">💭 해석</div>
                      <p className="text-white">{selectedNode.interpretation}</p>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70 text-sm">
                    <span>강도: {selectedNode.intensity.toFixed(1)}</span>
                    <span>연결: {selectedNode.connections.length}개</span>
                  </div>
                </div>
              </PremiumCard>
            )}

            {/* 전체 분석 */}
            <PremiumCard hover>
              <h3 className="text-white text-2xl font-bold mb-6 text-center">
                🔮 꿈 분석 결과
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 주요 테마 */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-3">주요 테마</h4>
                  <div className="space-y-2">
                    {Object.entries(
                      dreamMap.reduce((acc, node) => {
                        acc[node.category] = (acc[node.category] || 0) + 1;
                        return acc;
                      }, {} as { [key: string]: number })
                    )
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, count]) => (
                        <div key={category} className="flex justify-between text-white/80">
                          <span>
                            {DREAM_ELEMENTS[category as keyof typeof DREAM_ELEMENTS]?.icon}
                            {' '}
                            {DREAM_ELEMENTS[category as keyof typeof DREAM_ELEMENTS]?.name}
                          </span>
                          <span>{count}개</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 복잡도 분석 */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-3">꿈의 특성</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-white/70 text-sm">복잡도</div>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, dreamMap.length * 10)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-sm">연결성</div>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (dreamMap.reduce((acc, node) => acc + node.connections.length, 0) /
                                dreamMap.length) *
                                20
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI 해석 (시뮬레이션) */}
              <div className="mt-6 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <h4 className="text-white font-bold mb-3">🤖 AI 종합 해석</h4>
                <p className="text-white/90 leading-relaxed">
                  이 꿈은 주로{' '}
                  <span className="font-bold">
                    {DREAM_ELEMENTS[
                      Object.entries(
                        dreamMap.reduce((acc, node) => {
                          acc[node.category] = (acc[node.category] || 0) + 1;
                          return acc;
                        }, {} as { [key: string]: number })
                      ).sort(([, a], [, b]) => b - a)[0]?.[0] as keyof typeof DREAM_ELEMENTS
                    ]?.name}
                  </span>
                  과(와) 관련된 내용이 많습니다.
                  {dreamMap.length > 10
                    ? ' 복잡한 꿈으로 다양한 감정과 생각이 얽혀있습니다.'
                    : ' 비교적 단순한 구조의 꿈입니다.'}
                  {' '}
                  {dreamMap.some(n => n.interpretation?.includes('불안'))
                    ? '일부 불안 요소가 감지되니 스트레스 관리에 신경쓰세요.'
                    : '전반적으로 안정적인 정서 상태를 보여줍니다.'}
                </p>
              </div>
            </PremiumCard>

            <div className="text-center">
              <PremiumButton
                onClick={() => {
                  setDreamMap(null);
                  setSelectedNode(null);
                  setDreamText('');
                }}
                variant="secondary"
                size="lg"
              >
                새로운 꿈 분석하기
              </PremiumButton>
            </div>
          </div>
        )}

        <RelatedApps currentAppSlug="dream-map" className="mt-12" />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </PremiumLayout>
  );
}