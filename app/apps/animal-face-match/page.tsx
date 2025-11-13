'use client';

import { useState, useRef } from 'react';

import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';
interface Animal {
  id: string;
  name: string;
  emoji: string;
  traits: string[];
  description: string;
  percentage: number;
}

const ANIMALS: Omit<Animal, 'percentage'>[] = [
  {
    id: 'dog',
    name: '강아지',
    emoji: '🐶',
    traits: ['충성스러운', '활발한', '사교적인', '애교가 많은'],
    description: '친구들과 함께 있을 때 가장 행복한 당신! 에너지가 넘치고 사람들을 좋아하는 강아지상이에요.',
  },
  {
    id: 'cat',
    name: '고양이',
    emoji: '🐱',
    traits: ['독립적인', '도도한', '신비로운', '깔끔한'],
    description: '혼자만의 시간을 즐기는 당신! 자유로운 영혼을 가진 고양이상이에요.',
  },
  {
    id: 'fox',
    name: '여우',
    emoji: '🦊',
    traits: ['영리한', '재치있는', '매력적인', '신중한'],
    description: '똑똑하고 재치있는 당신! 상황 판단이 빠르고 매력적인 여우상이에요.',
  },
  {
    id: 'rabbit',
    name: '토끼',
    emoji: '🐰',
    traits: ['귀여운', '순수한', '민첩한', '조심스러운'],
    description: '사랑스럽고 순수한 당신! 누구나 보호하고 싶어하는 토끼상이에요.',
  },
  {
    id: 'bear',
    name: '곰',
    emoji: '🐻',
    traits: ['든든한', '포근한', '느긋한', '강인한'],
    description: '믿음직하고 따뜻한 당신! 주변 사람들의 버팀목이 되는 곰상이에요.',
  },
  {
    id: 'tiger',
    name: '호랑이',
    emoji: '🐯',
    traits: ['카리스마', '용감한', '리더십', '당당한'],
    description: '강렬하고 카리스마 넘치는 당신! 타고난 리더십을 가진 호랑이상이에요.',
  },
  {
    id: 'hamster',
    name: '햄스터',
    emoji: '🐹',
    traits: ['귀여운', '부지런한', '작은', '활동적인'],
    description: '꼬물꼬물 귀여운 당신! 작지만 열심히 사는 햄스터상이에요.',
  },
  {
    id: 'deer',
    name: '사슴',
    emoji: '🦌',
    traits: ['우아한', '차분한', '섬세한', '고상한'],
    description: '우아하고 품위있는 당신! 세련된 매력을 가진 사슴상이에요.',
  },
  {
    id: 'penguin',
    name: '펭귄',
    emoji: '🐧',
    traits: ['귀여운', '충실한', '사교적인', '재미있는'],
    description: '귀엽고 사랑스러운 당신! 친구들과 함께 노는 것을 좋아하는 펭귄상이에요.',
  },
  {
    id: 'lion',
    name: '사자',
    emoji: '🦁',
    traits: ['왕같은', '자신감', '용맹한', '위엄있는'],
    description: '당당하고 위엄있는 당신! 타고난 왕의 기질을 가진 사자상이에요.',
  },
  {
    id: 'koala',
    name: '코알라',
    emoji: '🐨',
    traits: ['느긋한', '평화로운', '여유로운', '귀여운'],
    description: '여유롭고 평화로운 당신! 자신만의 템포로 사는 코알라상이에요.',
  },
  {
    id: 'panda',
    name: '판다',
    emoji: '🐼',
    traits: ['귀여운', '느긋한', '독특한', '희귀한'],
    description: '특별하고 귀여운 당신! 세상에 하나뿐인 매력을 가진 판다상이에요.',
  },
];

export default function AnimalFaceMatchPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<Animal | null>(null);
  const [topMatches, setTopMatches] = useState<Animal[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
        setTopMatches([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    // 시뮬레이션: 랜덤 분석 (실제로는 AI 분석)
    setTimeout(() => {
      // 랜덤 퍼센티지 생성
      const shuffled = ANIMALS.map((animal) => ({
        ...animal,
        percentage: Math.floor(Math.random() * 40) + 60, // 60-100%
      })).sort((a, b) => b.percentage - a.percentage);

      setResult(shuffled[0]);
      setTopMatches(shuffled.slice(0, 3));
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setTopMatches([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
            🐶🐱🦊
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            닮은 동물 찾기
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-2">
            AI가 당신의 얼굴에서 동물상을 찾아드려요!
          </p>
          <p className="text-sm sm:text-base text-white/70">
            사진을 업로드하고 분석해보세요
          </p>
        </header>

        {!selectedImage ? (
          // 업로드 화면
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">📸</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                얼굴 사진을 업로드하세요
              </h2>
              <p className="text-white/80 mb-6">
                정면 사진이 가장 정확해요!
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="block w-full max-w-md mx-auto py-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-2xl text-white text-xl font-bold text-center cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 touch-manipulation"
            >
              📷 사진 선택하기
            </label>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ANIMALS.slice(0, 8).map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white/20 rounded-xl p-4 text-center hover:bg-white/30 transition-all duration-300"
                >
                  <div className="text-4xl mb-2">{animal.emoji}</div>
                  <div className="text-white text-sm font-medium">{animal.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : !result ? (
          // 분석 대기 화면
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-6">사진이 업로드되었어요!</h2>
                {isAnalyzing ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-spin">🔄</div>
                    <p className="text-xl text-white mb-4">AI가 분석 중이에요...</p>
                    <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full animate-progress"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={analyzeImage}
                      className="w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-2xl text-white text-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 touch-manipulation"
                    >
                      🔍 동물상 분석하기!
                    </button>
                    <button
                      onClick={resetAnalysis}
                      className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl text-white font-bold transition-all duration-300 touch-manipulation"
                    >
                      🔄 다른 사진 선택
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // 결과 화면
          <div className="space-y-6">
            {/* 메인 결과 */}
            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-9xl mb-4">{result.emoji}</div>
                <h2 className="text-4xl sm:text-5xl font-black text-purple-600 mb-4">
                  당신은 {result.name}상!
                </h2>
                <div className="text-6xl font-black text-gradient bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
                  {result.percentage}% 일치
                </div>
                <p className="text-lg text-gray-700 mb-6">{result.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      #{trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <img
                  src={selectedImage}
                  alt="Your face"
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
                <div className="flex items-center justify-center">
                  <div className="text-9xl animate-bounce">{result.emoji}</div>
                </div>
              </div>
            </div>

            {/* Top 3 매치 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                다른 가능성들
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topMatches.map((animal, idx) => (
                  <div
                    key={animal.id}
                    className={`bg-white rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                      idx === 0 ? 'ring-4 ring-yellow-400' : ''
                    }`}
                  >
                    <div className="text-sm text-gray-500 mb-2">#{idx + 1}</div>
                    <div className="text-6xl mb-3">{animal.emoji}</div>
                    <div className="text-xl font-bold text-gray-800 mb-2">{animal.name}</div>
                    <div className="text-2xl font-black text-purple-600">{animal.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetAnalysis}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-white text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 touch-manipulation"
              >
                🔄 다시 하기
              </button>
              <button
                onClick={() => {
                  // 결과 공유 (추후 구현 가능)
                  alert('곧 SNS 공유 기능이 추가됩니다!');
                }}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-2xl text-white text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 touch-manipulation"
              >
                📤 공유하기
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>

      {/* 관련 앱 추천 */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <RelatedApps currentAppSlug="animal-face-match" />
      </div>
    </main>
  );
}
