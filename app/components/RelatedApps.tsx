'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface App {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  url: string;
  image?: string;
}

interface RelatedAppsProps {
  currentAppSlug: string;
  className?: string;
}

export default function RelatedApps({ currentAppSlug, className = '' }: RelatedAppsProps) {
  const [relatedApps, setRelatedApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedApps = async () => {
      try {
        const response = await fetch('/api/apps/related?slug=' + currentAppSlug);
        const data = await response.json();
        setRelatedApps(data.relatedApps || []);
      } catch (error) {
        console.error('관련 앱 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedApps();
  }, [currentAppSlug]);

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border-2 border-rose-200 dark:border-rose-900">
          <div className="text-center text-gray-500 dark:text-gray-400">
            관련 앱 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (relatedApps.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border-2 border-rose-200 dark:border-rose-900">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            🎯 이런 앱도 있어요!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            비슷한 관심사를 가진 분들이 함께 사용한 앱이에요
          </p>
        </div>

        {/* 추천 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedApps.map((app) => (
            <Link
              key={app.id}
              href={app.url}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:border-rose-500 dark:hover:border-rose-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* 앱 이미지 (있으면) */}
              {app.image && (
                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={app.image}
                    alt={app.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-4xl">
                    {app.icon}
                  </div>
                </div>
              )}

              {/* 이미지 없을 때 아이콘만 */}
              {!app.image && (
                <div className="flex justify-center mb-3">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {app.icon}
                  </span>
                </div>
              )}

              {/* 앱 정보 */}
              <div className="text-center">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base md:text-lg group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {app.description}
                </p>
              </div>

              {/* 화살표 아이콘 */}
              <div className="absolute top-3 right-3 text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 dark:from-rose-500 dark:to-pink-500 dark:hover:from-rose-600 dark:hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            모든 앱 보러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
