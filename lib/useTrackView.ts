import { useEffect } from 'react';

/**
 * 앱 조회수 추적 훅
 * 앱 페이지에 진입하면 자동으로 조회수를 증가시킵니다.
 */
export function useTrackView(appId: string) {
  useEffect(() => {
    if (!appId) return;

    const trackView = async () => {
      try {
        await fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ appId }),
        });
      } catch (error) {
        // 조회수 추적 실패는 무시 (사용자 경험에 영향 없음)
        console.error('Failed to track view:', error);
      }
    };

    trackView();
  }, [appId]);
}
