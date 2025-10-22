import { DevTerm } from './types';

export function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function matches(term: DevTerm, q: string) {
  if (!q) return true;
  const n = normalize(q);
  return (
    normalize(term.term).includes(n) ||
    normalize(term.easyExplanation).includes(n) ||
    normalize(term.realExplanation).includes(n)
  );
}

export function byCategory(term: DevTerm, cat: string) {
  if (!cat || cat === 'ALL') return true;
  return term.category === cat;
}

