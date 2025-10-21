"use client";

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
interface SleepData {
  bedTime: string;
  wakeTime: string;
  sleepQuality: number;
  dreamFrequency: number;
  sleepLatency: number; // 잠들기까지 걸린 시간 (분)
  nightAwakenings: number; // 야간 각성 횟수
  morningMood: number; // 아침 기분 (1-10)
  daytimeSleepiness: number; // 주간 졸음 (1-10)
}

export default function SleepAnalyzer() {
  const [data, setData] = useState<SleepData>({
    bedTime: '23:00',
    wakeTime: '07:00',
    sleepQuality: 5,
    dreamFrequency: 3,
    sleepLatency: 15,
    nightAwakenings: 1,
    morningMood: 6,
    daytimeSleepiness: 4
  });
  const [result, setResult] = useState<any>(null);

  const analyzeSleep = () => {
    const [bedHour, bedMin] = data.bedTime.split(':').map(Number);
    const [wakeHour, wakeMin] = data.wakeTime.split(':').map(Number);

    let sleepMinutes = (wakeHour * 60 + wakeMin) - (bedHour * 60 + bedMin);
    if (sleepMinutes < 0) sleepMinutes += 24 * 60;

    // 실제 수면 시간 (잠들기까지 걸린 시간 제외)
    const actualSleepMinutes = sleepMinutes - data.sleepLatency;
    const sleepHours = actualSleepMinutes / 60;
    const cycles = sleepHours / 1.5;
    const completeCycles = Math.floor(cycles);

    // 상세한 점수 계산 (각 지표별 가중치 적용)
    let totalScore = 0;
    const maxScore = 100;

    // 1. 수면 시간 점수 (25점 만점)
    let durationScore = 0;
    if (sleepHours >= 7 && sleepHours <= 8.5) durationScore = 25;
    else if (sleepHours >= 6.5 && sleepHours < 7) durationScore = 20;
    else if (sleepHours > 8.5 && sleepHours <= 9.5) durationScore = 20;
    else if (sleepHours >= 6 && sleepHours < 6.5) durationScore = 15;
    else if (sleepHours > 9.5 && sleepHours <= 10) durationScore = 15;
    else if (sleepHours >= 5 && sleepHours < 6) durationScore = 10;
    else if (sleepHours > 10) durationScore = 8;
    else durationScore = 5;

    // 2. 수면 품질 점수 (20점 만점)
    const qualityScore = (data.sleepQuality / 10) * 20;

    // 3. 잠들기 시간 점수 (15점 만점)
    let latencyScore = 0;
    if (data.sleepLatency <= 10) latencyScore = 15;
    else if (data.sleepLatency <= 20) latencyScore = 12;
    else if (data.sleepLatency <= 30) latencyScore = 8;
    else if (data.sleepLatency <= 45) latencyScore = 5;
    else latencyScore = 2;

    // 4. 야간 각성 점수 (15점 만점)
    let awakeningScore = 0;
    if (data.nightAwakenings === 0) awakeningScore = 15;
    else if (data.nightAwakenings === 1) awakeningScore = 12;
    else if (data.nightAwakenings === 2) awakeningScore = 8;
    else if (data.nightAwakenings === 3) awakeningScore = 5;
    else awakeningScore = 2;

    // 5. 아침 기분 점수 (10점 만점)
    const morningScore = (data.morningMood / 10) * 10;

    // 6. 주간 졸음 점수 (10점 만점) - 낮을수록 좋음
    const sleepinessScore = ((10 - data.daytimeSleepiness) / 10) * 10;

    // 7. 꿈 빈도 점수 (5점 만점) - 적당한 꿈이 건강
    let dreamScore = 0;
    if (data.dreamFrequency >= 3 && data.dreamFrequency <= 6) dreamScore = 5;
    else if (data.dreamFrequency >= 2 && data.dreamFrequency <= 7) dreamScore = 4;
    else if (data.dreamFrequency === 1 || data.dreamFrequency === 8) dreamScore = 3;
    else dreamScore = 2;

    totalScore = Math.round(durationScore + qualityScore + latencyScore + awakeningScore + morningScore + sleepinessScore + dreamScore);
    totalScore = Math.min(maxScore, Math.max(0, totalScore));

    // 수면 효율성 계산
    const sleepEfficiency = Math.round((actualSleepMinutes / sleepMinutes) * 100);

    // 수면 타입 분석 (더 상세하게)
    let sleepType = '';
    let personality = '';
    let chronotype = '';
    
    if (bedHour <= 21) {
      sleepType = '조조형 (Early Bird) 🐦';
      personality = '성실하고 규칙적, 아침에 최고의 컨디션';
      chronotype = 'Lark (종달새형)';
    } else if (bedHour >= 1) {
      sleepType = '올빼미형 (Night Owl) 🦉';
      personality = '창의적이고 자유로움, 밤에 집중력 폭발';
      chronotype = 'Owl (올빼미형)';
    } else {
      sleepType = '중간형 (Intermediate) 🦆';
      personality = '균형잡힌 생활, 적응력과 유연성 뛰어남';
      chronotype = 'Hummingbird (벌새형)';
    }

    // 수면 단계 분석
    const remSleep = Math.round(sleepHours * 0.23); // REM 수면 약 23%
    const deepSleep = Math.round(sleepHours * 0.20); // 깊은 수면 약 20%
    const lightSleep = Math.round(sleepHours * 0.57); // 얕은 수면 약 57%

    // 건강 위험도 분석
    let healthRisk = '';
    let riskLevel = '';
    
    if (totalScore >= 85) {
      healthRisk = '우수한 수면 건강';
      riskLevel = 'low';
    } else if (totalScore >= 70) {
      healthRisk = '양호한 수면 패턴';
      riskLevel = 'low-medium';
    } else if (totalScore >= 55) {
      healthRisk = '수면 개선 권장';
      riskLevel = 'medium';
    } else if (totalScore >= 40) {
      healthRisk = '수면 문제 주의';
      riskLevel = 'medium-high';
    } else {
      healthRisk = '수면 건강 위험';
      riskLevel = 'high';
    }

    // 개인화된 조언 생성
    const advice: string[] = [];
    const detailedAdvice: string[] = [];

    // 수면 시간 관련 조언
    if (sleepHours < 7) {
      advice.push('⚠️ 수면 시간 부족 - 만성 피로와 집중력 저하 위험');
      detailedAdvice.push('7-8시간 수면을 목표로 점진적으로 수면 시간 늘리기');
      detailedAdvice.push('주말 늦잠보다는 평일 규칙적인 수면 패턴 유지');
    } else if (sleepHours > 9.5) {
      advice.push('📈 수면 과다 - 우울증이나 수면 무호흡 의심');
      detailedAdvice.push('9시간 이내로 수면 시간 조절 필요');
      detailedAdvice.push('수면의 질을 높이는 것이 양보다 중요');
    } else {
      advice.push('✅ 적정 수면 시간 유지 중');
    }

    // 잠들기 시간 관련 조언
    if (data.sleepLatency > 30) {
      advice.push('🛌 잠들기 어려움 - 수면 위생 개선 필요');
      detailedAdvice.push('취침 1시간 전 스마트폰/태블릿 사용 금지');
      detailedAdvice.push('차가운 샤워나 가벼운 스트레칭으로 신체 온도 조절');
      detailedAdvice.push('베드타임 루틴 정착 (독서, 명상 등)');
    } else if (data.sleepLatency <= 10) {
      advice.push('💤 빠른 수면 유도 - 훌륭한 수면 위생');
    }

    // 야간 각성 관련 조언
    if (data.nightAwakenings > 2) {
      advice.push('🌙 빈번한 야간 각성 - 수면 연속성 저하');
      detailedAdvice.push('방 온도 18-20도 유지');
      detailedAdvice.push('방음 처리가나 이어플러그 사용 고려');
      detailedAdvice.push('취침 전 물 섭취량 줄이기');
    }

    // 수면 품질 관련 조언
    if (data.sleepQuality < 6) {
      advice.push('😴 수면 품질 개선 필요');
      detailedAdvice.push('규칙적인 운동 (취침 4시간 전)');
      detailedAdvice.push('카페인 섭취량 줄이기 (오후 2시 이후 금지)');
      detailedAdvice.push('어두운 침실 환경 조성');
    }

    // 아침 기분 관련 조언
    if (data.morningMood < 6) {
      advice.push('☀️ 아침 컨디션 개선 필요');
      detailedAdvice.push('일광등이나 자연광 노출로 각성 호르몬 활성화');
      detailedAdvice.push('아침 운동으로 혈액 순환 촉진');
      detailedAdvice.push('충분한 수분 섭취');
    }

    // 주간 졸음 관련 조언
    if (data.daytimeSleepiness > 6) {
      advice.push('😵 주간 과도한 졸음');
      detailedAdvice.push('20분 이내 짧은 낮잠 (파워납)');
      detailedAdvice.push('규칙적인 식사 시간 유지');
      detailedAdvice.push('충분한 수분 섭취와 가벼운 스트레칭');
    }

    setResult({
      sleepHours: sleepHours.toFixed(1),
      actualSleepHours: actualSleepMinutes / 60,
      cycles: completeCycles,
      sleepEfficiency,
      score: totalScore,
      sleepType,
      personality,
      chronotype,
      healthRisk,
      riskLevel,
      sleepStages: {
        rem: remSleep,
        deep: deepSleep,
        light: lightSleep
      },
      detailedScores: {
        duration: Math.round(durationScore),
        quality: Math.round(qualityScore),
        latency: Math.round(latencyScore),
        awakening: Math.round(awakeningScore),
        morning: Math.round(morningScore),
        sleepiness: Math.round(sleepinessScore),
        dream: Math.round(dreamScore)
      },
      advice,
      detailedAdvice,
      idealWakeTime: getIdealWakeTime(data.bedTime),
      sleepDebt: calculateSleepDebt(sleepHours)
    });
  };

  const getIdealWakeTime = (bedTime: string): string[] => {
    const [hour, min] = bedTime.split(':').map(Number);
    const bedMinutes = hour * 60 + min;
    
    const times: string[] = [];
    for (let cycle = 4; cycle <= 6; cycle++) {
      const wakeMinutes = (bedMinutes + cycle * 90) % (24 * 60);
      const wakeHour = Math.floor(wakeMinutes / 60);
      const wakeMin = wakeMinutes % 60;
      times.push(`${String(wakeHour).padStart(2, '0')}:${String(wakeMin).padStart(2, '0')} (${cycle}사이클)`);
    }
    return times;
  };

  const calculateSleepDebt = (hours: number): string => {
    const ideal = 7.5;
    const debt = ideal - hours;
    if (debt > 0) return `${debt.toFixed(1)}시간 수면 부족`;
    if (debt < -1.5) return `${Math.abs(debt).toFixed(1)}시간 과다`;
    return '적정 수면';
  };

  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 transition-colors">
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">😴</h1>
              <h2 className="text-2xl font-bold text-gray-800">수면 분석 결과</h2>
            </header>

            {/* 종합 점수 */}
            <div className={`mb-6 p-6 rounded-xl text-center border-4 ${
              result.score >= 80 ? 'bg-green-50 border-green-400' :
              result.score >= 60 ? 'bg-yellow-50 border-yellow-400' :
              'bg-red-50 border-red-400'
            }`}>
              <div className="text-6xl font-bold mb-2" style={{
                background: result.score >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' :
                           result.score >= 60 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                           'linear-gradient(135deg, #ef4444, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {result.score}점
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {result.score >= 80 ? '훌륭한 수면!' :
                 result.score >= 60 ? '괜찮은 수면' :
                 '수면 개선 필요'}
              </div>
            </div>

            {/* 수면 정보 */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200 text-center">
                <div className="text-sm text-gray-600 mb-1">총 수면 시간</div>
                <div className="text-3xl font-bold text-blue-700">{result.sleepHours}</div>
                <div className="text-xs text-gray-500">시간</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 text-center">
                <div className="text-sm text-gray-600 mb-1">수면 사이클</div>
                <div className="text-3xl font-bold text-purple-700">{result.cycles}</div>
                <div className="text-xs text-gray-500">회 (90분/회)</div>
              </div>
            </div>

            {/* 수면 타입 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <h3 className="font-bold text-lg text-gray-800 mb-2">🦉 수면 타입</h3>
              <div className="text-xl font-bold text-amber-700 mb-2">{result.sleepType}</div>
              <p className="text-gray-700 text-sm">{result.personality}</p>
            </div>

            {/* 상세 점수 분석 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">📊 상세 점수 분석</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">수면 시간</div>
                  <div className="text-lg font-bold text-blue-700">{result.detailedScores.duration}/25</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">수면 품질</div>
                  <div className="text-lg font-bold text-green-700">{result.detailedScores.quality}/20</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-purple-200">
                  <div className="text-xs text-gray-600 mb-1">잠들기 시간</div>
                  <div className="text-lg font-bold text-purple-700">{result.detailedScores.latency}/15</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-orange-200">
                  <div className="text-xs text-gray-600 mb-1">야간 각성</div>
                  <div className="text-lg font-bold text-orange-700">{result.detailedScores.awakening}/15</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-yellow-200">
                  <div className="text-xs text-gray-600 mb-1">아침 기분</div>
                  <div className="text-lg font-bold text-yellow-700">{result.detailedScores.morning}/10</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">주간 졸음</div>
                  <div className="text-lg font-bold text-red-700">{result.detailedScores.sleepiness}/10</div>
                </div>
              </div>
            </div>

            {/* 수면 효율성 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <h3 className="font-bold text-lg text-gray-800 mb-2">⚡ 수면 효율성</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">실제 수면 / 침상 시간</span>
                <span className="text-lg font-bold text-emerald-700">{result.sleepEfficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    result.sleepEfficiency >= 85 ? 'bg-emerald-500' :
                    result.sleepEfficiency >= 75 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${result.sleepEfficiency}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {result.sleepEfficiency >= 85 ? '우수한 수면 효율성' :
                 result.sleepEfficiency >= 75 ? '양호한 수면 효율성' :
                 '수면 효율성 개선 필요'}
              </p>
            </div>

            {/* 수면 단계 분석 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">🧠 수면 단계 분석</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">깊은 수면 (Deep Sleep)</span>
                  <span className="font-bold text-violet-700">{result.sleepStages.deep}시간</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-violet-500 rounded-full" style={{ width: '20%' }} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">REM 수면 (꿈)</span>
                  <span className="font-bold text-purple-700">{result.sleepStages.rem}시간</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: '23%' }} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">얕은 수면 (Light Sleep)</span>
                  <span className="font-bold text-indigo-700">{result.sleepStages.light}시간</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '57%' }} />
                </div>
              </div>
            </div>

            {/* 건강 위험도 */}
            <div className={`mb-6 p-4 rounded-lg border-2 ${
              result.riskLevel === 'low' ? 'bg-green-50 border-green-300' :
              result.riskLevel === 'low-medium' ? 'bg-blue-50 border-blue-300' :
              result.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-300' :
              result.riskLevel === 'medium-high' ? 'bg-orange-50 border-orange-300' :
              'bg-red-50 border-red-300'
            }`}>
              <h3 className="font-bold text-lg text-gray-800 mb-2">🏥 건강 위험도</h3>
              <p className={`font-semibold text-lg ${
                result.riskLevel === 'low' ? 'text-green-700' :
                result.riskLevel === 'low-medium' ? 'text-blue-700' :
                result.riskLevel === 'medium' ? 'text-yellow-700' :
                result.riskLevel === 'medium-high' ? 'text-orange-700' :
                'text-red-700'
              }`}>
                {result.healthRisk}
              </p>
              {result.riskLevel === 'high' && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ 전문의 상담을 권장합니다
                </p>
              )}
            </div>

            {/* 수면 부채 */}
            <div className={`mb-6 p-4 rounded-lg border-2 ${
              result.sleepDebt.includes('부족') ? 'bg-red-50 border-red-300' :
              result.sleepDebt.includes('과다') ? 'bg-orange-50 border-orange-300' :
              'bg-green-50 border-green-300'
            }`}>
              <h3 className="font-bold text-lg text-gray-800 mb-2">💤 수면 부채</h3>
              <p className={`font-semibold ${
                result.sleepDebt.includes('부족') ? 'text-red-700' :
                result.sleepDebt.includes('과다') ? 'text-orange-700' :
                'text-green-700'
              }`}>
                {result.sleepDebt}
              </p>
            </div>

            {/* 이상적인 기상 시간 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">⏰ 추천 기상 시간</h3>
              <div className="space-y-2">
                {result.idealWakeTime.map((time: string, i: number) => (
                  <div key={i} className="bg-white rounded p-3 text-sm font-semibold text-green-700">
                    {time}
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-700 mt-2">수면 사이클이 완료되는 시간에 일어나면 개운합니다</p>
            </div>

            {/* 조언 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">💡 수면 개선 조언</h3>
              <div className="space-y-2">
                {result.advice.map((adv: string, i: number) => (
                  <div key={i} className="bg-white rounded p-3 text-sm text-gray-700">
                    • {adv}
                  </div>
                ))}
              </div>
            </div>

            {/* 상세 개선 방안 */}
            {result.detailedAdvice.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 상세 개선 방안</h3>
                <div className="space-y-3">
                  {result.detailedAdvice.map((adv: string, i: number) => (
                    <div key={i} className="bg-white rounded-lg p-3 text-sm text-gray-700 border-l-4 border-amber-400">
                      <span className="font-medium text-amber-700">📋</span> {adv}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              다시 분석하기
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="mx-auto max-w-[600px] px-4 py-6">
        <div className="mb-4">
          
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-6">
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold text-indigo-700 mb-2">😴</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">수면 패턴 분석기</h2>
            <p className="text-gray-600">어제 수면을 분석하고 개선 방법을 찾아보세요</p>
          </header>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">취침 시간</label>
                <input
                  type="time"
                  value={data.bedTime}
                  onChange={(e) => setData({...data, bedTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기상 시간</label>
                <input
                  type="time"
                  value={data.wakeTime}
                  onChange={(e) => setData({...data, wakeTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수면 품질 (1-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.sleepQuality}
                  onChange={(e) => setData({...data, sleepQuality: Number(e.target.value)})}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-indigo-700 w-12 text-center">{data.sleepQuality}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>매우 나쁨</span>
                <span>완벽</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                꿈 빈도 (1-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.dreamFrequency}
                  onChange={(e) => setData({...data, dreamFrequency: Number(e.target.value)})}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-purple-700 w-12 text-center">{data.dreamFrequency}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>거의 없음</span>
                <span>매우 많음</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                잠들기까지 걸린 시간 (분)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={data.sleepLatency}
                  onChange={(e) => setData({...data, sleepLatency: Number(e.target.value)})}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-blue-700 w-16 text-center">{data.sleepLatency}분</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>즉시 잠듦</span>
                <span>2시간 이상</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                야간 각성 횟수
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={data.nightAwakenings}
                  onChange={(e) => setData({...data, nightAwakenings: Number(e.target.value)})}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-orange-700 w-12 text-center">{data.nightAwakenings}회</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>한 번도 안 깸</span>
                <span>10회 이상</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아침 기분 (1-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.morningMood}
                  onChange={(e) => setData({...data, morningMood: Number(e.target.value)})}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-yellow-700 w-12 text-center">{data.morningMood}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>매우 나쁨</span>
                <span>완벽</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주간 졸음 정도 (1-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.daytimeSleepiness}
                  onChange={(e) => setData({...data, daytimeSleepiness: Number(e.target.value)})}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-red-700 w-12 text-center">{data.daytimeSleepiness}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>전혀 안 졸림</span>
                <span>매우 졸림</span>
              </div>
            </div>

            <button
              onClick={analyzeSleep}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              수면 분석하기
            </button>
          </div>
        </section>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}
