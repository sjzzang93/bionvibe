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
  // 세 부위를 정렬하여 상대적 크기 비교
  const widths = [
    { value: topWidth, position: 'top' },
    { value: midWidth, position: 'mid' },
    { value: bottomWidth, position: 'bottom' }
  ];
  
  // 크기 순으로 정렬
  widths.sort((a, b) => b.value - a.value);
  
  const maxWidth = widths[0].value;
  const midWidthVal = widths[1].value;
  const minWidth = widths[2].value;
  
  // 차이가 거의 없으면 (1% 미만) 계란형
  const range = maxWidth - minWidth;
  const avgWidth = (topWidth + midWidth + bottomWidth) / 3;
  const diffRatio = range / avgWidth;
  
  // 정말 균형잡힌 경우만 MMM (계란형)
  if (diffRatio < 0.02) {
    return 'MMM';
  }
  
  // 각 부위를 W/M/N으로 분류
  const getLevel = (width: number) => {
    // 최대값과의 차이
    const maxDiff = (maxWidth - width) / avgWidth;
    // 최소값과의 차이
    const minDiff = (width - minWidth) / avgWidth;
    
    // 최대값에 가까우면 Wide
    if (maxDiff < 0.015) return 'W';
    // 최소값에 가까우면 Narrow
    if (minDiff < 0.015) return 'N';
    // 중간이면 Medium
    return 'M';
  };
  
  const topLevel = getLevel(topWidth);
  const midLevel = getLevel(midWidth);
  const bottomLevel = getLevel(bottomWidth);
  
  let patternCode = `${topLevel}${midLevel}${bottomLevel}`;
  
  // 여전히 MMM이면 강제로 다양화
  if (patternCode === 'MMM') {
    // 세 값 중 어느 것이 가장 큰지/작은지 확인
    const maxPos = widths[0].position;
    const minPos = widths[2].position;
    
    // 가장 큰 부위와 작은 부위를 명확히 표시
    if (maxPos === 'top') {
      if (minPos === 'mid') {
        patternCode = 'WNM';
      } else { // minPos === 'bottom'
        patternCode = 'WMN';
      }
    } else if (maxPos === 'mid') {
      if (minPos === 'top') {
        patternCode = 'NWM';
      } else { // minPos === 'bottom'
        patternCode = 'MWN';
      }
    } else { // maxPos === 'bottom'
      if (minPos === 'top') {
        patternCode = 'NMW';
      } else { // minPos === 'mid'
        patternCode = 'MNW';
      }
    }
  }
  
  // 패턴 코드가 존재하는지 확인
  if (!PATTERN_CODES.includes(patternCode)) {
    console.warn(`Unknown pattern code: ${patternCode}, falling back to MMM`);
    return 'MMM';
  }
  
  return patternCode;
}
