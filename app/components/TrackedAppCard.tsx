"use client";

import Link from 'next/link';
import { ReactNode } from 'react';

interface TrackedAppCardProps {
  appId: string;
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * 조회수를 자동으로 추적하는 앱 카드 래퍼
 * Link 클릭 시 자동으로 조회수 증가
 */
export default function TrackedAppCard({ appId, href, children, className }: TrackedAppCardProps) {
  const handleClick = async (e: React.MouseEvent) => {
    // 조회수 추적 (비동기, 사용자 경험에 영향 없음)
    trackView(appId);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}

/**
 * 조회수 추적 함수 (재시도 로직 포함)
 */
async function trackView(appId: string, retries = 2) {
  try {
    const response = await fetch('/api/track-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appId }),
    });

    if (!response.ok && retries > 0) {
      // 실패 시 재시도
      setTimeout(() => trackView(appId, retries - 1), 500);
    } else if (process.env.NODE_ENV === 'development') {
      // 개발 환경에서만 로그 출력
      const data = await response.json();
      console.log(`✅ View tracked: ${appId}`, data);
    }
  } catch (error) {
    if (retries > 0) {
      // 에러 발생 시 재시도
      setTimeout(() => trackView(appId, retries - 1), 500);
    } else if (process.env.NODE_ENV === 'development') {
      console.error('❌ Failed to track view:', appId, error);
    }
  }
}
