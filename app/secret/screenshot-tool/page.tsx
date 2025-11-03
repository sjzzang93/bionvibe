"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllAppsAsync, type App } from "@/lib/getApps";

export default function ScreenshotToolAuto() {
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // 앱 목록 불러오기
  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const fetchedApps = await getAllAppsAsync(true, true);
      setApps(fetchedApps);
    } catch (error) {
      console.error("Failed to load apps:", error);
    }
  };

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    app.id.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // 🆕 한영 키워드 사전
  const koreanToEnglish: { [key: string]: string } = {
    '뇌': 'brain',
    '우울': 'depression',
    '우울증': 'depression',
    '정신': 'mental',
    '심리': 'psychology',
    '마음': 'mind',
    '건강': 'health',
    '명상': 'meditation',
    '치유': 'therapy',
    '행복': 'happiness',
    '기술': 'technology',
    '자연': 'nature',
    '비즈니스': 'business',
    '음식': 'food',
    '여행': 'travel',
    '도시': 'city',
    '바다': 'ocean',
    '산': 'mountain',
    '하늘': 'sky',
    '꿈': 'dream',
    '사랑': 'love',
    '운동': 'fitness',
    '요가': 'yoga',
    '책': 'book',
    '공부': 'study',
    '돈': 'money',
    '성공': 'success',
    '미래': 'future',
    '과학': 'science',
    '예술': 'art',
    '음악': 'music',
    '영화': 'movie',
    '게임': 'game',
    '컴퓨터': 'computer',
    '스마트폰': 'smartphone',
    '인터넷': 'internet',
    '소셜': 'social',
    '친구': 'friends',
    '가족': 'family',
    '사람': 'people',
    '아이': 'child',
    '어린이': 'children',
    '동물': 'animal',
    '고양이': 'cat',
    '강아지': 'dog',
    '새': 'bird',
    '꽃': 'flower',
    '나무': 'tree',
    '숲': 'forest',
    '밤': 'night',
    '아침': 'morning',
    '저녁': 'evening',
    '겨울': 'winter',
    '봄': 'spring',
    '여름': 'summer',
    '가을': 'autumn',
    '비': 'rain',
    '눈': 'snow',
    '구름': 'cloud',
    '태양': 'sun',
    '달': 'moon',
    '별': 'star',
  };

  // 🆕 한글 키워드 자동 변환
  const translateKeyword = (query: string): string => {
    const trimmed = query.trim().toLowerCase();

    // 한글이 포함되어 있는지 확인
    const hasKorean = /[�가-힣]/.test(trimmed);

    if (hasKorean) {
      // 사전에서 찾기
      for (const [korean, english] of Object.entries(koreanToEnglish)) {
        if (trimmed.includes(korean)) {
          return english;
        }
      }

      // 사전에 없으면 첫 번째 한글 단어만 추출해서 매칭 시도
      const koreanWords = trimmed.match(/[가-힣]+/g);
      if (koreanWords && koreanWords.length > 0) {
        const firstWord = koreanWords[0];
        if (koreanToEnglish[firstWord]) {
          return koreanToEnglish[firstWord];
        }
      }

      // 아무것도 못 찾으면 기본값
      return 'nature';
    }

    // 영어면 그대로 반환
    return trimmed;
  };

  const searchUnsplash = async () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }

    setLoading(true);

    try {
      // 🆕 한글 자동 번역
      const englishKeyword = translateKeyword(searchQuery);

      // 번역된 키워드 알림
      if (searchQuery !== englishKeyword) {
        console.log(`"${searchQuery}" → "${englishKeyword}"로 검색했습니다`);
      }

      // 🚀 실제 Unsplash API 검색
      const response = await fetch(`/api/secret/unsplash/search?query=${encodeURIComponent(englishKeyword)}`);
      const data = await response.json();

      if (data.success && data.image) {
        setScreenshotUrl(data.image.url);
        console.log('✅ 이미지 검색 성공:', data.image);
      } else {
        // API 키가 없거나 검색 실패시 fallback 이미지 사용
        if (data.fallbackImage) {
          setScreenshotUrl(data.fallbackImage);
          alert(`⚠️ ${data.message}\nFallback 이미지를 사용합니다.`);
        } else {
          throw new Error(data.message || '이미지 검색 실패');
        }
      }
    } catch (error) {
      console.error('Unsplash search error:', error);
      alert(`❌ 이미지 검색 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 자동 적용 기능
  const applyImageToApp = async () => {
    if (!selectedApp) {
      alert("앱을 선택해주세요!");
      return;
    }

    if (!screenshotUrl) {
      alert("이미지를 먼저 생성해주세요!");
      return;
    }

    setApplying(true);

    try {
      const response = await fetch('/api/secret/apps/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: selectedApp.id,
          imageUrl: screenshotUrl
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ ${selectedApp.name}에 이미지가 자동으로 적용되었습니다!`);

        // 로컬 상태 업데이트
        setApps(prev => prev.map(app =>
          app.id === selectedApp.id
            ? { ...app, image: screenshotUrl }
            : app
        ));

        // 선택된 앱 업데이트
        setSelectedApp({ ...selectedApp, image: screenshotUrl });

        // 초기화
        setScreenshotUrl("");
        setSearchQuery("");
      } else {
        throw new Error(result.message || '업데이트 실패');
      }
    } catch (error) {
      console.error(error);
      alert(`❌ 이미지 적용 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 py-12">
      <div className="mx-auto max-w-6xl">
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
          <h1 className="text-5xl font-bold text-white mb-4">스크린샷 자동 적용</h1>
          <p className="text-lg text-white/70">앱 선택 → 이미지 검색 → 원클릭 적용!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 왼쪽: 앱 선택 */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>1️⃣</span>
                <span>앱 선택</span>
              </h2>

              <input
                type="search"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="앱 이름 또는 ID 검색..."
                className="w-full mb-4 rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-400/40"
              />

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setSearchQuery(""); // 검색어 초기화
                    }}
                    className={`
                      w-full text-left p-4 rounded-lg transition-all
                      ${selectedApp?.id === app.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-[1.02]'
                        : 'bg-white/10 hover:bg-white/20'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{app.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate">{app.name}</div>
                        <div className="text-xs text-white/60 truncate">{app.id}</div>
                      </div>
                      {selectedApp?.id === app.id && (
                        <span className="text-2xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}

                {filteredApps.length === 0 && (
                  <div className="text-center py-8 text-white/50">
                    검색 결과가 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 선택된 앱 정보 */}
            {selectedApp && (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 backdrop-blur-lg animate-fadeIn">
                <h3 className="text-lg font-bold text-white mb-3">선택된 앱</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedApp.icon}</span>
                    <div>
                      <div className="font-bold text-white">{selectedApp.name}</div>
                      <div className="text-sm text-white/60">{selectedApp.id}</div>
                    </div>
                  </div>

                  {selectedApp.image && (
                    <div className="mt-3">
                      <div className="text-sm text-white/70 mb-2">현재 이미지:</div>
                      <img
                        src={selectedApp.image}
                        alt={selectedApp.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 이미지 검색 및 적용 */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>2️⃣</span>
                <span>이미지 검색</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    검색 키워드 (한글/영어 모두 가능)
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      selectedApp
                        ? `${selectedApp.name}에 어울리는 키워드...`
                        : "우울증, depression, 자연, nature..."
                    }
                    className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-400/40"
                    onKeyDown={(e) => e.key === "Enter" && searchUnsplash()}
                  />
                </div>

                <button
                  onClick={searchUnsplash}
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🔄 검색 중...' : '🔍 이미지 검색'}
                </button>
              </div>

              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-200 text-xs">
                  ✅ 실제 Unsplash API로 이미지를 검색합니다! 한글 키워드도 자동 번역됩니다.
                </p>
              </div>
            </div>

            {/* 이미지 미리보기 */}
            {screenshotUrl && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg animate-fadeIn">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>3️⃣</span>
                  <span>적용하기</span>
                </h2>

                <div className="rounded-xl overflow-hidden border-4 border-white/20 mb-4">
                  <img
                    src={screenshotUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-200 text-sm">
                      {selectedApp
                        ? `✅ "${selectedApp.name}"에 이 이미지를 적용하시겠습니까?`
                        : '⚠️ 먼저 앱을 선택해주세요!'
                      }
                    </p>
                  </div>

                  <button
                    onClick={applyImageToApp}
                    disabled={!selectedApp || applying}
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying
                      ? '⏳ 적용 중...'
                      : '🚀 자동으로 적용하기'
                    }
                  </button>

                  <button
                    onClick={() => {
                      setScreenshotUrl("");
                      setSearchQuery("");
                    }}
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-bold text-white transition-all hover:bg-white/10"
                  >
                    🔄 다시 검색
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 사용 가이드 */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-white mb-6">📚 빠른 사용법</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">1️⃣</div>
              <h3 className="font-bold text-white mb-2">앱 선택</h3>
              <p className="text-sm text-white/70">
                왼쪽에서 이미지를 추가할 앱을 클릭
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-3">2️⃣</div>
              <h3 className="font-bold text-white mb-2">이미지 검색</h3>
              <p className="text-sm text-white/70">
                키워드 입력 후 이미지 검색
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-3">3️⃣</div>
              <h3 className="font-bold text-white mb-2">원클릭 적용</h3>
              <p className="text-sm text-white/70">
                "자동으로 적용하기" 버튼 클릭!
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-200 text-sm text-center">
              ✨ 더 이상 apps.json을 직접 수정할 필요 없습니다!
            </p>
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

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}
