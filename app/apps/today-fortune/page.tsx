'use client';

import { useState, useEffect } from 'react';
import AppFooter from '@/app/components/AppFooter';
import RelatedApps from '@/app/components/RelatedApps';

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
  detailedAdvice: string[];
}

const zodiacSigns = [
  { name: '양자리', emoji: '♈', date: '3/21-4/19', color: 'from-red-500 to-orange-500' },
  { name: '황소자리', emoji: '♉', date: '4/20-5/20', color: 'from-green-600 to-emerald-500' },
  { name: '쌍둥이자리', emoji: '♊', date: '5/21-6/21', color: 'from-yellow-500 to-amber-400' },
  { name: '게자리', emoji: '♋', date: '6/22-7/22', color: 'from-blue-400 to-cyan-400' },
  { name: '사자자리', emoji: '♌', date: '7/23-8/22', color: 'from-orange-500 to-red-500' },
  { name: '처녀자리', emoji: '♍', date: '8/23-9/22', color: 'from-emerald-500 to-teal-500' },
  { name: '천칭자리', emoji: '♎', date: '9/23-10/22', color: 'from-pink-500 to-rose-500' },
  { name: '전갈자리', emoji: '♏', date: '10/23-11/22', color: 'from-purple-600 to-pink-600' },
  { name: '사수자리', emoji: '♐', date: '11/23-12/21', color: 'from-indigo-500 to-purple-500' },
  { name: '염소자리', emoji: '♑', date: '12/22-1/19', color: 'from-gray-700 to-slate-600' },
  { name: '물병자리', emoji: '♒', date: '1/20-2/18', color: 'from-cyan-500 to-blue-500' },
  { name: '물고기자리', emoji: '♓', date: '2/19-3/20', color: 'from-violet-500 to-purple-500' },
];

const colors = ['빨강', '파랑', '노랑', '초록', '보라', '분홍', '하양', '검정', '금색', '은색'];
const messages = [
  '오늘은 새로운 시작을 위한 완벽한 날입니다. 용기를 내어 첫 발을 내딛으세요.',
  '인내심을 가지고 기다리면 좋은 결과가 있을 것입니다. 서두르지 마세요.',
  '주변 사람들에게 감사의 마음을 표현하세요. 작은 배려가 큰 행복을 가져옵니다.',
  '작은 행운이 연속으로 찾아올 수 있습니다. 긍정적인 마음가짐을 유지하세요.',
  '오늘은 휴식이 필요한 날입니다. 자신을 돌아보는 시간을 가져보세요.',
  '새로운 도전을 시작하기 좋은 시기입니다. 망설이지 말고 도전하세요.',
  '예상치 못한 기쁜 소식이 있을 수 있습니다. 열린 마음으로 받아들이세요.',
  '긍정적인 마인드가 행운을 부릅니다. 웃으면 복이 와요.',
  '오늘은 중요한 결정을 내리기 좋은 날입니다. 직감을 믿으세요.',
  '주변 사람들과의 소통이 중요한 하루입니다. 대화를 나눠보세요.',
];

const adviceSet = [
  ['오전에는 중요한 일을 먼저 처리하세요', '점심 시간에는 가벼운 산책을 추천합니다', '저녁에는 취미 활동으로 하루를 마무리하세요'],
  ['아침 명상으로 하루를 시작하면 좋습니다', '오후에는 새로운 사람을 만날 기회가 있을 수 있습니다', '밤에는 일찍 휴식을 취하세요'],
  ['오늘은 재정 관리에 신경 쓰는 것이 좋습니다', '건강을 위해 물을 충분히 마시세요', '저녁에는 가족과 시간을 보내세요'],
  ['아침 운동으로 활력을 얻으세요', '점심에는 균형 잡힌 식사를 하세요', '오후에는 집중력이 높아질 것입니다'],
  ['오늘은 학습이나 자기계발에 좋은 날입니다', '새로운 기술이나 지식을 배워보세요', '저녁에는 독서를 추천합니다'],
];

