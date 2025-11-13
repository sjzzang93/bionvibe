"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "../lib/quiz-store";
import HintBubble from "../components/hint-bubble";
import ComicNarratorFeed from "../components/comic-narrator-feed";
import ProgressTracker from "../components/progress-tracker";
import Timer from "../components/timer";
import { useParallax } from "../lib/use-parallax";
import AdOverlay from '@/app/components/AdOverlay';

type EntryStatus = "checking" | "allowed" | "blocked";

export default function QuizPage() {
  const {
    currentQuestion,
    currentOptions,
    narratorLog,
    streak,
    streakTarget,
    timerSeconds,
    selectAnswer,
    startQuiz,
    active,
    resetQuiz
  } = useQuizStore();
  const router = useRouter();
  const { mousePos, enabled: parallaxEnabled } = useParallax({ maxOffset: 10 });
  const [entryStatus, setEntryStatus] = useState<EntryStatus>("checking");
  const [entryError, setEntryError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const registerEntry = async () => {
      try {
        const response = await fetch("/api/nonsense-escape/entry", { method: "POST" });
        const data = await response.json();
        if (cancelled) return;

        if (response.ok && data?.allowed) {
          setEntryStatus("allowed");
        } else if (data?.reason === "limit_reached") {
          setEntryStatus("blocked");
          router.replace("/apps/nonsense-escape/limit");
        } else {
          setEntryError("참여 확인에 실패했습니다. 잠시 후 다시 시도해주세요.");
          setEntryStatus("blocked");
        }
      } catch (error) {
        if (!cancelled) {
          setEntryError("참여 확인 중 오류가 발생했습니다. 잠시 뒤 다시 접속해 주세요.");
          setEntryStatus("blocked");
        }
      }
    };

    registerEntry();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (entryStatus === "allowed") {
      startQuiz();
    }
  }, [entryStatus, startQuiz]);

  useEffect(() => {
    if (!active) return;
    if (streak >= streakTarget) {
      setTimeout(() => router.push("/apps/nonsense-escape/roulette"), 400);
    }
    if (timerSeconds <= 0) {
      resetQuiz("timeout");
    }
  }, [active, streak, streakTarget, timerSeconds, router, resetQuiz]);

  if (entryStatus === "checking") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        
      <AdOverlay /><div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-xl text-slate-200">참여 가능 여부를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (entryStatus === "blocked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-slate-700/60 bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur">
          <div className="text-5xl mb-4">🚧</div>
          <h1 className="text-2xl font-bold mb-3">참여를 진행할 수 없어요</h1>
          <p className="text-slate-300 mb-6">
            {entryError ?? "오늘 이미 도전하셨다면 내일 다시 만나볼까요?"}
          </p>
          <button
            onClick={() => router.replace("/apps/nonsense-escape")}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-5 py-3 font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:scale-105"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-xl text-slate-200">퀴즈 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"
          style={{
            transform: parallaxEnabled ? `translate(${mousePos.x}px, ${mousePos.y}px)` : "none",
            transition: "transform 0.2s ease-out"
          }}
        />
      </div>

      {/* Content */}
      <main className="relative px-4 py-10 sm:px-6 md:px-10" style={{ perspective: "2000px" }}>
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Quiz Card */}
          <div
            className="rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-8 shadow-2xl"
            style={{
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
              transform: parallaxEnabled ? `rotateY(${mousePos.x * 0.3}deg) rotateX(${-mousePos.y * 0.3}deg) translateZ(50px)` : "none",
              transition: "transform 0.2s ease-out",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <ProgressTracker current={streak} target={streakTarget} />
              <Timer seconds={timerSeconds} />
            </div>

            {/* Question */}
            <div
              className="relative rounded-2xl backdrop-blur-lg bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-8 mb-8"
              style={{
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                transform: "translateZ(30px)"
              }}
            >
              <div className="absolute top-4 right-4 text-6xl opacity-10">🧪</div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-300 sm:text-sm">미션 #{streak + 1}</p>
              <h2
                className="mb-4 text-2xl font-bold text-white sm:text-3xl"
                style={{
                  textShadow: "0 2px 10px rgba(72,193,181,0.3)"
                }}
              >
                {currentQuestion.prompt}
              </h2>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg">{currentQuestion.context}</p>
            </div>

            {/* Answers */}
            <div className="mb-6 grid gap-4">
              {currentOptions.map((option, index) => (
                <button
                  key={option}
                  onClick={() => selectAnswer(option)}
                  className="group relative overflow-hidden rounded-2xl border-2 border-slate-700/50 bg-slate-800/50 px-6 py-4 text-left text-base text-slate-100 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800/70 sm:px-8 sm:py-5 sm:text-lg"
                  style={{
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
                    transform: parallaxEnabled ? `translateZ(${10 + index * 5}px)` : "none",
                    transformStyle: "preserve-3d"
                  }}
                  onMouseEnter={
                    parallaxEnabled
                      ? (e) => {
                          e.currentTarget.style.transform = `translateZ(${20 + index * 5}px) scale(1.02)`;
                        }
                      : undefined
                  }
                  onMouseLeave={
                    parallaxEnabled
                      ? (e) => {
                          e.currentTarget.style.transform = `translateZ(${10 + index * 5}px) scale(1)`;
                        }
                      : undefined
                  }
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl" />
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-300 transition group-hover:bg-cyan-500/40">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                </button>
              ))}
            </div>

            <HintBubble />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ComicNarratorFeed entries={narratorLog} />

            <div
              className="rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-6"
              style={{
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
                transform: parallaxEnabled ? "translateZ(20px)" : "none"
              }}
            >
              <p className="text-xs uppercase tracking-widest text-amber-300 mb-3">실험실 규칙</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>한 문제라도 틀리면 처음부터 다시!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>힌트는 30초 쿨다운</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>10문제 연속 정답으로 룰렛 진출!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>한 IP당 하루 한 번만 참여할 수 있어요.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(72,193,181,0.3); }
          50% { box-shadow: 0 0 40px rgba(72,193,181,0.6); }
        }
      `}</style>
    </div>
  );
}
