import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'soft';
}

const VARIANTS: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:
    'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm shadow-amber-200/40',
  outline:
    'border border-amber-300 text-amber-700 dark:border-amber-500/70 dark:text-amber-200',
  soft:
    'bg-amber-100/80 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
          VARIANTS[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Badge.displayName = 'Badge';

