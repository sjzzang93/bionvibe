'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface GoogleAdSenseProps {
  publisherId: string;
}

export default function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!publisherId) return;
    if (pathname?.startsWith('/secret')) return;

    let cancelled = false;
    let retryId: NodeJS.Timeout | number | undefined;

    const ensureAdSlotExists = () =>
      document.querySelector('.adsbygoogle, [data-google-ads-slot], ins[data-ad-slot]');

    const injectScript = () => {
      if (cancelled) return;
      const existing = document.querySelector(
        `script[src*="adsbygoogle.js?client=${publisherId}"]`,
      );
      if (existing) return;

      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    };

    const attemptInjection = () => {
      if (cancelled) return;

      if (ensureAdSlotExists()) {
        if ('requestIdleCallback' in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(
            () => injectScript(),
          );
        } else {
          const timerId = setTimeout(injectScript, 1000);
          retryId = timerId as any;
        }
      } else {
        const timerId = setTimeout(attemptInjection, 1200);
        retryId = timerId as any;
      }
    };

    if (document.readyState === 'complete') {
      attemptInjection();
    } else {
      window.addEventListener('load', attemptInjection, { once: true });
    }

    return () => {
      cancelled = true;
      if (retryId) {
        window.clearTimeout(retryId);
      }
      window.removeEventListener('load', attemptInjection);
    };
  }, [publisherId, pathname]);

  return null;
}
