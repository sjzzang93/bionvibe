'use client';

import { useState } from 'react';
import AppFooter from "@/app/components/AppFooter";
import Link from 'next/link';

const wordSets = {
  '초급 (300단어)': [
    { en: 'apple', ko: '사과' }, { en: 'book', ko: '책' }, { en: 'cat', ko: '고양이' }, { en: 'dog', ko: '개' },
    { en: 'eye', ko: '눈' }, { en: 'fish', ko: '물고기' }, { en: 'good', ko: '좋은' }, { en: 'house', ko: '집' },
    { en: 'ice', ko: '얼음' }, { en: 'juice', ko: '주스' }, { en: 'king', ko: '왕' }, { en: 'love', ko: '사랑' },
    { en: 'moon', ko: '달' }, { en: 'name', ko: '이름' }, { en: 'orange', ko: '오렌지' }, { en: 'pen', ko: '펜' },
    { en: 'queen', ko: '여왕' }, { en: 'rain', ko: '비' }, { en: 'sun', ko: '해' }, { en: 'tree', ko: '나무' },
  ],
  '중급 (500단어)': [
    { en: 'achievement', ko: '성취' }, { en: 'beautiful', ko: '아름다운' }, { en: 'challenge', ko: '도전' },
    { en: 'dangerous', ko: '위험한' }, { en: 'education', ko: '교육' }, { en: 'fantastic', ko: '환상적인' },
    { en: 'knowledge', ko: '지식' }, { en: 'motivation', ko: '동기부여' }, { en: 'opportunity', ko: '기회' },
    { en: 'pleasure', ko: '즐거움' }, { en: 'relationship', ko: '관계' }, { en: 'satisfaction', ko: '만족' },
  ],
  '고급 (800단어)': [
    { en: 'sophisticated', ko: '세련된' }, { en: 'unprecedented', ko: '전례없는' },
    { en: 'comprehensive', ko: '종합적인' }, { en: 'fundamental', ko: '근본적인' },
    { en: 'predominant', ko: '지배적인' }, { en: 'substantial', ko: '상당한' },
  ],
};

export default function FlashcardPage() {
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [memorized, setMemorized] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);

  const currentWords = selectedSet ? wordSets[selectedSet as keyof typeof wordSets] : [];

  const handleNext = () => {
    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const toggleMemorized = () => {
    const newMemorized = new Set(memorized);
    if (newMemorized.has(currentIndex)) {
      newMemorized.delete(currentIndex);
    } else {
      newMemorized.add(currentIndex);
    }
    setMemorized(newMemorized);
  };

  if (!selectedSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
            📚 영어단어 플래시카드
          </h1>
          <p className="text-center text-blue-100 mb-12">레벨별 단어 암기</p>

          <div className="space-y-4 mb-8">
            {Object.keys(wordSets).map((setName) => (
              <button
                key={setName}
                onClick={() => setSelectedSet(setName)}
                className="w-full bg-white/10 backdrop-blur-lg hover:bg-white/20 rounded-2xl p-8 transition-all"
              >
                <h3 className="text-3xl font-bold text-white">{setName}</h3>
              </button>
            ))}
          </div>

          {/* 돌아가기 버튼 */}
          <div className="text-center mt-8">
            <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300">
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-4">학습 완료!</h2>
            <div className="text-2xl text-white mb-8">
              암기한 단어: {memorized.size}/{currentWords.length}
              {/* 제작자 서명 */}
              <AppFooter />

            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setShowResult(false);
                  setIsFlipped(false);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold text-xl"
              >
                다시 학습
              </button>
              <button
                onClick={() => {
                  setSelectedSet('');
                  setCurrentIndex(0);
                  setMemorized(new Set());
                  setShowResult(false);
                }}
                className="w-full bg-white/20 text-white px-6 py-4 rounded-xl font-bold text-xl"
              >
                레벨 선택
              </button>
              <Link href="/" className="block w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-bold text-xl transition-all">
                메인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = currentWords[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => {
            setSelectedSet('');
            setCurrentIndex(0);
            setMemorized(new Set());
          }}
          className="mb-6 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30"
        >
          ← {selectedSet}
        </button>

        {/* 진행률 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6">
          <div className="flex justify-between text-white mb-2">
            <span>{currentIndex + 1} / {currentWords.length}</span>
            <span>암기: {memorized.size}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / currentWords.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 플래시카드 */}
        <div
          className="relative bg-white rounded-3xl p-16 mb-6 cursor-pointer min-h-[400px] flex items-center justify-center"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="text-center">
            {!isFlipped ? (
              <>
                <div className="text-6xl font-bold text-gray-800 mb-4">{currentWord.en}</div>
                <div className="text-gray-500">클릭하여 뜻 보기</div>
              </>
            ) : (
              <>
                <div className="text-5xl font-bold text-indigo-600 mb-4">{currentWord.ko}</div>
                <div className="text-gray-600 text-2xl">{currentWord.en}</div>
              </>
            )}
          </div>
        </div>

        {/* 컨트롤 */}
        <div className="space-y-4">
          <button
            onClick={toggleMemorized}
            className={`w-full px-6 py-4 rounded-xl font-bold text-xl transition-all ${
              memorized.has(currentIndex)
                ? 'bg-green-500 text-white'
                : 'bg-white/20 text-white'
            }`}
          >
            {memorized.has(currentIndex) ? '✅ 암기함' : '☐ 암기 표시'}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="bg-white/20 text-white px-6 py-4 rounded-xl font-bold disabled:opacity-50"
            >
              ← 이전
            </button>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold"
            >
              {currentIndex === currentWords.length - 1 ? '완료' : '다음 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

