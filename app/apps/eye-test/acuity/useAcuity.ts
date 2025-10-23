'use client';
import { useEffect, useMemo, useState } from 'react';
import data from '../data/visual-acuity-data.json';
import { saveResult } from '../utils/storage';

type Row = {
  label: string;
  e_mm: number;
  directions: string[];
};

export default function useAcuity(pxPerMm?: number | null) {
  const rows = data as Row[];
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<string>('↑');

  useEffect(() => {
    const dirs = ['↑', '↓', '←', '→', '↖', '↗', '↙', '↘'];
    setDir(dirs[Math.floor(Math.random() * dirs.length)]);
  }, [idx]);

  const current = rows[idx];
  const px = useMemo(() => {
    if (!pxPerMm) return 160;
    return Math.max(24, Math.round(current.e_mm * pxPerMm));
  }, [pxPerMm, current]);

  const pass = () => {
    if (idx < rows.length - 1) {
      setIdx((prev) => prev + 1);
    } else {
      finishTest(rows.length - 1);
    }
  };

  const fail = () => {
    finishTest(Math.max(idx - 1, 0));
  };

  const finishTest = (finalIdx: number) => {
    const score = rows[finalIdx].label;
    saveResult({
      kind: 'acuity',
      scoreLabel: `최대 ${score}`,
      raw: { idx: finalIdx },
      calibratedPxPerMm: pxPerMm || undefined,
      ts: Date.now(),
    });
    alert(`시력 검사 완료!\n결과: 최대 ${score}`);
    window.location.href = '/apps/eye-test';
  };

  return { idx, current, px, dir, pass, fail, total: rows.length };
}

