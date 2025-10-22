'use client';
import React from 'react';
import { DevTerm } from '../_lib/types';

export default function TermCard({ term, onOpen }: { term: DevTerm; onOpen: (t: DevTerm) => void }) {
  return (
    <button
      onClick={() => onOpen(term)}
      className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-800 p-4 hover:shadow-md hover:border-purple-300 
                 dark:hover:border-purple-600 transition-all 
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label={`${term.term} 상세 보기`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{term.term}</h3>
        <span className="text-xs rounded-full bg-purple-100 dark:bg-purple-900 
                         text-purple-700 dark:text-purple-300 px-2 py-1">
          {term.category}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {term.easyExplanation}
      </p>
    </button>
  );
}

