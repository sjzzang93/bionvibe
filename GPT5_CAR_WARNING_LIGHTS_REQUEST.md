# 자동차 알림경고등 데이터 생성 요청 (GPT-5)

## 📋 요청 개요
자동차 계기판에 표시되는 모든 경고등의 의미, 대처법, 위험도를 체계적으로 정리한 데이터를 생성해주세요.

---

## 🚗 자동차 알림경고등 종류 (Car Warning Lights)

### 개요
50개 이상의 자동차 경고등을 색상별(빨강/노랑/녹색), 시스템별로 분류하고, 각 경고등의 의미와 즉각 대처법을 제공합니다.

### 필요한 데이터 구조

```typescript
interface CarWarningLightsData {
  // 경고등 전체 목록 (50개 이상)
  warningLights: {
    id: string;               // "engine-check"
    name: string;             // "엔진 경고등"
    icon: string;             // "🔧" (이모지)
    symbol: string;           // "CHECK ENGINE" (실제 표시 문자)
    color: '빨강' | '노랑' | '녹색' | '파랑' | '흰색';
    category: string;         // "엔진", "브레이크", "안전장치" 등
    
    severity: {
      level: '긴급' | '중요' | '주의' | '정보';
      urgency: string;        // "즉시 정차", "빠른 점검 필요", "편한 시간에 점검"
      dangerRating: number;   // 1-10 (10이 최고 위험)
    };
    
    meaning: {
      simple: string;         // "엔진에 문제가 발생했습니다"
      detailed: string;       // 상세 설명 (3-4문장)
      possibleCauses: string[]; // 발생 가능한 원인 5-7개
    };
    
    immediateAction: {
      whatToDo: string[];     // 즉시 취해야 할 행동 3-5개
      doNot: string[];        // 절대 하지 말아야 할 것 2-3개
      canDrive: boolean;      // 주행 가능 여부
      maxDistance: string;    // "즉시 정차" 또는 "50km 이내 점검"
    };
    
    ifIgnored: {
      shortTerm: string;      // 단기간 방치 시 (1주일 이내)
      longTerm: string;       // 장기간 방치 시
      worstCase: string;      // 최악의 경우
      additionalDamage: string[]; // 연쇄 고장 가능성
    };
    
    repairInfo: {
      estimatedCost: {
        min: number;
        max: number;
        average: number;
      };
      repairTime: string;     // "30분", "2-3시간", "1일"
      whereToFix: string[];   // "공식 서비스센터", "정비소", "직접 해결 가능"
      parts: string[];        // 교체/점검 필요 부품
    };
    
    prevention: {
      regularMaintenance: string[];
      checkInterval: string;  // "3개월", "5,000km마다"
      tips: string[];         // 예방 팁 3-5개
    };
    
    relatedLights: string[];  // 함께 켜질 수 있는 경고등 id
    
    commonMistakes: string[]; // 흔한 오해/실수 2-3개
    
    seasonalNote?: string;    // 계절별 주의사항 (해당 시)
  }[];
  
  // 색상별 가이드
  colorGuide: {
    color: string;
    meaning: string;
    generalAction: string;
    urgency: string;
    examples: string[];       // 해당 색상 경고등 예시
  }[];
  
  // 시스템별 분류
  systemCategories: {
    category: string;         // "엔진 시스템"
    icon: string;
    description: string;
    warningLightIds: string[]; // 해당 시스템의 경고등 id 목록
    maintenanceTip: string;
  }[];
  
  // 긴급 상황별 대응 가이드
  emergencyGuide: {
    situation: string;        // "주행 중 빨간 경고등 점등"
    symptoms: string[];       // 동반 증상
    immediateSteps: {
      step: number;
      action: string;
      reason: string;
    }[];
    whenToCall119: string[];  // 119 신고가 필요한 경우
    whenToCallTow: string[];  // 견인차 필요한 경우
  }[];
  
  // 복합 경고등 (여러 개 동시 점등)
  combinedWarnings: {
    lights: string[];         // 경고등 id 배열
    meaning: string;
    likelyCause: string;
    severity: string;
    action: string;
  }[];
  
  // 차종별 특이사항
  vehicleTypeNotes: {
    type: string;             // "전기차", "하이브리드", "디젤"
    specificLights: {
      name: string;
      icon: string;
      meaning: string;
      action: string;
    }[];
    uniqueConsiderations: string[];
  }[];
  
  // 자가 진단 가이드
  selfDiagnostics: {
    symptom: string;          // "가속 시 떨림"
    possibleLights: string[]; // 켜질 수 있는 경고등
    checkList: string[];      // 스스로 확인할 사항
    diyFix: string | null;    // 직접 해결 가능한 경우
    professionalHelp: boolean;
  }[];
  
  // 비용 절감 팁
  costSavingTips: {
    situation: string;
    expensiveSolution: string;
    affordableAlternative: string;
    whenNotToSave: string;    // 절약하면 안 되는 경우
  }[];
  
  // FAQ
  faq: {
    question: string;
    answer: string;
    relatedLights: string[];
  }[];
}
```

### 필수 포함 경고등 (50개 이상)

