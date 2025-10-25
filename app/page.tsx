import Link from 'next/link';
import { Suspense } from 'react';
import MainChat from './components/MainChat';
import GuestbookHeart from './components/GuestbookHeart';
import HomeContent from './components/HomeContent';
import AdSlot from './components/AdSlot';

const HOME_TOP_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP;

export default function Home() {
  // totalApps는 HomeContent 내부에서 동적으로 계산됨
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors" suppressHydrationWarning>
      {/* 히어로 섹션: 방명록 + 하트 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col gap-4 items-center">
          {/* 비온 방명록 */}
          <div className="w-full">
            <Suspense fallback={null}>
              <MainChat />
            </Suspense>
          </div>
          
          {/* 하트 카운터 - 방명록 하단 */}
          <div className="flex justify-center">
            <Suspense fallback={null}>
              <GuestbookHeart />
            </Suspense>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
        <AdSlot slotId={HOME_TOP_AD_SLOT} label="홈 상단 스폰서" minHeight={280} />
      </div>

      {/* Apps Grid */}
      <HomeContent />

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-base text-gray-700 dark:text-white mb-2 font-medium">
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
