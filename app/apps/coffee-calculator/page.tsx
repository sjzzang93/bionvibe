"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';

import RelatedApps from '@/app/components/RelatedApps';
// 카페인 데이터베이스 (mg 단위)
const CAFFEINE_DB = {
  coffee: [
    { name: '아메리카노 (Tall)', caffeine: 150, volume: 355 },
    { name: '아메리카노 (Grande)', caffeine: 225, volume: 473 },
    { name: '아메리카노 (Venti)', caffeine: 300, volume: 591 },
    { name: '에스프레소 (1샷)', caffeine: 75, volume: 30 },
    { name: '에스프레소 (2샷)', caffeine: 150, volume: 60 },
    { name: '카페라떼 (Tall)', caffeine: 75, volume: 355 },
    { name: '카페라떼 (Grande)', caffeine: 150, volume: 473 },
    { name: '카페라떼 (Venti)', caffeine: 225, volume: 591 },
    { name: '카푸치노 (Tall)', caffeine: 75, volume: 355 },
    { name: '카푸치노 (Grande)', caffeine: 150, volume: 473 },
    { name: '콜드브루 (Tall)', caffeine: 155, volume: 355 },
    { name: '콜드브루 (Grande)', caffeine: 205, volume: 473 },
    { name: '콜드브루 (Venti)', caffeine: 310, volume: 591 },
    { name: '드립커피 (Small)', caffeine: 180, volume: 237 },
    { name: '드립커피 (Medium)', caffeine: 270, volume: 355 },
    { name: '드립커피 (Large)', caffeine: 360, volume: 473 },
    { name: '인스턴트 커피 (1스틱)', caffeine: 50, volume: 200 },
    { name: '디카페인 커피', caffeine: 5, volume: 355 },
    { name: '더치커피 (200ml)', caffeine: 120, volume: 200 },
    { name: '핸드드립 (200ml)', caffeine: 140, volume: 200 }
  ],
  tea: [
    { name: '녹차 (200ml)', caffeine: 35, volume: 200 },
    { name: '홍차 (200ml)', caffeine: 47, volume: 200 },
    { name: '우롱차 (200ml)', caffeine: 37, volume: 200 },
    { name: '백차 (200ml)', caffeine: 30, volume: 200 },
    { name: '말차 라떼 (Grande)', caffeine: 80, volume: 473 },
    { name: '얼그레이 (200ml)', caffeine: 50, volume: 200 },
    { name: '자스민차 (200ml)', caffeine: 25, volume: 200 },
    { name: '허브티 (카페인 없음)', caffeine: 0, volume: 200 }
  ],
  energy: [
    { name: '레드불 (250ml)', caffeine: 80, volume: 250 },
    { name: '핫식스 (250ml)', caffeine: 60, volume: 250 },
    { name: '몬스터 에너지 (355ml)', caffeine: 160, volume: 355 },
    { name: '번인사이더 (250ml)', caffeine: 80, volume: 250 },
    { name: '박카스 (100ml)', caffeine: 30, volume: 100 },
    { name: '비타500 (100ml)', caffeine: 0, volume: 100 }
  ],
  soda: [
    { name: '코카콜라 (355ml)', caffeine: 34, volume: 355 },
    { name: '펩시 (355ml)', caffeine: 38, volume: 355 },
    { name: '마운틴듀 (355ml)', caffeine: 54, volume: 355 },
    { name: '닥터페퍼 (355ml)', caffeine: 41, volume: 355 },
    { name: '제로콜라 (355ml)', caffeine: 46, volume: 355 },
    { name: '스프라이트 (카페인 없음)', caffeine: 0, volume: 355 }
  ],
  chocolate: [
    { name: '다크 초콜릿 (30g)', caffeine: 25, volume: 30 },
    { name: '밀크 초콜릿 (30g)', caffeine: 10, volume: 30 },
    { name: '화이트 초콜릿 (30g)', caffeine: 0, volume: 30 },
    { name: '카카오 70% 이상 (30g)', caffeine: 35, volume: 30 },
    { name: '초코우유 (200ml)', caffeine: 5, volume: 200 }
  ]
};

