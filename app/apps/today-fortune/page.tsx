'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FortuneResult {
  zodiac: string;
  emoji: string;
  overall: number;
  love: number;
  money: number;
  health: number;
  study: number;
  message: string;
  luckyColor: string;
  luckyNumber: number;
  advice: string;
}

const zodiacSigns = [
  { name: '양자리', emoji: '♈', date: '3/21-4/19' },
  { name: '황소자리', emoji: '♉', date: '4/20-5/20' },
  { name: '쌍둥이자리', emoji: '♊', date: '5/21-6/21' },
  { name: '게자리', emoji: '♋', date: '6/22-7/22' },
  { name: '사자자리', emoji: '♌', date: '7/23-8/22' },
  { name: '처녀자리', emoji: '♍', date: '8/23-9/22' },
  { name: '천칭자리', emoji: '♎', date: '9/23-10/22' },
  { name: '전갈자리', emoji: '♏', date: '10/23-11/22' },
  { name: '사수자리', emoji: '♐', date: '11/23-12/21' },
  { name: '염소자리', emoji: '♑', date: '12/22-1/19' },
  { name: '물병자리', emoji: '♒', date: '1/20-2/18' },
  { name: '물고기자리', emoji: '♓', date: '2/19-3/20' },
];

const colors = ['빨강', '파랑', '노랑', '초록', '보라', '분홍', '하양', '검정'];
const messages = [
  '오늘은 새로운 시작을 위한 완벽한 날입니다.',
  '인내심을 가지고 기다리면 좋은 결과가 있을 것입니다.',
  '주변 사람들에게 감사의 마음을 표현하세요.',
  '작은 행운이 연속으로 찾아올 수 있습니다.',
  '오늘은 휴식이 필요한 날입니다.',
  '새로운 도전을 시작하기 좋은 시기입니다.',
  '예상치 못한 기쁜 소식이 있을 수 있습니다.',
  '긍정적인 마인드가 행운을 부릅니다.',
];

export default function TodayFortunePage() {
  const [selectedZodiac, setSelectedZodiac] = useState<string>('');
  const [result, setResult] = useState<FortuneResult | null>(null);

  const generateFortune = (zodiacName: string) => {
    const today = new Date().toDateString();
    const seed = zodiacName + today;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }

    const getRandom = (max: number) => Math.abs(hash % max);

    const zodiac = zodiacSigns.find(z => z.name === zodiacName)!;
    
    return {
      zodiac: zodiacName,
      emoji: zodiac.emoji,
      overall: 60 + getRandom(40),
      love: 50 + getRandom(50),
      money: 50 + getRandom(50),
      health: 60 + getRandom(40),
      study: 50 + getRandom(50),
      message: messages[getRandom(messages.length)],
      luckyColor: colors[getRandom(colors.length)],
      luckyNumber: 1 + getRandom(45),
      advice: '오늘 하루도 긍정적인 마음으로 시작하세요!',
    };
  };

  const handleSelectZodiac = (zodiacName: string) => {
    setSelectedZodiac(zodiacName);
    const fortune = generateFortune(zodiacName);
    setResult(fortune);
    
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 py-8 px-4 transition-colors">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>돌아가기</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
          🌟 오늘의 운세
        </h1>
        <p className="text-lg text-gray-600 dark:text-blue-200 max-w-2xl mx-auto">
          별자리별 오늘의 운세를 확인해보세요<br />
          매일 새로운 운세가 업데이트됩니다
        </p>
      </div>

      {/* 별자리 선택 */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
          ✨ 별자리를 선택하세요
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {zodiacSigns.map((zodiac) => (
            <button
              key={zodiac.name}
              onClick={() => handleSelectZodiac(zodiac.name)}
              className={`bg-white dark:bg-white/10 backdrop-blur-lg hover:bg-purple-50 dark:hover:bg-white/20 rounded-xl p-6 transition-all hover:scale-105 border border-gray-200 dark:border-white/10 shadow-sm ${
                selectedZodiac === zodiac.name ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              <div className="text-5xl mb-2">{zodiac.emoji}</div>
              <div className="text-gray-900 dark:text-white font-bold">{zodiac.name}</div>
              <div className="text-gray-600 dark:text-blue-200 text-xs mt-1">{zodiac.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div id="result-section" className="max-w-[800px] mx-auto space-y-6">
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-white/10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">{result.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{result.zodiac}</h2>
              <p className="text-gray-600 dark:text-blue-200">
                {new Date().toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>

            {/* 종합 운세 */}
            <div className="bg-purple-50 dark:bg-white/20 rounded-xl p-6 mb-6 border border-purple-100 dark:border-white/10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 종합 운세</h3>
              <div className="space-y-4">
                {[
                  { label: '전체운', value: result.overall, color: 'from-purple-500 to-pink-500' },
                  { label: '애정운', value: result.love, color: 'from-red-500 to-pink-500' },
                  { label: '금전운', value: result.money, color: 'from-yellow-500 to-orange-500' },
                  { label: '건강운', value: result.health, color: 'from-green-500 to-teal-500' },
                  { label: '학업운', value: result.study, color: 'from-blue-500 to-purple-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-gray-900 dark:text-white mb-1">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/20 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 메시지 */}
            <div className="bg-blue-50 dark:bg-white/20 rounded-xl p-6 mb-6 border border-blue-100 dark:border-white/10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">💬 오늘의 메시지</h3>
              <p className="text-gray-700 dark:text-blue-100 leading-relaxed text-lg">{result.message}</p>
            </div>

            {/* 행운 아이템 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-50 dark:bg-white/20 rounded-xl p-6 border border-pink-100 dark:border-white/10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">🎨 행운의 색</h3>
                <p className="text-2xl font-bold text-pink-600 dark:text-yellow-300">{result.luckyColor}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-white/20 rounded-xl p-6 border border-yellow-100 dark:border-white/10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">🔢 행운의 숫자</h3>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{result.luckyNumber}</p>
              </div>
            </div>

            {/* 조언 */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/30 dark:to-pink-500/30 rounded-xl p-6 mt-6 border border-purple-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">💡 오늘의 조언</h3>
              <p className="text-gray-700 dark:text-white leading-relaxed">{result.advice}</p>
            </div>
          </div>
        </div>
      )}

      {/* 하단 고지 */}
      <div className="max-w-3xl mx-auto mt-16 text-center text-sm text-gray-500 dark:text-blue-200">
        <p className="text-xs">운세는 재미와 참고용이며, 과학적 근거가 없습니다.</p>
      </div>
    </div>
  );
}

