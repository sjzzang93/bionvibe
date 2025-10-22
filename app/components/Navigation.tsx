'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function Navigation() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [logoClicked7Times, setLogoClicked7Times] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const secretTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // 7번 클릭 완료 시
    if (newCount >= 7) {
      setLogoClicked7Times(true);
      setClickCount(0);
      
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      
      // 3초 후 초기화
      secretTimerRef.current = setTimeout(() => {
        setLogoClicked7Times(false);
      }, 3000);
      
      // 홈으로 이동
      router.push('/');
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

    // 3초 후 카운트 리셋
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    // 로고 7번 클릭 완료된 상태에서 이벤트 신청 클릭 시 Secret 페이지로
    if (logoClicked7Times) {
      e.preventDefault();
      setLogoClicked7Times(false);
      if (secretTimerRef.current) {
        clearTimeout(secretTimerRef.current);
      }
      router.push('/secret');
    } else {
      // 일반적인 경우 이벤트 신청 페이지로 (contact 페이지 활용)
      e.preventDefault();
      router.push('/contact');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/90 backdrop-blur-xl border-b-2 border-black dark:border-gray-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-0.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* BION 로고 */}
            <div className="relative w-14 h-14 bg-transparent dark:bg-black rounded-lg p-1 flex items-center justify-center transition-colors">
              <Image
                src="/logo.png"
                alt="BION Logo"
                width={52}
                height={52}
                className="dark:hidden animate-bounce"
                style={{ animationDuration: '2s' }}
                priority
              />
              <video
                src="/logo-dark.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="hidden dark:block w-[40px] h-[40px] object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              BION
            </h1>
          </button>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* 이벤트 버튼 */}
            <button
              onClick={handleContactClick}
              className="relative flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-500 dark:to-rose-500 hover:from-red-700 hover:to-rose-700 dark:hover:from-red-600 dark:hover:to-rose-600 text-white rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 overflow-hidden animate-pulse"
            >
              {/* 반짝반짝 효과 */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></span>
              
              <svg className="w-4 h-4 relative z-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="relative z-10">Event</span>
            </button>
            
            <style jsx>{`
              @keyframes shine {
                0% {
                  transform: translateX(-100%) skewX(-15deg);
                }
                100% {
                  transform: translateX(200%) skewX(-15deg);
                }
              }
              .animate-shine {
                animation: shine 3s infinite;
              }
            `}</style>

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
            
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <span className="relative inline-block w-2 h-2">
                <span className={`absolute inset-0 ${logoClicked7Times ? 'bg-red-400' : 'bg-amber-400'} rounded-full animate-ping`}></span>
                <span className={`relative inline-block w-2 h-2 ${logoClicked7Times ? 'bg-red-500 shadow-red-500/50' : 'bg-amber-500 shadow-amber-500/50'} rounded-full shadow-lg`}></span>
              </span>
              <span className="font-medium">Life On</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
