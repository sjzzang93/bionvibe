'use client';

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type YinYang = '양' | '음';

export type MbtiGroup = 'Analyst' | 'Diplomat' | 'Sentinel' | 'Explorer';

type MbtiProfile = {
  type: string;
  nickname: string;
  group: MbtiGroup;
  summary: string;
  keywords: string[];
  loveStyle: string;
  stressors: string[];
  bestElements: Element[];
  growthElements: Element[];
  cautionElements: Element[];
  primaryElement: Element;
  supportNeed: string;
  highlight: string;
};

export type MbtiOption = MbtiProfile & {
  groupLabel: string;
  accent: string;
};

export type ZodiacProfile = {
  id: string;
  name: string;
  englishName: string;
  emoji: string;
  element: Element;
  yinYang: YinYang;
  years: string;
  keywords: string[];
  relationshipStyle: string;
  growthCue: string;
  luckyFocus: string;
  tagline: string;
};

export type ZodiacOption = ZodiacProfile & {
  elementLabel: string;
};

export type CompatibilityIndexes = {
  love: number;
  teamwork: number;
  communication: number;
};

export type DailyAdvice = {
  focus: string;
  caution: string;
  reset: string;
};

export type LuckyGuide = {
  color: string;
  day: string;
  ritual: string;
};

type CompatibilityPair = {
  mbti: MbtiProfile;
  zodiac: ZodiacProfile;
};

export type CompatibilityResult = {
  my: CompatibilityPair;
  partner: CompatibilityPair;
  score: number;
  tier: 'S' | 'A' | 'B+' | 'B' | 'C';
  headline: string;
  intro: string;
  synergyHighlights: string[];
  growthTips: string[];
  indexes: CompatibilityIndexes;
  dailyAdvice: DailyAdvice;
  luckyGuide: LuckyGuide;
  referenceNotes: string[];
};

const MBTI_GROUP_META: Record<MbtiGroup, { label: string; accent: string }> = {
  Analyst: { label: '분석형 (NT)', accent: 'from-indigo-500 via-blue-500 to-sky-500' },
  Diplomat: { label: '외교형 (NF)', accent: 'from-emerald-500 via-teal-500 to-cyan-500' },
  Sentinel: { label: '수호형 (SJ)', accent: 'from-amber-500 via-orange-500 to-yellow-400' },
  Explorer: { label: '탐험형 (SP)', accent: 'from-rose-500 via-pink-500 to-purple-500' },
};

const ELEMENT_LABELS: Record<Element, string> = {
  Wood: '목(木)',
  Fire: '화(火)',
  Earth: '토(土)',
  Metal: '금(金)',
  Water: '수(水)',
};

const ELEMENT_SYNERGY: Record<
  Element,
  {
    harmony: Element[];
    supportive: Element[];
    tension: Element[];
    drain: Element[];
  }
> = {
  Wood: { harmony: ['Water', 'Wood'], supportive: ['Fire'], tension: ['Metal'], drain: ['Earth'] },
  Fire: { harmony: ['Wood', 'Fire'], supportive: ['Earth'], tension: ['Water'], drain: ['Metal'] },
  Earth: { harmony: ['Fire', 'Earth'], supportive: ['Metal'], tension: ['Wood'], drain: ['Water'] },
  Metal: { harmony: ['Earth', 'Metal'], supportive: ['Water'], tension: ['Fire'], drain: ['Wood'] },
  Water: { harmony: ['Metal', 'Water'], supportive: ['Wood'], tension: ['Earth'], drain: ['Fire'] },
};

const LUCKY_COLORS_BY_ELEMENT: Record<Element, string[]> = {
  Wood: ['싱그러운 세이지 그린', '파스텔 터쿼이즈'],
  Fire: ['선셋 코랄', '라즈베리 핑크'],
  Earth: ['샌드 베이지', '모카 브라운'],
  Metal: ['플래티넘 실버', '스모키 화이트'],
  Water: ['딥 네이비', '미드나잇 블루'],
};

const LUCKY_RITUALS: string[] = [
  '아침에 창문을 열고 깊은 호흡 3회',
  '디지털 기기를 잠시 내려놓고 손글씨로 계획 작성',
  '30분 정도의 가벼운 스트레칭이나 산책',
  '잠들기 전 감사 일기 3줄 작성',
  '향초를 켜고 조용한 음악을 들으며 정리',
];

const RESET_TIPS: string[] = [
  '5분간 4-7-8 호흡법으로 마음을 진정시키세요.',
  '머리를 맑게 하기 위해 찬물로 손을 씻어 보세요.',
  '예상치 못한 잡념이 들면 메모장에 바로 적고 내려놓으세요.',
  '잠깐 창문 밖 풍경을 바라보며 눈의 피로를 풀어주세요.',
  '티타임을 가지며 카페인을 줄이고 허브티를 추천해요.',
];

