"use client";

import { useState } from 'react';

const COLORS = [
  { name: '빨강', hex: '#EF4444', psychology: '열정적, 적극적, 리더십', career: ['CEO', '영업', '정치인'], fortune: '재물운 상승, 승진운', element: '화' },
  { name: '주황', hex: '#F97316', psychology: '사교적, 활발함, 창의적', career: ['마케터', '기획자', '연예인'], fortune: '인기운, 사교운', element: '화' },
  { name: '노랑', hex: '#EAB308', psychology: '낙천적, 밝음, 지적', career: ['교육자', '연구원', '작가'], fortune: '지혜운, 학업운', element: '토' },
  { name: '초록', hex: '#22C55E', psychology: '평화로움, 치유, 안정', career: ['의료인', '상담사', '환경'], fortune: '건강운, 안정운', element: '목' },
  { name: '파랑', hex: '#3B82F6', psychology: '신뢰, 차분함, 이성적', career: ['공무원', '은행원', '회계사'], fortune: '신뢰운, 안정', element: '수' },
  { name: '남색', hex: '#6366F1', psychology: '깊이, 직관, 영성', career: ['철학자', '심리학자', '예술가'], fortune: '직관운, 영감', element: '수' },
  { name: '보라', hex: '#A855F7', psychology: '고귀함, 신비, 창의', career: ['예술가', '디자이너', '작가'], fortune: '예술운, 영감', element: '화' },
  { name: '분홍', hex: '#EC4899', psychology: '사랑, 낭만, 부드러움', career: ['상담사', '서비스업', '교육'], fortune: '애정운, 인기운', element: '화' },
  { name: '검정', hex: '#1F2937', psychology: '강함, 신비, 권위', career: ['CEO', '법조인', '디자이너'], fortune: '권력운, 카리스마', element: '수' },
  { name: '흰색', hex: '#F9FAFB', psychology: '순수함, 완벽, 깨끗함', career: ['의료인', '연구원', '예술가'], fortune: '정화운, 새출발', element: '금' },
  { name: '회색', hex: '#6B7280', psychology: '중립적, 신중함, 현실적', career: ['관리자', '분석가', '기술자'], fortune: '안정운, 균형', element: '금' },
  { name: '갈색', hex: '#92400E', psychology: '안정, 신뢰, 실용', career: ['건축', '부동산', '농업'], fortune: '재산운, 토지운', element: '토' }
];

