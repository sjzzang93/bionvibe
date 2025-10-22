'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import { MOOD_DATA } from '@/lib/group3-data';

export default function MoodCheerUpPage() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const moods = MOOD_DATA.moodStates.slice(0, 12); // 상위 12개만

  const handleSelectMood = (moodName: string) => {
    const moodData = MOOD_DATA.moodStates.find(m => m.mood === moodName);
    setSelectedMood(moodName);
    setResult(moodData);
    setShowResult(true);
  };

  const reset = () => {
    setSelectedMood('');
    setResult(null);
    setShowResult(false);
  };

  return (
    <PremiumLayout theme="pink">
      <div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-6xl mx-auto">
          <PremiumHeader 
            icon="😊"
            title="기분 전환"
            subtitle="당신의 기분을 분석하고 맞춤 활동을 추천합니다"
            gradient="from-pink-200 via-rose-200 to-purple-200"
          />

          {!showResult ? (
            <PremiumCard gradient className="animate-slideUp">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-white font-bold text-2xl mb-4">
                    💭 지금 기분이 어떠신가요?
                  </h3>
                  <p className="text-white/80 mb-6">
                    현재 느끼는 감정을 선택해주세요
                  </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {moods.map((mood) => (
                    <button
        type="button"
                      key={mood.mood}
                      onClick={() => handleSelectMood(mood.mood)}
                      className="p-3 md:p-6 rounded-xl md:rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 group"
                    >
                      <div className="text-3xl md:text-5xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                        {mood.emoji}
                      </div>
                      <div className="font-bold text-sm md:text-lg mb-1">{mood.mood}</div>
                      <div className="text-xs opacity-70">{mood.intensity}</div>
                    </button>
                  ))}
                </div>
              </div>
            </PremiumCard>
          ) : result && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center mb-4 md:mb-8">
                <div className="text-5xl md:text-7xl mb-3 md:mb-4 animate-float">{result.emoji}</div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{result.mood}</h2>
                <p className="text-white/80 text-sm md:text-lg">{result.description}</p>
              </div>

              {/* 즉시 조치 */}
              <PremiumCard hover className="animate-fadeIn">
                <h3 className="text-white font-bold text-lg md:text-2xl mb-3 md:mb-4">🚀 지금 바로 해보세요</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {result.immediateActions.slice(0, 4).map((action: any, idx: number) => (
                    <div 
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20"
                    >
                      <h4 className="text-white font-bold text-sm md:text-base mb-2">{action.action}</h4>
                      <div className="flex flex-wrap gap-1 md:gap-2 mb-2">
                        <span className="bg-green-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
                          효과 {action.effectiveness}/10
                        </span>
                        <span className="bg-blue-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs">
                          ⏱️ {action.duration}
                        </span>
                        <span className="bg-purple-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs">
                          {action.difficulty}
                        </span>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2 md:p-3">
                        <p className="text-white/80 font-bold text-xs md:text-sm mb-1 md:mb-2">방법:</p>
                        <ul className="space-y-0.5 md:space-y-1">
                          {action.howTo.map((how: string, hIdx: number) => (
                            <li key={hIdx} className="text-white/70 text-[10px] md:text-xs flex items-start gap-1 md:gap-2">
                              <span>•</span>
                              <span>{how}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>

              {/* 추천 활동 */}
              <PremiumCard hover className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-white font-bold text-lg md:text-2xl mb-3 md:mb-4">🎯 추천 활동</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {[
                    { title: '실내 활동', items: result.activities.indoor, icon: '🏠' },
                    { title: '야외 활동', items: result.activities.outdoor, icon: '🌳' },
                    { title: '혼자 하기', items: result.activities.alone, icon: '👤' }
                  ].map((category, catIdx) => (
                    <div 
                      key={catIdx}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20"
                    >
                      <h4 className="text-white font-bold text-sm md:text-base mb-2 flex items-center gap-2">
                        <span className="text-xl md:text-2xl">{category.icon}</span>
                        {category.title}
                      </h4>
                      <ul className="space-y-1 md:space-y-2">
                        {category.items.slice(0, 5).map((item: string, iIdx: number) => (
                          <li key={iIdx} className="text-white/80 text-xs md:text-sm flex items-start gap-1 md:gap-2">
                            <span className="text-pink-300">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </PremiumCard>

              {/* 음악 추천 */}
              {result.music && (
                <PremiumCard hover className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-white font-bold text-2xl mb-4">🎵 음악 추천</h3>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20 mb-4">
                    <p className="text-white/80 mb-2">
                      <span className="font-bold">분위기:</span> {result.music.mood}
                    </p>
                    <p className="text-white/80">
                      <span className="font-bold">장르:</span> {result.music.genre.join(', ')}
                    </p>
                  </div>
                  {result.music.playlist && result.music.playlist.length > 0 && (
                    <div>
                      <h4 className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2">플레이리스트</h4>
                      {result.music.playlist.slice(0, 2).map((playlist: any, pIdx: number) => (
                        <div 
                          key={pIdx}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20 mb-0.5 sm:mb-1.5 md:mb-2"
                        >
                          <h5 className="text-white font-bold mb-2">{playlist.name}</h5>
                          <p className="text-white/70 text-sm mb-2">{playlist.why}</p>
                          <div className="flex flex-wrap gap-2">
                            {playlist.songs.slice(0, 3).map((song: string, sIdx: number) => (
                              <span key={sIdx} className="bg-pink-500/50 text-white px-3 py-1 rounded-full text-xs">
                                {song}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </PremiumCard>
              )}

              {/* 명언 */}
              {result.quotes && result.quotes.length > 0 && (
                <PremiumCard hover className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-white font-bold text-2xl mb-4">💬 위로의 한 마디</h3>
                  {result.quotes.slice(0, 3).map((quoteData: any, qIdx: number) => (
                    <div 
                      key={qIdx}
                      className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-4"
                    >
                      <p className="text-white text-lg italic mb-0.5 sm:mb-1.5 md:mb-2">"{quoteData.quote}"</p>
                      <p className="text-white/70 text-sm text-right">- {quoteData.author}</p>
                      <p className="text-pink-300 text-sm mt-2">{quoteData.why}</p>
                    </div>
                  ))}
                </PremiumCard>
              )}

              {/* 원인과 증상 */}
              <PremiumCard className="bg-blue-500/20 border-2 border-blue-400/30 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-white font-bold text-xl mb-4">💡 알아두세요</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  <div>
                    <h4 className="text-white font-bold mb-2">주요 원인</h4>
                    <ul className="space-y-1">
                      {result.commonCauses.map((cause: string, cIdx: number) => (
                        <li key={cIdx} className="text-white/80 text-sm">• {cause}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">신체 증상</h4>
                    <ul className="space-y-1">
                      {result.physicalSymptoms.map((symptom: string, sIdx: number) => (
                        <li key={sIdx} className="text-white/80 text-sm">• {symptom}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </PremiumCard>

              <PremiumButton
                onClick={reset}
                variant="secondary"
                size="lg"
                icon="🔄"
                fullWidth
              >
                다른 기분 선택하기
              </PremiumButton>
            </div>
          )}

          {/* Related Apps */}
          <div className="mt-12 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <RelatedApps 
              relatedAppIds={['quote-generator', 'focus-timer', 'habit-tracker', 'sleep-analyzer']} 
              currentAppId="mood-cheer-up" 
            />
          </div>
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
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}

