# 손금 분석 데이터 생성 요청 (GPT-5)

## 📋 요청 개요
손금 분석 웹앱을 위한 고급 데이터를 생성해주세요. 손바닥 사진을 업로드하면 Canvas API로 주요 손금선의 길이, 깊이, 위치를 분석하여 상세한 운세와 성격 분석을 제공합니다.

---

## 🎯 분석 시스템 구조

### 손금선 분석 (7가지 주요 선)
1. **생명선 (Life Line)** - 건강, 체력, 생명력
2. **지능선/두뇌선 (Head Line)** - 사고방식, 지적 능력
3. **감정선 (Heart Line)** - 애정운, 감성, 대인관계
4. **운명선 (Fate Line)** - 사회적 성공, 커리어
5. **결혼선 (Marriage Line)** - 연애, 결혼운
6. **재물선 (Money Line)** - 재운, 금전관계
7. **건강선 (Health Line)** - 건강 상태, 체질

### 패턴 코드 (27가지)
각 손금선의 **길이(Length)**, **깊이(Depth)**, **형태(Shape)**를 분석:

**길이 분류:**
- **L (Long/긴)**: 평균보다 20% 이상 긴 선
- **M (Medium/보통)**: 평균 범위 (±20%)
- **S (Short/짧은)**: 평균보다 20% 이상 짧은 선

**깊이 분류:**
- **D (Deep/깊은)**: 선명하고 깊게 파인 선
- **M (Medium/보통)**: 중간 정도 선명도
- **F (Faint/얕은)**: 흐릿하거나 얕은 선

**패턴 코드 예시:**
- `LD-MD-LD`: 생명선 길고깊음, 지능선 보통깊이, 감정선 길고깊음
- `SM-MF-SD`: 생명선 짧고보통, 지능선 보통얕음, 감정선 짧고깊음
- `LF-LD-MM`: 생명선 길고얕음, 지능선 길고깊음, 감정선 보통

**27개 패턴 분류 기준:**
- 생명선 (3단계: L/M/S) × 지능선 (3단계: L/M/S) × 감정선 (3단계: L/M/S) = 27가지

---

## 📊 필요한 데이터 구조

아래 TypeScript 인터페이스에 맞춰 **27개 패턴** 전체에 대한 데이터를 JSON으로 생성해주세요:

