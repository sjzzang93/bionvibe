'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';
import { BODY_FAT_DATA } from '@/lib/group1-data';

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
      <div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          <PremiumHeader 
            icon="⚖️"
            title="체지방 측정기"
            subtitle="정확한 체지방률과 건강 상태를 확인하세요"
            gradient="from-orange-200 via-amber-200 to-yellow-200"
          />

          {!result ? (
            <PremiumCard className="max-w-2xl mx-auto" gradient>
              <div className="space-y-6">
                <div>
                  <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block text-lg">👤 성별</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-4 rounded-xl font-bold transition-all ${
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
                  <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block text-lg">
                    🎂 나이: {age}세
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block">📏 키: {height}cm</label>
                    <input
                      type="range"
                      min="140"
                      max="200"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 block">⚖️ 몸무게: {weight}kg</label>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-bold">📐 둘레 측정</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUnit('cm')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          unit === 'cm'
                            ? 'bg-white text-blue-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        cm
                      </button>
                      <button
                        onClick={() => setUnit('inch')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
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
                      <label className="text-white/90 mb-2 block">
                        허리 둘레: {getDisplayValue(waist)}{unit}
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
                        className="w-full"
                      />
                    </div>
                    {gender === 'female' && (
                      <div>
                        <label className="text-white/90 mb-2 block">
                          엉덩이 둘레: {getDisplayValue(hip)}{unit}
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
                          className="w-full"
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
            <div className="space-y-6">
              <PremiumCard gradient className="text-center">
                <div className="text-8xl mb-6 animate-bounce-slow">📊</div>
                <h3 className="text-3xl font-bold text-white mb-8">측정 결과</h3>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/20 rounded-2xl p-6">
                    <div className="text-white/70 text-sm mb-2">체지방률</div>
                    <div className="text-5xl font-black text-orange-200 mb-2">{result.bodyFat}%</div>
                    <div className="text-white/90 font-bold">{result.bodyFatCategory}</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-6">
                    <div className="text-white/70 text-sm mb-2">BMI</div>
                    <div className="text-5xl font-black text-blue-200 mb-2">{result.bmi}</div>
                    <div className="text-white/90 font-bold">{result.bmiCategory}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white/70 text-sm">제지방량</div>
                    <div className="text-2xl font-bold text-green-200">{result.leanMass}kg</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white/70 text-sm">체지방량</div>
                    <div className="text-2xl font-bold text-yellow-200">{result.fatMass}kg</div>
                  </div>
                </div>
              </PremiumCard>

              <PremiumCard>
                <h3 className="text-2xl font-bold text-white mb-4">💪 운동 추천</h3>
                <div className="space-y-3">
                  {BODY_FAT_DATA.exerciseRecommendations.slice(0, 3).map((ex: any, i: number) => (
                    <div key={i} className="bg-white/10 rounded-xl p-4">
                      <h4 className="text-white font-bold mb-2">{ex.goal}</h4>
                      <div className="space-y-2">
                        {ex.exercises?.slice(0, 2).map((exercise: any, j: number) => (
                          <div key={j} className="text-white/80 text-sm">
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
