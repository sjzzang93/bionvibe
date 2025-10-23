'use client';
import { useEffect, useState } from 'react';

export default function MobileGuard() {
  const [msg, setMsg] = useState<string | null>(null);
  
  useEffect(() => {
    if (window.innerWidth > 768) {
      setMsg(
        '모바일에서 정확도가 더 높습니다. PC에서는 100% 배율/정면에서 테스트를 권장합니다.'
      );
    }
  }, []);

  if (!msg) return null;
  
  return <div className="px-3 py-2 text-xs text-amber-600">{msg}</div>;
}