const DAYS_BY_ELEMENT: Record<Element, string> = {
  Wood: '목요일 · 성장의 날',
  Fire: '화요일 · 추진력의 날',
  Earth: '토요일 · 안정의 날',
  Metal: '금요일 · 정제의 날',
  Water: '수요일 · 영감의 날',
};

const REFERENCE_NOTE_LIBRARY: string[] = [
  '※ 본 리포트는 MBTI 심리 이론과 12띠 페르소나 데이터를 결합한 엔터테인먼트 콘텐츠입니다.',
  '※ 개인정보를 수집하지 않으며 Google AdSense의 콘텐츠 및 개인정보 보호 정책을 준수합니다.',
  '※ 현실의 인간관계는 대화 습관과 생활 환경에 따라 달라질 수 있음을 기억해 주세요.',
];

const TIER_HEADLINES: Record<CompatibilityResult['tier'], string[]> = {
  S: ['찰떡 시너지', '완벽 케미스트리', '빛나는 파트너십'],
  A: ['탄탄한 조합', '안정적인 궁합', '숨은 명콤비'],
  'B+': ['유연한 파트너', '균형 맞추기 좋은 관계', '서로를 성장시키는 궁합'],
  B: ['연습하면 좋아지는 궁합', '배려를 통해 안정되는 조합', '리듬을 맞춰 가야 할 관계'],
  C: ['시간을 두고 다듬을 궁합', '천천히 속도를 맞춰야 하는 조합', '서로의 차이를 존중해야 할 관계'],
};

const GROUP_PAIR_SCORE: Record<MbtiGroup, Record<MbtiGroup, number>> = {
  Analyst: { Analyst: 5, Diplomat: 6, Sentinel: 4, Explorer: 3 },
  Diplomat: { Analyst: 6, Diplomat: 5, Sentinel: 5, Explorer: 4 },
  Sentinel: { Analyst: 4, Diplomat: 5, Sentinel: 5, Explorer: 6 },
  Explorer: { Analyst: 3, Diplomat: 4, Sentinel: 6, Explorer: 5 },
};

