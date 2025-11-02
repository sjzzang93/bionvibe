"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

// 헬퍼 함수들
const getGeneration = (age: number) => {
  const birthYear = new Date().getFullYear() - age;
  if (birthYear >= 2010) return { name: '알파 세대', emoji: '👶', desc: '디지털 네이티브, AI와 함께 성장' };
  if (birthYear >= 1997) return { name: 'Z세대', emoji: '📱', desc: 'SNS 네이티브, 다양성 중시' };
  if (birthYear >= 1981) return { name: '밀레니얼', emoji: '💻', desc: '인터넷 보급과 함께 성장' };
  if (birthYear >= 1965) return { name: 'X세대', emoji: '📺', desc: 'TV 문화의 전성기' };
  if (birthYear >= 1946) return { name: '베이비붐', emoji: '👔', desc: '경제 성장기의 주역' };
  return { name: '침묵의 세대', emoji: '📻', desc: '전통 가치 중시' };
};

const getZodiacYear = (age: number) => {
  const birthYear = new Date().getFullYear() - age;
  const zodiacAnimals = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  const index = (birthYear - 4) % 12;
  return zodiacAnimals[index >= 0 ? index : index + 12];
};

export default function AgeGapCalculator() {
  const [myAge, setMyAge] = useState('');
  const [theirAge, setTheirAge] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const my = parseInt(myAge);
    const their = parseInt(theirAge);

    if (!my || !their || my < 1 || their < 1 || my > 120 || their > 120) {
      alert('올바른 나이를 입력해주세요!');
      return;
    }

    const gap = Math.abs(my - their);
    const isOlder = my > their;

    // 재미있는 표현
    let funFacts = [];

    if (gap === 0) {
      funFacts.push('🎂 완벽한 동갑! 추억 공유하기 최고!');
      funFacts.push('📺 같은 만화, 같은 드라마를 봤을 확률 99%');
    } else if (gap === 1) {
      funFacts.push('📚 학교에서 선후배 사이였을 수도!');
    } else if (gap <= 3) {
      funFacts.push('🎮 취향이 비슷할 가능성 높아요');
      funFacts.push('🎵 좋아하는 음악이 겹칠 거예요');
    } else if (gap <= 5) {
      funFacts.push('🌟 적당한 나이 차! 배울 점이 많아요');
    } else if (gap <= 10) {
      funFacts.push('👥 세대 차이가 느껴질 수 있어요');
      funFacts.push('📱 스마트폰 사용 패턴이 다를 수 있어요');
    } else if (gap <= 20) {
      funFacts.push('🎭 확실한 세대 차이가 있어요');
      funFacts.push('📻 유행했던 문화가 완전히 달라요');
    } else {
      funFacts.push('🌍 완전히 다른 시대를 살았어요');
      funFacts.push('💫 부모님뻘 나이 차이에요');
    }

    // 나이차로 할 수 있는 것들
    const activities = [];
    if (gap <= 5) {
      activities.push('같이 클럽 가기 ✨', '트렌디한 카페 투어 ☕', '최신 영화 보기 🎬');
    } else if (gap <= 10) {
      activities.push('세대차이 대화 나누기 💬', '서로의 추억 공유하기 📖', '세대별 음악 공유 🎵');
    } else {
      activities.push('인생 조언 듣기 💡', '추억의 이야기 듣기 📚', '경험 공유하기 🌟');
    }

    // 연도 차이
    const years = Math.floor(gap);
    const months = Math.round((gap - years) * 12);

    // 한국 나이
    const myKoreanAge = my + 1;
    const theirKoreanAge = their + 1;

    // 세대 및 띠 분석
    const myGen = getGeneration(my);
    const theirGen = getGeneration(their);
    const myZodiac = getZodiacYear(my);
    const theirZodiac = getZodiacYear(their);

    // 궁합 점수 계산 (더 복잡하게)
    let compatibilityScore = 100;
    if (gap > 0) compatibilityScore -= gap * 1.5;
    if (gap > 10) compatibilityScore -= 10;
    if (gap > 20) compatibilityScore -= 20;
    if (myGen.name !== theirGen.name) compatibilityScore -= 5;

    // 띠 궁합 보너스
    const zodiacCompatibility: { [key: string]: string[] } = {
      '쥐': ['용', '원숭이', '소'],
      '소': ['뱀', '닭', '쥐'],
      '호랑이': ['말', '개', '돼지'],
      '토끼': ['양', '돼지', '개'],
      '용': ['쥐', '원숭이', '닭'],
      '뱀': ['소', '닭'],
      '말': ['호랑이', '개', '양'],
      '양': ['토끼', '말', '돼지'],
      '원숭이': ['쥐', '용'],
      '닭': ['소', '뱀', '용'],
      '개': ['호랑이', '토끼', '말'],
      '돼지': ['토끼', '양', '호랑이']
    };

    if (zodiacCompatibility[myZodiac]?.includes(theirZodiac)) {
      compatibilityScore += 15;
    }

    compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));

    // 나이별 인생 단계
    const getLifeStage = (age: number) => {
      if (age < 20) return '성장기';
      if (age < 30) return '청춘기';
      if (age < 40) return '성숙기';
      if (age < 50) return '중년기';
      if (age < 60) return '안정기';
      return '황금기';
    };

    setResult({
      gap,
      isOlder,
      funFacts,
      activities,
      years,
      months,
      myKoreanAge,
      theirKoreanAge,
      gapKorean: Math.abs(myKoreanAge - theirKoreanAge),
      myGen,
      theirGen,
      myZodiac,
      theirZodiac,
      compatibilityScore,
      myLifeStage: getLifeStage(my),
      theirLifeStage: getLifeStage(their)
    });
  };

  const getGapLevel = (gap: number) => {
    if (gap === 0) return { label: '완벽 동갑', emoji: '🎂', color: 'from-pink-500 to-red-500' };
    if (gap <= 2) return { label: '거의 동갑', emoji: '👫', color: 'from-purple-500 to-pink-500' };
    if (gap <= 5) return { label: '적당한 차이', emoji: '💑', color: 'from-blue-500 to-purple-500' };
    if (gap <= 10) return { label: '세대차 조금', emoji: '👥', color: 'from-yellow-500 to-orange-500' };
    if (gap <= 20) return { label: '확실한 세대차', emoji: '🌟', color: 'from-orange-500 to-red-500' };
    return { label: '부모님뻘', emoji: '👨‍👧', color: 'from-gray-500 to-gray-700' };
  };

  return (
    <PremiumLayout theme="purple">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
            👫 나이 차이 계산기
          </h1>
          <p className="text-xl text-white/80">두 사람의 나이 차를 재밌게 분석!</p>
        </div>

        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-6 text-center">🎂 나이 입력</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-white font-bold mb-2 block">내 나이 (만 나이)</label>
              <input
                type="number"
                value={myAge}
                onChange={(e) => setMyAge(e.target.value)}
                placeholder="예: 25"
                min="1"
                max="120"
                className="w-full px-4 py-3 rounded-lg text-black text-center text-2xl font-bold"
                style={{ fontSize: '24px' }}
              />
            </div>
            <div>
              <label className="text-white font-bold mb-2 block">상대 나이 (만 나이)</label>
              <input
                type="number"
                value={theirAge}
                onChange={(e) => setTheirAge(e.target.value)}
                placeholder="예: 28"
                min="1"
                max="120"
                className="w-full px-4 py-3 rounded-lg text-black text-center text-2xl font-bold"
                style={{ fontSize: '24px' }}
              />
            </div>
          </div>

          <PremiumButton onClick={calculate} variant="primary" size="lg" icon="🔍" fullWidth>
            나이 차이 계산하기
          </PremiumButton>
        </PremiumCard>

        {result && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient>
              <div className="text-center">
                <div className="text-7xl mb-4 animate-bounce-slow">
                  {getGapLevel(result.gap).emoji}
                </div>
                <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  {result.years}년 {result.months > 0 && `${result.months}개월`}
                </div>
                <div className={`inline-block px-8 py-3 rounded-full font-bold text-2xl text-white bg-gradient-to-r ${getGapLevel(result.gap).color}`}>
                  {getGapLevel(result.gap).label}
                </div>
                <p className="text-white text-xl mt-4">
                  {result.isOlder ? '당신이' : '상대방이'} {result.gap}살 더 많아요!
                </p>
              </div>
            </PremiumCard>

            <div className="grid md:grid-cols-2 gap-6">
              <PremiumCard hover>
                <h4 className="text-white font-bold text-xl mb-4 text-center">🎯 재미있는 사실</h4>
                <div className="space-y-3 text-white/90">
                  {result.funFacts.map((fact: string, i: number) => (
                    <div key={i} className="bg-white/10 rounded-lg p-3">{fact}</div>
                  ))}
                </div>
              </PremiumCard>

              <PremiumCard hover>
                <h4 className="text-white font-bold text-xl mb-4 text-center">🎉 함께 할 수 있는 것</h4>
                <div className="space-y-3 text-white/90">
                  {result.activities.map((activity: string, i: number) => (
                    <div key={i} className="bg-white/10 rounded-lg p-3">{activity}</div>
                  ))}
                </div>
              </PremiumCard>
            </div>

            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">📊 상세 정보</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/70 mb-2">만 나이 차이</div>
                  <div className="text-3xl font-bold text-white">{result.gap}살</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/70 mb-2">한국 나이 차이</div>
                  <div className="text-3xl font-bold text-white">{result.gapKorean}살</div>
                </div>
              </div>
            </PremiumCard>

            {/* 새로운 분석 카드들 추가 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 세대 분석 */}
              <PremiumCard hover>
                <h4 className="text-white font-bold text-xl mb-4 text-center">🌍 세대 분석</h4>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">내 세대</span>
                      <span className="font-bold text-white flex items-center gap-2">
                        {result.myGen?.emoji} {result.myGen?.name}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">{result.myGen?.desc}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">상대 세대</span>
                      <span className="font-bold text-white flex items-center gap-2">
                        {result.theirGen?.emoji} {result.theirGen?.name}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">{result.theirGen?.desc}</div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="inline-block px-4 py-2 rounded-full bg-white/20 text-white font-bold">
                      {result.myGen?.name === result.theirGen?.name ? '같은 세대' : '다른 세대'}
                    </div>
                  </div>
                </div>
              </PremiumCard>

              {/* 띠 궁합 */}
              <PremiumCard hover>
                <h4 className="text-white font-bold text-xl mb-4 text-center">🐉 띠 궁합</h4>
                <div className="text-center mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-3xl mb-1">{result.myZodiac}띠</div>
                      <div className="text-sm text-white/70">나</div>
                    </div>
                    <div>
                      <div className="text-3xl mb-1">{result.theirZodiac}띠</div>
                      <div className="text-sm text-white/70">상대</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-300 mb-2">
                      {result.compatibilityScore}%
                    </div>
                    <div className="text-white/70 text-sm">궁합 점수</div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm">
                    {result.compatibilityScore >= 80 ? '💖 천생연분' :
                     result.compatibilityScore >= 60 ? '💕 좋은 궁합' :
                     result.compatibilityScore >= 40 ? '💛 노력 필요' :
                     '💔 도전적인 관계'}
                  </div>
                </div>
              </PremiumCard>
            </div>

            {/* 인생 단계 */}
            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">🌟 인생 단계 분석</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/70 mb-2">나의 인생 단계</div>
                  <div className="text-2xl font-bold text-white">{result.myLifeStage}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/70 mb-2">상대의 인생 단계</div>
                  <div className="text-2xl font-bold text-white">{result.theirLifeStage}</div>
                </div>
              </div>
              <div className="mt-4 text-center text-white/80 text-sm">
                {result.myLifeStage === result.theirLifeStage
                  ? '🎯 같은 인생 단계를 걷고 있어 공감대가 높아요!'
                  : '🌈 다른 인생 단계를 통해 서로 배울 점이 많아요!'}
              </div>
            </PremiumCard>
          </div>
        )}

        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="age-gap-calculator" className="mt-8" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </PremiumLayout>
  );
}
