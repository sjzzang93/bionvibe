'use client';
import React from 'react';

// 2D SVG E-차트 (3D 라이브러리 없이 구현)
export default function EScene({ px, dir }: { px: number; dir: string }) {
  const rot =
    ({
      '↑': 0,
      '→': 90,
      '↓': 180,
      '←': 270,
      '↖': 315,
      '↗': 45,
      '↘': 135,
      '↙': 225,
    } as any)[dir] || 0;

  return (
    <div className="w-full eye-center my-4 eye-noselect">
      <div style={{ width: px, height: px }} className="relative">
        <div
          className="absolute inset-0 bg-black origin-center transition-transform duration-200"
          style={{ transform: `rotate(${rot}deg)` }}
        >
          {/* E 형태: 상중하 3획 + 좌측 기둥 */}
          <div className="absolute left-0 top-0 bottom-0 w-[20%] bg-white" />
          <div className="absolute left-0 top-0 h-[20%] right-0 bg-white" />
          <div className="absolute left-0 top-[40%] h-[20%] right-0 bg-white" />
          <div className="absolute left-0 bottom-0 h-[20%] right-0 bg-white" />
        </div>
      </div>
    </div>
  );
}

