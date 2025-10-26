'use client';

import React from 'react';

interface OptionCardProps {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({ id, label, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`
        group relative w-full rounded-2xl border-2 p-6 text-left
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-purple-400/50
        ${
          selected
            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg shadow-purple-500/20 dark:from-purple-900/30 dark:to-pink-900/30'
            : 'border-gray-200 bg-white hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-600'
        }
      `}
      style={{
        transform: selected ? 'translateZ(10px)' : 'translateZ(0)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-lg font-medium transition-colors ${
            selected
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {label}
        </span>

        <div
          className={`
          flex h-6 w-6 items-center justify-center rounded-full border-2 
          transition-all duration-300
          ${
            selected
              ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500'
              : 'border-gray-300 dark:border-gray-600'
          }
        `}
        >
          {selected && (
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* 3D Effect */}
      <div
        className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 blur-xl transition-opacity duration-300 ${
          selected ? 'opacity-100' : 'group-hover:opacity-50'
        }`}
      />
    </button>
  );
}