const MBTI_PROFILES: Record<string, MbtiProfile> = {
  INTJ: {
    type: 'INTJ',
    nickname: '전략가',
    group: 'Analyst',
    summary: '미래 로드맵을 그리는 통찰력과 독립적인 실행력을 가진 유형',
    keywords: ['전략', '독립', '미래지향'],
    loveStyle: '지적 공감과 장기적인 비전 공유',
    stressors: ['감정의 과부하', '비효율적인 상황'],
    bestElements: ['Metal', 'Water'],
    growthElements: ['Wood'],
    cautionElements: ['Fire'],
    primaryElement: 'Metal',
    supportNeed: '장기 계획을 함께 설계할 수 있는 파트너',
    highlight: '구조화된 사고',
  },
  INTP: {
    type: 'INTP',
    nickname: '논리술사',
    group: 'Analyst',
    summary: '지적 호기심과 분석력으로 새로운 가능성을 실험하는 유형',
    keywords: ['분석', '탐구', '창의'],
    loveStyle: '아이디어와 통찰을 나누는 대화',
    stressors: ['과한 시간 압박', '감정적 갈등'],
    bestElements: ['Metal', 'Water'],
    growthElements: ['Fire'],
    cautionElements: ['Earth'],
    primaryElement: 'Water',
    supportNeed: '지적 자율성과 실험 공간',
    highlight: '유연한 사고 실험',
  },
  ENTJ: {
    type: 'ENTJ',
    nickname: '통솔자',
    group: 'Analyst',
    summary: '목표를 명확히 하고 팀을 리드하며 결과를 만들어내는 유형',
    keywords: ['리더십', '결단', '효율'],
    loveStyle: '명확한 목표와 실용적 협력',
    stressors: ['무계획한 행동', '느린 의사결정'],
    bestElements: ['Metal', 'Fire'],
    growthElements: ['Earth'],
    cautionElements: ['Water'],
    primaryElement: 'Fire',
    supportNeed: '성과를 함께 책임지는 든든한 동반자',
    highlight: '주도적인 실행력',
  },
  ENTP: {
    type: 'ENTP',
    nickname: '변론가',
    group: 'Analyst',
    summary: '새로운 가능성과 혁신을 즐기며 토론을 통해 성장하는 유형',
    keywords: ['아이디어', '도전', '유연성'],
    loveStyle: '재미있는 대화와 실험적인 데이트',
    stressors: ['지루한 반복', '갑작스러운 제한'],
    bestElements: ['Fire', 'Water'],
    growthElements: ['Metal'],
    cautionElements: ['Earth'],
    primaryElement: 'Fire',
    supportNeed: '새로운 시도를 받아주는 포용력',
    highlight: '혁신 에너지',
  },
  INFJ: {
    type: 'INFJ',
    nickname: '옹호자',
    group: 'Diplomat',
    summary: '깊은 통찰과 따뜻한 비전으로 사람을 돕는 유형',
    keywords: ['통찰', '헌신', '비전'],
    loveStyle: '진심 어린 대화와 의미 있는 프로젝트',
    stressors: ['표면적인 대화', '혼잡한 환경'],
    bestElements: ['Water', 'Wood'],
    growthElements: ['Fire'],
    cautionElements: ['Metal'],
    primaryElement: 'Water',
    supportNeed: '감정을 안전하게 표현할 수 있는 분위기',
    highlight: '의미 중심의 공감력',
  },
  INFP: {
    type: 'INFP',
    nickname: '중재자',
    group: 'Diplomat',
    summary: '가치관과 상상력을 바탕으로 세상을 따뜻하게 바라보는 유형',
    keywords: ['가치관', '창의', '감수성'],
    loveStyle: '감정을 존중하고 꿈을 지지하는 파트너십',
    stressors: ['거친 비판', '무관심'],
    bestElements: ['Water', 'Wood'],
    growthElements: ['Earth'],
    cautionElements: ['Metal'],
    primaryElement: 'Wood',
    supportNeed: '진심을 표현할 수 있는 느긋한 페이스',
    highlight: '상상력 있는 공감',
  },
  ENFJ: {
    type: 'ENFJ',
    nickname: '선도자',
    group: 'Diplomat',
    summary: '사람을 이끌고 성장시키는 따뜻한 카리스마를 지닌 유형',
    keywords: ['카리스마', '협력', '영감'],
    loveStyle: '상호 성장을 돕는 응원과 피드백',
    stressors: ['무기력한 태도', '분열된 분위기'],
    bestElements: ['Fire', 'Wood'],
    growthElements: ['Water'],
    cautionElements: ['Metal'],
    primaryElement: 'Fire',
    supportNeed: '함께 비전을 공유할 수 있는 열정',
    highlight: '사람을 모으는 힘',
  },
  ENFP: {
    type: 'ENFP',
    nickname: '활동가',
    group: 'Diplomat',
    summary: '새로운 가능성과 사람을 사랑하는 자유로운 탐험가',
    keywords: ['열정', '자유', '연결'],
    loveStyle: '창의적인 데이트와 정서적 지지',
    stressors: ['과도한 통제', '반복되는 일상'],
    bestElements: ['Fire', 'Wood'],
    growthElements: ['Water'],
    cautionElements: ['Metal'],
    primaryElement: 'Wood',
    supportNeed: '아이디어를 응원해주는 든든한 지지자',
    highlight: '감정-아이디어 연결력',
  },
  ISTJ: {
    type: 'ISTJ',
    nickname: '현실주의자',
    group: 'Sentinel',
    summary: '신뢰와 책임감을 바탕으로 안정감을 주는 유형',
    keywords: ['책임감', '체계', '신뢰'],
    loveStyle: '차분한 일상과 실용적 도움',
    stressors: ['갑작스러운 변화', '曖昧한 지시'],
    bestElements: ['Earth', 'Metal'],
    growthElements: ['Water'],
    cautionElements: ['Fire'],
    primaryElement: 'Earth',
    supportNeed: '예측 가능한 계획과 신뢰',
    highlight: '정확한 실행력',
  },
  ISFJ: {
    type: 'ISFJ',
    nickname: '수호자',
    group: 'Sentinel',
    summary: '섬세한 배려와 헌신으로 주변을 돌보는 유형',
    keywords: ['배려', '헌신', '세심함'],
    loveStyle: '실용적인 도움과 따뜻한 격려',
    stressors: ['무례한 태도', '과한 갈등'],
    bestElements: ['Earth', 'Water'],
    growthElements: ['Wood'],
    cautionElements: ['Fire'],
    primaryElement: 'Earth',
    supportNeed: '안전하고 따뜻한 루틴',
    highlight: '섬세한 지원력',
  },
  ESTJ: {
    type: 'ESTJ',
    nickname: '경영자',
    group: 'Sentinel',
    summary: '규칙과 효율을 중시해 시스템을 안정시키는 유형',
    keywords: ['조직', '효율', '책임'],
    loveStyle: '분명한 약속과 눈에 보이는 실행',
    stressors: ['우왕좌왕하는 계획', '불신'],
    bestElements: ['Earth', 'Fire'],
    growthElements: ['Metal'],
    cautionElements: ['Water'],
    primaryElement: 'Metal',
    supportNeed: '역할과 책임이 확실한 협력',
    highlight: '조직화 능력',
  },
  ESFJ: {
    type: 'ESFJ',
    nickname: '집정관',
    group: 'Sentinel',
    summary: '사람 사이의 조화를 만들고 유지하는 사회적 리더',
    keywords: ['조화', '돌봄', '커뮤니티'],
    loveStyle: '세심한 케어와 감정 공유',
    stressors: ['무심한 태도', '예의 없음'],
    bestElements: ['Earth', 'Fire'],
    growthElements: ['Water'],
    cautionElements: ['Metal'],
    primaryElement: 'Earth',
    supportNeed: '감사를 표현해주는 관계',
    highlight: '조화로운 운영',
  },
  ISTP: {
    type: 'ISTP',
    nickname: '장인',
    group: 'Explorer',
    summary: '실용적인 분석과 손재주로 문제를 해결하는 유형',
    keywords: ['실용', '분석', '유연성'],
    loveStyle: '자유로운 공간과 취미 공유',
    stressors: ['과한 간섭', '감정 압박'],
    bestElements: ['Metal', 'Water'],
    growthElements: ['Fire'],
    cautionElements: ['Earth'],
    primaryElement: 'Metal',
    supportNeed: '실험을 지켜봐주는 여유',
    highlight: '문제 해결 집중력',
  },
  ISFP: {
    type: 'ISFP',
    nickname: '모험가',
    group: 'Explorer',
    summary: '감각과 감성을 따라 자유롭게 표현하는 유형',
    keywords: ['감성', '예술', '자유'],
    loveStyle: '느긋한 공감과 감각적 경험',
    stressors: ['과한 규칙', '급한 결정'],
    bestElements: ['Water', 'Fire'],
    growthElements: ['Earth'],
    cautionElements: ['Metal'],
    primaryElement: 'Water',
    supportNeed: '자연스러운 흐름을 인정해주는 파트너',
    highlight: '감각적 몰입력',
  },
  ESTP: {
    type: 'ESTP',
    nickname: '사업가',
    group: 'Explorer',
    summary: '즉각적인 판단과 행동으로 상황을 돌파하는 유형',
    keywords: ['행동', '순발력', '모험'],
    loveStyle: '스릴 있는 경험과 솔직한 반응',
    stressors: ['지루한 반복', '느린 결론'],
    bestElements: ['Fire', 'Metal'],
    growthElements: ['Water'],
    cautionElements: ['Earth'],
    primaryElement: 'Fire',
    supportNeed: '에너지를 함께 즐길 배짱',
    highlight: '즉각적인 실행력',
  },
  ESFP: {
    type: 'ESFP',
    nickname: '연예인',
    group: 'Explorer',
    summary: '즐거움과 따뜻함으로 주변을 밝히는 유형',
    keywords: ['활기', '따뜻함', '사교성'],
    loveStyle: '즐거운 추억 만들기와 진심 어린 칭찬',
    stressors: ['과한 비판', '건조한 분위기'],
    bestElements: ['Fire', 'Water'],
    growthElements: ['Earth'],
    cautionElements: ['Metal'],
    primaryElement: 'Fire',
    supportNeed: '솔직한 애정 표현과 유연한 일정',
    highlight: '감정 전염 에너지',
  },
};

