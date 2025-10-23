"use client";

import { useState } from 'react';
import AppFooter from '@/app/components/AppFooter';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
interface OutfitRecommendation {
  temp: number;
  weather: string;
  season: string;
  outfit: {
    outer: string[];
    top: string[];
    bottom: string[];
    accessories: string[];
  };
  tips: string[];
  emoji: string;
}

export default function WeatherOutfit() {
  // 현재 계절 자동 감지
  const getCurrentSeason = (): 'spring' | 'summer' | 'fall' | 'winter' => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  };

  const currentSeason = getCurrentSeason();
  
  const [temp, setTemp] = useState(20);
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy' | 'snowy'>('sunny');
  const [season, setSeason] = useState<'spring' | 'summer' | 'fall' | 'winter'>(currentSeason);
  const [result, setResult] = useState<OutfitRecommendation | null>(null);

  // 계절별 배경 스타일
  const getSeasonalStyle = () => {
    switch (currentSeason) {
      case 'spring':
        return {
          background: 'linear-gradient(135deg, #ffeef8 0%, #ffe4f3 25%, #ffc9e8 50%, #ffb5e0 100%)', // 벚꽃 핑크
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 192, 203, 0.3) 0%, transparent 50%)',
        };
      case 'summer':
        return {
          background: 'linear-gradient(135deg, #e0f7ff 0%, #b3e5ff 25%, #80d0ff 50%, #4db8ff 100%)', // 바다 블루
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.3) 0%, transparent 30%)',
        };
      case 'fall':
        return {
          background: 'linear-gradient(135deg, #fff5e6 0%, #ffe0b3 25%, #ffcc80 50%, #ffb74d 100%)', // 단풍 오렌지
          backgroundImage: 'radial-gradient(circle at 25% 35%, rgba(255, 87, 34, 0.2) 0%, transparent 40%), radial-gradient(circle at 75% 65%, rgba(255, 152, 0, 0.2) 0%, transparent 40%)',
        };
      case 'winter':
        return {
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 100%)', // 눈 블루
          backgroundImage: 'radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.8) 0%, transparent 20%), radial-gradient(circle at 85% 75%, rgba(255, 255, 255, 0.6) 0%, transparent 25%)',
        };
    }
  };

  const seasonalStyle = getSeasonalStyle();

  const getRecommendation = () => {
    const outfit: any = {
      outer: [],
      top: [],
      bottom: [],
      accessories: []
    };
    const tips: string[] = [];
    let emoji = '👔';

    // 온도별 옷차림
    if (temp >= 28) {
      emoji = '🌞';
      outfit.top = ['민소매', '반팔 티셔츠', '린넨 셔츠', '얇은 블라우스'];
      outfit.bottom = ['반바지', '미니스커트', '얇은 원피스', '면 바지'];
      outfit.accessories = ['선글라스', '모자', 'UV차단 크림', '부채'];
      tips.push('매우 더움 - 통풍이 잘 되는 밝은 색상 추천');
      tips.push('면, 린넨 소재가 땀 흡수에 좋음');
      tips.push('자외선 차단 필수');
    } else if (temp >= 23) {
      emoji = '☀️';
      outfit.top = ['반팔 티셔츠', '얇은 셔츠', '블라우스', '얇은 니트'];
      outfit.bottom = ['면바지', '청바지', '치마', '슬랙스'];
      outfit.accessories = ['선글라스', '가벼운 모자'];
      tips.push('반팔만으로 충분한 날씨');
      tips.push('실내 에어컨 대비 얇은 가디건 휴대 권장');
    } else if (temp >= 20) {
      emoji = '🌤️';
      outfit.outer = ['얇은 가디건', '얇은 바람막이'];
      outfit.top = ['긴팔 티셔츠', '얇은 니트', '셔츠'];
      outfit.bottom = ['청바지', '면바지', '긴치마'];
      outfit.accessories = ['가벼운 스카프'];
      tips.push('쾌적한 날씨 - 긴팔 하나로 충분');
      tips.push('아침저녁으로 쌀쌀할 수 있음');
    } else if (temp >= 17) {
      emoji = '🍂';
      outfit.outer = ['가디건', '후드집업', '얇은 자켓'];
      outfit.top = ['긴팔 티셔츠', '니트', '맨투맨'];
      outfit.bottom = ['청바지', '면바지', '긴치마'];
      outfit.accessories = ['얇은 스카프'];
      tips.push('환절기 날씨 - 가벼운 겉옷 필수');
      tips.push('일교차가 큰 시기, 레이어드 추천');
    } else if (temp >= 12) {
      emoji = '🧥';
      outfit.outer = ['자켓', '트렌치코트', '야상', '바람막이'];
      outfit.top = ['니트', '맨투맨', '후드티'];
      outfit.bottom = ['청바지', '슬랙스', '면바지'];
      outfit.accessories = ['목도리', '장갑(얇은)'];
      tips.push('쌀쌀한 날씨 - 자켓 필수');
      tips.push('레이어드로 체온 조절');
    } else if (temp >= 9) {
      emoji = '🧣';
      outfit.outer = ['코트', '점퍼', '가죽자켓', '두꺼운 바람막이'];
      outfit.top = ['니트', '맨투맨', '후드티', '기모'];
      outfit.bottom = ['기모 청바지', '두꺼운 바지'];
      outfit.accessories = ['목도리', '장갑', '귀마개'];
      tips.push('추운 날씨 - 코트 필수');
      tips.push('내복 착용 권장');
    } else if (temp >= 5) {
      emoji = '🥶';
      outfit.outer = ['패딩', '두꺼운 코트', '롱패딩'];
      outfit.top = ['니트', '기모 맨투맨', '목폴라'];
      outfit.bottom = ['기모 청바지', '두꺼운 바지', '기모 레깅스'];
      outfit.accessories = ['목도리', '장갑', '귀마개', '모자'];
      tips.push('매우 추움 - 패딩 필수');
      tips.push('내복, 기모 착용 필수');
      tips.push('손, 귀, 목 보온 중요');
    } else {
      emoji = '❄️';
      outfit.outer = ['롱패딩', '헤비 패딩', '털 코트'];
      outfit.top = ['두꺼운 니트', '목폴라', '기모'];
      outfit.bottom = ['기모 바지', '두꺼운 청바지', '스키니'];
      outfit.accessories = ['두꺼운 목도리', '털 장갑', '방한 모자', '귀마개', '핫팩'];
      tips.push('극한 추위 - 완전 방한 필수');
      tips.push('여러 겹 레이어드 착용');
      tips.push('핫팩, 보온병 휴대');
    }

    // 날씨별 추가 아이템
    if (weather === 'rainy') {
      outfit.accessories.push('우산', '방수 재킷', '장화');
      tips.push('☔ 비 - 방수 재킷 또는 우산 필수');
      tips.push('신발 방수 처리 또는 장화 추천');
    } else if (weather === 'snowy') {
      outfit.accessories.push('방한 부츠', '방수 장갑', '두꺼운 양말');
      tips.push('❄️ 눈 - 미끄럼 방지 부츠 필수');
      tips.push('방수, 방한 기능 겸비한 옷 추천');
    }

    // 계절별 추가 팁
    if (season === 'spring') {
      tips.push('🌸 봄 - 일교차 큰 시기, 겉옷 필수');
      tips.push('황사/미세먼지 대비 마스크 휴대');
    } else if (season === 'summer') {
      tips.push('🌻 여름 - 시원한 소재, 밝은 색상 추천');
      tips.push('실내외 온도차 대비 얇은 가디건');
    } else if (season === 'fall') {
      tips.push('🍁 가을 - 레이어드 스타일 활용');
      tips.push('일교차 대비 여러 겹 착용');
    } else {
      tips.push('⛄ 겨울 - 보온과 방풍 중요');
      tips.push('핫팩, 보온물병 휴대');
    }

    setResult({
      temp,
      weather: weather === 'sunny' ? '맑음' : weather === 'cloudy' ? '흐림' : weather === 'rainy' ? '비' : '눈',
      season: season === 'spring' ? '봄' : season === 'summer' ? '여름' : season === 'fall' ? '가을' : '겨울',
      outfit,
      tips,
      emoji
    });
  };

  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-900 dark:via-blue-900 dark:to-indigo-900 text-black dark:text-white placeholder-gray-500 transition-colors">
        <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
          <div className="mb-4 text-black placeholder-gray-500">
            
          </div>

          <section className="bg-white rounded sm:rounded-lg md:rounded-2xl shadow-xl p-6 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <h1 className="text-4xl mb-2 text-black placeholder-gray-500">{result.emoji}</h1>
              <h2 className="text-2xl font-bold text-gray-800 text-black placeholder-gray-500">오늘의 옷차림</h2>
              <p className="text-gray-600 mt-2 text-black placeholder-gray-500">
                {result.temp}°C · {result.weather} · {result.season}
              </p>
            </header>

            {/* 겉옷 */}
            {result.outfit.outer.length > 0 && (
              <div className="mb-5 text-black placeholder-gray-500">
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-800 mb-0.5 sm:mb-1.5 md:mb-2 flex items-center text-black placeholder-gray-500">
                  <span className="mr-2 text-black placeholder-gray-500">🧥</span> 겉옷
                </h3>
                <div className="grid grid-cols-3 gap-2 text-black placeholder-gray-500">
                  {result.outfit.outer.map((item, i) => (
                    <div key={i} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-2 sm:p-3 border border-blue-200 text-center font-medium text-black text-black placeholder-gray-500">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 상의 */}
            <div className="mb-5 text-black placeholder-gray-500">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-800 mb-0.5 sm:mb-1.5 md:mb-2 flex items-center text-black placeholder-gray-500">
                <span className="mr-2 text-black placeholder-gray-500">👕</span> 상의
              </h3>
              <div className="grid grid-cols-3 gap-2 text-black placeholder-gray-500">
                {result.outfit.top.map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 sm:p-3 border border-green-200 text-center font-medium text-black text-black placeholder-gray-500">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 하의 */}
            <div className="mb-5 text-black placeholder-gray-500">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-800 mb-0.5 sm:mb-1.5 md:mb-2 flex items-center text-black placeholder-gray-500">
                <span className="mr-2 text-black placeholder-gray-500">👖</span> 하의
              </h3>
              <div className="grid grid-cols-3 gap-2 text-black placeholder-gray-500">
                {result.outfit.bottom.map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-2 sm:p-3 border border-purple-200 text-center font-medium text-black text-black placeholder-gray-500">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 악세서리 */}
            <div className="mb-6 text-black placeholder-gray-500">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-800 mb-0.5 sm:mb-1.5 md:mb-2 flex items-center text-black placeholder-gray-500">
                <span className="mr-2 text-black placeholder-gray-500">🎒</span> 필수 아이템
              </h3>
              <div className="grid grid-cols-3 gap-2 text-black placeholder-gray-500">
                {result.outfit.accessories.map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-2 sm:p-3 border border-amber-200 text-center font-medium text-black text-black placeholder-gray-500">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 스타일 팁 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-800 mb-0.5 sm:mb-1.5 md:mb-2 text-black placeholder-gray-500">💡 스타일 팁</h3>
              <div className="space-y-2 text-black placeholder-gray-500">
                {result.tips.map((tip, i) => (
                  <div key={i} className="bg-white rounded p-3 text-sm text-gray-700 text-black placeholder-gray-500">
                    • {tip}
                  </div>
                ))}
              </div>
            </div>

            <button
        type="button"
              onClick={() => setResult(null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              다시 추천받기
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
      style={{
        background: seasonalStyle.background,
        backgroundImage: seasonalStyle.backgroundImage,
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
        <div className="mb-4 text-black placeholder-gray-500">
          
        </div>

        <section className="bg-white rounded sm:rounded-lg md:rounded-2xl shadow-xl p-6 text-black placeholder-gray-500">
          <header className="text-center mb-6 text-black placeholder-gray-500">
            <h1 className="text-4xl font-bold text-black mb-2 text-black placeholder-gray-500">🌡️</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-black placeholder-gray-500">오늘의 옷차림 추천</h2>
            <p className="text-gray-600 text-black placeholder-gray-500">날씨에 딱 맞는 옷차림을 찾아드립니다</p>
          </header>

          <div className="space-y-6 text-black placeholder-gray-500">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">
                기온 ({temp}°C)
              </label>
              <div className="flex items-center gap-4 text-black placeholder-gray-500">
                <input
                  type="range"
                  min="-10"
                  max="40"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
                <div className="text-2xl font-bold text-black w-20 text-center text-black placeholder-gray-500">{temp}°C</div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1 text-black placeholder-gray-500">
                <span>-10°C</span>
                <span>40°C</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">날씨</label>
              <div className="grid grid-cols-4 gap-2 text-black placeholder-gray-500">
                <button
        type="button"
                  onClick={() => setWeather('sunny')}
                  className={`p-2 md:p-4 rounded-lg font-semibold transition-all ${
                    weather === 'sunny'
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1 text-black placeholder-gray-500">☀️</div>
                  <div className="text-xs text-black placeholder-gray-500">맑음</div>
                </button>
                <button
        type="button"
                  onClick={() => setWeather('cloudy')}
                  className={`p-2 md:p-4 rounded-lg font-semibold transition-all ${
                    weather === 'cloudy'
                      ? 'bg-gray-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1 text-black placeholder-gray-500">☁️</div>
                  <div className="text-xs text-black placeholder-gray-500">흐림</div>
                </button>
                <button
        type="button"
                  onClick={() => setWeather('rainy')}
                  className={`p-2 md:p-4 rounded-lg font-semibold transition-all ${
                    weather === 'rainy'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1 text-black placeholder-gray-500">🌧️</div>
                  <div className="text-xs text-black placeholder-gray-500">비</div>
                </button>
                <button
        type="button"
                  onClick={() => setWeather('snowy')}
                  className={`p-2 md:p-4 rounded-lg font-semibold transition-all ${
                    weather === 'snowy'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1 text-black placeholder-gray-500">❄️</div>
                  <div className="text-xs text-black placeholder-gray-500">눈</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">계절</label>
              <div className="grid grid-cols-4 gap-2 text-black placeholder-gray-500">
                <button
        type="button"
                  onClick={() => setSeason('spring')}
                  className={`p-2 md:p-4 rounded-lg font-semibold transition-all ${
                    season === 'spring'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1 text-black placeholder-gray-500">🌸</div>
                  <div className="text-xs text-black placeholder-gray-500">봄</div>
                </button>
                <button
        type="button"
                  onClick={() => setSeason('summer')}
                  className={`p-2 md:p-4 rounded-lg font-semibold transition-all ${
                    season === 'summer'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1 text-black placeholder-gray-500">🌻</div>
                  <div className="text-xs text-black placeholder-gray-500">여름</div>
                </button>
                <button
        type="button"
                  onClick={() => setSeason('fall')}
                  className={`p-2 md:p-4 rounded-lg font-semibold transition-all ${
                    season === 'fall'
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1 text-black placeholder-gray-500">🍁</div>
                  <div className="text-xs text-black placeholder-gray-500">가을</div>
                </button>
                <button
        type="button"
                  onClick={() => setSeason('winter')}
                  className={`p-2 md:p-4 rounded-lg font-semibold transition-all ${
                    season === 'winter'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1 text-black placeholder-gray-500">⛄</div>
                  <div className="text-xs text-black placeholder-gray-500">겨울</div>
                </button>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-300 text-black placeholder-gray-500">
              <h3 className="font-bold text-black mb-2 text-black placeholder-gray-500">💡 똑똑한 옷차림</h3>
              <ul className="text-sm text-black space-y-1 text-black placeholder-gray-500">
                <li>• 온도별 최적 옷차림 추천</li>
                <li>• 날씨, 계절 고려한 맞춤 스타일</li>
                <li>• 겉옷, 상의, 하의, 악세서리 종합 제안</li>
                <li>• 체감 온도와 일교차 고려</li>
              </ul>
            </div>

            <button
        type="button"
              onClick={getRecommendation}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              옷차림 추천받기
            </button>
          </div>
        </section>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}

