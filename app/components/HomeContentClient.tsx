'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { App, Category } from '@/lib/getApps';
import { useSupabase } from '@/lib/supabase-provider';

import { applyCuratedApps } from './homeContentUtils';
import FavoriteButton from './FavoriteButton';
import AdSlot from './AdSlot';

const HOME_CONTENT_MID_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID;
const RECENT_UPDATES = [
  {
    date: '2025-11-13',
    title: '애드센스 승인 완료 🎉',
    description: '모든 빌드 오류를 수정하고, In-Article 광고를 포함한 AdSense 광고를 95개 앱 페이지에 통합했습니다.',
  },
  {
    date: '2025-10-26',
    title: '광고 안전성 점검',
    description: '애드센스 재심사를 위해 홈 구조와 광고 슬롯을 전면 개편했어요.',
  },
  {
    date: '2025-10-19',
    title: '운세·금융 추천 강화',
    description: '오늘의 운세, 전기요금 등 인기 앱에 가이드와 FAQ를 추가했습니다.',
  },
];

type HomeContentClientProps = {
  initialApps: App[];
  categories: Category[];
};

export default function HomeContentClient({ initialApps, categories }: HomeContentClientProps) {
  const supabase = useSupabase();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [allApps, setAllApps] = useState<App[]>(() => applyCuratedApps(initialApps));
  const [loading, setLoading] = useState(initialApps.length === 0);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const { getAllAppsAsync } = await import('@/lib/getApps');
        const apps = await getAllAppsAsync(false, false);
        if (apps.length > 0) {
          setAllApps(applyCuratedApps(apps));
        }
      } catch (error) {
        console.error('Failed to load apps:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApps();

    if (!supabase) {
      return;
    }

    const channel = supabase
      .channel('apps-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'apps',
        },
        async () => {
          try {
            const { getAllAppsAsync } = await import('@/lib/getApps');
            const apps = await getAllAppsAsync(false, true);
            setAllApps(applyCuratedApps(apps));
          } catch (error) {
            console.error('❌ 실시간 업데이트 실패:', error);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (!mounted || allApps.length === 0 || favoritesLoaded) return;

    const saved = localStorage.getItem('favorite-apps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        const validFavorites = parsed.filter((id) => allApps.some((app) => app.id === id));
        setFavorites(validFavorites);

        if (parsed.length !== validFavorites.length) {
          localStorage.setItem('favorite-apps', JSON.stringify(validFavorites));
        }
      } catch (error) {
        console.error('❌ 즐겨찾기 불러오기 실패:', error);
        localStorage.removeItem('favorite-apps');
      }
    }

    setFavoritesLoaded(true);
  }, [mounted, allApps, favoritesLoaded]);

  useEffect(() => {
    if (!mounted) return;

    const savedScrollPos = sessionStorage.getItem('homeScrollPosition');
    if (savedScrollPos) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPos, 10));
        sessionStorage.removeItem('homeScrollPosition');
      }, 100);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const saveScrollPosition = () => {
      sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href) {
        saveScrollPosition();
      }
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
      document.removeEventListener('click', handleClick);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !favoritesLoaded) return;

    try {
      localStorage.setItem('favorite-apps', JSON.stringify(favorites));
    } catch (error) {
      console.error('❌ 즐겨찾기 저장 실패:', error);
    }
  }, [favorites, mounted, favoritesLoaded]);

  const toggleFavorite = (appId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId],
    );
  };

  const handleImageError = (appId: string) => {
    setFailedImages((prev) => new Set(prev).add(appId));
  };

  const favoriteApps = useMemo(
    () => allApps.filter((app) => favorites.includes(app.id)),
    [allApps, favorites],
  );

  const otherApps = useMemo(
    () => allApps.filter((app) => !favorites.includes(app.id)),
    [allApps, favorites],
  );

  const appsByCategory = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          apps: otherApps.filter((app) => app.categoryId === category.id),
        }))
        .filter((category) => category.apps.length > 0),
    [categories, otherApps],
  );

  const shouldShowLoader = loading && allApps.length === 0;

  if (shouldShowLoader) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="w-[85.7%] mx-auto">
          <div className="text-center py-20">
            <div className="text-6xl mb-6 animate-float">🍂</div>
            <p className="text-amber-600 dark:text-amber-300">따뜻한 가을을 준비 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="w-[85.7%] mx-auto space-y-14">
        <div className="relative overflow-hidden rounded-3xl border border-amber-100/80 bg-gradient-to-br from-[#fff3df] via-[#ffe5c7] to-[#ffd9b8] p-8 shadow-xl ring-1 ring-amber-200/50 dark:border-amber-500/30 dark:from-[#2a1b14] dark:via-[#24140f] dark:to-[#1d100b] dark:shadow-none dark:ring-amber-500/20">
          <span aria-hidden className="absolute -top-6 left-8 text-5xl opacity-70 animate-float">
            🍁
          </span>
          <span
            aria-hidden
            className="absolute bottom-10 right-12 text-4xl opacity-60 animate-float [animation-delay:800ms]"
          >
            🍂
          </span>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-40 dark:opacity-20"
            style={{
              backgroundImage: "url('/autumn-texture.svg')",
              backgroundRepeat: 'repeat',
              backgroundSize: '320px 160px',
            }}
          />
          <div className="relative z-10 space-y-4 sm:space-y-5">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-amber-950 dark:text-amber-100">
              <Image
                src="/logo.png"
                alt="BION 비온 로고"
                width={32}
                height={32}
                className="h-8 w-8 rounded-xl bg-white/70 p-1 shadow-md backdrop-blur"
              />
              <span>BION 비온</span>
            </h2>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm backdrop-blur dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200">
              <span className="text-xl" aria-hidden>
                🍂
              </span>
              <span>가을엔 따뜻한 일상을 더해요</span>
            </div>
            <p className="text-lg text-amber-900/90 dark:text-amber-200/90">
              선선한 바람과 함께, 비온이 고른 신뢰도 높은 생활 도구를 만나보세요.
            </p>
            <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              검증된 유틸리티와 일상 정보를 한곳에서 큐레이션하고, 계절에 맞춘 인터페이스로 편안한 탐색
              경험을 제공합니다. 광고 위치와 정책도 수시로 점검해 안전한 홈을 유지하고 있어요.
            </p>
            <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              즐겨찾기와 맞춤 큐레이션으로 필요한 도구를 바로 찾고, 방해받지 않는 광고 경험과 함께
              집중력을 지켜보세요.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-100/80 bg-white/85 p-6 shadow-md ring-1 ring-amber-100/40 backdrop-blur-sm dark:border-amber-500/20 dark:bg-gray-900/70 dark:ring-amber-500/20">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4">
            최근 업데이트
          </h3>
          <ol className="space-y-4">
            {RECENT_UPDATES.map((item) => (
              <li
                key={item.date}
                className="relative pl-6 text-sm text-amber-900/80 dark:text-amber-200/80"
              >
                <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-300" />
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  {item.title}
                </p>
                <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mb-1">
                  {item.date}
                </p>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <AdSlot
          slotId={HOME_CONTENT_MID_SLOT}
          label="BION 추천 광고"
          minHeight={300}
          className="border-amber-200/70 bg-gradient-to-r from-white/70 via-[#fff3e9]/80 to-white/70 backdrop-blur shadow-lg ring-1 ring-amber-200/50 border-dashed dark:border-amber-500/30 dark:from-gray-900/60 dark:via-gray-900/80 dark:to-gray-900/60 dark:ring-amber-500/30"
        />

        {allApps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-200 mb-4">
              차근차근 만들어가는 중입니다
            </h3>
            <p className="text-amber-600 dark:text-amber-300">
              곧 멋진 웹앱들로 채워질 예정입니다
            </p>
          </div>
        ) : (
          <>
            {favoriteApps.length > 0 && (
              <div className="mb-12">
                <div className="sticky top-16 z-20 flex items-center gap-3 mb-6 py-4 bg-[#fff4e9]/95 backdrop-blur-md border-b border-amber-200/70 -mx-4 px-4 sm:-mx-6 sm:px-6 shadow-sm dark:bg-gray-900/90 dark:border-amber-500/20">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-rose-400">
                    ❤️ 주로 쓰는 앱
                  </h3>
                  <span className="text-sm text-amber-700/80 font-medium dark:text-amber-300">
                    {favoriteApps.length}개
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                  {favoriteApps.map((app) => (
                    <Link
                      key={app.id}
                      href={app.url}
                      className="group relative overflow-hidden rounded-none border-2 border-amber-200/80 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg dark:border-amber-500/30 dark:bg-gray-900/80 dark:hover:border-amber-400"
                    >
                      <FavoriteButton
                        appId={app.id}
                        onToggle={toggleFavorite}
                        isFavorite
                      />

                      {app.image && app.image.trim() !== '' && !failedImages.has(app.id) ? (
                        <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden">
                          <Image
                            src={app.image}
                            alt={app.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                            unoptimized
                            onError={() => handleImageError(app.id)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        </div>
                      ) : (
                        <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                          <span className="text-4xl sm:text-5xl">{app.icon}</span>
                        </div>
                      )}

                      <div className="p-2 sm:p-3 flex flex-col items-center text-center">
                        <h4 className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                          {app.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 text-right text-xs font-medium text-amber-700/70 dark:text-amber-300/70">
                  즐겨찾기는 브라우저에 안전하게 저장돼요.
                </div>
              </div>
            )}

            {appsByCategory.map((category, categoryIndex) => (
              <div key={category.id} className="mb-14 space-y-6">
                <div className="sticky top-16 z-20 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 mb-2 py-4 bg-[#fff6ed]/90 backdrop-blur-md border-b border-amber-200/70 -mx-4 px-4 sm:-mx-6 sm:px-6 shadow-sm dark:bg-gray-900/90 dark:border-amber-500/20">
                  <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">{category.name}</h3>
                  <span className="text-sm text-amber-700/80 font-medium dark:text-amber-300">
                    {category.apps.length}개
                  </span>
                  <p className="text-sm text-amber-700/70 dark:text-amber-300/80">
                    {category.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                  {category.apps.map((app, appIndex) => (
                    <Link
                      key={app.id}
                      href={app.url}
                      className="group relative overflow-hidden rounded-none border border-amber-100/80 bg-white/85 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg dark:border-amber-500/20 dark:bg-gray-900/80 dark:hover:border-amber-400"
                    >
                      <FavoriteButton
                        appId={app.id}
                        onToggle={toggleFavorite}
                        isFavorite={false}
                      />

                      {app.image && app.image.trim() !== '' && !failedImages.has(app.id) ? (
                        <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden">
                          <Image
                            src={app.image}
                            alt={app.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            priority={categoryIndex === 0 && appIndex < 4 && favoriteApps.length === 0}
                            loading={
                              categoryIndex === 0 && appIndex < 4 && favoriteApps.length === 0
                                ? undefined
                                : 'lazy'
                            }
                            unoptimized
                            onError={() => handleImageError(app.id)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        </div>
                      ) : (
                        <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                          <span className="text-4xl sm:text-5xl">{app.icon}</span>
                        </div>
                      )}

                      <div className="p-2 sm:p-3 flex flex-col items-center text-center">
                        <h4 className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                          {app.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-amber-100/80 bg-gradient-to-r from-white via-[#fff4e9] to-white p-6 shadow-md ring-1 ring-amber-100/40 dark:border-amber-500/20 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900 dark:ring-amber-500/20">
              <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3">
                BION과 함께하는 방법
              </h3>
              <ul className="space-y-2 text-sm text-amber-800/80 dark:text-amber-200/80">
                <li>• 즐겨찾기로 자주 쓰는 도구를 모아두면 더욱 편리해요.</li>
                <li>• 신규 앱은 매주 업데이트됩니다. 홈 상단에서 안내해드릴게요.</li>
                <li>• 제안하고 싶은 기능이 있다면 Contact 페이지에서 알려주세요.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
