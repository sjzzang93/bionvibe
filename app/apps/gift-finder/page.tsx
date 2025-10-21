'use client';

import { useState } from 'react';
import AppFooter from '@/app/components/AppFooter';
import Link from 'next/link';

interface GiftSuggestion {
  name: string;
  price: string;
  reason: string;
  emoji: string;
  link?: string;
}

export default function GiftFinderPage() {
  const [recipient, setRecipient] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [budget, setBudget] = useState('');
  const [occasion, setOccasion] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [showResult, setShowResult] = useState(false);

  const interestOptions = [
    { id: 'tech', label: '🖥️ 테크/가젯', emoji: '🖥️' },
    { id: 'fashion', label: '👗 패션/뷰티', emoji: '👗' },
    { id: 'food', label: '🍰 음식/디저트', emoji: '🍰' },
    { id: 'book', label: '📚 책/문구', emoji: '📚' },
    { id: 'sport', label: '⚽ 운동/건강', emoji: '⚽' },
    { id: 'hobby', label: '🎨 취미/여가', emoji: '🎨' },
    { id: 'home', label: '🏠 홈/인테리어', emoji: '🏠' },
    { id: 'travel', label: '✈️ 여행/아웃도어', emoji: '✈️' }
  ];

  const toggleInterest = (id: string) => {
    setInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const generateSuggestions = () => {
    if (!recipient || !budget || !occasion) {
      alert('받는 사람, 예산, 상황을 모두 선택해주세요!');
      return;
    }

    const budgetNum = parseInt(budget);
    const suggestions: GiftSuggestion[] = [];

    // ===== 테크/가젯 관심사 (30개) =====
    if (interests.includes('tech')) {
      const techGifts = [
        { min: 10000, name: 'USB 충전 케이블 세트', price: '1만원~3만원', reason: '실용적인 필수 아이템', emoji: '🔌' },
        { min: 15000, name: '스마트폰 거치대', price: '1.5만원~5만원', reason: '책상/차량용으로 유용', emoji: '📱' },
        { min: 20000, name: '블루투스 스피커 (미니)', price: '2만원~8만원', reason: '음악 감상의 즐거움', emoji: '🔊' },
        { min: 25000, name: '무선 마우스', price: '2.5만원~10만원', reason: '편안한 작업 환경', emoji: '🖱️' },
        { min: 30000, name: '스마트 워치 밴드/액세서리', price: '3만원~10만원', reason: '스타일과 기능성 업그레이드', emoji: '⌚' },
        { min: 30000, name: '보조배터리 (대용량)', price: '3만원~8만원', reason: '언제 어디서나 충전 걱정 없이', emoji: '🔋' },
        { min: 35000, name: 'LED 감성 조명', price: '3.5만원~15만원', reason: '분위기 있는 공간 연출', emoji: '💡' },
        { min: 40000, name: '키보드 (기계식/무선)', price: '4만원~20만원', reason: '타이핑의 즐거움', emoji: '⌨️' },
        { min: 50000, name: '무선 이어폰', price: '5만원~20만원', reason: '언제나 함께하는 음악', emoji: '🎧' },
        { min: 50000, name: '태블릿 거치대/케이스', price: '5만원~15만원', reason: '태블릿 활용도 UP', emoji: '📲' },
        { min: 60000, name: '스마트 플러그/전구', price: '6만원~15만원', reason: 'IoT 스마트홈 첫걸음', emoji: '🏠' },
        { min: 70000, name: '웹캠 (HD/4K)', price: '7만원~30만원', reason: '재택근무/스트리밍 필수', emoji: '📹' },
        { min: 80000, name: '전자액자', price: '8만원~30만원', reason: '추억을 디지털로', emoji: '🖼️' },
        { min: 100000, name: '스마트워치', price: '10만원~50만원', reason: '건강과 스타일을 한번에', emoji: '⌚' },
        { min: 100000, name: '블루투스 스피커 (프리미엄)', price: '10만원~30만원', reason: '고음질 사운드 경험', emoji: '🎵' },
        { min: 150000, name: '태블릿 PC', price: '15만원~100만원', reason: '업무와 엔터테인먼트', emoji: '📱' },
        { min: 150000, name: '게이밍 마우스/키보드 세트', price: '15만원~50만원', reason: '게이머를 위한 선물', emoji: '🎮' },
        { min: 200000, name: '노트북 거치대/모니터', price: '20만원~80만원', reason: '생산성 향상', emoji: '💻' },
        { min: 300000, name: '드론', price: '30만원~200만원', reason: '새로운 관점의 촬영', emoji: '🚁' },
        { min: 500000, name: '최신 스마트폰', price: '50만원~200만원', reason: '일상의 모든 것', emoji: '📱' }
      ];
      techGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 패션/뷰티 관심사 (35개) =====
    if (interests.includes('fashion')) {
      const fashionGifts = [
        { min: 10000, name: '핸드크림/립밤 세트', price: '1만원~3만원', reason: '매일 쓰는 필수템', emoji: '💄' },
        { min: 15000, name: '양말 선물세트', price: '1.5만원~5만원', reason: '실용적인 패션 아이템', emoji: '🧦' },
        { min: 20000, name: '헤어 액세서리 세트', price: '2만원~8만원', reason: '포인트 아이템으로 딱', emoji: '💇' },
        { min: 25000, name: '스카프/머플러', price: '2.5만원~10만원', reason: '계절마다 활용도 높은', emoji: '🧣' },
        { min: 30000, name: '명품 양말/속옷 세트', price: '3만원~10만원', reason: '보이지 않는 고급스러움', emoji: '🧦' },
        { min: 30000, name: '마스크팩/스킨케어 세트', price: '3만원~15만원', reason: '피부 관리의 시작', emoji: '🧴' },
        { min: 35000, name: '미니 크로스백', price: '3.5만원~15만원', reason: '데일리 필수템', emoji: '👜' },
        { min: 40000, name: '지갑', price: '4만원~30만원', reason: '매일 꺼내 볼 선물', emoji: '💳' },
        { min: 50000, name: '향수 (브랜드)', price: '5만원~20만원', reason: '기억에 남는 향기', emoji: '💐' },
        { min: 50000, name: '벨트', price: '5만원~30만원', reason: '스타일 완성 아이템', emoji: '👔' },
        { min: 60000, name: '모자/캡', price: '6만원~20만원', reason: '패션과 실용성', emoji: '🎩' },
        { min: 70000, name: '선글라스', price: '7만원~50만원', reason: 'UV 차단과 멋', emoji: '🕶️' },
        { min: 80000, name: '뷰티 디바이스', price: '8만원~30만원', reason: '홈케어의 시작', emoji: '✨' },
        { min: 100000, name: '명품 키링/참', price: '10만원~30만원', reason: '작지만 특별한 명품', emoji: '🔑' },
        { min: 100000, name: '향수 세트 (명품)', price: '10만원~40만원', reason: '럭셔리 향기 경험', emoji: '🌹' },
        { min: 120000, name: '가죽 장갑', price: '12만원~40만원', reason: '겨울 필수 명품템', emoji: '🧤' },
        { min: 150000, name: '명품 카드지갑', price: '15만원~50만원', reason: '슬림한 지갑 트렌드', emoji: '💳' },
        { min: 150000, name: '화장품 세트 (백화점)', price: '15만원~50만원', reason: '풀세트 스킨케어', emoji: '💄' },
        { min: 200000, name: '시계', price: '20만원~100만원', reason: '시간을 함께하는 선물', emoji: '⌚' },
        { min: 200000, name: '명품 파우치', price: '20만원~80만원', reason: '실용적인 명품 입문', emoji: '👝' },
        { min: 250000, name: '구두/운동화 (명품)', price: '25만원~150만원', reason: '발걸음이 가벼워지는', emoji: '👟' },
        { min: 300000, name: '명품 지갑 (중형)', price: '30만원~100만원', reason: '일상의 동반자', emoji: '👛' },
        { min: 500000, name: '명품 가방', price: '50만원~500만원', reason: '평생 쓰는 투자', emoji: '👜' }
      ];
      fashionGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 음식/디저트 관심사 (30개) =====
    if (interests.includes('food')) {
      const foodGifts = [
        { min: 10000, name: '초콜릿 박스', price: '1만원~5만원', reason: '달콤한 행복', emoji: '🍫' },
        { min: 15000, name: '마카롱 세트', price: '1.5만원~5만원', reason: '감성 디저트', emoji: '🍭' },
        { min: 20000, name: '수제 쿠키/케이크', price: '2만원~8만원', reason: '정성이 담긴 맛', emoji: '🍪' },
        { min: 20000, name: '스타벅스 상품권', price: '2만원~10만원', reason: '언제나 환영받는 선물', emoji: '☕' },
        { min: 25000, name: '프리미엄 디저트 세트', price: '2.5만원~10만원', reason: '특별한 날의 디저트', emoji: '🍰' },
        { min: 30000, name: '와인', price: '3만원~20만원', reason: '특별한 순간과 함께', emoji: '🍷' },
        { min: 30000, name: '치즈/샤퀴테리 세트', price: '3만원~15만원', reason: '고급스러운 안주', emoji: '🧀' },
        { min: 35000, name: '프리미엄 커피 원두', price: '3.5만원~15만원', reason: '매일 즐기는 커피', emoji: '☕' },
        { min: 40000, name: '과일 선물세트', price: '4만원~20만원', reason: '건강한 달콤함', emoji: '🍎' },
        { min: 50000, name: '한우 선물세트', price: '5만원~30만원', reason: '프리미엄 고기 선물', emoji: '🥩' },
        { min: 50000, name: '전통주 세트', price: '5만원~20만원', reason: '우리 술의 멋', emoji: '🍶' },
        { min: 60000, name: '베이커리 상품권', price: '6만원~20만원', reason: '빵집 투어의 즐거움', emoji: '🥖' },
        { min: 70000, name: '프리미엄 초콜릿 (고디바)', price: '7만원~30만원', reason: '최고급 달콤함', emoji: '🍫' },
        { min: 80000, name: '건어물 선물세트', price: '8만원~30만원', reason: '영양 가득 안주', emoji: '🦐' },
        { min: 100000, name: '샴페인', price: '10만원~50만원', reason: '축하의 상징', emoji: '🍾' },
        { min: 100000, name: '프리미엄 와인 세트', price: '10만원~100만원', reason: '와인 애호가를 위한', emoji: '🍷' },
        { min: 120000, name: '굴비/명태 선물세트', price: '12만원~50만원', reason: '명절 필수템', emoji: '🐟' },
        { min: 150000, name: '호텔 뷔페/레스토랑 상품권', price: '15만원~50만원', reason: '특별한 식사 경험', emoji: '🍽️' },
        { min: 200000, name: '한우 세트 (1등급)', price: '20만원~100만원', reason: '최상급 고기 선물', emoji: '🥩' },
        { min: 300000, name: '홍삼/건강식품 세트', price: '30만원~100만원', reason: '건강을 위한 투자', emoji: '🎁' }
      ];
      foodGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 책/문구 관심사 (25개) =====
    if (interests.includes('book')) {
      const bookGifts = [
        { min: 10000, name: '베스트셀러 도서', price: '1만원~3만원', reason: '마음을 담은 책', emoji: '📖' },
        { min: 15000, name: '다이어리/플래너', price: '1.5만원~5만원', reason: '새해 계획의 시작', emoji: '📔' },
        { min: 15000, name: '북라이트', price: '1.5만원~8만원', reason: '독서의 친구', emoji: '💡' },
        { min: 20000, name: '독서대', price: '2만원~10만원', reason: '편안한 독서 자세', emoji: '📚' },
        { min: 20000, name: '볼펜/연필 세트', price: '2만원~8만원', reason: '필기의 즐거움', emoji: '✏️' },
        { min: 25000, name: '북엔드', price: '2.5만원~10만원', reason: '책장 정리 필수템', emoji: '📚' },
        { min: 30000, name: '프리미엄 만년필', price: '3만원~20만원', reason: '특별한 필기감', emoji: '🖊️' },
        { min: 30000, name: '책갈피 세트 (명품)', price: '3만원~15만원', reason: '책과 함께하는 친구', emoji: '🔖' },
        { min: 40000, name: '캘리그라피 세트', price: '4만원~15만원', reason: '손글씨의 예술', emoji: '🎨' },
        { min: 50000, name: '전집/시리즈 도서', price: '5만원~30만원', reason: '시리즈의 매력', emoji: '📚' },
        { min: 60000, name: '전자책 리더기', price: '6만원~30만원', reason: '언제 어디서나 독서', emoji: '📱' },
        { min: 100000, name: '북셀프', price: '10만원~50만원', reason: '나만의 서재', emoji: '📚' },
        { min: 150000, name: '독서 의자/쿠션', price: '15만원~100만원', reason: '편안한 독서 공간', emoji: '🪑' }
      ];
      bookGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 운동/건강 관심사 (30개) =====
    if (interests.includes('sport')) {
      const sportGifts = [
        { min: 15000, name: '운동 양말 세트', price: '1.5만원~5만원', reason: '발 건강 챙기기', emoji: '🧦' },
        { min: 20000, name: '헤어밴드/손목밴드', price: '2만원~8만원', reason: '운동 필수 악세서리', emoji: '🎽' },
        { min: 25000, name: '물통 (보온/보냉)', price: '2.5만원~10만원', reason: '수분 보충 필수', emoji: '💧' },
        { min: 30000, name: '요가매트', price: '3만원~15만원', reason: '홈트의 시작', emoji: '🧘' },
        { min: 35000, name: '스포츠타올', price: '3.5만원~10만원', reason: '땀 관리 필수템', emoji: '🧻' },
        { min: 40000, name: '운동 장갑', price: '4만원~15만원', reason: '손 보호하기', emoji: '🧤' },
        { min: 50000, name: '폼롤러/마사지볼', price: '5만원~20만원', reason: '운동 후 회복', emoji: '⚽' },
        { min: 50000, name: '스마트 줄넘기', price: '5만원~15만원', reason: '칼로리 측정 가능', emoji: '🏃' },
        { min: 60000, name: '덤벨 세트', price: '6만원~30만원', reason: '근력 운동의 기본', emoji: '🏋️' },
        { min: 70000, name: '저항밴드 세트', price: '7만원~20만원', reason: '다양한 운동 가능', emoji: '💪' },
        { min: 80000, name: '운동복 세트', price: '8만원~30만원', reason: '스타일리시한 운동', emoji: '👕' },
        { min: 100000, name: '운동화 (러닝/헬스)', price: '10만원~50만원', reason: '발 건강이 우선', emoji: '👟' },
        { min: 100000, name: '짐 가방/백팩', price: '10만원~40만원', reason: '운동 필수템 올인원', emoji: '🎒' },
        { min: 150000, name: '헬스장 PT 상품권', price: '15만원~100만원', reason: '전문 트레이닝', emoji: '🏋️' },
        { min: 150000, name: '스마트 체중계', price: '15만원~50만원', reason: '체성분 분석', emoji: '⚖️' },
        { min: 200000, name: '실내 자전거', price: '20만원~100만원', reason: '집에서 유산소', emoji: '🚴' },
        { min: 300000, name: '런닝머신', price: '30만원~300만원', reason: '홈짐 필수템', emoji: '🏃' },
        { min: 500000, name: '골프채 세트', price: '50만원~500만원', reason: '골프 입문/업그레이드', emoji: '⛳' }
      ];
      sportGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 취미/여가 관심사 (30개) =====
    if (interests.includes('hobby')) {
      const hobbyGifts = [
        { min: 10000, name: '컬러링북', price: '1만원~3만원', reason: '힐링 취미생활', emoji: '🎨' },
        { min: 15000, name: '퍼즐', price: '1.5만원~10만원', reason: '집중력 키우기', emoji: '🧩' },
        { min: 20000, name: '보드게임', price: '2만원~10만원', reason: '함께하는 즐거움', emoji: '🎲' },
        { min: 25000, name: '뜨개질/자수 키트', price: '2.5만원~8만원', reason: '손끝의 예술', emoji: '🧶' },
        { min: 30000, name: '프라모델', price: '3만원~30만원', reason: '조립의 즐거움', emoji: '🚂' },
        { min: 30000, name: '그림 그리기 세트', price: '3만원~20만원', reason: '예술적 감성', emoji: '🎨' },
        { min: 40000, name: '레고', price: '4만원~50만원', reason: '창의력 발휘', emoji: '🧱' },
        { min: 50000, name: '악기 (우쿨렐레/하모니카)', price: '5만원~30만원', reason: '음악의 시작', emoji: '🎸' },
        { min: 60000, name: '캠핑 의자', price: '6만원~30만원', reason: '편안한 야외 생활', emoji: '🪑' },
        { min: 70000, name: '바비큐 그릴 (휴대용)', price: '7만원~30만원', reason: '캠핑/야외 필수', emoji: '🍖' },
        { min: 80000, name: '온라인 클래스 수강권', price: '8만원~30만원', reason: '새로운 배움', emoji: '🎓' },
        { min: 100000, name: '사진 앨범 (디지털)', price: '10만원~40만원', reason: '추억 간직', emoji: '📷' },
        { min: 100000, name: '미니 프로젝터', price: '10만원~50만원', reason: '홈시어터 입문', emoji: '📽️' },
        { min: 150000, name: '캠핑 텐트', price: '15만원~100만원', reason: '자연과 하나되기', emoji: '⛺' },
        { min: 200000, name: '카메라 (미러리스)', price: '20만원~200만원', reason: '사진 취미 시작', emoji: '📸' },
        { min: 300000, name: '전자 피아노', price: '30만원~300만원', reason: '음악의 깊이', emoji: '🎹' }
      ];
      hobbyGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 홈/인테리어 관심사 (35개) =====
    if (interests.includes('home')) {
      const homeGifts = [
        { min: 10000, name: '캔들/인센스', price: '1만원~5만원', reason: '향기로운 공간', emoji: '🕯️' },
        { min: 15000, name: '쿠션', price: '1.5만원~10만원', reason: '포근한 감성', emoji: '🛋️' },
        { min: 20000, name: '액자', price: '2만원~15만원', reason: '추억을 벽에', emoji: '🖼️' },
        { min: 25000, name: '화분/식물', price: '2.5만원~20만원', reason: '공기 정화 효과', emoji: '🪴' },
        { min: 30000, name: '디퓨저 (프리미엄)', price: '3만원~15만원', reason: '지속적인 향기', emoji: '🌸' },
        { min: 30000, name: '티타올/키친타올 세트', price: '3만원~10만원', reason: '주방 필수템', emoji: '🧻' },
        { min: 40000, name: '방향제/방취제', price: '4만원~15만원', reason: '쾌적한 공간', emoji: '💨' },
        { min: 50000, name: '감성 조명', price: '5만원~30만원', reason: '무드 있는 공간', emoji: '💡' },
        { min: 50000, name: '시계 (벽걸이/탁상)', price: '5만원~50만원', reason: '인테리어 포인트', emoji: '⏰' },
        { min: 60000, name: '러그/발매트', price: '6만원~30만원', reason: '따뜻한 바닥', emoji: '🧸' },
        { min: 70000, name: '프리미엄 식기 세트', price: '7만원~30만원', reason: '일상을 특별하게', emoji: '🍽️' },
        { min: 80000, name: '와인잔/위스키잔 세트', price: '8만원~50만원', reason: '홈술의 품격', emoji: '🥃' },
        { min: 100000, name: '거울 (전신/탁상)', price: '10만원~50만원', reason: '공간 확장 효과', emoji: '🪞' },
        { min: 100000, name: '블라인드/커튼', price: '10만원~50만원', reason: '프라이버시 보호', emoji: '🪟' },
        { min: 120000, name: '가습기/공기청정기', price: '12만원~100만원', reason: '쾌적한 실내 환경', emoji: '💨' },
        { min: 150000, name: '침구 세트 (호텔식)', price: '15만원~100만원', reason: '숙면의 시작', emoji: '🛏️' },
        { min: 150000, name: '수납함/선반', price: '15만원~80만원', reason: '깔끔한 정리', emoji: '📦' },
        { min: 200000, name: '테이블/책상', price: '20만원~150만원', reason: '공간의 중심', emoji: '🪑' },
        { min: 200000, name: '의자 (사무용/식탁)', price: '20만원~200만원', reason: '편안한 앉기', emoji: '🪑' },
        { min: 300000, name: '소파', price: '30만원~300만원', reason: '거실의 주인공', emoji: '🛋️' },
        { min: 500000, name: '침대 프레임', price: '50만원~500만원', reason: '수면의 질 향상', emoji: '🛏️' }
      ];
      homeGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 여행/아웃도어 관심사 (30개) =====
    if (interests.includes('travel')) {
      const travelGifts = [
        { min: 10000, name: '여권 케이스', price: '1만원~5만원', reason: '여권 보호 필수', emoji: '🛂' },
        { min: 15000, name: '네임택', price: '1.5만원~5만원', reason: '짐 분실 방지', emoji: '🏷️' },
        { min: 20000, name: '여행용 파우치 세트', price: '2만원~10만원', reason: '깔끔한 짐 정리', emoji: '👝' },
        { min: 25000, name: '목쿠션', price: '2.5만원~10만원', reason: '장거리 이동 필수', emoji: '💤' },
        { min: 30000, name: '보조가방/크로스백', price: '3만원~15만원', reason: '여행 필수품', emoji: '🎒' },
        { min: 35000, name: '선크림/여행용 화장품', price: '3.5만원~15만원', reason: 'UV 차단 필수', emoji: '☀️' },
        { min: 40000, name: '접이식 우산', price: '4만원~15만원', reason: '날씨 대비', emoji: '☂️' },
        { min: 50000, name: '여행용 슬리퍼', price: '5만원~15만원', reason: '편안한 이동', emoji: '🩴' },
        { min: 60000, name: '아이스박스', price: '6만원~30만원', reason: '캠핑/피크닉 필수', emoji: '🧊' },
        { min: 80000, name: '백팩 (등산/여행)', price: '8만원~50만원', reason: '편안한 짐 운반', emoji: '🎒' },
        { min: 100000, name: '캐리어 (기내용)', price: '10만원~50만원', reason: '여행의 동반자', emoji: '🧳' },
        { min: 150000, name: '캐리어 (중형)', price: '15만원~80만원', reason: '일주일 여행용', emoji: '🧳' },
        { min: 200000, name: '등산화/트레킹화', price: '20만원~100만원', reason: '발 건강 지킴이', emoji: '👢' },
        { min: 200000, name: '캐리어 (대형)', price: '20만원~100만원', reason: '장기 여행용', emoji: '🧳' },
        { min: 300000, name: '액션캠', price: '30만원~150만원', reason: '여행 기록', emoji: '📹' },
        { min: 500000, name: '항공권 상품권', price: '50만원~300만원', reason: '꿈꾸던 여행', emoji: '✈️' }
      ];
      travelGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 기본 추천 (관심사 선택 안 했을 때) =====
    if (suggestions.length === 0 || interests.length === 0) {
      const basicGifts = [
        { min: 10000, name: '텀블러', price: '1만원~5만원', reason: '환경도 지키고 실용적', emoji: '🥤' },
        { min: 15000, name: '우산', price: '1.5만원~10만원', reason: '비 오는 날의 필수품', emoji: '☂️' },
        { min: 20000, name: '스타벅스/베이커리 상품권', price: '2만원~10만원', reason: '언제나 환영받는 선물', emoji: '☕' },
        { min: 30000, name: '꽃다발/꽃바구니', price: '3만원~15만원', reason: '마음을 전하는 방법', emoji: '💐' },
        { min: 40000, name: '캔들/디퓨저 세트', price: '4만원~20만원', reason: '향기로운 일상', emoji: '🕯️' },
        { min: 50000, name: '명품 소품 (키링)', price: '5만원~30만원', reason: '작지만 특별한 명품', emoji: '🔑' },
        { min: 80000, name: '명품 카드지갑', price: '8만원~30만원', reason: '실용적인 명품', emoji: '💳' },
        { min: 100000, name: '백화점 상품권', price: '10만원~100만원', reason: '원하는 것 직접 골라요', emoji: '🎁' },
        { min: 150000, name: '명품 지갑', price: '15만원~100만원', reason: '매일 쓰는 필수템', emoji: '👛' },
        { min: 200000, name: '시계', price: '20만원~200만원', reason: '시간을 함께', emoji: '⌚' }
      ];
      basicGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // ===== 상황별 특별 추천 =====
    if (occasion === 'birthday') {
      if (budgetNum >= 20000) {
        suggestions.push({
          name: '생일 케이크',
          price: '2만원~10만원',
          reason: '생일의 필수 아이템',
          emoji: '🎂'
        });
      }
      if (budgetNum >= 30000) {
        suggestions.push({
          name: '풍선/파티용품',
          price: '3만원~10만원',
          reason: '생일 분위기 업!',
          emoji: '🎈'
        });
      }
    }

    if (occasion === 'anniversary') {
      if (recipient === 'lover' || recipient === 'spouse') {
        if (budgetNum >= 50000) {
          suggestions.push({
            name: '레터링 꽃박스',
            price: '5만원~15만원',
            reason: '사랑을 전하는 꽃',
            emoji: '💐'
          });
        }
        if (budgetNum >= 100000) {
          suggestions.push({
            name: '커플링/액세서리',
            price: '10만원~100만원',
            reason: '영원한 사랑의 약속',
            emoji: '💍'
          });
        }
        if (budgetNum >= 200000) {
          suggestions.push({
            name: '호텔 숙박권',
            price: '20만원~100만원',
            reason: '특별한 하루를 선물',
            emoji: '🏨'
          });
        }
      }
    }

    if (occasion === 'holiday') {
      if (recipient === 'parents' || recipient === 'grandparents') {
        if (budgetNum >= 50000) {
          suggestions.push({
            name: '건강식품 세트',
            price: '5만원~50만원',
            reason: '건강을 생각하는 마음',
            emoji: '💊'
          });
        }
        if (budgetNum >= 100000) {
          suggestions.push({
            name: '홍삼 세트',
            price: '10만원~100만원',
            reason: '부모님 건강 챙기기',
            emoji: '🎁'
          });
        }
        if (budgetNum >= 50000) {
          suggestions.push({
            name: '과일/견과류 선물세트',
            price: '5만원~30만원',
            reason: '명절 정통 선물',
            emoji: '🍎'
          });
        }
      }
    }

    if (occasion === 'congrats') {
      if (budgetNum >= 30000) {
        suggestions.push({
          name: '축하 화환',
          price: '3만원~20만원',
          reason: '축하의 마음 전하기',
          emoji: '🎊'
        });
      }
      if (budgetNum >= 50000) {
        suggestions.push({
          name: '샴페인',
          price: '5만원~50만원',
          reason: '축하 파티의 주인공',
          emoji: '🍾'
        });
      }
    }

    if (occasion === 'promotion') {
      if (budgetNum >= 50000) {
        suggestions.push({
          name: '명함지갑',
          price: '5만원~30만원',
          reason: '새 출발을 응원',
          emoji: '💼'
        });
      }
      if (budgetNum >= 100000) {
        suggestions.push({
          name: '만년필 세트',
          price: '10만원~100만원',
          reason: '성공의 시작',
          emoji: '🖊️'
        });
      }
    }

    // ===== 받는 사람별 특별 추천 =====
    if (recipient === 'child') {
      const childGifts = [
        { min: 10000, name: '장난감', price: '1만원~10만원', reason: '아이의 즐거움', emoji: '🧸' },
        { min: 20000, name: '그림책/동화책', price: '2만원~10만원', reason: '상상력 키우기', emoji: '📚' },
        { min: 30000, name: '교육용 완구', price: '3만원~20만원', reason: '놀면서 배우기', emoji: '🎓' },
        { min: 50000, name: '어린이 자전거', price: '5만원~30만원', reason: '첫 자전거의 추억', emoji: '🚲' },
        { min: 100000, name: '키즈 타블렛', price: '10만원~50만원', reason: '교육과 놀이', emoji: '📱' }
      ];
      childGifts.forEach(gift => {
        if (budgetNum >= gift.min) suggestions.push(gift);
      });
    }

    // 예산에 맞게 필터링 및 정렬
    const filteredSuggestions = suggestions
      .filter(s => {
        const priceMatch = s.price.match(/(\d+)만원/);
        if (priceMatch) {
          const minPrice = parseInt(priceMatch[1]) * 10000;
          return minPrice <= budgetNum;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = parseInt(a.price.match(/(\d+)만원/)?.[1] || '0');
        const priceB = parseInt(b.price.match(/(\d+)만원/)?.[1] || '0');
        return priceA - priceB;
      });

    // 중복 제거
    const uniqueSuggestions = Array.from(
      new Map(filteredSuggestions.map(item => [item.name, item])).values()
    );

    setSuggestions(uniqueSuggestions.slice(0, 8));
    setShowResult(true);
  };

  const reset = () => {
    setRecipient('');
    setAge('');
    setGender('');
    setBudget('');
    setOccasion('');
    setInterests([]);
    setSuggestions([]);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link 
            href="/"
            className="inline-block mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            ← 홈으로
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            🎁 선물 추천
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            200개 이상의 선물 데이터로 완벽한 선물을 찾아드려요
          </p>
        </div>

        {!showResult ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            {/* 받는 사람 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
                🎯 누구에게 선물하나요?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'parents', label: '부모님', emoji: '👨‍👩‍👦' },
                  { id: 'grandparents', label: '조부모님', emoji: '👴' },
                  { id: 'lover', label: '연인', emoji: '💑' },
                  { id: 'spouse', label: '배우자', emoji: '💏' },
                  { id: 'friend', label: '친구', emoji: '👯' },
                  { id: 'colleague', label: '동료', emoji: '👔' },
                  { id: 'child', label: '자녀', emoji: '👶' },
                  { id: 'other', label: '기타', emoji: '🙂' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setRecipient(opt.id)}
                    className={`p-3 rounded-lg border-2 font-bold transition-all ${
                      recipient === opt.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                        : 'border-amber-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 bg-amber-50 dark:bg-gray-700 text-amber-900 dark:text-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.emoji}</div>
                    <div className="text-xs">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 예산 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
                💰 예산은 얼마나 되나요?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: '10000', label: '1만원대' },
                  { id: '20000', label: '2만원대' },
                  { id: '30000', label: '3만원대' },
                  { id: '50000', label: '5만원대' },
                  { id: '100000', label: '10만원대' },
                  { id: '200000', label: '20만원대' },
                  { id: '300000', label: '30만원대' },
                  { id: '500000', label: '50만원 이상' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setBudget(opt.id)}
                    className={`p-3 rounded-lg border-2 font-bold transition-all ${
                      budget === opt.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                        : 'border-amber-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 bg-amber-50 dark:bg-gray-700 text-amber-900 dark:text-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 상황 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
                🎊 어떤 상황인가요?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'birthday', label: '생일', emoji: '🎂' },
                  { id: 'anniversary', label: '기념일', emoji: '💝' },
                  { id: 'holiday', label: '명절', emoji: '🎁' },
                  { id: 'thanks', label: '감사', emoji: '🙏' },
                  { id: 'congrats', label: '축하', emoji: '🎉' },
                  { id: 'apology', label: '사과', emoji: '😔' },
                  { id: 'promotion', label: '승진/입학', emoji: '🎓' },
                  { id: 'etc', label: '그냥', emoji: '💝' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setOccasion(opt.id)}
                    className={`p-3 rounded-lg border-2 font-bold transition-all ${
                      occasion === opt.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                        : 'border-amber-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 bg-amber-50 dark:bg-gray-700 text-amber-900 dark:text-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.emoji}</div>
                    <div className="text-xs">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 관심사 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
                ❤️ 관심사를 선택해주세요 (다중선택 가능)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {interestOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-lg border-2 font-bold transition-all ${
                      interests.includes(opt.id)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                        : 'border-amber-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 bg-amber-50 dark:bg-gray-700 text-amber-900 dark:text-gray-200'
                    }`}
                  >
                    <div className="text-xs">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 추천 받기 버튼 */}
            <button
              onClick={generateSuggestions}
              className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              🎁 선물 추천 받기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 결과 헤더 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2">
                🎉 추천 선물 {suggestions.length}개
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                마음에 드는 선물을 골라보세요!
              </p>
            </div>

            {/* 추천 목록 */}
            <div className="grid md:grid-cols-2 gap-4">
              {suggestions.map((gift: GiftSuggestion, index: number) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{gift.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-2">
                        {gift.name}
                      </h3>
                      <p className="text-purple-600 dark:text-purple-400 font-bold mb-2">
                        {gift.price}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {gift.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 다시 하기 버튼 */}
            <button
              onClick={reset}
              className="w-full py-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              🔄 다시 추천 받기
            </button>
          </div>
        )}

        {/* 안내 */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p>💡 실제 구매 전 받는 분의 취향을 다시 한번 확인해보세요!</p>
          <p className="text-xs">📊 200개 이상의 선물 데이터 기반 추천 시스템</p>
        </div>

      {/* 제작자 서명 */}
      <AppFooter />
      </div>
    </div>
  );
}
