"use client";

import { useState } from 'react';
import AppFooter from "@/app/components/AppFooter";
import Link from 'next/link';

const COLORS = [
  // 빨강 계열
  { 
    name: '순수 빨강', 
    hex: '#DC2626', 
    psychology: '열정적, 리더십, 강한 의지력', 
    traits: ['적극적', '도전적', '주도적', '경쟁심강함'],
    career: ['CEO', '영업팀장', '프로젝트 리더', '기업가', '정치인', '스포츠 선수'], 
    fortune: '재물운 대상승, 승진운, 리더십 부각', 
    element: '화',
    mbti: ['ENTJ', 'ESTJ', 'ESTP'],
    detail: '목표 지향적이고 추진력이 강합니다. 경쟁 상황에서 빛을 발하며, 자신의 의견을 명확히 표현합니다.'
  },
  { 
    name: '진한 빨강', 
    hex: '#991B1B', 
    psychology: '정열적, 카리스마, 권력 지향', 
    traits: ['강인함', '집중력', '결단력', '야망'],
    career: ['변호사', '검사', '경영자', 'CEO', '군인', '경찰'], 
    fortune: '권력운, 승리운, 재산축적', 
    element: '화',
    mbti: ['ENTJ', 'INTJ', 'ESTJ'],
    detail: '강력한 카리스마와 결단력을 가졌습니다. 목표를 위해 끈기있게 노력하며, 리더 역할을 자연스럽게 맡습니다.'
  },
  { 
    name: '주황', 
    hex: '#EA580C', 
    psychology: '사교적, 활발함, 창의적', 
    traits: ['외향적', '긍정적', '소통능력', '유머감각'],
    career: ['마케터', '방송인', 'PR 전문가', '이벤트 기획자', '연예인', '유튜버'], 
    fortune: '인기운, 사교운, 좋은 만남', 
    element: '화',
    mbti: ['ENFP', 'ESFP', 'ENFJ'],
    detail: '사람들과 어울리는 것을 좋아하고 분위기 메이커입니다. 새로운 아이디어로 사람들을 즐겁게 합니다.'
  },
  { 
    name: '코랄', 
    hex: '#FB7185', 
    psychology: '친근함, 따뜻함, 배려심', 
    traits: ['다정함', '공감능력', '섬세함', '사려깊음'],
    career: ['상담사', '사회복지사', '유치원 교사', '간호사', '심리치료사', '작가'], 
    fortune: '인간관계운, 사랑운, 치유의 힘', 
    element: '화',
    mbti: ['ENFJ', 'INFJ', 'ESFJ'],
    detail: '타인의 감정을 잘 이해하고 배려합니다. 따뜻한 마음으로 주변 사람들을 돌보는 것을 좋아합니다.'
  },
  
  // 노랑 계열
  { 
    name: '레몬 옐로우', 
    hex: '#FDE047', 
    psychology: '낙천적, 밝음, 지적 호기심', 
    traits: ['긍정적', '명랑함', '학구열', '창의성'],
    career: ['교사', '작가', '연구원', '발명가', '저널리스트', '과학자'], 
    fortune: '지혜운, 학업운, 창작운', 
    element: '토',
    mbti: ['ENTP', 'INTP', 'ENFP'],
    detail: '항상 밝고 긍정적인 에너지를 발산합니다. 새로운 것을 배우고 탐구하는 것을 즐깁니다.'
  },
  { 
    name: '금색', 
    hex: '#CA8A04', 
    psychology: '고귀함, 성공 지향, 완벽주의', 
    traits: ['품격', '자존감', '성취욕', '완벽추구'],
    career: ['금융 전문가', '명품 바이어', '보석 디자이너', '경영컨설턴트', '투자가', '세무사'], 
    fortune: '재물운, 명예운, 최상의 행운', 
    element: '금',
    mbti: ['ENTJ', 'INTJ', 'ISTJ'],
    detail: '높은 목표를 설정하고 이를 달성하기 위해 노력합니다. 품질과 완성도를 중시합니다.'
  },
  { 
    name: '크림 옐로우', 
    hex: '#FEF9C3', 
    psychology: '부드러움, 온화함, 평화로움', 
    traits: ['차분함', '인내심', '포용력', '조화추구'],
    career: ['상담사', '명상 지도자', '요가 강사', '힐링 센터 운영', '카페 운영', '작가'], 
    fortune: '평화운, 안정운, 정신적 풍요', 
    element: '토',
    mbti: ['INFP', 'INFJ', 'ISFP'],
    detail: '평화롭고 조화로운 환경을 추구합니다. 갈등을 피하고 모두가 행복한 상태를 원합니다.'
  },

  // 초록 계열
  { 
    name: '에메랄드', 
    hex: '#10B981', 
    psychology: '균형감각, 치유력, 성장', 
    traits: ['안정적', '신뢰감', '치유능력', '성장지향'],
    career: ['의사', '한의사', '물리치료사', '환경운동가', '농업인', '원예가'], 
    fortune: '건강운, 재생운, 성장운', 
    element: '목',
    mbti: ['INFJ', 'ISFJ', 'ENFJ'],
    detail: '자연과 조화를 이루며 사는 것을 좋아합니다. 다른 사람의 성장을 돕는 것에서 보람을 느낍니다.'
  },
  { 
    name: '민트', 
    hex: '#6EE7B7', 
    psychology: '신선함, 활력, 청량감', 
    traits: ['상쾌함', '긍정적', '활동적', '사교적'],
    career: ['피트니스 트레이너', '뷰티 크리에이터', '카페 운영', '이벤트 플래너', '패션 디자이너'], 
    fortune: '인기운, 건강운, 새로운 시작', 
    element: '목',
    mbti: ['ESFP', 'ENFP', 'ESTP'],
    detail: '항상 새로운 것을 시도하고 활력이 넘칩니다. 사람들에게 긍정적인 영향을 줍니다.'
  },
  { 
    name: '올리브', 
    hex: '#84CC16', 
    psychology: '실용성, 현실적, 안정추구', 
    traits: ['현실적', '실용적', '신중함', '계획적'],
    career: ['회계사', '금융 분석가', '공무원', '부동산 전문가', '경영 관리자'], 
    fortune: '재산운, 안정운, 착실한 발전', 
    element: '목',
    mbti: ['ISTJ', 'ISFJ', 'ESTJ'],
    detail: '체계적이고 계획적으로 일을 처리합니다. 안정적인 미래를 위해 꾸준히 노력합니다.'
  },
  { 
    name: '다크 그린', 
    hex: '#166534', 
    psychology: '깊이, 신뢰성, 전문성', 
    traits: ['신중함', '전문성', '책임감', '보수적'],
    career: ['변호사', '교수', '의사', '연구원', '은행장', '판사'], 
    fortune: '신뢰운, 전문성 인정, 권위', 
    element: '목',
    mbti: ['INTJ', 'ISTJ', 'INFJ'],
    detail: '전문성과 깊이를 중시합니다. 책임감이 강하고 신뢰할 수 있는 사람입니다.'
  },

  // 파랑 계열
  { 
    name: '하늘색', 
    hex: '#60A5FA', 
    psychology: '평온함, 이상주의, 꿈많음', 
    traits: ['순수함', '이상적', '상상력', '평화로움'],
    career: ['시인', '예술가', '음악가', '작가', '심리학자', '철학자'], 
    fortune: '영감운, 창작운, 정신적 성장', 
    element: '수',
    mbti: ['INFP', 'ISFP', 'INFJ'],
    detail: '이상적인 세계를 꿈꾸고 예술적 감성이 풍부합니다. 내면의 평화를 중시합니다.'
  },
  { 
    name: '로얄 블루', 
    hex: '#1D4ED8', 
    psychology: '신뢰, 진실성, 충성심', 
    traits: ['정직함', '신뢰성', '충실함', '전통중시'],
    career: ['공무원', '경찰관', '군인', '은행원', '교사', '법조인'], 
    fortune: '신뢰운, 안정운, 명예', 
    element: '수',
    mbti: ['ISTJ', 'ISFJ', 'ESTJ'],
    detail: '원칙과 규칙을 중시하며 신뢰할 수 있는 사람입니다. 맡은 일에 책임감이 강합니다.'
  },
  { 
    name: '네이비', 
    hex: '#1E3A8A', 
    psychology: '지적, 권위, 전문성', 
    traits: ['논리적', '분석적', '전문가적', '집중력'],
    career: ['변호사', 'CEO', '의사', '교수', '과학자', '전략가'], 
    fortune: '지혜운, 권위운, 성공', 
    element: '수',
    mbti: ['INTJ', 'INTP', 'ENTJ'],
    detail: '논리적이고 분석적인 사고를 합니다. 전문 분야에서 권위를 인정받습니다.'
  },
  { 
    name: '터코이즈', 
    hex: '#14B8A6', 
    psychology: '소통, 명료함, 자유로움', 
    traits: ['개방적', '소통능력', '창의적', '자유로움'],
    career: ['작가', '디자이너', '광고인', '여행가', '강사', 'SNS 크리에이터'], 
    fortune: '소통운, 창의운, 여행운', 
    element: '수',
    mbti: ['ENFP', 'ENTP', 'INFP'],
    detail: '자유로운 영혼으로 창의적인 표현을 즐깁니다. 다양한 사람들과 소통하는 것을 좋아합니다.'
  },

  // 보라 계열
  { 
    name: '라벤더', 
    hex: '#C084FC', 
    psychology: '우아함, 감수성, 예술성', 
    traits: ['섬세함', '감성적', '낭만적', '상상력'],
    career: ['예술가', '작가', '음악가', '플로리스트', '패션 디자이너', '향수 조향사'], 
    fortune: '예술운, 감성운, 영감', 
    element: '화',
    mbti: ['INFP', 'ISFP', 'ENFP'],
    detail: '섬세한 감수성과 예술적 재능을 가졌습니다. 아름다움을 추구하고 창조합니다.'
  },
  { 
    name: '진보라', 
    hex: '#7C3AED', 
    psychology: '고귀함, 신비로움, 영성', 
    traits: ['직관력', '영적', '신비로움', '깊이'],
    career: ['심리학자', '철학자', '영적 상담사', '타로 상담사', '작가', '예술가'], 
    fortune: '직관운, 영적 성장, 통찰력', 
    element: '화',
    mbti: ['INFJ', 'INTJ', 'INFP'],
    detail: '깊은 통찰력과 직관력을 가졌습니다. 영적이고 신비로운 것에 관심이 많습니다.'
  },
  { 
    name: '자주색', 
    hex: '#581C87', 
    psychology: '카리스마, 권위, 독창성', 
    traits: ['독특함', '카리스마', '권위적', '창의적'],
    career: ['CEO', '예술 감독', '크리에이티브 디렉터', '작가', '철학자', '혁신가'], 
    fortune: '권력운, 창의운, 독보적 성공', 
    element: '화',
    mbti: ['INTJ', 'ENTJ', 'INFJ'],
    detail: '독창적이고 독특한 관점을 가졌습니다. 자신만의 길을 개척하는 혁신가입니다.'
  },

  // 분홍 계열
  { 
    name: '파스텔 핑크', 
    hex: '#FBCFE8', 
    psychology: '순수함, 로맨틱, 부드러움', 
    traits: ['순수함', '낭만적', '다정함', '온화함'],
    career: ['유치원 교사', '웨딩 플래너', '제과사', '플로리스트', '아동 심리상담사'], 
    fortune: '애정운, 순수한 만남, 행복', 
    element: '화',
    mbti: ['ISFP', 'ESFJ', 'ISFJ'],
    detail: '순수하고 낭만적입니다. 타인에게 따뜻함과 행복을 전달하는 것을 좋아합니다.'
  },
  { 
    name: '핫핑크', 
    hex: '#EC4899', 
    psychology: '열정적 사랑, 활력, 자신감', 
    traits: ['매력적', '활발함', '자신감', '열정적'],
    career: ['패션 디자이너', 'MD', '뷰티 크리에이터', '마케터', '스타일리스트', 'PR 전문가'], 
    fortune: '매력운, 사랑운, 성공운', 
    element: '화',
    mbti: ['ESFP', 'ENFP', 'ESTP'],
    detail: '활력이 넘치고 자신감 있습니다. 자신의 매력을 잘 표현하고 주목받는 것을 즐깁니다.'
  },
  { 
    name: '로즈 골드', 
    hex: '#F87171', 
    psychology: '우아함, 세련됨, 품위', 
    traits: ['세련됨', '품격', '감각적', '우아함'],
    career: ['명품 바이어', '주얼리 디자이너', '갤러리 큐레이터', '인테리어 디자이너', '아트 컨설턴트'], 
    fortune: '귀인운, 품위운, 고급스러운 만남', 
    element: '금',
    mbti: ['INFJ', 'ISFJ', 'ENFJ'],
    detail: '세련되고 우아한 취향을 가졌습니다. 품질과 아름다움을 동시에 추구합니다.'
  },

  // 무채색
  { 
    name: '순백', 
    hex: '#FFFFFF', 
    psychology: '순수함, 완벽주의, 청결', 
    traits: ['완벽주의', '청결함', '순수함', '이상주의'],
    career: ['의사', '연구원', '약사', '디자이너', '건축가', 'IT 엔지니어'], 
    fortune: '정화운, 새출발, 완벽한 시작', 
    element: '금',
    mbti: ['INTJ', 'ISTJ', 'INFJ'],
    detail: '완벽을 추구하고 높은 기준을 가지고 있습니다. 깨끗하고 정돈된 환경을 선호합니다.'
  },
  { 
    name: '아이보리', 
    hex: '#FFFBEB', 
    psychology: '온화함, 자연스러움, 평온', 
    traits: ['온화함', '자연스러움', '평화로움', '포근함'],
    career: ['상담사', '치료사', '교육자', '작가', '카페 운영', '원예가'], 
    fortune: '평화운, 안정운, 따뜻한 인연', 
    element: '토',
    mbti: ['INFP', 'ISFJ', 'INFJ'],
    detail: '자연스럽고 편안한 분위기를 만듭니다. 따뜻하고 포근한 감성을 가지고 있습니다.'
  },
  { 
    name: '실버', 
    hex: '#D1D5DB', 
    psychology: '현대적, 세련됨, 미래지향', 
    traits: ['현대적', '혁신적', '기술적', '세련됨'],
    career: ['IT 전문가', '엔지니어', 'UX 디자이너', '테크 스타트업', '데이터 사이언티스트'], 
    fortune: '기술운, 혁신운, 미래 성공', 
    element: '금',
    mbti: ['INTJ', 'INTP', 'ENTJ'],
    detail: '최신 트렌드와 기술에 민감합니다. 혁신적이고 미래지향적인 사고를 합니다.'
  },
  { 
    name: '차콜', 
    hex: '#374151', 
    psychology: '중립적, 신중함, 현실적', 
    traits: ['중립적', '객관적', '신중함', '분석적'],
    career: ['분석가', '회계사', '감정평가사', '컨설턴트', '금융 전문가', '엔지니어'], 
    fortune: '안정운, 균형운, 합리적 판단', 
    element: '금',
    mbti: ['ISTJ', 'INTJ', 'ISTP'],
    detail: '객관적이고 신중하게 판단합니다. 감정보다는 논리와 데이터를 중시합니다.'
  },
  { 
    name: '검정', 
    hex: '#000000', 
    psychology: '강함, 카리스마, 권위', 
    traits: ['강인함', '카리스마', '독립적', '결단력'],
    career: ['CEO', '변호사', '판사', '디렉터', '건축가', '명품 디자이너'], 
    fortune: '권력운, 카리스마, 최고의 지위', 
    element: '수',
    mbti: ['ENTJ', 'INTJ', 'ESTJ'],
    detail: '강력한 카리스마와 리더십을 가졌습니다. 독립적이고 결단력 있게 행동합니다.'
  },

  // 갈색 계열
  { 
    name: '베이지', 
    hex: '#FEF3C7', 
    psychology: '안정감, 편안함, 자연스러움', 
    traits: ['편안함', '안정적', '신뢰감', '실용적'],
    career: ['인테리어 디자이너', '부동산 전문가', '가구 디자이너', '카페 운영', '농업인'], 
    fortune: '안정운, 토지운, 편안한 삶', 
    element: '토',
    mbti: ['ISFJ', 'ISTJ', 'ESFJ'],
    detail: '안정적이고 편안한 환경을 추구합니다. 실용적이고 믿을 수 있는 사람입니다.'
  },
  { 
    name: '카키', 
    hex: '#A16207', 
    psychology: '실용성, 내구성, 신뢰', 
    traits: ['실용적', '견고함', '책임감', '성실함'],
    career: ['건축가', '토목기사', '부동산 투자', '농업 경영', '목수', '장인'], 
    fortune: '재산운, 토지운, 탄탄한 기반', 
    element: '토',
    mbti: ['ISTJ', 'ESTJ', 'ISTP'],
    detail: '실용적이고 견고한 것을 선호합니다. 오래 지속되는 가치를 만들어냅니다.'
  },
  { 
    name: '초콜릿', 
    hex: '#78350F', 
    psychology: '따뜻함, 안정감, 풍요로움', 
    traits: ['따뜻함', '포근함', '풍요로움', '인내심'],
    career: ['제과사', '바리스타', '요리사', '호텔리어', '목공예가', '레스토랑 운영'], 
    fortune: '풍요운, 재물운, 따뜻한 인간관계', 
    element: '토',
    mbti: ['ISFJ', 'ESFJ', 'ISFP'],
    detail: '따뜻하고 포근한 분위기를 만듭니다. 사람들에게 안정감과 편안함을 제공합니다.'
  },

  // 특수 색상
  { 
    name: '와인', 
    hex: '#881337', 
    psychology: '성숙함, 깊이, 열정', 
    traits: ['성숙함', '깊이', '열정적', '고급스러움'],
    career: ['소믈리에', '미식 평론가', '갤러리 디렉터', '명품 바이어', '아트 컨설턴트'], 
    fortune: '고급스러운 만남, 재물운, 품격', 
    element: '화',
    mbti: ['INTJ', 'INFJ', 'ENTJ'],
    detail: '깊이있고 성숙한 사고를 합니다. 고급스럽고 세련된 것을 추구합니다.'
  },
  { 
    name: '인디고', 
    hex: '#4338CA', 
    psychology: '직관, 영감, 통찰력', 
    traits: ['직관적', '통찰력', '영적', '창의적'],
    career: ['심리학자', '철학자', '작가', '예술가', '영적 지도자', '심리 상담사'], 
    fortune: '직관운, 영감운, 정신적 성장', 
    element: '수',
    mbti: ['INFJ', 'INTJ', 'INFP'],
    detail: '강한 직관력과 통찰력을 가졌습니다. 보이지 않는 것을 볼 수 있는 능력이 있습니다.'
  },
  { 
    name: '피치', 
    hex: '#FED7AA', 
    psychology: '부드러움, 친근함, 따뜻함', 
    traits: ['친근함', '다정함', '포근함', '사교적'],
    career: ['유치원 교사', '요양 보호사', '베이커리 운영', '웨딩 플래너', '아동 상담사'], 
    fortune: '인간관계운, 따뜻한 만남, 행복', 
    element: '토',
    mbti: ['ESFJ', 'ISFJ', 'ENFJ'],
    detail: '친근하고 따뜻한 성격입니다. 사람들과의 관계에서 행복을 느낍니다.'
  }
];

