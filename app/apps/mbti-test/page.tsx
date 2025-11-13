'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import Link from 'next/link';

interface Question {
  id: number;
  question: string;
  type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  options: {
    text: string;
    value: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "새로운 사람들과 만나는 파티에서 당신은?",
    type: 'E',
    options: [
      { text: "많은 사람들과 대화하며 에너지를 얻는다", value: 2 },
      { text: "소수의 친한 사람들과 깊은 대화를 나눈다", value: -2 }
    ]
  },
  {
    id: 2,
    question: "새로운 것을 배울 때 당신은?",
    type: 'S',
    options: [
      { text: "구체적인 예시와 단계가 필요하다", value: 2 },
      { text: "큰 그림과 개념부터 이해하고 싶다", value: -2 }
    ]
  },
  {
    id: 3,
    question: "친구가 고민을 털어놓으면?",
    type: 'F',
    options: [
      { text: "공감하며 위로해준다", value: 2 },
      { text: "해결책을 제시한다", value: -2 }
    ]
  },
  {
    id: 4,
    question: "여행을 준비할 때",
    type: 'J',
    options: [
      { text: "일정표를 만들고 예약을 미리 한다", value: 2 },
      { text: "대충 정하고 현지에서 즉흥적으로", value: -2 }
    ]
  },
  {
    id: 5,
    question: "힘든 일이 있을 때 당신은?",
    type: 'I',
    options: [
      { text: "혼자 생각하며 정리한다", value: 2 },
      { text: "친구들과 이야기하며 풀어낸다", value: -2 }
    ]
  },
  {
    id: 6,
    question: "대화를 할 때 당신은?",
    type: 'N',
    options: [
      { text: "비유와 상징을 자주 사용한다", value: 2 },
      { text: "사실과 구체적인 내용을 말한다", value: -2 }
    ]
  },
  {
    id: 7,
    question: "중요한 결정을 내릴 때",
    type: 'T',
    options: [
      { text: "논리와 효율성을 우선한다", value: 2 },
      { text: "사람들의 감정을 고려한다", value: -2 }
    ]
  },
  {
    id: 8,
    question: "과제나 업무 마감이 있을 때",
    type: 'J',
    options: [
      { text: "미리미리 완료한다", value: 2 },
      { text: "마감 직전에 몰아서 한다", value: -2 }
    ]
  },
  {
    id: 9,
    question: "주말에 친구들이 갑자기 약속을 제안하면?",
    type: 'E',
    options: [
      { text: "좋아! 바로 나간다", value: 2 },
      { text: "집에서 쉬고 싶은데... 고민된다", value: -2 }
    ]
  },
  {
    id: 10,
    question: "일을 할 때 당신은?",
    type: 'S',
    options: [
      { text: "검증된 방법을 따라 정확하게 한다", value: 2 },
      { text: "새로운 방법을 시도해보고 싶다", value: -2 }
    ]
  },
  {
    id: 11,
    question: "영화를 볼 때",
    type: 'F',
    options: [
      { text: "등장인물의 감정에 몰입한다", value: 2 },
      { text: "스토리 전개와 논리를 분석한다", value: -2 }
    ]
  },
  {
    id: 12,
    question: "계획이 갑자기 변경되면?",
    type: 'P',
    options: [
      { text: "괜찮아, 그럼 다른 걸 하지", value: 2 },
      { text: "스트레스 받는다, 계획대로 하고 싶다", value: -2 }
    ]
  },
  {
    id: 13,
    question: "전화 통화와 문자 중에서는?",
    type: 'I',
    options: [
      { text: "문자나 메시지가 편하다", value: 2 },
      { text: "전화로 직접 말하는 게 편하다", value: -2 }
    ]
  },
  {
    id: 14,
    question: "책을 읽을 때",
    type: 'N',
    options: [
      { text: "행간의 의미를 찾으며 읽는다", value: 2 },
      { text: "쓰여진 내용 그대로를 이해한다", value: -2 }
    ]
  },
  {
    id: 15,
    question: "비판을 받으면",
    type: 'T',
    options: [
      { text: "객관적으로 분석하고 개선한다", value: 2 },
      { text: "상처받고 감정적으로 받아들인다", value: -2 }
    ]
  },
  {
    id: 16,
    question: "방 청소는?",
    type: 'J',
    options: [
      { text: "규칙적으로 정리정돈한다", value: 2 },
      { text: "필요할 때만 한다", value: -2 }
    ]
  },
  {
    id: 17,
    question: "처음 만난 사람들과 대화할 때",
    type: 'E',
    options: [
      { text: "먼저 말을 걸고 대화를 이어간다", value: 2 },
      { text: "상대방이 먼저 말을 걸어주길 기다린다", value: -2 }
    ]
  },
  {
    id: 18,
    question: "미래를 생각할 때",
    type: 'N',
    options: [
      { text: "다양한 가능성을 상상한다", value: 2 },
      { text: "현실적인 계획을 세운다", value: -2 }
    ]
  },
  {
    id: 19,
    question: "논쟁 상황에서",
    type: 'T',
    options: [
      { text: "사실과 논리로 설득한다", value: 2 },
      { text: "상대방의 감정을 먼저 배려한다", value: -2 }
    ]
  },
  {
    id: 20,
    question: "하루 일과는?",
    type: 'J',
    options: [
      { text: "To-do 리스트대로 진행한다", value: 2 },
      { text: "그때그때 하고 싶은 대로", value: -2 }
    ]
  },
  {
    id: 21,
    question: "사람들과 오래 어울린 후에는?",
    type: 'I',
    options: [
      { text: "혼자만의 시간이 필요하다", value: 2 },
      { text: "더 많은 사람들과 어울리고 싶다", value: -2 }
    ]
  },
  {
    id: 22,
    question: "문제 해결 시",
    type: 'S',
    options: [
      { text: "경험과 데이터를 바탕으로 접근한다", value: 2 },
      { text: "직관과 영감을 따라간다", value: -2 }
    ]
  },
  {
    id: 23,
    question: "칭찬을 할 때",
    type: 'F',
    options: [
      { text: "따뜻한 말과 감정을 표현한다", value: 2 },
      { text: "구체적인 성과를 언급한다", value: -2 }
    ]
  },
  {
    id: 24,
    question: "쇼핑을 할 때",
    type: 'J',
    options: [
      { text: "필요한 것 리스트를 만들고 간다", value: 2 },
      { text: "돌아다니며 마음에 드는 걸 산다", value: -2 }
    ]
  },
  {
    id: 25,
    question: "친구들 사이에서 당신은?",
    type: 'E',
    options: [
      { text: "분위기를 주도하고 리드하는 편", value: 2 },
      { text: "조용히 듣고 필요할 때만 말하는 편", value: -2 }
    ]
  },
  {
    id: 26,
    question: "일상에서 당신은?",
    type: 'S',
    options: [
      { text: "현재에 집중하며 산다", value: 2 },
      { text: "미래를 상상하며 산다", value: -2 }
    ]
  },
  {
    id: 27,
    question: "갈등 상황에서",
    type: 'T',
    options: [
      { text: "공정한 해결책을 찾는다", value: 2 },
      { text: "모두가 상처받지 않도록 조율한다", value: -2 }
    ]
  },
  {
    id: 28,
    question: "새로운 취미를 시작하면?",
    type: 'P',
    options: [
      { text: "이것저것 시도해보며 즐긴다", value: 2 },
      { text: "체계적으로 배우고 마스터한다", value: -2 }
    ]
  },
  {
    id: 29,
    question: "에너지 충전 방법은?",
    type: 'I',
    options: [
      { text: "혼자 책 읽기, 영화 보기", value: 2 },
      { text: "친구들 만나서 수다 떨기", value: -2 }
    ]
  },
  {
    id: 30,
    question: "새로운 아이디어를 접하면?",
    type: 'N',
    options: [
      { text: "흥미롭다! 어떻게 응용할 수 있을까?", value: 2 },
      { text: "실용적인가? 검증이 필요하다", value: -2 }
    ]
  },
  {
    id: 31,
    question: "일을 평가할 때",
    type: 'F',
    options: [
      { text: "노력한 과정을 중요하게 본다", value: 2 },
      { text: "결과와 성과를 중요하게 본다", value: -2 }
    ]
  },
  {
    id: 32,
    question: "결정을 내릴 때",
    type: 'P',
    options: [
      { text: "최대한 열어두고 나중에 결정한다", value: 2 },
      { text: "빨리 결정하고 진행한다", value: -2 }
    ]
  }
];

