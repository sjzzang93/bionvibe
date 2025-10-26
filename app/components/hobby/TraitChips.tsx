'use client';

import React from 'react';
import { Score, Trait } from '@/lib/hobby-types';
import { getTraitLabel } from '@/lib/hobby-scoring';

interface TraitChipsProps {
  score: Score;
}

const TRAIT_INFO: Record<
  Trait,
  { icon: string; positiveLabel: string; negativeLabel: string; color: string }
> = {
  energy: {
    icon: '⚡',
    positiveLabel: '활동적',
    negativeLabel: '안정형',
    color: 'from-orange-500 to-red-500',
  },
  focus: {
    icon: '🎯',
    positiveLabel: '몰입형',
    negativeLabel: '탐색형',
    color: 'from-blue-500 to-cyan-500',
  },
  social: {
    icon: '👥',
    positiveLabel: '교류형',
    negativeLabel: '개인형',
    color: 'from-pink-500 to-rose-500',
  },
  affect: {
    icon: '💖',
    positiveLabel: '감성형',
    negativeLabel: '논리형',
    color: 'from-purple-500 to-indigo-500',
  },
  env: {
    icon: '🌳',
    positiveLabel: '실외/손',
    negativeLabel: '실내/머리',
    color: 'from-green-500 to-emerald-500',
  },
};

export function TraitChips({ score }: TraitChipsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {(Object.keys(TRAIT_INFO) as Trait[]).map((trait) => {
        const value = score[trait];
        const label = getTraitLabel(trait, value);
        const info = TRAIT_INFO[trait];
        const percentage = Math.abs(value) * 10; // -10~10 → 0~100

        return (
          <div
            key={trait}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            style={{
              transform: 'translateZ(0)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="relative z-10">
              <div className="mb-2 text-3xl">{info.icon}</div>
              <div className={`mb-1 bg-gradient-to-r ${info.color} bg-clip-text text-sm font-bold text-transparent`}>
                {label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {value > 0 ? info.positiveLabel : value < 0 ? info.negativeLabel : '중립'}
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${info.color} transition-all duration-700`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* 3D Glow Effect */}
            <div
              className={`absolute inset-0 -z-10 bg-gradient-to-br ${info.color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
            />
          </div>
        );
      })}
    </div>
  );
}

