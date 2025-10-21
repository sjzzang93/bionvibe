import DATA from './group1-apps-data.json';

// 금연 챌린지 타입
export interface QuitSmokingData {
  healthMilestones: {
    minutes: number;
    title: string;
    description: string;
    icon: string;
    category: 'immediate' | 'short' | 'medium' | 'long';
  }[];
  motivationalMessages: {
    day: number;
    message: string;
    tip: string;
  }[];
  withdrawalSymptoms: {
    symptom: string;
    severity: '경미' | '보통' | '심각';
    duration: string;
    copingStrategies: string[];
    whenItPeaks: string;
  }[];
  alternativeActivities: {
    situation: string;
    activities: string[];
    duration: string;
  }[];
  healthImprovement: {
    metric: string;
    baseline: string;
    week1: string;
    month1: string;
    month3: string;
    month6: string;
    year1: string;
    improvement: string;
  }[];
}

// 체지방 측정 타입
export interface BodyFatData {
  bodyFatRanges: any[];
  bmiRanges: any[];
  exerciseRecommendations: any[];
  fatLossGuide: any[];
  healthRisks: any[];
}

// 아침식사 추천 타입
export interface BreakfastData {
  recipes: any[];
  situationRecommendations: any[];
  nutritionGoals: any[];
  ingredientCombinations: any[];
  weeklyPlan: any[];
}

export const QUIT_SMOKING_DATA = DATA.quitSmoking as QuitSmokingData;
export const BODY_FAT_DATA = DATA.bodyFat as BodyFatData;
export const BREAKFAST_DATA = DATA.breakfast as BreakfastData;

