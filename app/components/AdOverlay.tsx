'use client';

import { useState, useEffect } from 'react';
import AdSense from './AdSense';

interface AdOverlayProps {
  onClose?: () => void;
}

export default function AdOverlay({ onClose }: AdOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 500ms 후에 광고 표시
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // 2초 후에 로딩 상태 해제
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // 5초 후에 자동으로 닫기 (광고가 안 뜰 경우 대비)
    const autoCloseTimer = setTimeout(() => {
      if (isLoading) {
        setIsVisible(false);
      }
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(loadTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [isLoading]);

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
          <div className="relative" onClick={handleClose}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[280px]">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">광고 로딩 중...</p>
                </div>
              </div>
            )}
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
