'use client';
import { useState } from 'react';
import usePresbyopia from './usePresbyopia';
import CalibrationCard from '../components/CalibrationCard';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';

export default function PresbyopiaPage() {
  const { levels, idx, current, next, prev, done } = usePresbyopia();
  const [ppm, setPpm] = useState<number | null>(null);

  return (
    <PremiumLayout theme="green" showStars={true}>
      <main className="max-w-md mx-auto px-3 pt-6 pb-20">
        <h2 className="text-2xl font-bold mb-1 text-white">노안 검사 (근거리)</h2>
        <p className="text-sm text-white/80">
          약 40cm 거리에서 가장 편하게 읽히는 크기를 선택하세요.
        </p>

        <CalibrationCard onDone={setPpm} />
        
        <div className="text-sm text-white/80">
          단계 {idx + 1}/{levels.length} · {current.label}
        </div>

        <PremiumCard gradient hover className="mt-2">
          <div className="text-center py-6">
            <p
              style={{ fontSize: `${current.pt}px`, lineHeight: 1.4 }}
              className="text-white font-medium"
            >
              {current.line}
            </p>
          </div>
        </PremiumCard>

        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="rounded-lg border py-2 bg-white/90 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            작게
          </button>
          <button
            onClick={done}
            className="rounded-lg bg-black text-white py-2 hover:bg-neutral-800 transition-colors"
          >
            이 크기 좋아요
          </button>
          <button
            onClick={next}
            disabled={idx === levels.length - 1}
            className="rounded-lg border py-2 bg-white/90 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            크게
          </button>
        </div>
      </main>
    </PremiumLayout>
  );
}

