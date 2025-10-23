'use client';
import { useEffect, useMemo, useState } from 'react';
import plates from './plates.json';
import { saveResult } from '../utils/storage';

type Plate = { id: string; answer: string; src: string };

export default function useColor() {
  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    const arr = Array.from({ length: (plates as Plate[]).length }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr.slice(0, 14)); // 표준 단축형 14판
  }, []);

  const current = useMemo(
    () => (plates as Plate[])[order[idx]],
    [order, idx]
  );
  const total = order.length;

  const submit = (val: string) => {
    if (!current) return;
    const hit = val.trim() === current.answer;
    if (hit) setCorrect((c) => c + 1);
    
    if (idx + 1 >= total) {
      const finalCorrect = hit ? correct + 1 : correct;
      const score = `${finalCorrect}/${total}`;
      saveResult({
        kind: 'color',
        scoreLabel: score,
        raw: { total, correct: finalCorrect },
        ts: Date.now(),
      });
      alert(`색각 검사 완료!\n결과: ${score} 정답`);
      window.location.href = '/apps/eye-pro';
    } else {
      setIdx((i) => i + 1);
    }
  };

  return { current, idx, total, correct, submit };
}

