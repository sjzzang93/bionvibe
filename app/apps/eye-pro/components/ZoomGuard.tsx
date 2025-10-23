'use client';
import { useEffect, useState } from 'react';

export default function ZoomGuard() {
  const [warn, setWarn] = useState(false);
  
  useEffect(() => {
    const check = () => {
      setWarn(
        Math.abs(window.devicePixelRatio - Math.round(window.devicePixelRatio)) >
          0.01
      );
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!warn) return null;
  
  return (
    <div className="px-3 py-2 text-xs text-red-600">
      브라우저 확대/축소 감지됨 — 배율 100% 권장(정확도 영향)
    </div>
  );
}

