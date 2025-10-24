"use client";

type ProgressTrackerProps = {
  current: number;
  target: number;
};

export default function ProgressTracker({ current, target }: ProgressTrackerProps) {
  const progress = (current / target) * 100;

  return (
    <div 
      className="flex w-full flex-col gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/60 px-5 py-4 shadow-xl backdrop-blur-lg sm:flex-row sm:items-center sm:gap-6 sm:px-6"
      style={{
        boxShadow: "0 15px 35px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        transform: "translateZ(20px)"
      }}
    >
      <div className="flex items-center gap-2">
        <span 
          className="text-3xl"
          style={{
            animation: "bounce-icon 1s ease-in-out infinite",
            filter: "drop-shadow(0 5px 10px rgba(72,193,181,0.4))"
          }}
        >
          🎯
        </span>
        <span className="text-cyan-300 font-semibold text-sm whitespace-nowrap">연속 정답</span>
      </div>
      
      <div className="flex-1 relative">
        {/* Background Track */}
        <div className="h-3 rounded-full bg-slate-700/50 overflow-hidden relative">
          {/* Progress Bar with Gradient */}
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 transition-all duration-500 ease-out relative"
            style={{ 
              width: `${progress}%`,
              boxShadow: "0 0 20px rgba(72,193,181,0.6)"
            }}
          >
            {/* Shimmer Effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: "shimmer 2s infinite"
              }}
            />
          </div>
        </div>

        {/* Progress Markers */}
        <div className="absolute -top-6 left-0 right-0 hidden justify-between sm:flex">
          {[...Array(target)].map((_, i) => (
            <div
              key={i}
              className={`flex flex-col items-center transition-all duration-300 ${
                i < current ? "scale-110" : "scale-90 opacity-50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mb-1 ${
                  i < current
                    ? "bg-gradient-to-r from-cyan-400 to-purple-400"
                    : "bg-slate-600"
                }`}
                style={{
                  boxShadow: i < current ? "0 0 10px rgba(72,193,181,0.6)" : "none"
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div 
        className="font-mono font-bold text-xl flex items-baseline gap-1"
        style={{
          background: "linear-gradient(135deg, #48C1B5 0%, #FFB347 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        <span className="text-3xl">{current}</span>
        <span className="text-slate-500 text-lg">/</span>
        <span className="text-xl">{target}</span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes bounce-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
