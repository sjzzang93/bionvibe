'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

interface EnvelopeResult {
  minAmount: number;
  maxAmount: number;
  recommended: number;
  tip: string;
  etiquette: string[];
}

const occasions = [
  { id: 'wedding', label: '결혼식', emoji: '💒' },
  { id: 'funeral', label: '장례식', emoji: '🕯️' },
  { id: 'dol', label: '돌잔치', emoji: '🎂' },
  { id: 'housewarming', label: '집들이', emoji: '🏠' },
  { id: 'baekil', label: '백일잔치', emoji: '👶' },
];

const relationships = [
  { id: 'close-friend', label: '친한 친구', multiplier: 1.2 },
  { id: 'friend', label: '친구/동료', multiplier: 1.0 },
  { id: 'acquaintance', label: '지인', multiplier: 0.8 },
  { id: 'boss', label: '상사', multiplier: 1.3 },
  { id: 'subordinate', label: '부하직원', multiplier: 0.9 },
  { id: 'family', label: '친척', multiplier: 1.5 },
  { id: 'distant', label: '먼 지인', multiplier: 0.7 },
];

const baseAmounts: Record<string, { min: number; max: number; recommended: number }> = {
  wedding: { min: 50000, max: 100000, recommended: 50000 },
  funeral: { min: 50000, max: 100000, recommended: 50000 },
  dol: { min: 50000, max: 100000, recommended: 50000 },
  housewarming: { min: 30000, max: 50000, recommended: 30000 },
  baekil: { min: 30000, max: 50000, recommended: 30000 },
};

const tips: Record<string, { tip: string; etiquette: string[] }> = {
  wedding: {
    tip: '홀수 금액(5만원, 10만원)이 좋으며, 부부 동반시 10만원 이상을 권장합니다.',
    etiquette: [
      '💵 신권으로 준비하기',
      '✍️ 봉투 앞면에 이름과 축하 문구 작성',
      '🎁 부부 동반시 10만원 이상 권장',
      '📝 결혼식장 입구 축의금 접수처에 전달',
    ],
  },
  funeral: {
    tip: '조의금은 흰 봉투에 담으며, 홀수 금액을 피합니다.',
    etiquette: [
      '⚪ 흰 봉투 사용',
      '✍️ 봉투에 "근조" 또는 "삼가 조의를 표합니다" 작성',
      '🙏 부의금 접수처에 조용히 전달',
      '💐 꽃이나 화환을 함께 보낼 수 있음',
    ],
  },
  dol: {
    tip: '돌잔치는 축하의 의미로 금반지나 순금 선물도 좋습니다.',
    etiquette: [
      '🎁 현금 또는 금반지 선물',
      '👶 아기 이름 새긴 돌반지 인기',
      '📦 선물과 축의금 함께 가능',
      '🎀 밝은 색 봉투 사용',
    ],
  },
  housewarming: {
    tip: '집들이는 실용적인 선물(휴지, 세제)과 함께 현금을 드리기도 합니다.',
    etiquette: [
      '🧻 실용 선물 함께 준비 (휴지, 세제)',
      '🍰 떡이나 케이크도 좋은 선택',
      '🏡 새 집 인테리어에 도움될 소품',
      '💐 화분이나 공기정화 식물',
    ],
  },
  baekil: {
    tip: '백일잔치는 돌잔치보다 소액으로 준비합니다.',
    etiquette: [
      '👕 아기 옷이나 장난감 선물',
      '🍼 육아용품도 좋은 선택',
      '💰 3~5만원 정도가 적당',
      '🎀 귀여운 봉투나 선물 포장',
    ],
  },
};

