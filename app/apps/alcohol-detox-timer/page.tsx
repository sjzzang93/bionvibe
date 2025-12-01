'use client';

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

interface DrinkItem {
  id: string;
  type: string;
  name: string;
  amount: number; // ml
  alcoholPercent: number;
  icon: string;
}

interface ResultData {
  totalAlcoholGrams: number;
  peakBAC: number;
  currentBAC: number;
  soberTime: Date;
  hoursToSober: number;
  driveTime: Date;
  hoursToDrive: number;
  status: 'sober' | 'light' | 'moderate' | 'heavy' | 'dangerous';
  statusMessage: string;
  statusColor: string;
  tips: string[];
}

const drinkTypes = [
  { type: 'soju', name: '소주', icon: '🍶', defaultAmount: 360, alcoholPercent: 17 },
  { type: 'beer', name: '맥주', icon: '🍺', defaultAmount: 500, alcoholPercent: 5 },
  { type: 'wine', name: '와인', icon: '🍷', defaultAmount: 150, alcoholPercent: 13 },
  { type: 'makgeolli', name: '막걸리', icon: '🥛', defaultAmount: 300, alcoholPercent: 6 },
  { type: 'whiskey', name: '위스키', icon: '🥃', defaultAmount: 45, alcoholPercent: 40 },
  { type: 'highball', name: '하이볼', icon: '🍹', defaultAmount: 350, alcoholPercent: 8 },
];

const sojuAmounts = [
  { label: '반 병', amount: 180 },
  { label: '1병', amount: 360 },
  { label: '1.5병', amount: 540 },
  { label: '2병', amount: 720 },
  { label: '3병', amount: 1080 },
];

const beerAmounts = [
  { label: '1캔 (355ml)', amount: 355 },
  { label: '1병 (500ml)', amount: 500 },
  { label: '큰 병 (640ml)', amount: 640 },
  { label: '2캔', amount: 710 },
  { label: '3캔', amount: 1065 },
];

