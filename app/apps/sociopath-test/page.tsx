'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import RelatedApps from '@/app/components/RelatedApps';
import RadarChart3D from '@/app/components/RadarChart3D';
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';

// ASPD (반사회성 성격장애) 및 소시오패스 연구 기반 질문들
const questions = [
  {
    id: 1,
    category: '규칙 및 법률 준수',
    question: '법이나 사회적 규범을 어기는 것에 대해 별로 죄책감을 느끼지 않는다.',
    factor: 'antisocial'
  },
  {
    id: 2,
    category: '충동성',
    question: '계획을 세우기보다는 그때그때 상황에 따라 행동하는 편이다.',
    factor: 'impulsivity'
  },
  {
    id: 3,
    category: '공격성',
    question: '화가 나면 물리적으로 공격적이 되거나 싸움을 할 수 있다.',
    factor: 'aggression'
  },
  {
    id: 4,
    category: '책임감',
    question: '직장이나 재정적 의무를 지속적으로 이행하기 어렵다.',
    factor: 'irresponsibility'
  },
  {
    id: 5,
    category: '거짓말',
    question: '내 이익을 위해 자주 거짓말을 하거나 사람들을 속인다.',
    factor: 'deceitfulness'
  },
  {
    id: 6,
    category: '무모함',
    question: '자신이나 타인의 안전을 무시하고 위험한 행동을 한다.',
    factor: 'recklessness'
  },
  {
    id: 7,
    category: '후회 없음',
    question: '다른 사람에게 해를 끼치거나 상처를 줘도 별로 미안하지 않다.',
    factor: 'remorselessness'
  },
  {
    id: 8,
    category: '아동기 행동',
    question: '15세 이전에 규칙을 자주 어기거나 문제 행동이 있었다.',
    factor: 'conduct_disorder'
  },
  {
    id: 9,
    category: '충동성',
    question: '미래를 계획하지 않고 순간의 욕구에 따라 결정한다.',
    factor: 'impulsivity'
  },
  {
    id: 10,
    category: '공격성',
    question: '사소한 일에도 쉽게 짜증이 나고 화를 낸다.',
    factor: 'aggression'
  },
  {
    id: 11,
    category: '책임감',
    question: '약속이나 의무를 자주 어기거나 무시한다.',
    factor: 'irresponsibility'
  },
  {
    id: 12,
    category: '조작성',
    question: '다른 사람의 감정을 이용해서 원하는 것을 얻는다.',
    factor: 'deceitfulness'
  },
  {
    id: 13,
    category: '무모함',
    question: '운전이나 행동에서 무모하고 위험한 선택을 자주 한다.',
    factor: 'recklessness'
  },
  {
    id: 14,
    category: '관계',
    question: '장기적이고 안정적인 관계를 유지하기 어렵다.',
    factor: 'relationships'
  },
  {
    id: 15,
    category: '후회 없음',
    question: '잘못을 저질러도 변명하거나 합리화하는 경향이 있다.',
    factor: 'remorselessness'
  },
  {
    id: 16,
    category: '규칙 및 법률 준수',
    question: '체포되거나 법적 문제를 겪은 적이 여러 번 있다.',
    factor: 'antisocial'
  },
  {
    id: 17,
    category: '충동성',
    question: '일이나 거주지를 자주 바꾸며 한 곳에 정착하지 못한다.',
    factor: 'impulsivity'
  },
  {
    id: 18,
    category: '공격성',
    question: '배우자나 연인에게 신체적으로 폭력적이었던 적이 있다.',
    factor: 'aggression'
  },
  {
    id: 19,
    category: '거짓말',
    question: '가명을 사용하거나 신분을 속인 적이 있다.',
    factor: 'deceitfulness'
  },
  {
    id: 20,
    category: '책임감',
    question: '자녀나 가족을 돌보는 책임을 제대로 이행하지 못한다.',
    factor: 'irresponsibility'
  },
  {
    id: 21,
    category: '후회 없음',
    question: '타인의 권리를 침해해도 그들이 약해서 그렇다고 생각한다.',
    factor: 'remorselessness'
  },
  {
    id: 22,
    category: '아동기 행동',
    question: '어린 시절 다른 아이들이나 동물을 괴롭힌 적이 있다.',
    factor: 'conduct_disorder'
  },
  {
    id: 23,
    category: '무모함',
    question: '약물이나 알코올을 과도하게 사용한 적이 있다.',
    factor: 'recklessness'
  },
  {
    id: 24,
    category: '조작성',
    question: '매력이나 말재주로 사람들을 설득하고 이용한다.',
    factor: 'deceitfulness'
  },
  {
    id: 25,
    category: '관계',
    question: '여러 명과 동시에 관계를 맺거나 부정행위를 한다.',
    factor: 'relationships'
  },
  {
    id: 26,
    category: '규칙 및 법률 준수',
    question: '사회적 규범이나 윤리적 행동에 대해 무관심하다.',
    factor: 'antisocial'
  },
  {
    id: 27,
    category: '충동성',
    question: '갑자기 직장을 그만두거나 관계를 끊는 등 충동적인 결정을 한다.',
    factor: 'impulsivity'
  },
  {
    id: 28,
    category: '공격성',
    question: '위협이나 협박을 사용해서 원하는 것을 얻는다.',
    factor: 'aggression'
  },
  {
    id: 29,
    category: '책임감',
    question: '빚을 갚지 않거나 재정적 책임을 회피한다.',
    factor: 'irresponsibility'
  },
  {
    id: 30,
    category: '후회 없음',
    question: '다른 사람이 고통받는 것을 보고도 무감각하거나 냉담하다.',
    factor: 'remorselessness'
  }
];