export default function EnvelopeRecommendPage() {
  const [occasion, setOccasion] = useState('');
  const [relationship, setRelationship] = useState('');
  const [result, setResult] = useState<EnvelopeResult | null>(null);

  const calculateAmount = () => {
    if (!occasion || !relationship) {
      alert('상황과 관계를 모두 선택해주세요!');
      return;
    }

    const base = baseAmounts[occasion];
    const rel = relationships.find((r) => r.id === relationship);
    if (!base || !rel) return;

    const recommended = Math.round(base.recommended * rel.multiplier / 10000) * 10000;
    const minAmount = Math.round(base.min * rel.multiplier / 10000) * 10000;
    const maxAmount = Math.round(base.max * rel.multiplier / 10000) * 10000;

    const tipData = tips[occasion];

    setResult({
      minAmount,
      maxAmount,
      recommended,
      tip: tipData.tip,
      etiquette: tipData.etiquette,
    });
  };

  return (
    <PremiumLayout theme="pink">
      
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-200 via-rose-200 to-red-200 bg-clip-text text-transparent">
            💌 봉투금액 가이드
          </h1>
          <p className="text-xl text-white/80">상황별 적절한 봉투 금액을 알려드립니다</p>
        </div>

        {/* Input Cards */}
        <div className="space-y-6 mb-8">
          {/* 상황 선택 */}
          <PremiumCard hover gradient className="animate-slideUp">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">어떤 상황인가요?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {occasions.map((occ) => (
                <button
                  type="button"
                  key={occ.id}
                  onClick={() => setOccasion(occ.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    occasion === occ.id
                      ? 'bg-white/30 border-white/60 scale-105'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="text-4xl mb-2">{occ.emoji}</div>
                  <div className="text-white font-semibold">{occ.label}</div>
                </button>
              ))}
            </div>
          </PremiumCard>

          {/* 관계 선택 */}
          <PremiumCard hover gradient className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">어떤 관계인가요?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {relationships.map((rel) => (
                <button
                  type="button"
                  key={rel.id}
                  onClick={() => setRelationship(rel.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    relationship === rel.id
                      ? 'bg-white/30 border-white/60 scale-105'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="text-white font-semibold">{rel.label}</div>
                </button>
              ))}
            </div>
          </PremiumCard>

          {/* 계산 버튼 */}
          <div className="text-center">
            <PremiumButton
              onClick={calculateAmount}
              variant="primary"
              size="lg"
              icon="💰"
              fullWidth
            >
              적정 금액 확인하기
            </PremiumButton>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-bounce-slow">💵</div>
                <h2 className="text-3xl font-bold text-white mb-2">추천 금액</h2>
              </div>

              {/* 추천 금액 */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30 mb-6 text-center">
                <div className="text-white/80 mb-2">권장 금액</div>
                <div className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {result.recommended.toLocaleString()}원
                </div>
                <div className="text-white/70 text-sm">
                  ({result.minAmount.toLocaleString()}원 ~ {result.maxAmount.toLocaleString()}원)
                </div>
              </div>

              {/* 팁 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span> 꿀팁
                </h3>
                <p className="text-white/90 leading-relaxed">{result.tip}</p>
              </div>

              {/* 예절 */}
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm rounded-2xl p-6 border border-pink-400/30 mb-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">📋</span> 예절 가이드
                </h3>
                <ul className="space-y-3">
                  {result.etiquette.map((item, idx) => (
                    <li key={idx} className="text-white/90 leading-relaxed flex items-start gap-2">
                      <span className="text-pink-300 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 추가 정보 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">ℹ️</span> 알아두면 좋은 점
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• 지역과 문화에 따라 금액이 다를 수 있습니다</li>
                  <li>• 경제 상황에 맞춰 무리하지 않는 선에서 준비하세요</li>
                  <li>• 마음이 가장 중요합니다 💝</li>
                </ul>
              </div>

              <div className="mt-6 text-center">
                <PremiumButton
                  onClick={() => {
                    setOccasion('');
                    setRelationship('');
                    setResult(null);
                  }}
                  variant="secondary"
                  size="md"
                  icon="🔄"
                >
                  다시 계산하기
                </PremiumButton>
              </div>
            </PremiumCard>

            {/* Related Apps */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <RelatedApps currentAppSlug="envelope-recommend" className="mt-8" />
            </div>
          </div>
        )}
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

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
