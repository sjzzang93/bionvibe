'use client';
import { useState } from 'react';
import EChart from './EChart';
import useAcuity from './useAcuity';
import CalibrationSheet from '../components/CalibrationSheet';
import Disclaimer from '../components/Disclaimer';

export default function AcuityPage() {
  const [ppm, setPpm] = useState<number | null>(null);
  const { idx, current, px, dir, pass, fail, total } = useAcuity(ppm);

  return (
    <main className="max-w-md mx-auto px-3 pt-4 pb-20">
      <h2 className="text-2xl font-bold mb-2">시력 검사 (E 차트)</h2>
      <p className="text-sm text-neutral-600 mb-4">
        조용하고 밝은 곳에서, 눈과 화면 거리를 약 40cm로 유지하세요.
      </p>

      <CalibrationSheet onCalibrated={setPpm} />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div className="text-sm text-blue-800 font-medium mb-1">
          단계 {idx + 1}/{total}
        </div>
        <div className="text-lg font-bold text-blue-900">
          목표 시력: {current.label}
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 mb-4">
        <EChart sizePx={px} direction={dir} />
        <p className="text-center text-sm text-neutral-500">
          E 자의 방향을 확인하세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={fail}
          className="eye-touch-target rounded-xl border-2 border-neutral-300 bg-white font-medium py-3 hover:bg-neutral-50 transition-colors"
        >
          ❌ 못 봤어요
        </button>
        <button
          onClick={pass}
          className="eye-touch-target rounded-xl bg-black text-white font-medium py-3 hover:bg-neutral-800 transition-colors"
        >
          ✅ 정확히 보여요
        </button>
      </div>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </main>
  );
}

