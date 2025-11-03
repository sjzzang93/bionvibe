'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface App {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image: string;
  url: string;
}

interface RelatedAppsProps {
  currentAppSlug: string;
  className?: string;
}

export default function RelatedApps({ currentAppSlug, className }: RelatedAppsProps) {
  const [relatedApps, setRelatedApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedApps() {
      try {
        // apps.json에서 데이터 가져오기
        const response = await fetch('/data/apps.json');
        const data = await response.json();

        // 현재 앱 찾기
        const currentApp = data.apps.find((app: App) => app.slug === currentAppSlug);
        if (!currentApp) {
          setLoading(false);
          return;
        }

        // 현재 앱의 relatedApps에 해당하는 앱들 필터링
        const relatedAppIds = currentApp.relatedApps || [];
        const apps = data.apps.filter((app: App) =>
          relatedAppIds.includes(app.id) && app.slug !== currentAppSlug
        );

        // 최대 4개만 표시
        setRelatedApps(apps.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch related apps:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedApps();
  }, [currentAppSlug]);

  if (loading) {
    return null;
  }

  if (relatedApps.length === 0) {
    return null;
  }

  return (
    <div className={`mt-12 border-t border-gray-200 dark:border-gray-700 pt-12 ${className || ''}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        추천 웹앱
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedApps.map((app) => (
          <Link
            key={app.id}
            href={app.url}
            className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={app.image}
                alt={app.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 text-3xl">
                {app.icon}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                {app.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {app.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
