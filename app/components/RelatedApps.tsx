'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, memo } from 'react';

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

// 메모이제이션된 앱 카드 컴포넌트
const AppCard = memo(({ app }: { app: App }) => (
  <Link
    key={app.id}
    href={app.url}
    prefetch={true}
    className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="relative h-32 overflow-hidden">
      <Image
        src={app.image}
        alt={app.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
        quality={75}
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
));

AppCard.displayName = 'AppCard';

function RelatedApps({ currentAppSlug, className }: RelatedAppsProps) {
  const [relatedApps, setRelatedApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRelatedApps() {
      try {
        // API 엔드포인트 사용으로 변경 (더 빠름)
        const response = await fetch(`/api/apps/related?slug=${currentAppSlug}`, {
          next: { revalidate: 3600 } // 1시간 캐시
        });

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await response.json();

        if (isMounted) {
          setRelatedApps(data.relatedApps?.slice(0, 4) || []);
        }
      } catch (error) {
        console.error('Failed to fetch related apps:', error);
        // Fallback: 로컬 JSON 사용
        try {
          const response = await fetch('/data/apps.json');
          const data = await response.json();

          const currentApp = data.apps.find((app: App) => app.slug === currentAppSlug);
          if (currentApp && isMounted) {
            const relatedAppIds = currentApp.relatedApps || [];
            const apps = data.apps.filter((app: App) =>
              relatedAppIds.includes(app.id) && app.slug !== currentAppSlug
            );
            setRelatedApps(apps.slice(0, 4));
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRelatedApps();

    return () => {
      isMounted = false;
    };
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
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

// 메모이제이션 적용
export default memo(RelatedApps);
