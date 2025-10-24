"use client";

import Link from "next/link";

export default function LimitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full rounded-3xl border border-slate-700/60 bg-slate-900/70 p-10 shadow-2xl backdrop-blur">
        <div className="text-center">
          <div className="text-6xl mb-4">🕑</div>
          <h1 className="text-3xl font-bold mb-4">오늘의 실험은 이미 완료했어요</h1>
          <p className="text-slate-300 leading-relaxed mb-6">
            한 IP당 하루 한 번만 룰렛 도전을 진행할 수 있습니다.<br />
            내일 다시 찾아오시면 새로운 넌센스 실험실이 열릴 거예요!
          </p>
          <Link
            href="/apps/nonsense-escape"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-6 py-3 font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:scale-105"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
