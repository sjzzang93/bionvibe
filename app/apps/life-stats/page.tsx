"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

export default function LifeStats() {
  const [birthdate, setBirthdate] = useState('');
  const [stats, setStats] = useState<any>(null);

  const calculateStats = () => {
    if (!birthdate) {
      alert('생년월일을 입력해주세요!');
      return;
    }

    const birth = new Date(birthdate);
    const now = new Date();
    const diffMs = now.getTime() - birth.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30.44);
    const diffYear = Math.floor(diffDay / 365.25);

    // 심장 박동수 (평균 분당 72회)
    const heartbeats = diffMin * 72;

    // 호흡 횟수 (평균 분당 16회)
    const breaths = diffMin * 16;

    // 수면 시간 (하루 평균 8시간)
    const sleepHours = diffDay * 8;
    const sleepDays = Math.floor(sleepHours / 24);
    const sleepYears = (sleepDays / 365.25).toFixed(1);

    // 식사 횟수 (하루 3끼)
    const meals = diffDay * 3;

    // 웃은 횟수 (하루 평균 20회)
    const laughs = diffDay * 20;

    // 걸음 수 (하루 평균 6000보)
    const steps = diffDay * 6000;
    const km = (steps * 0.0007).toFixed(1); // 1보 = 0.7m

    // 물 마신 양 (하루 평균 2L)
    const waterLiters = diffDay * 2;

    // 다음 생일까지
    let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) {
      nextBirthday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.floor((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // 평균 수명 80세 기준 남은 일
    const expectedDays = Math.floor(80 * 365.25);
    const remainingDays = expectedDays - diffDay;
    const lifePercentage = ((diffDay / expectedDays) * 100).toFixed(1);

    setStats({
      years: diffYear,
      months: diffMonth,
      weeks: diffWeek,
      days: diffDay.toLocaleString(),
      hours: diffHour.toLocaleString(),
      minutes: diffMin.toLocaleString(),
      seconds: diffSec.toLocaleString(),
      heartbeats: heartbeats.toLocaleString(),
      breaths: breaths.toLocaleString(),
      sleepDays: sleepDays.toLocaleString(),
      sleepYears,
      meals: meals.toLocaleString(),
      laughs: laughs.toLocaleString(),
      steps: steps.toLocaleString(),
      km,
      waterLiters: waterLiters.toLocaleString(),
      daysUntilBirthday,
      remainingDays: remainingDays.toLocaleString(),
      lifePercentage,
      nextBirthday: nextBirthday.toLocaleDateString('ko-KR')
    });
  };

  return (
    <PremiumLayout theme="blue">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            📊 내 인생 통계
          </h1>
          <p className="text-xl text-white/80">태어난 순간부터 지금까지 모든 것을 숫자로</p>
        </div>

        {/* 입력 폼 */}
        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-6 text-center">🎂 생년월일 입력</h3>

          <div className="mb-6">
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-lg text-black text-lg font-bold"
              style={{ fontSize: '16px' }}
            />
          </div>

          <PremiumButton
            onClick={calculateStats}
            variant="primary"
            size="lg"
            icon="🔍"
            fullWidth
          >
            내 인생 통계 보기
          </PremiumButton>
        </PremiumCard>

        {/* 결과 */}
        {stats && (
          <div className="space-y-6 animate-fadeIn">
            {/* 인생 진행률 */}
            <PremiumCard hover gradient>
              <div className="text-center mb-6">
                <h3 className="text-white text-2xl font-bold mb-4">⏳ 인생 진행률 (80세 기준)</h3>
                <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  {stats.lifePercentage}%
                </div>
                <div className="w-full bg-white/20 rounded-full h-6 mb-4">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-6 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.lifePercentage}%` }}
                  />
                </div>
                <p className="text-white/80">
                  앞으로 약 <span className="text-yellow-300 font-bold">{stats.remainingDays}일</span> 남았어요
                </p>
              </div>
            </PremiumCard>

            {/* 기본 시간 통계 */}
            <div>
              <h3 className="text-white text-2xl font-bold mb-4 text-center">⏰ 살아온 시간</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <StatCard icon="📅" label="년" value={stats.years} color="from-blue-400 to-blue-600" />
                <StatCard icon="📆" label="개월" value={stats.months} color="from-cyan-400 to-cyan-600" />
                <StatCard icon="🗓️" label="주" value={stats.weeks} color="from-teal-400 to-teal-600" />
                <StatCard icon="☀️" label="일" value={stats.days} color="from-green-400 to-green-600" />
                <StatCard icon="⏱️" label="시간" value={stats.hours} color="from-yellow-400 to-yellow-600" />
                <StatCard icon="⏳" label="분" value={stats.minutes} color="from-orange-400 to-orange-600" />
                <StatCard icon="⚡" label="초" value={stats.seconds} color="from-red-400 to-red-600" />
                <StatCard icon="🎂" label="다음 생일" value={`${stats.daysUntilBirthday}일`} color="from-pink-400 to-pink-600" />
              </div>
            </div>

            {/* 신체 활동 통계 */}
            <div>
              <h3 className="text-white text-2xl font-bold mb-4 text-center">❤️ 신체 활동</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCardLarge
                  icon="💓"
                  label="심장 박동"
                  value={stats.heartbeats}
                  subtitle="분당 72회 기준"
                  color="from-red-500 to-pink-500"
                />
                <StatCardLarge
                  icon="🌬️"
                  label="호흡 횟수"
                  value={stats.breaths}
                  subtitle="분당 16회 기준"
                  color="from-cyan-500 to-blue-500"
                />
                <StatCardLarge
                  icon="🚶"
                  label="걸은 걸음"
                  value={stats.steps}
                  subtitle={`약 ${stats.km}km (지구 ${(parseFloat(stats.km) / 40075).toFixed(1)}바퀴)`}
                  color="from-green-500 to-emerald-500"
                />
                <StatCardLarge
                  icon="💧"
                  label="마신 물"
                  value={`${stats.waterLiters}L`}
                  subtitle="하루 2L 기준"
                  color="from-blue-500 to-indigo-500"
                />
              </div>
            </div>

            {/* 일상 생활 통계 */}
            <div>
              <h3 className="text-white text-2xl font-bold mb-4 text-center">🏠 일상 생활</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCardLarge
                  icon="😴"
                  label="잠잔 시간"
                  value={`${stats.sleepDays}일`}
                  subtitle={`약 ${stats.sleepYears}년`}
                  color="from-indigo-500 to-purple-500"
                />
                <StatCardLarge
                  icon="🍽️"
                  label="먹은 식사"
                  value={stats.meals}
                  subtitle="하루 3끼 기준"
                  color="from-orange-500 to-red-500"
                />
                <StatCardLarge
                  icon="😄"
                  label="웃은 횟수"
                  value={stats.laughs}
                  subtitle="하루 20회 기준"
                  color="from-yellow-500 to-orange-500"
                />
              </div>
            </div>

            {/* 재미있는 사실 */}
            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">💡 재미있는 사실</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌍</span>
                  <p>당신이 태어난 이후 지구는 태양 주위를 {stats.years}번 돌았습니다</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💤</span>
                  <p>인생의 약 33%를 잠으로 보냈어요 ({stats.sleepYears}년)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🫀</span>
                  <p>심장은 쉬지 않고 {stats.heartbeats}번 뛰었습니다</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎂</span>
                  <p>다음 생일까지 {stats.daysUntilBirthday}일 남았어요! ({stats.nextBirthday})</p>
                </div>
              </div>
            </PremiumCard>
          </div>
        )}

        {/* Related Apps */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="life-stats" className="mt-8" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
    </PremiumLayout>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <PremiumCard hover>
      <div className="text-center">
        <div className="text-3xl mb-2">{icon}</div>
        <div className={`text-3xl font-bold mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}
        </div>
        <div className="text-white/70 text-sm">{label}</div>
      </div>
    </PremiumCard>
  );
}

function StatCardLarge({ icon, label, value, subtitle, color }: { icon: string; label: string; value: string; subtitle: string; color: string }) {
  return (
    <PremiumCard hover>
      <div className="text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <div className="text-white font-bold text-lg mb-2">{label}</div>
        <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}
        </div>
        <div className="text-white/70 text-xs">{subtitle}</div>
      </div>
    </PremiumCard>
  );
}
