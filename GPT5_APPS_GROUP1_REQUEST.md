# 웹앱 데이터 생성 요청 - 그룹1 (GPT-5)

## 📋 요청 개요
아래 3개 웹앱을 위한 고급 데이터를 생성해주세요. 각 앱은 독립적인 JSON 데이터로 제공하며, 실용적이고 과학적인 정보를 기반으로 합니다.

---

## 🚭 1. 금연 챌린지 (Quit Smoking Challenge)

### 개요
금연을 시작한 사용자를 위한 동기부여 및 진행 추적 시스템. 시간대별 건강 개선 효과와 절약 금액을 실시간으로 보여줍니다.

### 필요한 데이터 구조

```typescript
interface QuitSmokingData {
  // 시간대별 건강 개선 마일스톤 (50개)
  healthMilestones: {
    minutes: number;           // 금연 후 경과 시간 (분)
    title: string;             // 제목
    description: string;       // 상세 설명
    icon: string;             // 이모지
    category: 'immediate' | 'short' | 'medium' | 'long'; // 단기/중기/장기
  }[];
  
  // 동기부여 메시지 (100개)
  motivationalMessages: {
    day: number;              // 금연 일수 (1~365)
    message: string;          // 격려 메시지
    tip: string;              // 실천 팁
  }[];
  
  // 금단 증상 대처법 (30개)
  withdrawalSymptoms: {
    symptom: string;          // 증상명
    severity: '경미' | '보통' | '심각';
    duration: string;         // 지속 기간
    copingStrategies: string[]; // 대처 방법 5개
    whenItPeaks: string;      // 최고조 시기
  }[];
  
  // 대체 활동 추천 (50개)
  alternativeActivities: {
    situation: string;        // 상황 (예: "스트레스 받을 때")
    activities: string[];     // 대체 활동 5개
    duration: string;         // 소요 시간
  }[];
  
  // 건강 지표 개선 데이터
  healthImprovement: {
    metric: string;           // 지표명 (혈압, 폐활량 등)
    baseline: string;         // 흡연 시
    week1: string;
    month1: string;
    month3: string;
    month6: string;
    year1: string;
    improvement: string;      // 개선 정도 설명
  }[];
}
```

### 요구사항
- **건강 마일스톤**: 20분 후부터 20년 후까지 50개 마일스톤
- **동기부여 메시지**: 매일 다른 메시지 (365일분 중 100개)
- **금단 증상**: 니코틴 금단 증상 30가지 + 대처법
- **대체 활동**: 흡연 충동 상황별 대안 50가지
- **과학적 근거**: 의학적으로 검증된 정보만 사용

---

## ⚖️ 2. 체지방 측정기 (Body Fat Calculator)

### 개요
미 해군 방식 + 카본 공식 등 여러 방법으로 체지방률을 계산하고, 건강 상태를 평가하며 맞춤 조언을 제공합니다.

### 필요한 데이터 구조

```typescript
interface BodyFatData {
  // 체지방률 범위별 평가 (성별/나이별)
  bodyFatRanges: {
    gender: 'male' | 'female';
    ageGroup: string;         // "20-29", "30-39" 등
    ranges: {
      essential: { min: number; max: number; description: string };
      athlete: { min: number; max: number; description: string };
      fitness: { min: number; max: number; description: string };
      average: { min: number; max: number; description: string };
      obese: { min: number; max: number; description: string };
    };
  }[];
  
  // BMI 범위별 평가
  bmiRanges: {
    category: string;
    min: number;
    max: number;
    healthRisk: string;
    description: string;
    koreanStandard: boolean;  // 한국 기준 여부
  }[];
  
  // 체형별 운동 추천 (20개)
  exerciseRecommendations: {
    bodyFatRange: string;     // "20-25%"
    bmiRange: string;
    goal: string;             // "체지방 감소", "근육 증가" 등
    exercises: {
      type: string;           // 유산소/근력/스트레칭
      name: string;
      frequency: string;      // "주 3-4회"
      duration: string;       // "30-40분"
      intensity: string;      // "중강도"
      benefits: string;
    }[];
    dietTips: string[];       // 식단 팁 5개
  }[];
  
  // 체지방 감소 단계별 가이드
  fatLossGuide: {
    currentBodyFat: number;
    targetBodyFat: number;
    weeklyTarget: number;     // 주당 감량 목표 (kg)
    estimatedWeeks: number;
    phases: {
      phase: number;
      duration: string;
      focus: string;
      exercises: string[];
      nutrition: string;
      tips: string[];
    }[];
  }[];
  
  // 건강 위험도 평가
  healthRisks: {
    condition: string;        // "복부 비만"
    indicators: string[];     // 판단 기준
    risks: string[];          // 건강 위험
    prevention: string[];     // 예방법
    urgency: '낮음' | '보통' | '높음' | '긴급';
  }[];
}
```

