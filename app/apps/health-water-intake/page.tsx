'use client';

import { useState } from 'react';

export default function WaterIntakePage() {
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('medium');
  const [climate, setClimate] = useState('normal');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    
    // 기본 계산: 체중 x 33ml
    const baseWater = w * 33;

    // 활동량 보정
    const activityMultiplier = {
      low: 1.0,
      medium: 1.2,
      high: 1.4,
      athlete: 1.6,
    }[activity] || 1.0;

    // 기후 보정
    const climateAdd = {
      cold: -200,
      normal: 0,
      hot: 300,
      veryHot: 500,
    }[climate] || 0;

    const totalWater = Math.round(baseWater * activityMultiplier + climateAdd);
    const glassCount = Math.round(totalWater / 200); // 200ml 컵 기준
    const bottleCount = Math.round(totalWater / 500); // 500ml 생수병 기준

    setResult({
      totalWater,
      glassCount,
      bottleCount,
      hourly: Math.round(totalWater / 16), // 16시간 기준
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
          💧 하루 물 섭취량 계산기
        </h1>
        <p className="text-center text-cyan-100 mb-12">당신에게 필요한 수분량을 계산하세요</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
          <div>
            <label className="text-white font-bold mb-2 block">체중 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="예: 70"
              className="w-full px-4 py-3 rounded-lg text-black text-lg"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div>
            <label className="text-white font-bold mb-2 block">활동량</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            >
              <option value="low">낮음 (사무직, 가벼운 활동)</option>
              <option value="medium">보통 (일상적인 걷기, 가벼운 운동)</option>
              <option value="high">높음 (규칙적인 운동, 활동적)</option>
              <option value="athlete">매우 높음 (운동선수, 육체노동)</option>
            </select>
          </div>

          <div>
            <label className="text-white font-bold mb-2 block">기후/환경</label>
            <select
              value={climate}
              onChange={(e) => setClimate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            >
              <option value="cold">추운 날씨</option>
              <option value="normal">보통 날씨</option>
              <option value="hot">더운 날씨</option>
              <option value="veryHot">매우 더운 날씨 또는 사우나</option>
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all"
          >
            계산하기
          </button>

          {result && (
            <div className="space-y-4 pt-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">💧</div>
                <div className="text-white text-lg mb-2">하루 권장 수분 섭취량</div>
                <div className="text-6xl font-bold text-white mb-2">
                  {(result.totalWater / 1000).toFixed(1)}L
                </div>
                <div className="text-cyan-100 text-xl">
                  {result.totalWater.toLocaleString()}ml
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">섭취 가이드</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🥤</div>
                    <div>
                      <div className="text-gray-600">200ml 컵</div>
                      <div className="text-2xl font-bold text-blue-600">{result.glassCount}잔</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🍼</div>
                    <div>
                      <div className="text-gray-600">500ml 생수병</div>
                      <div className="text-2xl font-bold text-blue-600">{result.bottleCount}병</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">⏰</div>
                    <div>
                      <div className="text-gray-600">시간당 권장량</div>
                      <div className="text-2xl font-bold text-blue-600">{result.hourly}ml</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <h4 className="font-bold mb-3 text-lg">💡 수분 섭취 팁</h4>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>기상 직후 물 한 컵으로 하루를 시작하세요</li>
                  <li>식사 30분 전에 물을 마시면 소화에 도움이 됩니다</li>
                  <li>운동 전후 충분한 수분을 섭취하세요</li>
                  <li>카페인 음료는 이뇨작용이 있어 물 섭취량에 포함하지 않습니다</li>
                  <li>목이 마르기 전에 미리 수분을 보충하세요</li>
                </ul>
              </div>

              <div className="text-center mt-6">
                <a
                  href="https://"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  🛒 물통/텀블러 추천
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

