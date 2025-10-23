'use client';
import { useEffect, useMemo, useState } from 'react';
import plates from '../data/ishihara-plates.json';
import { saveResult } from '../utils/storage';

type Plate = {
  id: string;
  answer: string;
  colors: string[];
  bgColors: string[];
};

export default function useColorTest() {
  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    const arr = Array.from(
      { length: (plates as Plate[]).length },
      (_, i) => i
    );
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr.slice(0, Math.min(14, arr.length)));
  }, []);

  const current = useMemo(
    () => (order.length > 0 ? (plates as Plate[])[order[idx]] : null),
    [order, idx]
  );
  const total = order.length;

  const submit = (val: string) => {
    if (!current) return;
    const isCorrect = val.trim() === current.answer;
    if (isCorrect) setCorrect((c) => c + 1);

    if (idx + 1 >= total) {
      const finalScore = correct + (isCorrect ? 1 : 0);
      const score = `${finalScore}/${total}`;
      saveResult({
        kind: 'color',
        scoreLabel: score,
        raw: { total, correct: finalScore },
        ts: Date.now(),
      });
      alert(`색각 검사 완료!\n결과: ${score} 정답`);
      window.location.href = '/apps/eye-test';
    } else {
      setIdx((i) => i + 1);
    }
  };

  return { current, idx, total, correct, submit };
}

