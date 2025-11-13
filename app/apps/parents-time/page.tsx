"use client";

import { useState } from "react";
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

const KOREA_LIFE_EXPECTANCY = {
  male: 80.6,
  female: 86.6,
};

export default function ParentsTimeCalculator() {
  const [step, setStep] = useState(1);
  const [selectedParent, setSelectedParent] = useState<'both' | 'father' | 'mother'>('both');
  const [fatherBirth, setFatherBirth] = useState<number>(1960);
  const [motherBirth, setMotherBirth] = useState<number>(1965);
  const [timeType, setTimeType] = useState<'weekly' | 'monthly'>('weekly');
  const [hoursSpent, setHoursSpent] = useState<number>(4);
  const [result, setResult] = useState<any>(null);

  const handleParentSelect = (type: 'both' | 'father' | 'mother') => {
    setSelectedParent(type);
    setStep(2);
  };

  const handleFatherBirth = () => {
    if (selectedParent === 'father') {
      setStep(4); // 시간 타입으로
    } else {
      setStep(3); // 어머니로
    }
  };

  const handleMotherBirth = () => {
    setStep(4);
  };

  const handleTimeType = (type: 'weekly' | 'monthly') => {
    setTimeType(type);
    setStep(5);
  };

  const calculate = () => {
    const currentYear = new Date().getFullYear();
    const results: any = {};

    if (selectedParent === 'both' || selectedParent === 'father') {
      const fatherAge = currentYear - fatherBirth;
      const fatherRemaining = Math.max(0, KOREA_LIFE_EXPECTANCY.male - fatherAge);
      
      const hoursPerYear = timeType === 'weekly' ? hoursSpent * 52 : hoursSpent * 12;
      const totalHoursRemaining = Math.floor(fatherRemaining * hoursPerYear);
      const totalDays = Math.floor(totalHoursRemaining / 24);
      const actualMonths = Math.floor(totalDays / 30);

      results.father = {
        age: fatherAge,
        actualMonths: actualMonths,
      };
    }

    if (selectedParent === 'both' || selectedParent === 'mother') {
      const motherAge = currentYear - motherBirth;
      const motherRemaining = Math.max(0, KOREA_LIFE_EXPECTANCY.female - motherAge);
      
      const hoursPerYear = timeType === 'weekly' ? hoursSpent * 52 : hoursSpent * 12;
      const totalHoursRemaining = Math.floor(motherRemaining * hoursPerYear);
      const totalDays = Math.floor(totalHoursRemaining / 24);
      const actualMonths = Math.floor(totalDays / 30);

      results.mother = {
        age: motherAge,
        actualMonths: actualMonths,
      };
    }

    setResult(results);
    setStep(6);
  };

  const reset = () => {
    setStep(1);
    setResult(null);
    setSelectedParent('both');
    setFatherBirth(1960);
    setMotherBirth(1965);
    setTimeType('weekly');
    setHoursSpent(4);
  };

  const formatBirthYear = (year: number) => `${year}년생`;

  return (
    <PremiumLayout theme="pink">
      
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-200 via-rose-200 to-pink-200 bg-clip-text text-transparent">
            💕 부모님과 시간 계산기
          </h1>
          <p className="text-xl text-white/80 mb-2">소중한 시간, 얼마나 남았을까요?</p>
          <p className="text-sm text-white/60">대한민국 평균 수명 기준 (남성 {KOREA_LIFE_EXPECTANCY.male}세, 여성 {KOREA_LIFE_EXPECTANCY.female}세)</p>
        </div>

        {/* 진행 상황 표시 */}
        {step < 6 && (
          <div className="mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full transition-all ${
                    num <= step ? 'bg-white scale-110' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/60 text-sm text-center">
              {step === 1 && '누구의 시간을 계산할까요?'}
              {step === 2 && '아버지의 출생년도를 선택해주세요'}
              {step === 3 && '어머니의 출생년도를 선택해주세요'}
              {step === 4 && '얼마나 자주 만나시나요?'}
              {step === 5 && '평균 몇 시간씩 만나시나요?'}
            </p>
          </div>
        )}

        {/* Step 1: 부모님 선택 */}
        {step === 1 && (
          <PremiumCard hover gradient className="animate-slideUp">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-white text-2xl font-bold mb-2">누구의 시간을 계산할까요?</h3>
              <p className="text-white/70">소중한 분들과의 시간을 확인하세요</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
        type="button"
                onClick={() => handleParentSelect('both')}
                className="group bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-2xl p-8 transition-all hover:scale-105 active:scale-95"
              >
                <div className="text-6xl mb-4">👨👩</div>
                <div className="text-white text-xl font-bold">부모님 모두</div>
              </button>
              <button
        type="button"
                onClick={() => handleParentSelect('father')}
                className="group bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-2xl p-8 transition-all hover:scale-105 active:scale-95"
              >
                <div className="text-6xl mb-4">👨</div>
                <div className="text-white text-xl font-bold">아버지</div>
              </button>
              <button
        type="button"
                onClick={() => handleParentSelect('mother')}
                className="group bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-2xl p-8 transition-all hover:scale-105 active:scale-95"
              >
                <div className="text-6xl mb-4">👩</div>
                <div className="text-white text-xl font-bold">어머니</div>
              </button>
            </div>
          </PremiumCard>
        )}

        {/* Step 2: 아버지 출생년도 */}
        {step === 2 && (selectedParent === 'both' || selectedParent === 'father') && (
          <PremiumCard hover gradient className="animate-slideUp">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👨</div>
              <h3 className="text-white text-2xl font-bold mb-2">아버지는 몇 년생이신가요?</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1930"
                  max="1980"
                  value={fatherBirth}
                  onChange={(e) => setFatherBirth(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="bg-white px-8 py-4 rounded-xl text-pink-600 font-bold text-2xl min-w-[160px] text-center">
                  {formatBirthYear(fatherBirth)}
                </div>
              </div>
              <PremiumButton
                onClick={handleFatherBirth}
                variant="primary"
                size="lg"
                icon="➡️"
                fullWidth
              >
                다음
              </PremiumButton>
            </div>
          </PremiumCard>
        )}

        {/* Step 3: 어머니 출생년도 */}
        {step === 3 && selectedParent === 'both' && (
          <PremiumCard hover gradient className="animate-slideUp">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👩</div>
              <h3 className="text-white text-2xl font-bold mb-2">어머니는 몇 년생이신가요?</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1930"
                  max="1985"
                  value={motherBirth}
                  onChange={(e) => setMotherBirth(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="bg-white px-8 py-4 rounded-xl text-pink-600 font-bold text-2xl min-w-[160px] text-center">
                  {formatBirthYear(motherBirth)}
                </div>
              </div>
              <PremiumButton
                onClick={handleMotherBirth}
                variant="primary"
                size="lg"
                icon="➡️"
                fullWidth
              >
                다음
              </PremiumButton>
            </div>
          </PremiumCard>
        )}

        {/* Step 4: 시간 타입 선택 */}
        {step === 4 && (
          <PremiumCard hover gradient className="animate-slideUp">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-white text-2xl font-bold mb-2">얼마나 자주 만나시나요?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
        type="button"
                onClick={() => handleTimeType('weekly')}
                className="bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-2xl p-8 transition-all hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-4">📅</div>
                <div className="text-white text-xl font-bold">일주일 평균</div>
              </button>
              <button
        type="button"
                onClick={() => handleTimeType('monthly')}
                className="bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-2xl p-8 transition-all hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-4">📆</div>
                <div className="text-white text-xl font-bold">한달 평균</div>
              </button>
            </div>
          </PremiumCard>
        )}

        {/* Step 5: 시간 입력 */}
        {step === 5 && (
          <PremiumCard hover gradient className="animate-slideUp">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-white text-2xl font-bold mb-2">
                {timeType === 'weekly' ? '일주일' : '한달'} 평균 몇 시간씩 만나시나요?
              </h3>
              <p className="text-white/70">함께 보내는 시간을 선택해주세요</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="48"
                  value={hoursSpent}
                  onChange={(e) => setHoursSpent(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="bg-white px-8 py-4 rounded-xl text-pink-600 font-bold text-2xl min-w-[160px] text-center">
                  {hoursSpent}시간
                </div>
              </div>
              <PremiumButton
                onClick={calculate}
                variant="primary"
                size="lg"
                icon="💝"
                fullWidth
              >
                결과 확인하기
              </PremiumButton>
            </div>
          </PremiumCard>
        )}

        {/* Step 6: 결과 */}
        {step === 6 && result && (
          <div className="space-y-6 animate-fadeIn">
            {/* 긴급 메시지 */}
            <PremiumCard className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-400/50">
              <div className="text-center py-6">
                <div className="text-6xl mb-4 animate-bounce">📞</div>
                <h3 className="text-white text-3xl font-bold mb-3">지금 당장 전화드리세요!</h3>
                <p className="text-white/90 text-lg mb-4">
                  미루지 마세요. 오늘이 가장 젊은 날입니다.
                </p>
              </div>
            </PremiumCard>

            {/* 아버지 결과 */}
            {result.father && (
              <PremiumCard hover gradient>
                <h3 className="text-2xl font-bold text-white mb-6 text-center border-b border-white/20 pb-4">
                  👨 아버지 ({formatBirthYear(fatherBirth)}, 현재 {result.father.age}세)
                </h3>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-12 text-center border border-blue-400/30">
                  <div className="text-white/70 text-xl mb-6">
                    {timeType === 'weekly' ? '일주일' : '한달'} 평균 {hoursSpent}시간씩 만날 경우<br />
                    함께 보낼 수 있는 시간
                  </div>
                  <div className="text-white text-9xl font-bold mb-4">{result.father.actualMonths}</div>
                  <div className="text-white text-4xl font-bold">개월</div>
                </div>
              </PremiumCard>
            )}

            {/* 어머니 결과 */}
            {result.mother && (
              <PremiumCard hover gradient>
                <h3 className="text-2xl font-bold text-white mb-6 text-center border-b border-white/20 pb-4">
                  👩 어머니 ({formatBirthYear(motherBirth)}, 현재 {result.mother.age}세)
                </h3>
                <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-12 text-center border border-pink-400/30">
                  <div className="text-white/70 text-xl mb-6">
                    {timeType === 'weekly' ? '일주일' : '한달'} 평균 {hoursSpent}시간씩 만날 경우<br />
                    함께 보낼 수 있는 시간
                  </div>
                  <div className="text-white text-9xl font-bold mb-4">{result.mother.actualMonths}</div>
                  <div className="text-white text-4xl font-bold">개월</div>
                </div>
              </PremiumCard>
            )}

            {/* 감성 메시지 */}
            <PremiumCard className="bg-gradient-to-br from-rose-500/10 to-pink-500/10">
              <div className="text-center py-8">
                <div className="text-7xl mb-6">💝</div>
                <h3 className="text-white text-3xl font-bold mb-6">소중한 시간, 지금 시작하세요</h3>
                <div className="max-w-2xl mx-auto space-y-4 text-white/90 text-lg leading-relaxed mb-8">
                  <p className="font-semibold">
                    이 숫자는 평균일 뿐입니다.<br />
                    내일은 없을 수도 있습니다.
                  </p>
                  <p>
                    1분 1초가 소중합니다.<br />
                    미루지 말고 오늘 당장 연락하세요.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl mb-2">📞</div>
                    <p className="text-white font-bold text-sm">지금 전화하기</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl mb-2">🏠</div>
                    <p className="text-white font-bold text-sm">주말 방문하기</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl mb-2">🍽️</div>
                    <p className="text-white font-bold text-sm">함께 식사하기</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl mb-2">💐</div>
                    <p className="text-white font-bold text-sm">선물 보내기</p>
                  </div>
                </div>
              </div>
            </PremiumCard>

            {/* 다시 계산하기 */}
            <PremiumButton
              onClick={reset}
              variant="secondary"
              size="lg"
              icon="🔄"
              fullWidth
            >
              다시 계산하기
            </PremiumButton>

            {/* 통계 안내 */}
            <PremiumCard className="bg-white/5">
              <div className="text-center text-white/60 text-sm">
                <p className="mb-2">📊 통계청 2024년 기준 대한민국 평균 기대수명</p>
                <p>남성: {KOREA_LIFE_EXPECTANCY.male}세 | 여성: {KOREA_LIFE_EXPECTANCY.female}세</p>
              </div>
            </PremiumCard>

            {/* Related Apps */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <RelatedApps currentAppSlug="parents-time" className="mt-8" />
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
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </PremiumLayout>
  );
}