export default function AlcoholDetoxTimerPage() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('70');
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [drinkStartTime, setDrinkStartTime] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 기본 시작 시간 설정
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setDrinkStartTime(`${hours}:${minutes}`);
  }, []);

  const addDrink = (type: typeof drinkTypes[0]) => {
    const newDrink: DrinkItem = {
      id: Date.now().toString(),
      type: type.type,
      name: type.name,
      amount: type.defaultAmount,
      alcoholPercent: type.alcoholPercent,
      icon: type.icon,
    };
    setDrinks([...drinks, newDrink]);
  };

  const updateDrinkAmount = (id: string, amount: number) => {
    setDrinks(drinks.map(d => d.id === id ? { ...d, amount } : d));
  };

  const removeDrink = (id: string) => {
    setDrinks(drinks.filter(d => d.id !== id));
  };

  const calculateBAC = () => {
    if (drinks.length === 0) {
      alert('마신 술을 추가해주세요!');
      return;
    }

    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      alert('체중을 입력해주세요!');
      return;
    }

    // 총 알코올 섭취량 (그램)
    // 알코올 밀도: 0.789 g/ml
    const totalAlcoholGrams = drinks.reduce((sum, drink) => {
      return sum + (drink.amount * (drink.alcoholPercent / 100) * 0.789);
    }, 0);

    // Widmark 공식으로 혈중알코올농도 계산
    // BAC = (알코올 그램 / (체중 kg × r)) × 100
    // r: 남성 0.68, 여성 0.55
    const r = gender === 'male' ? 0.68 : 0.55;
    const peakBAC = (totalAlcoholGrams / (weightNum * r)) * 100;

    // 음주 시작 시간 파싱
    const [startHour, startMinute] = drinkStartTime.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0);

    // 만약 설정 시간이 현재보다 미래면 어제로 간주
    if (startTime > currentTime) {
      startTime.setDate(startTime.getDate() - 1);
    }

    // 경과 시간 (시간 단위)
    const elapsedHours = (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // 현재 BAC (시간당 0.015% 감소)
    const metabolismRate = 0.015;
    const currentBAC = Math.max(0, peakBAC - (elapsedHours * metabolismRate));

    // 완전 해독 시간
    const hoursToSober = currentBAC / metabolismRate;
    const soberTime = new Date(currentTime.getTime() + hoursToSober * 60 * 60 * 1000);

    // 운전 가능 시간 (BAC 0.03% 이하)
    const driveBAC = 0.03;
    const hoursToDrive = currentBAC > driveBAC ? (currentBAC - driveBAC) / metabolismRate : 0;
    const driveTime = new Date(currentTime.getTime() + hoursToDrive * 60 * 60 * 1000);

    // 상태 판정
    let status: ResultData['status'];
    let statusMessage: string;
    let statusColor: string;
    let tips: string[] = [];

    if (currentBAC === 0) {
      status = 'sober';
      statusMessage = '완전 해독! 술이 다 빠졌어요 🎉';
      statusColor = 'from-green-500 to-emerald-500';
      tips = ['컨디션 회복을 위해 충분한 수면을 취하세요', '물을 많이 마셔 탈수를 예방하세요'];
    } else if (currentBAC < 0.03) {
      status = 'light';
      statusMessage = '거의 해독됨 - 곧 정상으로!';
      statusColor = 'from-lime-500 to-green-500';
      tips = ['운전은 아직 비추천', '가벼운 스트레칭으로 혈액순환 촉진'];
    } else if (currentBAC < 0.08) {
      status = 'moderate';
      statusMessage = '아직 취한 상태 - 주의 필요';
      statusColor = 'from-yellow-500 to-orange-500';
      tips = ['절대 운전 금지!', '물이나 이온음료 섭취', '휴식 취하기'];
    } else if (currentBAC < 0.15) {
      status = 'heavy';
      statusMessage = '많이 취함 - 안정 필요';
      statusColor = 'from-orange-500 to-red-500';
      tips = ['누워서 휴식하세요', '구토 시 옆으로 눕기', '따뜻한 물 섭취'];
    } else {
      status = 'dangerous';
      statusMessage = '위험 수준 - 건강 주의!';
      statusColor = 'from-red-500 to-red-700';
      tips = ['보호자 동반 필요', '증상이 심하면 병원 방문', '절대 혼자 있지 마세요'];
    }

    setResult({
      totalAlcoholGrams: Math.round(totalAlcoholGrams * 10) / 10,
      peakBAC: Math.round(peakBAC * 1000) / 1000,
      currentBAC: Math.round(currentBAC * 1000) / 1000,
      soberTime,
      hoursToSober: Math.round(hoursToSober * 10) / 10,
      driveTime,
      hoursToDrive: Math.round(hoursToDrive * 10) / 10,
      status,
      statusMessage,
      statusColor,
      tips,
    });
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}시 ${minutes.toString().padStart(2, '0')}분`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '내일';
    } else {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
  };

  return (
    <PremiumLayout theme="purple" showStars={true}>
      <AdOverlay />
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8" style={{ perspective: '1000px' }}>
        <PremiumCard gradient hover>
          <div className="text-center mb-6 sm:mb-8" style={{ transform: 'translateZ(30px)' }}>
            <h1 className="text-6xl sm:text-7xl font-bold mb-4 animate-bounce-slow drop-shadow-2xl">🍺</h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-lg">음주 해독 계산기</h2>
            <p className="text-base sm:text-lg text-white/90 drop-shadow-md">혈중알코올 농도 & 해독 시간 계산</p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* 성별 & 체중 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PremiumCard className="bg-white/90" style={{ transform: 'translateZ(15px)' }}>
                <label className="text-gray-800 font-bold mb-3 block text-sm sm:text-base">성별</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
                      gender === 'male'
                        ? 'bg-blue-500 text-white ring-4 ring-blue-300 shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    👨 남성
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
                      gender === 'female'
                        ? 'bg-pink-500 text-white ring-4 ring-pink-300 shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    👩 여성
                  </button>
                </div>
              </PremiumCard>

              <PremiumCard className="bg-white/90" style={{ transform: 'translateZ(15px)' }}>
                <label className="text-gray-800 font-bold mb-3 block text-sm sm:text-base">체중 (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="예: 70"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 text-base border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none font-semibold"
                  style={{ fontSize: '16px', minHeight: '48px' }}
                />
              </PremiumCard>
            </div>

            {/* 음주 시작 시간 */}
            <PremiumCard className="bg-white/90" style={{ transform: 'translateZ(15px)' }}>
              <label className="text-gray-800 font-bold mb-3 block text-sm sm:text-base">🕐 음주 시작 시간</label>
              <input
                type="time"
                value={drinkStartTime}
                onChange={(e) => setDrinkStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-gray-900 text-base border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none font-semibold"
                style={{ fontSize: '16px', minHeight: '48px' }}
              />
            </PremiumCard>

            {/* 술 종류 선택 */}
            <PremiumCard className="bg-white/90" style={{ transform: 'translateZ(15px)' }}>
              <label className="text-gray-800 font-bold mb-3 block text-sm sm:text-base">🍻 마신 술 추가</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {drinkTypes.map((drink) => (
                  <button
                    key={drink.type}
                    onClick={() => addDrink(drink)}
                    className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-purple-300"
                  >
                    <span className="text-3xl mb-1">{drink.icon}</span>
                    <span className="text-xs font-bold text-gray-700">{drink.name}</span>
                  </button>
                ))}
              </div>
            </PremiumCard>

            {/* 추가된 술 목록 */}
            {drinks.length > 0 && (
              <PremiumCard className="bg-white/90" style={{ transform: 'translateZ(20px)' }}>
                <label className="text-gray-800 font-bold mb-3 block text-sm sm:text-base">📋 마신 술 목록</label>
                <div className="space-y-3">
                  {drinks.map((drink) => (
                    <div
                      key={drink.id}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm"
                    >
                      <span className="text-3xl">{drink.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">{drink.name}</div>
                        <div className="text-sm text-gray-600">{drink.alcoholPercent}%</div>
                      </div>

                      {/* 양 선택 */}
                      {drink.type === 'soju' ? (
                        <select
                          value={drink.amount}
                          onChange={(e) => updateDrinkAmount(drink.id, Number(e.target.value))}
                          className="px-3 py-2 rounded-lg border-2 border-purple-200 text-gray-800 font-semibold text-sm"
                        >
                          {sojuAmounts.map((opt) => (
                            <option key={opt.amount} value={opt.amount}>{opt.label}</option>
                          ))}
                        </select>
                      ) : drink.type === 'beer' ? (
                        <select
                          value={drink.amount}
                          onChange={(e) => updateDrinkAmount(drink.id, Number(e.target.value))}
                          className="px-3 py-2 rounded-lg border-2 border-purple-200 text-gray-800 font-semibold text-sm"
                        >
                          {beerAmounts.map((opt) => (
                            <option key={opt.amount} value={opt.amount}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          value={drink.amount}
                          onChange={(e) => updateDrinkAmount(drink.id, Number(e.target.value))}
                          className="w-20 px-3 py-2 rounded-lg border-2 border-purple-200 text-gray-800 font-semibold text-sm text-center"
                          min="1"
                        />
                      )}
                      <span className="text-sm text-gray-600">ml</span>

                      <button
                        onClick={() => removeDrink(drink.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-purple-100 rounded-xl">
                  <div className="text-center text-purple-800 font-bold">
                    총 {drinks.length}잔 선택됨
                  </div>
                </div>
              </PremiumCard>
            )}

            <PremiumButton
              onClick={calculateBAC}
              fullWidth
              size="lg"
              className="shadow-2xl"
              style={{ transform: 'translateZ(25px)' }}
            >
              🔬 해독 시간 계산하기
            </PremiumButton>

            {/* 결과 */}
            {result && (
              <div className="space-y-4 pt-6">
                {/* 현재 상태 */}
                <PremiumCard
                  hover
                  className={`bg-gradient-to-r ${result.statusColor} shadow-2xl`}
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="text-center text-white">
                    <div className="text-6xl md:text-7xl mb-3">
                      {result.status === 'sober' ? '✅' :
                       result.status === 'light' ? '😊' :
                       result.status === 'moderate' ? '😵' :
                       result.status === 'heavy' ? '🥴' : '⚠️'}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold mb-2">{result.statusMessage}</div>
                    <div className="text-lg opacity-90">현재 혈중알코올농도</div>
                    <div className="text-5xl md:text-6xl font-black my-2">
                      {result.currentBAC.toFixed(3)}%
                    </div>
                  </div>
                </PremiumCard>

                {/* 해독 시간 정보 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PremiumCard hover style={{ transform: 'translateZ(20px)' }}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🚗</div>
                      <div className="text-sm text-gray-600 mb-1">운전 가능 시간</div>
                      <div className="text-2xl font-black text-blue-600">
                        {result.hoursToDrive === 0
                          ? '지금 가능!'
                          : `${result.hoursToDrive}시간 후`}
                      </div>
                      {result.hoursToDrive > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          {formatDate(result.driveTime)} {formatTime(result.driveTime)}
                        </div>
                      )}
                    </div>
                  </PremiumCard>

                  <PremiumCard hover style={{ transform: 'translateZ(20px)' }}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">✨</div>
                      <div className="text-sm text-gray-600 mb-1">완전 해독 시간</div>
                      <div className="text-2xl font-black text-green-600">
                        {result.hoursToSober === 0
                          ? '해독 완료!'
                          : `${result.hoursToSober}시간 후`}
                      </div>
                      {result.hoursToSober > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          {formatDate(result.soberTime)} {formatTime(result.soberTime)}
                        </div>
                      )}
                    </div>
                  </PremiumCard>
                </div>

                {/* 상세 정보 */}
                <PremiumCard hover style={{ transform: 'translateZ(15px)' }}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📊 상세 분석</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">총 알코올 섭취량</span>
                      <span className="font-bold text-purple-600">{result.totalAlcoholGrams}g</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">최고 혈중농도 (예상)</span>
                      <span className="font-bold text-red-600">{result.peakBAC.toFixed(3)}%</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">현재 혈중농도</span>
                      <span className="font-bold text-orange-600">{result.currentBAC.toFixed(3)}%</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">시간당 분해율</span>
                      <span className="font-bold text-blue-600">0.015%</span>
                    </div>
                  </div>
                </PremiumCard>

                {/* BAC 게이지 */}
                <PremiumCard hover style={{ transform: 'translateZ(15px)' }}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🎚️ 혈중알코올 수준</h3>
                  <div className="relative h-8 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 h-full bg-black/20"
                      style={{ left: `${Math.min(result.currentBAC / 0.2 * 100, 100)}%`, width: '4px' }}
                    />
                    <div
                      className="absolute -top-1 w-6 h-10 bg-white rounded-full shadow-lg border-2 border-gray-800 flex items-center justify-center"
                      style={{ left: `calc(${Math.min(result.currentBAC / 0.2 * 100, 100)}% - 12px)` }}
                    >
                      <span className="text-xs">📍</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>0%</span>
                    <span>0.03%<br/>(운전기준)</span>
                    <span>0.08%<br/>(취함)</span>
                    <span>0.15%<br/>(만취)</span>
                    <span>0.2%+</span>
                  </div>
                </PremiumCard>

                {/* 조언 */}
                {result.tips.length > 0 && (
                  <PremiumCard hover className="bg-gradient-to-r from-amber-50 to-yellow-50" style={{ transform: 'translateZ(15px)' }}>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">💡 지금 필요한 조언</h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-amber-500">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </PremiumCard>
                )}

                {/* 법적 기준 안내 */}
                <PremiumCard hover className="bg-gradient-to-r from-red-50 to-pink-50" style={{ transform: 'translateZ(10px)' }}>
                  <h3 className="text-lg font-bold text-red-800 mb-3">⚖️ 음주운전 법적 기준</h3>
                  <div className="space-y-2 text-sm text-red-700">
                    <div className="flex justify-between">
                      <span>혈중알코올 0.03% 이상</span>
                      <span className="font-bold">면허정지 + 벌금</span>
                    </div>
                    <div className="flex justify-between">
                      <span>혈중알코올 0.08% 이상</span>
                      <span className="font-bold">면허취소 + 형사처벌</span>
                    </div>
                  </div>
                </PremiumCard>

                {/* 관련 앱 */}
                <RelatedApps currentAppSlug="alcohol-detox-timer" className="mt-8" />
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-white/80 text-sm px-4">
            <p>본 계산기는 Widmark 공식 기반의 추정치입니다.</p>
            <p className="mt-2">실제 수치는 개인차가 있으며, 안전을 위해 충분한 시간을 두세요.</p>
          </div>
        </PremiumCard>
      </div>
    </PremiumLayout>
  );
}
