"use client";

import { useState, useRef, useEffect } from "react";
import { FACE_SHAPE_DATA, getFaceShapeByRatio } from "@/lib/face-shape-data";
import type { FaceShapeAnalysis } from "@/lib/face-shape-data";
import RelatedApps from "@/app/components/RelatedApps";
import AppFooter from "@/app/components/AppFooter";

export default function FaceShapeAnalysisPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FaceShapeAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

      const topWidth = measureWidth(ctx, img.width, 0, img.height / 3);
      const midWidth = measureWidth(ctx, img.width, img.height / 3, img.height / 3);
      const bottomWidth = measureWidth(ctx, img.width, (2 * img.height) / 3, img.height / 3);

      console.log('🔍 얼굴 측정 결과:');
      console.log(`  상단(이마): ${topWidth.toFixed(1)}px`);
      console.log(`  중단(광대): ${midWidth.toFixed(1)}px`);
      console.log(`  하단(턱선): ${bottomWidth.toFixed(1)}px`);
      
      const patternCode = getFaceShapeByRatio(topWidth, midWidth, bottomWidth);
      console.log(`  → 패턴 코드: ${patternCode}`);
      
      const faceShape = FACE_SHAPE_DATA[patternCode];
      console.log(`  → 얼굴형: ${faceShape?.title || '데이터 없음'}`);
      
      if (!faceShape) {
        console.error(`❌ 패턴 코드 ${patternCode}에 해당하는 데이터가 없습니다!`);
      }

      setResult(faceShape);
      setAnalyzing(false);
    }, 2500);
  };

  const measureWidth = (ctx: CanvasRenderingContext2D, imgWidth: number, startY: number, height: number): number => {
    const imageData = ctx.getImageData(0, startY, imgWidth, height);
    const data = imageData.data;
    
    // 전체 영역의 평균 밝기 계산
    let totalBrightness = 0;
    let pixelCount = 0;
    for (let y = 0; y < height; y += 10) {
      for (let x = 0; x < imgWidth; x += 10) {
        const idx = (y * imgWidth + x) * 4;
        totalBrightness += (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        pixelCount++;
      }
    }
    const avgBrightness = totalBrightness / pixelCount;
    
    // 임계값을 평균 밝기 기준으로 설정 (더 어두운 부분을 얼굴로 인식)
    const threshold = Math.min(avgBrightness * 0.85, 180);
    
    let leftEdge = imgWidth;
    let rightEdge = 0;
    let foundPixels = 0;
    
    // 더 촘촘하게 스캔 (3픽셀 간격)
    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < imgWidth; x += 3) {
        const idx = (y * imgWidth + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        
        // 임계값보다 어두운 픽셀을 얼굴로 인식
        if (brightness < threshold) {
          if (x < leftEdge) leftEdge = x;
          if (x > rightEdge) rightEdge = x;
          foundPixels++;
        }
      }
    }
    
    // 픽셀을 찾지 못한 경우 대체 로직
    if (foundPixels < 50) {
      // 중앙 영역의 너비 추정
      const centerX = imgWidth / 2;
      const estimatedWidth = imgWidth * 0.6; // 이미지 너비의 60%로 추정
      return estimatedWidth + Math.random() * imgWidth * 0.1; // 약간의 랜덤성 추가
    }
    
    return rightEdge - leftEdge;
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setAnalyzing(false);
    setShowResults(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #581c87 75%, #3b0764 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-[800px] px-4 py-8 md:py-12">
        {/* 글래스모피즘 컨테이너 */}
        <section className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20" style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
        }}>
          {/* 헤더 */}
          <header className="text-center mb-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent animate-gradient" style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.02em',
              backgroundSize: '200% auto',
              animation: 'gradient 3s ease infinite'
            }}>
              얼굴형 AI 분석
            </h1>
            
            <p className="text-purple-100 text-base md:text-lg mb-2 font-medium tracking-wide">
              정밀 AI 분석 시스템 · 27가지 패턴 분류
            </p>
            <p className="text-purple-200/80 text-sm">
              당신만을 위한 맞춤 뷰티 가이드
            </p>
            
            {/* 인포 배지 */}
            <div className="mt-6 inline-flex items-center gap-3 backdrop-blur-md bg-white/10 rounded sm:rounded-lg md:rounded-2xl px-6 py-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">온라인</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-purple-100 text-sm">무료 · 무제한 · 즉시 분석</span>
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
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient" style={{
                  backgroundSize: '400% 400%',
                  animation: 'gradient 3s ease infinite'
                }}></div>
                
                <div className="relative backdrop-blur-md bg-white/5 border-2 border-dashed border-white/30 rounded-3xl p-8 md:p-12 text-center transition-all duration-300 hover:border-white/50 hover:bg-white/10">
                  <div className="text-7xl md:text-8xl mb-6 filter drop-shadow-lg animate-float">📸</div>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-0.5 sm:mb-1.5 md:mb-2">얼굴 사진을 업로드하세요</h3>
                  <p className="text-purple-200 text-sm sm:text-base md:text-lg mb-8 max-w-md mx-auto">
                    정면 얼굴이 선명한 사진일수록 더 정확한 분석 결과를 받을 수 있습니다
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-lg mx-auto">
                    {/* 카메라로 촬영하기 */}
                    <label className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 md:px-8 py-4 md:py-5 text-base md:text-lg rounded-xl md:rounded-2xl font-bold cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 group touch-manipulation">
                      <span className="text-2xl group-hover:scale-110 transition-transform">📷</span>
                      <span>카메라로 촬영</span>
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {/* 갤러리에서 선택 */}
                    <label className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 md:px-8 py-4 md:py-5 text-base md:text-lg rounded-xl md:rounded-2xl font-bold cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 group touch-manipulation">
                      <span className="text-2xl group-hover:scale-110 transition-transform">🖼️</span>
                      <span>갤러리에서 선택</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <p className="text-purple-300 text-xs mt-6 flex items-center justify-center gap-2">
                    <span>💡</span>
                    <span>모바일: 카메라 촬영 또는 갤러리 선택 | PC: 파일 선택</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 분석 중 */}
          {analyzing && (
            <div className="text-center py-16 animate-fadeIn">
              <div className="relative inline-block mb-8">
                <div className="w-20 h-20 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
              </div>
              
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">AI 정밀 분석 중</h3>
              <p className="text-purple-200 text-base mb-6">27가지 패턴 데이터베이스 매칭</p>
              
              {/* 프로그레스 바 */}
              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-progress"></div>
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
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30"></div>
                  <img 
                    src={imagePreview} 
                    alt="분석된 사진" 
                    className="relative max-w-full h-auto max-h-80 mx-auto rounded sm:rounded-lg md:rounded-2xl border-2 border-white/20 shadow-2xl" 
                  />
                </div>
              </div>

              {/* 결과 헤더 */}
              <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl p-6 md:p-8 text-center border border-white/20 shadow-xl animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="text-6xl mb-4 filter drop-shadow-lg">{result.emoji}</div>
                <h2 className="text-white text-base sm:text-2xl md:text-4xl font-bold mb-2">{result.title}</h2>
                <p className="text-purple-100 text-lg font-medium mb-2">{result.englishName}</p>
                <p className="text-purple-50 text-base max-w-2xl mx-auto">{result.summary}</p>
              </div>

              {/* 점수 카드 */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                {[
                  { label: '조화도', score: result.harmonyScore, gradient: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-400/30' },
                  { label: '선호도', score: result.popularityIndex, gradient: 'from-pink-500/20 to-pink-600/20', border: 'border-pink-400/30' },
                  { label: '뷰티 잠재력', score: result.beautyPotential, gradient: 'from-indigo-500/20 to-indigo-600/20', border: 'border-indigo-400/30' }
                ].map((item, i) => (
                  <div key={i} className={`backdrop-blur-md bg-gradient-to-br ${item.gradient} rounded sm:rounded-lg md:rounded-2xl p-4 md:p-6 text-center border ${item.border} hover:scale-105 transition-transform duration-300`}>
                    <p className="text-white/80 text-xs md:text-sm mb-2 font-medium">{item.label}</p>
                    <p className="text-white text-base sm:text-2xl md:text-4xl font-bold">{item.score}</p>
                    <p className="text-white/60 text-xs mt-1">/ 100</p>
                  </div>
                ))}
              </div>

              {/* 섹션 컴포넌트 */}
              <Section title="✨ 주요 특징" delay="0.3s">
                <ul className="space-y-3">
                  {result.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-3 text-purple-50 text-sm sm:text-base md:text-lg group hover:translate-x-2 transition-transform duration-200">
                      <span className="text-purple-300 mt-1 group-hover:scale-125 transition-transform">•</span>
                      <span className="flex-1">{char}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* 장점 & 주의사항 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                <div className="backdrop-blur-md bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded sm:rounded-lg md:rounded-2xl p-5 md:p-6 border border-green-400/30 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-green-100 font-bold mb-4 text-lg flex items-center gap-2">
                    <span>💚</span> 장점
                  </h4>
                  <ul className="space-y-2">
                    {result.advantages.map((adv, i) => (
                      <li key={i} className="text-green-50 text-sm flex items-start gap-2">
                        <span className="text-green-300">✓</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="backdrop-blur-md bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded sm:rounded-lg md:rounded-2xl p-5 md:p-6 border border-orange-400/30 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-orange-100 font-bold mb-4 text-lg flex items-center gap-2">
                    <span>⚠️</span> 주의사항
                  </h4>
                  <ul className="space-y-2">
                    {result.considerations.map((con, i) => (
                      <li key={i} className="text-orange-50 text-sm flex items-start gap-2">
                        <span className="text-orange-300">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 헤어스타일 */}
              <Section title="💇‍♀️ 헤어스타일 추천" delay="0.5s">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="text-green-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                      <span>✅</span> 추천 스타일
                    </h5>
                    <div className="space-y-2">
                      {result.hairStyles.best.map((style, i) => (
                        <div key={i} className="backdrop-blur-sm bg-green-500/10 text-green-50 px-4 py-3 rounded-xl text-sm border border-green-400/20 hover:bg-green-500/20 transition-colors duration-200">
                          {style}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-red-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                      <span>❌</span> 피해야 할 스타일
                    </h5>
                    <div className="space-y-2">
                      {result.hairStyles.avoid.map((style, i) => (
                        <div key={i} className="backdrop-blur-sm bg-red-500/10 text-red-50 px-4 py-3 rounded-xl text-sm border border-red-400/20 hover:bg-red-500/20 transition-colors duration-200">
                          {style}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* 메이크업 */}
              <Section title="💄 메이크업 가이드" delay="0.6s">
                <div className="space-y-3">
                  {[
                    { icon: '🎨', title: '컨투어링', content: result.makeup.contouring },
                    { icon: '✨', title: '하이라이트', content: result.makeup.highlight },
                    { icon: '🌸', title: '블러셔', content: result.makeup.blush },
                    { icon: '👁️', title: '눈썹', content: result.makeup.eyebrow },
                    { icon: '💋', title: '립스틱', content: result.makeup.lipstick }
                  ].map((item, i) => (
                    <div key={i} className="backdrop-blur-sm bg-white/5 p-2 md:p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-200">
                      <h5 className="text-pink-200 font-bold mb-2 text-sm flex items-center gap-2">
                        <span>{item.icon}</span> {item.title}
                      </h5>
                      <p className="text-purple-50 text-sm leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 유명인 */}
              <Section title="⭐ 같은 얼굴형 유명인" delay="0.7s">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="text-yellow-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                      <span>🇰🇷</span> 한국
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {result.celebrities.korean.map((celeb, i) => (
                        <span key={i} className="backdrop-blur-sm bg-yellow-500/20 text-yellow-50 px-4 py-2 rounded-full text-sm border border-yellow-400/30 hover:scale-110 transition-transform duration-200">
                          {celeb}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-yellow-200 font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-sm flex items-center gap-2">
                      <span>🌍</span> 해외
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {result.celebrities.global.map((celeb, i) => (
                        <span key={i} className="backdrop-blur-sm bg-yellow-500/20 text-yellow-50 px-4 py-2 rounded-full text-sm border border-yellow-400/30 hover:scale-110 transition-transform duration-200">
                          {celeb}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* 전문가 조언 */}
              <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl animate-slideUp" style={{ animationDelay: '0.8s' }}>
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span>💡</span> 전문가의 종합 조언
                </h3>
                <p className="text-purple-50 text-sm sm:text-base md:text-lg leading-relaxed">{result.professionalAdvice}</p>
              </div>

              {/* 다시 하기 버튼 */}
              <button
        type="button"
                onClick={reset}
                className="w-full backdrop-blur-md bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded sm:rounded-lg md:rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 shadow-lg flex items-center justify-center gap-2 group"
              >
                <span className="text-xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span>다른 사진으로 분석하기</span>
              </button>

              {/* 관련 앱 */}
              <div className="animate-fadeIn" style={{ animationDelay: '0.9s' }}>
                <RelatedApps currentAppSlug="face-shape" className="mt-8" />
              </div>
            </div>
          )}

          {/* 안내 */}
          <div className="mt-8 backdrop-blur-md bg-white/5 rounded sm:rounded-lg md:rounded-2xl p-4 border border-white/10">
            <p className="text-purple-200 text-xs text-center leading-relaxed">
              ※ 본 서비스는 AI 기반 얼굴형 분석으로 엔터테인먼트 목적입니다.<br />
              사진은 브라우저에서만 처리되며 서버에 저장되지 않습니다.
            </p>
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
          animation: progress 2.5s ease-in-out;
        }
      `}</style>
    </main>
  );
}

// Section 컴포넌트
function Section({ title, children, delay = '0s' }: { title: string; children: React.ReactNode; delay?: string }) {
  return (
    <div className="backdrop-blur-md bg-white/5 rounded sm:rounded-lg md:rounded-2xl p-5 md:p-6 border border-white/10 animate-slideUp hover:bg-white/10 transition-colors duration-300" style={{ animationDelay: delay }}>
      <h3 className="text-white text-lg md:text-xl font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}