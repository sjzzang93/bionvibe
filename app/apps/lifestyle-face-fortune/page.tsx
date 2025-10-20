"use client";

import { useState, useRef } from "react";
import { analyzeFaceDetailed, DetailedFortune } from "@/lib/physiognomy-data";

export default function FaceFortune() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetailedFortune | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImagePreview(event.target?.result as string);
        analyzeImage(img);
      };
      img.src = event.target?.result as string;
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

      const fortune = analyzeFaceDetailed(topBrightness, midBrightness, bottomBrightness);
      setResult(fortune);
      setAnalyzing(false);
    }, 2000);
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
        <section className="rounded-2xl shadow-2xl p-6 border-2" style={{
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
                  {/* 음양 태극 */}
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
            <p className="text-amber-200 text-sm mb-1" style={{fontFamily: 'serif'}}>三停五官 · 十二宮 · 五行 전문 분석</p>
            <p className="text-amber-300 text-xs opacity-80" style={{fontFamily: 'serif'}}>300년 전통 관상학 + AI 정밀 분석</p>
          </header>

          {!imagePreview && !result && (
            <div className="mb-6">
              <div className="border-2 border-dashed border-amber-500/50 rounded-xl p-8 text-center bg-gradient-to-br from-amber-950/30 to-yellow-950/30">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-amber-100 mb-4 text-lg font-semibold">얼굴 사진을 업로드하세요</p>
                <p className="text-amber-300 text-sm mb-6">정면 얼굴이 선명한 사진이 정확합니다</p>
                <label className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-3 rounded-lg font-bold cursor-pointer hover:shadow-lg transition-all hover:from-amber-500 hover:to-yellow-500">
                  📷 사진 선택
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl mb-4">🔮</div>
              <p className="text-amber-200 text-xl font-bold mb-2">전문가급 관상 분석 중...</p>
              <p className="text-amber-400 text-sm mb-1">삼정(三停) · 오관(五官) · 십이궁(十二宮) 분석</p>
              <p className="text-amber-500 text-xs">오행(五行) 조화 및 종합 운세 판독 중</p>
            </div>
          )}

          {result && imagePreview && (
            <div className="space-y-6">
              {/* 사진 미리보기 */}
              <div className="text-center">
                <img src={imagePreview} alt="분석된 사진" className="max-w-full h-auto max-h-64 mx-auto rounded-xl border-2 border-amber-500/50 shadow-lg" />
              </div>

              {/* 전체 운세 */}
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 rounded-xl p-5 text-center border-2 border-amber-400">
                <h3 className="text-white text-xl font-bold mb-2">🌟 종합 관상</h3>
                <p className="text-white text-lg font-semibold">{result.overall}</p>
              </div>

              {/* 성격 분석 */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-5 border border-purple-500/50">
                <h3 className="text-purple-200 text-lg font-bold mb-3">🧠 성격 및 기질</h3>
                <p className="text-white text-sm mb-4">{result.personality}</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-black/30 rounded-lg p-3">
                    <h4 className="text-green-300 font-bold mb-2">✅ 강점</h4>
                    {result.strengths.map((s, i) => (
                      <p key={i} className="text-gray-300 mb-1">• {s}</p>
                    ))}
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <h4 className="text-red-300 font-bold mb-2">⚠️ 약점</h4>
                    {result.weaknesses.map((w, i) => (
                      <p key={i} className="text-gray-300 mb-1">• {w}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* 세부 운세 (4대 운세) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-xl p-4 border border-green-500/30">
                  <h4 className="text-green-300 font-bold mb-2 text-lg">💰 재물운 (財運)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.wealth}</p>
                </div>

                <div className="bg-gradient-to-r from-blue-900 to-cyan-900 rounded-xl p-4 border border-blue-500/30">
                  <h4 className="text-blue-300 font-bold mb-2 text-lg">💼 사업/직장운 (官祿)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.career}</p>
                </div>

                <div className="bg-gradient-to-r from-pink-900 to-rose-900 rounded-xl p-4 border border-pink-500/30">
                  <h4 className="text-black font-bold mb-2 text-lg">❤️ 애정운 (桃花)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.love}</p>
                </div>

                <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-xl p-4 border border-red-500/30">
                  <h4 className="text-red-300 font-bold mb-2 text-lg">🏥 건강운 (壽命)</h4>
                  <p className="text-white text-sm leading-relaxed">{result.health}</p>
                </div>
              </div>

              {/* 상세 얼굴 분석 (오관 분석) */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-600">
                <h3 className="text-yellow-300 text-lg font-bold mb-4 text-center">👤 오관(五官) 상세 분석</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="bg-black/40 rounded-lg p-3 border-l-4 border-blue-500">
                    <h4 className="text-blue-300 font-bold mb-1">🧠 이마 (天庭 - 지혜와 미래)</h4>
                    <p className="text-gray-300 whitespace-pre-line">{result.detailedAnalysis.forehead}</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-3 border-l-4 border-purple-500">
                    <h4 className="text-purple-300 font-bold mb-1">👁️ 눈 (眼睛 - 현재와 인연)</h4>
                    <p className="text-gray-300 whitespace-pre-line">{result.detailedAnalysis.eyes}</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-3 border-l-4 border-green-500">
                    <h4 className="text-green-300 font-bold mb-1">👃 코 (鼻子 - 재물과 권력)</h4>
                    <p className="text-gray-300 whitespace-pre-line">{result.detailedAnalysis.nose}</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-3 border-l-4 border-red-500">
                    <h4 className="text-red-300 font-bold mb-1">👄 입 (嘴巴 - 식복과 인덕)</h4>
                    <p className="text-gray-300 whitespace-pre-line">{result.detailedAnalysis.mouth}</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-3 border-l-4 border-yellow-500">
                    <h4 className="text-yellow-300 font-bold mb-1">🦴 턱 (下巴 - 말년과 자손)</h4>
                    <p className="text-gray-300 whitespace-pre-line">{result.detailedAnalysis.chin}</p>
                  </div>
                </div>
              </div>

              {/* 십이궁(十二宮) 분석 */}
              <div className="bg-gradient-to-br from-yellow-900 to-orange-900 rounded-xl p-5 border border-yellow-600/50">
                <h3 className="text-yellow-200 text-lg font-bold mb-4 text-center">🏛️ 십이궁(十二宮) 종합 분석</h3>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-white leading-relaxed text-sm">{result.twelveHouses}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-amber-900/40 rounded p-2 text-center">
                    <p className="text-amber-300 font-bold">命宮</p>
                    <p className="text-amber-100 text-[10px]">운명</p>
                  </div>
                  <div className="bg-amber-900/40 rounded p-2 text-center">
                    <p className="text-amber-300 font-bold">財帛宮</p>
                    <p className="text-amber-100 text-[10px]">재물</p>
                  </div>
                  <div className="bg-amber-900/40 rounded p-2 text-center">
                    <p className="text-amber-300 font-bold">官祿宮</p>
                    <p className="text-amber-100 text-[10px]">직장</p>
                  </div>
                  <div className="bg-amber-900/40 rounded p-2 text-center">
                    <p className="text-amber-300 font-bold">福德宮</p>
                    <p className="text-amber-100 text-[10px]">복</p>
                  </div>
                  <div className="bg-amber-900/40 rounded p-2 text-center">
                    <p className="text-amber-300 font-bold">妻妾宮</p>
                    <p className="text-amber-100 text-[10px]">배우자</p>
                  </div>
                  <div className="bg-amber-900/40 rounded p-2 text-center">
                    <p className="text-amber-300 font-bold">田宅宮</p>
                    <p className="text-amber-100 text-[10px]">부동산</p>
                  </div>
                </div>
              </div>

              {/* 오행(五行) 분석 */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-600/50">
                <h3 className="text-slate-200 text-lg font-bold mb-4 text-center">☯️ 오행(五行) 분석</h3>
                <div className="bg-black/40 rounded-lg p-4 mb-4">
                  <p className="text-white leading-relaxed text-sm">{result.fiveElements}</p>
                </div>
                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                  <div className="bg-green-900/40 rounded-lg p-3 border border-green-600/30">
                    <p className="text-green-300 font-bold text-lg mb-1">木</p>
                    <p className="text-green-200 text-[10px]">목</p>
                    <p className="text-gray-400 text-[9px] mt-1">성장</p>
                  </div>
                  <div className="bg-red-900/40 rounded-lg p-3 border border-red-600/30">
                    <p className="text-red-300 font-bold text-lg mb-1">火</p>
                    <p className="text-red-200 text-[10px]">화</p>
                    <p className="text-gray-400 text-[9px] mt-1">열정</p>
                  </div>
                  <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-600/30">
                    <p className="text-yellow-300 font-bold text-lg mb-1">土</p>
                    <p className="text-yellow-200 text-[10px]">토</p>
                    <p className="text-gray-400 text-[9px] mt-1">안정</p>
                  </div>
                  <div className="bg-gray-700/40 rounded-lg p-3 border border-gray-500/30">
                    <p className="text-gray-300 font-bold text-lg mb-1">金</p>
                    <p className="text-gray-200 text-[10px]">금</p>
                    <p className="text-gray-400 text-[9px] mt-1">권위</p>
                  </div>
                  <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-600/30">
                    <p className="text-blue-300 font-bold text-lg mb-1">水</p>
                    <p className="text-blue-200 text-[10px]">수</p>
                    <p className="text-gray-400 text-[9px] mt-1">지혜</p>
                  </div>
                </div>
              </div>

              {/* SWOT 분석 */}
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-5 border border-indigo-500/50">
                <h3 className="text-indigo-200 text-lg font-bold mb-4 text-center">📊 SWOT 인생 전략 분석</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-black/30 rounded-lg p-3">
                    <h4 className="text-green-300 font-bold mb-2">💪 Strengths (강점)</h4>
                    {result.strengths.map((s, i) => (
                      <p key={i} className="text-gray-300 mb-1">• {s}</p>
                    ))}
                  </div>

                  <div className="bg-black/30 rounded-lg p-3">
                    <h4 className="text-yellow-300 font-bold mb-2">⚠️ Weaknesses (약점)</h4>
                    {result.weaknesses.map((w, i) => (
                      <p key={i} className="text-gray-300 mb-1">• {w}</p>
                    ))}
                  </div>

                  <div className="bg-black/30 rounded-lg p-3">
                    <h4 className="text-blue-300 font-bold mb-2">🚀 Opportunities (기회)</h4>
                    {result.opportunities.map((o, i) => (
                      <p key={i} className="text-gray-300 mb-1">• {o}</p>
                    ))}
                  </div>

                  <div className="bg-black/30 rounded-lg p-3">
                    <h4 className="text-red-300 font-bold mb-2">⛔ Threats (위협)</h4>
                    {result.threats.map((t, i) => (
                      <p key={i} className="text-gray-300 mb-1">• {t}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* 행운 정보 */}
              <div className="bg-gradient-to-r from-amber-950/80 to-yellow-950/80 rounded-xl p-5 border border-amber-500/30">
                <h4 className="text-amber-300 font-bold mb-4 text-center text-lg">🍀 당신의 행운 코드</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-black/40 rounded-lg p-3">
                    <p className="text-amber-400 text-xs mb-1">행운의 색</p>
                    <p className="text-white font-bold text-lg">{result.luckyColor}</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3">
                    <p className="text-amber-400 text-xs mb-1">행운의 숫자</p>
                    <p className="text-white font-bold text-lg">{result.luckyNumber}</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3">
                    <p className="text-amber-400 text-xs mb-1">행운의 방향</p>
                    <p className="text-white font-bold text-lg">{result.luckyDirection}</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3">
                    <p className="text-amber-400 text-xs mb-1">행운의 달</p>
                    <p className="text-white font-bold text-lg">{result.luckyMonth}</p>
                  </div>
                </div>
              </div>

              {/* 추천 운기 상승템 */}
              <div className="bg-gradient-to-r from-green-950/70 to-emerald-950/70 rounded-xl p-5 border border-green-500/30">
                <h4 className="text-green-300 font-bold mb-4 text-center text-lg">💊 맞춤 운기 상승 보충제</h4>
                <p className="text-center text-gray-300 text-xs mb-4">당신의 관상에 맞는 건강 보조제입니다</p>
                <div className="space-y-2">
                  {result.recommendations.map((item, idx) => (
                    <div
                      key={idx}
                      className="block bg-white/10 rounded-lg p-3 border border-green-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold text-sm">✨ {item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 다시 하기 버튼 */}
              <button
                onClick={reset}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:from-gray-500 hover:to-gray-600 transition-all"
              >
                🔄 다른 사진으로 분석하기
              </button>
            </div>
          )}

          {/* 안내 */}
          <div className="mt-6 p-4 bg-amber-950/30 rounded-xl border border-amber-500/20">
            <p className="text-amber-300 text-xs text-center leading-relaxed">
              ※ 본 서비스는 300년 전통 관상학 이론(삼정·오관·십이궁·오행)을 기반으로 한 엔터테인먼트 분석입니다.<br />
              사진은 브라우저에서만 처리되며 서버에 저장되지 않습니다.<br />
              실제 미래 예측이 아니며 재미와 영감을 위한 참고자료로만 활용하세요.
            </p>
          </div>
        </section>

        {/* Canvas (숨김) */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}
