// 이혼 예방 사전진단 - 데이터 모델 및 질문 뱅크

export type Gender = 'male' | 'female' | 'unspecified';
export type QuestionType = 'likert5' | 'boolean';
export type RiskTier = 'LOW' | 'CAUTION' | 'HIGH' | 'IMMEDIATE';
export type Urgency = 'info' | 'warn' | 'critical';

export interface UserProfile {
  gender: Gender;
  age?: number;
  relationLengthMonths?: number;
  hasChildren?: boolean;
}

export type TestLevel = 'basic' | 'intermediate' | 'advanced';

export interface Question {
  id: string;
  domain: string;
  audience: 'male' | 'female' | 'both';
  type: QuestionType;
  text: string;
  level: TestLevel; // 간단/중간/심화
  reverse?: boolean;
  weight?: number;
  redFlag?: boolean;
}

export interface Answer {
  questionId: string;
  value: number | boolean;
}

export interface ScoreBreakdown {
  domainScores: Record<string, number>;
  total: number;
  riskTier: RiskTier;
  redFlags: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  body: string;
  urgency: Urgency;
}

// 13개 도메인
export const DOMAINS = [
  '의사소통',
  '갈등해결',
  '정서적 친밀감',
  '신뢰/질투/경계',
  '재정관리',
  '가사/육아 분담',
  '성적 만족',
  '확장가족',
  '일·시간관리',
  '정신건강',
  '물리/정서적 안전',
  '이혼 상상',
  '디지털 사용'
] as const;

