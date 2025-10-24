"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type RouletteSegment = {
  id: string;
  label: string;
  description: string;
  color: string;
  type: "reward" | "redirect";
  href?: string;
};

const segments: RouletteSegment[] = [
  {
    id: "reward",
    label: "구글 기프트카드 10,000원",
    description: "화면을 캡처하고 이벤트 신청 버튼을 눌러 주세요!",
    color: "#fbbf24",
    type: "reward"
  },
  {
    id: "mbti-test",
    label: "MBTI 테스트",
    description: "32문항으로 내 성격을 다시 확인!",
    color: "#38bdf8",
    type: "redirect",
    href: "/apps/mbti-test"
  },
  {
    id: "habit-tracker",
    label: "습관 트래커",
    description: "오늘은 어떤 습관을 채워볼까요?",
    color: "#34d399",
    type: "redirect",
    href: "/apps/habit-tracker"
  },
  {
    id: "today-fortune",
    label: "오늘의 운세",
    description: "오늘 하루의 기분을 점검해요.",
    color: "#a855f7",
    type: "redirect",
    href: "/apps/today-fortune"
  },
  {
    id: "water-intake",
    label: "물 섭취량 계산",
    description: "지금 물 한 잔 어떠세요?",
    color: "#0ea5e9",
    type: "redirect",
    href: "/apps/water-intake"
  },
  {
    id: "coffee-calculator",
    label: "카페인 계산기",
    description: "오늘 마신 커피, 괜찮을까요?",
    color: "#f97316",
    type: "redirect",
    href: "/apps/coffee-calculator"
  },
  {
    id: "color-psychology",
    label: "색채 심리",
    description: "색으로 보는 오늘의 기분!",
    color: "#f472b6",
    type: "redirect",
    href: "/apps/color-psychology"
  },
  {
    id: "quote-generator",
    label: "명언 생성기",
    description: "오늘의 영감을 받아가세요.",
    color: "#6366f1",
    type: "redirect",
    href: "/apps/quote-generator"
  },
  {
    id: "lotto-generator",
    label: "로또 번호",
    description: "행운이 한 번 더?",
    color: "#14b8a6",
    type: "redirect",
    href: "/apps/lotto-generator"
  },
  {
    id: "fridge-recipe",
    label: "냉장고 레시피",
    description: "집에 있는 재료로 요리해보세요!",
    color: "#f43f5e",
    type: "redirect",
    href: "/apps/fridge-recipe"
  }
];

const rewardIndex = segments.findIndex((segment) => segment.type === "reward");

