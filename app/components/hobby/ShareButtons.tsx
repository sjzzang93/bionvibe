'use client';

import React, { useState } from 'react';

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={handleCopy}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
      >
        {copied ? (
          <span className="flex items-center gap-2">
            ✅ 링크 복사됨!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            🔗 결과 링크 복사
          </span>
        )}

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        친구들과 결과를 공유해보세요!
      </p>
    </div>
  );
}

