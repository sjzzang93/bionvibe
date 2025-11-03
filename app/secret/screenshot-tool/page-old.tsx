"use client";

import { useState } from "react";
import Link from "next/link";

export default function ScreenshotTool() {
  const [appUrl, setAppUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const captureScreenshot = async () => {
    if (!appUrl.trim()) {
      alert("앱 URL을 입력해주세요!");
      return;
    }

    setLoading(true);

    try {
      // 실제로는 스크린샷 API를 사용하거나 서버에서 Puppeteer로 캡처
      // 여기서는 간단히 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Unsplash에서 랜덤 이미지 (실제로는 스크린샷)
      const unsplashUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&auto=format&fit=crop`;
      setScreenshotUrl(unsplashUrl);

      alert("✅ 스크린샷이 생성되었습니다! (시뮬레이션)");
    } catch (error) {
      console.error(error);
      alert("❌ 스크린샷 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const searchUnsplash = () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }

    // Unsplash 검색 (실제로는 API 사용)
    const unsplashUrl = `https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop&q=${encodeURIComponent(searchQuery)}`;
    setScreenshotUrl(unsplashUrl);
  };

  const copyToClipboard = () => {
    if (!screenshotUrl) return;

    navigator.clipboard.writeText(screenshotUrl);
    alert("✅ URL이 클립보드에 복사되었습니다!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/secret"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
          >
            ← 돌아가기
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="text-7xl mb-4">📸</div>
          <h1 className="text-5xl font-bold text-white mb-4">스크린샷 자동 캡처</h1>
          <p className="text-lg text-white/70">앱 URL을 입력하면 자동으로 썸네일을 생성합니다</p>
        </div>

        {/* 스크린샷 캡처 섹션 */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 URL 스크린샷</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">
                앱 URL
              </label>
              <input
                type="url"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                placeholder="https://example.com/apps/my-app"
                className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-400/40"
              />
            </div>

            <button
              onClick={captureScreenshot}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "캡처 중..." : "📸 스크린샷 캡처"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-200 text-sm">
              💡 <strong>참고:</strong> 실제 스크린샷 캡처 기능은 서버 환경 설정이 필요합니다.
              현재는 시뮬레이션 모드로 동작합니다.
            </p>
          </div>
        </div>

        {/* Unsplash 검색 섹션 */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-white mb-6">🔍 Unsplash 이미지 검색</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">
                검색 키워드 (영어)
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="technology, nature, business..."
                className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-400/40"
                onKeyDown={(e) => e.key === "Enter" && searchUnsplash()}
              />
            </div>

            <button
              onClick={searchUnsplash}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/50"
            >
              🔍 검색하기
            </button>
          </div>
        </div>

        {/* 결과 미리보기 */}
        {screenshotUrl && (
          <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">🖼️ 생성된 이미지</h2>

            <div className="rounded-xl overflow-hidden border-4 border-white/20 mb-6">
              <img
                src={screenshotUrl}
                alt="Screenshot"
                className="w-full h-auto"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  이미지 URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={screenshotUrl}
                    readOnly
                    className="flex-1 rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
                  >
                    📋 복사
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-sm">
                  ✅ 이 URL을 apps.json의 "image" 필드에 붙여넣으세요!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 사용 가이드 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-white mb-6">📚 사용 가이드</h2>

          <div className="space-y-4 text-white/80">
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">1️⃣</span>
              <div>
                <h3 className="font-bold text-white mb-1">앱 URL 입력</h3>
                <p className="text-sm">캡처하고 싶은 앱의 전체 URL을 입력하세요.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">2️⃣</span>
              <div>
                <h3 className="font-bold text-white mb-1">스크린샷 캡처</h3>
                <p className="text-sm">버튼을 클릭하면 자동으로 페이지를 캡처합니다.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">3️⃣</span>
              <div>
                <h3 className="font-bold text-white mb-1">이미지 URL 복사</h3>
                <p className="text-sm">생성된 이미지 URL을 복사해서 apps.json에 추가하세요.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">4️⃣</span>
              <div>
                <h3 className="font-bold text-white mb-1">Unsplash 대안</h3>
                <p className="text-sm">
                  스크린샷이 필요 없다면 Unsplash에서 관련 이미지를 검색할 수도 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
