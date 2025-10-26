'use client';

import React, { useState } from 'react';
import { Hobby } from '@/lib/hobby-types';

interface RecommendationCardProps {
  hobby: Hobby;
  rank: number;
}

const LEVEL_COLORS = {
  초급: 'from-green-500 to-emerald-500',
  중급: 'from-yellow-500 to-orange-500',
  고급: 'from-red-500 to-pink-500',
};

const COST_ICONS = {
  낮음: '💵',
  보통: '💵💵',
  높음: '💵💵💵',
};

const TIME_LABELS = {
  짧음: '주 1~3시간',
  보통: '주 3~6시간',
  김: '주 6시간+',
};

export function RecommendationCard({ hobby, rank }: RecommendationCardProps) {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
      style={{
        transform: 'translateZ(0)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Rank Badge */}
      <div className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg">
        {rank}
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <h3 className="mb-2 mt-6 text-2xl font-bold text-gray-800 dark:text-white">{hobby.name}</h3>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{hobby.why}</p>

        {/* Badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full bg-gradient-to-r ${LEVEL_COLORS[hobby.level]} px-3 py-1 text-xs font-semibold text-white`}
          >
            {hobby.level}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {COST_ICONS[hobby.cost]} {hobby.cost}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {hobby.indoor ? '🏠 실내' : '🌤️ 실외'}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {hobby.soloFriendly ? '🧘 혼자OK' : '👫 함께'}
          </span>
        </div>

        {/* Time */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>⏰</span>
          <span>{TIME_LABELS[hobby.timePerWeek]}</span>
        </div>

        {/* Starter Guide Toggle */}
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50"
        >
          {showGuide ? '접기' : '💡 시작 가이드 보기'}
        </button>

        {/* Starter Guide */}
        {showGuide && (
          <div className="mt-4 rounded-xl bg-purple-50 p-4 text-sm text-gray-700 dark:bg-purple-900/20 dark:text-gray-300">
            {hobby.starterGuide}
          </div>
        )}
      </div>

      {/* 3D Glow Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

