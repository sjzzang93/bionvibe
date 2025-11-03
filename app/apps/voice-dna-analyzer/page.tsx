'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Volume2, Dna, Sparkles, Activity, Zap, Brain, Heart, Shield } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

interface VoiceProfile {
  pitch: number;
  tone: number;
  speed: number;
  emotion: number;
  confidence: number;
  uniqueness: number;
  resonance: number;
  articulation: number;
  breathControl: number;
  vocalRange: number;
  warmth: number;
  clarity: number;
}

interface VoicePersonality {
  type: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  tips: string[];
  compatibility: string[];
  color: string;
  icon: any;
  detailedAnalysis: string;
}

interface DNANode {
  position: THREE.Vector3;
  color: string;
  size: number;
  frequency: number;
  amplitude: number;
}

const VOICE_PERSONALITIES: VoicePersonality[] = [
  {
    type: '카리스마틱 리더형',
    description: '강력하고 자신감 넘치는 목소리로 사람들을 자연스럽게 이끕니다. 높은 에너지와 확신에 찬 어조가 청중에게 강한 인상을 남깁니다.',
    strengths: ['강력한 설득력', '타고난 카리스마', '빠른 결단력', '대중 연설 능력', '위기 대응력'],
    weaknesses: ['지나친 주도권 행사', '타인 의견 경청 부족', '감정적 공감 부족'],
    careers: ['CEO/경영자', '정치인', '변호사', '영업 관리자', '강연가', '군인/경찰', '프로젝트 매니저', '스타트업 대표'],
    tips: [
      '타인의 의견을 경청하는 시간을 의도적으로 가지세요',
      '목소리 톤을 상황에 맞게 조절하는 연습이 필요합니다',
      '부드러운 어조로 공감을 표현하는 연습을 하세요',
      '일방적 지시보다 협력적 소통을 시도해보세요'
    ],
    compatibility: ['공감형', '분석형'],
    color: '#ff6b6b',
    icon: Zap,
    detailedAnalysis: '당신의 목소리는 천성적인 리더의 자질을 보여줍니다. 명확한 발음과 강한 성량은 사람들의 주목을 끌고, 확신에 찬 어조는 신뢰를 형성합니다. 그룹 상황에서 자연스럽게 주도권을 잡으며, 중요한 결정이 필요한 순간에 빛을 발합니다. 다만 때로는 지나치게 강한 목소리가 상대방을 압도할 수 있으니, 상황에 따라 톤을 조절하는 유연성을 기르는 것이 좋습니다.'
  },
  {
    type: '따뜻한 공감형',
    description: '부드럽고 따뜻한 목소리로 사람들의 마음을 어루만지고 위로를 전합니다. 감정적 교류에 뛰어나며 진심이 느껴지는 소통을 합니다.',
    strengths: ['뛰어난 경청 능력', '감정적 교감', '자연스러운 친화력', '섬세한 배려', '진정성 있는 소통'],
    weaknesses: ['지나친 감정 이입', '명확한 거절 어려움', '비판적 상황 대응 약함'],
    careers: ['상담사/심리치료사', '교사/교수', '간호사', '사회복지사', '고객 서비스', 'HR 담당자', '유치원 교사', '코치/멘토'],
    tips: [
      '때로는 단호한 태도도 필요합니다. 거절하는 연습을 하세요',
      '자신의 감정과 타인의 감정을 구분하는 경계를 설정하세요',
      '비판적 피드백도 사랑의 표현임을 기억하세요',
      '자신의 의견을 명확히 전달하는 연습이 필요합니다'
    ],
    compatibility: ['리더형', '창의형'],
    color: '#4ecdc4',
    icon: Heart,
    detailedAnalysis: '당신의 목소리에는 타인을 치유하는 힘이 있습니다. 부드러운 톤과 따뜻한 감정 표현은 상대방이 마음을 열고 진솔하게 대화할 수 있는 안전한 공간을 만듭니다. 사람들은 당신과 대화한 후 위로받고 이해받았다는 느낌을 받습니다. 이는 대인관계에서 큰 강점이지만, 때로는 자신의 필요를 명확히 표현하고 경계를 설정하는 것도 중요합니다.'
  },
  {
    type: '논리적 분석형',
    description: '차분하고 이성적인 목소리로 복잡한 정보를 명확하게 전달합니다. 객관적이고 체계적인 소통으로 신뢰를 구축합니다.',
    strengths: ['논리적 사고', '명확한 정보 전달', '객관적 판단', '체계적 설명', '높은 신뢰도'],
    weaknesses: ['감정 표현 부족', '지나친 완벽주의', '유연성 부족'],
    careers: ['연구원/과학자', '의사', '변호사', '회계사', 'IT 전문가', '교수', '엔지니어', '컨설턴트'],
    tips: [
      '감정을 표현하는 것도 의사소통의 중요한 부분입니다',
      '때로는 완벽함보다 신속함이 필요한 상황이 있습니다',
      '목소리에 감정을 실어 말하는 연습을 해보세요',
      '일상 대화에서는 좀 더 편안한 톤을 사용해보세요'
    ],
    compatibility: ['리더형', '안정형'],
    color: '#45b7d1',
    icon: Brain,
    detailedAnalysis: '당신의 목소리는 지성과 신뢰성을 전달합니다. 차분한 어조와 명확한 발음은 복잡한 개념도 쉽게 이해할 수 있게 만들며, 사람들은 당신의 말을 믿고 따릅니다. 전문적인 환경에서 특히 빛을 발하며, 데이터와 논리에 기반한 의사결정에 강점을 보입니다. 다만 감정적 교류가 필요한 상황에서는 좀 더 따뜻한 표현을 더하면 더욱 효과적인 소통이 가능합니다.'
  },
  {
    type: '독창적 창의형',
    description: '독특하고 표현력 풍부한 목소리로 사람들의 상상력을 자극합니다. 개성 있는 억양과 리듬으로 주목을 끕니다.',
    strengths: ['뛰어난 표현력', '독창적 사고', '풍부한 상상력', '유연한 적응력', '예술적 감각'],
    weaknesses: ['일관성 부족', '체계적 업무 어려움', '집중력 분산'],
    careers: ['예술가', '디자이너', '작가', '마케터', '방송인', '배우/성우', '크리에이티브 디렉터', '유튜버/인플루언서'],
    tips: [
      '창의성과 체계성의 균형을 맞추는 연습이 필요합니다',
      '중요한 업무에서는 일관된 목소리 톤을 유지하세요',
      '때로는 단순하고 명확한 표현이 더 효과적입니다',
      '청중의 이해도를 확인하며 소통하세요'
    ],
    compatibility: ['공감형', '창의형'],
    color: '#f7b731',
    icon: Sparkles,
    detailedAnalysis: '당신의 목소리는 예술 작품과 같습니다. 다양한 톤과 리듬의 변화는 청중을 사로잡고, 독특한 억양은 기억에 오래 남습니다. 창의적인 아이디어를 전달할 때 특히 효과적이며, 사람들에게 영감을 주는 능력이 있습니다. 다만 전문적이거나 격식 있는 상황에서는 좀 더 일관된 톤을 유지하면 신뢰도를 높일 수 있습니다.'
  },
  {
    type: '안정적 신뢰형',
    description: '일관되고 믿음직한 목소리로 주변에 안정감을 줍니다. 흔들림 없는 어조로 장기적 신뢰를 구축합니다.',
    strengths: ['높은 일관성', '믿을 수 있는 신뢰성', '뛰어난 인내심', '차분한 대응', '안정적 소통'],
    weaknesses: ['변화 대응 느림', '감정 표현 제한적', '열정 부족으로 보일 수 있음'],
    careers: ['공무원', '은행원', '보험설계사', '교사', '관리자', '약사', '사서', '품질관리'],
    tips: [
      '때로는 열정적인 표현도 시도해보세요',
      '변화하는 상황에 유연하게 대응하는 연습이 필요합니다',
      '목소리에 감정의 변화를 더해보세요',
      '적극적으로 의견을 제시하는 것도 좋은 소통입니다'
    ],
    compatibility: ['분석형', '공감형'],
    color: '#5f27cd',
    icon: Shield,
    detailedAnalysis: '당신의 목소리는 든든한 바위와 같습니다. 일관된 톤과 차분한 어조는 불안한 상황에서도 사람들에게 안정감을 주며, 장기적인 관계에서 깊은 신뢰를 형성합니다. 예측 가능하고 믿을 수 있는 소통 스타일은 팀워크와 협업에 매우 유리합니다. 다만 가끔은 더 다양한 감정 표현과 열정을 보여준다면 더욱 매력적인 커뮤니케이터가 될 수 있습니다.'
  },
  {
    type: '활기찬 에너자이저형',
    description: '밝고 경쾌한 목소리로 주변 분위기를 활기차게 만듭니다. 긍정적 에너지가 전염되어 사람들을 동기부여합니다.',
    strengths: ['긍정적 에너지', '뛰어난 동기부여', '즉흥적 대응력', '사교성', '분위기 메이커'],
    weaknesses: ['진지함 부족', '깊이 있는 대화 어려움', '집중력 분산'],
    careers: ['이벤트 기획자', '피트니스 트레이너', '영업 사원', '방송인', '엔터테이너', '여행 가이드', '파티 플래너', 'SNS 마케터'],
    tips: [
      '진지한 상황에서는 톤을 조절하는 연습이 필요합니다',
      '경청하는 시간을 충분히 가지세요',
      '깊이 있는 대화도 시도해보세요',
      '상대방의 페이스에 맞추는 유연성을 기르세요'
    ],
    compatibility: ['창의형', '리더형'],
    color: '#ff9ff3',
    icon: Activity,
    detailedAnalysis: '당신의 목소리에는 태양 같은 에너지가 있습니다. 밝고 활기찬 톤은 우울한 분위기도 순식간에 바꾸며, 사람들은 당신과 함께 있으면 기분이 좋아집니다. 팀의 사기를 북돋우고 긍정적인 문화를 만드는 데 탁월한 능력을 보입니다. 다만 때로는 차분하고 진지한 대화가 필요한 순간도 있으니, 상황에 맞는 톤 조절 능력을 기르면 더욱 효과적인 소통이 가능합니다.'
  },
  {
    type: '전문가 권위형',
    description: '깊이 있고 무게감 있는 목소리로 전문성과 권위를 전달합니다. 경험과 지식이 묻어나는 소통을 합니다.',
    strengths: ['높은 전문성', '자연스러운 권위', '깊이 있는 통찰', '신중한 판단', '멘토링 능력'],
    weaknesses: ['권위적으로 보일 수 있음', '접근성 부족', '융통성 부족'],
    careers: ['전문의', '변호사', '교수', '판사', '대기업 임원', '고문', '학자', 'C레벨 임원'],
    tips: [
      '더 친근하고 접근하기 쉬운 톤을 개발하세요',
      '후배나 부하 직원의 의견도 존중하는 태도를 보이세요',
      '권위보다 협력을 강조하는 소통을 시도하세요',
      '유머를 적절히 사용하면 친근감이 높아집니다'
    ],
    compatibility: ['분석형', '안정형'],
    color: '#0abde3',
    icon: Shield,
    detailedAnalysis: '당신의 목소리에는 오랜 경험과 깊은 지식이 담겨 있습니다. 무게감 있는 톤과 신중한 말투는 자연스럽게 권위를 형성하며, 사람들은 당신의 조언을 진지하게 받아들입니다. 중요한 결정을 내리거나 전문적 의견을 제시할 때 큰 영향력을 발휘합니다. 다만 때로는 좀 더 친근하고 개방적인 태도를 보인다면 더 많은 사람들과 소통할 수 있습니다.'
  }
];

