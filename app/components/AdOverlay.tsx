'use client';

import { useState, useEffect } from 'react';
import AdSense from './AdSense';

interface AdOverlayProps {
  onClose?: () => void;
}

export default function AdOverlay({ onClose }: AdOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 500ms 후에 광고 표시
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative max-w-4xl w-full mx-4 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110"
          aria-label="광고 닫기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 광고 */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 shadow-2xl">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              광고를 클릭하거나 X 버튼을 눌러 닫으세요
            </p>
          </div>
          <div onClick={handleClose}>
            <AdSense className="min-h-[280px] cursor-pointer" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
