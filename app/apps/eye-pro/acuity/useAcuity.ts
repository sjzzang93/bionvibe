'use client';
import { useEffect, useMemo, useState } from 'react';
import rows from './data.json';
import { saveResult } from '../utils/storage';

type Row = { label: string; e_mm: number };
const DIRS = ['↑', '→', '↓', '←', '↖', '↗', '↘', '↙'] as const;
type Dir = (typeof DIRS)[number];

export default function useAcuity(ppm?: number | null) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<Dir>('↑');

  useEffect(() => {
    setDir(DIRS[Math.floor(Math.random() * DIRS.length)]);
  }, [idx]);

  const current = rows[idx] as Row;
  const px = useMemo(
    () => (!ppm ? 160 : Math.max(24, Math.round(current.e_mm * ppm))),
    [ppm, current]
  );

  const pass = () => setIdx((i) => Math.min(i + 1, rows.length - 1));
  
  const fail = () => {
    const score = rows[Math.max(idx - 1, 0)].label;
    saveResult({
      kind: 'acuity',
      scoreLabel: `최대 ${score}`,
      raw: { idx, dir },
      ppm: ppm || undefined,
      ts: Date.now(),
    });
    alert(`시력 검사 완료!\n결과: 최대 ${score}`);
    window.location.href = '/apps/eye-pro';
  };

  return { idx, total: rows.length, dir, px, current, pass, fail };
}

