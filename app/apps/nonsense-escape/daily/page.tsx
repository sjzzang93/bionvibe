"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParallax } from "../lib/use-parallax";

export default function DailyPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });
  const { mousePos, enabled: parallaxEnabled } = useParallax({ maxOffset: 15 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10"
          style={{
            transform: parallaxEnabled ? `translate(${mousePos.x}px, ${mousePos.y}px)` : "none",
            transition: "transform 0.3s ease-out"
          }}
        />
      </div>

      <main className="relative px-4 py-14 sm:px-6 md:px-12" style={{ perspective: "1500px" }}>
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <p 
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-300 sm:text-sm"
              style={{ textShadow: "0 0 20px rgba(255,179,71,0.5)" }}
            >
              Daily Nonsense Challenge
            </p>
            <h1 
              className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #FFB347 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 10px 30px rgba(255,179,71,0.3)"
              }}
            >
              오늘의 실험제안서
            </h1>
            <p className="text-lg text-slate-300 sm:text-xl">
              하루 한 번만 도전 가능한 특별 넌센스! 🎯
            </p>
          </div>

          {/* Timer Card with 3D */}
          <div 
            className="mb-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-8"
            style={{
              boxShadow: "0 30px 60px -15px rgba(255,179,71,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
              transform: parallaxEnabled ? `rotateY(${mousePos.x * 0.2}deg) rotateX(${-mousePos.y * 0.2}deg) translateZ(50px)` : "none",
              transition: "transform 0.3s ease-out",
              transformStyle: "preserve-3d"
            }}
          >
            <p className="mb-3 text-center text-xs text-amber-200 sm:text-sm">다음 챌린지까지</p>
            <div className="grid grid-cols-3 gap-3 sm:flex sm:justify-center sm:gap-4">
              {[
                { value: timeLeft.hours, label: "시간" },
                { value: timeLeft.minutes, label: "분" },
                { value: timeLeft.seconds, label: "초" }
              ].map(({ value, label }) => (
                <div 
                  key={label}
                  className="rounded-2xl border border-slate-700/50 bg-slate-900/60 px-4 py-4 text-center backdrop-blur-lg sm:px-6"
                  style={{
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
                    transform: "translateZ(30px)"
                  }}
                >
                  <div className="font-mono text-3xl font-bold text-amber-300 sm:text-4xl">{String(value).padStart(2, "0")}</div>
                  <div className="mt-1 text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Card with 3D */}
          <div 
            className="rounded-3xl backdrop-blur-xl bg-slate-900/70 border border-slate-700/50 p-8 mb-8"
            style={{
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
              transform: parallaxEnabled ? `rotateY(${-mousePos.x * 0.3}deg) rotateX(${mousePos.y * 0.3}deg) translateZ(40px)` : "none",
              transition: "transform 0.3s ease-out",
              transformStyle: "preserve-3d"
            }}
          >
            <div className="absolute top-6 right-6 text-7xl opacity-10">🧬</div>
            <p className="text-sm text-amber-300 mb-4 uppercase tracking-wider font-semibold">오늘의 넌센스</p>
            <h2 className="mb-6 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
              "과학자가 밥을 먹을 때 쓰는 젓가락은?"
            </h2>
            <p className="mb-8 text-base text-slate-300 sm:text-lg">
              실험실 노트의 52페이지를 참고하세요!<br className="hidden sm:block" />
              힌트: 실험 도구와 관련이 있습니다... 🔬
            </p>

            {/* Answer Input */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="정답을 입력하세요..."
                className="w-full rounded-2xl border-2 border-slate-700 bg-slate-800/50 px-5 py-4 text-base text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-amber-400 sm:px-6 sm:text-lg"
                style={{
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.2)"
                }}
              />
              <button
                className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 font-bold text-slate-900 transition-all duration-300 hover:from-amber-300 hover:to-orange-400"
                style={{
                  boxShadow: "0 20px 40px -10px rgba(255,179,71,0.5)"
                }}
              >
                정답 제출하기
              </button>
            </div>
          </div>

          {/* Stats Grid with 3D */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "🔥", label: "연속 도전", value: "3일", color: "from-red-500/20 to-orange-500/20" },
              { icon: "⭐", label: "정답률", value: "80%", color: "from-yellow-500/20 to-amber-500/20" },
              { icon: "🏆", label: "완료 횟수", value: "12회", color: "from-purple-500/20 to-pink-500/20" }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`rounded-3xl backdrop-blur-xl bg-gradient-to-br ${stat.color} border border-slate-700/50 p-6`}
                style={{
                  boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
                  transform: `translateZ(${20 + index * 10}px)`,
                  animation: `float ${3 + index * 0.5}s ease-in-out infinite`
                }}
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link 
              href="/apps/nonsense-escape"
              className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl border-2 border-slate-700 bg-slate-800/30 px-8 py-4 font-semibold transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800/50 sm:w-auto"
              style={{
                boxShadow: "0 15px 30px -10px rgba(0,0,0,0.5)"
              }}
            >
              <span>←</span>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateZ(0); }
          50% { transform: translateY(-10px) translateZ(10px); }
        }
      `}</style>
    </div>
  );
}
