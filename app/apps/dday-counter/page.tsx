"use client";

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
interface DDay {
  title: string;
  date: string;
  daysLeft: number;
  isPast: boolean;
}

export default function DDayCounter() {
  const [events, setEvents] = useState<{title: string; date: string}[]>([{title: '', date: ''}]);
  const [results, setResults] = useState<DDay[]>([]);
  const [showResult, setShowResult] = useState(false);

  const addEvent = () => {
    setEvents([...events, {title: '', date: ''}]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: 'title' | 'date', value: string) => {
    const newEvents = [...events];
    newEvents[index][field] = value;
    setEvents(newEvents);
  };

  const calculateDdays = () => {
    const validEvents = events.filter(e => e.title && e.date);
    
    if (validEvents.length === 0) {
      alert('최소 1개의 일정을 입력해주세요.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const calculated = validEvents.map(event => {
      const targetDate = new Date(event.date);
      targetDate.setHours(0, 0, 0, 0);
      
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        title: event.title,
        date: event.date,
        daysLeft: Math.abs(diffDays),
        isPast: diffDays < 0
      };
    });

    // 날짜순 정렬 (가까운 순)
    calculated.sort((a, b) => {
      if (a.isPast && !b.isPast) return 1;
      if (!a.isPast && b.isPast) return -1;
      return a.daysLeft - b.daysLeft;
    });

    setResults(calculated);
    setShowResult(true);
  };

  const reset = () => {
    setEvents([{title: '', date: ''}]);
    setResults([]);
    setShowResult(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getDdayColor = (daysLeft: number, isPast: boolean) => {
    if (isPast) return 'from-gray-500 to-slate-500';
    if (daysLeft === 0) return 'from-red-500 to-purple-500';
    if (daysLeft <= 7) return 'from-orange-500 to-red-500';
    if (daysLeft <= 30) return 'from-yellow-500 to-orange-500';
    if (daysLeft <= 100) return 'from-green-500 to-emerald-500';
    return 'from-blue-500 to-cyan-500';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 text-black dark:text-white placeholder-gray-500 transition-colors">
      <div className="mx-auto max-w-[720px] px-4 py-6 text-black placeholder-gray-500">
        {/* 메인 카드 */}
        <section className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200 text-black placeholder-gray-500">
          <header className="text-center mb-8 text-black placeholder-gray-500">
            <div className="text-6xl mb-4 text-black placeholder-gray-500">📅</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent mb-3 text-black placeholder-gray-500">
              D-Day 카운터
            </h1>
            <p className="text-gray-600 text-black placeholder-gray-500">중요한 날까지 며칠 남았는지 계산해보세요</p>
          </header>

          {!showResult ? (
            <div className="space-y-6 text-black placeholder-gray-500">
              {/* 일정 입력 */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-black placeholder-gray-500">📝 일정 입력</h3>
                <div className="space-y-4 text-black placeholder-gray-500">
                  {events.map((event, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-2xl p-6 border border-purple-200 text-black placeholder-gray-500">
                      <div className="flex justify-between items-center mb-4 text-black placeholder-gray-500">
                        <h4 className="text-lg font-semibold text-black text-black placeholder-gray-500">일정 {index + 1}</h4>
                        {events.length > 1 && (
                          <button
                            onClick={() => removeEvent(index)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black placeholder-gray-500">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">
                            일정 제목
                          </label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => updateEvent(index, 'title', e.target.value)}
                            placeholder="예: 수능, 결혼식, 입대일"
                            className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">
                            날짜
                          </label>
                          <input
                            type="date"
                            value={event.date}
                            onChange={(e) => updateEvent(index, 'date', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 일정 추가 버튼 */}
                <button
                  onClick={addEvent}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  + 일정 추가
                </button>
              </div>

              {/* 계산 버튼 */}
              <button
                onClick={calculateDdays}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                📅 D-Day 계산하기
              </button>

              {/* 도움말 */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 text-black placeholder-gray-500">
                <h4 className="text-sm font-semibold text-black mb-2 text-black placeholder-gray-500">💡 사용 팁</h4>
                <ul className="text-sm text-gray-700 space-y-1 text-black placeholder-gray-500">
                  <li>• 여러 일정을 한 번에 등록할 수 있습니다</li>
                  <li>• 과거 날짜도 입력 가능합니다 (D+로 표시)</li>
                  <li>• 결과는 날짜가 가까운 순으로 정렬됩니다</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-black placeholder-gray-500">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 text-black placeholder-gray-500">🎯 D-Day 계산 결과</h3>

              {/* 결과 표시 */}
              <div className="space-y-4 text-black placeholder-gray-500">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-r ${getDdayColor(result.daysLeft, result.isPast)} bg-opacity-90 rounded-2xl p-6 border-2 ${
                      result.isPast ? 'border-gray-300' : 'border-purple-300'
                    } shadow-lg`}
                  >
                    <div className="flex justify-between items-start mb-4 text-black placeholder-gray-500">
                      <div className="flex-1 text-black placeholder-gray-500">
                        <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-lg text-black placeholder-gray-500">{result.title}</h4>
                        <p className="text-gray-100 drop-shadow-md text-black placeholder-gray-500">{formatDate(result.date)}</p>
                      </div>
                      <div className="text-right text-black placeholder-gray-500">
                        <div className="text-5xl font-bold text-white drop-shadow-lg text-black placeholder-gray-500">
                          {result.isPast ? 'D+' : result.daysLeft === 0 ? 'D-DAY' : 'D-'}{result.daysLeft === 0 ? '' : result.daysLeft}
                        </div>
                      </div>
                    </div>

                    {/* 진행률 바 */}
                    {!result.isPast && result.daysLeft > 0 && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2 text-black placeholder-gray-500">
                          <span>남은 시간</span>
                          <span>
                            {Math.floor(result.daysLeft / 365) > 0 && `${Math.floor(result.daysLeft / 365)}년 `}
                            {Math.floor((result.daysLeft % 365) / 30) > 0 && `${Math.floor((result.daysLeft % 365) / 30)}개월 `}
                            {result.daysLeft % 30}일
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 text-black placeholder-gray-500">
                          <div
                            className={`bg-gradient-to-r ${getDdayColor(result.daysLeft, result.isPast)} h-3 rounded-full transition-all duration-1000`}
                            style={{ width: `${Math.min(100, (1 - result.daysLeft / Math.max(result.daysLeft, 100)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 상태 메시지 */}
                    <div className="mt-4 text-center text-black placeholder-gray-500">
                      {result.isPast ? (
                        <p className="text-gray-600 font-medium text-black placeholder-gray-500">이미 지나간 날짜입니다</p>
                      ) : result.daysLeft === 0 ? (
                        <p className="text-2xl font-bold text-black text-black placeholder-gray-500">🎉 오늘이 바로 그날! 🎉</p>
                      ) : result.daysLeft === 1 ? (
                        <p className="text-lg font-semibold text-black text-black placeholder-gray-500">⚠️ 내일입니다!</p>
                      ) : result.daysLeft <= 7 ? (
                        <p className="text-lg font-semibold text-black text-black placeholder-gray-500">⚡ 일주일 이내!</p>
                      ) : result.daysLeft <= 30 ? (
                        <p className="text-lg font-semibold text-black text-black placeholder-gray-500">📌 한 달 이내!</p>
                      ) : (
                        <p className="text-gray-600 text-black placeholder-gray-500">차근차근 준비하세요</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 다시 계산 버튼 */}
              <button
                onClick={reset}
                className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🔄 새로 계산하기
              </button>
            </div>
          )}
        </section>

        {/* 하단 배너 */}
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}