const ZODIAC_SIGNS: ZodiacProfile[] = [
  {
    id: 'rat',
    name: '쥐띠',
    englishName: 'Rat',
    emoji: '🐭',
    element: 'Water',
    yinYang: '양',
    years: '1996, 2008, 2020 등',
    keywords: ['민첩함', '정보력', '계산된 움직임'],
    relationshipStyle: '빠른 상황 파악과 재치 있는 대화',
    growthCue: '속도를 늦추고 감정을 살피는 연습이 필요해요.',
    luckyFocus: '데이터 정리 · 재테크 기초 학습',
    tagline: '민첩한 전략가',
  },
  {
    id: 'ox',
    name: '소띠',
    englishName: 'Ox',
    emoji: '🐮',
    element: 'Earth',
    yinYang: '음',
    years: '1997, 2009, 2021 등',
    keywords: ['끈기', '실행력', '묵묵한 신뢰'],
    relationshipStyle: '꾸준한 루틴과 실용적 지원',
    growthCue: '때로는 새로운 자극으로 활력을 더하세요.',
    luckyFocus: '재무 점검 · 생활 루틴 재정비',
    tagline: '묵직한 든든함',
  },
  {
    id: 'tiger',
    name: '호랑이띠',
    englishName: 'Tiger',
    emoji: '🐯',
    element: 'Wood',
    yinYang: '양',
    years: '1998, 2010, 2022 등',
    keywords: ['용기', '주도성', '정의감'],
    relationshipStyle: '열정적인 목표 공유와 즉흥적 모험',
    growthCue: '과열될 때는 휴식과 조절이 필요해요.',
    luckyFocus: '리더십 프로젝트 · 체력 단련',
    tagline: '호쾌한 리더',
  },
  {
    id: 'rabbit',
    name: '토끼띠',
    englishName: 'Rabbit',
    emoji: '🐰',
    element: 'Wood',
    yinYang: '음',
    years: '1999, 2011, 2023 등',
    keywords: ['배려', '감수성', '정교함'],
    relationshipStyle: '차분한 소통과 감정적 안정',
    growthCue: '스스로를 과하게 희생하지 않도록 주의하세요.',
    luckyFocus: '인테리어 정리 · 감성 독서',
    tagline: '섬세한 조율자',
  },
  {
    id: 'dragon',
    name: '용띠',
    englishName: 'Dragon',
    emoji: '🐲',
    element: 'Earth',
    yinYang: '양',
    years: '2000, 2012, 2024 등',
    keywords: ['카리스마', '비전', '성취'],
    relationshipStyle: '스케일 큰 꿈과 공동 프로젝트',
    growthCue: '디테일을 점검하며 균형을 잡으세요.',
    luckyFocus: '브랜드 전략 · 대외 활동',
    tagline: '비전을 현실로',
  },
  {
    id: 'snake',
    name: '뱀띠',
    englishName: 'Snake',
    emoji: '🐍',
    element: 'Fire',
    yinYang: '음',
    years: '2001, 2013, 2025 등',
    keywords: ['분석', '직감', '미학'],
    relationshipStyle: '느릿한 대화와 깊이 있는 감정 탐구',
    growthCue: '감정을 억누르지 말고 표현해 보세요.',
    luckyFocus: '예술 감상 · 감정 저널링',
    tagline: '직감적 전략가',
  },
  {
    id: 'horse',
    name: '말띠',
    englishName: 'Horse',
    emoji: '🐴',
    element: 'Fire',
    yinYang: '양',
    years: '2002, 2014, 2026 등',
    keywords: ['자유', '활력', '인기'],
    relationshipStyle: '활동적인 데이트와 빠른 실행',
    growthCue: '과열되면 페이스를 조절하세요.',
    luckyFocus: '스포츠 · 여행 계획',
    tagline: '에너지 드라이버',
  },
  {
    id: 'goat',
    name: '양띠',
    englishName: 'Goat',
    emoji: '🐐',
    element: 'Earth',
    yinYang: '음',
    years: '2003, 2015, 2027 등',
    keywords: ['따뜻함', '예술성', '협동'],
    relationshipStyle: '섬세한 공감과 팀워크',
    growthCue: '스스로를 먼저 챙기는 연습을 하세요.',
    luckyFocus: '공동 창작 · 홈카페',
    tagline: '공감형 아티스트',
  },
  {
    id: 'monkey',
    name: '원숭이띠',
    englishName: 'Monkey',
    emoji: '🐵',
    element: 'Metal',
    yinYang: '양',
    years: '2004, 2016, 2028 등',
    keywords: ['재치', '기술', '융통성'],
    relationshipStyle: '재미있는 프로젝트와 빠른 정보 교환',
    growthCue: '완급 조절과 꾸준함을 챙기세요.',
    luckyFocus: '사이드 프로젝트 · 기술 학습',
    tagline: '아이디어 메이커',
  },
  {
    id: 'rooster',
    name: '닭띠',
    englishName: 'Rooster',
    emoji: '🐔',
    element: 'Metal',
    yinYang: '음',
    years: '2005, 2017, 2029 등',
    keywords: ['정확함', '자기관리', '표현력'],
    relationshipStyle: '깔끔한 소통과 계획 공유',
    growthCue: '완벽주의를 내려놓고 여유를 주세요.',
    luckyFocus: '셀프 브랜딩 · 콘텐츠 제작',
    tagline: '정갈한 퍼포머',
  },
  {
    id: 'dog',
    name: '개띠',
    englishName: 'Dog',
    emoji: '🐶',
    element: 'Earth',
    yinYang: '양',
    years: '2006, 2018, 2030 등',
    keywords: ['충성', '정의', '헌신'],
    relationshipStyle: '신뢰 기반의 긴 대화',
    growthCue: '스스로를 의심하지 말고 인정하세요.',
    luckyFocus: '커뮤니티 봉사 · 관계 정리',
    tagline: '든든한 파수꾼',
  },
  {
    id: 'pig',
    name: '돼지띠',
    englishName: 'Pig',
    emoji: '🐷',
    element: 'Water',
    yinYang: '음',
    years: '2007, 2019, 2031 등',
    keywords: ['관대함', '휴식', '감각'],
    relationshipStyle: '따뜻한 일상과 진솔한 감정 공유',
    growthCue: '건강한 경계 설정이 필요해요.',
    luckyFocus: '웰니스 루틴 · 힐링 여행',
    tagline: '따뜻한 힐러',
  },
];

