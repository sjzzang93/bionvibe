"use client";

import Link from "next/link";

const assetGroups = [
  {
    title: "로고 패키지",
    description: "PNG · SVG · 투명 배경 버전이 모두 포함된 기본 로고 세트입니다.",
    files: [
      { label: "메인 로고 (PNG)", href: "/logo.png" },
      { label: "하트 로고 (PNG)", href: "/heart-logo.png" },
      { label: "애니메이션 로고 (MP4)", href: "/logo-dark.mp4" }
    ]
  },
  {
    title: "색상 팔레트",
    description: "BION에서 사용하는 핵심 컬러를 기반으로 디자인 가이드를 구성했습니다.",
    bullets: [
      { name: "Sunset Red", code: "#F43F5E" },
      { name: "Aurora Pink", code: "#FB7185" },
      { name: "Night Sky", code: "#111827" },
      { name: "Cloud White", code: "#F9FAFB" }
    ]
  },
  {
    title: "타이포그래피",
    description: "웹 전용 폰트 조합입니다. 포스터, 썸네일 제작 시 이 조합을 권장합니다.",
    bullets: [
      { name: "Headlines", code: "Pretendard Bold" },
      { name: "Sub Copy", code: "Pretendard SemiBold" },
      { name: "Body Text", code: "Pretendard Regular" }
    ]
  }
];

const messaging = [
  {
    title: "한 줄 소개",
    copy: "BION은 일상의 작은 고민을 단번에 해결하는 웹앱 실험실입니다."
  },
  {
    title: "확장 슬로건",
    copy: "Creating light for everyday life — 더 빠르게, 더 가볍게, 더 따뜻하게."
  },
  {
    title: "핵심 메시지",
    copy: "• 광고 없이 바로 쓰는 150+개의 생활형 웹 도구\n• 건강, 금융, 라이프스타일, 엔터테인먼트까지 한 번에\n• AI 기반 실험 기능과 꾸준한 업데이트"
  }
];

const usageRules = [
  {
    title: "로고 여백",
    detail:
      "로고 주변에는 로고 높이의 25% 이상을 비워 주세요. 배경색은 흰색 또는 아주 어두운 색(#0F172A) 사용을 권장합니다."
  },
  {
    title: "색상 변형 금지",
    detail:
      "공식 색상 팔레트 외 컬러로 로고를 임의 변형하지 말아 주세요. 단색 적용이 필요한 경우 흰색 또는 #111827 컬러만 허용합니다."
  },
  {
    title: "심볼 단독 사용",
    detail:
      "하트 심볼 단독 사용은 썸네일, 앱 아이콘 등 제한된 공간에서만 이용해 주세요. 협업 자료에는 워드마크와 함께 사용을 권장합니다."
  }
];

export default function PressKitPage() {
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
                🎨 BION Press Kit
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-gray-200">
                브랜드 소개 자료, 로고 파일, 가이드라인을 한 번에 모았습니다. 메디아 자료 제작이나
                협업 프로모션에 자유롭게 활용하세요.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-gray-200 backdrop-blur-lg">
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg">🗓️</span>
              <span>업데이트: 2025-02-07</span>
            </div>
            <p className="mt-2 text-gray-300">
              새로운 자료가 필요하면 언제든지 <span className="font-semibold text-white">press@bionvibe.com</span> 으로 요청해 주세요.
            </p>
          </div>
        </div>

        {/* Asset Cards */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assetGroups.map((group) => (
            <div
              key={group.title}
              className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/5 p-6 shadow-xl shadow-purple-900/20 backdrop-blur-lg transition-transform hover:-translate-y-1"
            >
              <div>
                <h2 className="text-2xl font-bold text-white">{group.title}</h2>
                <p className="mt-2 text-sm text-gray-300">{group.description}</p>
              </div>

              {"files" in group ? (
                <div className="mt-5 space-y-3">
                  {group.files.map((file) => (
                    <a
                      key={file.label}
                      href={file.href}
                      download
                      className="flex items-center justify-between rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-100 transition hover:border-purple-300 hover:bg-purple-500/20"
                    >
                      <span>{file.label}</span>
                      <span className="text-xs text-purple-200">Download</span>
                    </a>
                  ))}
                </div>
              ) : (
                <ul className="mt-5 space-y-3 text-sm text-gray-200">
                  {group.bullets?.map((item) => (
                    <li
                      key={item.code}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="font-mono text-xs text-gray-300">{item.code}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        {/* Messaging */}
        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">브랜드 메시지</h2>
            <span className="rounded-full bg-purple-500/30 px-4 py-1 text-xs font-semibold text-purple-100">
              대외 커뮤니케이션 용
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {messaging.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-gray-200 shadow-inner"
              >
                <h3 className="mb-3 text-lg font-semibold text-white">{card.title}</h3>
                <p className="whitespace-pre-line leading-relaxed text-gray-200">{card.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Rules */}
        <section className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">브랜드 사용 가이드</h2>
            <span className="rounded-full bg-rose-500/40 px-4 py-1 text-xs font-semibold text-white">
              꼭 지켜주세요
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {usageRules.map((rule) => (
              <div key={rule.title} className="rounded-xl border border-white/20 bg-white/10 p-5 text-sm">
                <h3 className="mb-3 text-base font-semibold text-white">{rule.title}</h3>
                <p className="text-gray-200">{rule.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-lg text-gray-200">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">추가 요청이 필요하신가요?</h2>
              <p className="mt-2 max-w-xl text-sm text-gray-300">
                고해상도 이미지, 작가 인터뷰, 로드맵 자료 등 추가 에셋을 준비해 드릴 수 있어요.
                필요 항목을 정리해 메일로 보내주세요.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm font-semibold text-white">
              <a
                href="mailto:press@bionvibe.com"
                className="rounded-xl bg-purple-500/80 px-6 py-3 text-center transition hover:bg-purple-500"
              >
                press@bionvibe.com
              </a>
              <a
                href="https://bionvibe.com/contact"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/30 px-6 py-3 text-center transition hover:border-white/60"
              >
                문의 폼 바로가기 →
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
