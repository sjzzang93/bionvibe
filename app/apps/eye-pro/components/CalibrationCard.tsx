'use client';
import { useEffect, useRef, useState } from 'react';
import { inferPxPerMm } from '../utils/calibration';

export default function CalibrationCard({
  onDone,
}: {
  onDone: (ppm: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState(300);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setPx((v) => Math.max(100, v + (e.deltaY > 0 ? -4 : 4)));
    };
    const el = barRef.current;
    el?.addEventListener('wheel', onWheel, { passive: false });
    return () => el?.removeEventListener('wheel', onWheel);
  }, []);

  const ok = () => {
    const ppm = inferPxPerMm(px);
    if (ppm) onDone(ppm);
  };

  return (
    <div className="rounded-xl border p-3 my-3">
      <h3 className="font-semibold">화면 보정(필수 권장)</h3>
      <p className="text-sm text-neutral-600">
        신용카드 긴 변(85.6mm)과 아래 막대 길이가 동일하도록 휠/핀치로 맞춰주세요.
      </p>
      <div ref={barRef} className="eye-center my-4">
        <div style={{ width: px, height: 12 }} className="bg-black rounded" />
      </div>
      <button
        onClick={ok}
        className="w-full eye-touch rounded-lg bg-black text-white text-sm py-2"
      >
        이 길이가 카드와 같아요
      </button>
    </div>
  );
}

