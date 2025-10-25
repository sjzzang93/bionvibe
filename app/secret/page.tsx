"use client";

import { getHiddenAppsAsync, type App } from "@/lib/getApps";
import { useSupabase } from "@/lib/supabase-provider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SecretPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [hiddenApps, setHiddenApps] = useState<App[]>([]);
  const [loadingHidden, setLoadingHidden] = useState(true);
  const supabase = useSupabase();

  // 페이지 로드 시 세션 확인
  useEffect(() => {
    const savedSession = localStorage.getItem("secret_session");
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000; // 30분

      // 30분 이내면 자동 로그인
      if (now - sessionData.timestamp < thirtyMinutes) {
        setUnlocked(true);
      } else {
        // 세션 만료
        localStorage.removeItem("secret_session");
      }
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const loadHiddenApps = async (bypass = false, showSpinner = false) => {
      if (showSpinner) {
        setLoadingHidden(true);
      }
      try {
        const apps = await getHiddenAppsAsync(bypass);
        setHiddenApps(apps);
      } catch (error) {
        console.error("Failed to load hidden apps", error);
      } finally {
        setLoadingHidden(false);
      }
    };

    loadHiddenApps(true, true);

    const channel = supabase
      .channel("hidden-apps-watch")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "apps"
        },
        () => loadHiddenApps(true)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleUnlock = () => {
    if (password === "8314") {
      setUnlocked(true);
      // 세션 저장 (30분 유효)
      localStorage.setItem(
        "secret_session",
        JSON.stringify({
          timestamp: Date.now()
        })
      );
    } else {
      alert("❌ 비밀번호가 틀렸습니다!");
      setPassword("");
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
              <div className="mb-4 text-7xl animate-pulse">🔐</div>
              <h1 className="mb-2 text-4xl font-extrabold text-white">Secret Vault</h1>
              <p className="text-gray-300">비밀번호를 입력하세요</p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder="비밀번호 입력"
                className="w-full rounded-xl border-2 border-white/30 bg-white/20 px-4 py-3 text-center text-lg font-mono text-white placeholder-white/50 outline-none focus:border-purple-400"
                autoFocus
              />

              <button
                type="button"
                onClick={handleUnlock}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-lg font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50"
              >
                🔓 열기
              </button>

              <Link
                href="/"
                className="block w-full rounded-xl bg-white/10 px-6 py-3 text-center font-bold text-white transition-all hover:bg-white/20"
              >
                ← 돌아가기
              </Link>
            </div>

            <div className="mt-6 text-center text-xs text-white/50">
              💡 힌트: BION 로고를 3초 안에 7번 클릭 후 문의하기 버튼을 누르면 여기로 올 수 있어요!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 text-7xl animate-bounce">🔓</div>
          <h1 className="mb-4 text-5xl font-extrabold text-white">Secret Vault</h1>
          <p className="text-lg text-gray-300">특별한 웹앱들이 여기 숨어있어요 👀</p>
        </div>

        {/* Hidden Apps Grid */}
        {loadingHidden ? (
          <div className="py-20 text-center">
            <div className="mb-6 text-6xl animate-spin">🧪</div>
            <p className="text-gray-400">비밀 웹앱 목록을 불러오는 중...</p>
          </div>
        ) : hiddenApps.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-6 text-6xl">🎁</div>
            <h3 className="mb-4 text-2xl font-bold text-white">아직 비밀 웹앱이 없어요</h3>
            <p className="text-gray-400">곧 특별한 기능들이 추가될 예정입니다!</p>
          </div>
        ) : (
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {hiddenApps.map((app) => (
              <Link
                key={app.id}
                href={app.url}
                className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-lg transition-all duration-300 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/50 backdrop-blur-lg"
              >
                {/* App Image */}
                {app.image && (
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={app.image}
                      alt={app.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span className="rounded-full bg-purple-500 px-2 py-1 text-xs font-bold text-white">
                        SECRET
                      </span>
                    </div>
                  </div>
                )}

                {/* App Info */}
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-3xl">{app.icon}</span>
                    <h3 className="truncate text-sm font-bold text-white">{app.name}</h3>
                  </div>
                  <p className="line-clamp-2 text-xs text-gray-300">{app.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Admin Tools */}
        <div className="mb-12 rounded-2xl border-2 border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <h2 className="mb-6 text-center text-3xl font-bold text-white">🛠️ 관리 도구</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/secret/contacts"
              className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-center font-bold text-white transition-all hover:shadow-lg hover:shadow-green-500/50"
            >
              📧 문의 관리
            </Link>
            <Link
              href="/secret/analytics"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 text-center font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/50"
            >
              📊 방문자 통계
            </Link>
            <Link
              href="/secret/image-manager"
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-center font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50"
            >
              🖼️ 이미지 관리
            </Link>
            <Link
              href="/secret/dev-glossary"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-center font-bold text-white transition-all hover:shadow-lg hover:shadow-orange-500/50"
            >
              📖 개발자 용어 사전
            </Link>
            <Link
              href="/secret/guestbook"
              className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 text-center font-bold text-white transition-all hover:shadow-lg hover:shadow-amber-500/50"
            >
              📝 방명록 관리
            </Link>
            <Link
              href="/secret/gold-price-manager"
              className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 text-center font-bold text-white transition-all hover:shadow-lg hover:shadow-yellow-500/50"
            >
              🏅 금 시세 관리
            </Link>
            <Link
              href="/secret/press-kit"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-4 text-center font-bold text-white transition-all hover:shadow-lg hover:shadow-sky-500/50"
            >
              🗞️ 프레스 키트
            </Link>
            <Link
              href="/secret/dev-tools"
              className="rounded-xl bg-gradient-to-r from-slate-500 to-gray-700 px-6 py-4 text-center font-bold text-white transition-all hover:shadow-lg hover:shadow-slate-500/50"
            >
              🧰 개발 도구 모음
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-white/40">업데이트된 비밀 앱은 실시간으로 반영됩니다.</div>
      </div>
    </div>
  );
}
