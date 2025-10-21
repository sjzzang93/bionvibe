'use client';

import { useState, useEffect } from 'react';
import { getTotalAppsCount, getAllApps, getAllCategories } from '@/lib/getApps';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// MainChat을 클라이언트에서만 로드 (SSR 비활성화)
const MainChat = dynamic(() => import('./components/MainChat'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();
  const totalApps = getTotalAppsCount();
  const allApps = getAllApps();
  const categories = getAllCategories();
  
  // 카테고리 ID -> 이름 매핑
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<string, string>);

  // localStorage에서 즐겨찾기 불러오기 (유효한 앱만 필터링)
  useEffect(() => {
    const saved = localStorage.getItem('favorite-apps');
    if (saved) {
      const savedFavorites = JSON.parse(saved);
      // 실제 존재하는 앱 ID만 필터링
      const validFavorites = savedFavorites.filter((id: string) => 
        allApps.some(app => app.id === id)
      );
      setFavorites(validFavorites);
      // 유효한 앱만 다시 저장
      if (validFavorites.length !== savedFavorites.length) {
        localStorage.setItem('favorite-apps', JSON.stringify(validFavorites));
      }
    }
  }, []);

  // 스크롤 위치 복원 (뒤로가기 시)
  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('homeScrollPosition');
    if (savedScrollPos) {
      // DOM이 완전히 로드된 후 스크롤 복원
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPos, 10));
        sessionStorage.removeItem('homeScrollPosition');
      }, 100);
    }
  }, []);

  // 스크롤 위치 저장 (페이지 떠날 때)
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
    };

    // 페이지 떠나기 전에 스크롤 위치 저장
    window.addEventListener('beforeunload', saveScrollPosition);
    
    // 라우트 변경 시에도 저장 (Next.js Link 클릭 시)
    const handleRouteChange = () => {
      saveScrollPosition();
    };

    // 모든 링크에 클릭 이벤트 추가
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href) {
        handleRouteChange();
      }
    });

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

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

  // 즐겨찾기 앱과 나머지 앱 분리
  const favoriteApps = allApps.filter(app => favorites.includes(app.id));
  const otherApps = allApps.filter(app => !favorites.includes(app.id));
  
  // 카테고리별로 앱 그룹화
  const appsByCategory = categories.map(category => ({
    ...category,
    apps: otherApps.filter(app => app.categoryId === category.id)
  })).filter(category => category.apps.length > 0);
  
  return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* 비온타키 채팅 */}
      <MainChat />

      {/* Apps Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="w-[85.7%] mx-auto">
          {totalApps === 0 ? (
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
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                      ❤️ 주로 쓰는 앱
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {favoriteApps.length}개
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {favoriteApps.map((app) => (
                     <Link
                       key={app.id}
                       href={app.url}
                       className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600"
                     >
                     {/* 하트 버튼 */}
                     <button
                       onClick={(e) => toggleFavorite(app.id, e)}
                       className="absolute top-1.5 right-1.5 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
                       suppressHydrationWarning
                     >
                       <span className="text-sm">❤️</span>
                     </button>

                       {/* App Image */}
                       {app.image && app.image.trim() !== '' && (
                         <div className="relative h-36 overflow-hidden" suppressHydrationWarning>
                           <img
                             src={app.image}
                             alt={app.name}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                             loading="lazy"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                         </div>
                       )}

                        {/* App Info */}
                        <div className="p-3 flex flex-col items-center text-center">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
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
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                      {category.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {category.apps.length}개
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {category.apps.map((app) => (
                      <Link
                        key={app.id}
                        href={app.url}
                        className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600"
                      >
                        {/* 하트 버튼 */}
                        <button
                          onClick={(e) => toggleFavorite(app.id, e)}
                          className="absolute top-1.5 right-1.5 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
                          suppressHydrationWarning
                        >
                          <span className="text-sm">🤍</span>
                        </button>

                        {/* App Image */}
                        {app.image && app.image.trim() !== '' && (
                          <div className="relative h-36 overflow-hidden" suppressHydrationWarning>
                            <img
                              src={app.image}
                              alt={app.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </div>
                        )}

                        {/* App Info */}
                        <div className="p-3 flex flex-col items-center text-center">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
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

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-base text-gray-600 dark:text-gray-300 mb-2 font-medium">
            Creating light for everyday life
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Kim Seu Jun at BION
          </p>
          
          {/* Footer Links */}
          <div className="flex justify-center gap-4 mb-4 text-sm flex-wrap">
            <Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              About
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Contact
            </Link>
          </div>
          
          <p className="text-xs text-gray-400 dark:text-gray-500">
            BION · 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

