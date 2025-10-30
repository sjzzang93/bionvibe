"use client";

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Clock, CheckCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  TestLevel,
  getQuestionsByLevel,
  TEST_CONFIGS,
  DOMAIN_INFO,
  Answer,
} from '@/lib/inner-dialog-data';
import { calculateTestResult, getTopVulnerableAreas, getTopStrengthAreas, generatePsychologicalAnalysis } from '@/lib/inner-dialog-score';

type Stage = 'intro' | 'test' | 'results';

export default function InnerDialogPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [testLevel, setTestLevel] = useState<TestLevel>('basic');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const questions = useMemo(() => getQuestionsByLevel(testLevel), [testLevel]);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // 레벨 선택
  const handleStartTest = (level: TestLevel) => {
    setTestLevel(level);
    setStage('test');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  // 답변 선택
  const handleAnswer = (value: number) => {
    const newAnswers = [
      ...answers.filter(a => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, value },
    ];
    setAnswers(newAnswers);

    // 자동으로 다음 질문으로 이동
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setStage('results');
      }
    }, 300);
  };

  // 이전 질문으로
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 결과 계산
  const result = useMemo(() => {
    if (stage === 'results' && answers.length > 0) {
      return calculateTestResult(answers);
    }
    return null;
  }, [stage, answers]);

  // 심리 분석 생성
  const psychologicalAnalysis = useMemo(() => {
    if (result) {
      return generatePsychologicalAnalysis(result);
    }
    return [];
  }, [result]);

  // 다시 시작
  const handleRestart = () => {
    setStage('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  // 인트로 화면
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">
                Self-Awareness Test
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
              자신과 대화하기
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              15개 영역을 분석하여 당신의 마음 상태를 심리 상담사처럼 깊이있게 진단합니다.
              <br className="hidden sm:block" />
              자기 인식의 여정을 시작하세요.
            </p>
          </div>

          {/* 테스트 레벨 선택 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {(Object.keys(TEST_CONFIGS) as TestLevel[]).map(level => {
              const config = TEST_CONFIGS[level];
              return (
                <Card
                  key={level}
                  className="p-5 sm:p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500 dark:hover:border-purple-400 active:scale-95"
                  onClick={() => handleStartTest(level)}
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mb-2">
                      {config.questionCount}문항
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                      <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                      <span>{config.estimatedTime}분</span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1 sm:mb-2">
                      {level === 'basic' && '간편 진단'}
                      {level === 'standard' && '표준 진단'}
                      {level === 'advanced' && '심화 진단'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {config.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* 15개 영역 소개 */}
          <Card className="p-4 sm:p-6">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-gray-900 dark:text-white">
              분석 영역 (15개)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {Object.entries(DOMAIN_INFO).map(([domain, info]) => (
                <div
                  key={domain}
                  className="flex items-center gap-1.5 sm:gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <span className="text-base sm:text-xl">{info.emoji}</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {info.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 테스트 진행 화면
  if (stage === 'test') {
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 진행률 */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 질문 카드 */}
          <Card className="p-6 sm:p-8 mb-4 sm:mb-6">
            <div className="mb-2 sm:mb-3">
              <span className="inline-block px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold rounded-full">
                {DOMAIN_INFO[currentQuestion.domain].emoji}{' '}
                {DOMAIN_INFO[currentQuestion.domain].name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight">
              {currentQuestion.text}
            </h2>

            {/* Likert 7점 척도 (모바일 최적화) */}
            <div className="space-y-2 sm:space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map(value => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all text-left active:scale-98 ${
                    currentAnswer?.value === value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {value === 1 && '전혀 그렇지 않다'}
                      {value === 2 && '그렇지 않다'}
                      {value === 3 && '약간 그렇지 않다'}
                      {value === 4 && '보통이다'}
                      {value === 5 && '약간 그렇다'}
                      {value === 6 && '그렇다'}
                      {value === 7 && '매우 그렇다'}
                    </span>
                    {currentAnswer?.value === value && (
                      <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* 네비게이션 */}
          <div className="flex gap-3 sm:gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">이전</span>
            </Button>
            <Button
              onClick={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else if (answers.length === questions.length) {
                  setStage('results');
                }
              }}
              disabled={!currentAnswer}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
              size="lg"
            >
              <span className="text-sm sm:text-base">
                {currentQuestionIndex === questions.length - 1 ? '결과 보기' : '다음'}
              </span>
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-1 sm:ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (stage === 'results' && result) {
    const weakAreas = getTopVulnerableAreas(result.domainScores);
    const strongAreas = getTopStrengthAreas(result.domainScores);
    const overallScore = Math.round(
      result.domainScores.reduce((sum, d) => sum + d.score, 0) / result.domainScores.length
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <Heart className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 text-purple-500" />
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 px-2">
              당신의 마음을 들여다봤어요
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4">
              심리 상담사가 전하는 따뜻한 분석과 조언
            </p>
          </div>

          {/* 종합 점수 */}
          <Card className="p-6 sm:p-8 mb-6 sm:mb-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center">
            <div className="text-5xl sm:text-7xl font-black mb-2 sm:mb-3">{overallScore}</div>
            <div className="text-xl sm:text-2xl font-semibold opacity-95">전체 균형 점수</div>
            <p className="text-xs sm:text-sm opacity-75 mt-1 sm:mt-2">100점 만점 기준</p>
          </Card>

          {/* 심리 분석 (메인 콘텐츠) */}
          <Card className="p-6 sm:p-8 mb-6 sm:mb-8 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                심리 분석
              </h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {psychologicalAnalysis.map((paragraph, index) => (
                <p key={index} className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>

          {/* 복합 지수 */}
          <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">복합 지수</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {Object.entries(result.compositeIndices).map(([key, value]) => (
                <div key={key} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
                    {value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {key === 'wellbeing' && '웰빙'}
                    {key === 'vitality' && '활력'}
                    {key === 'growth' && '성장'}
                    {key === 'stability' && '안정'}
                    {key === 'balance' && '균형'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 강점 & 취약 영역 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">강점 영역</h3>
              <div className="space-y-2 sm:space-y-3">
                {strongAreas.map(area => (
                  <div key={area.domain} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                      {DOMAIN_INFO[area.domain].emoji} {DOMAIN_INFO[area.domain].name}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                      {area.score}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">개선 영역</h3>
              <div className="space-y-2 sm:space-y-3">
                {weakAreas.map(area => (
                  <div key={area.domain} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                      {DOMAIN_INFO[area.domain].emoji} {DOMAIN_INFO[area.domain].name}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
                      {area.score}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 추천 사항 */}
          <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">맞춤 추천</h3>
            <div className="space-y-2 sm:space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-purple-600 dark:text-purple-400 font-bold text-sm sm:text-base flex-shrink-0">{index + 1}</div>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 다시 시작 */}
          <div className="text-center">
            <Button
              onClick={handleRestart}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 w-full sm:w-auto px-8"
            >
              <span className="text-sm sm:text-base">다시 시작하기</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
