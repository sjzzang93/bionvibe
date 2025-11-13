"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParallax } from "../lib/use-parallax";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });
import AdOverlay from '@/app/components/AdOverlay';

export default function ResultPage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const { mousePos, enabled: parallaxEnabled } = useParallax({ maxOffset: 15 });

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const confettiPieces = viewport.width > 768 ? 500 : 200;
  const confettiWidth =
    viewport.width || (typeof window !== "undefined" ? window.innerWidth : 300);
  const confettiHeight =
    viewport.height || (typeof window !== "undefined" ? window.innerHeight : 200);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-white sm:p-6">
      
      <AdOverlay />{showConfetti && (
        <Confetti
          width={confettiWidth}
          height={confettiHeight}
          recycle={false}
          numberOfPieces={confettiPieces}
        />
      )}

      {/* 3D Background */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-amber-500/10 to-purple-500/10"
          style={{
            transform: parallaxEnabled
              ? `translate(${mousePos.x}px, ${mousePos.y}px)`
              : "none",
            transition: "transform 0.3s ease-out"
          }}
        />
      </div>

      <main
        className="relative mx-auto w-full max-w-4xl px-2 text-center sm:px-4"
        style={{ perspective: "1500px" }}
      >
        {/* Success Badge with 3D */}
        <div
          className="mb-8"
          style={{
            transform: parallaxEnabled
              ? `rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg) translateZ(100px)`
              : "none",
            transition: "transform 0.3s ease-out",
            transformStyle: "preserve-3d",
            animation: "float 3s ease-in-out infinite"
          }}
        >
          <div className="relative inline-block">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-amber-300 blur-3xl opacity-60"
              style={{ transform: "translateZ(-50px)" }}
            />
            <div
              className="relative rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-400 to-amber-300 p-1"
              style={{
                boxShadow: "0 30px 60px -15px rgba(72,193,181,0.5)"
              }}
            >
              <div className="rounded-3xl bg-slate-900 px-10 py-12 sm:px-12 sm:py-16">
                <div className="mb-4 text-6xl sm:text-7xl">🏆</div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-300 sm:text-sm">
                  Special Badge
                </p>
                <p
                  className="text-3xl font-bold sm:text-4xl"
                  style={{
                    background: "linear-gradient(135deg, #48C1B5 0%, #FFB347 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Nonsense Master
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div
          className="mb-12"
          style={{
            transform: parallaxEnabled ? "translateZ(50px)" : "none",
            transformStyle: "preserve-3d"
          }}
        >
          <h1
            className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl"
            style={{
              textShadow: "0 10px 30px rgba(72,193,181,0.5)"
            }}
          >
            넌센스 마스터 달성!
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            당신의 웃음 참기 스킬이 실험실을 탈출시켰어요.
            <br className="hidden sm:block" />
            미션 로그에 <span className="font-bold text-cyan-300">영구 기록</span>되었습니다. 🎉
          </p>
        </div>

        {/* Stats Cards with 3D */}
        <div className="mx-auto mb-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "정답률", value: "100%", icon: "✅" },
            { label: "연속 성공", value: "10문제", icon: "🔥" },
            { label: "난이도", value: "마스터", icon: "⭐" }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-xl"
              style={{
                boxShadow: "0 15px 35px -10px rgba(0,0,0,0.5)",
                transform: parallaxEnabled ? `translateZ(${30 + index * 10}px)` : "none",
                animation: `float ${2.5 + index * 0.3}s ease-in-out infinite`
              }}
            >
              <div className="mb-2 text-3xl">{stat.icon}</div>
              <p className="text-2xl font-bold text-cyan-300">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons with 3D */}
        <div className="flex flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/apps/nonsense-escape/daily"
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-8 py-4 text-center font-bold text-slate-900 shadow-lg transition-transform duration-300 hover:scale-[1.02] sm:w-auto"
            style={{
              boxShadow: "0 20px 40px -10px rgba(34,211,238,0.5)",
              transform: parallaxEnabled ? "translateZ(40px)" : "none"
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              하루 한 번 챌린지 예약
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
            <span className="absolute inset-0 scale-0 bg-gradient-to-r from-cyan-300 to-cyan-400 transition-transform duration-300 group-hover:scale-100" />
          </Link>

          <Link
            href="/apps/nonsense-escape/quiz"
            className="w-full rounded-2xl border-2 border-slate-600 bg-slate-800/30 px-8 py-4 text-center font-semibold transition-all duration-300 hover:border-amber-400 hover:bg-slate-800/50 sm:w-auto"
            style={{
              boxShadow: "0 15px 30px -10px rgba(0,0,0,0.5)",
              transform: parallaxEnabled ? "translateZ(30px)" : "none"
            }}
          >
            다시 도전하기
          </Link>

          <Link
            href="/apps/nonsense-escape"
            className="w-full rounded-2xl border-2 border-slate-700 bg-slate-900/30 px-8 py-4 text-center font-semibold transition-all duration-300 hover:border-slate-500 sm:w-auto"
            style={{
              boxShadow: "0 10px 20px -10px rgba(0,0,0,0.5)",
              transform: parallaxEnabled ? "translateZ(20px)" : "none"
            }}
          >
            홈으로
          </Link>
        </div>

        {/* Share Section */}
        <div
          className="mt-16 rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 backdrop-blur-xl"
          style={{
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
            transform: parallaxEnabled ? "translateZ(20px)" : "none"
          }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-300 sm:text-sm">
            공유하기
          </p>
          <p className="mb-6 text-base text-slate-300 sm:text-lg">
            "나는 지금 Bionvive 실험실을 넌센스로 탈출했다!"
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["카카오톡", "트위터", "페이스북"].map((platform) => (
              <button
                key={platform}
                className="rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:border-purple-400 hover:bg-slate-800/70"
                style={{
                  boxShadow: "0 10px 20px -5px rgba(0,0,0,0.3)"
                }}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateZ(0); }
          50% { transform: translateY(-15px) translateZ(20px); }
        }
      `}</style>
    </div>
  );
}