const ZODIAC_BY_ID: Record<string, ZodiacProfile> = ZODIAC_SIGNS.reduce(
  (acc, zodiac) => ({ ...acc, [zodiac.id]: zodiac }),
  {} as Record<string, ZodiacProfile>,
);

const MBTI_OPTIONS: MbtiOption[] = Object.values(MBTI_PROFILES)
  .sort((a, b) => {
    const groupOrder: MbtiGroup[] = ['Analyst', 'Diplomat', 'Sentinel', 'Explorer'];
    if (a.group === b.group) {
      return a.type.localeCompare(b.type);
    }
    return groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group);
  })
  .map((profile) => ({
    ...profile,
    groupLabel: MBTI_GROUP_META[profile.group].label,
    accent: MBTI_GROUP_META[profile.group].accent,
  }));

const ZODIAC_OPTIONS: ZodiacOption[] = ZODIAC_SIGNS.map((zodiac) => ({
  ...zodiac,
  elementLabel: ELEMENT_LABELS[zodiac.element],
}));

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createSeed(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 1_000_000_007;
  }
  return hash;
}

function pickFrom<T>(list: T[], seed: number, salt: number): T {
  if (list.length === 0) {
    throw new Error('pickFrom: list must not be empty');
  }
  const index = Math.abs((seed + salt) % list.length);
  return list[index];
}

