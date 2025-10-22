'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import { dreamDatabase, findDreamByKeyword, type DreamResult } from '@/lib/dreamDatabase';

export const dynamic = 'force-dynamic';

export default function DreamInterpreterPage() {
  const [dreamText, setDreamText] = useState('');
  const [result, setResult] = useState<DreamResult | null>(null);

  const handleInterpret = () => {
    if (!dreamText.trim()) {
      alert('꿈 내용을 입력해주세요!');
      return;
    }

    // 입력된 텍스트에서 키워드 찾기
    let foundResult = findDreamByKeyword(dreamText);

    // 키워드를 찾지 못한 경우 기본 해몽
    if (!foundResult) {
      foundResult = {
        keyword: '일반',
        meaning: '꿈은 당신의 무의식이 보내는 메시지입니다. 꿈 속의 감정과 상황을 되돌아보세요.',
        detailedMeaning: '꿈은 개인의 경험, 감정, 기억이 복합적으로 작용하여 만들어집니다. 특정 키워드가 없더라도 꿈에서 느낀 감정의 흐름과 분위기가 중요한 의미를 담고 있습니다. 밝고 평화로운 꿈이었다면 현재 심리 상태가 안정적임을, 불안하거나 혼란스러웠다면 해결이 필요한 과제가 있음을 암시합니다.',
        positiveAspects: ['내면 성찰 기회', '잠재의식과의 소통', '창의적 영감'],
        negativeAspects: ['구체적 해석 어려움', '불명확한 메시지'],
        luckyNumber: Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1),
        advice: '꿈에서 느낀 감정이 중요합니다. 긍정적인 마음을 유지하고, 꿈 일기를 작성하면 패턴을 발견할 수 있습니다.',
        relatedKeywords: ['감정', '무의식', '내면'],
        category: '일반',
        fortuneRating: 5,
        traditionalMeaning: '모든 꿈은 하늘이 주는 계시로 여겨졌습니다.',
        modernMeaning: '꿈은 무의식의 자기조절 과정입니다.',
        actionTips: ['꿈 일기 시작하기', '감정 패턴 관찰', '수면 환경 개선'],
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
        type="button"
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
                <div className="flex gap-2 justify-center items-center flex-wrap">
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white rounded-full text-sm border border-white/20">
                    {result.category}
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-white rounded-full text-sm border border-yellow-400/30">
                    ⭐ 길몽 지수: {result.fortuneRating}/10
                  </span>
                </div>
              </div>

              {/* 기본 의미 */}
              <div className="bg-white/5 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">✨</span> 꿈의 의미
                </h3>
                <p className="text-white/90 text-lg leading-relaxed mb-4">{result.meaning}</p>
                <p className="text-white/80 leading-relaxed">{result.detailedMeaning}</p>
              </div>

              {/* 긍정적 측면 */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-green-400/30 mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">💚</span> 긍정적 해석
                </h3>
                <ul className="space-y-2">
                  {result.positiveAspects.map((aspect, idx) => (
                    <li key={idx} className="text-white/90 leading-relaxed flex items-start gap-2">
                      <span className="text-green-300 mt-1">•</span>
                      <span>{aspect}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 주의사항 */}
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-orange-400/30 mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> 주의할 점
                </h3>
                <ul className="space-y-2">
                  {result.negativeAspects.map((aspect, idx) => (
                    <li key={idx} className="text-white/90 leading-relaxed flex items-start gap-2">
                      <span className="text-orange-300 mt-1">•</span>
                      <span>{aspect}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 전통 vs 현대 해석 */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-amber-400/30">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">📜</span> 전통 해몽
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">{result.traditionalMeaning}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-blue-400/30">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">🧠</span> 현대 심리학
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">{result.modernMeaning}</p>
                </div>
              </div>

              {/* 실천 조언 */}
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-indigo-400/30 mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">🎯</span> 실천 조언
                </h3>
                <p className="text-white/90 leading-relaxed mb-4">{result.advice}</p>
                <div className="space-y-2">
                  <h4 className="text-white/80 font-semibold text-sm mb-2">구체적 행동 지침:</h4>
                  {result.actionTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-white/80 text-sm">
                      <span className="text-indigo-300">✓</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 행운의 번호 */}
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-pink-400/30 mb-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">🍀</span> 행운의 번호
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
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

              {/* 연관 키워드 */}
              <div className="bg-white/5 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">🔗</span> 연관 키워드
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.relatedKeywords.map((keyword, idx) => (
                    <button
        type="button"
                      key={idx}
                      onClick={() => {
                        const foundResult = findDreamByKeyword(keyword);
                        if (foundResult) {
                          setResult(foundResult);
                          setDreamText(keyword);
                        }
                      }}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm border border-white/20 transition-all duration-300 hover:scale-105"
                    >
                      {keyword}
                    </button>
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
