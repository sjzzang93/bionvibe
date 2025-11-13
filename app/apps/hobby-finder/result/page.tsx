'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getState, clearState } from '@/lib/hobby-storage';
import { TraitChips } from '@/app/components/hobby/TraitChips';
import { RecommendationCard } from '@/app/components/hobby/RecommendationCard';
import { ShareButtons } from '@/app/components/hobby/ShareButtons';
import type { Score, Hobby } from '@/lib/hobby-types';
import AdOverlay from '@/app/components/AdOverlay';

export default function HobbyResultPage() {
  const router = useRouter();
  const [score, setScore] = useState<Score | null>(null);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = getState();

    console.log('🎯 [결과] localStorage에서 가져온 state:', state);

    if (!state || !state.score || !state.hobbies) {
      console.log('🎯 [결과] state 없음! 메인으로 리다이렉트');
      router.push('/apps/hobby-finder');
      return;
    }

    console.log('🎯 [결과] Score:', state.score);
    console.log('🎯 [결과] Hobbies:', state.hobbies);

    setScore(state.score);
    setHobbies(state.hobbies);
    setLoading(false);
  }, [router]);

  const handleReset = () => {
    clearState();
    router.push('/apps/hobby-finder');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        
      <AdOverlay /><div className="text-center">
          <div className="mb-4 text-6xl animate-bounce">🎯</div>
          <p className="text-lg text-gray-600 dark:text-gray-400">결과를 분석 중...</p>
        </div>
      </div>
    );
  }

  if (!score || hobbies.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 text-7xl animate-bounce">🎉</div>

          <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent dark:from-purple-400 dark:to-pink-400">
            당신의 성향 결과
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300">
            5가지 성향 분석을 바탕으로 추천 취미를 찾았습니다!
          </p>
        </div>

        {/* Trait Chips */}
        <div className="mx-auto mb-16 max-w-5xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">🔍 나의 성향</h2>
          <TraitChips score={score} />
        </div>

        {/* Recommendations */}
        <div className="mx-auto mb-12 max-w-6xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-white">
            ✨ 추천 취미 ({hobbies.length}개)
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hobbies.map((hobby, index) => (
              <RecommendationCard key={hobby.id} hobby={hobby} rank={index + 1} />
            ))}
          </div>
        </div>

        {/* Share Section */}
        <div className="mx-auto mb-12 max-w-2xl">
          <ShareButtons />
        </div>

        {/* Action Buttons */}
        <div className="mx-auto flex max-w-md flex-col gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
          >
            🔄 다시 테스트하기
          </button>

          <Link
            href="/"
            className="rounded-2xl border-2 border-gray-300 bg-white px-8 py-4 text-center font-bold text-gray-700 transition-all hover:border-gray-400 hover:shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            🏠 홈으로 돌아가기
          </Link>
        </div>

        {/* Tips */}
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-gray-200 bg-white/50 p-8 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
          <h3 className="mb-4 text-center text-xl font-bold text-gray-800 dark:text-white">💡 취미 시작 팁</h3>

          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-xl">1️⃣</span>
              <span>
                <strong>초급부터 시작:</strong> 낮은 난이도의 취미부터 체험해보세요.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">2️⃣</span>
              <span>
                <strong>원데이 클래스 활용:</strong> 큰 투자 전에 체험 클래스로 적성을 확인하세요.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">3️⃣</span>
              <span>
                <strong>커뮤니티 참여:</strong> 같은 취미를 가진 사람들과 교류하면 동기부여가 됩니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">4️⃣</span>
              <span>
                <strong>꾸준함이 중요:</strong> 주 1~2회 정도 꾸준히 하는 것이 가장 좋습니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

