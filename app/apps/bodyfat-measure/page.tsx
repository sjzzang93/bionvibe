'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';
import { BODY_FAT_DATA } from '@/lib/group1-data';

import RelatedApps from '@/app/components/RelatedApps';
export default function BodyFatMeasure() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
  const [waist, setWaist] = useState(80);
  const [hip, setHip] = useState(95);
  const [result, setResult] = useState<any>(null);

  // 인치를 cm로 변환
  const toCm = (value: number) => {
    return unit === 'inch' ? value * 2.54 : value;
  };

  // cm를 인치로 변환
  const toInch = (value: number) => {
    return value / 2.54;
  };

  // 표시용 값 (현재 선택된 단위)
  const getDisplayValue = (cmValue: number) => {
    return unit === 'inch' ? toInch(cmValue).toFixed(1) : cmValue;
  };

  const calculate = () => {
    // BMI 계산
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    // 단위 변환 (인치면 cm로)
    const waistCm = toCm(waist);
    const hipCm = toCm(hip);

    // 미 해군 방식 체지방률 계산 (목둘레 제외, 간소화된 공식)
    let bodyFat = 0;
    if (gender === 'male') {
      // 남성: 키, 허리만 사용
      bodyFat = 86.010 * Math.log10(waistCm) - 70.041 * Math.log10(height) + 36.76;
    } else {
      // 여성: 키, 허리, 엉덩이 사용
      bodyFat = 163.205 * Math.log10(waistCm + hipCm) - 97.684 * Math.log10(height) - 78.387;
    }

    // 체지방 평가
    let bodyFatCategory = '';
    let bmiCategory = '';
    
    if (gender === 'male') {
      if (bodyFat < 6) bodyFatCategory = '필수 지방';
      else if (bodyFat < 14) bodyFatCategory = '운동선수';
      else if (bodyFat < 18) bodyFatCategory = '건강';
      else if (bodyFat < 25) bodyFatCategory = '평균';
      else bodyFatCategory = '비만';
    } else {
      if (bodyFat < 14) bodyFatCategory = '필수 지방';
      else if (bodyFat < 21) bodyFatCategory = '운동선수';
      else if (bodyFat < 25) bodyFatCategory = '건강';
      else if (bodyFat < 32) bodyFatCategory = '평균';
      else bodyFatCategory = '비만';
    }

    if (bmi < 18.5) bmiCategory = '저체중';
    else if (bmi < 23) bmiCategory = '정상';
    else if (bmi < 25) bmiCategory = '과체중';
    else if (bmi < 30) bmiCategory = '비만';
    else bmiCategory = '고도비만';

    setResult({
      bmi: bmi.toFixed(1),
      bodyFat: bodyFat.toFixed(1),
      bodyFatCategory,
      bmiCategory,
      leanMass: (weight * (1 - bodyFat / 100)).toFixed(1),
      fatMass: (weight * (bodyFat / 100)).toFixed(1),
    });
  };

  return (
    <PremiumLayout theme="orange">
      
        <AdOverlay /><div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          <PremiumHeader 
            icon="⚖️"
            title="체지방 측정기"
            subtitle="정확한 체지방률과 건강 상태를 확인하세요"
            gradient="from-orange-200 via-amber-200 to-yellow-200"
          />

          {!result ? (
            <PremiumCard className="max-w-2xl mx-auto" gradient>
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label className="text-white font-bold mb-2 sm:mb-3 block text-base sm:text-lg md:text-xl">👤 성별</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {['male', 'female'].map((g) => (
                      <button
        type="button"
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all ${
                          gender === g
                            ? 'bg-white text-orange-600 scale-105'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {g === 'male' ? '👨 남성' : '👩 여성'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white font-bold mb-2 sm:mb-3 block text-base sm:text-lg md:text-xl flex items-center justify-between">
                    <span>🎂 나이</span>
                    <span className="text-orange-300 text-xl sm:text-2xl">{age}세</span>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full h-3"
                  />
                  <div className="flex justify-between text-white/60 text-xs mt-1">
                    <span>15세</span>
                    <span>80세</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-bold mb-2 sm:mb-3 block text-base sm:text-lg flex items-center justify-between">
                      <span>📏 키</span>
                      <span className="text-blue-300 text-lg sm:text-xl">{height}cm</span>
                    </label>
                    <input
                      type="range"
                      min="140"
                      max="200"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full h-3"
                    />
                    <div className="flex justify-between text-white/60 text-xs mt-1">
                      <span>140cm</span>
                      <span>200cm</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-white font-bold mb-2 sm:mb-3 block text-base sm:text-lg flex items-center justify-between">
                      <span>⚖️ 몸무게</span>
                      <span className="text-green-300 text-lg sm:text-xl">{weight}kg</span>
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full h-3"
                    />
                    <div className="flex justify-between text-white/60 text-xs mt-1">
                      <span>40kg</span>
                      <span>150kg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/20 rounded-xl p-3 sm:p-4 border border-blue-400/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <h4 className="text-white font-bold text-base sm:text-lg">📐 둘레 측정</h4>
                    <div className="flex gap-2">
                      <button
        type="button"
                        onClick={() => setUnit('cm')}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm sm:text-base transition-all ${
                          unit === 'cm'
                            ? 'bg-white text-blue-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        cm
                      </button>
                      <button
        type="button"
                        onClick={() => setUnit('inch')}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm sm:text-base transition-all ${
                          unit === 'inch'
                            ? 'bg-white text-blue-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        inch
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/90 mb-2 block text-sm sm:text-base flex items-center justify-between">
                        <span>허리 둘레</span>
                        <span className="text-yellow-300 font-bold text-base sm:text-lg">{getDisplayValue(waist)}{unit}</span>
                      </label>
                      <input
                        type="range"
                        min={unit === 'cm' ? 50 : 20}
                        max={unit === 'cm' ? 150 : 60}
                        step={unit === 'cm' ? 1 : 0.1}
                        value={unit === 'cm' ? waist : toInch(waist)}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setWaist(unit === 'cm' ? val : val * 2.54);
                        }}
                        className="w-full h-3"
                      />
                    </div>
                    {gender === 'female' && (
                      <div>
                        <label className="text-white/90 mb-2 block text-sm sm:text-base flex items-center justify-between">
                          <span>엉덩이 둘레</span>
                          <span className="text-pink-300 font-bold text-base sm:text-lg">{getDisplayValue(hip)}{unit}</span>
                        </label>
                        <input
                          type="range"
                          min={unit === 'cm' ? 70 : 28}
                          max={unit === 'cm' ? 150 : 60}
                          step={unit === 'cm' ? 1 : 0.1}
                          value={unit === 'cm' ? hip : toInch(hip)}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setHip(unit === 'cm' ? val : val * 2.54);
                          }}
                          className="w-full h-3"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <PremiumButton
                  onClick={calculate}
                  fullWidth
                  size="lg"
                >
                  ⚖️ 체지방 측정하기
                </PremiumButton>
              </div>
            </PremiumCard>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <PremiumCard gradient className="text-center">
                <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce-slow">📊</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">측정 결과</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="text-white/70 text-xs sm:text-sm mb-2">체지방률</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-orange-200 mb-2">{result.bodyFat}%</div>
                    <div className="text-sm sm:text-base text-white/90 font-bold">{result.bodyFatCategory}</div>
                  </div>
                  <div className="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="text-white/70 text-xs sm:text-sm mb-2">BMI</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-200 mb-2">{result.bmi}</div>
                    <div className="text-sm sm:text-base text-white/90 font-bold">{result.bmiCategory}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="text-white/70 text-xs sm:text-sm mb-1">제지방량</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-200">{result.leanMass}kg</div>
                  </div>
                  <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="text-white/70 text-xs sm:text-sm mb-1">체지방량</div>
                    <div className="text-xl sm:text-2xl font-bold text-yellow-200">{result.fatMass}kg</div>
                  </div>
                </div>
              </PremiumCard>

              <PremiumCard>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">💪 운동 추천</h3>
                <div className="space-y-3">
                  {BODY_FAT_DATA.exerciseRecommendations.slice(0, 3).map((ex: any, i: number) => (
                    <div key={i} className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h4 className="text-white font-bold text-sm sm:text-base mb-2">{ex.goal}</h4>
                      <div className="space-y-1 sm:space-y-2">
                        {ex.exercises?.slice(0, 2).map((exercise: any, j: number) => (
                          <div key={j} className="text-white/80 text-xs sm:text-sm">
                            • {exercise.name}: {exercise.frequency}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>

              <PremiumButton
                onClick={() => setResult(null)}
                fullWidth
                size="lg"
                variant="secondary"
              >
                🔄 다시 측정하기
              </PremiumButton>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}