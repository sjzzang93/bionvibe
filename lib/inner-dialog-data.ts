// 자신과 대화하기 (Know Yourself) - 데이터 구조

export type TestLevel = 'basic' | 'standard' | 'advanced';

export type Domain =
  | 'VAL' // 가치관 & 정체성
  | 'JOY' // 행복 수준
  | 'STR' // 강점 인식
  | 'FLW' // 몰입 경험
  | 'ENG' // 에너지 레벨
  | 'BUR' // 번아웃 수준
  | 'SOC' // 사회적 연결
  | 'WRK' // 일 만족도
  | 'LIF' // 삶 만족도
  | 'LRN' // 성장 의식
  | 'ENV' // 환경 만족
  | 'MNY' // 재정 인식
  | 'HLT' // 건강 인식
  | 'EMO' // 감정 조절
  | 'PUR'; // 목적 의식

export interface Question {
  id: string;
  domain: Domain;
  text: string;
  level: TestLevel;
  reverse?: boolean; // true면 역채점 (낮을수록 좋음)
}

export interface Answer {
  questionId: string;
  value: number; // 1-7 (Likert 7점 척도)
}

export interface DomainScore {
  domain: Domain;
  score: number; // 0-100
  level: string; // '높음', '보통', '낮음'
}

export interface TestResult {
  domainScores: DomainScore[];
  compositeIndices: {
    wellbeing: number; // 웰빙 지수 (JOY, LIF, HLT, EMO)
    vitality: number; // 활력 지수 (ENG, FLW, STR)
    growth: number; // 성장 지수 (LRN, PUR, VAL)
    stability: number; // 안정 지수 (MNY, ENV, SOC, WRK)
    balance: number; // 균형 지수 (BUR 역산 + 전체 분산)
  };
  profile: string; // 종합 프로필
  recommendations: string[];
}

export const DOMAIN_INFO: Record<Domain, { name: string; emoji: string; color: string }> = {
  VAL: { name: '가치관 & 정체성', emoji: '🎯', color: '#8B5CF6' },
  JOY: { name: '행복 수준', emoji: '😊', color: '#F59E0B' },
  STR: { name: '강점 인식', emoji: '💪', color: '#10B981' },
  FLW: { name: '몰입 경험', emoji: '🌊', color: '#3B82F6' },
  ENG: { name: '에너지 레벨', emoji: '⚡', color: '#FBBF24' },
  BUR: { name: '번아웃 수준', emoji: '😵', color: '#EF4444' },
  SOC: { name: '사회적 연결', emoji: '👥', color: '#EC4899' },
  WRK: { name: '일 만족도', emoji: '💼', color: '#6366F1' },
  LIF: { name: '삶 만족도', emoji: '🌟', color: '#14B8A6' },
  LRN: { name: '성장 의식', emoji: '📈', color: '#8B5CF6' },
  ENV: { name: '환경 만족', emoji: '🏡', color: '#84CC16' },
  MNY: { name: '재정 인식', emoji: '💰', color: '#F59E0B' },
  HLT: { name: '건강 인식', emoji: '❤️', color: '#EF4444' },
  EMO: { name: '감정 조절', emoji: '🧘', color: '#06B6D4' },
  PUR: { name: '목적 의식', emoji: '🎭', color: '#A855F7' },
};

