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
    <div className="px-3 py-3">
      <h3 className="font-semibold mb-2">최근 결과</h3>
      <ul className="space-y-2">
        {list.map((r, i) => (
          <li
            key={i}
            className="rounded-lg border p-3 text-sm flex items-center justify-between"
          >
            <div>
              <div className="font-medium">
                {kindLabels[r.kind] || r.kind} · {r.scoreLabel}
              </div>
              <div className="text-neutral-500 text-xs">
                {new Date(r.ts).toLocaleString('ko-KR')}
              </div>
            </div>
            <span className="text-xs text-neutral-500">
              {r.ppm ? '보정됨' : '미보정'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

