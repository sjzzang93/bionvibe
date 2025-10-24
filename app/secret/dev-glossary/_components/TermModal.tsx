'use client';
import React, { useEffect } from 'react';
import { DevTerm } from '../_lib/types';

export default function TermModal({ open, term, onClose }: {
  open: boolean; term?: DevTerm; onClose: () => void;
}) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) {
      window.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open || !term) return null;

  // 쉬운 설명과 일반 설명 우선순위 결정
  const simpleText = term.simpleExplanation || term.easyExplanation || '';
  const generalText = term.generalExplanation || term.realExplanation || '';
  const exampleText = term.example || term.exampleCode || '';
  const termDisplay = term.korean ? `${term.term} (${term.korean})` : term.term;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* 모달 본문 */}
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:my-auto md:max-w-3xl md:mx-auto
                      bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl 
                      p-4 sm:p-5 md:p-6 max-h-[92vh] 
                      overflow-y-auto shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0">
        
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {termDisplay}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full 
                             bg-purple-100 dark:bg-purple-900 
                             text-purple-700 dark:text-purple-300 font-semibold">
                {term.category}
              </span>
              {term.languages && term.languages.length > 0 && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  · {term.languages.join(', ')}
                </span>
              )}
            </div>
          </div>
          <button
            type="button" 
            onClick={onClose} 
            aria-label="닫기" 
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                       text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* 프로그램/도구 태그 */}
        {term.programs && term.programs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {term.programs.map((prog) => (
              <span 
                key={prog}
                className="text-xs px-2 py-1 rounded-lg 
                           bg-green-50 dark:bg-green-900/30 
                           text-green-700 dark:text-green-300 font-medium"
              >
                🛠️ {prog}
              </span>
            ))}
          </div>
        )}

        {/* 쉬운 설명 */}
        {simpleText && (
          <section className="mb-5 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <h3 className="text-sm sm:text-base font-bold text-purple-700 dark:text-purple-300 mb-2">
              🎯 초등학생도 이해하는 설명
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
              {simpleText}
            </p>
            {term.usedForSimple && (
              <p className="mt-2 text-xs sm:text-sm text-purple-600 dark:text-purple-400 italic">
                💡 {term.usedForSimple}
              </p>
            )}
          </section>
        )}

        {/* 일반 설명 */}
        {generalText && (
          <section className="mb-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300 mb-2">
              📚 개발자 전문 설명
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
              {generalText}
            </p>
            {term.usedForReal && (
              <p className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 italic">
                🔧 {term.usedForReal}
              </p>
            )}
          </section>
        )}

        {/* 예시 코드 */}
        {exampleText && (
          <section className="mb-4">
            <h3 className="text-sm sm:text-base font-bold text-green-700 dark:text-green-300 mb-2">
              💻 사용 예시
            </h3>
            <pre className="rounded-lg bg-gray-900 text-gray-100 p-3 sm:p-4 
                          overflow-x-auto text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
{exampleText}
            </pre>
          </section>
        )}

        {/* 관련 용어 */}
        {term.relatedTerms && term.relatedTerms.length > 0 && (
          <section className="mb-2">
            <h3 className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 mb-2">
              🔗 관련 용어
            </h3>
            <div className="flex flex-wrap gap-2">
              {term.relatedTerms.map((rel) => (
                <span 
                  key={rel}
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-lg 
                             bg-gray-100 dark:bg-gray-700 
                             text-gray-700 dark:text-gray-300 font-medium"
                >
                  {rel}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

