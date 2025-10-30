"use client";

import { Sparkles, ExternalLink } from 'lucide-react';
import { App } from '@/lib/getApps';
import TrackedAppCard from './TrackedAppCard';

interface RecentAppsProps {
  apps: App[];
}

export default function RecentApps({ apps }: RecentAppsProps) {
  // createdAt 기준으로 정렬하여 최근 6개 가져오기
  const recentApps = [...apps]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">최근 추가된 앱</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentApps.map((app) => {
          const daysAgo = Math.floor((Date.now() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60 * 24));
          const isNew = daysAgo <= 3;

          return (
            <TrackedAppCard
              key={app.id}
              appId={app.id}
              href={app.url}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 border-2 border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {/* NEW 배지 */}
              {isNew && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
                  NEW
                </div>
              )}

              {/* 앱 아이콘 */}
              <div className="text-5xl mb-4">{app.icon}</div>

              {/* 앱 정보 */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                {app.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                {app.description}
              </p>

              {/* 추가 날짜 */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {daysAgo === 0 ? '오늘 추가' : `${daysAgo}일 전`}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </TrackedAppCard>
          );
        })}
      </div>
    </section>
  );
}
