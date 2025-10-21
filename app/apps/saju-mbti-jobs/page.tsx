"use client";

import { useState } from "react";
import { 
  CELESTIAL_STEMS, 
  TERRESTRIAL_BRANCHES,
  TEN_GODS_CAREERS,
  TWELVE_PHASES_TRAITS,
  DAY_PILLAR_TRAITS,
  SPECIAL_STARS
} from "@/lib/saju-engine";

// MBTI 16가지 유형
const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

// MBTI별 상세 특성
const MBTI_DETAILS: Record<string, { nickname: string; traits: string[]; workStyle: string }> = {
  "INTJ": { nickname: "전략가", traits: ["분석적", "독립적", "미래지향적", "논리적"], workStyle: "체계적 계획과 전략 수립" },
  "INTP": { nickname: "논리술사", traits: ["호기심", "논리적", "분석적", "객관적"], workStyle: "이론과 분석을 통한 문제 해결" },
  "ENTJ": { nickname: "통솔자", traits: ["리더십", "결단력", "효율적", "목표지향적"], workStyle: "조직을 이끌고 목표 달성" },
  "ENTP": { nickname: "변론가", traits: ["창의적", "도전적", "논리적", "혁신적"], workStyle: "새로운 아이디어로 변화 주도" },
  "INFJ": { nickname: "옹호자", traits: ["이상주의", "통찰력", "공감능력", "헌신적"], workStyle: "사람들에게 의미있는 영향" },
  "INFP": { nickname: "중재자", traits: ["이상주의", "창의적", "감수성", "가치중심"], workStyle: "자신의 가치관을 실현" },
  "ENFJ": { nickname: "선도자", traits: ["카리스마", "공감", "열정", "협력적"], workStyle: "사람들을 이끌고 성장시킴" },
  "ENFP": { nickname: "활동가", traits: ["열정적", "창의적", "자유로움", "사교적"], workStyle: "열정으로 새로운 가능성 탐구" },
  "ISTJ": { nickname: "현실주의자", traits: ["책임감", "실용적", "체계적", "신뢰"], workStyle: "정확하고 체계적인 업무 처리" },
  "ISFJ": { nickname: "수호자", traits: ["헌신적", "세심함", "책임감", "배려"], workStyle: "안정적이고 꼼꼼한 지원" },
  "ESTJ": { nickname: "경영자", traits: ["실용적", "조직적", "책임감", "원칙적"], workStyle: "명확한 규칙으로 조직 관리" },
  "ESFJ": { nickname: "집정관", traits: ["친절", "협력적", "책임감", "사교적"], workStyle: "화합과 협력을 통한 업무" },
  "ISTP": { nickname: "장인", traits: ["실용적", "분석적", "적응력", "문제해결"], workStyle: "실질적 기술로 문제 해결" },
  "ISFP": { nickname: "모험가", traits: ["예술적", "유연함", "감수성", "개방적"], workStyle: "자유롭고 창의적인 표현" },
  "ESTP": { nickname: "사업가", traits: ["실용적", "행동적", "사교적", "적응력"], workStyle: "즉각적이고 실질적인 행동" },
  "ESFP": { nickname: "연예인", traits: ["열정적", "친근함", "즉흥적", "사교적"], workStyle: "활기차고 즐거운 분위기 조성" }
};

// 사주 계산 (간단 버전 - 년주 기준)
const calculateYearPillar = (year: number) => {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return {
    stem: CELESTIAL_STEMS[stemIndex],
    branch: TERRESTRIAL_BRANCHES[branchIndex]
  };
};

// 일주 특성 가져오기 (사전에 있는 것만)
const getDayPillarInfo = (stemName: string, branchName: string) => {
  const key = stemName.charAt(0) + branchName.charAt(0);
  return DAY_PILLAR_TRAITS[key] || null;
};

