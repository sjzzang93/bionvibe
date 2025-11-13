'use client';

import { useEffect } from 'react';

interface AdSenseMultiplexProps {
  className?: string;
}

export default function AdSenseMultiplex({ className = '' }: AdSenseMultiplexProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-4564769502264231"
        data-ad-slot="6706072820"
      />
    </div>
  );
}
