'use client';

import { useState } from 'react';

import RelatedApps from '@/app/components/RelatedApps';
interface Recipe {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
  matchPercentage: number;
  difficulty: '쉬움' | '보통' | '어려움';
  time: string;
  steps: string[];
  tip?: string;
}

const COMMON_INGREDIENTS = [
  { id: 'rice', name: '쌀/밥', emoji: '🍚', category: '주식' },
  { id: 'egg', name: '계란', emoji: '🥚', category: '단백질' },
  { id: 'onion', name: '양파', emoji: '🧅', category: '채소' },
  { id: 'garlic', name: '마늘', emoji: '🧄', category: '양념' },
  { id: 'potato', name: '감자', emoji: '🥔', category: '채소' },
  { id: 'carrot', name: '당근', emoji: '🥕', category: '채소' },
  { id: 'cabbage', name: '배추', emoji: '🥬', category: '채소' },
  { id: 'kimchi', name: '김치', emoji: '🥬', category: '반찬' },
  { id: 'spam', name: '햄/스팸', emoji: '🥓', category: '단백질' },
  { id: 'sausage', name: '소시지', emoji: '🌭', category: '단백질' },
  { id: 'chicken', name: '닭고기', emoji: '🍗', category: '단백질' },
  { id: 'pork', name: '돼지고기', emoji: '🥩', category: '단백질' },
  { id: 'beef', name: '소고기', emoji: '🥩', category: '단백질' },
  { id: 'tofu', name: '두부', emoji: '🧊', category: '단백질' },
  { id: 'mushroom', name: '버섯', emoji: '🍄', category: '채소' },
  { id: 'tomato', name: '토마토', emoji: '🍅', category: '채소' },
  { id: 'cheese', name: '치즈', emoji: '🧀', category: '유제품' },
  { id: 'milk', name: '우유', emoji: '🥛', category: '유제품' },
  { id: 'noodle', name: '라면/면', emoji: '🍜', category: '주식' },
  { id: 'bread', name: '빵', emoji: '🍞', category: '주식' },
];

