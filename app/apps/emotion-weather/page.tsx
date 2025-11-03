"use client";

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

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
    description: '기분 좋은 하루! 긍정적인 에너지가 넘칩니다.',
    detailedDescription: '당신의 감정 상태가 매우 안정적이고 긍정적입니다. 바이오리듬과 환경 요인이 모두 좋은 방향으로 작용하고 있어 활력이 넘치는 하루가 될 것입니다. 대인관계가 원활하고 업무 효율도 높은 시기입니다.',
    recommendations: [
      '새로운 프로젝트나 도전을 시작하기 좋은 날입니다',
      '중요한 미팅이나 협상을 진행하세요',
      '운동이나 야외 활동으로 에너지를 발산하세요',
      '주변 사람들에게 긍정적 영향을 줄 수 있습니다'
    ]
  },
  partlyCloudy: {
    name: '구름 조금',
    emoji: '⛅',
    color: '#87CEEB',
    cloudCount: 5,
    rainIntensity: 0,
    windSpeed: 1,
    description: '대체로 평온하지만 작은 고민이 있을 수 있습니다.',
    detailedDescription: '전반적으로 안정적이지만 약간의 불확실성이나 고민이 있을 수 있습니다. 바이오리듬이 중립적이거나 환경적 요인이 복합적으로 작용하고 있습니다. 무리하지 않으면서 꾸준히 나아가는 것이 좋습니다.',
    recommendations: [
      '작은 목표들을 하나씩 달성하세요',
      '가벼운 산책이나 스트레칭으로 기분 전환',
      '가족이나 친한 친구와 대화 시간을 가지세요',
      '일상 루틴을 충실히 지키면 안정감을 얻을 수 있습니다'
    ]
  },
  cloudy: {
    name: '흐림',
    emoji: '☁️',
    color: '#B0C4DE',
    cloudCount: 10,
    rainIntensity: 0,
    windSpeed: 1.5,
    description: '감정이 둔해질 수 있는 날. 휴식이 필요합니다.',
    detailedDescription: '에너지 수준이 평소보다 낮고 의욕이 떨어질 수 있습니다. 바이오리듬 저조기이거나 스트레스가 누적된 상태일 가능성이 있습니다. 무리한 활동보다는 재충전에 집중하는 것이 좋습니다.',
    recommendations: [
      '충분한 휴식과 수면을 취하세요',
      '좋아하는 음악을 들으며 마음을 편안하게',
      '따뜻한 차 한 잔과 함께 독서 시간을 가져보세요',
      '중요한 결정은 컨디션이 회복된 후로 미루세요',
      '명상이나 요가로 마음을 다스리세요'
    ]
  },
  rainy: {
    name: '비',
    emoji: '🌧️',
    color: '#4682B4',
    cloudCount: 12,
    rainIntensity: 50,
    windSpeed: 2,
    description: '감정적으로 예민한 날. 스스로를 돌보세요.',
    detailedDescription: '감정적으로 민감하고 작은 일에도 쉽게 상처받을 수 있는 상태입니다. 바이오리듬 중 감정 주기가 저조하거나 외부 스트레스가 높은 시기입니다. 자신에게 관대하고 감정을 억누르지 말고 표현하는 것이 중요합니다.',
    recommendations: [
      '감정 일기를 써서 마음을 정리하세요',
      '신뢰하는 사람과 깊은 대화를 나누세요',
      '혼자만의 시간을 갖고 자신을 돌아보세요',
      '무리한 사회활동은 피하고 충분히 쉬세요',
      '좋아하는 영화나 드라마로 기분 전환'
    ]
  },
  stormy: {
    name: '폭풍',
    emoji: '⛈️',
    color: '#483D8B',
    cloudCount: 15,
    rainIntensity: 100,
    windSpeed: 4,
    description: '감정 태풍 주의! 중요한 결정은 미루세요.',
    detailedDescription: '감정 기복이 심하고 심리적으로 불안정한 시기입니다. 여러 바이오리듬이 저점에 있거나 극심한 스트레스 상황일 수 있습니다. 이 시기는 지나갈 것이므로 견디는 것이 중요하며, 전문가의 도움을 받는 것도 고려해보세요.',
    recommendations: [
      '중요한 결정이나 계약은 반드시 미루세요',
      '심호흡과 명상으로 마음을 진정시키세요',
      '폭풍은 반드시 지나간다는 것을 기억하세요',
      '필요하다면 상담 전문가의 도움을 받으세요',
      '충분한 수면과 영양 섭취에 신경 쓰세요',
      '혼자 고민하지 말고 주변에 도움을 요청하세요'
    ]
  },
  rainbow: {
    name: '무지개',
    emoji: '🌈',
    color: '#FF69B4',
    cloudCount: 3,
    rainIntensity: 0,
    windSpeed: 0.8,
    description: '비 온 뒤 맑음! 새로운 기회가 찾아옵니다.',
    detailedDescription: '어려운 시기를 극복하고 새로운 전환점을 맞이하고 있습니다. 바이오리듬이 상승세로 돌아서거나 긍정적인 변화가 시작되는 시기입니다. 희망과 기대를 가지고 새로운 시작을 준비하세요.',
    recommendations: [
      '새로운 관계나 기회를 적극적으로 받아들이세요',
      '그동안 미뤄왔던 계획을 실행에 옮기세요',
      '감사한 마음을 주변에 표현하세요',
      '변화를 두려워하지 말고 도전하세요',
      '긍정적인 에너지를 나누고 확산시키세요'
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

  // 조언 생성
  const generateAdvice = (weather: string) => {
    const advices = {
      sunny: [
        '오늘은 새로운 도전을 시작하기 좋은 날입니다.',
        '긍정적인 에너지를 주변과 나누세요.',
        '야외 활동이 기분 전환에 도움이 됩니다.'
      ],
      partlyCloudy: [
        '균형잡힌 하루를 보내세요.',
        '작은 목표를 달성하면 만족감을 느낄 수 있습니다.',
        '가벼운 산책이 도움이 됩니다.'
      ],
      cloudy: [
        '혼자만의 시간을 가져보세요.',
        '좋아하는 음악을 들으며 휴식하세요.',
        '따뜻한 차 한 잔이 위로가 됩니다.'
      ],
      rainy: [
        '감정을 억누르지 말고 표현하세요.',
        '신뢰하는 사람과 대화를 나누세요.',
        '일기를 쓰면 마음이 정리됩니다.'
      ],
      stormy: [
        '중요한 결정은 내일로 미루세요.',
        '심호흡과 명상이 도움이 됩니다.',
        '폭풍은 지나갑니다. 인내하세요.'
      ],
      rainbow: [
        '변화를 받아들일 준비가 되었습니다.',
        '새로운 기회가 찾아올 것입니다.',
        '감사한 마음을 표현하세요.'
      ]
    };

    const weatherAdvices = advices[weather as keyof typeof advices];
    return weatherAdvices[Math.floor(Math.random() * weatherAdvices.length)];
  };

  return (
    <PremiumLayout theme="blue">
      <div className="max-w-6xl mx-auto px-4 py-8">
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