// 5단계 질문
const QUESTIONS = [
  {
    id: 1,
    question: "아침에 눈을 떴을 때",
    subtext: "가장 먼저 떠오르는 색상은?",
    emoji: "🌅"
  },
  {
    id: 2,
    question: "힘들고 지칠 때",
    subtext: "위로가 되는 색상은?",
    emoji: "💭"
  },
  {
    id: 3,
    question: "큰 성공을 이루었을 때",
    subtext: "축하하고 싶은 색상은?",
    emoji: "🎉"
  },
  {
    id: 4,
    question: "사랑하는 사람을 생각할 때",
    subtext: "떠오르는 색상은?",
    emoji: "💝"
  },
  {
    id: 5,
    question: "나의 미래를 상상할 때",
    subtext: "보이는 색상은?",
    emoji: "🌟"
  }
];

// 색상 조합별 심층 분석
const COLOR_COMBINATIONS: Record<string, string> = {
  'red-blue': '열정과 이성의 완벽한 균형. 감성과 논리를 모두 갖춘 리더형 인재입니다.',
  'red-yellow': '열정과 창의성의 조합. 도전적이고 혁신적인 기업가 기질이 있습니다.',
  'blue-green': '안정과 성장의 조화. 차분하면서도 발전을 추구하는 성장형 인재입니다.',
  'purple-pink': '예술적 감성과 낭만의 결합. 섬세하고 창의적인 예술가 기질이 있습니다.',
  'black-white': '양극단의 조화. 완벽주의적이고 명확한 판단력을 가진 전문가형입니다.',
  'green-brown': '자연과 안정의 추구. 실용적이고 지속가능한 가치를 중시합니다.',
  'yellow-orange': '밝은 에너지의 폭발. 긍정적이고 활발한 사교형 인재입니다.',
  'red-purple': '열정과 신비의 만남. 카리스마 있고 독특한 매력을 가진 리더형입니다.',
  'blue-purple': '지성과 감성의 조화. 논리적이면서도 창의적인 사고를 하는 천재형입니다.',
  'pink-white': '순수한 사랑. 순수하고 깨끗한 마음을 가진 이상주의자입니다.'
};