const RECIPE_DATABASE: Recipe[] = [
  {
    id: 'kimchi-fried-rice',
    name: '김치볶음밥',
    emoji: '🍚',
    ingredients: ['rice', 'kimchi', 'egg', 'onion', 'garlic'],
    matchPercentage: 0,
    difficulty: '쉬움',
    time: '15분',
    steps: [
      '김치를 잘게 썰어주세요',
      '양파와 마늘을 다져주세요',
      '팬에 기름을 두르고 김치와 양파를 볶아주세요',
      '밥을 넣고 함께 볶아주세요',
      '계란 프라이를 올려 완성!'
    ],
    tip: '김치는 신 김치가 더 맛있어요!'
  },
  {
    id: 'egg-rice',
    name: '계란밥',
    emoji: '🥚',
    ingredients: ['rice', 'egg', 'garlic'],
    matchPercentage: 0,
    difficulty: '쉬움',
    time: '10분',
    steps: [
      '따뜻한 밥을 준비하세요',
      '계란을 밥 위에 올려주세요',
      '간장과 참기름을 넣어 비벼주세요',
      '김가루를 뿌려 완성!'
    ],
    tip: '날계란이 부담스럽다면 반숙 계란을 사용하세요!'
  },
  {
    id: 'spam-kimchi-stew',
    name: '스팸김치찌개',
    emoji: '🍲',
    ingredients: ['kimchi', 'spam', 'tofu', 'onion', 'garlic'],
    matchPercentage: 0,
    difficulty: '보통',
    time: '25분',
    steps: [
      '냄비에 김치를 넣고 볶아주세요',
      '물을 붓고 끓여주세요',
      '스팸과 두부를 넣어주세요',
      '양파와 마늘을 넣고 10분간 끓이세요',
      '고춧가루로 간을 맞춰 완성!'
    ],
    tip: '스팸 대신 참치캔을 사용해도 맛있어요!'
  },
  {
    id: 'omurice',
    name: '오므라이스',
    emoji: '🍳',
    ingredients: ['rice', 'egg', 'onion', 'carrot', 'spam'],
    matchPercentage: 0,
    difficulty: '보통',
    time: '20분',
    steps: [
      '양파, 당근, 햄을 잘게 다져주세요',
      '팬에 볶다가 밥을 넣고 케찹을 넣어 볶아주세요',
      '계란을 풀어 팬에 얇게 부쳐주세요',
      '계란 위에 볶음밥을 올리고 말아주세요',
      '케찹으로 데코레이션!'
    ]
  },
  {
    id: 'potato-pancake',
    name: '감자전',
    emoji: '🥔',
    ingredients: ['potato', 'onion', 'egg'],
    matchPercentage: 0,
    difficulty: '보통',
    time: '30분',
    steps: [
      '감자를 갈아주세요',
      '양파를 다져 섞어주세요',
      '계란과 소금을 넣고 섞어주세요',
      '팬에 기름을 두르고 부쳐주세요',
      '노릇노릇하게 구워 완성!'
    ],
    tip: '감자는 물기를 꼭 짜주세요!'
  },
  {
    id: 'cheese-toast',
    name: '치즈토스트',
    emoji: '🧀',
    ingredients: ['bread', 'cheese', 'egg'],
    matchPercentage: 0,
    difficulty: '쉬움',
    time: '10분',
    steps: [
      '빵에 치즈를 올려주세요',
      '계란을 스크램블해주세요',
      '빵 사이에 계란을 넣어주세요',
      '팬에 버터를 녹이고 토스트를 구워주세요',
      '치즈가 녹으면 완성!'
    ]
  },
  {
    id: 'soy-chicken',
    name: '간장치킨',
    emoji: '🍗',
    ingredients: ['chicken', 'garlic', 'onion'],
    matchPercentage: 0,
    difficulty: '보통',
    time: '35분',
    steps: [
      '닭고기에 간장, 설탕, 물엿을 넣어 재워주세요',
      '팬에 기름을 두르고 마늘을 볶아주세요',
      '닭고기를 넣고 익혀주세요',
      '양념을 넣고 졸여주세요',
      '윤기나게 졸이면 완성!'
    ],
    tip: '꿀을 넣으면 더 윤기나요!'
  },
  {
    id: 'ramen',
    name: '라면',
    emoji: '🍜',
    ingredients: ['noodle', 'egg', 'onion'],
    matchPercentage: 0,
    difficulty: '쉬움',
    time: '7분',
    steps: [
      '물을 끓여주세요',
      '면과 스프를 넣어주세요',
      '양파를 썰어 넣어주세요',
      '계란을 넣어주세요',
      '3분간 끓이면 완성!'
    ]
  },
  {
    id: 'stir-fried-pork',
    name: '제육볶음',
    emoji: '🥩',
    ingredients: ['pork', 'onion', 'cabbage', 'garlic'],
    matchPercentage: 0,
    difficulty: '보통',
    time: '25분',
    steps: [
      '돼지고기에 고추장 양념을 만들어 재워주세요',
      '양파와 배추를 썰어주세요',
      '팬에 기름을 두르고 마늘을 볶아주세요',
      '고기를 넣고 볶아주세요',
      '채소를 넣고 함께 볶아 완성!'
    ],
    tip: '고기는 앞다리살이 부드러워요!'
  },
];

