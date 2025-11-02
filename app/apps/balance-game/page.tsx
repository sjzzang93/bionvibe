'use client';

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

interface Question {
  id: number;
  category: string;
  categoryEmoji: string;
  question: string;
  optionA: string;
  optionB: string;
  // 실제로는 서버에서 가져와야 하지만, 데모용으로 하드코딩
  statsA: number; // 퍼센트
  statsB: number;
}

const questions: Question[] = [
  // 💰 돈 관련
  {
    id: 1,
    category: '돈',
    categoryEmoji: '💰',
    question: '10억을 받는다면?',
    optionA: '지금 당장 5억',
    optionB: '10년 후 10억',
    statsA: 78,
    statsB: 22
  },
  {
    id: 2,
    category: '돈',
    categoryEmoji: '💰',
    question: '평생 직업을 선택한다면?',
    optionA: '연봉 5천 좋아하는 일',
    optionB: '연봉 1억 싫어하는 일',
    statsA: 65,
    statsB: 35
  },
  {
    id: 3,
    category: '돈',
    categoryEmoji: '💰',
    question: '로또 1등에 당첨된다면?',
    optionA: '혼자 독식',
    optionB: '가족과 나눔',
    statsA: 42,
    statsB: 58
  },
  {
    id: 4,
    category: '돈',
    categoryEmoji: '💰',
    question: '부자가 되는 방법?',
    optionA: '한 번에 대박',
    optionB: '꾸준히 저축',
    statsA: 31,
    statsB: 69
  },
  // 💕 연애 관련
  {
    id: 5,
    category: '연애',
    categoryEmoji: '💕',
    question: '이상형을 선택한다면?',
    optionA: '외모 100점 성격 50점',
    optionB: '외모 50점 성격 100점',
    statsA: 28,
    statsB: 72
  },
  {
    id: 6,
    category: '연애',
    categoryEmoji: '💕',
    question: '연애 스타일은?',
    optionA: '매일 연락하는 연애',
    optionB: '적당한 거리두기',
    statsA: 61,
    statsB: 39
  },
  {
    id: 7,
    category: '연애',
    categoryEmoji: '💕',
    question: '첫 데이트 장소는?',
    optionA: '맛집 투어',
    optionB: '영화관',
    statsA: 54,
    statsB: 46
  },
  {
    id: 8,
    category: '연애',
    categoryEmoji: '💕',
    question: '상대방이 바람피웠다면?',
    optionA: '용서하고 계속',
    optionB: '바로 이별',
    statsA: 15,
    statsB: 85
  },
  // 🎯 능력 관련
  {
    id: 9,
    category: '능력',
    categoryEmoji: '🎯',
    question: '초능력을 하나 준다면?',
    optionA: '투명인간',
    optionB: '순간이동',
    statsA: 32,
    statsB: 68
  },
  {
    id: 10,
    category: '능력',
    categoryEmoji: '🎯',
    question: '천재가 될 수 있다면?',
    optionA: '수학 천재',
    optionB: '예술 천재',
    statsA: 47,
    statsB: 53
  },
  {
    id: 11,
    category: '능력',
    categoryEmoji: '🎯',
    question: '언어 능력을 얻는다면?',
    optionA: '모든 외국어 마스터',
    optionB: '동물과 대화',
    statsA: 71,
    statsB: 29
  },
  {
    id: 12,
    category: '능력',
    categoryEmoji: '🎯',
    question: '시간을 조작할 수 있다면?',
    optionA: '과거로 돌아가기',
    optionB: '미래 보기',
    statsA: 58,
    statsB: 42
  },
  // 🍔 음식 관련
  {
    id: 13,
    category: '음식',
    categoryEmoji: '🍔',
    question: '평생 하나만 먹는다면?',
    optionA: '치킨',
    optionB: '피자',
    statsA: 56,
    statsB: 44
  },
  {
    id: 14,
    category: '음식',
    categoryEmoji: '🍔',
    question: '라면 스타일은?',
    optionA: '봉지라면',
    optionB: '컵라면',
    statsA: 73,
    statsB: 27
  },
  {
    id: 15,
    category: '음식',
    categoryEmoji: '🍔',
    question: '배달음식 주문한다면?',
    optionA: '중국집',
    optionB: '치킨',
    statsA: 41,
    statsB: 59
  },
  {
    id: 16,
    category: '음식',
    categoryEmoji: '🍔',
    question: '디저트를 선택한다면?',
    optionA: '케이크',
    optionB: '아이스크림',
    statsA: 38,
    statsB: 62
  },
  // 🌟 일상 관련
  {
    id: 17,
    category: '일상',
    categoryEmoji: '🌟',
    question: '휴가를 보낸다면?',
    optionA: '해외여행',
    optionB: '집에서 휴식',
    statsA: 64,
    statsB: 36
  },
  {
    id: 18,
    category: '일상',
    categoryEmoji: '🌟',
    question: '아침형 vs 저녁형',
    optionA: '일찍 자고 일찍 일어나기',
    optionB: '늦게 자고 늦게 일어나기',
    statsA: 34,
    statsB: 66
  },
  {
    id: 19,
    category: '일상',
    categoryEmoji: '🌟',
    question: '집 크기를 선택한다면?',
    optionA: '넓은 집 외곽',
    optionB: '작은 집 도심',
    statsA: 52,
    statsB: 48
  },
  {
    id: 20,
    category: '일상',
    categoryEmoji: '🌟',
    question: '날씨를 선택한다면?',
    optionA: '평생 여름',
    optionB: '평생 겨울',
    statsA: 57,
    statsB: 43
  },
  // 🎮 취미/여가
  {
    id: 21,
    category: '취미',
    categoryEmoji: '🎮',
    question: '주말을 보낸다면?',
    optionA: '친구들과 놀기',
    optionB: '혼자 집콕',
    statsA: 45,
    statsB: 55
  },
  {
    id: 22,
    category: '취미',
    categoryEmoji: '🎮',
    question: '영화를 본다면?',
    optionA: '극장에서',
    optionB: 'OTT로 집에서',
    statsA: 39,
    statsB: 61
  },
  {
    id: 23,
    category: '취미',
    categoryEmoji: '🎮',
    question: '운동을 한다면?',
    optionA: '헬스장 근력운동',
    optionB: '야외 러닝',
    statsA: 54,
    statsB: 46
  },
  {
    id: 24,
    category: '취미',
    categoryEmoji: '🎮',
    question: '게임 장르를 선택한다면?',
    optionA: 'RPG',
    optionB: 'FPS',
    statsA: 63,
    statsB: 37
  },
  // 추가 재미있는 질문들
  {
    id: 25,
    category: '능력',
    categoryEmoji: '🎯',
    question: '평생 능력을 얻는다면?',
    optionA: '잠 안자도 됨',
    optionB: '먹어도 살 안 찜',
    statsA: 48,
    statsB: 52
  },
  {
    id: 26,
    category: '돈',
    categoryEmoji: '💰',
    question: '재산을 모은다면?',
    optionA: '주식 투자',
    optionB: '부동산 투자',
    statsA: 43,
    statsB: 57
  },
  {
    id: 27,
    category: '연애',
    categoryEmoji: '💕',
    question: '프러포즈 받는다면?',
    optionA: '로맨틱한 이벤트',
    optionB: '소박한 고백',
    statsA: 67,
    statsB: 33
  },
  {
    id: 28,
    category: '일상',
    categoryEmoji: '🌟',
    question: '평생 선택한다면?',
    optionA: '샤워만',
    optionB: '목욕만',
    statsA: 71,
    statsB: 29
  },
  {
    id: 29,
    category: '음식',
    categoryEmoji: '🍔',
    question: '커피를 마신다면?',
    optionA: '아메리카노',
    optionB: '라떼',
    statsA: 58,
    statsB: 42
  },
  {
    id: 30,
    category: '능력',
    categoryEmoji: '🎯',
    question: '인생을 바꾼다면?',
    optionA: '다시 10살로',
    optionB: '바로 50살로',
    statsA: 82,
    statsB: 18
  }
];

