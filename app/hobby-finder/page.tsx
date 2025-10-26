'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProgress } from './(public)/progress-context';
import { clearState, getState } from '@/lib/hobby-storage';

const FEATURES = [
  {
    icon: Sparkles,
    title: '5단계 점진 질문',
    description: '부담 없이 한 화면씩 답하면서 성향의 방향을 자연스럽게 확인해요.',
  },
  {
    icon: Target,
    title: '정규화된 성향 점수',
    description: '에너지·집중·사회성·감성·환경 5가지 축을 -10~+10 범위로 정리해드립니다.',
  },
  {
    icon: Users,
    title: '맞춤 취미 큐레이션',
    description: '현재 라이프스타일에 맞춘 6~9개의 취미를 난이도와 비용까지 함께 안내해요.',
  },
];

export default function HobbyFinderLanding() {
  const router = useRouter();
  const { setProgress } = useProgress();
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const stored = getState();
    if (stored) {
      setProgress(Math.min(stored.step / 5, 1));
      setHasProgress(stored.step > 1 || Object.keys(stored.answers ?? {}).length > 0);
    } else {
      setProgress(0);
    }
  }, [setProgress]);

  const handleStart = () => {
    clearState();
    setProgress(0);
    router.push('/hobby-finder/test');
  };

  const handleContinue = () => {
    router.push('/hobby-finder/test');
  };

  const cards = useMemo(() => FEATURES, []);

  return (
    <div className="space-y-12 pb-8">
      <section className="perspective-scene">
        <div className="tilt-card relative overflow-hidden rounded-4xl border border-white/40 bg-gradient-to-br from-white/80 via-[#ffe9d6]/80 to-white/90 p-8 shadow-2xl shadow-amber-100/50 backdrop-blur-xl dark:border-amber-500/20 dark:from-gray-900/80 dark:via-gray-950/80 dark:to-gray-900/80">
          <div
            aria-hidden
            className="absolute right-8 top-8 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400/60 to-rose-400/40 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-gradient-to-tr from-rose-300/50 to-transparent blur-3xl"
          />
          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-amber-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              Progressive Hobby Finder
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-amber-900 dark:text-amber-100">
              성향별 취미 찾기
            </h2>
            <p className="mt-3 text-base text-amber-700/80 dark:text-amber-200/80">
              5개의 점진 질문 세트를 통해 나의 에너지와 집중 방식, 교류 성향을 파악하고 지금
              삶에 어울리는 취미를 추천받아요.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleStart} size="lg" fullWidth>
                새로 시작하기
              </Button>
              {hasProgress ? (
                <Button onClick={handleContinue} variant="outline" size="lg" fullWidth>
                  이어서 진행하기
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {cards.map((feature) => (
          <Card
            key={feature.title}
            className="glass-sheen tilt-card h-full border-white/40 bg-white/70 p-5 shadow-lg shadow-amber-100/40 dark:border-amber-500/20 dark:bg-gray-950/70"
          >
            <CardHeader className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 text-white shadow-lg">
                <feature.icon className="h-6 w-6" aria-hidden />
              </div>
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

