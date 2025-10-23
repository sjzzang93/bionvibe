import Link from 'next/link';
import MobileGuard from './components/MobileGuard';
import ZoomGuard from './components/ZoomGuard';
import ResultList from './components/ResultList';

export default function EyeProHub() {
  return (
    <main className="max-w-md mx-auto">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-3xl font-bold mb-2">👁️ 정밀 시력 테스트</h1>
        <p className="text-base text-neutral-600">
          시력 · 색각 · 노안을 분리 검사 (모바일 최적 · PC 100% 배율)
        </p>
      </header>

      <MobileGuard />
      <ZoomGuard />

      <section className="px-3 py-4 space-y-3">
        <Link
          href="/apps/eye-pro/acuity"
          className="block rounded-xl border-2 border-neutral-200 bg-white p-5 hover:border-blue-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👁️</span>
            <div className="font-semibold text-lg">시력 검사 (정밀 E 차트)</div>
          </div>
          <div className="text-sm text-neutral-600 pl-11">
            보정 후 40cm 권장
          </div>
        </Link>

        <Link
          href="/apps/eye-pro/color"
          className="block rounded-xl border-2 border-neutral-200 bg-white p-5 hover:border-purple-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎨</span>
            <div className="font-semibold text-lg">색각 검사 (Ishihara)</div>
          </div>
          <div className="text-sm text-neutral-600 pl-11">
            정식 플레이트 이미지 사용
          </div>
        </Link>

        <Link
          href="/apps/eye-pro/presbyopia"
          className="block rounded-xl border-2 border-neutral-200 bg-white p-5 hover:border-green-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📖</span>
            <div className="font-semibold text-lg">노안 검사 (근거리)</div>
          </div>
          <div className="text-sm text-neutral-600 pl-11">
            가독 최적 폰트크기 탐색
          </div>
        </Link>
      </section>

      <ResultList />
    </main>
  );
}

