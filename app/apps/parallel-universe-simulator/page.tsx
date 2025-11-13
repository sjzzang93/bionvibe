'use client';

import RelatedApps from '@/app/components/RelatedApps';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Zap, Heart, Briefcase, GraduationCap, Home, Baby, Trophy, Plane, DollarSign, Brain, Target, Shuffle, Star, TrendingUp, Smile, Activity, Users, Book, Music, GamepadIcon, Coffee, Flame } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import AdSense from '@/app/components/AdSense';

interface LifeChoice {
  id: string;
  age: number;
  question: string;
  description: string;
  options: {
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    consequences: {
      career: number;
      love: number;
      wealth: number;
      happiness: number;
      health: number;
    };
    story: string;
  }[];
}

interface RandomEvent {
  type: 'lucky' | 'unlucky' | 'neutral';
  title: string;
  description: string;
  impact: {
    career: number;
    love: number;
    wealth: number;
    happiness: number;
    health: number;
  };
}

interface Universe {
  id: string;
  timeline: {
    age: number;
    choice: string;
    event: string;
    story: string;
  }[];
  stats: {
    career: number;
    love: number;
    wealth: number;
    happiness: number;
    health: number;
  };
  color: string;
  position: THREE.Vector3;
  connections: string[];
  title: string;
  randomEvents: RandomEvent[];
  isMainUniverse: boolean;
}

const RANDOM_EVENTS: RandomEvent[] = [
  {
    type: 'lucky',
    title: '🎉 행운의 만남',
    description: '우연히 만난 사람이 인생을 바꿔놓았어요',
    impact: { career: 15, love: 15, wealth: 10, happiness: 20, health: 5 }
  },
  {
    type: 'lucky',
    title: '💎 뜻밖의 기회',
    description: '예상치 못한 곳에서 기회가 찾아왔어요',
    impact: { career: 20, love: 5, wealth: 25, happiness: 15, health: 0 }
  },
  {
    type: 'unlucky',
    title: '💔 시련의 시간',
    description: '힘든 시기를 겪었지만 성장했어요',
    impact: { career: -10, love: -15, wealth: -10, happiness: -20, health: -15 }
  },
  {
    type: 'unlucky',
    title: '⚠️ 예기치 못한 변화',
    description: '환경이 급격히 변화했어요',
    impact: { career: -15, love: -5, wealth: -20, happiness: -10, health: -10 }
  },
  {
    type: 'neutral',
    title: '🌟 자기 발견',
    description: '진정한 자신을 발견하는 시간을 가졌어요',
    impact: { career: 5, love: 10, wealth: 0, happiness: 25, health: 15 }
  },
  {
    type: 'neutral',
    title: '📚 새로운 배움',
    description: '새로운 것을 배우며 시야가 넓어졌어요',
    impact: { career: 15, love: 5, wealth: 5, happiness: 10, health: 5 }
  }
];