export default function TodayFortunePage() {
  const [selectedZodiac, setSelectedZodiac] = useState<string>('');
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      detailedAdvice: adviceSet[getRandom(adviceSet.length)],
    };
  };

  const handleSelectZodiac = (zodiacName: string) => {
    setIsAnimating(true);
    setShowResult(false);
    setSelectedZodiac(zodiacName);
    
    setTimeout(() => {
      const fortune = generateFortune(zodiacName);
      setResult(fortune);
      setIsAnimating(false);
      setTimeout(() => setShowResult(true), 100);
    }, 600);
  };

  // 클라이언트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 페이지 로드 시 자동으로 랜덤 별자리 선택
  useEffect(() => {
    if (!mounted) return;
    
    const randomZodiac = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
    console.log('🌟 자동 선택된 별자리:', randomZodiac.name);
    
    // 약간의 지연 후 실행 (DOM이 완전히 로드된 후)
    setTimeout(() => {
      handleSelectZodiac(randomZodiac.name);
    }, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // 초기 로딩 중
  if (!mounted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🌟</div>
              <p className="text-white text-xl animate-pulse">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Floating stars */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8 md:mb-16 text-center">
          <div className="inline-block mb-4 md:mb-6">
            <div className="text-6xl md:text-8xl mb-3 md:mb-4 animate-float">🌟</div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            오늘의 운세
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light mb-3 md:mb-4">
            별자리별 오늘의 운세를 확인해보세요
          </p>
          <div className="text-white/60 text-xs sm:text-sm">
            {new Date().toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        </div>

        {/* 별자리 선택 - 결과가 있으면 숨김 */}
        {!result && (
          <div className="max-w-6xl mx-auto mb-8 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-6 md:mb-10">
              ✨ 당신의 별자리를 선택하세요
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {zodiacSigns.map((zodiac, index) => (
              <button
                type="button"
                key={zodiac.name}
                onClick={() => handleSelectZodiac(zodiac.name)}
                className={`group relative bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded sm:rounded-lg md:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 border border-white/20 overflow-hidden ${
                  selectedZodiac === zodiac.name ? 'ring-2 md:ring-4 ring-yellow-400 bg-white/20 scale-105' : ''
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${zodiac.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-1 sm:mb-1.5 md:mb-2 transition-transform duration-300 group-hover:scale-125">{zodiac.emoji}</div>
                  <div className="text-white font-bold text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">{zodiac.name}</div>
                  <div className="text-white/60 text-[9px] sm:text-xs">{zodiac.date}</div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-700"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Loading Animation */}
        {isAnimating && (
          <div className="max-w-2xl mx-auto text-center py-12 sm:py-16 md:py-20">
            <div className="inline-block">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
              <p className="text-white text-lg sm:text-xl font-light animate-pulse">운세를 분석하고 있습니다...</p>
            </div>
          </div>
        )}

        {/* 결과 */}
        {result && !isAnimating && (
          <div className={`max-w-4xl mx-auto space-y-4 sm:space-y-6 transition-all duration-700 ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12 border border-white/20 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-yellow-500/10 animate-gradient"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10">
                  <div className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 animate-bounce-slow">{result.emoji}</div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 md:mb-4">{result.zodiac}</h2>
                  <div className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-white/20 rounded-full text-white/80 text-xs sm:text-sm">
                    {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
                  </div>
                </div>

                {/* 종합 운세 */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-5 sm:mb-6 md:mb-8 border border-white/20">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">📊</span> 오늘의 운세 지수
                  </h3>
                  <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    {[
                      { label: '전체운', value: result.overall, icon: '⭐', color: 'from-purple-400 to-pink-400' },
                      { label: '애정운', value: result.love, icon: '❤️', color: 'from-red-400 to-pink-400' },
                      { label: '금전운', value: result.money, icon: '💰', color: 'from-yellow-400 to-orange-400' },
                      { label: '건강운', value: result.health, icon: '💪', color: 'from-green-400 to-emerald-400' },
                      { label: '학업운', value: result.study, icon: '📚', color: 'from-blue-400 to-cyan-400' },
                    ].map((item, index) => (
                      <div key={item.label} className="group"
                        style={{
                          animation: 'slideIn 0.6s ease-out forwards',
                          animationDelay: `${index * 100}ms`,
                          opacity: 0,
                        }}
                      >
                        <div className="flex justify-between items-center text-white mb-1.5 sm:mb-2">
                          <span className="font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                            <span className="text-lg sm:text-xl md:text-2xl">{item.icon}</span>
                            {item.label}
                          </span>
                          <span className="text-lg sm:text-xl md:text-2xl font-black">{item.value}%</span>
                        </div>
                        <div className="relative w-full bg-white/20 rounded-full h-3 sm:h-4 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out relative`}
                            style={{ 
                              width: `${item.value}%`,
                              animationDelay: `${index * 100}ms`,
                            }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 메시지 */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-5 sm:mb-6 md:mb-8 border border-white/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-6xl sm:text-7xl md:text-9xl text-white/5 leading-none">💬</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 relative z-10 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">💬</span> 오늘의 메시지
                  </h3>
                  <p className="text-white/90 leading-relaxed text-base sm:text-lg md:text-xl font-light relative z-10">{result.message}</p>
                </div>

                {/* 행운 아이템 */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-5 sm:mb-6 md:mb-8">
                  <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                      <span className="text-2xl sm:text-3xl">🎨</span> 
                      <span className="hidden sm:inline">행운의 </span>색상
                    </h3>
                    <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">{result.luckyColor}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                      <span className="text-2xl sm:text-3xl">🔢</span> 
                      <span className="hidden sm:inline">행운의 </span>숫자
                    </h3>
                    <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">{result.luckyNumber}</p>
                  </div>
                </div>

                {/* 상세 조언 */}
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/30">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl md:text-3xl">💡</span> 시간대별 조언
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {result.detailedAdvice.map((advice, index) => (
                      <div key={index} className="flex gap-3 sm:gap-4 items-start group hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-white shadow-lg text-sm sm:text-base">
                          {index + 1}
                        </div>
                        <p className="text-white/90 leading-relaxed pt-0.5 sm:pt-1 text-sm sm:text-base">{advice}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 하단 메시지 */}
                <div className="text-center mt-6 sm:mt-8 md:mt-10 text-white/60 text-xs sm:text-sm px-4">
                  <p>✨ 운세는 재미와 참고용이며, 긍정적인 마음가짐이 가장 중요합니다 ✨</p>
                </div>

                {/* 다른 별자리 보기 버튼 */}
                <div className="text-center mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setShowResult(false);
                      setSelectedZodiac('');
                    }}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full font-bold text-white text-sm sm:text-base shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-lg sm:text-xl">🔄</span>
                      다른 별자리 보기
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* 관련 앱 추천 */}
            <RelatedApps currentAppSlug="today-fortune" className="mt-8" />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes gradient {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: float 2s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
        .animate-gradient {
          animation: gradient 4s ease-in-out infinite;
        }
      `}</style>

      <AppFooter />
    </div>
  );
}