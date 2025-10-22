'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import StickyCategoryBar from './_components/StickyCategoryBar';
import TermCard from './_components/TermCard';
import TermModal from './_components/TermModal';
import { DevTerm } from './_lib/types';
import { matches, byCategory } from './_lib/filter';

export default function DevGlossaryPage() {
  const [terms, setTerms] = useState<DevTerm[]>([]);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('ALL');
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<DevTerm | undefined>(undefined);

  // 데이터 로드(API 분리)
  useEffect(() => {
    fetch('/api/dev-terms')
      .then((r) => r.json())
      .then((json) => setTerms(json.terms ?? []))
      .catch(() => setTerms([]));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(terms.map((t) => t.category));
    return Array.from(set).sort();
  }, [terms]);

  const filtered = useMemo(
    () => terms.filter((t) => matches(t, query) && byCategory(t, cat)),
    [terms, query, cat]
  );

  function onOpen(t: DevTerm) { setCurrent(t); setOpen(true); }
  function onClose() { setOpen(false); setCurrent(undefined); }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 
                     dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        {/* 뒤로가기 링크 */}
        <Link 
          href="/secret" 
          className="inline-flex items-center text-purple-600 dark:text-purple-400 
                     hover:text-purple-700 dark:hover:text-purple-300 mb-6 transition-colors"
        >
          ← Secret Vault로 돌아가기
        </Link>

        {/* 페이지 타이틀 */}
        <header className="mb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            📖 개발자 용어 사전
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            비유 + 실제 설명을 한 번에. 초등학생도 이해하는 개발 용어.
          </p>
        </header>

        {/* 검색바 */}
        <div className="mb-3">
          <label htmlFor="q" className="sr-only">검색</label>
          <input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 용어/설명을 입력하세요... (예: React, API, Migration)"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                       px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* 카테고리 스티키 바 */}
        <StickyCategoryBar
          categories={categories}
          active={cat}
          onSelect={setCat}
        />

        {/* 리스트 */}
        <section className="mt-4 grid grid-cols-1 gap-3">
          {filtered.map((t) => (
            <TermCard key={t.id} term={t} onOpen={onOpen} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">😢 결과가 없습니다.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                다른 검색어나 카테고리를 시도해보세요.
              </p>
            </div>
          )}
        </section>

        {/* 모달 */}
        <TermModal open={open} term={current} onClose={onClose} />

        {/* 푸터 고지(쿠팡 고지 포함) */}
        <footer className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 
                           text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2025 BION VIBE. All rights reserved.</p>
          <p className="mt-1">
            본 페이지는 쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 받을 수 있습니다.
          </p>
        </footer>
      </div>
    </main>
  );
}

