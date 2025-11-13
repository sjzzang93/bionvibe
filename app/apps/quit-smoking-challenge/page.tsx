'use client';

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';
import { QUIT_SMOKING_DATA } from '@/lib/group1-data';

import RelatedApps from '@/app/components/RelatedApps';
export default function QuitSmokingChallenge() {
  const [mounted, setMounted] = useState(false);
  const [quitDate, setQuitDate] = useState('');
  const [dailyCigarettes, setDailyCigarettes] = useState(10);
  const [pricePerPack, setPricePerPack] = useState(4500);
  const [showResult, setShowResult] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [cigarettesAvoided, setCigarettesAvoided] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculate = () => {
    if (!quitDate) {
      alert('금연 시작일을 입력해주세요!');
      return;
    }

    const start = new Date(quitDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const mins = Math.floor(diffMs / 60000);

    setElapsedMinutes(mins);

    // 절약한 돈 계산
    const days = mins / 1440;
    const packsAvoided = (days * dailyCigarettes) / 20;
    const saved = Math.floor(packsAvoided * pricePerPack);
    setMoneySaved(saved);

    // 피우지 않은 담배 개수
    const avoided = Math.floor(days * dailyCigarettes);
    setCigarettesAvoided(avoided);

    setShowResult(true);
  };

  // 경과 시간에 맞는 마일스톤 찾기
  const getCurrentMilestone = () => {
    return QUIT_SMOKING_DATA.healthMilestones.find(m => m.minutes <= elapsedMinutes && m.minutes >= elapsedMinutes - 10080) || QUIT_SMOKING_DATA.healthMilestones[0];
  };

  // 다음 마일스톤 찾기
  const getNextMilestone = () => {
    return QUIT_SMOKING_DATA.healthMilestones.find(m => m.minutes > elapsedMinutes);
  };

  // 경과 일수
  const elapsedDays = Math.floor(elapsedMinutes / 1440);

  // 동기부여 메시지
  const getMessage = () => {
    const msg = QUIT_SMOKING_DATA.motivationalMessages.find(m => m.day === elapsedDays);
    return msg || QUIT_SMOKING_DATA.motivationalMessages[0];
  };

  // 하이드레이션 에러 방지: 클라이언트에서만 렌더링
  if (!mounted) {
    return (
      <PremiumLayout theme="green">
        
        <AdOverlay /><div className="py-8 px-2 sm:px-4 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">⏳</div>
                <p className="text-white/80">로딩 중...</p>
              </div>
            </div>
          </div>
        </div>
      </PremiumLayout>
    );
  }

  return (
    <PremiumLayout theme="green">
      <div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          <PremiumHeader 
            icon="🚭"
            title="금연 챌린지"
            subtitle="건강한 삶을 위한 첫 걸음을 축하합니다"
            gradient="from-green-200 via-emerald-200 to-teal-200"
          />

          {!showResult ? (
            <PremiumCard className="max-w-2xl mx-auto" gradient>
              <div className="space-y-6">
                <div>
                  <label className="text-white font-bold mb-2 block text-base sm:text-lg">📅 금연 시작일</label>
                  <input
                    type="datetime-local"
                    value={quitDate}
                    onChange={(e) => setQuitDate(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-gray-900 text-sm sm:text-base border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-white font-bold mb-2 block text-base sm:text-lg">
                    🚬 하루 평균 흡연량: <span className="text-green-200">{dailyCigarettes}개비</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={dailyCigarettes}
                    onChange={(e) => setDailyCigarettes(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-400"
                  />
                  <div className="flex justify-between text-white/60 text-xs mt-1">
                    <span>1개비</span>
                    <span>40개비</span>
                  </div>
                </div>

                <div>
                  <label className="text-white font-bold mb-2 block text-base sm:text-lg">
                    💰 담배 한 갑 가격: <span className="text-green-200">{pricePerPack.toLocaleString()}원</span>
                  </label>
                  <input
                    type="range"
                    min="3000"
                    max="6000"
                    step="500"
                    value={pricePerPack}
                    onChange={(e) => setPricePerPack(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-400"
                  />
                  <div className="flex justify-between text-white/60 text-xs mt-1">
                    <span>3,000원</span>
                    <span>6,000원</span>
                  </div>
                </div>

                <PremiumButton
                  onClick={calculate}
                  fullWidth
                  size="lg"
                  variant="success"
                >
                  🚭 분석하기
                </PremiumButton>
              </div>
            </PremiumCard>
          ) : (
            <div className="space-y-6">
              {/* 메인 결과 */}
              <PremiumCard gradient className="text-center">
                <div className="text-8xl mb-6 animate-bounce-slow">🎉</div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  금연 {elapsedDays}일 차
                </h3>
                <p className="text-white/80 text-xl mb-8">
                  {elapsedMinutes.toLocaleString()}분 동안 담배를 참았습니다!
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  <div className="bg-white/20 rounded sm:rounded-lg md:rounded-2xl p-6">
                    <div className="text-base sm:text-2xl md:text-4xl mb-2">💰</div>
                    <div className="text-white/70 text-sm mb-1">절약한 금액</div>
                    <div className="text-3xl font-black text-green-200">
                      {moneySaved.toLocaleString()}원
                    </div>
                  </div>
                  <div className="bg-white/20 rounded sm:rounded-lg md:rounded-2xl p-6">
                    <div className="text-base sm:text-2xl md:text-4xl mb-2">🚭</div>
                    <div className="text-white/70 text-sm mb-1">피우지 않은 담배</div>
                    <div className="text-3xl font-black text-blue-200">
                      {cigarettesAvoided}개비
                    </div>
                  </div>
                  <div className="bg-white/20 rounded sm:rounded-lg md:rounded-2xl p-6">
                    <div className="text-base sm:text-2xl md:text-4xl mb-2">⏱️</div>
                    <div className="text-white/70 text-sm mb-1">경과 시간</div>
                    <div className="text-3xl font-black text-yellow-200">
                      {elapsedDays}일
                    </div>
                  </div>
                </div>
              </PremiumCard>

              {/* 현재 마일스톤 */}
              {getCurrentMilestone() && (
                <PremiumCard>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-4xl">{getCurrentMilestone().icon}</span>
                    현재 건강 상태
                  </h3>
                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-white mb-2">{getCurrentMilestone().title}</h4>
                    <p className="text-white/80">{getCurrentMilestone().description}</p>
                  </div>
                </PremiumCard>
              )}

              {/* 다음 마일스톤 */}
              {getNextMilestone() && (
                <PremiumCard>
                  <h3 className="text-2xl font-bold text-white mb-4">🎯 다음 목표</h3>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-2">
                      <div className="text-5xl">{getNextMilestone()!.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">{getNextMilestone()!.title}</h4>
                        <p className="text-white/80 mb-2">{getNextMilestone()!.description}</p>
                        <p className="text-green-300 font-bold">
                          {Math.floor((getNextMilestone()!.minutes - elapsedMinutes) / 1440)}일 후
                        </p>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              )}

              {/* 동기부여 메시지 */}
              <PremiumCard className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">💪 오늘의 격려</h3>
                <p className="text-xl text-white mb-4">{getMessage().message}</p>
                <p className="text-white/80">{getMessage().tip}</p>
              </PremiumCard>

              {/* 금단 증상 대처법 */}
              <PremiumCard>
                <h3 className="text-2xl font-bold text-white mb-4">🛠️ 금단 증상 대처법</h3>
                <div className="space-y-4">
                  {QUIT_SMOKING_DATA.withdrawalSymptoms.slice(0, 3).map((symptom, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
                      <h4 className="text-lg font-bold text-white mb-2">
                        {symptom.symptom} <span className={`text-sm px-2 py-1 rounded ${
                          symptom.severity === '심각' ? 'bg-red-500' : 
                          symptom.severity === '보통' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>{symptom.severity}</span>
                      </h4>
                      <p className="text-white/70 text-sm mb-2">지속기간: {symptom.duration}</p>
                      <ul className="space-y-1">
                        {symptom.copingStrategies.slice(0, 3).map((strategy, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                            <span className="text-green-300">✓</span>
                            <span>{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </PremiumCard>

              <PremiumButton
                onClick={() => setShowResult(false)}
                fullWidth
                size="lg"
                variant="secondary"
              >
                🔄 다시 계산하기
              </PremiumButton>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}

