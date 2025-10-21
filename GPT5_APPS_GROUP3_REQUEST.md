# 웹앱 데이터 생성 요청 - 그룹3 (GPT-5)

## 📋 요청 개요
아래 2개 웹앱을 위한 고급 데이터를 생성해주세요. 감성적이고 개인화된 추천을 제공합니다.

---

## 😊 1. 기분 전환 (Mood Cheer Up)

### 개요
현재 기분 상태를 분석하고, 기분을 전환하거나 개선할 수 있는 맞춤형 활동, 콘텐츠, 음악, 명언을 추천합니다.

### 필요한 데이터 구조

```typescript
interface MoodData {
  // 기분 상태 분류 (30가지)
  moodStates: {
    mood: string;             // "우울함", "불안함", "무기력"
    intensity: '낮음' | '보통' | '높음';
    emoji: string;
    description: string;
    commonCauses: string[];   // 일반적 원인
    physicalSymptoms: string[];
    mentalSymptoms: string[];
    
    immediateActions: {
      action: string;         // "5분 명상"
      duration: string;
      difficulty: '쉬움' | '보통';
      effectiveness: number;  // 1-10
      howTo: string[];        // 실행 방법
    }[];
    
    activities: {
      indoor: string[];       // 실내 활동 10개
      outdoor: string[];      // 실외 활동 10개
      creative: string[];     // 창작 활동 5개
      physical: string[];     // 신체 활동 5개
      social: string[];       // 사회적 활동 5개
      alone: string[];        // 혼자 하는 활동 5개
    };
    
    media: {
      movies: {
        title: string;
        genre: string;
        why: string;
        mood: string;         // 영화 분위기
      }[];
      tvShows: {
        title: string;
        genre: string;
        why: string;
      }[];
      books: {
        title: string;
        author: string;
        genre: string;
        why: string;
      }[];
      podcasts: {
        title: string;
        theme: string;
        why: string;
      }[];
    };
    
    music: {
      genre: string[];
      mood: string;           // "경쾌한", "차분한"
      playlist: {
        name: string;
        songs: string[];      // 5곡
        why: string;
      }[];
    };
    
    quotes: {
      quote: string;
      author: string;
      context: string;
    }[];                      // 10개
    
    foods: {
      name: string;
      type: '간식' | '식사' | '음료';
      why: string;
      ingredients: string[];
      mood: string;           // "위로", "활력"
    }[];
    
    breathing: {
      technique: string;
      steps: string[];
      duration: string;
      benefit: string;
    }[];
    
    affirmations: string[];   // 긍정 확언 20개
    
    journaling: {
      prompt: string;         // 일기 프롬프트
      why: string;
      example: string;
    }[];
    
    professionalHelp: {
      when: string[];         // 전문가 도움 필요 신호
      resources: {
        type: string;         // "상담센터", "핫라인"
        name: string;
        contact: string;
        description: string;
      }[];
    };
  }[];
  
  // 시간대별 추천 (24시간)
  timeBasedActivities: {
    timeRange: string;        // "아침 6-9시"
    mood: string[];           // 적합한 기분
    activities: string[];
    why: string;
    energy: string;           // "에너지 충전"
  }[];
  
  // 날씨별 추천
  weatherBasedActivities: {
    weather: string;          // "비 오는 날"
    mood: string[];
    indoor: string[];
    outdoor: string[];
    creative: string[];
    tips: string[];
  }[];
  
  // 짧은 시간별 활동 (5분, 10분, 30분, 1시간)
  quickActivities: {
    duration: number;         // 분
    activities: {
      name: string;
      category: string;
      steps: string[];
      benefit: string;
      mood: string[];         // 적합한 기분
    }[];
  }[];
  
  // 감정 일기 템플릿
  journalTemplates: {
    prompt: string;
    questions: string[];
    reflection: string;
    actionItem: string;
  }[];
  
  // 습관 형성 가이드
  habitBuilding: {
    habit: string;            // "아침 산책"
    benefit: string;
    howToStart: string[];
    obstacles: string[];
    solutions: string[];
    tracking: string;
  }[];
}
```

### 요구사항
- **30가지 기분**: 긍정/부정/중립 모두 포함
- **다양한 활동**: 실내/실외, 혼자/함께, 비용 고려
- **즉시 실행**: 5분 안에 시작 가능한 것들
- **전문적 조언**: 심리학 기반
- **한국 콘텐츠**: 한국 영화, 음악, 책 포함

---

## ✈️ 2. 여행지 추천 (Travel Destination Recommendation)

### 개요
예산, 여행 스타일, 동행인, 계절을 고려한 맞춤형 국내외 여행지 추천 시스템.

### 필요한 데이터 구조

