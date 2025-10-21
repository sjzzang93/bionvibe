'use client';

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
export default function IncomeTaxCalculatorPage() {
  const [income, setIncome] = useState('50000000');
  const [expenses, setExpenses] = useState('20000000');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const totalIncome = Number(income);
    const totalExpenses = Number(expenses);
    const taxableIncome = totalIncome - totalExpenses;
    
    // 2025년 종합소득세율
    let tax = 0;
    if (taxableIncome <= 14000000) tax = taxableIncome * 0.06;
    else if (taxableIncome <= 50000000) tax = 840000 + (taxableIncome - 14000000) * 0.15;
    else if (taxableIncome <= 88000000) tax = 6240000 + (taxableIncome - 50000000) * 0.24;
    else if (taxableIncome <= 150000000) tax = 15360000 + (taxableIncome - 88000000) * 0.35;
    else if (taxableIncome <= 300000000) tax = 37060000 + (taxableIncome - 150000000) * 0.38;
    else if (taxableIncome <= 500000000) tax = 94060000 + (taxableIncome - 300000000) * 0.40;
    else tax = 174060000 + (taxableIncome - 500000000) * 0.42;
    
    const localTax = tax * 0.1; // 지방소득세
    const totalTax = tax + localTax;
    const netIncome = taxableIncome - totalTax;

    setResult({ taxableIncome, tax, localTax, totalTax, netIncome });
  };

  return (
    <main className="min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-8 text-black placeholder-gray-500">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-2 border-black text-black placeholder-gray-500">
          <header className="text-center mb-8 text-black placeholder-gray-500">
            <div className="text-5xl mb-4 text-black placeholder-gray-500">💸</div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 text-black placeholder-gray-500">종합소득세 계산기</h1>
            <p className="text-sm md:text-base text-black placeholder-gray-500">프리랜서/N잡러 필요경비 자동 계산</p>
          </header>
          <div className="space-y-5 mb-8 text-black placeholder-gray-500">
            <div>
              <label className="block font-semibold mb-2 text-black placeholder-gray-500">연간 총수입</label>
              <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full p-3 border-2 rounded-lg text-black" />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-black placeholder-gray-500">필요경비</label>
              <input type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="w-full p-3 border-2 rounded-lg text-black" />
            </div>
          </div>
          <button onClick={calculate} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-black placeholder-gray-500">계산하기</button>
          {result && (
            <div className="mt-8 space-y-4 text-black placeholder-gray-500">
              <div className="bg-green-50 p-6 rounded-xl text-black placeholder-gray-500">
                <p className="text-center text-sm text-gray-600 mb-2 text-black placeholder-gray-500">과세표준</p>
                <p className="text-center text-3xl font-bold text-black text-black placeholder-gray-500">{result.taxableIncome.toLocaleString()}원</p>
              </div>
              <div className="space-y-2 text-black placeholder-gray-500">
                <div className="flex justify-between p-3 bg-white rounded-lg text-black placeholder-gray-500">
                  <span>소득세</span>
                  <span className="font-bold text-black text-black placeholder-gray-500">{result.tax.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg text-black placeholder-gray-500">
                  <span>지방소득세</span>
                  <span className="font-bold text-black text-black placeholder-gray-500">{result.localTax.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between p-4 bg-red-50 rounded-lg border-2 border-red-300 text-black placeholder-gray-500">
                  <span className="font-bold text-black placeholder-gray-500">총 납부세액</span>
                  <span className="font-bold text-black text-lg text-black placeholder-gray-500">{result.totalTax.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-300 text-black placeholder-gray-500">
                  <span className="font-bold text-black placeholder-gray-500">세후 순소득</span>
                  <span className="font-bold text-black text-lg text-black placeholder-gray-500">{result.netIncome.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}
