'use client';
import { useMemo, useState } from 'react';
import fonts from '../data/presbyopia-fonts.json';
import { saveResult } from '../utils/storage';

type Row = { label: string; pt: number; line: string };

export default function usePresbyopia() {
  const levels = fonts as Row[];
  const [idx, setIdx] = useState(2); // 시작은 "보통" (인덱스 2)
  const current = useMemo(() => levels[idx], [idx]);
  
  const next = () => setIdx((i) => Math.min(i + 1, levels.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));
  
  const done = () => {
    const score = levels[idx].label;
    saveResult({
      kind: 'presbyopia',
      scoreLabel: score,
      raw: { idx },
      ts: Date.now(),
    });
    alert(`노안 검사 완료!\n결과: ${score}`);
    window.location.href = '/apps/eye-test';
  };
  
  return { levels, idx, current, next, prev, done };
}

