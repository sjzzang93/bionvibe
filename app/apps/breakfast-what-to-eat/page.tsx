'use client';

import React, { useMemo, useState } from 'react';
import PremiumCard from '@/app/components/ui/PremiumCard';

import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';
type MenuItem = {
  name: string;
  emoji: string;
  category: '한식' | '양식' | '간편식' | '카페';
  desc: string;
  time: string;     // 예: "준비 시간: 5분" / "조리 시간: 10분"
  kcal: number;     // 대략치
};

const MENU_DATA: MenuItem[] = [
  // 한식 (10개)
  { name: '김치찌개', emoji: '🥘', category: '한식', desc: '든든한 한 끼!', time: '조리 시간: 12분', kcal: 420 },
  { name: '된장찌개', emoji: '🍲', category: '한식', desc: '구수하게 속을 데워요', time: '조리 시간: 12분', kcal: 380 },
  { name: '계란말이', emoji: '🍳', category: '한식', desc: '단백질 보충 딱!', time: '조리 시간: 8분', kcal: 280 },
  { name: '김밥', emoji: '🍙', category: '한식', desc: '손에 들고 뚝딱', time: '준비 시간: 5분', kcal: 350 },
  { name: '주먹밥', emoji: '🍙', category: '한식', desc: '간단하지만 포만감 좋아요', time: '준비 시간: 4분', kcal: 320 },
  { name: '토스트(한식 스타일)', emoji: '🍞', category: '한식', desc: '달걀+케찹 국민조합', time: '조리 시간: 5분', kcal: 330 },
  { name: '삼각김밥', emoji: '🍙', category: '한식', desc: '출근길에 딱!', time: '구매: 1분', kcal: 220 },
  { name: '떡볶이', emoji: '🍢', category: '한식', desc: '매콤하게 기상!', time: '조리 시간: 10분', kcal: 480 },
  { name: '라면', emoji: '🍜', category: '한식', desc: '빠르고 든든', time: '조리 시간: 5분', kcal: 430 },
  { name: '컵라면', emoji: '🥡', category: '한식', desc: '물만 부으면 OK', time: '조리 시간: 3분', kcal: 350 },

  // 양식 (10개)
  { name: '시리얼', emoji: '🥣', category: '양식', desc: '아주 빠르고 가벼워요', time: '준비 시간: 1분', kcal: 220 },
  { name: '오트밀', emoji: '🌾', category: '양식', desc: '포만감 좋은 건강 한 그릇', time: '조리 시간: 3분', kcal: 260 },
  { name: '요거트', emoji: '🧉', category: '양식', desc: '상큼하게 시작', time: '준비 시간: 1분', kcal: 180 },
  { name: '스크램블 에그', emoji: '🍳', category: '양식', desc: '부드럽고 고소해요', time: '조리 시간: 5분', kcal: 250 },
  { name: '샌드위치', emoji: '🥪', category: '양식', desc: '잡고 먹기 편해요', time: '준비 시간: 5분', kcal: 360 },
  { name: '베이글', emoji: '🥯', category: '양식', desc: '크림치즈 한 스푼', time: '준비 시간: 3분', kcal: 310 },
  { name: '크루아상', emoji: '🥐', category: '양식', desc: '버터 향 가득', time: '준비 시간: 1분', kcal: 270 },
  { name: '팬케이크', emoji: '🥞', category: '양식', desc: '달콤한 아침', time: '조리 시간: 10분', kcal: 420 },
  { name: '와플', emoji: '🧇', category: '양식', desc: '겉바속촉의 행복', time: '조리 시간: 8분', kcal: 410 },
  { name: '그래놀라', emoji: '🥣', category: '양식', desc: '우유/요거트와 찰떡', time: '준비 시간: 1분', kcal: 280 },

  // 간편식 (10개)
  { name: '편의점 도시락', emoji: '🍱', category: '간편식', desc: '전자레인지로 뚝딱', time: '조리 시간: 3분', kcal: 600 },
  { name: '삼각김밥(간편)', emoji: '🍙', category: '간편식', desc: '한 손에 착', time: '구매: 1분', kcal: 220 },
  { name: '컵라면(간편)', emoji: '🥡', category: '간편식', desc: '따뜻하게 빠르게', time: '조리 시간: 3분', kcal: 350 },
  { name: '빵+우유', emoji: '🥖', category: '간편식', desc: '정말 바쁠 때', time: '준비 시간: 1분', kcal: 300 },
  { name: '에너지바', emoji: '🍫', category: '간편식', desc: '주머니 속 비상식', time: '준비 시간: 0분', kcal: 200 },
  { name: '프로틴 쉐이크', emoji: '🥤', category: '간편식', desc: '단백질 든든 보충', time: '준비 시간: 1분', kcal: 220 },
  { name: '바나나+우유', emoji: '🍌', category: '간편식', desc: '부드럽게 든든', time: '준비 시간: 1분', kcal: 240 },
  { name: '사과', emoji: '🍎', category: '간편식', desc: '상큼하게 리프레시', time: '준비 시간: 0분', kcal: 95 },
  { name: '초코파이', emoji: '🍪', category: '간편식', desc: '달달한 당충전', time: '준비 시간: 0분', kcal: 230 },
  { name: '약과', emoji: '🧁', category: '간편식', desc: '고소하고 달달', time: '준비 시간: 0분', kcal: 210 },

  // 카페 메뉴 (10개)
  { name: '아메리카노+크루아상', emoji: '☕️🥐', category: '카페', desc: '카페 감성 충전', time: '준비 시간: 2분', kcal: 300 },
  { name: '라떼+샌드위치', emoji: '☕️🥪', category: '카페', desc: '든든한 브런치 느낌', time: '준비 시간: 4분', kcal: 420 },
  { name: '스무디', emoji: '🫐', category: '카페', desc: '과일로 상큼하게', time: '준비 시간: 3분', kcal: 250 },
  { name: '에그 샌드위치', emoji: '🥪🍳', category: '카페', desc: '부드러운 식감', time: '준비 시간: 4분', kcal: 380 },
  { name: '베이글 샌드위치', emoji: '🥯🥬', category: '카페', desc: '씹는 맛이 좋아요', time: '준비 시간: 5분', kcal: 420 },
  { name: '아침 세트', emoji: '🍽️', category: '카페', desc: '커피+빵+계란 세트', time: '준비 시간: 5분', kcal: 500 },
  { name: '그릭 요거트', emoji: '🥛🍓', category: '카페', desc: '담백하고 고소해요', time: '준비 시간: 2분', kcal: 220 },
  { name: '아사이볼', emoji: '🫐🥣', category: '카페', desc: '슈퍼푸드로 상쾌하게', time: '준비 시간: 4분', kcal: 300 },
  { name: '과일 샐러드', emoji: '🥗', category: '카페', desc: '가볍고 신선해요', time: '준비 시간: 3분', kcal: 200 },
  { name: '모닝빵', emoji: '🥯', category: '카페', desc: '부드럽게 한입씩', time: '준비 시간: 1분', kcal: 260 },
];