```typescript
interface PalmReadingAnalysis {
  // 기본 정보
  patternCode: string;        // 예: "LMS", "MML" 등 (생명선-지능선-감정선)
  title: string;              // 예: "강인한 실행형"
  emoji: string;              // 대표 이모지
  summary: string;            // 한 줄 요약 (50자 이내)
  
  // 손금선 상세 분석
  palmLines: {
    lifeLine: {
      length: string;         // "긴편", "보통", "짧은편"
      depth: string;          // "깊음", "보통", "얕음"
      interpretation: string; // 해석 (100자)
    };
    headLine: {
      length: string;
      depth: string;
      interpretation: string;
    };
    heartLine: {
      length: string;
      depth: string;
      interpretation: string;
    };
    fateLine: {
      presence: string;       // "뚜렷함", "보통", "희미함", "없음"
      interpretation: string;
    };
    marriageLine: {
      count: string;          // "여러개", "1~2개", "없음"
      interpretation: string;
    };
    moneyLine: {
      presence: string;       // "뚜렷함", "보통", "희미함", "없음"
      interpretation: string;
    };
    healthLine: {
      presence: string;
      interpretation: string;
    };
  };
  
  // 종합 운세 점수
  scores: {
    overall: number;          // 종합 운 (0~100)
    health: number;           // 건강운
    career: number;           // 사업운
    wealth: number;           // 재물운
    love: number;             // 애정운
    relationships: number;    // 대인관계운
    longevity: number;        // 장수 지수
  };
  
  // 성격 및 기질
  personality: {
    type: string;             // 성격 유형 (예: "행동파", "사색가", "감성형")
    strengths: string[];      // 강점 5개
    weaknesses: string[];     // 약점 3개
    traits: string[];         // 특징 5~7개
  };
  
  // 운세 상세 분석
  fortune: {
    career: {
      description: string;    // 직업운 해석 (150자)
      suitableJobs: string[]; // 적합한 직업 5~7개
      advice: string;         // 조언 (100자)
    };
    wealth: {
      description: string;    // 재물운 해석
      moneyStyle: string;     // 돈 관리 스타일
      advice: string;
    };
    love: {
      description: string;    // 애정운 해석
      loveStyle: string;      // 연애 스타일
      marriageAge: string;    // 결혼 적령기 예측
      advice: string;
    };
    health: {
      description: string;    // 건강운 해석
      weakPoints: string[];   // 주의해야 할 건강 부위 3~5개
      advice: string;
    };
  };
  
  // 인생 시기별 운세
  lifePhases: {
    youth: {                  // 0~30세
      period: string;
      fortune: string;        // "상승", "평탄", "굴곡"
      description: string;
      advice: string[];       // 2~3개
    };
    middle: {                 // 31~60세
      period: string;
      fortune: string;
      description: string;
      advice: string[];
    };
    senior: {                 // 61세 이후
      period: string;
      fortune: string;
      description: string;
      advice: string[];
    };
  };
  
  // 행운 아이템
  lucky: {
    colors: string[];         // 행운의 색상 5개 (HEX 코드 포함)
    numbers: number[];        // 행운의 숫자 5개
    directions: string[];     // 행운의 방향 3개
    stones: string[];         // 행운의 보석/돌 3개
    days: string[];           // 행운의 요일 2개
  };
  
  // 실천 가이드
  actionGuide: {
    daily: string[];          // 일상 실천 사항 5개
    avoid: string[];          // 피해야 할 것 3개
    develop: string[];        // 계발할 점 3개
  };
  
  // 궁합
  compatibility: {
    bestMatch: string[];      // 잘 맞는 손금 패턴 3개
    goodMatch: string[];      // 괜찮은 패턴 3개
    challenging: string[];    // 조심해야 할 패턴 2개
  };
  
  // 유명인 예시
  celebrities: {
    korean: string[];         // 한국 유명인 3~5명 (비슷한 손금)
    global: string[];         // 해외 유명인 3~5명
  };
  
  // 전문가 종합 조언
  expertAdvice: string;       // 200~300자
  
  // 특별 메시지
  specialNote: string;        // 50~100자
}
```

---

## 🎨 27개 패턴 목록

아래 27개 패턴 모두에 대한 데이터를 생성해주세요:

### 생명선 긴(L) 그룹 - 9개
1. `LLL` - 생명선 긴, 지능선 긴, 감정선 긴 (완벽형)
2. `LLM` - 생명선 긴, 지능선 긴, 감정선 보통
3. `LLS` - 생명선 긴, 지능선 긴, 감정선 짧은
4. `LML` - 생명선 긴, 지능선 보통, 감정선 긴
5. `LMM` - 생명선 긴, 지능선 보통, 감정선 보통 ⭐ 균형형
6. `LMS` - 생명선 긴, 지능선 보통, 감정선 짧은
7. `LSL` - 생명선 긴, 지능선 짧은, 감정선 긴
8. `LSM` - 생명선 긴, 지능선 짧은, 감정선 보통
9. `LSS` - 생명선 긴, 지능선 짧은, 감정선 짧은

### 생명선 보통(M) 그룹 - 9개
10. `MLL` - 생명선 보통, 지능선 긴, 감정선 긴
11. `MLM` - 생명선 보통, 지능선 긴, 감정선 보통
12. `MLS` - 생명선 보통, 지능선 긴, 감정선 짧은
13. `MML` - 생명선 보통, 지능선 보통, 감정선 긴
14. `MMM` - 생명선 보통, 지능선 보통, 감정선 보통 ⭐ 표준형
15. `MMS` - 생명선 보통, 지능선 보통, 감정선 짧은
16. `MSL` - 생명선 보통, 지능선 짧은, 감정선 긴
17. `MSM` - 생명선 보통, 지능선 짧은, 감정선 보통
18. `MSS` - 생명선 보통, 지능선 짧은, 감정선 짧은

