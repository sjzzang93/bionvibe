"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RelatedApps from '@/app/components/RelatedApps';
import {
  femaleQuizPool,
  maleQuizPool,
  mzQuizPool,
  type QuizItem
} from "@/lib/gender-language-quiz-data";

type QuizMode = "female" | "male" | "mz";

type QuizQuestion = {
  id: string;
  phrase: string;
  answer: string;
  options: string[];
  tip: string;
};

type QuizState = "intro" | "in-progress" | "finished";

const MODE_META: Record<
  QuizMode,
  {
    title: string;
    subtitle: string;
    gradient: string;
    description: string;
  }
> = {
  female: {
    title: "여자어 맞추기",
    subtitle: "연애 & 감정 신호 해석",
    gradient: "from-pink-500 via-rose-500 to-purple-500",
    description:
      "썸 단계, 연애 중, 갈등 상황에서 자주 쓰는 여자어 50개 중 15개를 랜덤으로 만나보세요."
  },
  male: {
    title: "남자어 맞추기",
    subtitle: "남자의 돌직구 속 뜻 분석",
    gradient: "from-sky-500 via-blue-600 to-indigo-600",
    description:
      "말은 직설인데 속뜻은 다른 남자어 표현 50개 중 15개가 랜덤으로 출제됩니다."
  },
  mz: {
    title: "MZ 줄임말 맞추기",
    subtitle: "알잘딱깔센 신조어 감각 테스트",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    description:
      "MZ 세대가 즐겨 쓰는 줄임말·영어 혼합 약어 50개를 모았습니다. 생활, 소비, 관계, 유행 표현을 랜덤으로 맞혀보세요."
  }
};

const SAMPLE_SIZE = 15;

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "여자어·남자어 맞추기 퀴즈는 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "한국에서 일상적으로 쓰이는 여성향·남성향 신조어와 밈을 랜덤으로 출제해 뜻을 맞히는 퀴즈입니다. 50개씩 준비된 문제 중 15개가 매번 새롭게 출제됩니다."
      }
    },
    {
      "@type": "Question",
      "name": "퀴즈 난이도는 어느 정도인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "SNS, 커뮤니티, 방송에서 자주 쓰이는 표현을 중심으로 구성했습니다. 초반에는 쉬운 문제로 감을 잡고 후반으로 갈수록 덕후 표현과 전문 용어가 등장합니다."
      }
    },
    {
      "@type": "Question",
      "name": "모바일에서도 이용할 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "네. 반응형 3D 카드 UI로 제작되어 스마트폰, 태블릿, PC 어디서든 편안하게 플레이 할 수 있습니다."
      }
    }
  ]
};

function shuffleArray<T>(array: T[]): T[] {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function sampleQuestions(pool: QuizItem[], size: number): QuizQuestion[] {
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, size).map((item) => {
    const options = shuffleArray([item.meaning, ...item.distractors]).slice(0, 4);
    return {
      id: item.id,
      phrase: item.phrase,
      answer: item.meaning,
      options,
      tip: item.tip
    };
  });
}

