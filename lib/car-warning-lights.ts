import DATA from './car-warning-lights-data.json';

// 차량 경고등 타입 정의 (2025 간소화 버전)
export interface WarningLight {
  num: number;
  name: string;
  symptom: string;
  risk: '낮음' | '중간' | '높음' | '치명';
  serviceInterval: string;
  estimatedCost: {
    min: number;
    max: number;
    average: number;
  };
}

export interface CarWarningLightsData {
  warningLights: WarningLight[];
  currency: string;
  note: string;
}

// 데이터 export
export const CAR_WARNING_LIGHTS_DATA: CarWarningLightsData = DATA as CarWarningLightsData;

// 위험도별 분류
export const RISK_FILTERS = [
  { id: 'all', name: '전체', color: 'gray', icon: '🚗' },
  { id: '치명', name: '치명적', color: 'red', icon: '🚨' },
  { id: '높음', name: '높음', color: 'orange', icon: '⚠️' },
  { id: '중간', name: '중간', color: 'yellow', icon: '⚡' },
  { id: '낮음', name: '낮음', color: 'blue', icon: 'ℹ️' },
];

// 위험도별 스타일 헬퍼
export const getRiskStyle = (risk: string) => {
  switch (risk) {
    case '치명':
      return { bg: 'bg-red-600', text: 'text-white', badge: 'bg-red-500', icon: '🚨' };
    case '높음':
      return { bg: 'bg-orange-600', text: 'text-white', badge: 'bg-orange-500', icon: '⚠️' };
    case '중간':
      return { bg: 'bg-yellow-600', text: 'text-white', badge: 'bg-yellow-500', icon: '⚡' };
    case '낮음':
      return { bg: 'bg-blue-600', text: 'text-white', badge: 'bg-blue-500', icon: 'ℹ️' };
    default:
      return { bg: 'bg-gray-600', text: 'text-white', badge: 'bg-gray-500', icon: '❓' };
  }
};

