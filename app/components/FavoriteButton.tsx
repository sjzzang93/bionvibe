'use client';

import { useEffect, useState } from 'react';

interface FavoriteButtonProps {
  appId: string;
  onToggle: (appId: string, e: React.MouseEvent) => void;
  isFavorite: boolean;
}

export default function FavoriteButton({ appId, onToggle, isFavorite }: FavoriteButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8"
      >
        <span className="text-sm sm:text-base opacity-0 block leading-none filter brightness-75 contrast-125">🤍</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => onToggle(appId, e)}
      className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8"
      aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <span className="text-sm sm:text-base block leading-none filter brightness-75 contrast-125 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
        {isFavorite ? '❤️' : '🤍'}
      </span>
    </button>
  );
}
