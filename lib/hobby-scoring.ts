import { Score, Trait, Choice, Hobby } from './hobby-types';
import { HOBBIES } from './hobby-map';

export function accumulate(choices: Choice[]): Score {
  const raw: Score = {
    energy: 0,
    focus: 0,
    social: 0,
    affect: 0,
    env: 0,
  };

  choices.forEach((choice) => {
    Object.entries(choice.impact).forEach(([trait, value]) => {
      if (value !== undefined) {
        raw[trait as Trait] += value;
      }
    });
  });

  return raw;
}

export function normalize(raw: Score): Score {
  // 각 축을 -10 ~ +10 범위로 정규화
  // 최대값을 14 정도로 가정 (7문항 * 2점)
  const maxValue = 14;

  return {
    energy: Math.max(-10, Math.min(10, (raw.energy / maxValue) * 10)),
    focus: Math.max(-10, Math.min(10, (raw.focus / maxValue) * 10)),
    social: Math.max(-10, Math.min(10, (raw.social / maxValue) * 10)),
    affect: Math.max(-10, Math.min(10, (raw.affect / maxValue) * 10)),
    env: Math.max(-10, Math.min(10, (raw.env / maxValue) * 10)),
  };
}

export function deriveCategories(score: Score): string[] {
  const categories: string[] = [];

  // 활동적 vs 안정형
  if (score.energy > 3) {
    categories.push('active');
  } else if (score.energy < -3) {
    categories.push('calm');
  }

  // 몰입 vs 탐색
  if (score.focus > 3) {
    categories.push('focus');
  } else if (score.focus < -3) {
    categories.push('explore');
  }

  // 교류 vs 개인
  if (score.social > 3) {
    categories.push('social');
  } else if (score.social < -3) {
    categories.push('solo');
  }

  // 감성 vs 논리
  if (score.affect > 3) {
    categories.push('affective');
  } else if (score.affect < -3) {
    categories.push('logic');
  }

  // 실외/손 vs 실내/머리
  if (score.env > 3) {
    categories.push('outdoor', 'hands');
  } else if (score.env < -3) {
    categories.push('indoor', 'mind');
  }

  // 조합 카테고리 생성
  const combined: string[] = [];

  if (categories.includes('active') && categories.includes('social')) {
    combined.push('active-social');
  }
  if (categories.includes('calm') && categories.includes('affective')) {
    combined.push('calm-affective');
  }
  if (categories.includes('explore') && categories.includes('indoor')) {
    combined.push('explore-indoor');
  }
  if (categories.includes('focus') && categories.includes('logic')) {
    combined.push('focus-logic');
  }
  if (categories.includes('social') && categories.includes('outdoor')) {
    combined.push('social-outdoor');
  }
  if (categories.includes('hands') && categories.includes('affective')) {
    combined.push('hands-affective');
  }
  if (categories.includes('mind') && categories.includes('indoor')) {
    combined.push('mind-indoor');
  }
  if (categories.includes('active') && categories.includes('outdoor')) {
    combined.push('active-outdoor');
  }
  if (categories.includes('calm') && categories.includes('outdoor')) {
    combined.push('calm-outdoor');
  }
  if (categories.includes('indoor') && categories.includes('hands')) {
    combined.push('indoor-hands');
  }
  if (categories.includes('indoor') && categories.includes('mind')) {
    combined.push('indoor-mind');
  }
  if (categories.includes('active') && categories.includes('focus')) {
    combined.push('active-focus');
  }
  if (categories.includes('calm') && categories.includes('social')) {
    combined.push('calm-social');
  }
  if (categories.includes('explore') && categories.includes('outdoor')) {
    combined.push('explore-outdoor');
  }

  return [...combined, ...categories];
}

export function getRecommendations(score: Score, count: number = 8): Hobby[] {
  const categories = deriveCategories(score);

  // 카테고리 매칭 점수 계산
  const scored = HOBBIES.map((hobby) => {
    let matchScore = 0;

    hobby.categories.forEach((cat) => {
      if (categories.includes(cat)) {
        matchScore += 10;
      }
    });

    // 세부 조정
    if (score.social > 0 && !hobby.soloFriendly) matchScore += 3;
    if (score.social < 0 && hobby.soloFriendly) matchScore += 3;
    if (score.env > 0 && !hobby.indoor) matchScore += 2;
    if (score.env < 0 && hobby.indoor) matchScore += 2;

    return { hobby, matchScore };
  });

  // 정렬 및 상위 N개 선택
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // 다양성을 위해 카테고리 중복 최소화
  const selected: Hobby[] = [];
  const usedCategories = new Set<string>();

  for (const item of scored) {
    if (selected.length >= count) break;

    // 너무 많이 겹치지 않도록
    const overlap = item.hobby.categories.filter((c) => usedCategories.has(c)).length;

    if (overlap < 2 || selected.length < 3) {
      selected.push(item.hobby);
      item.hobby.categories.forEach((c) => usedCategories.add(c));
    }
  }

  // 부족하면 나머지로 채움
  if (selected.length < count) {
    for (const item of scored) {
      if (selected.length >= count) break;
      if (!selected.includes(item.hobby)) {
        selected.push(item.hobby);
      }
    }
  }

  return selected;
}

export function getTraitLabel(trait: Trait, value: number): string {
  const labels: Record<Trait, { positive: string; negative: string }> = {
    energy: { positive: '활동적', negative: '안정형' },
    focus: { positive: '몰입형', negative: '탐색형' },
    social: { positive: '교류형', negative: '개인형' },
    affect: { positive: '감성형', negative: '논리형' },
    env: { positive: '실외/손', negative: '실내/머리' },
  };

  if (value > 3) return labels[trait].positive;
  if (value < -3) return labels[trait].negative;
  return '중립';
}