// 토큰 카운터 애니메이션 컴포넌트
const TokenCounter: React.FC<{ currentCount: number, maxCount: number }> = ({ currentCount, maxCount }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const duration = 500;
    const steps = 20;
    const increment = currentCount / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step <= steps) {
        setDisplayCount(Math.floor(increment * step));
      } else {
        setDisplayCount(currentCount);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentCount]);

  return (
    <div className="fixed top-24 right-8 bg-white rounded-2xl shadow-2xl p-6 z-50 border-4 border-indigo-500">
      <AdOverlay />
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-2">답변 완료</div>
        <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {displayCount}
        </div>
        <div className="text-sm text-gray-500">/ {maxCount}</div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
            style={{ width: `${(displayCount / maxCount) * 100}%` }}
          />
        </div>

        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>
      </div>
    </div>
);
};

const SociopathTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [answeredCount, setAnsweredCount] = useState(0);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    const wasAnswered = newAnswers[currentQuestion] !== -1;
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);

    if (!wasAnswered) {
      setAnsweredCount(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 200);
    }
  };

  const calculateResult = () => {
    const total = answers.reduce((sum, answer) => sum + answer, 0);
    const percentage = (total / (questions.length * 4)) * 100;

    const factorScores = {
      antisocial: 0,
      impulsivity: 0,
      aggression: 0,
      irresponsibility: 0,
      deceitfulness: 0,
      recklessness: 0,
      remorselessness: 0,
      conduct_disorder: 0,
      relationships: 0
    };

    questions.forEach((q, idx) => {
      factorScores[q.factor as keyof typeof factorScores] += answers[idx];
    });

    return { total, percentage, factorScores };
  };

  const getResultMessage = (percentage: number) => {
    if (percentage < 20) {
      return {
        level: '매우 낮음',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: <CheckCircle className="w-16 h-16 text-green-600 mb-4" />,
        message: '정상 범위입니다. 당신은 사회적 규범을 잘 준수하고, 타인에 대한 책임감과 공감 능력을 가지고 있습니다.',
        description: '법과 규칙을 존중하며, 안정적인 대인관계를 유지하고, 충동을 적절히 조절할 수 있는 건강한 성향을 보입니다.'
      };
    } else if (percentage < 35) {
      return {
        level: '낮음',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: <CheckCircle className="w-16 h-16 text-blue-600 mb-4" />,
        message: '정상 범위입니다. 때때로 충동적이거나 규칙에 저항하는 경향이 있을 수 있지만, 정상적인 수준입니다.',
        description: '대부분의 사람들이 가지고 있는 수준의 반항심이나 충동성을 보입니다. 일상생활과 사회적 기능에는 문제가 없습니다.'
      };
    } else if (percentage < 50) {
      return {
        level: '중간',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: <AlertTriangle className="w-16 h-16 text-yellow-600 mb-4" />,
        message: '일부 주의가 필요합니다. 충동 조절, 책임감, 또는 규칙 준수에서 어려움을 경험할 수 있습니다.',
        description: '스트레스 상황에서 충동적이거나 무책임한 행동을 할 수 있습니다. 분노 조절이나 관계 유지에 어려움이 있을 수 있으며, 자기 관리 능력을 개선하는 것이 도움이 될 수 있습니다.'
      };
    } else if (percentage < 70) {
      return {
        level: '높음',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: <AlertTriangle className="w-16 h-16 text-orange-600 mb-4" />,
        message: '주의가 필요합니다. 반사회적 행동 패턴, 충동성, 공격성 등이 관찰됩니다. 전문가 상담을 권장합니다.',
        description: '법적 문제나 대인관계 갈등을 자주 겪을 수 있으며, 충동 조절과 책임감에 심각한 문제가 있을 수 있습니다. 전문적인 심리 상담과 행동 치료가 도움이 될 수 있습니다.'
      };
    } else {
      return {
        level: '매우 높음',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <XCircle className="w-16 h-16 text-red-600 mb-4" />,
        message: '심각한 수준의 반사회적 성향이 관찰됩니다. 반드시 전문가의 도움을 받으시기 바랍니다.',
        description: '심각한 충동 조절 장애, 공격성, 무책임한 행동 패턴 등이 나타납니다. ASPD(반사회성 성격장애) 가능성이 있으며, 전문적인 정신건강 평가와 치료가 필요합니다.'
      };
    }
  };

  const getFactorName = (factor: string) => {
    const names: { [key: string]: string } = {
      antisocial: '반사회적 행동',
      impulsivity: '충동성',
      aggression: '공격성',
      irresponsibility: '무책임성',
      deceitfulness: '기만성/조작성',
      recklessness: '무모함',
      remorselessness: '후회 없음',
      conduct_disorder: '아동기 품행장애',
      relationships: '관계 문제'
    };
    return names[factor] || factor;
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(-1));
    setShowResult(false);
    setShowWarning(true);
    setAnsweredCount(0);
  };

  if (showWarning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로 돌아가기</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Users className="w-20 h-20 text-indigo-600 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                소시오패스 성향 테스트
              </h1>
              <p className="text-lg text-gray-600">
                ASPD (반사회성 성격장애) 기반 심리 평가 도구
              </p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-900 mb-3 text-lg">중요 안내사항</h3>
                  <ul className="space-y-2 text-yellow-800 text-sm">
                    <li>• 이 테스트는 교육 및 자기 인식 목적으로 제작되었습니다.</li>
                    <li>• 실제 임상 진단 도구가 아니며, 전문적인 평가를 대체할 수 없습니다.</li>
                    <li>• DSM-5 ASPD(반사회성 성격장애) 진단 기준과 관련 연구를 기반으로 제작되었습니다.</li>
                    <li>• 소시오패스는 환경적 요인으로 발달하는 경향이 있으며, 치료와 개선이 가능합니다.</li>
                    <li>• 결과가 높게 나왔다고 해서 반드시 병리적 상태를 의미하지는 않습니다.</li>
                    <li>• 우려되는 결과가 나왔다면 전문 심리상담사나 정신건강의학과 전문의와 상담하시기 바랍니다.</li>
                    <li>• 솔직하게 답변할수록 더 정확한 결과를 얻을 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-indigo-900 mb-4">소시오패스 vs 싸이코패스</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-indigo-700 mb-2">소시오패스</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 환경적 요인 (학대, 트라우마)</li>
                    <li>• 감정적이고 충동적</li>
                    <li>• 일부 애착 형성 가능</li>
                    <li>• 사회 규범 무시</li>
                    <li>• 치료 가능성 높음</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-purple-700 mb-2">싸이코패스</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 선천적/유전적 요인</li>
                    <li>• 차갑고 계획적</li>
                    <li>• 진정한 애착 불가능</li>
                    <li>• 공감 능력 결핍</li>
                    <li>• 치료 매우 어려움</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">테스트 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span>총 30개 문항</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span>소요 시간: 약 5-7분</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span>5단계 척도 평가</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span>9가지 요인 분석 + 3D 시각화</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWarning(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg shadow-lg"
            >
              테스트 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const result = calculateResult();
    const resultInfo = getResultMessage(result.percentage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로 돌아가기</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              {resultInfo.icon}
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                테스트 결과
              </h2>
              <div className={`inline-block px-6 py-3 rounded-full ${resultInfo.bgColor} ${resultInfo.borderColor} border-2 mt-4`}>
                <span className={`text-2xl font-bold ${resultInfo.color}`}>
                  {resultInfo.level}
                </span>
              </div>
            </div>

            <div className={`${resultInfo.bgColor} ${resultInfo.borderColor} border-2 rounded-xl p-6 mb-8`}>
              <h3 className={`font-bold ${resultInfo.color} text-xl mb-3`}>
                {resultInfo.message}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {resultInfo.description}
              </p>
            </div>

            {/* 3D 레이더 차트 */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4 text-lg text-center">요인별 3D 분석 (9개 요인)</h3>
              <RadarChart3D data={result.factorScores} factorNames={getFactorName} colorScheme="indigo" />
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">점수 상세</h3>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">전체 점수</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {result.total} / {questions.length * 4}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 ease-out"
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
                <div className="text-right mt-1">
                  <span className="text-sm text-gray-600">{result.percentage.toFixed(1)}%</span>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-4">요인별 점수</h4>
              <div className="space-y-3">
                {Object.entries(result.factorScores).map(([factor, score]) => {
                  const maxScore = questions.filter(q => q.factor === factor).length * 4;
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div key={factor}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {getFactorName(factor)}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {score} / {maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-blue-900 mb-3">개선 및 치료 방향</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• <strong>인지행동치료(CBT):</strong> 부정적 사고 패턴과 행동을 변화시킵니다.</li>
                <li>• <strong>분노 조절 프로그램:</strong> 충동성과 공격성을 관리하는 법을 배웁니다.</li>
                <li>• <strong>사회기술훈련:</strong> 건강한 대인관계 기술을 습득합니다.</li>
                <li>• <strong>약물치료:</strong> 필요시 충동성이나 공격성 조절을 위한 약물 처방</li>
                <li>• <strong>집단치료:</strong> 비슷한 어려움을 겪는 사람들과 경험 공유</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-yellow-900 mb-3">참고사항</h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• 이 테스트는 자가 진단 도구이며, 의학적 진단을 대체하지 않습니다.</li>
                <li>• 소시오패스 성향은 환경적 요인에 의해 발달하므로 치료와 개선이 가능합니다.</li>
                <li>• 전문가의 도움을 받으면 충동 조절과 사회적 기능을 크게 개선할 수 있습니다.</li>
                <li>• 정신건강의학과 전문의나 임상심리전문가와 상담을 권장합니다.</li>
                <li>• 정신건강 위기 상황 시: 자살예방 상담전화 1393, 정신건강 위기상담 1577-0199</li>
              </ul>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={restart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg"
              >
                다시 테스트하기
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-xl transition-colors text-center shadow-lg"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>

          <RelatedApps currentAppSlug="sociopath-test" className="mt-8" />
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4 md:p-8">
      {/* 토큰 카운터 */}
      {answeredCount > 0 && <TokenCounter currentCount={answeredCount} maxCount={questions.length} />}

      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>홈으로 돌아가기</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                진행률
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              {question.category}
            </span>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { score: 0, label: '전혀 그렇지 않다', color: 'from-green-500 to-green-600' },
              { score: 1, label: '그렇지 않다', color: 'from-blue-500 to-blue-600' },
              { score: 2, label: '보통이다', color: 'from-yellow-500 to-yellow-600' },
              { score: 3, label: '그렇다', color: 'from-orange-500 to-orange-600' },
              { score: 4, label: '매우 그렇다', color: 'from-red-500 to-red-600' }
            ].map((option) => (
              <button
                key={option.score}
                onClick={() => handleAnswer(option.score)}
                className={`w-full p-5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                  ${answers[currentQuestion] === option.score
                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg scale-105`
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-gray-200'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option.label}</span>
                  {answers[currentQuestion] === option.score && (
                    <CheckCircle className="w-6 h-6" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors"
              >
                이전
              </button>
            )}
            {answers[currentQuestion] !== -1 && (
              <button
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                  } else {
                    setShowResult(true);
                  }
                }}
                className="ml-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
              >
                {currentQuestion === questions.length - 1 ? '결과 보기' : '다음'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SociopathTest;
