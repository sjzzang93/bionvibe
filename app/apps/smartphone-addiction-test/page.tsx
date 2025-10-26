'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import RelatedApps from '@/app/components/RelatedApps';

type Question = {
  id: string;
  text: string;
  domain: '통제력' | '일상균형' | '감정조절';
};

const QUESTIONS: Question[] = [
  { id: 'control_1', text: '스마트폰을 사용하지 못하면 손이 근질거리거나 불안해집니다.', domain: '감정조절' },
  { id: 'control_2', text: '사용 시간을 줄여보려고 해도 금방 다시 늘어납니다.', domain: '통제력' },
  { id: 'control_3', text: '자려고 누웠다가도 스마트폰을 확인하다가 시간이 훌쩍 지나갑니다.', domain: '통제력' },
  { id: 'balance_1', text: '스마트폰 때문에 해야 할 일을 미루거나 잊어버린 적이 잦습니다.', domain: '일상균형' },
  { id: 'balance_2', text: '식사나 대화 중에도 습관적으로 스마트폰을 잡고 있습니다.', domain: '일상균형' },
  { id: 'balance_3', text: '스마트폰 알림이 없더라도 손이 자주 화면으로 갑니다.', domain: '통제력' },
  { id: 'emotion_1', text: '기분이 안 좋을 때 스마트폰을 보면 금방 안정을 찾는 편입니다.', domain: '감정조절' },
  { id: 'emotion_2', text: '스마트폰을 보지 못하면 초조하거나 우울해집니다.', domain: '감정조절' },
  { id: 'balance_4', text: '스마트폰 사용 때문에 수면 시간이 줄어든 적이 있습니다.', domain: '일상균형' },
  { id: 'control_4', text: '스마트폰을 끄고도 계속 메시지가 온 것처럼 느껴집니다.', domain: '감정조절' },
  { id: 'balance_5', text: '주의해야 하는 상황에서도 스마트폰을 확인하려고 합니다.', domain: '일상균형' },
  { id: 'control_5', text: '하루 목표보다 더 오래 스마트폰을 사용한 날이 많습니다.', domain: '통제력' },
  { id: 'emotion_3', text: '스마트폰을 사용할 때 현실 문제에서 잠시 도망치는 느낌을 받습니다.', domain: '감정조절' },
];

const OPTIONS = [
  { score: 0, label: '전혀 그렇지 않다' },
  { score: 1, label: '그렇지 않은 편이다' },
  { score: 2, label: '보통이다' },
  { score: 3, label: '그런 편이다' },
  { score: 4, label: '매우 그렇다' },
];

const MAX_SCORE = QUESTIONS.length * 4;

function classifyScore(score: number) {
  if (score >= 36) {
    return {
      level: '고위험',
      description: '스마트폰 사용이 일상과 감정 조절에 크게 영향을 미치고 있습니다. 사용 습관 전반을 재점검하고 전문 상담, 디지털 디톡스 프로그램, 주변의 지지를 함께 활용해 주세요.',
      color: 'from-rose-500 via-red-500 to-orange-400',
      badge: 'bg-rose-600',
    };
  }
  if (score >= 24) {
    return {
      level: '주의 단계',
      description: '사용 시간이 늘어나거나 일상 균형이 깨지는 신호가 나타나기 시작했습니다. 규칙적인 사용 시간, 취침 전 디지털 선을 세우고, 주 1회 이상 스마트폰 없는 시간을 마련해 보세요.',
      color: 'from-amber-400 via-orange-400 to-rose-400',
      badge: 'bg-amber-500',
    };
  }
  return {
    level: '건강한 이용',
    description: '현재로서는 비교적 균형 잡힌 스마트폰 사용 패턴을 보이고 있습니다. 집중해야 할 시간과 휴식 시간을 구분하고, 가끔은 알림을 끄고 비대면 활동을 즐기며 이 상태를 유지하세요.',
    color: 'from-emerald-400 via-teal-400 to-sky-400',
    badge: 'bg-emerald-500',
  };
}

const DOMAIN_LABEL: Record<Question['domain'], string> = {
  통제력: '충동·통제력',
  일상균형: '일상 균형',
  감정조절: '감정 조절',
};

const DOMAIN_TIPS: Record<Question['domain'], string> = {
  통제력: '하루 중 스마트폰을 쓰는 시간대를 미리 정해두고, 특정 앱은 화면 제한을 설정해보세요.',
  일상균형: '퇴근 후 1시간, 식사 시간 등 스마트폰-free 구간을 정하고 메모해두면 균형을 되찾기 쉬워요.',
  감정조절: '불안하거나 심심할 때 바로 스마트폰을 찾기보다, 호흡 가다듬기나 짧은 스트레칭으로 전환점을 만들어보세요.',
};

export default function SmartphoneAddictionTestPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalScore = useMemo(
    () => Object.values(answers).reduce((sum, score) => sum + score, 0),
    [answers],
  );

  const domainScores = useMemo(() => {
    return QUESTIONS.reduce<Record<Question['domain'], { total: number; count: number }>>((acc, question) => {
      const score = answers[question.id] ?? 0;
      if (!acc[question.domain]) {
        acc[question.domain] = { total: 0, count: 0 };
      }
      acc[question.domain].total += score;
      acc[question.domain].count += 1;
      return acc;
    }, {} as Record<Question['domain'], { total: number; count: number }>);
  }, [answers]);

  const result = useMemo(() => classifyScore(totalScore), [totalScore]);

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  const handleSelect = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-black">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
            <span>Fortune & Mind</span>
            <span className="text-xs text-amber-400 dark:text-amber-200">Digital Wellness</span>
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight text-gray-900 dark:text-white sm:text-5xl">
            스마트폰 중독 자가진단 (13문항)
          </h1>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            국내 청소년·성인용 스마트폰 중독 척도(S-척도) 문항을 참고해 제작한 13개 문항입니다.
            최근 2주간의 스마트폰 사용 경험을 바탕으로 답해주세요. 결과는 자기 점검용일 뿐이며,
            의학적 진단을 대신하지 않습니다.
          </p>
        </header>

        <section className="space-y-6">
          {QUESTIONS.map((question, index) => {
            const selectedScore = answers[question.id];
            return (
              <article
                key={question.id}
                className="rounded-3xl border border-amber-200/60 bg-white/90 p-6 shadow-sm transition dark:border-amber-500/20 dark:bg-slate-950/70"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 dark:text-amber-300">
                      Q{index + 1}
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {question.text}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-amber-600/80 dark:text-amber-200/70">
                      {DOMAIN_LABEL[question.domain]}
                    </p>
                  </div>
                  {typeof selectedScore === 'number' && (
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-200">
                      선택: {OPTIONS[selectedScore].label}
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-5">
                  {OPTIONS.map((option) => {
                    const isSelected = selectedScore === option.score;
                    return (
                      <button
                        key={option.score}
                        type="button"
                        onClick={() => handleSelect(question.id, option.score)}
                        className={clsx(
                          'w-full rounded-2xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-gray-100',
                          isSelected
                            ? 'border-amber-400 bg-amber-500/90 text-white shadow-lg dark:border-amber-500 dark:bg-amber-500'
                            : 'border-amber-200/60 bg-amber-50/60 text-amber-700 hover:border-amber-400 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-slate-900 dark:text-amber-200 dark:hover:border-amber-400/70',
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            진행률: {Object.keys(answers).length}/{QUESTIONS.length} 문항 완료
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-amber-300 px-5 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-400/50 dark:text-amber-200 dark:hover:bg-amber-400/10"
            >
              다시 하기
            </button>
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleSubmit}
              className={clsx(
                'rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400',
              )}
            >
              결과 보기
            </button>
          </div>
        </div>

        {submitted && (
          <section className="space-y-8">
            <div className={clsx(
              'rounded-3xl border p-8 text-white shadow-xl transition',
              `border-transparent bg-gradient-to-br ${result.color}`,
            )}
            >
              <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-white/80', result.badge)}>
                결과 분석
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                {result.level}
              </h2>
              <p className="mt-4 text-sm leading-relaxed sm:text-base">{result.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold">
                <div className="rounded-2xl border border-white/40 bg-white/20 px-4 py-2">
                  총점 <span className="text-lg">{totalScore}</span> / {MAX_SCORE}
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/20 px-4 py-2">
                  위험 확률: {(Math.round((totalScore / MAX_SCORE) * 100))}%
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {(Object.keys(domainScores) as Array<Question['domain']>).map((domain) => {
                const { total, count } = domainScores[domain];
                const average = total / count || 0;

                return (
                  <div
                    key={domain}
                    className="rounded-3xl border border-amber-200/60 bg-white/90 p-5 shadow-sm dark:border-amber-500/20 dark:bg-slate-950/70"
                  >
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {DOMAIN_LABEL[domain]}
                    </h3>
                    <p className="mt-2 text-sm text-amber-600 dark:text-amber-200">
                      평균 점수: {average.toFixed(1)} / 4
                    </p>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      {DOMAIN_TIPS[domain]}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  📱 주간 리셋 챌린지
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li>• 하루 2회, 15분씩 알림을 끄고 오프라인 활동을 해보세요.</li>
                  <li>• 취침 1시간 전부터는 충전 중인 스마트폰을 손이 닿지 않는 곳에 두세요.</li>
                  <li>• SNS·게임 등 시간을 많이 쓰는 앱은 한 주 동안 사용 시간을 20%만 줄이는 목표를 세워보세요.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  🧠 집중력 회복 루틴
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li>• 아침 30분은 스마트폰 대신 물 한 잔과 간단한 스트레칭으로 시작합니다.</li>
                  <li>• 통근·통학 시에는 오디오북이나 음악 감상 등 목적 있는 사용으로 전환해보세요.</li>
                  <li>• 불안감이 올라오면 4-7-8 호흡법을 3회 반복해 감정 조절을 돕습니다.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200/60 bg-amber-50/80 p-6 text-sm text-amber-800 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
              <p>
                ※ 본 테스트는 자기 점검용 참고 자료입니다. 스마트폰 사용으로 일상 기능이 크게 저하되거나
                대인 관계, 직장·학업이 흔들린다면 정신건강의학과, 중독 전문 상담센터 등의 도움을 받아보세요.
              </p>
              <p className="mt-2">
                • 스마트쉼센터 ☎️ 1599-0075 • 정신건강상담전화 ☎️ 1577-0199
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                다음 단계 추천
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• 결과를 PDF나 스크린샷으로 저장해 한 달 후 다시 비교해 보세요.</li>
                <li>• 디지털 웰빙을 다루는 팟캐스트, 책, 온라인 커뮤니티를 찾아보며 사용 습관을 기록해보세요.</li>
                <li>
                  •{' '}
                  <Link href="/apps/today-fortune" className="font-semibold text-amber-600 hover:underline dark:text-amber-300">
                    오늘의 운세
                  </Link>
                  ,{' '}
                  <Link href="/apps/mbti-zodiac-compat" className="font-semibold text-amber-600 hover:underline dark:text-amber-300">
                    MBTI+띠 궁합
                  </Link>
                  {' '}등 마음 컨디션을 점검하는 다른 앱과 함께 활용해 보세요.
                </li>
              </ul>
            </div>
          </section>
        )}

        <section className="mt-16">
          <RelatedApps currentAppSlug="smartphone-addiction-test" />
        </section>
      </div>
    </div>
  );
}
