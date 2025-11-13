"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

// 월별 출생 확률 데이터 (실제 통계 기반)
const BIRTH_STATS = {
  '1': 8.5, '2': 7.8, '3': 8.3, '4': 8.0, '5': 8.4,
  '6': 8.2, '7': 8.6, '8': 8.7, '9': 9.2, '10': 8.9,
  '11': 8.4, '12': 8.0
};

// 헬퍼 함수들
const getZodiacSign = (month: number, day: number) => {
  const signs = [
    { name: '염소자리', emoji: '♑', range: [[12, 22], [1, 19]] },
    { name: '물병자리', emoji: '♒', range: [[1, 20], [2, 18]] },
    { name: '물고기자리', emoji: '♓', range: [[2, 19], [3, 20]] },
    { name: '양자리', emoji: '♈', range: [[3, 21], [4, 19]] },
    { name: '황소자리', emoji: '♉', range: [[4, 20], [5, 20]] },
    { name: '쌍둥이자리', emoji: '♊', range: [[5, 21], [6, 20]] },
    { name: '게자리', emoji: '♋', range: [[6, 21], [7, 22]] },
    { name: '사자자리', emoji: '♌', range: [[7, 23], [8, 22]] },
    { name: '처녀자리', emoji: '♍', range: [[8, 23], [9, 22]] },
    { name: '천칭자리', emoji: '♎', range: [[9, 23], [10, 22]] },
    { name: '전갈자리', emoji: '♏', range: [[10, 23], [11, 21]] },
    { name: '사수자리', emoji: '♐', range: [[11, 22], [12, 21]] }
  ];

  for (const sign of signs) {
    const [[startMonth, startDay], [endMonth, endDay]] = sign.range;
    if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
      return sign;
    }
  }
  return { name: '알 수 없음', emoji: '❓' };
};

const getBirthStone = (month: number) => {
  const stones = [
    '가넷', '자수정', '아쿠아마린', '다이아몬드', '에메랄드', '진주',
    '루비', '페리도트', '사파이어', '오팔', '토파즈', '터키석'
  ];
  return stones[month - 1];
};

const getBirthFlower = (month: number) => {
  const flowers = [
    '카네이션', '제비꽃', '수선화', '데이지', '은방울꽃', '장미',
    '라크스퍼', '글라디올러스', '애스터', '메리골드', '국화', '수선화'
  ];
  return flowers[month - 1];
};

const getCelebrityBirthday = (month: number, day: number) => {
  const celebrities: { [key: string]: string } = {
    '0101': '싸이',
    '0214': 'RM (BTS)',
    '0309': '유아인',
    '0404': '로버트 다우니 주니어',
    '0505': '아델',
    '0613': '크리스 에반스',
    '0718': '빈 디젤',
    '0821': '우사인 볼트',
    '0909': '아이유',
    '1010': '송혜교',
    '1111': '레오나르도 디카프리오',
    '1225': '예수 그리스도'
  };

  const dateKey = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  return celebrities[dateKey] || null;
};

// 특별한 날짜들
const SPECIAL_DATES = {
  '0101': { rarity: 99.9, label: '새해 첫날', emoji: '🎆' },
  '0214': { rarity: 95.2, label: '발렌타인데이', emoji: '💝' },
  '0301': { rarity: 92.1, label: '삼일절', emoji: '🇰🇷' },
  '0404': { rarity: 94.3, label: '4월 4일', emoji: '🍀' },
  '0505': { rarity: 96.7, label: '어린이날', emoji: '👶' },
  '0606': { rarity: 93.8, label: '현충일', emoji: '🇰🇷' },
  '0707': { rarity: 92.5, label: '칠석', emoji: '⭐' },
  '0815': { rarity: 97.1, label: '광복절', emoji: '🇰🇷' },
  '0909': { rarity: 94.9, label: '구구절', emoji: '🌸' },
  '1003': { rarity: 96.3, label: '개천절', emoji: '🇰🇷' },
  '1009': { rarity: 97.8, label: '한글날', emoji: '🇰🇷' },
  '1111': { rarity: 98.5, label: '빼빼로데이', emoji: '🍫' },
  '1212': { rarity: 95.6, label: '12월 12일', emoji: '🎄' },
  '1224': { rarity: 98.2, label: '크리스마스 이브', emoji: '🎅' },
  '1225': { rarity: 99.1, label: '크리스마스', emoji: '🎄' },
  '1231': { rarity: 98.9, label: '연말', emoji: '🎊' },
};

