"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const SCRIPT_ID = "google-translate-script";
const TARGET_ID = "google_translate_element";
const INCLUDED_LANGUAGES = "ko,en,fr,es,ja,zh-CN";

const shouldHideForPath = (pathname?: string | null) => {
  if (!pathname) return false;
  return pathname.startsWith("/privacy") || pathname.startsWith("/terms");
};

const TranslateButton = () => {
  const pathname = usePathname();
  const hidden = shouldHideForPath(pathname);

  useEffect(() => {
    if (hidden) return;
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      const container = document.getElementById(TARGET_ID);
      if (!container || container.getAttribute("data-initialized") === "true") {
        return;
      }

      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "ko",
            includedLanguages: INCLUDED_LANGUAGES,
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          TARGET_ID
        );
        container.setAttribute("data-initialized", "true");
      }
    };

    const previousCallback = window.googleTranslateElementInit;
    window.googleTranslateElementInit = () => {
      previousCallback?.();
      initializeWidget();
    };

    if (window.google?.translate?.TranslateElement) {
      initializeWidget();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [hidden]);

  if (hidden) {
    return null;
  }

  return (
    <div className="fixed bottom-3 right-3 z-50 transform-gpu scale-[0.7] sm:scale-[0.75] lg:scale-[0.85]">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/88 shadow-[0_16px_36px_-26px_rgba(13,148,136,0.65)] ring-1 ring-cyan-100/45 backdrop-blur">
        <span className="text-[18px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">🌐</span>
        <span className="pointer-events-none absolute bottom-[7px] text-[10px] text-cyan-500 drop-shadow-sm">▼</span>
        <div
          id={TARGET_ID}
          className="absolute inset-0"
          aria-label="언어 변경"
        />
      </div>

      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }

        #${TARGET_ID} {
          position: absolute !important;
          inset: 0 !important;
        }
        #${TARGET_ID} .goog-te-gadget {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        #${TARGET_ID} .goog-te-gadget-simple {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          background: transparent !important;
          opacity: 0 !important;
        }
        #${TARGET_ID} .goog-te-gadget-simple span,
        #${TARGET_ID} .goog-te-gadget-simple img,
        #${TARGET_ID} .goog-te-gadget-simple .goog-te-menu-value {
          display: none !important;
        }
        #${TARGET_ID} .goog-te-combo {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          background: transparent !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          cursor: pointer !important;
        }
        #${TARGET_ID} .goog-te-combo option {
          color: #0f172a !important;
          background: #f8fafc !important;
        }
        @media (prefers-color-scheme: dark) {
          #${TARGET_ID} .goog-te-combo option {
            background: #0f172a !important;
            color: #e2e8f0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TranslateButton;
