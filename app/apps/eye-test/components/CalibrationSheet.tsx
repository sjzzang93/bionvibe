'use client';
import { useEffect, useRef, useState } from 'react';
import { inferPxPerMmFromCard } from '../utils/calibration';

export default function CalibrationSheet({
  onCalibrated,
}: {
  onCalibrated: (pxPerMm: number) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState(300);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setPx((prev) => Math.max(80, Math.min(600, prev + (e.deltaY > 0 ? -2 : 2))));
    };
    const el = boxRef.current;
    el?.addEventListener('wheel', onWheel, { passive: false });
    return () => el?.removeEventListener('wheel', onWheel);
  }, []);

  const handleOk = () => {
    const ppm = inferPxPerMmFromCard(px);
    if (ppm) onCalibrated(ppm);
  };

  return (
    <div className="rounded-xl border border-neutral-200 p-4 my-4 bg-white">
      <h3 className="font-semibold text-lg mb-2">화면 보정 (필수 권장)</h3>
      <p className="text-sm text-neutral-600 mb-4">
        신용카드를 화면에 대고, 아래 막대의 길이를 카드의 긴 변(85.6mm)과 동일하게
        휠/핀치로 맞춰주세요.
      </p>
      <div ref={boxRef} className="eye-center my-6">
        <div
          style={{ width: px, height: 16 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg"
        />
      </div>
      <p className="text-xs text-neutral-500 text-center mb-4">
        현재 길이: {px}px
      </p>
      <button
        onClick={handleOk}
        className="w-full eye-touch-target rounded-lg bg-black text-white text-base font-medium py-3 hover:bg-neutral-800 transition-colors"
      >
        ✓ 이 길이가 카드와 같아요
      </button>
    </div>
  );
}