function calculateTier(score: number): CompatibilityResult['tier'] {
  if (score >= 90) return 'S';
  if (score >= 82) return 'A';
  if (score >= 74) return 'B+';
  if (score >= 66) return 'B';
  return 'C';
}

function elementRelationshipScore(source: Element, target: Element): number {
  const synergy = ELEMENT_SYNERGY[source];
  if (synergy.harmony.includes(target)) {
    return 4;
  }
  if (synergy.supportive.includes(target)) {
    return 3;
  }
  if (synergy.tension.includes(target)) {
    return -3;
  }
  if (synergy.drain.includes(target)) {
    return -2;
  }
  return 1;
}

function mbtiElementAffinity(mbti: MbtiProfile, zodiac: ZodiacProfile): number {
  if (mbti.bestElements.includes(zodiac.element)) {
    return 4;
  }
  if (mbti.growthElements.includes(zodiac.element)) {
    return 2;
  }
  if (mbti.cautionElements.includes(zodiac.element)) {
    return -3;
  }
  return 0;
}

function calculateLetterHarmonyScore(a: MbtiProfile, b: MbtiProfile): number {
  const weights = [3, 3, 3, 3];
  let score = 0;
  let shared = 0;

  for (let i = 0; i < 4; i += 1) {
    if (a.type[i] === b.type[i]) {
      score += weights[i] + 1;
      shared += 1;
    } else {
      score += weights[i];
    }
  }

  if (shared === 4) {
    score += 2;
  } else if (shared <= 1) {
    score -= 2;
  }

  if (a.type[1] === b.type[1]) {
    score += 1;
  }

  if ((a.type[2] === 'F' && b.type[2] === 'T') || (a.type[2] === 'T' && b.type[2] === 'F')) {
    score += 1;
  }

  if ((a.type[0] === 'E' && b.type[0] === 'I') || (a.type[0] === 'I' && b.type[0] === 'E')) {
    score += 1;
  }

  return score;
}

function yinYangPairingBonus(my: CompatibilityPair, partner: CompatibilityPair): number {
  let bonus = my.zodiac.yinYang === partner.zodiac.yinYang ? 2 : 1;

  bonus += my.mbti.type.startsWith('E')
    ? partner.zodiac.yinYang === '양'
      ? 1
      : 0
    : partner.zodiac.yinYang === '음'
      ? 1
      : 0;

  bonus += partner.mbti.type.startsWith('E')
    ? my.zodiac.yinYang === '양'
      ? 1
      : 0
    : my.zodiac.yinYang === '음'
      ? 1
      : 0;

  return bonus;
}

