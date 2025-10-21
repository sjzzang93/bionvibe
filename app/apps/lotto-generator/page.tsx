"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

export default function LottoGenerator() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<number[][]>([]);

  // 로또 번호 생성
  const generateNumbers = () => {
    setIsGenerating(true);
    
    // 애니메이션 효과
    let count = 0;
    const interval = setInterval(() => {
      const temp = [];
      for (let i = 0; i < 6; i++) {
        temp.push(Math.floor(Math.random() * 45) + 1);
      }
      setNumbers(temp);
      count++;
      
      if (count > 20) {
        clearInterval(interval);
        
        // 최종 번호 생성
        const finalNumbers: number[] = [];
        const available = Array.from({ length: 45 }, (_, i) => i + 1);
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < 6; i++) {
          finalNumbers.push(shuffled[i]);
        }
        
        const sorted = finalNumbers.sort((a, b) => a - b);
        setNumbers(sorted);
        setHistory(prev => [sorted, ...prev.slice(0, 9)]);
        setIsGenerating(false);
      }
    }, 50);
  };

  // 번호 색상
  const getNumberColor = (num: number) => {
    if (num <= 10) return 'from-yellow-500 to-amber-500';
    if (num <= 20) return 'from-blue-500 to-cyan-500';
    if (num <= 30) return 'from-red-500 to-pink-500';
    if (num <= 40) return 'from-gray-600 to-gray-700';
    return 'from-green-500 to-emerald-500';
  };

  // 자동 생성 (5개)
  const generateAuto = () => {
    const results: number[][] = [];
    const available = Array.from({ length: 45 }, (_, i) => i + 1);
    
    for (let i = 0; i < 5; i++) {
      const finalNumbers: number[] = [];
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < 6; j++) {
        finalNumbers.push(shuffled[j]);
      }
      
      results.push(finalNumbers.sort((a, b) => a - b));
    }
    
    setHistory(results);
  };

  return (
    <PremiumLayout theme="green">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-200 via-green-200 to-emerald-200 bg-clip-text text-transparent">
            🍀 로또 번호 생성기
          </h1>
          <p className="text-xl text-white/80">AI가 생성하는 행운의 번호</p>
        </div>

        {/* 메인 번호 표시 */}
        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          {numbers.length > 0 ? (
            <div className="text-center">
              <div className="text-white/70 text-sm mb-4 font-bold">이번 주 추천 번호</div>
              <div className="flex justify-center gap-3 md:gap-4 mb-8">
                {numbers.map((num, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl md:text-3xl bg-gradient-to-br ${getNumberColor(num)} shadow-2xl animate-bounce-slow`}
                    style={{ 
                      animationDelay: `${idx * 0.1}s`,
                      boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 animate-float">🎰</div>
              <p className="text-white text-xl mb-4">행운의 번호를 생성하세요!</p>
              <p className="text-white/70">1등 당첨을 기원합니다 🍀</p>
            </div>
          )}

          <div className="flex gap-2">
            <PremiumButton
              onClick={generateNumbers}
              disabled={isGenerating}
              variant="success"
              size="lg"
              icon="🎲"
              fullWidth
            >
              {isGenerating ? '생성 중...' : '번호 생성하기'}
            </PremiumButton>
            
            <PremiumButton
              onClick={generateAuto}
              variant="primary"
              size="lg"
              icon="⚡"
            >
              자동 5개
            </PremiumButton>
          </div>
        </PremiumCard>

        {/* 생성 히스토리 */}
        {history.length > 0 && (
          <PremiumCard hover className="mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-white text-xl font-bold mb-6 text-center">🎯 생성된 번호 목록</h3>
            <div className="space-y-4">
              {history.map((nums, setIdx) => (
                <div key={setIdx} className="bg-white/5 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-0 sm:gap-1.5 md:gap-3">
                    <div className="text-white/70 font-bold w-12">#{setIdx + 1}</div>
                    <div className="flex gap-2 flex-wrap flex-1">
                      {nums.map((num, idx) => (
                        <div
                          key={idx}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-xs md:text-sm bg-gradient-to-br ${getNumberColor(num)} shadow-lg`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        )}

        {/* 안내 */}
        <PremiumCard className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="space-y-4 text-white/80 text-sm">
            <div className="flex items-start gap-0 sm:gap-1.5 md:gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-bold mb-1">로또 번호 색상 의미</div>
                <div className="space-y-1 text-xs">
                  <div><span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>1-10번 (노랑)</div>
                  <div><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>11-20번 (파랑)</div>
                  <div><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>21-30번 (빨강)</div>
                  <div><span className="inline-block w-3 h-3 rounded-full bg-gray-700 mr-2"></span>31-40번 (회색)</div>
                  <div><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>41-45번 (초록)</div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-0 sm:gap-1.5 md:gap-3">
              <span className="text-2xl">🎰</span>
              <div>
                <div className="font-bold mb-1">완전 무작위 생성</div>
                <p className="text-xs">모든 번호는 동일한 확률로 생성됩니다. 행운을 빕니다!</p>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* Related Apps */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps 
            relatedAppIds={['today-fortune', 'dream-interpreter', 'saju-mbti-jobs', 'past-life-job']} 
            currentAppId="lotto-generator" 
          />
        </div>
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
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

        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out;
        }
      `}</style>
    </PremiumLayout>
  );
}