function useRandomPicker(items: MenuItem[]) {
  const [lastName, setLastName] = useState<string | null>(null);

  const pick = () => {
    if (items.length === 0) return null;
    if (items.length === 1) return items[0];

    // 연속 동일 메뉴 방지
    let candidate: MenuItem | null = null;
    for (let i = 0; i < 10; i++) {
      const idx = Math.floor(Math.random() * items.length);
      const tryItem = items[idx];
      if (tryItem.name !== lastName) {
        candidate = tryItem;
        break;
      }
    }
    if (!candidate) candidate = items[Math.floor(Math.random() * items.length)];
    setLastName(candidate.name);
    return candidate;
  };

  return pick;
}

export default function BreakfastWhatToEatPage() {
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const pickRandom = useRandomPicker(MENU_DATA);

  const handleDraw = async () => {
    setLoading(true);
    // 0.5초 로딩 애니메이션
    await new Promise((r) => setTimeout(r, 500));
    const item = pickRandom();
    setSelected(item);
    setLoading(false);
  };

  const title = useMemo(() => '오늘 아침 뭐먹지? 🍳', []);
  const subtitle = useMemo(() => '고민하지 말고 바로 결정!', []);

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-zinc-900 dark:to-zinc-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <PremiumCard className="relative rounded-3xl shadow-2xl [transform:translateZ(0)] bg-white/80 dark:bg-zinc-950/70 backdrop-blur-md border border-white/40 dark:border-white/10">
          {/* 헤더 */}
          <div className="text-center pt-6 px-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
              {subtitle}
            </p>
          </div>

          {/* 콘텐츠 */}
          <div className="px-6 pb-6">
            {/* 첫 화면: 큰 버튼 */}
            {!selected && (
              <div className="mt-8 flex flex-col items-center">
                <button
        type="button"
                  onClick={handleDraw}
                  disabled={loading}
                  className={`w-full h-14 sm:h-16 rounded-2xl text-lg sm:text-xl font-semibold transition-all
                    bg-gradient-to-r from-amber-400 to-orange-400 text-zinc-900
                    hover:scale-[1.02] active:scale-[0.98] shadow-lg
                    disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner />
                      뽑는 중...
                    </span>
                  ) : (
                    '메뉴 뽑기'
                  )}
                </button>

                <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                  버튼을 누르면 랜덤으로 추천해드릴게요.
                </p>
              </div>
            )}

            {/* 결과 화면 */}
            {selected && (
              <div
                key={selected.name}
                className="mt-6 animate-fadeIn"
                style={{
                  animationDuration: '420ms',
                  animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-6xl sm:text-7xl drop-shadow-sm">
                    {selected.emoji}
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                    {selected.name}
                  </h2>
                  <div className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
                    {selected.desc}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                    <InfoPill label="시간" value={selected.time} />
                    <InfoPill label="칼로리" value={`약 ${selected.kcal}kcal`} />
                  </div>

                  <button
        type="button"
                    onClick={handleDraw}
                    disabled={loading}
                    className={`mt-6 w-full h-12 rounded-xl text-base font-semibold transition-all
                      bg-zinc-900 text-white dark:bg-white dark:text-zinc-900
                      hover:scale-[1.01] active:scale-[0.98] shadow-md
                      disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Spinner />
                        다시 뽑는 중...
                      </span>
                    ) : (
                      '다시 뽑기'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </PremiumCard>
      </div>

      {/* 페이드인 키프레임 (Tailwind 임베디드) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation-name: fadeIn;
        }
      `}</style>
    </div>
  );
}

/** 작은 정보 알약 컴포넌트 */
function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 px-4 py-3 text-left">
      <div className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="text-sm sm:text-base font-medium text-zinc-900 dark:text-white">
        {value}
      </div>
          {/* 관련 앱 추천 */}
      <RelatedApps currentAppSlug="breakfast-what-to-eat" className="mt-8 mb-8" />

</div>
  );
}

/** 0.5초 로딩에 쓰는 심플 스피너 */
function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-zinc-900/30 border-t-zinc-900 dark:border-white/30 dark:border-t-white"
      aria-hidden
    />
  );
}
