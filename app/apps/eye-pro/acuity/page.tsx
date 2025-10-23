'use client';
import { useState } from 'react';
import useAcuity from './useAcuity';
import CalibrationCard from '../components/CalibrationCard';
import DistanceCoach from '../components/DistanceCoach';
import ZoomGuard from '../components/ZoomGuard';
import Disclaimer from '../components/Disclaimer';
import EScene from './EScene';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';

export default function AcuityPage() {
  const [ppm, setPpm] = useState<number | null>(null);
  const { idx, total, dir, px, current, pass, fail } = useAcuity(ppm);

  return (
    <PremiumLayout theme="blue" showStars={true}>
      <main className="max-w-md mx-auto px-3 pt-6 pb-20">
        <h2 className="text-2xl font-bold mb-1 text-white">시력 검사</h2>
        <p className="text-sm text-white/80 mb-3">
          밝은 곳에서, 화면과 눈의 거리를 약 40cm로 맞춘 뒤 진행하세요.
        </p>
        <ZoomGuard />
        <CalibrationCard onDone={setPpm} />
        <DistanceCoach />
        
        <div className="text-sm text-white/80 mb-2">
          단계 {idx + 1}/{total} · 목표 {current.label} · 방향 {dir}
        </div>
        
        <PremiumCard gradient hover>
          <EScene px={px} dir={dir} />
        </PremiumCard>
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={fail}
            className="eye-touch rounded-lg border bg-white/90 hover:bg-white transition-colors font-medium"
          >
            못 봤어요
          </button>
          <button
            onClick={pass}
            className="eye-touch rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors font-medium"
          >
            정확히 보여요
          </button>
        </div>
        
        <div className="mt-4">
          <Disclaimer />
        </div>
      </main>
    </PremiumLayout>
  );
}

