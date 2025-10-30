"use client";

import { TrendingUp, ExternalLink, Eye } from 'lucide-react';
import { App } from '@/lib/getApps';
import { useEffect, useState } from 'react';
import TrackedAppCard from './TrackedAppCard';

interface PopularAppsProps {
  apps: App[];
}

interface AppView {
  app_id: string;
  view_count: number;
}

export default function PopularApps({ apps }: PopularAppsProps) {
  const [popularApps, setPopularApps] = useState<(App & { viewCount?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularApps = async () => {
      try {
        const response = await fetch('/api/track-view');
        const { data } = await response.json();

        if (data && data.length > 0) {
          // 조회수 데이터와 앱 데이터 매칭
          const viewsMap = new Map<string, number>();
          data.forEach((view: AppView) => {
            viewsMap.set(view.app_id, view.view_count);
          });

          // 앱에 조회수 추가하고 정렬
          const appsWithViews = apps.map(app => ({
            ...app,
            viewCount: viewsMap.get(app.id) || 0
          }));

          // 조회수 기준으로 정렬
          const sorted = appsWithViews.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
          setPopularApps(sorted.slice(0, 5));
        } else {
          // 조회수 데이터가 없으면 최근 앱 기준
          setPopularApps(apps.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch popular apps:', error);
        // 에러 시 최근 앱 기준
        setPopularApps(apps.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchPopularApps();
  }, [apps]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">인기 앱 로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">실시간 인기 앱 TOP 5</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {popularApps.map((app, index) => (
          <TrackedAppCard
            key={app.id}
            appId={app.id}
            href={app.url}
            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-5 border-2 border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            {/* 순위 배지 */}
            <div className={`
              absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg
              ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                'bg-gradient-to-br from-blue-400 to-blue-600'}
            `}>
              {index + 1}
            </div>

            {/* 앱 정보 */}
            <div className="flex flex-col items-center text-center gap-2 mt-2">
              <span className="text-5xl">{app.icon}</span>
              <div className="flex-1 min-w-0 w-full">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug mb-2">
                  {app.description}
                </p>
                {/* 조회수 표시 */}
                {app.viewCount !== undefined && app.viewCount > 0 && (
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    <span>{app.viewCount.toLocaleString()} views</span>
                  </div>
                )}
              </div>
            </div>

            {/* 바로가기 아이콘 */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
          </TrackedAppCard>
        ))}
      </div>
    </section>
  );
}
