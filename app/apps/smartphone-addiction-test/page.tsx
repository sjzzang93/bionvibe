'use client';

import { useMemo, useState, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';

type Question = {
  id: string;
  text: string;
  domain: '통제력상실' | '일상생활장애' | '금단증상' | '내성형성';
  weight: number; // 문항 가중치 (임상적 중요도)
};

const QUESTIONS: Question[] = [
  { id: 'withdrawal_1', text: '스마트폰을 사용하지 못하면 손이 근질거리거나 불안해집니다.', domain: '금단증상', weight: 1.2 },
  { id: 'control_1', text: '사용 시간을 줄여보려고 해도 금방 다시 늘어납니다.', domain: '통제력상실', weight: 1.3 },
  { id: 'control_2', text: '자려고 누웠다가도 스마트폰을 확인하다가 시간이 훌쩍 지나갑니다.', domain: '통제력상실', weight: 1.1 },
  { id: 'daily_1', text: '스마트폰 때문에 해야 할 일을 미루거나 잊어버린 적이 잦습니다.', domain: '일상생활장애', weight: 1.3 },
  { id: 'daily_2', text: '식사나 대화 중에도 습관적으로 스마트폰을 잡고 있습니다.', domain: '일상생활장애', weight: 1.2 },
  { id: 'tolerance_1', text: '스마트폰 알림이 없더라도 손이 자주 화면으로 갑니다.', domain: '내성형성', weight: 1.1 },
  { id: 'withdrawal_2', text: '기분이 안 좋을 때 스마트폰을 보지 않으면 견디기 힘듭니다.', domain: '금단증상', weight: 1.3 },
  { id: 'withdrawal_3', text: '스마트폰을 보지 못하면 초조하거나 우울해집니다.', domain: '금단증상', weight: 1.4 },
  { id: 'daily_3', text: '스마트폰 사용 때문에 수면 시간이 줄어든 적이 있습니다.', domain: '일상생활장애', weight: 1.2 },
  { id: 'withdrawal_4', text: '스마트폰을 끄고도 계속 메시지가 온 것처럼 느껴집니다(환상진동).', domain: '금단증상', weight: 1.3 },
  { id: 'daily_4', text: '운전이나 보행 등 위험한 상황에서도 스마트폰을 확인합니다.', domain: '일상생활장애', weight: 1.5 },
  { id: 'control_3', text: '하루 목표보다 더 오래 스마트폰을 사용한 날이 많습니다.', domain: '통제력상실', weight: 1.1 },
  { id: 'tolerance_2', text: '예전보다 더 오래 사용해야 만족감을 느낍니다.', domain: '내성형성', weight: 1.2 },
  { id: 'daily_5', text: '중요한 약속이나 업무를 스마트폰 때문에 지장받은 적이 있습니다.', domain: '일상생활장애', weight: 1.4 },
  { id: 'control_4', text: '스마트폰 사용을 중단해야겠다고 생각하면서도 실패를 반복합니다.', domain: '통제력상실', weight: 1.4 },
];

const MAX_SCORE = QUESTIONS.length * 4;
const WEIGHTED_MAX = QUESTIONS.reduce((sum, q) => sum + 4 * q.weight, 0);

function classifyScore(weightedScore: number, rawScore: number) {
  const percentage = (weightedScore / WEIGHTED_MAX) * 100;

  if (percentage >= 60 || rawScore >= 40) {
    return {
      level: '고위험군',
      severity: '심각',
      description: '스마트폰 과의존이 일상생활 전반에 심각한 영향을 미치고 있습니다. 통제력 상실, 금단증상, 일상기능 저하가 두드러지며 전문적 개입이 필요한 상태입니다.',
      recommendation: '정신건강의학과 전문의 상담 또는 중독관리통합지원센터의 전문 프로그램 참여를 강력히 권장합니다.',
      color: 'from-rose-600 via-red-600 to-orange-500',
      badge: 'bg-rose-700',
      urgency: 'high',
    };
  }
  if (percentage >= 45 || rawScore >= 30) {
    return {
      level: '잠재적 위험군',
      severity: '경고',
      description: '스마트폰 과의존 위험이 높은 상태로, 여러 영역에서 문제적 사용 패턴이 관찰됩니다. 지금 개입하지 않으면 고위험군으로 진행될 가능성이 있습니다.',
      recommendation: '스마트쉼센터 상담(1599-0075) 이용 및 체계적인 사용습관 관리 프로그램 시작이 필요합니다. 주변 지지체계의 도움을 받는 것이 중요합니다.',
      color: 'from-orange-500 via-amber-500 to-yellow-500',
      badge: 'bg-orange-600',
      urgency: 'medium',
    };
  }
  if (percentage >= 30 || rawScore >= 18) {
    return {
      level: '관심군',
      severity: '주의',
      description: '스마트폰 사용이 일부 영역에서 문제를 보이기 시작했습니다. 아직 심각한 단계는 아니지만, 방치할 경우 악화될 수 있어 주의가 필요합니다.',
      recommendation: '자가 관리 앱 활용, 사용시간 모니터링, 디지털 웰빙 실천을 통해 스스로 조절 능력을 키우세요. 월 1회 자가점검을 권장합니다.',
      color: 'from-blue-400 via-cyan-400 to-teal-400',
      badge: 'bg-blue-500',
      urgency: 'low',
    };
  }
  return {
    level: '일반 사용자군',
    severity: '양호',
    description: '현재 스마트폰 사용이 건강한 수준을 유지하고 있습니다. 균형잡힌 디지털 라이프를 영위하고 있으며, 현재 패턴을 지속하는 것이 좋습니다.',
    recommendation: '현재 상태를 유지하되, 주기적으로 자신의 사용 패턴을 점검하고, 새로운 앱이나 서비스 사용 시 과몰입하지 않도록 주의하세요.',
    color: 'from-emerald-500 via-green-500 to-teal-500',
    badge: 'bg-emerald-600',
    urgency: 'none',
  };
}

const DOMAIN_LABEL: Record<Question['domain'], string> = {
  통제력상실: '통제력 상실',
  일상생활장애: '일상생활 장애',
  금단증상: '금단 증상',
  내성형성: '내성 형성',
};

const DOMAIN_DESCRIPTION: Record<Question['domain'], string> = {
  통제력상실: '스마트폰 사용을 스스로 조절하거나 중단하지 못하는 정도',
  일상생활장애: '스마트폰으로 인해 학업, 업무, 대인관계 등이 방해받는 정도',
  금단증상: '스마트폰을 사용하지 못할 때 나타나는 불안, 초조 등의 증상',
  내성형성: '같은 만족을 얻기 위해 점점 더 많은 사용이 필요한 정도',
};

const DOMAIN_CLINICAL_GUIDE: Record<Question['domain'], { low: string; medium: string; high: string }> = {
  통제력상실: {
    low: '양호: 사용 시간을 잘 관리하고 있습니다.',
    medium: '주의: 사용 시간 제한 기능과 일일 목표 설정을 활용하세요.',
    high: '위험: 전문가 도움을 받아 행동 수정 전략을 수립해야 합니다.',
  },
  일상생활장애: {
    low: '양호: 스마트폰이 일상에 미치는 영향이 적습니다.',
    medium: '주의: 핵심 활동(식사, 대화, 업무) 중 사용 금지 구간을 설정하세요.',
    high: '위험: 일상기능 회복을 위한 체계적 개입이 필요합니다.',
  },
  금단증상: {
    low: '양호: 스마트폰 없이도 정서적으로 안정적입니다.',
    medium: '주의: 불안 대처 전략(호흡법, 마인드풀니스)을 연습하세요.',
    high: '위험: 의존도가 높아 전문 상담이 필요할 수 있습니다.',
  },
  내성형성: {
    low: '양호: 적절한 수준에서 만족감을 느낍니다.',
    medium: '주의: 사용 시간이 점진적으로 증가하지 않도록 모니터링하세요.',
    high: '위험: 중독 패턴이 형성되고 있어 즉각적인 개입이 필요합니다.',
  },
};

export default function SmartphoneAddictionTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const autoAdvanceTimeout = useRef<NodeJS.Timeout | null>(null);

  const totalScore = useMemo(
    () => Object.values(answers).reduce((sum, score) => sum + score, 0),
    [answers],
  );

  const weightedScore = useMemo(() => {
    return QUESTIONS.reduce((sum, question) => {
      const score = answers[question.id] ?? 0;
      return sum + score * question.weight;
    }, 0);
  }, [answers]);

  const domainScores = useMemo(() => {
    return QUESTIONS.reduce<Record<Question['domain'], { total: number; weighted: number; count: number }>>((acc, question) => {
      const score = answers[question.id] ?? 0;
      if (!acc[question.domain]) {
        acc[question.domain] = { total: 0, weighted: 0, count: 0 };
      }
      acc[question.domain].total += score;
      acc[question.domain].weighted += score * question.weight;
      acc[question.domain].count += 1;
      return acc;
    }, {} as Record<Question['domain'], { total: number; weighted: number; count: number }>);
  }, [answers]);

  const result = useMemo(() => classifyScore(weightedScore, totalScore), [weightedScore, totalScore]);

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  const handleSliderChange = (value: number) => {
    const question = QUESTIONS[currentQuestion];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));

    // 기존 timeout 취소
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
    }

    // 자동으로 다음 문항으로 이동 (마지막 문항이 아닌 경우)
    if (currentQuestion < QUESTIONS.length - 1) {
      autoAdvanceTimeout.current = setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestion(0);
  };

  const question = QUESTIONS[currentQuestion];
  const currentAnswer = answers[question.id] ?? -1;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-black">
        <AdOverlay />
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Main result card */}
          <div className={clsx(
            'rounded-3xl border p-10 text-white shadow-2xl transition',
            `border-transparent bg-gradient-to-br ${result.color}`,
          )}>
            <div className="flex items-start justify-between">
              <div>
                <span className={clsx('inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em]', result.badge)}>
                  임상 진단 결과
                </span>
                <h2 className="mt-6 text-5xl font-black tracking-tight">
                  {result.level}
                </h2>
                <p className="mt-2 text-xl font-semibold opacity-90">
                  위험도: {result.severity}
                </p>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/20 px-6 py-4 backdrop-blur">
                <div className="text-xs font-medium opacity-80">가중 점수</div>
                <div className="mt-1 text-4xl font-black">{weightedScore.toFixed(1)}</div>
                <div className="mt-1 text-xs opacity-80">/ {WEIGHTED_MAX.toFixed(1)}</div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-90">종합 소견</h3>
                <p className="mt-2 text-lg leading-relaxed">{result.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-90">권장 사항</h3>
                <p className="mt-2 text-lg leading-relaxed">{result.recommendation}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/40 bg-white/20 px-4 py-3 backdrop-blur">
                <div className="text-xs font-medium opacity-80">원점수</div>
                <div className="mt-1 text-2xl font-bold">{totalScore} / {MAX_SCORE}</div>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/20 px-4 py-3 backdrop-blur">
                <div className="text-xs font-medium opacity-80">백분위</div>
                <div className="mt-1 text-2xl font-bold">{((weightedScore / WEIGHTED_MAX) * 100).toFixed(1)}%</div>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/20 px-4 py-3 backdrop-blur">
                <div className="text-xs font-medium opacity-80">응답 완료</div>
                <div className="mt-1 text-2xl font-bold">{QUESTIONS.length}문항</div>
              </div>
            </div>
          </div>

          {/* Domain analysis */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              영역별 상세 분석
            </h3>
            <div className="grid gap-5 lg:grid-cols-2">
              {(Object.keys(domainScores) as Array<Question['domain']>).map((domain) => {
                const { total, weighted, count } = domainScores[domain];
                const average = total / count || 0;
                const percentage = (average / 4) * 100;

                let severity: 'low' | 'medium' | 'high' = 'low';
                if (percentage >= 60) severity = 'high';
                else if (percentage >= 40) severity = 'medium';

                return (
                  <div
                    key={domain}
                    className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900/70"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {DOMAIN_LABEL[domain]}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {DOMAIN_DESCRIPTION[domain]}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                          {average.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">/ 4.0</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={clsx(
                            'h-full transition-all duration-500',
                            severity === 'high' && 'bg-rose-500',
                            severity === 'medium' && 'bg-amber-500',
                            severity === 'low' && 'bg-emerald-500',
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className={clsx(
                      'mt-4 rounded-2xl border p-4 text-sm',
                      severity === 'high' && 'border-rose-200 bg-rose-50/50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200',
                      severity === 'medium' && 'border-amber-200 bg-amber-50/50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200',
                      severity === 'low' && 'border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200',
                    )}>
                      <div className="font-semibold">임상 가이드</div>
                      <p className="mt-1">{DOMAIN_CLINICAL_GUIDE[domain][severity]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action plan based on severity */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              맞춤형 회복 플랜
            </h3>
            <div className="grid gap-5 lg:grid-cols-2">
              {result.urgency === 'high' && (
                <>
                  <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/30">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-rose-900 dark:text-rose-200">
                      🚨 즉시 조치 필요
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-rose-800 dark:text-rose-300">
                      <li>• 정신건강의학과 전문의 예약 (필수)</li>
                      <li>• 중독관리통합지원센터 프로그램 등록</li>
                      <li>• 가족/지인에게 상황 공유 및 지지 요청</li>
                      <li>• 스마트폰 사용시간 강제 제한 설정 (하루 3시간 이하)</li>
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                      📋 주간 실천 체크리스트
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• 전문 상담 최소 주 1회 참여</li>
                      <li>• 매일 사용 시간 기록 및 분석</li>
                      <li>• 대체 활동 목록 작성 및 실천</li>
                      <li>• 취침 2시간 전 완전 차단</li>
                    </ul>
                  </div>
                </>
              )}
              {result.urgency === 'medium' && (
                <>
                  <div className="rounded-3xl border border-orange-200 bg-orange-50/80 p-6 shadow-sm dark:border-orange-900/50 dark:bg-orange-950/30">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-orange-900 dark:text-orange-200">
                      ⚠️ 적극적 관리 필요
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-orange-800 dark:text-orange-300">
                      <li>• 스마트쉼센터 상담 이용 (1599-0075)</li>
                      <li>• 디지털 웰빙 앱으로 사용 패턴 추적</li>
                      <li>• 주말 디지털 디톡스 데이 지정</li>
                      <li>• 핵심 시간대(식사, 업무, 수면 전) 사용 금지</li>
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                      🎯 3주 집중 개선 프로그램
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• 1주차: 사용 시간 20% 감소 목표</li>
                      <li>• 2주차: 대체 활동 3가지 이상 실천</li>
                      <li>• 3주차: 새로운 루틴 정착 및 평가</li>
                      <li>• 매일 10분 마인드풀니스 명상</li>
                    </ul>
                  </div>
                </>
              )}
              {result.urgency === 'low' && (
                <>
                  <div className="rounded-3xl border border-blue-200 bg-blue-50/80 p-6 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/30">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-blue-900 dark:text-blue-200">
                      💡 예방적 관리
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-blue-800 dark:text-blue-300">
                      <li>• 월 1회 자가진단으로 모니터링</li>
                      <li>• 사용 시간 모니터링 앱 활용</li>
                      <li>• 주 1회 디지털 프리 시간 운영</li>
                      <li>• 새로운 앱 설치 시 사용 시간 제한 설정</li>
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                      🌱 건강한 디지털 습관 유지
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• 아침 첫 1시간, 잠들기 전 30분 스마트폰 금지</li>
                      <li>• 대면 대화 시 스마트폰 보이지 않는 곳에 보관</li>
                      <li>• 목적 없는 SNS 스크롤링 자제</li>
                      <li>• 오프라인 취미 활동 지속</li>
                    </ul>
                  </div>
                </>
              )}
              {result.urgency === 'none' && (
                <>
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-emerald-900 dark:text-emerald-200">
                      ✅ 현상 유지 전략
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
                      <li>• 현재 패턴 지속 유지</li>
                      <li>• 분기별 자가진단으로 변화 모니터링</li>
                      <li>• 스트레스 상황에서 과몰입 주의</li>
                      <li>• 균형잡힌 디지털-오프라인 생활 유지</li>
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                      🎖️ 디지털 웰빙 모범 사례
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• 주변인들에게 건강한 사용 습관 공유</li>
                      <li>• 의미있는 온라인 활동 지속</li>
                      <li>• 기술을 도구로 활용하되 의존하지 않기</li>
                      <li>• 오프라인 관계와 활동 우선순위 유지</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Warning and resources */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-amber-200/60 bg-amber-50/80 p-6 text-sm text-amber-900 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
              <h4 className="font-bold">⚕️ 임상 고지사항</h4>
              <p className="mt-2">
                본 검사는 한국형 스마트폰 중독 진단척도(S-척도)를 참고한 자가진단 도구로,
                전문 의학적 진단을 대체할 수 없습니다. 고위험군 또는 잠재적 위험군으로 분류된 경우,
                반드시 정신건강의학과 전문의 또는 중독 전문 상담기관의 평가를 받으시기 바랍니다.
              </p>
              <div className="mt-4 space-y-1 font-semibold">
                <p>📞 전문 상담 연락처</p>
                <p>• 스마트쉼센터: 1599-0075 (평일 09:00-18:00)</p>
                <p>• 정신건강상담전화: 1577-0199 (24시간)</p>
                <p>• 중독관리통합지원센터: 지역별 센터 문의</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReset}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              검사 다시하기
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl dark:from-amber-400 dark:via-orange-400 dark:to-rose-400"
            >
              결과 저장/인쇄
            </button>
          </div>

          <section className="mt-16">
            <RelatedApps currentAppSlug="smartphone-addiction-test" />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-black">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
            <span>Clinical Assessment</span>
            <span className="text-xs text-amber-400 dark:text-amber-200">Digital Wellness</span>
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight text-gray-900 dark:text-white sm:text-5xl">
            스마트폰 과의존 임상 척도
          </h1>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            한국형 스마트폰 중독 진단척도(S-척도) 기반 15문항 자가진단입니다.
            문항별 가중치를 적용한 임상적 평가로 더 정확한 결과를 제공합니다.
          </p>
        </header>

        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>진행률: {Object.keys(answers).length}/{QUESTIONS.length}</span>
            <span>{Math.round(progress)}% 완료</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current question card */}
        <section className="rounded-3xl border border-amber-200/60 bg-white/90 p-8 shadow-xl transition dark:border-amber-500/20 dark:bg-slate-950/70">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 dark:text-amber-300">
                  Question {currentQuestion + 1} / {QUESTIONS.length}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  {DOMAIN_LABEL[question.domain]}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-relaxed text-gray-900 dark:text-gray-100 sm:text-3xl">
                {question.text}
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {DOMAIN_DESCRIPTION[question.domain]}
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                <span>전혀 그렇지 않다</span>
                <span>매우 그렇다</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={currentAnswer === -1 ? 2 : currentAnswer}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 accent-white focus:outline-none focus:ring-2 focus:ring-amber-400 dark:accent-amber-500"
                  style={{
                    background: `linear-gradient(to right, rgb(52 211 153) 0%, rgb(251 191 36) 50%, rgb(244 63 94) 100%)`,
                  }}
                />
                <div className="pointer-events-none mt-3 flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                </div>
              </div>
              {currentAnswer !== -1 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-center dark:border-amber-500/30 dark:bg-amber-900/20">
                  <div className="text-sm text-gray-600 dark:text-gray-400">현재 선택</div>
                  <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-300">
                    {['전혀 그렇지 않다', '그렇지 않은 편이다', '보통이다', '그런 편이다', '매우 그렇다'][currentAnswer]}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Navigation buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={clsx(
              'rounded-xl border px-6 py-3 text-sm font-semibold transition',
              currentQuestion === 0
                ? 'cursor-not-allowed border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-600'
                : 'border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-400/50 dark:text-amber-200 dark:hover:bg-amber-400/10',
            )}
          >
            ← 이전 문항
          </button>

          <div className="flex gap-2">
            {currentQuestion === QUESTIONS.length - 1 && (
              <button
                type="button"
                disabled={!allAnswered}
                onClick={handleSubmit}
                className={clsx(
                  'rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-lg transition',
                  allAnswered
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:shadow-xl dark:from-amber-400 dark:via-orange-400 dark:to-rose-400'
                    : 'cursor-not-allowed bg-gray-400 opacity-50 dark:bg-gray-600',
                )}
              >
                결과 보기
              </button>
            )}
          </div>
        </div>

        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>
      </div>
    </div>
);
}
