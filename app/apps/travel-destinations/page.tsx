'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import { getDestinationsByFilters, type Destination } from '@/lib/travel-data';

const regions = [
  { id: 'all', label: '전체', emoji: '🌍' },
  { id: 'domestic', label: '국내', emoji: '🇰🇷' },
  { id: 'asia', label: '아시아', emoji: '🌏' },
  { id: 'europe', label: '유럽', emoji: '🇪🇺' },
  { id: 'americas', label: '미주', emoji: '🌎' },
  { id: 'oceania', label: '오세아니아', emoji: '🦘' },
];

const travelStyles = [
  { id: '', label: '전체', emoji: '✨' },
  { id: '휴양', label: '휴양', emoji: '🏖️' },
  { id: '관광', label: '관광', emoji: '🗼' },
  { id: '미식', label: '미식', emoji: '🍜' },
  { id: '문화', label: '문화', emoji: '🎭' },
  { id: '액티비티', label: '액티비티', emoji: '🏄' },
  { id: '자연', label: '자연', emoji: '🏔️' },
  { id: '쇼핑', label: '쇼핑', emoji: '🛍️' },
];

const budgetLevels = [
  { id: '', label: '전체', emoji: '💰' },
  { id: 'low', label: '저예산', emoji: '💵' },
  { id: 'medium', label: '중간', emoji: '💳' },
  { id: 'high', label: '고급', emoji: '💎' },
];

const dayOptions = [
  { id: 0, label: '전체', emoji: '📅' },
  { id: 1, label: '1-2일', emoji: '📆' },
  { id: 3, label: '3-5일', emoji: '🗓️' },
  { id: 6, label: '6일+', emoji: '📋' },
];

const companionOptions = [
  { id: '', label: '전체', emoji: '👥' },
  { id: '혼자', label: '혼자', emoji: '🚶' },
  { id: '커플', label: '커플', emoji: '💑' },
  { id: '친구', label: '친구', emoji: '👯' },
  { id: '가족', label: '가족', emoji: '👨‍👩‍👧' },
];