// 종합 직업 추천 (사주 + MBTI)
const getComprehensiveJobRecommendations = (
  element: string,
  mbti: string,
  dayPillarInfo: any
): string[] => {
  const jobs = new Set<string>();
  
  // MBTI 기반 직업
  const mbtiJobs: Record<string, string[]> = {
    "INTJ": ["전략 기획자", "데이터 과학자", "시스템 설계자", "경영 컨설턴트"],
    "INTP": ["연구원", "소프트웨어 개발자", "대학교수", "기술 작가"],
    "ENTJ": ["CEO", "변호사", "프로젝트 매니저", "금융 전문가"],
    "ENTP": ["창업가", "마케터", "발명가", "컨설턴트"],
    "INFJ": ["상담사", "작가", "교육자", "심리치료사"],
    "INFP": ["예술가", "작가", "상담사", "큐레이터"],
    "ENFJ": ["교사", "HR 전문가", "코치", "홍보 전문가"],
    "ENFP": ["마케터", "저널리스트", "이벤트 플래너", "카피라이터"],
    "ISTJ": ["회계사", "감사", "공무원", "의료 기술자"],
    "ISFJ": ["간호사", "교사", "행정직", "사서"],
    "ESTJ": ["경영자", "군인", "경찰", "은행원"],
    "ESFJ": ["교사", "의료인", "이벤트 플래너", "영업직"],
    "ISTP": ["엔지니어", "정비사", "조종사", "소방관"],
    "ISFP": ["디자이너", "미용사", "요리사", "사진작가"],
    "ESTP": ["영업", "운동선수", "사업가", "응급구조사"],
    "ESFP": ["연예인", "이벤트 기획자", "판매직", "여행 가이드"]
  };
  
  // MBTI 직업 추가
  mbtiJobs[mbti]?.forEach(job => jobs.add(job));
  
  // 오행 기반 직업 추가
  const elementJobs: Record<string, string[]> = {
    "목": ["환경 전문가", "교육자", "의료인", "농업 관련"],
    "화": ["방송인", "마케터", "영업", "IT 전문가"],
    "토": ["부동산", "건설", "금융", "행정직"],
    "금": ["법률가", "금융 전문가", "군인", "경찰"],
    "수": ["예술가", "작가", "연구원", "디자이너"]
  };
  
  elementJobs[element]?.forEach(job => jobs.add(job));
  
  // 일주 기반 직업 추가
  if (dayPillarInfo && dayPillarInfo.careers) {
    dayPillarInfo.careers.forEach((job: string) => jobs.add(job));
  }
  
  return Array.from(jobs).slice(0, 10);
};

interface AnalysisResult {
  yearPillar: { stem: any; branch: any };
  element: string;
  elementTrait: string;
  mbtiDetail: { nickname: string; traits: string[]; workStyle: string };
  dayPillarInfo: any;
  recommendedJobs: string[];
  tenGodsCareer: { trait: string; careers: string[] };
  specialStar: any;
}

