'use client';

import { useState, useEffect } from 'react';
import AppFooter from '@/app/components/AppFooter';
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
  const [hasScreenTimeData, setHasScreenTimeData] = useState(false);
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
  const [showResult, setShowResult] = useState(false);

  // URL 파라미터에서 데이터 자동 수신 (Shortcuts에서 전달)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        if (parsed.weekData && Array.isArray(parsed.weekData)) {
          setWeekData(parsed.weekData);
          if (parsed.categories) {
            setCategories(parsed.categories);
          }
          setHasScreenTimeData(true);
          analyzeData(parsed.weekData, parsed.categories || categories);
        }
      } catch (e) {
        console.error('URL 데이터 파싱 실패:', e);
      }
    }
  }, []);

  const updateDayUsage = (index: number, field: 'hours' | 'minutes', value: string) => {
    const newData = [...weekData];
    newData[index][field] = parseInt(value) || 0;
    setWeekData(newData);
  };

  const analyzeData = (data = weekData, cats = categories) => {
    // 총 사용 시간 계산
    const totalMinutes = data.reduce((sum, day) => sum + (day.hours * 60 + day.minutes), 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainMinutes = totalMinutes % 60;
    const avgDaily = totalMinutes / 7 / 60;

    // 주중/주말 구분
    const weekdayMinutes = data.slice(0, 5).reduce((sum, day) => sum + (day.hours * 60 + day.minutes), 0);
    const weekendMinutes = data.slice(5, 7).reduce((sum, day) => sum + (day.hours * 60 + day.minutes), 0);
    const avgWeekday = weekdayMinutes / 5 / 60;
    const avgWeekend = weekendMinutes / 2 / 60;
    const weekendIncrease = avgWeekday > 0 ? ((avgWeekend - avgWeekday) / avgWeekday) * 100 : 0;

    // 최대/최소 사용일
    const dailyHours = data.map(day => day.hours + day.minutes / 60);
    const maxDay = data[dailyHours.indexOf(Math.max(...dailyHours))];
    const minDay = data[dailyHours.indexOf(Math.min(...dailyHours))];

    // 중독도 계산 (0-10)
    let addictionScore = 0;
    if (avgDaily > 8) addictionScore += 4;
    else if (avgDaily > 6) addictionScore += 3;
    else if (avgDaily > 4) addictionScore += 2;
    else if (avgDaily > 2) addictionScore += 1;

    if (weekendIncrease > 50) addictionScore += 2;
    else if (weekendIncrease > 30) addictionScore += 1;

    const totalCategoryHours = Object.values(cats).reduce((sum, val) => sum + val, 0);
    if (cats.sns > avgDaily * 0.3) addictionScore += 1;
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
    if (cats.sns > avgDaily * 0.3) warnings.push('SNS 의존도 높음 (전체의 30% 이상)');
    if (cats.game > 3) warnings.push('게임 과몰입 경향 (하루 3시간 초과)');

    // 맞춤 처방
    const prescriptions = [];
    if (avgDaily > 6) prescriptions.push(`목표: 하루 ${Math.max(4, avgDaily - 2).toFixed(1)}시간으로 단계적 감소`);
    if (cats.sns > 2) prescriptions.push('SNS 앱 사용 제한 설정 (하루 1-1.5시간)');
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

    setShowResult(true);
  };

  const openScreenTime = () => {
    // iOS 스크린 타임 설정으로 이동
    if (window.confirm('스크린 타임 설정으로 이동할까요?')) {
      window.open('App-prefs:SCREEN_TIME', '_blank');
    }
  };

  const generateShortcutUrl = () => {
    // iOS Shortcuts 앱 실행
    const currentUrl = window.location.origin + window.location.pathname;
    const shortcutData = {
      name: "BION 스크린타임 분석",
      url: currentUrl,
      instructions: "Screen Time 데이터를 입력하고 URL을 통해 전달합니다."
    };
    
    // Shortcuts Gallery로 이동
    alert('📱 iOS Shortcuts 설정 방법:\n\n1. iPhone 설정 → 스크린 타임\n2. 7일 데이터 확인 및 메모\n3. 아래 입력창에 직접 입력\n\n💡 Shortcut으로 자동화하려면 Shortcuts 앱에서 별도 워크플로우를 만들어야 합니다.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-600 dark:via-pink-600 dark:to-red-600 py-8 px-4 transition-colors" suppressHydrationWarning>
      <div className="max-w-4xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            {/* 헤더 */}
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
                📱 스마트폰 사용 시간 분석
              </h1>
              <p className="text-purple-100 text-lg">
                iPhone 전용 - Screen Time 자동 연동
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded sm:rounded-lg md:rounded-2xl p-6 md:p-8 space-y-6">
              {/* iPhone Screen Time 안내 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  📱 iPhone Screen Time 확인하기
                </h2>
                <ol className="space-y-3 text-[10px] sm:text-xs md:text-sm">
                  <li className="flex gap-0 sm:gap-1.5 md:gap-3">
                    <span className="font-bold text-yellow-300">1️⃣</span>
                    <span>iPhone <strong>설정</strong> 앱 열기</span>
                  </li>
                  <li className="flex gap-0 sm:gap-1.5 md:gap-3">
                    <span className="font-bold text-yellow-300">2️⃣</span>
                    <span><strong>스크린 타임</strong> 메뉴 선택</span>
                  </li>
                  <li className="flex gap-0 sm:gap-1.5 md:gap-3">
                    <span className="font-bold text-yellow-300">3️⃣</span>
                    <span><strong>모든 활동 보기</strong> 탭</span>
                  </li>
                  <li className="flex gap-0 sm:gap-1.5 md:gap-3">
                    <span className="font-bold text-yellow-300">4️⃣</span>
                    <span><strong>주</strong> 탭으로 전환하여 7일 데이터 확인</span>
                  </li>
                </ol>
                <button
                  onClick={openScreenTime}
                  className="w-full mt-4 bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-all"
                >
                  ⚡ 스크린 타임 바로 열기
                </button>
              </div>

              {/* 요일별 입력 */}
              <div>
                <h3 className="text-white font-bold mb-4 text-xl">
                  📅 7일 사용 시간 입력
                </h3>
                <div className="space-y-3">
                  {weekData.map((day, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-4">
                      <label className="text-white font-bold mb-2 block">
                        {day.day}
                      </label>
                      <div className="flex gap-0 sm:gap-1.5 md:gap-3">
                        <div className="flex-1">
                          <input
                            type="number"
                            min="0"
                            max="24"
                            value={day.hours || ''}
                            onChange={(e) => updateDayUsage(index, 'hours', e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-3 rounded-lg text-black text-center font-bold text-xl"
                            style={{ fontSize: '16px', minHeight: '44px' }}
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
                            style={{ fontSize: '16px', minHeight: '44px' }}
                          />
                          <p className="text-white/80 text-center mt-1 text-sm">분</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 카테고리별 입력 */}
              <div className="border-t-2 border-white/20 pt-6">
                <h3 className="text-white font-bold mb-4 text-xl">
                  📊 주요 앱 카테고리 (선택사항)
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  더 정확한 분석을 위해 카테고리별 일평균 시간을 입력해주세요
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-white font-semibold mb-2 block text-sm">
                      SNS (인스타/페북)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={categories.sns || ''}
                      onChange={(e) => setCategories({...categories, sns: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-black text-center font-bold"
                      style={{ fontSize: '16px', minHeight: '44px' }}
                    />
                    <p className="text-white/60 text-xs mt-1 text-center">시간/일</p>
                  </div>
                  <div>
                    <label className="text-white font-semibold mb-2 block text-sm">
                      유튜브/넷플릭스
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={categories.video || ''}
                      onChange={(e) => setCategories({...categories, video: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-black text-center font-bold"
                      style={{ fontSize: '16px', minHeight: '44px' }}
                    />
                    <p className="text-white/60 text-xs mt-1 text-center">시간/일</p>
                  </div>
                  <div>
                    <label className="text-white font-semibold mb-2 block text-sm">
                      게임
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={categories.game || ''}
                      onChange={(e) => setCategories({...categories, game: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-black text-center font-bold"
                      style={{ fontSize: '16px', minHeight: '44px' }}
                    />
                    <p className="text-white/60 text-xs mt-1 text-center">시간/일</p>
                  </div>
                  <div>
                    <label className="text-white font-semibold mb-2 block text-sm">
                      메신저 (카톡/텔레)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={categories.messenger || ''}
                      onChange={(e) => setCategories({...categories, messenger: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-black text-center font-bold"
                      style={{ fontSize: '16px', minHeight: '44px' }}
                    />
                    <p className="text-white/60 text-xs mt-1 text-center">시간/일</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => analyzeData()}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition-all"
                style={{ minHeight: '48px' }}
              >
                🔍 분석 시작하기
              </button>

              <div className="text-center text-white/60 text-sm">
                <p>💡 iPhone Screen Time에서 확인한 데이터를 입력하세요</p>
                <p className="mt-2">⚡ 입력 시간: 약 2-3분</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                📊 분석 결과
              </h1>
            </div>

            {/* 중독도 */}
            <div className={`${result.levelColor} rounded sm:rounded-lg md:rounded-2xl p-8 text-white text-center shadow-2xl`}>
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
            <div className="bg-white rounded sm:rounded-lg md:rounded-2xl p-6 md:p-8">
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
                <div className="grid grid-cols-3 gap-2">
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
              <div className="bg-red-500 rounded sm:rounded-lg md:rounded-2xl p-6 md:p-8 text-white">
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
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded sm:rounded-lg md:rounded-2xl p-6 md:p-8 text-white">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                💊 맞춤 처방
              </h2>
              <div className="space-y-4">
                {result.prescriptions.map((prescription: string, idx: number) => (
                  <div key={idx} className="bg-white/20 rounded-xl p-4">
                    <div className="flex items-start gap-0 sm:gap-1.5 md:gap-3">
                      <span className="text-2xl font-bold">{idx + 1}</span>
                      <span className="text-lg flex-1">{prescription}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 재분석 버튼 */}
            <div className="flex gap-0 sm:gap-1.5 md:gap-3">
              <button
                onClick={() => {
                  setShowResult(false);
                  setResult(null);
                }}
                className="flex-1 bg-white/20 text-white px-6 py-4 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm hover:bg-white/30 transition-all"
              >
                ← 데이터 수정
              </button>
              <button
                onClick={() => {
                  setShowResult(false);
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
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm hover:shadow-lg transition-all"
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

      {/* 제작자 서명 */}
      <AppFooter />
      </div>
    </div>
  );
}
