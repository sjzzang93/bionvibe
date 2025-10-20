'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Destination {
  id: number;
  name: string;
  country: string;
  season: string;
  theme: string[];
  description: string;
  image: string;
  photographer: string;
  photographerUrl: string;
  tips: string[];
  bestTime: string;
  activities: string[];
}

const destinations: Destination[] = [
  {
    id: 1,
    name: '슈타이어마르크 산맥',
    country: '오스트리아',
    season: '봄',
    theme: ['산악', '자연', '힐링'],
    description: '눈 덮인 알프스 산맥과 초록빛 초원이 어우러진 환상적인 풍경. 봄철 융설기의 신비로운 자연을 만날 수 있습니다.',
    image: 'https://images.pexels.com/photos/34123169/pexels-photo-34123169.jpeg',
    photographer: 'Ahmet Yüksek',
    photographerUrl: 'https://www.pexels.com/ko-kr/photo/34123169/',
    tips: [
      '봄철(4-5월) 방문 시 눈과 꽃을 동시에 볼 수 있어요',
      '트레킹 코스가 잘 정비되어 있어 초보자도 OK',
      '현지 산장에서 하룻밤 묵으면 일출이 환상적입니다'
    ],
    bestTime: '4월 ~ 6월',
    activities: ['트레킹', '사진촬영', '캠핑', '산악자전거']
  },
  {
    id: 2,
    name: '라우터브루넨 계곡',
    country: '스위스',
    season: '여름',
    theme: ['산악', '폭포', '마을'],
    description: '72개의 폭포가 쏟아지는 U자형 계곡. 융프라우 산맥의 웅장함과 목가적인 마을이 공존하는 곳입니다.',
    image: 'https://images.pexels.com/photos/1738994/pexels-photo-1738994.jpeg',
    photographer: 'Pexels',
    photographerUrl: 'https://www.pexels.com',
    tips: [
      '융프라우 철도로 유럽 최고봉까지 갈 수 있어요',
      '슈타우바흐 폭포 뒤쪽 동굴 산책로 추천',
      '패러글라이딩 체험 필수!'
    ],
    bestTime: '6월 ~ 9월',
    activities: ['등산', '패러글라이딩', '케이블카', '마을산책']
  },
  {
    id: 3,
    name: '밀포드 사운드',
    country: '뉴질랜드',
    season: '가을',
    theme: ['피오르', '바다', '모험'],
    description: '빙하가 깎아만든 장엄한 피오르 지형. 폭포와 절벽, 야생동물이 어우러진 세계자연유산입니다.',
    image: 'https://images.pexels.com/photos/2662425/pexels-photo-2662425.jpeg',
    photographer: 'Pexels',
    photographerUrl: 'https://www.pexels.com',
    tips: [
      '크루즈 투어는 최소 2시간 코스 추천',
      '비가 와야 더 멋있어요 (폭포 수량 증가)',
      '카약 투어로 물개와 펭귄 만날 수 있어요'
    ],
    bestTime: '3월 ~ 5월',
    activities: ['크루즈', '카약', '스쿠버다이빙', '플라이트투어']
  },
  {
    id: 4,
    name: '요세미티 국립공원',
    country: '미국',
    season: '봄',
    theme: ['국립공원', '폭포', '암벽'],
    description: '거대한 화강암 절벽과 세쿼이아 나무 숲. 봄철 빙설이 녹으면 폭포가 장관을 이룹니다.',
    image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg',
    photographer: 'Pexels',
    photographerUrl: 'https://www.pexels.com',
    tips: [
      '5월 요세미티 폭포가 최고 수량',
      '하프돔 등반은 허가제 (사전예약 필수)',
      '글레이셔 포인트 일몰이 압권'
    ],
    bestTime: '4월 ~ 6월',
    activities: ['등산', '암벽등반', '사진촬영', '야생동물관찰']
  },
  {
    id: 5,
    name: '프로방스 라벤더밭',
    country: '프랑스',
    season: '여름',
    theme: ['꽃', '마을', '낭만'],
    description: '보라빛 라벤더가 끝없이 펼쳐진 프로방스의 여름. 향긋한 공기와 햇살이 가득한 낭만의 땅입니다.',
    image: 'https://images.pexels.com/photos/462024/pexels-photo-462024.jpeg',
    photographer: 'Pexels',
    photographerUrl: 'https://www.pexels.com',
    tips: [
      '6월 중순~7월 중순이 만개 시기',
      '소본 수도원 라벤더밭이 가장 유명',
      '현지 라벤더 오일과 꿀 구매 추천'
    ],
    bestTime: '6월 ~ 7월',
    activities: ['드라이브', '사진촬영', '와이너리투어', '마을탐방']
  },
  {
    id: 6,
    name: '파타고니아 토레스 델 파이네',
    country: '칠레',
    season: '여름',
    theme: ['산악', '빙하', '모험'],
    description: '남미 최고의 트레킹 명소. 세 개의 거대한 화강암 탑과 푸른 빙하호수가 절경을 이룹니다.',
    image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg',
    photographer: 'Pexels',
    photographerUrl: 'https://www.pexels.com',
    tips: [
      '12월~2월 남반구 여름이 최적기',
      'W 트레킹 코스는 4박5일 소요',
      '바람이 매우 강하니 방풍의류 필수'
    ],
    bestTime: '12월 ~ 2월',
    activities: ['트레킹', '캠핑', '빙하투어', '야생동물관찰']
  }
];

