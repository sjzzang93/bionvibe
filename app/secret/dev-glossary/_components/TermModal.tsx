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

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:my-auto md:max-w-2xl md:mx-auto
                      bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl p-5 max-h-[90vh] 
                      overflow-auto shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{term.term}</h2>
          <button 
            onClick={onClose} 
            aria-label="닫기" 
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                       text-gray-500 dark:text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">카테고리: {term.category}</p>

        <section className="mt-4">
          <h3 className="font-semibold text-purple-600 dark:text-purple-400">🎯 쉽게 비유한 설명</h3>
          <p className="mt-1 leading-relaxed text-gray-700 dark:text-gray-300">{term.easyExplanation}</p>
        </section>

        <section className="mt-4">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400">📚 실제 개발자 설명</h3>
          <p className="mt-1 leading-relaxed text-gray-700 dark:text-gray-300">{term.realExplanation}</p>
        </section>

        {term.exampleCode && (
          <section className="mt-4">
            <h3 className="font-semibold text-green-600 dark:text-green-400">💻 예시 코드</h3>
            <pre className="mt-2 rounded-lg bg-gray-900 text-gray-100 p-3 overflow-auto text-sm">
{term.exampleCode}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}

