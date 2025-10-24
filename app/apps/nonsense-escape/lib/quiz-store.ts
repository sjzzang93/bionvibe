"use client";

import { create } from "zustand";
import { questions, type NonsenseQuestion } from "./questions";
import { shuffle } from "./utils";

type FailureReason = "wrong" | "timeout";

type QuizState = {
  active: boolean;
  streak: number;
  streakTarget: number;
  timerSeconds: number;
  hint: string | null;
  hintCooldownRemaining: number;
  canRequestHint: boolean;
  currentQuestion: NonsenseQuestion | null;
  currentOptions: string[];
  narratorLog: string[];
  questionQueue: NonsenseQuestion[];
  questionsAnswered: number;
  selectAnswer: (answer: string) => void;
  requestHint: () => void;
  startQuiz: () => void;
  resetQuiz: (reason?: FailureReason) => void;
  tickTimer: () => void;
  tickHintCooldown: () => void;
};

const BASE_TIME = 120; // seconds
const HINT_COOLDOWN_SECONDS = 30;
const QUESTIONS_PER_RUN = 10;

const buildQuestionQueue = () => {
  if (questions.length <= QUESTIONS_PER_RUN) {
    return shuffle(questions);
  }
  return shuffle(questions).slice(0, QUESTIONS_PER_RUN);
};

export const useQuizStore = create<QuizState>((set, get) => ({
  active: false,
  streak: 0,
  streakTarget: Math.min(QUESTIONS_PER_RUN, questions.length),
  timerSeconds: BASE_TIME,
  hint: null,
  hintCooldownRemaining: 0,
  canRequestHint: true,
  currentQuestion: null,
  currentOptions: [],
  narratorLog: [],
  questionQueue: [],
  questionsAnswered: 0,

  startQuiz: () => {
    const queue = buildQuestionQueue();
    const next = queue[0];
    if (!next) return;
    set({
      active: true,
      streak: 0,
      timerSeconds: BASE_TIME,
      hint: null,
      hintCooldownRemaining: 0,
      canRequestHint: true,
      currentQuestion: next,
      currentOptions: shuffle(next.options),
      narratorLog: ["🤖 AI: \"실험을 시작합니다. 웃음을 조심하세요.\""],
      questionQueue: queue,
      questionsAnswered: 0,
      streakTarget: Math.min(QUESTIONS_PER_RUN, questions.length)
    });
  },

  selectAnswer: (answer: string) => {
    const state = get();
    if (!state.currentQuestion) return;
    if (!state.active) return;

    const isCorrect = answer === state.currentQuestion.correctAnswer;

    if (!isCorrect) {
      set({
        active: false,
        narratorLog: [
          ...state.narratorLog,
          state.currentQuestion.narratorFail,
          "🚫 AI: \"연속 정답이 끊겨 리셋합니다.\""
        ]
      });
      setTimeout(() => get().resetQuiz("wrong"), 600);
      return;
    }

    const nextStreak = state.streak + 1;

    if (nextStreak >= state.streakTarget) {
      set({
        streak: nextStreak,
        active: false,
        narratorLog: [
          ...state.narratorLog,
          state.currentQuestion.narratorSuccess,
          "🎉 AI: \"룰렛 이벤트 룸으로 이동합니다!\""
        ]
      });
      return;
    }

    const nextIndex = state.questionsAnswered + 1;
    const nextQuestion = state.questionQueue[nextIndex];

    if (!nextQuestion) {
      const refreshedQueue = buildQuestionQueue();
      const firstRefreshed = refreshedQueue[0] ?? state.currentQuestion;
      set({
        streak: nextStreak,
        currentQuestion: firstRefreshed,
        currentOptions: shuffle(firstRefreshed.options),
        hint: null,
        narratorLog: [
          ...state.narratorLog,
          state.currentQuestion.narratorSuccess,
          `✅ AI: \"현재 연속 정답 ${nextStreak} / ${state.streakTarget}.\"`
        ],
        questionQueue: refreshedQueue,
        questionsAnswered: 0
      });
      return;
    }

    set({
      streak: nextStreak,
      currentQuestion: nextQuestion,
      currentOptions: shuffle(nextQuestion.options),
      hint: null,
      narratorLog: [
        ...state.narratorLog,
        state.currentQuestion.narratorSuccess,
        `✅ AI: \"현재 연속 정답 ${nextStreak} / ${state.streakTarget}.\"`
      ],
      questionsAnswered: nextIndex
    });
  },

  requestHint: () => {
    const state = get();
    if (!state.canRequestHint || !state.currentQuestion) return;

    const hintLine = `💡 ${state.currentQuestion.explanation}`;
    set({
      hint: hintLine,
      canRequestHint: false,
      hintCooldownRemaining: HINT_COOLDOWN_SECONDS,
      narratorLog: [
        ...state.narratorLog,
        "🤖 AI: \"힌트를 방금 내려보냈어요. 웃지 말고 받아.\""
      ]
    });
  },

  resetQuiz: (reason) => {
    const state = get();
    const message =
      reason === "timeout"
        ? "⏰ AI: \"시간 초과! 실험실 문이 잠겼어요. 다시 시도하세요.\""
        : "💥 AI: \"실험 실패. 하지만 과학은 도전으로 이루어집니다.\"";

    set({
      active: false,
      streak: 0,
      timerSeconds: BASE_TIME,
      hint: null,
      hintCooldownRemaining: 0,
      canRequestHint: true,
      narratorLog: [...state.narratorLog, message]
    });

    setTimeout(() => get().startQuiz(), 1500);
  },

  tickTimer: () => {
    const state = get();
    if (!state.active || state.timerSeconds <= 0) return;
    set({ timerSeconds: state.timerSeconds - 1 });
  },

  tickHintCooldown: () => {
    const state = get();
    if (state.hintCooldownRemaining <= 0) return;

    if (state.hintCooldownRemaining <= 1) {
      set({ hintCooldownRemaining: 0, canRequestHint: true });
    } else {
      set({ hintCooldownRemaining: state.hintCooldownRemaining - 1 });
    }
  }
}));
