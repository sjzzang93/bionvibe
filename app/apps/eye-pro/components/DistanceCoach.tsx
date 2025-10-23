'use client';
import { useMemo, useState } from 'react';
import { bandFromMm } from '../utils/distance';

export default function DistanceCoach() {
  const [mm, setMm] = useState<number | ''>('');
  const band = useMemo(
    () => bandFromMm(typeof mm === 'number' ? mm : undefined),
    [mm]
  );
  const text = {
    unknown: '권장 거리 40cm. 줄자/책상 눈금 등으로 자가 확인해주세요.',
    tooClose: '가까움(정확도↓). 기기를 더 멀리(약 40cm) 이동하세요.',
    optimal: '적정 거리 범위예요. 그대로 진행해도 좋아요.',
    tooFar: '너무 멀어요. 약간 가까이 이동하세요.',
  }[band];

  return (
    <div className="rounded-xl border p-3 my-3">
      <div className="text-sm font-medium">거리 가이드</div>
      <p className="text-xs text-neutral-600 mt-1">{text}</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={mm}
          onChange={(e) => {
            const v = e.target.value;
            setMm(v === '' ? '' : Math.max(0, Number(v)));
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="자가 측정 거리(mm)"
          className="border rounded px-2 py-1 text-sm w-40"
        />
        <span className="text-xs text-neutral-500">예: 400</span>
      </div>
    </div>
  );
}