### 생명선 짧은(S) 그룹 - 9개
19. `SLL` - 생명선 짧은, 지능선 긴, 감정선 긴
20. `SLM` - 생명선 짧은, 지능선 긴, 감정선 보통
21. `SLS` - 생명선 짧은, 지능선 긴, 감정선 짧은
22. `SML` - 생명선 짧은, 지능선 보통, 감정선 긴
23. `SMM` - 생명선 짧은, 지능선 보통, 감정선 보통
24. `SMS` - 생명선 짧은, 지능선 보통, 감정선 짧은
25. `SSL` - 생명선 짧은, 지능선 짧은, 감정선 긴
26. `SSM` - 생명선 짧은, 지능선 짧은, 감정선 보통
27. `SSS` - 생명선 짧은, 지능선 짧은, 감정선 짧은 (신중형)

---

## 💡 작성 가이드라인

1. **전통 수상학 기반**: 동양 + 서양 수상학 이론 모두 반영
2. **긍정적 접근**: 모든 손금은 장단점이 있음을 강조
3. **실용적 조언**: 구체적이고 실천 가능한 가이드
4. **과학적 균형**: 엔터테인먼트이지만 전문성 유지
5. **유명인 정확성**: 실제 존재하는 인물만 언급
6. **손금선 길이**: 생명선 짧다고 단명 X (현대 해석)

---

## 📝 출력 형식

아래와 같은 JSON 형식으로 **27개 패턴 전체**를 하나의 객체로 생성해주세요:

```json
{
  "LLL": { /* PalmReadingAnalysis 데이터 */ },
  "LLM": { /* PalmReadingAnalysis 데이터 */ },
  "LLS": { /* PalmReadingAnalysis 데이터 */ },
  ...
  "SSS": { /* PalmReadingAnalysis 데이터 */ }
}
```

---

## 🎯 특별 요청

1. **LMM (균형형)**: 가장 이상적인 손금으로 점수 높게
2. **MMM (표준형)**: 평균적이지만 안정적
3. **LLL (완벽형)**: 드물고 특별한 케이스
4. **SSS (신중형)**: 조심스럽지만 지혜로운 타입
5. **생명선 짧음**: "단명"이 아닌 "효율적 삶" 강조

---

## ✅ 체크리스트

- [ ] 27개 패턴 모두 작성
- [ ] 7가지 손금선 모두 해석
- [ ] 6가지 운세 점수 (0~100)
- [ ] 인생 3단계 (청년/중년/노년) 운세
- [ ] 행운 아이템 5가지 카테고리
- [ ] 실천 가이드 (해야 할 것 + 피해야 할 것)
- [ ] 궁합 (잘 맞는/조심할 패턴)
- [ ] 유명인 예시 6~10명
- [ ] JSON 문법 오류 없음
- [ ] 모든 문자열 한글 (고유명사 제외)

---

## 💬 예시 (MMM - 표준형)

