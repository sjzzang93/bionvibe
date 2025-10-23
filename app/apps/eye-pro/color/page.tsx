'use client';
import useColor from './useColor';
import Board from './Board';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';

export default function ColorPage() {
  const { current, idx, total, correct, submit } = useColor();

  return (
    <PremiumLayout theme="purple" showStars={true}>
      <main className="max-w-md mx-auto px-3 pt-6 pb-20">
        <h2 className="text-2xl font-bold mb-1 text-white">색각 검사 (Ishihara)</h2>
        <p className="text-sm text-white/80">
          정식 플레이트 이미지를 <code>/public/plates/ishihara/</code>에 추가
          후 테스트하세요.
        </p>
        {current ? (
          <>
            <div className="text-sm text-white/80 mt-2">
              문항 {idx + 1}/{total} · 정답 {correct}
            </div>
            <PremiumCard gradient hover className="mt-2">
              <Board
                src={current.src}
                expected={current.answer}
                onSubmit={submit}
              />
            </PremiumCard>
          </>
        ) : (
          <div className="py-10 text-center text-white/60">
            문항을 준비 중…
          </div>
        )}
      </main>
    </PremiumLayout>
  );
}

