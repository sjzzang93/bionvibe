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
        className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm w-[10px] h-[10px] sm:w-8 sm:h-8 flex items-center justify-center p-0"
      >
        <span className="text-[6px] sm:text-lg opacity-0 block leading-none">🤍</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => onToggle(appId, e)}
      className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-125 transition-transform w-[10px] h-[10px] sm:w-8 sm:h-8 flex items-center justify-center p-0"
    >
      <span className="text-[6px] sm:text-lg block leading-none">
        {isFavorite ? '❤️' : '🤍'}
      </span>
    </button>
  );
}