export default function RoulettePage() {
  const router = useRouter();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [result, setResult] = useState<RouletteSegment | null>(null);
  const [isReward, setIsReward] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0 && result && result.type === "redirect" && result.href) {
      router.push(result.href);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => (prev === null ? null : prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, result, router]);

  const gradient = useMemo(() => {
    const segmentAngle = 360 / segments.length;
    return `conic-gradient(${segments
      .map((segment, index) => {
        const start = index * segmentAngle;
        const end = (index + 1) * segmentAngle;
        return `${segment.color} ${start}deg ${end}deg`;
      })
      .join(", ")})`;
  }, []);

  const handleSpin = () => {
    if (spinning || hasSpun) return;

    setResult(null);
    setCountdown(null);
    setHasSpun(true);
    setIsReward(false);

    const segmentAngle = 360 / segments.length;
    const rewardHit = Math.random() < 0.01; // 실제 확률 1%
    let targetIndex = rewardIndex;

    if (!rewardHit) {
      const redirectSegments = segments.filter((segment) => segment.type === "redirect");
      const chosen = redirectSegments[Math.floor(Math.random() * redirectSegments.length)];
      targetIndex = segments.findIndex((segment) => segment.id === chosen.id);
    }

    const extraSpins = Math.floor(Math.random() * 4) + 6; // 6 ~ 9 바퀴
    const targetAngle = 450 - (targetIndex * segmentAngle + segmentAngle / 2); // 90도(위쪽 포인터) 보정
    const finalRotation = rotation + extraSpins * 360 + targetAngle;

    setSpinning(true);
    setRotation(finalRotation);

    setTimeout(() => {
      const chosenSegment = segments[targetIndex];
      setResult(chosenSegment);
      setIsReward(chosenSegment.type === "reward");
      setSpinning(false);

      if (chosenSegment.type === "redirect") {
        setCountdown(5);
      }
    }, 5200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-12 sm:px-8 lg:px-12">
        <header className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Bionvive Roulette Lab</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">룰렛을 돌려 행운을 확인하세요</h1>
          <p className="mt-4 text-slate-300">
            안내에는 <span className="font-semibold text-amber-300">10% 확률</span>로 구글 기프트카드 10,000원이 적혀 있고,<br className="hidden sm:block" />
            나머지 칸은 다양한 Bionvive 웹앱으로 바로 이동합니다.
          </p>
        </header>

        <div className="grid flex-1 gap-8 lg:grid-cols-[2fr,1fr]">
          <section className="flex flex-col items-center justify-center rounded-3xl border border-slate-700/60 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
            <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
              <div
                className="absolute inset-0 rounded-full transition-transform duration-[5s] ease-out"
                style={{
                  background: gradient,
                  transform: `rotate(${rotation}deg)`
                }}
              />
              <div className="absolute inset-0 rounded-full border-[14px] border-slate-950/50 shadow-inner" />
              <div className="absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[12px] border-x-transparent border-b-[28px] border-b-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-slate-950/90 text-2xl shadow-lg">
                🎡
              </div>
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning || hasSpun}
              className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-8 py-4 text-lg font-bold text-slate-900 shadow-[0_20px_60px_-20px_rgba(34,211,238,0.6)] transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {spinning ? "돌리는 중..." : hasSpun ? "오늘의 결과 확인" : "룰렛 돌리기"}
            </button>

            <p className="mt-4 text-sm text-slate-400">룰렛은 한 번만 돌릴 수 있어요.</p>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
              <h2 className="text-lg font-semibold text-cyan-200">룰렛 이용 안내</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• 표시된 확률은 <span className="font-semibold text-amber-300">10%</span>입니다.</li>
                <li>• 당첨되면 화면을 캡처한 뒤, 안내 버튼을 눌러 이벤트 신청을 완료해 주세요.</li>
                <li>• 다른 칸에 당첨되면 해당 Bionvive 웹앱으로 자동 이동합니다.</li>
              </ul>
            </div>

            {result ? (
              <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
                {isReward ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎉</span>
                      <h3 className="text-xl font-bold text-amber-300">축하합니다!</h3>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      <strong>{result.label}</strong> 당첨입니다!<br />
                      지금 화면을 캡처한 뒤 아래 버튼을 눌러 이벤트 신청 페이지에서 이름, 이메일, 캡처 이미지를 업로드해 주세요.
                    </p>
                    <button
                      onClick={() => router.push("/apps/nonsense-escape/event")}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:scale-105"
                    >
                      이벤트 신청하러 가기
                    </button>
                    <p className="text-xs text-amber-200">
                      ※ 당첨 화면 캡처는 필수입니다. 확인 버튼을 누르기 전 꼭 저장해 주세요!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🚀</span>
                      <h3 className="text-xl font-bold text-cyan-200">오늘의 행선지</h3>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{result.label}</p>
                      <p className="mt-1 text-sm text-slate-300">{result.description}</p>
                    </div>
                    <p className="text-sm text-slate-400">
                      {countdown !== null ? `${countdown}초 후 자동으로 이동합니다.` : "잠시 후 이동합니다."}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => result.href && router.push(result.href)}
                        className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-4 py-3 font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:scale-105"
                      >
                        바로 이동하기
                      </button>
                      <button
                        onClick={() => router.push("/apps/nonsense-escape")}
                        className="rounded-xl border border-slate-600 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400"
                      >
                        홈으로
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 text-sm text-slate-300 shadow-xl backdrop-blur">
                <p className="font-semibold text-slate-200">룰렛 돌리기 전 체크!</p>
                <p className="mt-2">
                  버튼을 누르면 결과가 확정돼요. 한 번만 돌릴 수 있으니 마음의 준비를 하고 눌러주세요.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