interface CaffeineIntake {
  category: string;
  item: string;
  caffeine: number;
  amount: number;
  time: string;
}

export default function CoffeeCalculator() {
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(30);
  const [sensitivity, setSensitivity] = useState<'low' | 'normal' | 'high'>('normal');
  const [pregnant, setPregnant] = useState(false);
  const [health, setHealth] = useState<string[]>([]);
  const [intakes, setIntakes] = useState<CaffeineIntake[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('coffee');
  const [selectedItem, setSelectedItem] = useState(0);
  const [amount, setAmount] = useState(1);
  const [time, setTime] = useState('09:00');
  const [result, setResult] = useState<any>(null);

  const healthConditions = [
    { id: 'heart', label: '심혈관 질환', impact: -100 },
    { id: 'hypertension', label: '고혈압', impact: -100 },
    { id: 'anxiety', label: '불안장애', impact: -150 },
    { id: 'insomnia', label: '불면증', impact: -100 },
    { id: 'gastritis', label: '위염/역류성식도염', impact: -100 },
    { id: 'osteoporosis', label: '골다공증', impact: -50 }
  ];

  const addIntake = () => {
    const categoryData = CAFFEINE_DB[selectedCategory as keyof typeof CAFFEINE_DB];
    const item = categoryData[selectedItem];
    
    setIntakes([...intakes, {
      category: selectedCategory,
      item: item.name,
      caffeine: item.caffeine,
      amount: amount,
      time: time
    }]);
    
    setShowAddForm(false);
    setAmount(1);
  };

  const removeIntake = (index: number) => {
    setIntakes(intakes.filter((_, i) => i !== index));
  };

  const calculate = () => {
    // 기본 권장량 계산
    let maxCaffeine = 400; // FDA 권장량 (성인)
    
    // 체중 고려 (체중 kg당 6mg 이하)
    const weightBased = weight * 6;
    maxCaffeine = Math.min(maxCaffeine, weightBased);

    // 나이 고려
    if (age < 18) maxCaffeine = 100;
    else if (age >= 65) maxCaffeine = 300;

    // 임신/수유
    if (pregnant) maxCaffeine = 200;

    // 카페인 민감도
    if (sensitivity === 'high') maxCaffeine *= 0.6;
    else if (sensitivity === 'low') maxCaffeine *= 1.2;

    // 건강 상태
    health.forEach(condition => {
      const found = healthConditions.find(h => h.id === condition);
      if (found) maxCaffeine += found.impact;
    });

    maxCaffeine = Math.max(100, Math.round(maxCaffeine));

    // 현재 섭취량
    const totalCaffeine = intakes.reduce((sum, item) => sum + (item.caffeine * item.amount), 0);

    // 반감기 계산 (카페인 반감기 5시간)
    const now = new Date();
    const currentHour = now.getHours();
    
    let activeCaffeine = 0;
    intakes.forEach(intake => {
      const [intakeHour] = intake.time.split(':').map(Number);
      const hoursPassed = (currentHour - intakeHour + 24) % 24;
      const halfLives = hoursPassed / 5;
      const remaining = (intake.caffeine * intake.amount) * Math.pow(0.5, halfLives);
      activeCaffeine += remaining;
    });

    // 효과 시간대 분석
    const effectTimeline = [];
    for (let hour = 0; hour < 24; hour++) {
      let caffeineAtHour = 0;
      intakes.forEach(intake => {
        const [intakeHour] = intake.time.split(':').map(Number);
        const hoursPassed = (hour - intakeHour + 24) % 24;
        if (hoursPassed >= 0) {
          const halfLives = hoursPassed / 5;
          const remaining = (intake.caffeine * intake.amount) * Math.pow(0.5, halfLives);
          caffeineAtHour += remaining;
        }
      });
      effectTimeline.push({
        hour: `${String(hour).padStart(2, '0')}:00`,
        level: Math.round(caffeineAtHour)
      });
    }

    // 부작용 분석
    const sideEffects = [];
    if (totalCaffeine > maxCaffeine) {
      sideEffects.push('권장량 초과 - 섭취 줄이기 필요');
    }
    if (totalCaffeine > 500) {
      sideEffects.push('⚠️ 심각한 과다 섭취 - 두통, 불안, 떨림 가능');
    }
    if (totalCaffeine > 600) {
      sideEffects.push('🚨 위험 수준 - 즉시 섭취 중단 필요');
    }
    if (activeCaffeine > 200 && currentHour >= 18) {
      sideEffects.push('저녁 시간 카페인 과다 - 수면 장애 위험');
    }

    // 다음 섭취 가능 시간
    const remainingQuota = maxCaffeine - totalCaffeine;
    let nextCoffeeTime = '지금 가능';
    if (remainingQuota <= 0) {
      nextCoffeeTime = '오늘은 더 이상 섭취 불가';
    } else if (activeCaffeine > maxCaffeine * 0.7) {
      const hoursToWait = Math.ceil((Math.log(activeCaffeine / (maxCaffeine * 0.5)) / Math.log(2)) * 5);
      nextCoffeeTime = `약 ${hoursToWait}시간 후`;
    }

    // 권장 사항
    const recommendations = [];
    if (totalCaffeine < maxCaffeine * 0.5) {
      recommendations.push('✅ 적정 수준 유지 중 - 건강한 섭취');
    }
    if (totalCaffeine > maxCaffeine * 0.8) {
      recommendations.push('⚠️ 권장량의 80% 이상 - 주의 필요');
    }
    if (intakes.some(i => parseInt(i.time.split(':')[0]) >= 15)) {
      recommendations.push('💤 오후 3시 이후 카페인 섭취 - 수면 방해 가능');
    }
    if (intakes.length === 0) {
      recommendations.push('카페인 섭취 기록을 추가하세요');
    }
    recommendations.push('물을 충분히 마셔 카페인 대사 촉진');
    recommendations.push('카페인 반감기는 약 5시간입니다');

    setResult({
      maxCaffeine,
      totalCaffeine,
      activeCaffeine: Math.round(activeCaffeine),
      percentage: Math.round((totalCaffeine / maxCaffeine) * 100),
      remainingQuota: Math.max(0, remainingQuota),
      sideEffects,
      recommendations,
      effectTimeline,
      nextCoffeeTime
    });
  };

  if (result) {
    return (
      <PremiumLayout theme="orange" showStars={true}>
        <div className="mx-auto max-w-[600px] px-4 py-6 sm:py-8">
          <PremiumCard gradient hover>
            <header className="text-center mb-6 sm:mb-8">
              <h1 className="text-6xl sm:text-7xl font-bold mb-4 animate-bounce-slow drop-shadow-2xl">☕</h1>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">카페인 섭취 분석</h2>
            </header>

            {/* 종합 현황 */}
            <PremiumCard 
              hover 
              className="mb-6 text-center [transform:translateZ(20px)] hover:[transform:translateZ(30px)]" 
              style={{
                backgroundColor: result.percentage <= 70 ? '#f0fdf4' : result.percentage <= 100 ? '#fffbeb' : '#fef2f2'
              }}
            >
              <div className="text-6xl sm:text-7xl font-bold mb-3 drop-shadow-lg" style={{
                background: result.percentage <= 70 ? 'linear-gradient(135deg, #10b981, #059669)' :
                           result.percentage <= 100 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                           'linear-gradient(135deg, #ef4444, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {result.percentage}%
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {result.totalCaffeine}mg / {result.maxCaffeine}mg
              </div>
              <div className="text-base sm:text-lg font-semibold text-gray-700">
                {result.percentage <= 70 ? '✅ 안전한 수준' :
                 result.percentage <= 100 ? '⚠️ 주의 필요' :
                 '🚨 과다 섭취'}
              </div>
            </PremiumCard>

            {/* 현재 활성 카페인 */}
            <PremiumCard hover className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 [transform:translateZ(15px)] hover:[transform:translateZ(25px)]">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-3 flex items-center gap-2 justify-center">
                <span className="text-xl sm:text-2xl">🔄</span>
                현재 체내 활성 카페인
              </h3>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold mb-2 text-blue-600 drop-shadow-md">{result.activeCaffeine}mg</div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">반감기 고려 현재 수준</div>
              </div>
            </PremiumCard>

            {/* 섭취 내역 */}
            {intakes.length > 0 && (
              <PremiumCard className="mb-6 [transform:translateZ(10px)]">
                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📋</span>
                  오늘의 섭취 내역
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {intakes.map((intake, i) => (
                    <PremiumCard key={i} hover className="bg-gradient-to-r from-amber-50 to-yellow-50 [transform:translateZ(5px)] hover:[transform:translateZ(15px)]">
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1">
                          <div className="font-bold text-base sm:text-lg text-gray-800">{intake.item}</div>
                          <div className="text-xs sm:text-sm text-gray-600 font-medium">
                            {intake.time} · {intake.amount}개 · {intake.caffeine * intake.amount}mg
                          </div>
                        </div>
                        <div className="font-bold text-lg sm:text-xl text-amber-700 flex-shrink-0">
                          ☕ {intake.caffeine}mg
                        </div>
                      </div>
                    </PremiumCard>
                  ))}
                </div>
              </PremiumCard>
            )}

            {/* 24시간 카페인 그래프 */}
            <PremiumCard hover className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 [transform:translateZ(15px)] hover:[transform:translateZ(25px)]">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📊</span>
                24시간 카페인 농도 변화
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {result.effectTimeline.filter((_: any, i: number) => i % 2 === 0).map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <span className="w-12 sm:w-14 text-gray-700 font-semibold">{item.hour}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-5 sm:h-6 overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (item.level / result.maxCaffeine) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="w-14 sm:w-16 text-right font-bold text-gray-800">{item.level}mg</span>
                  </div>
                ))}
              </div>
            </PremiumCard>

            {/* 다음 섭취 가능 시간 */}
            <PremiumCard hover className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 [transform:translateZ(15px)] hover:[transform:translateZ(25px)]">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-3 flex items-center gap-2 justify-center">
                <span className="text-xl sm:text-2xl">⏰</span>
                다음 커피 가능 시간
              </h3>
              <div className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-2">{result.nextCoffeeTime}</div>
              <div className="text-sm sm:text-base text-gray-600 text-center font-medium mb-4">남은 권장량: {result.remainingQuota}mg</div>
              <PremiumCard className="text-center bg-white [transform:translateZ(10px)]">
                <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">아메리카노 1샷 기준</div>
                <div className="text-4xl sm:text-5xl font-bold text-amber-700 mb-2">
                  ☕ {Math.floor(result.remainingQuota / 75)}잔
                </div>
                <div className="text-xs sm:text-sm text-gray-500">(에스프레소 1샷 = 75mg)</div>
              </PremiumCard>
            </PremiumCard>

            {/* 현재 섭취량 아메리카노 환산 */}
            <PremiumCard hover className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 [transform:translateZ(15px)] hover:[transform:translateZ(25px)]">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4 flex items-center gap-2 justify-center">
                <span className="text-xl sm:text-2xl">📊</span>
                현재 섭취량
              </h3>
              <PremiumCard className="text-center bg-white [transform:translateZ(10px)]">
                <div className="text-sm sm:text-base text-gray-600 mb-2 font-medium">아메리카노로 환산하면</div>
                <div className="text-4xl sm:text-5xl font-bold text-orange-600 mb-2">
                  ☕ {(result.totalCaffeine / 75).toFixed(1)}잔
                </div>
                <div className="text-xs sm:text-sm text-gray-500">총 {result.totalCaffeine}mg 섭취</div>
              </PremiumCard>
            </PremiumCard>

            {/* 부작용 경고 */}
            {result.sideEffects.length > 0 && (
              <PremiumCard hover className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 [transform:translateZ(15px)] hover:[transform:translateZ(25px)]">
                <h3 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">⚠️</span>
                  주의사항
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {result.sideEffects.map((effect: string, i: number) => (
                    <PremiumCard key={i} className="bg-white [transform:translateZ(5px)]">
                      <p className="text-sm sm:text-base font-semibold text-gray-800">{effect}</p>
                    </PremiumCard>
                  ))}
                </div>
              </PremiumCard>
            )}

            {/* 권장사항 */}
            <PremiumCard hover className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 [transform:translateZ(15px)] hover:[transform:translateZ(25px)]">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">💡</span>
                권장사항
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {result.recommendations.map((rec: string, i: number) => (
                  <PremiumCard key={i} className="bg-white [transform:translateZ(5px)]">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">• {rec}</p>
                  </PremiumCard>
                ))}
              </div>
            </PremiumCard>

            <PremiumButton
              onClick={() => setResult(null)}
              fullWidth
              size="lg"
            >
              다시 계산하기
            </PremiumButton>
          </PremiumCard>
        </div>
      </PremiumLayout>
    );
  }

  return (
    <PremiumLayout theme="orange" showStars={true}>
      <div className="mx-auto max-w-[600px] px-4 py-6 sm:py-8">
        <PremiumCard gradient hover>
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-6xl sm:text-7xl font-bold mb-4 animate-bounce-slow drop-shadow-2xl">☕</h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-lg">커피 하루 권장량 계산기</h2>
            <p className="text-base sm:text-lg text-white/90 drop-shadow-md">과학적 데이터 기반 카페인 섭취 분석</p>
          </header>

          <div className="space-y-4 sm:space-y-6">
            {/* 기본 정보 */}
            <PremiumCard className="bg-white/90 [transform:translateZ(10px)]">
              <label className="block text-sm sm:text-base font-bold text-gray-800 mb-3">체중: <span className="text-amber-600">{weight}kg</span></label>
              <input
                type="range"
                min="40"
                max="150"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                <span>40kg</span>
                <span>150kg</span>
              </div>
            </PremiumCard>

            <PremiumCard className="bg-white/90 [transform:translateZ(10px)]">
              <label className="block text-sm sm:text-base font-bold text-gray-800 mb-3">나이: <span className="text-amber-600">{age}세</span></label>
              <input
                type="range"
                min="15"
                max="80"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                <span>15세</span>
                <span>80세</span>
              </div>
            </PremiumCard>

            <PremiumCard className="bg-white/90 [transform:translateZ(10px)]">
              <label className="block text-sm sm:text-base font-bold text-gray-800 mb-3">카페인 민감도</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(['low', 'normal', 'high'] as const).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSensitivity(level)}
                    className={`cursor-pointer text-center rounded-xl px-4 py-3 font-bold text-sm sm:text-base transition-all duration-100 min-h-[48px] ${
                      sensitivity === level
                        ? 'bg-red-600 text-white ring-4 ring-red-300 scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {level === 'low' ? '낮음' : level === 'normal' ? '보통' : '높음'}
                  </button>
                ))}
              </div>
            </PremiumCard>

            <PremiumCard className="bg-white/90 [transform:translateZ(10px)]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="pregnant"
                  checked={pregnant}
                  onChange={(e) => setPregnant(e.target.checked)}
                  className="w-5 h-5 accent-amber-600"
                />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  임신 중이거나 수유 중입니다
                </span>
              </label>
            </PremiumCard>

            <PremiumCard className="bg-white/90 [transform:translateZ(10px)]">
              <label className="block text-sm sm:text-base font-bold text-gray-800 mb-3">건강 상태 (해당사항 선택)</label>
              <div className="space-y-2">
                {healthConditions.map(condition => (
                  <label key={condition.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border-2 border-amber-200 hover:border-amber-400 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={health.includes(condition.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHealth([...health, condition.id]);
                        } else {
                          setHealth(health.filter(h => h !== condition.id));
                        }
                      }}
                      className="w-5 h-5 accent-amber-600"
                    />
                    <span className="text-sm sm:text-base text-gray-800 font-medium">{condition.label}</span>
                  </label>
                ))}
              </div>
            </PremiumCard>

            {/* 카페인 섭취 기록 */}
            <PremiumCard className="bg-white/80 border-t-4 border-white/50 [transform:translateZ(15px)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg sm:text-xl text-gray-800 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📋</span>
                  오늘 마신 음료
                </h3>
                <PremiumButton
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 text-sm sm:text-base"
                >
                  + 추가
                </PremiumButton>
              </div>

              {intakes.length > 0 && (
                <div className="mb-4 space-y-2 sm:space-y-3">
                  {intakes.map((intake, i) => (
                    <PremiumCard key={i} hover className="bg-amber-50 [transform:translateZ(5px)] hover:[transform:translateZ(15px)]">
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1">
                          <div className="font-bold text-base sm:text-lg text-gray-800">{intake.item}</div>
                          <div className="text-xs sm:text-sm text-gray-600 font-medium">
                            {intake.time} · {intake.amount}개 · {intake.caffeine * intake.amount}mg
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeIntake(i)}
                          className="text-2xl font-bold hover:text-red-600 hover:scale-110 transition-transform flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    </PremiumCard>
                  ))}
                </div>
              )}

              {showAddForm && (
                <PremiumCard className="bg-amber-50 border-2 border-amber-300 space-y-3 [transform:translateZ(10px)]">
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-gray-800 mb-2">카테고리</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedItem(0);
                      }}
                      className="w-full px-4 py-3 border-2 border-amber-400 rounded-lg bg-white font-semibold text-base focus:border-amber-600 focus:outline-none"
                    >
                      <option value="coffee">☕ 커피</option>
                      <option value="tea">🍵 차</option>
                      <option value="energy">⚡ 에너지 드링크</option>
                      <option value="soda">🥤 탄산음료</option>
                      <option value="chocolate">🍫 초콜릿</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-gray-800 mb-2">음료/식품</label>
                    <select
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-amber-400 rounded-lg bg-white font-semibold text-base focus:border-amber-600 focus:outline-none"
                    >
                      {CAFFEINE_DB[selectedCategory as keyof typeof CAFFEINE_DB].map((item, i) => (
                        <option key={i} value={i}>{item.name} ({item.caffeine}mg)</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-gray-800 mb-2">개수</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-amber-400 rounded-lg bg-white font-semibold text-base focus:border-amber-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-gray-800 mb-2">시간</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-amber-400 rounded-lg bg-white font-semibold text-base focus:border-amber-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <PremiumButton
                    onClick={addIntake}
                    fullWidth
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    추가하기
                  </PremiumButton>
                </PremiumCard>
              )}
            </PremiumCard>

            <PremiumCard hover className="bg-gradient-to-r from-amber-100 to-orange-100 [transform:translateZ(10px)] hover:[transform:translateZ(20px)]">
              <h3 className="font-bold text-base sm:text-lg mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📚</span>
                카페인 상식
              </h3>
              <ul className="text-sm sm:text-base space-y-2 text-gray-700">
                <li className="bg-white/60 rounded-lg p-2 font-medium">• FDA 권장: 성인 하루 400mg 이하</li>
                <li className="bg-white/60 rounded-lg p-2 font-medium">• 임산부: 200mg 이하</li>
                <li className="bg-white/60 rounded-lg p-2 font-medium">• 카페인 반감기: 약 5시간</li>
                <li className="bg-white/60 rounded-lg p-2 font-medium">• 오후 3시 이후 섭취는 수면 방해</li>
                <li className="bg-white/60 rounded-lg p-2 font-medium">• 개인차: 체중, 나이, 건강상태 고려</li>
              </ul>
            </PremiumCard>

            <PremiumButton
              onClick={calculate}
              fullWidth
              size="lg"
            >
              카페인 섭취량 분석하기
            </PremiumButton>
          </div>
        </PremiumCard>

      </div>
    </PremiumLayout>
  );
}

