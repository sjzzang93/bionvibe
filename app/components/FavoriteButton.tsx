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
        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center p-0"
      >
        <span className="text-[10px] sm:text-xs opacity-0 block" style={{ lineHeight: '1', marginTop: '-1px' }}>🤍</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => onToggle(appId, e)}
      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center p-0"
    >
      <span className="text-[10px] sm:text-xs block" style={{ lineHeight: '1', marginTop: '-1px' }}>
        {isFavorite ? '❤️' : '🤍'}
      </span>
    </button>
  );
}
