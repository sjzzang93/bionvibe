export type TestKind = 'acuity' | 'color' | 'presbyopia';

export interface TestResult {
  kind: TestKind;
  scoreLabel: string;
  raw: any;
  calibratedPxPerMm?: number;
  ts: number;
}

const KEY = 'eye-test:results:v1';

export const saveResult = (r: TestResult) => {
  if (typeof window === 'undefined') return;
  try {
    const prev: TestResult[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    const next = [r, ...prev].slice(0, 5);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to save result:', e);
  }
};

export const loadResults = (): TestResult[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