export default function BalanceGamePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState<number[]>([]);
  const [category, setCategory] = useState<string>('전체');

  const categories = ['전체', '돈', '연애', '능력', '음식', '일상', '취미'];

  const filteredQuestions = category === '전체'
    ? questions
    : questions.filter(q => q.category === category);

  const currentQuestion = filteredQuestions[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setAnswered([]);
  }, [category]);

  const handleSelect = (option: 'A' | 'B') => {
    if (showResult) return;

    setSelectedOption(option);
    setShowResult(true);
    setAnswered([...answered, currentQuestion.id]);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // 마지막 질문
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowResult(false);
      setAnswered([]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  const progress = ((currentIndex + 1) / filteredQuestions.length) * 100;

  return (
    <PremiumLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            밸런스 게임 ⚖️
          </h1>
          <p className="text-gray-400 text-lg">
            당신의 선택은? 다른 사람들의 통계도 확인하세요!
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 진행률 바 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>진행률</span>
            <span>{currentIndex + 1} / {filteredQuestions.length}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 질문 카드 */}
        <PremiumCard className="mb-6">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{filteredQuestions[currentIndex].categoryEmoji}</div>
            <div className="inline-block px-4 py-1 bg-gray-800 rounded-full text-sm text-gray-300 mb-4">
              {filteredQuestions[currentIndex].category}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {filteredQuestions[currentIndex].question}
            </h2>
          </div>

          {/* 선택 옵션 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* 옵션 A */}
            <button
              onClick={() => handleSelect('A')}
              disabled={showResult}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                showResult
                  ? selectedOption === 'A'
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-gray-700 bg-gray-800/50'
                  : 'border-gray-700 hover:border-pink-500 hover:bg-pink-500/5'
              } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="text-xl font-bold mb-2 text-pink-400">A</div>
              <div className="text-white font-medium mb-4">
                {filteredQuestions[currentIndex].optionA}
              </div>

              {showResult && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">선택률</span>
                    <span className="text-pink-400 font-bold">
                      {filteredQuestions[currentIndex].statsA}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-pink-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${filteredQuestions[currentIndex].statsA}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {selectedOption === 'A' && showResult && (
                <div className="absolute top-4 right-4 text-2xl">✓</div>
              )}
            </button>

            {/* 옵션 B */}
            <button
              onClick={() => handleSelect('B')}
              disabled={showResult}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                showResult
                  ? selectedOption === 'B'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800/50'
                  : 'border-gray-700 hover:border-blue-500 hover:bg-blue-500/5'
              } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="text-xl font-bold mb-2 text-blue-400">B</div>
              <div className="text-white font-medium mb-4">
                {filteredQuestions[currentIndex].optionB}
              </div>

              {showResult && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">선택률</span>
                    <span className="text-blue-400 font-bold">
                      {filteredQuestions[currentIndex].statsB}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${filteredQuestions[currentIndex].statsB}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {selectedOption === 'B' && showResult && (
                <div className="absolute top-4 right-4 text-2xl">✓</div>
              )}
            </button>
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex gap-3">
            <PremiumButton
              onClick={handlePrevious}
              variant="secondary"
              className="flex-1"
              disabled={currentIndex === 0}
            >
              이전
            </PremiumButton>
            <PremiumButton
              onClick={handleNext}
              className="flex-1"
              disabled={!showResult}
            >
              {currentIndex === filteredQuestions.length - 1 ? '처음으로' : '다음'}
            </PremiumButton>
          </div>
        </PremiumCard>

        {/* 통계 정보 */}
        {showResult && (
          <PremiumCard className="mb-6 animate-fade-in">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3">
                {selectedOption === 'A'
                  ? `${filteredQuestions[currentIndex].statsA}%의 사람들이 당신과 같은 선택을 했어요!`
                  : `${filteredQuestions[currentIndex].statsB}%의 사람들이 당신과 같은 선택을 했어요!`
                }
              </h3>
              <p className="text-gray-400">
                {selectedOption === 'A' && filteredQuestions[currentIndex].statsA > 70 && '대중적인 선택이네요! 👍'}
                {selectedOption === 'A' && filteredQuestions[currentIndex].statsA <= 30 && '소수의 선택! 독특하시네요! 🌟'}
                {selectedOption === 'B' && filteredQuestions[currentIndex].statsB > 70 && '대중적인 선택이네요! 👍'}
                {selectedOption === 'B' && filteredQuestions[currentIndex].statsB <= 30 && '소수의 선택! 독특하시네요! 🌟'}
                {((selectedOption === 'A' && filteredQuestions[currentIndex].statsA > 30 && filteredQuestions[currentIndex].statsA <= 70) ||
                  (selectedOption === 'B' && filteredQuestions[currentIndex].statsB > 30 && filteredQuestions[currentIndex].statsB <= 70)) && '적당히 나뉘는 선택이네요! ⚖️'}
              </p>
            </div>
          </PremiumCard>
        )}

        {/* 관련 앱 */}
        <RelatedApps currentAppSlug="balance-game" />
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </PremiumLayout>
  );
}
