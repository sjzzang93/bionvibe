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

// 꿈 해석 데이터베이스 (프로이트, 융 심리학 기반)
const DREAM_INTERPRETATIONS = {
  // 행동 (Actions)
  '비행': { meaning: '자유에 대한 갈망, 현실 초월 욕구. 현재 제약을 벗어나고 싶은 무의식적 바람', category: 'actions', emotion: 'positive' },
  '날다': { meaning: '자유에 대한 갈망, 현실 초월 욕구. 현재 제약을 벗어나고 싶은 무의식적 바람', category: 'actions', emotion: 'positive' },
  '떨어지는': { meaning: '통제력 상실에 대한 불안, 실패 공포. 삶의 어떤 영역에서 안정감을 잃었을 가능성', category: 'actions', emotion: 'negative' },
  '떨어지다': { meaning: '통제력 상실에 대한 불안, 실패 공포', category: 'actions', emotion: 'negative' },
  '쫓기는': { meaning: '회피하고 싶은 문제나 감정. 직면해야 할 과제로부터의 도피', category: 'actions', emotion: 'negative' },
  '쫓기다': { meaning: '회피하고 싶은 문제나 감정', category: 'actions', emotion: 'negative' },
  '달리는': { meaning: '목표 추구, 긴급한 상황 인식. 무언가에서 도망치거나 무언가를 향해 달려가는 심리', category: 'actions', emotion: 'neutral' },
  '달리다': { meaning: '목표 추구, 긴급한 상황 인식', category: 'actions', emotion: 'neutral' },
  '수영': { meaning: '감정의 흐름 속 항해, 무의식 탐색', category: 'actions', emotion: 'neutral' },
  '싸우는': { meaning: '내적 갈등, 외부와의 대립. 해결되지 않은 분노나 좌절', category: 'actions', emotion: 'negative' },
  '싸우다': { meaning: '내적 갈등, 외부와의 대립', category: 'actions', emotion: 'negative' },
  '시험': { meaning: '자기 평가, 성과에 대한 압박감. 준비되지 않은 상황에 대한 불안', category: 'actions', emotion: 'negative' },
  '공부': { meaning: '자기계발 욕구, 새로운 지식 습득', category: 'actions', emotion: 'positive' },
  '운전': { meaning: '인생의 통제권, 방향 설정. 자신의 삶을 어떻게 이끌고 있는지에 대한 반영', category: 'actions', emotion: 'neutral' },
  '춤': { meaning: '자기표현, 내적 조화. 감정의 자유로운 표출', category: 'actions', emotion: 'positive' },
  '노래': { meaning: '감정 표현, 소통 욕구', category: 'actions', emotion: 'positive' },
  '울다': { meaning: '억압된 감정의 분출, 정화', category: 'actions', emotion: 'negative' },
  '웃다': { meaning: '기쁨, 스트레스 해소', category: 'actions', emotion: 'positive' },

  // 사람 (People)
  '부모님': { meaning: '권위, 보호, 안전. 내면의 부모상(양육적/권위적 측면)', category: 'people', emotion: 'neutral' },
  '어머니': { meaning: '양육, 보살핌, 감정적 안정. 무의식, 본능적 자아', category: 'people', emotion: 'positive' },
  '아버지': { meaning: '권위, 규율, 사회적 규범. 의식, 이성적 자아', category: 'people', emotion: 'neutral' },
  '친구': { meaning: '자신의 다른 측면, 사회적 관계. 그림자 자아의 투영', category: 'people', emotion: 'positive' },
  '애인': { meaning: '사랑, 친밀감, 욕구. 이상화된 자아 또는 아니마/아니무스', category: 'people', emotion: 'positive' },
  '연인': { meaning: '사랑, 친밀감, 욕구', category: 'people', emotion: 'positive' },
  '선생님': { meaning: '지혜, 지도, 권위. 슈퍼에고의 상징', category: 'people', emotion: 'neutral' },
  '아기': { meaning: '새로운 시작, 순수함, 가능성. 내면의 아이', category: 'people', emotion: 'positive' },
  '아이': { meaning: '순수함, 잠재력, 과거의 자아', category: 'people', emotion: 'positive' },
  '낯선사람': { meaning: '알려지지 않은 자아 측면, 그림자', category: 'people', emotion: 'neutral' },
  '유명인': { meaning: '이상화된 자아, 야망, 사회적 성공 욕구', category: 'people', emotion: 'positive' },
  '죽은사람': { meaning: '과거와의 미해결 문제, 애도, 상실', category: 'people', emotion: 'negative' },

  // 장소 (Places)
  '집': { meaning: '자아, 안전, 정체성의 중심. 심리적 안정기반', category: 'places', emotion: 'positive' },
  '학교': { meaning: '학습, 성장, 과거 경험. 사회화 과정', category: 'places', emotion: 'neutral' },
  '길': { meaning: '인생의 방향, 선택, 여정. 현재 가고 있는 길에 대한 성찰', category: 'places', emotion: 'neutral' },
  '바다': { meaning: '무의식의 깊이, 광대한 감정. 모성, 생명의 근원', category: 'places', emotion: 'neutral' },
  '산': { meaning: '도전, 성취 목표, 장애물. 극복해야 할 과제', category: 'places', emotion: 'neutral' },
  '병원': { meaning: '치유 욕구, 건강 염려, 취약함', category: 'places', emotion: 'negative' },
  '공항': { meaning: '전환, 새로운 시작, 변화', category: 'places', emotion: 'neutral' },
  '역': { meaning: '인생의 전환점, 선택의 순간', category: 'places', emotion: 'neutral' },
  '숲': { meaning: '무의식, 미지의 영역, 자연으로의 회귀', category: 'places', emotion: 'neutral' },
  '사막': { meaning: '고립, 영적 탐구, 내면 여정', category: 'places', emotion: 'negative' },
  '도시': { meaning: '사회, 복잡성, 문명', category: 'places', emotion: 'neutral' },
  '화장실': { meaning: '정화, 해방, 사적 공간. 억압된 것의 배출', category: 'places', emotion: 'neutral' },
  '엘리베이터': { meaning: '의식 수준의 변화, 상승/하강', category: 'places', emotion: 'neutral' },
  '지하': { meaning: '무의식, 억압된 내용, 숨겨진 자아', category: 'places', emotion: 'negative' },

  // 사물 (Objects)
  '돈': { meaning: '가치, 자존감, 성공. 자기가치에 대한 인식', category: 'objects', emotion: 'positive' },
  '동물': { meaning: '본능, 원초적 욕구. 통제되지 않은 내면', category: 'objects', emotion: 'neutral' },
  '개': { meaning: '충성, 우정, 보호 본능', category: 'objects', emotion: 'positive' },
  '고양이': { meaning: '독립성, 여성성, 직관', category: 'objects', emotion: 'neutral' },
  '뱀': { meaning: '변화, 치유, 성적 에너지. 지혜 또는 위험', category: 'objects', emotion: 'neutral' },
  '새': { meaning: '자유, 영혼, 초월. 높은 의식 수준', category: 'objects', emotion: 'positive' },
  '자동차': { meaning: '개인적 동력, 진행 방향, 통제', category: 'objects', emotion: 'neutral' },
  '전화': { meaning: '소통, 연결, 메시지. 무의식으로부터의 메시지', category: 'objects', emotion: 'neutral' },
  '거울': { meaning: '자기인식, 정체성, 진실. 자아 성찰', category: 'objects', emotion: 'neutral' },
  '열쇠': { meaning: '해결책, 접근, 비밀 해제', category: 'objects', emotion: 'positive' },
  '문': { meaning: '기회, 전환, 새로운 가능성', category: 'objects', emotion: 'positive' },
  '창문': { meaning: '관점, 통찰, 외부와의 연결', category: 'objects', emotion: 'neutral' },
  '옷': { meaning: '정체성, 페르소나, 사회적 가면', category: 'objects', emotion: 'neutral' },
  '신발': { meaning: '인생의 방향, 기반, 진전', category: 'objects', emotion: 'neutral' },
  '책': { meaning: '지식, 지혜, 인생 이야기', category: 'objects', emotion: 'positive' },
  '음식': { meaning: '양육, 만족, 기본 욕구', category: 'objects', emotion: 'positive' },
  '칼': { meaning: '분리, 결단, 공격성', category: 'objects', emotion: 'negative' },

  // 상징 (Symbols)
  '물': { meaning: '감정의 상태, 무의식의 흐름. 물의 상태(고요/거친)는 감정 상태 반영', category: 'symbols', emotion: 'neutral' },
  '불': { meaning: '열정, 변화, 파괴와 재생. 정화의 불 또는 파괴의 불', category: 'symbols', emotion: 'neutral' },
  '죽음': { meaning: '끝과 새로운 시작, 변화. 심리적 변환의 상징', category: 'symbols', emotion: 'negative' },
  '탄생': { meaning: '새로운 시작, 창조, 잠재력', category: 'symbols', emotion: 'positive' },
  '결혼': { meaning: '통합, 헌신, 새로운 단계', category: 'symbols', emotion: 'positive' },
  '전쟁': { meaning: '내적 갈등, 대립, 투쟁', category: 'symbols', emotion: 'negative' },
  '빛': { meaning: '깨달음, 희망, 진리. 의식의 확장', category: 'symbols', emotion: 'positive' },
  '어둠': { meaning: '무의식, 두려움, 미지. 그림자 자아', category: 'symbols', emotion: 'negative' },
  '다리': { meaning: '전환, 연결, 과도기', category: 'symbols', emotion: 'neutral' },
  '계단': { meaning: '진전, 상승/하강, 의식 수준 변화', category: 'symbols', emotion: 'neutral' },
  '비': { meaning: '정화, 감정 방출, 새로운 시작', category: 'symbols', emotion: 'neutral' },
  '눈': { meaning: '순수, 변화, 감정의 얼어붙음', category: 'symbols', emotion: 'neutral' },
  '바람': { meaning: '변화, 영감, 보이지 않는 힘', category: 'symbols', emotion: 'neutral' },
  '태양': { meaning: '의식, 활력, 남성적 원리', category: 'symbols', emotion: 'positive' },
  '달': { meaning: '무의식, 직관, 여성적 원리', category: 'symbols', emotion: 'neutral' },
  '별': { meaning: '희망, 인도, 영적 지침', category: 'symbols', emotion: 'positive' },

  // 감정 (Emotions)
  '행복': { meaning: '내적 만족, 성취감. 현재 삶의 조화', category: 'emotions', emotion: 'positive' },
  '두려움': { meaning: '회피하고 싶은 것, 직면하지 못한 불안', category: 'emotions', emotion: 'negative' },
  '불안': { meaning: '미해결 과제, 통제력 상실 공포', category: 'emotions', emotion: 'negative' },
  '분노': { meaning: '억압된 감정, 경계 침범, 좌절', category: 'emotions', emotion: 'negative' },
  '슬픔': { meaning: '상실, 애도, 받아들여지지 않은 감정', category: 'emotions', emotion: 'negative' },
  '사랑': { meaning: '연결, 수용, 통합', category: 'emotions', emotion: 'positive' },
  '질투': { meaning: '자존감 문제, 비교, 부족감', category: 'emotions', emotion: 'negative' },
  '외로움': { meaning: '고립감, 연결 욕구', category: 'emotions', emotion: 'negative' },
  '평화': { meaning: '내적 조화, 수용, 균형', category: 'emotions', emotion: 'positive' },
  '흥분': { meaning: '에너지 증가, 변화 준비', category: 'emotions', emotion: 'positive' }
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

              {/* AI 심층 해석 */}
              <div className="mt-6 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg space-y-4">
                <h4 className="text-white font-bold mb-3">🤖 심층 심리 분석</h4>

                {(() => {
                  // 카테고리별 분포
                  const categories = dreamMap.reduce((acc, node) => {
                    acc[node.category] = (acc[node.category] || 0) + 1;
                    return acc;
                  }, {} as { [key: string]: number });

                  const mainCategory = Object.entries(categories)
                    .sort(([, a], [, b]) => b - a)[0]?.[0];

                  // 감정 톤 분석
                  const emotions = dreamMap.reduce((acc, node) => {
                    const interp = DREAM_INTERPRETATIONS[node.name as keyof typeof DREAM_INTERPRETATIONS];
                    if (interp?.emotion) {
                      acc[interp.emotion] = (acc[interp.emotion] || 0) + 1;
                    }
                    return acc;
                  }, {} as { [key: string]: number });

                  const totalEmotions = Object.values(emotions).reduce((a, b) => a + b, 0);
                  const positiveRatio = ((emotions.positive || 0) / totalEmotions) * 100;
                  const negativeRatio = ((emotions.negative || 0) / totalEmotions) * 100;

                  // 주요 키워드 추출
                  const interpretedNodes = dreamMap.filter(n => n.interpretation);

                  // 꿈의 복잡도
                  const complexity = dreamMap.length;
                  const connections = dreamMap.reduce((acc, n) => acc + n.connections.length, 0) / dreamMap.length;

                  return (
                    <>
                      {/* 1. 전반적 테마 */}
                      <div className="text-white/90 leading-relaxed">
                        <span className="font-bold text-purple-300">▸ 핵심 테마:</span>
                        {' '}이 꿈은 주로 <span className="font-bold text-white">
                          {DREAM_ELEMENTS[mainCategory as keyof typeof DREAM_ELEMENTS]?.name}
                        </span>과(와) 관련된 무의식적 메시지를 담고 있습니다.
                        {' '}
                        {mainCategory === 'people' && '대인관계나 자신의 내면적 측면에 대한 성찰이 필요한 시기입니다.'}
                        {mainCategory === 'places' && '현재 당신이 처한 상황이나 인생의 방향에 대한 고민을 반영하고 있습니다.'}
                        {mainCategory === 'actions' && '당신의 현재 행동 패턴이나 대처 방식에 대한 무의식의 피드백입니다.'}
                        {mainCategory === 'objects' && '물질적 가치나 소유, 또는 외부 세계와의 관계를 탐색하고 있습니다.'}
                        {mainCategory === 'emotions' && '억압되거나 표현되지 못한 감정들이 꿈을 통해 표출되고 있습니다.'}
                        {mainCategory === 'symbols' && '깊은 무의식의 원형적 이미지가 나타나고 있으며, 중요한 변화의 시기를 알립니다.'}
                      </div>

                      {/* 2. 감정 톤 분석 */}
                      <div className="text-white/90 leading-relaxed">
                        <span className="font-bold text-purple-300">▸ 감정 분석:</span>
                        {' '}
                        {positiveRatio > 60
                          ? `긍정적 요소가 ${positiveRatio.toFixed(0)}%로 우세합니다. 현재 심리적으로 안정되어 있고, 미래에 대한 희망적인 전망을 가지고 있습니다. 이는 자기실현 욕구가 활성화된 상태를 의미합니다.`
                          : negativeRatio > 60
                          ? `부정적 요소가 ${negativeRatio.toFixed(0)}%로 높게 나타납니다. 현재 스트레스나 불안을 경험하고 있을 가능성이 있습니다. 억압된 감정이나 미해결 과제에 주의를 기울이고, 필요하다면 전문가의 도움을 받는 것이 좋습니다.`
                          : `긍정적 요소(${positiveRatio.toFixed(0)}%)와 부정적 요소(${negativeRatio.toFixed(0)}%)가 균형을 이루고 있습니다. 현실을 있는 그대로 수용하면서도 변화를 모색하는 과도기에 있음을 나타냅니다.`
                        }
                      </div>

                      {/* 3. 복잡도 및 통찰 */}
                      <div className="text-white/90 leading-relaxed">
                        <span className="font-bold text-purple-300">▸ 꿈의 구조:</span>
                        {' '}
                        {complexity < 5
                          ? '비교적 단순한 구조의 꿈입니다. 명확하고 직접적인 메시지를 전달하고 있으며, 특정 이슈에 집중되어 있습니다.'
                          : complexity < 10
                          ? `중간 복잡도의 꿈(${complexity}개 요소)으로, 여러 측면의 심리적 주제들이 얽혀 있습니다. 의식과 무의식 사이의 활발한 대화가 이루어지고 있습니다.`
                          : `매우 복잡한 꿈(${complexity}개 요소)으로, 다층적인 의미를 담고 있습니다. 현재 많은 변화와 성장이 일어나고 있으며, 무의식이 처리해야 할 정보가 많은 상태입니다.`
                        }
                        {connections > 3 && ' 요소들 간의 연결성이 높아 통합적 사고나 복합적 상황을 다루고 있음을 시사합니다.'}
                      </div>

                      {/* 4. 실천적 조언 */}
                      <div className="text-white/90 leading-relaxed">
                        <span className="font-bold text-purple-300">▸ 권장사항:</span>
                        {' '}
                        {interpretedNodes.length > 0 && (
                          <>
                            꿈에 나타난 <span className="font-bold">"{interpretedNodes[0].name}"</span>
                            {' '}요소는 {interpretedNodes[0].interpretation?.split('.')[0]}를 의미합니다.
                            {' '}
                          </>
                        )}
                        {negativeRatio > 50
                          ? '현재 경험하는 부정적 감정을 일기로 기록하거나 신뢰할 수 있는 사람과 이야기 나누는 것이 도움이 될 수 있습니다. 명상이나 요가 등 이완 기법도 권장됩니다.'
                          : '이 꿈을 통해 얻은 통찰을 일상에 적용해보세요. 꿈 일기를 지속적으로 기록하면 자신의 내면 패턴을 더 깊이 이해할 수 있습니다.'
                        }
                      </div>
                    </>
                  );
                })()}
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