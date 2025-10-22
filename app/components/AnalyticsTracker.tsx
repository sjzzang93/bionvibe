'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabase';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const supabase = getBrowserSupabase();
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pageViewsRef = useRef<number>(0);

  // 세션 ID 생성 또는 가져오기
  const getOrCreateSessionId = () => {
    if (sessionIdRef.current) return sessionIdRef.current;

    // localStorage에서 세션 ID 확인
    let sessionId = localStorage.getItem('analytics_session_id');
    const sessionExpiry = localStorage.getItem('analytics_session_expiry');

    // 세션이 없거나 만료된 경우 새로 생성
    if (!sessionId || !sessionExpiry || Date.now() > parseInt(sessionExpiry)) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // 30분 유효 세션
      const expiry = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('analytics_session_id', sessionId);
      localStorage.setItem('analytics_session_expiry', expiry.toString());
    }

    sessionIdRef.current = sessionId;
    return sessionId;
  };

  // 브라우저 정보 감지
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';
    let deviceType = 'Desktop';

    // 브라우저 감지
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';

    // OS 감지
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    // 디바이스 타입 감지
    if (/Mobile|Android|iPhone/i.test(ua)) deviceType = 'Mobile';
    else if (/iPad|Tablet/i.test(ua)) deviceType = 'Tablet';

    return { browser, os, deviceType };
  };

  // 페이지 방문 기록
  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    const { browser, os, deviceType } = getBrowserInfo();
    pageViewsRef.current += 1;

    const trackVisit = async () => {
      try {
        // 기존 세션 확인
        const { data: existingSession } = await supabase
          .from('analytics')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (existingSession) {
          // 기존 세션 업데이트 (페이지뷰 증가)
          await supabase
            .from('analytics')
            .update({
              page_views: (existingSession.page_views || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('session_id', sessionId);
        } else {
          // 새 세션 생성
          await supabase.from('analytics').insert({
            session_id: sessionId,
            user_agent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            page_views: 1,
            device_type: deviceType,
            browser,
            os,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        // 에러 무시 (analytics 실패해도 사용자 경험에 영향 없도록)
        console.debug('Analytics tracking skipped:', error);
      }
    };

    trackVisit();

    // 페이지 로드 시간 기록
    startTimeRef.current = Date.now();

    // 페이지 떠날 때 체류시간 업데이트
    const handleBeforeUnload = async () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000); // 초 단위
      
      if (duration > 0) {
        try {
          // Beacon API 사용 (페이지 언로드 시에도 요청 보장)
          const { data: existingSession } = await supabase
            .from('analytics')
            .select('duration')
            .eq('session_id', sessionId)
            .single();

          const totalDuration = (existingSession?.duration || 0) + duration;

          await supabase
            .from('analytics')
            .update({
              duration: totalDuration,
              updated_at: new Date().toISOString(),
            })
            .eq('session_id', sessionId);
        } catch (error) {
          console.debug('Duration tracking skipped:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null; // UI 없음
}

