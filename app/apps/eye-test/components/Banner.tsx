'use client';
import React from 'react';

export default function Banner({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div className="w-full eye-safe-text my-2">
      {/* ✅ 쿠팡 파트너스 배너 자리 */}
      <a
        href="https://link.coupang.com/a/cWnV0s"
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="unsafe-url"
      >
        <img
          className="w-full h-auto rounded-lg"
          src="https://ads-partners.coupang.com/banners/931156?subId=&traceId=V0-301-879dd1202e5c73b2-I931156&w=728&h=90"
          alt="Ad banner"
        />
      </a>
    </div>
  );
}

