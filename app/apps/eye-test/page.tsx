import Link from 'next/link';
import Banner from './components/Banner';
import MobileGuard from './components/MobileGuard';
import ResultList from './components/ResultList';
import Disclaimer from './components/Disclaimer';

export default function EyeTestHub() {
  return (
    <main className="max-w-md mx-auto pb-20">
      <Banner position="top" />
      
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-3xl font-bold mb-2">👁️ 모바일 시력 테스트</h1>
        <p className="text-base text-neutral-600">
          시력, 색각, 노안을 각각 정확도 높게 검사해요.
        </p>
      </header>

      <MobileGuard />

      <section className="px-3 py-4 space-y-3">
        <Link
          href="/apps/eye-test/acuity"
          className="block rounded-xl border-2 border-neutral-200 bg-white p-5 hover:border-black hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👀</span>
            <div className="font-semibold text-lg">시력 검사 (E 차트)</div>
          </div>
          <div className="text-sm text-neutral-600 pl-11">
            보정 후 40cm 거리 권장
          </div>
        </Link>

        <Link
          href="/apps/eye-test/color"
          className="block rounded-xl border-2 border-neutral-200 bg-white p-5 hover:border-black hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎨</span>
            <div className="font-semibold text-lg">색각 검사 (Ishihara)</div>
          </div>
          <div className="text-sm text-neutral-600 pl-11">
            무작위 14판 · 숫자 인식
          </div>
        </Link>

        <Link
          href="/apps/eye-test/presbyopia"
          className="block rounded-xl border-2 border-neutral-200 bg-white p-5 hover:border-black hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📖</span>
            <div className="font-semibold text-lg">노안 검사 (근거리)</div>
          </div>
          <div className="text-sm text-neutral-600 pl-11">
            폰트크기/거리 기준 판정
          </div>
        </Link>
      </section>

      <ResultList />

      <div className="px-3 py-4 space-y-2">
        <Disclaimer />
        <p className="text-[11px] text-neutral-400 text-center">
          ※ 쿠팡 파트너스 참여로 일정 수수료를 받을 수 있어요.
        </p>
      </div>

      <Banner position="bottom" />
    </main>
  );
}
