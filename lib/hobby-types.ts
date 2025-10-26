export type Trait = 'energy' | 'focus' | 'social' | 'affect' | 'env';

export interface Choice {
  id: string;
  label: string;
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
  energy: number;  // 활동(+) ↔ 안정(-)
  focus: number;   // 몰입(+) ↔ 탐색(-)
  social: number;  // 교류(+) ↔ 개인(-)
  affect: number;  // 감성(+) ↔ 논리(-)
  env: number;     // 실외/손(+) ↔ 실내/머리(-)
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
  categories: string[];
}

export interface TestState {
  answers: Record<string, string>;
  currentStep: number;
  currentQuestionIndex: number;
  score?: Score;
  hobbies?: Hobby[];
}

