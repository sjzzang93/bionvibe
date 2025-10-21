import palmReadingData from './palm-reading-data.json';

export interface PalmLine {
  length: string;
  depth: string;
  interpretation: string;
}

export interface FateLine {
  presence: string;
  interpretation: string;
}

export interface PalmReadingAnalysis {
  patternCode: string;
  title: string;
  emoji: string;
  summary: string;
  palmLines: {
    lifeLine: PalmLine;
    headLine: PalmLine;
    heartLine: PalmLine;
    fateLine: FateLine;
    marriageLine: FateLine & { count: string };
    moneyLine: FateLine;
    healthLine: FateLine;
  };
  scores: {
    overall: number;
    health: number;
    career: number;
    wealth: number;
    love: number;
    relationships: number;
    longevity: number;
  };
  personality: {
    type: string;
    strengths: string[];
    weaknesses: string[];
    traits: string[];
  };
  fortune: {
    career: {
      description: string;
      suitableJobs: string[];
      advice: string;
    };
    wealth: {
      description: string;
      moneyStyle: string;
      advice: string;
    };
    love: {
      description: string;
      loveStyle: string;
      marriageAge: string;
      advice: string;
    };
    health: {
      description: string;
      weakPoints: string[];
      advice: string;
    };
  };
  lifePhases: {
    youth: {
      period: string;
      fortune: string;
      description: string;
      advice: string[];
    };
    middle: {
      period: string;
      fortune: string;
      description: string;
      advice: string[];
    };
    senior: {
      period: string;
      fortune: string;
      description: string;
      advice: string[];
    };
  };
  lucky: {
    colors: string[];
    numbers: number[];
    directions: string[];
    stones: string[];
    days: string[];
  };
  actionGuide: {
    daily: string[];
    avoid: string[];
    develop: string[];
  };
  compatibility: {
    bestMatch: string[];
    goodMatch: string[];
    challenging: string[];
  };
  celebrities: {
    korean: string[];
    global: string[];
  };
  expertAdvice: string;
  specialNote: string;
}

type PalmReadingDataType = {
  [key: string]: PalmReadingAnalysis;
};

export const PALM_READING_DATA: PalmReadingDataType = palmReadingData as PalmReadingDataType;

// 패턴 코드 목록
export const PATTERN_CODES = [
  'LLL', 'LLM', 'LLS',
  'LML', 'LMM', 'LMS',
  'LSL', 'LSM', 'LSS',
  'MLL', 'MLM', 'MLS',
  'MML', 'MMM', 'MMS',
  'MSL', 'MSM', 'MSS',
  'SLL', 'SLM', 'SLS',
  'SML', 'SMM', 'SMS',
  'SSL', 'SSM', 'SSS'
];

// 손금 분석 헬퍼 함수
export function getPalmPatternByMeasurement(
  lifeLineLength: number,
  headLineLength: number,
  heartLineLength: number
): string {
  const total = lifeLineLength + headLineLength + heartLineLength;
  const avgLength = total / 3;
  
  const getLevel = (length: number) => {
    const ratio = length / avgLength;
    if (ratio >= 1.2) return 'L'; // Long
    if (ratio <= 0.8) return 'S'; // Short
    return 'M'; // Medium
  };
  
  const lifeLevel = getLevel(lifeLineLength);
  const headLevel = getLevel(headLineLength);
  const heartLevel = getLevel(heartLineLength);
  
  return `${lifeLevel}${headLevel}${heartLevel}`;
}

