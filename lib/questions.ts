import type { Question } from './types';

export const QUESTIONS: Question[] = [
  // 1단계: 에너지 성향 (활동 vs 안정)
  {
    id: 'e1',
    step: 1,
    title: '주말엔 뭐가 더 당기나요?',
    choices: [
      { id: 'e1a', label: '땀 흘리는 야외활동', impact: { energy: +2, env: +1, social: +1 } },
      { id: 'e1b', label: '실내에서 조용히 몰입', impact: { energy: -2, env: -1, focus: +1 } },
    ],
  },
  {
    id: 'e2',
    step: 1,
    title: '새로운 장소에서의 나는?',
    choices: [
      { id: 'e2a', label: '사람들과 금방 어울림', impact: { social: +2, energy: +1 } },
      { id: 'e2b', label: '익숙함이 편하다', impact: { social: -2, energy: -1 } },
    ],
  },
  {
    id: 'e3',
    step: 1,
    title: '하루 중 선호 시간대는?',
    choices: [
      { id: 'e3a', label: '낮/햇빛 아래', impact: { energy: +1, env: +1 } },
      { id: 'e3b', label: '밤/차분한 시간', impact: { energy: -1, focus: +1 } },
    ],
  },
  {
    id: 'e4',
    step: 1,
    title: '몸을 쓰는 일에 대한 생각',
    choices: [
      { id: 'e4a', label: '상쾌하고 스트레스 해소', impact: { energy: +2, env: +1 } },
      { id: 'e4b', label: '피곤하고 번거로움', impact: { energy: -2 } },
    ],
  },
  {
    id: 'e5',
    step: 1,
    title: '즉흥적 외출 제안이 오면?',
    choices: [
      { id: 'e5a', label: '일단 나가보자!', impact: { energy: +2, social: +1 } },
      { id: 'e5b', label: '계획 없으면 부담', impact: { energy: -1, focus: +1 } },
    ],
  },
  {
    id: 'e6',
    step: 1,
    title: '여행 스타일은?',
    choices: [
      { id: 'e6a', label: '액티비티 꽉 채우기', impact: { energy: +2, env: +1 } },
      { id: 'e6b', label: '카페/숙소에서 휴식', impact: { energy: -2 } },
    ],
  },
  {
    id: 'e7',
    step: 1,
    title: '새 취미 장비 준비',
    choices: [
      { id: 'e7a', label: '장비 사는 재미!', impact: { env: +1, energy: +1 } },
      { id: 'e7b', label: '장비 귀찮음', impact: { env: -1 } },
    ],
  },

  // 2단계: 집중 방식 (몰입 vs 탐색)
  {
    id: 'f1',
    step: 2,
    title: '한 가지에 푹 빠지는 편인가요?',
    choices: [
      { id: 'f1a', label: '완성도 중요, 깊게 파기', impact: { focus: +2 } },
      { id: 'f1b', label: '여러 가지 맛보기', impact: { focus: -2 } },
    ],
  },
  {
    id: 'f2',
    step: 2,
    title: '새 취미 시작 방식',
    choices: [
      { id: 'f2a', label: '자료/커리큘럼부터 정리', impact: { focus: +2, affect: -1 } },
      { id: 'f2b', label: '일단 해보며 배우기', impact: { focus: -1, affect: +1 } },
    ],
  },
  {
    id: 'f3',
    step: 2,
    title: '완성도 vs 다양성',
    choices: [
      { id: 'f3a', label: '완성도', impact: { focus: +2 } },
      { id: 'f3b', label: '다양성', impact: { focus: -2 } },
    ],
  },
  {
    id: 'f4',
    step: 2,
    title: '반복 연습',
    choices: [
      { id: 'f4a', label: '루틴/연습이 즐거움', impact: { focus: +2 } },
      { id: 'f4b', label: '쉽게 질림', impact: { focus: -2 } },
    ],
  },
  {
    id: 'f5',
    step: 2,
    title: '기록/노트',
    choices: [
      { id: 'f5a', label: '기록은 필수', impact: { focus: +1, affect: -1 } },
      { id: 'f5b', label: '느낌만 기억', impact: { focus: -1, affect: +1 } },
    ],
  },
  {
    id: 'f6',
    step: 2,
    title: '도전 난이도',
    choices: [
      { id: 'f6a', label: '어려울수록 불타오름', impact: { focus: +1, energy: +1 } },
      { id: 'f6b', label: '쉬운 것부터', impact: { focus: -1 } },
    ],
  },
  {
    id: 'f7',
    step: 2,
    title: '콘텐츠/작품 감상 포인트',
    choices: [
      { id: 'f7a', label: '구조/맥락/설계', impact: { affect: -2, focus: +1 } },
      { id: 'f7b', label: '분위기/감정선', impact: { affect: +2 } },
    ],
  },

  // 3단계: 사회성 (개인 vs 교류)
  {
    id: 's1',
    step: 3,
    title: '취미는 보통',
    choices: [
      { id: 's1a', label: '혼자', impact: { social: -2 } },
      { id: 's1b', label: '같이', impact: { social: +2 } },
    ],
  },
  {
    id: 's2',
    step: 3,
    title: '결과물 공개',
    choices: [
      { id: 's2a', label: '부담됨', impact: { social: -1, affect: +1 } },
      { id: 's2b', label: '기대됨', impact: { social: +1 } },
    ],
  },
  {
    id: 's3',
    step: 3,
    title: '동호회/클럽',
    choices: [
      { id: 's3a', label: '관심 없음', impact: { social: -2 } },
      { id: 's3b', label: '가입 의향', impact: { social: +2 } },
    ],
  },
  {
    id: 's4',
    step: 3,
    title: '경쟁/대회',
    choices: [
      { id: 's4a', label: '부담', impact: { social: -1, affect: +1 } },
      { id: 's4b', label: '흥미', impact: { social: +1, energy: +1 } },
    ],
  },
  {
    id: 's5',
    step: 3,
    title: '협업 프로젝트',
    choices: [
      { id: 's5a', label: '선호하지 않음', impact: { social: -1 } },
      { id: 's5b', label: '흥미있음', impact: { social: +1, focus: +1 } },
    ],
  },
  {
    id: 's6',
    step: 3,
    title: '가르치기/튜터링',
    choices: [
      { id: 's6a', label: '관심 적음', impact: { social: -1 } },
      { id: 's6b', label: '관심 많음', impact: { social: +1 } },
    ],
  },
  {
    id: 's7',
    step: 3,
    title: '온라인 커뮤니티 참여',
    choices: [
      { id: 's7a', label: '눈팅 위주', impact: { social: -1 } },
      { id: 's7b', label: '활발히 글/사진 공유', impact: { social: +1 } },
    ],
  },

  // 4단계: 감각/감정 (감성 vs 논리)
  {
    id: 'a1',
    step: 4,
    title: '배움의 중심',
    choices: [
      { id: 'a1a', label: '느낌/직관', impact: { affect: +2 } },
      { id: 'a1b', label: '체계/원리', impact: { affect: -2 } },
    ],
  },
  {
    id: 'a2',
    step: 4,
    title: '색/소리/향에 민감?',
    choices: [
      { id: 'a2a', label: '예', impact: { affect: +2 } },
      { id: 'a2b', label: '아니오', impact: { affect: -1 } },
    ],
  },
  {
    id: 'a3',
    step: 4,
    title: '작품 피드백 스타일',
    choices: [
      { id: 'a3a', label: '감정에 울림이 있는지', impact: { affect: +2 } },
      { id: 'a3b', label: '구조/디테일의 완성도', impact: { affect: -2 } },
    ],
  },
  {
    id: 'a4',
    step: 4,
    title: '하루 마무리 루틴',
    choices: [
      { id: 'a4a', label: '음악/글로 감정 정리', impact: { affect: +1 } },
      { id: 'a4b', label: '계획/정리/기록', impact: { affect: -1, focus: +1 } },
    ],
  },
  {
    id: 'a5',
    step: 4,
    title: '취미 동기',
    choices: [
      { id: 'a5a', label: '마음의 힐링', impact: { affect: +2 } },
      { id: 'a5b', label: '스킬/성과', impact: { affect: -2, focus: +1 } },
    ],
  },
  {
    id: 'a6',
    step: 4,
    title: '즉흥 창작',
    choices: [
      { id: 'a6a', label: '즐김', impact: { affect: +1 } },
      { id: 'a6b', label: '계획형', impact: { affect: -1, focus: +1 } },
    ],
  },
  {
    id: 'a7',
    step: 4,
    title: '정답이 있는 활동',
    choices: [
      { id: 'a7a', label: '덜 매력적', impact: { affect: +1 } },
      { id: 'a7b', label: '안정감', impact: { affect: -1 } },
    ],
  },

  // 5단계: 환경 선호 (실내/머리 vs 실외/손)
  {
    id: 'v1',
    step: 5,
    title: '공간 선호',
    choices: [
      { id: 'v1a', label: '실내가 편함', impact: { env: -2 } },
      { id: 'v1b', label: '실외가 좋음', impact: { env: +2 } },
    ],
  },
  {
    id: 'v2',
    step: 5,
    title: '손을 쓰는 작업',
    choices: [
      { id: 'v2a', label: '만족감 큼', impact: { env: +2, affect: +1 } },
      { id: 'v2b', label: '선호 낮음', impact: { env: -1 } },
    ],
  },
  {
    id: 'v3',
    step: 5,
    title: '머리 쓰는 퍼즐/전략',
    choices: [
      { id: 'v3a', label: '재밌다', impact: { env: -1, focus: +1 } },
      { id: 'v3b', label: '지친다', impact: { env: +1 } },
    ],
  },
  {
    id: 'v4',
    step: 5,
    title: '장비/도구 준비',
    choices: [
      { id: 'v4a', label: '준비 과정이 설렘', impact: { env: +1 } },
      { id: 'v4b', label: '최소한이면 좋음', impact: { env: -1 } },
    ],
  },
  {
    id: 'v5',
    step: 5,
    title: '야외 기후 영향',
    choices: [
      { id: 'v5a', label: '기후 상관없음', impact: { env: +1, energy: +1 } },
      { id: 'v5b', label: '날씨 영향 큼', impact: { env: -1 } },
    ],
  },
  {
    id: 'v6',
    step: 5,
    title: '공동 사용 공간(공방/체육관)',
    choices: [
      { id: 'v6a', label: '괜찮다', impact: { env: +1, social: +1 } },
      { id: 'v6b', label: '혼자 공간 선호', impact: { env: -1, social: -1 } },
    ],
  },
  {
    id: 'v7',
    step: 5,
    title: '관람/구경 vs 실습',
    choices: [
      { id: 'v7a', label: '직접 해보는 게 좋다', impact: { env: +1, focus: +1 } },
      { id: 'v7b', label: '구경이 더 편함', impact: { env: -1, affect: +1 } },
    ],
  },
];

