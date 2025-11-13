'use client';

import { useMemo, useState } from 'react';
import AppFooter from '@/app/components/AppFooter';
import RelatedApps from '@/app/components/RelatedApps';
import AdSlot from '@/app/components/AdSlot';
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';

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

const generateFortune = (zodiacName: string): FortuneResult => {
  const today = new Date().toDateString();
  const seed = zodiacName + today;
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const getRandom = (max: number) => Math.abs(hash % max);
  const zodiac = zodiacSigns.find((z) => z.name === zodiacName)!;

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

const initialZodiac = zodiacSigns[0];
const FORTUNE_INLINE_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_FORTUNE_INLINE;

export default function TodayFortunePage() {
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
    [],
  );

  const [selectedZodiac, setSelectedZodiac] = useState<string>(initialZodiac.name);
  const [result, setResult] = useState<FortuneResult>(() => generateFortune(initialZodiac.name));
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelectZodiac = (zodiacName: string) => {
    if (zodiacName === selectedZodiac) return;

    setIsAnimating(true);
    setSelectedZodiac(zodiacName);

    setTimeout(() => {
      setResult(generateFortune(zodiacName));
      setIsAnimating(false);
    }, 400);
  };

  const handleRandomPick = () => {
    const randomZodiac =
      zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)] ?? initialZodiac;
    handleSelectZodiac(randomZodiac.name);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AdOverlay />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <section className="max-w-4xl mx-auto text-center text-white space-y-4 sm:space-y-5">
          <span className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-1 text-xs sm:text-sm tracking-wide uppercase">
            Daily Astro Report
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            오늘의 별자리 운세
          </h1>
          <p className="text-white/80 leading-relaxed text-base sm:text-lg">
            12개 별자리 중 오늘의 기운을 선택하고, 애정·금전·건강 지수를 포함한 맞춤 조언을 받아보세요.
            BION의 운세 리포트는 하루를 준비할 출발점이 되어 줍니다.
          </p>
          <div className="text-sm sm:text-base text-white/60">{todayLabel} 기준</div>
        </section>

        <section className="max-w-4xl mx-auto mt-10 sm:mt-12">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">이용 방법</h2>
            <ul className="text-sm sm:text-base text-white/80 space-y-2 leading-relaxed list-disc list-inside">
              <li>아래에서 자신의 별자리나 궁금한 별자리를 선택하세요.</li>
              <li>오늘의 핵심 메시지, 시간대별 조언, 행운 색상과 숫자를 확인해 하루 계획을 세울 수 있어요.</li>
              <li>재미로 보는 무료 서비스지만, 매일 0시를 기준으로 새로운 분석이 제공됩니다.</li>
            </ul>
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 text-center">
            별자리 선택
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {zodiacSigns.map((zodiac) => (
              <button
                type="button"
                key={zodiac.name}
                onClick={() => handleSelectZodiac(zodiac.name)}
                className={`group relative rounded-2xl border border-white/20 bg-white/10 p-3 sm:p-4 text-left transition-all duration-300 hover:scale-105 hover:border-white/40 ${
                  selectedZodiac === zodiac.name ? 'ring-2 ring-yellow-300 bg-white/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{zodiac.emoji}</span>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-white">{zodiac.name}</p>
                    <p className="text-xs text-white/60">{zodiac.date}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="max-w-4xl mx-auto mt-10">
          <AdSlot slotId={FORTUNE_INLINE_AD_SLOT} label="오늘의 운세 스폰서" minHeight={320} />
        </div>

        <section className="max-w-4xl mx-auto mt-12 space-y-6">
          <article className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur shadow-lg">
            <header className="flex flex-col items-center text-center text-white gap-3">
              <span className="text-5xl sm:text-6xl">{result.emoji}</span>
              <h3 className="text-2xl sm:text-3xl font-bold">{result.zodiac}</h3>
              <p className="text-sm text-white/70">오늘의 메시지: {result.message}</p>
            </header>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <span role="img" aria-label="overall">
                    ⭐
                  </span>
                  운세 지수
                </h4>
                <dl className="space-y-3 text-xs sm:text-sm text-white/80">
                  {[
                    { label: '전체운', value: result.overall, icon: '🌈' },
                    { label: '애정운', value: result.love, icon: '💞' },
                    { label: '금전운', value: result.money, icon: '💰' },
                    { label: '건강운', value: result.health, icon: '💪' },
                    { label: '학업·성장', value: result.study, icon: '📚' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <dt className="w-20 flex items-center gap-1 text-white font-medium">
                        <span>{item.icon}</span>
                        {item.label}
                      </dt>
                      <dd className="flex-1">
                        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-200 to-pink-300 transition-all duration-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                        <span className="ml-1 text-white/60">{item.value}%</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-white/80">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <span role="img" aria-label="advice">
                    💡
                  </span>
                  시간대별 추천 행동
                </h4>
                <ul className="space-y-2 text-sm leading-relaxed">
                  {result.detailedAdvice.map((tip, index) => (
                    <li key={tip}>
                      <span className="text-white font-semibold mr-2">{index + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-white/60">
                  Tip: 오늘의 운세는 하루 동안의 분위기를 알려주는 지표이며, 중요한 결정은 여러 정보를
                  종합해 진행하는 것이 좋아요.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
                  <p className="text-xs text-white/60 mb-1">행운의 색상</p>
                  <p className="text-2xl font-bold">{result.luckyColor}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
                  <p className="text-xs text-white/60 mb-1">행운의 숫자</p>
                  <p className="text-2xl font-bold">{result.luckyNumber}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRandomPick}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:scale-[1.01] transition"
                >
                  🔄 랜덤 별자리 추천
                </button>
                {isAnimating && (
                  <span className="inline-flex items-center gap-2 text-xs text-white/70">
                    <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
                    새로운 운세 계산 중...
                  </span>
                )}
              </div>
            </div>
          </article>
        </section>

        <section className="max-w-4xl mx-auto mt-12 rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8 text-white/80 backdrop-blur">
          <h3 className="text-xl font-semibold text-white mb-4">자주 묻는 질문</h3>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <p className="font-semibold text-white">Q. 운세는 어떻게 생성되나요?</p>
              <p>
                A. 매일 자정 갱신되는 날짜 값을 바탕으로 별자리별 고유 알고리즘이 하루의 기운을 계산합니다.
                동일한 날짜에는 항상 같은 결과가 유지돼요.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Q. 실제 점성술과 동일한가요?</p>
              <p>
                A. 본 서비스는 재미와 동기 부여를 위한 참고 자료입니다. 중요한 의사 결정은 전문가의 도움과
                함께 진행해주세요.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Q. 다른 운세 도구도 있나요?</p>
              <p>
                A. BION에서는 사주·MBTI·타로 등 다양한 운세 도구를 제공하고 있습니다. 하단의 추천 링크를
                확인해 보세요.
              </p>
            </div>
          </div>
        </section>

        <RelatedApps currentAppSlug="today-fortune" className="max-w-6xl mx-auto mt-12" />

        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
