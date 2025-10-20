"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

interface TimeData {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
}

interface MemoryData {
  conversations: number;
  memories: number;
  photos: number;
  meals: number;
  travels: number;
}

// 대한민국 통계청 2023년 기준 평균 기대수명
const KOREA_LIFE_EXPECTANCY = {
  male: 80.6,    // 남성 평균 기대수명
  female: 86.6,  // 여성 평균 기대수명
  average: 83.5  // 전체 평균 기대수명
};

export default function ParentsTimeCalculator() {
  const [fatherBirthYear, setFatherBirthYear] = useState<number>(1963);
  const [motherBirthYear, setMotherBirthYear] = useState<number>(1967);
  const [userBirthYear, setUserBirthYear] = useState<number>(1993);
  const [selectedParents, setSelectedParents] = useState<{father: boolean; mother: boolean}>({
    father: true,
    mother: true
  });
  const [fatherAge, setFatherAge] = useState<number>(61);
  const [motherAge, setMotherAge] = useState<number>(57);
  const [userAge, setUserAge] = useState<number>(31);
  const [meetingFrequency, setMeetingFrequency] = useState<string>('weekly');
  const [meetingDuration, setMeetingDuration] = useState<number>(2);
  const [memoryData, setMemoryData] = useState<MemoryData>({
    conversations: 1,
    memories: 1,
    photos: 1,
    meals: 1,
    travels: 0
  });
  const [fatherResult, setFatherResult] = useState<TimeData | null>(null);
  const [motherResult, setMotherResult] = useState<TimeData | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 나이 자동 계산
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setFatherAge(currentYear - fatherBirthYear);
  }, [fatherBirthYear]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setMotherAge(currentYear - motherBirthYear);
  }, [motherBirthYear]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setUserAge(currentYear - userBirthYear);
  }, [userBirthYear]);

  const calculateTimeForParent = (age: number, gender: 'male' | 'female'): TimeData => {
    // 한국 통계청 기준 성별별 기대수명
    const expectedLifespan = KOREA_LIFE_EXPECTANCY[gender];
    const remainingYears = Math.max(0, expectedLifespan - age);
    
    // 남은 시간 계산 (더 정확한 계산)
    const totalDays = Math.floor(remainingYears * 365.25); // 윤년 고려
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.44); // 월평균 일수 고려
    const totalHours = totalDays * 24;
    
    // 만날 수 있는 시간 계산
    const frequencyMap: Record<string, number> = {
      'monthly': 12,
      'biweekly': 26,
      'weekly': 52,
      'twice': 104,
      'daily': 365
    };
    
    const meetingTimesPerYear = frequencyMap[meetingFrequency] || 52;
    const totalMeetingTimes = Math.floor(meetingTimesPerYear * remainingYears);
    const totalMeetingHours = totalMeetingTimes * meetingDuration;
    
    return {
      years: Math.floor(remainingYears),
      months: totalMonths,
      weeks: totalWeeks,
      days: totalDays,
      hours: totalMeetingHours
    };
  };

  const calculateTime = () => {
    if (selectedParents.father) {
      const fatherData = calculateTimeForParent(fatherAge, 'male');
      setFatherResult(fatherData);
    }
    
    if (selectedParents.mother) {
      const motherData = calculateTimeForParent(motherAge, 'female');
      setMotherResult(motherData);
    }
    
    setShowResult(true);
  };

  const toggleParent = (parent: 'father' | 'mother') => {
    setSelectedParents(prev => ({
      ...prev,
      [parent]: !prev[parent]
    }));
  };

  const ParentResultCard = ({ title, result, gender, emoji }: { title: string; result: TimeData; gender: 'male' | 'female'; emoji: string }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-purple-200">
      <h4 className="text-xl font-semibold text-black mb-4 text-center">
        {emoji} {title}와 남은 기간
      </h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{result.months}</div>
          <div className="text-sm text-gray-600 font-medium">개월</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{result.days}</div>
          <div className="text-sm text-gray-600 font-medium">일</div>
        </div>
      </div>
      <div className="text-center mb-4">
        <div className="text-lg font-semibold text-gray-700">
          약 <span className="text-black text-xl">{result.years}</span>년 남음
        </div>
        <div className="text-xs text-gray-500 mt-1">
          📊 한국 통계청 2023년 기준 {gender === 'male' ? '남성' : '여성'} 평균 기대수명 {KOREA_LIFE_EXPECTANCY[gender]}세
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl p-4 border border-purple-200">
        <div className="text-sm text-gray-700 text-center mb-2">⏰ 만날 수 있는 총 시간</div>
        <div className="text-center">
          <div className="text-3xl font-bold">{result.hours.toLocaleString()}</div>
          <div className="text-sm text-gray-600 font-medium">시간</div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-red-50 relative overflow-hidden">
      {/* 카네이션 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 text-6xl text-gray-300 transform rotate-12">🌸</div>
        <div className="absolute top-32 left-10 text-5xl text-gray-300 transform -rotate-12">🌺</div>
        <div className="absolute bottom-32 right-20 text-4xl text-gray-400 transform rotate-45">🌷</div>
        <div className="absolute bottom-10 left-20 text-5xl text-gray-400 transform -rotate-30">🌹</div>
      </div>

      <div className="mx-auto max-w-[520px] px-4 py-6 relative z-10">
        {/* 메인 카드 */}
        <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-purple-200 relative overflow-hidden">
          {/* 카네이션 장식 */}
          <div className="absolute -top-4 -right-4 text-8xl text-gray-200 opacity-30">🌸</div>
          <div className="absolute -bottom-2 -left-4 text-6xl text-gray-200 opacity-30">🌺</div>
          
          <header className="text-center mb-8 relative z-10">
            <div className="text-6xl mb-4">💕</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              부모님과 남은 시간
            </h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">계산기</h2>
            <p className="text-gray-600 text-lg">소중한 시간을 더 의미있게 보내세요</p>
          </header>

          <div className="space-y-6">
            {/* 입력 폼 */}
            <div className="space-y-6">
              {/* 부모님 선택 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-2xl p-4 border border-purple-200">
                <label className="block text-sm font-medium text-black mb-3">
                  👨‍👩‍👧‍👦 계산할 부모님 선택 (중복 선택 가능)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleParent('father')}
                    className={`py-4 px-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedParents.father
                        ? 'border-blue-500 bg-blue-100 text-black font-semibold shadow-lg'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">👨</div>
                    <div className="text-base font-semibold">아버지</div>
                    <div className="text-xs text-gray-500 mt-1">기대수명 80.6세</div>
                    {selectedParents.father && (
                      <div className="mt-2 text-xs text-black font-medium">✓ 선택됨</div>
                    )}
                  </button>
                  <button
                    onClick={() => toggleParent('mother')}
                    className={`py-4 px-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedParents.mother
                        ? 'border-purple-500 bg-purple-100 text-black font-semibold shadow-lg'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">👩</div>
                    <div className="text-base font-semibold">어머니</div>
                    <div className="text-xs text-gray-500 mt-1">기대수명 86.6세</div>
                    {selectedParents.mother && (
                      <div className="mt-2 text-xs text-black font-medium">✓ 선택됨</div>
                    )}
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center">
                  💡 한국 통계청 2023년 기준 성별 평균 기대수명
                </div>
              </div>

              {/* 나이 입력 */}
              <div className="grid grid-cols-1 gap-4">
                {selectedParents.father && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                    <label className="block text-sm font-medium text-black mb-2">
                      👨 아버지 태어난 년도
                    </label>
                    <input
                      type="number"
                      value={fatherBirthYear}
                      onChange={(e) => setFatherBirthYear(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                      min="1920"
                      max="2010"
                    />
                    <div className="mt-2 text-sm text-black font-medium">
                      현재 나이: <span className="text-lg">{fatherAge}세</span>
                    </div>
                  </div>
                )}

                {selectedParents.mother && (
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200">
                    <label className="block text-sm font-medium text-black mb-2">
                      👩 어머니 태어난 년도
                    </label>
                    <input
                      type="number"
                      value={motherBirthYear}
                      onChange={(e) => setMotherBirthYear(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-black"
                      min="1920"
                      max="2010"
                    />
                    <div className="mt-2 text-sm text-black font-medium">
                      현재 나이: <span className="text-lg">{motherAge}세</span>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                  <label className="block text-sm font-medium text-black mb-2">
                    👤 내 태어난 년도
                  </label>
                    <input
                      type="number"
                      value={userBirthYear}
                      onChange={(e) => setUserBirthYear(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-black"
                      min="1950"
                      max="2010"
                    />
                  <div className="mt-2 text-sm text-black font-medium">
                    현재 나이: <span className="text-lg">{userAge}세</span>
                  </div>
                </div>
              </div>

              {/* 만남 빈도 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-2xl p-4 border border-purple-200">
                <label className="block text-sm font-medium text-black mb-3">
                  💬 함께 나눈 대화 빈도
                </label>
                <select
                  value={meetingFrequency}
                  onChange={(e) => setMeetingFrequency(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-black"
                >
                  <option value="monthly">월 1회 - 정기적인 대화</option>
                  <option value="biweekly">격주 1회 - 자주 만나서 대화</option>
                  <option value="weekly">주 1회 - 정기적인 만남</option>
                  <option value="twice">주 2-3회 - 자주 만나는 편</option>
                  <option value="daily">거의 매일 - 함께 살거나 가까이</option>
                </select>
              </div>

              {/* 만남 시간 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                <label className="block text-sm font-medium text-black mb-3">
                  ⏰ 한 번 만남 시간
                </label>
                <select
                  value={meetingDuration}
                  onChange={(e) => setMeetingDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-black"
                >
                  <option value={1}>1시간 - 짧은 인사</option>
                  <option value={2}>2시간 - 대화하며 식사</option>
                  <option value={3}>3시간 - 여유로운 만남</option>
                  <option value={4}>4시간 - 하루 종일 함께</option>
                  <option value={6}>6시간 - 반나절 함께</option>
                  <option value={8}>8시간 - 하루 종일</option>
                </select>
              </div>

              {/* 감성적인 기억 항목들 */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-black mb-4">💭 함께 나눈 소중한 기억들</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      🗣️ 깊은 대화 횟수 (월)
                    </label>
                    <input
                      type="number"
                      value={memoryData.conversations}
                      onChange={(e) => setMemoryData({...memoryData, conversations: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black"
                      min="0"
                      max="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      📸 함께 찍은 사진 (월)
                    </label>
                    <input
                      type="number"
                      value={memoryData.photos}
                      onChange={(e) => setMemoryData({...memoryData, photos: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black"
                      min="0"
                      max="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      🍽️ 함께한 식사 (월)
                    </label>
                    <input
                      type="number"
                      value={memoryData.meals}
                      onChange={(e) => setMemoryData({...memoryData, meals: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black"
                      min="0"
                      max="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      🚗 함께한 여행 (년)
                    </label>
                    <input
                      type="number"
                      value={memoryData.travels}
                      onChange={(e) => setMemoryData({...memoryData, travels: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 계산 버튼 */}
            <button
              onClick={calculateTime}
              disabled={!selectedParents.father && !selectedParents.mother}
              className={`w-full py-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                (!selectedParents.father && !selectedParents.mother) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              💕 소중한 시간 계산하기
            </button>

            {/* 결과 표시 */}
            {showResult && (
              <div className="bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 rounded-3xl p-8 border-2 border-purple-300 shadow-xl">
                <h3 className="text-2xl font-bold text-black mb-6 text-center">💝 계산 결과</h3>
                
                {/* 아버지 결과 */}
                {selectedParents.father && fatherResult && (
                  <ParentResultCard 
                    title="아버지" 
                    result={fatherResult} 
                    gender="male"
                    emoji="👨"
                  />
                )}

                {/* 어머니 결과 */}
                {selectedParents.mother && motherResult && (
                  <ParentResultCard 
                    title="어머니" 
                    result={motherResult} 
                    gender="female"
                    emoji="👩"
                  />
                )}

                {/* 감성 메시지 */}
                <div className="text-center mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
                  <p className="text-lg text-black font-medium italic">
                    &ldquo;시간은 돌이킬 수 없어요.<br />
                    오늘 만나세요. 💕&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}