interface MBTIResult {
  type: string;
  description: string;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

const mbtiResults: Record<string, MBTIResult> = {
  'INTJ': {
    type: 'INTJ',
    description: '상상력이 풍부하고 전략적인 사고를 하는 건축가형',
    characteristics: ['독립적', '체계적', '논리적', '결단력 있음'],
    strengths: ['장기적 계획', '독립적 사고', '체계적 접근', '결단력'],
    weaknesses: ['완벽주의', '비판적', '고집', '사회적 상호작용 부족'],
    careers: ['건축가', '과학자', '프로그래머', '경영 컨설턴트']
  },
  'INTP': {
    type: 'INTP',
    description: '논리적이고 분석적인 사고를 하는 논리학자형',
    characteristics: ['논리적', '분석적', '독립적', '호기심 많음'],
    strengths: ['논리적 사고', '분석력', '독창성', '객관성'],
    weaknesses: ['실용성 부족', '감정 표현 어려움', '결정 지연', '사회적 기술 부족'],
    careers: ['연구원', '프로그래머', '수학자', '철학자']
  },
  'ENTJ': {
    type: 'ENTJ',
    description: '대담하고 상상력이 풍부한 통솔자형',
    characteristics: ['리더십', '결단력', '체계적', '목표 지향적'],
    strengths: ['리더십', '결단력', '체계적 사고', '목표 달성'],
    weaknesses: ['성급함', '비판적', '감정 무시', '완고함'],
    careers: ['CEO', '정치가', '군인', '경영 컨설턴트']
  },
  'ENTP': {
    type: 'ENTP',
    description: '똑똑하고 호기심이 많은 변론가형',
    characteristics: ['창의적', '적응력', '논리적', '호기심 많음'],
    strengths: ['창의성', '적응력', '논리적 사고', '에너지'],
    weaknesses: ['일관성 부족', '세부사항 무시', '감정 무시', '규칙 회피'],
    careers: ['기업가', '발명가', '변호사', '저널리스트']
  },
  'INFJ': {
    type: 'INFJ',
    description: '선의의 옹호자로 알려진 옹호자형',
    characteristics: ['이상주의적', '창의적', '결단력 있음', '통찰력'],
    strengths: ['통찰력', '창의성', '결단력', '이상주의'],
    weaknesses: ['완벽주의', '민감함', '비현실적', '비밀주의'],
    careers: ['상담사', '작가', '심리학자', '교사']
  },
  'INFP': {
    type: 'INFP',
    description: '시적이고 친절한 중재자형',
    characteristics: ['이상주의적', '창의적', '유연한', '충성심'],
    strengths: ['창의성', '열정', '유연성', '충성심'],
    weaknesses: ['비현실적', '민감함', '비판에 약함', '결정 어려움'],
    careers: ['작가', '예술가', '심리학자', '상담사']
  },
  'ENFJ': {
    type: 'ENFJ',
    description: '카리스마 있고 영감을 주는 주인공형',
    characteristics: ['카리스마', '영감적', '결단력 있음', '사교적'],
    strengths: ['리더십', '영감', '결단력', '사교성'],
    weaknesses: ['비판에 민감', '완벽주의', '압박감', '자기 희생'],
    careers: ['정치가', '교사', '코치', '상담사']
  },
  'ENFP': {
    type: 'ENFP',
    description: '열정적이고 창의적인 활동가형',
    characteristics: ['열정적', '창의적', '사교적', '유연한'],
    strengths: ['열정', '창의성', '사교성', '유연성'],
    weaknesses: ['일관성 부족', '스트레스 민감', '세부사항 무시', '비판에 민감'],
    careers: ['예술가', '저널리스트', '심리학자', '상담사']
  },
  'ISTJ': {
    type: 'ISTJ',
    description: '실용적이고 사실에 기반한 논리주의자형',
    characteristics: ['실용적', '체계적', '신뢰할 수 있음', '책임감'],
    strengths: ['신뢰성', '체계성', '책임감', '실용성'],
    weaknesses: ['유연성 부족', '변화 저항', '감정 표현 어려움', '완벽주의'],
    careers: ['회계사', '법관', '관리자', '엔지니어']
  },
  'ISFJ': {
    type: 'ISFJ',
    description: '따뜻하고 헌신적인 수호자형',
    characteristics: ['따뜻함', '헌신적', '책임감', '협조적'],
    strengths: ['헌신', '책임감', '협조성', '실용성'],
    weaknesses: ['자기 희생', '변화 저항', '비판에 민감', '과도한 책임감'],
    careers: ['간호사', '교사', '사회복지사', '상담사']
  },
  'ESTJ': {
    type: 'ESTJ',
    description: '실용적이고 관리 능력이 뛰어난 경영자형',
    characteristics: ['실용적', '체계적', '결단력 있음', '책임감'],
    strengths: ['관리 능력', '결단력', '책임감', '실용성'],
    weaknesses: ['유연성 부족', '감정 무시', '변화 저항', '완고함'],
    careers: ['관리자', '법관', '군인', '정치가']
  },
  'ESFJ': {
    type: 'ESFJ',
    description: '따뜻하고 협조적인 집정관형',
    characteristics: ['따뜻함', '협조적', '책임감', '사교적'],
    strengths: ['협조성', '책임감', '사교성', '실용성'],
    weaknesses: ['비판에 민감', '변화 저항', '자기 희생', '완벽주의'],
    careers: ['교사', '간호사', '사회복지사', '상담사']
  },
  'ISTP': {
    type: 'ISTP',
    description: '대담하고 실용적인 만능재주꾼형',
    characteristics: ['실용적', '유연한', '독립적', '차분한'],
    strengths: ['실용성', '유연성', '독립성', '문제 해결'],
    weaknesses: ['계획성 부족', '감정 표현 어려움', '규칙 회피', '사회적 기술 부족'],
    careers: ['기술자', '파일럿', '의사', '엔지니어']
  },
  'ISFP': {
    type: 'ISFP',
    description: '유연하고 매력적인 모험가형',
    characteristics: ['유연한', '창의적', '협조적', '차분한'],
    strengths: ['창의성', '유연성', '협조성', '민감성'],
    weaknesses: ['비판에 민감', '계획성 부족', '스트레스 민감', '결정 어려움'],
    careers: ['예술가', '디자이너', '상담사', '의료진']
  },
  'ESTP': {
    type: 'ESTP',
    description: '스마트하고 에너지 넘치는 사업가형',
    characteristics: ['에너지틱', '실용적', '유연한', '사교적'],
    strengths: ['에너지', '실용성', '유연성', '사교성'],
    weaknesses: ['계획성 부족', '장기적 사고 부족', '규칙 회피', '감정 무시'],
    careers: ['기업가', '영업사원', '연예인', '스포츠 선수']
  },
  'ESFP': {
    type: 'ESFP',
    description: '자유롭고 열정적인 연예인형',
    characteristics: ['열정적', '사교적', '유연한', '창의적'],
    strengths: ['열정', '사교성', '유연성', '창의성'],
    weaknesses: ['계획성 부족', '비판에 민감', '스트레스 민감', '장기적 사고 부족'],
    careers: ['연예인', '예술가', '상담사', '이벤트 기획자']
  }
};

export default function MBTI32() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<MBTIResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (type: string, value: number) => {
    const newAnswers = { ...answers, [type]: (answers[type] || 0) + value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, number>) => {
    let mbti = '';
    
    mbti += (finalAnswers['E'] || 0) > 0 ? 'E' : 'I';
    mbti += (finalAnswers['S'] || 0) > 0 ? 'S' : 'N';
    mbti += (finalAnswers['T'] || 0) > 0 ? 'T' : 'F';
    mbti += (finalAnswers['J'] || 0) > 0 ? 'J' : 'P';

    setResult(mbtiResults[mbti]);
    setShowResult(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  if (showResult && result) {
    return (
      <PremiumLayout theme="purple">
        
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
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
          <div className="text-center mb-8 md:mb-12 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent px-4">
              🎭 MBTI 결과
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 px-4">당신의 성격 유형을 분석했습니다!</p>
          </div>

          {/* Result Card */}
          <PremiumCard hover gradient className="mb-8 animate-slideUp">
            <div className="text-center mb-8 md:mb-10">
              <div className="text-6xl sm:text-7xl md:text-9xl font-bold mb-4 md:mb-6 animate-bounce-slow" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 60px rgba(102, 126, 234, 0.4)'
              }}>
                {result.type}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 px-4">
                {result.description}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              {/* 주요 특성 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105" style={{ transform: 'translateZ(10px)' }}>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-xl md:text-2xl">🎯</span> 주요 특성
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.characteristics.map((char, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white rounded-full text-xs md:text-sm border border-white/20 hover:scale-110 transition-transform duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* 강점 */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105" style={{ transform: 'translateZ(10px)' }}>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-xl md:text-2xl">💪</span> 강점
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="text-sm md:text-base text-white/90 flex items-center group">
                      <span className="text-green-400 mr-2 md:mr-3 group-hover:scale-125 transition-transform">✓</span>
                      <span className="group-hover:translate-x-1 transition-transform">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 주의점 */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 hover:scale-105" style={{ transform: 'translateZ(10px)' }}>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-xl md:text-2xl">⚠️</span> 주의점
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm md:text-base text-white/90 flex items-center group">
                      <span className="text-amber-400 mr-2 md:mr-3 group-hover:scale-125 transition-transform">!</span>
                      <span className="group-hover:translate-x-1 transition-transform">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 추천 직업 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105" style={{ transform: 'translateZ(10px)' }}>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-xl md:text-2xl">💼</span> 추천 직업
                </h3>
                <ul className="space-y-2">
                  {result.careers.map((career, index) => (
                    <li key={index} className="text-sm md:text-base text-white/90 flex items-center group">
                      <span className="text-blue-400 mr-2 md:mr-3 group-hover:scale-125 transition-transform">💼</span>
                      <span className="group-hover:translate-x-1 transition-transform">{career}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center pt-4 md:pt-0">
              <PremiumButton
                onClick={resetTest}
                variant="primary"
                size="lg"
                icon="🔄"
              >
                다시 테스트하기
              </PremiumButton>
            </div>
          </PremiumCard>

          {/* Related Apps */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <RelatedApps currentAppSlug="mbti-test" className="mt-8" />
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

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .animate-slideUp {
            animation: slideUp 0.8s ease-out forwards;
          }

          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </PremiumLayout>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <PremiumLayout theme="purple">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
        <div className="text-center mb-8 md:mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent px-4">
            🎭 MBTI 테스트
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 px-4">32문항으로 알아보는 정확한 성격 유형</p>
        </div>

        <PremiumCard hover gradient className="animate-slideUp">
          {/* Progress Bar */}
          <div className="mb-6 md:mb-10">
            <div className="flex justify-between text-white mb-2">
              <span className="text-xs sm:text-sm font-medium">문항 {currentQuestion + 1} / {questions.length}</span>
              <span className="text-xs sm:text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="relative w-full bg-white/10 rounded-full h-3 md:h-4 overflow-hidden backdrop-blur-sm border border-white/20">
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ 
                  width: `${progress}%`,
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-6 md:mb-10 px-2">
            <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 md:space-y-4">
            {question.options.map((option, index) => (
              <button
        type="button"
                key={index}
                onClick={() => handleAnswer(question.type, option.value)}
                className="w-full group relative"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideUp 0.5s ease-out forwards'
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg md:rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg md:rounded-2xl p-4 md:p-6 text-left hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ transform: 'translateZ(0)' }}>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-white text-sm sm:text-base md:text-lg flex-1 group-hover:translate-x-1 transition-transform duration-300 leading-snug">{option.text}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
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