import * as React from 'react';
import type { Choice } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  choice: Choice;
  selected: boolean;
  onSelect: (choice: Choice) => void;
  autoFocus?: boolean;
}

export function OptionCard({ choice, selected, onSelect, autoFocus }: OptionCardProps) {
  const id = React.useId();
  const helperId = choice.helper ? `${id}-helper` : undefined;

  const handleSelect = React.useCallback(() => {
    onSelect(choice);
  }, [choice, onSelect]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      role="radio"
      tabIndex={0}
      aria-checked={selected}
      aria-describedby={helperId}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        'tilt-card relative flex min-h-[92px] cursor-pointer flex-col justify-between rounded-3xl border p-5 transition-all focus-visible:outline-none',
        selected
          ? 'border-amber-500 bg-gradient-to-br from-amber-100/80 via-white to-rose-100/60 text-amber-900 shadow-lg shadow-amber-200/60 dark:from-amber-500/20 dark:via-gray-900 dark:to-rose-500/15'
          : 'border-amber-200/70 bg-white/80 text-amber-800 hover:border-amber-400 hover:bg-amber-50/60 dark:border-amber-500/20 dark:bg-gray-900/80 dark:text-amber-100 dark:hover:border-amber-400/70',
      )}
      autoFocus={autoFocus}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-left">
          <p className="text-base font-semibold">{choice.label}</p>
          {choice.helper ? (
            <p id={helperId} className="mt-2 text-xs text-amber-700/80 dark:text-amber-200/80">
              {choice.helper}
            </p>
          ) : null}
        </div>
        <div
          aria-hidden
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors',
            selected
              ? 'border-amber-500 bg-amber-500 text-white'
              : 'border-amber-300 text-amber-500',
          )}
        >
          {selected ? '✓' : ''}
        </div>
      </div>
    </div>
  );
}

