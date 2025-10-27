import { TestState } from './hobby-types';

const STORAGE_KEY = 'hobby-test:v1';

export function getState(): TestState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as TestState;
    console.log('🔍 [Storage] getState 원본 문자열:', raw);
    console.log('🔍 [Storage] getState 파싱 결과:', parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to load state:', error);
    return null;
  }
}

export function setState(state: TestState): void {
  if (typeof window === 'undefined') return;

  try {
    const stringified = JSON.stringify(state);
    console.log('🔍 [Storage] setState 입력:', state);
    console.log('🔍 [Storage] setState 문자열화:', stringified);
    localStorage.setItem(STORAGE_KEY, stringified);
    
    // 검증: 바로 읽어서 확인
    const verification = localStorage.getItem(STORAGE_KEY);
    console.log('🔍 [Storage] setState 검증 (저장 후 읽기):', verification);
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
}