// 90개 질문 (도메인당 6개)
export const QUESTIONS: Question[] = [
  // VAL (가치관 & 정체성) - 6문항
  { id: 'VAL01', domain: 'VAL', level: 'basic', text: '나는 내 삶의 핵심 가치를 명확하게 알고 있다.' },
  { id: 'VAL02', domain: 'VAL', level: 'basic', text: '나의 행동은 대체로 내 가치관과 일치한다.' },
  { id: 'VAL03', domain: 'VAL', level: 'standard', text: '어려운 결정을 내릴 때 내 가치관이 기준이 된다.' },
  { id: 'VAL04', domain: 'VAL', level: 'standard', text: '나는 내가 누구인지 잘 설명할 수 있다.' },
  { id: 'VAL05', domain: 'VAL', level: 'advanced', text: '타인의 기대보다 내 가치관을 우선시한다.' },
  { id: 'VAL06', domain: 'VAL', level: 'advanced', text: '내 정체성은 시간이 지나도 일관성이 있다.' },

  // JOY (행복 수준) - 6문항
  { id: 'JOY01', domain: 'JOY', level: 'basic', text: '나는 대체로 행복하다고 느낀다.' },
  { id: 'JOY02', domain: 'JOY', level: 'basic', text: '하루 중 즐거운 순간이 자주 있다.' },
  { id: 'JOY03', domain: 'JOY', level: 'standard', text: '작은 일상에서도 감사함을 느낀다.' },
  { id: 'JOY04', domain: 'JOY', level: 'standard', text: '내 삶에 만족스러운 부분이 많다.' },
  { id: 'JOY05', domain: 'JOY', level: 'advanced', text: '어려움 속에서도 긍정적인 면을 찾는다.' },
  { id: 'JOY06', domain: 'JOY', level: 'advanced', text: '나의 행복은 외부 환경에 크게 좌우되지 않는다.' },

  // STR (강점 인식) - 6문항
  { id: 'STR01', domain: 'STR', level: 'basic', text: '나는 내 강점이 무엇인지 알고 있다.' },
  { id: 'STR02', domain: 'STR', level: 'basic', text: '내가 잘하는 일을 할 때 자신감이 생긴다.' },
  { id: 'STR03', domain: 'STR', level: 'standard', text: '일상에서 내 강점을 자주 활용한다.' },
  { id: 'STR04', domain: 'STR', level: 'standard', text: '타인도 나의 강점을 인정해준다.' },
  { id: 'STR05', domain: 'STR', level: 'advanced', text: '약점보다 강점을 발전시키는 데 집중한다.' },
  { id: 'STR06', domain: 'STR', level: 'advanced', text: '내 강점을 활용해 남을 돕는다.' },

  // FLW (몰입 경험) - 6문항
  { id: 'FLW01', domain: 'FLW', level: 'basic', text: '무언가에 완전히 빠져드는 경험을 한다.' },
  { id: 'FLW02', domain: 'FLW', level: 'basic', text: '시간 가는 줄 모르고 집중하는 순간이 있다.' },
  { id: 'FLW03', domain: 'FLW', level: 'standard', text: '몰입할 때 스트레스를 잊게 된다.' },
  { id: 'FLW04', domain: 'FLW', level: 'standard', text: '내가 몰입하는 활동을 정기적으로 한다.' },
  { id: 'FLW05', domain: 'FLW', level: 'advanced', text: '몰입 후에는 성취감과 활력을 느낀다.' },
  { id: 'FLW06', domain: 'FLW', level: 'advanced', text: '몰입을 방해하는 요소를 잘 제거한다.' },

  // ENG (에너지 레벨) - 6문항
  { id: 'ENG01', domain: 'ENG', level: 'basic', text: '아침에 일어날 때 활력이 있다.' },
  { id: 'ENG02', domain: 'ENG', level: 'basic', text: '하루를 보내는 데 충분한 에너지가 있다.' },
  { id: 'ENG03', domain: 'ENG', level: 'standard', text: '피곤해도 빠르게 회복된다.' },
  { id: 'ENG04', domain: 'ENG', level: 'standard', text: '새로운 일에 도전할 의욕이 있다.' },
  { id: 'ENG05', domain: 'ENG', level: 'advanced', text: '주말이 지나면 재충전된 느낌이다.' },
  { id: 'ENG06', domain: 'ENG', level: 'advanced', text: '에너지를 효율적으로 분배한다.' },

  // BUR (번아웃 수준) - 6문항 (역채점)
  { id: 'BUR01', domain: 'BUR', level: 'basic', text: '요즘 모든 일이 버겁게 느껴진다.', reverse: true },
  { id: 'BUR02', domain: 'BUR', level: 'basic', text: '아침에 일어나기가 힘들다.', reverse: true },
  { id: 'BUR03', domain: 'BUR', level: 'standard', text: '매사에 의욕이 없다.', reverse: true },
  { id: 'BUR04', domain: 'BUR', level: 'standard', text: '감정적으로 소진된 느낌이다.', reverse: true },
  { id: 'BUR05', domain: 'BUR', level: 'advanced', text: '내가 하는 일에 회의감을 느낀다.', reverse: true },
  { id: 'BUR06', domain: 'BUR', level: 'advanced', text: '타인과의 관계가 부담스럽다.', reverse: true },

  // SOC (사회적 연결) - 6문항
  { id: 'SOC01', domain: 'SOC', level: 'basic', text: '나를 이해해주는 사람이 있다.' },
  { id: 'SOC02', domain: 'SOC', level: 'basic', text: '어려울 때 도움을 요청할 사람이 있다.' },
  { id: 'SOC03', domain: 'SOC', level: 'standard', text: '사회적 관계가 나를 지지해준다.' },
  { id: 'SOC04', domain: 'SOC', level: 'standard', text: '소속감을 느끼는 집단이 있다.' },
  { id: 'SOC05', domain: 'SOC', level: 'advanced', text: '의미 있는 대화를 나누는 관계가 있다.' },
  { id: 'SOC06', domain: 'SOC', level: 'advanced', text: '타인과의 관계에서 진정성을 느낀다.' },

  // WRK (일 만족도) - 6문항
  { id: 'WRK01', domain: 'WRK', level: 'basic', text: '내 일이 의미 있다고 느낀다.' },
  { id: 'WRK02', domain: 'WRK', level: 'basic', text: '출근(일 시작)이 즐겁다.' },
  { id: 'WRK03', domain: 'WRK', level: 'standard', text: '일을 통해 성장한다고 느낀다.' },
  { id: 'WRK04', domain: 'WRK', level: 'standard', text: '업무 환경에 만족한다.' },
  { id: 'WRK05', domain: 'WRK', level: 'advanced', text: '내 일이 가치 있는 기여를 한다고 믿는다.' },
  { id: 'WRK06', domain: 'WRK', level: 'advanced', text: '일과 삶의 균형이 잘 맞다.' },

  // LIF (삶 만족도) - 6문항
  { id: 'LIF01', domain: 'LIF', level: 'basic', text: '나는 내 삶에 만족한다.' },
  { id: 'LIF02', domain: 'LIF', level: 'basic', text: '지금까지의 선택들이 대체로 좋았다.' },
  { id: 'LIF03', domain: 'LIF', level: 'standard', text: '다시 태어나도 비슷하게 살고 싶다.' },
  { id: 'LIF04', domain: 'LIF', level: 'standard', text: '내 삶의 질이 개선되고 있다.' },
  { id: 'LIF05', domain: 'LIF', level: 'advanced', text: '후회보다 감사한 일이 더 많다.' },
  { id: 'LIF06', domain: 'LIF', level: 'advanced', text: '내 인생의 방향성에 확신이 있다.' },

  // LRN (성장 의식) - 6문항
  { id: 'LRN01', domain: 'LRN', level: 'basic', text: '나는 계속 성장하고 있다고 느낀다.' },
  { id: 'LRN02', domain: 'LRN', level: 'basic', text: '새로운 것을 배우는 게 즐겁다.' },
  { id: 'LRN03', domain: 'LRN', level: 'standard', text: '실수를 통해 배운다.' },
  { id: 'LRN04', domain: 'LRN', level: 'standard', text: '정기적으로 새로운 도전을 한다.' },
  { id: 'LRN05', domain: 'LRN', level: 'advanced', text: '어제보다 나은 사람이 되려고 노력한다.' },
  { id: 'LRN06', domain: 'LRN', level: 'advanced', text: '피드백을 긍정적으로 받아들인다.' },

  // ENV (환경 만족) - 6문항
  { id: 'ENV01', domain: 'ENV', level: 'basic', text: '내 생활 공간이 편안하다.' },
  { id: 'ENV02', domain: 'ENV', level: 'basic', text: '주변 환경이 나에게 맞다.' },
  { id: 'ENV03', domain: 'ENV', level: 'standard', text: '내 공간을 잘 관리하고 있다.' },
  { id: 'ENV04', domain: 'ENV', level: 'standard', text: '환경이 내 생산성을 돕는다.' },
  { id: 'ENV05', domain: 'ENV', level: 'advanced', text: '내 환경을 개선하려고 노력한다.' },
  { id: 'ENV06', domain: 'ENV', level: 'advanced', text: '물리적 공간이 정신 건강에 도움이 된다.' },

  // MNY (재정 인식) - 6문항
  { id: 'MNY01', domain: 'MNY', level: 'basic', text: '현재 재정 상태가 안정적이다.' },
  { id: 'MNY02', domain: 'MNY', level: 'basic', text: '돈에 대한 걱정이 적다.' },
  { id: 'MNY03', domain: 'MNY', level: 'standard', text: '재정을 잘 관리하고 있다.' },
  { id: 'MNY04', domain: 'MNY', level: 'standard', text: '미래 재정 계획이 있다.' },
  { id: 'MNY05', domain: 'MNY', level: 'advanced', text: '돈이 삶의 질을 충분히 지원한다.' },
  { id: 'MNY06', domain: 'MNY', level: 'advanced', text: '재정적 자유를 향해 나아가고 있다.' },

  // HLT (건강 인식) - 6문항
  { id: 'HLT01', domain: 'HLT', level: 'basic', text: '내 건강 상태가 좋다.' },
  { id: 'HLT02', domain: 'HLT', level: 'basic', text: '충분히 잘 자고 있다.' },
  { id: 'HLT03', domain: 'HLT', level: 'standard', text: '규칙적으로 운동한다.' },
  { id: 'HLT04', domain: 'HLT', level: 'standard', text: '건강한 식습관을 유지한다.' },
  { id: 'HLT05', domain: 'HLT', level: 'advanced', text: '스트레스를 효과적으로 관리한다.' },
  { id: 'HLT06', domain: 'HLT', level: 'advanced', text: '건강 관리에 충분한 시간을 투자한다.' },

  // EMO (감정 조절) - 6문항
  { id: 'EMO01', domain: 'EMO', level: 'basic', text: '내 감정을 잘 인식한다.' },
  { id: 'EMO02', domain: 'EMO', level: 'basic', text: '감정이 폭발하지 않도록 조절할 수 있다.' },
  { id: 'EMO03', domain: 'EMO', level: 'standard', text: '부정적 감정을 건강하게 표현한다.' },
  { id: 'EMO04', domain: 'EMO', level: 'standard', text: '감정이 행동을 지배하지 않는다.' },
  { id: 'EMO05', domain: 'EMO', level: 'advanced', text: '타인의 감정도 잘 이해한다.' },
  { id: 'EMO06', domain: 'EMO', level: 'advanced', text: '감정의 원인을 파악하고 대처한다.' },

  // PUR (목적 의식) - 6문항
  { id: 'PUR01', domain: 'PUR', level: 'basic', text: '내 삶에 명확한 목표가 있다.' },
  { id: 'PUR02', domain: 'PUR', level: 'basic', text: '아침에 일어날 이유가 있다.' },
  { id: 'PUR03', domain: 'PUR', level: 'standard', text: '내가 하는 일이 더 큰 의미와 연결된다.' },
  { id: 'PUR04', domain: 'PUR', level: 'standard', text: '장기적 비전이 있다.' },
  { id: 'PUR05', domain: 'PUR', level: 'advanced', text: '내 삶이 세상에 긍정적 영향을 준다고 믿는다.' },
  { id: 'PUR06', domain: 'PUR', level: 'advanced', text: '내 존재 이유를 알고 있다.' },
];

