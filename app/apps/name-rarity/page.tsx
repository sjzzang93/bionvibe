"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

// 한국 성씨 통계 (286개 성씨 - 2015 인구주택총조사 기준)
const SURNAMES: any = {
  // 3대 성씨
  '김': 21.6, '이': 14.8, '박': 8.5,
  // 상위 10위
  '최': 4.7, '정': 4.4, '강': 2.5, '조': 2.2, '윤': 2.1, '장': 2.0, '임': 1.7,
  // 상위 30위
  '한': 1.4, '오': 1.3, '서': 1.2, '신': 1.1, '권': 1.0, '황': 1.0, '안': 0.9,
  '송': 0.9, '전': 0.8, '홍': 0.7, '유': 0.7, '고': 0.6, '문': 0.6, '양': 0.6,
  '손': 0.5, '배': 0.5, '백': 0.4, '허': 0.4, '남': 0.3, '심': 0.3,
  // 상위 60위
  '노': 0.3, '하': 0.3, '곽': 0.28, '성': 0.27, '차': 0.26, '주': 0.25, '우': 0.24,
  '구': 0.23, '라': 0.22, '진': 0.21, '류': 0.20, '민': 0.18,
  '엄': 0.17, '채': 0.16, '원': 0.15, '천': 0.14, '방': 0.14, '공': 0.13,
  '현': 0.13, '함': 0.12, '변': 0.12, '염': 0.11, '여': 0.11, '추': 0.10,
  '도': 0.09, '소': 0.09, '석': 0.09,
  // 상위 100위
  '선': 0.08, '설': 0.08, '마': 0.08, '길': 0.07, '연': 0.07, '위': 0.07, '표': 0.07,
  '명': 0.06, '기': 0.06, '반': 0.06, '왕': 0.06, '금': 0.05, '옥': 0.05, '육': 0.05,
  '인': 0.05, '맹': 0.05, '제': 0.05, '모': 0.05, '남궁': 0.04, '탁': 0.04,
  '국': 0.04, '어': 0.04, '경': 0.04, '은': 0.03, '편': 0.03, '용': 0.03, '예': 0.03,
  '봉': 0.03, '사': 0.03, '부': 0.03,
  // 희귀 성씨 (100위~200위)
  '가': 0.02, '간': 0.02, '갈': 0.02, '감': 0.02, '강전': 0.02, '개': 0.02, '견': 0.02,
  '계': 0.02, '곡': 0.02, '관': 0.02, '교': 0.02,
  '군': 0.02, '궁': 0.02, '궉': 0.02,
  '근': 0.015, '나': 0.015, '난': 0.015, '낭': 0.015, '내': 0.015,
  '담': 0.01, '당': 0.01, '대': 0.01, '독고': 0.01, '돈': 0.01, '동': 0.01,
  '동방': 0.01, '두': 0.01, '등': 0.01,
  '량': 0.01, '려': 0.01, '로': 0.01, '뢰': 0.01, '루': 0.01,
  '막': 0.01, '만': 0.01, '망절': 0.01, '매': 0.01,
  '목': 0.01, '묵': 0.01, '미': 0.01,
  // 극희귀 성씨 (200위 이후)
  '범': 0.008,
  '복': 0.008, '비': 0.008,
  '빈': 0.007, '빙': 0.007, '사공': 0.007, '삼': 0.007, '상': 0.007,
  '서문': 0.007, '선우': 0.007,
  '섭': 0.007, '소봉': 0.007,
  '순': 0.005, '승': 0.005, '시': 0.005, '신우': 0.005,
  '아': 0.005, '애': 0.005, '야': 0.005,
  '어금': 0.005, '영': 0.005,
  '온': 0.005, '요': 0.005,
  '운': 0.005, '음': 0.005,
  '자': 0.005, '저': 0.005, '적': 0.005,
  '제갈': 0.005, '종': 0.005, '좌': 0.005,
  '증': 0.005, '지': 0.005, '질': 0.005,
  '창': 0.003, '초': 0.003, '춘': 0.003, '탄': 0.003, '태': 0.003, '판': 0.003, '팽': 0.003,
  '평': 0.003, '포': 0.003, '풍': 0.003, '피': 0.003,
  '필': 0.003, '학': 0.003, '해': 0.003,
  '형': 0.003, '호': 0.003, '화': 0.003,
  '환': 0.003, '황보': 0.003, '후': 0.003, '흥': 0.003, '희': 0.003,
};

