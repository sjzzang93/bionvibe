'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b-2 border-black shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="relative w-12 h-12 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-2xl group hover:shadow-amber-500/50 transition-all duration-500">
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              BION
            </h1>
          </button>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="relative inline-block w-2 h-2">
              <span className="absolute inset-0 bg-amber-400 rounded-full animate-ping"></span>
              <span className="relative inline-block w-2 h-2 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"></span>
            </span>
            <span className="font-medium">Light On</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
