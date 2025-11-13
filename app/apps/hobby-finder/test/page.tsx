'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/lib/hobby-questions';
import { accumulate, normalize, getRecommendations } from '@/lib/hobby-scoring';
import { getState, setState } from '@/lib/hobby-storage';
import { StepHeader } from '@/app/components/hobby/StepHeader';
import { OptionCard } from '@/app/components/hobby/OptionCard';
import type { Choice } from '@/lib/hobby-types';
import AdOverlay from '@/app/components/AdOverlay';

export default function HobbyTestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [autoProgressTimer, setAutoProgressTimer] = useState<NodeJS.Timeout | null>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  // Load state on mount
  useEffect(() => {
    const saved = getState();
    if (saved) {
      setAnswers(saved.answers || {});
      setCurrentQuestionIndex(saved.currentQuestionIndex || 0);
    }
  }, []);

  // Save state on change (답변 진행 중에만 저장, score/hobbies는 제외)
  useEffect(() => {
    const saved = getState();
    setState({
      answers,
      currentStep: currentQuestion.step,
      currentQuestionIndex,
      // 기존에 저장된 score와 hobbies가 있으면 유지
      ...(saved?.score && { score: saved.score }),
      ...(saved?.hobbies && { hobbies: saved.hobbies }),
    });
  }, [answers, currentQuestionIndex, currentQuestion.step]);

  // Pre-select if already answered
  useEffect(() => {
    const existingAnswer = answers[currentQuestion.id];
    setSelectedChoice(existingAnswer || null);
  }, [currentQuestion.id, answers]);

  const handleSelect = (choiceId: string) => {
    // 기존 타이머가 있으면 취소
    if (autoProgressTimer) {
      clearTimeout(autoProgressTimer);
    }

    setSelectedChoice(choiceId);

    const newAnswers = { ...answers, [currentQuestion.id]: choiceId };
    setAnswers(newAnswers);

    // 1초 후 자동으로 다음 질문으로 이동
    const timer = setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedChoice(null);
      } else {
        // Calculate result
        const selectedChoices: Choice[] = [];
        QUESTIONS.forEach((q) => {
          const answerId = newAnswers[q.id];
          const choice = q.choices.find((c) => c.id === answerId);
          if (choice) selectedChoices.push(choice);
        });

        const rawScore = accumulate(selectedChoices);
        const normalizedScore = normalize(rawScore);
        const hobbies = getRecommendations(normalizedScore, 8);

        console.log('🎯 [취미찾기] Raw Score:', rawScore);
        console.log('🎯 [취미찾기] Normalized Score:', normalizedScore);
        console.log('🎯 [취미찾기] Recommended Hobbies:', hobbies);

        const finalState = {
          answers: newAnswers,
          currentStep: 5,
          currentQuestionIndex: QUESTIONS.length - 1,
          score: normalizedScore,
          hobbies,
        };

        setState(finalState);

        console.log('🎯 [취미찾기] State 저장 완료!');
        console.log('🎯 [취미찾기] 저장된 State:', finalState);

        // localStorage 저장을 확실히 하기 위해 약간의 딜레이 후 이동
        setTimeout(() => {
          router.push('/apps/hobby-finder/result');
        }, 100);
      }
    }, 1000);

    setAutoProgressTimer(timer);
  };

  const handlePrev = () => {
    // 타이머 취소
    if (autoProgressTimer) {
      clearTimeout(autoProgressTimer);
      setAutoProgressTimer(null);
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (autoProgressTimer) {
        clearTimeout(autoProgressTimer);
      }
    };
  }, [autoProgressTimer]);

  const stepTitle = `Step ${currentQuestion.step}: ${
    currentQuestion.step === 1
      ? '에너지 성향'
      : currentQuestion.step === 2
      ? '집중 방식'
      : currentQuestion.step === 3
      ? '사회성'
      : currentQuestion.step === 4
      ? '감성/논리'
      : '환경 선호'
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      
      <AdOverlay /><div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <StepHeader currentStep={currentQuestion.step} totalSteps={5} title={stepTitle} progress={progress} />

          {/* Question Card */}
          <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">{currentQuestion.title}</h3>

            {currentQuestion.helper && (
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{currentQuestion.helper}</p>
            )}

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.choices.map((choice) => (
                <OptionCard
                  key={choice.id}
                  id={choice.id}
                  label={choice.label}
                  selected={selectedChoice === choice.id}
                  onSelect={() => handleSelect(choice.id)}
                />
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="rounded-2xl border-2 border-gray-300 bg-white px-8 py-4 font-bold text-gray-700 transition-all hover:border-gray-400 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              ← 이전
            </button>

            <div className="flex-1 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentQuestionIndex + 1} / {QUESTIONS.length}
              </div>
              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                선택 후 1초 안에 이전 버튼으로 취소 가능
              </div>
            </div>

            <div className="w-[120px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

