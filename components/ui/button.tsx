import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const VARIANT_MAP: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-200/40 hover:from-amber-600 hover:to-rose-600 focus-visible:ring-2 focus-visible:ring-amber-300',
  outline:
    'border border-amber-300 text-amber-700 dark:text-amber-200 hover:bg-amber-50/40 dark:hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-200',
  ghost:
    'text-amber-700 hover:bg-amber-50 dark:text-amber-200 dark:hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-200',
};

const SIZE_MAP: Record<NonNullable<ButtonProps['size']>, string> = {
  xs: 'h-9 px-3 text-xs',
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
          VARIANT_MAP[variant],
          SIZE_MAP[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

