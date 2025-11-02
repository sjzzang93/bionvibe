"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSupabase } from "@/lib/supabase-provider";

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

  const [displayCount, setDisplayCount] = useState(0);

  const animationFrameRef = useRef<number>();
  const startValueRef = useRef(0);
  const targetValueRef = useRef(0);
  const animationStartRef = useRef(0);
  const displayValueRef = useRef(0);
  const isMounted = useRef(true);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const supabase = useSupabase();

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  const animateTo = useCallback(
    (nextValue: number, duration = 600) => {
      if (!Number.isFinite(nextValue)) return;

      const currentValue = displayValueRef.current ?? 0;
      if (Math.round(currentValue) === Math.round(nextValue)) {
        displayValueRef.current = nextValue;
        setDisplayCount(nextValue);
        return;
      }

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      const effectiveDuration = prefersReducedMotion ? 0 : duration;

      if (effectiveDuration <= 0) {
        cancelAnimation();
        displayValueRef.current = nextValue;
        setDisplayCount(nextValue);
        return;
      }

      cancelAnimation();

      startValueRef.current = currentValue;
      targetValueRef.current = nextValue;
      animationStartRef.current = performance.now();

      const step = (timestamp: number) => {
        const elapsed = timestamp - animationStartRef.current;
        const progress = Math.min(1, elapsed / effectiveDuration);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        const value =
          startValueRef.current +
          (targetValueRef.current - startValueRef.current) * eased;

        displayValueRef.current = value;
        setDisplayCount(Math.round(value));

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          animationFrameRef.current = undefined;
          displayValueRef.current = targetValueRef.current;
          setDisplayCount(Math.round(targetValueRef.current));
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    },
    [cancelAnimation]
  );

  const fetchCount = useCallback(async () => {
    console.log("[❤️ 하트] fetchCount 시작, isMounted:", isMounted.current);
    try {
      const response = await fetch("/api/guestbook/heart", { cache: "no-store" });
      console.log("[❤️ 하트] 응답 받음:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log("[❤️ 하트] 데이터:", data, "isMounted:", isMounted.current);
      
      const next = typeof data?.count === 'number' ? data.count : 0;
      console.log("[❤️ 하트] 최종 count:", next, "isMounted:", isMounted.current);
      
      // setState는 항상 실행 (React가 알아서 처리함)
      setState((prev) => {
        console.log("[❤️ 하트] setState 실행! loading: false");
        return { ...prev, count: next, loading: false, error: null };
      });
      animateTo(next);
    } catch (err) {
      console.error("[❤️ 하트] 에러 발생:", err);
      // 에러가 나도 loading은 false로 설정하고 0으로 표시
      setState((prev) => ({ ...prev, count: 0, loading: false, error: "하트를 불러오지 못했어요." }));
      animateTo(0);
    }
  }, [animateTo]);

  useEffect(() => {
    fetchCount();
    
    // 안전장치: 3초 후에도 로딩 중이면 강제로 해제
    const timeout = setTimeout(() => {
      if (!isMounted.current) return;
      setState((prev) => {
        if (prev.loading) {
          console.warn("[guestbook][heart] 로딩 타임아웃 - 강제 해제");
          return { ...prev, loading: false, count: 0 };
        }
        return prev;
      });
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [fetchCount]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      cancelAnimation();
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [cancelAnimation]);

  useEffect(() => {
    if (!supabase) return;
    if (typeof window === "undefined") return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    
    const channel = supabase
      .channel("guestbook-heart-counter")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guestbook_hearts" },
        (payload: any) => {
          console.log("[❤️ 하트] Realtime 이벤트 수신:", payload);
          const next = Number(payload.new?.count);
          console.log("[❤️ 하트] Realtime count:", next);
          if (!Number.isFinite(next)) {
            console.warn("[❤️ 하트] Realtime count가 숫자가 아님:", next);
            return;
          }
          setState((prev) => {
            console.log("[❤️ 하트] Realtime으로 setState:", next);
            return { ...prev, count: next, loading: false, error: null };
          });
          animateTo(next, 500);
        }
      )
      .subscribe((status) => {
        console.log("[❤️ 하트] Realtime 구독 상태:", status);
      });

    return () => {
      console.log("[❤️ 하트] Realtime 채널 정리");
      supabase.removeChannel(channel);
    };
  }, [animateTo, supabase]);

  const handleClick = async () => {
    console.log("[❤️ 하트] 클릭! loading:", loading);
    if (loading) return;

    let optimisticValue = 0;

    setState((prev) => {
      optimisticValue = prev.count + 1;
      console.log("[❤️ 하트] 낙관적 업데이트:", prev.count, "→", optimisticValue);
      return { ...prev, count: optimisticValue, highlight: true, error: null };
    });

    if (optimisticValue > 0) {
      animateTo(optimisticValue, 450);
    }

    try {
      console.log("[❤️ 하트] POST 요청 시작...");
      const response = await fetch("/api/guestbook/heart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: 1 })
      });

      const data = await response.json();
      console.log("[❤️ 하트] POST 응답:", data);
      
      if (!response.ok || !data?.success) {
        throw new Error("failed");
      }
      
      const confirmed = typeof data.count === "number" ? data.count : optimisticValue;
      console.log("[❤️ 하트] 최종 확정 count:", confirmed);
      
      setState((prev) => ({ ...prev, count: confirmed, highlight: true }));
      animateTo(confirmed, 550);
      
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      highlightTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, highlight: false }));
      }, 900);
    } catch (err) {
      console.error("[❤️ 하트] 클릭 에러:", err);
      const fallbackValue = Math.max(optimisticValue - 1, 0);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      setState((prev) => ({
        ...prev,
        count: fallbackValue,
        error: "하트를 전송하지 못했어요. 잠시 후 다시 시도해 주세요.",
        highlight: false
      }));
      animateTo(fallbackValue, 400);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 하트 버튼 */}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`group relative transition-all duration-300 ${highlight ? 'animate-bounce' : ''}`}
        aria-label="방명록 하트 누르기"
      >
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* 글로우 효과 */}
          {highlight && (
            <div className="absolute inset-0 flex h-full w-full items-center justify-center animate-ping opacity-50">
              <Image
                src="/heart-bulb.png"
                alt="하트"
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
          )}
          {/* 메인 하트 */}
          <div className={`relative h-full w-full transition-all duration-200 ${
            loading ? 'grayscale' : 'group-hover:scale-110 group-active:scale-95'
          } ${highlight ? 'drop-shadow-[0_0_20px_rgba(234,179,8,0.9)]' : 'drop-shadow-lg'}`}>
            <Image
              src="/heart-bulb.png"
              alt="하트"
              fill
              sizes="96px"
              className="object-contain"
            />
          </div>
        </div>
      </button>

      {/* 카운터 */}
      <div className="flex items-center justify-center w-full">
        <p className={`text-3xl font-bold tabular-nums transition-colors ${
          highlight ? 'text-yellow-600 dark:text-yellow-400' : 'text-yellow-500 dark:text-yellow-300'
        }`}>
          {loading ? '...' : displayCount.toLocaleString()}
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-[10px] text-yellow-600 dark:text-yellow-400 text-center max-w-[120px]">
          {error}
        </p>
      )}
    </div>
  );
};

export default GuestbookHeart;
