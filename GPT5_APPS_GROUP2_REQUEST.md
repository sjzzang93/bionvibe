# 웹앱 데이터 생성 요청 - 그룹2 (GPT-5)

## 📋 요청 개요
아래 3개 웹앱을 위한 고급 데이터를 생성해주세요. 각 앱은 독립적인 JSON 데이터로 제공하며, 실용적이고 맞춤화된 추천을 제공합니다.

---

## 💊 1. 영양제 추천 (Health Supplement Recommendation)

### 개요
연령, 성별, 생활습관, 증상을 종합 분석하여 개인 맞춤형 영양제를 추천하는 시스템.

### 필요한 데이터 구조

```typescript
interface SupplementData {
  // 증상별 영양제 매칭 (100개 증상)
  symptomMatching: {
    symptom: string;          // "만성 피로"
    severity: '경미' | '보통' | '심각';
    relatedSymptoms: string[];
    recommendedSupplements: {
      name: string;           // "비타민 B12"
      priority: '필수' | '권장' | '선택';
      dosage: string;         // "하루 1000μg"
      timing: string;         // "아침 식후"
      duration: string;       // "3개월"
      expectedEffect: string;
      caution: string[];      // 주의사항
    }[];
    lifestyleAdvice: string[];
  }[];
  
  // 연령대별 필수 영양제 (10대~80대)
  ageBasedSupplements: {
    ageGroup: string;         // "30-39세"
    gender: 'male' | 'female' | 'both';
    essential: {
      supplement: string;
      reason: string;
      dosage: string;
      benefits: string[];
    }[];
    recommended: {
      supplement: string;
      condition: string;      // "사무직이라면"
      reason: string;
    }[];
    avoid: {
      supplement: string;
      reason: string;
    }[];
  }[];
  
  // 생활습관별 추천 (40개 상황)
  lifestyleBasedSupplements: {
    lifestyle: string;        // "야근이 잦은 직장인"
    challenges: string[];     // 건강 문제
    supplements: {
      morning: string[];
      afternoon: string[];
      evening: string[];
      reason: string;
    };
    synergy: string;          // 조합 효과
    alternatives: string[];   // 자연식품 대안
  }[];
  
  // 영양제 조합 가이드
  supplementCombinations: {
    baseSupplements: string[];
    compatibleWith: string[];  // 함께 먹어도 되는 것
    avoidWith: string[];       // 함께 피해야 하는 것
    timingAdvice: string;
    absorptionTips: string[];
    cost: string;              // 월 예상 비용
  }[];
  
  // 브랜드별 비교 (주요 20개 브랜드)
  brandComparison: {
    supplement: string;
    brands: {
      name: string;
      price: string;
      dosage: string;
      additives: string[];
      certification: string[];
      rating: number;
      pros: string[];
      cons: string[];
    }[];
  }[];
  
  // 영양제 복용 시간표
  dailySchedule: {
    time: string;             // "아침 7시 (식후)"
    supplements: string[];
    reason: string;
    tips: string[];
  }[];
  
  // 부작용 및 주의사항
  sideEffects: {
    supplement: string;
    commonSideEffects: string[];
    rareButSerious: string[];
    interactions: {
      withMedicine: string[];
      withFood: string[];
      withOtherSupplements: string[];
    };
    whoShouldAvoid: string[];
  }[];
}
```

### 요구사항
- **100가지 증상**: 피로, 불면, 탈모, 시력 저하 등
- **연령별 세분화**: 10년 단위로 맞춤 추천
- **과학적 근거**: 임상 연구 기반
- **한국 실정**: 국내 브랜드 포함
- **경제성**: 가성비 고려

---

## 🎁 2. 선물 추천 (Gift Recommendation)

### 개요
받는 사람의 관계, 나이, 성별, 취향, 예산을 고려한 맞춤형 선물 추천 시스템.

### 필요한 데이터 구조

```typescript
interface GiftData {
  // 관계별 선물 추천 (30가지 관계)
  relationshipGifts: {
    relationship: string;     // "직장 상사"
    occasion: string;         // "승진 축하"
    ageRange: string;
    gender: 'male' | 'female' | 'neutral';
    
    budgetRanges: {
      budget: string;         // "3만원~5만원"
      gifts: {
        name: string;
        category: string;     // "생활용품", "식품" 등
        price: string;
        description: string;
        why: string;          // 추천 이유
        purchaseLinks: string[]; // 쿠팡, 네이버쇼핑 등
        alternatives: string[];
        giftWrappingTip: string;
      }[];
    }[];
    
    etiquette: string[];      // 선물 에티켓
    avoidGifts: string[];     // 피해야 할 선물
  }[];
  
  // 나이별 인기 선물 (10대~70대)
  ageBasedGifts: {
    ageGroup: string;
    gender: 'male' | 'female' | 'unisex';
    trending: {
      name: string;
      reason: string;
      priceRange: string;
      where: string;          // 구매처
    }[];
    timeless: {               // 언제나 좋은 선물
      name: string;
      reason: string;
    }[];
    avoid: string[];
  }[];
  
  // 상황별 선물 (60가지 상황)
  occasionGifts: {
    occasion: string;         // "집들이", "승진", "출산"
    mustHaveGifts: string[];
    niceToHaveGifts: string[];
    budget: {
      minimum: string;
      average: string;
      premium: string;
    };
    timing: string;           // "행사 3일 전"
    presentationTips: string[];
    message: string;          // 카드 문구 예시
  }[];
  
  // 취향별 추천 (30가지 취향)
  hobbyBasedGifts: {
    hobby: string;            // "독서", "운동", "요리"
    level: '입문' | '중급' | '고급';
    gifts: {
      item: string;
      benefit: string;
      price: string;
      difficulty: string;
    }[];
    surpriseGifts: string[];  // 생각지 못한 선물
  }[];
  
  // 계절별 추천
  seasonalGifts: {
    season: string;
    weatherConsideration: string;
    popularItems: string[];
    practicalGifts: string[];
    luxuryGifts: string[];
  }[];
  
  // 선물 포장 가이드
  wrappingGuide: {
    style: string;            // "모던", "클래식", "큐트"
    materials: string[];
    steps: string[];
    difficulty: string;
    cost: string;
    whenToUse: string;
  }[];
  
  // 선물 실패 사례 및 해결법
  commonMistakes: {
    mistake: string;
    why: string;
    solution: string;
    betterAlternative: string;
  }[];
}
```

