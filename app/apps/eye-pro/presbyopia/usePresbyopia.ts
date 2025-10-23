'use client';
import { useMemo, useState } from 'react';
import rows from './data.json';
import { saveResult } from '../utils/storage';

type Row = { label: string; pt: number; line: string };

export default function usePresbyopia() {
  const [idx, setIdx] = useState(0);
  const levels = rows as Row[];
  const current = useMemo(() => levels[idx], [idx, levels]);
  
  const next = () => setIdx((i) => Math.min(i + 1, levels.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));
  
  const done = () => {
    saveResult({
      kind: 'presbyopia',
      scoreLabel: levels[idx].label,
      raw: { idx },
      ts: Date.now(),
    });
    alert(`노안 검사 완료!\n결과: ${levels[idx].label}`);
    window.location.href = '/apps/eye-pro';
  };

  return { levels, idx, current, next, prev, done };
}

