'use client';

import { useState } from 'react';

export default function CarMaintenancePage() {
  const [carAge, setCarAge] = useState('5');
  const [mileage, setMileage] = useState('80000');
  const [fuelType, setFuelType] = useState('gasoline');
  const [monthlyMileage, setMonthlyMileage] = useState('1000');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const age = Number(carAge);
    const km = Number(mileage);
    const monthly = Number(monthlyMileage);
    
    // 2025년 기준 평균 비용
    const insurance = age <= 3 ? 1200000 : age <= 7 ? 900000 : 700000; // 자동차 보험료
    const tax = age <= 3 ? 400000 : age <= 10 ? 300000 : 200000; // 자동차세
    
    // 연료비 (휘발유 1600원/L, 경유 1400원/L, LPG 900원/L, 전기 300원/kWh)
    const fuelEfficiency: Record<string, number> = {
      gasoline: 12, // km/L
      diesel: 15,
      lpg: 10,
      electric: 5, // km/kWh
      hybrid: 18,
    };
    
    const fuelPrice: Record<string, number> = {
      gasoline: 1600,
      diesel: 1400,
      lpg: 900,
      electric: 300,
      hybrid: 1600,
    };
    
    const yearlyKm = monthly * 12;
    const fuelCost = (yearlyKm / fuelEfficiency[fuelType]) * fuelPrice[fuelType];
    
    // 정비/소모품 (주행거리 기반)
    const maintenance = km < 50000 ? 300000 : 
                       km < 100000 ? 600000 : 
                       km < 150000 ? 900000 : 1200000;
    
    // 감가상각 (신차가 3000만원 기준)
    const carPrice = 30000000;
    const depreciation = carPrice * (age < 1 ? 0.2 : age < 3 ? 0.15 : age < 5 ? 0.1 : 0.08);
    
    // 주차비 (월 10만원 가정)
    const parking = 1200000;
    
    // 기타 (세차, 통행료 등)
    const etc = 600000;
    
    const totalYearly = insurance + tax + fuelCost + maintenance + parking + etc;
    const totalMonthly = totalYearly / 12;
    
    // 10년 총 비용
    const total10Years = totalYearly * 10 + (depreciation * 10);

    setResult({
      insurance,
      tax,
      fuelCost,
      maintenance,
      depreciation,
      parking,
      etc,
      totalYearly,
      totalMonthly,
      total10Years,
    });
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'rgb(217, 217, 217)' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl text-black placeholder-gray-500">
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: topBannerHtml }} />

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-2 border-black text-black placeholder-gray-500">
          <header className="text-center mb-8 text-black placeholder-gray-500">
            <div className="text-5xl md:text-6xl mb-4 text-black placeholder-gray-500">🚗</div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 text-black placeholder-gray-500">
              자동차 유지비 계산기
            </h1>
            <p className="text-sm md:text-base text-gray-600 text-black placeholder-gray-500">
              보험료, 유류비, 세금, 감가상각 연식별 분석
            </p>
          </header>

          <div className="space-y-5 mb-8 text-black placeholder-gray-500">
            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">
                📅 차량 연식 (년)
              </label>
              <input
                type="number"
                value={carAge}
                onChange={(e) => setCarAge(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">
                🛣️ 현재 주행거리 (km)
              </label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">
                ⛽ 연료 종류
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-black"
              >
                <option value="gasoline">휘발유</option>
                <option value="diesel">경유</option>
                <option value="lpg">LPG</option>
                <option value="electric">전기</option>
                <option value="hybrid">하이브리드</option>
              </select>
            </div>

            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 text-black placeholder-gray-500">
                📏 월 평균 주행거리 (km)
              </label>
              <input
                type="number"
                value={monthlyMileage}
                onChange={(e) => setMonthlyMileage(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            💡 계산하기
          </button>

          {result && (
            <div className="mt-8 space-y-6 text-black placeholder-gray-500">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-300 text-black placeholder-gray-500">
                <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-black placeholder-gray-500">
                  💰 연간 유지비
                </h3>

                <div className="bg-white p-6 rounded-xl mb-4 text-center border-2 border-blue-200 text-black placeholder-gray-500">
                  <p className="text-sm text-gray-600 mb-2 text-black placeholder-gray-500">연간 총 유지비</p>
                  <p className="text-3xl md:text-4xl font-bold text-black text-black placeholder-gray-500">
                    {result.totalYearly.toLocaleString()}원
                  </p>
                  <p className="text-lg text-gray-500 mt-2 text-black placeholder-gray-500">
                    월 평균 {result.totalMonthly.toLocaleString()}원
                  </p>
                </div>

                <div className="space-y-3 text-black placeholder-gray-500">
                  <div className="flex justify-between p-3 bg-white rounded-lg text-black placeholder-gray-500">
                    <span className="text-gray-600 text-black placeholder-gray-500">🛡️ 자동차 보험료</span>
                    <span className="font-bold text-black placeholder-gray-500">{result.insurance.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white rounded-lg text-black placeholder-gray-500">
                    <span className="text-gray-600 text-black placeholder-gray-500">🏛️ 자동차세</span>
                    <span className="font-bold text-black placeholder-gray-500">{result.tax.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white rounded-lg text-black placeholder-gray-500">
                    <span className="text-gray-600 text-black placeholder-gray-500">⛽ 연료비</span>
                    <span className="font-bold text-black placeholder-gray-500">{result.fuelCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white rounded-lg text-black placeholder-gray-500">
                    <span className="text-gray-600 text-black placeholder-gray-500">🔧 정비/소모품</span>
                    <span className="font-bold text-black placeholder-gray-500">{result.maintenance.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white rounded-lg text-black placeholder-gray-500">
                    <span className="text-gray-600 text-black placeholder-gray-500">🅿️ 주차비</span>
                    <span className="font-bold text-black placeholder-gray-500">{result.parking.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white rounded-lg text-black placeholder-gray-500">
                    <span className="text-gray-600 text-black placeholder-gray-500">💸 기타 (세차/통행료)</span>
                    <span className="font-bold text-black placeholder-gray-500">{result.etc.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 text-black placeholder-gray-500">
                  <div className="flex justify-between text-black placeholder-gray-500">
                    <span className="font-bold text-gray-800 text-black placeholder-gray-500">📉 연간 감가상각</span>
                    <span className="font-bold text-black text-black placeholder-gray-500">
                      -{result.depreciation.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border-2 border-purple-300 text-black placeholder-gray-500">
                  <p className="text-center text-sm text-gray-600 mb-2 text-black placeholder-gray-500">10년 총 비용 (감가상각 포함)</p>
                  <p className="text-center text-2xl md:text-3xl font-bold text-black text-black placeholder-gray-500">
                    {result.total10Years.toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* 쿠팡 상품 추천 */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-orange-300 text-black placeholder-gray-500">
                <h3 className="text-lg md:text-xl font-bold text-black mb-4 text-center text-black placeholder-gray-500">
                  🚗 자동차 필수템
                </h3>
                <div className="space-y-3 text-black placeholder-gray-500">
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-400 transition-all"
                  >
                    <p className="font-bold text-gray-800 mb-1 text-black placeholder-gray-500">📹 블랙박스 (전후방 FHD)</p>
                    <p className="text-sm text-gray-600 text-black placeholder-gray-500">사고 대비 필수 아이템</p>
                    <span className="inline-block mt-2 text-black font-semibold text-sm text-black placeholder-gray-500">
                      구매하러 가기 →
                    </span>
                  </a>
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-400 transition-all"
                  >
                    <p className="font-bold text-gray-800 mb-1 text-black placeholder-gray-500">🧴 불스원샷 (연료첨가제)</p>
                    <p className="text-sm text-gray-600 text-black placeholder-gray-500">엔진 세정, 연비 개선</p>
                    <span className="inline-block mt-2 text-black font-semibold text-sm text-black placeholder-gray-500">
                      구매하러 가기 →
                    </span>
                  </a>
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-400 transition-all"
                  >
                    <p className="font-bold text-gray-800 mb-1 text-black placeholder-gray-500">🔦 LED 작업등 (비상용)</p>
                    <p className="text-sm text-gray-600 text-black placeholder-gray-500">야간 고장 시 필수</p>
                    <span className="inline-block mt-2 text-black font-semibold text-sm text-black placeholder-gray-500">
                      구매하러 가기 →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6" dangerouslySetInnerHTML={{ __html: bottomBannerHtml }} />
      </div>
    </main>
  );
}