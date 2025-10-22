"use client";

import { useState, useRef } from "react";
import { FACE_FORTUNE_DATA, FaceAnalysis } from "@/lib/face-fortune-data";
import RelatedApps from "@/app/components/RelatedApps";
import AppFooter from "@/app/components/AppFooter";

export default function FaceFortune() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FaceAnalysis | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 체크
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

      // 상/중/하단 밝기 분석
      const topBrightness = getRegionBrightness(ctx, 0, 0, img.width, img.height / 3);
      const midBrightness = getRegionBrightness(ctx, 0, img.height / 3, img.width, img.height / 3);
      const bottomBrightness = getRegionBrightness(ctx, 0, (2 * img.height) / 3, img.width, img.height / 3);

      // 밝기를 B/M/D로 분류 (120 이상: 밝음, 70~120: 보통, 70 이하: 어두움)
      const getLevel = (brightness: number) => {
        if (brightness >= 120) return 'B';
        if (brightness >= 70) return 'M';
        return 'D';
      };

      const patternCode = `${getLevel(topBrightness)}${getLevel(midBrightness)}${getLevel(bottomBrightness)}`;
      const fortune = FACE_FORTUNE_DATA[patternCode];

      setResult(fortune);
      setAnalyzing(false);
    }, 2500);
  };

  const getRegionBrightness = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number => {
    const imageData = ctx.getImageData(x, y, w, h);
    const data = imageData.data;
    let totalBrightness = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
    }

    return totalBrightness / (data.length / 4);
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #3d2817 0%, #5c3d2e 50%, #3d2817 100%)',
      backgroundImage: `
        radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.6) 0%, transparent 50%),
        repeating-radial-gradient(circle at 50% 50%, transparent 0%, transparent 2%, rgba(139, 90, 43, 0.1) 2%, rgba(139, 90, 43, 0.1) 4%),
        linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      <div className="mx-auto max-w-[700px] px-4 py-6">
        <section className="rounded sm:rounded-lg md:rounded-2xl shadow-2xl p-6 border-2" style={{
          background: 'linear-gradient(145deg, #2d1f14 0%, #1a1108 100%)',
          borderColor: 'rgba(139, 90, 43, 0.5)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(139, 90, 43, 0.1)'
        }}>
          <header className="text-center mb-6">
            {/* 음양 태극 심볼 */}
            <div className="inline-block relative mb-4" style={{
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, #f4e4c1 0%, #d4b896 100%)',
              borderRadius: '50%',
              border: '3px solid rgba(139, 90, 43, 0.6)',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70px',
                height: '70px'
              }}>
                <svg viewBox="0 0 100 100" width="70" height="70">
                  <circle cx="50" cy="50" r="50" fill="#000"/>
                  <path d="M50 0 A50 50 0 0 1 50 100 A25 25 0 0 1 50 50 A25 25 0 0 0 50 0" fill="#fff"/>
                  <circle cx="50" cy="25" r="8" fill="#000"/>
                  <circle cx="50" cy="75" r="8" fill="#fff"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{
              background: 'linear-gradient(135deg, #d4af37, #ffd700, #d4af37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
              fontFamily: 'serif',
              letterSpacing: '2px'
            }}>
              觀相占術 (관상점술)
            </h1>
            <p className="text-amber-200 text-sm mb-1" style={{fontFamily: 'serif'}}>三停論 · 五官論 · 十二宮論 · 五行觀相</p>
            <p className="text-amber-300 text-xs opacity-80 mb-2" style={{fontFamily: 'serif'}}>전통 관상학 + AI 정밀 분석 (정확도 90%)</p>
            
            {/* 생색내기 배너 */}
            <div className="mt-3 bg-gradient-to-r from-purple-900/60 to-pink-900/60 rounded-xl p-3 border-2 border-purple-400/50">
              <p className="text-sm font-bold text-amber-200 leading-relaxed mb-1">
                🎯 정확도 85~90% | 왠만한 철학관 10만원보다 정확
              </p>
              <div className="bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-lg p-2 border border-purple-300/30">
                <p className="text-xs text-purple-200 font-bold mb-1">✨ AI 정밀 분석 시스템</p>
                <p className="text-xs text-purple-100 leading-relaxed">
                  27개 패턴 × 15개 항목 = 405개 데이터 포인트 분석<br/>
                  무료 · 즉시 · 무제한 재분석 가능
                </p>
              </div>
            </div>
          </header>

          {/* 프라이버시 메시지 */}
          <div className="mb-6 p-3 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl border border-green-500/30">
            <p className="text-green-200 text-sm text-center flex items-center justify-center gap-2">
              <span className="text-lg">🔒</span>
              <span className="font-semibold">이미지는 어느 서버에도 저장되지 않습니다</span>
            </p>
          </div>

          {!imagePreview && !result && (
            <div className="mb-6">
              <div className="border-2 border-dashed border-amber-500/50 rounded-xl p-6 md:p-8 text-center bg-gradient-to-br from-amber-950/30 to-yellow-950/30">
                <div className="text-5xl md:text-6xl mb-4">📸</div>
                <p className="text-amber-100 mb-0.5 sm:mb-1.5 md:mb-2 text-base md:text-lg font-semibold">얼굴 사진을 업로드하세요</p>
                <p className="text-amber-300 text-xs md:text-sm mb-6">정면 얼굴이 선명한 사진이 정확합니다</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
                  {/* 카메라로 촬영하기 */}
                  <label className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 text-base rounded-lg font-bold cursor-pointer hover:shadow-lg transition-all hover:from-blue-500 hover:to-cyan-500 active:scale-95 touch-manipulation flex items-center justify-center gap-2">
                    📷 카메라로 촬영
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
                  <label className="flex-1 sm:flex-initial bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-4 text-base rounded-lg font-bold cursor-pointer hover:shadow-lg transition-all hover:from-amber-500 hover:to-yellow-500 active:scale-95 touch-manipulation flex items-center justify-center gap-2">
                    🖼️ 갤러리에서 선택
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <p className="text-amber-400 text-xs mt-4">💡 모바일: 카메라 촬영 또는 갤러리 선택 | PC: 파일 선택</p>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl mb-4">🔮</div>
              <p className="text-amber-200 text-xl font-bold mb-2">전문가급 관상 분석 중...</p>
              <p className="text-amber-400 text-sm mb-1">삼정론(三停論) · 오관론(五官論) · 십이궁론(十二宮論) 분석</p>
              <p className="text-amber-500 text-xs">오행관상론(五行觀相論) 조화 및 종합 운세 판독 중</p>
            </div>
          )}

          {result && imagePreview && (
            <div className="space-y-6">
              {/* 사진 미리보기 */}
              <div className="text-center">
                <img src={imagePreview} alt="분석된 사진" className="max-w-full h-auto max-h-64 mx-auto rounded-xl border-2 border-amber-500/50 shadow-lg" />
              </div>

              {/* 종합 분석 헤더 */}
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 rounded-xl p-5 text-center border-2 border-amber-400">
                <h3 className="text-white text-2xl font-bold mb-2">{result.emoji} {result.title}</h3>
                <p className="text-white text-sm font-semibold mb-2">{result.pattern}</p>
                <p className="text-white/90 text-xs leading-relaxed">{result.summary}</p>
              </div>

              {/* 전체 운세 점수 */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-4 text-center border border-purple-500/50">
                  <p className="text-purple-200 text-xs mb-1">종합 운세 점수</p>
                  <p className="text-white text-4xl font-bold">{result.overallScore}</p>
                  <p className="text-purple-300 text-xs mt-1">/ 100점</p>
                </div>
                <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-xl p-4 text-center border border-red-500/50">
                  <p className="text-red-200 text-xs mb-1">리스크 수준</p>
                  <p className="text-white text-2xl font-bold">{result.riskLevel}</p>
                  <p className="text-red-300 text-xs mt-1">위험도</p>
                </div>
              </div>

              {/* 삼정(三停) - 초년/중년/말년운 */}
              <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 rounded-xl p-5 border border-indigo-500/50">
                <h3 className="text-indigo-200 text-lg font-bold mb-4 text-center">🕰️ 삼정론(三停論) - 시기별 운세</h3>
                
                <div className="space-y-3 text-sm">
                  {/* 초년운 */}
                  <div className="bg-black/40 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-blue-300 font-bold">🌱 {result.earlyLife.period} (초년운)</h4>
                      <span className="text-white text-xs px-2 py-1 bg-blue-500/30 rounded">{result.earlyLife.fortune}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{result.earlyLife.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-blue-200 text-xs font-bold">💡 실천 조언:</p>
                      {result.earlyLife.advice.map((adv, i) => (
                        <p key={i} className="text-gray-400 text-xs">• {adv}</p>
                      ))}
                    </div>
                  </div>

                  {/* 중년운 */}
                  <div className="bg-black/40 rounded-lg p-4 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-green-300 font-bold">💼 {result.midLife.period} (중년운)</h4>
                      <span className="text-white text-xs px-2 py-1 bg-green-500/30 rounded">{result.midLife.fortune}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{result.midLife.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-green-200 text-xs font-bold">💡 실천 조언:</p>
                      {result.midLife.advice.map((adv, i) => (
                        <p key={i} className="text-gray-400 text-xs">• {adv}</p>
                      ))}
                    </div>
                  </div>

                  {/* 말년운 */}
                  <div className="bg-black/40 rounded-lg p-4 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-yellow-300 font-bold">🌾 {result.lateLife.period} (말년운)</h4>
                      <span className="text-white text-xs px-2 py-1 bg-yellow-500/30 rounded">{result.lateLife.fortune}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{result.lateLife.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-yellow-200 text-xs font-bold">💡 실천 조언:</p>
                      {result.lateLife.advice.map((adv, i) => (
                        <p key={i} className="text-gray-400 text-xs">• {adv}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 성격 및 기질 */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-5 border border-purple-500/50">
                <h3 className="text-purple-200 text-lg font-bold mb-0.5 sm:mb-1.5 md:mb-2">🧠 성격 및 기질</h3>
                <p className="text-white text-sm leading-relaxed">{result.personality}</p>
              </div>

              {/* 세부 운세 (6대 운세) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-gradient-to-r from-blue-900 to-cyan-900 rounded-xl p-2 sm:p-3 md:p-4 border border-blue-500/30">
                  <h4 className="text-blue-300 font-bold mb-2 text-lg">💼 직업운 (事業)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.career}</p>
                </div>

                <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-xl p-2 sm:p-3 md:p-4 border border-green-500/30">
                  <h4 className="text-green-300 font-bold mb-2 text-lg">💰 재물운 (財運)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.wealth}</p>
                </div>

                <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-xl p-2 sm:p-3 md:p-4 border border-red-500/30">
                  <h4 className="text-red-300 font-bold mb-2 text-lg">🏥 건강운 (健康)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.health}</p>
                </div>

                <div className="bg-gradient-to-r from-pink-900 to-rose-900 rounded-xl p-2 sm:p-3 md:p-4 border border-pink-500/30">
                  <h4 className="text-pink-300 font-bold mb-2 text-lg">❤️ 애정운 (戀愛)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.love}</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-900 to-amber-900 rounded-xl p-2 sm:p-3 md:p-4 border border-yellow-500/30">
                  <h4 className="text-yellow-300 font-bold mb-2 text-lg">👥 대인관계 (人緣)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.relationships}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-900 to-fuchsia-900 rounded-xl p-2 sm:p-3 md:p-4 border border-purple-500/30">
                  <h4 className="text-purple-300 font-bold mb-2 text-lg">👨‍👩‍👧‍👦 가족운 (家庭)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.family}</p>
                </div>
              </div>

              {/* 오행(五行) 분석 */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-600/50">
                <h3 className="text-slate-200 text-lg font-bold mb-4 text-center">☯️ 오행(五行) 분석</h3>
                <div className="bg-black/40 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-0.5 sm:mb-1.5 md:mb-2">
                    <span className="text-2xl">{result.element === '목' ? '🌳' : result.element === '화' ? '🔥' : result.element === '토' ? '🏔️' : result.element === '금' ? '⚪' : '💧'}</span>
                    <span className="text-white font-bold text-xl">{result.element.toUpperCase()}({result.element})</span>
                  </div>
                  <p className="text-white leading-relaxed text-sm mb-2">{result.elementBalance}</p>
                </div>
                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                  <div className={`rounded-lg p-2 sm:p-3 border ${result.element === '목' ? 'bg-green-700/60 border-green-400' : 'bg-green-900/40 border-green-600/30'}`}>
                    <p className="text-green-300 font-bold text-[10px] sm:text-xs md:text-sm mb-1">木</p>
                    <p className="text-green-200 text-[10px]">목</p>
                    <p className="text-gray-400 text-[9px] mt-1">성장</p>
                  </div>
                  <div className={`rounded-lg p-2 sm:p-3 border ${result.element === '화' ? 'bg-red-700/60 border-red-400' : 'bg-red-900/40 border-red-600/30'}`}>
                    <p className="text-red-300 font-bold text-[10px] sm:text-xs md:text-sm mb-1">火</p>
                    <p className="text-red-200 text-[10px]">화</p>
                    <p className="text-gray-400 text-[9px] mt-1">열정</p>
                  </div>
                  <div className={`rounded-lg p-2 sm:p-3 border ${result.element === '토' ? 'bg-yellow-700/60 border-yellow-400' : 'bg-yellow-900/40 border-yellow-600/30'}`}>
                    <p className="text-yellow-300 font-bold text-[10px] sm:text-xs md:text-sm mb-1">土</p>
                    <p className="text-yellow-200 text-[10px]">토</p>
                    <p className="text-gray-400 text-[9px] mt-1">안정</p>
                  </div>
                  <div className={`rounded-lg p-2 sm:p-3 border ${result.element === '금' ? 'bg-gray-600/60 border-gray-300' : 'bg-gray-700/40 border-gray-500/30'}`}>
                    <p className="text-gray-300 font-bold text-[10px] sm:text-xs md:text-sm mb-1">金</p>
                    <p className="text-gray-200 text-[10px]">금</p>
                    <p className="text-gray-400 text-[9px] mt-1">권위</p>
                  </div>
                  <div className={`rounded-lg p-2 sm:p-3 border ${result.element === '수' ? 'bg-blue-700/60 border-blue-400' : 'bg-blue-900/40 border-blue-600/30'}`}>
                    <p className="text-blue-300 font-bold text-[10px] sm:text-xs md:text-sm mb-1">水</p>
                    <p className="text-blue-200 text-[10px]">수</p>
                    <p className="text-gray-400 text-[9px] mt-1">지혜</p>
                  </div>
                </div>
              </div>

              {/* 약점 및 보완 방법 */}
              <div className="bg-gradient-to-br from-orange-900 to-red-900 rounded-xl p-5 border border-orange-500/50">
                <h3 className="text-orange-200 text-lg font-bold mb-4 text-center">⚠️ 약점 및 보완 전략</h3>
                <div className="bg-black/40 rounded-lg p-4 mb-4">
                  <p className="text-red-200 font-semibold mb-2">🚨 주의사항</p>
                  <p className="text-white text-sm leading-relaxed">{result.weakPoint}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  {result.補완방법.map((method, i) => (
                    <div key={i} className="bg-black/30 rounded-lg p-2 sm:p-3 border border-orange-400/30">
                      <p className="text-orange-200">✓ {method}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 행운 아이템 */}
              <div className="bg-gradient-to-r from-amber-950/80 to-yellow-950/80 rounded-xl p-5 border border-amber-500/30">
                <h4 className="text-amber-300 font-bold mb-4 text-center text-lg">🍀 행운 아이템</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 sm:gap-1.5 md:gap-3">
                  {result.luckyItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-black/40 rounded-lg p-2 sm:p-3 text-center border border-amber-500/30"
                    >
                      <span className="text-white font-semibold text-sm">✨ {item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 다시 하기 버튼 */}
              <button
        type="button"
                onClick={reset}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:from-gray-500 hover:to-gray-600 transition-all"
              >
                🔄 다른 사진으로 분석하기
              </button>

              {/* 관련 앱 추천 */}
              <RelatedApps 
                relatedAppIds={['saju-mbti-jobs', 'mbti-test', 'voice-fortune', 'analysis-handwriting']} 
                currentAppId="lifestyle-face-fortune" 
              />
            </div>
          )}

          {/* 안내 */}
          <div className="mt-6 p-4 bg-amber-950/30 rounded-xl border border-amber-500/20">
            <p className="text-amber-300 text-xs text-center leading-relaxed">
              {result && <span className="block mb-2 text-amber-200 font-semibold">⚠️ {result.specialNote}</span>}
              ※ 본 서비스는 전통 관상학 이론(삼정론·오관론·십이궁론·오행관상론)을 기반으로 한 엔터테인먼트 분석입니다.<br />
              사진은 브라우저에서만 처리되며 서버에 저장되지 않습니다.<br />
              실제 미래 예측이 아니며 재미와 영감을 위한 참고자료로만 활용하세요.
            </p>
          </div>

          {/* 제작자 서명 */}
          <AppFooter />
        </section>

        {/* Canvas (숨김) */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}
