"use client";

import { useState, useEffect } from 'react';

interface AirQualityData {
  pm10: number;
  pm25: number;
  o3: number;
  no2: number;
  co: number;
  so2: number;
  grade: string;
  location: string;
}

const getAQIGrade = (pm25: number): { grade: string; color: string; advice: string; emoji: string } => {
  if (pm25 <= 15) return { grade: '최고', color: 'blue', advice: '야외 활동하기 완벽한 날입니다!', emoji: '😊' };
  if (pm25 <= 35) return { grade: '좋음', color: 'green', advice: '야외 활동해도 좋습니다', emoji: '🙂' };
  if (pm25 <= 75) return { grade: '보통', color: 'yellow', advice: '민감군은 주의하세요', emoji: '😐' };
  if (pm25 <= 150) return { grade: '나쁨', color: 'orange', advice: '실외 활동 자제, 마스크 착용', emoji: '😷' };
  return { grade: '매우나쁨', color: 'red', advice: '외출 자제, KF94 마스크 필수', emoji: '😨' };
};

export default function AirQuality() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AirQualityData | null>(null);
  const [error, setError] = useState('');

  const measureAirQuality = () => {
    setLoading(true);
    setError('');

    // 위치 정보 가져오기
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // 실제로는 공공 API 사용하지만, 여기서는 시뮬레이션
          setTimeout(() => {
            const mockData: AirQualityData = {
              pm10: 30 + Math.floor(Math.random() * 50),
              pm25: 15 + Math.floor(Math.random() * 40),
              o3: 0.02 + Math.random() * 0.05,
              no2: 0.01 + Math.random() * 0.03,
              co: 0.3 + Math.random() * 0.5,
              so2: 0.001 + Math.random() * 0.005,
              grade: '',
              location: `위도 ${latitude.toFixed(4)}, 경도 ${longitude.toFixed(4)}`
            };

            const gradeInfo = getAQIGrade(mockData.pm25);
            mockData.grade = gradeInfo.grade;

            setData(mockData);
            setLoading(false);
          }, 1500);
        },
        (err) => {
          setError('위치 정보 접근 권한이 필요합니다.');
          setLoading(false);
        }
      );
    } else {
      setError('이 기기는 위치 서비스를 지원하지 않습니다.');
      setLoading(false);
    }
  };

  if (data) {
    const gradeInfo = getAQIGrade(data.pm25);

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="mx-auto max-w-[600px] px-4 py-6">

          <section className="bg-white rounded-2xl shadow-xl p-6 border border-cyan-200">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">🌫️</h1>
              <h2 className="text-2xl font-bold text-gray-800">실시간 공기질 측정</h2>
              <p className="text-sm text-gray-600 mt-2">{data.location}</p>
            </header>

            {/* 종합 등급 */}
            <div className={`mb-6 p-6 rounded-xl text-center border-4 ${
              gradeInfo.color === 'blue' ? 'bg-blue-50 border-blue-400' :
              gradeInfo.color === 'green' ? 'bg-green-50 border-green-400' :
              gradeInfo.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' :
              gradeInfo.color === 'orange' ? 'bg-orange-50 border-orange-400' :
              'bg-red-50 border-red-400'
            }`}>
              <div className="text-6xl mb-3">{gradeInfo.emoji}</div>
              <div className="text-4xl font-bold mb-2" style={{
                background: gradeInfo.color === 'green' ? 'linear-gradient(135deg, #10b981, #059669)' :
                           gradeInfo.color === 'blue' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
                           gradeInfo.color === 'yellow' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                           gradeInfo.color === 'orange' ? 'linear-gradient(135deg, #f97316, #ea580c)' :
                           'linear-gradient(135deg, #ef4444, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {gradeInfo.grade}
              </div>
              <p className={`font-semibold ${
                gradeInfo.color === 'green' || gradeInfo.color === 'blue' ? 'text-gray-700' : 
                gradeInfo.color === 'yellow' ? 'text-black' :
                gradeInfo.color === 'orange' ? 'text-black' :
                'text-black'
              }`}>
                {gradeInfo.advice}
              </p>
            </div>

            {/* 상세 측정값 */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">📊 상세 측정값</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-gray-600 mb-1">미세먼지 PM10</div>
                  <div className="text-2xl font-bold text-black">{data.pm10}</div>
                  <div className="text-xs text-gray-500">㎍/㎥</div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-lg p-4 border border-red-200">
                  <div className="text-sm text-gray-600 mb-1">초미세먼지 PM2.5</div>
                  <div className="text-2xl font-bold text-black">{data.pm25}</div>
                  <div className="text-xs text-gray-500">㎍/㎥</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">오존 O₃</div>
                  <div className="text-2xl font-bold text-black">{data.o3.toFixed(3)}</div>
                  <div className="text-xs text-gray-500">ppm</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-gray-600 mb-1">이산화질소 NO₂</div>
                  <div className="text-2xl font-bold text-black">{data.no2.toFixed(3)}</div>
                  <div className="text-xs text-gray-500">ppm</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                  <div className="text-sm text-gray-600 mb-1">일산화탄소 CO</div>
                  <div className="text-2xl font-bold text-black">{data.co.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">ppm</div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                  <div className="text-sm text-gray-600 mb-1">아황산가스 SO₂</div>
                  <div className="text-2xl font-bold text-black">{data.so2.toFixed(4)}</div>
                  <div className="text-xs text-gray-500">ppm</div>
                </div>
              </div>
            </div>

            {/* 건강 조언 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">💡 건강 조언</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• {gradeInfo.grade === '최고' || gradeInfo.grade === '좋음' ? '마스크 없이 활동 가능' : 'KF94 마스크 착용 권장'}</li>
                <li>• {data.pm25 > 75 ? '실내 공기청정기 가동' : '창문을 열어 환기'}</li>
                <li>• {data.pm25 > 50 ? '노약자, 어린이 외출 자제' : '야외 운동 가능'}</li>
                <li>• {data.o3 > 0.06 ? '오존 농도 높음 - 오후 외출 주의' : '오존 농도 정상'}</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setData(null);
                measureAirQuality();
              }}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              다시 측정하기
            </button>
          </section>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="mx-auto max-w-[600px] px-4 py-6">

        <section className="bg-white rounded-2xl shadow-xl p-6 border border-cyan-200">
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold text-black mb-2">🌫️</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">실시간 공기질 측정기</h2>
            <p className="text-gray-600">현재 위치의 미세먼지와 대기 오염도를 확인하세요</p>
          </header>

          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg border border-cyan-300">
            <h3 className="font-bold text-black mb-3">📍 측정 항목</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-black">
              <div>✓ 미세먼지 (PM10)</div>
              <div>✓ 초미세먼지 (PM2.5)</div>
              <div>✓ 오존 (O₃)</div>
              <div>✓ 이산화질소 (NO₂)</div>
              <div>✓ 일산화탄소 (CO)</div>
              <div>✓ 아황산가스 (SO₂)</div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h3 className="font-bold text-black mb-2">🏥 건강 효과</h3>
            <ul className="text-sm text-black space-y-1">
              <li>• PM2.5는 폐까지 침투하여 심혈관 질환 유발</li>
              <li>• 오존은 호흡기 자극, 천식 악화</li>
              <li>• 측정 후 맞춤 건강 조언 제공</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-black font-semibold">{error}</p>
              <p className="text-sm text-black mt-2">설정 → 개인정보보호 → 위치 서비스 활성화</p>
            </div>
          )}

          {!loading ? (
            <button
              onClick={measureAirQuality}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              📍 내 위치 공기질 측정
            </button>
          ) : (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-600 border-t-transparent mb-4"></div>
              <p className="text-black font-semibold">현재 위치 공기질 측정 중...</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

