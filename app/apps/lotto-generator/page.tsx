"use client";

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
export default function LottoGenerator() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<number[][]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const [excludeNumbers, setExcludeNumbers] = useState<Set<number>>(new Set());

  // 로또 번호 생성 (1-45 중 6개)
  const generateNumbers = () => {
    setIsGenerating(true);
    
    // 애니메이션 효과
    let count = 0;
    const interval = setInterval(() => {
      const temp = [];
      for (let i = 0; i < 6; i++) {
        temp.push(Math.floor(Math.random() * 45) + 1);
      }
      setNumbers(temp);
      count++;
      
      if (count > 20) {
        clearInterval(interval);
        
        // 최종 번호 생성 (제외 번호 고려)
        const availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1)
          .filter(n => !excludeNumbers.has(n));
        
        const finalNumbers: number[] = [];
        const shuffled = [...availableNumbers].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < 6 && i < shuffled.length; i++) {
          finalNumbers.push(shuffled[i]);
        }
        
        const sorted = finalNumbers.sort((a, b) => a - b);
        setNumbers(sorted);
        setHistory(prev => [sorted, ...prev.slice(0, 9)]);
        setIsGenerating(false);
      }
    }, 50);
  };

  // 번호 색상
  const getNumberColor = (num: number) => {
    if (num <= 10) return 'bg-yellow-500';
    if (num <= 20) return 'bg-blue-500';
    if (num <= 30) return 'bg-red-500';
    if (num <= 40) return 'bg-gray-700';
    return 'bg-green-600';
  };

  // 번호 제외/포함 토글
  const toggleExcludeNumber = (num: number) => {
    const newSet = new Set(excludeNumbers);
    if (newSet.has(num)) {
      newSet.delete(num);
    } else {
      newSet.add(num);
    }
    setExcludeNumbers(newSet);
  };

  // 자동 생성 (5개)
  const generateAuto = () => {
    const results: number[][] = [];
    const availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1)
      .filter(n => !excludeNumbers.has(n));
    
    for (let i = 0; i < 5; i++) {
      const finalNumbers: number[] = [];
      const shuffled = [...availableNumbers].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < 6 && j < shuffled.length; j++) {
        finalNumbers.push(shuffled[j]);
      }
      
      results.push(finalNumbers.sort((a, b) => a - b));
    }
    
    setHistory(results);
    setNumbers(results[0]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="mx-auto max-w-[700px] px-4 py-6">
        {/* 로또 용지 스타일 헤더 */}
        <section className="bg-white rounded-lg shadow-2xl p-6 mb-4 border-4 border-red-600">
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-red-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                🎰
              </div>
              <div>
                <h1 className="text-2xl font-black text-red-600">LOTTO 6/45</h1>
                <p className="text-xs text-gray-600">행운의 번호 자동생성</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">추첨일</div>
              <div className="text-sm font-bold text-gray-800">매주 토요일 20:00</div>
            </div>
          </div>

          {/* 로또 용지 스타일 메인 번호 표시 */}
          <div className="mb-6 p-6 bg-white border-4 border-gray-800 rounded-lg relative" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #f3f4f6 0px, #f3f4f6 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #f3f4f6 0px, #f3f4f6 1px, transparent 1px, transparent 20px)',
            backgroundSize: '20px 20px'
          }}>
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
              A
            </div>
            {numbers.length === 0 ? (
              <div className="text-center text-gray-400 text-lg py-12 font-medium">
                ▼ 아래 버튼을 눌러 번호를 생성하세요 ▼
              </div>
            ) : (
              <div className="bg-white border-2 border-red-600 rounded-lg p-4">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  {numbers.map((num, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`w-14 h-14 rounded-full ${getNumberColor(num)} text-white font-black text-xl flex items-center justify-center shadow-lg border-4 border-white transform transition-all ${
                          isGenerating ? 'scale-110 animate-pulse' : 'scale-100'
                        }`}
                        style={{
                          boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)'
                        }}
                      >
                        {num}
                      </div>
                      {idx < 5 && (
                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 text-red-600 font-bold text-xl">
                          +
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-xs text-gray-500 font-medium">
                  ※ 자동 생성된 번호입니다
                </div>
              </div>
            )}
          </div>

          {/* 로또 용지 스타일 버튼 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={generateNumbers}
              disabled={isGenerating}
              className="py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-800"
            >
              {isGenerating ? '⏳ 추첨 중...' : '🎲 자동 번호 생성'}
            </button>
            
            <button
              onClick={generateAuto}
              disabled={isGenerating}
              className="py-4 bg-gray-800 hover:bg-gray-900 text-white font-black text-lg rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 border-2 border-black"
            >
              ⚡ 자동 5게임
            </button>
          </div>

          {/* 로또 용지 스타일 번호 선택 */}
          <div className="mb-6 p-4 bg-white border-2 border-gray-800 rounded-lg relative" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #f9fafb 0px, #f9fafb 1px, transparent 1px, transparent 15px), repeating-linear-gradient(90deg, #f9fafb 0px, #f9fafb 1px, transparent 1px, transparent 15px)',
            backgroundSize: '15px 15px'
          }}>
            <div className="flex items-center justify-between mb-3 bg-white px-2 py-1">
              <h3 className="font-bold text-gray-800 text-sm">🚫 제외할 번호 선택 (X 표시)</h3>
              <button
                onClick={() => setExcludeNumbers(new Set())}
                className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold"
              >
                초기화
              </button>
            </div>
            <div className="bg-white border border-gray-400 rounded p-3">
              <div className="grid grid-cols-9 gap-1.5">
                {Array.from({ length: 45 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => toggleExcludeNumber(num)}
                    className={`w-9 h-9 rounded-full font-bold text-xs transition-all border-2 ${
                      excludeNumbers.has(num)
                        ? 'bg-gray-300 text-gray-500 border-gray-400 line-through'
                        : `${getNumberColor(num)} text-white border-white hover:scale-110 shadow-md`
                    }`}
                  >
                    {excludeNumbers.has(num) ? 'X' : num}
                  </button>
                ))}
              </div>
            </div>
            {excludeNumbers.size > 0 && (
              <p className="text-xs text-red-600 mt-2 bg-white px-2 py-1 font-medium">
                제외: {Array.from(excludeNumbers).sort((a, b) => a - b).join(', ')}
              </p>
            )}
          </div>

          {/* 번호별 색상 가이드 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">🎨 번호 색상 구분</h3>
            <div className="grid grid-cols-5 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700">1-10</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                <span className="text-gray-700">11-20</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500"></div>
                <span className="text-gray-700">21-30</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                <span className="text-gray-700">31-40</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-600"></div>
                <span className="text-gray-700">41-45</span>
              </div>
            </div>
          </div>

          {/* 로또 용지 스타일 추첨 기록 */}
          {history.length > 0 && (
            <div className="p-4 bg-white border-2 border-gray-800 rounded-lg" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #f9fafb 0px, #f9fafb 1px, transparent 1px, transparent 15px), repeating-linear-gradient(90deg, #f9fafb 0px, #f9fafb 1px, transparent 1px, transparent 15px)',
              backgroundSize: '15px 15px'
            }}>
              <h3 className="font-black text-gray-800 mb-3 bg-white px-2 py-1 border-b-2 border-red-600">
                📋 생성된 게임 (최근 5개)
              </h3>
              <div className="space-y-2">
                {history.slice(0, 5).map((nums, idx) => {
                  const labels = ['A', 'B', 'C', 'D', 'E'];
                  return (
                    <div key={idx} className="bg-white rounded border-2 border-gray-400 p-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-600 text-white font-black text-sm flex items-center justify-center rounded">
                        {labels[idx]}
                      </div>
                      <div className="flex gap-1 flex-1">
                        {nums.map((num, i) => (
                          <div key={i} className="relative">
                            <div
                              className={`w-9 h-9 rounded-full ${getNumberColor(num)} text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm`}
                            >
                              {num}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-gray-600 bg-yellow-50 border border-yellow-300 rounded p-2 font-medium">
                💡 편의점에서 위 번호를 구매하시면 됩니다!
              </div>
            </div>
          )}
        </section>

        {/* 로또 용지 스타일 당첨 정보 */}
        <section className="bg-white rounded-lg shadow-2xl p-6 mb-4 border-4 border-red-600">
          <div className="border-b-2 border-red-600 pb-2 mb-4">
            <h3 className="font-black text-xl text-red-600">💰 LOTTO 6/45 당첨 안내</h3>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-yellow-700">1등</span>
                  <span className="text-sm text-gray-600 ml-2">6개 번호 일치</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">평균 20억</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-blue-700">2등</span>
                  <span className="text-sm text-gray-600 ml-2">5개 + 보너스</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">평균 5천만원</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-green-700">3등</span>
                  <span className="text-sm text-gray-600 ml-2">5개 번호 일치</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">평균 150만원</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-purple-700">4등</span>
                  <span className="text-sm text-gray-600 ml-2">4개 번호 일치</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">고정 5만원</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-700">5등</span>
                  <span className="text-sm text-gray-600 ml-2">3개 번호 일치</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">고정 5천원</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <h4 className="font-bold text-red-700 mb-2">⚠️ 당첨 확률</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• 1등: 1/8,145,060 (0.000012%)</div>
              <div>• 2등: 1/1,357,510 (0.000074%)</div>
              <div>• 3등: 1/35,724 (0.0028%)</div>
              <div>• 4등: 1/733 (0.14%)</div>
              <div>• 5등: 1/45 (2.22%)</div>
            </div>
          </div>
        </section>

        {/* 로또 용지 스타일 구매 팁 */}
        <section className="bg-white rounded-lg shadow-2xl p-6 border-4 border-gray-800">
          <div className="border-b-2 border-gray-800 pb-2 mb-4">
            <h3 className="font-black text-xl text-gray-800">💡 로또 구매 가이드</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              🎯 <strong>균형있는 분포:</strong> 높은 번호와 낮은 번호를 골고루 선택
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              🔢 <strong>연속 번호 주의:</strong> 3개 이상 연속 번호는 당첨 빈도 낮음
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              📊 <strong>홀짝 비율:</strong> 홀수 3개, 짝수 3개가 가장 이상적
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              💰 <strong>예산 관리:</strong> 여유 자금으로만 구매, 과도한 구매 금지
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              ⏰ <strong>구매 시간:</strong> 매주 토요일 오후 8시 이전까지 구매 가능
            </div>
          </div>
        </section>

        <footer className="mt-6 pb-8">
          <div className="bg-white border-2 border-gray-400 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-600 font-medium mb-2">
              ※ 본 서비스는 번호 추천용이며, 당첨을 보장하지 않습니다
            </p>
          </div>
        </footer>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}

