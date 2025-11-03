"use client";

import { useState } from "react";
import Link from "next/link";

interface SetupResult {
  table: string;
  success: boolean;
  message: string;
  error?: string;
}

export default function SetupDatabasePage() {
  const [results, setResults] = useState<SetupResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const setupAllTables = async () => {
    setIsLoading(true);
    setResults([]);

    const tables = [
      {
        name: "error_logs",
        endpoint: "/api/setup-error-logs",
      },
      {
        name: "secret_visitors",
        sql: `
-- Create secret_visitors table
CREATE TABLE IF NOT EXISTS secret_visitors (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET NOT NULL,
  user_agent TEXT,
  browser VARCHAR(100),
  os VARCHAR(100),
  device_type VARCHAR(50),
  page_url TEXT,
  referrer TEXT,
  UNIQUE(ip_address, date_trunc('day', created_at))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_secret_visitors_created_at ON secret_visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_secret_visitors_ip ON secret_visitors(ip_address);

-- Enable RLS
ALTER TABLE secret_visitors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow visitor logging" ON secret_visitors;
DROP POLICY IF EXISTS "Allow reads for authenticated users" ON secret_visitors;

-- Create policies
CREATE POLICY "Allow visitor logging"
  ON secret_visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow reads for authenticated users"
  ON secret_visitors
  FOR SELECT
  TO authenticated
  USING (true);
        `,
      },
      {
        name: "secret_visitor_stats",
        sql: `
-- Create view for visitor statistics
DROP VIEW IF EXISTS secret_visitor_stats;

CREATE VIEW secret_visitor_stats AS
SELECT
  date_trunc('day', created_at) as visit_date,
  COUNT(*) as visitor_count,
  COUNT(DISTINCT ip_address) as unique_visitors,
  COUNT(*) FILTER (WHERE device_type = 'Mobile') as mobile_visitors,
  COUNT(*) FILTER (WHERE device_type = 'Desktop') as desktop_visitors,
  COUNT(*) FILTER (WHERE device_type = 'Tablet') as tablet_visitors
FROM secret_visitors
GROUP BY date_trunc('day', created_at)
ORDER BY visit_date DESC;
        `,
      },
    ];

    const newResults: SetupResult[] = [];

    for (const table of tables) {
      try {
        if (table.endpoint) {
          // Use existing API endpoint
          const response = await fetch(table.endpoint, {
            method: "POST",
          });

          const data = await response.json();

          newResults.push({
            table: table.name,
            success: data.success,
            message: data.message,
            error: data.error,
          });
        } else if (table.sql) {
          // Execute SQL via setup API
          const response = await fetch("/api/setup-database", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tableName: table.name,
              sql: table.sql,
            }),
          });

          const data = await response.json();

          newResults.push({
            table: table.name,
            success: data.success,
            message: data.message,
            error: data.error,
          });
        }
      } catch (error) {
        newResults.push({
          table: table.name,
          success: false,
          message: "Failed to execute setup",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      setResults([...newResults]);
    }

    setIsLoading(false);
  };

  const allSuccess = results.length > 0 && results.every((r) => r.success);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            🔧 데이터베이스 설정
          </h1>
          <p className="text-gray-300">
            필요한 Supabase 테이블을 자동으로 생성합니다
          </p>
        </div>

        {/* Setup Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={setupAllTables}
            disabled={isLoading}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50"
          >
            {isLoading ? "설정 중..." : "🚀 데이터베이스 설정 시작"}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`rounded-xl border-2 p-6 ${
                  result.success
                    ? "border-green-500 bg-green-500/10"
                    : "border-red-500 bg-red-500/10"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {result.success ? "✅" : "❌"} {result.table}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      result.success
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {result.success ? "성공" : "실패"}
                  </span>
                </div>

                <p className="text-gray-300">{result.message}</p>

                {result.error && (
                  <div className="mt-2 rounded-lg bg-black/30 p-3">
                    <p className="font-mono text-sm text-red-400">
                      {result.error}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Success Actions */}
        {allSuccess && (
          <div className="mt-8 rounded-xl border-2 border-green-500 bg-green-500/10 p-6 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">
              🎉 모든 설정이 완료되었습니다!
            </h2>
            <div className="flex justify-center gap-4">
              <Link
                href="/secret"
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold text-white transition-all hover:shadow-lg"
              >
                ← 홈으로
              </Link>
              <Link
                href="/secret/error-monitor"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-bold text-white transition-all hover:shadow-lg"
              >
                에러 모니터링 →
              </Link>
            </div>
          </div>
        )}

        {/* Manual Setup Instructions */}
        <div className="mt-8 rounded-xl border-2 border-yellow-500 bg-yellow-500/10 p-6">
          <h3 className="mb-3 text-xl font-bold text-yellow-400">
            ⚠️ 자동 설정이 실패하는 경우
          </h3>
          <p className="mb-3 text-gray-300">
            Supabase SQL Editor에서 수동으로 실행해주세요:
          </p>
          <a
            href="https://supabase.com/dashboard/project/vfoecqunkmqxktgywkdp/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2 font-bold text-white transition-all hover:shadow-lg"
          >
            🔗 Supabase SQL Editor 열기
          </a>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/secret"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Secret Vault로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
