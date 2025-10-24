'use client';
import React from 'react';
import { DevTerm } from '../_lib/types';

export default function TermCard({ term, onOpen }: { term: DevTerm; onOpen: (t: DevTerm) => void }) {
  // 쉬운 설명 우선 표시 (레거시 또는 새 형식)
  const simpleText = term.simpleExplanation || term.easyExplanation || '';
  const termDisplay = term.korean ? `${term.term} (${term.korean})` : term.term;
  
  return (
    <button
      type="button"
      onClick={() => onOpen(term)}
      className="w-full text-left rounded-xl border-2 border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-800 p-3 sm:p-4 
                 hover:shadow-lg hover:border-purple-400 dark:hover:border-purple-500
                 active:scale-98 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label={`${term.term} 상세 보기`}
    >
      {/* 상단: 용어명 + 카테고리 */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight flex-1">
          {termDisplay}
        </h3>
        <span className="text-[10px] sm:text-xs rounded-full bg-purple-100 dark:bg-purple-900 
                         text-purple-700 dark:text-purple-300 px-2 py-0.5 sm:py-1 
                         font-semibold flex-shrink-0 whitespace-nowrap">
          {term.category}
        </span>
      </div>
      
      {/* 중단: 언어/도구 태그 (Flutter 용어인 경우) */}
      {(term.languages || term.programs) && (
        <div className="flex flex-wrap gap-1 mb-2">
          {term.languages?.slice(0, 2).map((lang) => (
            <span 
              key={lang}
              className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded 
                         bg-blue-50 dark:bg-blue-900/30 
                         text-blue-700 dark:text-blue-300 font-medium"
            >
              {lang}
            </span>
          ))}
          {term.programs?.slice(0, 2).map((prog) => (
            <span 
              key={prog}
              className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded 
                         bg-green-50 dark:bg-green-900/30 
                         text-green-700 dark:text-green-300 font-medium"
            >
              {prog}
            </span>
          ))}
        </div>
      )}
      
      {/* 하단: 쉬운 설명 */}
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
        {simpleText}
      </p>
    </button>
  );
}

