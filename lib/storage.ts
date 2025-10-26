import type { StoredState } from './types';

const STORAGE_KEY = 'hobby-test:v1';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function getState(): StoredState | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch (error) {
    console.warn('[storage] Failed to parse state', error);
    return null;
  }
}

export function setState(state: StoredState) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[storage] Failed to persist state', error);
  }
}

export function clearState() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(STORAGE_KEY);
}