// 34문항 (주요 도메인 3문항, 나머지 2문항)
export const QUESTIONS: Question[] = [
  // 의사소통 (3문항)
  {
    id: 'C01',
    domain: '의사소통',
    audience: 'both',
    type: 'likert5',
    text: '상대의 말을 끊지 않고 끝까지 듣는다.',
    level: 'basic',
    reverse: false,
    weight: 1.0
  },
  {
    id: 'C02',
    domain: '의사소통',
    audience: 'both',
    type: 'likert5',
    text: '대화에서 비꼬거나 조롱하는 표현을 자주 쓴다.',
    level: 'intermediate',
    reverse: true,
    weight: 1.1
  },
  {
    id: 'C03',
    domain: '의사소통',
    audience: 'both',
    type: 'likert5',
    text: '중요한 문제를 대화로 해결하려 노력한다.',
    level: 'advanced',
    reverse: false,
    weight: 1.0
  },

  // 갈등해결 (3문항)
  {
    id: 'CF01',
    domain: '갈등해결',
    audience: 'both',
    type: 'likert5',
    text: '갈등 시 소리를 지르거나 물건을 던진다.',
    level: 'basic',
    reverse: true,
    weight: 1.3
  },
  {
    id: 'CF02',
    domain: '갈등해결',
    audience: 'both',
    type: 'likert5',
    text: '서로 양보하며 타협점을 찾는다.',
    level: 'intermediate',
    reverse: false,
    weight: 1.0
  },
  {
    id: 'CF03',
    domain: '갈등해결',
    audience: 'both',
    type: 'likert5',
    text: '갈등 후 사과하고 화해하는 시간이 길어진다.',
    level: 'advanced',
    reverse: true,
    weight: 1.2
  },

  // 정서적 친밀감 (3문항)
  {
    id: 'I01',
    domain: '정서적 친밀감',
    audience: 'both',
    type: 'likert5',
    text: '요즘 정서적으로 멀게 느껴진다.',
    level: 'basic',
    reverse: true,
    weight: 1.2
  },
  {
    id: 'I02',
    domain: '정서적 친밀감',
    audience: 'both',
    type: 'likert5',
    text: '서로의 감정과 고민을 공유한다.',
    level: 'intermediate',
    reverse: false,
    weight: 1.0
  },
  {
    id: 'I03',
    domain: '정서적 친밀감',
    audience: 'both',
    type: 'likert5',
    text: '함께 있어도 외롭고 단절된 느낌이 든다.',
    level: 'advanced',
    reverse: true,
    weight: 1.3
  },

  // 신뢰/질투/경계 (3문항)
  {
    id: 'T01',
    domain: '신뢰/질투/경계',
    audience: 'both',
    type: 'likert5',
    text: '스마트폰/동선/연락처를 과도하게 통제받는다.',
    level: 'basic',
    reverse: true,
    weight: 1.4,
    redFlag: true
  },
  {
    id: 'T02',
    domain: '신뢰/질투/경계',
    audience: 'both',
    type: 'likert5',
    text: '서로를 믿고 존중한다.',
    level: 'intermediate',
    reverse: false,
    weight: 1.0
  },
  {
    id: 'T03',
    domain: '신뢰/질투/경계',
    audience: 'both',
    type: 'likert5',
    text: '질투나 의심으로 인한 갈등이 잦다.',
    level: 'advanced',
    reverse: true,
    weight: 1.2
  },

  // 재정관리 (3문항)
  {
    id: 'R01',
    domain: '재정관리',
    audience: 'both',
    type: 'likert5',
    text: '월 지출·예산을 함께 투명하게 공유한다.',
    level: 'basic',
    reverse: false,
    weight: 1.0
  },
  {
    id: 'R02',
    domain: '재정관리',
    audience: 'both',
    type: 'likert5',
    text: '돈 문제로 자주 싸운다.',
    level: 'intermediate',
    reverse: true,
    weight: 1.3
  },
  {
    id: 'R03',
    domain: '재정관리',
    audience: 'both',
    type: 'likert5',
    text: '재정적 압박이나 빚으로 스트레스를 받는다.',
    level: 'advanced',
    reverse: true,
    weight: 1.2
  },

  // 가사/육아 분담 (2문항)
  {
    id: 'H01',
    domain: '가사/육아 분담',
    audience: 'both',
    type: 'likert5',
    text: '가사와 육아를 공평하게 분담한다.',
    level: 'basic',
    reverse: false,
    weight: 1.0
  },
  {
    id: 'H02',
    domain: '가사/육아 분담',
    audience: 'both',
    type: 'likert5',
    text: '한쪽이 대부분의 가사/육아를 담당해 불만이 크다.',
    level: 'intermediate',
    reverse: true,
    weight: 1.3
  },

  // 성적 만족 (2문항)
  {
    id: 'S01',
    domain: '성적 만족',
    audience: 'both',
    type: 'likert5',
    text: '성생활에 만족한다.',
    level: 'basic',
    reverse: false,
    weight: 1.0
  },
  {
    id: 'S02',
    domain: '성적 만족',
    audience: 'both',
    type: 'likert5',
    text: '성관계가 강제적이거나 거부당한 느낌이 든다.',
    level: 'intermediate',
    reverse: true,
    weight: 1.5,
    redFlag: true
  },

  // 확장가족 (2문항)
  {
    id: 'E01',
    domain: '확장가족',
    audience: 'both',
    type: 'likert5',
    text: '시댁/처가와의 관계로 스트레스를 받는다.',
    level: 'basic',
    reverse: true,
    weight: 1.1
  },
  {
    id: 'E02',
    domain: '확장가족',
    audience: 'both',
    type: 'likert5',
    text: '배우자가 나와 가족 사이에서 균형을 잡아준다.',
    level: 'intermediate',
    reverse: false,
    weight: 1.0
  },

  // 일·시간관리 (2문항)
  {
    id: 'W01',
    domain: '일·시간관리',
    audience: 'both',
    type: 'likert5',
    text: '야근/음주/취미로 함께하는 시간이 부족하다.',
    level: 'basic',
    reverse: true,
    weight: 1.2
  },
  {
    id: 'W02',
    domain: '일·시간관리',
    audience: 'both',
    type: 'likert5',
    text: '일과 가정의 균형을 잘 맞춘다.',
    level: 'intermediate',
    reverse: false,
    weight: 1.0
  },

  // 정신건강 (3문항)
  {
    id: 'M01',
    domain: '정신건강',
    audience: 'both',
    type: 'likert5',
    text: '2주 이상 우울감/무기력이 지속되었다.',
    level: 'basic',
    reverse: true,
    weight: 1.2
  },
  {
    id: 'M02',
    domain: '정신건강',
    audience: 'both',
    type: 'likert5',
    text: '불안, 공황, 번아웃 증상을 경험한다.',
    level: 'intermediate',
    reverse: true,
    weight: 1.2
  },
  {
    id: 'M03',
    domain: '정신건강',
    audience: 'both',
    type: 'likert5',
    text: '배우자가 정서적으로 지지해준다.',
    level: 'advanced',
    reverse: false,
    weight: 1.0
  },

  // 물리/정서적 안전 (3문항)
  {
    id: 'A01',
    domain: '물리/정서적 안전',
    audience: 'both',
    type: 'boolean',
    text: '협박, 폭언, 신체적 폭력이 있었다.',
    level: 'basic',
    reverse: true,
    weight: 2.0,
    redFlag: true
  },
  {
    id: 'A02',
    domain: '물리/정서적 안전',
    audience: 'both',
    type: 'likert5',
    text: '배우자와 함께 있을 때 안전하고 편안하다.',
    level: 'intermediate',
    reverse: false,
    weight: 1.0
  },
  {
    id: 'A03',
    domain: '물리/정서적 안전',
    audience: 'both',
    type: 'likert5',
    text: '친구/가족과의 연락을 차단하거나 고립시킨다.',
    level: 'advanced',
    reverse: true,
    weight: 1.6,
    redFlag: true
  },

  // 이혼 상상 (2문항)
  {
    id: 'D01',
    domain: '이혼 상상',
    audience: 'both',
    type: 'likert5',
    text: '이 관계를 끝내는 상상을 자주 한다.',
    level: 'basic',
    reverse: true,
    weight: 1.5
  },
  {
    id: 'D02',
    domain: '이혼 상상',
    audience: 'both',
    type: 'likert5',
    text: '이혼을 진지하게 고려한 적이 있다.',
    level: 'intermediate',
    reverse: true,
    weight: 1.6
  },

  // 디지털 사용 (2문항)
  {
    id: 'DG01',
    domain: '디지털 사용',
    audience: 'both',
    type: 'likert5',
    text: '스마트폰/SNS/게임으로 대화가 자주 방해된다.',
    level: 'basic',
    reverse: true,
    weight: 1.1
  },
  {
    id: 'DG02',
    domain: '디지털 사용',
    audience: 'both',
    type: 'likert5',
    text: '디지털 기기 사용 시간에 대해 합의한다.',
    level: 'intermediate',
    reverse: false,
    weight: 1.0
  }
];

