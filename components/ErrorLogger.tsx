"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ErrorLogPayload {
  errorMessage: string;
  errorStack?: string;
  errorType: string;
  appId?: string;
  appUrl?: string;
  pageUrl: string;
}

// Helper function to extract app info from URL
function extractAppInfo(pathname: string) {
  if (!pathname) return { appId: undefined, appUrl: undefined };
  
  const match = pathname.match(/\/apps\/([^\/]+)/);
  if (match) {
    return {
      appId: match[1],
      appUrl: pathname,
    };
  }
  return {
    appId: undefined,
    appUrl: undefined,
  };
}

// 무해한 에러인지 확인
function isHarmlessError(errorMessage: string): boolean {
  if (!errorMessage) return true;
  
  // ResizeObserver 에러는 무시 (Chrome의 알려진 이슈)
  if (errorMessage.includes('ResizeObserver loop')) return true;
  
  // Script error (CORS 에러)는 무시
  if (errorMessage === 'Script error.' || errorMessage.trim() === '') return true;
  
  // 네트워크 에러는 무시 (이미 처리됨)
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) return true;
  
  return false;
}

// Function to send error log to API (비동기, 블로킹 방지)
function logError(payload: ErrorLogPayload) {
  // 비동기로 실행하여 메인 스레드 블로킹 방지
  setTimeout(() => {
    fetch("/api/error-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      // keepalive로 페이지 종료 시에도 전송 보장
      keepalive: true,
    }).catch((err) => {
      // Silently fail - don't want to create infinite loop
      console.error("Failed to log error:", err);
    });
  }, 0);
}

export default function ErrorLogger() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const handlersRef = useRef<{
    handleError: (event: ErrorEvent) => void;
    handleUnhandledRejection: (event: PromiseRejectionEvent) => void;
    handleComponentError: (error: Error, errorInfo?: any) => void;
  } | null>(null);

  // pathname 변경 시 ref 업데이트
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // 이벤트 핸들러 생성 (한 번만)
  useEffect(() => {
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || '';
      
      // 무해한 에러는 무시
      if (isHarmlessError(errorMessage)) {
        event.preventDefault();
        return;
      }

      event.preventDefault(); // Prevent default browser error handling

      // 최신 pathname을 ref에서 가져오기
      const currentPathname = pathnameRef.current || window.location.pathname;
      const { appId, appUrl } = extractAppInfo(currentPathname);

      const payload: ErrorLogPayload = {
        errorMessage: event.message,
        errorStack: event.error?.stack || undefined,
        errorType: event.error?.name || "Error",
        appId,
        appUrl,
        pageUrl: window.location.href,
      };

      logError(payload);
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason || '');

      // 무해한 에러는 무시
      if (isHarmlessError(errorMessage)) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      // 최신 pathname을 ref에서 가져오기
      const currentPathname = pathnameRef.current || window.location.pathname;
      const { appId, appUrl } = extractAppInfo(currentPathname);

      const errorStack =
        event.reason instanceof Error
          ? event.reason.stack
          : undefined;

      const payload: ErrorLogPayload = {
        errorMessage: `Unhandled Promise Rejection: ${errorMessage}`,
        errorStack,
        errorType: "UnhandledRejection",
        appId,
        appUrl,
        pageUrl: window.location.href,
      };

      logError(payload);
    };

    // React error boundary fallback (catches errors in components)
    const handleComponentError = (error: Error, errorInfo?: any) => {
      // 최신 pathname을 ref에서 가져오기
      const currentPathname = pathnameRef.current || window.location.pathname;
      const { appId, appUrl } = extractAppInfo(currentPathname);

      const payload: ErrorLogPayload = {
        errorMessage: error.message,
        errorStack: error.stack || errorInfo?.componentStack,
        errorType: error.name || "ComponentError",
        appId,
        appUrl,
        pageUrl: window.location.href,
      };

      logError(payload);
    };

    // 핸들러를 ref에 저장
    handlersRef.current = {
      handleError,
      handleUnhandledRejection,
      handleComponentError,
    };

    // Attach event listeners (한 번만 등록)
    window.addEventListener("error", handleError, { passive: false });
    window.addEventListener("unhandledrejection", handleUnhandledRejection, { passive: false });

    // Store error handler globally for React Error Boundaries
    (window as any).__errorLogger = handleComponentError;

    // Cleanup (컴포넌트 언마운트 시에만 실행)
    return () => {
      if (handlersRef.current) {
        window.removeEventListener("error", handlersRef.current.handleError);
        window.removeEventListener("unhandledrejection", handlersRef.current.handleUnhandledRejection);
      }
      delete (window as any).__errorLogger;
      handlersRef.current = null;
    };
  }, []); // 빈 배열 - 마운트 시 한 번만 실행

  // This component doesn't render anything
  return null;
}

// Export a manual error logging function for use in try-catch blocks
export function logErrorManually(error: Error, context?: { appId?: string; appUrl?: string }) {
  const payload: ErrorLogPayload = {
    errorMessage: error.message,
    errorStack: error.stack,
    errorType: error.name || "ManualError",
    appId: context?.appId,
    appUrl: context?.appUrl,
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
  };

  logError(payload);
}
