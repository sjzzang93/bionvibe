import { DevTerm } from './types';

export function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function matches(term: DevTerm, q: string) {
  if (!q) return true;
  const n = normalize(q);
  return (
    normalize(term.term).includes(n) ||
    (term.easyExplanation && normalize(term.easyExplanation).includes(n)) ||
    (term.simpleExplanation && normalize(term.simpleExplanation).includes(n)) ||
    (term.realExplanation && normalize(term.realExplanation).includes(n)) ||
    (term.generalExplanation && normalize(term.generalExplanation).includes(n)) ||
    (term.korean && normalize(term.korean).includes(n))
  );
}

export function byCategory(term: DevTerm, cat: string) {
  if (!cat || cat === 'ALL') return true;
  return term.category === cat;
}

