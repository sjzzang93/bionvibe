import faceShapeData from './face-shape-analysis-data.json';

export interface FaceShapeAnalysis {
  patternCode: string;
  title: string;
  englishName: string;
  emoji: string;
  summary: string;
  characteristics: string[];
  advantages: string[];
  considerations: string[];
  harmonyScore: number;
  popularityIndex: number;
  beautyPotential: number;
  hairStyles: {
    best: string[];
    avoid: string[];
  };
  makeup: {
    contouring: string;
    highlight: string;
    blush: string;
    eyebrow: string;
    lipstick: string;
  };
  accessories: {
    glasses: string[];
    earrings: string[];
    necklace: string;
    hats: string[];
  };
  celebrities: {
    korean: string[];
    global: string[];
  };
  personality: string;
  firstImpression: string;
  photographyTips: string[];
  dailyCareTips: string[];
  fashionStyle: string[];
  colorPalette: {
    best: string[];
    avoid: string[];
  };
  professionalAdvice: string;
}

type FaceShapeDataType = {
  [key: string]: FaceShapeAnalysis;
};

export const FACE_SHAPE_DATA: FaceShapeDataType = faceShapeData as FaceShapeDataType;

// 패턴 코드 목록
export const PATTERN_CODES = [
  'WWW', 'WWM', 'WWN',
  'WMW', 'WMM', 'WMN',
  'WNW', 'WNN', 'WNM',
  'MWW', 'MWM', 'MWN',
  'MMW', 'MMM', 'MMN',
  'MNW', 'MNN', 'MNM',
  'NWW', 'NWM', 'NWN',
  'NMW', 'NMM', 'NMN',
  'NNW', 'NNN', 'NNM'
];

// 얼굴형 분류 헬퍼 함수
export function getFaceShapeByRatio(
  topWidth: number,
  midWidth: number,
  bottomWidth: number
): string {
  const total = topWidth + midWidth + bottomWidth;
  const avgWidth = total / 3;
  
  // 각 영역을 평균 대비 비율로 분류
  const getLevel = (width: number) => {
    const ratio = width / avgWidth;
    if (ratio >= 1.1) return 'W'; // Wide
    if (ratio <= 0.9) return 'N'; // Narrow
    return 'M'; // Medium
  };
  
  const topLevel = getLevel(topWidth);
  const midLevel = getLevel(midWidth);
  const bottomLevel = getLevel(bottomWidth);
  
  return `${topLevel}${midLevel}${bottomLevel}`;
}

