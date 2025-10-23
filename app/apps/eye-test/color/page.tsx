'use client';
import useColorTest from './useColorTest';
import IshiharaBoard from './IshiharaBoard';
import Disclaimer from '../components/Disclaimer';

export default function ColorPage() {
  const { current, idx, total, correct, submit } = useColorTest();

  return (
    <main className="max-w-md mx-auto px-3 pt-4 pb-20">
      <h2 className="text-2xl font-bold mb-2">색각 검사 (Ishihara)</h2>
      <p className="text-sm text-neutral-600 mb-4">
        정면에서 화면을 보고, 주변 조명이 너무 어둡거나 과도하게 밝지 않게
        조절하세요.
      </p>

      {current ? (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="text-sm text-green-800 font-medium mb-1">
              문항 {idx + 1}/{total}
            </div>
            <div className="text-lg font-bold text-green-900">
              정답 수: {correct}
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-neutral-200 p-4 mb-4">
            <p className="text-sm text-neutral-600 text-center mb-4">
              원 안에 보이는 숫자를 입력하세요
            </p>
            <IshiharaBoard plate={current} onSubmit={submit} />
          </div>
        </>
      ) : (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-neutral-500">문항을 준비 중…</p>
        </div>
      )}

      <div className="mt-6">
        <Disclaimer />
      </div>
    </main>
  );
}

