'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import { getVitaminsBySymptoms, symptomVitaminMap, type Vitamin } from '@/lib/vitamin-data';
import AdOverlay from '@/app/components/AdOverlay';

const availableSymptoms = Object.keys(symptomVitaminMap);

export default function VitaminCheckPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<Vitamin[] | null>(null);
  const [selectedVitamin, setSelectedVitamin] = useState<Vitamin | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) {
      alert('최소 1개 이상의 증상을 선택해주세요!');
      return;
    }

    const recommendations = getVitaminsBySymptoms(selectedSymptoms);
    setResults(recommendations);
    setSelectedVitamin(null);
  };

  const categoryColors: Record<string, string> = {
    'water-soluble': 'from-blue-500/20 to-cyan-500/20',
    'fat-soluble': 'from-yellow-500/20 to-orange-500/20',
    mineral: 'from-purple-500/20 to-pink-500/20',
    other: 'from-green-500/20 to-emerald-500/20',
  };

  const categoryLabels: Record<string, string> = {
    'water-soluble': '수용성',
    'fat-soluble': '지용성',
    mineral: '미네랄',
    other: '기타',
  };

  return (
    <PremiumLayout theme="green">
      
        <AdOverlay /><div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 bg-clip-text text-transparent">
            💊 비타민 체크
          </h1>
          <p className="text-xl text-white/80">16가지 비타민/미네랄 정보 & 맞춤 추천</p>
        </div>

        {/* Symptom Selection */}
        <div className="space-y-6 mb-8">
          <PremiumCard hover gradient className="animate-slideUp">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              어떤 증상이 있으신가요? (중복 선택 가능)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {availableSymptoms.map((symptom) => (
                <button type="button"
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-white/30 border-white/60 scale-105'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="text-white font-semibold">{symptom}</div>
                </button>
              ))}
            </div>
          </PremiumCard>

          {/* Selected Count */}
          {selectedSymptoms.length > 0 && (
            <div className="text-center text-white/80 text-sm">
              선택된 증상: {selectedSymptoms.join(', ')} ({selectedSymptoms.length}개)
            </div>
          )}

          {/* Analyze Button */}
          <div className="text-center">
            <PremiumButton onClick={handleAnalyze} variant="primary" size="lg" icon="🔍" fullWidth>
              필요한 비타민 분석하기
            </PremiumButton>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">
                  추천 비타민/영양소 {results.length}개
                </h2>
                <p className="text-white/70 text-center">
                  선택한 증상 개선에 도움이 될 수 있는 영양소입니다
                </p>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤔</div>
                  <p className="text-white text-lg">해당하는 영양소를 찾지 못했습니다.</p>
                  <p className="text-white/70 mt-2">다른 증상을 선택해보세요!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((vitamin) => (
                    <div
                      key={vitamin.id}
                      onClick={() => setSelectedVitamin(vitamin)}
                      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-4xl">{vitamin.emoji}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{vitamin.name}</h3>
                          <p className="text-white/70 text-xs">{vitamin.scientificName}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="px-2 py-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full text-xs text-white border border-white/20">
                          {categoryLabels[vitamin.category]}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm line-clamp-2">{vitamin.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </PremiumCard>

            {/* Detailed View */}
            {selectedVitamin && (
              <PremiumCard hover gradient className="animate-fadeIn">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{selectedVitamin.emoji}</div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-1">{selectedVitamin.name}</h2>
                      <p className="text-white/70">{selectedVitamin.scientificName}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full text-sm text-white border border-white/20">
                        {categoryLabels[selectedVitamin.category]}
                      </span>
                    </div>
                  </div>
                  <button type="button"
                    onClick={() => setSelectedVitamin(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                  >
                    닫기 ✕
                  </button>
                </div>

                <p className="text-white text-lg mb-6 leading-relaxed">{selectedVitamin.description}</p>

                {/* RDI */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-5 border border-blue-400/30">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                      <span className="text-xl">👨</span> 남성 권장량
                    </h3>
                    <p className="text-white/90 text-2xl font-semibold">
                      {selectedVitamin.recommendedDailyIntake.men}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-2xl p-5 border border-pink-400/30">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                      <span className="text-xl">👩</span> 여성 권장량
                    </h3>
                    <p className="text-white/90 text-2xl font-semibold">
                      {selectedVitamin.recommendedDailyIntake.women}
                    </p>
                  </div>
                </div>

                {/* Functions */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">⚙️</span> 주요 기능
                  </h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedVitamin.functions.map((func, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/90">
                        <span className="text-green-300">•</span>
                        <span>{func}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deficiency Symptoms */}
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-400/30 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> 결핍 시 증상
                  </h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedVitamin.deficiencySymptoms.map((symptom, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/90">
                        <span className="text-red-300">!</span>
                        <span>{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">✨</span> 건강 효능
                  </h3>
                  <ul className="space-y-2">
                    {selectedVitamin.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-white/90 flex items-start gap-2">
                        <span className="text-green-300 mt-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Food Sources */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">🍽️</span> 풍부한 식품
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVitamin.foodSources.map((food, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full text-sm text-white border border-white/20"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Best Taken With */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/30 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">🤝</span> 함께 섭취하면 좋은 것
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVitamin.bestTakenWith.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-white/10 rounded-full text-sm text-white/90"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Who Needs It */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/30 mb-4">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">👥</span> 특히 필요한 사람
                  </h3>
                  <ul className="space-y-2">
                    {selectedVitamin.whoNeedsIt.map((person, idx) => (
                      <li key={idx} className="text-white/90 flex items-start gap-2">
                        <span className="text-blue-300">•</span>
                        <span>{person}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warnings */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-400/30">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">⚡</span> 주의사항
                  </h3>
                  <ul className="space-y-2">
                    {selectedVitamin.warnings.map((warning, idx) => (
                      <li key={idx} className="text-white/90 leading-relaxed flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">⚠</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excess Symptoms */}
                {selectedVitamin.excessSymptoms.length > 0 &&
                  selectedVitamin.excessSymptoms[0] !== '매우 드묾 (수용성이라 과잉 배출)' &&
                  selectedVitamin.excessSymptoms[0] !== '드묾 (과잉 시 배출)' &&
                  selectedVitamin.excessSymptoms[0] !== '드묾 (음식으로는 과다 섭취 어려움)' && (
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-400/30 mt-4">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="text-xl">🚫</span> 과다 섭취 시 부작용
                      </h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {selectedVitamin.excessSymptoms.map((symptom, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-white/90">
                            <span className="text-orange-300">!</span>
                            <span>{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </PremiumCard>
            )}

            {/* Disclaimer */}
            <PremiumCard hover gradient className="animate-fadeIn">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-400/30">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">ℹ️</span> 안내사항
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• 이 정보는 일반적인 건강 정보이며 의학적 조언을 대체하지 않습니다</li>
                  <li>• 심각한 증상이 있다면 반드시 의사와 상담하세요</li>
                  <li>
                    • 보충제 복용 전 전문가와 상담하여 적절한 용량과 필요성을 확인하세요
                  </li>
                  <li>• 균형 잡힌 식사가 가장 좋은 영양소 공급원입니다</li>
                  <li>• 임산부, 수유부, 만성질환자는 반드시 의사와 상담 후 복용하세요</li>
                </ul>
              </div>
            </PremiumCard>

            {/* Related Apps */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <RelatedApps currentAppSlug="vitamin-check" className="mt-8" />
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
