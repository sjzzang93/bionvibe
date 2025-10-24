"use client";

import { useQuizStore } from "../lib/quiz-store";

export default function HintBubble() {
  const { hint, requestHint, hintCooldownRemaining, canRequestHint } = useQuizStore();
  const disabled = !canRequestHint;

  return (
    <div 
      className="relative rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-5 backdrop-blur-lg sm:p-6"
      style={{
        boxShadow: "0 20px 40px -10px rgba(72,193,181,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        transform: "translateZ(40px)",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Floating Icon */}
      <div 
        className="absolute -top-6 -right-6 text-5xl"
        style={{
          animation: "float-hint 2.5s ease-in-out infinite",
          filter: "drop-shadow(0 10px 20px rgba(72,193,181,0.4))"
        }}
      >
        💡
      </div>

      <p className="text-sm uppercase tracking-widest text-cyan-300 font-semibold mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        힌트 시스템
      </p>
      
      {hint ? (
        <p 
          className="text-lg text-white mb-4 leading-relaxed"
          style={{
            textShadow: "0 2px 10px rgba(72,193,181,0.3)"
          }}
        >
          {hint}
        </p>
      ) : (
        <p className="text-lg text-cyan-100 mb-4 leading-relaxed">
          실험실 AI가 힌트를 준비했습니다.
        </p>
      )}

      <button
        onClick={requestHint}
        disabled={disabled}
        className="group relative w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-900 font-semibold overflow-hidden disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300"
        style={{
          boxShadow: disabled 
            ? "0 5px 15px -5px rgba(0,0,0,0.3)" 
            : "0 10px 30px -5px rgba(34,211,238,0.5)"
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {disabled ? (
            <>
              ⏱️ 쿨다운 {hintCooldownRemaining}초
            </>
          ) : (
            <>
              💡 힌트 받기
              <span className="text-xs opacity-75">(30초 쿨다운)</span>
            </>
          )}
        </span>
        {!disabled && (
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-cyan-400 scale-0 group-hover:scale-100 transition-transform duration-300" />
        )}
      </button>

      <p className="mt-3 text-xs text-center text-slate-400">
        광고를 보고 추가 힌트를 받을 수 있어요!
      </p>

      <style jsx>{`
        @keyframes float-hint {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
