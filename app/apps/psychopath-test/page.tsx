'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import RelatedApps from '@/app/components/RelatedApps';
import RadarChart3D from '@/app/components/RadarChart3D';
import AdSense from '@/app/components/AdSense';

// PCL-R 및 심리학 연구 기반 질문들
const questions = [
  {
    id: 1,
    category: '감정 및 공감능력',
    question: '다른 사람이 슬퍼하거나 고통받는 모습을 봐도 별다른 감정이 들지 않는다.',
    factor: 'affective'
  },
  {
    id: 2,
    category: '대인관계',
    question: '나는 다른 사람들보다 매력적이고 설득력이 뛰어나다고 생각한다.',
    factor: 'interpersonal'
  },
  {
    id: 3,
    category: '충동성',
    question: '계획 없이 즉흥적으로 행동하는 경우가 많다.',
    factor: 'lifestyle'
  },
  {
    id: 4,
    category: '책임감',
    question: '약속을 지키지 않거나 책임을 회피하는 것이 자주 있다.',
    factor: 'lifestyle'
  },
  {
    id: 5,
    category: '감정 및 공감능력',
    question: '다른 사람의 감정에 공감하거나 이해하는 것이 어렵다.',
    factor: 'affective'
  },
  {
    id: 6,
    category: '자기중심성',
    question: '내가 특별하고 다른 사람들보다 우월하다고 느낀다.',
    factor: 'interpersonal'
  },
  {
    id: 7,
    category: '조작성',
    question: '내 목적을 달성하기 위해 거짓말을 하는 것에 거리낌이 없다.',
    factor: 'interpersonal'
  },
  {
    id: 8,
    category: '감정 및 공감능력',
    question: '죄책감이나 양심의 가책을 거의 느끼지 않는다.',
    factor: 'affective'
  },
  {
    id: 9,
    category: '대인관계',
    question: '깊고 진실한 인간관계를 유지하기 어렵다.',
    factor: 'interpersonal'
  },
  {
    id: 10,
    category: '자극 추구',
    question: '지루함을 참기 어렵고 항상 새로운 자극을 찾는다.',
    factor: 'lifestyle'
  },
  {
    id: 11,
    category: '감정 및 공감능력',
    question: '다른 사람을 이용하거나 상처 주는 것에 대해 후회하지 않는다.',
    factor: 'affective'
  },
  {
    id: 12,
    category: '책임감',
    question: '장기적인 목표를 세우고 실천하는 것이 어렵다.',
    factor: 'lifestyle'
  },
  {
    id: 13,
    category: '조작성',
    question: '다른 사람을 조종하거나 통제하는 것을 즐긴다.',
    factor: 'interpersonal'
  },
  {
    id: 14,
    category: '충동성',
    question: '화가 나면 충동적으로 공격적인 행동을 할 때가 있다.',
    factor: 'antisocial'
  },
  {
    id: 15,
    category: '감정 표현',
    question: '감정을 표현할 때 실제로 느끼지 않는 감정을 연기하는 경우가 많다.',
    factor: 'affective'
  },
  {
    id: 16,
    category: '자기중심성',
    question: '다른 사람의 필요나 감정보다 내 욕구가 항상 우선이다.',
    factor: 'interpersonal'
  },
  {
    id: 17,
    category: '책임감',
    question: '실수나 잘못을 저질러도 남을 탓하는 경향이 있다.',
    factor: 'affective'
  },
  {
    id: 18,
    category: '대인관계',
    question: '여러 명과 동시에 피상적인 관계를 유지하는 것을 선호한다.',
    factor: 'lifestyle'
  },
  {
    id: 19,
    category: '규칙 준수',
    question: '사회적 규범이나 규칙을 무시하는 것에 거리낌이 없다.',
    factor: 'antisocial'
  },
  {
    id: 20,
    category: '자극 추구',
    question: '위험하거나 무모한 행동을 즐긴다.',
    factor: 'lifestyle'
  },
  {
    id: 21,
    category: '감정 및 공감능력',
    question: '동물이나 약자가 고통받는 것을 보고도 무감각하다.',
    factor: 'affective'
  },
  {
    id: 22,
    category: '조작성',
    question: '매력과 말재주로 사람들을 쉽게 속일 수 있다.',
    factor: 'interpersonal'
  },
  {
    id: 23,
    category: '충동성',
    question: '결과를 생각하지 않고 행동하는 경우가 많다.',
    factor: 'lifestyle'
  },
  {
    id: 24,
    category: '감정 깊이',
    question: '사랑, 슬픔 같은 깊은 감정을 실제로 느끼기 어렵다.',
    factor: 'affective'
  },
  {
    id: 25,
    category: '자기중심성',
    question: '내가 원하는 것을 얻기 위해서라면 다른 사람이 피해를 봐도 괜찮다.',
    factor: 'interpersonal'
  },
  {
    id: 26,
    category: '책임감',
    question: '일이나 관계에서 장기적인 헌신을 하기 어렵다.',
    factor: 'lifestyle'
  },
  {
    id: 27,
    category: '규칙 준수',
    question: '어릴 때부터 문제 행동이나 규칙 위반이 있었다.',
    factor: 'antisocial'
  },
  {
    id: 28,
    category: '조작성',
    question: '상황에 따라 전혀 다른 성격을 연기할 수 있다.',
    factor: 'interpersonal'
  },
  {
    id: 29,
    category: '감정 및 공감능력',
    question: '다른 사람의 고통을 이용해 내 이익을 챙기는 것에 거리낌이 없다.',
    factor: 'affective'
  },
  {
    id: 30,
    category: '자극 추구',
    question: '평범한 일상은 견딜 수 없고 극적인 상황을 만들어내곤 한다.',
    factor: 'lifestyle'
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
    <div className="fixed top-24 right-8 bg-white rounded-2xl shadow-2xl p-6 z-50 border-4 border-purple-500">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-2">답변 완료</div>
        <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {displayCount}
        </div>
        <div className="text-sm text-gray-500">/ {maxCount}</div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${(displayCount / maxCount) * 100}%` }}
          />
        </div>
      </div>
    </div>

        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>

  );
};

const PsychopathTest: React.FC = () => {
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
      interpersonal: 0,
      affective: 0,
      lifestyle: 0,
      antisocial: 0
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
        message: '정상 범위입니다. 당신은 건강한 공감 능력과 도덕성을 가지고 있으며, 타인의 감정을 잘 이해하고 배려하는 성향을 보입니다.',
        description: '일반적인 감정 반응과 공감 능력을 가지고 있으며, 사회적 규범을 존중하고 타인과의 관계에서 건강한 상호작용을 합니다.'
      };
    } else if (percentage < 35) {
      return {
        level: '낮음',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: <CheckCircle className="w-16 h-16 text-blue-600 mb-4" />,
        message: '정상 범위입니다. 일부 자기중심적 성향이 있을 수 있지만, 이는 정상적인 범위 내에 있습니다.',
        description: '대부분의 사람들이 가지고 있는 수준의 자기 보호 본능과 자기중심성을 보입니다. 일상생활과 대인관계에 문제가 없습니다.'
      };
    } else if (percentage < 50) {
      return {
        level: '중간',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: <AlertTriangle className="w-16 h-16 text-yellow-600 mb-4" />,
        message: '일부 주의가 필요한 성향이 관찰됩니다. 공감 능력이나 충동 조절에서 어려움을 경험할 수 있습니다.',
        description: '스트레스 상황에서 충동적이거나 자기중심적인 행동을 할 수 있습니다. 자기 인식과 감정 조절 능력을 개발하는 것이 도움이 될 수 있습니다.'
      };
    } else if (percentage < 70) {
      return {
        level: '높음',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: <AlertTriangle className="w-16 h-16 text-orange-600 mb-4" />,
        message: '주의가 필요합니다. 공감 능력 부족, 충동성, 조작적 성향 등이 관찰됩니다. 전문가 상담을 권장합니다.',
        description: '대인관계나 사회 적응에 어려움을 겪을 수 있으며, 자신과 타인에게 해로운 행동 패턴을 보일 수 있습니다. 전문적인 심리 상담이 도움이 될 수 있습니다.'
      };
    } else {
      return {
        level: '매우 높음',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <XCircle className="w-16 h-16 text-red-600 mb-4" />,
        message: '심각한 수준의 반사회적 성향이 관찰됩니다. 반드시 전문가의 도움을 받으시기 바랍니다.',
        description: '심각한 공감 능력 결핍, 반사회적 행동 패턴, 조작적 성향 등이 나타납니다. 전문적인 정신건강 평가와 치료가 필요할 수 있습니다.'
      };
    }
  };

  const getFactorName = (factor: string) => {
    const names: { [key: string]: string } = {
      interpersonal: '대인관계/조작성',
      affective: '감정/공감 결핍',
      lifestyle: '충동적 생활방식',
      antisocial: '반사회적 행동'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로 돌아가기</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Brain className="w-20 h-20 text-purple-600 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                싸이코패스 성향 테스트
              </h1>
              <p className="text-lg text-gray-600">
                PCL-R 기반 심리 평가 도구
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
                    <li>• PCL-R(Psychopathy Checklist-Revised)과 관련 심리학 연구를 기반으로 제작되었습니다.</li>
                    <li>• 결과가 높게 나왔다고 해서 반드시 병리적 상태를 의미하지는 않습니다.</li>
                    <li>• 우려되는 결과가 나왔다면 전문 심리상담사나 정신건강의학과 전문의와 상담하시기 바랍니다.</li>
                    <li>• 솔직하게 답변할수록 더 정확한 결과를 얻을 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">테스트 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>총 30개 문항</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>소요 시간: 약 5-7분</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>5단계 척도 평가</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>4가지 요인 분석 + 3D 시각화</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWarning(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg shadow-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-8 transition-colors"
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
              <h3 className="font-bold text-gray-900 mb-4 text-lg text-center">요인별 3D 분석</h3>
              <RadarChart3D data={result.factorScores} factorNames={getFactorName} colorScheme="purple" />
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">점수 상세</h3>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">전체 점수</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {result.total} / {questions.length * 4}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000 ease-out"
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
                <div className="text-right mt-1">
                  <span className="text-sm text-gray-600">{result.percentage.toFixed(1)}%</span>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-4">요인별 점수</h4>
              <div className="space-y-4">
                {Object.entries(result.factorScores).map(([factor, score]) => {
                  const maxScore = questions.filter(q => q.factor === factor).length * 4;
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div key={factor}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {getFactorName(factor)}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {score} / {maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-blue-900 mb-3">참고사항</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• 이 테스트는 자가 진단 도구이며, 의학적 진단을 대체하지 않습니다.</li>
                <li>• 심리적 어려움을 겪고 계신다면 전문가의 도움을 받으시기 바랍니다.</li>
                <li>• 정신건강의학과 전문의나 임상심리전문가와 상담을 권장합니다.</li>
                <li>• 정신건강 위기 상황 시: 자살예방 상담전화 1393, 정신건강 위기상담 1577-0199</li>
              </ul>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={restart}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg"
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

          <RelatedApps currentAppSlug="psychopath-test" className="mt-8" />
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      {/* 토큰 카운터 */}
      {answeredCount > 0 && <TokenCounter currentCount={answeredCount} maxCount={questions.length} />}

      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-8 transition-colors"
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
              <span className="text-sm font-bold text-purple-600">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
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
                className="ml-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
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

export default PsychopathTest;
