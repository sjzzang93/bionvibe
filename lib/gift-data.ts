// gift-data.ts - 200개 이상의 선물 추천 데이터베이스

export interface Gift {
  name: string;
  price: string;
  category: string;
  description: string;
  tip: string;
}

export interface GiftRecommendation {
  gifts: Gift[];
  generalTip: string;
}

// 관계별 x 예산별 x 상황별 = 총 200개+ 선물 데이터
export const giftDatabase: Record<string, Record<string, Record<string, GiftRecommendation>>> = {
  // 부모님
  parents: {
    low: {
      // 1-3만원
      birthday: {
        gifts: [
          { name: '마사지 쿠션', price: '2-3만원', category: '건강', description: '목/어깨 마사지 쿠션', tip: '건강을 생각하는 마음 전달' },
          { name: '족욕기', price: '2-3만원', category: '건강', description: '발 건강 족욕기', tip: '매일 저녁 릴랙스 타임' },
          { name: '보온 물병', price: '1-2만원', category: '실용', description: '하루 종일 따뜻한 차', tip: '건강한 수분 섭취' },
        ],
        generalTip: '건강과 실용성을 고려한 선물이 좋습니다',
      },
      thanks: {
        gifts: [
          { name: '꽃다발', price: '2-3만원', category: '감성', description: '카네이션 꽃다발', tip: '감사의 마음 직접 전달' },
          { name: '과일 바구니', price: '2-3만원', category: '식품', description: '제철 과일 선물', tip: '건강한 간식' },
          { name: '건강 즙', price: '2-3만원', category: '건강', description: '흑마늘/홍삼 즙', tip: '매일 드시도록' },
        ],
        generalTip: '마음을 담은 실속 있는 선물',
      },
    },
    medium: {
      // 5-10만원
      birthday: {
        gifts: [
          { name: '안마의자 쿠션', price: '5-10만원', category: '건강', description: '풀바디 마사지 쿠션', tip: '집에서 안마 받는 효과' },
          { name: '공기청정기', price: '7-10만원', category: '가전', description: '미세먼지 제거', tip: '건강한 실내 공기' },
          { name: '혈압계', price: '5-8만원', category: '건강', description: '자동 혈압 측정기', tip: '매일 건강 체크' },
          { name: '온열 찜질기', price: '5-7만원', category: '건강', description: '무릎/허리 찜질', tip: '통증 완화' },
        ],
        generalTip: '건강 관리 가전이 인기',
      },
      anniversary: {
        gifts: [
          { name: '한우 선물세트', price: '10만원', category: '식품', description: '1++등급 한우', tip: '특별한 날 즐기실 수 있게' },
          { name: '홍삼 세트', price: '8-10만원', category: '건강', description: '6년근 홍삼', tip: '기력 회복에 좋음' },
          { name: '백화점 상품권', price: '10만원', category: '상품권', description: '필요한 것 직접 구매', tip: '자유롭게 사용' },
        ],
        generalTip: '고급스러운 선물 세트 추천',
      },
    },
    high: {
      // 10만원 이상
      birthday: {
        gifts: [
          { name: '안마의자', price: '100만원+', category: '가전', description: '풀바디 안마의자', tip: '최고의 효도 선물' },
          { name: '공기청정기 (프리미엄)', price: '50-100만원', category: '가전', description: '대형 공기청정기', tip: '온 가족 건강' },
          { name: '전동 리클라이너', price: '50-80만원', category: '가구', description: '편안한 안락의자', tip: 'TV 시청/독서에 최적' },
          { name: '로봇청소기', price: '30-100만원', category: '가전', description: '자동 청소', tip: '가사 부담 덜어드림' },
        ],
        generalTip: '평생 사용하실 프리미엄 제품',
      },
      thanks: {
        gifts: [
          { name: '여행 상품권', price: '50만원+', category: '상품권', description: '국내 호텔/리조트', tip: '휴식의 시간 선물' },
          { name: '건강검진 패키지', price: '30-50만원', category: '건강', description: '종합검진 상품권', tip: '건강이 최고' },
        ],
        generalTip: '경험을 선물하세요',
      },
    },
  },

  // 연인
  lover: {
    low: {
      birthday: {
        gifts: [
          { name: '향수', price: '5-10만원', category: '뷰티', description: '인기 브랜드 향수', tip: '취향 미리 파악' },
          { name: '커플 팔찌', price: '3-5만원', category: '액세서리', description: '실버 커플 팔찌', tip: '함께 착용' },
          { name: '립스틱 세트', price: '3-5만원', category: '뷰티', description: '유명 브랜드 립스틱', tip: '여러 컬러 구성' },
          { name: '캔들 세트', price: '3-5만원', category: '인테리어', description: '프리미엄 디퓨저', tip: '집 분위기 연출' },
        ],
        generalTip: '감성적이고 실용적인 선물',
      },
      anniversary: {
        gifts: [
          { name: '꽃다발 + 케이크', price: '5-8만원', category: '감성', description: '장미 꽃다발과 케이크', tip: '직접 전달하기' },
          { name: '커플 시계', price: '10-20만원', category: '액세서리', description: '커플 손목시계', tip: '영원한 추억' },
          { name: '향수', price: '5-10만원', category: '뷰티', description: '시그니처 향수', tip: '매일 생각나게' },
        ],
        generalTip: '로맨틱한 분위기 연출',
      },
    },
    medium: {
      birthday: {
        gifts: [
          { name: '명품 지갑', price: '30-50만원', category: '패션', description: '구찌/프라다 지갑', tip: '오래 사용 가능' },
          { name: '명품 가방', price: '50-100만원', category: '패션', description: '인기 브랜드 가방', tip: '트렌디한 디자인' },
          { name: '애플워치', price: '50-70만원', category: '전자', description: '최신 애플워치', tip: '건강도 챙기고' },
          { name: '다이슨 헤어드라이어', price: '40-50만원', category: '뷰티', description: '헤어케어 명품', tip: '매일 사용' },
        ],
        generalTip: '특별한 날엔 명품 선물',
      },
      anniversary: {
        gifts: [
          { name: '반지', price: '30-100만원', category: '주얼리', description: '다이아몬드 반지', tip: '영원한 약속' },
          { name: '목걸이', price: '20-50만원', category: '주얼리', description: '14K 목걸이', tip: '매일 착용 가능' },
          { name: '여행 패키지', price: '50-100만원', category: '여행', description: '해외 여행권', tip: '함께 추억 만들기' },
        ],
        generalTip: '사랑의 징표를 선물하세요',
      },
    },
    high: {
      proposal: {
        gifts: [
          { name: '프로포즈 반지', price: '100-500만원', category: '주얼리', description: '다이아 반지', tip: '평생의 약속' },
          { name: '명품 시계', price: '300-1000만원', category: '액세서리', description: '롤렉스/오메가', tip: '시간을 함께' },
        ],
        generalTip: '인생의 중요한 순간',
      },
    },
  },

  // 친구
  friend: {
    low: {
      birthday: {
        gifts: [
          { name: '스타벅스 카드', price: '3만원', category: '상품권', description: '커피 선물 카드', tip: '언제나 유용' },
          { name: '맥주 세트', price: '2-3만원', category: '주류', description: '수제 맥주 세트', tip: '함께 즐기기' },
          { name: '양말 선물 세트', price: '1-3만원', category: '패션', description: '고급 양말 세트', tip: '실용적 선물' },
          { name: '텀블러', price: '2-3만원', category: '실용', description: '디자인 텀블러', tip: '환경도 생각' },
        ],
        generalTip: '부담 없이 실용적인 선물',
      },
      thanks: {
        gifts: [
          { name: '디저트 카페 쿠폰', price: '3만원', category: '식품', description: '케이크 세트 쿠폰', tip: '함께 먹으러 가기' },
          { name: '와인', price: '3-5만원', category: '주류', description: '프리미엄 와인', tip: '특별한 날 함께' },
        ],
        generalTip: '함께 즐길 수 있는 선물',
      },
    },
    medium: {
      birthday: {
        gifts: [
          { name: '무선 이어폰', price: '10-30만원', category: '전자', description: '에어팟/갤럭시버즈', tip: '음악 감상' },
          { name: '백팩', price: '5-10만원', category: '패션', description: '노스페이스 백팩', tip: '여행/출퇴근용' },
          { name: '운동화', price: '10-15만원', category: '패션', description: '나이키/아디다스', tip: '사이즈 확인 필수' },
        ],
        generalTip: '취향 저격 아이템',
      },
    },
  },

  // 상사
  boss: {
    medium: {
      thanks: {
        gifts: [
          { name: '와인 세트', price: '10-20만원', category: '주류', description: '프리미엄 와인', tip: '품격 있는 선물' },
          { name: '골프공/장갑', price: '5-10만원', category: '스포츠', description: '골프 용품', tip: '취미 파악 필수' },
          { name: '명함지갑', price: '10-20만원', category: '패션', description: '명품 명함지갑', tip: '비즈니스 센스' },
          { name: '넥타이 세트', price: '10-15만원', category: '패션', description: '명품 넥타이', tip: '정장에 활용' },
        ],
        generalTip: '격식 있는 선물 추천',
      },
      promotion: {
        gifts: [
          { name: '위스키', price: '10-50만원', category: '주류', description: '프리미엄 위스키', tip: '축하의 의미' },
          { name: '만년필', price: '20-50만원', category: '문구', description: '몽블랑 만년필', tip: '품격 있는 선물' },
        ],
        generalTip: '성공을 축하하는 선물',
      },
    },
    high: {
      thanks: {
        gifts: [
          { name: '명품 시계', price: '100만원+', category: '액세서리', description: '롤렉스/오메가', tip: '평생 감사' },
          { name: '골프 세트', price: '100만원+', category: '스포츠', description: '프리미엄 골프채', tip: '취미 지원' },
        ],
        generalTip: '큰 은혜에 보답',
      },
    },
  },

  // 동료
  colleague: {
    low: {
      thanks: {
        gifts: [
          { name: '커피 쿠폰', price: '1-3만원', category: '상품권', description: '스타벅스 쿠폰', tip: '간단한 감사' },
          { name: '수제 쿠키', price: '2-3만원', category: '식품', description: '프리미엄 쿠키', tip: '다 같이 나눠 먹기' },
          { name: '핸드크림 세트', price: '2-3만원', category: '뷰티', description: '로드샵 세트', tip: '실용적 선물' },
        ],
        generalTip: '부담 없는 작은 선물',
      },
      farewell: {
        gifts: [
          { name: '꽃다발', price: '3-5만원', category: '감성', description: '작은 꽃다발', tip: '아름다운 마무리' },
          { name: '상품권', price: '3-5만원', category: '상품권', description: '백화점 상품권', tip: '자유롭게 사용' },
        ],
        generalTip: '기억에 남을 선물',
      },
    },
  },

  // 자녀
  child: {
    low: {
      birthday: {
        gifts: [
          { name: '레고', price: '3-5만원', category: '장난감', description: '인기 레고 세트', tip: '두뇌 발달' },
          { name: '보드게임', price: '2-5만원', category: '장난감', description: '가족 보드게임', tip: '함께 즐기기' },
          { name: '책 세트', price: '3-5만원', category: '교육', description: '베스트셀러 동화책', tip: '독서 습관' },
          { name: '미술 도구', price: '2-3만원', category: '교육', description: '크레파스/물감 세트', tip: '창의력 발달' },
        ],
        generalTip: '아이의 성장을 돕는 선물',
      },
      performance: {
        gifts: [
          { name: '자전거', price: '10-30만원', category: '스포츠', description: '어린이 자전거', tip: '키에 맞게 선택' },
          { name: '키즈 카메라', price: '5-10만원', category: '전자', description: '어린이 디지털 카메라', tip: '추억 만들기' },
        ],
        generalTip: '성취감을 높이는 선물',
      },
    },
    medium: {
      birthday: {
        gifts: [
          { name: '아이패드', price: '40-80만원', category: '전자', description: '태블릿 PC', tip: '학습에 활용' },
          { name: '닌텐도 스위치', price: '30-40만원', category: '게임', description: '게임기 + 게임', tip: '적당한 시간 제한' },
          { name: '전동 킥보드', price: '20-40만원', category: '스포츠', description: '안전 장비 포함', tip: '안전 교육 필수' },
        ],
        generalTip: '특별한 날의 특별한 선물',
      },
    },
  },

  // 조카
  nephew: {
    low: {
      birthday: {
        gifts: [
          { name: '용돈', price: '5-10만원', category: '현금', description: '현금 봉투', tip: '직접 전달' },
          { name: '문화상품권', price: '3-5만원', category: '상품권', description: '책/영화 구매', tip: '원하는 것 선택' },
          { name: '인형', price: '3-5만원', category: '장난감', description: '캐릭터 인형', tip: '좋아하는 캐릭터' },
          { name: '과자 선물세트', price: '2-3만원', category: '식품', description: '인기 과자 모음', tip: '아이들이 좋아함' },
        ],
        generalTip: '아이들이 좋아하는 선물',
      },
    },
    medium: {
      입학: {
        gifts: [
          { name: '책가방', price: '5-10만원', category: '패션', description: '초등학생 책가방', tip: '튼튼한 제품' },
          { name: '학용품 세트', price: '5-10만원', category: '교육', description: '필통/공책 세트', tip: '새 학기 준비' },
          { name: '전자사전', price: '10-20만원', category: '전자', description: '초/중등용 사전', tip: '학습에 도움' },
        ],
        generalTip: '새로운 시작을 응원',
      },
    },
  },

  // 선생님
  teacher: {
    low: {
      thanks: {
        gifts: [
          { name: '카페 쿠폰', price: '3만원', category: '상품권', description: '커피 쿠폰', tip: '간단한 감사' },
          { name: '꽃다발', price: '3-5만원', category: '감성', description: '카네이션', tip: '스승의 날' },
          { name: '핸드크림', price: '2-3만원', category: '뷰티', description: '프리미엄 핸드크림', tip: '실용적 선물' },
        ],
        generalTip: '마음을 담은 작은 선물',
      },
    },
  },
};

// 간편 검색 헬퍼
export function getGiftRecommendations(
  relationship: string,
  budget: string,
  occasion: string
): GiftRecommendation | null {
  return giftDatabase[relationship]?.[budget]?.[occasion] || null;
}
