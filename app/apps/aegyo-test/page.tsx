'use client';

import { useState } from 'react';

type Question = {
  id: number;
  text: string;
  options: {
    text: string;
    aegyo: number; // 애교 점수 (-10 ~ +10)
  }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: '친구가 뭔가 부탁할 때 나는?',
    options: [
      { text: '응~ 해줄게! 💕', aegyo: 10 },
      { text: '뭔데? 말해봐', aegyo: 5 },
      { text: '왜? 이유부터 말해', aegyo: 0 },
      { text: '싫은데', aegyo: -5 },
    ],
  },
  {
    id: 2,
    text: '친구가 실수했을 때 내 반응은?',
    options: [
      { text: '앗 괜찮아~ 다음엔 조심해! ☺️', aegyo: 10 },
      { text: '어? 괜찮아?', aegyo: 5 },
      { text: '뭐했냐', aegyo: 0 },
      { text: '헐... 진짜?', aegyo: -5 },
    ],
  },
  {
    id: 3,
    text: '친구에게 카톡 보낼 때 말투는?',
    options: [
      { text: '응응~! 알겠어용~♡', aegyo: 10 },
      { text: '응! 알겠어 ㅎㅎ', aegyo: 5 },
      { text: '응 알았어', aegyo: 0 },
      { text: '알았습니다', aegyo: -5 },
    ],
  },
  {
    id: 4,
    text: '친구가 새로운 머리스타일을 했어! 내 반응은?',
    options: [
      { text: '헐~ 완전 잘어울려!! 너무 이뻐~! 💕', aegyo: 10 },
      { text: '오 잘어울린다!', aegyo: 5 },
      { text: '바꿨네', aegyo: 0 },
      { text: '...음', aegyo: -5 },
    ],
  },
  {
    id: 5,
    text: '친구가 사진 찍자고 할 때?',
    options: [
      { text: '좋아~! 어디서 찍을까? 포즈도 생각해두었어! 💕', aegyo: 10 },
      { text: '좋지! 여기서 찍자', aegyo: 5 },
      { text: '찍자', aegyo: 0 },
      { text: '...꼭 찍어야 해?', aegyo: -5 },
    ],
  },
  {
    id: 6,
    text: '좋아하는 음식이 나왔을 때 반응은?',
    options: [
      { text: '우와~ 대박! 진짜 맛있겠다~! 💕', aegyo: 10 },
      { text: '오 좋다! 맛있겠다', aegyo: 5 },
      { text: '맛있겠네', aegyo: 0 },
      { text: '(조용히 먹기 시작)', aegyo: -5 },
    ],
  },
  {
    id: 7,
    text: '친구가 고민 상담할 때?',
    options: [
      { text: '어머~ 힘들었겠다ㅠㅠ 괜찮아? 내가 도와줄게! 💕', aegyo: 10 },
      { text: '무슨 일이야? 괜찮아?', aegyo: 5 },
      { text: '무슨 일인데', aegyo: 0 },
      { text: '...응', aegyo: -5 },
    ],
  },
  {
    id: 8,
    text: '친구가 선물을 줬을 때?',
    options: [
      { text: '헐~ 진짜?! 너무 고마워~! 완전 좋아! 💕', aegyo: 10 },
      { text: '오 고마워! 잘 쓸게', aegyo: 5 },
      { text: '고맙다', aegyo: 0 },
      { text: '어 그래', aegyo: -5 },
    ],
  },
  {
    id: 9,
    text: '친구가 늦었을 때?',
    options: [
      { text: '괜찮아~! 천천히 와도 돼! 조심해서 와~ ☺️', aegyo: 10 },
      { text: '괜찮아, 조심히 와', aegyo: 5 },
      { text: '알았어', aegyo: 0 },
      { text: '빨리 와', aegyo: -5 },
    ],
  },
  {
    id: 10,
    text: '친구의 농담에 대한 반응은?',
    options: [
      { text: '헤헤~ 너무 웃겨! 어떻게 그런 생각을 했어~? 💕', aegyo: 10 },
      { text: 'ㅋㅋㅋ 웃기네', aegyo: 5 },
      { text: 'ㅎ', aegyo: 0 },
      { text: '...', aegyo: -5 },
    ],
  },
];