export default function TravelDestinationsPage() {
  const [region, setRegion] = useState('all');
  const [travelStyle, setTravelStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState(0);
  const [companions, setCompanions] = useState('');
  const [results, setResults] = useState<Destination[] | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const handleSearch = () => {
    const filtered = getDestinationsByFilters({
      region: region,
      travelStyle,
      budget,
      days: days > 0 ? days : undefined,
      companions,
    });

    setResults(filtered);
    setSelectedDestination(null);
  };

  const budgetLevelText = {
    low: '저렴',
    medium: '적당',
    high: '비쌈',
  };

  return (
    <PremiumLayout theme="blue">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200 bg-clip-text text-transparent">
            ✈️ 여행지 추천
          </h1>
          <p className="text-xl text-white/80">18개 인기 여행지 상세 정보 & 맞춤 추천</p>
        </div>

        {/* Filter Cards */}
        <div className="space-y-6 mb-8">
          {/* 지역 선택 */}
          <PremiumCard hover gradient className="animate-slideUp">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">어디로 떠나시나요?</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {regions.map((reg) => (
                <button type="button"
                  key={reg.id}
                  onClick={() => setRegion(reg.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    region === reg.id
                      ? 'bg-white/30 border-white/60 scale-105'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="text-3xl mb-1">{reg.emoji}</div>
                  <div className="text-white font-semibold text-sm">{reg.label}</div>
                </button>
              ))}
            </div>
          </PremiumCard>

          {/* 여행 스타일 */}
          <PremiumCard hover gradient className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">어떤 여행을 원하시나요?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {travelStyles.map((style) => (
                <button type="button"
                  key={style.id}
                  onClick={() => setTravelStyle(style.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    travelStyle === style.id
                      ? 'bg-white/30 border-white/60 scale-105'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="text-3xl mb-1">{style.emoji}</div>
                  <div className="text-white font-semibold text-sm">{style.label}</div>
                </button>
              ))}
            </div>
          </PremiumCard>

          {/* 예산 & 기간 & 동반자 */}
          <div className="grid md:grid-cols-3 gap-4">
            <PremiumCard hover gradient className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold text-white mb-4 text-center">예산</h3>
              <div className="grid grid-cols-2 gap-2">
                {budgetLevels.map((b) => (
                  <button type="button"
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={`p-2 rounded-lg border transition-all ${
                      budget === b.id
                        ? 'bg-white/30 border-white/60'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-2xl">{b.emoji}</div>
                    <div className="text-white text-xs font-semibold">{b.label}</div>
                  </button>
                ))}
              </div>
            </PremiumCard>

            <PremiumCard hover gradient className="animate-slideUp" style={{ animationDelay: '0.25s' }}>
              <h3 className="text-lg font-bold text-white mb-4 text-center">여행 기간</h3>
              <div className="grid grid-cols-2 gap-2">
                {dayOptions.map((d) => (
                  <button type="button"
                    key={d.id}
                    onClick={() => setDays(d.id)}
                    className={`p-2 rounded-lg border transition-all ${
                      days === d.id
                        ? 'bg-white/30 border-white/60'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-2xl">{d.emoji}</div>
                    <div className="text-white text-xs font-semibold">{d.label}</div>
                  </button>
                ))}
              </div>
            </PremiumCard>

            <PremiumCard hover gradient className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-bold text-white mb-4 text-center">누구와</h3>
              <div className="grid grid-cols-2 gap-2">
                {companionOptions.map((c) => (
                  <button type="button"
                    key={c.id}
                    onClick={() => setCompanions(c.id)}
                    className={`p-2 rounded-lg border transition-all ${
                      companions === c.id
                        ? 'bg-white/30 border-white/60'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="text-white text-xs font-semibold">{c.label}</div>
                  </button>
                ))}
              </div>
            </PremiumCard>
          </div>

          {/* 검색 버튼 */}
          <div className="text-center">
            <PremiumButton onClick={handleSearch} variant="primary" size="lg" icon="🔍" fullWidth>
              여행지 찾기
            </PremiumButton>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">
                  추천 여행지 {results.length}곳
                </h2>
                <p className="text-white/70 text-center">조건에 맞는 여행지를 찾았어요!</p>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😢</div>
                  <p className="text-white text-lg">조건에 맞는 여행지가 없어요.</p>
                  <p className="text-white/70 mt-2">필터를 조정해보세요!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => setSelectedDestination(dest)}
                      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                          <p className="text-white/70 text-sm">{dest.country}</p>
                        </div>
                        <span className="px-2 py-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full text-xs text-white border border-white/20">
                          {budgetLevelText[dest.budgetLevel]}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mb-3 line-clamp-2">{dest.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {dest.travelStyles.slice(0, 3).map((style, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/90"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                      <div className="text-white/60 text-xs">
                        ⏱️ {dest.recommendedDays[0]}-{dest.recommendedDays[dest.recommendedDays.length - 1]}
                        일
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PremiumCard>

            {/* Detailed View */}
            {selectedDestination && (
              <PremiumCard hover gradient className="animate-fadeIn">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">{selectedDestination.name}</h2>
                    <p className="text-white/70 text-lg">{selectedDestination.country}</p>
                  </div>
                  <button type="button"
                    onClick={() => setSelectedDestination(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                  >
                    닫기 ✕
                  </button>
                </div>

                <p className="text-white text-lg mb-6 leading-relaxed">{selectedDestination.description}</p>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🌤️</span>
                      <h3 className="text-white font-bold">최적 시즌</h3>
                    </div>
                    <p className="text-white/80">{selectedDestination.bestSeasons.join(', ')}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⏱️</span>
                      <h3 className="text-white font-bold">추천 기간</h3>
                    </div>
                    <p className="text-white/80">
                      {selectedDestination.recommendedDays[0]}-
                      {selectedDestination.recommendedDays[selectedDestination.recommendedDays.length - 1]}일
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🚌</span>
                      <h3 className="text-white font-bold">교통</h3>
                    </div>
                    <p className="text-white/80">{selectedDestination.transportation}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">💬</span>
                      <h3 className="text-white font-bold">언어</h3>
                    </div>
                    <p className="text-white/80">{selectedDestination.language}</p>
                  </div>
                </div>

                {/* Budget */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-400/30 mb-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">💰</span> 예상 경비
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-white/70 text-sm">항공</p>
                      <p className="text-white font-semibold">{selectedDestination.estimatedBudget.flight}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">숙박 (1박)</p>
                      <p className="text-white font-semibold">
                        {selectedDestination.estimatedBudget.accommodation}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">일일 경비</p>
                      <p className="text-white font-semibold">{selectedDestination.estimatedBudget.daily}</p>
                    </div>
                  </div>
                </div>

                {/* Must Visit */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">📍</span> 필수 방문지
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedDestination.mustVisit.map((place, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/90">
                        <span className="text-blue-300">•</span>
                        <span>{place}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">🎯</span> 추천 액티비티
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.activities.map((activity, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-sm text-white border border-white/20"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Foods */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">🍜</span> 꼭 먹어야 할 음식
                  </h3>
                  <div className="grid md:grid-cols-3 gap-2">
                    {selectedDestination.foods.map((food, idx) => (
                      <div key={idx} className="text-white/90 text-sm">
                        • {food}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/30 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">💡</span> 여행 팁
                  </h3>
                  <ul className="space-y-2">
                    {selectedDestination.tips.map((tip, idx) => (
                      <li key={idx} className="text-white/90 leading-relaxed flex items-start gap-2">
                        <span className="text-purple-300 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pros & Cons */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <span className="text-xl">👍</span> 장점
                    </h3>
                    <ul className="space-y-2">
                      {selectedDestination.pros.map((pro, idx) => (
                        <li key={idx} className="text-white/90 flex items-start gap-2">
                          <span className="text-green-300">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-400/30">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <span className="text-xl">👎</span> 단점
                    </h3>
                    <ul className="space-y-2">
                      {selectedDestination.cons.map((con, idx) => (
                        <li key={idx} className="text-white/90 flex items-start gap-2">
                          <span className="text-red-300">!</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </PremiumCard>
            )}

            {/* Related Apps */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <RelatedApps
                relatedAppIds={['weather-outfit', 'dday-counter', 'parents-time', 'gift-finder']}
                currentAppId="travel-destinations"
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