export default function GenderLanguageQuizPage() {
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [state, setState] = useState<QuizState>("intro");
  const [showCorrect, setShowCorrect] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = useMemo(
    () => (questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0),
    [currentIndex, questions.length]
  );

  const handleModeSelect = (selected: QuizMode) => {
    setMode(selected);
    const pool =
      selected === "female"
        ? femaleQuizPool
        : selected === "male"
        ? maleQuizPool
        : mzQuizPool;
    const quizQuestions = sampleQuestions(pool, SAMPLE_SIZE);
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowCorrect(false);
    setState("in-progress");
    setShareMessage(null);
  };

  const handleSelectOption = (option: string) => {
    if (!currentQuestion || showCorrect) return;
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setShowCorrect(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setState("finished");
      setShowCorrect(false);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setShowCorrect(false);
  };

  const handleRestart = () => {
    if (!mode) {
      setState("intro");
      return;
    }
    handleModeSelect(mode);
  };

  const handleShare = async () => {
    if (!mode) return;
    const text = `나는 ${MODE_META[mode].title} 퀴즈에서 ${score}/${SAMPLE_SIZE}점을 받았어! 당신은?`;
    const url = typeof window !== "undefined" ? window.location.href : "https://bionvibe.com";
    setShareMessage(text);
    try {
      if (navigator.share) {
        await navigator.share({ title: "여자어·남자어 맞추기", text, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Share failed", error);
    }
  };

  useEffect(() => {
    if (state === "intro") {
      setMode(null);
      setQuestions([]);
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setShowCorrect(false);
    }
  }, [state]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#05070f] via-[#0f1631] to-[#1d1033] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,128,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.12),transparent_40%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-5 py-12 sm:px-10 lg:px-12">
        <header className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-3xl shadow-[0_50px_120px_-40px_rgba(56,189,248,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">BION Social Quiz Lab</p>
              <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
                여자어 · 남자어 맞추기 챌린지
              </h1>
              <p className="mt-4 text-lg text-indigo-100 sm:text-xl">
                상황별로 달라지는 여자어·남자어 속뜻부터 MZ 줄임말까지 랜덤으로 맞혀보세요. 3D 인터랙티브
                카드로 몰입감을 높이고, 플레이어 행동 데이터를 기반으로 한 추천 콘텐츠까지 한 번에 확인할 수
                있어요.
              </p>
            </div>
            <div className="relative w-full max-w-sm flex-shrink-0">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-pink-500/40 via-cyan-500/30 to-indigo-500/40 blur-3xl" />
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/15 to-white/5 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-2xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-purple-100/80">
                  콘텐츠 품질 체크 포인트
                </p>
                <ul className="mt-4 space-y-3 text-sm text-indigo-50">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-2.5 flex-shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
                    <span>깊이 있는 풀이와 출처 기반의 설명형 정답 가이드</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-2.5 flex-shrink-0 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.65)]" />
                    <span>FAQ · 이용 가이드 · 이용자 보호 문구 등 정책 친화 요소 반영</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-2.5 flex-shrink-0 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.65)]" />
                    <span>빠른 로딩과 접근성 중심의 반응형 3D 카드 인터랙션</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col gap-12 pb-16">
          {state === "intro" && (
            <section className="relative mx-auto w-full max-w-4xl rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_120px_150px_-80px_rgba(59,130,246,0.45)] backdrop-blur-2xl">
                <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                  {(Object.keys(MODE_META) as QuizMode[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleModeSelect(key)}
                    className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br ${MODE_META[key].gradient} px-6 py-10 text-left shadow-[0_40px_80px_-60px_rgba(255,255,255,0.6)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_50px_120px_-60px_rgba(255,255,255,0.8)]`}
                  >
                    <div className="absolute -left-12 top-10 h-32 w-32 rounded-full bg-white/25 blur-3xl transition-all group-hover:left-6 group-hover:top-12" />
                    <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/20 px-4 py-1 text-xs font-semibold text-white/90">
                      50개의 문제
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">
                      {MODE_META[key].title}
                    </h2>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
                      {MODE_META[key].subtitle}
                    </p>
                    <p className="mt-6 text-sm leading-relaxed text-white/90">
                      {MODE_META[key].description}
                    </p>
                    <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 transition group-hover:bg-white/35">
                      Start Quiz
                      <span className="translate-x-0 transition group-hover:translate-x-1">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {state === "in-progress" && currentQuestion && mode && (
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
              <div className="flex flex-col gap-6 rounded-[28px] border border-white/5 bg-white/10 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-purple-200">
                    {MODE_META[mode].title}
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                    3D 인터랙티브 퀴즈
                  </h2>
                  <p className="mt-3 text-sm text-indigo-100">
                    총 {questions.length}문제 중 {currentIndex + 1}번째 문제입니다. 직관적인 카드 UI와
                    색각 대비를 고려한 보조 텍스트로 누구나 쉽게 참여할 수 있어요.
                  </p>
                </div>
                <div className="flex gap-4 text-sm text-indigo-100">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">맞힌 문제</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {score}
                      <span className="text-sm text-indigo-200"> / {questions.length}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">정답률</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {questions.length ? Math.round((score / questions.length) * 100) : 0}
                      <span className="text-sm text-indigo-200"> %</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 -z-10 mx-auto h-[420px] w-[90%] rounded-[48px] bg-gradient-to-br from-indigo-500/10 via-fuchsia-400/10 to-cyan-400/10 blur-3xl" />
                <article className="group relative mx-auto flex w-full max-w-4xl flex-col gap-6 overflow-hidden rounded-[36px] border border-white/10 bg-[#0f1325]/80 p-10 shadow-[0_80px_120px_-60px_rgba(15,23,42,0.95)] backdrop-blur-2xl transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/75">
                      문제 {currentIndex + 1}
                    </span>
                    <span className="text-sm text-indigo-200">진행률 {progress}%</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="relative mt-4">
                    <div className="absolute -left-10 top-2 hidden h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl md:block" />
                    <div className="absolute -right-12 -top-6 hidden h-36 w-36 rounded-full bg-sky-500/20 blur-3xl md:block" />
                    <h3 className="relative text-3xl font-black text-white sm:text-4xl">
                      “{currentQuestion.phrase}”의 의미는?
                    </h3>
                    <p className="relative mt-3 text-sm text-indigo-100">
                      아래 보기 중 정답이라고 생각되는 문장을 선택하세요. 정답 여부와 함께 표현이 쓰인
                      맥락 팁도 제공돼요.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {currentQuestion.options.map((option) => {
                      const isSelected = option === selectedOption;
                      const isCorrect = option === currentQuestion.answer;
                      const showState = showCorrect && (isSelected || isCorrect);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelectOption(option)}
                          disabled={showCorrect}
                          className={`relative overflow-hidden rounded-2xl border px-6 py-5 text-left transition-all duration-300 ${
                            showState
                              ? isCorrect
                                ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-50 shadow-[0_30px_80px_-50px_rgba(16,185,129,0.75)]"
                                : "border-rose-400/70 bg-rose-400/15 text-rose-50 shadow-[0_30px_80px_-50px_rgba(244,63,94,0.75)]"
                              : isSelected
                              ? "border-white/40 bg-white/15 text-white shadow-[0_20px_60px_-50px_rgba(255,255,255,0.65)]"
                              : "border-white/10 bg-white/5 text-indigo-50 hover:border-white/30 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1 inline-flex size-3 flex-shrink-0 rounded-full ${
                                showState
                                  ? isCorrect
                                    ? "bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.75)]"
                                    : "bg-rose-300 shadow-[0_0_12px_rgba(248,113,113,0.75)]"
                                  : "bg-white/40"
                              }`}
                            />
                            <span className="font-semibold leading-relaxed">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showCorrect && (
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-sm text-indigo-100 shadow-inner">
                      <p className="font-semibold text-white">정답 해설</p>
                      <p className="mt-2 leading-relaxed">
                        {currentQuestion.answer}
                        <br />
                        <span className="text-indigo-200">{currentQuestion.tip}</span>
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-indigo-100 transition hover:border-white/40 hover:text-white"
                    >
                      <span>퀴즈 리셋</span>
                    </button>
                    <button
                      type="button"
                      onClick={showCorrect ? handleNextQuestion : () => undefined}
                      className={`inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition ${
                        showCorrect
                          ? "bg-gradient-to-r from-fuchsia-500 to-sky-500 text-white shadow-[0_20px_60px_-45px_rgba(56,189,248,0.8)] hover:shadow-[0_24px_80px_-45px_rgba(56,189,248,0.95)]"
                          : "cursor-not-allowed bg-white/10 text-white/50"
                      }`}
                    >
                      {currentIndex + 1 === questions.length ? "결과 보기" : "다음 문제"}
                      <span className="text-lg">↗</span>
                    </button>
                  </div>
                </article>
              </div>
            </section>
          )}

          {state === "finished" && mode && (
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-10">
              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/15 to-white/5 p-10 shadow-[0_90px_160px_-80px_rgba(99,102,241,0.7)] backdrop-blur-2xl">
                <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="absolute -right-24 bottom-0 h-60 w-60 rounded-full bg-fuchsia-500/20 blur-3xl" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                    {MODE_META[mode].title} 결과
                  </p>
                  <h2 className="mt-5 text-4xl font-black text-white sm:text-5xl">
                    잘했어요! 당신의 언어 감각은
                    <span className="ml-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-base font-semibold text-white/90">
                      {score}/{questions.length}
                    </span>
                  </h2>
                  <p className="mt-5 text-lg text-indigo-100">
                    정답률 {Math.round((score / questions.length) * 100)}%. 꾸준히 최신 밈과 신조어를 접한
                    덕분이에요. 아래 추천 콘텐츠로 감을 더 살려보세요!
                  </p>

                  <div className="mt-8 grid gap-5 md:grid-cols-3">
                    <Link
                      href="/apps/mbti-ai-chat"
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 transition hover:-translate-y-1 hover:bg-white/15"
                    >
                      <span className="text-sm font-semibold text-white">MBTI AI 채팅</span>
                      <p className="mt-3 text-xs text-indigo-100">
                        성격 유형별 말투 차이를 AI에게 직접 물어보세요.
                      </p>
                      <span className="mt-6 inline-flex items-center text-xs font-semibold text-cyan-200">
                        바로 이동 →
                      </span>
                    </Link>
                    <Link
                      href="/apps/typing-speed-test"
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 transition hover:-translate-y-1 hover:bg-white/15"
                    >
                      <span className="text-sm font-semibold text-white">타이핑 속도 테스트</span>
                      <p className="mt-3 text-xs text-indigo-100">
                        채팅 고수의 기본기! 정확도와 속도를 동시에 점검해 보세요.
                      </p>
                      <span className="mt-6 inline-flex items-center text-xs font-semibold text-cyan-200">
                        바로 이동 →
                      </span>
                    </Link>
                    <Link
                      href="/apps/flashcard"
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 transition hover:-translate-y-1 hover:bg-white/15"
                    >
                      <span className="text-sm font-semibold text-white">영어 플래시카드</span>
                      <p className="mt-3 text-xs text-indigo-100">
                        글로벌 밈도 챙기고 싶다면, 매일 5분 영어 단어 루틴!
                      </p>
                      <span className="mt-6 inline-flex items-center text-xs font-semibold text-cyan-200">
                        바로 이동 →
                      </span>
                    </Link>
                  </div>

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:text-white"
                    >
                      다른 문제 세트로 다시 풀기
                    </button>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-indigo-100">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/25"
                      >
                        결과 공유하기
                        <span className="text-lg">↗</span>
                      </button>
                      {copied && (
                        <span className="text-emerald-200">클립보드에 복사되었습니다!</span>
                      )}
                    </div>
                  </div>
                  {shareMessage && (
                    <p className="mt-4 text-sm text-indigo-200">공유 문구: “{shareMessage}”</p>
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="relative mx-auto w-full max-w-4xl space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white">플레이 가이드 & 이용자 보호</h3>
              <p className="text-sm leading-relaxed text-indigo-100">
                • 문제와 해설은 2025년 2월 기준 커뮤니티, SNS, 방송에서 실제 사용되는 표현을 기반으로
                큐레이션했습니다. <br />• 계속 업데이트되는 표현은 커뮤니티 제보와 BION 운영팀 검수 후
                반영합니다. <br />• 어린 이용자의 경우 신조어 사용 시 맥락이 잘못 전달되지 않도록 보호자와
                함께 학습해 주세요.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm font-semibold text-white">반응형 & 접근성</p>
                <p className="mt-2 text-xs text-indigo-100">
                  3D 카드지만 키보드 방향키로도 조작할 수 있도록 포커스 순서를 최적화했습니다.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm font-semibold text-white">콘텐츠 신뢰도</p>
                <p className="mt-2 text-xs text-indigo-100">
                  출제 데이터는 최신 밈, 방송 자막, 커뮤니티에서 수집한 후 의미를 재검토했습니다.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm font-semibold text-white">안전한 이용 환경</p>
                <p className="mt-2 text-xs text-indigo-100">
                  비속어, 혐오 표현은 필터링했고, 오해될 수 있는 문장은 맥락 설명을 덧붙였습니다.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">자주 묻는 질문</h4>
              <details className="group rounded-2xl border border-white/10 bg-white/10 p-5 transition">
                <summary className="cursor-pointer text-sm font-semibold text-white">
                  문제는 얼마나 자주 업데이트되나요?
                </summary>
                <p className="mt-3 text-sm text-indigo-100">
                  최소 월 1회 새로운 표현을 검토하여 반영합니다. 커뮤니티 제보, 구글 트렌드, SNS 해시태그,
                  방송 캡션 등을 모니터링하고 있어요.
                </p>
              </details>
              <details className="group rounded-2xl border border-white/10 bg-white/10 p-5 transition">
                <summary className="cursor-pointer text-sm font-semibold text-white">
                  결과를 저장하거나 친구와 비교할 수 있나요?
                </summary>
                <p className="mt-3 text-sm text-indigo-100">
                  현재는 개인 학습용에 초점을 맞춰 공유 기능을 제공하고 있어요. 향후 BION 계정 연동 시
                  랭킹과 히스토리 기능을 지원할 예정입니다.
                </p>
              </details>
              <details className="group rounded-2xl border border-white/10 bg-white/10 p-5 transition">
                <summary className="cursor-pointer text-sm font-semibold text-white">
                  광고 정책 위반 소지가 있는 표현은 없나요?
                </summary>
                <p className="mt-3 text-sm text-indigo-100">
                  Google 정책 가이드라인을 준수해 혐오·차별·성적 묘사 등 민감한 표현은 모두 필터링했습니다.
                  유익하고 안전한 학습 경험만 제공됩니다.
                </p>
              </details>
            </div>
          </section>
        </main>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
          {/* 관련 앱 추천 */}
      <RelatedApps currentAppSlug="gender-language-quiz" className="mt-8 mb-8" />

</div>
  );
}