const LIFE_CHOICES: LifeChoice[] = [
  {
    id: 'education',
    age: 18,
    question: '고등학교를 졸업했습니다. 앞으로 어떤 길을 걸을까요?',
    description: '인생의 첫 번째 큰 선택입니다.',
    options: [
      {
        text: '명문대 진학',
        icon: GraduationCap,
        description: '치열한 경쟁 속에서 실력을 키웁니다',
        consequences: { career: 20, love: -5, wealth: 15, happiness: 10, health: -10 },
        story: '명문대에서 뛰어난 인재들과 경쟁하며 성장했습니다. 밤샘 공부가 일상이 되었지만, 탄탄한 기초를 다졌어요.'
      },
      {
        text: '해외 유학',
        icon: Plane,
        description: '넓은 세상에서 글로벌 감각을 익힙니다',
        consequences: { career: 25, love: -10, wealth: -20, happiness: 15, health: 5 },
        story: '낯선 땅에서 혼자 헤쳐나가며 독립심과 글로벌 마인드를 키웠어요. 다양한 문화를 경험했습니다.'
      },
      {
        text: '창업 도전',
        icon: Target,
        description: '젊음을 무기로 과감하게 도전합니다',
        consequences: { career: 30, love: 0, wealth: -10, happiness: 20, health: -15 },
        story: '실패를 두려워하지 않고 도전했어요. 많은 시행착오를 겪었지만 소중한 경험을 얻었습니다.'
      },
      {
        text: '바로 취업',
        icon: Briefcase,
        description: '현실적인 선택으로 빠르게 경험을 쌓습니다',
        consequences: { career: 10, love: 10, wealth: 20, happiness: 5, health: 0 },
        story: '일찍 사회에 나와 실무 경험을 쌓았어요. 동년배보다 빠르게 경제적 자립을 이뤘습니다.'
      }
    ]
  },
  {
    id: 'early-career',
    age: 23,
    question: '첫 직장을 다닌 지 2년이 되었습니다.',
    description: '커리어의 방향을 정할 시간입니다.',
    options: [
      {
        text: '대기업 이직',
        icon: Briefcase,
        description: '안정적이고 체계적인 환경에서 성장합니다',
        consequences: { career: 25, love: -10, wealth: 30, happiness: 0, health: -10 },
        story: '대기업의 체계적인 시스템에서 전문성을 키웠어요. 워라밸은 희생했지만 경력에는 도움이 되었습니다.'
      },
      {
        text: '스타트업 도전',
        icon: Zap,
        description: '빠르게 변화하는 환경에서 다양한 경험을 쌓습니다',
        consequences: { career: 35, love: -15, wealth: -15, happiness: 25, health: -20 },
        story: '하루하루가 변화의 연속이었어요. 밤샘 작업도 많았지만 빠르게 성장할 수 있었습니다.'
      },
      {
        text: '프리랜서 전향',
        icon: Brain,
        description: '자유로운 환경에서 나만의 스타일을 만듭니다',
        consequences: { career: 20, love: 15, wealth: 10, happiness: 30, health: 10 },
        story: '자유로운 근무 환경에서 일과 삶의 균형을 찾았어요. 수입은 불안정했지만 만족도가 높았습니다.'
      },
      {
        text: '대학원 진학',
        icon: Book,
        description: '전문 지식을 심화하며 연구자의 길을 걷습니다',
        consequences: { career: 15, love: 5, wealth: -20, happiness: 15, health: 5 },
        story: '깊이 있는 연구로 전문가의 길을 걸었어요. 경제적으론 어려웠지만 지적 만족감은 컸습니다.'
      }
    ]
  },
  {
    id: 'love',
    age: 28,
    question: '운명 같은 사람을 만났습니다.',
    description: '사랑과 현실 사이에서 선택해야 합니다.',
    options: [
      {
        text: '결혼 결심',
        icon: Heart,
        description: '사랑하는 사람과 평생을 함께하기로 결심합니다',
        consequences: { career: -5, love: 40, wealth: -10, happiness: 30, health: 10 },
        story: '사랑하는 사람과 가정을 꾸렸어요. 책임감이 커졌지만 따뜻한 가정이 큰 힘이 되었습니다.'
      },
      {
        text: '동거 시작',
        icon: Home,
        description: '함께 살며 서로를 더 알아가는 시간을 갖습니다',
        consequences: { career: 5, love: 25, wealth: 5, happiness: 20, health: 5 },
        story: '결혼 전 함께 생활하며 서로를 깊이 이해했어요. 현실적인 문제들도 함께 해결해나갔습니다.'
      },
      {
        text: '커리어 우선',
        icon: Target,
        description: '지금은 커리어에 집중할 시기라고 판단합니다',
        consequences: { career: 30, love: -20, wealth: 25, happiness: -10, health: -5 },
        story: '일에만 몰두했어요. 경력은 크게 성장했지만 때로는 외로움을 느꼈습니다.'
      },
      {
        text: '장거리 연애',
        icon: Plane,
        description: '각자의 길을 걸으며 사랑을 유지합니다',
        consequences: { career: 20, love: 10, wealth: 15, happiness: 0, health: 0 },
        story: '서로의 꿈을 응원하며 거리를 견뎠어요. 만남이 적었지만 신뢰는 더 깊어졌습니다.'
      }
    ]
  },
  {
    id: 'career-growth',
    age: 32,
    question: '일이 손에 잡히고 전문성이 인정받기 시작했습니다.',
    description: '커리어의 황금기를 어떻게 보낼까요?',
    options: [
      {
        text: '승진 레이스',
        icon: TrendingUp,
        description: '조직 내에서 입지를 다지며 올라갑니다',
        consequences: { career: 35, love: -10, wealth: 35, happiness: 10, health: -15 },
        story: '치열한 경쟁을 뚫고 승진했어요. 책임은 무거워졌지만 보람도 컸습니다.'
      },
      {
        text: '전문가 전환',
        icon: Star,
        description: '관리보다는 전문성을 살리는 길을 선택합니다',
        consequences: { career: 30, love: 5, wealth: 25, happiness: 25, health: 5 },
        story: '분야의 전문가로 인정받았어요. 관리 업무보다 실무에서 더 큰 성취감을 느꼈습니다.'
      },
      {
        text: '독립/창업',
        icon: Flame,
        description: '쌓은 경험을 바탕으로 독립합니다',
        consequences: { career: 40, love: -5, wealth: -25, happiness: 30, health: -20 },
        story: '안정을 포기하고 독립했어요. 불안했지만 내 이름으로 일하는 자부심이 컸습니다.'
      },
      {
        text: '워라밸 추구',
        icon: Smile,
        description: '일과 삶의 균형을 찾습니다',
        consequences: { career: 10, love: 20, wealth: 15, happiness: 35, health: 25 },
        story: '적당히 일하고 취미와 가족에 시간을 쏟았어요. 수입은 줄었지만 삶의 질은 높아졌습니다.'
      }
    ]
  },
  {
    id: 'family',
    age: 35,
    question: '가족에 대해 생각하게 되었습니다.',
    description: '어떤 가정을 꾸릴까요?',
    options: [
      {
        text: '아이 갖기',
        icon: Baby,
        description: '생명의 소중함을 배우며 부모가 됩니다',
        consequences: { career: -15, love: 30, wealth: -25, happiness: 35, health: -10 },
        story: '부모가 되면서 삶의 우선순위가 바뀌었어요. 힘들지만 아이의 웃음이 모든 것을 보상했습니다.'
      },
      {
        text: '딩크 선택',
        icon: Users,
        description: '부부만의 삶을 선택합니다',
        consequences: { career: 20, love: 20, wealth: 30, happiness: 20, health: 15 },
        story: '둘만의 시간을 즐겼어요. 경제적 여유로 다양한 경험을 할 수 있었습니다.'
      },
      {
        text: '반려동물과 함께',
        icon: Heart,
        description: '새로운 가족 구성원을 맞이합니다',
        consequences: { career: 10, love: 15, wealth: 15, happiness: 30, health: 10 },
        story: '반려동물이 가족이 되었어요. 책임감도 생겼지만 무조건적인 사랑을 받았습니다.'
      },
      {
        text: '독신 생활',
        icon: Home,
        description: '혼자만의 시간을 소중히 합니다',
        consequences: { career: 25, love: -10, wealth: 30, happiness: 15, health: 15 },
        story: '나만의 시간과 공간을 지켰어요. 외로울 때도 있었지만 자유로웠습니다.'
      }
    ]
  },
  {
    id: 'midlife',
    age: 40,
    question: '인생의 절반을 살았습니다. 이제 어떻게 살까요?',
    description: '인생의 전환점에 서 있습니다.',
    options: [
      {
        text: '새로운 도전',
        icon: Zap,
        description: '늦었다고 생각할 때가 가장 빠른 때입니다',
        consequences: { career: 25, love: 5, wealth: -15, happiness: 30, health: -10 },
        story: '나이는 숫자일 뿐이라는 걸 증명했어요. 새로운 분야에 도전하며 다시 열정을 찾았습니다.'
      },
      {
        text: '현실 안주',
        icon: Home,
        description: '지금 가진 것에 감사하며 삽니다',
        consequences: { career: 5, love: 15, wealth: 20, happiness: 20, health: 15 },
        story: '안정적인 삶을 선택했어요. 평범하지만 행복한 일상을 즐겼습니다.'
      },
      {
        text: '은퇴 준비',
        icon: DollarSign,
        description: '노후를 위한 준비를 시작합니다',
        consequences: { career: -10, love: 10, wealth: 35, happiness: 15, health: 20 },
        story: '미래를 위한 계획을 세웠어요. 당장의 즐거움보다 안정을 선택했습니다.'
      },
      {
        text: '취미에 몰입',
        icon: Music,
        description: '좋아하는 것에 시간을 씁니다',
        consequences: { career: 0, love: 20, wealth: 10, happiness: 40, health: 15 },
        story: '진정 좋아하는 일을 했어요. 돈은 별로 안 됐지만 매일이 즐거웠습니다.'
      }
    ]
  },
  {
    id: 'health-crisis',
    age: 45,
    question: '건강에 적신호가 왔습니다.',
    description: '몸이 보내는 신호를 무시할 수 없습니다.',
    options: [
      {
        text: '라이프스타일 변화',
        icon: Activity,
        description: '생활 습관을 완전히 바꿉니다',
        consequences: { career: -10, love: 10, wealth: -10, happiness: 20, health: 40 },
        story: '건강을 최우선으로 두었어요. 규칙적인 운동과 식습관 개선으로 몸이 달라졌습니다.'
      },
      {
        text: '계속 밀어붙이기',
        icon: Flame,
        description: '쉴 수 없다고 스스로를 몰아붙입니다',
        consequences: { career: 30, love: -10, wealth: 25, happiness: -15, health: -30 },
        story: '건강을 희생하며 일했어요. 성과는 좋았지만 대가가 너무 컸습니다.'
      },
      {
        text: '휴식과 재충전',
        icon: Coffee,
        description: '한발 물러나 쉬어갑니다',
        consequences: { career: -15, love: 20, wealth: 0, happiness: 30, health: 30 },
        story: '잠시 멈추고 쉬었어요. 그동안 놓쳤던 것들을 되찾았습니다.'
      },
      {
        text: '전문가 상담',
        icon: Heart,
        description: '전문가의 도움을 받습니다',
        consequences: { career: 5, love: 15, wealth: -20, happiness: 25, health: 35 },
        story: '전문가의 체계적인 관리를 받았어요. 비용은 들었지만 건강을 되찾았습니다.'
      }
    ]
  },
  {
    id: 'legacy',
    age: 50,
    question: '인생의 후반전, 무엇을 남길까요?',
    description: '내가 이 세상에 남길 흔적을 생각합니다.',
    options: [
      {
        text: '멘토링',
        icon: Users,
        description: '후배들에게 경험을 전수합니다',
        consequences: { career: 15, love: 20, wealth: 5, happiness: 35, health: 10 },
        story: '젊은이들을 가르치며 보람을 느꼈어요. 그들의 성장이 내 자산이 되었습니다.'
      },
      {
        text: '사회공헌',
        icon: Heart,
        description: '나눔의 가치를 실천합니다',
        consequences: { career: 5, love: 25, wealth: -15, happiness: 40, health: 10 },
        story: '가진 것을 나누며 살았어요. 받은 것보다 준 것이 더 많았지만 마음은 풍족했습니다.'
      },
      {
        text: '자서전 집필',
        icon: Book,
        description: '내 이야기를 기록으로 남깁니다',
        consequences: { career: 10, love: 10, wealth: 10, happiness: 30, health: 5 },
        story: '살아온 이야기를 글로 남겼어요. 과거를 돌아보며 의미를 찾았습니다.'
      },
      {
        text: '재산 증식',
        icon: DollarSign,
        description: '자손을 위한 유산을 만듭니다',
        consequences: { career: 20, love: 0, wealth: 40, happiness: 10, health: -10 },
        story: '후손을 위한 재산을 만들었어요. 물질적 유산은 충분했지만 함께할 시간은 부족했습니다.'
      }
    ]
  }
];

