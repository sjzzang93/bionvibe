'use client';

import { useEffect } from 'react';

interface GoogleAdSenseProps {
  publisherId: string;
}

export default function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  useEffect(() => {
    // 프로덕션 환경에서만 실행
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // AdSense 스크립트가 이미 로드되어 있는지 확인
    const existingScript = document.querySelector(
      `script[src*="adsbygoogle.js?client=${publisherId}"]`
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [publisherId]);

  return null;
}

