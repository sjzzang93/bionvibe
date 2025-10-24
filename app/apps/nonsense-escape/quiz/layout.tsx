"use client";

import { useEffect } from "react";
import { useQuizStore } from "../lib/quiz-store";

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  const { active, tickTimer, tickHintCooldown } = useQuizStore();

  // Timer effect
  useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [active, tickTimer]);

  // Hint cooldown effect
  useEffect(() => {
    const interval = setInterval(() => {
      tickHintCooldown();
    }, 1000);

    return () => clearInterval(interval);
  }, [tickHintCooldown]);

  return <>{children}</>;
}