export default function AegyoTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [gender, setGender] = useState<'female' | 'male' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleGenderSelect = (selectedGender: 'female' | 'male') => {
    setGender(selectedGender);
  };

  const handleAnswer = (score: number, optionIndex: number) => {
    setSelectedOption(optionIndex);

    setTimeout(() => {
      const newScore = totalScore + score;
      setTotalScore(newScore);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setIsComplete(true);
      }
    }, 300);
  };

  const getResult = () => {
    const avgScore = totalScore / questions.length;

    if (gender === 'female') {
      if (avgScore >= 7) {
        return {
          type: '에겐녀',
          emoji: '🌸',
          title: '완벽한 에겐녀!',
          description: '당신은 타고난 에겐녀! 부드럽고 사랑스러운 말투와 행동으로 주변 사람들을 녹이는 매력이 있어요. 친구들이 당신과 함께 있으면 기분이 좋아지고 편안함을 느낄 거예요.',
          characteristics: [
            '💕 부드럽고 다정한 말투',
            '☺️ 긍정적이고 밝은 에너지',
            '🌟 배려심 가득한 행동',
            '💖 사랑스러운 표현력',
          ],
          color: 'from-pink-400 to-rose-400',
          bgColor: 'bg-pink-50 dark:bg-pink-900/20',
        };
      } else if (avgScore >= 3) {
        return {
          type: '중간',
          emoji: '🌼',
          title: '밸런스형',
          description: '상황에 따라 애교와 시크함을 적절히 조절하는 당신! 너무 과하지도, 너무 차갑지도 않은 균형 잡힌 매력이 있어요.',
          characteristics: [
            '🎯 상황 파악 능력',
            '😊 적절한 감정 표현',
            '🌈 다양한 매력',
            '⚖️ 균형잡힌 성격',
          ],
          color: 'from-purple-400 to-pink-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        };
      } else {
        return {
          type: '테토녀',
          emoji: '⚡',
          title: '완벽한 테토녀!',
          description: '당신은 시크하고 직설적인 매력의 테토녀! 불필요한 꾸밈 없이 솔직하고 쿨한 모습이 당신만의 개성이에요. 그 솔직함이 오히려 더 매력적!',
          characteristics: [
            '💪 솔직하고 직설적',
            '😎 쿨하고 시크한 매력',
            '🎯 군더더기 없는 소통',
            '⚡ 강한 카리스마',
          ],
          color: 'from-blue-400 to-cyan-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        };
      }
    } else {
      if (avgScore >= 7) {
        return {
          type: '애겐남',
          emoji: '🦋',
          title: '완벽한 애겐남!',
          description: '당신은 타고난 애겐남! 부드럽고 다정한 말투와 세심한 배려로 주변 사람들을 편안하게 만드는 매력이 있어요. 친구들이 당신과 함께 있으면 따뜻함을 느낄 거예요.',
          characteristics: [
            '💙 다정하고 부드러운 말투',
            '😊 세심한 배려심',
            '🌟 따뜻한 에너지',
            '💝 감성적인 표현력',
          ],
          color: 'from-sky-400 to-blue-400',
          bgColor: 'bg-sky-50 dark:bg-sky-900/20',
        };
      } else if (avgScore >= 3) {
        return {
          type: '중간',
          emoji: '🌊',
          title: '밸런스형',
          description: '상황에 따라 부드러움과 카리스마를 적절히 조절하는 당신! 너무 과하지도, 너무 무뚝뚝하지도 않은 균형 잡힌 매력이 있어요.',
          characteristics: [
            '🎯 상황 파악 능력',
            '😊 적절한 감정 표현',
            '🌈 다양한 매력',
            '⚖️ 균형잡힌 성격',
          ],
          color: 'from-indigo-400 to-blue-400',
          bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        };
      } else {
        return {
          type: '테토남',
          emoji: '🔥',
          title: '완벽한 테토남!',
          description: '당신은 시크하고 카리스마 넘치는 테토남! 불필요한 꾸밈 없이 솔직하고 강한 모습이 당신만의 개성이에요. 그 카리스마가 오히려 더 매력적!',
          characteristics: [
            '💪 솔직하고 직설적',
            '😎 강한 카리스마',
            '🎯 명확한 소통',
            '⚡ 시크한 매력',
          ],
          color: 'from-gray-700 to-gray-900',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        };
      }
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setTotalScore(0);
    setIsComplete(false);
    setGender(null);
    setSelectedOption(null);
  };

  if (!gender) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <span className="text-4xl">💕</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              에겐녀/테토녀 테스트
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              당신의 성향을 알아보세요!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              성별을 선택해주세요
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleGenderSelect('female')}
                className="p-8 bg-gradient-to-br from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                <div className="text-5xl mb-3">👩</div>
                <div className="text-xl font-bold text-white">여성</div>
              </button>
              <button
                onClick={() => handleGenderSelect('male')}
                className="p-8 bg-gradient-to-br from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                <div className="text-5xl mb-3">👨</div>
                <div className="text-xl font-bold text-white">남성</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const result = getResult();
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-4 ${result.bgColor}`}>
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">{result.emoji}</div>
              <h2 className="text-3xl font-bold mb-2">
                <span className={`bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                  {result.title}
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                {result.description}
              </p>
              <div className={`inline-block px-6 py-2 bg-gradient-to-r ${result.color} rounded-full text-white font-bold text-xl`}>
                {result.type}
              </div>
            </div>

            <div className={`${result.bgColor} rounded-xl p-6 mb-6`}>
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">
                📋 당신의 특징
              </h3>
              <div className="space-y-3">
                {result.characteristics.map((char, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white dark:bg-gray-700 p-3 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-200">{char}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>점수 분석</span>
              </h3>
              <div className="text-yellow-700 dark:text-yellow-200">
                총점: {totalScore}점 / 평균: {(totalScore / questions.length).toFixed(1)}점
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className={`h-4 rounded-full bg-gradient-to-r ${result.color} transition-all`}
                  style={{ width: `${((totalScore + 50) / 150) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={resetTest}
              className={`w-full py-4 bg-gradient-to-r ${result.color} hover:opacity-90 text-white font-bold rounded-xl shadow-lg transition-all`}
            >
              다시 테스트하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              질문 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 질문 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            {question.text}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.aegyo, index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                  selectedOption === index
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedOption === index && (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 안내 */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          솔직하게 답변해주세요! 😊
        </div>
      </div>
    </div>
  );
}
