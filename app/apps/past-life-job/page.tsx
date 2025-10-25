"use client";

import { useState, useEffect } from 'react';
import historicalFiguresData from '@/data/historical_figures_100.json';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';

import RelatedApps from '@/app/components/RelatedApps';
interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number; // 0-23
}

interface PersonalityTraits {
  introvert: boolean | null;
  logical: boolean | null;
  adventurous: boolean | null;
  creative: boolean | null;
}

interface HistoricalFigure {
  id: number;
  name_kr: string;
  name_en: string;
  birth_year: number;
  death_year: number | null;
  era: string;
  region: string;
  country: string;
  field: string;
  major_achievements: string[];
  personality: PersonalityTraits;
  personality_description: string;
  traits_keywords: string[];
  element: string;
  saju_compatibility: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  famous_quote: string;
  life_lesson: string;
  modern_influence: string;
  compatibility_base_score: number;
  image_emoji: string;
}

// 시간대별 오행 (子丑寅卯辰巳午未申酉戌亥)
const getHourElement = (hour: number): string => {
  const hourBranch = [
    '水', '土', '木', '木', '土', '火', // 23-05
    '火', '土', '金', '金', '土', '水'  // 06-11
  ];
  const index = Math.floor(((hour + 1) % 24) / 2);
  return hourBranch[index];
};

// 오행 영문 변환
const elementToEnglish = (element: string): keyof HistoricalFigure['saju_compatibility'] => {
  const map: Record<string, keyof HistoricalFigure['saju_compatibility']> = {
    '木': 'wood',
    '火': 'fire',
    '土': 'earth',
    '金': 'metal',
    '水': 'water'
  };
  return map[element] || 'water';
};

// 생년월일로 오행 계산 (간단한 버전)
const calculateBirthElement = (birth: BirthInfo): string => {
  const yearRemainder = birth.year % 5;
  const elements = ['금', '수', '목', '화', '토'];
  return elements[yearRemainder];
};

