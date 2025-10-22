"use client";

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
export default function CompoundCalculator() {
  const [investmentType, setInvestmentType] = useState<'lumpsum' | 'monthly'>('monthly');
  const [principal, setPrincipal] = useState(10000000);
  const [monthlyAmount, setMonthlyAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(7);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const r = interestRate / 100;
    const n = years;

    let finalAmount = 0;
    let totalInvested = 0;
    const yearlyData = [];

    if (investmentType === 'lumpsum') {
      // 일시불 투자
      finalAmount = principal * Math.pow(1 + r, n);
      totalInvested = principal;

      for (let year = 1; year <= n; year++) {
        const amount = principal * Math.pow(1 + r, year);
        yearlyData.push({
          year,
          invested: principal,
          total: Math.round(amount),
          interest: Math.round(amount - principal)
        });
      }
    } else {
      // 월 적립식
      const monthlyRate = r / 12;
      const months = n * 12;
      
      finalAmount = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      totalInvested = monthlyAmount * months;

      for (let year = 1; year <= n; year++) {
        const m = year * 12;
        const amount = monthlyAmount * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
        const invested = monthlyAmount * m;
        yearlyData.push({
          year,
          invested: Math.round(invested),
          total: Math.round(amount),
          interest: Math.round(amount - invested)
        });
      }
    }

    const totalInterest = finalAmount - totalInvested;
    const returnRate = ((finalAmount / totalInvested) - 1) * 100;

    setResult({
      finalAmount: Math.round(finalAmount),
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(totalInterest),
      returnRate: returnRate.toFixed(1),
      yearlyData
    });
  };

  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 text-black dark:text-white placeholder-gray-500 transition-colors">
        <div className="mx-auto max-w-[800px] px-4 py-6 text-black placeholder-gray-500">
          <div className="mb-4 text-black placeholder-gray-500">
            
          </div>

          <section className="bg-white rounded sm:rounded-lg md:rounded-2xl shadow-xl p-6 mb-6 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <h1 className="text-3xl font-bold mb-2 text-black placeholder-gray-500">📈</h1>
              <h2 className="text-2xl font-bold text-gray-800 text-black placeholder-gray-500">투자 시뮬레이션 결과</h2>
            </header>

            {/* 최종 결과 */}
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded sm:rounded-lg md:rounded-2xl border-3 border-blue-400 text-black placeholder-gray-500">
              <div className="text-center mb-4 text-black placeholder-gray-500">
                <div className="text-sm text-gray-600 mb-2 text-black placeholder-gray-500">{years}년 후 예상 자산</div>
                <div className="text-6xl font-bold mb-0.5 sm:mb-1.5 md:mb-2" style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {(result.finalAmount / 10000).toLocaleString()}만
                </div>
                <div className="text-2xl font-semibold text-black text-black placeholder-gray-500">
                  +{(result.totalInterest / 10000).toLocaleString()}만 수익
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-black placeholder-gray-500">
                <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                  <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">투자 원금</div>
                  <div className="text-lg font-bold text-gray-800 text-black placeholder-gray-500">
                    {(result.totalInvested / 10000).toLocaleString()}만
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                  <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">이자 수익</div>
                  <div className="text-lg font-bold text-black text-black placeholder-gray-500">
                    {(result.totalInterest / 10000).toLocaleString()}만
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                  <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">수익률</div>
                  <div className="text-lg font-bold text-black text-black placeholder-gray-500">
                    {result.returnRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* 연도별 상세 */}
            <div className="mb-6 text-black placeholder-gray-500">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-800 mb-0.5 sm:mb-1.5 md:mb-2 text-black placeholder-gray-500">📊 연도별 자산 증가</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto text-black placeholder-gray-500">
                {result.yearlyData.map((data: any) => (
                  <div key={data.year} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-black placeholder-gray-500">
                    <div className="flex justify-between items-center mb-2 text-black placeholder-gray-500">
                      <span className="font-bold text-gray-800 text-black placeholder-gray-500">{data.year}년차</span>
                      <span className="text-xl font-bold text-black text-black placeholder-gray-500">
                        {(data.total / 10000).toLocaleString()}만원
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 text-black placeholder-gray-500">
                      <span>투자금: {(data.invested / 10000).toLocaleString()}만</span>
                      <span className="text-black font-semibold text-black placeholder-gray-500">수익: +{(data.interest / 10000).toLocaleString()}만</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2 text-black placeholder-gray-500">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (data.total / result.finalAmount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
        type="button"
              onClick={() => setResult(null)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[10px] sm:text-xs md:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              다시 계산하기
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-black placeholder-gray-500">
      <div className="mx-auto max-w-[800px] px-4 py-6 text-black placeholder-gray-500">
        <div className="mb-4 text-black placeholder-gray-500">
          
        </div>

        <section className="bg-white rounded sm:rounded-lg md:rounded-2xl shadow-xl p-6 mb-6 text-black placeholder-gray-500">
          <header className="text-center mb-6 text-black placeholder-gray-500">
            <h1 className="text-4xl font-bold mb-2 text-black placeholder-gray-500">📈</h1>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 text-black placeholder-gray-500">
              복리 계산기 (투자 시뮬레이터)
            </h2>
            <p className="text-gray-600 text-black placeholder-gray-500">복리의 마법을 경험하세요</p>
          </header>

          {/* 투자 방식 선택 */}
          <div className="mb-6 text-black placeholder-gray-500">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">투자 방식</label>
            <div className="grid grid-cols-3 gap-4 text-black placeholder-gray-500">
              <button
        type="button"
                onClick={() => setInvestmentType('lumpsum')}
                className={`p-5 rounded-xl font-semibold transition-all border-2 ${
                  investmentType === 'lumpsum'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2 text-black placeholder-gray-500">💼</div>
                <div className="text-lg mb-1 text-black placeholder-gray-500">일시불 투자</div>
                <div className="text-xs opacity-80 text-black placeholder-gray-500">목돈을 한 번에 투자</div>
              </button>
              <button
        type="button"
                onClick={() => setInvestmentType('monthly')}
                className={`p-5 rounded-xl font-semibold transition-all border-2 ${
                  investmentType === 'monthly'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-500 text-white border-transparent shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2 text-black placeholder-gray-500">📅</div>
                <div className="text-lg mb-1 text-black placeholder-gray-500">월 적립식</div>
                <div className="text-xs opacity-80 text-black placeholder-gray-500">매월 일정 금액 투자</div>
              </button>
            </div>
          </div>

          {/* 투자 조건 입력 */}
          <div className="space-y-5 text-black placeholder-gray-500">
            {investmentType === 'lumpsum' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">
                  투자 원금 ({(principal / 10000).toLocaleString()}만원)
                </label>
                <input
                  type="range"
                  min="1000000"
                  max="100000000"
                  step="1000000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 text-black placeholder-gray-500">
                  <span>100만</span>
                  <span>1억</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">
                  월 투자금액 ({(monthlyAmount / 10000).toLocaleString()}만원)
                </label>
                <input
                  type="range"
                  min="100000"
                  max="5000000"
                  step="100000"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 text-black placeholder-gray-500">
                  <span>10만</span>
                  <span>500만</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">
                연 수익률 ({interestRate}%)
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1 text-black placeholder-gray-500">
                <span>1%</span>
                <span>20%</span>
              </div>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-black placeholder-gray-500">
                <div className="text-xs text-black text-black placeholder-gray-500">
                  💡 예금: 3-4% / 채권: 4-6% / 주식: 7-10% / 공격투자: 10%+
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">
                투자 기간 ({years}년)
              </label>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1 text-black placeholder-gray-500">
                <span>1년</span>
                <span>40년</span>
              </div>
            </div>
          </div>

          {/* 빠른 시뮬레이션 버튼 */}
          <div className="my-6 p-4 bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl border border-purple-300 text-black placeholder-gray-500">
            <h3 className="font-semibold text-black mb-0.5 sm:mb-1.5 md:mb-2 text-black placeholder-gray-500">⚡ 빠른 시뮬레이션</h3>
            <div className="grid grid-cols-3 gap-2 text-black placeholder-gray-500">
              {[
                { period: 10, rate: 7, label: '10년/7%' },
                { period: 20, rate: 7, label: '20년/7%' },
                { period: 30, rate: 7, label: '30년/7%' },
                { period: 10, rate: 10, label: '10년/10%' },
                { period: 20, rate: 10, label: '20년/10%' },
                { period: 30, rate: 10, label: '30년/10%' }
              ].map((preset, i) => (
                <button
        type="button"
                  key={i}
                  onClick={() => {
                    setYears(preset.period);
                    setInterestRate(preset.rate);
                  }}
                  className="py-2 px-3 bg-white border border-purple-300 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <button
        type="button"
            onClick={calculate}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            복리 효과 계산하기
          </button>
        </section>

        {/* 복리의 힘 */}
        <div className="bg-white rounded sm:rounded-lg md:rounded-2xl shadow-lg p-6 text-black placeholder-gray-500">
          <h3 className="font-bold text-xl text-gray-800 mb-4 text-black placeholder-gray-500">🚀 복리의 힘</h3>
          <div className="space-y-3 text-sm text-black placeholder-gray-500">
            <div className="p-3 bg-blue-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black text-black placeholder-gray-500">📌 아인슈타인:</span>
              <span className="text-black text-black placeholder-gray-500"> "복리는 인류 최대의 발명품이다"</span>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black text-black placeholder-gray-500">💰 72의 법칙:</span>
              <span className="text-black text-black placeholder-gray-500"> 72 ÷ 수익률 = 원금 2배 되는 기간 (년)</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black text-black placeholder-gray-500">⏰ 시간의 힘:</span>
              <span className="text-black text-black placeholder-gray-500"> 10년 vs 20년 차이는 상상 이상!</span>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black text-black placeholder-gray-500">🎯 꾸준함:</span>
              <span className="text-black text-black placeholder-gray-500"> 적은 금액이라도 매월 꾸준히가 핵심</span>
            </div>
          </div>
        </div>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}

