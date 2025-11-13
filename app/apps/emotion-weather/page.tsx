"use client";

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

// TypeScript 인터페이스 정의
interface WeatherType {
  name: string;
  emoji: string;
  color: string;
  cloudCount: number;
  rainIntensity: number;
  windSpeed: number;
  description: string;
  detailedDescription: string;
  recommendations: string[];
}

interface Biorhythm {
  physical: number;
  emotional: number;
  intellectual: number;
}

interface ScoreBreakdown {
  userMood: number;
  biorhythm: number;
  moonPhase: number;
  season: number;
  dayOfWeek: number;
  total: number;
}

interface WeatherForecastDay {
  date: string;
  weather: string;
  score: number;
  details: WeatherType;
  breakdown?: ScoreBreakdown;
}

interface EmotionForecast {
  today: WeatherForecastDay;
  week: WeatherForecastDay[];
  warnings: string[];
  biorhythm: Biorhythm;
  moonPhase: number;
  advice: string;
}

// 날씨 타입 정의
const WEATHER_TYPES: Record<string, WeatherType> = {
  sunny: {
    name: '맑음',
    emoji: '☀️',
    color: '#FFD700',
    cloudCount: 2,
    rainIntensity: 0,
    windSpeed: 0.5,
    description: '완벽한 날! 지금 당신은 빛나고 있어요 ✨',
    detailedDescription: '와! 오늘 당신의 감정 날씨는 최고입니다! 기분도 좋고, 바이오리듬도 상승세, 모든 것이 딱 맞아떨어지는 날이에요. 이런 날은 뭘 해도 잘 풀려요. 에너지가 넘치고 사람들이 당신에게 자연스럽게 끌릴 거예요. 이 기분 오래오래 유지하세요!',
    recommendations: [
      '미뤄뒀던 중요한 일 지금 당장 시작하세요!',
      '고백, 프러포즈, 이직 제안... 뭐든 GO!',
      '운동하면 엔돌핀 폭발! 러닝이나 등산 어때요?',
      '오늘 당신의 긍정 에너지로 누군가를 웃게 해주세요',
      '셀카 찍어두세요. 지금 얼굴 빛나요 📸'
    ]
  },
  partlyCloudy: {
    name: '구름 조금',
    emoji: '⛅',
    color: '#87CEEB',
    cloudCount: 5,
    rainIntensity: 0,
    windSpeed: 1,
    description: '딱 적당한 하루. 나쁘지 않아요 👍',
    detailedDescription: '오늘은 그냥 평범한 날이에요. 특별히 좋지도, 나쁘지도 않은... 그런 날 있잖아요. 뭔가 작은 걱정거리는 있지만 크게 문제될 건 없어요. 이런 날은 무리하지 말고 그냥 편하게 가면 돼요. 꾸준히만 가면 됩니다.',
    recommendations: [
      '오늘의 작은 목표 3가지 정해서 하나씩 체크해보세요',
      '점심 먹고 15분 산책으로 리프레시!',
      '친한 친구한테 "요즘 어때?" 메시지 한 통',
      '루틴 지키면서 안정감 찾기. 변화보다는 유지!'
    ]
  },
  cloudy: {
    name: '흐림',
    emoji: '☁️',
    color: '#B0C4DE',
    cloudCount: 10,
    rainIntensity: 0,
    windSpeed: 1.5,
    description: '좀 피곤한 날... 쉬어도 괜찮아요 😴',
    detailedDescription: '에너지가 많이 떨어져 있네요. 뭘 해도 의욕이 안 나고 피곤하죠? 지금은 배터리가 거의 바닥난 상태예요. 무리하게 뭘 하려고 하지 말고 충전에 집중하세요. 내일을 위해 오늘은 쉬는 게 답입니다.',
    recommendations: [
      '오늘은 일찍 퇴근! 집에 가서 누워요',
      '좋아하는 노래 플레이리스트 틀고 멍때리기',
      '따뜻한 우유나 허브티 한 잔 + 담요',
      '중요한 결정이나 큰일은 내일 이후로 미루세요',
      '명상 앱 5분만. 숨 쉬는 것만 집중해보세요',
      '죄책감 갖지 마세요. 쉬는 것도 일입니다'
    ]
  },
  rainy: {
    name: '비',
    emoji: '🌧️',
    color: '#4682B4',
    cloudCount: 12,
    rainIntensity: 50,
    windSpeed: 2,
    description: '마음에 비가 오네요... 울어도 괜찮아요 💧',
    detailedDescription: '지금 마음이 많이 힘들죠? 작은 일에도 눈물이 나고, 누가 뭐라고 하면 바로 상처받고... 알아요, 그 기분. 지금은 감정이 엄청 예민한 상태예요. 억지로 참지 마세요. 울고 싶으면 울고, 화나면 화내도 돼요. 감정을 밖으로 꺼내는 게 중요해요.',
    recommendations: [
      '일기장에 감정을 다 쏟아내보세요. 뭐든 좋아요',
      '믿을 수 있는 사람 하나 붙잡고 실컷 얘기하세요',
      '혼자 있고 싶다면 방에서 쉬어도 OK',
      '사람 만나기 싫으면 약속 다 취소해도 돼요',
      '슬픈 영화 보면서 펑펑 우는 것도 치유됩니다',
      '오늘만 버티면 돼요. 내일은 나아질 거예요'
    ]
  },
  stormy: {
    name: '폭풍',
    emoji: '⛈️',
    color: '#483D8B',
    cloudCount: 15,
    rainIntensity: 100,
    windSpeed: 4,
    description: '감정 폭풍... 지금 당장 도움이 필요해요 🆘',
    detailedDescription: '완전 한계 상태네요. 감정이 롤러코스터처럼 오르락내리락하고, 아무것도 하기 싫고, 모든 게 무너지는 것 같죠? 지금은 정말 힘든 시기예요. 혼자 버티지 마세요. 이건 당신 잘못이 아니에요. 도움이 필요한 거예요.',
    recommendations: [
      '중요한 결정 절대 금지! 다 내일 이후로',
      '심호흡: 4초 들이마시고, 7초 참고, 8초 내쉬기',
      '폭풍은 지나가요. 이것도 지나갈 거예요',
      '상담 전문가한테 전화하세요. 1577-0199',
      '밥 먹고, 물 마시고, 자세요. 그것만 해도 충분해요',
      '가장 가까운 사람한테 "힘들다"고 말하세요',
      '지금은 생존 모드. 완벽하지 않아도 괜찮아요'
    ]
  },
  rainbow: {
    name: '무지개',
    emoji: '🌈',
    color: '#FF69B4',
    cloudCount: 3,
    rainIntensity: 0,
    windSpeed: 0.8,
    description: '터널 끝이 보여요! 좋은 일이 다가오고 있어요 🌈',
    detailedDescription: '힘든 시간을 견뎌냈네요. 수고했어요, 정말. 이제 좋아질 거예요. 어둠 뒤에는 항상 빛이 있잖아요. 지금 당신은 그 빛을 향해 가고 있어요. 새로운 시작이 기다리고 있습니다. 희망을 가지세요!',
    recommendations: [
      '새로운 기회가 오면 두려워하지 말고 잡으세요',
      '그동안 못했던 것들 이제 시작해보세요',
      '도와준 사람들한테 감사 인사 전하기',
      '변화를 받아들이세요. 좋은 변화가 올 거예요',
      '이 기분 그대로 다른 사람도 도와주세요',
      '축하해요! 이제 좋은 일만 남았어요 🎉'
    ]
  }
};

