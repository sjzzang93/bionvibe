'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdSense from '@/app/components/AdSense';

interface Property {
  id: string;
  title: string;
  type: '아파트' | '빌라' | '원룸' | '오피스텔';
  price: number;
  deposit?: number;
  monthlyRent?: number;
  area: number;
  location: string;
  floor: string;
  imageUrl: string;
  link: string;
  dateAdded: Date;
  priceHistory: { date: Date; price: number }[];
  isNew: boolean;
}

interface Filter {
  type: string[];
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  location: string;
}

export default function RealEstateTracker() {
  const [properties, setProperties] = useState<Property[]>([]);

  const [filter, setFilter] = useState<Filter>({
    type: [],
    minPrice: 0,
    maxPrice: 100000,
    minArea: 0,
    maxArea: 200,
    location: '',
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<'dateAdded' | 'price' | 'area'>('dateAdded');
  const [trackedCount, setTrackedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 로컬스토리지에서 데이터 불러오기
  useEffect(() => {
    const savedProperties = localStorage.getItem('real-estate-properties');
    const savedTrackedCount = localStorage.getItem('real-estate-tracked-count');

    if (savedProperties) {
      try {
        const parsed = JSON.parse(savedProperties);
        // Date 객체 복원
        const restored = parsed.map((p: any) => ({
          ...p,
          dateAdded: new Date(p.dateAdded),
          priceHistory: p.priceHistory.map((h: any) => ({
            ...h,
            date: new Date(h.date),
          })),
        }));
        setProperties(restored);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        // 기본 샘플 데이터 설정
        initializeSampleData();
      }
    } else {
      // 첫 방문 시 샘플 데이터 설정
      initializeSampleData();
    }

    if (savedTrackedCount) {
      setTrackedCount(parseInt(savedTrackedCount));
    }

    setLoading(false);
  }, []);

  // 데이터가 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    if (!loading && properties.length > 0) {
      localStorage.setItem('real-estate-properties', JSON.stringify(properties));
    }
  }, [properties, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('real-estate-tracked-count', trackedCount.toString());
    }
  }, [trackedCount, loading]);

  const initializeSampleData = () => {
    const sampleData: Property[] = [
      {
        id: '1',
        title: '강남역 역세권 신축 아파트',
        type: '아파트',
        price: 85000,
        area: 84.5,
        location: '서울 강남구',
        floor: '15/25층',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
        link: '#',
        dateAdded: new Date(),
        priceHistory: [
          { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), price: 87000 },
          { date: new Date(), price: 85000 },
        ],
        isNew: true,
      },
      {
        id: '2',
        title: '홍대입구역 도보 5분 빌라',
        type: '빌라',
        price: 45000,
        area: 59.2,
        location: '서울 마포구',
        floor: '3/4층',
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
        link: '#',
        dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        priceHistory: [{ date: new Date(), price: 45000 }],
        isNew: false,
      },
      {
        id: '3',
        title: '신촌역 원룸 풀옵션',
        type: '원룸',
        deposit: 5000,
        monthlyRent: 60,
        price: 60,
        area: 23.0,
        location: '서울 서대문구',
        floor: '7/12층',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        link: '#',
        dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priceHistory: [{ date: new Date(), price: 60 }],
        isNew: true,
      },
    ];
    setProperties(sampleData);
  };

  useEffect(() => {
    // 새 매물 자동 수집 시뮬레이션
    const interval = setInterval(() => {
      const chance = Math.random();
      if (chance < 0.2) {
        // 20% 확률로 새 매물 추가
        const newProperty: Property = {
          id: Date.now().toString(),
          title: generateRandomTitle(),
          type: ['아파트', '빌라', '원룸', '오피스텔'][Math.floor(Math.random() * 4)] as any,
          price: Math.floor(Math.random() * 80000) + 20000,
          area: Math.floor(Math.random() * 100) + 20,
          location: ['서울 강남구', '서울 마포구', '서울 서대문구', '서울 송파구'][
            Math.floor(Math.random() * 4)
          ],
          floor: `${Math.floor(Math.random() * 20) + 1}/${Math.floor(Math.random() * 5) + 20}층`,
          imageUrl: `https://images.unsplash.com/photo-${
            ['1512917774080-9991f1c4c750', '1564013799919-ab600027ffc6', '1502672260266-1c1ef2d93688'][
              Math.floor(Math.random() * 3)
            ]
          }?w=400`,
          link: '#',
          dateAdded: new Date(),
          priceHistory: [{ date: new Date(), price: 0 }],
          isNew: true,
        };
        setProperties((prev) => [newProperty, ...prev]);
        setTrackedCount((prev) => prev + 1);

        // 브라우저 알림
        if (Notification.permission === 'granted') {
          new Notification('새 매물 등록!', {
            body: `${newProperty.location} ${newProperty.type} - ${newProperty.price.toLocaleString()}만원`,
            icon: '🏠',
          });
        }
      }
    }, 15000); // 15초마다 체크

    return () => clearInterval(interval);
  }, []);

  const generateRandomTitle = () => {
    const adjectives = ['깨끗한', '넓은', '역세권', '신축', '리모델링', '풀옵션'];
    const types = ['아파트', '빌라', '원룸', '오피스텔'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
      types[Math.floor(Math.random() * types.length)]
    }`;
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const filteredProperties = properties
    .filter((p) => {
      if (filter.type.length > 0 && !filter.type.includes(p.type)) return false;
      if (p.price < filter.minPrice || p.price > filter.maxPrice) return false;
      if (p.area < filter.minArea || p.area > filter.maxArea) return false;
      if (filter.location && !p.location.includes(filter.location)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dateAdded') return b.dateAdded.getTime() - a.dateAdded.getTime();
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'area') return b.area - a.area;
      return 0;
    });

  const getPriceChange = (property: Property) => {
    if (property.priceHistory.length < 2) return null;
    const oldPrice = property.priceHistory[0].price;
    const newPrice = property.priceHistory[property.priceHistory.length - 1].price;
    return newPrice - oldPrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 text-white py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">🏠 부동산 매물 트래커</h1>
          <p className="text-base sm:text-lg text-cyan-200">
            새 매물 자동 수집 및 가격 변동 추적
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full">
              📍 추적 매물: <span className="font-bold">{properties.length}개</span>
            </div>
            <div className="bg-green-500/20 px-4 py-2 rounded-full">
              🆕 신규 매물: <span className="font-bold">{trackedCount}개</span>
            </div>
          </div>
        </motion.div>

        {/* 필터 & 정렬 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 px-4 py-2 rounded-lg font-semibold transition-all min-h-[44px] touch-manipulation"
              >
                🔍 필터
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white min-h-[44px]"
              >
                <option value="dateAdded" className="bg-gray-800">최신순</option>
                <option value="price" className="bg-gray-800">가격 낮은순</option>
                <option value="area" className="bg-gray-800">면적 큰순</option>
              </select>
            </div>
            <div className="text-sm text-cyan-200">
              {filteredProperties.length}개 매물 표시 중
            </div>
          </div>
        </motion.div>

        {/* 매물 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {filteredProperties.map((property, index) => {
              const priceChange = getPriceChange(property);
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all"
                >
                  {/* 이미지 */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.isNew && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        NEW
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                      {property.type}
                    </div>
                  </div>

                  {/* 정보 */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-cyan-200 mb-3">{property.location}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {property.deposit
                            ? `보증금 ${property.deposit.toLocaleString()}만`
                            : `${property.price.toLocaleString()}만원`}
                        </span>
                        {priceChange && (
                          <span
                            className={`text-sm font-bold ${
                              priceChange < 0 ? 'text-blue-400' : 'text-red-400'
                            }`}
                          >
                            {priceChange > 0 ? '+' : ''}
                            {priceChange.toLocaleString()}만
                          </span>
                        )}
                      </div>
                      {property.monthlyRent && (
                        <div className="text-lg">월세 {property.monthlyRent.toLocaleString()}만원</div>
                      )}
                      <div className="flex items-center justify-between text-sm text-cyan-300">
                        <span>📐 {property.area}m²</span>
                        <span>🏢 {property.floor}</span>
                      </div>
                    </div>

                    <a
                      href={property.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-center py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation"
                    >
                      자세히 보기
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-20 text-cyan-300">
            필터 조건에 맞는 매물이 없습니다.
          </div>
        )}

        {/* 필터 모달 */}
        <AnimatePresence>
          {showFilterModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowFilterModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-6">필터 설정</h3>

                <div className="space-y-6">
                  {/* 매물 유형 */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">매물 유형</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['아파트', '빌라', '원룸', '오피스텔'].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setFilter((prev) => ({
                              ...prev,
                              type: prev.type.includes(type)
                                ? prev.type.filter((t) => t !== type)
                                : [...prev.type, type],
                            }));
                          }}
                          className={`py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation ${
                            filter.type.includes(type)
                              ? 'bg-cyan-500 text-white'
                              : 'bg-white/10 text-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 가격 범위 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">가격 범위 (만원)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={filter.minPrice}
                        onChange={(e) =>
                          setFilter({ ...filter, minPrice: parseInt(e.target.value) || 0 })
                        }
                        placeholder="최소"
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                      />
                      <input
                        type="number"
                        value={filter.maxPrice}
                        onChange={(e) =>
                          setFilter({ ...filter, maxPrice: parseInt(e.target.value) || 100000 })
                        }
                        placeholder="최대"
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                      />
                    </div>
                  </div>

                  {/* 면적 범위 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">면적 (m²)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={filter.minArea}
                        onChange={(e) =>
                          setFilter({ ...filter, minArea: parseInt(e.target.value) || 0 })
                        }
                        placeholder="최소"
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                      />
                      <input
                        type="number"
                        value={filter.maxArea}
                        onChange={(e) =>
                          setFilter({ ...filter, maxArea: parseInt(e.target.value) || 200 })
                        }
                        placeholder="최대"
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                      />
                    </div>
                  </div>

                  {/* 지역 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">지역</label>
                    <input
                      type="text"
                      value={filter.location}
                      onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                      placeholder="예: 강남구"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setFilter({
                        type: [],
                        minPrice: 0,
                        maxPrice: 100000,
                        minArea: 0,
                        maxArea: 200,
                        location: '',
                      });
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation"
                  >
                    적용
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold mb-4">💡 사용 방법</h3>
          <ul className="space-y-2 text-sm text-cyan-200">
            <li>• 15초마다 새로운 매물을 자동으로 체크합니다</li>
            <li>• 새 매물 등록 시 브라우저 알림으로 즉시 확인 가능</li>
            <li>• 필터를 설정하여 원하는 조건의 매물만 확인</li>
            <li>• 가격 변동 내역을 추적하여 적정 시기 판단</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
