import DATA from './group2-apps-data.json';

// 영양제 추천 타입
export interface SupplementData {
  symptomMatching: {
    symptom: string;
    severity: string;
    relatedSymptoms: string[];
    recommendedSupplements: {
      name: string;
      priority: string;
      dosage: string;
      timing: string;
      duration: string;
      expectedEffect: string;
      caution: string[];
    }[];
    lifestyleAdvice: string[];
  }[];
  ageBasedSupplements: any[];
  lifestyleBasedSupplements: any[];
  supplementCombinations: any[];
  brandComparison: any[];
}

export const SUPPLEMENT_DATA = DATA.supplement as SupplementData;


