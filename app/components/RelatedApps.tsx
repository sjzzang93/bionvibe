'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface App {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  url: string;
  image?: string;
}

interface RelatedAppsProps {
  relatedAppIds: string[];
  currentAppId: string;
}

export default function RelatedApps({ relatedAppIds, currentAppId }: RelatedAppsProps) {
  const [relatedApps, setRelatedApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedApps = async () => {
      try {
        const response = await fetch('/data/apps.json');
        const data = await response.json();
        const apps = data.apps as App[];
        
        // relatedAppIds에 해당하는 앱들 필터링
        const related = apps.filter(app => 
          relatedAppIds.includes(app.id) && app.id !== currentAppId
        );
        
        setRelatedApps(related);
      } catch (error) {
        console.error('Failed to load related apps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedApps();
  }, [relatedAppIds, currentAppId]);

  if (loading || relatedApps.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span>🔗</span>
        <span>이런 앱도 함께 해보세요!</span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedApps.map(app => (
          <Link
            key={app.id}
            href={app.url}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            {/* 배경 이미지 */}
            {app.image && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ backgroundImage: `url(${app.image})` }}
              />
            )}
            
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-500/10 group-hover:to-indigo-500/20 transition-all" />
            
            {/* 콘텐츠 */}
            <div className="relative p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{app.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {app.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {app.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>바로가기</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