### 요구사항
- **30가지 관계**: 가족, 친구, 직장, 연인 등
- **60가지 상황**: 생일, 기념일, 명절, 축하, 위로 등
- **실용성**: 실제 구매 가능한 상품
- **가격대**: 1만원~50만원 다양하게
- **한국 문화**: 한국 선물 문화 반영

---

## ✉️ 3. 봉투 추천 (Gift Money Recommendation)

### 개요
경조사별, 관계별로 적정한 축의금/조의금/선물금 금액을 추천하고 에티켓을 안내합니다.

### 필요한 데이터 구조

```typescript
interface EnvelopeData {
  // 경조사별 금액 가이드
  occasions: {
    type: '축하' | '조의' | '선물';
    event: string;            // "결혼식", "장례식", "돌잔치"
    
    amountGuide: {
      relationship: string;   // "직장 동료"
      baseAmount: number;     // 기본 금액
      minAmount: number;
      maxAmount: number;
      factors: {
        factor: string;       // "친밀도", "지역", "연령"
        adjustment: string;   // "+1만원", "-5천원"
        reason: string;
      }[];
    }[];
    
    etiquette: {
      envelopeColor: string;
      writing: string[];      // 봉투 작성법
      timing: string;         // "식 시작 30분 전"
      handover: string;       // 전달 방법
      message: string[];      // 축하/위로 문구 예시 5개
    };
    
    regionalDifference: {
      region: string;         // "서울", "부산", "제주"
      averageAmount: number;
      customs: string[];
    }[];
    
    doAndDonts: {
      do: string[];
      dont: string[];
    };
  }[];
  
  // 관계별 금액 매트릭스
  relationshipMatrix: {
    relationship: string;
    intimacy: '낮음' | '보통' | '높음';
    situations: {
      wedding: string;        // "10만원~15만원"
      funeral: string;
      babyBirth: string;
      firstBirthday: string;
      housewarming: string;
      graduation: string;
      promotion: string;
    };
    notes: string[];
  }[];
  
  // 직장 관계 특별 가이드
  workplaceGuide: {
    position: string;         // "팀원", "팀장", "임원"
    myPosition: string;
    events: {
      event: string;
      individualAmount: string;
      groupAmount: string;    // 부서 단위
      participation: string;  // "필수", "선택"
      notes: string[];
    }[];
  }[];
  
  // 연령대별 금액 트렌드
  ageTrends: {
    myAge: string;            // "20대"
    peerExpectation: string;  // 또래 평균
    events: {
      event: string;
      averageAmount: number;
      range: string;
      economicConsideration: string;
    }[];
  }[];
  
  // 특수 상황 가이드
  specialSituations: {
    situation: string;        // "재혼", "원거리", "COVID-19"
    howToHandle: string;
    amountAdjustment: string;
    etiquetteChange: string;
    alternatives: string[];   // 금액 대신 다른 방법
  }[];
  
  // 봉투 작성 템플릿
  envelopeTemplates: {
    occasion: string;
    relationship: string;
    frontText: string[];      // 앞면 문구 3가지
    backText: string[];       // 뒷면 (이름 작성)
    fontStyle: string;
    colorRecommendation: string;
  }[];
  
  // 금액 계산기 로직
  calculator: {
    baseFactors: {
      name: string;           // "관계", "친밀도", "장소"
      weight: number;         // 가중치
      options: {
        option: string;
        value: number;
      }[];
    }[];
    formula: string;
    adjustmentRules: string[];
  };
  
  // FAQ
  commonQuestions: {
    question: string;
    answer: string;
    relatedSituations: string[];
  }[];
}
```

### 요구사항
- **10가지 경조사**: 결혼, 장례, 돌잔치, 집들이 등
- **20가지 관계**: 가족, 친척, 친구, 직장 등
- **지역별 차이**: 서울, 경기, 영남, 호남, 제주
- **연령대 고려**: 20대~60대 금액 트렌드
- **실용성**: 즉시 판단 가능한 가이드

---

## 📤 출력 형식

하나의 JSON 파일로 제공해주세요:

```json
{
  "supplement": { /* SupplementData */ },
  "gift": { /* GiftData */ },
  "envelope": { /* EnvelopeData */ }
}
```

---

## ✅ 체크리스트

**영양제 추천:**
- [ ] 증상별 매칭 100개
- [ ] 연령별 필수 영양제
- [ ] 생활습관별 추천 40개
- [ ] 브랜드 비교 20개
- [ ] 부작용 정보

**선물 추천:**
- [ ] 관계별 30가지
- [ ] 상황별 60가지
- [ ] 취향별 30가지
- [ ] 선물 포장 가이드
- [ ] 실패 사례 및 해결

**봉투 추천:**
- [ ] 경조사 10가지
- [ ] 관계별 매트릭스
- [ ] 지역별 차이
- [ ] 직장 가이드
- [ ] 봉투 작성 템플릿

**공통:**
- [ ] JSON 문법 오류 없음
- [ ] 한글 작성
- [ ] 실용적 정보
- [ ] 한국 문화 반영

---

생성해주세요! 🎁