function calculatePairScore(my: CompatibilityPair, partner: CompatibilityPair, seed: number): number {
  let score = 58;

  score += GROUP_PAIR_SCORE[my.mbti.group][partner.mbti.group];

  score += calculateLetterHarmonyScore(my.mbti, partner.mbti);

  score += mbtiElementAffinity(my.mbti, partner.zodiac);
  score += mbtiElementAffinity(partner.mbti, my.zodiac);

  const elementScore =
    elementRelationshipScore(my.zodiac.element, partner.zodiac.element) +
    elementRelationshipScore(partner.zodiac.element, my.zodiac.element);
  score += Math.round(elementScore * 0.8);

  if (my.mbti.primaryElement === partner.zodiac.element) {
    score += 2;
  }
  if (partner.mbti.primaryElement === my.zodiac.element) {
    score += 2;
  }

  score += yinYangPairingBonus(my, partner);

  score += (seed % 7) - 3;

  return clamp(score, 52, 96);
}

function buildSynergyHighlights(
  my: CompatibilityPair,
  partner: CompatibilityPair,
  tier: CompatibilityResult['tier'],
  seed: number,
): string[] {
  const tone =
    tier === 'S' || tier === 'A'
      ? ['즉각적인 공명', '주도적인 파트너십', '빛나는 추진력']
      : tier === 'B+' || tier === 'B'
        ? ['차분한 균형', '보완적인 팀워크', '서로를 성장시키는 연결']
        : ['속도를 맞춰 가는 연습', '의도적인 호흡 조절', '경계를 배우는 시간'];

  return [
    `${my.mbti.nickname}(${my.mbti.type})의 ${pickFrom(my.mbti.keywords, seed, 3)} 기질과 ${partner.mbti.nickname}(${partner.mbti.type})의 ${pickFrom(partner.mbti.keywords, seed, 5)} 감각이 만나 ${pickFrom(tone, seed, 7)}을(를) 형성합니다.`,
    `${my.zodiac.name}의 ${pickFrom(my.zodiac.keywords, seed, 9)} 리듬과 ${partner.zodiac.name}의 ${pickFrom(partner.zodiac.keywords, seed, 11)} 흐름이 결합해 ${
      tier === 'C' ? '차분하지만 단단한 신뢰를 만드는 연습이' : '안정적인 감정 교환이'
    } 가능해집니다.`,
    `함께 ${my.zodiac.luckyFocus}를 즐기고 ${partner.zodiac.luckyFocus}로 이어 가면 ${my.mbti.highlight}과 ${partner.mbti.highlight} 모두에 시너지가 생깁니다.`,
  ];
}

function buildGrowthTips(
  my: CompatibilityPair,
  partner: CompatibilityPair,
  tier: CompatibilityResult['tier'],
  seed: number,
): string[] {
  const empathyCue =
    tier === 'C'
      ? '속도를 조절하면서 서로의 경계를 세심하게 살펴보세요.'
      : '대화를 시작하기 전 오늘의 에너지 상태를 공유하면 갈등이 줄어듭니다.';

  return [
    `${partner.zodiac.relationshipStyle} 리듬을 존중하면 ${partner.mbti.nickname}의 ${partner.mbti.loveStyle} 감각을 이해하기 쉬워집니다.`,
    `${my.mbti.nickname}이(가) '${my.mbti.stressors[0]}' 신호를 느끼면 ${pickFrom(RESET_TIPS, seed, 13)} 후에 이야기를 이어가 보세요.`,
    `${my.zodiac.luckyFocus}와 ${partner.zodiac.luckyFocus}를 번갈아 실천하면 ${my.mbti.supportNeed}·${partner.mbti.supportNeed}을(를) 동시에 채울 수 있어요. ${empathyCue}`,
  ];
}

function buildDailyAdvice(
  my: CompatibilityPair,
  partner: CompatibilityPair,
  tier: CompatibilityResult['tier'],
  seed: number,
): DailyAdvice {
  const cautionTail =
    tier === 'C'
      ? '호흡을 가다듬고 속도를 낮추는 것이 핵심이에요.'
      : '초반에 감정을 투명하게 나누면 오해가 줄어듭니다.';

  return {
    focus: `${my.mbti.nickname}의 ${my.mbti.highlight}과 ${partner.mbti.nickname}의 ${partner.mbti.highlight}을 살리도록 ${my.zodiac.luckyFocus} → ${partner.zodiac.luckyFocus} 순서로 하루 루틴을 설계해 보세요.`,
    caution: `${my.mbti.stressors[1] ?? my.mbti.stressors[0]}이나 ${partner.mbti.stressors[1] ?? partner.mbti.stressors[0]} 기류가 감지되면 ${partner.zodiac.growthCue}를 참고해 부드럽게 말을 건네 보세요. ${cautionTail}`,
    reset: `${pickFrom(RESET_TIPS, seed, 17)} 서로 번갈아 실천한 뒤, ${my.zodiac.tagline} 감각으로 마무리하면 리셋에 도움이 됩니다.`,
  };
}

