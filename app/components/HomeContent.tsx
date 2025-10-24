'use client';

import { useState, useEffect } from 'react';
import { getAllAppsAsync, getAllCategories, type App } from '@/lib/getApps';
import { getBrowserSupabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';

const CURATED_NONSENSE_APP: App = {
  id: "nonsense-escape",
  name: "넌센스 탈출 연구소",
  slug: "nonsense-escape",
  icon: "🧪",
  description: "웃음 터지는 실험실에서 5연속 정답 미션에 도전하세요!",
  categoryId: "learning-tools",
  url: "/apps/nonsense-escape",
  image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop",
  createdAt: "2025-01-25T00:00:00.000Z",
  hidden: false
};

// 히든 앱 slug 리스트 (Supabase에서 hidden 필드가 제대로 설정되지 않은 경우 대비)
const HIDDEN_APP_SLUGS = ['study-cursor-prompts', 'dev-vocab-old'];

const applyCuratedApps = (apps: App[]): App[] => {
  // 히든 앱 필터링 (추가 보안)
  const filteredApps = apps.filter(app => !HIDDEN_APP_SLUGS.includes(app.slug));
  
  const exists = filteredApps.find((app) => app.slug === CURATED_NONSENSE_APP.slug);
  if (exists) {
    return filteredApps.map((app) => {
      if (app.slug !== CURATED_NONSENSE_APP.slug) return app;
      return {
        ...app,
        name: CURATED_NONSENSE_APP.name,
        description: CURATED_NONSENSE_APP.description,
        icon: CURATED_NONSENSE_APP.icon,
        image: app.image || CURATED_NONSENSE_APP.image,
        hidden: false
      };
    });
  }
  return [CURATED_NONSENSE_APP, ...filteredApps];
};

export default function HomeContent() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [allApps, setAllApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const categories = getAllCategories();

  // Supabase에서 앱 데이터 가져오기 + 실시간 구독
  useEffect(() => {
    const supabase = getBrowserSupabase();

    const loadApps = async () => {
      try {
        // 초기 로드 시 캐시 사용
        const apps = await getAllAppsAsync(false, false);
        setAllApps(applyCuratedApps(apps));
        setLoading(false);
      } catch (error) {
        console.error('Failed to load apps:', error);
        setLoading(false);
      }
    };

    loadApps();

    // 🔥 Supabase Realtime 구독 - 이미지 업데이트 즉시 반영
    const channel = supabase
      .channel('apps-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE 모두 감지
          schema: 'public',
          table: 'apps'
        },
        async (payload) => {
          console.log('🔄 실시간 변경 감지:', payload);

          // 데이터 다시 불러오기 (캐시 우회)
          try {
            const apps = await getAllAppsAsync(false, true);
            setAllApps(applyCuratedApps(apps));
            console.log('✅ 앱 데이터 실시간 업데이트 완료!');
          } catch (error) {
            console.error('❌ 실시간 업데이트 실패:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime 연결 상태:', status);
      });

    // 백업: 5분마다 자동 갱신 (Realtime이 실패할 경우 대비)
    const interval = setInterval(async () => {
      try {
        const apps = await getAllAppsAsync(false, true); // 캐시 우회
        setAllApps(applyCuratedApps(apps));
      } catch (error) {
        console.error('Failed to refresh apps:', error);
      }
    }, 5 * 60 * 1000); // 5분

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  // 클라이언트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // localStorage에서 즐겨찾기 불러오기 (앱 데이터 로드 완료 후)
  useEffect(() => {
    if (!mounted || allApps.length === 0 || favoritesLoaded) return;
    
    const saved = localStorage.getItem('favorite-apps');
    console.log('📂 localStorage에서 불러온 즐겨찾기:', saved);
    
    if (saved) {
      try {
        const savedFavorites = JSON.parse(saved);
        const validFavorites = savedFavorites.filter((id: string) => 
          allApps.some(app => app.id === id)
        );
        
        console.log('✅ 유효한 즐겨찾기:', validFavorites);
        setFavorites(validFavorites);
        
        if (validFavorites.length !== savedFavorites.length) {
          console.log('🧹 유효하지 않은 즐겨찾기 제거됨');
          localStorage.setItem('favorite-apps', JSON.stringify(validFavorites));
        }
      } catch (e) {
        console.error('❌ 즐겨찾기 불러오기 실패:', e);
        localStorage.removeItem('favorite-apps');
      }
    }
    
    setFavoritesLoaded(true);
  }, [mounted, allApps, favoritesLoaded]);

  // 스크롤 위치 복원
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

  // 스크롤 위치 저장
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

  // favorites 변경 시 localStorage에 자동 저장 (초기 로드 이후에만)
  useEffect(() => {
    if (!mounted || !favoritesLoaded) return;
    
    try {
      localStorage.setItem('favorite-apps', JSON.stringify(favorites));
      console.log('✅ 즐겨찾기 저장됨:', favorites);
    } catch (e) {
      console.error('❌ 즐겨찾기 저장 실패:', e);
    }
  }, [favorites, mounted, favoritesLoaded]);

  // 즐겨찾기 토글
  const toggleFavorite = (appId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites(prev => 
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  if (!mounted || loading) {
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

  const favoriteApps = allApps.filter(app => favorites.includes(app.id));
  const otherApps = allApps.filter(app => !favorites.includes(app.id));
  
  const appsByCategory = categories.map(category => ({
    ...category,
    apps: otherApps.filter(app => app.categoryId === category.id)
  })).filter(category => category.apps.length > 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="w-[85.7%] mx-auto">
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
            {/* 주로 쓰는 앱 섹션 */}
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
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
                  {favoriteApps.map((app, index) => (
                    <Link
                      key={app.id}
                      href={app.url}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600"
                    >
                      <FavoriteButton 
                        appId={app.id}
                        onToggle={toggleFavorite}
                        isFavorite={true}
                      />

                      {app.image && app.image.trim() !== '' && (
                        <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden">
                          <Image
                            src={app.image}
                            alt={app.name}
                            fill
                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            priority={index < 6}
                            loading={index < 6 ? undefined : "lazy"}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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

            {/* 카테고리별 앱 섹션 */}
            {appsByCategory.map((category, categoryIndex) => (
              <div key={category.id} className="mb-12">
                <div className="sticky top-16 z-20 flex items-center gap-3 mb-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 -mx-4 px-4 sm:-mx-6 sm:px-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {category.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {category.apps.length}개
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
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
                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            priority={categoryIndex === 0 && appIndex < 6 && favoriteApps.length === 0}
                            loading={categoryIndex === 0 && appIndex < 6 && favoriteApps.length === 0 ? undefined : "lazy"}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
          </>
        )}
      </div>
    </section>
  );
}
