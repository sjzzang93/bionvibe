'use client';

import { useState } from 'react';
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';

export default function SalaryCalculatorPage() {
  const [monthlySalary, setMonthlySalary] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  const calculateDeductions = (grossSalary: number) => {
    // 2024년 기준 요율
    const nationalPension = Math.min(grossSalary * 0.045, 248850); // 국민연금 4.5% (상한액 553만원)
    const healthInsurance = grossSalary * 0.03545; // 건강보험 3.545%
    const longTermCare = healthInsurance * 0.1295; // 장기요양 12.95%
    const employmentInsurance = grossSalary * 0.009; // 고용보험 0.9%

    // 소득세 계산 (간이세액표 기준, 1인 가구 기준)
    let incomeTax = 0;
    const yearlyGross = grossSalary * 12;

    if (yearlyGross <= 14000000) {
      incomeTax = yearlyGross * 0.06;
    } else if (yearlyGross <= 50000000) {
      incomeTax = 840000 + (yearlyGross - 14000000) * 0.15;
    } else if (yearlyGross <= 88000000) {
      incomeTax = 6240000 + (yearlyGross - 50000000) * 0.24;
    } else if (yearlyGross <= 150000000) {
      incomeTax = 15360000 + (yearlyGross - 88000000) * 0.35;
    } else if (yearlyGross <= 300000000) {
      incomeTax = 37060000 + (yearlyGross - 150000000) * 0.38;
    } else if (yearlyGross <= 500000000) {
      incomeTax = 94060000 + (yearlyGross - 300000000) * 0.40;
    } else {
      incomeTax = 174060000 + (yearlyGross - 500000000) * 0.42;
    }

    const monthlyIncomeTax = incomeTax / 12;
    const localIncomeTax = monthlyIncomeTax * 0.1; // 지방소득세 10%

    const totalDeduction = nationalPension + healthInsurance + longTermCare + employmentInsurance + monthlyIncomeTax + localIncomeTax;
    const netSalary = grossSalary - totalDeduction;

    return {
      grossSalary,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax: monthlyIncomeTax,
      localIncomeTax,
      totalDeduction,
      netSalary,
      yearlyGross: grossSalary * 12,
      yearlyNet: netSalary * 12,
    };
  };

  const handleCalculate = () => {
    const salary = parseInt(monthlySalary.replace(/,/g, ''));
    if (!salary || salary <= 0) {
      alert('월급을 올바르게 입력해주세요!');
      return;
    }
    const calculated = calculateDeductions(salary);
    setResult(calculated);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const formatted = value ? formatNumber(parseInt(value)) : '';
    setMonthlySalary(formatted);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <AdOverlay />
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">💵</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            월급 실수령액 계산기
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            4대보험과 세금을 제외한 실수령액을 계산하세요
          </p>
        </div>

        {/* 입력 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            세전 월급 (원)
          </label>
          <input
            type="text"
            value={monthlySalary}
            onChange={handleInputChange}
            placeholder="예: 3,000,000"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-lg font-semibold text-right focus:outline-none focus:border-blue-500 dark:text-white"
          />

          <button
            onClick={handleCalculate}
            className="w-full mt-4 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
          >
            💰 계산하기
          </button>
        </div>

        {/* 결과 */}
        {result && (
          <div className="space-y-4">
            {/* 실수령액 */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 shadow-lg text-white">
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">월 실수령액</div>
                <div className="text-4xl font-bold mb-4">
                  {formatNumber(result.netSalary)}원
                </div>
                <div className="text-sm opacity-90">
                  연봉: {formatNumber(result.yearlyNet)}원
                </div>
              </div>
            </div>

            {/* 세전 급여 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  세전 월급
                </span>
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  {formatNumber(result.grossSalary)}원
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                연봉: {formatNumber(result.yearlyGross)}원
              </div>
            </div>

            {/* 공제 항목 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>📋</span>
                <span>공제 내역</span>
              </h3>

              <div className="space-y-3">
                {/* 국민연금 */}
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      국민연금
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      4.5%
                    </div>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    -{formatNumber(result.nationalPension)}원
                  </span>
                </div>

                {/* 건강보험 */}
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      건강보험
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      3.545%
                    </div>
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    -{formatNumber(result.healthInsurance)}원
                  </span>
                </div>

                {/* 장기요양보험 */}
                <div className="flex justify-between items-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      장기요양보험
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      건강보험의 12.95%
                    </div>
                  </div>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    -{formatNumber(result.longTermCare)}원
                  </span>
                </div>

                {/* 고용보험 */}
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      고용보험
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      0.9%
                    </div>
                  </div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    -{formatNumber(result.employmentInsurance)}원
                  </span>
                </div>

                {/* 소득세 */}
                <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      소득세
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      누진세율 적용
                    </div>
                  </div>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    -{formatNumber(result.incomeTax)}원
                  </span>
                </div>

                {/* 지방소득세 */}
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      지방소득세
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      소득세의 10%
                    </div>
                  </div>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    -{formatNumber(result.localIncomeTax)}원
                  </span>
                </div>
              </div>

              {/* 총 공제액 */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 dark:text-white">
                    총 공제액
                  </span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    -{formatNumber(result.totalDeduction)}원
                  </span>
                </div>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-900">
              <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>안내사항</span>
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-200">
                <li>• 2024년 기준 요율로 계산됩니다</li>
                <li>• 소득세는 1인 가구 기준 간이세액표를 적용합니다</li>
                <li>• 실제 공제액은 부양가족 수, 비과세액 등에 따라 달라질 수 있습니다</li>
                <li>• 참고용으로만 활용해주세요</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