export default function EmotionWeather() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [currentMood, setCurrentMood] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [forecast, setForecast] = useState<EmotionForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // 3D Scene 초기화
  useEffect(() => {
    if (!canvasRef.current || !forecast) return;

    // Scene 설정
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x11111f, 0.002);
    sceneRef.current = scene;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 30);
    camera.lookAt(0, 0, 0);

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 조명
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 현재 날씨에 따른 3D 요소 생성
    const weatherType = WEATHER_TYPES[forecast.today.weather as keyof typeof WEATHER_TYPES];

    // 구름 생성
    const clouds: THREE.Mesh[] = [];
    for (let i = 0; i < weatherType.cloudCount; i++) {
      const cloudGeometry = new THREE.SphereGeometry(
        Math.random() * 3 + 2,
        8,
        6
      );
      const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        opacity: 0.8,
        transparent: true
      });
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        Math.random() * 40 - 20,
        Math.random() * 10 + 5,
        Math.random() * 20 - 10
      );
      cloud.scale.x = Math.random() + 1;
      scene.add(cloud);
      clouds.push(cloud);
    }

    // 비 효과
    let rainParticles: THREE.Points | null = null;
    if (weatherType.rainIntensity > 0) {
      const rainGeometry = new THREE.BufferGeometry();
      const rainCount = weatherType.rainIntensity * 10;
      const positions = new Float32Array(rainCount * 3);

      for (let i = 0; i < rainCount; i++) {
        positions[i * 3] = Math.random() * 50 - 25;
        positions[i * 3 + 1] = Math.random() * 50;
        positions[i * 3 + 2] = Math.random() * 50 - 25;
      }

      rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const rainMaterial = new THREE.PointsMaterial({
        color: 0x4682B4,
        size: 0.3,
        transparent: true,
        opacity: 0.6
      });

      rainParticles = new THREE.Points(rainGeometry, rainMaterial);
      scene.add(rainParticles);
    }

    // 태양/달 생성
    if (weatherType.name === '맑음') {
      const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
      const sunMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFD700,
        emissive: 0xFFD700,
        emissiveIntensity: 0.5
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(15, 15, -10);
      scene.add(sun);

      // 태양 빛
      const sunLight = new THREE.PointLight(0xFFD700, 2, 100);
      sunLight.position.copy(sun.position);
      scene.add(sunLight);
    }

    // 애니메이션
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // 구름 움직임
      clouds.forEach((cloud, index) => {
        cloud.position.x += weatherType.windSpeed * 0.01 * (index % 2 === 0 ? 1 : -1);
        if (cloud.position.x > 25) cloud.position.x = -25;
        if (cloud.position.x < -25) cloud.position.x = 25;
        cloud.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
      });

      // 비 애니메이션
      if (rainParticles) {
        const positions = rainParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] -= 0.5;
          if (positions[i + 1] < 0) {
            positions[i + 1] = 50;
          }
        }
        rainParticles.geometry.attributes.position.needsUpdate = true;
      }

      camera.position.x = Math.sin(Date.now() * 0.0001) * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 클린업 함수 - 메모리 누수 방지
    return () => {
      // 애니메이션 프레임 취소
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      // renderer cleanup
      if (renderer && renderer.domElement) {
        // DOM에서 canvas 제거 (부모가 존재하는 경우에만)
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
        });
      }

      // refs 초기화
      sceneRef.current = null;
      rendererRef.current = null;
    };
  }, [forecast]);

  // 바이오리듬 계산
  const calculateBiorhythm = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    const physical = Math.sin((2 * Math.PI * days) / 23);
    const emotional = Math.sin((2 * Math.PI * days) / 28);
    const intellectual = Math.sin((2 * Math.PI * days) / 33);

    return { physical, emotional, intellectual };
  };

  // 달 주기 계산
  const calculateMoonPhase = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const c = Math.floor(365.25 * year);
    const e = Math.floor(30.6 * month);
    const jd = c + e + day - 694039.09;
    const phase = jd / 29.5305882;
    const moonPhase = phase - Math.floor(phase);

    return moonPhase;
  };

  // 감정 날씨 예측
  const generateForecast = () => {
    if (!name || !birthDate) {
      alert('이름과 생년월일을 입력해주세요!');
      return;
    }

    setLoading(true);

    // 복잡한 계산 시뮬레이션
    setTimeout(() => {
      const biorhythm = calculateBiorhythm(birthDate);
      const moonPhase = calculateMoonPhase();
      const season = new Date().getMonth();

      // 7일 예보 생성
      const weekForecast = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        // 개선된 감정 날씨 알고리즘 (사용자 입력 가중치 대폭 증가)
        let score = 40; // 기본 점수 40으로 낮춤

        // 사용자 입력 영향 (가중치 증가: 최대 +60/-60점)
        const moodScore = (currentMood - 5.5) * 10; // -55 ~ +45
        const stressScore = -(stressLevel - 5.5) * 8; // +44 ~ -36
        const sleepScore = (sleepQuality - 5.5) * 8; // -44 ~ +36
        const userInputScore = moodScore + stressScore + sleepScore;

        // 바이오리듬 영향 (최대 ±40점)
        const bioScore = (biorhythm.emotional * 15) + (biorhythm.physical * 5) + (biorhythm.intellectual * 5);

        // 달 주기 영향 (최대 ±10점)
        const moonScore = (moonPhase - 0.5) * 20;

        // 계절 효과 (최대 ±8점)
        let seasonScore = 0;
        if (season >= 3 && season <= 5) seasonScore = 5; // 봄
        else if (season >= 6 && season <= 8) seasonScore = 8; // 여름
        else if (season >= 9 && season <= 11) seasonScore = -3; // 가을
        else if (season >= 0 && season <= 2) seasonScore = -6; // 겨울

        // 요일 효과 (최대 ±12점)
        let dayScore = 0;
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) dayScore = 12; // 주말
        else if (dayOfWeek === 1) dayScore = -8; // 월요일
        else if (dayOfWeek === 3) dayScore = 3; // 수요일 (주중)

        // 날이 지날수록 약간의 변화 (미래 예측의 불확실성)
        const futureVariance = (Math.random() - 0.5) * 5 * i;

        // 총점 계산 (사용자 입력이 60% 이상 영향)
        score += userInputScore + bioScore * 0.5 + moonScore * 0.3 + seasonScore + dayScore + futureVariance;

        // 점수 분석 (첫날만)
        let breakdown = undefined;
        if (i === 0) {
          breakdown = {
            userMood: Math.round(userInputScore),
            biorhythm: Math.round(bioScore * 0.5),
            moonPhase: Math.round(moonScore * 0.3),
            season: Math.round(seasonScore),
            dayOfWeek: Math.round(dayScore),
            total: Math.round(score)
          };
        }

        // 날씨 결정 (임계값 조정)
        let weather;
        if (score >= 75) weather = 'sunny';
        else if (score >= 60) weather = 'rainbow';
        else if (score >= 45) weather = 'partlyCloudy';
        else if (score >= 30) weather = 'cloudy';
        else if (score >= 15) weather = 'rainy';
        else weather = 'stormy';

        weekForecast.push({
          date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }),
          weather,
          score: Math.max(0, Math.min(100, Math.round(score))),
          details: WEATHER_TYPES[weather as keyof typeof WEATHER_TYPES],
          breakdown
        });
      }

      // 특별 경고
      const warnings = [];
      if (biorhythm.emotional < -0.5) warnings.push('감정 바이오리듬 저조기');
      if (moonPhase > 0.9 || moonPhase < 0.1) warnings.push('보름달/그믐달 영향');
      if (stressLevel >= 8) warnings.push('스트레스 과부하 경고');
      if (sleepQuality <= 3) warnings.push('수면 부족 주의');

      setForecast({
        today: weekForecast[0],
        week: weekForecast,
        warnings,
        biorhythm,
        moonPhase: moonPhase * 100,
        advice: generateAdvice(weekForecast[0].weather)
      });

      setLoading(false);
    }, 2000);
  };

  // 조언 생성 (사용자 상태에 따라 개인화)
  const generateAdvice = (weather: string) => {
    const isHighMood = currentMood >= 7;
    const isLowMood = currentMood <= 4;
    const isHighStress = stressLevel >= 7;
    const isLowSleep = sleepQuality <= 4;

    const advices = {
      sunny: [
        isHighMood ? '완벽한 컨디션이네요! 미뤄뒀던 큰 프로젝트 시작하기 딱 좋은 날입니다.' : '오늘은 새로운 도전을 시작하기 좋은 날입니다.',
        isHighStress ? '기분은 좋지만 스트레스 관리도 잊지 마세요. 운동으로 긍정 에너지를 배가시켜보세요!' : '긍정적인 에너지를 주변과 나누세요.',
        isLowSleep ? '컨디션이 좋은 편이니 오늘 밤에는 일찍 자서 내일도 이어가세요!' : '야외 활동이 기분 전환에 도움이 됩니다.',
        '지금 이 기분 그대로 중요한 사람에게 연락해보세요. 좋은 소식이 있을 거예요!',
        '오늘 당신의 미소가 누군가의 하루를 바꿀 수 있어요. 밝게 웃으며 다녀보세요!'
      ],
      partlyCloudy: [
        isLowMood ? '지금은 나쁘지 않은 상태예요. 작은 성공을 쌓아가면 기분이 더 좋아질 거예요.' : '균형잡힌 하루를 보내세요.',
        isHighStress ? '스트레스가 좀 있네요. 오늘은 무리하지 말고 여유롭게 가세요.' : '작은 목표를 달성하면 만족감을 느낄 수 있습니다.',
        isLowSleep ? '수면 부족이 쌓이고 있어요. 오늘 저녁엔 일찍 침대에 들어가보세요.' : '가벼운 산책이 도움이 됩니다.',
        '지금 상태면 딱 적당해요. 무리하지 말고 꾸준히 가는 게 답입니다.',
        '커피 한 잔과 함께 좋아하는 음악 들으며 30분만 여유를 가져보세요.'
      ],
      cloudy: [
        isLowMood && isHighStress ? '많이 힘드시죠? 오늘은 아무것도 안 해도 괜찮아요. 그냥 쉬세요.' : '혼자만의 시간을 가져보세요.',
        isLowSleep ? '피곤이 누적됐어요. 오늘은 일찍 자고 내일 다시 시작하세요.' : '좋아하는 음악을 들으며 휴식하세요.',
        isHighStress ? '스트레스가 많이 쌓였네요. 핸드폰 끄고 1시간만 온전히 쉬어보세요.' : '따뜻한 차 한 잔이 위로가 됩니다.',
        '지금은 에너지 충전 모드. 아무 생각 없이 넷플릭스나 유튜브 봐도 돼요.',
        '마음이 무거울 땐 일기장에 감정을 쏟아내보세요. 훨씬 가벼워질 거예요.'
      ],
      rainy: [
        isLowMood ? '많이 속상하죠? 울어도 괜찮아요. 감정을 억누르지 마세요.' : '감정을 억누르지 말고 표현하세요.',
        isHighStress && isLowSleep ? '지금 몸과 마음 모두 한계에요. 오늘은 무조건 쉬는 날로 정하세요.' : '신뢰하는 사람과 대화를 나누세요.',
        isLowMood && !isHighStress ? '기분이 안 좋은 날이네요. 친한 친구한테 전화해서 수다 떨어보세요.' : '일기를 쓰면 마음이 정리됩니다.',
        '슬픈 영화 보면서 실컷 우는 것도 치유가 될 수 있어요.',
        '혼자 있고 싶다면 그렇게 하세요. 하지만 너무 오래는 말고요.'
      ],
      stormy: [
        isLowMood && isHighStress ? '완전 폭풍 상태네요. 지금 당장 누군가에게 도움을 청하세요.' : '중요한 결정은 내일로 미루세요.',
        isLowSleep ? '수면 부족이 심각해요. 병가를 내서라도 오늘은 쉬어야 해요.' : '심호흡과 명상이 도움이 됩니다.',
        isHighStress ? '스트레스가 위험 수준이에요. 상담 전문가의 도움을 받는 것도 고려해보세요.' : '폭풍은 지나갑니다. 인내하세요.',
        '지금은 생존 모드. 중요한 건 다 미루고 오늘 하루만 버티세요.',
        '1577-0199 (정신건강위기상담). 혼자 견디지 마시고 전문가와 이야기해보세요.',
        '이것도 지나갈 거예요. 지금은 아무것도 하지 말고 그냥 숨만 쉬세요.'
      ],
      rainbow: [
        isLowMood ? '힘든 시기를 지나고 있네요. 곧 좋아질 거예요. 조금만 더 힘내세요!' : '변화를 받아들일 준비가 되었습니다.',
        isHighStress ? '스트레스는 있지만 전환점이 보여요. 긍정적인 변화가 시작될 거예요.' : '새로운 기회가 찾아올 것입니다.',
        '어둠 끝에 빛이 보이기 시작했어요. 희망을 가지세요!',
        '변화가 두렵더라도 받아들여보세요. 좋은 결과가 기다리고 있어요.',
        '그동안 힘들었죠? 이제 좋은 일만 남았어요. 기대하세요!'
      ]
    };

    const weatherAdvices = advices[weather as keyof typeof advices];
    return weatherAdvices[Math.floor(Math.random() * weatherAdvices.length)];
  };

  return (
    <PremiumLayout theme="blue">
      
        <AdOverlay /><div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              감정 날씨 예보
            </span>
          </h1>
          <p className="text-xl text-white/80">
            바이오리듬과 달 주기로 예측하는 7일 감정 날씨
          </p>
        </div>

        {!forecast ? (
          <PremiumCard hover gradient className="mb-8 animate-slideUp">
            <h3 className="text-white text-2xl font-bold mb-6 text-center">
              📊 감정 날씨 분석 데이터 입력
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-white font-bold mb-2 block">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 rounded-lg text-black"
                />
              </div>

              <div>
                <label className="text-white font-bold mb-2 block">생년월일</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-black"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-white font-bold mb-2 block">
                  현재 기분: {currentMood}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-white font-bold mb-2 block">
                  스트레스 레벨: {stressLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-white font-bold mb-2 block">
                  수면의 질: {sleepQuality}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <PremiumButton
              onClick={generateForecast}
              variant="primary"
              size="lg"
              icon="🌤️"
              fullWidth
              disabled={loading}
            >
              {loading ? '날씨 예측 중...' : '감정 날씨 예보 생성'}
            </PremiumButton>
          </PremiumCard>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* 3D 날씨 시각화 */}
            <PremiumCard hover gradient>
              <h3 className="text-white text-2xl font-bold mb-4 text-center">
                오늘의 감정 날씨
              </h3>
              <div
                ref={canvasRef}
                className="w-full h-96 rounded-lg overflow-hidden bg-gradient-to-b from-sky-200 to-sky-400 dark:from-sky-900 dark:to-sky-700"
                style={{ touchAction: 'none' }}
              />
              <div className="text-center mt-6">
                <div className="text-6xl mb-2">{forecast.today.details.emoji}</div>
                <div className="text-3xl font-bold text-white mb-2">
                  {forecast.today.details.name}
                </div>
                <p className="text-white/80 text-lg">{forecast.today.details.description}</p>

                {/* 상세 설명 */}
                <div className="mt-6 p-6 bg-white/10 rounded-lg text-left">
                  <h4 className="text-white font-bold mb-3 text-lg">📋 상세 분석</h4>
                  <p className="text-white/90 leading-relaxed mb-4">
                    {forecast.today.details.detailedDescription}
                  </p>

                  {/* 점수 분해 */}
                  {forecast.today.breakdown && (
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                      <h5 className="text-white font-bold mb-3 text-sm">🎯 감정 점수 산출 내역</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">기본 점수</span>
                          <span className="text-white font-mono">40점</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">당신의 감정 상태 (기분/스트레스/수면)</span>
                          <span className={`font-mono font-bold ${forecast.today.breakdown.userMood >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {forecast.today.breakdown.userMood >= 0 ? '+' : ''}{forecast.today.breakdown.userMood}점
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">바이오리듬 영향</span>
                          <span className={`font-mono ${forecast.today.breakdown.biorhythm >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {forecast.today.breakdown.biorhythm >= 0 ? '+' : ''}{forecast.today.breakdown.biorhythm}점
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">달 주기 영향</span>
                          <span className={`font-mono ${forecast.today.breakdown.moonPhase >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {forecast.today.breakdown.moonPhase >= 0 ? '+' : ''}{forecast.today.breakdown.moonPhase}점
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">계절 효과</span>
                          <span className={`font-mono ${forecast.today.breakdown.season >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {forecast.today.breakdown.season >= 0 ? '+' : ''}{forecast.today.breakdown.season}점
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">요일 효과</span>
                          <span className={`font-mono ${forecast.today.breakdown.dayOfWeek >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {forecast.today.breakdown.dayOfWeek >= 0 ? '+' : ''}{forecast.today.breakdown.dayOfWeek}점
                          </span>
                        </div>
                        <div className="border-t border-white/20 pt-2 mt-2 flex justify-between items-center">
                          <span className="text-white font-bold">최종 감정 점수</span>
                          <span className="text-white font-bold font-mono text-lg">{forecast.today.breakdown.total}점 / 100점</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 권장 사항 */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-bold mb-3 text-sm">💡 오늘의 권장 사항</h5>
                    <ul className="space-y-2 text-sm">
                      {forecast.today.details.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start text-white/90">
                          <span className="text-blue-400 mr-2 flex-shrink-0">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </PremiumCard>

            {/* 7일 예보 */}
            <PremiumCard hover>
              <h3 className="text-white text-2xl font-bold mb-6 text-center">
                🗓️ 7일 감정 날씨 예보
              </h3>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {forecast.week.map((day: any, index: number) => (
                  <div
                    key={index}
                    className={`text-center p-3 rounded-lg transition-all ${
                      index === 0
                        ? 'bg-white/20 scale-110 shadow-xl'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-xs text-white/70 mb-1">{day.date}</div>
                    <div className="text-3xl mb-1">
                      {WEATHER_TYPES[day.weather as keyof typeof WEATHER_TYPES].emoji}
                    </div>
                    <div className="text-xs text-white/80">
                      {day.score}%
                    </div>
                  </div>
                ))}
              </div>

              {/* 경고 사항 */}
              {forecast.warnings.length > 0 && (
                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 mb-6">
                  <h4 className="text-white font-bold mb-2">⚠️ 감정 기상 특보</h4>
                  <ul className="text-white/80 text-sm space-y-1">
                    {forecast.warnings.map((warning: string, index: number) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 바이오리듬 & 달 주기 */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-3">🔄 바이오리듬</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/80">
                      <span>신체</span>
                      <span>{Math.round(forecast.biorhythm.physical * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>감정</span>
                      <span>{Math.round(forecast.biorhythm.emotional * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>지성</span>
                      <span>{Math.round(forecast.biorhythm.intellectual * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-3">🌙 달 주기</h4>
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {forecast.moonPhase < 25 ? '🌑' :
                       forecast.moonPhase < 50 ? '🌓' :
                       forecast.moonPhase < 75 ? '🌕' : '🌗'}
                    </div>
                    <div className="text-white/80 text-sm">
                      {Math.round(forecast.moonPhase)}% 차오름
                    </div>
                  </div>
                </div>
              </div>

              {/* 조언 */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 text-center">
                <h4 className="text-white font-bold mb-3">💫 오늘의 조언</h4>
                <p className="text-white/90 text-lg italic">"{forecast.advice}"</p>
              </div>
            </PremiumCard>

            <div className="text-center">
              <PremiumButton
                onClick={() => setForecast(null)}
                variant="secondary"
                size="lg"
              >
                다시 예측하기
              </PremiumButton>
            </div>
          </div>
        )}

        <RelatedApps currentAppSlug="emotion-weather" className="mt-12" />
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
      `}</style>
    </PremiumLayout>
  );
}