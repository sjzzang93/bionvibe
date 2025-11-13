"use client";

import Link from "next/link";
import { useParallax } from "./lib/use-parallax";

import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';
export default function NonsenseEscapeLanding() {
  const { mousePos, enabled: parallaxEnabled } = useParallax({ maxOffset: 20 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* 3D Background Layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-amber-500/10"
          style={{
            transform: parallaxEnabled ? `translate(${mousePos.x}px, ${mousePos.y}px)` : "none",
            transition: "transform 0.3s ease-out"
          }}
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(72,193,181,0.15),transparent_50%)]"
          style={{
            transform: parallaxEnabled ? `translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)` : "none",
            transition: "transform 0.3s ease-out"
          }}
        />
      </div>

      {/* Navbar with 3D effect */}
      <header 
        className="relative backdrop-blur-xl bg-slate-900/40 border-b border-slate-700/50 shadow-2xl"
        style={{
          transform: "translateZ(100px)",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)"
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link 
            href="/apps/nonsense-escape" 
            className="text-lg font-bold tracking-wide transition-transform duration-300 hover:scale-110"
            style={{
              textShadow: "0 0 20px rgba(72,193,181,0.5)"
            }}
          >
            🧪 Bionvive Quiz Lab
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            {[
              { label: "넌센스 챌린지", href: "/apps/nonsense-escape/quiz" },
              { label: "Daily", href: "/apps/nonsense-escape/daily" }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 group"
              >
                <span className="relative z-10 group-hover:text-cyan-300 transition">{link.label}</span>
                <span className="absolute inset-0 bg-cyan-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
            ))}
          </nav>
          <Link 
            href="/apps/nonsense-escape/quiz" 
            className="hidden rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-5 py-2 font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 md:block"
            style={{
              boxShadow: "0 10px 30px -5px rgba(34,211,238,0.4)"
            }}
          >
            지금 도전
          </Link>
        </div>
        <nav className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-2 px-4 pb-4 text-sm font-medium md:hidden sm:grid-cols-2 sm:px-6">
          {[
            { label: "넌센스 챌린지", href: "/apps/nonsense-escape/quiz" },
            { label: "Daily 도전", href: "/apps/nonsense-escape/daily" }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-slate-700/70 bg-slate-900/50 px-4 py-2 text-center transition-colors duration-200 hover:border-cyan-400 hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apps/nonsense-escape/quiz"
            className="rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 px-4 py-2 text-center font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:scale-[1.02]"
            style={{
              boxShadow: "0 10px 30px -8px rgba(34,211,238,0.35)"
            }}
          >
            모바일 즉시 도전
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative px-4 py-14 sm:px-6 md:px-12 md:py-24 lg:px-16" style={{ perspective: "1500px" }}>
        {/* Hero Section */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 lg:gap-16 md:grid-cols-2">
          <div 
            className="space-y-6"
            style={{
              transform: parallaxEnabled ? `rotateY(${mousePos.x * 0.5}deg) translateZ(50px)` : "none",
              transition: "transform 0.3s ease-out"
            }}
          >
            <p className="animate-pulse text-xs font-semibold uppercase tracking-wide text-cyan-300 sm:text-sm">
              넌센스 실험 대상 모집
            </p>
            <h1 
              className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #48C1B5 50%, #FFB347 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 10px 40px rgba(72,193,181,0.3)"
              }}
              >
              웃긴데 탈출까지<br />해야 한다고?
            </h1>
            <p className="text-lg leading-relaxed text-slate-200 sm:text-xl">
              넌센스 퀴즈 <span className="font-bold text-cyan-300">10개</span>를 연속으로 맞히면<br className="hidden sm:block" />
              Bionvive 룰렛 룸이 열립니다. 🎡
            </p>
            <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:flex-wrap">
              <Link 
                href="/apps/nonsense-escape/quiz"
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-8 py-4 text-center font-bold text-slate-900 shadow-lg transition-transform duration-300 hover:scale-[1.02] sm:w-auto"
                style={{
                  boxShadow: "0 20px 50px -10px rgba(34,211,238,0.5), 0 10px 20px -5px rgba(0,0,0,0.3)",
                  transform: "translateZ(20px)"
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  지금 바로 도전 
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-cyan-400 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
              <a 
                href="#how-it-works" 
                className="w-full rounded-2xl border-2 border-slate-600 bg-slate-800/30 px-8 py-4 text-center font-semibold transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800/50 sm:w-auto"
                style={{
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
                  transform: "translateZ(10px)"
                }}
              >
                어떻게 진행되나요?
              </a>
            </div>
            <div className="rounded-2xl border border-slate-600/60 bg-slate-900/40 p-4 text-sm text-slate-200 shadow-md backdrop-blur">
              <p className="font-semibold text-cyan-200">🎯 플레이 가이드</p>
              <ul className="mt-2 space-y-1 text-[15px] text-slate-300">
                <li>• 한 IP당 하루 <span className="font-semibold text-cyan-300">1회</span>만 도전할 수 있어요.</li>
                <li>• 탈출 성공 시 <span className="font-semibold text-amber-300">10% 확률</span>이라고 안내되는 룰렛이 열립니다.</li>
                <li>• 실제 당첨 시에는 화면을 캡처하고 이벤트 신청 페이지로 이동해 주세요.</li>
              </ul>
            </div>
          </div>

          {/* 3D Card with Glassmorphism */}
          <div 
            className="relative"
            style={{
              transform: parallaxEnabled ? `rotateY(${-mousePos.x * 0.3}deg) rotateX(${mousePos.y * 0.3}deg) translateZ(30px)` : "none",
              transition: "transform 0.3s ease-out",
              perspective: "1000px"
            }}
          >
            <div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/30 to-amber-500/30 blur-3xl"
              style={{
                transform: "translateZ(-50px)"
              }}
            />
            <div 
              className="relative rounded-3xl backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 border border-slate-700/50 shadow-2xl"
              style={{
                boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                transform: "translateZ(0)"
              }}
            >
              <div className="absolute top-4 right-4 text-6xl opacity-20">🧬</div>
              <p className="text-sm text-cyan-300 font-semibold tracking-wider">실험실 로그 47-A</p>
              <p className="mt-6 text-2xl font-bold leading-relaxed">
                "연필이 춤을 추면?"<br />
                <span className="text-slate-400 text-lg">실험생의 표정: 🤨</span>
              </p>
              <p className="mt-6 text-slate-300 leading-relaxed">
                과학과 넌센스가 만난 순간.<br />
                실험실 AI도 이해 못하는 농담이 쏟아집니다.
              </p>
              <div className="mt-6 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500" />
            </div>
          </div>
        </section>

        {/* How It Works with 3D Cards */}
        <section id="how-it-works" className="mt-32">
          <h2 
            className="text-4xl font-bold text-center mb-12"
            style={{
              background: "linear-gradient(135deg, #fff 0%, #48C1B5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            탈출 절차
          </h2>
          <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
            {[
              { step: "01", icon: "📋", text: "실험실에서 말도 안 되는 상황 브리핑 받기", color: "from-cyan-500/20 to-cyan-600/20" },
              { step: "02", icon: "🎯", text: "넌센스 퀴즈 10개 연속 정답 도전", color: "from-purple-500/20 to-purple-600/20" },
              { step: "03", icon: "🏆", text: "탈출 성공하면 배지 + 랭킹 등록", color: "from-amber-500/20 to-amber-600/20" }
            ].map(({ step, icon, text, color }, index) => (
              <div
                key={step}
                className="group relative rounded-3xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-8 hover:border-cyan-500/50 transition-all duration-500"
                style={{
                  boxShadow: "0 20px 50px -15px rgba(0,0,0,0.5)",
                  transform: `translateZ(${index * 10}px)`,
                  animation: `float ${3 + index * 0.5}s ease-in-out infinite`
                }}
              >
                <div 
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{ transform: "translateZ(-10px)" }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-6xl">{icon}</span>
                    <span className="text-cyan-300 font-bold text-2xl">{step}</span>
                  </div>
                  <p className="text-slate-100 text-lg leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Preview Section with 3D Tilt */}
        <section className="mt-24 sm:mt-28 md:mt-32">
          <h2 
            className="text-center text-3xl font-bold sm:text-4xl md:mb-12"
            style={{
              background: "linear-gradient(135deg, #fff 0%, #FFB347 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            맛보기 넌센스
          </h2>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { q: "물이 가장 싫어하는 색은?", a: "보라색? 보라니까...?", emoji: "💧" },
              { q: "교수님이 제일 좋아하는 동물은?", a: "쥐. 하지만 이유는 함정!", emoji: "🐭" },
              { q: "연필이 춤을 추면?", a: "납댄스!", emoji: "✏️" }
            ].map(({ q, a, emoji }) => (
              <div
                key={q}
                className="group cursor-pointer rounded-3xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50"
                style={{
                  boxShadow: "0 15px 40px -10px rgba(0,0,0,0.5)",
                  transformStyle: "preserve-3d"
                }}
                onMouseEnter={
                  parallaxEnabled
                    ? (e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        e.currentTarget.style.transform = `rotateY(${x / 20}deg) rotateX(${-y / 20}deg) translateZ(20px)`;
                      }
                    : undefined
                }
                onMouseLeave={
                  parallaxEnabled
                    ? (e) => {
                        e.currentTarget.style.transform = "rotateY(0) rotateX(0) translateZ(0)";
                      }
                    : undefined
                }
              >
                <div className="text-5xl mb-4">{emoji}</div>
                <p className="mb-3 text-lg font-semibold text-cyan-100 sm:text-xl">{q}</p>
                <p className="text-sm text-slate-300 sm:text-base">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateZ(0); }
          50% { transform: translateY(-10px) translateZ(10px); }
        }
      `}</style>
          {/* 관련 앱 추천 */}
      <RelatedApps currentAppSlug="nonsense-escape" className="mt-8 mb-8" />

</div>
  );
}
