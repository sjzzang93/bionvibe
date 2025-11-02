"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

const CATEGORIES = {
  animal: {
    name: '동물',
    emoji: '🐾',
    items: [
      { name: '강아지', emoji: '🐕', traits: ['충성스러움', '활발함', '애교쟁이'] },
      { name: '고양이', emoji: '🐱', traits: ['도도함', '독립적', '귀여움'] },
      { name: '토끼', emoji: '🐰', traits: ['순둥이', '겁많음', '귀염둥이'] },
      { name: '여우', emoji: '🦊', traits: ['영리함', '신비로움', '재치있음'] },
      { name: '판다', emoji: '🐼', traits: ['느긋함', '귀여움', '먹보'] },
      { name: '사자', emoji: '🦁', traits: ['카리스마', '리더십', '당당함'] },
      { name: '펭귄', emoji: '🐧', traits: ['귀여움', '충실함', '뒤뚱뒤뚱'] },
      { name: '부엉이', emoji: '🦉', traits: ['지혜로움', '밤형인간', '신중함'] },
    ]
  },
  job: {
    name: '직업',
    emoji: '💼',
    items: [
      { name: '아티스트', emoji: '🎨', traits: ['창의적', '자유로움', '감성적'] },
      { name: '과학자', emoji: '🔬', traits: ['논리적', '탐구적', '분석적'] },
      { name: 'CEO', emoji: '👔', traits: ['리더십', '결단력', '추진력'] },
      { name: '요리사', emoji: '👨‍🍳', traits: ['섬세함', '열정적', '창의적'] },
      { name: '가수', emoji: '🎤', traits: ['표현력', '감성적', '끼많음'] },
      { name: '의사', emoji: '⚕️', traits: ['책임감', '섬세함', '헌신적'] },
      { name: '선생님', emoji: '👨‍🏫', traits: ['인내심', '소통능력', '배려심'] },
      { name: '운동선수', emoji: '⚽', traits: ['끈기', '체력', '승부욕'] },
    ]
  },
  character: {
    name: '캐릭터',
    emoji: '🎭',
    items: [
      { name: '슈퍼맨', emoji: '🦸', traits: ['정의로움', '강인함', '히어로'] },
      { name: '아이언맨', emoji: '🤖', traits: ['똑똑함', '부자', '자신감'] },
      { name: '해리포터', emoji: '🪄', traits: ['용감함', '우정', '마법사'] },
      { name: '셜록홈즈', emoji: '🕵️', traits: ['추리력', '관찰력', '천재'] },
      { name: '엘사', emoji: '❄️', traits: ['우아함', '능력자', '여왕'] },
      { name: '스폰지밥', emoji: '🧽', traits: ['긍정적', '친절함', '순수함'] },
      { name: '피카츄', emoji: '⚡', traits: ['귀여움', '전기능력', '충성심'] },
      { name: '도라에몽', emoji: '🤖', traits: ['도움', '친근함', '미래에서 옴'] },
    ]
  },
  food: {
    name: '음식',
    emoji: '🍔',
    items: [
      { name: '피자', emoji: '🍕', traits: ['인기많음', '다재다능', '모두가 좋아함'] },
      { name: '초밥', emoji: '🍣', traits: ['고급스러움', '섬세함', '정갈함'] },
      { name: '햄버거', emoji: '🍔', traits: ['활발함', '편안함', '대중적'] },
      { name: '케이크', emoji: '🎂', traits: ['달콤함', '축하', '특별함'] },
      { name: '라면', emoji: '🍜', traits: ['간편함', '뜨거움', '인기'] },
      { name: '아이스크림', emoji: '🍦', traits: ['시원함', '달콤함', '인기'] },
      { name: '커피', emoji: '☕', traits: ['쌉쌀함', '활력', '중독성'] },
      { name: '스테이크', emoji: '🥩', traits: ['고급스러움', '풍부함', '만족감'] },
    ]
  }
};

