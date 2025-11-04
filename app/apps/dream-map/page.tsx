"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 꿈 키워드 해석
const DREAM_KEYWORDS = {
  // 사람
  '부모': '가족의 사랑과 보호를 그리워하는 마음',
  '엄마': '따뜻함과 안정이 필요한 시기',
  '아빠': '든든한 지지가 필요한 순간',
  '친구': '소중한 인연에 대한 그리움',
  '애인': '사랑받고 싶은 마음',
  '연인': '사랑받고 싶은 마음',
  '아기': '새로운 시작에 대한 설렘',
  '아이': '순수했던 시절의 나',

  // 장소
  '집': '마음의 안식처를 찾고 있어요',
  '학교': '배우고 성장하고 싶은 마음',
  '길': '인생의 방향을 고민 중',
  '바다': '넓은 마음과 자유를 원해요',
  '산': '높은 곳을 향한 도전',
  '공원': '평화로운 휴식이 필요해요',
  '카페': '여유로운 시간을 원해요',

  // 행동
  '날다': '자유를 꿈꾸고 있어요',
  '떨어지다': '조금 불안한 마음',
  '달리다': '목표를 향해 나아가는 중',
  '웃다': '행복한 순간을 기억해요',
  '울다': '감정을 표현하고 싶어요',
  '춤추다': '즐거움을 느끼고 싶어요',

  // 감정
  '행복': '지금 마음이 따뜻해요',
  '슬픔': '위로가 필요한 순간',
  '불안': '걱정을 내려놓고 싶어요',
  '설렘': '새로운 일이 기대돼요',
  '평화': '고요한 마음을 원해요',

  // 자연/상징
  '꽃': '아름다운 순간을 맞이할 거예요',
  '나무': '천천히 성장하는 중',
  '별': '희망을 찾고 있어요',
  '달': '내면의 나를 보고 있어요',
  '햇살': '밝은 미래를 기대해요',
  '비': '마음을 정리하는 시간',
  '눈': '순수한 마음',
};

interface DreamCard {
  keyword: string;
  meaning: string;
  color: string;
  emoji: string;
}

