'use client';

import { useState, useRef } from 'react';

export default function HandwritingAnalysisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
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

  const analyze = () => {
    // 엔터테인먼트용 랜덤 분석
    const personalities = [
      { trait: '외향적', score: Math.floor(Math.random() * 40) + 60 },
      { trait: '꼼꼼함', score: Math.floor(Math.random() * 40) + 50 },
      { trait: '창의성', score: Math.floor(Math.random() * 40) + 55 },
      { trait: '리더십', score: Math.floor(Math.random() * 40) + 50 },
      { trait: '감성', score: Math.floor(Math.random() * 40) + 60 },
    ];

    const characteristics = [
      '글씨가 일정한 패턴을 보입니다',
      '필압이 안정적입니다',
      '자간이 적절합니다',
      '창의적인 필체를 가지고 있습니다',
    ];

    setResult({
      personalities,
      characteristics,
      overall: '균형잡힌 성격의 소유자입니다',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
          ✍️ 손글씨 필적 분석
        </h1>
        <p className="text-center text-purple-100 mb-12">당신의 필체로 성격을 분석합니다</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
          <div>
            <p className="text-white font-bold mb-4 text-center">
              아래 캔버스에 자유롭게 글씨를 써주세요
            </p>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full bg-white rounded-xl cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: 'none' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={clearCanvas}
              className="bg-white/20 text-white px-6 py-4 rounded-xl font-bold"
            >
              지우기
            </button>
            <button
              onClick={analyze}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold"
            >
              분석하기
            </button>
          </div>

          {result && (
            <div className="space-y-6 pt-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  성격 분석 결과
                </h3>
                <p className="text-center text-gray-600 mb-6">{result.overall}</p>

                <div className="space-y-4">
                  {result.personalities.map((item: any) => (
                    <div key={item.trait}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">{item.trait}</span>
                        <span className="font-bold text-purple-600">{item.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="font-bold text-gray-800 mb-3 text-lg">필적 특징</h4>
                <ul className="space-y-2">
                  {result.characteristics.map((char: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span className="text-gray-700">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                <h4 className="font-bold mb-2">💡 알고 계셨나요?</h4>
                <p className="text-sm">
                  필적 분석(Graphology)은 19세기부터 연구된 분야로, 글씨체에서 성격과 심리 상태를 
                  파악하려는 시도입니다. 이 분석은 엔터테인먼트 목적이며 과학적 근거는 제한적입니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