// 테스트 레벨별 질문 개수
export const TEST_CONFIGS = {
  basic: {
    questionCount: 30,
    estimatedTime: 5,
    description: '핵심 15개 영역을 빠르게 진단합니다',
  },
  standard: {
    questionCount: 60,
    estimatedTime: 10,
    description: '보다 심층적인 자기 인식을 탐구합니다',
  },
  advanced: {
    questionCount: 90,
    estimatedTime: 15,
    description: '완전한 자아 분석과 통찰을 제공합니다',
  },
};

// 질문 필터링 함수
export function getQuestionsByLevel(level: TestLevel): Question[] {
  if (level === 'basic') {
    return QUESTIONS.filter(q => q.level === 'basic');
  } else if (level === 'standard') {
    return QUESTIONS.filter(q => q.level === 'basic' || q.level === 'standard');
  } else {
    return QUESTIONS; // 전체 90문항
  }
}

// 프로필 타입
export const PROFILE_TYPES = [
  {
    id: 'gentle-explorer',
    name: '여유로운 탐험가',
    description: '삶의 균형을 유지하며 새로운 경험을 즐기는 유형',
    criteria: (result: TestResult) =>
      result.compositeIndices.balance > 70 &&
      result.compositeIndices.growth > 60 &&
      result.domainScores.find(d => d.domain === 'BUR')!.score > 60,
  },
  {
    id: 'tired-achiever',
    name: '지친 성취자',
    description: '많은 것을 이뤘지만 번아웃 위험이 있는 유형',
    criteria: (result: TestResult) =>
      result.compositeIndices.vitality > 65 &&
      result.domainScores.find(d => d.domain === 'BUR')!.score < 40,
  },
  {
    id: 'direction-seeker',
    name: '방향 모색자',
    description: '새로운 목적과 의미를 찾고 있는 유형',
    criteria: (result: TestResult) =>
      result.compositeIndices.growth < 50 &&
      result.domainScores.find(d => d.domain === 'PUR')!.score < 50,
  },
  {
    id: 'stable-maintainer',
    name: '안정적 유지자',
    description: '현재 상태를 잘 유지하며 만족하는 유형',
    criteria: (result: TestResult) =>
      result.compositeIndices.stability > 70 &&
      result.compositeIndices.wellbeing > 65,
  },
  {
    id: 'passionate-grower',
    name: '열정적 성장자',
    description: '지속적인 성장과 발전을 추구하는 유형',
    criteria: (result: TestResult) =>
      result.compositeIndices.growth > 75 &&
      result.compositeIndices.vitality > 70,
  },
  {
    id: 'balanced-harmonist',
    name: '균형잡힌 조화자',
    description: '삶의 모든 영역에서 조화를 이루는 유형',
    criteria: (result: TestResult) =>
      result.compositeIndices.balance > 75 &&
      Math.min(
        result.compositeIndices.wellbeing,
        result.compositeIndices.vitality,
        result.compositeIndices.growth,
        result.compositeIndices.stability
      ) > 60,
  },
];
