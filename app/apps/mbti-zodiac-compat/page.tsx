'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import AppFooter from '@/app/components/AppFooter';
import RelatedApps from '@/app/components/RelatedApps';
import AdSlot from '@/app/components/AdSlot';
import AdSense from '@/app/components/AdSense';
import {
  MBTI_OPTIONS,
  ZODIAC_OPTIONS,
  getCompatibility,
  getRecommendedZodiacs,
  type Element,
} from '@/lib/mbtiZodiacData';

const TOP_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MBTI_ZODIAC_TOP;
const INLINE_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MBTI_ZODIAC_INLINE;

const TIER_BADGE_STYLES = {
  S: 'border-white/70 bg-white/20 text-white shadow-[0_10px_32px_rgba(251,191,36,0.45)]',
  A: 'border-emerald-200/70 bg-emerald-100/20 text-emerald-50 shadow-[0_10px_32px_rgba(16,185,129,0.35)]',
  'B+': 'border-sky-200/70 bg-sky-100/15 text-sky-50 shadow-[0_10px_32px_rgba(59,130,246,0.28)]',
  B: 'border-slate-300/60 bg-slate-200/15 text-slate-100 shadow-[0_10px_32px_rgba(148,163,184,0.25)]',
  C: 'border-gray-400/60 bg-gray-300/15 text-gray-100 shadow-[0_10px_32px_rgba(148,163,184,0.2)]',
} as const;

const TIER_GAUGE_GRADIENT = {
  S: 'from-amber-300 via-rose-400 to-indigo-500',
  A: 'from-emerald-300 via-teal-400 to-sky-500',
  'B+': 'from-sky-400 via-indigo-400 to-purple-500',
  B: 'from-slate-400 via-slate-500 to-gray-500',
  C: 'from-zinc-400 via-zinc-500 to-slate-600',
} as const;

const ELEMENT_CHIP_GRADIENT: Record<Element, string> = {
  Wood: 'from-green-200/80 via-emerald-200/60 to-teal-200/70 dark:from-emerald-500/30 dark:via-teal-500/30 dark:to-green-500/30',
  Fire: 'from-amber-200/80 via-rose-200/70 to-pink-200/80 dark:from-amber-500/30 dark:via-rose-500/30 dark:to-pink-500/30',
  Earth: 'from-amber-100/80 via-amber-200/70 to-yellow-200/80 dark:from-amber-500/25 dark:via-yellow-500/25 dark:to-amber-500/25',
  Metal: 'from-slate-100/80 via-gray-100/60 to-slate-200/80 dark:from-slate-500/30 dark:via-gray-500/30 dark:to-slate-500/30',
  Water: 'from-sky-100/80 via-blue-100/70 to-indigo-100/80 dark:from-sky-500/25 dark:via-blue-500/25 dark:to-indigo-500/25',
};

