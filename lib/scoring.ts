import { HOBBY_CATEGORIES, type HobbyCategory } from './hobby-map';
import { QUESTIONS } from './questions';
import type { Hobby, Score, Trait } from './types';

const TRAITS: Trait[] = ['energy', 'focus', 'social', 'affect', 'env'];

type TraitPotential = Record<Trait, number>;

const traitPotential: TraitPotential = TRAITS.reduce((totals, trait) => {
  const sum = QUESTIONS.reduce((acc, question) => {
    const maxImpact = question.choices.reduce((max, choice) => {
      const value = choice.impact[trait] ?? 0;
      return Math.max(max, Math.abs(value));
    }, 0);
    return acc + maxImpact;
  }, 0);
  return { ...totals, [trait]: Math.max(1, sum) };
}, {} as TraitPotential);

const initialScore: Score = {
  energy: 0,
  focus: 0,
  social: 0,
  affect: 0,
  env: 0,
};

export function accumulate(answerImpacts: Array<Partial<Record<Trait, number>>>): Score {
  return answerImpacts.reduce<Score>((score, impact) => {
    const next: Score = { ...score };
    TRAITS.forEach((trait) => {
      const delta = impact[trait];
      if (typeof delta === 'number' && Number.isFinite(delta)) {
        next[trait] += delta;
      }
    });
    return next;
  }, { ...initialScore });
}

export function normalize(raw: Score): Score {
  const normalized: Score = { ...raw };
  TRAITS.forEach((trait) => {
    const potential = traitPotential[trait];
    const value = raw[trait];
    const ratio = potential ? value / potential : 0;
    const scaled = Math.max(-10, Math.min(10, Math.round(ratio * 10 * 10) / 10));
    normalized[trait] = scaled;
  });
  return normalized;
}

function computeCategoryScore(category: HobbyCategory, score: Score): number {
  if (!category.focusTraits.length) return 0;
  const total = category.focusTraits.reduce((acc, { trait, direction }) => {
    const value = score[trait];
    const contribution = direction === 'high' ? value : -value;
    return acc + contribution;
  }, 0);
  return total / category.focusTraits.length;
}

export function deriveCategories(score: Score): string[] {
  const ranked = HOBBY_CATEGORIES.map((category) => ({
    id: category.id,
    weight: computeCategoryScore(category, score),
  }))
    .sort((a, b) => b.weight - a.weight)
    .filter((entry) => entry.weight > -2);

  const primary = ranked.slice(0, 3).map((entry) => entry.id);
  return Array.from(new Set(primary));
}

export function pickHobbies(categoryIds: string[], limit = 7): Hobby[] {
  const unique = new Map<string, Hobby>();

  categoryIds.forEach((id) => {
    const category = HOBBY_CATEGORIES.find((item) => item.id === id);
    if (!category) return;
    category.hobbies.forEach((hobby) => {
      if (!unique.has(hobby.id)) {
        unique.set(hobby.id, hobby);
      }
    });
  });

  if (unique.size < limit) {
    HOBBY_CATEGORIES.forEach((category) => {
      if (unique.size >= limit) return;
      category.hobbies.forEach((hobby) => {
        if (!unique.has(hobby.id) && unique.size < limit) {
          unique.set(hobby.id, hobby);
        }
      });
    });
  }

  return Array.from(unique.values()).slice(0, limit);
}

export function getRecommendations(rawScore: Score, limit = 7) {
  const normalized = normalize(rawScore);
  const categories = deriveCategories(normalized);
  const hobbies = pickHobbies(categories, limit);

  return {
    score: normalized,
    categories,
    hobbies,
  };
}