#### 🔴 빨간색 경고등 (긴급)
1. **엔진 오일 압력 경고등** - 오일팟
2. **배터리 충전 경고등**
3. **브레이크 경고등** (주차 브레이크 포함)
4. **냉각수 온도 경고등** (과열)
5. **파워 스티어링 경고등**
6. **에어백 경고등** (SRS)
7. **ABS 경고등** (심각한 경우)
8. **도어 열림 경고등**
9. **안전벨트 미착용 경고등**
10. **엔진 과열 경고등**

#### 🟡 노란색 경고등 (주의/점검)
11. **엔진 체크 경고등** (CHECK ENGINE)
12. **타이어 공기압 경고등** (TPMS)
13. **연료 부족 경고등**
14. **워셔액 부족 경고등**
15. **DPF 필터 경고등** (디젤)
16. **변속기 경고등** (트랜스미션)
17. **ESP/ESC 경고등** (전자식 주행 안정 장치)
18. **견인 모드 경고등**
19. **크루즈 컨트롤 경고등**
20. **차선 이탈 경고등** (LDW)
21. **앞차 추돌 경고등** (FCW)
22. **타이어 펑크 경고등**
23. **4WD 경고등**
24. **에코 모드 경고등**
25. **스포츠 모드 경고등**
26. **언덕 내리막 경보등** (HDC)
27. **슬립 경고등**
28. **엔진 시동 대기 경고등** (디젤)
29. **오일 교환 필요 경고등**
30. **점화 플러그 경고등**

#### 🟢 녹색/파란색 경고등 (정보/정상 작동)
31. **방향지시등**
32. **전조등 상향등**
33. **안개등**
34. **미등**
35. **ECO 표시등**
36. **크루즈 컨트롤 작동 표시등**
37. **차선 유지 보조 작동 표시등**

#### ⚪ 흰색/기타 경고등
38. **주차 브레이크 작동 표시등**
39. **오토 홀드 작동 표시등**
40. **전자식 주차 브레이크 표시등**

#### 🔋 전기차/하이브리드 전용
41. **하이브리드 시스템 경고등**
42. **EV 모드 표시등**
43. **충전 중 표시등**
44. **고전압 배터리 경고등**
45. **회생 제동 표시등**

#### 🛠️ 고급 안전 장치
46. **사각지대 경고등** (BSD)
47. **후측방 접근 경고등** (RCTA)
48. **긴급 제동 시스템 경고등** (AEB)
49. **피로 운전 경고등**
50. **어댑티브 크루즈 컨트롤 경고등** (ACC)
51. **자동 주차 시스템 경고등**
52. **헤드업 디스플레이 경고등**
53. **블라인드 스팟 경고등**
54. **후방 교차 충돌 경고등**
55. **스마트 키 배터리 부족 경고등**

### 요구사항
- **50개 이상**: 모든 주요 경고등 포함
- **색상 분류**: 빨강(긴급), 노랑(주의), 녹색(정상) 명확히 구분
- **실용적 대처법**: 일반인이 즉시 실행 가능한 조언
- **비용 정보**: 2025년 한국 기준 수리비
- **한국 실정**: 국내 차량 기준 (현대/기아 포함)
- **전문 용어 최소화**: 쉬운 설명

### 특별 요청
- **복합 상황**: 여러 경고등이 동시에 켜지는 경우 포함
- **계절별**: 겨울철 배터리, 여름철 냉각수 등
- **차종별**: 전기차, 하이브리드, 디젤, 가솔린 각각의 특이사항
- **자가 진단**: 직접 해결 가능한 것과 전문가 필요한 것 구분

---

## 📤 출력 형식

하나의 JSON 파일로 제공해주세요:

```json
{
  "warningLights": [ /* 50개 이상의 경고등 데이터 */ ],
  "colorGuide": [ /* 색상별 가이드 */ ],
  "systemCategories": [ /* 시스템별 분류 */ ],
  "emergencyGuide": [ /* 긴급 상황 대응 */ ],
  "combinedWarnings": [ /* 복합 경고 */ ],
  "vehicleTypeNotes": [ /* 차종별 특이사항 */ ],
  "selfDiagnostics": [ /* 자가 진단 */ ],
  "costSavingTips": [ /* 비용 절감 */ ],
  "faq": [ /* 자주 묻는 질문 */ ]
}
```

---

## ✅ 체크리스트

**경고등 데이터:**
- [ ] 빨간색 경고등 15개 이상 (긴급)
- [ ] 노란색 경고등 30개 이상 (주의)
- [ ] 녹색/파란색 표시등 10개 이상 (정보)
- [ ] 전기차/하이브리드 전용 5개 이상
- [ ] 각 경고등마다 의미, 대처법, 비용 정보 완비

**실용 정보:**
- [ ] 색상별 가이드 (빨강/노랑/녹색)
- [ ] 긴급 상황 대응 5개 이상
- [ ] 복합 경고 상황 10개 이상
- [ ] 자가 진단 가이드 20개 이상
- [ ] 비용 절감 팁 10개 이상
- [ ] FAQ 20개 이상

**품질:**
- [ ] JSON 문법 오류 없음
- [ ] 한글 작성 (전문 용어는 괄호로 영문 병기)
- [ ] 2025년 한국 기준 수리비
- [ ] 실제 적용 가능한 조언
- [ ] 일반인이 이해하기 쉬운 설명

---

생성해주세요! 🚗💡