export default function MbtiZodiacCompatibilityPage() {
  const defaultMyMbti = MBTI_OPTIONS[0]?.type ?? 'ENFP';
  const defaultPartnerMbti = MBTI_OPTIONS[1]?.type ?? defaultMyMbti;
  const defaultMyZodiac = ZODIAC_OPTIONS[0]?.id ?? 'rat';
  const defaultPartnerZodiac = ZODIAC_OPTIONS[1]?.id ?? defaultMyZodiac;

  const [myMbti, setMyMbti] = useState(defaultMyMbti);
  const [myZodiac, setMyZodiac] = useState(defaultMyZodiac);
  const [partnerMbti, setPartnerMbti] = useState(defaultPartnerMbti);
  const [partnerZodiac, setPartnerZodiac] = useState(defaultPartnerZodiac);
  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const myMbtiProfile = useMemo(
    () => MBTI_OPTIONS.find((item) => item.type === myMbti) ?? MBTI_OPTIONS[0],
    [myMbti],
  );
  const partnerMbtiProfile = useMemo(
    () => MBTI_OPTIONS.find((item) => item.type === partnerMbti) ?? MBTI_OPTIONS[0],
    [partnerMbti],
  );
  const myZodiacProfile = useMemo(
    () => ZODIAC_OPTIONS.find((item) => item.id === myZodiac) ?? ZODIAC_OPTIONS[0],
    [myZodiac],
  );
  const partnerZodiacProfile = useMemo(
    () => ZODIAC_OPTIONS.find((item) => item.id === partnerZodiac) ?? ZODIAC_OPTIONS[0],
    [partnerZodiac],
  );

  const compatibility = useMemo(
    () => getCompatibility(myMbti, myZodiac, partnerMbti, partnerZodiac),
    [myMbti, myZodiac, partnerMbti, partnerZodiac],
  );
  const myRecommendedZodiacs = useMemo(
    () => getRecommendedZodiacs(myMbti),
    [myMbti],
  );
  const partnerRecommendedZodiacs = useMemo(
    () => getRecommendedZodiacs(partnerMbti),
    [partnerMbti],
  );

  useEffect(() => {
    if (!showResults) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [showResults]);

  const handleShowResults = () => {
    if (showResults) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setShowResults(true);
  };

  const indexItems = [
    { label: '연애 케미', value: compatibility.indexes.love },
    { label: '협업 & 프로젝트', value: compatibility.indexes.teamwork },
    { label: '소통 리듬', value: compatibility.indexes.communication },
  ];

  const personSections = [
    {
      key: 'my' as const,
      label: '나',
      mbtiStep: {
        title: '1. 나의 MBTI를 선택하세요',
        description:
          '분석형 · 외교형 · 수호형 · 탐험형 카드를 눌러 나의 성향을 고르면 하단 궁합 리포트가 즉시 업데이트됩니다.',
        recommendationLabel: '내게 잘 맞는 추천 띠',
      },
      zodiacStep: {
        title: '2. 나의 띠(12지)를 선택하세요',
        description:
          '태어난 해의 띠를 선택하면 오행과 음양 흐름을 반영해 커플/팀 궁합 분석이 정교해집니다.',
      },
      selectedMbti: myMbti,
      setSelectedMbti: setMyMbti,
      selectedZodiac: myZodiac,
      setSelectedZodiac: setMyZodiac,
      mbtiProfile: myMbtiProfile,
      zodiacProfile: myZodiacProfile,
      recommendedZodiacs: myRecommendedZodiacs,
    },
    {
      key: 'partner' as const,
      label: '상대방',
      mbtiStep: {
        title: '3. 상대방 MBTI를 선택하세요',
        description:
          '함께 궁합을 보고 싶은 사람의 성향을 떠올리며 유형을 고르면 두 사람의 조합 점수가 새로 계산됩니다.',
        recommendationLabel: '상대에게 좋은 추천 띠',
      },
      zodiacStep: {
        title: '4. 상대방 띠(12지)를 선택하세요',
        description:
          '상대방의 띠를 선택하면 음양·오행 흐름을 비교해 케미 지수와 어울리는 루틴을 제안합니다.',
      },
      selectedMbti: partnerMbti,
      setSelectedMbti: setPartnerMbti,
      selectedZodiac: partnerZodiac,
      setSelectedZodiac: setPartnerZodiac,
      mbtiProfile: partnerMbtiProfile,
      zodiacProfile: partnerZodiacProfile,
      recommendedZodiacs: partnerRecommendedZodiacs,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mx-auto h-64 max-w-5xl bg-gradient-to-r from-amber-200/40 via-pink-200/30 to-indigo-200/40 blur-3xl dark:from-amber-500/10 dark:via-pink-500/10 dark:to-indigo-500/10" />
        </div>

        <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[36px] border border-white/40 bg-gradient-to-br from-[#1c1a3a] via-[#221c4e] to-[#0f1538] text-white shadow-2xl">
            <div className="absolute inset-0 opacity-70">
              <div className="absolute -left-10 top-0 h-64 w-64 rounded-full bg-amber-400/30 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-rose-400/40 blur-[120px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.35),transparent_65%)]" />
            </div>

            <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16">
              <span className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                BION Hybrid Insight
              </span>
              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
                MBTI+띠 궁합 리포트
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
                두 사람이 각각 MBTI와 띠(12지)를 선택하면 16가지 심리 유형과 오행 흐름을 교차 분석해
                하이브리드 궁합 리포트를 제공합니다. 데이터 기반으로 제작되어 Google AdSense 정책에
                적합한 안전한 콘텐츠를 지향합니다.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: '데이터 기반 해석',
                    body: 'MBTI 인지 기능·오행 궁합 공식으로 도출한 점수와 스토리텔링.',
                  },
                  {
                    title: '개인정보 비수집',
                    body: '선택한 유형만으로 결과 생성, 사용 흔적이나 로그인 정보가 필요하지 않아요.',
                  },
                  {
                    title: '엔터테인먼트 용도',
                    body: '현실 관계를 대체하지 않도록 참고용 주의 문구와 성장 팁을 함께 제공합니다.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.25)] backdrop-blur"
                  >
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs text-white/75 sm:text-sm">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-10">
            <AdSlot slotId={TOP_AD_SLOT} label="MBTI 궁합 스폰서" minHeight={280} />
          </div>

          {personSections.map((person, index) => {
            const {
              key,
              label,
              mbtiStep,
              zodiacStep,
              selectedMbti,
              setSelectedMbti,
              selectedZodiac,
              setSelectedZodiac,
              mbtiProfile,
              zodiacProfile,
              recommendedZodiacs,
            } = person;

            return (
              <div
                key={key}
                className={clsx(index === 0 ? 'mt-12' : 'mt-16', 'space-y-10')}
              >
                <section className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {mbtiStep.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                        {mbtiStep.description}
                      </p>
                    </div>
                    <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-semibold text-amber-600 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                      {label} · {mbtiProfile.groupLabel}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {MBTI_OPTIONS.map((option) => {
                      const isSelected = option.type === selectedMbti;
                      return (
                        <button
                          type="button"
                          key={`${key}-${option.type}`}
                          onClick={() => setSelectedMbti(option.type)}
                          className={clsx(
                            'group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5',
                            isSelected
                              ? [
                                  'border-transparent text-white shadow-[0_20px_45px_-18px_rgba(99,102,241,0.5)]',
                                  'bg-gradient-to-br',
                                  option.accent,
                                  'hover:-translate-y-1',
                                ]
                              : [
                                  'border-gray-200/70 bg-white/95 text-gray-900 shadow-sm',
                                  'dark:border-gray-700/70 dark:bg-gray-900/70 dark:text-gray-100',
                                  'hover:-translate-y-1 hover:shadow-lg',
                                ],
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                                {option.groupLabel}
                              </span>
                              <div className="mt-3 text-xl font-extrabold sm:text-2xl">{option.type}</div>
                              <p
                                className={clsx(
                                  'mt-1 text-sm',
                                  isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-300',
                                )}
                              >
                                {option.nickname}
                              </p>
                            </div>
                            <div
                              className={clsx(
                                'flex h-10 w-10 items-center justify-center rounded-2xl border text-base font-semibold backdrop-blur sm:h-11 sm:w-11 sm:text-lg',
                                isSelected
                                  ? 'border-white/50 bg-white/10 text-white'
                                  : 'border-gray-200 bg-white/60 text-gray-700 dark:border-gray-600 dark:bg-gray-800/70 dark:text-gray-200',
                              )}
                            >
                              {option.type.slice(0, 2)}
                            </div>
                          </div>
                          <p
                            className={clsx(
                              'mt-5 text-sm leading-relaxed',
                              isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-300',
                            )}
                          >
                            {option.summary}
                          </p>
                          <div
                            className={clsx(
                              'mt-5 flex flex-wrap items-center gap-2 text-[11px] font-medium sm:text-xs',
                              isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400',
                            )}
                          >
                            {option.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className={clsx(
                                  'rounded-full border px-2.5 py-0.5',
                                  isSelected
                                    ? 'border-white/40 bg-white/15 text-white/90'
                                    : 'border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
                                )}
                              >
                                #{keyword}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/75">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700 dark:text-gray-200 sm:text-sm">
                      <span className="font-semibold">{mbtiStep.recommendationLabel}</span>
                      {recommendedZodiacs.map((zodiac) => {
                        const isActive = zodiac.id === selectedZodiac;
                        return (
                          <button
                            type="button"
                            key={`${key}-recommend-${zodiac.id}`}
                            onClick={() => setSelectedZodiac(zodiac.id)}
                            className={clsx(
                              'inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs transition-all sm:px-3 sm:py-1 sm:text-sm',
                              ELEMENT_CHIP_GRADIENT[zodiac.element],
                              isActive
                                ? 'ring-2 ring-amber-400/80 dark:ring-amber-300/80'
                                : 'hover:ring-2 hover:ring-amber-300/60 dark:hover:ring-amber-200/60',
                            )}
                          >
                            <span className="text-lg">{zodiac.emoji}</span>
                            <span>{zodiac.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {zodiacStep.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                        {zodiacStep.description}
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-300">
                      {label} 선택: {zodiacProfile.name} · {zodiacProfile.elementLabel} ·{' '}
                      {zodiacProfile.yinYang}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {ZODIAC_OPTIONS.map((zodiac) => {
                      const isSelected = zodiac.id === selectedZodiac;
                      return (
                        <button
                          type="button"
                          key={`${key}-${zodiac.id}`}
                          onClick={() => setSelectedZodiac(zodiac.id)}
                          className={clsx(
                            'group relative overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 sm:p-4',
                            isSelected
                              ? [
                                  'border-transparent text-white shadow-[0_18px_45px_-18px_rgba(94,129,244,0.5)]',
                                  'bg-gradient-to-br',
                                  ELEMENT_CHIP_GRADIENT[zodiac.element],
                                  'hover:-translate-y-1',
                                ]
                              : [
                                  'border-gray-200 bg-white/95 text-gray-900 shadow-sm',
                                  'dark:border-gray-700 dark:bg-gray-900/75 dark:text-gray-100',
                                  'hover:-translate-y-1 hover:shadow-lg',
                                ],
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{zodiac.emoji}</span>
                            <div>
                              <div className="text-lg font-semibold">{zodiac.name}</div>
                              <p
                                className={clsx(
                                  'text-sm',
                                  isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-300',
                                )}
                              >
                                {zodiac.englishName}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/80 sm:text-sm">
                            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                              {zodiac.elementLabel}
                            </span>
                            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                              {zodiac.yinYang}
                            </span>
                            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                              {zodiac.years}
                            </span>
                          </div>
                          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                            {zodiac.tagline} · {zodiac.relationshipStyle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            );
          })}

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={handleShowResults}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-500/90 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 dark:border-indigo-400/60 dark:bg-indigo-400/80 dark:hover:bg-indigo-400"
            >
              결과 보기
              <span aria-hidden className="text-base">→</span>
            </button>
          </div>

          {showResults && (
            <section ref={resultsRef} className="mt-16 space-y-8">
              <div className="relative overflow-hidden rounded-[36px] border border-gray-200/70 bg-gradient-to-br from-[#040712] via-[#121532] to-[#1e123a] text-white shadow-[0_55px_120px_-50px_rgba(79,70,229,0.55)] dark:border-gray-700/50">
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute -left-10 top-16 h-64 w-64 rounded-full bg-rose-500/35 blur-[120px]" />
                  <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-sky-500/35 blur-[110px]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_60%)]" />
                </div>

                <div className="relative z-10 p-6 sm:p-8 lg:p-12">
                  <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
                    <div className="flex flex-col gap-6">
                      <div className="space-y-4 rounded-3xl border border-white/15 bg-black/30 p-6 backdrop-blur">
                        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                          <span
                            className={clsx(
                              'inline-flex items-center gap-2 rounded-full border px-3 py-1 tracking-[0.25em]',
                              TIER_BADGE_STYLES[compatibility.tier],
                            )}
                          >
                            {compatibility.tier} Tier
                          </span>
                          <span className="tracking-[0.25em]">
                            {compatibility.my.mbti.type} · {compatibility.my.zodiac.name}
                          </span>
                          <span>↔</span>
                          <span className="tracking-[0.25em]">
                            {compatibility.partner.mbti.type} · {compatibility.partner.zodiac.name}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="text-5xl font-black tracking-tight">{compatibility.score}</span>
                          <span className="text-lg font-semibold text-white/60">/ 100</span>
                          <span className="text-sm text-white/60">{compatibility.headline}</span>
                        </div>

                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className={clsx(
                              'h-full rounded-full bg-gradient-to-r transition-all duration-700',
                              TIER_GAUGE_GRADIENT[compatibility.tier],
                            )}
                            style={{ width: `${compatibility.score}%` }}
                          />
                        </div>

                        <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                          {compatibility.intro}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <article className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-inner backdrop-blur">
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                            <span className="text-xl">✨</span>
                            시너지 포인트
                          </h3>
                          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/80 sm:text-base">
                            {compatibility.synergyHighlights.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span className="mt-1 text-white/60">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </article>

                        <article className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-inner backdrop-blur">
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                            <span className="text-xl">🌱</span>
                            성장 팁
                          </h3>
                          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/80 sm:text-base">
                            {compatibility.growthTips.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span className="mt-1 text-white/60">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </article>
                      </div>

                      <div className="hidden lg:block">
                        <AdSlot slotId={INLINE_AD_SLOT} label="궁합 리포트 추천 광고" minHeight={280} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <article className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                          <span className="text-xl">📊</span>
                          케미 지수
                        </h3>
                        <div className="mt-4 space-y-4">
                          {indexItems.map((item) => (
                            <div key={item.label} className="space-y-2">
                              <div className="flex items-center justify-between text-sm text-white/70">
                                <span>{item.label}</span>
                                <span className="font-semibold text-white">{item.value}</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-white/10">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-400"
                                  style={{ width: `${item.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>

                      <article className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                          <span className="text-xl">🧭</span>
                          데일리 가이드
                        </h3>
                        <div className="mt-4 space-y-4 text-sm text-white/80 sm:text-base">
                          <div>
                            <span className="font-semibold text-white">포커스</span>
                            <p className="mt-1 leading-relaxed">{compatibility.dailyAdvice.focus}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-white">주의</span>
                            <p className="mt-1 leading-relaxed">{compatibility.dailyAdvice.caution}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-white">리셋</span>
                            <p className="mt-1 leading-relaxed">{compatibility.dailyAdvice.reset}</p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/60">색상</p>
                            <p className="mt-1 font-semibold text-white">
                              {compatibility.luckyGuide.color}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/60">요일</p>
                            <p className="mt-1 font-semibold text-white">
                              {compatibility.luckyGuide.day}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/60">루틴</p>
                            <p className="mt-1 font-semibold text-white">
                              {compatibility.luckyGuide.ritual}
                            </p>
                          </div>
                        </div>
                      </article>

                      <article className="rounded-3xl border border-white/15 bg-black/35 p-6 text-xs leading-relaxed text-white/70 backdrop-blur sm:text-sm">
                        {compatibility.referenceNotes.map((note) => (
                          <p key={note}>{note}</p>
                        ))}
                      </article>

                      <div className="block lg:hidden">
                        <AdSlot slotId={INLINE_AD_SLOT} label="궁합 리포트 추천 광고" minHeight={280} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="mt-16">
            <RelatedApps currentAppSlug="mbti-zodiac-compat" />
          </section>
        </main>
        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>



        <AppFooter />
      </div>
    </div>
  );
}
