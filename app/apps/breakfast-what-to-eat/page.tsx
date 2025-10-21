'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import { BREAKFAST_DATA } from '@/lib/group1-data';

export default function BreakfastRecommend() {
  const [timeAvailable, setTimeAvailable] = useState(15);
  const [goal, setGoal] = useState('건강식');
  const [difficulty, setDifficulty] = useState('쉬움');
  const [result, setResult] = useState<any>(null);

  const recommend = () => {
    // 시간, 목표, 난이도에 맞는 레시피 필터링
    const filtered = BREAKFAST_DATA.recipes.filter((recipe: any) => {
      const totalTime = recipe.prepTime + recipe.cookTime;
      return totalTime <= timeAvailable && 
             recipe.category.includes(goal) && 
             recipe.difficulty === difficulty;
    });

    // 랜덤으로 3개 추천
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 3);

    setResult(recommended);
  };

  return (
    <PremiumLayout theme="orange">
      <div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          <PremiumHeader 
            icon="🍳"
            title="아침식사 추천"
            subtitle="시간과 목표에 맞는 완벽한 아침 메뉴"
            gradient="from-orange-200 via-amber-200 to-yellow-200"
          />

          {!result ? (
            <PremiumCard gradient className="animate-slideUp">
              <div className="space-y-6">
                <div>
                  <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block text-lg">
                    ⏰ 가능한 시간: {timeAvailable}분
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(timeAvailable - 5) / 55 * 100}%, rgba(255,255,255,0.3) ${(timeAvailable - 5) / 55 * 100}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-white/80 mt-2">
                    <span>5분</span>
                    <span>30분</span>
                    <span>60분</span>
                  </div>
                </div>

                <div>
                  <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block text-lg">🎯 목표</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {['한식', '양식', '간편식', '건강식', '다이어트'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`py-4 rounded-xl font-bold transition-all ${
                          goal === g
                            ? 'bg-white text-orange-600 scale-105 shadow-xl'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block text-lg">👨‍🍳 난이도</label>
                  <div className="grid grid-cols-3 gap-0 sm:gap-1.5 md:gap-3">
                    {['쉬움', '보통', '어려움'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`py-4 rounded-xl font-bold transition-all ${
                          difficulty === d
                            ? 'bg-white text-orange-600 scale-105 shadow-xl'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <PremiumButton
                  onClick={recommend}
                  variant="success"
                  size="lg"
                  icon="🍳"
                  fullWidth
                >
                  추천받기
                </PremiumButton>
              </div>
            </PremiumCard>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">🎉 맞춤 추천 레시피</h2>
                <p className="text-white/80">당신의 조건에 딱 맞는 아침 메뉴입니다</p>
              </div>

              {result.length > 0 ? (
                <div className="grid gap-6">
                  {result.map((recipe: any, index: number) => (
                    <PremiumCard key={index} hover className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{recipe.name}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">
                              {recipe.category}
                            </span>
                            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">
                              {recipe.difficulty}
                            </span>
                            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                              {recipe.servings}인분
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-4xl font-bold text-orange-300">
                            {recipe.prepTime + recipe.cookTime}분
                          </div>
                          <div className="text-sm text-white/70">총 시간</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20">
                          <h4 className="font-bold text-white mb-0.5 sm:mb-1.5 md:mb-2 flex items-center gap-2">
                            📊 영양 정보
                          </h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-white/90">칼로리: <span className="font-bold text-orange-300">{recipe.nutrition?.calories}kcal</span></div>
                            <div className="text-white/90">단백질: <span className="font-bold text-blue-300">{recipe.nutrition?.protein}g</span></div>
                            <div className="text-white/90">탄수화물: <span className="font-bold text-yellow-300">{recipe.nutrition?.carbs}g</span></div>
                            <div className="text-white/90">지방: <span className="font-bold text-red-300">{recipe.nutrition?.fat}g</span></div>
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20">
                          <h4 className="font-bold text-white mb-0.5 sm:mb-1.5 md:mb-2 flex items-center gap-2">
                            💪 건강 효과
                          </h4>
                          <div className="space-y-1">
                            {recipe.benefits?.slice(0, 3).map((benefit: string, i: number) => (
                              <div key={i} className="text-sm text-white/90 flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-yellow-400/30">
                        <h4 className="font-bold text-white mb-0.5 sm:mb-1.5 md:mb-2 flex items-center gap-2">
                          🥘 필요한 재료
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {recipe.ingredients?.slice(0, 6).map((ing: any, i: number) => (
                            <div key={i} className="text-sm text-white/90">
                              • {ing.name} <span className="text-yellow-300 font-bold">{ing.amount}</span>
                            </div>
                          ))}
                          {recipe.ingredients?.length > 6 && (
                            <div className="text-sm text-white/70 italic col-span-2">
                              외 {recipe.ingredients.length - 6}개...
                            </div>
                          )}
                        </div>
                      </div>

                      {recipe.steps && recipe.steps.length > 0 && (
                        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20">
                          <h4 className="font-bold text-white mb-0.5 sm:mb-1.5 md:mb-2 flex items-center gap-2">
                            📝 조리 방법
                          </h4>
                          <div className="space-y-2">
                            {recipe.steps.slice(0, 3).map((step: string, i: number) => (
                              <div key={i} className="text-sm text-white/90 flex gap-2">
                                <span className="font-bold text-orange-300">{i + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                            {recipe.steps.length > 3 && (
                              <div className="text-sm text-white/70 italic">
                                외 {recipe.steps.length - 3}단계...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </PremiumCard>
                  ))}
                </div>
              ) : (
                <PremiumCard className="text-center py-12">
                  <div className="text-6xl mb-4 animate-float">😅</div>
                  <p className="text-white text-xl font-bold mb-4">
                    조건에 맞는 레시피가 없습니다
                  </p>
                  <p className="text-white/70">
                    시간이나 난이도를 조정해보세요
                  </p>
                </PremiumCard>
              )}

              <PremiumButton
                onClick={() => setResult(null)}
                variant="secondary"
                size="lg"
                icon="🔄"
                fullWidth
              >
                다시 추천받기
              </PremiumButton>
            </div>
          )}

          {/* Related Apps */}
          <div className="mt-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <RelatedApps 
              relatedAppIds={['calorie-calculator', 'water-intake', 'coffee-calculator', 'habit-tracker']} 
              currentAppId="breakfast-what-to-eat" 
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
