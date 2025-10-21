'use client';

import { useState } from 'react';
import AppFooter from '@/app/components/AppFooter';
import dynamic from 'next/dynamic';


interface DreamResult {
  keyword: string;
  meaning: string;
  luckyNumber: number[];
  advice: string;
  category: string;
}

const dreamDatabase: Record<string, DreamResult> = {
  '돈': { keyword: '돈', meaning: '재물운이 상승하고 있습니다. 새로운 기회가 찾아올 수 있습니다.', luckyNumber: [7, 14, 21, 28, 35, 42], advice: '투자나 재테크에 관심을 가져보세요.', category: '재물' },
  '뱀': { keyword: '뱀', meaning: '지혜와 변화를 상징합니다. 인생의 전환점이 될 수 있습니다.', luckyNumber: [3, 9, 15, 21, 27, 33], advice: '새로운 도전을 두려워하지 마세요.', category: '동물' },
  '호랑이': { keyword: '호랑이', meaning: '권력과 성공을 의미합니다. 승진이나 승리의 기회가 있습니다.', luckyNumber: [1, 10, 19, 28, 37, 46], advice: '자신감을 가지고 앞으로 나아가세요.', category: '동물' },
  '물': { keyword: '물', meaning: '재물과 감정의 흐름을 나타냅니다. 깨끗한 물은 좋은 징조입니다.', luckyNumber: [2, 8, 16, 24, 32, 40], advice: '마음을 정화하고 긍정적으로 생각하세요.', category: '자연' },
  '불': { keyword: '불', meaning: '정열과 에너지를 상징합니다. 큰 성취를 이룰 수 있습니다.', luckyNumber: [5, 11, 17, 23, 29, 35], advice: '열정을 가지고 목표를 향해 나아가세요.', category: '자연' },
  '꽃': { keyword: '꽃', meaning: '사랑과 행복이 찾아옵니다. 좋은 인연을 만날 수 있습니다.', luckyNumber: [4, 12, 20, 28, 36, 44], advice: '주변 사람들에게 따뜻하게 대하세요.', category: '식물' },
  '나무': { keyword: '나무', meaning: '성장과 안정을 의미합니다. 꾸준한 노력이 결실을 맺습니다.', luckyNumber: [6, 13, 18, 25, 31, 38], advice: '인내심을 가지고 차근차근 진행하세요.', category: '식물' },
  '집': { keyword: '집', meaning: '안정과 가족을 상징합니다. 가정에 행복이 찾아옵니다.', luckyNumber: [8, 15, 22, 29, 36, 43], advice: '가족과 소중한 시간을 보내세요.', category: '건물' },
  '차': { keyword: '차', meaning: '이동과 변화를 나타냅니다. 새로운 환경이나 기회가 올 수 있습니다.', luckyNumber: [9, 16, 23, 30, 37, 44], advice: '변화를 긍정적으로 받아들이세요.', category: '사물' },
  '비행기': { keyword: '비행기', meaning: '비상과 성취를 의미합니다. 목표 달성이 가까워집니다.', luckyNumber: [11, 17, 24, 31, 38, 45], advice: '높은 목표를 세우고 도전하세요.', category: '사물' },
};

export default function DreamInterpreterPage() {
  const [dreamText, setDreamText] = useState('');
  const [result, setResult] = useState<DreamResult | null>(null);

  const handleInterpret = () => {
    if (!dreamText.trim()) {
      alert('꿈 내용을 입력해주세요!');
      return;
    }

    // 입력된 텍스트에서 키워드 찾기
    let foundResult: DreamResult | null = null;
    for (const [key, value] of Object.entries(dreamDatabase)) {
      if (dreamText.includes(key)) {
        foundResult = value;
        break;
      }
    }

    // 키워드를 찾지 못한 경우 기본 해몽
    if (!foundResult) {
      foundResult = {
        keyword: '일반',
        meaning: '꿈은 당신의 무의식이 보내는 메시지입니다. 꿈 속의 감정과 상황을 되돌아보세요.',
        luckyNumber: Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1),
        advice: '꿈에서 느낀 감정이 중요합니다. 긍정적인 마음을 유지하세요.',
        category: '일반',
      };
    }

    setResult(foundResult);
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 py-8 px-4 transition-colors">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
          💭 꿈해몽
        </h1>
        <p className="text-lg text-gray-600 dark:text-purple-200 max-w-2xl mx-auto">
          꿈에서 본 것을 입력하면<br />
          전통 꿈해몽으로 의미를 해석해드립니다
        </p>
      </div>

      {/* 입력 폼 */}
      <div className="max-w-[640px] mx-auto bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-gray-200 dark:border-white/10">
        <fieldset>
          <legend className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🌙 꿈 내용을 입력하세요
          </legend>
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="예: 오늘 꿈에 뱀이 나왔어요..."
            rows={6}
            className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-pink-500 text-black dark:text-white bg-white dark:bg-gray-800"
            style={{ fontSize: '16px' }}
          />
          <p className="text-sm text-gray-600 dark:text-purple-200 mt-2">
            💡 키워드: 돈, 뱀, 호랑이, 물, 불, 꽃, 나무, 집, 차, 비행기 등
          </p>
        </fieldset>

        <button
          onClick={handleInterpret}
          className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          style={{ minHeight: '48px' }}
        >
          해몽하기
        </button>
      </div>

      {/* 결과 */}
      {result && (
        <div id="result-section" className="max-w-[800px] mx-auto space-y-6">
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-white/10">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔮</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">해몽 결과</h2>
              <div className="inline-block bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                {result.category}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-white/20 rounded-xl p-6 border border-purple-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">💫 의미</h3>
                <p className="text-gray-700 dark:text-purple-100 leading-relaxed">{result.meaning}</p>
              </div>

              <div className="bg-yellow-50 dark:bg-white/20 rounded-xl p-6 border border-yellow-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">🎰 행운의 숫자</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {result.luckyNumber.map((num, index) => (
                    <div
                      key={index}
                      className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-pink-50 dark:bg-white/20 rounded-xl p-6 border border-pink-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">💡 조언</h3>
                <p className="text-gray-700 dark:text-purple-100 leading-relaxed">{result.advice}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 하단 고지 */}
      <div className="max-w-3xl mx-auto mt-16 text-center text-sm text-purple-200">
        <p className="text-xs">꿈해몽은 재미와 참고용이며, 과학적 근거가 없습니다.</p>

      {/* 제작자 서명 */}
      <AppFooter />
      </div>
    </div>
  );
}

