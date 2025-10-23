'use client';

import { useState } from 'react';

// 닉네임 생성 데이터
const NICKNAME_PARTS = {
  // 아기 이름용
  baby: {
    prefix: ['사랑스러운', '귀여운', '예쁜', '똑똑한', '건강한', '밝은', '용감한', '착한', '총명한', '행복한'],
    first: ['하늘', '바다', '별', '달', '해', '구름', '꽃', '나무', '강', '산'],
    middle: ['민', '서', '지', '은', '준', '현', '수', '윤', '채', '도'],
    last: ['준', '우', '아', '인', '호', '영', '수', '빈', '서', '연']
  },
  // 반려동물 이름용
  pet: {
    cute: ['몽', '복', '콩', '떡', '두부', '치즈', '초코', '쿠키', '마루', '보리', '쫑', '뽀', '또', '코'],
    food: ['만두', '호떡', '찹쌀', '약과', '경단', '떡볶이', '김밥', '감자', '고구마', '밤'],
    nature: ['구름', '별', '달', '해', '눈', '바람', '이슬', '하늘', '강', '산'],
    character: ['용용', '뽀뽀', '랄랄', '통통', '룰루', '랄라', '뿡뿡', '콩콩', '방울', '보들']
  },
  // 게임 닉네임용
  game: {
    adjective: ['외로운', '고독한', '슬픈', '행복한', '분노한', '냉정한', '뜨거운', '차가운', '빠른', '느린', '강한', '약한'],
    noun: ['늑대', '호랑이', '사자', '독수리', '용', '불사조', '유령', '악마', '천사', '전사', '마법사', '도적'],
    suffix: ['킬러', '마스터', '로드', '킹', '퀸', '나이트', '고수', '전설', '신화', '영웅']
  },
  // SNS 닉네임용
  social: {
    mood: ['몽환적인', '감성적인', '차분한', '활기찬', '신비로운', '로맨틱한', '쿨한', '따뜻한'],
    object: ['달빛', '별빛', '노을', '새벽', '바람', '파도', '향기', '음악', '그림자', '꿈'],
    number: ['0', '7', '9', '13', '21', '99', '777', '404', '1004']
  },
  // 비즈니스 이름용
  business: {
    positive: ['스마트', '프로', '베스트', '퍼스트', '프리미엄', '골드', '다이아몬드', '엘리트', '럭셔리'],
    industry: ['랩', '스튜디오', '그룹', '컴퍼니', '파트너스', '솔루션', '시스템', '네트워크'],
    tech: ['테크', '디지털', '클라우드', '스마트', '에이아이', '데이터', '소프트', '시큐어']
  }
};

// 한글 조합 생성
const KOREAN_SYLLABLES = {
  first: ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하'],
  middle: ['온', '유', '진', '민', '서', '윤', '하', '영', '지', '수'],
  last: ['아', '이', '우', '에', '오', '야', '여', '유', '요']
};

type Category = 'baby' | 'pet' | 'game' | 'social' | 'business' | 'random';

