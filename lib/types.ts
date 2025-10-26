export type Trait = 'energy' | 'focus' | 'social' | 'affect' | 'env';

export interface Choice {
  id: string;
  label: string;
  helper?: string;
  impact: Partial<Record<Trait, number>>;
}

export interface Question {
  id: string;
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  helper?: string;
  choices: Choice[];
  singleSelect?: boolean;
}

export interface Score {
  energy: number;
  focus: number;
  social: number;
  affect: number;
  env: number;
}

export interface Hobby {
  id: string;
  name: string;
  why: string;
  level: '초급' | '중급' | '고급';
  cost: '낮음' | '보통' | '높음';
  indoor: boolean;
  soloFriendly: boolean;
  timePerWeek: '짧음' | '보통' | '김';
  starterGuide: string;
}

export interface StoredState {
  step: number;
  answers: Record<string, string[]>;
  score?: Score;
  updatedAt: number;
}

