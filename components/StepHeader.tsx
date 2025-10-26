import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  helper?: string;
  className?: string;
}

export function StepHeader({ currentStep, totalSteps, title, helper, className }: StepHeaderProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <header className={cn('space-y-3 text-left', className)}>
      <div className="flex items-center justify-between text-sm font-medium text-amber-700/80 dark:text-amber-200/80">
        <span aria-live="polite">
          STEP {currentStep} / {totalSteps}
        </span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} aria-label="테스트 진행률" />
      <div>
        <h1 className="text-2xl font-semibold text-amber-900 dark:text-amber-100">{title}</h1>
        {helper ? (
          <p className="mt-2 text-sm text-amber-700/80 dark:text-amber-200/80">{helper}</p>
        ) : null}
      </div>
    </header>
  );
}

