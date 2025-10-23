'use client';

import { useEffect, useState } from 'react';

interface Star {
  left: number;
  top: number;
  width: number;
  height: number;
  animationDelay: number;
  animationDuration: number;
  translateZ: number;
  opacity: number;
}

export default function FloatingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // 클라이언트에서만 별 생성
    const generatedStars = Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: 1 + Math.random() * 3,
      height: 1 + Math.random() * 3,
      animationDelay: Math.random() * 5,
      animationDuration: 3 + Math.random() * 4,
      translateZ: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.7,
    }));
    setStars(generatedStars);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-float-3d"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.width}px`,
            height: `${star.height}px`,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: `${star.animationDuration}s`,
            transform: `translateZ(${star.translateZ}px)`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}

