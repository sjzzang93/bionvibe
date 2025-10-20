'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 다크모드 초기화
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 다크모드 토글
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    
    // 7번 클릭 시 비밀 페이지로 즉시 이동
    if (newCount >= 7) {
      setClickCount(0);
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      router.push('/secret');
      return;
    }
    
    // 7번 미만: 즉시 홈으로 이동
    router.push('/');
    
    // 클릭 카운트 증가
    setClickCount(newCount);

    // 기존 타이머 제거
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // 1초 후 카운트 리셋
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b-2 border-black dark:border-gray-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="relative w-12 h-12 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-xl flex items-center justify-center shadow-2xl group hover:shadow-amber-500/50 transition-all duration-500">
              {/* Warm glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              
              {/* Light icon */}
              <svg 
                viewBox="0 0 24 24" 
                className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform duration-300"
                fill="none"
              >
                {/* Light rays */}
                <g className="animate-pulse">
                  <line x1="12" y1="2" x2="12" y2="4" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="20" x2="12" y2="22" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="4" y1="12" x2="2" y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="22" y1="12" x2="20" y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6.34" y1="6.34" x2="4.93" y2="4.93" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="19.07" y1="19.07" x2="17.66" y2="17.66" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
                </g>
                
                {/* Center glow */}
                <circle cx="12" cy="12" r="4" fill="#FEF3C7" opacity="0.3"/>
                <circle cx="12" cy="12" r="3" fill="#FCD34D"/>
                <circle cx="12" cy="12" r="2" fill="#FFFBEB"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              BION
            </h1>
          </button>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* 문의하기 버튼 */}
            <button
              onClick={() => router.push('/contact')}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-500 dark:to-rose-500 hover:from-red-700 hover:to-rose-700 dark:hover:from-red-600 dark:hover:to-rose-600 text-white rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">문의하기</span>
            </button>

            {/* 다크모드 토글 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="다크모드 토글"
            >
              {isDark ? (
                // 해 아이콘 (라이트 모드로 전환)
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                // 달 아이콘 (다크 모드로 전환)
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <span className="relative inline-block w-2 h-2">
                <span className="absolute inset-0 bg-amber-400 rounded-full animate-ping"></span>
                <span className="relative inline-block w-2 h-2 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"></span>
              </span>
              <span className="font-medium">Light On</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
