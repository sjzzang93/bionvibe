"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

// 한국 성씨 통계 (상위 50개)
const SURNAMES: any = {
  '김': 21.6, '이': 14.8, '박': 8.5, '최': 4.7, '정': 4.4,
  '강': 2.5, '조': 2.2, '윤': 2.1, '장': 2.0, '임': 1.7,
  '한': 1.4, '오': 1.3, '서': 1.2, '신': 1.1, '권': 1.0,
  '황': 1.0, '안': 0.9, '송': 0.9, '전': 0.8, '홍': 0.7,
  '유': 0.7, '고': 0.6, '문': 0.6, '양': 0.6, '손': 0.5,
  '배': 0.5, '백': 0.4, '허': 0.4, '남': 0.3, '심': 0.3,
};

// 이름 통계 (추정치)
const NAME_CHARS: any = {
  '민': 5.2, '서': 4.8, '지': 4.5, '준': 4.2, '현': 3.9,
  '수': 3.7, '영': 3.5, '은': 3.3, '우': 3.0, '하': 2.8,
  '진': 2.6, '성': 2.4, '도': 2.2, '재': 2.0, '윤': 1.8,
  '주': 1.6, '희': 1.5, '경': 1.4, '연': 1.3, '혜': 1.2,
};

export default function NameRarity() {
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!fullName || fullName.length < 2) {
      alert('이름을 입력해주세요!');
      return;
    }

    const surname = fullName[0];
    const givenName = fullName.slice(1);

    // 성 희귀도
    const surnameRate = SURNAMES[surname] || 0.1;
    const surnameRarity = 100 - surnameRate * 5;

    // 이름 희귀도 계산
    let nameRarity = 50;
    for (let char of givenName) {
      const charRate = NAME_CHARS[char] || 0.5;
      nameRarity += (5 - charRate);
    }
    nameRarity = Math.min(100, Math.max(0, nameRarity));

    // 출생연도 보정 (선택사항)
    let yearBonus = 0;
    if (birthYear) {
      const year = parseInt(birthYear);
      if (year >= 1990 && year <= 2000) {
        // 90년대생은 특정 이름이 많았음
        yearBonus = -5;
      } else if (year >= 2010) {
        // 2010년대 이후는 다양한 이름
        yearBonus = 5;
      } else if (year < 1970) {
        // 70년대 이전은 전통 이름
        yearBonus = 3;
      }
    }

    // 오늘의 운세 요소 (날짜 기반 랜덤, 같은 날은 같은 결과)
    const today = new Date().toDateString();
    const todaySeed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const nameSeed = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const combinedSeed = todaySeed + nameSeed;
    const dailyVariation = (combinedSeed % 10) - 5; // -5 ~ +4 변동

    // 전체 희귀도
    const totalRarity = Math.min(100, Math.max(0, (surnameRarity + nameRarity) / 2 + yearBonus + dailyVariation));

    // 예상 동명이인
    const koreanPop = 51000000;
    const estimatedSame = Math.floor(koreanPop * (1 - totalRarity / 100) * 0.01);

    // 글자 수 통계
    const nameLength = fullName.length;
    let lengthComment = '';
    if (nameLength === 2) lengthComment = '2글자 이름은 약 5%로 매우 희귀해요!';
    else if (nameLength === 3) lengthComment = '3글자 이름이 가장 일반적이에요 (약 80%)';
    else if (nameLength === 4) lengthComment = '4글자 이름은 약 15%예요';
    else lengthComment = '특이한 길이의 이름이네요!';

    setResult({
      fullName,
      surname,
      givenName,
      surnameRarity: surnameRarity.toFixed(1),
      nameRarity: nameRarity.toFixed(1),
      totalRarity: totalRarity.toFixed(1),
      estimatedSame: estimatedSame.toLocaleString(),
      lengthComment,
      surnameRank: Object.keys(SURNAMES).indexOf(surname) + 1
    });
  };

  const getRarityLevel = (score: number) => {
    if (score >= 90) return { label: '초희귀', emoji: '👑', color: 'from-purple-500 to-pink-500' };
    if (score >= 70) return { label: '희귀', emoji: '💎', color: 'from-blue-500 to-purple-500' };
    if (score >= 50) return { label: '보통', emoji: '⭐', color: 'from-yellow-500 to-orange-500' };
    if (score >= 30) return { label: '흔한편', emoji: '📋', color: 'from-green-500 to-blue-500' };
    return { label: '매우 흔함', emoji: '📝', color: 'from-gray-500 to-gray-600' };
  };

  return (
    <PremiumLayout theme="blue">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            📛 내 이름 희귀도
          </h1>
          <p className="text-xl text-white/80">동명이인이 몇 명이나 있을까?</p>
        </div>

        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-6 text-center">✍️ 이름 입력</h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-white font-bold mb-2 block">이름 (필수)</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value.trim())}
                placeholder="홍길동"
                maxLength={10}
                className="w-full px-4 py-4 rounded-lg text-black text-center text-3xl font-bold"
                style={{ fontSize: '32px' }}
              />
            </div>

            <div>
              <label className="text-white font-bold mb-2 block">출생연도 (선택 - 더 정확한 분석)</label>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="예: 1995"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 rounded-lg text-black text-center text-xl font-bold"
                style={{ fontSize: '20px' }}
              />
              <p className="text-white/70 text-sm mt-2">
                💡 출생연도별 이름 트렌드를 반영해요
              </p>
            </div>
          </div>

          <PremiumButton onClick={analyze} variant="primary" size="lg" icon="🔍" fullWidth>
            희귀도 분석하기
          </PremiumButton>
        </PremiumCard>

        {result && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient>
              <div className="text-center">
                <div className="text-7xl mb-4 animate-bounce-slow">
                  {getRarityLevel(parseFloat(result.totalRarity)).emoji}
                </div>
                <h3 className="text-white text-3xl font-bold mb-4">{result.fullName}</h3>
                <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  {result.totalRarity}점
                </div>
                <div className={`inline-block px-8 py-3 rounded-full font-bold text-2xl text-white bg-gradient-to-r ${getRarityLevel(parseFloat(result.totalRarity)).color}`}>
                  {getRarityLevel(parseFloat(result.totalRarity)).label}
                </div>
              </div>
            </PremiumCard>

            <div className="grid md:grid-cols-2 gap-6">
              <PremiumCard hover>
                <div className="text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <h4 className="text-white font-bold text-xl mb-2">예상 동명이인</h4>
                  <div className="text-5xl font-bold text-cyan-300">{result.estimatedSame}명</div>
                  <p className="text-white/70 text-sm mt-2">한국 인구 5100만명 중</p>
                </div>
              </PremiumCard>

              <PremiumCard hover>
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <h4 className="text-white font-bold text-xl mb-2">성씨 순위</h4>
                  <div className="text-5xl font-bold text-yellow-300">
                    {result.surnameRank || '50+'}위
                  </div>
                  <p className="text-white/70 text-sm mt-2">"{result.surname}"씨</p>
                </div>
              </PremiumCard>
            </div>

            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">📈 상세 분석</h4>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold">성 희귀도 ("{result.surname}")</span>
                    <span className="text-cyan-300 font-bold">{result.surnameRarity}점</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full"
                      style={{ width: `${result.surnameRarity}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold">이름 희귀도 ("{result.givenName}")</span>
                    <span className="text-purple-300 font-bold">{result.nameRarity}점</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full"
                      style={{ width: `${result.nameRarity}%` }}
                    />
                  </div>
                </div>

                <div className="bg-blue-500/20 rounded-lg p-4">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-2">📏</div>
                    <p>{result.lengthComment}</p>
                  </div>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">💡 재미있는 사실</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏆</span>
                  <p>한국에서 가장 많은 성씨는 "김"씨로 전체 인구의 21.6%</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <p>김, 이, 박 3대 성씨가 전체 인구의 45%를 차지해요</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <p>최근 트렌드는 2글자 이름이 늘어나는 추세!</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎲</span>
                  <p>매일 조금씩 다른 결과가 나와요! 오늘의 운세 요소가 포함되어 있어요</p>
                </div>
                {birthYear && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📅</span>
                    <p>
                      {parseInt(birthYear) >= 2010 ? '2010년대생은 다양한 이름이 많아 희귀도가 높아요!' :
                       parseInt(birthYear) >= 1990 && parseInt(birthYear) <= 2000 ? '90년대생은 특정 이름이 많아 희귀도가 낮아요' :
                       parseInt(birthYear) < 1970 ? '70년대 이전 세대는 전통 이름이 많아요' :
                       '출생연도별 트렌드가 반영되었어요'}
                    </p>
                  </div>
                )}
              </div>
            </PremiumCard>
          </div>
        )}

        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="name-rarity" className="mt-8" />
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
