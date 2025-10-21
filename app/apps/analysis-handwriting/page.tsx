'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function HandwritingAnalysisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputMethod, setInputMethod] = useState<'draw' | 'upload'>('draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기 설정
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setResult(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 캔버스 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 이미지를 캔버스에 맞게 그리기
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const analyze = () => {
    // 방대한 손글씨 성격 분석 데이터
    const personalityTraits = [
      {
        category: '외향성',
        traits: [
          { name: '사교성', description: '사람들과 어울리기를 좋아함' },
          { name: '활동성', description: '에너지가 넘치고 적극적' },
          { name: '열정', description: '일에 대한 열정이 강함' },
        ]
      },
      {
        category: '성실성',
        traits: [
          { name: '책임감', description: '맡은 일을 끝까지 완수' },
          { name: '계획성', description: '체계적으로 일을 진행' },
          { name: '신중함', description: '결정 전 신중히 고려' },
        ]
      },
      {
        category: '개방성',
        traits: [
          { name: '창의성', description: '새로운 아이디어를 잘 냄' },
          { name: '호기심', description: '새로운 것에 관심이 많음' },
          { name: '예술성', description: '감각이 뛰어나고 미적 감각 우수' },
        ]
      },
      {
        category: '친화성',
        traits: [
          { name: '공감능력', description: '타인의 감정을 잘 이해' },
          { name: '협동심', description: '팀워크를 중시하고 협력적' },
          { name: '배려심', description: '다른 사람을 잘 배려' },
        ]
      },
      {
        category: '정서 안정성',
        traits: [
          { name: '침착함', description: '어려운 상황에서도 냉정' },
          { name: '자신감', description: '자신에 대한 믿음이 강함' },
          { name: '긍정성', description: '낙관적이고 밝은 성격' },
        ]
      }
    ];

    // 랜덤으로 3-5개 카테고리 선택
    const numCategories = Math.floor(Math.random() * 3) + 3;
    const selectedCategories = [...personalityTraits]
      .sort(() => Math.random() - 0.5)
      .slice(0, numCategories);

    const personalities = selectedCategories.map(category => {
      const selectedTrait = category.traits[Math.floor(Math.random() * category.traits.length)];
      return {
        trait: `${category.category} - ${selectedTrait.name}`,
        description: selectedTrait.description,
        score: Math.floor(Math.random() * 30) + 65
      };
    });

    const characteristicsPool = [
      '글씨 크기가 일정하여 안정적인 성격을 나타냅니다',
      '필압이 강해 자신감과 추진력이 있습니다',
      '자간이 적절하여 균형감각이 뛰어납니다',
      '글씨가 우측으로 기울어져 미래지향적입니다',
      '획이 부드러워 감성적이고 온화한 성격입니다',
      '글씨가 크고 시원해 외향적이고 사교적입니다',
      '작은 글씨로 세심하고 꼼꼼한 성격입니다',
      '동그란 형태가 많아 친근하고 다정한 이미지입니다',
      '각진 글씨로 논리적이고 분석적입니다',
      '일정한 간격으로 체계적이고 계획적입니다',
      '창의적인 필체로 예술적 감각이 뛰어납니다',
      '글씨 연결이 자연스러워 사고의 흐름이 원활합니다',
      '획이 선명하여 의지가 확고하고 결단력이 있습니다',
      '여유있는 자간으로 타인을 배려하는 마음이 큽니다',
      '글씨 높이가 고르지 않아 감정 기복이 있을 수 있습니다',
    ];

    const characteristics = [...characteristicsPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const overallMessages = [
      '균형잡힌 성격의 소유자로 대인관계가 원만합니다',
      '열정적이고 추진력이 강한 리더형 인재입니다',
      '섬세하고 배려심 깊은 조화로운 성격입니다',
      '창의적이고 독창적인 사고를 가진 예술가 기질입니다',
      '차분하고 신중한 완벽주의자 성향이 있습니다',
      '활발하고 긍정적인 에너지를 가진 분입니다',
      '논리적이고 분석적인 사고력이 뛰어납니다',
      '감성적이고 따뜻한 마음을 가진 분입니다',
    ];

    const overall = overallMessages[Math.floor(Math.random() * overallMessages.length)];

    const advicePool = [
      '💡 글씨 크기를 일정하게 유지하면 더욱 안정적인 인상을 줍니다',
      '💡 자간을 조금 넓히면 여유로운 이미지를 표현할 수 있습니다',
      '💡 획을 부드럽게 연결하면 친근한 느낌을 줄 수 있습니다',
      '💡 필압을 일정하게 유지하면 균형잡힌 인상을 줍니다',
      '💡 글씨 각도를 일정하게 하면 신뢰감을 줄 수 있습니다',
    ];

    const advice = [...advicePool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setResult({
      personalities,
      characteristics,
      overall,
      advice,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-600 dark:via-pink-600 dark:to-red-600 py-8 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
          ✍️ 손글씨 성향 분석
        </h1>
        <p className="text-center text-purple-900 dark:text-purple-100 mb-8 text-sm md:text-base">당신의 필체로 성격을 분석합니다</p>

        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 space-y-6">
          {/* 입력 방식 선택 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setInputMethod('draw');
                clearCanvas();
              }}
              className={`py-3 rounded-xl font-bold transition-all ${
                inputMethod === 'draw'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white'
              }`}
            >
              ✍️ 직접 쓰기
            </button>
            <button
              onClick={() => {
                setInputMethod('upload');
                clearCanvas();
              }}
              className={`py-3 rounded-xl font-bold transition-all ${
                inputMethod === 'upload'
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                  : 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white'
              }`}
            >
              📤 이미지 업로드
            </button>
          </div>

          {/* 캔버스 */}
          <div>
            <p className="text-gray-900 dark:text-white font-bold mb-3 text-center text-sm md:text-base">
              {inputMethod === 'draw' 
                ? '아래 캔버스에 자유롭게 글씨를 써주세요'
                : '손글씨 이미지를 업로드해주세요'}
            </p>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full bg-white rounded-xl cursor-crosshair touch-none"
                onMouseDown={inputMethod === 'draw' ? startDrawing : undefined}
                onMouseMove={inputMethod === 'draw' ? draw : undefined}
                onMouseUp={inputMethod === 'draw' ? stopDrawing : undefined}
                onMouseLeave={inputMethod === 'draw' ? stopDrawing : undefined}
                onTouchStart={inputMethod === 'draw' ? startDrawing : undefined}
                onTouchMove={inputMethod === 'draw' ? draw : undefined}
                onTouchEnd={inputMethod === 'draw' ? stopDrawing : undefined}
                style={{ touchAction: 'none' }}
              />
              {inputMethod === 'upload' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-gray-400 text-center">
                    <div className="text-5xl mb-2">📷</div>
                    <p className="text-sm">이미지를 업로드하세요</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 업로드 버튼 (업로드 모드일 때만) */}
          {inputMethod === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-6 py-4 rounded-xl font-bold text-base md:text-lg hover:shadow-lg transition-all"
              >
                📤 이미지 선택하기
              </button>
            </div>
          )}

          {/* 버튼 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={clearCanvas}
              className="bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white px-6 py-4 rounded-xl font-bold text-sm md:text-base hover:bg-gray-300 dark:hover:bg-white/30 transition-all"
            >
              🗑️ 지우기
            </button>
            <button
              onClick={analyze}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all"
            >
              🔍 분석하기
            </button>
          </div>

          {result && (
            <div className="space-y-4 pt-4">
              {/* 종합 평가 */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white text-center">
                <div className="text-5xl mb-3">✨</div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">종합 평가</h3>
                <p className="text-base md:text-lg">{result.overall}</p>
              </div>

              {/* 성격 분석 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                  🎯 성격 특성
                </h3>
                <div className="space-y-4">
                  {result.personalities.map((item: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <span className="font-bold text-gray-800 dark:text-white text-sm md:text-base">{item.trait}</span>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                        </div>
                        <span className="font-bold text-purple-600 dark:text-purple-400 text-lg ml-3">{item.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 필적 특징 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h4 className="font-bold text-gray-800 dark:text-white mb-4 text-lg md:text-xl">📝 필적 특징</h4>
                <ul className="space-y-3">
                  {result.characteristics.map((char: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-purple-600 dark:text-purple-400 text-lg">✓</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base flex-1">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 개선 조언 */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                <h4 className="font-bold mb-3 text-lg md:text-xl">💬 개선 팁</h4>
                <ul className="space-y-2 text-sm md:text-base">
                  {result.advice.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* 안내 */}
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-xl p-4 text-gray-900 dark:text-white">
                <p className="text-xs md:text-sm text-center">
                  ⚠️ 이 분석은 엔터테인먼트 목적이며 과학적 근거는 제한적입니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 돌아가기 */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-gray-200 dark:bg-white/20 hover:bg-gray-300 dark:hover:bg-white/30 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
