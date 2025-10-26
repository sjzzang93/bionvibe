'use client';

import React from 'react';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  progress: number;
}

export function StepHeader({ currentStep, totalSteps, title, progress }: StepHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Step {currentStep} / {totalSteps}
        </div>
        <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
          {Math.round(progress)}%
        </div>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400">
        {title}
      </h2>
    </div>
  );
}