export default function PastLifeHeroFinder() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [birth, setBirth] = useState<BirthInfo>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12
  });
  const [personality, setPersonality] = useState<PersonalityTraits>({
    introvert: null,
    logical: null,
    adventurous: null,
    creative: null
  });
  const [result, setResult] = useState<HistoricalFigure | null>(null);
  const [matchScore, setMatchScore] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const findMatchingHero = () => {
    const figures = historicalFiguresData.historical_figures as HistoricalFigure[];
    
    // 각 위인과의 매칭 점수 계산
    const scoredFigures = figures.map(figure => {
      let score = figure.compatibility_base_score || 80;
      
      // 1. 성향 매칭 (각 8점, 총 32점)
      if (personality.introvert === figure.personality.introvert) score += 8;
      if (personality.logical === figure.personality.logical) score += 8;
      if (personality.adventurous === figure.personality.adventurous) score += 8;
      if (personality.creative === figure.personality.creative) score += 8;
      
      // 2. 생년 오행 매칭 (15점)
      const birthElement = calculateBirthElement(birth);
      const birthElementEn = elementToEnglish(birthElement === '목' ? '木' : birthElement === '화' ? '火' : birthElement === '토' ? '土' : birthElement === '금' ? '金' : '水');
      const sajuScore = figure.saju_compatibility[birthElementEn] || 5;
      score += sajuScore * 1.5;
      
      // 3. 시간 오행 매칭 (8점)
      const hourElement = getHourElement(birth.hour);
      const hourElementEn = elementToEnglish(hourElement);
      const hourScore = figure.saju_compatibility[hourElementEn] || 5;
      score += hourScore * 0.8;
      
      // 4. 생일 숫자 매칭 (8점)
      const daySum = birth.day % 10;
      const figureIdSum = figure.id % 10;
      if (daySum === figureIdSum) score += 8;
      
      // 5. 월별 가중치 (7점)
      const monthBonus = (birth.month + figure.id) % 12 === 0 ? 7 : 0;
      score += monthBonus;
      
      // 6. 랜덤 보너스 (최대 10점) - 다양성 추가
      const randomBonus = Math.random() * 10;
      score += randomBonus;
      
      // 7. 지역/시대 다양성 보너스 (5점)
      const regionBonus = Math.random() * 5;
      score += regionBonus;
      
      return {
        ...figure,
        finalScore: Math.min(100, Math.round(score))
      };
    });
    
    // 점수 순으로 정렬하고 상위 8명 중에서 랜덤 선택
    scoredFigures.sort((a, b) => b.finalScore - a.finalScore);
    const topCandidates = scoredFigures.slice(0, 8);
    
    // 가중치 랜덤 선택 (점수가 높을수록 선택될 확률 높음)
    const weights = topCandidates.map((f, i) => Math.pow(8 - i, 2)); // 1위는 64, 2위는 49, 3위는 36...
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    let selectedIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }
    
    const topFigure = topCandidates[selectedIndex];
    
    setResult(topFigure);
    setMatchScore(topFigure.finalScore);
    setStep(3);
  };

  const handlePersonality = (key: keyof PersonalityTraits, value: boolean) => {
    setPersonality({
      ...personality,
      [key]: value
    });
  };

  const allAnswered = Object.values(personality).every(v => v !== null);

  // 하이드레이션 에러 방지: 클라이언트에서만 렌더링
  if (!mounted) {
    return (
      <PremiumLayout theme="purple" showStars={true}>
        <div className="mx-auto max-w-[600px] px-4 py-6 sm:py-8">
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <p className="text-white/80">로딩 중...</p>
            </div>
          </div>
        </div>
      </PremiumLayout>
    );
  }

  // Step 1: 생년월일시 입력
  if (step === 1) {
    return (
      <PremiumLayout theme="purple" showStars={true}>
        <div className="mx-auto max-w-[600px] px-4 py-6 sm:py-8">
          <PremiumCard gradient hover>
            <header className="text-center mb-6 sm:mb-8 [transform:translateZ(40px)]">
              <h1 className="text-6xl sm:text-7xl mb-4 animate-bounce-slow drop-shadow-2xl [transform:translateZ(50px)]">⭐</h1>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-3 drop-shadow-lg [text-shadow:_0_4px_12px_rgba(255,255,255,0.5)]">
                나의 전생 위인 찾기
              </h2>
              <p className="text-base sm:text-lg text-white/90 drop-shadow-md [transform:translateZ(20px)]">
                생년월일시와 사주로 닮은 위인을 찾습니다
              </p>
            </header>

            <div className="space-y-4 sm:space-y-6">
              <PremiumCard hover className="bg-white/90 [transform:translateZ(10px)] hover:[transform:translateZ(25px)] transition-all duration-300">
                <label className="block text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">📅 출생년도</label>
                <select
                  value={birth.year}
                  onChange={(e) => setBirth({...birth, year: Number(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 focus:outline-none text-base bg-white shadow-lg transition-all text-gray-900"
                >
                  {Array.from({length: 126}, (_, i) => {
                    const year = 2025 - i;
                    return <option key={year} value={year} className="text-gray-900">{year}년</option>;
                  })}
                </select>
              </PremiumCard>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <PremiumCard hover className="bg-white/90 [transform:translateZ(10px)] hover:[transform:translateZ(25px)] transition-all duration-300">
                  <label className="block text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">🗓️ 출생월</label>
                  <select
                    value={birth.month}
                    onChange={(e) => setBirth({...birth, month: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 focus:outline-none text-base bg-white shadow-lg transition-all text-gray-900"
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1} className="text-gray-900">{i+1}월</option>
                    ))}
                  </select>
                </PremiumCard>

                <PremiumCard hover className="bg-white/90 [transform:translateZ(10px)] hover:[transform:translateZ(25px)] transition-all duration-300">
                  <label className="block text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">📆 출생일</label>
                  <select
                    value={birth.day}
                    onChange={(e) => setBirth({...birth, day: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 focus:outline-none text-base bg-white shadow-lg transition-all text-gray-900"
                  >
                    {Array.from({length: 31}, (_, i) => (
                      <option key={i+1} value={i+1} className="text-gray-900">{i+1}일</option>
                    ))}
                  </select>
                </PremiumCard>
              </div>

              <PremiumCard hover className="bg-white/90 [transform:translateZ(10px)] hover:[transform:translateZ(25px)] transition-all duration-300">
                <label className="block text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  ⏰ 출생 시간: <span className="text-gray-900 text-lg">{birth.hour}시</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={birth.hour}
                  onChange={(e) => setBirth({...birth, hour: Number(e.target.value)})}
                  className="w-full h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer accent-purple-600 shadow-inner"
                  style={{
                    background: `linear-gradient(to right, rgb(216 180 254) 0%, rgb(251 207 232) ${(birth.hour / 23) * 100}%, rgb(243 232 255) ${(birth.hour / 23) * 100}%, rgb(243 232 255) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs sm:text-sm text-gray-900 mt-2 font-medium">
                  <span>🌙 0시</span>
                  <span>☀️ 12시</span>
                  <span>🌙 23시</span>
                </div>
              </PremiumCard>

              <div className="[transform:translateZ(30px)]">
                <PremiumButton
                  onClick={() => setStep(2)}
                  fullWidth
                  size="lg"
                >
                  다음 단계 ✨
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        </div>
      </PremiumLayout>
    );
  }

  // Step 2: 성향 테스트
  if (step === 2) {
    return (
      <PremiumLayout theme="purple" showStars={true}>
        <div className="mx-auto max-w-[600px] px-4 py-6 sm:py-8">
          <PremiumCard gradient hover>
            <header className="text-center mb-6 sm:mb-8 [transform:translateZ(40px)]">
              <h1 className="text-6xl sm:text-7xl mb-4 animate-bounce-slow drop-shadow-2xl [transform:translateZ(50px)]">🔮</h1>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3 drop-shadow-lg [text-shadow:_0_4px_12px_rgba(255,255,255,0.5)]">
                성향 테스트
              </h2>
              <p className="text-base sm:text-lg text-white/90 drop-shadow-md [transform:translateZ(20px)]">
                닮은 위인을 찾기 위한 질문
              </p>
            </header>

            <div className="space-y-4 sm:space-y-6">
              {/* 질문 1 */}
              <PremiumCard hover className="bg-gradient-to-br from-white/95 to-purple-50/90 [transform:translateZ(15px)] hover:[transform:translateZ(30px)] transition-all duration-300">
                <label className="block text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  💭 사람들과의 관계에서...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div onClick={() => handlePersonality('introvert', true)}>
                    <PremiumCard
                      hover
                      className={`cursor-pointer text-center transition-all duration-300 ${
                        personality.introvert === true
                          ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white ring-4 ring-purple-300 scale-105 shadow-2xl'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-purple-100 text-gray-900'
                      } [transform:translateZ(10px)] hover:[transform:translateZ(25px)] min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center px-2`}
                    >
                      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">🏠</span>
                      <p className="text-xs sm:text-sm font-bold leading-tight">혼자 있는 게 편함</p>
                    </PremiumCard>
                  </div>
                  <div onClick={() => handlePersonality('introvert', false)}>
                    <PremiumCard
                      hover
                      className={`cursor-pointer text-center transition-all duration-300 ${
                        personality.introvert === false
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-300 scale-105 shadow-2xl'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 text-gray-900'
                      } [transform:translateZ(10px)] hover:[transform:translateZ(25px)] min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center px-2`}
                    >
                      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">👥</span>
                      <p className="text-xs sm:text-sm font-bold leading-tight">사람들과 어울리기 좋아함</p>
                    </PremiumCard>
                  </div>
                </div>
              </PremiumCard>

              {/* 질문 2 */}
              <PremiumCard hover className="bg-gradient-to-br from-white/95 to-cyan-50/90 [transform:translateZ(15px)] hover:[transform:translateZ(30px)] transition-all duration-300">
                <label className="block text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  🤔 문제를 해결할 때...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div onClick={() => handlePersonality('logical', true)}>
                    <PremiumCard
                      hover
                      className={`cursor-pointer text-center transition-all duration-300 ${
                        personality.logical === true
                          ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white ring-4 ring-cyan-300 scale-105 shadow-2xl'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-cyan-50 hover:to-cyan-100 text-gray-900'
                      } [transform:translateZ(10px)] hover:[transform:translateZ(25px)] min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center px-2`}
                    >
                      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">🧮</span>
                      <p className="text-xs sm:text-sm font-bold leading-tight">논리적으로 분석</p>
                    </PremiumCard>
                  </div>
                  <div onClick={() => handlePersonality('logical', false)}>
                    <PremiumCard
                      hover
                      className={`cursor-pointer text-center transition-all duration-300 ${
                        personality.logical === false
                          ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white ring-4 ring-pink-300 scale-105 shadow-2xl'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-pink-100 text-gray-900'
                      } [transform:translateZ(10px)] hover:[transform:translateZ(25px)] min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center px-2`}
                    >
                      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">💫</span>
                      <p className="text-xs sm:text-sm font-bold leading-tight">직감으로 결정</p>
                    </PremiumCard>
                  </div>
                </div>
              </PremiumCard>

              {/* 질문 3 */}
              <PremiumCard hover className="bg-gradient-to-br from-white/95 to-orange-50/90 [transform:translateZ(15px)] hover:[transform:translateZ(30px)] transition-all duration-300">
                <label className="block text-base sm:text-lg font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-3">
                  ✨ 새로운 것에 대해...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div onClick={() => handlePersonality('adventurous', true)}>
                    <PremiumCard
                      hover
                      className={`cursor-pointer text-center transition-all duration-300 ${
                        personality.adventurous === true
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-300 scale-105 shadow-2xl'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 text-gray-900'
                      } [transform:translateZ(10px)] hover:[transform:translateZ(25px)] min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center px-2`}
                    >
                      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">🗺️</span>
                      <p className="text-xs sm:text-sm font-bold leading-tight">도전적이고 모험 좋아함</p>
                    </PremiumCard>
                  </div>
                  <div onClick={() => handlePersonality('adventurous', false)}>
                    <PremiumCard
                      hover
                      className={`cursor-pointer text-center transition-all duration-300 ${
                        personality.adventurous === false
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white ring-4 ring-green-300 scale-105 shadow-2xl'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 text-gray-900'
                      } [transform:translateZ(10px)] hover:[transform:translateZ(25px)] min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center px-2`}
                    >
                      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">🏡</span>
                      <p className="text-xs sm:text-sm font-bold leading-tight">안정적인 것 선호</p>
                    </PremiumCard>
                  </div>
                </div>
              </PremiumCard>

              {/* 질문 4 */}
              <PremiumCard hover className="bg-gradient-to-br from-white/95 to-indigo-50/90 [transform:translateZ(15px)] hover:[transform:translateZ(30px)] transition-all duration-300">
                <label className="block text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  💼 일할 때...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div onClick={() => handlePersonality('creative', true)}>
                    <PremiumCard
                      hover
                      className={`cursor-pointer text-center transition-all duration-300 ${
                        personality.creative === true
                          ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white ring-4 ring-purple-300 scale-105 shadow-2xl'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-purple-100 text-gray-900'
                      } [transform:translateZ(10px)] hover:[transform:translateZ(25px)] min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center px-2`}
                    >
                      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">🎨</span>
                      <p className="text-xs sm:text-sm font-bold leading-tight">창의적 작업 선호</p>
                    </PremiumCard>
                  </div>
                  <div onClick={() => handlePersonality('creative', false)}>
                    <PremiumCard
                      hover
                      className={`cursor-pointer text-center transition-all duration-300 ${
                        personality.creative === false
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white ring-4 ring-teal-300 scale-105 shadow-2xl'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-teal-50 hover:to-teal-100 text-gray-900'
                      } [transform:translateZ(10px)] hover:[transform:translateZ(25px)] min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center px-2`}
                    >
                      <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">📋</span>
                      <p className="text-xs sm:text-sm font-bold leading-tight">체계적 업무 선호</p>
                    </PremiumCard>
                  </div>
                </div>
              </PremiumCard>

              <div className="flex gap-3 sm:gap-4 [transform:translateZ(30px)]">
                <PremiumButton
                  onClick={() => setStep(1)}
                  size="lg"
                  className="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 flex-shrink-0 shadow-xl"
                >
                  ⬅️ 이전
                </PremiumButton>
                <PremiumButton
                  onClick={findMatchingHero}
                  disabled={!allAnswered}
                  fullWidth
                  size="lg"
                  className={!allAnswered ? 'opacity-50 cursor-not-allowed' : 'shadow-2xl'}
                >
                  ✨ 위인 찾기
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        </div>
      </PremiumLayout>
    );
  }

  // Step 3: 결과
  if (step === 3 && result) {
    return (
      <PremiumLayout theme="purple" showStars={true}>
        <div className="mx-auto max-w-[600px] px-4 py-6 sm:py-8">
          <PremiumCard gradient hover>
            <header className="text-center mb-4 sm:mb-6 [transform:translateZ(40px)]">
              <h1 className="text-5xl sm:text-6xl mb-3 animate-bounce-slow drop-shadow-2xl [transform:translateZ(60px)]">
                {result.image_emoji}
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent mb-2 drop-shadow-lg [text-shadow:_0_4px_16px_rgba(255,215,0,0.6)]">
                당신과 닮은 전생 위인
              </h2>
              <PremiumCard hover gradient className="inline-block mt-2 [transform:translateZ(20px)] hover:[transform:translateZ(35px)] animate-pulse-slow">
                <p className="text-white font-bold text-base sm:text-lg drop-shadow-lg">
                  ✨ 매칭도: <span className="text-lg sm:text-xl text-yellow-200">{matchScore}점</span>
                </p>
              </PremiumCard>
            </header>

            <div className="space-y-4 sm:space-y-6">
              {/* 위인 정보 */}
              <PremiumCard hover gradient className="text-center [transform:translateZ(25px)] hover:[transform:translateZ(40px)] transition-all duration-500 shadow-2xl">
                <div className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  {result.era} · {result.country}
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-3 drop-shadow-lg">
                  {result.name_kr}
                </div>
                <div className="text-xl text-white/90 mb-2 font-semibold drop-shadow-md">{result.name_en}</div>
                <div className="text-sm text-white/80 font-medium">
                  {result.birth_year}년 ~ {result.death_year || '현재'}년 · {result.field}
                </div>
              </PremiumCard>

              {/* 주요 업적 */}
              <PremiumCard hover className="bg-gradient-to-br from-amber-50 to-yellow-50 [transform:translateZ(20px)] hover:[transform:translateZ(35px)] transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2 [transform:translateZ(10px)]">
                  <span className="text-3xl drop-shadow-lg">🏆</span>
                  주요 업적
                </h3>
                <div className="space-y-3">
                  {result.major_achievements.slice(0, 5).map((achievement, i) => (
                    <PremiumCard key={i} hover className="bg-white shadow-md [transform:translateZ(10px)] hover:[transform:translateZ(20px)] transition-all">
                      <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed text-center">• {achievement}</p>
                    </PremiumCard>
                  ))}
                </div>
              </PremiumCard>

              {/* 성격 특징 */}
              <PremiumCard hover className="bg-gradient-to-br from-purple-50 to-pink-50 [transform:translateZ(20px)] hover:[transform:translateZ(35px)] transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2 [transform:translateZ(10px)]">
                  <span className="text-3xl drop-shadow-lg">🎭</span>
                  성격 특징
                </h3>
                <PremiumCard className="bg-white/80 mb-4 shadow-inner [transform:translateZ(10px)]">
                  <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed text-center">{result.personality_description}</p>
                </PremiumCard>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.traits_keywords.map((trait, i) => (
                    <span key={i} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-110 transition-all [transform:translateZ(5px)]">
                      {trait}
                    </span>
                  ))}
                </div>
              </PremiumCard>

              {/* 명언 */}
              <PremiumCard hover gradient className="[transform:translateZ(25px)] hover:[transform:translateZ(40px)] transition-all duration-500 shadow-2xl">
                <h3 className="font-bold text-lg sm:text-xl text-white mb-4 text-center drop-shadow-lg flex items-center justify-center gap-2 [transform:translateZ(10px)]">
                  <span className="text-3xl drop-shadow-2xl">💬</span>
                  명언
                </h3>
                <PremiumCard className="bg-white/20 backdrop-blur-sm [transform:translateZ(15px)] shadow-inner">
                  <p className="text-white text-sm sm:text-lg italic leading-relaxed font-semibold text-center drop-shadow-md">
                    "{result.famous_quote}"
                  </p>
                </PremiumCard>
              </PremiumCard>

              {/* 인생 교훈 */}
              <PremiumCard hover className="bg-gradient-to-br from-blue-50 to-cyan-50 [transform:translateZ(20px)] hover:[transform:translateZ(35px)] transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2 [transform:translateZ(10px)]">
                  <span className="text-3xl drop-shadow-lg">📖</span>
                  인생 교훈
                </h3>
                <PremiumCard className="bg-white shadow-inner [transform:translateZ(10px)]">
                  <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed text-center">{result.life_lesson}</p>
                </PremiumCard>
              </PremiumCard>

              {/* 현대적 영향 */}
              <PremiumCard hover className="bg-gradient-to-br from-green-50 to-emerald-50 [transform:translateZ(20px)] hover:[transform:translateZ(35px)] transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2 [transform:translateZ(10px)]">
                  <span className="text-3xl drop-shadow-lg">🌍</span>
                  현대적 영향
                </h3>
                <PremiumCard className="bg-white shadow-inner [transform:translateZ(10px)]">
                  <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed text-center">{result.modern_influence}</p>
                </PremiumCard>
              </PremiumCard>

              {/* 사주 오행 */}
              <PremiumCard hover className="bg-gradient-to-br from-indigo-50 to-purple-50 [transform:translateZ(20px)] hover:[transform:translateZ(35px)] transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2 [transform:translateZ(10px)]">
                  <span className="text-3xl drop-shadow-lg">☯️</span>
                  오행 궁합
                </h3>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {Object.entries(result.saju_compatibility).map(([element, score]) => (
                    <PremiumCard key={element} hover className="text-center bg-white shadow-md [transform:translateZ(10px)] hover:[transform:translateZ(20px)] transition-all">
                      <div className="text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {element === 'wood' ? '목🌳' : element === 'fire' ? '화🔥' : element === 'earth' ? '토🏔️' : element === 'metal' ? '금⚔️' : '수💧'}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{score}</div>
                    </PremiumCard>
                  ))}
                </div>
              </PremiumCard>

              <div className="[transform:translateZ(30px)]">
                <PremiumButton
                  onClick={() => {
                    setStep(1);
                    setResult(null);
                    setPersonality({
                      introvert: null,
                      logical: null,
                      adventurous: null,
                      creative: null
                    });
                  }}
                  fullWidth
                  size="lg"
                  className="shadow-2xl"
                >
                  🔄 다시 찾기
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        </div>
      </PremiumLayout>
    );
  }

  return null;
}
