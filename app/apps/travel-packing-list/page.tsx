'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';

const packingCategories = {
  '의류': ['상의', '하의', '속옷', '양말', '잠옷', '외투', '신발', '슬리퍼', '모자', '선글라스'],
  '세면도구': ['칫솔', '치약', '샴푸', '린스', '바디워시', '로션', '선크림', '면도기', '빗', '수건'],
  '전자기기': ['충전기', '보조배터리', '이어폰', '카메라', '노트북', '어댑터', '멀티탭'],
  '서류/돈': ['여권', '신분증', '항공권', '숙소예약서', '신용카드', '현금', '여행자보험', '운전면허증'],
  '약품': ['감기약', '소화제', '진통제', '밴드', '소독약', '모기퇴치제', '멀미약', '상비약'],
  '기타': ['가방', '지퍼백', '우산', '물병', '손소독제', '마스크', '책/가이드북', '필기도구'],
};

export default function PackingListPage() {
  const [tripType, setTripType] = useState('');
  const [days, setDays] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const totalItems = Object.values(packingCategories).flat().length;
  const progress = (checkedItems.size / totalItems) * 100;

  return (
    <PremiumLayout theme="green" showStars={true}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-4 drop-shadow-2xl">
            🧳 여행 패킹 체크리스트
          </h1>
          <p className="text-xl text-white/90 font-medium">완벽한 여행 준비를 위한 스마트 체크리스트</p>
        </div>

        {/* 여행 정보 */}
        <PremiumCard className="mb-8 [transform:translateZ(20px)]">
          <h2 className="text-2xl font-bold text-white mb-6">📋 여행 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/90 font-semibold mb-3 block text-lg">여행 유형</label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full px-5 py-4 rounded-xl text-black font-medium text-lg bg-white/95 border-2 border-white/50 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/30 transition-all shadow-lg hover:shadow-xl"
                style={{ fontSize: '16px' }}
              >
                <option value="">선택하세요</option>
                <option value="국내">🇰🇷 국내 여행</option>
                <option value="해외">✈️ 해외 여행</option>
                <option value="캠핑">⛺ 캠핑</option>
                <option value="출장">💼 출장</option>
              </select>
            </div>
            <div>
              <label className="text-white/90 font-semibold mb-3 block text-lg">여행 기간</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="예: 3"
                className="w-full px-5 py-4 rounded-xl text-black font-medium text-lg bg-white/95 border-2 border-white/50 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/30 transition-all shadow-lg hover:shadow-xl"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        </PremiumCard>

        {/* 진행률 */}
        <PremiumCard className="mb-8 [transform:translateZ(30px)]">
          <div className="flex justify-between items-center text-white mb-4">
            <span className="text-2xl font-bold">📊 준비 진행률</span>
            <span className="text-3xl font-black text-emerald-300">{checkedItems.size}/{totalItems}</span>
          </div>
          <div className="relative w-full bg-black/30 rounded-full h-8 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-500 shadow-lg relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
            </div>
          </div>
          <p className="text-center text-white/80 font-bold text-xl mt-3">{Math.round(progress)}% 완료</p>
        </PremiumCard>

        {/* 체크리스트 */}
        <div className="space-y-6">
          {Object.entries(packingCategories).map(([category, items]) => (
            <PremiumCard key={category} className="[transform:translateZ(15px)] hover:[transform:translateZ(25px)] transition-transform duration-300">
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-6">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => (
                  <label
                    key={item}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 shadow-lg hover:shadow-xl ${
                      checkedItems.has(item) 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 scale-105 shadow-emerald-500/50' 
                        : 'bg-white/10 border-white/30 hover:bg-white/20 hover:scale-105 backdrop-blur-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item)}
                      onChange={() => toggleItem(item)}
                      className="w-6 h-6 rounded-lg accent-emerald-500 cursor-pointer"
                    />
                    <span className={`font-bold text-lg ${
                      checkedItems.has(item) ? 'line-through text-white' : 'text-white'
                    }`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </PremiumCard>
          ))}
        </div>

        {/* 완료 메시지 */}
        {progress === 100 && (
          <PremiumCard className="mt-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 [transform:translateZ(40px)] animate-bounce-slow">
            <div className="text-center py-8">
              <p className="text-5xl font-black text-white mb-4">🎉 완료!</p>
              <p className="text-2xl font-bold text-white">모든 준비가 완료되었습니다!</p>
              <p className="text-xl text-white/90 mt-2">즐거운 여행 되세요! ✈️</p>
            </div>
          </PremiumCard>
        )}
      </div>
    </PremiumLayout>
  );
}