export default function WhatIfTransformer() {
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES | null>(null);
  const [result, setResult] = useState<any>(null);

  const transform = () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요!');
      return;
    }

    // 이름을 숫자로 변환 (간단한 해시)
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 카테고리에서 아이템 선택
    const items = CATEGORIES[selectedCategory].items;
    const index = Math.abs(hash) % items.length;
    const selected = items[index];

    // 궁합도 계산 (랜덤)
    const compatibility = 60 + Math.floor(Math.random() * 40);

    // 특징 분석
    const traits = selected.traits;

    setResult({
      ...selected,
      compatibility,
      category: CATEGORIES[selectedCategory].name,
      categoryEmoji: CATEGORIES[selectedCategory].emoji
    });
  };

  const getCompatibilityLevel = (score: number) => {
    if (score >= 90) return { label: '완벽한 매치!', color: 'from-pink-500 to-red-500', emoji: '💯' };
    if (score >= 75) return { label: '찰떡궁합', color: 'from-purple-500 to-pink-500', emoji: '✨' };
    if (score >= 60) return { label: '잘 맞아요', color: 'from-blue-500 to-purple-500', emoji: '👍' };
    return { label: '괜찮아요', color: 'from-yellow-500 to-orange-500', emoji: '😊' };
  };

  return (
    <PremiumLayout theme="pink">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">
            🎭 내가 만약 XXX라면?
          </h1>
          <p className="text-xl text-white/80">이름으로 알아보는 나의 다른 모습</p>
        </div>

        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-6 text-center">👤 정보 입력</h3>

          <div className="mb-6">
            <label className="text-white font-bold mb-2 block">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              maxLength={20}
              className="w-full px-4 py-3 rounded-lg text-black text-center text-2xl font-bold"
              style={{ fontSize: '24px' }}
            />
          </div>

          <div className="mb-6">
            <label className="text-white font-bold mb-2 block">카테고리 선택</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCategory(key as keyof typeof CATEGORIES)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedCategory === key
                      ? 'bg-white text-purple-600 scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <div className="font-bold">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          <PremiumButton onClick={transform} variant="primary" size="lg" icon="✨" fullWidth>
            변신하기!
          </PremiumButton>
        </PremiumCard>

        {result && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient>
              <div className="text-center">
                <div className="text-8xl mb-6 animate-bounce-slow">{result.emoji}</div>
                <div className="text-white/70 mb-2">내가 {result.category}라면?</div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  {result.name}
                </h2>
                <div className={`inline-block px-8 py-3 rounded-full font-bold text-xl text-white bg-gradient-to-r ${getCompatibilityLevel(result.compatibility).color} mb-4`}>
                  {getCompatibilityLevel(result.compatibility).emoji} {getCompatibilityLevel(result.compatibility).label}
                </div>
                <div className="text-white/80 text-lg">궁합도: {result.compatibility}%</div>
              </div>
            </PremiumCard>

            <PremiumCard hover>
              <h3 className="text-white text-2xl font-bold mb-4 text-center">✨ 특징</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.traits.map((trait: string, i: number) => (
                  <div key={i} className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 text-center">
                    <div className="text-white font-bold text-lg">{trait}</div>
                  </div>
                ))}
              </div>
            </PremiumCard>

            <PremiumCard hover>
              <h3 className="text-white text-2xl font-bold mb-4 text-center">🎯 분석 결과</h3>
              <div className="space-y-3 text-white/90">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💫</span>
                    <span className="font-bold">나와 찰떡인 이유</span>
                  </div>
                  <p>당신의 이름 "{name}"은(는) {result.name}의 특성과 {result.compatibility}% 일치해요!</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🌟</span>
                    <span className="font-bold">대표 특징</span>
                  </div>
                  <p>{result.traits[0]}한 성격을 가지고 있어요</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💖</span>
                    <span className="font-bold">이런 점이 매력적</span>
                  </div>
                  <p>{result.traits[1]}하고 {result.traits[2]}한 모습이 돋보여요</p>
                </div>
              </div>
            </PremiumCard>

            <PremiumButton
              onClick={() => {
                setResult(null);
                setName('');
                setSelectedCategory(null);
              }}
              variant="secondary"
              size="lg"
              icon="🔄"
              fullWidth
            >
              다시 해보기
            </PremiumButton>
          </div>
        )}

        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="what-if-transformer" className="mt-8" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.1) rotate(5deg); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </PremiumLayout>
  );
}
