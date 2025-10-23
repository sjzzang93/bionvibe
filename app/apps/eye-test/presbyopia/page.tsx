'use client';
import { useState } from 'react';
import usePresbyopia from './usePresbyopia';
import CalibrationSheet from '../components/CalibrationSheet';
import Disclaimer from '../components/Disclaimer';

export default function PresbyopiaPage() {
  const { current, idx, levels, next, prev, done } = usePresbyopia();
  const [ppm, setPpm] = useState<number | null>(null);

  return (
    <main className="max-w-md mx-auto px-3 pt-4 pb-20">
      <h2 className="text-2xl font-bold mb-2">노안 검사 (근거리)</h2>
      <p className="text-sm text-neutral-600 mb-4">
        화면을 약 40cm 거리에서, 안경/렌즈를 평소처럼 착용하고 읽어보세요.
      </p>

      <CalibrationSheet onCalibrated={setPpm} />

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
        <div className="text-sm text-purple-800 font-medium mb-1">
          단계 {idx + 1}/{levels.length}
        </div>
        <div className="text-lg font-bold text-purple-900">{current.label}</div>
      </div>

      <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 mb-4">
        <p className="text-xs text-neutral-500 text-center mb-4">
          글자 크기를 바꾸면서 가장 편하게 읽히는 구간을 찾으세요
        </p>
        <div className="text-center py-6">
          <p style={{ fontSize: `${current.pt}px` }} className="font-medium">
            {current.line}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="eye-touch-target rounded-xl border-2 border-neutral-300 bg-white font-medium py-3 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← 작게
        </button>
        <button
          onClick={done}
          className="rounded-xl bg-black text-white font-medium py-3 hover:bg-neutral-800 transition-colors"
        >
          ✓ 이 크기
        </button>
        <button
          onClick={next}
          disabled={idx === levels.length - 1}
          className="eye-touch-target rounded-xl border-2 border-neutral-300 bg-white font-medium py-3 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          크게 →
        </button>
      </div>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </main>
  );
}

