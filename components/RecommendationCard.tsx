import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Hobby } from '@/lib/types';

interface RecommendationCardProps {
  hobby: Hobby;
}

export function RecommendationCard({ hobby }: RecommendationCardProps) {
  return (
    <Card className="glass-sheen flex h-full flex-col justify-between">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{hobby.level}</Badge>
          <Badge variant="outline">{hobby.cost}</Badge>
          <Badge variant="soft">{hobby.indoor ? '실내' : '실외'}</Badge>
          <Badge variant="soft">{hobby.soloFriendly ? '혼자도 OK' : '교류형'}</Badge>
        </div>
        <CardTitle className="mt-3 text-xl">{hobby.name}</CardTitle>
        <CardDescription>{hobby.why}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-amber-200/50 bg-white/70 p-4 text-sm leading-relaxed shadow-inner dark:border-amber-500/20 dark:bg-gray-900/70">
          <p className="font-semibold text-amber-900 dark:text-amber-100">시작 팁</p>
          <p className="mt-1 text-amber-700/80 dark:text-amber-200/80">{hobby.starterGuide}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-amber-700/80 dark:text-amber-300/80">
          <span className="rounded-full border border-amber-200/60 px-3 py-1">
            주 {hobby.timePerWeek}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

