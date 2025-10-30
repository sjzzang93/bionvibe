"use client";

import { Users, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsSectionProps {
  totalApps: number;
}

export default function StatsSection({ totalApps }: StatsSectionProps) {
  const [todayActiveUsers, setTodayActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 방문자 통계 조회
        const visitResponse = await fetch('/api/track-page-view');
        const visitResult = await visitResponse.json();

        if (visitResult.success && visitResult.data) {
          setTodayActiveUsers(visitResult.data.todayActiveUsers); // 오늘 활성 사용자 (재방문 포함)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 총 앱 개수 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 border-2 border-amber-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">전체 앱</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{totalApps}개</p>
            </div>
          </div>
        </div>

        {/* 오늘 활성 사용자 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 border-2 border-blue-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">오늘 활성 사용자</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {loading ? '...' : todayActiveUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
