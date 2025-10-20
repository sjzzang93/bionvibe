'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DailyUsage {
  day: string;
  hours: number;
  minutes: number;
}

interface CategoryUsage {
  sns: number;
  video: number;
  game: number;
  messenger: number;
}

export default function PhoneUsageAnalyzerPage() {
  const [step, setStep] = useState(1); // 1: 안내, 2: 선택, 3: 자동입력, 4: 수동입력, 5: 결과
  const [inputMethod, setInputMethod] = useState<'auto' | 'manual'>('auto');
  const [jsonData, setJsonData] = useState('');
  const [weekData, setWeekData] = useState<DailyUsage[]>([
    { day: '월요일', hours: 0, minutes: 0 },
    { day: '화요일', hours: 0, minutes: 0 },
    { day: '수요일', hours: 0, minutes: 0 },
    { day: '목요일', hours: 0, minutes: 0 },
    { day: '금요일', hours: 0, minutes: 0 },
    { day: '토요일', hours: 0, minutes: 0 },
    { day: '일요일', hours: 0, minutes: 0 },
  ]);
  const [categories, setCategories] = useState<CategoryUsage>({
    sns: 0,
    video: 0,
    game: 0,
    messenger: 0,
  });
  const [result, setResult] = useState<any>(null);

  const updateDayUsage = (index: number, field: 'hours' | 'minutes', value: string) => {
    const newData = [...weekData];
    newData[index][field] = parseInt(value) || 0;
    setWeekData(newData);
  };

  const parseJsonData = () => {
    try {
      const data = JSON.parse(jsonData);
      if (data.weekData && Array.isArray(data.weekData)) {
        setWeekData(data.weekData);
        if (data.categories) {
          setCategories(data.categories);
        }
        setStep(5);
        analyzeData();
      } else {
        alert('⚠️ JSON 형식이 올바르지 않습니다. Shortcuts 가이드를 다시 확인해주세요.');
      }
    } catch (e) {
      alert('⚠️ JSON 파싱 실패. 데이터 형식을 확인해주세요.');
    }
  };

  const openScreenTime = () => {
    // iOS 스크린 타임 설정 열기
    window.location.href = 'App-prefs:SCREEN_TIME';
  };

  const analyzeData = () => {
    // 총 사용 시간 계산
    const totalMinutes = weekData.reduce((sum, day) => sum + (day.hours * 60 + day.minutes), 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainMinutes = totalMinutes % 60;
    const avgDaily = totalMinutes / 7 / 60; // 일평균 (시간)

    // 주중/주말 구분
    const weekdayMinutes = weekData.slice(0, 5).reduce((sum, day) => sum + (day.hours * 60 + day.minutes), 0);
    const weekendMinutes = weekData.slice(5, 7).reduce((sum, day) => sum + (day.hours * 60 + day.minutes), 0);
    const avgWeekday = weekdayMinutes / 5 / 60;
    const avgWeekend = weekendMinutes / 2 / 60;
    const weekendIncrease = ((avgWeekend - avgWeekday) / avgWeekday) * 100;

    // 최대/최소 사용일
    const dailyHours = weekData.map(day => day.hours + day.minutes / 60);
    const maxDay = weekData[dailyHours.indexOf(Math.max(...dailyHours))];
    const minDay = weekData[dailyHours.indexOf(Math.min(...dailyHours))];

    // 중독도 계산 (0-10)
    let addictionScore = 0;
    if (avgDaily > 8) addictionScore += 4;
    else if (avgDaily > 6) addictionScore += 3;
    else if (avgDaily > 4) addictionScore += 2;
    else if (avgDaily > 2) addictionScore += 1;

    if (weekendIncrease > 50) addictionScore += 2;
    else if (weekendIncrease > 30) addictionScore += 1;

    const totalCategoryHours = Object.values(categories).reduce((sum, val) => sum + val, 0);
    if (categories.sns > avgDaily * 0.3) addictionScore += 1;
    if (totalCategoryHours > avgDaily * 0.8) addictionScore += 1;

    addictionScore = Math.min(10, addictionScore);

    // 중독도 레벨
    let level = '';
    let levelColor = '';
    let emoji = '';
    if (addictionScore >= 8) {
      level = '매우 높음';
      levelColor = 'bg-red-500';
      emoji = '🚨';
    } else if (addictionScore >= 6) {
      level = '높음';
      levelColor = 'bg-orange-500';
      emoji = '⚠️';
    } else if (addictionScore >= 4) {
      level = '보통';
      levelColor = 'bg-yellow-500';
      emoji = '⚡';
    } else if (addictionScore >= 2) {
      level = '낮음';
      levelColor = 'bg-blue-500';
      emoji = '👍';
    } else {
      level = '매우 낮음';
      levelColor = 'bg-green-500';
      emoji = '✨';
    }

    // 경고 지표
    const warnings = [];
    if (avgDaily > 6) warnings.push('하루 평균 6시간 초과 - 수면 및 건강에 영향');
    if (weekendIncrease > 40) warnings.push(`주말 과사용 (평균 대비 ${weekendIncrease.toFixed(0)}% 증가)`);
    if (categories.sns > avgDaily * 0.3) warnings.push('SNS 의존도 높음 (전체의 30% 이상)');
    if (categories.game > 3) warnings.push('게임 과몰입 경향 (하루 3시간 초과)');

    // 맞춤 처방
    const prescriptions = [];
    if (avgDaily > 6) prescriptions.push(`목표: 하루 ${Math.max(4, avgDaily - 2).toFixed(1)}시간으로 단계적 감소`);
    if (categories.sns > 2) prescriptions.push('SNS 앱 사용 제한 설정 (하루 1-1.5시간)');
    if (weekendIncrease > 40) prescriptions.push('주말 활동 계획 세우기 (운동, 독서, 만남 등)');
    if (avgDaily > 4) prescriptions.push('밤 11시 이후 스마트폰 거치대에 보관');
    prescriptions.push('30분마다 5분 휴식 (20-20-20 법칙)');

    setResult({
      totalHours,
      remainMinutes,
      avgDaily,
      avgWeekday,
      avgWeekend,
      weekendIncrease,
      maxDay,
      minDay,
      addictionScore,
      level,
      levelColor,
      emoji,
      warnings,
      prescriptions,
      dailyHours,
    });

    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-8 px-4" suppressHydrationWarning>
      <div className="max-w-4xl mx-auto">
        {/* STEP 1: 안내 화면 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
                📱 스마트폰 사용 시간 분석
        </h1>
              <p className="text-purple-100 text-lg">
                전문적인 중독성 진단 + 맞춤 개선 계획
              </p>
            </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
          <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  🔍 스크린 타임 확인 방법
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      📱 iPhone
                    </h3>
                    <ol className="text-white space-y-2 text-sm md:text-base">
                      <li>1️⃣ <strong>설정</strong> 앱 열기</li>
                      <li>2️⃣ <strong>스크린 타임</strong> 선택</li>
                      <li>3️⃣ <strong>모든 활동 보기</strong> 탭</li>
                      <li>4️⃣ <strong>주</strong> 탭에서 7일 데이터 확인</li>
                    </ol>
                  </div>

                  <div className="bg-white/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      📱 Android
                    </h3>
                    <ol className="text-white space-y-2 text-sm md:text-base">
                      <li>1️⃣ <strong>설정</strong> 앱 열기</li>
                      <li>2️⃣ <strong>Digital Wellbeing</strong> 선택</li>
                      <li>3️⃣ <strong>대시보드</strong> 확인</li>
                      <li>4️⃣ 각 날짜별 사용 시간 메모</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-xl p-6">
                <p className="text-white text-center font-semibold">
                  💡 <strong>지난 7일</strong> 데이터를 준비해주세요!
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all"
              >
                시작하기 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 입력 방식 선택 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                📲 입력 방식 선택
              </h1>
              <p className="text-purple-100">
                어떤 방식으로 데이터를 입력하시겠어요?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 자동 입력 (iPhone) */}
              <button
                onClick={() => {
                  setInputMethod('auto');
                  setStep(3);
                }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all border-2 border-white/20 hover:border-yellow-400 group"
              >
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  자동 입력 (추천)
                </h3>
                <div className="text-white/80 text-sm space-y-2">
                  <p>✅ iPhone 사용자 전용</p>
                  <p>✅ Shortcuts로 1초 복붙</p>
                  <p>✅ 100% 정확한 데이터</p>
                  <p className="text-yellow-300 font-bold mt-4">
                    가장 빠르고 쉬워요!
                  </p>
                </div>
              </button>

              {/* 수동 입력 */}
              <button
                onClick={() => {
                  setInputMethod('manual');
                  setStep(4);
                }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all border-2 border-white/20 hover:border-blue-400 group"
              >
                <div className="text-6xl mb-4">✏️</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  직접 입력
                </h3>
                <div className="text-white/80 text-sm space-y-2">
                  <p>✅ 모든 기기 사용 가능</p>
                  <p>✅ Android도 OK</p>
                  <p>✅ 설정 없이 바로 시작</p>
                  <p className="text-blue-300 font-bold mt-4">
                    간단하게 시작!
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              ← 뒤로
            </button>
          </div>
        )}

        {/* STEP 3: 자동 입력 (iPhone Shortcuts) */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                ⚡ 자동 입력 (iPhone)
              </h1>
              <p className="text-purple-100">
                Shortcuts로 한 번에 데이터 추출!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 space-y-6">
              {/* 단계 안내 */}
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  📱 iPhone Shortcuts 설정 (1회만)
                </h3>
                <ol className="text-white space-y-3 text-sm md:text-base">
                  <li className="flex gap-3">
                    <span className="font-bold">1️⃣</span>
                    <span><strong>Shortcuts</strong> 앱 열기</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">2️⃣</span>
                    <span>아래 <strong>"Shortcut 다운로드"</strong> 버튼 탭</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">3️⃣</span>
                    <span>Shortcut 실행 → 데이터 자동 복사</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">4️⃣</span>
                    <span>아래 입력창에 <strong>붙여넣기</strong></span>
                  </li>
                </ol>
              </div>

              {/* Shortcut 다운로드 버튼 */}
              <a
                href="shortcuts://create-shortcut"
                className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold text-xl text-center hover:shadow-lg transition-all"
              >
                📥 Shortcut 다운로드 (iPhone)
              </a>

              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-white text-sm text-center mb-2">
                  💡 <strong>Shortcut이 복잡하다면?</strong>
                </p>
                <button
                  onClick={openScreenTime}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
                >
                  📱 스크린 타임 바로 열기
                </button>
              </div>

              {/* JSON 데이터 입력 */}
              <div>
                <label className="text-white font-bold mb-3 block text-lg">
                  📋 Shortcuts 데이터 붙여넣기
                </label>
                <textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder='{"weekData": [{"day": "월요일", "hours": 5, "minutes": 30}, ...], "categories": {"sns": 2, "video": 3, ...}}'
                  className="w-full px-4 py-3 rounded-lg text-black h-40 font-mono text-sm"
                  style={{ fontSize: '14px' }}
                />
                <p className="text-white/70 text-xs mt-2">
                  Shortcuts에서 복사한 JSON 데이터를 붙여넣으세요
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white/20 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/30 transition-all"
                >
                  ← 뒤로
                </button>
                <button
                  onClick={parseJsonData}
                  disabled={!jsonData}
                  className="flex-[2] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  자동 입력 완료 →
                </button>
              </div>

              {/* 수동 입력으로 전환 */}
              <div className="text-center">
                <button
                  onClick={() => setStep(4)}
                  className="text-white/70 hover:text-white underline text-sm"
                >
                  어렵다면 직접 입력하기 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: 수동 입력 */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                📅 일주일 사용 시간 입력
              </h1>
              <p className="text-purple-100">
                각 요일별 총 사용 시간을 입력해주세요
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 space-y-6">
              {/* 요일별 입력 */}
              <div className="space-y-4">
                {weekData.map((day, index) => (
                  <div key={index} className="bg-white/20 rounded-xl p-4">
                    <label className="text-white font-bold mb-3 block text-lg">
                      {day.day}
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="24"
                          value={day.hours || ''}
                          onChange={(e) => updateDayUsage(index, 'hours', e.target.value)}
                          placeholder="0"
                          className="w-full px-4 py-3 rounded-lg text-black text-center font-bold text-xl"
                          style={{ fontSize: '18px' }}
                        />
                        <p className="text-white/80 text-center mt-1 text-sm">시간</p>
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={day.minutes || ''}
                          onChange={(e) => updateDayUsage(index, 'minutes', e.target.value)}
                          placeholder="0"
                          className="w-full px-4 py-3 rounded-lg text-black text-center font-bold text-xl"
                          style={{ fontSize: '18px' }}
                        />
                        <p className="text-white/80 text-center mt-1 text-sm">분</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 카테고리별 입력 (선택사항) */}
              <div className="border-t-2 border-white/20 pt-6">
                <h3 className="text-white font-bold mb-4 text-xl">
                  📊 주요 앱 카테고리 (선택사항)
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  더 정확한 분석을 위해 주요 카테고리별 시간을 입력해주세요
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-semibold mb-2 block">
                      SNS (인스타/페북)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={categories.sns || ''}
                      onChange={(e) => setCategories({...categories, sns: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-black"
                      style={{ fontSize: '16px' }}
                    />
                    <p className="text-white/60 text-xs mt-1">시간/일</p>
                  </div>
                  <div>
                    <label className="text-white font-semibold mb-2 block">
                      유튜브/넷플릭스
                    </label>
            <input
              type="number"
                      step="0.5"
                      min="0"
                      value={categories.video || ''}
                      onChange={(e) => setCategories({...categories, video: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
                    <p className="text-white/60 text-xs mt-1">시간/일</p>
          </div>
          <div>
                    <label className="text-white font-semibold mb-2 block">
                      게임
                    </label>
            <input
              type="number"
                      step="0.5"
                      min="0"
                      value={categories.game || ''}
                      onChange={(e) => setCategories({...categories, game: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
                    <p className="text-white/60 text-xs mt-1">시간/일</p>
          </div>
          <div>
                    <label className="text-white font-semibold mb-2 block">
                      메신저 (카톡/텔레)
                    </label>
            <input
              type="number"
                      step="0.5"
                      min="0"
                      value={categories.messenger || ''}
                      onChange={(e) => setCategories({...categories, messenger: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-black"
              style={{ fontSize: '16px' }}
            />
                    <p className="text-white/60 text-xs mt-1">시간/일</p>
                  </div>
                </div>
          </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white/20 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
                >
                  ← 뒤로
                </button>
          <button
                  onClick={analyzeData}
                  className="flex-[2] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all"
          >
                  분석 시작하기 →
          </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: 분석 결과 */}
        {step === 5 && result && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                📊 분석 결과
              </h1>
            </div>

            {/* 중독도 */}
            <div className={`${result.levelColor} rounded-2xl p-8 text-white text-center shadow-2xl`}>
              <div className="text-7xl mb-4">{result.emoji}</div>
              <div className="text-3xl font-black mb-2">
                중독도: {result.level}
              </div>
              <div className="text-5xl font-black mb-4">
                {result.addictionScore.toFixed(1)} / 10
              </div>
              <div className="text-xl opacity-90">
                일 평균 {result.avgDaily.toFixed(1)}시간 사용
              </div>
            </div>

            {/* 7일 통계 */}
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 7일 통계</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">총 사용시간</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {result.totalHours}시간 {result.remainMinutes}분
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">일 평균</span>
                  <span className="text-xl font-bold text-purple-600">
                    {result.avgDaily.toFixed(1)}시간
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">최대 사용일</span>
                  <span className="text-lg font-bold text-red-500">
                    {result.maxDay.day} - {result.maxDay.hours}h {result.maxDay.minutes}m
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">최소 사용일</span>
                  <span className="text-lg font-bold text-green-500">
                    {result.minDay.day} - {result.minDay.hours}h {result.minDay.minutes}m
                  </span>
                </div>
              </div>

              {/* 주중/주말 비교 */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">📈 트렌드 분석</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">주중 평균</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.avgWeekday.toFixed(1)}h
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">주말 평균</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {result.avgWeekend.toFixed(1)}h
                      {result.weekendIncrease > 0 && (
                        <span className="text-sm ml-2">
                          (+{result.weekendIncrease.toFixed(0)}%↑)
                        </span>
                      )}
                  </div>
                  </div>
                  </div>
                </div>
              </div>

            {/* 경고 지표 */}
            {result.warnings.length > 0 && (
              <div className="bg-red-500 rounded-2xl p-6 md:p-8 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  ⚠️ 경고 지표
                </h2>
                <ul className="space-y-3">
                  {result.warnings.map((warning: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-lg">
                      <span className="text-2xl">🚨</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 맞춤 처방 */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 text-white">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                💊 맞춤 처방
              </h2>
              <div className="space-y-4">
                {result.prescriptions.map((prescription: string, idx: number) => (
                  <div key={idx} className="bg-white/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl font-bold">{idx + 1}</span>
                      <span className="text-lg flex-1">{prescription}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 재분석 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(inputMethod === 'auto' ? 3 : 4)}
                className="flex-1 bg-white/20 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
              >
                ← 데이터 수정
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setJsonData('');
                  setWeekData([
                    { day: '월요일', hours: 0, minutes: 0 },
                    { day: '화요일', hours: 0, minutes: 0 },
                    { day: '수요일', hours: 0, minutes: 0 },
                    { day: '목요일', hours: 0, minutes: 0 },
                    { day: '금요일', hours: 0, minutes: 0 },
                    { day: '토요일', hours: 0, minutes: 0 },
                    { day: '일요일', hours: 0, minutes: 0 },
                  ]);
                  setCategories({ sns: 0, video: 0, game: 0, messenger: 0 });
                  setResult(null);
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
              >
                🔄 처음부터
              </button>
              </div>
            </div>
          )}

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
