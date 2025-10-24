"use client";

type ComicNarratorFeedProps = {
  entries: string[];
};

export default function ComicNarratorFeed({ entries }: ComicNarratorFeedProps) {
  return (
    <div 
      className="rounded-3xl border border-slate-700/50 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
      style={{
        boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        transform: "translateZ(30px)",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="text-4xl"
          style={{
            animation: "pulse-glow 2s ease-in-out infinite"
          }}
        >
          🤖
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
            실험실 AI 방송
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="custom-scrollbar max-h-64 space-y-3 overflow-y-auto sm:max-h-[400px]">
        {entries.length === 0 ? (
          <div 
            className="rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-3 backdrop-blur-lg"
            style={{
              boxShadow: "0 10px 20px -5px rgba(0,0,0,0.3)",
              transform: "translateZ(10px)"
            }}
          >
            <p className="text-slate-300 leading-relaxed">
              "오늘도 넌센스 실험, 진행 중..."
            </p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={`${entry}-${index}`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-3 transition-all duration-300 hover:border-amber-500/50 hover:bg-slate-800/80 backdrop-blur-lg"
              style={{
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.3)",
                transform: `translateZ(${10 + index * 2}px)`,
                animation: `slide-in 0.4s ease-out ${index * 0.1}s both`
              }}
            >
              <p className="text-slate-200 leading-relaxed text-sm">
                {entry}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Floating Particles */}
      <div className="absolute -z-10 inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-400/30"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              animation: `float-particle ${3 + i}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px) translateZ(0);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateZ(10px);
          }
        }

        @keyframes float-particle {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(10px, -20px); 
            opacity: 0.6;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(255,179,71,0.3));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(255,179,71,0.6));
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(72, 193, 181, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(72, 193, 181, 0.7);
        }
      `}</style>
    </div>
  );
}
