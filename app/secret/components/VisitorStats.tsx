"use client";

import { useEffect, useState } from 'react';
import { Users, TrendingUp, Calendar, Globe, Eye } from 'lucide-react';

interface VisitorStatsData {
  totalUniqueVisitors: number;
  totalVisits: number;
  todayVisitors: number;
  weekVisitors: number;
  monthVisitors: number;
  lastVisitorTime: string | null;
}

interface DailyStat {
  date: string;
  unique: number;
  total: number;
}

interface CountryStat {
  country: string;
  count: number;
}

interface StatsResponse {
  success: boolean;
  stats: VisitorStatsData;
  dailyStats: DailyStat[];
  topCountries: CountryStat[];
}

export default function VisitorStats() {
  const [stats, setStats] = useState<VisitorStatsData | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topCountries, setTopCountries] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    // 30초마다 자동 갱신
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/secret/visitor-stats');
      const data: StatsResponse = await response.json();

      if (data.success) {
        setStats(data.stats);
        setDailyStats(data.dailyStats);
        setTopCountries(data.topCountries);
        setError(null);
      } else {
        setError('통계를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('통계 로딩 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white">통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 backdrop-blur-lg">
        <p className="text-center text-red-300">{error || '통계를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  const maxDailyVisitors = Math.max(...dailyStats.map(d => d.unique), 1);

  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="총 유니크 방문자"
          value={stats.totalUniqueVisitors}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          label="총 방문 횟수"
          value={stats.totalVisits}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          label="오늘 방문자"
          value={stats.todayVisitors}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="이번 주"
          value={stats.weekVisitors}
          color="from-orange-500 to-amber-500"
        />
        <StatCard
          icon={<Globe className="h-6 w-6" />}
          label="이번 달"
          value={stats.monthVisitors}
          color="from-indigo-500 to-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 일별 차트 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <h3 className="mb-4 text-lg font-bold text-white">📊 최근 7일 방문자</h3>
          <div className="space-y-3">
            {dailyStats.map((day, idx) => {
              const percentage = (day.unique / maxDailyVisitors) * 100;
              const date = new Date(day.date);
              const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{dateStr}</span>
                    <span className="font-mono text-white">
                      <span className="text-purple-300">{day.unique}</span>
                      <span className="text-white/50"> ({day.total})</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-white/50">
            숫자는 (유니크 방문자) (총 방문 횟수) 형식입니다
          </p>
        </div>

        {/* 국가별 통계 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <h3 className="mb-4 text-lg font-bold text-white">🌍 국가별 방문자</h3>
          {topCountries.length > 0 ? (
            <div className="space-y-3">
              {topCountries.map((country, idx) => {
                const maxCount = topCountries[0].count;
                const percentage = (country.count / maxCount) * 100;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">
                        {idx + 1}. {getCountryFlag(country.country)} {country.country}
                      </span>
                      <span className="font-mono text-purple-300">{country.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-white/50">아직 국가 데이터가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 마지막 방문 시간 */}
      {stats.lastVisitorTime && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-lg">
          <p className="text-sm text-white/70">
            마지막 방문:{' '}
            <span className="font-mono text-purple-300">
              {new Date(stats.lastVisitorTime).toLocaleString('ko-KR')}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg transition-all hover:border-white/30 hover:shadow-lg">
      <div className={`mb-2 inline-flex rounded-lg bg-gradient-to-r ${color} p-2 text-white`}>
        {icon}
      </div>
      <p className="mb-1 text-2xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-xs text-white/60">{label}</p>
    </div>
  );
}

// 국가 코드에서 플래그 이모지 가져오기
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
