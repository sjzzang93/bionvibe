"use client";
import RelatedApps from '@/app/components/RelatedApps';
import { useMemo, useState, useEffect } from "react";
import Controls from "@/components/aura/Controls";
import AuraCanvas from "@/components/aura/AuraCanvas";
import HistoryChart from "@/components/aura/HistoryChart";
import { computeAura, AuraInputs } from "@/lib/aura/engine";
import { toCssHsl } from "@/lib/aura/palette";
import { getJSON, setJSON, isBrowser } from "@/lib/client/storage";
import { buildComments } from "@/lib/aura/comments";
import { Button } from "@/components/ui/button";
import { Sparkles, History, RotateCcw } from "lucide-react";
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';

type LogItem = {
  ts: number; // epoch ms
  inputs: AuraInputs;
  score: number;
  color: string;
};

const KEY = "bion:aura:logs";

export default function Page(){
  const [result, setResult] = useState<null | ReturnType<typeof computeAura>>(null);
  const [inputs, setInputs] = useState<null | AuraInputs>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isHoveringResult, setIsHoveringResult] = useState(false);
  const [isHoveringComment, setIsHoveringComment] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=>{
    const items = getJSON<LogItem[]>(KEY, []);
    setLogs(items);

    // ResizeObserver 에러 무시 (harmless loop error)
    const errorHandler = (e: ErrorEvent) => {
      if (e.message && e.message.includes('ResizeObserver loop')) {
        e.stopImmediatePropagation();
        return;
      }
    };
    window.addEventListener('error', errorHandler);

    // 모바일 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('error', errorHandler);
    };
  },[]);

  const onCalc = ({ inputs, output }: { inputs: AuraInputs; output: ReturnType<typeof computeAura> }) => {
    console.log('🎨 오라 색상 계산:', {
      inputs,
      primaryColor: output.color,
      primaryCSS: toCssHsl(output.color),
      secondaryColor: output.secondary,
      secondaryCSS: toCssHsl(output.secondary),
      score: output.score
    });

    setInputs(inputs);
    setResult(output);
    const item: LogItem = {
      ts: Date.now(),
      inputs,
      score: output.score,
      color: toCssHsl(output.color)
    };
    const next = [item, ...logs].slice(0, 60); // 최근 60개
    setLogs(next);
    setJSON(KEY, next);
  };

  const chartData = useMemo(()=> logs.slice().reverse().map(it=>({
    t: new Date(it.ts).toLocaleDateString(),
    score: it.score
  })), [logs]);

  const summary = useMemo(()=>{
    if(!result || !inputs) return null;
    return buildComments(result.score, inputs.mood);
  },[result, inputs]);

  const reset = () => {
    if (!confirm('히스토리를 초기화하시겠습니까?')) return;
    setLogs([]);
    setJSON(KEY, []);
  };

  // 초기 디폴트(첫 방문 즉시 프리뷰)
  useEffect(()=>{
    if (!isBrowser) return;
    if (!result) {
      const initInputs: AuraInputs = { mood: "행복", weather: "맑음", person: "나홀로", sleepHours: 7, energy: 70, stress: 30 };
      const out = computeAura(initInputs);
      setInputs(initInputs);
      setResult(out);
    }
  },[result]);

  return (
    <main className="min-h-[100dvh] w-full bg-gradient-to-b from-indigo-900 via-slate-900 to-black text-white relative overflow-hidden">
      <AdOverlay />
      {/* Subtle animated orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8 lg:py-12 space-y-4 sm:space-y-6 lg:space-y-8 relative">
        {/* Header */}
        <header className="text-center space-y-2 sm:space-y-3 lg:space-y-4 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
            <span className="text-xs sm:text-sm text-white/90">3D 오라 분석 시스템</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-2xl px-4">
            나의 기운색 테스트
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl mx-auto px-4">
            오늘의 감정과 상태를 입력하면 당신만의 오라 색상을 시각화해드립니다
          </p>
        </header>

        {/* Controls Card with Glassmorphism */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl
                      transform transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">오늘의 감정 입력</h2>
            </div>
            <Controls onResult={onCalc}/>
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Aura Result Card with 3D Effect */}
            <div
              className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl
                         transform transition-all duration-500 ease-out hover:shadow-cyan-500/20"
              style={{
                transformStyle: isMobile ? 'flat' : 'preserve-3d',
                transform: !isMobile && isHoveringResult
                  ? 'perspective(1000px) rotateY(5deg) rotateX(5deg) scale(1.05)'
                  : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
              }}
              onMouseEnter={() => !isMobile && setIsHoveringResult(true)}
              onMouseLeave={() => !isMobile && setIsHoveringResult(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">오늘의 색</h3>
                </div>

                <div className="relative">
                  <AuraCanvas primary={result.color} secondary={result.secondary}/>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-4">
                    <div className="text-white/60 text-xs sm:text-sm mb-2">메인 컬러</div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg ring-2 ring-white/30 shadow-lg flex-shrink-0"
                        style={{ backgroundColor: toCssHsl(result.color) }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-white font-semibold text-xs sm:text-sm truncate">{toCssHsl(result.color)}</div>
                        <div className="text-white/60 text-xs sm:text-sm">H:{Math.round(result.color.h)}° S:{Math.round(result.color.s*100)}% L:{Math.round(result.color.l*100)}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-4">
                    <div className="text-white/60 text-xs sm:text-sm mb-2">보조 컬러</div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg ring-2 ring-white/30 shadow-lg flex-shrink-0"
                        style={{ backgroundColor: toCssHsl(result.secondary) }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-white font-semibold text-xs sm:text-sm truncate">{toCssHsl(result.secondary)}</div>
                        <div className="text-white/60 text-xs sm:text-sm">H:{Math.round(result.secondary.h)}° S:{Math.round(result.secondary.s*100)}% L:{Math.round(result.secondary.l*100)}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-4">
                    <div className="text-white/60 text-xs sm:text-sm mb-2">기운 점수</div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{result.score} <span className="text-sm sm:text-base text-white/60">/ 100</span></div>
                  </div>
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-4">
                    <div className="text-white/60 text-xs sm:text-sm mb-2">태그</div>
                    <div className="text-xs sm:text-sm text-white/90 leading-relaxed">{result.tags.join(" · ")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Card with 3D Effect */}
            <div
              className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl
                         transform transition-all duration-500 ease-out hover:shadow-pink-500/20"
              style={{
                transformStyle: isMobile ? 'flat' : 'preserve-3d',
                transform: !isMobile && isHoveringComment
                  ? 'perspective(1000px) rotateY(-5deg) rotateX(5deg) scale(1.05)'
                  : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
              }}
              onMouseEnter={() => !isMobile && setIsHoveringComment(true)}
              onMouseLeave={() => !isMobile && setIsHoveringComment(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">성격 코멘트</h3>
                </div>
                {summary ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-5">
                      <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">{summary.oneLiner}</p>
                    </div>
                    <div className="grid gap-3">
                      <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                        <div className="text-white/60 text-xs sm:text-sm mb-1">키워드</div>
                        <div className="text-white text-sm sm:text-base">{summary.keywords.join(", ")}</div>
                      </div>
                      <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                        <div className="text-white/60 text-xs sm:text-sm mb-1">톤</div>
                        <div className="text-white text-sm sm:text-base">{summary.tone}</div>
                      </div>
                      <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                        <div className="text-white/60 text-xs sm:text-sm mb-1">조언</div>
                        <div className="text-white text-sm sm:text-base leading-relaxed">{summary.advice}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/60 text-center py-8">입력을 완료하면 코멘트가 표시됩니다.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Card */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl
                      transform transition-all duration-300 hover:scale-[1.005] sm:hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <History className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white">기운 히스토리</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                onClick={reset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                초기화
              </Button>
            </div>

            {logs.length > 0 ? (
              <div className="space-y-6">
                <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                  <HistoryChart data={chartData}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {logs.slice(0,6).map((it,idx)=>(
                    <div
                      key={idx}
                      className="rounded-2xl p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10
                               transform transition-all duration-300 hover:scale-105 hover:bg-white/10 active:scale-100"
                    >
                      <div className="text-xs sm:text-sm text-white/60 mb-2 truncate">{new Date(it.ts).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="inline-block w-5 h-5 sm:w-6 sm:h-6 rounded-full ring-2 ring-white/30 flex-shrink-0"
                          style={{background: it.color}}
                        />
                        <span className="font-mono text-xs sm:text-sm text-white/80 truncate">{it.color}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-white mb-2">
                        점수: <span className="font-bold text-base sm:text-lg">{it.score}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-white/70 flex flex-wrap gap-1">
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/10">{it.inputs.mood}</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/10">{it.inputs.weather}</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/10">{it.inputs.person}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/60">아직 기록이 없습니다. 오늘의 기운색을 먼저 생성해보세요.</p>
              </div>
            )}
          </div>
        </div>

        <footer className="pt-6 sm:pt-8 pb-8 sm:pb-12 text-center text-white/40 text-xs sm:text-sm">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-xs sm:text-sm">BION VIBE • 나의 기운색</span>
          </div>
          <p className="mt-2 px-4">광고 없음 · 프리미엄 디자인</p>
        </footer>
      </div>

        <RelatedApps currentAppSlug="aura-color" />
      </main>
  );
}
