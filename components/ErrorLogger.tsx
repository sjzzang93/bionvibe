"use client";

import { useEffect } from "react";
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

// Function to send error log to API
async function logError(payload: ErrorLogPayload) {
  try {
    await fetch("/api/error-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Silently fail - don't want to create infinite loop
    console.error("Failed to log error:", err);
  }
}

export default function ErrorLogger() {
  const pathname = usePathname();

  useEffect(() => {
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      event.preventDefault(); // Prevent default browser error handling

      const { appId, appUrl } = extractAppInfo(pathname);

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
      event.preventDefault();

      const { appId, appUrl } = extractAppInfo(pathname);

      const errorMessage =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason);

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
    const handleComponentError = (error: Error, errorInfo: any) => {
      const { appId, appUrl } = extractAppInfo(pathname);

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

    // Attach event listeners
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Store error handler globally for React Error Boundaries
    (window as any).__errorLogger = handleComponentError;

    // Cleanup
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      delete (window as any).__errorLogger;
    };
  }, [pathname]);

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
