'use client';

import { useState } from 'react';

export default function CreditCardOptimizerPage() {
  const [spending, setSpending] = useState({
    groceries: '300000',
    gas: '150000',
    shopping: '200000',
    dining: '250000',
    travel: '100000',
    online: '180000',
    other: '120000',
  });
  const [annualFee, setAnnualFee] = useState('100000');
  const [result, setResult] = useState<any>(null);

  const creditCards = [
    {
      name: '삼성카드 taptap O',
      benefits: {
        groceries: 0.02,
        gas: 0.03,
        shopping: 0.01,
        dining: 0.02,
        travel: 0.01,
        online: 0.02,
        other: 0.01,
      },
      annualFee: 0,
      description: '무료, 생활밀착형 혜택'
    },
    {
      name: '신한카드 The Platinum',
      benefits: {
        groceries: 0.01,
        gas: 0.02,
        shopping: 0.03,
        dining: 0.02,
        travel: 0.05,
        online: 0.02,
        other: 0.01,
      },
      annualFee: 150000,
      description: '여행/쇼핑 특화'
    },
    {
      name: 'KB국민카드 The CLASSIC',
      benefits: {
        groceries: 0.02,
        gas: 0.02,
        shopping: 0.02,
        dining: 0.02,
        travel: 0.02,
        online: 0.02,
        other: 0.02,
      },
      annualFee: 100000,
      description: '균등 혜택, 안정적'
    },
    {
      name: '현대카드 M3',
      benefits: {
        groceries: 0.015,
        gas: 0.04,
        shopping: 0.015,
        dining: 0.015,
        travel: 0.03,
        online: 0.015,
        other: 0.015,
      },
      annualFee: 200000,
      description: '주유/여행 특화'
    },
    {
      name: '롯데카드 L.POINT PLATINUM',
      benefits: {
        groceries: 0.01,
        gas: 0.01,
        shopping: 0.04,
        dining: 0.01,
        travel: 0.02,
        online: 0.04,
        other: 0.01,
      },
      annualFee: 120000,
      description: '쇼핑/온라인 특화'
    }
  ];

  const calculate = () => {
    const totalSpending = Object.values(spending).reduce((sum, val) => sum + Number(val), 0);
    const fee = Number(annualFee);
    
    const results = creditCards.map(card => {
      let totalBenefit = 0;
      Object.keys(spending).forEach(category => {
        const amount = Number(spending[category as keyof typeof spending]);
        const rate = card.benefits[category as keyof typeof card.benefits];
        totalBenefit += amount * rate;
      });
      
      const netBenefit = totalBenefit - card.annualFee;
      const netBenefitRate = (netBenefit / totalSpending) * 100;
      
      return {
        ...card,
        totalBenefit,
        netBenefit,
        netBenefitRate,
        monthlyBenefit: totalBenefit / 12,
        monthlyNetBenefit: netBenefit / 12,
      };
    });

    // 최고 혜택 카드 찾기
    const bestCard = results.reduce((prev, current) => 
      current.netBenefit > prev.netBenefit ? current : prev
    );

    setResult({
      totalSpending,
      fee,
      results: results.sort((a, b) => b.netBenefit - a.netBenefit),
      bestCard,
    });
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'rgb(217, 217, 217)' }}>
      <div className="container mx-auto px-4 py-8 text-black placeholder-gray-500">
        {/* 메인 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-2 border-black text-black placeholder-gray-500">
          <header className="text-center mb-8 text-black placeholder-gray-500">
            <div className="text-5xl md:text-6xl mb-4 text-black placeholder-gray-500">💳</div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 text-black placeholder-gray-500">
              신용카드 최적 조합
            </h1>
            <p className="text-sm md:text-base text-gray-600 text-black placeholder-gray-500">
              소비 패턴별 혜택 시뮬레이션, 연회비 대비 분석
            </p>
          </header>

          {/* 소비 패턴 입력 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-300 mb-8 text-black placeholder-gray-500">
            <h3 className="text-lg md:text-xl font-bold text-black mb-4 text-black placeholder-gray-500">💸 월 소비 패턴</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black placeholder-gray-500">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">🛒 식료품/마트</label>
                <input
                  type="number"
                  value={spending.groceries}
                  onChange={(e) => setSpending({...spending, groceries: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="300000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">⛽ 주유비</label>
                <input
                  type="number"
                  value={spending.gas}
                  onChange={(e) => setSpending({...spending, gas: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="150000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">🛍️ 쇼핑</label>
                <input
                  type="number"
                  value={spending.shopping}
                  onChange={(e) => setSpending({...spending, shopping: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="200000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">🍽️ 외식</label>
                <input
                  type="number"
                  value={spending.dining}
                  onChange={(e) => setSpending({...spending, dining: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="250000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">✈️ 여행</label>
                <input
                  type="number"
                  value={spending.travel}
                  onChange={(e) => setSpending({...spending, travel: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">💻 온라인 쇼핑</label>
                <input
                  type="number"
                  value={spending.online}
                  onChange={(e) => setSpending({...spending, online: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="180000"
                />
              </div>
              <div className="md:col-span-2 text-black placeholder-gray-500">
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">📱 기타 소비</label>
                <input
                  type="number"
                  value={spending.other}
                  onChange={(e) => setSpending({...spending, other: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="120000"
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          >
            💡 최적 카드 찾기
          </button>

          {/* 결과 */}
          {result && (
            <div className="mt-8 space-y-6 text-black placeholder-gray-500">
              {/* 총 소비액 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-300 text-center text-black placeholder-gray-500">
                <p className="text-sm text-gray-600 mb-2 text-black placeholder-gray-500">월 총 소비액</p>
                <p className="text-3xl md:text-4xl font-bold text-black text-black placeholder-gray-500">
                  {result.totalSpending.toLocaleString()}원
                </p>
                <p className="text-sm text-gray-500 mt-2 text-black placeholder-gray-500">
                  연간 {result.totalSpending.toLocaleString() * 12}원
                </p>
              </div>

              {/* 최고 추천 카드 */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-400 text-black placeholder-gray-500">
                <div className="text-center mb-4 text-black placeholder-gray-500">
                  <p className="text-sm text-gray-600 mb-2 text-black placeholder-gray-500">🏆 최고 추천 카드</p>
                  <p className="text-xl md:text-2xl font-bold text-black text-black placeholder-gray-500">
                    {result.bestCard.name}
                  </p>
                  <p className="text-sm text-gray-500 text-black placeholder-gray-500">{result.bestCard.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-black placeholder-gray-500">
                  <div className="bg-white p-3 rounded-lg text-center text-black placeholder-gray-500">
                    <p className="text-xs text-gray-600 text-black placeholder-gray-500">연간 혜택</p>
                    <p className="text-lg font-bold text-black text-black placeholder-gray-500">
                      {result.bestCard.totalBenefit.toLocaleString()}원
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center text-black placeholder-gray-500">
                    <p className="text-xs text-gray-600 text-black placeholder-gray-500">순 혜택</p>
                    <p className="text-lg font-bold text-black text-black placeholder-gray-500">
                      {result.bestCard.netBenefit.toLocaleString()}원
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center text-black placeholder-gray-500">
                    <p className="text-xs text-gray-600 text-black placeholder-gray-500">혜택률</p>
                    <p className="text-lg font-bold text-black text-black placeholder-gray-500">
                      {result.bestCard.netBenefitRate.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center text-black placeholder-gray-500">
                    <p className="text-xs text-gray-600 text-black placeholder-gray-500">연회비</p>
                    <p className="text-lg font-bold text-black text-black placeholder-gray-500">
                      {result.bestCard.annualFee.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>

              {/* 전체 카드 비교 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-300 text-black placeholder-gray-500">
                <h3 className="text-lg md:text-xl font-bold text-black mb-4 text-center text-black placeholder-gray-500">
                  📊 전체 카드 비교
                </h3>
                
                <div className="space-y-4 text-black placeholder-gray-500">
                  {result.results.map((card: any, index: number) => (
                    <div key={index} className={`p-4 rounded-xl border-2 ${index === 0 ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-2 text-black placeholder-gray-500">
                        <div>
                          <p className="font-bold text-gray-800 text-black placeholder-gray-500">{card.name}</p>
                          <p className="text-sm text-gray-600 text-black placeholder-gray-500">{card.description}</p>
                        </div>
                        <div className="text-right text-black placeholder-gray-500">
                          <p className="text-lg font-bold text-black text-black placeholder-gray-500">
                            +{card.netBenefit.toLocaleString()}원
                          </p>
                          <p className="text-sm text-gray-500 text-black placeholder-gray-500">
                            {card.netBenefitRate.toFixed(2)}% 혜택률
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-black placeholder-gray-500">
                        <div className="bg-gray-50 p-2 rounded text-center text-black placeholder-gray-500">
                          <p className="text-gray-600 text-black placeholder-gray-500">총 혜택</p>
                          <p className="font-bold text-black placeholder-gray-500">{card.totalBenefit.toLocaleString()}원</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center text-black placeholder-gray-500">
                          <p className="text-gray-600 text-black placeholder-gray-500">연회비</p>
                          <p className="font-bold text-black placeholder-gray-500">{card.annualFee.toLocaleString()}원</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center text-black placeholder-gray-500">
                          <p className="text-gray-600 text-black placeholder-gray-500">월 혜택</p>
                          <p className="font-bold text-black placeholder-gray-500">{card.monthlyNetBenefit.toLocaleString()}원</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 쿠팡 상품 추천 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-300 text-black placeholder-gray-500">
                <h3 className="text-lg md:text-xl font-bold text-black mb-4 text-center text-black placeholder-gray-500">
                  💳 카드 관리 필수템
                </h3>
                <div className="space-y-3 text-black placeholder-gray-500">
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <p className="font-bold text-gray-800 mb-1 text-black placeholder-gray-500">📱 카드 지갑 (RFID 차단)</p>
                    <p className="text-sm text-gray-600 text-black placeholder-gray-500">카드 보안 및 관리 필수</p>
                    <span className="inline-block mt-2 text-black font-semibold text-sm text-black placeholder-gray-500">
                      구매하러 가기 →
                    </span>
                  </a>
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <p className="font-bold text-gray-800 mb-1 text-black placeholder-gray-500">📊 가계부 앱 구독 (1년)</p>
                    <p className="text-sm text-gray-600 text-black placeholder-gray-500">카드 사용 내역 체계적 관리</p>
                    <span className="inline-block mt-2 text-black font-semibold text-sm text-black placeholder-gray-500">
                      구매하러 가기 →
                    </span>
                  </a>
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <p className="font-bold text-gray-800 mb-1 text-black placeholder-gray-500">🔔 스마트 알림 벨 (카드 결제)</p>
                    <p className="text-sm text-gray-600 text-black placeholder-gray-500">실시간 결제 알림, 보안 강화</p>
                    <span className="inline-block mt-2 text-black font-semibold text-sm text-black placeholder-gray-500">
                      구매하러 가기 →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
