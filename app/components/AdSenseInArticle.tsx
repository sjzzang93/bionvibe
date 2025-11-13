'use client';

import { useEffect } from 'react';

interface AdSenseInArticleProps {
  className?: string;
}

export default function AdSenseInArticle({ className = '' }: AdSenseInArticleProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-4564769502264231"
        data-ad-slot="3721102248"
      />
    </div>
  );
}
