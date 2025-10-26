import * as React from 'react';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/lib/copy';

interface ShareButtonsProps {
  className?: string;
}

export function ShareButtons({ className }: ShareButtonsProps) {
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({ url, title: '성향별 취미 찾기' });
        setStatus('success');
        return;
      } catch {
        // fallthrough to clipboard
      }
    }

    const copied = await copyTextToClipboard(url);
    setStatus(copied ? 'success' : 'error');

    setTimeout(() => setStatus('idle'), 2500);
  };

  return (
    <div className={className}>
      <Button onClick={handleShare} variant="primary" size="md" fullWidth>
        결과 공유하기
      </Button>
      <p
        role="status"
        className="mt-2 min-h-[1.5rem] text-center text-sm text-amber-700/80 dark:text-amber-200/80"
      >
        {status === 'success'
          ? '링크가 복사되었어요!'
          : status === 'error'
            ? '복사에 실패했어요. 다시 시도해주세요.'
            : '친구에게 결과를 공유해보세요.'}
      </p>
    </div>
  );
}

