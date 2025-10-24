"use client";

type TimerProps = {
  seconds: number;
};

export default function Timer({ seconds }: TimerProps) {
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  const isLowTime = seconds <= 30;
  const isCritical = seconds <= 10;

  return (
    <div 
      className={`relative rounded-2xl border-2 px-5 py-4 shadow-xl transition-all duration-300 backdrop-blur-lg sm:px-6 ${
        isCritical 
          ? "bg-red-500/20 border-red-500/50" 
          : isLowTime 
          ? "bg-amber-500/20 border-amber-500/50" 
          : "bg-slate-800/60 border-slate-700/50"
      }`}
      style={{
        boxShadow: isCritical
          ? "0 15px 35px -10px rgba(239,68,68,0.5), 0 0 30px rgba(239,68,68,0.3)"
          : isLowTime
          ? "0 15px 35px -10px rgba(255,179,71,0.5)"
          : "0 15px 35px -10px rgba(0,0,0,0.5)",
        transform: "translateZ(20px)",
        animation: isCritical ? "shake 0.5s infinite" : "none"
      }}
    >
      {/* Icon */}
      <div className="absolute -top-3 -left-3 text-2xl sm:text-3xl">
        {isCritical ? "⚠️" : isLowTime ? "⏰" : "⏱️"}
      </div>

      {/* Time Display */}
      <div className="flex items-center gap-3">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:text-xs">
          남은 시간
        </div>
        <div 
          className={`font-mono font-bold text-2xl transition-colors duration-300 sm:text-3xl ${
            isCritical 
              ? "text-red-400" 
              : isLowTime 
              ? "text-amber-400" 
              : "text-cyan-300"
          }`}
          style={{
            textShadow: isCritical 
              ? "0 0 20px rgba(239,68,68,0.8)" 
              : isLowTime
              ? "0 0 20px rgba(255,179,71,0.6)"
              : "0 0 20px rgba(72,193,181,0.4)"
          }}
        >
          {mm}:{ss}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="absolute -bottom-2 -right-2 sm:-bottom-2 sm:-right-2">
        <svg width="56" height="56" className="transform -rotate-90 sm:h-[60px] sm:w-[60px]">
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="rgba(51,65,85,0.5)"
            strokeWidth="4"
          />
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke={isCritical ? "#ef4444" : isLowTime ? "#FFB347" : "#48C1B5"}
            strokeWidth="4"
            strokeDasharray={`${(seconds / 120) * 138} 138`}
            className="transition-all duration-1000"
            style={{
              filter: `drop-shadow(0 0 6px ${
                isCritical ? "rgba(239,68,68,0.8)" : isLowTime ? "rgba(255,179,71,0.6)" : "rgba(72,193,181,0.4)"
              })`
            }}
          />
        </svg>
      </div>

      {/* Warning Message */}
      {isLowTime && (
        <div 
          className="mt-3 text-center text-xs font-semibold sm:mt-4"
          style={{
            animation: "pulse-text 1s ease-in-out infinite"
          }}
        >
          <span className={isCritical ? "text-red-400" : "text-amber-400"}>
            {isCritical ? "⚠️ 시간이 얼마 남지 않았어요!" : "서두르세요!"}
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateZ(20px) translateX(0); }
          25% { transform: translateZ(20px) translateX(-3px); }
          75% { transform: translateZ(20px) translateX(3px); }
        }

        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
