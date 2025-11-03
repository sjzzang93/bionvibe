"use client";

import { getAllAppsAsync, type App } from "@/lib/getApps";
import { useSupabase } from "@/lib/supabase-provider";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import VisitorStatsViewer from "./components/VisitorStatsViewer";
import Dashboard from "./components/Dashboard";

export default function SecretPage() {
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [apps, setApps] = useState<App[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const supabase = useSupabase();
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [renameSearch, setRenameSearch] = useState('');
  const [togglingAppId, setTogglingAppId] = useState<string | null>(null);

  const hiddenApps = useMemo(() => apps.filter((app) => app.hidden), [apps]);
  const filteredApps = useMemo(() => {
    const keyword = renameSearch.trim().toLowerCase();
    if (!keyword) return apps;
    return apps.filter((app) => {
      return (
        app.name.toLowerCase().includes(keyword) ||
        app.id.toLowerCase().includes(keyword) ||
        (app.slug && app.slug.toLowerCase().includes(keyword))
      );
    });
  }, [apps, renameSearch]);

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setMounted(true);
  }, []);

  // 페이지 로드 시 세션 확인
  useEffect(() => {
    if (!mounted) return;

    const savedSession = localStorage.getItem("secret_session");
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;

      if (now - sessionData.timestamp < thirtyMinutes) {
        setUnlocked(true);
      } else {
        localStorage.removeItem("secret_session");
      }
    }
  }, [mounted]);

  // 방문 추적
  useEffect(() => {
    if (unlocked) {
      trackVisit();
    }
  }, [unlocked]);

  const trackVisit = async () => {
    try {
      await fetch('/api/secret/track-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to track visit:', error);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    const loadApps = async (bypass = false, showSpinner = false) => {
      if (showSpinner) {
        setLoadingApps(true);
      }
      try {
        const fetched = await getAllAppsAsync(true, bypass);
        setApps(fetched);
      } catch (error) {
        console.error("Failed to load apps", error);
      } finally {
        setLoadingApps(false);
      }
    };

    loadApps(true, true);

    const channel = supabase
      .channel("hidden-apps-watch")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "apps"
        },
        () => loadApps(true)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const startRename = (app: App) => {
    setEditingAppId(app.id);
    setRenameValue(app.name);
  };

  const cancelRename = () => {
    setEditingAppId(null);
    setRenameValue('');
  };

  const submitRename = async (appId: string) => {
    const nextName = renameValue.trim();
    if (!nextName) {
      alert('새 이름을 입력해주세요.');
      return;
    }

    const targetApp = apps.find((app) => app.id === appId);
    if (targetApp && targetApp.name === nextName) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    try {
      setRenaming(true);
      const response = await fetch('/api/secret/apps/rename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appId, newName: nextName }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || '업데이트에 실패했습니다.');
      }

      setApps((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, name: nextName } : app)),
      );
      setEditingAppId(null);
      setRenameValue('');
      alert('✅ 이름이 업데이트되었습니다.');
    } catch (error) {
      const message = error instanceof Error ? error.message : '업데이트 중 오류가 발생했습니다.';
      alert(`❌ ${message}`);
    } finally {
      setRenaming(false);
    }
  };

  // 🆕 Hidden 토글 함수
  const toggleHidden = async (appId: string) => {
    try {
      setTogglingAppId(appId);
      const response = await fetch('/api/secret/apps/toggle-hidden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appId }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || '상태 변경에 실패했습니다.');
      }

      // 로컬 상태 업데이트
      setApps((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, hidden: result.hidden } : app
        )
      );

    } catch (error) {
      const message = error instanceof Error ? error.message : '오류가 발생했습니다.';
      alert(`❌ ${message}`);
    } finally {
      setTogglingAppId(null);
    }
  };

  const handleUnlock = async () => {
    try {
      const response = await fetch('/api/secret/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setUnlocked(true);
        localStorage.setItem(
          "secret_session",
          JSON.stringify({
            timestamp: Date.now(),
            token: data.token
          })
        );
      } else {
        alert("❌ " + (data.message || "비밀번호가 틀렸습니다!"));
        setPassword("");
      }
    } catch (error) {
      alert("❌ 인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error('Auth error:', error);
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
                className="w-full rounded-xl border-2 border-white/30 bg-white/20 px-4 py-4 text-center text-base sm:text-lg font-mono text-white placeholder-white/50 outline-none focus:border-purple-400 transition-colors"
                autoFocus
              />

              <button
                type="button"
                onClick={handleUnlock}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-base sm:text-lg font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 touch-manipulation min-h-[48px]"
              >
                🔓 열기
              </button>

              <Link
                href="/"
                className="block w-full rounded-xl bg-white/10 px-6 py-4 text-center text-base sm:text-lg font-bold text-white transition-all hover:bg-white/20 active:scale-95 touch-manipulation min-h-[48px]"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-4 text-5xl sm:text-7xl animate-bounce">🔓</div>
          <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">Secret Vault</h1>
          <p className="text-base sm:text-lg text-gray-300">특별한 웹앱들이 여기 숨어있어요 👀</p>
        </div>

        {/* 🆕 대시보드 */}
        <div className="mb-12">
          <Dashboard />
        </div>

        {/* Visitor Stats */}
        <div className="mb-12">
          <VisitorStatsViewer />
        </div>

        {/* Local Tools Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-white">📊 로컬 도구</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <Link
              href="/secret/daily-ledger"
              className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-lg transition-all duration-300 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/50 backdrop-blur-lg"
            >
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-lg font-bold text-white">일일 가계부</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/70">
                  오늘의 매출과 손익을 기록하세요
                </p>
              </div>
            </Link>
            <Link
              href="/secret/claude-learning"
              className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-lg transition-all duration-300 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/50 backdrop-blur-lg"
            >
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-lg font-bold text-white">Claude 학습 카드</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/70">
                  플래시카드로 Claude 기능 배우기
                </p>
              </div>
            </Link>
            <Link
              href="/secret/screenshot-tool"
              className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 backdrop-blur-lg"
            >
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-3xl">📸</span>
                </div>
                <h3 className="text-lg font-bold text-white">스크린샷 도구</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/70">
                  앱 URL로 썸네일 자동 생성
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Hidden Apps Grid with Toggle */}
        {loadingApps ? (
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
          <>
            <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-white">🔐 히든 웹앱</h2>
            <div className="mb-12 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {hiddenApps.map((app) => {
              const isEditing = editingAppId === app.id;
              const isToggling = togglingAppId === app.id;

              return (
                <div
                  key={app.id}
                  className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-lg transition-all duration-300 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/50 backdrop-blur-lg"
                >
                  {/* 🆕 Hidden 토글 스위치 */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleHidden(app.id);
                      }}
                      disabled={isToggling}
                      className={`
                        relative inline-flex h-5 w-10 items-center rounded-2xl transition-all duration-300 touch-manipulation backdrop-blur-sm
                        ${app.hidden
                          ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/50'
                          : 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50'}
                        ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95 hover:scale-105'}
                        ring-2 ring-white/20
                      `}
                      title={app.hidden ? 'Hidden 상태 (클릭하면 공개)' : '공개 상태 (클릭하면 숨김)'}
                    >
                      <span
                        className={`
                          inline-block h-3.5 w-3.5 transform rounded-xl bg-white transition-all duration-300 shadow-lg
                          ${app.hidden ? 'translate-x-5.5' : 'translate-x-0.5'}
                        `}
                      />
                    </button>
                  </div>

                  <Link href={app.url} className="block">
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

                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-3xl">{app.icon}</span>
                        <span className="text-xs text-white/60">{app.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {isEditing ? renameValue : app.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">{app.description}</p>
                      <div className="mt-3 text-xs text-purple-200/60">
                        <p>카테고리: {app.categoryId}</p>
                        <p>경로: {app.url}</p>
                      </div>
                    </div>
                  </Link>

                  <div className="border-t border-white/10 bg-black/30 p-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              submitRename(app.id);
                            }
                          }}
                          className="w-full rounded-lg border border-purple-400/40 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-colors"
                          placeholder="새 이름을 입력하세요"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => submitRename(app.id)}
                            disabled={renaming}
                            className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-3 min-h-[44px] text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
                          >
                            {renaming ? '저장 중...' : '💾 저장'}
                          </button>
                          <button
                            type="button"
                            onClick={cancelRename}
                            disabled={renaming}
                            className="flex-1 rounded-lg border border-white/20 px-3 py-3 min-h-[44px] text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startRename(app)}
                        className="w-full rounded-lg border border-purple-400/50 px-3 py-3 min-h-[44px] text-sm font-semibold text-purple-100 transition-all hover:bg-purple-500/20 active:scale-95 touch-manipulation"
                      >
                        ✏️ 이름 변경
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </>
        )}

        {/* Rename Manager with Toggle */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">📝 웹앱 관리</h2>
              <p className="text-xs sm:text-sm text-purple-100/70">
                전체 앱 {apps.length}개 · 숨김 {hiddenApps.length}개 · 공개 {apps.length - hiddenApps.length}개
              </p>
            </div>
            <div className="w-full sm:w-72">
              <input
                type="search"
                value={renameSearch}
                onChange={(e) => setRenameSearch(e.target.value)}
                placeholder="이름, ID, 슬러그 검색"
                className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-purple-300 focus:ring-2 focus:ring-purple-400/40"
              />
            </div>
          </div>

          <div className="mt-4 max-h-[420px] overflow-y-auto divide-y divide-white/10">
            {filteredApps.map((app) => {
              const isEditing = editingAppId === app.id;
              const isToggling = togglingAppId === app.id;
              return (
                <div
                  key={app.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-1 items-center gap-3 sm:gap-4">
                    {/* 🆕 토글 스위치 */}
                    <button
                      onClick={() => toggleHidden(app.id)}
                      disabled={isToggling}
                      className={`
                        relative inline-flex h-5 w-10 items-center rounded-2xl transition-all duration-300 flex-shrink-0 touch-manipulation backdrop-blur-sm
                        ${app.hidden
                          ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/50'
                          : 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50'}
                        ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95 hover:scale-105'}
                        ring-2 ring-white/20
                      `}
                      title={app.hidden ? 'Hidden (클릭하면 공개)' : '공개 (클릭하면 숨김)'}
                    >
                      <span
                        className={`
                          inline-block h-3.5 w-3.5 transform rounded-xl bg-white transition-all duration-300 shadow-lg
                          ${app.hidden ? 'translate-x-5.5' : 'translate-x-0.5'}
                        `}
                      />
                    </button>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {isEditing ? renameValue : app.name}{' '}
                        {app.hidden ? (
                          <span className="ml-2 rounded-full bg-purple-500/40 px-2 py-0.5 text-[11px] font-semibold text-purple-100">
                            HIDDEN
                          </span>
                        ) : (
                          <span className="ml-2 rounded-full bg-green-500/40 px-2 py-0.5 text-[11px] font-semibold text-green-100">
                            PUBLIC
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-purple-100/60">ID: {app.id} · Slug: {app.slug}</p>
                    </div>
                  </div>

                  <div className="sm:w-64">
                    {isEditing ? (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              submitRename(app.id);
                            }
                          }}
                          className="w-full rounded-lg border border-purple-400/40 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-colors"
                          placeholder="새 이름 입력"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => submitRename(app.id)}
                            disabled={renaming}
                            className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-3 min-h-[44px] text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
                          >
                            {renaming ? '저장 중...' : '저장'}
                          </button>
                          <button
                            type="button"
                            onClick={cancelRename}
                            disabled={renaming}
                            className="flex-1 rounded-lg border border-white/20 px-3 py-3 min-h-[44px] text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startRename(app)}
                        className="w-full rounded-lg border border-purple-400/50 px-3 py-3 min-h-[44px] text-sm font-semibold text-purple-100 transition-all hover:bg-purple-500/20 active:scale-95 touch-manipulation"
                      >
                        ✏️ 이름 변경
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredApps.length === 0 && (
              <div className="py-8 text-center text-sm text-purple-100/60">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Admin Tools */}
        <div className="mb-12 rounded-2xl border-2 border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-lg">
          <h2 className="mb-6 text-center text-2xl sm:text-3xl font-bold text-white">🛠️ 관리 도구</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/secret/contacts"
              className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-green-500/50 active:scale-95 touch-manipulation"
            >
              📧 문의 관리
            </Link>
            <Link
              href="/secret/analytics"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 touch-manipulation"
            >
              📊 방문자 통계
            </Link>
            <Link
              href="/secret/image-manager"
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 touch-manipulation"
            >
              🖼️ 이미지 관리
            </Link>
            <Link
              href="/secret/dev-glossary"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-orange-500/50 active:scale-95 touch-manipulation"
            >
              📖 개발자 용어 사전
            </Link>
            <Link
              href="/secret/guestbook"
              className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-amber-500/50 active:scale-95 touch-manipulation"
            >
              📝 방명록 관리
            </Link>
            <Link
              href="/secret/gold-price-manager"
              className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-yellow-500/50 active:scale-95 touch-manipulation"
            >
              🏅 금 시세 관리
            </Link>
            <Link
              href="/secret/press-kit"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-sky-500/50 active:scale-95 touch-manipulation"
            >
              🗞️ 프레스 키트
            </Link>
            <Link
              href="/secret/dev-tools"
              className="rounded-xl bg-gradient-to-r from-slate-500 to-gray-700 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-slate-500/50 active:scale-95 touch-manipulation"
            >
              🧰 개발 도구 모음
            </Link>
            <Link
              href="/secret/setup-database"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95 touch-manipulation"
            >
              🔧 데이터베이스 설정
            </Link>
            <Link
              href="/secret/error-monitor"
              className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 min-h-[56px] flex items-center justify-center text-center text-sm sm:text-base font-bold text-white transition-all hover:shadow-lg hover:shadow-red-500/50 active:scale-95 touch-manipulation"
            >
              🚨 에러 모니터링
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-white/40">업데이트된 비밀 앱은 실시간으로 반영됩니다.</div>
      </div>
    </div>
  );
}
