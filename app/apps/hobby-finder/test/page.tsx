'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/lib/hobby-questions';
import { accumulate, normalize, getRecommendations } from '@/lib/hobby-scoring';
import { getState, setState } from '@/lib/hobby-storage';
import { StepHeader } from '@/app/components/hobby/StepHeader';
import { OptionCard } from '@/app/components/hobby/OptionCard';
import type { Choice } from '@/lib/hobby-types';

export default function HobbyTestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

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

  // Save state on change
  useEffect(() => {
    setState({
      answers,
      currentStep: currentQuestion.step,
      currentQuestionIndex,
    });
  }, [answers, currentQuestionIndex, currentQuestion.step]);

  // Pre-select if already answered
  useEffect(() => {
    const existingAnswer = answers[currentQuestion.id];
    setSelectedChoice(existingAnswer || null);
  }, [currentQuestion.id, answers]);

  const handleSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
  };

  const handleNext = () => {
    if (!selectedChoice) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedChoice };
    setAnswers(newAnswers);

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

      setState({
        answers: newAnswers,
        currentStep: 5,
        currentQuestionIndex: QUESTIONS.length - 1,
        score: normalizedScore,
        hobbies,
      });

      console.log('🎯 [취미찾기] State 저장 완료!');

      router.push('/apps/hobby-finder/result');
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

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
      <div className="container mx-auto px-4 py-12">
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

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {currentQuestionIndex + 1} / {QUESTIONS.length}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedChoice}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentQuestionIndex === QUESTIONS.length - 1 ? '결과 보기 🎉' : '다음 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

