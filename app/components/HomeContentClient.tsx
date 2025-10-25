'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { App, Category } from '@/lib/getApps';
import { useSupabase } from '@/lib/supabase-provider';

import { applyCuratedApps } from './homeContentUtils';
import FavoriteButton from './FavoriteButton';
import AdSlot from './AdSlot';
import GuestbookHeart from './GuestbookHeart';

const HOME_CONTENT_MID_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID;
const RECENT_UPDATES = [
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
  {
    date: '2025-10-12',
    title: '홈 즐겨찾기 출시',
    description: '즐겨찾기 보관함과 다크모드를 정식 오픈했습니다.',
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="w-[85.7%] mx-auto">
          <div className="text-center py-20">
            <div className="text-6xl mb-6 animate-pulse">⏳</div>
            <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="w-[85.7%] mx-auto space-y-12">
        <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-white to-amber-50 p-8 shadow-lg dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:shadow-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="BION 비온 로고"
              width={32}
              height={32}
              className="h-8 w-8 drop-shadow-md"
            />
            <span>BION 비온</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            일상에 비온을 더해보세요
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            신뢰할 수 있는 일상 정보와 검증된 유틸리티를 한곳에서 만나세요. 깔끔한 레이아웃과 사용자 취향에 맞춘 콘텐츠로 안전한 광고 환경을 지향합니다. 하루에도 여러 번 콘텐츠 품질과 노출 위치를 점검해 광고주 정책과 이용자 기대에 모두 부합하도록 관리하고 있어요.
          </p>
          <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            즐겨찾기와 맞춤 큐레이션 기능으로 필요한 도구를 바로 찾고, 방해받지 않는 광고 경험을 유지하세요. 비온 팀은 투명한 공지와 빠른 업데이트로 믿을 수 있는 라이프스타일 허브를 만들어 가고 있습니다.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            최근 업데이트
          </h3>
          <ol className="space-y-4">
            {RECENT_UPDATES.map((item) => (
              <li key={item.date} className="relative pl-6 text-sm text-gray-700 dark:text-gray-300">
                <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-red-500 dark:bg-red-400" />
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.date}</p>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <AdSlot
          slotId={HOME_CONTENT_MID_SLOT}
          label="BION 추천 광고"
          minHeight={300}
          className="bg-transparent border-dashed"
        />

        {allApps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              차근차근 만들어가는 중입니다
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              곧 멋진 웹앱들로 채워질 예정입니다
            </p>
          </div>
        ) : (
          <>
            {favoriteApps.length > 0 && (
              <div className="mb-12">
                <div className="sticky top-16 z-20 flex items-center gap-3 mb-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 -mx-4 px-4 sm:-mx-6 sm:px-6 shadow-sm">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                    ❤️ 주로 쓰는 앱
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {favoriteApps.length}개
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                  {favoriteApps.map((app, index) => (
                    <Link
                      key={app.id}
                      href={app.url}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600"
                    >
                      <FavoriteButton
                        appId={app.id}
                        onToggle={toggleFavorite}
                        isFavorite
                      />

                      {app.image && app.image.trim() !== '' && (
                        <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden">
                          <Image
                            src={app.image}
                            alt={app.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            priority={index < 4}
                            loading={index < 4 ? undefined : 'lazy'}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                      )}

                      <div className="p-2 sm:p-3 flex flex-col items-center text-center">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                          {app.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {appsByCategory.map((category, categoryIndex) => (
              <div key={category.id} className="mb-12">
                {/* 운세마음 카테고리 앞에 하트 표시 */}
                {category.id === 'fortune-mind' && (
                  <div className="flex justify-center mb-12">
                    <div className="animate-float">
                      <Suspense fallback={null}>
                        <GuestbookHeart />
                      </Suspense>
                    </div>
                  </div>
                )}
                
                <div className="sticky top-16 z-20 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 mb-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 -mx-4 px-4 sm:-mx-6 sm:px-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">{category.name}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {category.apps.length}개
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                  {category.apps.map((app, appIndex) => (
                    <Link
                      key={app.id}
                      href={app.url}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600"
                    >
                      <FavoriteButton
                        appId={app.id}
                        onToggle={toggleFavorite}
                        isFavorite={false}
                      />

                      {app.image && app.image.trim() !== '' && (
                        <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden">
                          <Image
                            src={app.image}
                            alt={app.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            priority={categoryIndex === 0 && appIndex < 4 && favoriteApps.length === 0}
                            loading={
                              categoryIndex === 0 && appIndex < 4 && favoriteApps.length === 0
                                ? undefined
                                : 'lazy'
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                      )}

                      <div className="p-2 sm:p-3 flex flex-col items-center text-center">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                          {app.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                BION과 함께하는 방법
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
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