function buildLuckyGuide(
  my: CompatibilityPair,
  partner: CompatibilityPair,
  seed: number,
): LuckyGuide {
  const myColors = LUCKY_COLORS_BY_ELEMENT[my.zodiac.element];
  const partnerColors = LUCKY_COLORS_BY_ELEMENT[partner.zodiac.element];

  return {
    color: `${pickFrom(myColors, seed, 19)} × ${pickFrom(partnerColors, seed, 23)}`,
    day: `${DAYS_BY_ELEMENT[my.zodiac.element]} · ${DAYS_BY_ELEMENT[partner.zodiac.element]}`,
    ritual: `${pickFrom(LUCKY_RITUALS, seed, 29)} & ${pickFrom(LUCKY_RITUALS, seed, 31)}`,
  };
}

function calculateIndexes(score: number, seed: number): CompatibilityIndexes {
  return {
    love: clamp(score + (((seed >> 1) % 9) - 4), 55, 98),
    teamwork: clamp(score - 5 + (((seed >> 3) % 9) - 3), 52, 95),
    communication: clamp(score - 4 + (((seed >> 5) % 7) - 2), 50, 93),
  };
}

function buildReferenceNotes(tier: CompatibilityResult['tier']): string[] {
  const [, ...restNotes] = REFERENCE_NOTE_LIBRARY;
  const tierNote =
    tier === 'S' || tier === 'A'
      ? '※ 좋은 흐름일수록 서로의 속도와 경계를 주기적으로 확인하세요.'
      : '※ 점수가 낮아도 페이스 맞추기와 진솔한 대화 습관이 있으면 충분히 시너지를 만들 수 있습니다.';
  const baseNote =
    '※ 본 리포트는 두 사람의 MBTI 심리 경향과 12띠 페르소나 데이터를 교차 분석한 엔터테인먼트 콘텐츠입니다.';
  return [baseNote, ...restNotes, tierNote];
}

export function getCompatibility(
  myMbtiType: string,
  myZodiacId: string,
  partnerMbtiType: string,
  partnerZodiacId: string,
): CompatibilityResult {
  const fallbackMbti = MBTI_PROFILES[MBTI_OPTIONS[0]?.type ?? 'ENFP'];
  const fallbackZodiac = ZODIAC_BY_ID[ZODIAC_OPTIONS[0]?.id ?? 'rat'];

  const my: CompatibilityPair = {
    mbti: MBTI_PROFILES[myMbtiType] ?? fallbackMbti,
    zodiac: ZODIAC_BY_ID[myZodiacId] ?? fallbackZodiac,
  };

  const partner: CompatibilityPair = {
    mbti: MBTI_PROFILES[partnerMbtiType] ?? fallbackMbti,
    zodiac: ZODIAC_BY_ID[partnerZodiacId] ?? fallbackZodiac,
  };

  const seed = createSeed(
    `${my.mbti.type}-${my.zodiac.id}-${partner.mbti.type}-${partner.zodiac.id}`,
  );

  const score = calculatePairScore(my, partner, seed);
  const tier = calculateTier(score);
  const headline = pickFrom(TIER_HEADLINES[tier], seed, 37);
  const intro = `${my.mbti.nickname}(${my.mbti.type})·${my.zodiac.name}와 ${partner.mbti.nickname}(${partner.mbti.type})·${partner.zodiac.name} 조합은 ${score}점으로 ${headline} 영역에 속합니다.`;

  return {
    my,
    partner,
    score,
    tier,
    headline,
    intro,
    synergyHighlights: buildSynergyHighlights(my, partner, tier, seed),
    growthTips: buildGrowthTips(my, partner, tier, seed),
    indexes: calculateIndexes(score, seed),
    dailyAdvice: buildDailyAdvice(my, partner, tier, seed),
    luckyGuide: buildLuckyGuide(my, partner, seed),
    referenceNotes: buildReferenceNotes(tier),
  };
}

export function getRecommendedZodiacs(mbtiType: string, limit = 4): ZodiacProfile[] {
  const mbti = MBTI_PROFILES[mbtiType];
  if (!mbti) {
    return ZODIAC_SIGNS.slice(0, limit);
  }

  const topMatches = ZODIAC_SIGNS.filter((zodiac) => mbti.bestElements.includes(zodiac.element));
  const growthMatches = ZODIAC_SIGNS.filter(
    (zodiac) =>
      !topMatches.some((item) => item.id === zodiac.id) && mbti.growthElements.includes(zodiac.element),
  );

  const combined = [...topMatches, ...growthMatches, ...ZODIAC_SIGNS].filter(
    (item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index,
  );

  return combined.slice(0, limit);
}

export { MBTI_OPTIONS, ZODIAC_OPTIONS };
