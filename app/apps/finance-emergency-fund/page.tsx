'use client';

import { useState } from 'react';
import AppFooter from '@/app/components/AppFooter';

export default function EmergencyFundPage() {
  const [monthlyExpense, setMonthlyExpense] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlySaving, setMonthlySaving] = useState('');
  const [targetMonths, setTargetMonths] = useState('6');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const expense = parseFloat(monthlyExpense);
    const current = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlySaving);
    const target = parseInt(targetMonths);

    const targetAmount = expense * target;
    const remaining = targetAmount - current;
    const monthsNeeded = remaining > 0 ? Math.ceil(remaining / monthly) : 0;
    const progress = (current / targetAmount) * 100;

    setResult({
      targetAmount,
      remaining: Math.max(0, remaining),
      monthsNeeded,
      progress: Math.min(100, progress),
      completionDate: new Date(Date.now() + monthsNeeded * 30 * 24 * 60 * 60 * 1000),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 py-8 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
          💰 비상금 목표 계산기
        </h1>
        <p className="text-center text-green-100 mb-12">재정 안정을 위한 비상금 플랜</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
          <div>
            <label className="text-white font-bold mb-2 block">월 평균 생활비</label>
            <input
              type="number"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(e.target.value)}
              placeholder="예: 3000000"
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div>
            <label className="text-white font-bold mb-2 block">현재 비상금</label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="예: 5000000"
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div>
            <label className="text-white font-bold mb-2 block">월 저축 가능 금액</label>
            <input
              type="number"
              value={monthlySaving}
              onChange={(e) => setMonthlySaving(e.target.value)}
              placeholder="예: 1000000"
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div>
            <label className="text-white font-bold mb-2 block">목표 개월 수</label>
            <select
              value={targetMonths}
              onChange={(e) => setTargetMonths(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            >
              <option value="3">3개월분</option>
              <option value="6">6개월분 (권장)</option>
              <option value="12">12개월분</option>
              <option value="24">24개월분</option>
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all"
          >
            계산하기
          </button>

          {result && (
            <div className="space-y-4 pt-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">목표 달성 플랜</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">목표 비상금:</span>
                    <span className="font-bold text-green-600">₩{result.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">추가 필요 금액:</span>
                    <span className="font-bold text-red-600">₩{result.remaining.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">목표 달성까지:</span>
                    <span className="font-bold text-blue-600">{result.monthsNeeded}개월</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">예상 완료일:</span>
                    <span className="font-bold text-purple-600">
                      {result.completionDate.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="flex justify-between text-gray-800 mb-2">
                  <span className="font-bold">진행률</span>
                  <span className="font-bold">{Math.round(result.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${result.progress}%` }}
                  >
                    {Math.round(result.progress) > 10 && `${Math.round(result.progress)}%`}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                <h4 className="font-bold mb-2">💡 재정 전문가 조언</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>비상금은 최소 3~6개월 생활비를 권장합니다</li>
                  <li>언제든 인출 가능한 계좌에 보관하세요</li>
                  <li>정기적인 자동이체로 저축 습관을 만드세요</li>
                  <li>비상금은 투자가 아닌 안전 자산입니다</li>
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

