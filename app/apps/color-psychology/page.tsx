"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import Link from 'next/link';
import AdOverlay from '@/app/components/AdOverlay';

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

    // 운세 통합
    const fortunes = colors.map(c => c.fortune);

    setResult({
      personalities,
      allTraits,
      careers,
      dominantElement: dominantElement[0],
      elementStrength: dominantElement[1],
      selectedColors: colors,
      mbti: topMBTI,
      fortunes,
      details: colors.map(c => c.detail),
      answers: selections
    });
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
      <PremiumLayout theme="pink">
        
        <AdOverlay /><div className="mx-auto max-w-[1000px] px-4 py-8">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>돌아가기</span>
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-2xl text-center mb-6 md:mb-8 animate-fadeIn">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4 animate-bounce">🎨</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">당신의 색채 심리 분석</h1>
            <p className="text-base md:text-lg opacity-90">색상이 말해주는 당신의 마음과 성격</p>
          </div>

          {/* 선택한 색상들 with 의미 */}
          <div className="mb-6 md:mb-8 space-y-3 md:space-y-4 animate-slideUp">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-4 md:mb-6">🌈 당신이 선택한 색상의 의미</h3>
            {QUESTIONS.map((q, idx) => {
              const selectedColor = result.answers[idx];
              return (
                <PremiumCard key={q.id} hover gradient>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                    <div className="flex-shrink-0 w-full md:w-auto flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                      <div className="text-3xl sm:text-4xl md:text-5xl md:mb-3">{q.emoji}</div>
                      <div 
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl shadow-2xl border-3 md:border-4 border-white/30"
                        style={{
                          backgroundColor: selectedColor?.hex,
                          boxShadow: `0 15px 40px ${selectedColor?.hex}60`
                        }}
                      ></div>
                      <p className="text-white font-bold text-center md:mt-3 text-base md:text-lg flex-1 md:flex-none">{selectedColor?.name}</p>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="mb-3">
                        <p className="text-pink-200 font-semibold text-xs sm:text-sm mb-1">{q.question}</p>
                        <p className="text-white text-lg sm:text-xl md:text-2xl font-bold">{selectedColor?.psychology}</p>
                      </div>
                      <p className="text-white/90 leading-relaxed text-sm sm:text-base mb-3 md:mb-4">
                        {selectedColor?.detail}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedColor?.traits.map((trait: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 md:px-3 bg-white/20 rounded-full text-xs sm:text-sm text-white font-medium">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              );
            })}
          </div>

          {/* 종합 심리 분석 */}
          <div className="mb-6 md:mb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <PremiumCard hover gradient className="bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="text-center mb-4 md:mb-6">
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🧠</div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4">당신의 종합 심리 분석</h3>
                <p className="text-base md:text-lg text-white/80">선택한 색상들이 말하는 당신의 내면</p>
              </div>
              
              {/* 오행 에너지 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border-2 border-white/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="text-4xl md:text-5xl">☯️</div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">당신의 오행 에너지</h4>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-300">{result.dominantElement}</div>
                      <div className="text-white/80">
                        <div className="text-xs sm:text-sm">강도</div>
                        <div className="text-xl sm:text-2xl font-bold">{result.elementStrength}/5</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg md:rounded-xl p-4 md:p-5 border-l-4 border-yellow-400">
                  <p className="text-white leading-relaxed text-sm md:text-base">
                    {getElementDescription(result.dominantElement)}
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm mt-2 md:mt-3">
                    {result.elementStrength >= 4 && '당신의 오행 에너지가 매우 강합니다! 이 특성이 당신의 성격과 행동을 크게 좌우합니다.'}
                    {result.elementStrength === 3 && '당신의 오행 에너지가 균형잡혀 있습니다. 여러 면모를 가진 다채로운 성격이에요.'}
                    {result.elementStrength <= 2 && '여러 오행 에너지가 섞여 있어 유연하고 적응력이 좋습니다!'}
                  </p>
                </div>
              </div>

              {/* MBTI 유형 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-white/20">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="text-3xl md:text-4xl">🎯</div>
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-white">예상 MBTI 유형</h4>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-3 md:mb-4 justify-center">
                  {result.mbti.map((type: string, i: number) => (
                    <div 
                      key={i} 
                      className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 text-center min-w-[80px] sm:min-w-[90px] md:min-w-[100px] shadow-xl border-2 border-white/30"
                    >
                      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{type}</div>
                      <div className="text-white/80 text-xs sm:text-sm mt-1 md:mt-2">
                        {i === 0 ? '가능성 높음' : i === 1 ? '다음 가능성' : '참고'}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-white/80 text-xs sm:text-sm text-center">
                  색상 선택을 통해 분석한 결과입니다. 정확한 MBTI는 공식 테스트를 권장합니다!
                </p>
              </div>
            </PremiumCard>
          </div>

          {/* 성격 특성 */}
          <PremiumCard hover gradient className="mb-6 md:mb-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
              <div className="text-4xl md:text-5xl">💎</div>
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">당신의 성격 특성</h3>
                <p className="text-sm md:text-base text-white/70">색상으로 드러난 당신의 매력</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {result.allTraits.map((trait: string, i: number) => (
                <span 
                  key={i} 
                  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm md:text-base font-bold border-2 border-white/30 hover:bg-white/40 hover:scale-110 transition-all duration-300 shadow-lg"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  ✨ {trait}
                </span>
              ))}
            </div>
            <p className="text-white/80 mt-4 md:mt-6 text-xs sm:text-sm leading-relaxed">
              이런 특성들이 모여 당신만의 독특한 매력을 만들어냅니다! 각각의 특성을 잘 활용하면 더욱 빛날 거예요. 💫
            </p>
          </PremiumCard>

          {/* 추천 직업 */}
          <PremiumCard hover gradient className="mb-6 md:mb-8 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
              <div className="text-4xl md:text-5xl">💼</div>
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">당신에게 어울리는 직업</h3>
                <p className="text-sm md:text-base text-white/70">색상 심리가 추천하는 커리어</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {result.careers.map((career: string, i: number) => (
                <div 
                  key={i} 
                  className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 text-center text-white font-bold border-2 border-white/20 hover:scale-105 hover:bg-white/30 transition-all duration-300 shadow-lg"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">
                    {i === 0 ? '🏆' : i === 1 ? '🌟' : i === 2 ? '✨' : '💡'}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base">{career}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 border-l-4 border-blue-400">
              <p className="text-white text-xs sm:text-sm leading-relaxed">
                💡 <strong>팁:</strong> 이 직업들은 당신의 성격과 잘 맞아요! 현재 하는 일과 다르다면, 취미로 시도해보는 것도 좋습니다. 
                자신의 성향을 이해하면 일할 때도 더 행복해질 수 있어요!
              </p>
            </div>
          </PremiumCard>

          {/* 운세 */}
          <PremiumCard hover gradient className="mb-6 md:mb-8 animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
              <div className="text-4xl md:text-5xl">🍀</div>
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">당신의 운세</h3>
                <p className="text-sm md:text-base text-white/70">색상이 말하는 행운의 기운</p>
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              {result.fortunes.map((fortune: string, i: number) => (
                <div 
                  key={i} 
                  className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 text-white border-2 border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="text-2xl sm:text-3xl md:text-4xl group-hover:scale-125 transition-transform flex-shrink-0">
                      {i === 0 ? '✨' : i === 1 ? '🌟' : i === 2 ? '💫' : i === 3 ? '⭐' : '🌠'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{fortune}</p>
                      <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                        {fortune.includes('재물운') && '금전적인 행운이 따르는 시기예요. 투자나 사업에 좋은 기회가 올 수 있습니다!'}
                        {fortune.includes('사랑운') && '사랑과 인연의 운이 강해요. 좋은 만남이나 관계 개선의 기회가 있을 거예요!'}
                        {fortune.includes('건강운') && '건강과 활력이 넘치는 시기입니다. 새로운 건강 습관을 시작하기 좋아요!'}
                        {fortune.includes('창의') && '예술적, 창의적 활동에서 빛을 발할 시기입니다. 당신의 아이디어를 표현해보세요!'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* 최종 메시지 */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-2xl mb-6 md:mb-8 animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">🌈</div>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">당신은 아름다운 색채를 가진 사람이에요</h4>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed opacity-95 max-w-3xl mx-auto">
                색상 선택은 무의식적인 마음의 표현입니다. 당신이 선택한 색상들은 당신의 현재 감정 상태, 성격, 그리고 
                미래에 대한 바람을 담고 있어요. 이 결과를 통해 자신을 더 잘 이해하고, 자신만의 색깔로 세상을 
                아름답게 칠해나가세요! 🎨✨
              </p>
              <div className="mt-4 md:mt-6 text-xs sm:text-sm opacity-90">
                💌 색상은 계속 변할 수 있어요. 시간이 지나면 다시 해보는 것도 재미있을 거예요!
              </div>
            </div>
          </div>

          {/* 다시 하기 버튼 */}
          <div className="text-center mb-6 md:mb-8 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
            <button
        type="button"
              onClick={restart}
              className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white text-base sm:text-lg md:text-xl font-bold rounded-xl md:rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/30"
            >
              {/* 반짝이는 배경 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl md:rounded-2xl animate-shimmer opacity-0 group-hover:opacity-100"></div>
              
              {/* 아이콘 */}
              <span className="text-2xl sm:text-3xl md:text-4xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
              
              {/* 텍스트 */}
              <span className="relative z-10">다시 테스트하기</span>
              
              {/* 화살표 */}
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            {/* 힌트 텍스트 */}
            <p className="text-white/60 text-xs sm:text-sm mt-3 md:mt-4 animate-pulse">
              마음이 바뀌었다면? 다른 색상을 선택해보세요! 💫
            </p>
          </div>

          {/* Related Apps */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <RelatedApps currentAppSlug="color-psychology" className="mt-8" />
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .animate-slideUp {
            animation: slideUp 0.8s ease-out forwards;
          }

          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
        `}</style>
      </PremiumLayout>
    );
  }

  // 질문 화면
  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <PremiumLayout theme="pink">
      <div className="mx-auto max-w-[1000px] px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 mb-8 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>돌아가기</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            🎨 색채 심리 테스트
          </h1>
          <p className="text-xl text-white/80">색상으로 알아보는 나의 심리와 성격</p>
        </div>

        <PremiumCard hover gradient className="animate-slideUp">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex justify-between text-white mb-0.5 sm:mb-1.5 md:mb-2">
              <span className="text-sm font-medium">질문 {currentStep + 1} / {QUESTIONS.length}</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="relative w-full bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/20">
              <div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                style={{ 
                  width: `${progress}%`,
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-10">
            <div className="text-7xl mb-6 animate-float">{currentQuestion.emoji}</div>
            <h2 className="text-base sm:text-2xl md:text-4xl font-bold text-white mb-0.5 sm:mb-1.5 md:mb-2">
              {currentQuestion.question}
            </h2>
            <p className="text-xl text-white/80">{currentQuestion.subtext}</p>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {COLORS.map((color, idx) => (
              <button
        type="button"
                key={color.name}
                onClick={() => selectColor(color)}
                className="group relative rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-2 active:scale-95"
                style={{
                  backgroundColor: color.hex,
                  border: ['#FFFFFF', '#FFFBEB', '#FBCFE8', '#FEF3C7', '#FED7AA', '#D1D5DB'].includes(color.hex) 
                    ? '3px solid rgba(255, 255, 255, 0.4)' 
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `0 10px 30px ${color.hex}40, 0 0 0 0 ${color.hex}`,
                  animation: 'slideUp 0.5s ease-out forwards, pulse 2s ease-in-out infinite',
                  animationDelay: `${idx * 0.03}s, 0s`,
                  opacity: 0
                }}
              >
                <div className="p-4 md:p-5 h-24 md:h-28 flex items-center justify-center relative z-10">
                  <span 
                    className="text-xs md:text-sm font-bold text-center drop-shadow-lg leading-tight"
                    style={{
                      color: ['#FFFFFF', '#FFFBEB', '#FBCFE8', '#FEF3C7', '#FED7AA', '#D1D5DB'].includes(color.hex) 
                        ? '#374151' 
                        : '#FFFFFF'
                    }}
                  >
                    {color.name}
                  </span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" 
                  style={{ backgroundColor: color.hex }}
                ></div>
                {/* 선택 표시 */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {currentStep > 0 && (
            <div className="text-center mt-8">
              <button
        type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="group inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-base md:text-lg font-semibold rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
                <span>이전 질문</span>
              </button>
            </div>
          )}
        </PremiumCard>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { 
            box-shadow: 0 10px 30px currentColor40, 0 0 0 0 currentColor;
          }
          50% { 
            box-shadow: 0 10px 30px currentColor40, 0 0 0 4px currentColor;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}