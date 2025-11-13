"use client";

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';
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
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
        <AdOverlay />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="mx-auto max-w-[600px] px-4 py-6 relative z-10">
          <div className="mb-4">
            
          </div>

          <section className="bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border-2 border-white/30 relative"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(99, 102, 241, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.1)'
            }}>
            {/* Shimmering Overlay */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>

            <header className="text-center mb-6 sm:mb-8 relative">
              <h1 className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 animate-bounce-slow"
                style={{ textShadow: '0 0 20px rgba(99, 102, 241, 0.8)' }}>
                😴
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                수면 분석 결과
              </h2>
            </header>

            {/* 종합 점수 */}
            <div className={`relative mb-6 sm:mb-8 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-center border-4 backdrop-blur-xl hover:scale-105 transition-all duration-300 ${
              result.score >= 80 ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400/50' :
              result.score >= 60 ? 'bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border-yellow-400/50' :
              'bg-gradient-to-br from-red-500/30 to-rose-500/30 border-red-400/50'
            }`}
              style={{
                transform: 'perspective(1000px) translateZ(20px)',
                boxShadow: result.score >= 80 ? '0 20px 40px rgba(16, 185, 129, 0.4)' :
                          result.score >= 60 ? '0 20px 40px rgba(245, 158, 11, 0.4)' :
                          '0 20px 40px rgba(239, 68, 68, 0.4)'
              }}>
              <div className="text-5xl sm:text-6xl md:text-7xl font-black mb-3 sm:mb-4 animate-pulse" style={{
                background: result.score >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' :
                           result.score >= 60 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                           'linear-gradient(135deg, #ef4444, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.5)'
              }}>
                {result.score}점
              </div>
              <div className={`text-lg sm:text-xl md:text-2xl font-black px-4 py-2 rounded-full inline-block backdrop-blur-sm border-2 ${
                result.score >= 80 ? 'bg-green-500/50 border-green-300 text-green-100' :
                result.score >= 60 ? 'bg-yellow-500/50 border-yellow-300 text-yellow-100' :
                'bg-red-500/50 border-red-300 text-red-100'
              }`}
                style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}>
                {result.score >= 80 ? '훌륭한 수면!' :
                 result.score >= 60 ? '괜찮은 수면' :
                 '수면 개선 필요'}
              </div>
            </div>

            {/* 수면 정보 */}
            <div className="mb-6 sm:mb-8 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-white/30 text-center hover:scale-105 transition-all duration-300"
                style={{
                  transform: 'perspective(1000px) translateZ(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
                }}>
                <div className="text-xs sm:text-sm text-white/70 mb-2">총 수면 시간</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-cyan-200">{result.sleepHours}</div>
                <div className="text-xs sm:text-sm text-white/60 mt-1">시간</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-white/30 text-center hover:scale-105 transition-all duration-300"
                style={{
                  transform: 'perspective(1000px) translateZ(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
                }}>
                <div className="text-xs sm:text-sm text-white/70 mb-2">수면 사이클</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-pink-200">{result.cycles}</div>
                <div className="text-xs sm:text-sm text-white/60 mt-1">회 (90분/회)</div>
              </div>
            </div>

            {/* 수면 타입 */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">🦉 수면 타입</h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-200 mb-3">{result.sleepType}</div>
              <p className="text-sm sm:text-base text-white/80">{result.personality}</p>
            </div>

            {/* 상세 점수 분석 */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-slate-500/20 to-gray-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-4">📊 상세 점수 분석</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/30 hover:scale-110 transition-all">
                  <div className="text-xs text-white/70 mb-1">수면 시간</div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-blue-300">{result.detailedScores.duration}/25</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/30 hover:scale-110 transition-all">
                  <div className="text-xs text-white/70 mb-1">수면 품질</div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-green-300">{result.detailedScores.quality}/20</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/30 hover:scale-110 transition-all">
                  <div className="text-xs text-white/70 mb-1">잠들기 시간</div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-purple-300">{result.detailedScores.latency}/15</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/30 hover:scale-110 transition-all">
                  <div className="text-xs text-white/70 mb-1">야간 각성</div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-orange-300">{result.detailedScores.awakening}/15</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/30 hover:scale-110 transition-all">
                  <div className="text-xs text-white/70 mb-1">아침 기분</div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-yellow-300">{result.detailedScores.morning}/10</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/30 hover:scale-110 transition-all">
                  <div className="text-xs text-white/70 mb-1">주간 졸음</div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-red-300">{result.detailedScores.sleepiness}/10</div>
                </div>
              </div>
            </div>

            {/* 수면 효율성 */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">⚡ 수면 효율성</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm text-white/70">실제 수면 / 침상 시간</span>
                <span className="text-lg sm:text-xl md:text-2xl font-black text-emerald-200">{result.sleepEfficiency}%</span>
              </div>
              <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    result.sleepEfficiency >= 85 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                    result.sleepEfficiency >= 75 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${result.sleepEfficiency}%`, boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}
                />
              </div>
              <p className="text-xs sm:text-sm text-white/80 mt-3">
                {result.sleepEfficiency >= 85 ? '✅ 우수한 수면 효율성' :
                 result.sleepEfficiency >= 75 ? '👍 양호한 수면 효율성' :
                 '⚠️ 수면 효율성 개선 필요'}
              </p>
            </div>

            {/* 수면 단계 분석 */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-4">🧠 수면 단계 분석</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-white/70">깊은 수면 (Deep Sleep)</span>
                    <span className="font-black text-sm sm:text-base text-violet-200">{result.sleepStages.deep}시간</span>
                  </div>
                  <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3">
                    <div className="h-3 bg-gradient-to-r from-violet-400 to-violet-500 rounded-full" style={{ width: '20%', boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-white/70">REM 수면 (꿈)</span>
                    <span className="font-black text-sm sm:text-base text-purple-200">{result.sleepStages.rem}시간</span>
                  </div>
                  <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3">
                    <div className="h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" style={{ width: '23%', boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-white/70">얕은 수면 (Light Sleep)</span>
                    <span className="font-black text-sm sm:text-base text-indigo-200">{result.sleepStages.light}시간</span>
                  </div>
                  <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3">
                    <div className="h-3 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full" style={{ width: '57%', boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 건강 위험도 */}
            <div className={`mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 hover:scale-105 transition-all duration-300 ${
              result.riskLevel === 'low' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50' :
              result.riskLevel === 'low-medium' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50' :
              result.riskLevel === 'medium' ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/50' :
              result.riskLevel === 'medium-high' ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-400/50' :
              'bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-400/50'
            }`}
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">🏥 건강 위험도</h3>
              <p className={`font-black text-lg sm:text-xl md:text-2xl ${
                result.riskLevel === 'low' ? 'text-green-200' :
                result.riskLevel === 'low-medium' ? 'text-blue-200' :
                result.riskLevel === 'medium' ? 'text-yellow-200' :
                result.riskLevel === 'medium-high' ? 'text-orange-200' :
                'text-red-200'
              }`}>
                {result.healthRisk}
              </p>
              {result.riskLevel === 'high' && (
                <p className="text-sm sm:text-base text-red-200 mt-3 px-3 py-2 bg-red-500/30 rounded-lg">
                  ⚠️ 전문의 상담을 권장합니다
                </p>
              )}
            </div>

            {/* 수면 부채 */}
            <div className={`mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 hover:scale-105 transition-all duration-300 ${
              result.sleepDebt.includes('부족') ? 'bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-400/50' :
              result.sleepDebt.includes('과다') ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-400/50' :
              'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50'
            }`}
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">💤 수면 부채</h3>
              <p className={`font-black text-lg sm:text-xl md:text-2xl ${
                result.sleepDebt.includes('부족') ? 'text-red-200' :
                result.sleepDebt.includes('과다') ? 'text-orange-200' :
                'text-green-200'
              }`}>
                {result.sleepDebt}
              </p>
            </div>

            {/* 이상적인 기상 시간 */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-4">⏰ 추천 기상 시간</h3>
              <div className="space-y-2 sm:space-y-3">
                {result.idealWakeTime.map((time: string, i: number) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base font-bold text-green-200 border border-white/30 hover:scale-105 transition-all">
                    ⏰ {time}
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-3 sm:mt-4">💡 수면 사이클이 완료되는 시간에 일어나면 개운합니다</p>
            </div>

            {/* 조언 */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-4">💡 수면 개선 조언</h3>
              <div className="space-y-2 sm:space-y-3">
                {result.advice.map((adv: string, i: number) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-white/90 border border-white/30">
                    • {adv}
                  </div>
                ))}
              </div>
            </div>

            {/* 상세 개선 방안 */}
            {result.detailedAdvice.length > 0 && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
                style={{
                  transform: 'perspective(1000px) translateZ(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
                }}>
                <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-4">🎯 상세 개선 방안</h3>
                <div className="space-y-3">
                  {result.detailedAdvice.map((adv: string, i: number) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-white/90 border-l-4 border-amber-400">
                      <span className="font-bold text-amber-200">📋</span> {adv}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
        type="button"
              onClick={() => setResult(null)}
              className="group relative w-full max-w-md mx-auto py-4 sm:py-5 md:py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-black text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4), 0 0 60px rgba(168, 85, 247, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
              <span className="relative flex items-center justify-center gap-2 sm:gap-3 px-4">
                <span className="text-xl sm:text-2xl md:text-3xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span className="whitespace-nowrap">다시 분석하기</span>
                <span className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </button>
          </section>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          
          .animate-shimmer {
            animation: shimmer 3s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="mx-auto max-w-[600px] px-4 py-6 relative z-10">
        <div className="mb-4">
          
        </div>

        <section className="bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border-2 border-white/30 relative"
          style={{
            transform: 'perspective(1000px) rotateX(2deg)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(99, 102, 241, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.1)'
          }}>
          {/* Shimmering Overlay */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>

          <header className="text-center mb-6 sm:mb-8 relative">
            <h1 className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 animate-bounce-slow"
              style={{ textShadow: '0 0 20px rgba(99, 102, 241, 0.8)' }}>
              😴
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
              수면 패턴 분석기
            </h2>
            <p className="text-sm sm:text-base text-white/80">어제 수면을 분석하고 개선 방법을 찾아보세요</p>
          </header>

          <div className="space-y-5 sm:space-y-6 relative">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border-2 border-white/30 transition-all duration-300 group mb-8 sm:mb-10"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
                <div className="flex flex-col items-center">
                  <label className="block text-sm sm:text-base font-bold text-white mb-2 w-full text-center">🌙 취침 시간</label>
                  <input
                    type="time"
                    value={data.bedTime}
                    onChange={(e) => setData({...data, bedTime: e.target.value})}
                    className="w-full max-w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white font-bold text-center focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <label className="block text-sm sm:text-base font-bold text-white mb-2 w-full text-center">☀️ 기상 시간</label>
                  <input
                    type="time"
                    value={data.wakeTime}
                    onChange={(e) => setData({...data, wakeTime: e.target.value})}
                    className="w-full max-w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white font-bold text-center focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300">
              <label className="block text-sm sm:text-base font-bold text-white mb-3 flex items-center justify-between">
                <span>💤 수면 품질</span>
                <span className="text-xl sm:text-2xl text-cyan-300">{data.sleepQuality}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={data.sleepQuality}
                onChange={(e) => setData({...data, sleepQuality: Number(e.target.value)})}
                className="w-full h-3"
              />
              <div className="flex justify-between text-white/60 text-xs mt-2">
                <span>매우 나쁨</span>
                <span>완벽</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300">
              <label className="block text-sm sm:text-base font-bold text-white mb-3 flex items-center justify-between">
                <span>💭 꿈 빈도</span>
                <span className="text-xl sm:text-2xl text-pink-300">{data.dreamFrequency}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={data.dreamFrequency}
                onChange={(e) => setData({...data, dreamFrequency: Number(e.target.value)})}
                className="w-full h-3"
              />
              <div className="flex justify-between text-white/60 text-xs mt-2">
                <span>거의 없음</span>
                <span>매우 많음</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300">
              <label className="block text-sm sm:text-base font-bold text-white mb-3 flex items-center justify-between">
                <span>⏱️ 잠들기까지</span>
                <span className="text-xl sm:text-2xl text-teal-300">{data.sleepLatency}분</span>
              </label>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={data.sleepLatency}
                onChange={(e) => setData({...data, sleepLatency: Number(e.target.value)})}
                className="w-full h-3"
              />
              <div className="flex justify-between text-white/60 text-xs mt-2">
                <span>즉시 잠듦</span>
                <span>2시간 이상</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300">
              <label className="block text-sm sm:text-base font-bold text-white mb-3 flex items-center justify-between">
                <span>🔄 야간 각성</span>
                <span className="text-xl sm:text-2xl text-orange-300">{data.nightAwakenings}회</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={data.nightAwakenings}
                onChange={(e) => setData({...data, nightAwakenings: Number(e.target.value)})}
                className="w-full h-3"
              />
              <div className="flex justify-between text-white/60 text-xs mt-2">
                <span>한 번도 안 깸</span>
                <span>10회 이상</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300">
              <label className="block text-sm sm:text-base font-bold text-white mb-3 flex items-center justify-between">
                <span>😊 아침 기분</span>
                <span className="text-xl sm:text-2xl text-yellow-300">{data.morningMood}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={data.morningMood}
                onChange={(e) => setData({...data, morningMood: Number(e.target.value)})}
                className="w-full h-3"
              />
              <div className="flex justify-between text-white/60 text-xs mt-2">
                <span>매우 나쁨</span>
                <span>완벽</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300">
              <label className="block text-sm sm:text-base font-bold text-white mb-3 flex items-center justify-between">
                <span>😴 주간 졸음</span>
                <span className="text-xl sm:text-2xl text-rose-300">{data.daytimeSleepiness}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={data.daytimeSleepiness}
                onChange={(e) => setData({...data, daytimeSleepiness: Number(e.target.value)})}
                className="w-full h-3"
              />
              <div className="flex justify-between text-white/60 text-xs mt-2">
                <span>전혀 안 졸림</span>
                <span>매우 졸림</span>
              </div>
            </div>

            <button
        type="button"
              onClick={analyzeSleep}
              className="group relative w-full max-w-md mx-auto py-4 sm:py-5 md:py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-black text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4), 0 0 60px rgba(168, 85, 247, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
              <span className="relative flex items-center justify-center gap-2 sm:gap-3 px-4">
                <span className="text-xl sm:text-2xl md:text-3xl animate-pulse">😴</span>
                <span className="whitespace-nowrap">수면 분석하기</span>
                <span className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </button>
          </div>
        </section>
      </div>
      {/* 제작자 서명 */}
      {/* 관련 앱 추천 */}

      <RelatedApps currentAppSlug="sleep-analyzer" className="mt-8 mb-8" />
        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>




      <AppFooter />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
