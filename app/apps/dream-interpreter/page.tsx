'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

interface DreamResult {
  keyword: string;
  meaning: string;
  luckyNumber: number[];
  advice: string;
  category: string;
}

const dreamDatabase: Record<string, DreamResult> = {
  '돈': { keyword: '돈', meaning: '재물운이 상승하고 있습니다. 새로운 기회가 찾아올 수 있습니다.', luckyNumber: [7, 14, 21, 28, 35, 42], advice: '투자나 재테크에 관심을 가져보세요.', category: '재물' },
  '뱀': { keyword: '뱀', meaning: '지혜와 변화를 상징합니다. 인생의 전환점이 될 수 있습니다.', luckyNumber: [3, 9, 15, 21, 27, 33], advice: '새로운 도전을 두려워하지 마세요.', category: '동물' },
  '호랑이': { keyword: '호랑이', meaning: '권력과 성공을 의미합니다. 승진이나 승리의 기회가 있습니다.', luckyNumber: [1, 10, 19, 28, 37, 46], advice: '자신감을 가지고 앞으로 나아가세요.', category: '동물' },
  '물': { keyword: '물', meaning: '재물과 감정의 흐름을 나타냅니다. 깨끗한 물은 좋은 징조입니다.', luckyNumber: [2, 8, 16, 24, 32, 40], advice: '마음을 정화하고 긍정적으로 생각하세요.', category: '자연' },
  '불': { keyword: '불', meaning: '정열과 에너지를 상징합니다. 큰 성취를 이룰 수 있습니다.', luckyNumber: [5, 11, 17, 23, 29, 35], advice: '열정을 가지고 목표를 향해 나아가세요.', category: '자연' },
  '꽃': { keyword: '꽃', meaning: '사랑과 행복이 찾아옵니다. 좋은 인연을 만날 수 있습니다.', luckyNumber: [4, 12, 20, 28, 36, 44], advice: '주변 사람들에게 따뜻하게 대하세요.', category: '식물' },
  '나무': { keyword: '나무', meaning: '성장과 안정을 의미합니다. 꾸준한 노력이 결실을 맺습니다.', luckyNumber: [6, 13, 18, 25, 31, 38], advice: '인내심을 가지고 차근차근 진행하세요.', category: '식물' },
  '집': { keyword: '집', meaning: '안정과 가족을 상징합니다. 가정에 행복이 찾아옵니다.', luckyNumber: [8, 15, 22, 29, 36, 43], advice: '가족과 소중한 시간을 보내세요.', category: '건물' },
  '차': { keyword: '차', meaning: '이동과 변화를 나타냅니다. 새로운 환경이나 기회가 올 수 있습니다.', luckyNumber: [9, 16, 23, 30, 37, 44], advice: '변화를 긍정적으로 받아들이세요.', category: '사물' },
  '비행기': { keyword: '비행기', meaning: '비상과 성취를 의미합니다. 목표 달성이 가까워집니다.', luckyNumber: [11, 17, 24, 31, 38, 45], advice: '높은 목표를 세우고 도전하세요.', category: '사물' },
};

export default function DreamInterpreterPage() {
  const [dreamText, setDreamText] = useState('');
  const [result, setResult] = useState<DreamResult | null>(null);

  const handleInterpret = () => {
    if (!dreamText.trim()) {
      alert('꿈 내용을 입력해주세요!');
      return;
    }

    // 입력된 텍스트에서 키워드 찾기
    let foundResult: DreamResult | null = null;
    for (const [key, value] of Object.entries(dreamDatabase)) {
      if (dreamText.includes(key)) {
        foundResult = value;
        break;
      }
    }

    // 키워드를 찾지 못한 경우 기본 해몽
    if (!foundResult) {
      foundResult = {
        keyword: '일반',
        meaning: '꿈은 당신의 무의식이 보내는 메시지입니다. 꿈 속의 감정과 상황을 되돌아보세요.',
        luckyNumber: Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1),
        advice: '꿈에서 느낀 감정이 중요합니다. 긍정적인 마음을 유지하세요.',
        category: '일반',
      };
    }

    setResult(foundResult);
  };

  return (
    <PremiumLayout theme="indigo">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            💭 꿈해몽
          </h1>
          <p className="text-xl text-white/80">전통 꿈해몽으로 꿈의 의미를 해석해드립니다</p>
        </div>

        {/* Input Card */}
        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">어떤 꿈을 꾸셨나요?</h2>
          
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="예: 호랑이가 나타났어요, 돈을 주웠어요..."
            className="w-full px-6 py-4 rounded sm:rounded-lg md:rounded-2xl text-black text-lg border-2 border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/30 transition-all resize-none"
            rows={6}
          />

          <div className="mt-6 text-center">
            <PremiumButton
              onClick={handleInterpret}
              variant="primary"
              size="lg"
              icon="🔮"
              fullWidth
            >
              꿈해몽 시작하기
            </PremiumButton>
          </div>

          {/* 인기 키워드 */}
          <div className="mt-8">
            <h3 className="text-white text-sm font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-center">💡 인기 키워드</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.keys(dreamDatabase).map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setDreamText(keyword)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm border border-white/20 transition-all duration-300 hover:scale-110"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </PremiumCard>

        {/* Result */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-bounce-slow">🌙</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  "{result.keyword}" 꿈의 해석
                </h2>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white rounded-full text-sm border border-white/20">
                  {result.category}
                </span>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 flex items-center gap-2">
                  <span className="text-xl">✨</span> 꿈의 의미
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">{result.meaning}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-yellow-400/30 mb-6">
                <h3 className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 flex items-center gap-2">
                  <span className="text-xl">🎯</span> 조언
                </h3>
                <p className="text-white/90 leading-relaxed">{result.advice}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-green-400/30">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">🍀</span> 행운의 번호
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-0 sm:gap-1.5 md:gap-3">
                  {result.luckyNumber.map((num, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:scale-110 transition-all duration-300"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="text-3xl font-bold text-white">{num}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <PremiumButton
                  onClick={() => {
                    setDreamText('');
                    setResult(null);
                  }}
                  variant="secondary"
                  size="md"
                  icon="🔄"
                >
                  다른 꿈 해석하기
                </PremiumButton>
              </div>
            </PremiumCard>

            {/* Related Apps */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <RelatedApps 
                relatedAppIds={['today-fortune', 'color-psychology', 'mbti-test', 'voice-fortune']} 
                currentAppId="dream-interpreter" 
              />
            </div>
          </div>
        )}
      </div>

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

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