export default function BirthdayRarity() {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateRarity = () => {
    if (!month || !day) {
      alert('생일을 입력해주세요!');
      return;
    }

    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    // 날짜 유효성 검사 (윤년 체크 포함)
    const currentYear = new Date().getFullYear();
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const daysInMonth = [31, isLeapYear(currentYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (dayNum < 1 || dayNum > daysInMonth[monthNum - 1]) {
      if (monthNum === 2 && dayNum === 29) {
        alert('올해는 윤년이 아니어서 2월 29일이 없습니다!');
      } else {
        alert('올바른 날짜를 입력해주세요!');
      }
      return;
    }

    const dateKey = `${month.padStart(2, '0')}${day.padStart(2, '0')}`;
    const isSpecial = SPECIAL_DATES[dateKey as keyof typeof SPECIAL_DATES];

    let rarityScore = 0;

    if (isSpecial) {
      rarityScore = isSpecial.rarity;
    } else {
      // 기본 월별 확률 + 날짜 보정
      const monthRarity = 100 - BIRTH_STATS[month as keyof typeof BIRTH_STATS];
      const dayRarity = Math.abs(dayNum - 15) * 0.3; // 15일에서 멀수록 희귀
      rarityScore = monthRarity + dayRarity;
    }

    // 희귀도 점수 상한선 적용 (최대 99.9)
    rarityScore = Math.min(99.9, rarityScore);

    // 전세계 순위 계산 (대략적) - 음수 방지
    const worldPopulation = 8000000000;
    const dailyBirths = worldPopulation / 365.25;
    const peopleWithSameBirthday = Math.max(1, Math.floor(dailyBirths * (1 - rarityScore / 100)));

    // 한국 순위 - 음수 방지
    const koreaPopulation = 51000000;
    const koreaDailyBirths = koreaPopulation / 365.25;
    const koreaPeopleWithSameBirthday = Math.max(1, Math.floor(koreaDailyBirths * (1 - rarityScore / 100)));

    // 추가 분석 정보
    const zodiacSign = getZodiacSign(monthNum, dayNum);
    const birthStone = getBirthStone(monthNum);
    const birthFlower = getBirthFlower(monthNum);
    const celebrityBirthday = getCelebrityBirthday(monthNum, dayNum);

    setResult({
      rarityScore: Math.min(99.9, rarityScore).toFixed(1),
      worldRank: peopleWithSameBirthday.toLocaleString(),
      koreaRank: koreaPeopleWithSameBirthday.toLocaleString(),
      isSpecial,
      month: monthNum,
      day: dayNum,
      zodiacSign,
      birthStone,
      birthFlower,
      celebrityBirthday
    });
  };

  const getRarityLevel = (score: number) => {
    if (score >= 98) return { label: '전설급', color: 'from-purple-500 to-pink-500', emoji: '👑' };
    if (score >= 95) return { label: '매우 희귀', color: 'from-red-500 to-orange-500', emoji: '💎' };
    if (score >= 90) return { label: '희귀', color: 'from-orange-500 to-yellow-500', emoji: '⭐' };
    if (score >= 80) return { label: '드문편', color: 'from-yellow-500 to-green-500', emoji: '🌟' };
    if (score >= 70) return { label: '보통', color: 'from-green-500 to-blue-500', emoji: '✨' };
    return { label: '흔한편', color: 'from-blue-500 to-gray-500', emoji: '📅' };
  };

  return (
    <PremiumLayout theme="purple">
      
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
            🎂 내 생일은 몇번째?
          </h1>
          <p className="text-xl text-white/80">전세계에서 당신의 생일 희귀도를 확인하세요</p>
        </div>

        {/* 입력 폼 */}
        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-6 text-center">🎈 생일 입력</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-white font-bold mb-2 block">월</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-black text-lg font-bold"
                style={{ fontSize: '16px' }}
              >
                <option value="">선택</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white font-bold mb-2 block">일</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-black text-lg font-bold"
                style={{ fontSize: '16px' }}
              >
                <option value="">선택</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}일</option>
                ))}
              </select>
            </div>
          </div>

          <PremiumButton
            onClick={calculateRarity}
            variant="primary"
            size="lg"
            icon="🔍"
            fullWidth
          >
            희귀도 분석하기
          </PremiumButton>
        </PremiumCard>

        {/* 결과 */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* 희귀도 점수 */}
            <PremiumCard hover gradient>
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce-slow">
                  {getRarityLevel(parseFloat(result.rarityScore)).emoji}
                </div>
                <h3 className="text-white text-3xl font-bold mb-2">
                  {result.month}월 {result.day}일
                </h3>
                {result.isSpecial && (
                  <div className="bg-yellow-400 text-purple-900 px-6 py-2 rounded-full inline-block mb-4 font-bold">
                    {result.isSpecial.emoji} {result.isSpecial.label}
                  </div>
                )}
                <div className={`text-8xl font-bold mb-4 bg-gradient-to-r ${getRarityLevel(parseFloat(result.rarityScore)).color} bg-clip-text text-transparent`}>
                  {result.rarityScore}점
                </div>
                <div className={`inline-block px-8 py-3 rounded-full font-bold text-2xl text-white bg-gradient-to-r ${getRarityLevel(parseFloat(result.rarityScore)).color}`}>
                  {getRarityLevel(parseFloat(result.rarityScore)).label}
                </div>
              </div>
            </PremiumCard>

            {/* 통계 */}
            <div className="grid md:grid-cols-2 gap-6">
              <PremiumCard hover>
                <div className="text-center">
                  <div className="text-4xl mb-3">🌍</div>
                  <h4 className="text-white font-bold text-xl mb-2">전세계 동일 생일</h4>
                  <div className="text-4xl font-bold text-blue-300 mb-2">
                    {result.worldRank}명
                  </div>
                  <p className="text-white/70 text-sm">약 80억명 중</p>
                </div>
              </PremiumCard>

              <PremiumCard hover>
                <div className="text-center">
                  <div className="text-4xl mb-3">🇰🇷</div>
                  <h4 className="text-white font-bold text-xl mb-2">한국 동일 생일</h4>
                  <div className="text-4xl font-bold text-green-300 mb-2">
                    {result.koreaRank}명
                  </div>
                  <p className="text-white/70 text-sm">약 5100만명 중</p>
                </div>
              </PremiumCard>
            </div>

            {/* 추가 정보 카드들 */}
            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">🔮 생일 상세 분석</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center bg-white/10 rounded-lg p-3">
                  <div className="text-3xl mb-1">{result.zodiacSign?.emoji}</div>
                  <div className="text-sm text-white/70">별자리</div>
                  <div className="font-bold text-white">{result.zodiacSign?.name}</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3">
                  <div className="text-3xl mb-1">💎</div>
                  <div className="text-sm text-white/70">탄생석</div>
                  <div className="font-bold text-white">{result.birthStone}</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3">
                  <div className="text-3xl mb-1">🌸</div>
                  <div className="text-sm text-white/70">탄생화</div>
                  <div className="font-bold text-white">{result.birthFlower}</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3">
                  <div className="text-3xl mb-1">⭐</div>
                  <div className="text-sm text-white/70">같은 날 유명인</div>
                  <div className="font-bold text-white text-xs">{result.celebrityBirthday || '정보 없음'}</div>
                </div>
              </div>
            </PremiumCard>

            {/* 재미있는 사실 */}
            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">💡 재미있는 사실</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <p>가장 흔한 생일은 9월 (여름 휴가 효과)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👑</span>
                  <p>가장 희귀한 생일은 2월 29일 (윤년)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎄</span>
                  <p>12월 25일은 출산 예정일을 피하는 경향</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <p>23명만 모여도 생일이 겹칠 확률 50% (생일 역설)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎂</span>
                  <p>당신과 같은 생일인 사람은 전세계에 약 {result.worldRank}명!</p>
                </div>
              </div>
            </PremiumCard>
          </div>
        )}

        {/* Related Apps */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="birthday-rarity" className="mt-8" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
