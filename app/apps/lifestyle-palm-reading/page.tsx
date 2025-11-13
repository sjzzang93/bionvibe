"use client";

import { useState, useRef, useEffect } from "react";
import { PALM_READING_DATA, getPalmPatternByMeasurement, PalmReadingAnalysis } from "@/lib/palm-reading-analysis-data";
import RelatedApps from "@/app/components/RelatedApps";
import AppFooter from "@/app/components/AppFooter";
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';

export default function PalmReading() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PalmReadingAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (result) {
      setTimeout(() => setShowResults(true), 100);
    } else {
      setShowResults(false);
    }
  }, [result]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImagePreview(event.target?.result as string);
        analyzeImage(img);
      };
      img.onerror = () => {
        alert('이미지를 불러올 수 없습니다. 다른 이미지를 선택해주세요.');
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert('파일을 읽을 수 없습니다. 다시 시도해주세요.');
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = (img: HTMLImageElement) => {
    setAnalyzing(true);

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // 손금선 측정 (단순화된 알고리즘)
      const lifeLineLength = measureLineLength(ctx, img.width, img.height, 0.2, 0.8);
      const headLineLength = measureLineLength(ctx, img.width, img.height, 0.3, 0.5);
      const heartLineLength = measureLineLength(ctx, img.width, img.height, 0.4, 0.3);

      const patternCode = getPalmPatternByMeasurement(lifeLineLength, headLineLength, heartLineLength);
      const palmReading = PALM_READING_DATA[patternCode];

      setResult(palmReading);
      setAnalyzing(false);
    }, 3000);
  };

  const measureLineLength = (ctx: CanvasRenderingContext2D, width: number, height: number, startRatio: number, endRatio: number): number => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let linePixels = 0;
    const startY = height * startRatio;
    const endY = height * endRatio;
    
    for (let y = startY; y < endY; y += 3) {
      for (let x = 0; x < width; x += 3) {
        const idx = (Math.floor(y) * width + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        
        if (brightness < 150) { // 어두운 선 감지
          linePixels++;
        }
      }
    }
    
    return linePixels;
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setAnalyzing(false);
    setShowResults(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #3e2723 0%, #5d4037 25%, #6d4c41 50%, #5d4037 75%, #3e2723 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <AdOverlay />
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-[800px] px-4 py-8 md:py-12">
        {/* 글래스모피즘 컨테이너 */}
        <section className="backdrop-blur-xl bg-amber-900/20 rounded-3xl shadow-2xl p-6 md:p-10 border border-amber-500/30" style={{
          boxShadow: '0 8px 32px 0 rgba(120, 53, 15, 0.37), inset 0 1px 0 0 rgba(255, 193, 7, 0.1)'
        }}>
          {/* 헤더 */}
          <header className="text-center mb-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 bg-clip-text text-transparent animate-gradient" style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.02em',
              backgroundSize: '200% auto',
              animation: 'gradient 3s ease infinite'
            }}>
              손금 AI 분석
            </h1>
            
            <p className="text-amber-100 text-base md:text-lg mb-2 font-medium tracking-wide">
              전통 수상학 × 정밀 AI 분석 · 27가지 패턴 분류
            </p>
            <p className="text-amber-200/80 text-sm">
              당신의 운명선을 읽어드립니다
            </p>
            
            {/* 인포 배지 */}
            <div className="mt-6 inline-flex items-center gap-3 backdrop-blur-md bg-amber-900/30 rounded sm:rounded-lg md:rounded-2xl px-6 py-4 border border-amber-500/30 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">온라인</span>
              </div>
              <div className="w-px h-4 bg-amber-500/30"></div>
              <span className="text-amber-100 text-sm">무료 · 무제한 · 즉시 분석</span>
            </div>
          </header>

          {/* 프라이버시 */}
          <div className="mb-8 backdrop-blur-md bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded sm:rounded-lg md:rounded-2xl p-4 border border-green-400/30 animate-slideUp">
            <p className="text-green-100 text-sm text-center flex items-center justify-center gap-2 font-medium">
              <span className="text-xl">🔒</span>
              <span>완전한 프라이버시 보장 · 이미지는 서버에 전송되지 않습니다</span>
            </p>
          </div>

          {/* 업로드 영역 */}
          {!imagePreview && !result && (
            <div className="mb-8 animate-fadeIn">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient" style={{
                  backgroundSize: '400% 400%',
                  animation: 'gradient 3s ease infinite'
                }}></div>
                
                <div className="relative backdrop-blur-md bg-amber-900/10 border-2 border-dashed border-amber-400/40 rounded-3xl p-8 md:p-12 text-center transition-all duration-300 hover:border-amber-400/60 hover:bg-amber-900/20">
                  <div className="text-7xl md:text-8xl mb-6 filter drop-shadow-lg animate-float">🖐️</div>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-0.5 sm:mb-1.5 md:mb-2">손바닥 사진을 업로드하세요</h3>
                  <p className="text-amber-200 text-sm sm:text-base md:text-lg mb-8 max-w-md mx-auto">
                    손바닥이 선명하게 보이는 사진일수록 더 정확한 분석 결과를 받을 수 있습니다
                  </p>
                  
                  <label className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 md:px-10 py-4 md:py-5 text-base md:text-lg rounded sm:rounded-lg md:rounded-2xl font-bold cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 group">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📷</span>
                    <span>사진 선택하기</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <p className="text-amber-300 text-xs mt-6 flex items-center justify-center gap-2">
                    <span>💡</span>
                    <span>밝은 곳에서 손바닥을 펼쳐 촬영하세요</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 분석 중 */}
          {analyzing && (
            <div className="text-center py-16 animate-fadeIn">
              <div className="relative inline-block mb-8">
                <div className="w-20 h-20 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
              </div>
              
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">AI 정밀 분석 중</h3>
              <p className="text-amber-200 text-base mb-2">7가지 손금선 분석</p>
              <p className="text-amber-300 text-sm">생명선 · 지능선 · 감정선 · 운명선 · 결혼선 · 재물선 · 건강선</p>
              
              {/* 프로그레스 바 */}
              <div className="max-w-xs mx-auto mt-6">
                <div className="h-2 bg-amber-900/30 rounded-full overflow-hidden backdrop-blur-sm border border-amber-500/20">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-progress"></div>
                </div>
              </div>
            </div>
          )}

          {/* 결과 표시 */}
          {result && imagePreview && (
            <div className={`space-y-6 transition-all duration-1000 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* 사진 미리보기 */}
              <div className="text-center animate-fadeIn">
                <div className="relative inline-block">
                  <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl blur-lg opacity-30"></div>
                  <img 
                    src={imagePreview} 
                    alt="분석된 손바닥" 
                    className="relative max-w-full h-auto max-h-80 mx-auto rounded sm:rounded-lg md:rounded-2xl border-2 border-amber-400/30 shadow-2xl" 
                  />
                </div>
              </div>

              {/* 결과 헤더 */}
              <div className="backdrop-blur-md bg-gradient-to-r from-amber-600/40 to-yellow-600/40 rounded-3xl p-6 md:p-8 text-center border border-amber-400/30 shadow-xl animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="text-6xl mb-4 filter drop-shadow-lg">{result.emoji}</div>
                <h2 className="text-white text-base sm:text-2xl md:text-4xl font-bold mb-2">{result.title}</h2>
                <p className="text-amber-50 text-base max-w-2xl mx-auto">{result.summary}</p>
              </div>

              {/* 점수 카드 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                {[
                  { label: '종합운', score: result.scores.overall, gradient: 'from-amber-600/30 to-amber-700/30', border: 'border-amber-400/40' },
                  { label: '건강운', score: result.scores.health, gradient: 'from-green-600/30 to-green-700/30', border: 'border-green-400/40' },
                  { label: '사업운', score: result.scores.career, gradient: 'from-blue-600/30 to-blue-700/30', border: 'border-blue-400/40' },
                  { label: '재물운', score: result.scores.wealth, gradient: 'from-yellow-600/30 to-yellow-700/30', border: 'border-yellow-400/40' },
                  { label: '애정운', score: result.scores.love, gradient: 'from-pink-600/30 to-pink-700/30', border: 'border-pink-400/40' },
                  { label: '대인관계', score: result.scores.relationships, gradient: 'from-purple-600/30 to-purple-700/30', border: 'border-purple-400/40' }
                ].map((item, i) => (
                  <div key={i} className={`backdrop-blur-md bg-gradient-to-br ${item.gradient} rounded sm:rounded-lg md:rounded-2xl p-4 md:p-5 text-center border ${item.border} hover:scale-105 transition-transform duration-300`}>
                    <p className="text-white/80 text-xs md:text-sm mb-1 font-medium">{item.label}</p>
                    <p className="text-white text-base sm:text-2xl md:text-4xl font-bold">{item.score}</p>
                    <p className="text-white/60 text-xs mt-1">/ 100</p>
                  </div>
                ))}
              </div>

              {/* 손금선 상세 분석 */}
              <Section title="🖐️ 7대 손금선 분석" delay="0.3s" gradient="from-amber-600/20 to-yellow-600/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    { icon: '❤️', name: '생명선', data: result.palmLines.lifeLine },
                    { icon: '🧠', name: '지능선', data: result.palmLines.headLine },
                    { icon: '💝', name: '감정선', data: result.palmLines.heartLine },
                    { icon: '⭐', name: '운명선', data: result.palmLines.fateLine, isSpecial: true },
                    { icon: '💑', name: '결혼선', data: result.palmLines.marriageLine, isSpecial: true },
                    { icon: '💰', name: '재물선', data: result.palmLines.moneyLine, isSpecial: true },
                    { icon: '🏥', name: '건강선', data: result.palmLines.healthLine, isSpecial: true }
                  ].map((line, i) => (
                    <div key={i} className="backdrop-blur-sm bg-white/5 p-2 md:p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-200">
                      <h4 className="text-amber-200 font-bold mb-2 text-sm flex items-center gap-2">
                        <span>{line.icon}</span> {line.name}
                      </h4>
                      {!line.isSpecial && 'length' in line.data && (
                        <div className="flex gap-2 mb-2 text-xs">
                          <span className="bg-amber-500/20 text-amber-100 px-2 py-1 rounded">길이: {line.data.length}</span>
                          <span className="bg-amber-500/20 text-amber-100 px-2 py-1 rounded">깊이: {line.data.depth}</span>
                        </div>
                      )}
                      {line.isSpecial && 'presence' in line.data && (
                        <div className="mb-2 text-xs">
                          <span className="bg-amber-500/20 text-amber-100 px-2 py-1 rounded">
                            {'count' in line.data ? `개수: ${line.data.count}` : `상태: ${line.data.presence}`}
                          </span>
                        </div>
                      )}
                      <p className="text-white/90 text-sm leading-relaxed">{line.data.interpretation}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 성격 분석 */}
              <Section title="🧠 성격 및 기질" delay="0.4s">
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <span className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-2 rounded-full text-lg font-bold">
                      {result.personality.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="backdrop-blur-sm bg-green-500/10 p-2 md:p-4 rounded-xl border border-green-400/20">
                      <h5 className="text-green-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                        <span>💪</span> 강점
                      </h5>
                      <ul className="space-y-2">
                        {result.personality.strengths.map((strength, i) => (
                          <li key={i} className="text-green-50 text-sm flex items-start gap-2">
                            <span className="text-green-300">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="backdrop-blur-sm bg-orange-500/10 p-2 md:p-4 rounded-xl border border-orange-400/20">
                      <h5 className="text-orange-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                        <span>⚠️</span> 약점
                      </h5>
                      <ul className="space-y-2">
                        {result.personality.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-orange-50 text-sm flex items-start gap-2">
                            <span className="text-orange-300">•</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-2 md:p-4 rounded-xl border border-white/10">
                    <h5 className="text-amber-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm">주요 특징</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.personality.traits.map((trait, i) => (
                        <span key={i} className="bg-amber-500/20 text-amber-100 px-3 py-1 rounded-full text-xs">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* 인생 3단계 운세 */}
              <Section title="🕰️ 인생 시기별 운세" delay="0.5s" gradient="from-indigo-600/20 to-purple-600/20">
                <div className="space-y-4">
                  {[
                    { phase: result.lifePhases.youth, color: 'blue', icon: '🌱' },
                    { phase: result.lifePhases.middle, color: 'green', icon: '🌳' },
                    { phase: result.lifePhases.senior, color: 'amber', icon: '🌾' }
                  ].map((item, i) => (
                    <div key={i} className={`backdrop-blur-sm bg-${item.color}-500/10 p-2 md:p-4 rounded-xl border border-${item.color}-400/20`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className={`text-${item.color}-200 font-bold text-sm flex items-center gap-2`}>
                          <span>{item.icon}</span> {item.phase.period}
                        </h5>
                        <span className={`bg-${item.color}-500/30 text-${item.color}-100 px-3 py-1 rounded-full text-xs`}>
                          {item.phase.fortune}
                        </span>
                      </div>
                      <p className="text-white/90 text-sm mb-0.5 sm:mb-1.5 md:mb-2">{item.phase.description}</p>
                      <div className="space-y-1">
                        <p className={`text-${item.color}-200 text-xs font-bold`}>💡 실천 조언:</p>
                        {item.phase.advice.map((adv, j) => (
                          <p key={j} className="text-white/80 text-xs ml-4">• {adv}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 직업운 */}
              <Section title="💼 직업 · 커리어" delay="0.6s">
                <div className="space-y-4">
                  <p className="text-white/90 text-sm leading-relaxed">{result.fortune.career.description}</p>
                  <div>
                    <h5 className="text-amber-200 font-bold mb-2 text-sm">💡 추천 직업</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.fortune.career.suitableJobs.map((job, i) => (
                        <span key={i} className="bg-blue-500/20 text-blue-100 px-3 py-2 rounded-lg text-sm border border-blue-400/30">
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="backdrop-blur-sm bg-blue-500/10 p-2 md:p-4 rounded-xl border border-blue-400/20">
                    <p className="text-blue-100 text-sm"><strong>조언:</strong> {result.fortune.career.advice}</p>
                  </div>
                </div>
              </Section>

              {/* 재물운 & 애정운 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideUp" style={{ animationDelay: '0.7s' }}>
                <div className="backdrop-blur-md bg-yellow-600/20 rounded sm:rounded-lg md:rounded-2xl p-5 border border-yellow-400/30">
                  <h3 className="text-yellow-100 text-lg font-bold mb-0.5 sm:mb-1.5 md:mb-2 flex items-center gap-2">
                    <span>💰</span> 재물운
                  </h3>
                  <p className="text-white/90 text-sm mb-0.5 sm:mb-1.5 md:mb-2">{result.fortune.wealth.description}</p>
                  <div className="mb-0.5 sm:mb-1.5 md:mb-2">
                    <span className="text-xs text-yellow-200">돈 관리 스타일:</span>
                    <p className="text-yellow-50 text-sm font-medium">{result.fortune.wealth.moneyStyle}</p>
                  </div>
                  <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-400/20">
                    <p className="text-yellow-100 text-xs"><strong>조언:</strong> {result.fortune.wealth.advice}</p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-pink-600/20 rounded sm:rounded-lg md:rounded-2xl p-5 border border-pink-400/30">
                  <h3 className="text-pink-100 text-lg font-bold mb-0.5 sm:mb-1.5 md:mb-2 flex items-center gap-2">
                    <span>❤️</span> 애정운
                  </h3>
                  <p className="text-white/90 text-sm mb-0.5 sm:mb-1.5 md:mb-2">{result.fortune.love.description}</p>
                  <div className="space-y-2 mb-0.5 sm:mb-1.5 md:mb-2">
                    <div>
                      <span className="text-xs text-pink-200">연애 스타일:</span>
                      <p className="text-pink-50 text-sm">{result.fortune.love.loveStyle}</p>
                    </div>
                    <div>
                      <span className="text-xs text-pink-200">결혼 적령기:</span>
                      <p className="text-pink-50 text-sm">{result.fortune.love.marriageAge}</p>
                    </div>
                  </div>
                  <div className="bg-pink-500/10 p-3 rounded-lg border border-pink-400/20">
                    <p className="text-pink-100 text-xs"><strong>조언:</strong> {result.fortune.love.advice}</p>
                  </div>
                </div>
              </div>

              {/* 건강운 */}
              <Section title="🏥 건강운" delay="0.8s" gradient="from-green-600/20 to-emerald-600/20">
                <div className="space-y-4">
                  <p className="text-white/90 text-sm leading-relaxed">{result.fortune.health.description}</p>
                  <div>
                    <h5 className="text-red-200 font-bold mb-2 text-sm">⚠️ 주의해야 할 부위</h5>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {result.fortune.health.weakPoints.map((point, i) => (
                        <span key={i} className="bg-red-500/20 text-red-100 px-3 py-2 rounded-lg text-sm border border-red-400/30 text-center">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="backdrop-blur-sm bg-green-500/10 p-2 md:p-4 rounded-xl border border-green-400/20">
                    <p className="text-green-100 text-sm"><strong>조언:</strong> {result.fortune.health.advice}</p>
                  </div>
                </div>
              </Section>

              {/* 행운 아이템 */}
              <Section title="🍀 행운 아이템" delay="0.9s">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="text-amber-200 font-bold mb-2">🎨 행운의 색상</h5>
                    <div className="space-y-2">
                      {result.lucky.colors.map((color, i) => {
                        const hexMatch = color.match(/#[0-9A-Fa-f]{6}/);
                        const hexColor = hexMatch ? hexMatch[0] : '#ccc';
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white/30" style={{ backgroundColor: hexColor }}></div>
                            <span className="text-white/90 text-xs">{color}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-amber-200 font-bold mb-2">🔢 행운의 숫자</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.lucky.numbers.map((num, i) => (
                          <span key={i} className="w-10 h-10 bg-amber-500/30 text-amber-100 rounded-full flex items-center justify-center font-bold border border-amber-400/30">
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-amber-200 font-bold mb-2">🧭 행운의 방향</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.lucky.directions.map((dir, i) => (
                          <span key={i} className="bg-amber-500/20 text-amber-100 px-3 py-1 rounded-full text-xs">
                            {dir}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-amber-200 font-bold mb-2">💎 행운의 보석</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.lucky.stones.map((stone, i) => (
                          <span key={i} className="bg-amber-500/20 text-amber-100 px-3 py-1 rounded-full text-xs">
                            {stone}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-amber-200 font-bold mb-2">📅 행운의 요일</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.lucky.days.map((day, i) => (
                          <span key={i} className="bg-amber-500/20 text-amber-100 px-3 py-1 rounded-full text-xs">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* 실천 가이드 */}
              <Section title="📋 실천 가이드" delay="1s">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="backdrop-blur-sm bg-green-500/10 p-2 md:p-4 rounded-xl border border-green-400/20">
                    <h5 className="text-green-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                      <span>✅</span> 일상 실천
                    </h5>
                    <ul className="space-y-2">
                      {result.actionGuide.daily.map((item, i) => (
                        <li key={i} className="text-green-50 text-xs leading-relaxed">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-red-500/10 p-2 md:p-4 rounded-xl border border-red-400/20">
                    <h5 className="text-red-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                      <span>❌</span> 피해야 할 것
                    </h5>
                    <ul className="space-y-2">
                      {result.actionGuide.avoid.map((item, i) => (
                        <li key={i} className="text-red-50 text-xs leading-relaxed">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-blue-500/10 p-2 md:p-4 rounded-xl border border-blue-400/20">
                    <h5 className="text-blue-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                      <span>📈</span> 계발할 점
                    </h5>
                    <ul className="space-y-2">
                      {result.actionGuide.develop.map((item, i) => (
                        <li key={i} className="text-blue-50 text-xs leading-relaxed">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              {/* 궁합 */}
              <Section title="💑 손금 궁합" delay="1.1s" gradient="from-pink-600/20 to-rose-600/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="text-green-200 font-bold mb-2">💚 최고의 궁합</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.compatibility.bestMatch.map((match, i) => (
                        <span key={i} className="bg-green-500/20 text-green-100 px-3 py-2 rounded-lg border border-green-400/30">
                          {match}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-blue-200 font-bold mb-2">💙 좋은 궁합</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.compatibility.goodMatch.map((match, i) => (
                        <span key={i} className="bg-blue-500/20 text-blue-100 px-3 py-2 rounded-lg border border-blue-400/30">
                          {match}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-orange-200 font-bold mb-2">⚠️ 주의할 궁합</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.compatibility.challenging.map((match, i) => (
                        <span key={i} className="bg-orange-500/20 text-orange-100 px-3 py-2 rounded-lg border border-orange-400/30">
                          {match}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* 유명인 */}
              <Section title="⭐ 비슷한 손금을 가진 유명인" delay="1.2s">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <h5 className="text-amber-200 font-bold mb-2 text-sm flex items-center gap-2">
                      <span>🇰🇷</span> 한국
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {result.celebrities.korean.map((celeb, i) => (
                        <span key={i} className="bg-amber-500/20 text-amber-100 px-3 py-2 rounded-full text-sm border border-amber-400/30">
                          {celeb}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-amber-200 font-bold mb-2 text-sm flex items-center gap-2">
                      <span>🌍</span> 해외
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {result.celebrities.global.map((celeb, i) => (
                        <span key={i} className="bg-amber-500/20 text-amber-100 px-3 py-2 rounded-full text-sm border border-amber-400/30">
                          {celeb}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* 전문가 조언 */}
              <div className="backdrop-blur-md bg-gradient-to-r from-amber-600/40 to-yellow-600/40 rounded-3xl p-6 md:p-8 border border-amber-400/30 shadow-xl animate-slideUp" style={{ animationDelay: '1.3s' }}>
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span>💡</span> 전문가의 종합 조언
                </h3>
                <p className="text-amber-50 text-sm sm:text-base md:text-lg leading-relaxed mb-4">{result.expertAdvice}</p>
                <div className="bg-amber-900/30 p-2 md:p-4 rounded-xl border border-amber-500/30">
                  <p className="text-amber-100 text-sm leading-relaxed">{result.specialNote}</p>
                </div>
              </div>

              {/* 다시 하기 버튼 */}
              <button
        type="button"
                onClick={reset}
                className="w-full backdrop-blur-md bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded sm:rounded-lg md:rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 shadow-lg flex items-center justify-center gap-2 group"
              >
                <span className="text-xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span>다른 손금 분석하기</span>
              </button>

              {/* 관련 앱 */}
              <div className="animate-fadeIn" style={{ animationDelay: '1.4s' }}>
                <RelatedApps currentAppSlug="lifestyle-palm-reading" className="mt-8" />
              </div>
            </div>
          )}

          {/* 안내 */}
          <div className="mt-8 backdrop-blur-md bg-amber-900/20 rounded sm:rounded-lg md:rounded-2xl p-4 border border-amber-500/20">
            <p className="text-amber-200 text-xs text-center leading-relaxed">
              ※ 본 서비스는 전통 수상학 기반 AI 분석으로 엔터테인먼트 목적입니다.<br />
              사진은 브라우저에서만 처리되며 서버에 저장되지 않습니다.
            </p>
          </div>

          {/* 광고 */}
          <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <AdSense className="min-h-[250px]" />
            </div>
          </div>

          <AppFooter />
        </section>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* 커스텀 CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-progress {
          animation: progress 3s ease-in-out;
        }
      `}</style>
    </main>
  );
}

// Section 컴포넌트
function Section({ title, children, delay = '0s', gradient = 'from-amber-600/10 to-amber-700/10' }: { title: string; children: React.ReactNode; delay?: string; gradient?: string }) {
  return (
    <div className={`backdrop-blur-md bg-gradient-to-br ${gradient} rounded sm:rounded-lg md:rounded-2xl p-5 md:p-6 border border-amber-500/20 animate-slideUp hover:bg-amber-600/15 transition-colors duration-300`} style={{ animationDelay: delay }}>
      <h3 className="text-white text-lg md:text-xl font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

