"use client";

import Link from "next/link";

const quickLinks = [
  {
    title: "앱 데이터 동기화",
    description: "로컬 JSON을 Supabase apps 테이블과 동기화합니다.",
    command: "npm run sanitize:no-ads && node scripts/sync-new-apps-to-supabase.ts",
    docs: "/docs/apps-data-workflow"
  },
  {
    title: "이미지 버킷 정리",
    description: "누락된 썸네일을 찾아 Supabase Storage에 복구합니다.",
    command: "node scripts/update-warning-lights.js",
    docs: "/docs/media-pipeline"
  },
  {
    title: "실시간 헬스 체크",
    description: "Realtime 연결 상태와 네트워크 코스트를 점검합니다.",
    command: "npm run dev -- --turbo --inspect",
    docs: "/REALTIME_SETUP.md"
  }
];

const supabaseSnippets = [
  {
    label: "즐겨찾기 초기화",
    sql: [
      "UPDATE apps",
      "SET favorite_count = 0, updated_at = NOW()",
      "WHERE favorite_count IS NULL OR favorite_count < 0;"
    ].join("\n")
  },
  {
    label: "하트 카운트 리셋",
    sql: [
      "UPDATE guestbook_hearts",
      "SET count = 0, updated_at = NOW()",
      "WHERE id = 1;"
    ].join("\n")
  },
  {
    label: "히든 앱 점검",
    sql: [
      "SELECT slug, name, hidden",
      "FROM apps",
      "WHERE hidden = true",
      "ORDER BY updated_at DESC;"
    ].join("\n")
  }
];

const checklist = [
  "배포 전 `npm run lint` 실행",
  "`apps.json` 변경 시 Supabase apps 테이블과 slug 불일치 확인",
  "`NEXT_PUBLIC_SUPABASE_*` 환경변수 확인 (로컬/프리뷰/프로덕션)",
  "Secret 페이지 내 실시간 구독 채널 연결 상태 확인",
  "디자인 리소스 업데이트 시 Press Kit 갱신일 수정"
];

const monitoring = [
  {
    name: "Vercel Deployments",
    href: "https://vercel.com/bion/dashboard",
    status: "Live",
    description: "빌드 상태와 Edge 함수 헬스 체크"
  },
  {
    name: "Supabase Project",
    href: "https://supabase.com/dashboard/project",
    status: "Operational",
    description: "DB, Storage, Realtime 메트릭 모니터링"
  },
  {
    name: "Analytics Dashboard",
    href: "/secret/analytics",
    status: "Internal",
    description: "BION 방문자 통계"
  }
];

export default function DevToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black px-4 py-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <Link
              href="/secret"
              className="inline-flex items-center text-purple-300 transition-colors hover:text-purple-100"
            >
              ← Secret Vault로 돌아가기
            </Link>
            <div>
              <h1 className="text-4xl font-extrabold text-white md:text-5xl">
                🧰 개발 도구 모음
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-gray-200">
                운영자가 자주 사용하는 스크립트, Supabase 쿼리, 배포 전 점검 리스트를 모았습니다.
                빠른 유지보수를 위한 내부용 허브입니다.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-gray-200 backdrop-blur-lg">
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg">⚙️</span>
              <span>Branch: main</span>
            </div>
            <p className="mt-2 text-gray-300">
              최근 점검일: <span className="font-semibold text-white">2025-02-07</span>
            </p>
          </div>
        </div>

        {/* Quick Commands */}
        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">빠른 실행 명령어</h2>
            <span className="rounded-full bg-purple-500/30 px-4 py-1 text-xs font-semibold text-purple-100">
              로컬 터미널 기준
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((link) => (
              <div key={link.title} className="flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 space-y-2">
                  <h3 className="text-lg font-semibold text-white">{link.title}</h3>
                  <p className="text-sm text-gray-300">{link.description}</p>
                </div>
                <pre className="flex-1 rounded-lg bg-black/60 p-3 text-xs text-emerald-200 shadow-inner">
                  <code>{link.command}</code>
                </pre>
                <div className="mt-4 flex items-center justify-between text-xs text-purple-200">
                  <span>문서 참고</span>
                  <a
                    href={link.docs}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-purple-100 underline-offset-4 hover:underline"
                  >
                    open
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supabase Snippets */}
        <section className="grid gap-6 md:grid-cols-3">
          {supabaseSnippets.map((snippet) => (
            <div
              key={snippet.label}
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-lg"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{snippet.label}</h3>
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Supabase SQL
                </span>
              </div>
              <pre className="rounded-lg bg-black/60 p-4 text-xs text-emerald-100 shadow-inner">
                <code>{snippet.sql}</code>
              </pre>
            </div>
          ))}
        </section>

        {/* Checklist */}
        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">릴리즈 체크리스트</h2>
            <span className="rounded-full bg-sky-500/30 px-4 py-1 text-xs font-semibold text-sky-100">
              Deploy 전 확인
            </span>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-gray-200">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="mt-1 text-lg text-sky-300">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Monitoring */}
        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">모니터링 허브</h2>
            <span className="rounded-full bg-amber-500/30 px-4 py-1 text-xs font-semibold text-amber-100">
              실시간 확인
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {monitoring.map((target) => (
              <a
                key={target.name}
                href={target.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/40"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{target.name}</h3>
                  <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-100">
                    {target.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-300">{target.description}</p>
                <div className="mt-4 text-xs font-semibold text-purple-200">새 창에서 열기 →</div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