export default function VoiceDNAAnalyzer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dnaGroupRef = useRef<THREE.Group | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frameRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [voicePersonality, setVoicePersonality] = useState<VoicePersonality | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [dnaNodes, setDnaNodes] = useState<DNANode[]>([]);

  const initThreeJS = useCallback(() => {
    if (!mountRef.current) return;

    // Scene with gradient background
    const scene = new THREE.Scene();

    // Create gradient background using ShaderMaterial
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;

      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `;

    const uniforms = {
      topColor: { value: new THREE.Color(0x0d1b2a) },
      bottomColor: { value: new THREE.Color(0x1b263b) },
      offset: { value: 400 },
      exponent: { value: 0.6 }
    };

    const skyGeo = new THREE.SphereGeometry(500, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    scene.fog = new THREE.FogExp2(0x0d1b2a, 0.001);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    controls.minDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffff00, 1, 100);
    pointLight3.position.set(0, 0, -30);
    scene.add(pointLight3);

    // Create DNA group
    const dnaGroup = new THREE.Group();
    dnaGroupRef.current = dnaGroup;
    scene.add(dnaGroup);

    // Add particles for background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particlesVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      particlesVertices.push(x, y, z);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    return () => {
      // Cleanup Three.js resources
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of all geometries and materials in the scene
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
          if (object instanceof THREE.Points) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        scene.clear();
      }

      // Dispose of controls
      if (controls) {
        controls.dispose();
      }

      // Dispose of composer
      if (composer) {
        composer.dispose();
      }

      // Dispose of renderer
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  const createDNAHelix = useCallback((frequencyData: Uint8Array) => {
    if (!dnaGroupRef.current) return;

    // Clear existing DNA with proper disposal
    while (dnaGroupRef.current.children.length > 0) {
      const child = dnaGroupRef.current.children[0];
      if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
      dnaGroupRef.current.remove(child);
    }

    const nodes: DNANode[] = [];
    const helixHeight = 40;
    const helixRadius = 10;
    const segments = 64;

    // Create double helix structure
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const angle1 = t * Math.PI * 8;
      const angle2 = angle1 + Math.PI;
      const y = (t - 0.5) * helixHeight;

      const freqIndex = Math.floor((i / segments) * frequencyData.length);
      const amplitude = frequencyData[freqIndex] / 255;

      // First strand
      const x1 = Math.cos(angle1) * helixRadius * (1 + amplitude * 0.5);
      const z1 = Math.sin(angle1) * helixRadius * (1 + amplitude * 0.5);

      // Second strand
      const x2 = Math.cos(angle2) * helixRadius * (1 + amplitude * 0.5);
      const z2 = Math.sin(angle2) * helixRadius * (1 + amplitude * 0.5);

      // Create nodes for strands
      const node1: DNANode = {
        position: new THREE.Vector3(x1, y, z1),
        color: `hsl(${(t * 360) % 360}, 100%, 50%)`,
        size: 1 + amplitude * 2,
        frequency: freqIndex,
        amplitude: amplitude
      };

      const node2: DNANode = {
        position: new THREE.Vector3(x2, y, z2),
        color: `hsl(${((t * 360) + 180) % 360}, 100%, 50%)`,
        size: 1 + amplitude * 2,
        frequency: freqIndex,
        amplitude: amplitude
      };

      nodes.push(node1, node2);

      // Create sphere for node1
      const geometry1 = new THREE.SphereGeometry(node1.size * 0.3, 16, 16);
      const material1 = new THREE.MeshPhongMaterial({
        color: new THREE.Color(node1.color),
        emissive: new THREE.Color(node1.color),
        emissiveIntensity: 0.5
      });
      const sphere1 = new THREE.Mesh(geometry1, material1);
      sphere1.position.copy(node1.position);
      dnaGroupRef.current.add(sphere1);

      // Create sphere for node2
      const geometry2 = new THREE.SphereGeometry(node2.size * 0.3, 16, 16);
      const material2 = new THREE.MeshPhongMaterial({
        color: new THREE.Color(node2.color),
        emissive: new THREE.Color(node2.color),
        emissiveIntensity: 0.5
      });
      const sphere2 = new THREE.Mesh(geometry2, material2);
      sphere2.position.copy(node2.position);
      dnaGroupRef.current.add(sphere2);

      // Create connection between strands
      if (i % 4 === 0) {
        const connectionGeometry = new THREE.CylinderGeometry(0.1, 0.1, node1.position.distanceTo(node2.position));
        const connectionMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.6
        });
        const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);

        connection.position.copy(node1.position);
        connection.position.add(node2.position);
        connection.position.multiplyScalar(0.5);

        connection.lookAt(node2.position);
        connection.rotateX(Math.PI / 2);

        dnaGroupRef.current.add(connection);
      }
    }

    // Create backbone curves
    const curve1Points = [];
    const curve2Points = [];
    for (let i = 0; i < nodes.length; i += 2) {
      curve1Points.push(nodes[i].position);
      if (i + 1 < nodes.length) {
        curve2Points.push(nodes[i + 1].position);
      }
    }

    if (curve1Points.length > 2) {
      const curve1 = new THREE.CatmullRomCurve3(curve1Points);
      const tubeGeometry1 = new THREE.TubeGeometry(curve1, 100, 0.2, 8, false);
      const tubeMaterial1 = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
      });
      const tube1 = new THREE.Mesh(tubeGeometry1, tubeMaterial1);
      dnaGroupRef.current.add(tube1);
    }

    if (curve2Points.length > 2) {
      const curve2 = new THREE.CatmullRomCurve3(curve2Points);
      const tubeGeometry2 = new THREE.TubeGeometry(curve2, 100, 0.2, 8, false);
      const tubeMaterial2 = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
      });
      const tube2 = new THREE.Mesh(tubeGeometry2, tubeMaterial2);
      dnaGroupRef.current.add(tube2);
    }

    setDnaNodes(nodes);
  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !composerRef.current || !controlsRef.current) return;

    frameRef.current = requestAnimationFrame(animate);

    // Rotate DNA
    if (dnaGroupRef.current) {
      dnaGroupRef.current.rotation.y += 0.005;
    }

    // Update frequency visualization if recording
    if (isRecording && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      setFrequencyData(dataArray);
      createDNAHelix(dataArray);
    }

    controlsRef.current.update();
    composerRef.current.render();
  }, [isRecording, createDNAHelix]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      source.connect(analyser);

      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      const startTime = Date.now();
      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(elapsed);

        if (elapsed >= 10) {
          stopRecording();
          clearInterval(timerInterval);
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Simulate analysis
    setTimeout(() => {
      analyzeVoice();
    }, 2000);
  };

  const analyzeVoice = () => {
    // Generate comprehensive voice profile based on actual frequency data
    let profile: VoiceProfile;

    if (analyserRef.current && frequencyData) {
      // Use actual frequency data from recording
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate comprehensive audio metrics
      const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const maxFrequency = Math.max(...Array.from(dataArray));
      const minFrequency = Math.min(...Array.from(dataArray).filter(v => v > 0)) || 0;

      // Split into detailed frequency bands
      const veryLowFreqEnd = Math.floor(dataArray.length / 6);  // 0-85Hz: Fundamental
      const lowFreqEnd = Math.floor(dataArray.length / 3);       // 85-340Hz: Warmth
      const lowMidFreqEnd = Math.floor(dataArray.length / 2);   // 340-1300Hz: Body
      const midFreqEnd = Math.floor(2 * dataArray.length / 3);  // 1300-2600Hz: Presence
      const highMidFreqEnd = Math.floor(5 * dataArray.length / 6); // 2600-5200Hz: Clarity

      const veryLowFreq = dataArray.slice(0, veryLowFreqEnd).reduce((sum, val) => sum + val, 0) / veryLowFreqEnd;
      const lowFreq = dataArray.slice(veryLowFreqEnd, lowFreqEnd).reduce((sum, val) => sum + val, 0) / (lowFreqEnd - veryLowFreqEnd);
      const lowMidFreq = dataArray.slice(lowFreqEnd, lowMidFreqEnd).reduce((sum, val) => sum + val, 0) / (lowMidFreqEnd - lowFreqEnd);
      const midFreq = dataArray.slice(lowMidFreqEnd, midFreqEnd).reduce((sum, val) => sum + val, 0) / (midFreqEnd - lowMidFreqEnd);
      const highMidFreq = dataArray.slice(midFreqEnd, highMidFreqEnd).reduce((sum, val) => sum + val, 0) / (highMidFreqEnd - midFreqEnd);
      const highFreq = dataArray.slice(highMidFreqEnd).reduce((sum, val) => sum + val, 0) / (dataArray.length - highMidFreqEnd);

      // Calculate variance and statistical measures
      const variance = dataArray.reduce((sum, val) => sum + Math.pow(val - avgFrequency, 2), 0) / dataArray.length;
      const stdDev = Math.sqrt(variance);

      // Calculate dynamic range
      const dynamicRange = maxFrequency - minFrequency;

      // Calculate spectral centroid (brightness)
      let weightedSum = 0;
      let totalEnergy = 0;
      for (let i = 0; i < dataArray.length; i++) {
        weightedSum += i * dataArray[i];
        totalEnergy += dataArray[i];
      }
      const spectralCentroid = totalEnergy > 0 ? weightedSum / totalEnergy : 0;

      // Calculate zero-crossing rate estimation (articulation)
      let energyFluctuations = 0;
      for (let i = 1; i < dataArray.length; i++) {
        energyFluctuations += Math.abs(dataArray[i] - dataArray[i - 1]);
      }
      const articulation = energyFluctuations / dataArray.length;

      profile = {
        // Core metrics (기본 음성 특성)
        pitch: Math.min(100, (highFreq / 255) * 120), // High frequency content
        tone: Math.min(100, (midFreq / 255) * 110), // Mid frequency richness
        speed: Math.min(100, (articulation / 255) * 130), // Rate of change
        emotion: Math.min(100, ((dynamicRange / 255) * 100) + 10), // Dynamic range
        confidence: Math.min(100, (lowFreq / 255) * 120), // Low frequency power
        uniqueness: Math.min(100, (stdDev / 255) * 150), // Statistical variance

        // Advanced metrics (고급 음성 특성)
        resonance: Math.min(100, (lowMidFreq / 255) * 110), // Body and resonance
        articulation: Math.min(100, (articulation / 255) * 140), // Clarity of pronunciation
        breathControl: Math.min(100, ((255 - Math.abs(avgFrequency - 127)) / 255) * 120), // Stability
        vocalRange: Math.min(100, (dynamicRange / 255) * 100), // Range of expression
        warmth: Math.min(100, ((veryLowFreq + lowFreq) / 510) * 110), // Warmth quality
        clarity: Math.min(100, (spectralCentroid / dataArray.length) * 120) // Brightness and clarity
      };
    } else {
      // Fallback with more realistic distributions
      profile = {
        pitch: 40 + Math.random() * 50,
        tone: 45 + Math.random() * 45,
        speed: 35 + Math.random() * 55,
        emotion: 30 + Math.random() * 60,
        confidence: 40 + Math.random() * 50,
        uniqueness: 35 + Math.random() * 55,
        resonance: 40 + Math.random() * 50,
        articulation: 45 + Math.random() * 45,
        breathControl: 50 + Math.random() * 40,
        vocalRange: 35 + Math.random() * 55,
        warmth: 40 + Math.random() * 50,
        clarity: 45 + Math.random() * 45
      };
    }

    setVoiceProfile(profile);

    // Advanced personality type determination
    let personalityIndex = 0;

    // Calculate weighted scores for each personality type
    const leaderScore = (profile.confidence * 0.35) + (profile.pitch * 0.25) + (profile.clarity * 0.20) + (profile.emotion * 0.20);
    const empathyScore = (profile.warmth * 0.30) + (profile.tone * 0.25) + (profile.emotion * 0.25) + (profile.resonance * 0.20);
    const analyticalScore = (profile.clarity * 0.30) + (profile.articulation * 0.25) + (profile.breathControl * 0.25) + ((100 - profile.speed) * 0.20);
    const creativeScore = (profile.uniqueness * 0.35) + (profile.vocalRange * 0.25) + (profile.emotion * 0.20) + (profile.articulation * 0.20);
    const stableScore = (profile.breathControl * 0.30) + ((100 - profile.uniqueness) * 0.25) + (profile.resonance * 0.25) + ((100 - profile.speed) * 0.20);
    const energeticScore = (profile.speed * 0.30) + (profile.emotion * 0.25) + (profile.pitch * 0.25) + (profile.vocalRange * 0.20);
    const authorityScore = (profile.confidence * 0.30) + (profile.resonance * 0.25) + (profile.clarity * 0.25) + (profile.breathControl * 0.20);

    const scores = [leaderScore, empathyScore, analyticalScore, creativeScore, stableScore, energeticScore, authorityScore];
    personalityIndex = scores.indexOf(Math.max(...scores));

    setVoicePersonality(VOICE_PERSONALITIES[personalityIndex]);
    setIsAnalyzing(false);

    // Create final DNA visualization with profile data
    const finalData = new Uint8Array(128);
    for (let i = 0; i < finalData.length; i++) {
      // Use actual profile data to create DNA pattern
      const metrics = [profile.pitch, profile.tone, profile.speed, profile.emotion, profile.confidence, profile.uniqueness,
                       profile.resonance, profile.articulation, profile.breathControl, profile.vocalRange, profile.warmth, profile.clarity];
      const baseValue = metrics[i % metrics.length];
      finalData[i] = (baseValue / 100) * 255;
    }
    createDNAHelix(finalData);
  };

  const reset = () => {
    // Stop recording if active
    if (isRecording) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }

    setIsRecording(false);
    setIsAnalyzing(false);
    setVoiceProfile(null);
    setVoicePersonality(null);
    setRecordingTime(0);
    setFrequencyData(null);
    setDnaNodes([]);

    // Clear DNA with proper disposal
    if (dnaGroupRef.current) {
      while (dnaGroupRef.current.children.length > 0) {
        const child = dnaGroupRef.current.children[0];
        if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
        dnaGroupRef.current.remove(child);
      }
    }

    analyserRef.current = null;
  };

  useEffect(() => {
    const cleanup = initThreeJS();
    animate();

    return () => {
      // Cancel animation frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      // Cleanup Web Audio API resources
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      analyserRef.current = null;

      // Cleanup Three.js
      cleanup?.();
    };
  }, [initThreeJS, animate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            목소리 DNA 분석기
          </h1>
          <p className="text-xl text-gray-300 flex items-center justify-center gap-2">
            <Dna className="w-5 h-5" />
            당신의 목소리에 담긴 고유한 DNA를 발견하세요
            <Activity className="w-5 h-5" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-purple-500/30">
              <CardContent className="p-0">
                <div
                  ref={mountRef}
                  className="w-full h-[600px] rounded-lg overflow-hidden"
                />
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            {!voiceProfile ? (
              <Card className="bg-gray-900/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">음성 녹음</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isRecording && !isAnalyzing ? (
                    <>
                      <p className="text-gray-300 text-center">
                        10초 동안 자연스럽게 말씀해주세요.
                        당신의 목소리 DNA를 분석해드립니다.
                      </p>
                      <Button
                        onClick={startRecording}
                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-lg py-6"
                      >
                        <Mic className="mr-2" />
                        녹음 시작
                      </Button>
                    </>
                  ) : isRecording ? (
                    <>
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <Mic className="w-16 h-16 text-red-500 animate-pulse" />
                            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-red-400">
                          녹음 중... {recordingTime}초 / 10초
                        </p>
                        <Progress value={(recordingTime / 10) * 100} className="w-full" />
                        <Button
                          onClick={stopRecording}
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <MicOff className="mr-2" />
                          녹음 중지
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <Brain className="w-16 h-16 text-purple-500 animate-pulse" />
                      </div>
                      <p className="text-xl font-medium">목소리 DNA 분석 중...</p>
                      <Progress value={100} className="w-full animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {/* Personality Type */}
                <Card className="bg-gray-900/50 border-pink-500/30">
                  <CardHeader>
                    <CardTitle className="text-xl">목소리 성격 유형</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {voicePersonality && (
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          {(() => {
                            const Icon = voicePersonality.icon;
                            return <Icon className="w-12 h-12" style={{ color: voicePersonality.color }} />;
                          })()}
                        </div>
                        <h3 className="text-2xl font-bold" style={{ color: voicePersonality.color }}>
                          {voicePersonality.type}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {voicePersonality.description}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Detailed Analysis */}
                {voicePersonality && (
                  <Card className="bg-gray-900/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">심층 분석</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {voicePersonality.detailedAnalysis}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Core Voice Metrics */}
                <Card className="bg-gray-900/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg">핵심 음성 특성</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">음높이 (Pitch)</span>
                          <span className="text-cyan-400">{Math.round(voiceProfile.pitch)}%</span>
                        </div>
                        <Progress value={voiceProfile.pitch} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">음색 (Tone)</span>
                          <span className="text-purple-400">{Math.round(voiceProfile.tone)}%</span>
                        </div>
                        <Progress value={voiceProfile.tone} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">속도 (Speed)</span>
                          <span className="text-blue-400">{Math.round(voiceProfile.speed)}%</span>
                        </div>
                        <Progress value={voiceProfile.speed} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">감정 표현 (Emotion)</span>
                          <span className="text-pink-400">{Math.round(voiceProfile.emotion)}%</span>
                        </div>
                        <Progress value={voiceProfile.emotion} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">자신감 (Confidence)</span>
                          <span className="text-yellow-400">{Math.round(voiceProfile.confidence)}%</span>
                        </div>
                        <Progress value={voiceProfile.confidence} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">독특함 (Uniqueness)</span>
                          <span className="text-green-400">{Math.round(voiceProfile.uniqueness)}%</span>
                        </div>
                        <Progress value={voiceProfile.uniqueness} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Voice Metrics */}
                <Card className="bg-gray-900/50 border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg">고급 음성 분석</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">공명감 (Resonance)</span>
                          <span className="text-orange-400">{Math.round(voiceProfile.resonance)}%</span>
                        </div>
                        <Progress value={voiceProfile.resonance} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">발음 명확도 (Articulation)</span>
                          <span className="text-teal-400">{Math.round(voiceProfile.articulation)}%</span>
                        </div>
                        <Progress value={voiceProfile.articulation} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">호흡 조절 (Breath Control)</span>
                          <span className="text-indigo-400">{Math.round(voiceProfile.breathControl)}%</span>
                        </div>
                        <Progress value={voiceProfile.breathControl} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">음역대 (Vocal Range)</span>
                          <span className="text-rose-400">{Math.round(voiceProfile.vocalRange)}%</span>
                        </div>
                        <Progress value={voiceProfile.vocalRange} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">따뜻함 (Warmth)</span>
                          <span className="text-amber-400">{Math.round(voiceProfile.warmth)}%</span>
                        </div>
                        <Progress value={voiceProfile.warmth} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">선명도 (Clarity)</span>
                          <span className="text-lime-400">{Math.round(voiceProfile.clarity)}%</span>
                        </div>
                        <Progress value={voiceProfile.clarity} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths & Weaknesses */}
                {voicePersonality && (
                  <Card className="bg-gray-900/50 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">강점 & 개선점</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-green-400 mb-2">✓ 강점</h4>
                        <div className="flex flex-wrap gap-2">
                          {voicePersonality.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="border-green-500/50 text-green-300">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-orange-400 mb-2">△ 개선점</h4>
                        <div className="flex flex-wrap gap-2">
                          {voicePersonality.weaknesses.map((weakness, idx) => (
                            <Badge key={idx} variant="outline" className="border-orange-500/50 text-orange-300">
                              {weakness}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Career Recommendations */}
                {voicePersonality && (
                  <Card className="bg-gray-900/50 border-yellow-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">추천 직업</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {voicePersonality.careers.map((career, idx) => (
                          <Badge key={idx} variant="outline" className="border-yellow-500/50 text-yellow-300">
                            {career}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Communication Tips */}
                {voicePersonality && (
                  <Card className="bg-gray-900/50 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">소통 개선 팁</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-300">
                        {voicePersonality.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Compatibility */}
                {voicePersonality && (
                  <Card className="bg-gray-900/50 border-pink-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">궁합 좋은 유형</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {voicePersonality.compatibility.map((type, idx) => (
                          <Badge key={idx} variant="outline" className="border-pink-500/50 text-pink-300">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reset Button */}
                <Button
                  onClick={reset}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Volume2 className="mr-2" />
                  다시 분석하기
                </Button>
              </div>
            )}

            {/* Instructions */}
            {!voiceProfile && !isRecording && !isAnalyzing && (
              <Card className="bg-gray-900/50 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-sm">사용 방법</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm text-gray-400 space-y-1">
                    <li>1. 조용한 환경에서 준비해주세요</li>
                    <li>2. 녹음 버튼을 누르고 자연스럽게 말하세요</li>
                    <li>3. 10초 동안 녹음이 진행됩니다</li>
                    <li>4. AI가 당신의 목소리 DNA를 분석합니다</li>
                    <li>5. 3D로 시각화된 결과를 확인하세요</li>
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}