'use client';
import React, { useState } from 'react';

export default function IshiharaBoard({
  plate,
  onSubmit,
}: {
  plate: { id: string; answer: string; colors: string[]; bgColors: string[] };
  onSubmit: (v: string) => void;
}) {
  const [v, setV] = useState('');

  const handleSubmit = () => {
    if (v.trim()) {
      onSubmit(v);
      setV('');
    }
  };

  return (
    <div className="my-4">
      {/* 색맹 검사판 SVG */}
      <div className="inline-block relative w-full max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-neutral-200 bg-white">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 320"
          className="w-full h-auto"
        >
          {/* 배경 점들 */}
          {Array.from({ length: 200 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 150;
            const cx = 160 + Math.cos(angle) * radius;
            const cy = 160 + Math.sin(angle) * radius;
            const size = 8 + Math.random() * 8;
            const bgColor =
              plate.bgColors[Math.floor(Math.random() * plate.bgColors.length)];
            return (
              <circle key={`bg-${i}`} cx={cx} cy={cy} r={size} fill={bgColor} />
            );
          })}
          {/* 숫자 형성 점들 */}
          <text
            x="160"
            y="190"
            fontSize="120"
            fontWeight="bold"
            textAnchor="middle"
            fill={plate.colors[0]}
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {plate.answer}
          </text>
        </svg>
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {[...Array(10)].map((_, i) => (
            <button
              key={i}
              onClick={() => onSubmit(String(i))}
              className="eye-touch-target rounded-lg border-2 border-neutral-300 bg-white text-lg font-semibold py-3 hover:bg-neutral-100 transition-colors"
            >
              {i}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="직접입력"
            value={v}
            onChange={(e) => setV(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="col-span-3 border-2 border-neutral-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-black"
          />
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