export default function SajuMBTIJobs() {
  const [step, setStep] = useState(1);
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [birthHour, setBirthHour] = useState(12);
  const [gender, setGender] = useState("");
  const [birthType, setBirthType] = useState("");
  const [mbti, setMbti] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!mbti) {
      alert("MBTI를 선택해주세요!");
      return;
    }
    if (!gender) {
      alert("성별을 선택해주세요!");
      return;
    }
    if (!birthType) {
      alert("출산 방법을 선택해주세요!");
      return;
    }

    // 년주 계산
    const yearPillar = calculateYearPillar(birthYear);
    const element = yearPillar.stem.element;
    
    // MBTI 상세 정보
    const mbtiDetail = MBTI_DETAILS[mbti];
    
    // 일주 정보 (년주 기준으로 대략적으로)
    const dayPillarInfo = getDayPillarInfo(yearPillar.stem.name, yearPillar.branch.name);
    
    // 십성 직업 (첫번째 것 사용)
    const firstTenGod = Object.keys(TEN_GODS_CAREERS)[0];
    const tenGodsCareer = TEN_GODS_CAREERS[firstTenGod];
    
    // 특수 신살 (화개살 사용 - 예술적)
    const specialStar = SPECIAL_STARS['화개살'];
    
    // 종합 직업 추천
    const recommendedJobs = getComprehensiveJobRecommendations(element, mbti, dayPillarInfo);

    setResult({
      yearPillar,
      element,
      elementTrait: yearPillar.stem.trait,
      mbtiDetail,
      dayPillarInfo,
      recommendedJobs,
      tenGodsCareer,
      specialStar
    });
    
    setStep(2);
  };

  const restart = () => {
    setStep(1);
    setResult(null);
    setBirthYear(1990);
    setBirthMonth(1);
    setBirthDay(1);
    setBirthHour(12);
    setGender("");
    setBirthType("");
    setMbti("");
  };

  if (step === 2 && result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-yellow-50 dark:from-red-950 dark:via-amber-950 dark:to-yellow-950 transition-colors" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(180, 83, 9, 0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(161, 98, 7, 0.3) 0%, transparent 40%), linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
          {/* 상단 배너 제거됨 */}

          {/* 결과 카드 */}
          <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl p-6 border-4 border-amber-300 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <div className="text-6xl mb-4 text-black placeholder-gray-500">🔮</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 text-black placeholder-gray-500">
                사주 × MBTI 종합 분석
              </h1>
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm flex-wrap text-black placeholder-gray-500">
                <span className="bg-amber-100 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-bold text-black text-black placeholder-gray-500">{birthYear}.{birthMonth}.{birthDay}</span>
                <span className="bg-blue-100 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-bold text-black text-black placeholder-gray-500">{gender}</span>
                <span className="bg-green-100 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-bold text-black text-black placeholder-gray-500">{birthType}</span>
                <span className="bg-indigo-100 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-bold text-black text-black placeholder-gray-500">{mbti}</span>
              </div>
            </header>

            {/* 사주 년주 - 디테일 강화 */}
            <div className="mb-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-5 border-2 border-red-300 text-black placeholder-gray-500">
              <h3 className="text-xl font-bold text-black mb-4 text-center text-black placeholder-gray-500">☯️ 사주팔자 년주 분석</h3>
              
              {/* 천간지지 */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-black placeholder-gray-500">
                <div className="bg-white rounded-xl p-4 text-center border-2 border-red-200 text-black placeholder-gray-500">
                  <div className="text-xs text-gray-600 mb-2 font-bold text-black placeholder-gray-500">천간 (天干)</div>
                  <div className="text-3xl font-bold text-red-600 mb-2 text-black placeholder-gray-500">{result.yearPillar.stem.name}</div>
                  <div className="text-sm text-gray-700 mb-1 text-black placeholder-gray-500">{result.yearPillar.stem.nature}</div>
                  <div className="text-xs text-gray-500 text-black placeholder-gray-500">{result.yearPillar.stem.trait}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border-2 border-red-200 text-black placeholder-gray-500">
                  <div className="text-xs text-gray-600 mb-2 font-bold text-black placeholder-gray-500">지지 (地支)</div>
                  <div className="text-3xl font-bold text-orange-600 mb-2 text-black placeholder-gray-500">{result.yearPillar.branch.name}</div>
                  <div className="text-sm text-gray-700 mb-1 text-black placeholder-gray-500">{result.yearPillar.branch.animal}</div>
                  <div className="text-xs text-gray-500 text-black placeholder-gray-500">{result.yearPillar.branch.nature}</div>
                </div>
              </div>

              {/* 오행 분석 */}
              <div className="bg-white rounded-xl p-4 border-2 border-red-200 text-black placeholder-gray-500">
                <div className="text-center mb-3">
                  <span className="text-2xl font-bold text-red-700 text-black placeholder-gray-500">
                    {result.element} ({result.element === '목' ? '木' : result.element === '화' ? '火' : result.element === '토' ? '土' : result.element === '금' ? '金' : '水'})
                  </span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed text-black placeholder-gray-500">
                  <p className="mb-2"><span className="font-bold">✨ 기본 성향:</span> {result.elementTrait}</p>
                  <p className="mb-2"><span className="font-bold">🎯 타고난 강점:</span> {result.yearPillar.stem.nature}의 기운으로 {result.element === '목' ? '성장과 발전에 강함' : result.element === '화' ? '열정과 창의성이 뛰어남' : result.element === '토' ? '안정과 신뢰를 중시함' : result.element === '금' ? '원칙과 정의감이 강함' : '지혜와 유연성이 뛰어남'}</p>
                  <p><span className="font-bold">💼 직업적 특성:</span> {result.yearPillar.branch.animal} 띠의 특성으로 {result.yearPillar.branch.animal === '쥐' ? '빠른 판단력과 적응력' : result.yearPillar.branch.animal === '소' ? '성실함과 끈기' : result.yearPillar.branch.animal === '호랑이' ? '리더십과 추진력' : result.yearPillar.branch.animal === '토끼' ? '세심함과 친화력' : result.yearPillar.branch.animal === '용' ? '창의력과 카리스마' : result.yearPillar.branch.animal === '뱀' ? '지혜와 전략적 사고' : result.yearPillar.branch.animal === '말' ? '활동성과 사교성' : result.yearPillar.branch.animal === '양' ? '온화함과 예술성' : result.yearPillar.branch.animal === '원숭이' ? '영리함과 재치' : result.yearPillar.branch.animal === '닭' ? '꼼꼼함과 계획성' : result.yearPillar.branch.animal === '개' ? '충성심과 책임감' : '포용력과 관대함'}을 지님</p>
                </div>
              </div>
            </div>

            {/* MBTI 특성 - 디테일 강화 */}
            <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border-2 border-indigo-300 text-black placeholder-gray-500">
              <h3 className="text-xl font-bold text-black mb-4 text-center text-black placeholder-gray-500">🧠 MBTI 심층 성격 분석</h3>
              
              <div className="bg-white rounded-xl p-4 border-2 border-indigo-200 mb-4 text-black placeholder-gray-500">
                <div className="text-center mb-3 text-black placeholder-gray-500">
                  <span className="text-3xl font-bold text-indigo-600 text-black placeholder-gray-500">{mbti}</span>
                  <span className="text-lg text-gray-700 ml-3 text-black placeholder-gray-500">"{result.mbtiDetail.nickname}"</span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-700 text-black placeholder-gray-500">
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <p className="font-bold text-indigo-700 mb-1">💼 업무 스타일</p>
                    <p>{result.mbtiDetail.workStyle}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="font-bold text-purple-700 mb-2">✨ 핵심 강점</p>
                    <div className="flex flex-wrap gap-2">
                      {result.mbtiDetail.traits.map((trait, i) => (
                        <span key={i} className="bg-white text-purple-700 px-3 py-1 rounded-full text-xs font-semibold border border-purple-300 text-black placeholder-gray-500">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="font-bold text-blue-700 mb-1">🎯 성격 유형별 특징</p>
                    <p>
                      {mbti[0] === 'E' ? '외향적으로 에너지를 외부에서 얻으며, ' : '내향적으로 혼자만의 시간에서 에너지를 충전하며, '}
                      {mbti[1] === 'N' ? '직관적으로 미래 가능성을 중시하고, ' : '감각적으로 현실과 구체적 사실을 중시하고, '}
                      {mbti[2] === 'T' ? '사고형으로 논리와 객관성을 우선하며, ' : '감정형으로 가치와 조화를 우선하며, '}
                      {mbti[3] === 'J' ? '판단형으로 계획적이고 체계적인 생활을 선호합니다.' : '인식형으로 유연하고 즉흥적인 생활을 선호합니다.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 일주 특성 (있는 경우만) */}
            {result.dayPillarInfo && (
              <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-5 border-2 border-yellow-300 text-black placeholder-gray-500">
                <h3 className="text-lg font-bold text-black mb-3 text-black placeholder-gray-500">📅 일주 특성</h3>
                <div className="bg-white rounded-xl p-4 border border-yellow-200 text-black placeholder-gray-500">
                  <div className="text-sm text-gray-700 mb-2 text-black placeholder-gray-500">
                    <span className="font-bold text-black text-black placeholder-gray-500">특성:</span> {result.dayPillarInfo.trait}
                  </div>
                  <div className="text-sm text-gray-700 text-black placeholder-gray-500">
                    <span className="font-bold text-black text-black placeholder-gray-500">강점:</span> {result.dayPillarInfo.strength}
                  </div>
                </div>
              </div>
            )}

            {/* 사주 + MBTI 종합 해석 */}
            <div className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 border-2 border-yellow-300 text-black placeholder-gray-500">
              <h3 className="text-xl font-bold text-black mb-4 text-center text-black placeholder-gray-500">🔮 사주 × MBTI 종합 해석</h3>
              
              <div className="bg-white rounded-xl p-4 border-2 border-yellow-200 text-black placeholder-gray-500">
                <div className="text-sm text-gray-700 leading-relaxed space-y-3 text-black placeholder-gray-500">
                  <p className="bg-yellow-50 p-3 rounded-lg">
                    <span className="font-bold text-yellow-700">📌 당신의 운명적 특성:</span><br/>
                    {result.element} 오행의 에너지와 {mbti} 성격이 결합되어, {result.elementTrait.split('.')[0]}와(과) {result.mbtiDetail.traits[0]}이/가 조화를 이룹니다. 이는 {birthType}으로 태어나 {gender === '남' ? '남성' : '여성'}으로서의 사회적 역할과도 잘 맞아떨어집니다.
                  </p>
                  
                  <p className="bg-orange-50 p-3 rounded-lg">
                    <span className="font-bold text-orange-700">💡 타고난 재능:</span><br/>
                    {result.yearPillar.stem.name}({result.yearPillar.stem.nature})의 기운은 당신에게 {result.element === '목' ? '성장과 창조의 에너지' : result.element === '화' ? '열정과 리더십' : result.element === '토' ? '안정과 포용력' : result.element === '금' ? '정의감과 결단력' : '지혜와 통찰력'}을 부여했습니다. {result.yearPillar.branch.animal} 띠의 특성으로 {result.yearPillar.branch.animal === '쥐' ? '기회 포착 능력' : result.yearPillar.branch.animal === '소' ? '끈기와 성실함' : result.yearPillar.branch.animal === '호랑이' ? '용기와 추진력' : result.yearPillar.branch.animal === '토끼' ? '섬세함과 친화력' : result.yearPillar.branch.animal === '용' ? '카리스마와 창의성' : result.yearPillar.branch.animal === '뱀' ? '전략적 사고력' : result.yearPillar.branch.animal === '말' ? '활동력과 사교성' : result.yearPillar.branch.animal === '양' ? '예술성과 평화로움' : result.yearPillar.branch.animal === '원숭이' ? '재치와 영리함' : result.yearPillar.branch.animal === '닭' ? '계획성과 완벽주의' : result.yearPillar.branch.animal === '개' ? '충성심과 신뢰성' : '포용력과 온화함'}까지 갖추었습니다.
                  </p>
                  
                  <p className="bg-red-50 p-3 rounded-lg">
                    <span className="font-bold text-red-700">⚠️ 주의할 점:</span><br/>
                    {mbti[2] === 'T' ? '논리적 사고가 강한 만큼 타인의 감정을 고려하는 연습이 필요합니다.' : '감정적 판단이 우선되는 만큼 객관적 시각을 유지하는 것이 중요합니다.'} 또한 {result.element === '목' ? '과도한 확장보다는 내실을 다지는 것' : result.element === '화' ? '열정이 지나치면 소진되지 않도록 휴식' : result.element === '토' ? '안정만 추구하다 기회를 놓치지 않도록' : result.element === '금' ? '너무 원칙에만 매이지 않는 유연함' : '우유부단함을 극복하고 결단력을 키우는 것'}이 성공의 열쇠입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 추천 직업 TOP 3 */}
            <div className="mb-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-5 border-2 border-green-300 text-black placeholder-gray-500">
              <h3 className="text-xl font-bold text-black mb-4 text-center text-black placeholder-gray-500">💼 운명에 맞는 추천 직업 TOP 3</h3>
              <div className="text-xs text-center text-gray-600 mb-4 text-black placeholder-gray-500">
                (사주 오행 + MBTI 성향 + 십성 특성 종합 분석)
              </div>
              <div className="space-y-3 text-black placeholder-gray-500">
                {result.recommendedJobs.map((job, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border-2 border-green-200 hover:shadow-lg transition-all text-black placeholder-gray-500">
                    <div className="flex items-start gap-3">
                      <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 text-black placeholder-gray-500">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-gray-800 font-bold text-lg mb-2">{job}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {i === 0 ? `${result.element} 오행의 특성과 ${mbti}의 ${result.mbtiDetail.workStyle} 성향이 완벽하게 조화를 이루는 직업입니다. 당신의 ${result.mbtiDetail.traits[0]} 성격이 이 분야에서 큰 강점으로 작용할 것입니다.` : 
                           i === 1 ? `${result.yearPillar.branch.animal} 띠의 특성인 ${result.yearPillar.branch.animal === '쥐' ? '빠른 적응력' : result.yearPillar.branch.animal === '소' ? '성실함' : result.yearPillar.branch.animal === '호랑이' ? '리더십' : result.yearPillar.branch.animal === '토끼' ? '친화력' : result.yearPillar.branch.animal === '용' ? '창의성' : result.yearPillar.branch.animal === '뱀' ? '전략적 사고' : result.yearPillar.branch.animal === '말' ? '사교성' : result.yearPillar.branch.animal === '양' ? '예술성' : result.yearPillar.branch.animal === '원숭이' ? '재치' : result.yearPillar.branch.animal === '닭' ? '계획성' : result.yearPillar.branch.animal === '개' ? '신뢰성' : '포용력'}과 ${mbti}의 ${result.mbtiDetail.traits[1]} 면이 시너지를 발휘하는 분야입니다.` :
                           `${gender === '남' ? '남성' : '여성'}으로서의 장점과 ${birthType}으로 태어난 특성이 잘 발휘되는 직업입니다. 장기적으로 안정적인 성공을 기대할 수 있습니다.`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 십성 직업 경향 */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-5 border-2 border-blue-300 text-black placeholder-gray-500">
              <h3 className="text-lg font-bold text-black mb-3 text-black placeholder-gray-500">⭐ 십성(十星) 직업 경향</h3>
              <div className="bg-white rounded-xl p-4 border border-blue-200 text-black placeholder-gray-500">
                <div className="text-sm text-gray-700 mb-2 text-black placeholder-gray-500">
                  <span className="font-bold text-black text-black placeholder-gray-500">특성:</span> {result.tenGodsCareer.trait}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-black placeholder-gray-500">
                  {result.tenGodsCareer.careers.map((career, i) => (
                    <span key={i} className="bg-blue-100 text-black px-2 py-1 rounded-full text-xs font-semibold text-black placeholder-gray-500">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 특수 신살 */}
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 border-2 border-purple-300 text-black placeholder-gray-500">
              <h3 className="text-lg font-bold text-black mb-3 text-black placeholder-gray-500">✨ 특수 신살 (화개살)</h3>
              <div className="bg-white rounded-xl p-4 border border-purple-200 text-black placeholder-gray-500">
                <div className="text-sm text-gray-700 mb-2 text-black placeholder-gray-500">
                  <span className="font-bold text-black text-black placeholder-gray-500">의미:</span> {result.specialStar.meaning}
                </div>
                <div className="text-sm text-gray-700 mb-2 text-black placeholder-gray-500">
                  <span className="font-bold text-black text-black placeholder-gray-500">효과:</span> {result.specialStar.effect}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-black placeholder-gray-500">
                  {result.specialStar.careers.map((career: string, i: number) => (
                    <span key={i} className="bg-purple-100 text-black px-2 py-1 rounded-full text-xs font-semibold text-black placeholder-gray-500">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 운세 보완 아이템 추천 */}
            <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-300 text-black placeholder-gray-500">
              <h3 className="text-xl font-bold text-black mb-2 text-center text-black placeholder-gray-500">🎁 당신을 위한 운세 보완 아이템</h3>
              <p className="text-xs text-center text-gray-600 mb-4">{result.element} 오행의 기운을 보완하고 {mbti} 성격을 강화하는 맞춤 추천</p>
              
              <div className="space-y-3 text-black placeholder-gray-500">
                {/* 아이템 1: 오행 보완 */}
                <div className="bg-white rounded-xl p-4 border-2 border-purple-200 text-black placeholder-gray-500">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">
                      {result.element === '목' ? '🌱' : result.element === '화' ? '🔥' : result.element === '토' ? '🏔️' : result.element === '금' ? '⚡' : '💧'}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">
                        {result.element === '목' ? '천연 식물 · 원목 제품' : 
                         result.element === '화' ? '붉은색 액세서리 · 캔들' : 
                         result.element === '토' ? '천연 도자기 · 황토 제품' : 
                         result.element === '금' ? '금속 장신구 · 크리스털' : 
                         '수정 · 블루 계열 소품'}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {result.element} 오행의 기운을 강화하여 운세를 높이는 필수 아이템
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    🛒 구매하러 가기
                  </a>
                </div>

                {/* 아이템 2: MBTI 맞춤 */}
                <div className="bg-white rounded-xl p-4 border-2 border-purple-200 text-black placeholder-gray-500">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">
                      {mbti[0] === 'E' ? '🎉' : '📚'}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">
                        {mbti[0] === 'E' ? '에너지 충전 소품 · 향수' : '힐링 · 명상 용품'}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {mbti} 유형의 스트레스를 해소하고 에너지를 채우는 아이템
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    🛒 구매하러 가기
                  </a>
                </div>

                {/* 아이템 3: 직업 준비 */}
                <div className="bg-white rounded-xl p-4 border-2 border-purple-200 text-black placeholder-gray-500">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">📖</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">자기계발 도서 · 온라인 강의</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        추천 직업 준비를 위한 전문 서적과 강의
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    🛒 구매하러 가기
                  </a>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 mt-3">
                * 이 포스팅은 쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 제공받습니다
              </p>
            </div>

            <button
              onClick={restart}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              🔮 다시 분석하기
            </button>
          </section>

          {/* 하단 배너 */}
          <footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">
            
            <p className="text-xs text-black text-center px-4 text-black placeholder-gray-500">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-yellow-50 dark:from-red-950 dark:via-amber-950 dark:to-yellow-950 transition-colors" style={{
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(180, 83, 9, 0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(161, 98, 7, 0.3) 0%, transparent 40%), linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
        {/* 상단 배너 제거됨 */}

        {/* 메인 카드 */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl p-8 border-4 border-amber-300 text-black placeholder-gray-500">
          <header className="text-center mb-8 text-black placeholder-gray-500">
            <div className="text-6xl mb-4 text-black placeholder-gray-500">☯️</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 text-black placeholder-gray-500">
              사주팔자 × MBTI
            </h1>
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-black placeholder-gray-500">맞춤 직업 찾기</h2>
            <p className="text-gray-600 text-black placeholder-gray-500">정통 사주명리학 + MBTI 심리학 융합 분석</p>
          </header>

          <div className="space-y-4 text-black placeholder-gray-500">
            {/* 생년월일시 입력 */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-amber-200 text-black placeholder-gray-500">
              <label className="block text-lg md:text-xl font-bold text-black mb-4 text-center">
                🎂 생년월일시
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3 text-black placeholder-gray-500">
                <div>
                  <div className="text-sm text-gray-600 mb-2 text-center font-medium">년도</div>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="w-full px-3 py-3.5 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center font-bold text-black text-base md:text-lg appearance-none"
                    style={{ fontSize: '16px' }}
                    min="1920"
                    max="2010"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2 text-center font-medium">월</div>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    className="w-full px-3 py-3.5 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center font-bold text-black text-base md:text-lg appearance-none"
                    style={{ fontSize: '16px', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}월</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-black placeholder-gray-500">
                <div>
                  <div className="text-sm text-gray-600 mb-2 text-center font-medium">일</div>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(Number(e.target.value))}
                    className="w-full px-3 py-3.5 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center font-bold text-black text-base md:text-lg appearance-none"
                    style={{ fontSize: '16px', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}일</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2 text-center font-medium">시</div>
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(Number(e.target.value))}
                    className="w-full px-3 py-3.5 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center font-bold text-black text-base md:text-lg appearance-none"
                    style={{ fontSize: '16px', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map(h => (
                      <option key={h} value={h}>{h}시</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 성별 선택 */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-amber-200 text-black placeholder-gray-500">
              <label className="block text-lg md:text-xl font-bold text-black mb-4 text-center">
                👤 성별
              </label>
              <div className="grid grid-cols-2 gap-3 text-black placeholder-gray-500">
                <button
                  onClick={() => setGender("남")}
                  className={`min-h-[48px] py-4 rounded-xl font-bold text-base md:text-lg transition-all active:scale-95 ${
                    gender === "남"
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  👨 남자
                </button>
                <button
                  onClick={() => setGender("여")}
                  className={`min-h-[48px] py-4 rounded-xl font-bold text-base md:text-lg transition-all active:scale-95 ${
                    gender === "여"
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  👩 여자
                </button>
              </div>
            </div>

            {/* 출산 방법 선택 */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-amber-200 text-black placeholder-gray-500">
              <label className="block text-lg md:text-xl font-bold text-black mb-4 text-center">
                🏥 출산 방법
              </label>
              <div className="grid grid-cols-2 gap-3 text-black placeholder-gray-500">
                <button
                  onClick={() => setBirthType("자연분만")}
                  className={`min-h-[48px] py-4 rounded-xl font-bold text-base md:text-lg transition-all active:scale-95 ${
                    birthType === "자연분만"
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  🌿 자연분만
                </button>
                <button
                  onClick={() => setBirthType("제왕절개")}
                  className={`min-h-[48px] py-4 rounded-xl font-bold text-base md:text-lg transition-all active:scale-95 ${
                    birthType === "제왕절개"
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  ⚕️ 제왕절개
                </button>
              </div>
            </div>

            {/* MBTI 선택 */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-amber-200 text-black placeholder-gray-500">
              <label className="block text-lg md:text-xl font-bold text-black mb-4 text-center">
                🧠 MBTI 유형
              </label>
              <div className="grid grid-cols-4 gap-2 md:gap-2.5 text-black placeholder-gray-500">
                {MBTI_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setMbti(type)}
                    className={`min-h-[44px] py-3 px-1 rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all active:scale-95 ${
                      mbti === type
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {mbti && (
                <div className="mt-4 text-center text-black placeholder-gray-500">
                  <span className="text-sm md:text-base text-black font-bold">
                    ✓ {mbti} "{MBTI_DETAILS[mbti].nickname}" 선택됨
                  </span>
                </div>
              )}
            </div>

            {/* 분석 버튼 */}
            <button
              onClick={handleAnalyze}
              disabled={!mbti || !gender || !birthType}
              className={`w-full min-h-[56px] py-4 md:py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg md:text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 ${
                (!mbti || !gender || !birthType) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              🔮 사주 × MBTI 종합 분석
            </button>

            {/* 안내 */}
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4 md:p-5 border border-amber-300 text-black placeholder-gray-500">
              <p className="text-sm md:text-base text-gray-700 text-center leading-relaxed font-medium">
                💡 <span className="font-bold">정통 사주명리학</span>의 천간지지, 오행, 십성과<br />
                <span className="font-bold">MBTI 심리학</span>을 융합하여<br className="hidden md:block" />
                가장 적합한 직업을 추천해드립니다
              </p>
            </div>
          </div>
        </section>

        {/* 하단 배너 */}
        <footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">
          
          <p className="text-xs text-black text-center px-4 text-black placeholder-gray-500">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </footer>
      </div>
    </main>
  );
}