export default function ColorPsychology() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedColors, setSelectedColors] = useState<{[key: number]: typeof COLORS[0]}>({});
  const [result, setResult] = useState<any>(null);

  const selectColor = (color: typeof COLORS[0]) => {
    const newSelections = { ...selectedColors, [currentStep]: color };
    setSelectedColors(newSelections);
    
    // 마지막 질문이면 분석 시작
    if (currentStep === QUESTIONS.length - 1) {
      setTimeout(() => analyzeResults(newSelections), 500);
    } else {
      // 다음 질문으로
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const analyzeResults = (selections: {[key: number]: typeof COLORS[0]}) => {
    const colors = Object.values(selections);
    
    // 심리 특성 통합
    const allTraits = Array.from(new Set(colors.flatMap(c => c.traits)));
    const personalities = colors.map(c => c.psychology).join(', ');
    
    // 직업 추천
    const careers = Array.from(new Set(colors.flatMap(c => c.career))).slice(0, 10);
    
    // 오행 분석
    const elements = colors.map(c => c.element);
    const elementCount: Record<string, number> = {};
    elements.forEach(e => {
      elementCount[e] = (elementCount[e] || 0) + 1;
    });
    const dominantElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0];
    
    // MBTI 유형 추론
    const allMBTI = colors.flatMap(c => c.mbti);
    const mbtiCount: Record<string, number> = {};
    allMBTI.forEach(m => {
      mbtiCount[m] = (mbtiCount[m] || 0) + 1;
    });
    const topMBTI = Object.entries(mbtiCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mbti]) => mbti);

    // 색상 조합 해석
    const colorSimplified = colors.map(c => {
      if (c.hex.includes('DC2626') || c.hex.includes('991B1B')) return 'red';
      if (c.hex.includes('3B82F6') || c.hex.includes('1D4ED8')) return 'blue';
      if (c.hex.includes('22C55E') || c.hex.includes('10B981')) return 'green';
      if (c.hex.includes('A855F7') || c.hex.includes('7C3AED')) return 'purple';
      if (c.hex.includes('EC4899') || c.hex.includes('FBCFE8')) return 'pink';
      if (c.hex.includes('000000')) return 'black';
      if (c.hex.includes('FFFFFF')) return 'white';
      if (c.hex.includes('EAB308') || c.hex.includes('FDE047')) return 'yellow';
      if (c.hex.includes('EA580C')) return 'orange';
      if (c.hex.includes('78350F') || c.hex.includes('92400E')) return 'brown';
      return 'other';
    });
    
    const combinationKey = colorSimplified.slice(0, 2).sort().join('-');
    const combinationAnalysis = COLOR_COMBINATIONS[combinationKey] || getInterpretation(colors);

    // 운세 통합
    const fortunes = colors.map(c => c.fortune);

    setResult({
      personalities,
      allTraits,
      careers,
      dominantElement: dominantElement[0],
      elementStrength: dominantElement[1],
      selectedColors: colors,
      interpretation: combinationAnalysis,
      mbti: topMBTI,
      fortunes,
      details: colors.map(c => c.detail),
      answers: selections
    });
  };

  const getInterpretation = (colors: typeof COLORS) => {
    const warmColors = colors.filter(c => ['화'].includes(c.element)).length;
    const coolColors = colors.filter(c => ['수', '목'].includes(c.element)).length;
    
    if (warmColors > coolColors) {
      return '따뜻한 색상 위주 - 열정적이고 외향적인 성격입니다. 활동적이고 사교적입니다.';
    } else if (coolColors > warmColors) {
      return '차가운 색상 위주 - 차분하고 신중한 성격입니다. 논리적이고 분석적입니다.';
    }
    
    return '다양한 색상 조합 - 균형잡힌 성격으로 다재다능합니다. 상황에 따라 유연하게 대처합니다.';
  };

  const getElementDescription = (element: string): string => {
    const descriptions: Record<string, string> = {
      '화': '불의 기운 - 열정, 활동성, 창조력이 강합니다. 리더십과 추진력이 뛰어납니다.',
      '수': '물의 기운 - 지혜, 유연성, 적응력이 뛰어납니다. 깊이있는 사고와 포용력이 있습니다.',
      '목': '나무의 기운 - 성장, 발전, 확장을 추구합니다. 안정적이면서도 발전지향적입니다.',
      '금': '금속의 기운 - 명확함, 정확함, 완벽함을 추구합니다. 원칙적이고 체계적입니다.',
      '토': '흙의 기운 - 안정, 포용, 실용성을 중시합니다. 신뢰할 수 있고 현실적입니다.'
    };
    return descriptions[element] || '';
  };

  const restart = () => {
    setCurrentStep(0);
    setSelectedColors({});
    setResult(null);
  };

  // 결과 화면
  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900">
        <div className="mx-auto max-w-[800px] px-4 py-6">
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <header className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">🎨</h1>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">색상 심리 분석 결과</h2>
            </header>

            {/* 질문별 선택 색상 */}
            <div className="mb-8">
              <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">📝 당신의 선택</h3>
              <div className="space-y-3">
                {QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{q.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{q.question}</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{result.answers[idx]?.name}</p>
                      </div>
                      <div 
                        className="w-16 h-16 rounded-lg shadow-md" 
                        style={{backgroundColor: result.answers[idx]?.hex}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 종합 해석 */}
            <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl border-2 border-purple-200 dark:border-purple-700">
              <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-100">💡 종합 해석</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {result.interpretation}
              </p>
            </div>

            {/* 성격 특성 */}
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-xl">
              <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-100">🧠 성격 특성</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {result.allTraits.map((trait: string, i: number) => (
                  <span 
                    key={i} 
                    className="bg-blue-100 dark:bg-blue-800 px-4 py-2 rounded-full text-sm font-semibold text-gray-800 dark:text-gray-100"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* MBTI 유형 */}
            <div className="mb-6 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/50 dark:to-orange-900/50 rounded-xl">
              <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-100">🎯 예상 MBTI 유형</h3>
              <div className="flex gap-3">
                {result.mbti.map((type: string, i: number) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-yellow-100 dark:bg-yellow-800 px-4 py-3 rounded-lg text-center"
                  >
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오행 분석 */}
            <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 rounded-xl">
              <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-100">☯️ 오행 에너지 분석</h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
                  {result.dominantElement} ({result.elementStrength}/5)
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                  {getElementDescription(result.dominantElement)}
                </p>
              </div>
            </div>

            {/* 추천 직업 */}
            <div className="mb-6 p-5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/50 dark:to-pink-900/50 rounded-xl">
              <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-100">💼 추천 직업</h3>
              <div className="grid grid-cols-2 gap-2">
                {result.careers.map((career: string, i: number) => (
                  <div 
                    key={i} 
                    className="bg-rose-100 dark:bg-rose-800 px-4 py-3 rounded-lg text-center font-semibold text-gray-800 dark:text-gray-100"
                  >
                    {career}
                  </div>
                ))}
              </div>
            </div>

            {/* 운세 */}
            <div className="mb-6 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/50 dark:to-yellow-900/50 rounded-xl">
              <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-100">🍀 운세</h3>
              <div className="space-y-2">
                {result.fortunes.map((fortune: string, i: number) => (
                  <div 
                    key={i} 
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300"
                  >
                    ✨ {fortune}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={restart}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all"
            >
              다시 테스트하기
            </button>
          </section>

          {/* 돌아가기 버튼 */}
          <div className="text-center pb-8">
            <Link 
              href="/" 
              className="inline-block bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 질문 화면
  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="mx-auto max-w-[900px] px-4 py-6">
        {/* 진행도 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              질문 {currentStep + 1} / {QUESTIONS.length}
            </span>
            <span className="text-sm font-semibold text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-8">
          <header className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">{currentQuestion.emoji}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {currentQuestion.question}
            </h2>
            <p className="text-xl text-gray-600">{currentQuestion.subtext}</p>
          </header>

          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => selectColor(color)}
                  className="group relative p-3 rounded-xl transition-all hover:scale-110 hover:shadow-2xl transform"
                  style={{
                    backgroundColor: color.hex,
                    border: color.hex === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                  }}
                >
                  <div className="h-12"></div>
                  <div 
                    className="text-xs font-bold text-center mt-2 drop-shadow-lg"
                    style={{
                      color: ['#FFFFFF', '#FFFBEB', '#FBCFE8', '#FEF3C7', '#FED7AA'].includes(color.hex) 
                        ? '#374151' 
                        : '#FFFFFF'
                    }}
                  >
                    {color.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {currentStep > 0 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
              >
                ← 이전 질문
              </button>
            </div>
          )}
        </section>

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8 pb-8">
          <Link 
            href="/" 
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}