const getUniverseTitle = (stats: Universe['stats']): string => {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const avg = total / 5;

  if (stats.wealth > 80 && stats.career > 80) return '💰 억만장자의 우주';
  if (stats.love > 85) return '💕 사랑 가득한 우주';
  if (stats.happiness > 85) return '😊 행복 충만한 우주';
  if (stats.health > 85) return '💪 건강한 우주';
  if (stats.career > 85) return '🏆 성공한 우주';
  if (avg > 80) return '⭐ 완벽한 균형의 우주';
  if (avg > 60) return '🌟 안정적인 우주';
  if (avg > 40) return '🌙 평범한 우주';
  if (avg > 20) return '☁️ 시련의 우주';
  return '🌧️ 고난의 우주';
};

export default function ParallelUniverseSimulator() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const universesRef = useRef<Map<string, THREE.Group>>(new Map());
  const frameRef = useRef<number>(0);
  const starsRef = useRef<THREE.Points | null>(null);
  const timelineRef = useRef<THREE.Mesh | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const [currentAge, setCurrentAge] = useState(0);
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showFinalReport, setShowFinalReport] = useState(false);

  const initThreeJS = useCallback(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    scene.fog = new THREE.FogExp2(0x000510, 0.0008);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 80, 150);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight),
      1.2,
      0.5,
      0.7
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 600;
    controls.minDistance = 30;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0x404080, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x8080ff, 1.5);
    directionalLight.position.set(80, 120, 80);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff80ff, 1, 200);
    pointLight.position.set(-50, 50, -50);
    scene.add(pointLight);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    const starsVertices = [];
    for (let i = 0; i < 15000; i++) {
      const x = (Math.random() - 0.5) * 2500;
      const y = (Math.random() - 0.5) * 2500;
      const z = (Math.random() - 0.5) * 2500;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;

    const timelineGeometry = new THREE.CylinderGeometry(1.5, 1.5, 300, 32);
    const timelineMaterial = new THREE.MeshPhongMaterial({
      color: 0x4040ff,
      emissive: 0x2020ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.25
    });
    const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
    scene.add(timeline);
    timelineRef.current = timeline;
  }, []);

  const createUniverse = (universe: Universe) => {
    const group = new THREE.Group();

    const size = universe.isMainUniverse ? 12 : 8;
    const geometry = new THREE.SphereGeometry(size, 48, 48);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(universe.color),
      emissive: new THREE.Color(universe.color),
      emissiveIntensity: universe.isMainUniverse ? 0.7 : 0.5,
      transparent: true,
      opacity: universe.isMainUniverse ? 0.9 : 0.75,
      shininess: 100
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    group.add(sphere);

    const glowSize = universe.isMainUniverse ? 16 : 11;
    const glowGeometry = new THREE.SphereGeometry(glowSize, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(universe.color),
      transparent: true,
      opacity: 0.15
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);

    if (universe.isMainUniverse) {
      const ringSize = 20;
      const ringGeometry = new THREE.TorusGeometry(ringSize, 0.8, 16, 100);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(universe.color),
        emissive: new THREE.Color(universe.color),
        emissiveIntensity: 0.5
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 100;
      const posArray = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40;
      }
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: new THREE.Color(universe.color),
        transparent: true,
        opacity: 0.6
      });
      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      group.add(particlesMesh);
    }

    group.position.copy(universe.position);
    group.userData = { universeId: universe.id };

    return group;
  };

  const disposeGroup = (group: THREE.Group) => {
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
      if (object instanceof THREE.Points) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  };

  const updateUniverses = () => {
    if (!sceneRef.current) return;

    universesRef.current.forEach((group) => {
      sceneRef.current!.remove(group);
      disposeGroup(group);
    });
    universesRef.current.clear();

    const objectsToRemove: THREE.Object3D[] = [];
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh && object.geometry instanceof THREE.TubeGeometry) {
        objectsToRemove.push(object);
      }
      if (object instanceof THREE.Line) {
        objectsToRemove.push(object);
      }
    });
    objectsToRemove.forEach((object) => {
      sceneRef.current!.remove(object);
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
      if (object instanceof THREE.Line) {
        if ((object as any).geometry) (object as any).geometry.dispose();
        if ((object as any).material) {
          if (Array.isArray((object as any).material)) {
            (object as any).material.forEach((material: any) => material.dispose());
          } else {
            (object as any).material.dispose();
          }
        }
      }
    });

    universes.forEach((universe) => {
      const group = createUniverse(universe);
      universesRef.current.set(universe.id, group);
      sceneRef.current!.add(group);

      universe.connections.forEach((targetId) => {
        const targetUniverse = universes.find(u => u.id === targetId);
        if (targetUniverse) {
          const midPoint = new THREE.Vector3()
            .addVectors(universe.position, targetUniverse.position)
            .multiplyScalar(0.5);
          midPoint.y += 25;

          const curve = new THREE.QuadraticBezierCurve3(
            universe.position,
            midPoint,
            targetUniverse.position
          );

          const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.3, 8, false);
          const tubeMaterial = new THREE.MeshPhongMaterial({
            color: universe.isMainUniverse ? 0x4080ff : 0xff8040,
            emissive: universe.isMainUniverse ? 0x2040ff : 0xff4020,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.4
          });
          const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
          sceneRef.current!.add(tube);
        }
      });
    });
  };

  const handleClick = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const intersects: THREE.Intersection[] = [];
    universesRef.current.forEach((group) => {
      const groupIntersects = raycasterRef.current.intersectObjects(group.children, true);
      intersects.push(...groupIntersects);
    });

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      let parent = clickedObject.parent;
      while (parent && !parent.userData.universeId) {
        parent = parent.parent;
      }
      if (parent && parent.userData.universeId) {
        const universe = universes.find(u => u.id === parent!.userData.universeId);
        if (universe) {
          setSelectedUniverse(universe);
        }
      }
    }
  }, [universes]);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !composerRef.current || !controlsRef.current) return;

    frameRef.current = requestAnimationFrame(animate);

    universesRef.current.forEach((group) => {
      group.rotation.y += 0.003;
      if (group.children[2] && group.children[2] instanceof THREE.Mesh) {
        group.children[2].rotation.z += 0.015;
      }
      if (group.children[3] && group.children[3] instanceof THREE.Points) {
        group.children[3].rotation.y += 0.005;
        group.children[3].rotation.x += 0.003;
      }
    });

    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }

    if (timelineRef.current) {
      timelineRef.current.rotation.y += 0.001;
    }

    controlsRef.current.update();
    composerRef.current.render();
  }, []);

  const makeChoice = (optionIndex: number) => {
    if (currentChoiceIndex >= LIFE_CHOICES.length) return;

    const choice = LIFE_CHOICES[currentChoiceIndex];
    const option = choice.options[optionIndex];

    const newUniverses: Universe[] = [];
    const baseStats = universes.length > 0 && universes[0].isMainUniverse ? universes[0].stats : {
      career: 50,
      love: 50,
      wealth: 50,
      happiness: 50,
      health: 50
    };

    const randomEvent = Math.random() < 0.3 ? RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)] : null;

    let finalStats = {
      career: Math.min(100, Math.max(0, baseStats.career + option.consequences.career)),
      love: Math.min(100, Math.max(0, baseStats.love + option.consequences.love)),
      wealth: Math.min(100, Math.max(0, baseStats.wealth + option.consequences.wealth)),
      happiness: Math.min(100, Math.max(0, baseStats.happiness + option.consequences.happiness)),
      health: Math.min(100, Math.max(0, baseStats.health + option.consequences.health))
    };

    const randomEventsArray: RandomEvent[] = universes[0]?.randomEvents || [];
    if (randomEvent) {
      randomEventsArray.push(randomEvent);
      finalStats = {
        career: Math.min(100, Math.max(0, finalStats.career + randomEvent.impact.career)),
        love: Math.min(100, Math.max(0, finalStats.love + randomEvent.impact.love)),
        wealth: Math.min(100, Math.max(0, finalStats.wealth + randomEvent.impact.wealth)),
        happiness: Math.min(100, Math.max(0, finalStats.happiness + randomEvent.impact.happiness)),
        health: Math.min(100, Math.max(0, finalStats.health + randomEvent.impact.health))
      };
    }

    const chosenUniverse: Universe = {
      id: `universe-${Date.now()}-chosen`,
      timeline: [
        ...(universes[0]?.timeline || []),
        {
          age: choice.age,
          choice: option.text,
          event: `${choice.age}세: ${option.text}`,
          story: option.story
        }
      ],
      stats: finalStats,
      color: '#4080ff',
      position: new THREE.Vector3(
        Math.cos(currentChoiceIndex * 0.5) * (50 + currentChoiceIndex * 8),
        choice.age - 25,
        Math.sin(currentChoiceIndex * 0.5) * (50 + currentChoiceIndex * 8)
      ),
      connections: universes.filter(u => u.isMainUniverse).map(u => u.id),
      title: '',
      randomEvents: randomEventsArray,
      isMainUniverse: true
    };
    chosenUniverse.title = getUniverseTitle(chosenUniverse.stats);
    newUniverses.push(chosenUniverse);

    choice.options.forEach((opt, idx) => {
      if (idx !== optionIndex) {
        let altStats = {
          career: Math.min(100, Math.max(0, baseStats.career + opt.consequences.career)),
          love: Math.min(100, Math.max(0, baseStats.love + opt.consequences.love)),
          wealth: Math.min(100, Math.max(0, baseStats.wealth + opt.consequences.wealth)),
          happiness: Math.min(100, Math.max(0, baseStats.happiness + opt.consequences.happiness)),
          health: Math.min(100, Math.max(0, baseStats.health + opt.consequences.health))
        };

        const altRandomEvent = Math.random() < 0.2 ? RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)] : null;
        if (altRandomEvent) {
          altStats = {
            career: Math.min(100, Math.max(0, altStats.career + altRandomEvent.impact.career)),
            love: Math.min(100, Math.max(0, altStats.love + altRandomEvent.impact.love)),
            wealth: Math.min(100, Math.max(0, altStats.wealth + altRandomEvent.impact.wealth)),
            happiness: Math.min(100, Math.max(0, altStats.happiness + altRandomEvent.impact.happiness)),
            health: Math.min(100, Math.max(0, altStats.health + altRandomEvent.impact.health))
          };
        }

        const altUniverse: Universe = {
          id: `universe-${Date.now()}-alt-${idx}`,
          timeline: [
            ...(universes[0]?.timeline || []),
            {
              age: choice.age,
              choice: opt.text,
              event: `${choice.age}세: ${opt.text}`,
              story: opt.story
            }
          ],
          stats: altStats,
          color: '#ff8040',
          position: new THREE.Vector3(
            Math.cos((currentChoiceIndex + idx * 0.3) * 0.6) * (80 + currentChoiceIndex * 10),
            choice.age - 25,
            Math.sin((currentChoiceIndex + idx * 0.3) * 0.6) * (80 + currentChoiceIndex * 10)
          ),
          connections: universes.filter(u => u.isMainUniverse).map(u => u.id),
          title: '',
          randomEvents: altRandomEvent ? [altRandomEvent] : [],
          isMainUniverse: false
        };
        altUniverse.title = getUniverseTitle(altUniverse.stats);
        newUniverses.push(altUniverse);
      }
    });

    const filteredUniverses = universes.filter(u => !u.isMainUniverse);
    setUniverses([...filteredUniverses, ...newUniverses]);
    setCurrentAge(choice.age);
    setCurrentChoiceIndex(currentChoiceIndex + 1);
    setSelectedUniverse(chosenUniverse);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentAge(0);
    setCurrentChoiceIndex(0);
    setUniverses([]);
    setSelectedUniverse(null);
    setShowComparison(false);
    setShowFinalReport(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentAge(0);
    setCurrentChoiceIndex(0);
    setUniverses([]);
    setSelectedUniverse(null);
    setShowComparison(false);
    setShowFinalReport(false);

    if (sceneRef.current) {
      universesRef.current.forEach((group) => {
        sceneRef.current!.remove(group);
        disposeGroup(group);
      });
      universesRef.current.clear();

      const objectsToRemove: THREE.Object3D[] = [];
      sceneRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh && object.geometry instanceof THREE.TubeGeometry) {
          objectsToRemove.push(object);
        }
      });
      objectsToRemove.forEach((object) => {
        sceneRef.current!.remove(object);
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
      });
    }
  };

  useEffect(() => {
    initThreeJS();
    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      if (controlsRef.current) controlsRef.current.dispose();
      if (composerRef.current) {
        composerRef.current.renderTarget1?.dispose();
        composerRef.current.renderTarget2?.dispose();
      }
      if (rendererRef.current) {
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      universesRef.current.forEach((group) => disposeGroup(group));
      universesRef.current.clear();
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      composerRef.current = null;
      starsRef.current = null;
      timelineRef.current = null;
    };
  }, [initThreeJS, animate]);

  useEffect(() => {
    updateUniverses();
  }, [universes]);

  useEffect(() => {
    const renderer = rendererRef.current?.domElement;
    if (renderer) {
      renderer.addEventListener('click', handleClick);
      return () => renderer.removeEventListener('click', handleClick);
    }
  }, [handleClick]);

  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentChoice = currentChoiceIndex < LIFE_CHOICES.length ? LIFE_CHOICES[currentChoiceIndex] : null;
  const mainUniverse = universes.find(u => u.isMainUniverse);
  const alternateUniverses = universes.filter(u => !u.isMainUniverse);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            평행우주 시뮬레이터
          </h1>
          <p className="text-lg md:text-xl text-gray-300 flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-5 h-5" />
            당신의 선택이 만드는 무한한 가능성의 우주
            <Globe className="w-5 h-5" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-slate-900/50 border-blue-500/30">
              <CardContent className="p-0">
                <div ref={mountRef} className="w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden cursor-pointer" />
              </CardContent>
            </Card>

            {showComparison && mainUniverse && alternateUniverses.length > 0 && (
              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    우주 비교 분석
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['career', 'love', 'wealth', 'happiness', 'health'].map((key) => (
                      <div key={key}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm capitalize">{key === 'career' ? '커리어' : key === 'love' ? '사랑' : key === 'wealth' ? '부' : key === 'happiness' ? '행복' : '건강'}</span>
                          <span className="text-sm font-bold">{mainUniverse.stats[key as keyof typeof mainUniverse.stats]}점</span>
                        </div>
                        <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="absolute h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${mainUniverse.stats[key as keyof typeof mainUniverse.stats]}%` }}
                          />
                          {alternateUniverses.slice(0, 3).map((alt, idx) => (
                            <div
                              key={alt.id}
                              className="absolute top-0 h-full w-1 bg-red-500/60"
                              style={{ left: `${alt.stats[key as keyof typeof alt.stats]}%` }}
                              title={`평행우주 ${idx + 1}: ${alt.stats[key as keyof typeof alt.stats]}점`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            {!isSimulating ? (
              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-center">시뮬레이션 시작</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-gray-300 text-sm md:text-base space-y-2">
                    <p>✨ 인생의 8가지 중요한 순간</p>
                    <p>🌌 매 선택마다 생성되는 평행우주</p>
                    <p>🎲 예측 불가능한 랜덤 이벤트</p>
                    <p>📊 상세한 통계와 분석</p>
                  </div>
                  <Button
                    onClick={startSimulation}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                  >
                    <Zap className="mr-2" />
                    시뮬레이션 시작
                  </Button>
                </CardContent>
              </Card>
            ) : currentChoice ? (
              <Card className="bg-slate-900/50 border-cyan-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg md:text-xl">선택의 순간</CardTitle>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      {currentChoice.age}세
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400 mt-2">{currentChoice.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base md:text-lg text-gray-200 font-medium">{currentChoice.question}</p>
                  <div className="space-y-3">
                    {currentChoice.options.map((option, idx) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={idx}
                          onClick={() => makeChoice(idx)}
                          className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/70 border border-slate-600/50 text-left p-4 h-auto transition-all hover:scale-[1.02]"
                        >
                          <Icon className="mr-3 w-5 h-5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm md:text-base">{option.text}</div>
                            <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                            <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                              {option.consequences.career !== 0 && <span>커리어 {option.consequences.career > 0 ? '+' : ''}{option.consequences.career}</span>}
                              {option.consequences.love !== 0 && <span>사랑 {option.consequences.love > 0 ? '+' : ''}{option.consequences.love}</span>}
                              {option.consequences.wealth !== 0 && <span>부 {option.consequences.wealth > 0 ? '+' : ''}{option.consequences.wealth}</span>}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-center">시뮬레이션 완료</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-center text-sm md:text-base">
                    모든 선택이 완료되었습니다. 당신의 평행우주들을 탐험해보세요!
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => setShowFinalReport(!showFinalReport)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Star className="mr-2 w-4 h-4" />
                      최종 리포트 {showFinalReport ? '닫기' : '보기'}
                    </Button>
                    <Button
                      onClick={() => setShowComparison(!showComparison)}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    >
                      <TrendingUp className="mr-2 w-4 h-4" />
                      우주 비교 {showComparison ? '닫기' : '보기'}
                    </Button>
                    <Button
                      onClick={resetSimulation}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Shuffle className="mr-2 w-4 h-4" />
                      다시 시작
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {universes.length > 0 && (
              <Card className="bg-slate-900/50 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">우주 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">생성된 우주</span>
                      <span className="font-bold text-yellow-400">{universes.length}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">현재 나이</span>
                      <span className="font-bold text-cyan-400">{currentAge}세</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">남은 선택</span>
                      <span className="font-bold text-purple-400">{Math.max(0, LIFE_CHOICES.length - currentChoiceIndex)}개</span>
                    </div>
                    {mainUniverse && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">현재 우주</span>
                        <span className="font-bold text-green-400">{mainUniverse.title}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedUniverse && (
              <Card className="bg-slate-900/50 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    {selectedUniverse.isMainUniverse ? '🌟' : '🌙'} {selectedUniverse.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="text-gray-400">커리어</div>
                        <div className="font-bold text-blue-400">{selectedUniverse.stats.career}%</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="text-gray-400">사랑</div>
                        <div className="font-bold text-pink-400">{selectedUniverse.stats.love}%</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="text-gray-400">부</div>
                        <div className="font-bold text-yellow-400">{selectedUniverse.stats.wealth}%</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="text-gray-400">행복</div>
                        <div className="font-bold text-green-400">{selectedUniverse.stats.happiness}%</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2 col-span-2">
                        <div className="text-gray-400">건강</div>
                        <div className="font-bold text-cyan-400">{selectedUniverse.stats.health}%</div>
                      </div>
                    </div>

                    {selectedUniverse.randomEvents.length > 0 && (
                      <div className="bg-slate-800/30 rounded p-3">
                        <div className="text-xs font-bold text-purple-400 mb-2">🎲 발생한 이벤트</div>
                        <div className="space-y-1">
                          {selectedUniverse.randomEvents.map((event, idx) => (
                            <div key={idx} className="text-xs text-gray-300">
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 max-h-48 overflow-y-auto space-y-2">
                      {selectedUniverse.timeline.map((event, idx) => (
                        <div key={idx} className="bg-slate-800/30 rounded p-2">
                          <div className="font-bold text-cyan-400">{event.event}</div>
                          <div className="text-gray-500 mt-1">{event.story}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {showFinalReport && mainUniverse && (
              <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    인생 최종 리포트
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold mb-2">{mainUniverse.title}</div>
                    <div className="text-xs md:text-sm text-gray-300">
                      {LIFE_CHOICES.length}번의 선택으로 만들어진 당신의 우주
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-xs md:text-sm font-bold text-yellow-400 mb-2">📊 종합 평가</div>
                      <div className="text-xs md:text-sm text-gray-300">
                        총점: {Object.values(mainUniverse.stats).reduce((a, b) => a + b, 0)}점 / 500점
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-xs md:text-sm font-bold text-blue-400 mb-2">🌟 최고 능력치</div>
                      <div className="text-xs md:text-sm text-gray-300">
                        {Object.entries(mainUniverse.stats)
                          .sort((a, b) => b[1] - a[1])[0][0] === 'career' ? '커리어' :
                           Object.entries(mainUniverse.stats).sort((a, b) => b[1] - a[1])[0][0] === 'love' ? '사랑' :
                           Object.entries(mainUniverse.stats).sort((a, b) => b[1] - a[1])[0][0] === 'wealth' ? '부' :
                           Object.entries(mainUniverse.stats).sort((a, b) => b[1] - a[1])[0][0] === 'happiness' ? '행복' : '건강'
                        } ({Object.entries(mainUniverse.stats).sort((a, b) => b[1] - a[1])[0][1]}점)
                      </div>
                    </div>

                    {mainUniverse.randomEvents.length > 0 && (
                      <div className="bg-slate-800/50 rounded p-3">
                        <div className="text-xs md:text-sm font-bold text-purple-400 mb-2">🎲 인생의 변곡점</div>
                        <div className="text-xs md:text-sm text-gray-300">
                          {mainUniverse.randomEvents.length}번의 특별한 이벤트를 경험했습니다
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-xs md:text-sm font-bold text-green-400 mb-2">💭 인생 요약</div>
                      <div className="text-xs md:text-sm text-gray-300 leading-relaxed">
                        {mainUniverse.stats.happiness > 70 ? '행복한 ' : mainUniverse.stats.happiness > 40 ? '평범한 ' : '시련 많은 '}
                        인생을 살았습니다.
                        {mainUniverse.stats.career > 70 ? ' 커리어에서 큰 성공을 거두었고,' : ''}
                        {mainUniverse.stats.love > 70 ? ' 사랑하는 사람들과 행복한 시간을 보냈으며,' : ''}
                        {mainUniverse.stats.wealth > 70 ? ' 경제적으로 풍요로웠고,' : ''}
                        {mainUniverse.stats.health > 70 ? ' 건강도 잘 유지했습니다.' : ' 건강 관리에 더 신경 썼으면 좋았을 것 같습니다.'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

    <RelatedApps currentAppSlug="parallel-universe-simulator" />

    </div>
  );
}
