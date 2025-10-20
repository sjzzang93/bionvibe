'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PhoneUsageAnalyzerPage() {
  const [dailyHours, setDailyHours] = useState('');
  const [socialMediaHours, setSocialMediaHours] = useState('');
  const [gamesHours, setGamesHours] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    const daily = parseFloat(dailyHours) || 0;
    const social = parseFloat(socialMediaHours) || 0;
    const games = parseFloat(gamesHours) || 0;

    const weeklyTotal = daily * 7;
    const monthlyTotal = daily * 30;
    const yearlyTotal = daily * 365;

    let level = '';
    let color = '';
    if (daily < 2) {
      level = '매우 건강';
      color = 'green';
    } else if (daily < 4) {
      level = '양호';
      color = 'blue';
    } else if (daily < 6) {
      level = '주의';
      color = 'yellow';
    } else if (daily < 8) {
      level = '경고';
      color = 'orange';
    } else {
      level = '위험';
      color = 'red';
    }

    const recommendations = [
      daily > 6 && '스크린 타임을 줄이기 위해 앱 사용 제한을 설정하세요',
      social > 2 && 'SNS 사용 시간을 줄이고 오프라인 활동을 늘리세요',
      games > 2 && '게임 시간을 제한하고 다른 취미를 찾아보세요',
      '30분마다 화면에서 눈을 떼고 먼 곳을 바라보세요',
      '잠자기 1시간 전에는 스마트폰 사용을 자제하세요',
    ].filter(Boolean);

    setResult({
      daily,
      weeklyTotal,
      monthlyTotal,
      yearlyTotal,
      level,
      color,
      recommendations,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
          📱 스마트폰 사용시간 분석
        </h1>
        <p className="text-center text-purple-100 mb-12">당신의 스마트폰 중독도는?</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
          <div>
            <label className="text-white font-bold mb-2 block">하루 평균 사용 시간 (시간)</label>
            <input
              type="number"
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              placeholder="예: 5"
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div>
            <label className="text-white font-bold mb-2 block">SNS 사용 시간 (시간)</label>
            <input
              type="number"
              value={socialMediaHours}
              onChange={(e) => setSocialMediaHours(e.target.value)}
              placeholder="예: 2"
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div>
            <label className="text-white font-bold mb-2 block">게임 사용 시간 (시간)</label>
            <input
              type="number"
              value={gamesHours}
              onChange={(e) => setGamesHours(e.target.value)}
              placeholder="예: 1"
              className="w-full px-4 py-3 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all"
          >
            분석하기
          </button>

          {result && (
            <div className="space-y-4 pt-6">
              <div className={`bg-${result.color}-500 rounded-xl p-6 text-white text-center`}>
                <div className="text-6xl mb-4">📱</div>
                <div className="text-2xl font-bold mb-2">중독도: {result.level}</div>
                <div className="text-lg">하루 {result.daily}시간 사용</div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">누적 사용 시간</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">주간:</span>
                    <span className="font-bold text-purple-600">{result.weeklyTotal.toFixed(1)}시간</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">월간:</span>
                    <span className="font-bold text-purple-600">{result.monthlyTotal.toFixed(1)}시간 ({Math.round(result.monthlyTotal / 24)}일)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">연간:</span>
                    <span className="font-bold text-red-600">{result.yearlyTotal.toFixed(0)}시간 ({Math.round(result.yearlyTotal / 24)}일)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <h4 className="font-bold mb-3 text-lg">💡 개선 방법</h4>
                <ul className="space-y-2 text-sm">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