### 요구사항
- **과학적 공식**: 미 해군 방식, 카본 공식, BMI 계산
- **성별/연령별**: 세분화된 기준 (10대~70대)
- **한국 기준**: 아시아인 체형 특성 반영
- **실용적 조언**: 즉시 실천 가능한 운동/식단 가이드

---

## 🍳 3. 아침식사 추천 (Breakfast Recommendation)

### 개요
시간, 재료, 영양 목표, 요리 실력을 고려한 맞춤형 아침식사 레시피 추천 시스템.

### 필요한 데이터 구조

```typescript
interface BreakfastData {
  // 아침식사 레시피 (100개)
  recipes: {
    id: string;
    name: string;
    category: '한식' | '양식' | '간편식' | '건강식' | '다이어트';
    difficulty: '쉬움' | '보통' | '어려움';
    prepTime: number;         // 준비 시간 (분)
    cookTime: number;         // 조리 시간 (분)
    servings: number;
    
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    
    ingredients: {
      name: string;
      amount: string;
      substitute?: string;    // 대체 재료
    }[];
    
    instructions: string[];   // 조리 순서
    
    tags: string[];           // "고단백", "저칼로리", "채식" 등
    
    benefits: string[];       // 건강 효능 3개
    
    tips: string[];           // 조리 팁 2-3개
    
    pairing: string[];        // 어울리는 음료/반찬
    
    seasonality: string[];    // 어울리는 계절
    
    targetAudience: string[]; // "직장인", "학생", "운동인" 등
  }[];
  
  // 상황별 추천 로직 (30개)
  situationRecommendations: {
    situation: string;        // "시간이 없을 때"
    timeAvailable: number;    // 가능 시간 (분)
    recommendedCategories: string[];
    quickTips: string[];
    mustHaveIngredients: string[];
  }[];
  
  // 영양 목표별 메뉴 조합
  nutritionGoals: {
    goal: string;             // "체중 감량", "근육 증가" 등
    dailyCalories: number;
    breakfastRatio: number;   // 하루 칼로리 중 비율 (%)
    macroRatio: {
      protein: number;
      carbs: number;
      fat: number;
    };
    recommendedRecipes: string[]; // recipe id 배열
    supplements: string[];    // 추가 영양제
    timing: string;           // 식사 타이밍 조언
  }[];
  
  // 재료 조합 가이드 (50개)
  ingredientCombinations: {
    mainIngredient: string;
    bestPairings: string[];   // 궁합 좋은 재료 5개
    avoidPairings: string[];  // 피할 조합 2-3개
    nutritionSynergy: string; // 영양 시너지 설명
  }[];
  
  // 요일별 추천 (7일)
  weeklyPlan: {
    day: string;              // "월요일"
    theme: string;            // "활력 넘치는 월요일"
    breakfast: string;
    lunch: string;
    reason: string;
    prepTip: string;
  }[];
}
```

### 요구사항
- **레시피 100개**: 5-60분 소요, 다양한 난이도
- **영양 정보**: 정확한 칼로리/3대 영양소
- **실용성**: 실제 만들 수 있는 레시피만
- **한국인 입맛**: 한식 50%, 양식 30%, 기타 20%
- **계절 고려**: 제철 재료 활용

---

## 📝 출력 형식

3개 앱의 데이터를 각각 독립된 JSON으로 생성해주세요:

```json
{
  "quitSmoking": { /* QuitSmokingData */ },
  "bodyFat": { /* BodyFatData */ },
  "breakfast": { /* BreakfastData */ }
}
```

---

## ✅ 체크리스트

**금연 챌린지:**
- [ ] 건강 마일스톤 50개 (20분~20년)
- [ ] 동기부여 메시지 100개
- [ ] 금단 증상 30개 + 대처법
- [ ] 대체 활동 50개
- [ ] 의학적 검증 정보

**체지방 측정기:**
- [ ] 성별/연령별 체지방 기준
- [ ] BMI 범위 평가
- [ ] 운동 추천 20개
- [ ] 단계별 감량 가이드
- [ ] 건강 위험도 평가

**아침식사 추천:**
- [ ] 레시피 100개 (영양 정보 포함)
- [ ] 상황별 추천 30개
- [ ] 영양 목표별 메뉴
- [ ] 재료 조합 50개
- [ ] 주간 플랜 7일

**공통:**
- [ ] JSON 문법 오류 없음
- [ ] 한글 작성 (고유명사 제외)
- [ ] 실용적이고 과학적인 정보
- [ ] 즉시 활용 가능한 데이터

---

생성해주세요! 🚀

