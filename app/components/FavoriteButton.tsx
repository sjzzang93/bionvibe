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
      <button className="absolute top-1.5 right-1.5 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-1 shadow-sm w-6 h-6">
        <span className="text-sm opacity-0">🤍</span>
      </button>
    );
  }

  return (
    <button
      onClick={(e) => onToggle(appId, e)}
      className="absolute top-1.5 right-1.5 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
    >
      <span className="text-sm">{isFavorite ? '❤️' : '🤍'}</span>
    </button>
  );
}

