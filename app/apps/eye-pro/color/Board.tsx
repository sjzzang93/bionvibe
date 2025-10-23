'use client';
import React, { useMemo, useState } from 'react';

// 개발 중 더미(고해상도 점무늬 + 숫자 오버레이) — 배포전 제거/비활성 권장
function DevPlateFallback({ number = '12' }: { number?: string }) {
  const dots = useMemo(() => Array.from({ length: 1200 }, (_, i) => i), []);
  return (
    <div className="relative w-full max-w-xs aspect-square border rounded-lg overflow-hidden bg-white mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {dots.map((i) => {
          const x = Math.random() * 300,
            y = Math.random() * 300,
            r = Math.random() * 2 + 1.5;
          const hue = 120 + Math.random() * 60; // 녹~적 사이
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={`hsl(${hue} 60% 50%)`}
              opacity="0.9"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[96px] font-black mix-blend-multiply opacity-60 select-none">
          {number}
        </span>
      </div>
      <div className="absolute bottom-1 right-2 text-[10px] text-neutral-500">
        DEV PLACEHOLDER
      </div>
    </div>
  );
}

export default function Board({
  src,
  expected,
  onSubmit,
}: {
  src?: string;
  expected?: string;
  onSubmit: (v: string) => void;
}) {
  const [v, setV] = useState('');

  return (
    <div className="my-4">
      {src ? (
        <img
          src={src}
          alt="Ishihara"
          className="w-full max-w-xs mx-auto rounded-lg border"
        />
      ) : (
        <DevPlateFallback number={expected || '12'} />
      )}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            onClick={() => onSubmit(String(i))}
            className="eye-touch rounded-lg border text-lg py-2 bg-white hover:bg-neutral-100 transition-colors"
          >
            {i}
          </button>
        ))}
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="직접입력"
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit(v)}
          className="col-span-3 border rounded-lg px-3 py-2"
        />
        <button
          onClick={() => onSubmit(v)}
          className="rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}