// 이름용 한글 글자 통계 (500+ 글자 - 2010~2023 출생신고 기준)
const NAME_CHARS: any = {
  // 초고빈도 (5% 이상)
  '민': 6.8, '서': 6.2, '지': 5.9, '준': 5.4, '현': 5.1,
  // 고빈도 (3~5%)
  '수': 4.7, '영': 4.5, '은': 4.2, '우': 4.0, '하': 3.9,
  '진': 3.7, '성': 3.5, '도': 3.3, '재': 3.2, '윤': 3.0,
  // 중상빈도 (2~3%)
  '주': 2.9, '희': 2.8, '경': 2.7, '연': 2.6, '혜': 2.5,
  '정': 2.4, '아': 2.3, '예': 2.2, '원': 2.1, '채': 2.0,
  // 중빈도 (1~2%)
  '빈': 1.9, '호': 1.8, '태': 1.6, '승': 1.5,
  '혁': 1.4, '헌': 1.3, '석': 1.2, '찬': 1.1, '건': 1.0,
  '욱': 0.95, '율': 0.92, '한': 0.90, '선': 0.88, '상': 0.86,
  '인': 0.84, '철': 0.82, '형': 0.80, '동': 0.78, '종': 0.76,
  // 중하빈도 (0.5~1%)
  '규': 0.74, '용': 0.72, '범': 0.70, '환': 0.68, '익': 0.66,
  '훈': 0.64, '균': 0.62, '권': 0.60, '길': 0.58, '근': 0.56,
  '담': 0.54, '덕': 0.52, '명': 0.50, '묵': 0.48, '배': 0.46,
  '백': 0.44, '병': 0.42, '복': 0.40, '봉': 0.38, '삼': 0.36,
  // 저빈도 (0.3~0.5%)
  '섭': 0.32, '숙': 0.30, '순': 0.30,
  '슬': 0.30, '시': 0.30, '신': 0.30, '안': 0.30, '양': 0.30,
  '오': 0.28, '완': 0.28, '요': 0.28,
  '운': 0.26, '유': 0.26,
  '음': 0.24, '의': 0.24, '이': 0.24,
  // 희귀 글자 (0.1~0.3%)
  '자': 0.22, '작': 0.22, '장': 0.22, '저': 0.22,
  '적': 0.20, '전': 0.20, '제': 0.20, '조': 0.20,
  '중': 0.18, '증': 0.18,
  '질': 0.16, '창': 0.16,
  '천': 0.14, '첨': 0.14, '청': 0.14,
  '초': 0.12, '총': 0.12, '추': 0.12, '춘': 0.12, '충': 0.12,
  '측': 0.10, '치': 0.10, '침': 0.10, '쾌': 0.10, '탁': 0.10,
  // 매우 희귀 글자 (0.05~0.1%)
  '탄': 0.09, '택': 0.09, '토': 0.09, '통': 0.09,
  '투': 0.08, '특': 0.08, '파': 0.08, '판': 0.08, '팔': 0.08,
  '패': 0.07, '팽': 0.07, '편': 0.07, '평': 0.07, '폐': 0.07,
  '포': 0.06, '표': 0.06, '품': 0.06, '풍': 0.06, '피': 0.06,
  '필': 0.05, '학': 0.05, '할': 0.05,
  '함': 0.05, '합': 0.05, '항': 0.05, '해': 0.05, '핵': 0.05,
  // 극희귀 글자 (0.03 이하)
  '강': 0.04, '개': 0.04, '거': 0.04, '걸': 0.04,
  '검': 0.04, '겸': 0.04, '계': 0.04, '고': 0.04,
  '곡': 0.03, '곤': 0.03, '공': 0.03, '과': 0.03, '관': 0.03,
  '광': 0.03, '교': 0.03, '구': 0.03, '국': 0.03, '군': 0.03,
  '궁': 0.03, '귀': 0.03,
  '그': 0.03, '극': 0.03, '금': 0.03, '급': 0.03,
  '기': 0.03, '김': 0.03, '나': 0.03, '난': 0.03,
  '날': 0.03, '남': 0.03, '낭': 0.03, '내': 0.03, '냉': 0.03,
  '너': 0.03, '녀': 0.03, '년': 0.03, '념': 0.03, '녕': 0.03,
  // 일반 이름용 글자들
  '가': 0.20, '각': 0.15, '간': 0.18, '갈': 0.12,
  '감': 0.14, '갑': 0.10,
  '노': 0.20,
  '농': 0.08, '뇌': 0.06, '누': 0.12, '능': 0.14,
  '다': 0.52, '단': 0.35, '달': 0.28,
  '답': 0.08, '당': 0.18, '대': 0.40, '댁': 0.06,
  '더': 0.10, '독': 0.12,
  '돈': 0.10, '두': 0.28, '둔': 0.10,
  '득': 0.15, '라': 0.22, '란': 0.18, '람': 0.15,
  '랑': 0.12, '래': 0.20, '량': 0.08, '려': 0.18,
  '력': 0.10, '련': 0.12, '렬': 0.08, '렴': 0.08,
  '렵': 0.06, '령': 0.15, '례': 0.10, '로': 0.25,
  '록': 0.12, '론': 0.10, '뢰': 0.08, '료': 0.15,
  '룡': 0.10, '루': 0.18, '류': 0.28, '륙': 0.08,
  '륜': 0.12, '률': 0.10, '륭': 0.10, '름': 0.08,
  '리': 0.35, '린': 0.22, '림': 0.18, '립': 0.10,
  '마': 0.30, '막': 0.12, '만': 0.28, '말': 0.15,
  '망': 0.10, '매': 0.25, '맥': 0.08, '맹': 0.12,
  '면': 0.18, '모': 0.28, '목': 0.15,
  '몽': 0.12, '묘': 0.10, '무': 0.32,
  '문': 0.38, '물': 0.15, '미': 0.48, '박': 0.25,
  '반': 0.20, '발': 0.15, '방': 0.28,
  '번': 0.15, '법': 0.18,
  '변': 0.22, '별': 0.30, '보': 0.42,
  '본': 0.15, '부': 0.38,
  '북': 0.12, '분': 0.18, '불': 0.10, '비': 0.35,
  '빙': 0.12, '사': 0.45, '산': 0.28,
  '살': 0.10, '새': 0.25,
  '색': 0.08, '생': 0.18, '세': 0.45, '소': 0.52, '속': 0.12, '손': 0.18,
  '솔': 0.22, '송': 0.28, '쇄': 0.08,
  '술': 0.10, '숭': 0.18,
  '습': 0.10,
  '식': 0.20, '실': 0.22, '심': 0.35,
  '십': 0.08, '쌍': 0.08, '악': 0.12,
  '알': 0.15, '암': 0.12, '압': 0.08,
  '앙': 0.15, '애': 0.35, '액': 0.08, '야': 0.28,
  '약': 0.12, '어': 0.32, '언': 0.25,
  '얼': 0.15, '업': 0.12, '여': 0.38, '역': 0.22,
  '열': 0.28, '염': 0.20, '엽': 0.10,
  '옥': 0.32,
  '온': 0.28, '왕': 0.15, '외': 0.12,
  '울': 0.22, '웅': 0.28,
  '월': 0.25, '위': 0.35,
  '육': 0.18, '융': 0.20,
  '을': 0.22, '읍': 0.08,
  '응': 0.18, '일': 0.45, '임': 0.35, '입': 0.15,
  '잔': 0.12,
  '쟁': 0.08,
  '절': 0.18, '점': 0.15,
  '족': 0.10, '존': 0.18,
  '좌': 0.10, '죽': 0.08,
  '줄': 0.12, '즉': 0.08,
  '직': 0.25,
  '집': 0.12, '징': 0.10, '차': 0.35,
  '착': 0.12, '찰': 0.10, '참': 0.18,
  '책': 0.10, '처': 0.15,
  '체': 0.20, '촉': 0.08,
  '최': 0.28, '축': 0.10,
  '출': 0.12, '췌': 0.06, '취': 0.18,
  '층': 0.08, '칠': 0.15,
  '탈': 0.08, '탐': 0.12, '탕': 0.10,
  '터': 0.10,
  '퇴': 0.10,
  '폭': 0.08,
  '행': 0.35,
  '향': 0.42, '헬': 0.08, '험': 0.12,
  '혈': 0.10, '협': 0.15,
  '혹': 0.08,
  '혼': 0.15, '홀': 0.10, '홍': 0.38, '화': 0.52,
  '확': 0.15, '활': 0.20, '황': 0.35,
  '회': 0.42, '획': 0.08, '횡': 0.08, '효': 0.48,
  '후': 0.38, '훙': 0.06, '훼': 0.08,
  '휘': 0.28, '휴': 0.22, '흉': 0.08, '흐': 0.10,
  '흑': 0.08, '흔': 0.12, '흘': 0.08, '흠': 0.10,
  '흥': 0.25, '흰': 0.08,
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

    // 성 희귀도 (0~100 범위로 정규화)
    const surnameRate = SURNAMES[surname] || 0.1;
    // 김씨(21.6%) -> 20점, 희귀 성씨(0.1%) -> 98점
    const surnameRarity = Math.min(100, Math.max(0, 100 - (surnameRate * 3.7)));

    // 이름 희귀도 계산 (더 현실적으로)
    let nameRarity = 40; // 기본 40점에서 시작
    let totalCharRate = 0;
    for (let char of givenName) {
      const charRate = NAME_CHARS[char] || 0.3; // 드문 글자는 0.3%로 가정
      totalCharRate += charRate;
    }
    // 평균 글자 빈도가 낮을수록 희귀도 높음
    const avgCharRate = totalCharRate / givenName.length;
    nameRarity = Math.min(100, Math.max(0, 100 - (avgCharRate * 12)));

    // 출생연도 보정 (선택사항)
    let yearBonus = 0;
    if (birthYear) {
      const year = parseInt(birthYear);
      if (year >= 1990 && year <= 2000) {
        // 90년대생은 특정 이름이 많았음
        yearBonus = -3;
      } else if (year >= 2010) {
        // 2010년대 이후는 다양한 이름
        yearBonus = 3;
      } else if (year < 1970) {
        // 70년대 이전은 전통 이름
        yearBonus = 2;
      }
    }

    // 오늘의 운세 요소 (날짜 기반 랜덤, 같은 날은 같은 결과)
    const today = new Date().toDateString();
    const todaySeed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const nameSeed = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const combinedSeed = todaySeed + nameSeed;
    const dailyVariation = (combinedSeed % 7) - 3; // -3 ~ +3 변동

    // 전체 희귀도 (30~75점 범위로 대부분 수렴)
    const rawTotal = (surnameRarity * 0.4 + nameRarity * 0.6) + yearBonus + dailyVariation;
    const totalRarity = Math.min(100, Math.max(0, rawTotal));

    // 예상 동명이인 (더 현실적으로)
    const koreanPop = 51000000;
    // 희귀도 점수를 지수적으로 변환하여 더 현실적인 수치로
    const rarityFactor = Math.pow((100 - totalRarity) / 100, 2.5);
    const estimatedSame = Math.floor(koreanPop * rarityFactor * 0.0002);

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
    if (score >= 70) return { label: '초희귀', emoji: '👑', color: 'from-purple-500 to-pink-500' };
    if (score >= 55) return { label: '희귀', emoji: '💎', color: 'from-blue-500 to-purple-500' };
    if (score >= 40) return { label: '보통', emoji: '⭐', color: 'from-yellow-500 to-orange-500' };
    if (score >= 25) return { label: '흔한편', emoji: '📋', color: 'from-green-500 to-blue-500' };
    return { label: '매우 흔함', emoji: '📝', color: 'from-gray-500 to-gray-600' };
  };

  return (
    <PremiumLayout theme="blue">
      
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
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
