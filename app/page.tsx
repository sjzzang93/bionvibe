import Link from 'next/link';
import { Suspense } from 'react';
import MainChat from './components/MainChat';
import HomeContent from './components/HomeContent';
import AdSlot from './components/AdSlot';
import AdSenseInArticle from './components/AdSenseInArticle';

const HOME_TOP_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP;

export default function Home() {
  // totalApps는 HomeContent 내부에서 동적으로 계산됨

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#fff8ef] text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100"
      suppressHydrationWarning
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#ffd9b1]/70 via-transparent to-transparent dark:from-amber-500/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-8 h-72 w-72 rounded-full bg-[#ffbb70]/30 blur-3xl dark:bg-amber-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-48 h-72 w-72 rounded-full bg-[#f8d5b1]/40 blur-3xl dark:bg-orange-400/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-160px] h-[320px] opacity-50 dark:opacity-25"
        style={{
          backgroundImage: "url('/autumn-texture.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '320px 160px',
        }}
      />

      <div className="relative z-10">
        {/* 상단 광고 */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mb-12">
          <AdSlot
            slotId={HOME_TOP_AD_SLOT}
            label="홈 상단 스폰서"
            minHeight={280}
            className="border-amber-200/70 bg-white/70 shadow-lg ring-1 ring-amber-200/50 backdrop-blur dark:border-amber-500/30 dark:bg-gray-900/80 dark:ring-amber-500/30"
          />
        </div>

        {/* Apps Grid */}
        <HomeContent />

        {/* 중간 광고 - In-Article */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border-amber-200/70 bg-white/70 shadow-lg ring-1 ring-amber-200/50 backdrop-blur dark:border-amber-500/30 dark:bg-gray-900/80 dark:ring-amber-500/30 rounded-2xl p-4">
            <AdSenseInArticle className="min-h-[250px]" />
          </div>
        </div>

        {/* 방명록 섹션 - 맨 아래 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-4 items-center">
            {/* 비온 방명록 */}
            <div className="w-full">
              <Suspense fallback={null}>
                <MainChat />
              </Suspense>
            </div>
          </div>
        </section>

        {/* 하단 광고 - 클릭2 */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <AdSlot
            slotId="8553792374"
            label="스폰서 링크"
            minHeight={250}
            className="border-amber-200/70 bg-white/70 shadow-lg ring-1 ring-amber-200/50 backdrop-blur dark:border-amber-500/30 dark:bg-gray-900/80 dark:ring-amber-500/30"
          />
        </div>

        {/* Footer */}
        <footer className="bg-[#fff1e2]/80 dark:bg-gray-900 border-t border-amber-200/70 dark:border-gray-800/80 py-6 px-4 backdrop-blur">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-base text-amber-900 dark:text-white mb-2 font-medium">
              Creating light for everyday life
            </p>
            <p className="text-sm text-amber-700/80 dark:text-gray-400 mb-3">
              Kim Seu Jun at BION
            </p>
            
            {/* Footer Links */}
            <div className="flex justify-center gap-4 mb-4 text-sm flex-wrap">
              <Link
                href="/about"
                className="text-amber-800/80 hover:text-amber-600 transition-colors dark:text-gray-400 dark:hover:text-amber-300"
              >
                소개
              </Link>
              <span className="text-amber-200 dark:text-gray-700">|</span>
              <Link
                href="/privacy"
                className="text-amber-800/80 hover:text-amber-600 transition-colors dark:text-gray-400 dark:hover:text-amber-300"
              >
                개인정보 처리방침
              </Link>
              <span className="text-amber-200 dark:text-gray-700">|</span>
              <Link
                href="/terms"
                className="text-amber-800/80 hover:text-amber-600 transition-colors dark:text-gray-400 dark:hover:text-amber-300"
              >
                이용약관
              </Link>
              <span className="text-amber-200 dark:text-gray-700">|</span>
              <Link
                href="/contact"
                className="text-amber-800/80 hover:text-amber-600 transition-colors dark:text-gray-400 dark:hover:text-amber-300"
              >
                문의하기
              </Link>
            </div>
            
            <p className="text-xs text-amber-700/70 dark:text-gray-500">
              BION · 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