```json
{
  "MMM": {
    "patternCode": "MMM",
    "title": "조화로운 균형형",
    "emoji": "⚖️",
    "summary": "안정적이고 균형 잡힌 인생. 극단 없는 꾸준한 성장형",
    "palmLines": {
      "lifeLine": {
        "length": "보통",
        "depth": "보통",
        "interpretation": "평균 이상의 건강과 체력. 큰 질병 없이 안정적으로 살아갈 운. 규칙적인 생활 습관 유지 시 장수 가능."
      },
      "headLine": {
        "length": "보통",
        "depth": "보통",
        "interpretation": "실용적이고 현실적인 사고방식. 논리와 감성의 균형. 학습 능력 양호하며 상황 판단력 우수."
      },
      "heartLine": {
        "length": "보통",
        "depth": "보통",
        "interpretation": "안정적인 감정선. 과하지도 모자라지도 않은 애정 표현. 원만한 대인관계와 안정적인 연애운."
      },
      "fateLine": {
        "presence": "보통",
        "interpretation": "직장 생활 안정적. 큰 부침 없이 꾸준히 커리어 성장. 40대 이후 안정기 진입."
      },
      "marriageLine": {
        "count": "1~2개",
        "interpretation": "1~2번의 진지한 연애 후 결혼. 결혼 생활 대체로 원만하며 이혼 확률 낮음."
      },
      "moneyLine": {
        "presence": "보통",
        "interpretation": "큰 부자는 아니지만 경제적으로 안정. 저축 습관 좋고 금전 관리 능력 우수."
      },
      "healthLine": {
        "presence": "희미함",
        "interpretation": "건강선 희미한 것이 오히려 길조. 건강 문제 적고 면역력 양호."
      }
    },
    "scores": {
      "overall": 82,
      "health": 85,
      "career": 80,
      "wealth": 78,
      "love": 83,
      "relationships": 86,
      "longevity": 88
    },
    "personality": {
      "type": "균형 조화형",
      "strengths": [
        "안정적이고 신뢰할 수 있음",
        "감정 조절 능력 우수",
        "현실적 판단력",
        "꾸준함과 인내심",
        "원만한 대인관계"
      ],
      "weaknesses": [
        "가끔 평범함에 만족해 도전을 회피",
        "큰 변화를 두려워하는 경향",
        "안전지향적이라 기회를 놓칠 수 있음"
      ],
      "traits": [
        "중용의 미덕을 아는 성격",
        "극단적이지 않고 중도적",
        "계획적이고 체계적",
        "타인과의 조화를 중시",
        "감정적 안정감",
        "책임감 있고 성실함"
      ]
    },
    "fortune": {
      "career": {
        "description": "직장 생활이나 사업 모두 무난하게 풀림. 큰 성공보다는 꾸준한 성장형. 40대 이후 안정기에 들어서며 경제적 여유 생김.",
        "suitableJobs": [
          "공무원, 교사",
          "금융권 직원",
          "회계사, 세무사",
          "의료 기술직",
          "기업 관리직",
          "연구직",
          "컨설턴트"
        ],
        "advice": "안정 추구는 좋으나 가끔은 과감한 도전도 필요합니다. 30대에 자기계발 투자를 아끼지 마세요."
      },
      "wealth": {
        "description": "근검절약형 재물운. 벼락부자는 어렵지만 차근차근 모아서 중년 이후 경제적 안정 달성. 부동산 투자운 양호.",
        "moneyStyle": "계획적 저축형. 충동구매 적고 예산 관리 철저. 노후 대비 잘하는 편.",
        "advice": "안정적 투자 선호는 좋으나 인플레이션 대비 수익형 자산도 일부 편입하세요."
      },
      "love": {
        "description": "안정적이고 따뜻한 애정운. 드라마틱한 로맨스보다는 편안하고 오래가는 사랑. 결혼 후 가정에 충실.",
        "loveStyle": "천천히 깊어지는 스타일. 감정 표현은 절제되지만 진심. 배우자에게 신뢰와 안정감 제공.",
        "marriageAge": "28~33세 사이 결혼 확률 높음",
        "advice": "때로는 감정을 더 솔직하게 표현하세요. 상대방도 당신의 사랑을 확인하고 싶어 합니다."
      },
      "health": {
        "description": "전반적으로 건강 양호. 큰 질병보다는 과로, 스트레스성 질환 주의. 규칙적 생활 습관 유지 시 장수.",
        "weakPoints": [
          "소화기계 (스트레스성 위염)",
          "근골격계 (장시간 앉아있는 직업 시)",
          "눈 피로 (디지털 기기 과다 사용)",
          "어깨 결림",
          "수면 장애 (신경 예민 시)"
        ],
        "advice": "30분마다 스트레칭, 주 3회 이상 유산소 운동, 충분한 수면이 건강 유지 비결입니다."
      }
    },
    "lifePhases": {
      "youth": {
        "period": "0~30세",
        "fortune": "평탄",
        "description": "큰 부침 없이 무난한 청년기. 학업 성취도 평균 이상. 진로 고민은 있으나 결국 안정적 선택.",
        "advice": [
          "20대에 다양한 경험 쌓기",
          "자격증이나 전문 기술 습득",
          "인맥 관리 시작하기"
        ]
      },
      "middle": {
        "period": "31~60세",
        "fortune": "상승",
        "description": "인생의 황금기. 커리어 안정되고 경제적 여유 생김. 가정도 화목하며 사회적 신뢰 쌓임.",
        "advice": [
          "40대 초반 재테크 본격화",
          "자녀 교육과 노후 준비 병행",
          "건강검진 정기적으로 받기"
        ]
      },
      "senior": {
        "period": "61세 이후",
        "fortune": "평탄",
        "description": "경제적으로 안정된 노년. 건강 관리만 잘하면 장수 가능. 손주들에게 좋은 할머니/할아버지.",
        "advice": [
          "가벼운 운동 꾸준히",
          "사회 활동과 취미 생활 유지",
          "정기 건강검진 필수"
        ]
      }
    },
    "lucky": {
      "colors": [
        "베이지 (#F5F5DC)",
        "올리브 그린 (#808000)",
        "네이비 블루 (#000080)",
        "크림 (#FFFDD0)",
        "브라운 (#A52A2A)"
      ],
      "numbers": [3, 7, 12, 21, 33],
      "directions": ["북동쪽", "남쪽", "서쪽"],
      "stones": ["황수정", "옥", "마노"],
      "days": ["수요일", "금요일"]
    },
    "actionGuide": {
      "daily": [
        "아침에 10분 스트레칭으로 하루 시작",
        "감사 일기 쓰기 (하루 3가지)",
        "규칙적인 식사 시간 지키기",
        "하루 30분 독서나 자기계발",
        "잠자기 전 명상이나 심호흡"
      ],
      "avoid": [
        "충동적인 결정",
        "과도한 음주와 야식",
        "부정적인 사람들과의 교류"
      ],
      "develop": [
        "가끔은 모험심과 도전정신 발휘",
        "감정 표현 더 풍부하게",
        "새로운 취미나 기술 배우기"
      ]
    },
    "compatibility": {
      "bestMatch": ["LMM", "MLM", "MML"],
      "goodMatch": ["LLL", "MMM", "LMS"],
      "challenging": ["SSS", "SMS"]
    },
    "celebrities": {
      "korean": [
        "유재석",
        "손흥민",
        "윤여정",
        "정용화"
      ],
      "global": [
        "톰 행크스 (Tom Hanks)",
        "엠마 왓슨 (Emma Watson)",
        "키아누 리브스 (Keanu Reeves)"
      ]
    },
    "expertAdvice": "균형 잡힌 손금을 가진 당신은 인생의 승자입니다. 극단적인 부침은 적지만, 그만큼 안정적이고 행복한 삶을 살 가능성이 높습니다. 평범함 속에서 특별함을 찾는 지혜를 가지세요. 때로는 과감한 도전도 필요하지만, 당신의 본질인 '균형'을 잃지 않는 선에서 하세요. 50대 이후가 인생의 진정한 전성기가 될 것입니다.",
    "specialNote": "⚖️ 조화와 균형은 가장 강력한 무기입니다. 극단을 피하고 중도를 지키는 당신의 삶은 평온하고 행복할 것입니다."
  }
}
```

---

**이제 나머지 26개 패턴도 위와 같은 퀄리티로 생성해주세요!** 
전체를 하나의 JSON 파일로 완성해주시면 됩니다. 🙏✨

