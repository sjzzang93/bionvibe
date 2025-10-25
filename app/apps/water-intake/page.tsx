'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';

import RelatedApps from '@/app/components/RelatedApps';
export default function WaterIntakePage() {
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('medium');
  const [climate, setClimate] = useState('normal');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    
    const baseWater = w * 33;
    const activityMultiplier = {
      low: 1.0,
      medium: 1.2,
      high: 1.4,
      athlete: 1.6,
    }[activity] || 1.0;

    const climateAdd = {
      cold: -200,
      normal: 0,
      hot: 300,
      veryHot: 500,
    }[climate] || 0;

    const totalWater = Math.round(baseWater * activityMultiplier + climateAdd);
    const glassCount = Math.round(totalWater / 200);
    const bottleCount = Math.round(totalWater / 500);

    setResult({
      totalWater,
      glassCount,
      bottleCount,
      hourly: Math.round(totalWater / 16),
    });
  };

  return (
    <PremiumLayout theme="blue">
      <div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          <PremiumHeader 
            icon="💧"
            title="물 섭취량 계산기"
            subtitle="당신에게 필요한 하루 수분량을 계산하세요"
            gradient="from-cyan-200 via-blue-200 to-indigo-200"
          />

          <PremiumCard className="max-w-2xl mx-auto mb-8">
            <div className="space-y-6">
              <div>
                <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block text-lg">⚖️ 체중 (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="예: 70"
                  className="w-full px-6 py-4 rounded-xl text-black text-lg border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all"
                />
              </div>

              <div>
                <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block text-lg">🏃 활동량</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl text-black text-lg border-2 border-blue-200 focus:border-blue-400 transition-all"
                >
                  <option value="low">낮음 (사무직, 가벼운 활동)</option>
                  <option value="medium">보통 (일상적인 걷기, 가벼운 운동)</option>
                  <option value="high">높음 (규칙적인 운동, 활동적)</option>
                  <option value="athlete">매우 높음 (운동선수, 육체노동)</option>
                </select>
              </div>

              <div>
                <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block text-lg">🌡️ 기후/환경</label>
                <select
                  value={climate}
                  onChange={(e) => setClimate(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl text-black text-lg border-2 border-blue-200 focus:border-blue-400 transition-all"
                >
                  <option value="cold">추운 날씨 ❄️</option>
                  <option value="normal">보통 날씨 ☀️</option>
                  <option value="hot">더운 날씨 🔥</option>
                  <option value="veryHot">매우 더운 날씨 또는 사우나 🌡️</option>
                </select>
              </div>

              <PremiumButton 
                onClick={handleCalculate}
                fullWidth
                size="lg"
                variant="primary"
              >
                💧 계산하기
              </PremiumButton>
            </div>
          </PremiumCard>

          {result && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Main Result */}
              <PremiumCard gradient className="text-center">
                <div className="text-8xl mb-6 animate-bounce-slow">💧</div>
                <div className="text-white/80 text-xl mb-0.5 sm:mb-1.5 md:mb-2">하루 권장 수분 섭취량</div>
                <div className="text-7xl font-black bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4">
                  {(result.totalWater / 1000).toFixed(1)}L
                </div>
                <div className="text-white/70 text-2xl">
                  {result.totalWater.toLocaleString()}ml
                </div>
              </PremiumCard>

              {/* Intake Guide */}
              <PremiumCard>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📊</span> 섭취 가이드
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                  <div className="bg-white/10 rounded sm:rounded-lg md:rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                    <div className="text-base sm:text-2xl md:text-4xl mb-0.5 sm:mb-1.5 md:mb-2">🥤</div>
                    <div className="text-white/70 mb-2">200ml 컵</div>
                    <div className="text-4xl font-black text-cyan-200">{result.glassCount}잔</div>
                  </div>
                  <div className="bg-white/10 rounded sm:rounded-lg md:rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                    <div className="text-base sm:text-2xl md:text-4xl mb-0.5 sm:mb-1.5 md:mb-2">🍼</div>
                    <div className="text-white/70 mb-2">500ml 생수병</div>
                    <div className="text-4xl font-black text-blue-200">{result.bottleCount}병</div>
                  </div>
                  <div className="bg-white/10 rounded sm:rounded-lg md:rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                    <div className="text-base sm:text-2xl md:text-4xl mb-0.5 sm:mb-1.5 md:mb-2">⏰</div>
                    <div className="text-white/70 mb-2">시간당 권장량</div>
                    <div className="text-4xl font-black text-indigo-200">{result.hourly}ml</div>
                  </div>
                </div>
              </PremiumCard>

              {/* Tips */}
              <PremiumCard className="bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                <h4 className="font-bold mb-4 text-xl text-white flex items-center gap-2">
                  <span className="text-3xl">💡</span> 수분 섭취 팁
                </h4>
                <ul className="space-y-3">
                  {[
                    '기상 직후 물 한 컵으로 하루를 시작하세요',
                    '식사 30분 전에 물을 마시면 소화에 도움이 됩니다',
                    '운동 전후 충분한 수분을 섭취하세요',
                    '카페인 음료는 이뇨작용이 있어 물 섭취량에 포함하지 않습니다',
                    '목이 마르기 전에 미리 수분을 보충하세요',
                    '소변 색깔이 연한 노란색이면 적절한 수분 상태입니다',
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/90 hover:text-white transition-colors">
                      <span className="text-green-300 text-xl flex-shrink-0">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </PremiumCard>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
