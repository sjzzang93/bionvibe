'use client';

import { useState } from 'react';
import AppFooter from '@/app/components/AppFooter';

export default function LoanRefinancePage() {
  const [currentLoan, setCurrentLoan] = useState('');
  const [currentRate, setCurrentRate] = useState('');
  const [currentMonths, setCurrentMonths] = useState('');
  const [monthsPassed, setMonthsPassed] = useState('');
  const [newRate, setNewRate] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateMonthlyPayment = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  const handleAnalyze = () => {
    const principal = parseFloat(currentLoan);
    const oldRate = parseFloat(currentRate);
    const totalMonths = parseInt(currentMonths);
    const passed = parseInt(monthsPassed);
    const refinanceRate = parseFloat(newRate);

    // 현재 대출 월 상환액
    const currentMonthly = calculateMonthlyPayment(principal, oldRate, totalMonths);
    
    // 남은 원금 계산
    const monthlyRate = oldRate / 100 / 12;
    const remainingBalance = principal * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, passed)) /
                            (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    // 남은 기간
    const remainingMonths = totalMonths - passed;
    
    // 새 대출 월 상환액
    const newMonthly = calculateMonthlyPayment(remainingBalance, refinanceRate, remainingMonths);
    
    // 월 절감액
    const monthlySavings = currentMonthly - newMonthly;
    
    // 총 절감액
    const totalSavings = monthlySavings * remainingMonths;
    
    // 갈아타기 수수료 (일반적으로 잔금의 1-2%)
    const refinanceFee = remainingBalance * 0.015;
    
    // 실제 순이익
    const netSavings = totalSavings - refinanceFee;
    
    // 손익분기점 (개월)
    const breakEvenMonths = Math.ceil(refinanceFee / monthlySavings);

    // 권장 여부
    const isRecommended = netSavings > 0 && monthlySavings > 10000;

    setResult({
      currentMonthly: Math.round(currentMonthly),
      newMonthly: Math.round(newMonthly),
      monthlySavings: Math.round(monthlySavings),
      totalSavings: Math.round(totalSavings),
      refinanceFee: Math.round(refinanceFee),
      netSavings: Math.round(netSavings),
      remainingBalance: Math.round(remainingBalance),
      remainingMonths,
      breakEvenMonths,
      isRecommended,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 py-8 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-white mb-4">
          🏦 대출 갈아타기 분석
        </h1>
        <p className="text-center text-purple-100 mb-8 text-[10px] sm:text-xs md:text-sm">금리 인하로 얼마나 절약할 수 있을까요?</p>

        <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-6 md:p-8 space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">현재 대출 정보</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-2">
            <div>
              <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">현재 대출액 (원)</label>
              <input
                type="number"
                value={currentLoan}
                onChange={(e) => setCurrentLoan(e.target.value)}
                placeholder="예: 100000000"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
            <div>
              <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">현재 금리 (%)</label>
              <input
                type="number"
                step="0.01"
                value={currentRate}
                onChange={(e) => setCurrentRate(e.target.value)}
                placeholder="예: 4.5"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-2">
            <div>
              <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">대출 기간 (개월)</label>
              <input
                type="number"
                value={currentMonths}
                onChange={(e) => setCurrentMonths(e.target.value)}
                placeholder="예: 360 (30년)"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
            <div>
              <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">경과 기간 (개월)</label>
              <input
                type="number"
                value={monthsPassed}
                onChange={(e) => setMonthsPassed(e.target.value)}
                placeholder="예: 60 (5년)"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 pt-4">새 대출 정보</h2>

          <div>
            <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">새 금리 (%)</label>
            <input
              type="number"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="예: 3.2"
              className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
              style={{ fontSize: '16px', minHeight: '44px' }}
            />
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm md:text-xl hover:shadow-lg transition-all"
            style={{ minHeight: '48px' }}
          >
            분석하기
          </button>

          {result && (
            <div className="space-y-4 pt-6">
              {/* 권장 여부 */}
              <div className={`rounded-xl p-6 text-center text-white ${
                result.isRecommended 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600'
              }`}>
                <div className="text-5xl md:text-6xl mb-4">
                  {result.isRecommended ? '✅' : '⚠️'}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2">
                  {result.isRecommended ? '갈아타기 추천!' : '신중한 검토 필요'}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm">
                  {result.isRecommended 
                    ? '금리 차이가 충분히 크므로 갈아타기를 권장합니다'
                    : '절감액이 크지 않거나 수수료를 고려하면 이득이 적습니다'
                  }
                </div>
              </div>

              {/* 월 상환액 비교 */}
              <div className="bg-white rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">월 상환액 비교</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                    <span className="text-gray-600">현재 월 상환액:</span>
                    <span className="font-bold text-red-600">₩{result.currentMonthly.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                    <span className="text-gray-600">새 월 상환액:</span>
                    <span className="font-bold text-blue-600">₩{result.newMonthly.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base md:text-lg pt-3 border-t">
                    <span className="text-gray-800 font-bold">월 절감액:</span>
                    <span className="font-bold text-green-600">₩{result.monthlySavings.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 총 절감액 */}
              <div className="bg-white rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">절감 효과</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                    <span className="text-gray-600">총 절감액:</span>
                    <span className="font-bold text-blue-600">₩{result.totalSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                    <span className="text-gray-600">갈아타기 수수료 (예상):</span>
                    <span className="font-bold text-orange-600">-₩{result.refinanceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base md:text-lg pt-3 border-t">
                    <span className="text-gray-800 font-bold">순 절감액:</span>
                    <span className={`font-bold text-xl md:text-2xl ${result.netSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₩{result.netSavings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="bg-white rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">추가 정보</h3>
                <div className="space-y-3 text-[10px] sm:text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">남은 대출금:</span>
                    <span className="font-bold text-gray-800">₩{result.remainingBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">남은 기간:</span>
                    <span className="font-bold text-gray-800">{result.remainingMonths}개월 ({Math.round(result.remainingMonths/12)}년)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">손익분기점:</span>
                    <span className="font-bold text-purple-600">{result.breakEvenMonths}개월</span>
                  </div>
                </div>
              </div>

              {/* 조언 */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 md:p-6 text-white">
                <h4 className="font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-base md:text-lg">💡 전문가 조언</h4>
                <ul className="space-y-2 text-xs md:text-sm list-disc list-inside">
                  <li>대출 갈아타기는 금리 차이가 최소 1% 이상일 때 권장됩니다</li>
                  <li>중도상환 수수료와 신규 대출 수수료를 확인하세요</li>
                  <li>손익분기점 이후까지 거주할 예정인지 고려하세요</li>
                  <li>여러 은행의 금리를 비교해보세요</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      {/* 제작자 서명 */}
      <AppFooter />
      </div>
    </div>
  );
}

