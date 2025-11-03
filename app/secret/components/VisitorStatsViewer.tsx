"use client";

import { useEffect, useState } from 'react';

interface VisitorStats {
  totalUniqueVisitors: number;
  totalVisits: number;
  todayVisitors: number;
  weekVisitors: number;
  monthVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  avgVisitsPerUser: number;
  lastVisitorTime: string | null;
}

interface DailyStat {
  date: string;
  unique: number;
  total: number;
}

interface NamedStat {
  name: string;
  count: number;
}

interface RecentVisitor {
  ip: string;
  visitCount: number;
  lastVisit: string;
  browser: string;
  os: string;
  deviceType: string;
}

interface StatsData {
  stats: VisitorStats;
  dailyStats: DailyStat[];
  browserStats: NamedStat[];
  osStats: NamedStat[];
  deviceStats: NamedStat[];
  recentVisitors: RecentVisitor[];
}

export default function VisitorStatsViewer() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorStats();
  }, []);

  const fetchVisitorStats = async () => {
    try {
      const response = await fetch('/api/secret/visitor-stats');
      const result = await response.json();

      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch visitor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-center py-12">
          <div className="text-4xl animate-spin">📊</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
        <p className="text-center text-white/70">방문 통계를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const { stats, dailyStats, browserStats, osStats, deviceStats, recentVisitors } = data;

  // 최대값 계산 (차트용)
  const maxDailyVisitors = Math.max(...dailyStats.map(d => d.unique), 1);
  const returningRate = stats.totalUniqueVisitors > 0
    ? Math.round((stats.returningVisitors / stats.totalUniqueVisitors) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-8 backdrop-blur-lg">
        <h2 className="mb-6 text-3xl font-bold text-white flex items-center gap-3">
          <span>📊</span>
          <span>방문 통계 대시보드</span>
        </h2>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* 전체 방문자 */}
          <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-6 transition-all hover:scale-105">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalUniqueVisitors}
            </div>
            <div className="text-sm text-white/70">총 방문자</div>
          </div>

          {/* 총 방문 횟수 */}
          <div className="rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-6 transition-all hover:scale-105">
            <div className="text-4xl mb-2">🔢</div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalVisits.toLocaleString()}
            </div>
            <div className="text-sm text-white/70">총 방문 횟수</div>
          </div>

          {/* 평균 방문 */}
          <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 transition-all hover:scale-105">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.avgVisitsPerUser}
            </div>
            <div className="text-sm text-white/70">평균 방문 횟수</div>
          </div>

          {/* 재방문율 */}
          <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-6 transition-all hover:scale-105">
            <div className="text-4xl mb-2">🔄</div>
            <div className="text-3xl font-bold text-white mb-1">
              {returningRate}%
            </div>
            <div className="text-sm text-white/70">재방문율</div>
          </div>
        </div>

        {/* 신규 vs 재방문자 */}
        <div className="rounded-xl bg-black/30 p-6 mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>🆕</span>
            <span>신규 vs 재방문자</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>신규 방문자</span>
                <span>{stats.newVisitors}명</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.totalUniqueVisitors > 0 ? (stats.newVisitors / stats.totalUniqueVisitors) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>재방문자</span>
                <span>{stats.returningVisitors}명</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.totalUniqueVisitors > 0 ? (stats.returningVisitors / stats.totalUniqueVisitors) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 일별 방문자 추이 (최근 7일) */}
        <div className="rounded-xl bg-black/30 p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>📅</span>
            <span>일별 방문자 추이 (최근 7일)</span>
          </h3>
          <div className="space-y-3">
            {dailyStats.map((day) => (
              <div key={day.date}>
                <div className="flex justify-between text-sm text-white/80 mb-1">
                  <span>{new Date(day.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                  <span>{day.unique}명 (총 {day.total}회)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(day.unique / maxDailyVisitors) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 브라우저 & OS & 디바이스 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 브라우저 */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 backdrop-blur-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>🌐</span>
            <span>브라우저</span>
          </h3>
          <div className="space-y-3">
            {browserStats.map((browser, index) => (
              <div key={browser.name} className="flex items-center gap-3">
                <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-white/80 mb-1">
                    <span>{browser.name}</span>
                    <span>{browser.count}명</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{
                        width: `${(browser.count / stats.totalUniqueVisitors) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OS */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-6 backdrop-blur-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>💻</span>
            <span>운영체제</span>
          </h3>
          <div className="space-y-3">
            {osStats.map((os, index) => (
              <div key={os.name} className="flex items-center gap-3">
                <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-white/80 mb-1">
                    <span>{os.name}</span>
                    <span>{os.count}명</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${(os.count / stats.totalUniqueVisitors) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 디바이스 */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-6 backdrop-blur-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>📱</span>
            <span>디바이스</span>
          </h3>
          <div className="space-y-3">
            {deviceStats.map((device, index) => (
              <div key={device.name} className="flex items-center gap-3">
                <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-white/80 mb-1">
                    <span>{device.name}</span>
                    <span>{device.count}명</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{
                        width: `${(device.count / stats.totalUniqueVisitors) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 방문자 */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/40 to-slate-900/40 p-6 backdrop-blur-lg">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <span>🕐</span>
          <span>최근 방문자 (10명)</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/70 border-b border-white/10">
                <th className="text-left py-2 px-3">IP</th>
                <th className="text-left py-2 px-3">방문 횟수</th>
                <th className="text-left py-2 px-3">브라우저</th>
                <th className="text-left py-2 px-3">OS</th>
                <th className="text-left py-2 px-3">디바이스</th>
                <th className="text-left py-2 px-3">최근 방문</th>
              </tr>
            </thead>
            <tbody>
              {recentVisitors.map((visitor, index) => (
                <tr key={index} className="text-white/90 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 font-mono text-xs">{visitor.ip}</td>
                  <td className="py-2 px-3">{visitor.visitCount}회</td>
                  <td className="py-2 px-3">{visitor.browser}</td>
                  <td className="py-2 px-3">{visitor.os}</td>
                  <td className="py-2 px-3">{visitor.deviceType}</td>
                  <td className="py-2 px-3 text-xs">
                    {new Date(visitor.lastVisit).toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
