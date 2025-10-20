'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CalorieCalculatorPage() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState<any>(null);

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
      sedentary: 1.2,     // 거의 운동 안함
      light: 1.375,       // 가벼운 운동
      moderate: 1.55,     // 중간 운동
      active: 1.725,      // 격렬한 운동
      veryActive: 1.9,    // 매우 격렬한 운동
    }[activity] || 1.55;

    const tdee = Math.round(bmr * activityMultiplier); // 총 일일 에너지 소비량

    // 목표에 따른 권장 칼로리
    let targetCalories = tdee;
    let calorieDiff = 0;
    let expectedWeightChange = 0;

    if (goal === 'lose') {
      targetCalories = tdee - 500; // 하루 500kcal 감소 = 주당 0.5kg 감량
      calorieDiff = -500;
      expectedWeightChange = -0.5;
    } else if (goal === 'gain') {
      targetCalories = tdee + 500; // 하루 500kcal 증가 = 주당 0.5kg 증량
      calorieDiff = 500;
      expectedWeightChange = 0.5;
    }

    // 영양소 비율 (단백질:탄수화물:지방 = 30:40:30)
    const protein = Math.round((targetCalories * 0.3) / 4); // 단백질 1g = 4kcal
    const carbs = Math.round((targetCalories * 0.4) / 4);   // 탄수화물 1g = 4kcal
    const fat = Math.round((targetCalories * 0.3) / 9);     // 지방 1g = 9kcal

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-white mb-4">
          칼로리 자동계산기
        </h1>
        <p className="text-center text-green-100 mb-8 text-sm md:text-base">과학적 공식으로 정확한 하루 칼로리 계산</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 space-y-4 md:space-y-6">
          {/* 성별 */}
          <div>
            <label className="text-white font-bold mb-2 block text-sm md:text-base">성별</label>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => setGender('male')}
                className={`py-3 md:py-4 rounded-xl font-bold transition-all text-sm md:text-base ${
                  gender === 'male' ? 'bg-blue-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                남성
              </button>
              <button
                onClick={() => setGender('female')}
                className={`py-3 md:py-4 rounded-xl font-bold transition-all text-sm md:text-base ${
                  gender === 'female' ? 'bg-pink-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                여성
              </button>
            </div>
          </div>

          {/* 나이, 키, 몸무게 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="text-white font-bold mb-2 block text-sm md:text-base">나이</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="예: 30"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-sm md:text-base"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
            <div>
              <label className="text-white font-bold mb-2 block text-sm md:text-base">키 (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="예: 170"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-sm md:text-base"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
            <div>
              <label className="text-white font-bold mb-2 block text-sm md:text-base">체중 (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="예: 70"
                className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-sm md:text-base"
                style={{ fontSize: '16px', minHeight: '44px' }}
              />
            </div>
          </div>

          {/* 활동량 */}
          <div>
            <label className="text-white font-bold mb-2 block text-sm md:text-base">활동량</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 md:px-4 py-3 rounded-lg text-black text-sm md:text-base"
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
            <label className="text-white font-bold mb-2 block text-sm md:text-base">목표</label>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <button
                onClick={() => setGoal('lose')}
                className={`py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${
                  goal === 'lose' ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                감량
              </button>
              <button
                onClick={() => setGoal('maintain')}
                className={`py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${
                  goal === 'maintain' ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                유지
              </button>
              <button
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
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-lg md:text-xl hover:shadow-lg transition-all"
            style={{ minHeight: '48px' }}
          >
            계산하기
          </button>

          {result && (
            <div className="space-y-4 pt-6">
              {/* 주요 수치 */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-center text-white">
                <div className="text-5xl md:text-6xl mb-2">🎯</div>
                <div className="text-sm md:text-base mb-2">하루 권장 칼로리</div>
                <div className="text-4xl md:text-6xl font-bold mb-4">{result.targetCalories}</div>
                <div className="text-xs md:text-sm">kcal</div>
              </div>

              {/* 상세 정보 */}
              <div className="bg-white rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">상세 분석</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">기초대사량 (BMR):</span>
                    <span className="font-bold text-blue-600">{result.bmr} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">일일 소비 칼로리 (TDEE):</span>
                    <span className="font-bold text-green-600">{result.tdee} kcal</span>
                  </div>
                  {result.calorieDiff !== 0 && (
                    <>
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-gray-600">칼로리 조정:</span>
                        <span className={`font-bold ${result.calorieDiff > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {result.calorieDiff > 0 ? '+' : ''}{result.calorieDiff} kcal
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base">
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
                    <div className="flex justify-between mb-2 text-sm md:text-base">
                      <span className="text-gray-600">단백질</span>
                      <span className="font-bold text-red-600">{result.protein}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm md:text-base">
                      <span className="text-gray-600">탄수화물</span>
                      <span className="font-bold text-yellow-600">{result.carbs}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm md:text-base">
                      <span className="text-gray-600">지방</span>
                      <span className="font-bold text-blue-600">{result.fat}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-white/80 text-xs md:text-sm px-4">
          <p>본 계산기는 Harris-Benedict 공식을 사용합니다.</p>
        </div>

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

