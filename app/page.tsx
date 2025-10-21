'use client';

import { getTotalAppsCount } from '@/lib/getApps';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 클라이언트 전용 컴포넌트들
const MainChat = dynamic(() => import('./components/MainChat'), {
  ssr: false,
  loading: () => null
});

const HomeContent = dynamic(() => import('./components/HomeContent'), {
  ssr: false,
  loading: () => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="w-[85.7%] mx-auto">
        <div className="text-center py-20">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    </section>
  )
});

export default function Home() {
  const totalApps = getTotalAppsCount();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors" suppressHydrationWarning>
      {/* 비온타키 채팅 */}
      <MainChat />

      {/* Apps Grid */}
      <HomeContent />

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