export default function FridgeRecipePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const toggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const findRecipes = () => {
    if (selectedIngredients.length === 0) {
      alert('재료를 먼저 선택해주세요!');
      return;
    }

    const recipes = RECIPE_DATABASE.map((recipe) => {
      const matchCount = recipe.ingredients.filter((ing) =>
        selectedIngredients.includes(ing)
      ).length;
      const matchPercentage = Math.round((matchCount / recipe.ingredients.length) * 100);

      return {
        ...recipe,
        matchPercentage,
      };
    })
      .filter((recipe) => recipe.matchPercentage >= 40) // 40% 이상 일치
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    setRecommendedRecipes(recipes);
  };

  const resetAll = () => {
    setSelectedIngredients([]);
    setRecommendedRecipes([]);
    setSelectedRecipe(null);
  };

  const categories = [...new Set(COMMON_INGREDIENTS.map((i) => i.category))];

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
            🧊🍳✨
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            냉장고 파먹기
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-2">
            냉장고에 있는 재료로 뭐 해먹을까?
          </p>
          <p className="text-sm sm:text-base text-white/70">
            재료를 선택하면 레시피를 추천해드려요!
          </p>
        </header>

        {!selectedRecipe ? (
          <>
            {/* 재료 선택 */}
            <section className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  냉장고 재료 선택 ({selectedIngredients.length}개)
                </h2>
                {selectedIngredients.length > 0 && (
                  <button
                    onClick={resetAll}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-bold transition-all duration-300 touch-manipulation"
                  >
                    🔄 초기화
                  </button>
                )}
              </div>

              {categories.map((category) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-bold text-white/90 mb-3">{category}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {COMMON_INGREDIENTS.filter((i) => i.category === category).map((ingredient) => (
                      <button
                        key={ingredient.id}
                        onClick={() => toggleIngredient(ingredient.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 touch-manipulation ${
                          selectedIngredients.includes(ingredient.id)
                            ? 'bg-white text-orange-600 border-white scale-105 shadow-xl'
                            : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                        }`}
                      >
                        <div className="text-3xl mb-1">{ingredient.emoji}</div>
                        <div className="text-xs font-medium">{ingredient.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={findRecipes}
                disabled={selectedIngredients.length === 0}
                className="w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 rounded-2xl text-white text-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed touch-manipulation"
              >
                🔍 레시피 찾기!
              </button>
            </section>

            {/* 레시피 추천 결과 */}
            {recommendedRecipes.length > 0 && (
              <section className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                  추천 레시피 ({recommendedRecipes.length}개)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className="bg-white rounded-2xl p-6 text-left hover:shadow-2xl transition-all duration-300 hover:scale-105 touch-manipulation"
                    >
                      <div className="text-5xl mb-3">{recipe.emoji}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
                            style={{ width: `${recipe.matchPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-blue-600">{recipe.matchPercentage}%</span>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-600">
                        <span>⏱️ {recipe.time}</span>
                        <span>•</span>
                        <span>📊 {recipe.difficulty}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {recommendedRecipes.length === 0 && selectedIngredients.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 shadow-2xl">
                <div className="text-6xl mb-4">😢</div>
                <p className="text-xl text-white mb-2">추천할 레시피가 없어요</p>
                <p className="text-white/70">다른 재료를 추가해보세요!</p>
              </div>
            )}
          </>
        ) : (
          // 레시피 상세
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedRecipe(null)}
              className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 font-bold transition-all duration-300 touch-manipulation"
            >
              ← 돌아가기
            </button>

            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{selectedRecipe.emoji}</div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4">
                {selectedRecipe.name}
              </h2>
              <div className="flex gap-4 justify-center text-sm text-gray-600">
                <span>⏱️ {selectedRecipe.time}</span>
                <span>•</span>
                <span>📊 {selectedRecipe.difficulty}</span>
                <span>•</span>
                <span className="font-bold text-blue-600">매칭률 {selectedRecipe.matchPercentage}%</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🥘 필요한 재료</h3>
              <div className="flex flex-wrap gap-2">
                {selectedRecipe.ingredients.map((ingId) => {
                  const ingredient = COMMON_INGREDIENTS.find((i) => i.id === ingId);
                  const hasIngredient = selectedIngredients.includes(ingId);
                  return (
                    <span
                      key={ingId}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        hasIngredient
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {ingredient?.emoji} {ingredient?.name} {hasIngredient ? '✓' : '✗'}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">👨‍🍳 조리 방법</h3>
              <ol className="space-y-3">
                {selectedRecipe.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {selectedRecipe.tip && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <h3 className="font-bold text-yellow-800 mb-1">💡 꿀팁!</h3>
                <p className="text-yellow-700">{selectedRecipe.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
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
    </main>
  );
}
