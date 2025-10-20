'use client';

import { useState } from 'react';
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
      { text: "몇 명과 깊은 대화를 나눈다", value: -2 },
      { text: "가끔 대화에 참여하지만 주로 관찰한다", value: -1 },
      { text: "빨리 나가고 싶다", value: -2 }
    ]
  },
  {
    id: 2,
    question: "문제를 해결할 때 당신은?",
    type: 'S',
    options: [
      { text: "단계별로 차근차근 접근한다", value: 2 },
      { text: "새로운 방법을 찾아 시도한다", value: -2 },
      { text: "경험에서 배운 방법을 사용한다", value: 1 },
      { text: "직감을 믿고 진행한다", value: -1 }
    ]
  },
  {
    id: 3,
    question: "중요한 결정을 내릴 때 당신은?",
    type: 'T',
    options: [
      { text: "논리적 분석을 통해 결정한다", value: 2 },
      { text: "감정과 가치를 고려한다", value: -2 },
      { text: "다른 사람들의 의견을 듣는다", value: -1 },
      { text: "장단점을 모두 분석한다", value: 1 }
    ]
  },
  {
    id: 4,
    question: "일상 생활에서 당신은?",
    type: 'J',
    options: [
      { text: "계획을 세우고 그에 따라 행동한다", value: 2 },
      { text: "상황에 따라 유연하게 대응한다", value: -2 },
      { text: "중요한 일만 계획하고 나머지는 유연하게", value: 1 },
      { text: "즉흥적으로 행동한다", value: -1 }
    ]
  },
  {
    id: 5,
    question: "스트레스를 받을 때 당신은?",
    type: 'I',
    options: [
      { text: "혼자만의 시간을 가지며 회복한다", value: 2 },
      { text: "친한 사람들과 대화하며 해소한다", value: -2 },
      { text: "취미 활동을 하며 스트레스를 풀어낸다", value: 1 },
      { text: "새로운 활동을 시작한다", value: -1 }
    ]
  },
  {
    id: 6,
    question: "새로운 프로젝트를 시작할 때 당신은?",
    type: 'N',
    options: [
      { text: "큰 그림과 가능성을 생각한다", value: 2 },
      { text: "구체적인 계획과 단계를 세운다", value: -2 },
      { text: "다양한 아이디어를 모아본다", value: 1 },
      { text: "검증된 방법을 사용한다", value: -1 }
    ]
  },
  {
    id: 7,
    question: "갈등 상황에서 당신은?",
    type: 'F',
    options: [
      { text: "모든 사람의 감정을 고려한다", value: 2 },
      { text: "공정한 해결책을 찾는다", value: -2 },
      { text: "상대방의 입장을 이해하려 노력한다", value: 1 },
      { text: "객관적 사실에 집중한다", value: -1 }
    ]
  },
  {
    id: 8,
    question: "여행을 계획할 때 당신은?",
    type: 'P',
    options: [
      { text: "자유롭게 탐험하며 즐긴다", value: 2 },
      { text: "미리 모든 것을 계획해둔다", value: -2 },
      { text: "주요 장소만 정하고 나머지는 유연하게", value: 1 },
      { text: "현지에서 추천받은 곳을 간다", value: -1 }
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
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>돌아가기</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🎭 MBTI 결과
            </h1>
            <p className="text-xl text-gray-300">당신의 성격 유형을 분석했습니다!</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="text-center mb-8">
              <div className="text-6xl md:text-8xl font-bold text-yellow-300 mb-4">
                {result.type}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {result.description}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    🎯 주요 특성
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.characteristics.map((char, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/30 text-white rounded-full text-sm"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    💪 강점
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-300 flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    ⚠️ 주의점
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-300 flex items-center">
                        <span className="text-yellow-400 mr-2">!</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    💼 추천 직업
                  </h3>
                  <ul className="space-y-2">
                    {result.careers.map((career, index) => (
                      <li key={index} className="text-gray-300 flex items-center">
                        <span className="text-blue-400 mr-2">💼</span>
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={resetTest}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
              >
                다시 테스트하기
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>돌아가기</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎭 MBTI 테스트
          </h1>
          <p className="text-xl text-gray-300">8문항으로 알아보는 나의 성격 유형</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
          {/* 진행률 표시 */}
          <div className="mb-8">
            <div className="flex justify-between text-white mb-2">
              <span className="text-sm">문항 {currentQuestion + 1} / {questions.length}</span>
              <span className="text-sm">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 질문 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {question.question}
            </h2>
          </div>

          {/* 선택지 */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.type, option.value)}
                className="w-full p-4 md:p-6 bg-white/10 hover:bg-white/20 text-white text-left rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

