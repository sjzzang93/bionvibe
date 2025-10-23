"use client";

import { useState, useEffect } from 'react';
import AppFooter from "@/app/components/AppFooter";
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import Link from 'next/link';


const DEFAULT_RATES = { res: 172, comm: 175, agr: 70 };
const LS_KEY = 'electricity_rates_v1';

export default function ElectricityCalculator() {
  const [power, setPower] = useState('');
  const [unit, setUnit] = useState<'W' | 'kW'>('W');
  const [mode, setMode] = useState<'total' | 'daily'>('total');
  const [hoursTotal, setHoursTotal] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [days, setDays] = useState('');
  const [category, setCategory] = useState<'res' | 'comm' | 'agr'>('res');
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [showModal, setShowModal] = useState(false);
  const [tempRates, setTempRates] = useState(DEFAULT_RATES);
  const [result, setResult] = useState({ price: 0, kWh: 0, unitPrice: 0 });

  useEffect(() => {
    const loadRates = () => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return DEFAULT_RATES;
        const obj = JSON.parse(raw);
        return { ...DEFAULT_RATES, ...obj };
      } catch (e) {
        return DEFAULT_RATES;
      }
    };
    setRates(loadRates());
  }, []);

  const toNum = (v: string) => {
    const n = parseFloat(v.replace(/,/g, ''));
    return Number.isFinite(n) ? n : NaN;
  };

  const fmtKRW = (n: number) => 
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Math.round(n || 0));

  const calculate = () => {
    const powerVal = toNum(power);
    if (!Number.isFinite(powerVal) || powerVal <= 0) {
      alert('소비전력을 올바르게 입력해주세요.');
      return;
    }

    let hours = 0;
    if (mode === 'total') {
      const ht = toNum(hoursTotal);
      if (!Number.isFinite(ht) || ht <= 0) {
        alert('총 사용시간(시간)을 입력하세요.');
        return;
      }
      hours = ht;
    } else {
      const hpd = toNum(hoursPerDay);
      const d = toNum(days);
      if (!Number.isFinite(hpd) || hpd <= 0) {
        alert('하루 사용시간을 입력하세요.');
        return;
      }
      if (!Number.isFinite(d) || d <= 0) {
        alert('일수를 입력하세요.');
        return;
      }
      hours = hpd * d;
    }

    const kW = unit === 'W' ? powerVal / 1000 : powerVal;
    const kWh = kW * hours;
    const unitPrice = rates[category] ?? 0;
    const price = kWh * unitPrice;

    setResult({ price, kWh, unitPrice });
  };

  const resetAll = () => {
    setPower('');
    setUnit('W');
    setHoursTotal('');
    setHoursPerDay('');
    setDays('');
    setCategory('res');
    setMode('total');
    setResult({ price: 0, kWh: 0, unitPrice: 0 });
  };

  const saveRates = () => {
    if ([tempRates.res, tempRates.comm, tempRates.agr].some(v => !Number.isFinite(v) || v <= 0)) {
      alert('단가는 0보다 큰 숫자로 입력해주세요.');
      return;
    }
    setRates(tempRates);
    localStorage.setItem(LS_KEY, JSON.stringify(tempRates));
    setShowModal(false);
  };

  const restoreDefaults = () => {
    setTempRates(DEFAULT_RATES);
    setRates(DEFAULT_RATES);
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_RATES));
  };

  return (
    <PremiumLayout>
      {/* 헤더 */}
      <div className="text-center mb-8 sm:mb-12">
        {/* 피카츄 얼굴 */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-amber-900 rounded-full shadow-lg shadow-yellow-400/50"></div>
          <div className="w-3 h-3 bg-amber-900 rounded-full shadow-lg shadow-yellow-400/50"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
          ⚡ 전기요금 계산기
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          피카츄 감성으로 똑똑하게 ⚡ 소비전력과 사용시간만 입력하면 끝!
        </p>
      </div>

      {/* 입력 폼 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* 소비전력 */}
        <PremiumCard title="⚡ 소비전력" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                id="power"
                type="number"
                inputMode="decimal"
                placeholder="예: 800"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/80 backdrop-blur border-2 border-yellow-300 rounded-xl 
                         text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50 
                         transition-all text-base sm:text-lg font-semibold outline-none"
              />
              <select 
                value={unit} 
                onChange={(e) => setUnit(e.target.value as 'W' | 'kW')}
                className="px-4 py-3 bg-white/80 backdrop-blur border-2 border-yellow-300 rounded-xl 
                         text-gray-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50 
                         transition-all font-semibold outline-none cursor-pointer"
              >
                <option value="W">W</option>
                <option value="kW">kW</option>
              </select>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 font-medium">
              💡 설명서의 정격 소비전력 값을 입력하세요
            </p>
          </div>
        </PremiumCard>

        {/* 사용시간 */}
        <PremiumCard title="⏰ 사용시간" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
          <div className="space-y-4">
            {/* 모드 선택 */}
            <div className="flex gap-2 p-1 bg-white/60 backdrop-blur rounded-xl border-2 border-blue-200">
              <button
        type="button" 
                onClick={() => setMode('total')}
                className={`flex-1 px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                  mode === 'total' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                총 사용시간
              </button>
              <button
        type="button" 
                onClick={() => setMode('daily')}
                className={`flex-1 px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                  mode === 'daily' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                하루 × 일수
              </button>
            </div>
            
            {/* 입력 필드 */}
            {mode === 'total' ? (
              <input
                type="number"
                inputMode="decimal"
                placeholder="예: 5 (시간)"
                value={hoursTotal}
                onChange={(e) => setHoursTotal(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur border-2 border-blue-300 rounded-xl 
                         text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 
                         transition-all text-base sm:text-lg font-semibold outline-none"
              />
            ) : (
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="하루 시간"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/80 backdrop-blur border-2 border-blue-300 rounded-xl 
                           text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 
                           transition-all text-base sm:text-lg font-semibold outline-none"
                />
                <span className="text-2xl font-bold text-gray-700">×</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="일수"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/80 backdrop-blur border-2 border-blue-300 rounded-xl 
                           text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 
                           transition-all text-base sm:text-lg font-semibold outline-none"
                />
              </div>
            )}
          </div>
        </PremiumCard>

        {/* 요금 분류 */}
        <PremiumCard title="💰 요금 분류" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
          <div className="space-y-4">
            <select 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur border-2 border-green-300 rounded-xl 
                       text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-400/50 
                       transition-all text-base sm:text-lg font-semibold outline-none cursor-pointer"
            >
              <option value="res">🏠 가정용</option>
              <option value="comm">🏢 상업용</option>
              <option value="agr">🌾 농업용</option>
            </select>
            <div className="flex justify-between items-center gap-2">
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                현재 단가: {rates[category].toFixed(1)} 원/kWh
              </p>
              <button
        type="button" 
                onClick={() => { setTempRates(rates); setShowModal(true); }}
                className="px-3 py-1.5 bg-white/80 hover:bg-white border-2 border-green-300 hover:border-green-500 
                         rounded-lg text-xs sm:text-sm font-bold text-green-700 transition-all"
              >
                단가 편집
              </button>
            </div>
          </div>
        </PremiumCard>

        {/* 계산 버튼 */}
        <PremiumCard title="🎯 계산하기" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' }}>
          <div className="space-y-3">
            <button
        type="button" 
              onClick={calculate}
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 
                       hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600
                       text-gray-900 font-black text-lg rounded-xl shadow-lg hover:shadow-xl 
                       transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              ⚡ 전기요금 계산하기
            </button>
            <button
        type="button" 
              onClick={resetAll}
              className="w-full px-6 py-3 bg-white/80 hover:bg-white border-2 border-pink-300 hover:border-pink-500 
                       text-pink-700 font-bold text-base rounded-xl transition-all"
            >
              초기화
            </button>
            <p className="text-xs sm:text-sm text-gray-700 font-medium text-center">
              💡 결과는 아래 카드에 표시됩니다
            </p>
          </div>
        </PremiumCard>
      </div>

      {/* 결과 표시 */}
      <PremiumCard 
        title="💸 예상 전기요금"
        style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #fbbf24 100%)',
          marginTop: '1.5rem'
        }}
      >
        <div className="space-y-6" suppressHydrationWarning>
          {/* 메인 금액 */}
          <div className="text-center py-6 bg-white/40 backdrop-blur rounded-2xl border-2 border-yellow-400 shadow-xl">
            <div className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text mb-2 drop-shadow-lg" suppressHydrationWarning>
              {fmtKRW(result.price)}
            </div>
            <p className="text-sm sm:text-base text-gray-700 font-semibold" suppressHydrationWarning>
              단가: {rates[category].toFixed(1)} 원/kWh
            </p>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border-2 border-yellow-300">
              <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-1">사용전력량</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900" suppressHydrationWarning>
                {result.kWh.toFixed(2)} <span className="text-lg">kWh</span>
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border-2 border-yellow-300">
              <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-1">적용 단가</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900" suppressHydrationWarning>
                {result.unitPrice.toFixed(1)} <span className="text-lg">원/kWh</span>
              </p>
            </div>
          </div>

          {/* 계산식 */}
          <div className="bg-amber-100/60 backdrop-blur rounded-xl p-4 border-2 border-amber-300">
            <p className="text-xs sm:text-sm text-gray-700 font-medium text-center" suppressHydrationWarning>
              💡 {result.kWh.toFixed(2)} kWh × {result.unitPrice.toFixed(1)} 원/kWh = {fmtKRW(result.price)}
            </p>
          </div>
        </div>
      </PremiumCard>

      {/* 안내 사항 */}
      <div className="mt-6 p-4 bg-yellow-50/80 backdrop-blur border-2 border-yellow-200 rounded-xl">
        <p className="text-xs sm:text-sm text-gray-700 text-center leading-relaxed">
          ⚠️ 본 계산기는 평균 단가 기반의 간편 추정치입니다.<br />
          실제 고지서는 기본요금·누진제·부가세·전력산업기반기금 등으로 차이가 날 수 있어요.
        </p>
      </div>

      {/* 돌아가기 버튼 */}
      <div className="text-center mt-8">
        <Link 
          href="/" 
          className="inline-block px-8 py-4 bg-white/90 hover:bg-white border-2 border-gray-300 hover:border-gray-400 
                   text-gray-700 font-bold text-base rounded-xl shadow-lg hover:shadow-xl 
                   transform hover:scale-105 transition-all duration-200"
        >
          🏠 메인으로 돌아가기
        </Link>
      </div>

      {/* 제작자 서명 */}
      <AppFooter />

      {/* 단가 편집 모달 */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full max-w-md bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-2xl border-2 border-yellow-300 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-amber-900">
                💰 단가 편집
              </h3>
              <button
        type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 
                         rounded-full text-red-600 font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* 입력 필드 */}
            <div className="space-y-4 mb-6">
              {/* 가정용 */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border-2 border-yellow-200">
                <label className="block text-sm font-bold text-amber-800 mb-2">
                  🏠 가정용 (원/kWh)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={tempRates.res}
                  onChange={(e) => setTempRates({ ...tempRates, res: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border-2 border-yellow-300 rounded-xl 
                           text-gray-900 font-semibold focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50 
                           transition-all outline-none"
                />
              </div>

              {/* 상업용 */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border-2 border-yellow-200">
                <label className="block text-sm font-bold text-amber-800 mb-2">
                  🏢 상업용 (원/kWh)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={tempRates.comm}
                  onChange={(e) => setTempRates({ ...tempRates, comm: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border-2 border-yellow-300 rounded-xl 
                           text-gray-900 font-semibold focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50 
                           transition-all outline-none"
                />
              </div>

              {/* 농업용 */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border-2 border-yellow-200">
                <label className="block text-sm font-bold text-amber-800 mb-2">
                  🌾 농업용 (원/kWh)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={tempRates.agr}
                  onChange={(e) => setTempRates({ ...tempRates, agr: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border-2 border-yellow-300 rounded-xl 
                           text-gray-900 font-semibold focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50 
                           transition-all outline-none"
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
        type="button" 
                onClick={restoreDefaults}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl 
                         transition-all"
              >
                기본값 복원
              </button>
              <button
        type="button" 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 
                         font-bold rounded-xl transition-all"
              >
                취소
              </button>
              <button
        type="button" 
                onClick={saveRates}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 
                         hover:to-amber-600 text-gray-900 font-black rounded-xl shadow-lg hover:shadow-xl 
                         transform hover:scale-105 transition-all"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}

