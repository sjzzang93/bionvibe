"use client";

import { useEffect, useState } from 'react';

interface DashboardData {
  todayApps: number;
  weekVisitors: number;
  recentContacts: number;
  topApps: Array<{
    id: string;
    name: string;
    hidden: boolean;
  }>;
  stats: {
    totalApps: number;
    hiddenApps: number;
    visibleApps: number;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/secret/dashboard');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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
        <p className="text-center text-white/70">대시보드 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-8 backdrop-blur-lg">
      <h2 className="mb-6 text-3xl font-bold text-white flex items-center gap-3">
        <span>📊</span>
        <span>한눈에 보기</span>
      </h2>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* 오늘 추가된 앱 */}
        <div className="rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-6 transition-all hover:scale-105">
          <div className="text-4xl mb-2">🆕</div>
          <div className="text-3xl font-bold text-white mb-1">{data.todayApps}</div>
          <div className="text-sm text-white/70">오늘 추가된 앱</div>
        </div>

        {/* 이번 주 방문자 */}
        <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-6 transition-all hover:scale-105">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-3xl font-bold text-white mb-1">
            {data.weekVisitors.toLocaleString()}
          </div>
          <div className="text-sm text-white/70">이번 주 방문자</div>
        </div>

        {/* 최근 문의 */}
        <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 transition-all hover:scale-105">
          <div className="text-4xl mb-2">💬</div>
          <div className="text-3xl font-bold text-white mb-1">{data.recentContacts}</div>
          <div className="text-sm text-white/70">최근 문의 (7일)</div>
        </div>

        {/* 전체 앱 수 */}
        <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-6 transition-all hover:scale-105">
          <div className="text-4xl mb-2">📱</div>
          <div className="text-3xl font-bold text-white mb-1">{data.stats.totalApps}</div>
          <div className="text-sm text-white/70">전체 앱</div>
        </div>
      </div>

      {/* 앱 통계 바 */}
      <div className="rounded-xl bg-black/30 p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <span>📈</span>
          <span>앱 상태 분포</span>
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>공개 앱</span>
              <span>{data.stats.visibleApps}개 ({Math.round(data.stats.visibleApps / data.stats.totalApps * 100)}%)</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(data.stats.visibleApps / data.stats.totalApps) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>숨김 앱</span>
              <span>{data.stats.hiddenApps}개 ({Math.round(data.stats.hiddenApps / data.stats.totalApps * 100)}%)</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(data.stats.hiddenApps / data.stats.totalApps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
