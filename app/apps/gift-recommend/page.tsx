'use client';
import PremiumCard from '@/app/components/ui/PremiumCard';

export default function Page() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <PremiumCard className="rounded-3xl shadow-2xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-white/40 dark:border-white/10">
          <div className="p-6 text-center">
            <div className="text-5xl mb-3">🎁</div>
            <h1 className="text-2xl font-bold">선물 추천</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              이 페이지는 준비 중입니다. 곧 공개할게요!
            </p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