const seasons = ['전체', '봄', '여름', '가을', '겨울'];
const themes = ['전체', '산악', '바다', '꽃', '자연', '힐링', '모험', '마을'];

export default function TravelDestinations() {
  const [selectedSeason, setSelectedSeason] = useState('전체');
  const [selectedTheme, setSelectedTheme] = useState('전체');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const filteredDestinations = destinations.filter(dest => {
    const seasonMatch = selectedSeason === '전체' || dest.season === selectedSeason;
    const themeMatch = selectedTheme === '전체' || dest.theme.includes(selectedTheme);
    return seasonMatch && themeMatch;
  });

  return (
    <main className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a1128 0%, #1e3a5f 25%, #2c5f8d 50%, #3a7ca5 75%, #4a90b8 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* 상단 쿠팡 배너 */}
      {/* 상단 iframe 배너 */}
      <div className="w-full bg-black/20 py-1">
        <div className="container mx-auto px-4">
          <iframe 
            src="" 
            width="100%" 
            height="36" 
            frameBorder="0" 
            scrolling="no"className="rounded"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4 text-sm"
          >
            ← 홈으로
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{
            background: 'linear-gradient(135deg, #ffd700, #ffed4e, #fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255,215,0,0.3)'
          }}>
            🗺️ 세계 자연 여행지
          </h1>
          <p className="text-blue-100 text-lg">계절과 테마로 찾는 완벽한 여행지</p>
        </div>

        {/* 필터 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 계절 필터 */}
            <div>
              <label className="block text-white font-bold mb-3 text-lg">🌸 계절</label>
              <div className="flex flex-wrap gap-2">
                {seasons.map(season => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      selectedSeason === season
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    style={{ minHeight: '44px' }}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>

            {/* 테마 필터 */}
            <div>
              <label className="block text-white font-bold mb-3 text-lg">🎯 테마</label>
              <div className="flex flex-wrap gap-2">
                {themes.map(theme => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      selectedTheme === theme
                        ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    style={{ minHeight: '44px' }}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 결과 카운트 */}
        <div className="text-center mb-6">
          <p className="text-white text-lg">
            총 <span className="font-bold text-yellow-300 text-2xl">{filteredDestinations.length}</span>개의 여행지
          </p>
        </div>

        {/* 여행지 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDestinations.map(dest => (
            <div
              key={dest.id}
              onClick={() => setSelectedDestination(dest)}
              className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-white/20 hover:border-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {dest.season}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">{dest.name}</h3>
                <p className="text-blue-200 text-sm mb-3">📍 {dest.country}</p>
                <p className="text-white/80 text-sm line-clamp-2 mb-3">{dest.description}</p>
                <div className="flex flex-wrap gap-2">
                  {dest.theme.slice(0, 3).map(t => (
                    <span key={t} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 중간 쿠팡 배너 */}
        {/* 하단 쿠팡 배너 */}
        {/* 쿠팡 파트너스 고지 */}
        <p className="text-white/50 text-xs text-center mt-6 mb-8">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>

      {/* 상세 모달 */}
      {selectedDestination && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedDestination(null)}
        >
          <div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-yellow-400 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 이미지 */}
            <div className="relative h-64 md:h-96">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center text-2xl transition-colors"
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                ×
              </button>
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full font-bold">
                {selectedDestination.season} 추천
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedDestination.name}</h2>
              <p className="text-blue-300 text-lg mb-6">📍 {selectedDestination.country}</p>

              <p className="text-white/90 text-lg leading-relaxed mb-8">
                {selectedDestination.description}
              </p>

              {/* 베스트 시즌 */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-yellow-300 mb-3">🗓️ 베스트 시즌</h3>
                <p className="text-white bg-white/10 rounded-lg px-4 py-3 text-lg">
                  {selectedDestination.bestTime}
                </p>
              </div>

              {/* 활동 */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-yellow-300 mb-3">🎯 추천 활동</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedDestination.activities.map(activity => (
                    <span key={activity} className="bg-blue-500/30 text-white px-4 py-2 rounded-full border border-blue-400">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* 여행 팁 */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-yellow-300 mb-3">💡 여행 팁</h3>
                <ul className="space-y-3">
                  {selectedDestination.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/90 bg-white/5 rounded-lg p-4">
                      <span className="text-yellow-400 text-xl">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 사진 출처 */}
              <div className="text-center pt-6 border-t border-white/20">
                <p className="text-white/60 text-sm">
                  Photo by{' '}
                  <a 
                    href={selectedDestination.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 underline"
                  >
                    {selectedDestination.photographer}
                  </a>
                  {' '}on Pexels
                </p>
              </div>

              {/* 쿠팡 배너 */}
              </div>
          </div>
        </div>
      )}
    </main>
  );
}