export default function ColorPsychology() {
  const [selectedColors, setSelectedColors] = useState<typeof COLORS>([]);
  const [result, setResult] = useState<any>(null);

  const toggleColor = (color: typeof COLORS[0]) => {
    if (selectedColors.find(c => c.name === color.name)) {
      setSelectedColors(selectedColors.filter(c => c.name !== color.name));
    } else {
      if (selectedColors.length < 3) {
        setSelectedColors([...selectedColors, color]);
      }
    }
  };

  const analyze = () => {
    if (selectedColors.length === 0) {
      alert('최소 1개 색상을 선택하세요');
      return;
    }

    const personalities = selectedColors.map(c => c.psychology).join(', ');
    const careers = Array.from(new Set(selectedColors.flatMap(c => c.career))).slice(0, 6);
    const elements = selectedColors.map(c => c.element);
    const elementCount: Record<string, number> = {};
    elements.forEach(e => {
      elementCount[e] = (elementCount[e] || 0) + 1;
    });
    const dominantElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0][0];

    setResult({
      personalities,
      careers,
      dominantElement,
      selectedColors,
      interpretation: getInterpretation(selectedColors)
    });
  };

  const getInterpretation = (colors: typeof COLORS) => {
    if (colors.length === 1) {
      return `${colors[0].name} 하나만 선택 - 명확한 목표와 확고한 신념`;
    }
    if (colors.some(c => c.hex === '#EF4444') && colors.some(c => c.hex === '#3B82F6')) {
      return '빨강과 파랑 조합 - 열정과 이성의 균형, 완벽주의';
    }
    if (colors.every(c => ['#22C55E', '#3B82F6', '#A855F7'].includes(c.hex))) {
      return '한색 계열 - 차분하고 신중한 성격';
    }
    return '다양한 색상 - 균형잡힌 성격, 다재다능';
  };

  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 text-black dark:text-white placeholder-gray-500 transition-colors">
        <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
          <div className="mb-4 text-black placeholder-gray-500">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <h1 className="text-3xl font-bold text-black mb-2 text-black placeholder-gray-500">🎨</h1>
              <h2 className="text-2xl font-bold text-gray-800 text-black placeholder-gray-500">색상 심리 분석 결과</h2>
            </header>

            <div className="mb-6 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg mb-3 text-black placeholder-gray-500">선택한 색상</h3>
              <div className="flex gap-3 text-black placeholder-gray-500">
                {result.selectedColors.map((c: any, i: number) => (
                  <div key={i} className="flex-1 text-center text-black placeholder-gray-500">
                    <div className="w-full h-24 rounded-lg mb-2" style={{backgroundColor: c.hex}}></div>
                    <div className="font-semibold text-black placeholder-gray-500">{c.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg text-black placeholder-gray-500">
              <h3 className="font-bold text-lg mb-3 text-black placeholder-gray-500">🧠 심리 분석</h3>
              <p className="text-gray-700 text-black placeholder-gray-500">{result.personalities}</p>
              <p className="text-sm text-black mt-2 text-black placeholder-gray-500">오행: {result.dominantElement}</p>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-black placeholder-gray-500">
              <h3 className="font-bold text-lg mb-3 text-black placeholder-gray-500">💼 추천 직업</h3>
              <div className="flex flex-wrap gap-2 text-black placeholder-gray-500">
                {result.careers.map((career: string, i: number) => (
                  <span key={i} className="bg-green-100 px-3 py-1 rounded-full text-sm font-semibold text-black placeholder-gray-500">
                    {career}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setSelectedColors([]);
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg"
            >
              다시 테스트
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">
            
            <p className="text-xs text-gray-500 text-center px-4 text-black placeholder-gray-500">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-black placeholder-gray-500">
      <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
        <div className="mb-4 text-black placeholder-gray-500">
          
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-6 text-black placeholder-gray-500">
          <header className="text-center mb-6 text-black placeholder-gray-500">
            <h1 className="text-4xl font-bold text-black mb-2 text-black placeholder-gray-500">🎨</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-black placeholder-gray-500">색상 심리 테스트</h2>
            <p className="text-gray-600 text-black placeholder-gray-500">좋아하는 색으로 심리와 운세 분석</p>
          </header>

          <div className="mb-6 text-black placeholder-gray-500">
            <h3 className="font-bold text-lg mb-3 text-black placeholder-gray-500">마음에 드는 색상을 최대 3개 선택하세요</h3>
            <div className="grid grid-cols-3 gap-3 text-black placeholder-gray-500">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color)}
                  className={`relative p-4 rounded-lg transition-all ${
                    selectedColors.find(c => c.name === color.name)
                      ? 'ring-4 ring-purple-500 scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{backgroundColor: color.hex}}
                >
                  <div className="text-white font-bold text-sm drop-shadow-lg text-black placeholder-gray-500">
                    {color.name}
                  </div>
                  {selectedColors.find(c => c.name === color.name) && (
                    <div className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-black placeholder-gray-500">
                      <span className="text-black font-bold text-black placeholder-gray-500">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-center text-gray-500 mt-3 text-black placeholder-gray-500">
              선택됨: {selectedColors.length}/3
            </p>
          </div>

          <button
            onClick={analyze}
            disabled={selectedColors.length === 0}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg disabled:opacity-50"
          >
            심리 분석하기
          </button>
        </section>

        <footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">
          
          <p className="text-xs text-gray-500 text-center px-4 text-black placeholder-gray-500">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </footer>
      </div>
    </main>
  );
}