export default function DreamMap() {
  const [dreamText, setDreamText] = useState('');
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [dreamCards, setDreamCards] = useState<DreamCard[]>([]);
  const [mainMessage, setMainMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const colors = [
    '#FFB4D6', '#B4D4FF', '#FFE5B4', '#D4B4FF',
    '#B4FFD4', '#FFD4B4', '#D4FFB4', '#FFB4E5'
  ];

  const emojis = ['🌸', '🌟', '💫', '🌈', '🦋', '🎈', '💝', '✨'];

  const analyzeDream = () => {
    if (!dreamText.trim()) {
      alert('꿈 이야기를 들려주세요 😊');
      return;
    }

    setAnalyzing(true);

    setTimeout(() => {
      const foundCards: DreamCard[] = [];

      // 키워드 찾기
      Object.entries(DREAM_KEYWORDS).forEach(([keyword, meaning], index) => {
        if (dreamText.includes(keyword)) {
          foundCards.push({
            keyword,
            meaning,
            color: colors[index % colors.length],
            emoji: emojis[index % emojis.length]
          });
        }
      });

      // 최소 3개 이상 보장
      if (foundCards.length === 0) {
        foundCards.push({
          keyword: '특별한 순간',
          meaning: '당신만의 특별한 이야기가 담긴 꿈이에요',
          color: colors[0],
          emoji: '✨'
        });
      }

      setDreamCards(foundCards);

      // 전체 메시지 생성
      if (foundCards.length >= 3) {
        setMainMessage('당신의 꿈에는 많은 이야기가 담겨 있네요. 지금 이 순간의 감정을 소중히 간직하세요.');
      } else if (foundCards.length >= 1) {
        setMainMessage('마음 속 깊이 간직한 생각이 꿈으로 나타났어요. 당신의 마음이 전하는 메시지에 귀 기울여보세요.');
      } else {
        setMainMessage('꿈은 당신의 마음이 보내는 편지예요. 오늘도 소중한 하루 보내세요.');
      }

      setStep('result');
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* 헤더 */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0, rotateY: -180 }}
                  animate={{
                    scale: 1,
                    rotateY: 0,
                  }}
                  transition={{
                    type: "spring",
                    duration: 0.8,
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotateZ: 15,
                    transition: { duration: 0.3 }
                  }}
                  className="text-8xl"
                  style={{
                    transformStyle: 'preserve-3d',
                    cursor: 'pointer',
                  }}
                >
                  🌙
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  오늘 밤 당신의 꿈
                </h1>
                <p className="text-lg text-gray-600">
                  당신의 마음이 전하는 이야기를 들려드릴게요
                </p>
              </div>

              {/* 입력 카드 */}
              <motion.div
                className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'perspective(1000px) rotateX(2deg)',
                }}
                whileHover={{
                  transform: 'perspective(1000px) rotateX(0deg) translateY(-5px)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <span>💭</span>
                    <span>어떤 꿈을 꾸셨나요?</span>
                  </label>
                  <textarea
                    value={dreamText}
                    onChange={(e) => setDreamText(e.target.value)}
                    placeholder="예) 오늘 엄마가 나오는 꿈을 꿨어요. 함께 바다를 보면서 행복했어요..."
                    className="w-full h-48 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none text-gray-700 text-lg"
                    autoFocus
                  />
                </div>

                <div className="bg-purple-50 rounded-2xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-purple-700">💡 이렇게 이야기해보세요</p>
                  <ul className="text-sm text-purple-600 space-y-1 ml-4">
                    <li>• 누가 나왔나요? (가족, 친구, 애인...)</li>
                    <li>• 어디였나요? (집, 바다, 학교...)</li>
                    <li>• 어떤 기분이었나요? (행복, 평화, 설렘...)</li>
                  </ul>
                </div>

                <motion.button
                  onClick={analyzeDream}
                  disabled={analyzing}
                  className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all ${
                    analyzing
                      ? 'bg-gray-400'
                      : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500'
                  }`}
                  whileHover={{
                    scale: 1.05,
                    rotateX: -5,
                    boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      마음을 읽고 있어요...
                    </span>
                  ) : (
                    '✨ 꿈 해석하기'
                  )}
                </motion.button>
              </motion.div>

              {/* 꿀팁 */}
              <div className="bg-white/70 rounded-2xl p-6 space-y-3">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <span>💌</span>
                  <span>꿈은 마음의 편지예요</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  꿈은 당신의 마음이 전하는 메시지예요. 정답은 없어요.
                  단지 지금 이 순간, 당신의 마음이 무엇을 느끼고 있는지
                  조용히 들어보는 시간이에요.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* 헤더 */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180, rotateY: -180 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    rotateY: 0,
                  }}
                  transition={{
                    type: "spring",
                    duration: 0.8,
                    stiffness: 80
                  }}
                  whileHover={{
                    scale: 1.3,
                    rotate: 180,
                    transition: { duration: 0.5 }
                  }}
                  className="text-8xl"
                  style={{
                    transformStyle: 'preserve-3d',
                    cursor: 'pointer',
                  }}
                >
                  ✨
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  당신의 마음을 읽었어요
                </h2>
              </div>

              {/* 메인 메시지 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
                className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-8 text-white shadow-2xl"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'perspective(1000px)',
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 2,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                }}
              >
                <p className="text-xl md:text-2xl leading-relaxed text-center font-medium">
                  {mainMessage}
                </p>
              </motion.div>

              {/* 꿈 카드들 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 text-center">
                  💫 당신의 꿈에서 발견한 이야기
                </h3>

                <div className="grid gap-4" style={{ perspective: '1000px' }}>
                  {dreamCards.map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20, rotateY: -15 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 100 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                      style={{
                        borderLeft: `6px solid ${card.color}`,
                        transformStyle: 'preserve-3d',
                      }}
                      whileHover={{
                        scale: 1.05,
                        rotateY: 3,
                        rotateX: -2,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                        transition: { duration: 0.3 }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="text-4xl flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full"
                          style={{ backgroundColor: card.color + '20' }}
                        >
                          {card.emoji}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="text-xl font-bold text-gray-800">
                            {card.keyword}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {card.meaning}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 응원 메시지 */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="bg-white rounded-3xl p-8 shadow-lg space-y-4"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
                whileHover={{
                  scale: 1.02,
                  rotateX: -1,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                }}
              >
                <div className="text-center text-6xl mb-4">
                  🌈
                </div>
                <h3 className="text-2xl font-bold text-gray-800 text-center">
                  오늘도 응원할게요
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  꿈은 당신이 얼마나 소중한 사람인지 말해주고 있어요.
                  지금 이 순간의 당신을 있는 그대로 사랑해주세요.
                  당신은 충분히 잘하고 있어요. 💕
                </p>
              </motion.div>

              {/* 입력한 꿈 */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span>📝</span>
                  <span>당신이 들려준 꿈</span>
                </h4>
                <p className="text-gray-600 leading-relaxed italic">
                  "{dreamText}"
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-4">
                <motion.button
                  onClick={() => {
                    setStep('input');
                    setDreamText('');
                    setDreamCards([]);
                  }}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-200 transition-all"
                  whileHover={{
                    scale: 1.05,
                    rotateY: -3,
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  🌙 새로운 꿈 해석하기
                </motion.button>
                <motion.button
                  onClick={() => {
                    const text = `오늘 밤 나의 꿈\n\n"${dreamText}"\n\n${mainMessage}\n\n${dreamCards.map(c => `${c.emoji} ${c.keyword}: ${c.meaning}`).join('\n')}`;
                    navigator.clipboard.writeText(text);
                    alert('꿈 해석이 복사되었어요! 💝');
                  }}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 transition-all"
                  whileHover={{
                    scale: 1.05,
                    rotateY: 3,
                    boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  📋 결과 저장하기
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
