// 웹만으로 '정밀 자동 거리 측정'은 불가 → 권장거리 UX 제공(40cm).
export type DistBand = 'tooClose' | 'optimal' | 'tooFar' | 'unknown';

export const bandFromMm = (mm?: number): DistBand => {
  if (!mm) return 'unknown';
  if (mm < 300) return 'tooClose';
  if (mm <= 450) return 'optimal';
  return 'tooFar';
};

