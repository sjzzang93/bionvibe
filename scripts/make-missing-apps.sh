#!/usr/bin/env bash
set -euo pipefail

declare -a SLUGS=(
  "vitamin-check:비타민 체크:🧪"
  "travel-destinations:여행지 추천:🗺️"
  "envelope-recommend:봉투금액 가이드:💌"
  "study-dev-vocab:개발 용어 사전:📚"
  "gift-recommend:선물 추천:🎁"
)

for entry in "${SLUGS[@]}"; do
  IFS=":" read -r slug title emoji <<< "$entry"
  dir="app/apps/${slug}"
  mkdir -p "$dir"
  cat > "${dir}/page.tsx" << TSX
'use client';
import PremiumCard from '@/app/components/ui/PremiumCard';

export default function Page() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <PremiumCard className="rounded-3xl shadow-2xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-white/40 dark:border-white/10">
          <div className="p-6 text-center">
            <div className="text-5xl mb-3">${emoji}</div>
            <h1 className="text-2xl font-bold">${title}</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              이 페이지는 준비 중입니다. 곧 공개할게요!
            </p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
TSX
  echo "✓ created: ${dir}/page.tsx"
done

echo "✅ 완료: 로컬에선 'pnpm dev' / 배포 후 404 사라집니다."

