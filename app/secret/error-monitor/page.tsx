"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ErrorLog {
  id: number;
  created_at: string;
  error_message: string;
  error_stack?: string;
  error_type: string;
  app_id?: string;
  app_url?: string;
  page_url: string;
  user_agent: string;
  ip_address: string;
  browser: string;
  os: string;
  device_type: string;
  occurrence_count: number;
  last_occurred_at: string;
}

interface ErrorStats {
  total: number;
  byType: { [key: string]: number };
  byApp: { [key: string]: number };
  byBrowser: { [key: string]: number };
  byOS: { [key: string]: number };
}

export default function ErrorMonitorPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [stats, setStats] = useState<ErrorStats>({
    total: 0,
    byType: {},
    byApp: {},
    byBrowser: {},
    byOS: {},
  });

  // Filters
  const [filterAppId, setFilterAppId] = useState("");
  const [filterErrorType, setFilterErrorType] = useState("");
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    fetchErrors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAppId, filterErrorType, limit]);

  const fetchErrors = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("limit", String(limit));
      if (filterAppId) params.append("appId", filterAppId);
      if (filterErrorType) params.append("errorType", filterErrorType);

      const response = await fetch(`/api/error-log?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setErrors(data.data || []);
        calculateStats(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch errors:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (errorLogs: ErrorLog[]) => {
    const newStats: ErrorStats = {
      total: errorLogs.length,
      byType: {},
      byApp: {},
      byBrowser: {},
      byOS: {},
    };

    errorLogs.forEach((error) => {
      // Count by error type
      newStats.byType[error.error_type] =
        (newStats.byType[error.error_type] || 0) + error.occurrence_count;

      // Count by app
      const appId = error.app_id || "Unknown";
      newStats.byApp[appId] =
        (newStats.byApp[appId] || 0) + error.occurrence_count;

      // Count by browser
      newStats.byBrowser[error.browser] =
        (newStats.byBrowser[error.browser] || 0) + error.occurrence_count;

      // Count by OS
      newStats.byOS[error.os] = (newStats.byOS[error.os] || 0) + error.occurrence_count;
    });

    setStats(newStats);
  };

  const clearOldErrors = async (daysOld: number) => {
    if (!confirm(`${daysOld}일 이상 된 에러 로그를 모두 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/error-log?daysOld=${daysOld}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchErrors();
      } else {
        alert("삭제 실패: " + data.message);
      }
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error("Failed to clear errors:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR");
  };

  const getErrorTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Error: "bg-red-500",
      TypeError: "bg-orange-500",
      ReferenceError: "bg-yellow-500",
      SyntaxError: "bg-purple-500",
      UnhandledRejection: "bg-pink-500",
      ComponentError: "bg-blue-500",
      Unknown: "bg-gray-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const uniqueApps = Array.from(new Set(errors.map((e) => e.app_id).filter(Boolean)));
  const uniqueErrorTypes = Array.from(new Set(errors.map((e) => e.error_type)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold text-white">🚨 에러 모니터링</h1>
            <p className="text-gray-300">실시간 에러 로그 확인 및 분석</p>
          </div>
          <Link
            href="/secret"
            className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white transition-all hover:bg-white/20"
          >
            ← 돌아가기
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
            <div className="mb-2 text-3xl">📊</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-300">총 에러 로그</div>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
            <div className="mb-2 text-3xl">🔥</div>
            <div className="text-3xl font-bold text-white">
              {Object.keys(stats.byType).length}
            </div>
            <div className="text-sm text-gray-300">에러 유형</div>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
            <div className="mb-2 text-3xl">📱</div>
            <div className="text-3xl font-bold text-white">
              {Object.keys(stats.byApp).length}
            </div>
            <div className="text-sm text-gray-300">영향받은 앱</div>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
            <div className="mb-2 text-3xl">🌐</div>
            <div className="text-3xl font-bold text-white">
              {Object.keys(stats.byBrowser).length}
            </div>
            <div className="text-sm text-gray-300">브라우저 종류</div>
          </div>
        </div>

        {/* Statistics Details */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* By Error Type */}
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
            <h3 className="mb-4 text-xl font-bold text-white">에러 유형별</h3>
            <div className="space-y-2">
              {Object.entries(stats.byType)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-300">
                      <span
                        className={`h-2 w-2 rounded-full ${getErrorTypeColor(type)}`}
                      />
                      {type}
                    </span>
                    <span className="font-bold text-white">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* By App */}
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
            <h3 className="mb-4 text-xl font-bold text-white">앱별</h3>
            <div className="space-y-2">
              {Object.entries(stats.byApp)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([app, count]) => (
                  <div key={app} className="flex items-center justify-between">
                    <span className="truncate text-sm text-gray-300">{app}</span>
                    <span className="font-bold text-white">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* By Browser */}
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
            <h3 className="mb-4 text-xl font-bold text-white">브라우저별</h3>
            <div className="space-y-2">
              {Object.entries(stats.byBrowser)
                .sort((a, b) => b[1] - a[1])
                .map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{browser}</span>
                    <span className="font-bold text-white">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
          <h3 className="mb-4 text-xl font-bold text-white">🔍 필터</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">앱 ID</label>
              <select
                value={filterAppId}
                onChange={(e) => setFilterAppId(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white outline-none focus:border-red-400"
              >
                <option value="">전체</option>
                {uniqueApps.map((app) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">에러 유형</label>
              <select
                value={filterErrorType}
                onChange={(e) => setFilterErrorType(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white outline-none focus:border-red-400"
              >
                <option value="">전체</option>
                {uniqueErrorTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">개수 제한</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white outline-none focus:border-red-400"
              >
                <option value="50">50개</option>
                <option value="100">100개</option>
                <option value="200">200개</option>
                <option value="500">500개</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">관리</label>
              <button
                onClick={() => clearOldErrors(7)}
                className="w-full rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                7일 이상 삭제
              </button>
            </div>
          </div>
        </div>

        {/* Error List */}
        <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">📋 에러 로그</h3>
            <button
              onClick={fetchErrors}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              🔄 새로고침
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-5xl animate-spin">⚙️</div>
              <p className="text-gray-300">로딩 중...</p>
            </div>
          ) : errors.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">✅</div>
              <h3 className="mb-2 text-2xl font-bold text-white">
                에러가 없습니다!
              </h3>
              <p className="text-gray-300">모든 시스템이 정상 작동 중입니다.</p>
            </div>
          ) : (
            <div className="max-h-[600px] space-y-3 overflow-y-auto">
              {errors.map((error) => (
                <div
                  key={error.id}
                  onClick={() => setSelectedError(error)}
                  className="cursor-pointer rounded-lg border border-white/10 bg-black/20 p-4 transition hover:border-red-400 hover:bg-black/40"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-bold text-white ${getErrorTypeColor(
                            error.error_type
                          )}`}
                        >
                          {error.error_type}
                        </span>
                        {error.app_id && (
                          <span className="rounded bg-purple-500/30 px-2 py-0.5 text-xs font-semibold text-purple-200">
                            {error.app_id}
                          </span>
                        )}
                        {error.occurrence_count > 1 && (
                          <span className="rounded bg-orange-500/30 px-2 py-0.5 text-xs font-semibold text-orange-200">
                            ×{error.occurrence_count}
                          </span>
                        )}
                      </div>
                      <p className="mb-1 font-mono text-sm text-white">
                        {error.error_message}
                      </p>
                      <div className="text-xs text-gray-400">
                        {error.browser} · {error.os} · {error.device_type}
                      </div>
                    </div>
                    <div className="ml-4 text-right text-xs text-gray-400">
                      <div>{formatDate(error.created_at)}</div>
                      {error.occurrence_count > 1 && (
                        <div className="mt-1 text-orange-300">
                          최근: {formatDate(error.last_occurred_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Detail Modal */}
        {selectedError && (
          <div
            onClick={() => setSelectedError(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/20 bg-gray-900 p-8"
            >
              <div className="mb-6 flex items-start justify-between">
                <h2 className="text-2xl font-bold text-white">에러 상세 정보</h2>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-3xl text-white hover:text-red-400"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-400">
                    에러 타입
                  </h3>
                  <span
                    className={`rounded px-3 py-1 text-sm font-bold text-white ${getErrorTypeColor(
                      selectedError.error_type
                    )}`}
                  >
                    {selectedError.error_type}
                  </span>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-400">
                    에러 메시지
                  </h3>
                  <p className="rounded-lg bg-black/40 p-3 font-mono text-sm text-white">
                    {selectedError.error_message}
                  </p>
                </div>

                {selectedError.error_stack && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      스택 트레이스
                    </h3>
                    <pre className="max-h-60 overflow-auto rounded-lg bg-black/40 p-3 font-mono text-xs text-gray-300">
                      {selectedError.error_stack}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      페이지 URL
                    </h3>
                    <p className="truncate rounded-lg bg-black/40 p-3 text-sm text-white">
                      {selectedError.page_url}
                    </p>
                  </div>

                  {selectedError.app_url && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-400">
                        앱 URL
                      </h3>
                      <p className="truncate rounded-lg bg-black/40 p-3 text-sm text-white">
                        {selectedError.app_url}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      브라우저
                    </h3>
                    <p className="rounded-lg bg-black/40 p-3 text-sm text-white">
                      {selectedError.browser}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">OS</h3>
                    <p className="rounded-lg bg-black/40 p-3 text-sm text-white">
                      {selectedError.os}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      기기 유형
                    </h3>
                    <p className="rounded-lg bg-black/40 p-3 text-sm text-white">
                      {selectedError.device_type}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-400">
                    User Agent
                  </h3>
                  <p className="rounded-lg bg-black/40 p-3 font-mono text-xs text-gray-300">
                    {selectedError.user_agent}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      IP 주소
                    </h3>
                    <p className="rounded-lg bg-black/40 p-3 text-sm text-white">
                      {selectedError.ip_address}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      발생 횟수
                    </h3>
                    <p className="rounded-lg bg-black/40 p-3 text-sm text-white">
                      {selectedError.occurrence_count}회
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-400">
                    발생 시각
                  </h3>
                  <p className="rounded-lg bg-black/40 p-3 text-sm text-white">
                    최초: {formatDate(selectedError.created_at)}
                    {selectedError.occurrence_count > 1 && (
                      <>
                        <br />
                        최근: {formatDate(selectedError.last_occurred_at)}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
