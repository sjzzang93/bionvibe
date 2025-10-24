"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HeartState = {
  count: number;
  loading: boolean;
  error: string | null;
  highlight: boolean;
};

const GuestbookHeart = () => {
  const [{ count, loading, error, highlight }, setState] = useState<HeartState>({
    count: 0,
    loading: true,
    error: null,
    highlight: false
  });

  const fetchCount = async () => {
    try {
      const response = await fetch("/api/guestbook/heart", { cache: "no-store" });
      const data = await response.json();
      setState((prev) => ({ ...prev, count: data?.count ?? 0, loading: false, error: null }));
    } catch (err) {
      console.error("[guestbook][heart] fetch", err);
      setState((prev) => ({ ...prev, loading: false, error: "하트를 불러오지 못했어요." }));
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const handleClick = async () => {
    if (loading) return;
    const optimistic = count + 1;
    setState((prev) => ({ ...prev, count: optimistic, highlight: true, error: null }));

    try {
      const response = await fetch("/api/guestbook/heart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: 1 })
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error("failed");
      }
      setState((prev) => ({ ...prev, count: data.count ?? optimistic, highlight: true }));
      setTimeout(() => setState((prev) => ({ ...prev, highlight: false })), 1200);
    } catch (err) {
      console.error("[guestbook][heart] update", err);
      setState((prev) => ({
        ...prev,
        count: prev.count - 1,
        error: "하트를 전송하지 못했어요. 잠시 후 다시 시도해 주세요.",
        highlight: false
      }));
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 하트 버튼 */}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`group relative transition-all duration-300 ${highlight ? 'animate-bounce' : ''}`}
        aria-label="방명록 하트 누르기"
      >
        <div className="relative w-24 h-24">
          {/* 글로우 효과 */}
          {highlight && (
            <div className="absolute inset-0 animate-ping opacity-50">
              <Image
                src="/heart-logo.png"
                alt="하트"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          )}
          {/* 메인 하트 */}
          <div className={`relative transition-all duration-200 ${
            loading ? 'grayscale' : 'group-hover:scale-110 group-active:scale-95'
          } ${highlight ? 'drop-shadow-[0_0_20px_rgba(244,63,94,0.9)]' : 'drop-shadow-lg'}`}>
            <Image
              src="/heart-logo.png"
              alt="하트"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </button>

      {/* 카운터 */}
      <div className="text-center">
        <p className={`text-2xl font-bold transition-colors ${
          highlight ? 'text-rose-600 dark:text-rose-400' : 'text-rose-500 dark:text-rose-300'
        }`}>
          {loading ? '...' : count.toLocaleString()}
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-[10px] text-rose-500 dark:text-rose-400 text-center max-w-[120px]">
          {error}
        </p>
      )}
    </div>
  );
};

export default GuestbookHeart;
