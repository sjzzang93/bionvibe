'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { ProgressProvider, useProgress } from './progress-context';
import '@/styles/globals.css';

function FooterProgress() {
  const { progress } = useProgress();
  const percentage = useMemo(() => Math.round(progress * 100), [progress]);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/80 px-4 py-4 shadow-[0_-12px_32px_rgba(244,196,94,0.25)] backdrop-blur-md dark:bg-gray-950/90">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/70 dark:text-amber-200/70">
          <span>현재 진행률</span>
          <span>{percentage}%</span>
        </div>
        <Progress value={percentage} />
      </div>
    </div>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-[#fff7ec] via-white to-[#ffe0c7] text-amber-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-amber-100">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#ffedd5_0%,transparent_55%),radial-gradient(circle_at_bottom,#fde68a_0%,transparent_60%)] opacity-60 dark:opacity-30"
        />
        <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pt-6 pb-28 sm:px-6">
          <header className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/70 px-5 py-4 shadow-lg shadow-amber-100/40 backdrop-blur dark:border-amber-500/20 dark:bg-gray-950/70 dark:shadow-none">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 dark:text-amber-300">
                Progressive Hobby Finder
              </p>
              <h1 className="mt-1 text-lg font-semibold">성향별 취미 찾기</h1>
            </div>
            <Link
              href="/"
              className="rounded-full border border-amber-200/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-700 transition-colors hover:bg-amber-50 dark:border-amber-500/40 dark:text-amber-200 dark:hover:bg-amber-500/10"
            >
              BION 홈
            </Link>
          </header>
          <main className="mt-6 flex-1">{children}</main>
        </div>
        <FooterProgress />
      </div>
    </ProgressProvider>
  );
}

