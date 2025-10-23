export type Kind = 'acuity' | 'color' | 'presbyopia';

export interface Result {
  kind: Kind;
  scoreLabel: string;
  raw?: any;
  ppm?: number; // px per mm
  distMm?: number; // 사용자가 입력/측정한 자가 거리값(선택)
  ts: number;
}

const KEY = 'eyepro:results:v1';

export const saveResult = (r: Result) => {
  if (typeof window === 'undefined') return;
  try {
    const prev: Result[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    localStorage.setItem(KEY, JSON.stringify([r, ...prev].slice(0, 10)));
  } catch (e) {
    console.error('Failed to save result:', e);
  }
};

export const loadResults = (): Result[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

