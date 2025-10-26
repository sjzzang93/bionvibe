'use client';

import React from 'react';
import Link from 'next/link';
import { clearState } from '@/lib/hobby-storage';

export default function HobbyFinderPage() {
  const handleStart = () => {
    clearState();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 text-7xl animate-bounce">🎯</div>

          <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent dark:from-purple-400 dark:to-pink-400 md:text-6xl">
            성향별 취미 찾기
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            5단계 점진적 질문으로 당신의 성향을 분석하고,
            <br />
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              딱 맞는 취미를 추천
            </span>
            해드립니다
          </p>

          <Link
            href="/apps/hobby-finder/test"
            onClick={handleStart}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-5 text-xl font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-purple-500/50"
          >
            <span>시작하기</span>
            <span className="text-2xl transition-transform group-hover:translate-x-2">→</span>

            {/* Animated Glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <div
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            style={{
              transform: 'translateZ(0)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="mb-4 text-5xl">📊</div>
            <h3 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white">점진적 테스트</h3>
            <p className="text-gray-600 dark:text-gray-400">
              5가지 성향 축을 단계별로 측정하여 정확한 성향을 파악합니다
            </p>

            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            style={{
              transform: 'translateZ(0)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="mb-4 text-5xl">✨</div>
            <h3 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white">맞춤 추천</h3>
            <p className="text-gray-600 dark:text-gray-400">
              40개 이상의 취미 중에서 당신에게 딱 맞는 6~8개를 추천합니다
            </p>

            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            style={{
              transform: 'translateZ(0)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="mb-4 text-5xl">💡</div>
            <h3 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white">시작 가이드</h3>
            <p className="text-gray-600 dark:text-gray-400">
              각 취미별 난이도, 비용, 시간과 함께 시작 팁을 제공합니다
            </p>

            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>

        {/* Info Section */}
        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-gray-200 bg-white/50 p-8 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
          <h3 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
            5가지 성향 축
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-4 dark:from-orange-900/20 dark:to-red-900/20">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-gray-800 dark:text-white">에너지</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">활동적 ↔ 안정형</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:from-blue-900/20 dark:to-cyan-900/20">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="font-bold text-gray-800 dark:text-white">집중</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">몰입형 ↔ 탐색형</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-4 dark:from-pink-900/20 dark:to-rose-900/20">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span className="font-bold text-gray-800 dark:text-white">사회성</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">교류형 ↔ 개인형</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4 dark:from-purple-900/20 dark:to-indigo-900/20">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">💖</span>
                <span className="font-bold text-gray-800 dark:text-white">감성</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">감성형 ↔ 논리형</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:from-green-900/20 dark:to-emerald-900/20 sm:col-span-2">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">🌳</span>
                <span className="font-bold text-gray-800 dark:text-white">환경</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">실외/손 ↔ 실내/머리</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            ⏱️ 소요 시간: 약 3~5분 | 📝 질문 수: 35개
          </p>

          <Link
            href="/apps/hobby-finder/test"
            onClick={handleStart}
            className="inline-flex items-center gap-2 text-lg font-semibold text-purple-600 transition-colors hover:text-pink-600 dark:text-purple-400 dark:hover:text-pink-400"
          >
            <span>지금 시작하기</span>
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