```typescript
interface TravelData {
  // 국내 여행지 (100개 지역)
  domesticDestinations: {
    name: string;
    region: string;           // "서울", "강원", "제주" 등
    type: string[];           // "자연", "도시", "역사", "힐링"
    
    bestSeason: string[];
    avoid: string[];          // 피해야 할 시기
    
    budget: {
      transportation: string;
      accommodation: string;  // 1박 평균
      food: string;           // 1일 평균
      activities: string;
      total2Days: string;     // 1박 2일 총 예상
      total3Days: string;     // 2박 3일
    };
    
    transportation: {
      from: string;           // "서울 출발 기준"
      options: {
        method: string;       // "KTX", "버스", "자차"
        duration: string;
        cost: string;
        pros: string[];
        cons: string[];
      }[];
    };
    
    mustVisit: {
      name: string;
      category: string;       // "명소", "맛집", "카페"
      description: string;
      visitDuration: string;
      cost: string;
      tips: string[];
    }[];                      // 최소 10개
    
    accommodation: {
      type: string;           // "호텔", "펜션", "게스트하우스"
      name: string;
      priceRange: string;
      features: string[];
      bookingTip: string;
    }[];
    
    foodie: {
      mustEat: string[];      // 특산물/명물 5개
      restaurants: {
        name: string;
        menu: string;
        price: string;
        why: string;
      }[];
    };
    
    itinerary: {
      day: number;
      morning: string[];
      afternoon: string[];
      evening: string[];
      meals: string[];
      accommodation: string;
    }[];                      // 1박2일, 2박3일
    
    travelWith: {
      companion: string;      // "연인", "가족", "친구", "혼자"
      recommended: boolean;
      activities: string[];
      tips: string[];
    }[];
    
    photography: {
      spot: string;
      bestTime: string;
      tips: string;
    }[];
    
    localTips: string[];      // 현지인 꿀팁 10개
    
    accessibility: {
      publicTransport: string;
      parking: string;
      disability: string;
    };
  }[];
  
  // 해외 여행지 (50개국 100개 도시)
  internationalDestinations: {
    country: string;
    city: string;
    continent: string;
    
    visa: {
      required: boolean;
      type: string;
      duration: string;
      cost: string;
      process: string[];
    };
    
    budget: {
      flight: string;         // "왕복 항공권"
      accommodation: string;  // "1박 평균"
      food: string;           // "1일 평균"
      activities: string;
      total5Days: string;     // 3박 5일
      total7Days: string;     // 5박 7일
      currency: string;
      exchangeRate: string;
    };
    
    bestSeason: string[];
    avoid: string[];
    climate: string;
    
    mustVisit: {
      name: string;
      category: string;
      description: string;
      entryFee: string;
      visitDuration: string;
      tips: string[];
    }[];
    
    food: {
      mustTry: string[];
      restaurants: {
        name: string;
        cuisine: string;
        price: string;
        michelin: boolean;
      }[];
    };
    
    safety: {
      rating: number;         // 1-10
      warnings: string[];
      tips: string[];
      emergency: {
        police: string;
        ambulance: string;
        embassy: string;
      };
    };
    
    language: {
      primary: string;
      englishLevel: string;
      essentialPhrases: {
        korean: string;
        translation: string;
        pronunciation: string;
      }[];                    // 20개
    };
    
    culture: {
      customs: string[];      // 문화적 주의사항
      etiquette: string[];
      tipping: string;
      holidays: string[];
    };
    
    itinerary: {
      day: number;
      theme: string;
      activities: string[];
      meals: string[];
      tips: string[];
    }[];                      // 5일, 7일
    
    shoppingGuide: {
      area: string;
      items: string[];
      priceRange: string;
      tips: string[];
    }[];
    
    photography: {
      spot: string;
      bestTime: string;
      permission: string;
      tips: string;
    }[];
  }[];
  
  // 여행 스타일별 추천
  travelStyles: {
    style: string;            // "럭셔리", "배낭", "로컬", "액티비티"
    budget: string;
    pace: string;             // "여유", "빠름"
    characteristics: string[];
    recommendedDestinations: string[];
    packingList: string[];
    tips: string[];
  }[];
  
  // 동행인별 추천
  companionBased: {
    companion: string;        // "연인", "친구", "가족", "혼자"
    ageRange: string;
    destinations: {
      domestic: string[];
      international: string[];
    };
    activities: string[];
    accommodationType: string[];
    budgetConsideration: string;
    tips: string[];
  }[];
  
  // 예산별 추천 (10만원~500만원)
  budgetBased: {
    budget: string;
    duration: string;
    domestic: string[];
    international: string[];
    whatIncluded: string[];
    savingTips: string[];
  }[];
  
  // 체크리스트
  travelChecklist: {
    phase: string;            // "출발 1달 전", "1주 전", "당일"
    items: {
      task: string;
      priority: '필수' | '권장';
      tips: string;
    }[];
  }[];
  
  // 짐싸기 가이드
  packingGuide: {
    destination: string;      // "동남아", "유럽", "국내"
    season: string;
    duration: string;
    essentials: string[];
    optional: string[];
    avoid: string[];
    tips: string[];
  }[];
}
```

### 요구사항
- **국내 100개**: 전국 주요 여행지
- **해외 100개**: 인기 여행지 위주
- **실용 정보**: 예산, 교통, 숙박 상세
- **최신 정보**: 2024-2025년 기준
- **한국인 관점**: 한국 출발 기준

---

## 📝 출력 형식

2개 앱의 데이터를 각각 독립된 JSON으로 생성해주세요:

```json
{
  "mood": { /* MoodData */ },
  "travel": { /* TravelData */ }
}
```

---

## ✅ 체크리스트

**기분 전환:**
- [ ] 기분 상태 30가지
- [ ] 활동 카테고리별 분류
- [ ] 미디어 추천 (영화/책/음악)
- [ ] 명언 300개 이상
- [ ] 전문가 도움 리소스

**여행지 추천:**
- [ ] 국내 100개 지역
- [ ] 해외 100개 도시
- [ ] 예산별 상세 정보
- [ ] 여행 일정표
- [ ] 체크리스트 & 짐싸기

**공통:**
- [ ] JSON 문법 오류 없음
- [ ] 한글 작성
- [ ] 실용적이고 최신 정보
- [ ] 즉시 활용 가능

---

생성해주세요! ✈️😊

