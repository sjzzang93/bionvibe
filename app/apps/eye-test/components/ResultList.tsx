'use client';
import { loadResults } from '../utils/storage';
import { useEffect, useState } from 'react';

const kindLabels: Record<string, string> = {
  acuity: '시력',
  color: '색각',
  presbyopia: '노안',
};

export default function ResultList() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setList(loadResults());
  }, []);

  if (!list.length) return null;

  return (
    <div className="px-3 py-4">
      <h3 className="font-semibold text-lg mb-3">최근 결과</h3>
      <ul className="space-y-2">
        {list.map((r, i) => (
          <li
            key={i}
            className="rounded-xl border border-neutral-200 p-4 flex items-center justify-between bg-white hover:bg-neutral-50 transition-colors"
          >
            <div>
              <div className="font-medium text-base">
                {kindLabels[r.kind] || r.kind} · {r.scoreLabel}
              </div>
              <div className="text-sm text-neutral-500">
                {new Date(r.ts).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                r.calibratedPxPerMm
                  ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {r.calibratedPxPerMm ? '보정됨' : '미보정'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

