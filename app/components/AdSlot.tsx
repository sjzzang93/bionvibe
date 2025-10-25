'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

const DEFAULT_PUBLISHER_ID = 'ca-pub-4564769502264231';
const DEFAULT_SLOT_ID = '0000000000';

type AdSlotProps = {
  slotId?: string;
  layout?: 'display' | 'in-article' | 'in-feed';
  format?: string;
  className?: string;
  label?: string;
  minHeight?: number;
};

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

/**
 * 공용 애드센스 슬롯 컴포넌트.
 * - slotId가 유효하지 않으면 개발용 안내 문구를 보여줍니다.
 * - 프로덕션 환경에서만 adsbygoogle.push를 실행합니다.
 */
export default function AdSlot({
  slotId,
  layout = 'display',
  format = 'auto',
  className,
  label = 'ADVERTISEMENT',
  minHeight = 250,
}: AdSlotProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || DEFAULT_PUBLISHER_ID;
  const resolvedSlotId = slotId || DEFAULT_SLOT_ID;
  const hasValidConfig = resolvedSlotId !== DEFAULT_SLOT_ID && !!publisherId;
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!hasValidConfig) return;
    if (typeof window === 'undefined') return;

    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }

    if (!pushedRef.current) {
      try {
        window.adsbygoogle.push({});
        pushedRef.current = true;
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('[AdSlot] adsbygoogle push skipped:', error);
        }
      }
    }
  }, [hasValidConfig, resolvedSlotId]);

  return (
    <div
      className={clsx(
        'relative mx-auto w-full rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/80',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-gray-400 dark:text-gray-500">
        <span>{label}</span>
        <span>Google AdSense</span>
      </div>

      <div
        className="flex items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
        style={{ minHeight }}
      >
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={resolvedSlotId}
          data-ad-format={format}
          data-full-width-responsive="true"
          data-ad-layout={layout}
        />
      </div>

      {!hasValidConfig && (
        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          광고 슬롯 ID가 설정되지 않았어요. `NEXT_PUBLIC_ADSENSE_SLOT_*` 값을 지정한 뒤 다시 확인해주세요.
        </p>
      )}
    </div>
  );
}
