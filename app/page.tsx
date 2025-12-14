import Link from 'next/link';
import { Suspense } from 'react';
import MainChat from './components/MainChat';
import HomeContent from './components/HomeContent';
import Snowfall from './components/Snowfall';

export default function Home() {
  // totalApps는 HomeContent 내부에서 동적으로 계산됨

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#f0f9ff] text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100"
      suppressHydrationWarning
    >
      <Snowfall />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#e0f2fe]/70 via-transparent to-transparent dark:from-sky-900/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-8 h-72 w-72 rounded-full bg-[#bae6fd]/30 blur-3xl dark:bg-sky-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-48 h-72 w-72 rounded-full bg-[#bfdbfe]/40 blur-3xl dark:bg-blue-400/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-160px] h-[320px] opacity-50 dark:opacity-25"
        style={{
          backgroundImage: "url('/winter-texture.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '320px 160px',
        }}
      />

      <div className="relative z-10">
        {/* Apps Grid */}
        <HomeContent />

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

        {/* Footer */}
        <footer className="bg-[#f0f9ff]/80 dark:bg-gray-900 border-t border-sky-200/70 dark:border-gray-800/80 py-6 px-4 backdrop-blur">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-base text-sky-900 dark:text-white mb-2 font-medium">
              Creating light for everyday life
            </p>
            <p className="text-sm text-sky-700/80 dark:text-gray-400 mb-3">
              Kim Seu Jun at BION
            </p>

            {/* Footer Links */}
            <div className="flex justify-center gap-4 mb-4 text-sm flex-wrap">
              <Link
                href="/about"
                className="text-sky-800/80 hover:text-sky-600 transition-colors dark:text-gray-400 dark:hover:text-sky-300"
              >
                소개
              </Link>
              <span className="text-sky-200 dark:text-gray-700">|</span>
              <Link
                href="/privacy"
                className="text-sky-800/80 hover:text-sky-600 transition-colors dark:text-gray-400 dark:hover:text-sky-300"
              >
                개인정보 처리방침
              </Link>
              <span className="text-sky-200 dark:text-gray-700">|</span>
              <Link
                href="/terms"
                className="text-sky-800/80 hover:text-sky-600 transition-colors dark:text-gray-400 dark:hover:text-sky-300"
              >
                이용약관
              </Link>
              <span className="text-sky-200 dark:text-gray-700">|</span>
              <Link
                href="/contact"
                className="text-sky-800/80 hover:text-sky-600 transition-colors dark:text-gray-400 dark:hover:text-sky-300"
              >
                문의하기
              </Link>
            </div>

            <p className="text-xs text-sky-700/70 dark:text-gray-500">
              BION · 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
