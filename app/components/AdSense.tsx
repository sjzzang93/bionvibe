'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  className?: string;
}

export default function AdSense({ className = '' }: AdSenseProps) {
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
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4564769502264231"
        data-ad-slot="8553792374"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