// 위험도 티어
export const RISK_TIERS: Array<{
  tier: RiskTier;
  range: [number, number];
  label: string;
  color: string;
}> = [
  { tier: 'LOW', range: [0, 39], label: '낮음', color: 'bg-green-500' },
  { tier: 'CAUTION', range: [40, 59], label: '주의', color: 'bg-yellow-500' },
  { tier: 'HIGH', range: [60, 79], label: '높음', color: 'bg-orange-500' },
  { tier: 'IMMEDIATE', range: [80, 100], label: '즉시 도움 필요', color: 'bg-red-600' }
];

// 추천 사항
export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'R-COMM-1',
    title: '대화 리부트 (20분 규칙)',
    body: '타이머를 20분 설정하고 한 명씩 말할 기회를 가지세요. 비난, 방어, 경멸, 회피를 금지하고 경청에 집중합니다.',
    urgency: 'info'
  },
  {
    id: 'R-FIN-1',
    title: '지출 투명보드 만들기',
    body: '월 3대 항목(주거, 식비, 교육)부터 공통 보드를 작성하세요. 감정 충돌을 줄이고 재정 투명성을 높입니다.',
    urgency: 'info'
  },
  {
    id: 'R-SAFE-1',
    title: '즉시 안전이 최우선',
    body: '협박, 폭력, 통제는 위험 신호입니다. 112 또는 1366으로 즉시 도움을 받으세요. 신뢰할 수 있는 사람에게 알리세요.',
    urgency: 'critical'
  },
  {
    id: 'R-COUNSEL-1',
    title: '초기 커플상담 권장',
    body: '의사소통 패턴 교정과 재정/양육 의제 정리를 위해 전문 상담을 고려하세요. 공공 상담소와 민간 상담소를 안내받을 수 있습니다.',
    urgency: 'warn'
  },
  {
    id: 'R-INTIMACY-1',
    title: '정서적 재연결 시간',
    body: '주 1회 30분, 스마트폰 없이 서로의 하루와 감정을 나누는 시간을 가지세요.',
    urgency: 'info'
  }
];

// 긴급 연락처
export const SAFETY_HOTLINES = [
  { name: '긴급 신고', number: '112' },
  { name: '여성긴급전화', number: '1366' },
  { name: '정신건강 상담', number: '1393' },
  { name: '자살예방 상담', number: '1393' }
];
