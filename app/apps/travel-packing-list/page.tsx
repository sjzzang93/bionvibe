'use client';

import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 dark:from-teal-500 dark:via-green-500 dark:to-emerald-600 py-8 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-4">
          🧳 여행 패킹 체크리스트
        </h1>
        <p className="text-center text-teal-100 mb-8">완벽한 여행 준비를 위한 체크리스트</p>

        {/* 여행 정보 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-bold mb-2 block">여행 유형</label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-black"
                style={{ fontSize: '16px' }}
              >
                <option value="">선택하세요</option>
                <option value="국내">국내 여행</option>
                <option value="해외">해외 여행</option>
                <option value="캠핑">캠핑</option>
                <option value="출장">출장</option>
              </select>
            </div>
            <div>
              <label className="text-white font-bold mb-2 block">여행 기간</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="예: 3"
                className="w-full px-4 py-3 rounded-lg text-black"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        </div>

        {/* 진행률 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex justify-between text-white mb-2">
            <span className="font-bold">준비 진행률</span>
            <span className="font-bold">{checkedItems.size}/{totalItems} ({Math.round(progress)}%)</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 체크리스트 */}
        <div className="space-y-4">
          {Object.entries(packingCategories).map(([category, items]) => (
            <div key={category} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item) => (
                  <label
                    key={item}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      checkedItems.has(item) ? 'bg-green-500/50 text-white' : 'bg-white/10 hover:bg-white/20 text-black'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item)}
                      onChange={() => toggleItem(item)}
                      className="w-5 h-5"
                    />
                    <span className={`font-medium ${checkedItems.has(item) ? 'line-through text-white' : 'text-black'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {progress === 100 && (
          <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-6 rounded-2xl text-2xl font-bold">
            🎉 모든 준비가 완료되었습니다! 즐거운 여행 되세요!
          </div>
        )}
      </div>
    </div>
  );
}

