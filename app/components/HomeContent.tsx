'use client';

import { useState, useEffect } from 'react';
import { getAllApps, getAllCategories } from '@/lib/getApps';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';

export default function HomeContent() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const allApps = getAllApps();
  const categories = getAllCategories();

  // 클라이언트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // localStorage에서 즐겨찾기 불러오기
  useEffect(() => {
    if (!mounted) return;
    
    const saved = localStorage.getItem('favorite-apps');
    if (saved) {
      try {
        const savedFavorites = JSON.parse(saved);
        const validFavorites = savedFavorites.filter((id: string) => 
          allApps.some(app => app.id === id)
        );
        setFavorites(validFavorites);
        if (validFavorites.length !== savedFavorites.length) {
          localStorage.setItem('favorite-apps', JSON.stringify(validFavorites));
        }
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

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

  // 즐겨찾기 토글
  const toggleFavorite = (appId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites(prev => {
      const newFavorites = prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId];
      
      localStorage.setItem('favorite-apps', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (!mounted) {
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
                  {favoriteApps.map((app) => (
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
                            loading="lazy"
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
            {appsByCategory.map((category) => (
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
                  {category.apps.map((app) => (
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
                            loading="lazy"
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

