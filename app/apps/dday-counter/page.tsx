"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';

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
    <PremiumLayout theme="purple">
      <div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          <PremiumHeader 
            icon="📅"
            title="D-Day 카운터"
            subtitle="중요한 날까지 며칠 남았는지 계산해보세요"
            gradient="from-purple-200 via-pink-200 to-blue-200"
          />

          {!showResult ? (
            <PremiumCard className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">📝 일정 입력</h3>
                
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div key={index} className="bg-white/10 rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/20">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">일정 {index + 1}</h4>
                        {events.length > 1 && (
                          <button
        type="button"
                            onClick={() => removeEvent(index)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            일정 제목
                          </label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => updateEvent(index, 'title', e.target.value)}
                            placeholder="예: 수능, 결혼식, 입대일"
                            className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/10 text-white placeholder-white/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            날짜
                          </label>
                          <input
                            type="date"
                            value={event.date}
                            onChange={(e) => updateEvent(index, 'date', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
        type="button"
                  onClick={addEvent}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all border border-white/30"
                >
                  + 일정 추가
                </button>

                <PremiumButton
                  onClick={calculateDdays}
                  fullWidth
                  size="lg"
                >
                  📅 D-Day 계산하기
                </PremiumButton>

                <div className="bg-blue-500/20 rounded-xl p-2 sm:p-3 md:p-4 border border-blue-400/30">
                  <h4 className="text-sm font-semibold text-white mb-2">💡 사용 팁</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• 여러 일정을 한 번에 등록할 수 있습니다</li>
                    <li>• 과거 날짜도 입력 가능합니다 (D+로 표시)</li>
                    <li>• 결과는 날짜가 가까운 순으로 정렬됩니다</li>
                  </ul>
                </div>
              </div>
            </PremiumCard>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-white mb-8">🎯 D-Day 계산 결과</h3>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <PremiumCard 
                    key={index}
                    hover
                    className={`bg-gradient-to-r ${getDdayColor(result.daysLeft, result.isPast)}`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h4 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{result.title}</h4>
                        <p className="text-white/90 drop-shadow-md text-lg">{formatDate(result.date)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-6xl font-black text-white drop-shadow-2xl">
                          {result.isPast ? 'D+' : result.daysLeft === 0 ? 'D-DAY' : 'D-'}{result.daysLeft === 0 ? '' : result.daysLeft}
                        </div>
                      </div>
                    </div>

                    {!result.isPast && result.daysLeft > 0 && (
                      <div>
                        <div className="flex justify-between text-sm text-white/70 mb-2">
                          <span>남은 시간</span>
                          <span>
                            {Math.floor(result.daysLeft / 365) > 0 && `${Math.floor(result.daysLeft / 365)}년 `}
                            {Math.floor((result.daysLeft % 365) / 30) > 0 && `${Math.floor((result.daysLeft % 365) / 30)}개월 `}
                            {result.daysLeft % 30}일
                          </span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-3">
                          <div
                            className="bg-white h-3 rounded-full transition-all duration-1000 shadow-lg"
                            style={{ width: `${Math.min(100, (1 - result.daysLeft / Math.max(result.daysLeft, 100)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-6 text-center">
                      {result.isPast ? (
                        <p className="text-white/70 font-medium text-lg">이미 지나간 날짜입니다</p>
                      ) : result.daysLeft === 0 ? (
                        <p className="text-3xl font-bold text-white">🎉 오늘이 바로 그날! 🎉</p>
                      ) : result.daysLeft === 1 ? (
                        <p className="text-2xl font-semibold text-white">⚠️ 내일입니다!</p>
                      ) : result.daysLeft <= 7 ? (
                        <p className="text-xl font-semibold text-white">⚡ 일주일 이내!</p>
                      ) : result.daysLeft <= 30 ? (
                        <p className="text-xl font-semibold text-white">📌 한 달 이내!</p>
                      ) : (
                        <p className="text-white/70 text-lg">차근차근 준비하세요</p>
                      )}
                    </div>
                  </PremiumCard>
                ))}
              </div>

              <PremiumButton
                onClick={reset}
                fullWidth
                size="lg"
                variant="secondary"
              >
                🔄 새로 계산하기
              </PremiumButton>
            </div>
          )}
        </div>
      </div>
    </PremiumLayout>
  );
}
