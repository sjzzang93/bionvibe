import { Badge } from '@/components/ui/badge';
import type { Score, Trait } from '@/lib/types';

const LABELS: Record<Trait, string> = {
  energy: '에너지',
  focus: '집중',
  social: '사회성',
  affect: '감성',
  env: '환경',
};

interface TraitChipsProps {
  score: Score;
}

function formatValue(value: number) {
  if (Math.abs(value) < 0.5) return '균형';
  return value > 0 ? `+${value}` : value.toString();
}

function tone(value: number) {
  if (value > 4) return '강함';
  if (value > 1.5) return '선호';
  if (value < -4) return '약함';
  if (value < -1.5) return '기피';
  return '균형';
}

export function TraitChips({ score }: TraitChipsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {(Object.keys(score) as Trait[]).map((trait) => {
        const value = Number((score as Record<Trait, number>)[trait].toFixed(1));
        return (
          <div
            key={trait}
            className="rounded-2xl border border-amber-200/60 bg-white/60 p-3 text-center shadow-sm dark:border-amber-500/20 dark:bg-gray-900/60"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-200">
              {tone(value)}
            </p>
            <p className="mt-1 text-base font-semibold text-amber-900 dark:text-amber-100">
              {LABELS[trait]}
            </p>
            <Badge variant="soft" className="mt-2">
              {formatValue(value)}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

