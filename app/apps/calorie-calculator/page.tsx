'use client';

import { useState } from 'react';
import RelatedApps from '@/app/components/RelatedApps';
import AppFooter from '@/app/components/AppFooter';
import Link from 'next/link';

interface MealPlan {
  breakfast: { name: string; calories: number; items: string[] };
  lunch: { name: string; calories: number; items: string[] };
  dinner: { name: string; calories: number; items: string[] };
  snacks: { name: string; calories: number; items: string[] }[];
}

export default function CalorieCalculatorPage() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState<any>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  // 방대한 식단 데이터베이스
  const breakfastOptions = {
    light: [ // 300-450 kcal
      { name: '토스트 + 계란 + 우유', calories: 350, items: ['식빵 2장 (140kcal)', '삶은 계란 1개 (80kcal)', '저지방 우유 200ml (90kcal)', '토마토 반개 (15kcal)', '오이 1/3개 (5kcal)'] },
      { name: '오트밀 + 과일', calories: 380, items: ['오트밀 40g (150kcal)', '바나나 1개 (105kcal)', '아몬드 10알 (70kcal)', '저지방 우유 200ml (90kcal)', '꿀 1스푼 (30kcal)'] },
      { name: '그릭요거트 볼', calories: 320, items: ['그릭요거트 200g (120kcal)', '블루베리 50g (30kcal)', '그래놀라 30g (120kcal)', '호두 5알 (40kcal)'] },
      { name: '샌드위치', calories: 400, items: ['통밀빵 2장 (160kcal)', '닭가슴살 50g (55kcal)', '상추/토마토 (10kcal)', '치즈 1장 (70kcal)', '바나나 1개 (105kcal)'] },
    ],
    heavy: [ // 500-700 kcal
      { name: '한식 아침', calories: 600, items: ['밥 1공기 (300kcal)', '된장찌개 (100kcal)', '계란후라이 (120kcal)', '김치 (20kcal)', '시금치나물 (30kcal)', '멸치볶음 (60kcal)'] },
      { name: '양식 브런치', calories: 650, items: ['베이글 1개 (250kcal)', '크림치즈 (100kcal)', '스크램블 에그 (150kcal)', '베이컨 2장 (90kcal)', '오렌지주스 (60kcal)'] },
      { name: '프렌치 토스트', calories: 580, items: ['식빵 3장 (210kcal)', '계란물 (80kcal)', '버터 (100kcal)', '메이플시럽 (120kcal)', '딸기 5개 (20kcal)', '우유 (90kcal)'] },
    ]
  };

  const lunchOptions = {
    balanced: [ // 600-800 kcal
      { name: '닭가슴살 도시락', calories: 650, items: ['밥 1공기 (300kcal)', '구운 닭가슴살 150g (165kcal)', '브로콜리 100g (35kcal)', '고구마 소 100g (115kcal)', '방울토마토 5개 (15kcal)', '계란 1개 (80kcal)'] },
      { name: '비빔밥', calories: 680, items: ['밥 1공기 (300kcal)', '소고기 50g (115kcal)', '나물 3종 (90kcal)', '계란 후라이 (120kcal)', '고추장 (35kcal)', '참기름 (20kcal)'] },
      { name: '덮밥', calories: 720, items: ['밥 1.5공기 (450kcal)', '돈까스 1장 (200kcal)', '양파/당근 (20kcal)', '소스 (50kcal)'] },
      { name: '파스타', calories: 750, items: ['스파게티 면 80g (280kcal)', '토마토 소스 (150kcal)', '닭가슴살 100g (110kcal)', '올리브오일 (120kcal)', '마늘빵 (90kcal)'] },
      { name: '샐러드 볼', calories: 600, items: ['샐러드 믹스 100g (20kcal)', '구운 닭가슴살 200g (220kcal)', '퀴노아 60g (220kcal)', '아보카도 1/4개 (60kcal)', '발사믹 드레싱 (80kcal)'] },
    ],
    heavy: [ // 800-1000 kcal
      { name: '백반 정식', calories: 900, items: ['밥 1.5공기 (450kcal)', '제육볶음 (300kcal)', '된장찌개 (100kcal)', '김치 (20kcal)', '계란찜 (100kcal)'] },
      { name: '삼겹살 + 밥', calories: 950, items: ['밥 1공기 (300kcal)', '삼겹살 150g (525kcal)', '쌈채소 (10kcal)', '쌈장 (35kcal)', '된장찌개 (80kcal)'] },
      { name: '돈까스 정식', calories: 880, items: ['밥 1공기 (300kcal)', '돈까스 1장 (400kcal)', '샐러드 (100kcal)', '된장국 (80kcal)'] },
    ]
  };

  const dinnerOptions = {
    light: [ // 400-600 kcal
      { name: '샐러드 + 닭가슴살', calories: 450, items: ['샐러드 믹스 150g (30kcal)', '그릴드 치킨 200g (220kcal)', '토마토 (20kcal)', '견과류 (80kcal)', '발사믹 드레싱 (100kcal)'] },
      { name: '두부 스테이크', calories: 520, items: ['두부 1모 (280kcal)', '새송이버섯 (40kcal)', '브로콜리 (35kcal)', '현미밥 반공기 (135kcal)', '간장소스 (30kcal)'] },
      { name: '해산물 샐러드', calories: 480, items: ['새우 150g (150kcal)', '오징어 100g (80kcal)', '샐러드 (50kcal)', '레몬 드레싱 (100kcal)', '통밀빵 1장 (100kcal)'] },
    ],
    balanced: [ // 600-800 kcal
      { name: '연어 구이 세트', calories: 720, items: ['구운 연어 150g (280kcal)', '현미밥 1공기 (300kcal)', '아스파라거스 (40kcal)', '버섯 볶음 (60kcal)', '된장국 (40kcal)'] },
      { name: '닭가슴살 볶음밥', calories: 680, items: ['밥 1공기 (300kcal)', '닭가슴살 150g (165kcal)', '계란 2개 (160kcal)', '채소 (30kcal)', '간장 (15kcal)', '올리브오일 (10kcal)'] },
      { name: '부대찌개', calories: 750, items: ['밥 1공기 (300kcal)', '부대찌개 (소시지/햄/두부/라면사리) (400kcal)', '김치 (20kcal)', '계란 1개 (80kcal)'] },
      { name: '스테이크', calories: 780, items: ['소고기 등심 150g (375kcal)', '구운 감자 (150kcal)', '샐러드 (100kcal)', '마늘빵 (105kcal)', '와인 반잔 (50kcal)'] },
    ],
    heavy: [ // 800-1000 kcal
      { name: '삼계탕', calories: 900, items: ['삼계탕 1인분 (700kcal)', '밥 1공기 (300kcal)', '김치 (20kcal)', '깍두기 (20kcal)'] },
      { name: '갈비찜', calories: 920, items: ['갈비찜 (600kcal)', '밥 1공기 (300kcal)', '된장국 (80kcal)', '계란찜 (100kcal)'] },
    ]
  };

  const snackOptions = {
    light: [ // 100-150 kcal
      { name: '과일', calories: 100, items: ['사과 1개 (52kcal)', '바나나 반개 (53kcal)'] },
      { name: '견과류', calories: 140, items: ['아몬드 15알 (105kcal)', '호두 3알 (65kcal)'] },
      { name: '요거트', calories: 120, items: ['플레인 요거트 150g (90kcal)', '블루베리 20g (12kcal)', '꿀 (18kcal)'] },
      { name: '단백질 바', calories: 150, items: ['프로틴 바 1개 (150kcal)'] },
    ],
    medium: [ // 200-300 kcal
      { name: '그래놀라 요거트', calories: 250, items: ['요거트 150g (90kcal)', '그래놀라 40g (160kcal)'] },
      { name: '샌드위치', calories: 280, items: ['미니 샌드위치 (200kcal)', '저지방 우유 (80kcal)'] },
      { name: '과일 스무디', calories: 240, items: ['바나나 1개 (105kcal)', '딸기 5개 (25kcal)', '요거트 (60kcal)', '꿀 (30kcal)', '얼음 (0kcal)'] },
    ]
  };

  const generateMealPlan = (targetCalories: number, goalType: string) => {
    let breakfastCal, lunchCal, dinnerCal, snackCal;

    // 목표에 따른 식사 배분
    if (goalType === 'lose') {
      // 감량: 저녁 적게, 아침/점심 충분히
      breakfastCal = Math.round(targetCalories * 0.25);
      lunchCal = Math.round(targetCalories * 0.35);
      dinnerCal = Math.round(targetCalories * 0.30);
      snackCal = Math.round(targetCalories * 0.10);
    } else if (goalType === 'gain') {
      // 증량: 모든 끼니 충분히
      breakfastCal = Math.round(targetCalories * 0.25);
      lunchCal = Math.round(targetCalories * 0.35);
      dinnerCal = Math.round(targetCalories * 0.30);
      snackCal = Math.round(targetCalories * 0.10);
    } else {
      // 유지: 균형있게
      breakfastCal = Math.round(targetCalories * 0.25);
      lunchCal = Math.round(targetCalories * 0.35);
      dinnerCal = Math.round(targetCalories * 0.30);
      snackCal = Math.round(targetCalories * 0.10);
    }

    // 아침 선택
    let breakfast;
    if (breakfastCal < 450) {
      breakfast = breakfastOptions.light[Math.floor(Math.random() * breakfastOptions.light.length)];
    } else {
      breakfast = breakfastOptions.heavy[Math.floor(Math.random() * breakfastOptions.heavy.length)];
    }

    // 점심 선택
    let lunch;
    if (lunchCal < 700) {
      lunch = lunchOptions.balanced[Math.floor(Math.random() * lunchOptions.balanced.length)];
    } else {
      lunch = lunchOptions.heavy[Math.floor(Math.random() * lunchOptions.heavy.length)];
    }

    // 저녁 선택
    let dinner;
    if (dinnerCal < 500) {
      dinner = dinnerOptions.light[Math.floor(Math.random() * dinnerOptions.light.length)];
    } else if (dinnerCal < 700) {
      dinner = dinnerOptions.balanced[Math.floor(Math.random() * dinnerOptions.balanced.length)];
    } else {
      dinner = dinnerOptions.heavy[Math.floor(Math.random() * dinnerOptions.heavy.length)];
    }

    // 간식 선택
    const snacks = [];
    let remainingSnackCal = snackCal;
    
    while (remainingSnackCal > 100) {
      let snack;
      if (remainingSnackCal < 180) {
        snack = snackOptions.light[Math.floor(Math.random() * snackOptions.light.length)];
      } else {
        snack = snackOptions.medium[Math.floor(Math.random() * snackOptions.medium.length)];
      }
      snacks.push(snack);
      remainingSnackCal -= snack.calories;
      
      if (snacks.length >= 2) break; // 최대 2개 간식
    }

    return { breakfast, lunch, dinner, snacks };
  };

  const handleCalculate = () => {
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    // Harris-Benedict 공식으로 기초대사량(BMR) 계산
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
    } else {
      bmr = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
    }

    // 활동 수준에 따른 계수
    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }[activity] || 1.55;

    const tdee = Math.round(bmr * activityMultiplier);

    // 목표에 따른 권장 칼로리
    let targetCalories = tdee;
    let calorieDiff = 0;
    let expectedWeightChange = 0;

    if (goal === 'lose') {
      targetCalories = tdee - 500;
      calorieDiff = -500;
      expectedWeightChange = -0.5;
    } else if (goal === 'gain') {
      targetCalories = tdee + 500;
      calorieDiff = 500;
      expectedWeightChange = 0.5;
    }

    // 영양소 비율
    const protein = Math.round((targetCalories * 0.3) / 4);
    const carbs = Math.round((targetCalories * 0.4) / 4);
    const fat = Math.round((targetCalories * 0.3) / 9);

    setResult({
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      calorieDiff,
      expectedWeightChange,
      protein,
      carbs,
      fat,
    });

    // 식단 자동 생성
    const plan = generateMealPlan(targetCalories, goal);
    setMealPlan(plan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 py-8 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-white mb-4">
          칼로리 자동계산기
        </h1>
        <p className="text-center text-green-100 mb-8 text-[10px] sm:text-xs md:text-sm">과학적 공식으로 정확한 하루 칼로리 계산 + 맞춤 식단 추천</p>

        <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-6 md:p-8 space-y-4 md:space-y-6">
          {/* 성별 */}
          <div>
            <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">성별</label>
            <div className="grid grid-cols-3 gap-3 md:gap-2">
              <button
        type="button"
                onClick={() => setGender('male')}
                className={`py-3 md:py-4 rounded-xl font-bold transition-all text-[10px] sm:text-xs md:text-sm ${
                  gender === 'male' ? 'bg-blue-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                남성
              </button>
              <button
        type="button"
                onClick={() => setGender('female')}
                className={`py-3 md:py-4 rounded-xl font-bold transition-all text-[10px] sm:text-xs md:text-sm ${
                  gender === 'female' ? 'bg-pink-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                여성
              </button>
            </div>
          </div>

          {/* 나이, 키, 몸무게 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-2">
            <div>
              <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">나이</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="예: 30"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
            <div>
              <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">키 (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="예: 170"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
            <div>
              <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">체중 (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="예: 70"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
          </div>

          {/* 활동량 */}
          <div>
            <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">활동량</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-[10px] sm:text-xs md:text-sm"
              style={{ fontSize: '16px', minHeight: '44px' }}
            >
              <option value="sedentary">거의 운동 안함</option>
              <option value="light">가벼운 운동 (주 1-3일)</option>
              <option value="moderate">중간 운동 (주 3-5일)</option>
              <option value="active">격렬한 운동 (주 6-7일)</option>
              <option value="veryActive">매우 격렬한 운동 (하루 2회)</option>
            </select>
          </div>

          {/* 목표 */}
          <div>
            <label className="text-white font-bold mb-2 block text-[10px] sm:text-xs md:text-sm">목표</label>
            <div className="grid grid-cols-3 gap-2 md:gap-0 sm:gap-1.5 md:gap-3">
              <button
        type="button"
                onClick={() => setGoal('lose')}
                className={`py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${
                  goal === 'lose' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                감량
              </button>
              <button
        type="button"
                onClick={() => setGoal('maintain')}
                className={`py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${
                  goal === 'maintain' ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                유지
              </button>
              <button
        type="button"
                onClick={() => setGoal('gain')}
                className={`py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${
                  goal === 'gain' ? 'bg-blue-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                증량
              </button>
            </div>
          </div>

          <button
        type="button"
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm md:text-xl hover:shadow-lg transition-all"
            style={{ minHeight: '48px' }}
          >
            계산하기
          </button>

          {result && (
            <div className="space-y-4 pt-6">
              {/* 주요 수치 */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-center text-white">
                <div className="text-5xl md:text-6xl mb-2">🎯</div>
                <div className="text-[10px] sm:text-xs md:text-sm mb-2">하루 권장 칼로리</div>
                <div className="text-4xl md:text-6xl font-bold mb-4">{result.targetCalories}</div>
                <div className="text-xs md:text-sm">kcal</div>
              </div>

              {/* 상세 정보 */}
              <div className="bg-white rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">상세 분석</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                    <span className="text-gray-600">기초대사량 (BMR):</span>
                    <span className="font-bold text-blue-600">{result.bmr} kcal</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                    <span className="text-gray-600">일일 소비 칼로리 (TDEE):</span>
                    <span className="font-bold text-green-600">{result.tdee} kcal</span>
                  </div>
                  {result.calorieDiff !== 0 && (
                    <>
                      <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                        <span className="text-gray-600">칼로리 조정:</span>
                        <span className={`font-bold ${result.calorieDiff > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {result.calorieDiff > 0 ? '+' : ''}{result.calorieDiff} kcal
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                        <span className="text-gray-600">예상 체중 변화:</span>
                        <span className="font-bold text-purple-600">
                          주당 {result.expectedWeightChange > 0 ? '+' : ''}{result.expectedWeightChange}kg
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 영양소 비율 */}
              <div className="bg-white rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">권장 영양소 (30:40:30)</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-[10px] sm:text-xs md:text-sm">
                      <span className="text-gray-600">단백질</span>
                      <span className="font-bold text-red-600">{result.protein}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-[10px] sm:text-xs md:text-sm">
                      <span className="text-gray-600">탄수화물</span>
                      <span className="font-bold text-yellow-600">{result.carbs}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-[10px] sm:text-xs md:text-sm">
                      <span className="text-gray-600">지방</span>
                      <span className="font-bold text-blue-600">{result.fat}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 맞춤 식단 추천 */}
              {mealPlan && (
                <div className="bg-white rounded-xl p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                    🍽️ 오늘의 맞춤 식단
                  </h3>
                  <p className="text-center text-sm text-gray-600 mb-6">
                    {result.targetCalories}kcal 기준 식단 추천
                  </p>

                  <div className="space-y-4">
                    {/* 아침 */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-0.5 sm:mb-1.5 md:mb-2">
                        <span className="text-2xl">🌅</span>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">아침 - {mealPlan.breakfast.name}</h4>
                        <span className="ml-auto text-orange-600 dark:text-orange-400 font-bold">{mealPlan.breakfast.calories}kcal</span>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {mealPlan.breakfast.items.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 점심 */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-0.5 sm:mb-1.5 md:mb-2">
                        <span className="text-2xl">☀️</span>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">점심 - {mealPlan.lunch.name}</h4>
                        <span className="ml-auto text-green-600 dark:text-green-400 font-bold">{mealPlan.lunch.calories}kcal</span>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {mealPlan.lunch.items.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 저녁 */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-0.5 sm:mb-1.5 md:mb-2">
                        <span className="text-2xl">🌙</span>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">저녁 - {mealPlan.dinner.name}</h4>
                        <span className="ml-auto text-blue-600 dark:text-blue-400 font-bold">{mealPlan.dinner.calories}kcal</span>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {mealPlan.dinner.items.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 간식 */}
                    {mealPlan.snacks.length > 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1.5 md:mb-2">
                          <span className="text-2xl">🍪</span>
                          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">간식</h4>
                        </div>
                        {mealPlan.snacks.map((snack, idx) => (
                          <div key={idx} className="mb-0.5 sm:mb-1.5 md:mb-2 last:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-purple-600 dark:text-purple-400">{snack.name}</span>
                              <span className="text-sm text-purple-600 dark:text-purple-400 font-bold">({snack.calories}kcal)</span>
                            </div>
                            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {snack.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 총 칼로리 */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-black text-gray-800 dark:text-gray-100">
                        총 섭취 칼로리: {mealPlan.breakfast.calories + mealPlan.lunch.calories + mealPlan.dinner.calories + mealPlan.snacks.reduce((sum, s) => sum + s.calories, 0)}kcal
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        💡 식단은 예시이며, 개인의 상황에 맞게 조정하세요!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 관련 앱 추천 */}
              <RelatedApps 
                relatedAppIds={['water-intake', 'coffee-calculator', 'sleep-analyzer']}
                currentAppId="calorie-calculator"
              />
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-white/80 text-xs md:text-sm px-4">
          <p>본 계산기는 Harris-Benedict 공식을 사용합니다.</p>
          <p className="mt-2">식단은 일반적인 추천이며, 개인의 건강 상태를 고려하여 조정이 필요합니다.</p>
        </div>

        {/* 제작자 서명 */}
        <AppFooter />

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm transition-all duration-300 shadow-lg">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
