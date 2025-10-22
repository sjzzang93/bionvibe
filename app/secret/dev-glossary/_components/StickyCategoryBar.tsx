'use client';
import React from 'react';

type Props = {
  categories: string[];
  active: string;
  onSelect: (v: string) => void;
};

export default function StickyCategoryBar({ categories, active, onSelect }: Props) {
  return (
    <div className="sticky top-0 left-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-2 overflow-x-auto px-3 py-2 scrollbar-hide">
        {['ALL', ...categories].map((c) => (
          <button
        type="button"
            key={c}
            onClick={() => onSelect(c)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-sm border transition-all
              ${active === c 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'}`}
            aria-pressed={active === c}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