export default function NicknameGeneratorPage() {
  const [category, setCategory] = useState<Category>('pet');
  const [generatedName, setGeneratedName] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const generateBabyName = () => {
    const first = random(NICKNAME_PARTS.baby.first);
    const middle = random(NICKNAME_PARTS.baby.middle);
    const last = random(NICKNAME_PARTS.baby.last);
    return `${first}${middle}${last}`;
  };

  const generatePetName = () => {
    const type = random(['cute', 'food', 'nature', 'character'] as const);
    return random(NICKNAME_PARTS.pet[type]);
  };

  const generateGameName = () => {
    const adj = random(NICKNAME_PARTS.game.adjective);
    const noun = random(NICKNAME_PARTS.game.noun);
    const suffix = Math.random() > 0.5 ? random(NICKNAME_PARTS.game.suffix) : '';
    return suffix ? `${adj}${noun}${suffix}` : `${adj}${noun}`;
  };

  const generateSocialName = () => {
    const mood = random(NICKNAME_PARTS.social.mood);
    const object = random(NICKNAME_PARTS.social.object);
    const num = Math.random() > 0.6 ? random(NICKNAME_PARTS.social.number) : '';
    return `${mood}${object}${num}`;
  };

  const generateBusinessName = () => {
    const pos = random(NICKNAME_PARTS.business.positive);
    const tech = Math.random() > 0.5 ? random(NICKNAME_PARTS.business.tech) : '';
    const ind = random(NICKNAME_PARTS.business.industry);
    return tech ? `${pos}${tech}${ind}` : `${pos}${ind}`;
  };

  const generateRandomName = () => {
    const first = random(KOREAN_SYLLABLES.first);
    const middle = random(KOREAN_SYLLABLES.middle);
    const last = random(KOREAN_SYLLABLES.last);
    return `${first}${middle}${last}`;
  };

  const handleGenerate = () => {
    let name = '';
    switch (category) {
      case 'baby':
        name = generateBabyName();
        break;
      case 'pet':
        name = generatePetName();
        break;
      case 'game':
        name = generateGameName();
        break;
      case 'social':
        name = generateSocialName();
        break;
      case 'business':
        name = generateBusinessName();
        break;
      case 'random':
        name = generateRandomName();
        break;
    }
    setGeneratedName(name);
    setHistory((prev) => [name, ...prev.slice(0, 9)]); // 최근 10개만 저장
  };

  const copyToClipboard = () => {
    if (generatedName) {
      navigator.clipboard.writeText(generatedName);
      alert('클립보드에 복사되었습니다!');
    }
  };

  const categories = [
    { id: 'baby' as Category, name: '아기 이름', emoji: '👶', desc: '예쁜 아기 이름' },
    { id: 'pet' as Category, name: '반려동물', emoji: '🐶', desc: '귀여운 펫 이름' },
    { id: 'game' as Category, name: '게임 닉네임', emoji: '🎮', desc: '멋진 게임 닉네임' },
    { id: 'social' as Category, name: 'SNS 닉네임', emoji: '✨', desc: '감성적인 닉네임' },
    { id: 'business' as Category, name: '비즈니스', emoji: '💼', desc: '전문적인 이름' },
    { id: 'random' as Category, name: '랜덤', emoji: '🎲', desc: '완전 랜덤 생성' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* 헤더 */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="text-6xl sm:text-7xl md:text-8xl mb-4 animate-bounce">
            ✨🎭✨
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            이름/닉네임 생성기
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-2">
            완벽한 이름을 찾아드려요!
          </p>
          <p className="text-sm sm:text-base text-white/70">
            카테고리를 선택하고 생성 버튼을 눌러보세요
          </p>
        </header>

        {/* 카테고리 선택 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-4">카테고리 선택</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 touch-manipulation ${
                  category === cat.id
                    ? 'bg-white text-purple-600 border-white scale-105 shadow-2xl'
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50'
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2">{cat.emoji}</div>
                <div className="text-sm sm:text-base font-bold mb-1">{cat.name}</div>
                <div className="text-xs text-current opacity-70">{cat.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* 생성 결과 */}
        <section className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-4 min-h-[100px] flex items-center justify-center">
              {generatedName || '???'}
            </div>
            {generatedName && (
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold transition-all duration-300 mb-4 touch-manipulation"
              >
                📋 복사하기
              </button>
            )}
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-4 sm:py-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 active:scale-95 rounded-2xl text-white text-xl sm:text-2xl font-black transition-all duration-300 shadow-xl hover:shadow-2xl touch-manipulation"
          >
            🎲 새로운 이름 생성하기!
          </button>
        </section>

        {/* 히스토리 */}
        {history.length > 0 && (
          <section className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">생성 기록</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {history.map((name, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    navigator.clipboard.writeText(name);
                    alert(`"${name}" 복사됨!`);
                  }}
                  className="bg-white/20 hover:bg-white/30 rounded-xl p-3 text-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-105 touch-manipulation"
                >
                  {name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </main>
  );
}
