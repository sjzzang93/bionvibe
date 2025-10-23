'use client';
import { useEffect, useState } from 'react';

export default function MobileGuard() {
  const [tip, setTip] = useState<string | null>(null);
  
  useEffect(() => {
    const w = window.innerWidth;
    if (w > 640) {
      setTip(
        '모바일 화면에서 가장 정확합니다. PC에서는 크롬 100% 배율을 권장해요.'
      );
    }
  }, []);

  if (!tip) return null;

  return <div className="px-3 py-2 text-xs text-amber-600 bg-amber-50 rounded-lg mx-3 my-2">{tip}</div>;
}

