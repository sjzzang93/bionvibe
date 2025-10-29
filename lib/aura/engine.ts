import { HSL, BaseHues, clamp01 } from "./palette";

export type AuraInputs = {
  mood: "행복" | "차분" | "집중" | "창의" | "피곤" | "불안" | "우울" | "설렘";
  weather: "맑음" | "흐림" | "비" | "눈" | "바람";
  person: "가족" | "연인" | "동료" | "친구" | "나홀로";
  sleepHours: number;   // 0~12
  energy: number;       // 0~100
  stress: number;       // 0~100
};

export type AuraOutput = {
  color: HSL;
  secondary: HSL;
  score: number;        // 0~100
  tags: string[];
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// mood → base hue
function hueForMood(mood: AuraInputs["mood"]): number {
  switch (mood) {
    case "행복": return BaseHues.joy;      // 50 (yellow)
    case "차분": return BaseHues.calm;     // 200 (blue)
    case "집중": return BaseHues.focus;    // 220 (deep blue)
    case "창의": return BaseHues.creative; // 280 (purple)
    case "피곤": return BaseHues.grounded; // 120 (green)
    case "불안": return BaseHues.stressed; // 0 (red)
    case "우울": return BaseHues.melancholic; // 210 (muted blue)
    case "설렘": return BaseHues.love;     // 330 (pink)
    default: return 200;
  }
}

function weatherSaturation(weather: AuraInputs["weather"]) {
  switch (weather) {
    case "맑음": return 0.85;
    case "흐림": return 0.45;
    case "비": return 0.55;
    case "눈": return 0.75;
    case "바람": return 0.65;
  }
}

function weatherLightness(weather: AuraInputs["weather"]) {
  switch (weather) {
    case "맑음": return 0.60;
    case "흐림": return 0.40;
    case "비": return 0.35;
    case "눈": return 0.75;
    case "바람": return 0.50;
  }
}

function personBias(person: AuraInputs["person"]) {
  // hue shift by relation - 더 큰 변화
  switch (person) {
    case "가족": return -30;
    case "연인": return 50;
    case "동료": return -60;
    case "친구": return 25;
    case "나홀로": return 0;
  }
}

export function computeAura(inputs: AuraInputs): AuraOutput {
  const baseHue = hueForMood(inputs.mood);
  
  // 슬라이더 값에 따라 색조를 크게 변화시킴
  const energyHueShift = (inputs.energy - 50) * 1.2; // -60 to +60
  const stressHueShift = (inputs.stress - 50) * 0.8; // -40 to +40
  const sleepHueShift = (inputs.sleepHours - 7) * 8; // -56 to +40
  
  // 모든 변화를 합산
  let hue = baseHue + personBias(inputs.person) + energyHueShift + stressHueShift + sleepHueShift;
  
  // hue를 0-360 범위로 정규화
  hue = ((hue % 360) + 360) % 360;

  // 에너지에 따른 채도 - 더 극적인 변화
  const energyNorm = inputs.energy / 100; // 0-1
  const stressNorm = inputs.stress / 100; // 0-1
  
  const baseSat = weatherSaturation(inputs.weather);
  // 에너지 높을수록 채도 높음, 스트레스 높을수록 채도 낮음
  const sat = clamp01(baseSat * lerp(0.5, 1.3, energyNorm) * lerp(1.0, 0.6, stressNorm));

  // 명도 - 수면, 에너지, 스트레스 모두 영향
  const baseLight = weatherLightness(inputs.weather);
  const sleepFactor = clamp01(inputs.sleepHours / 8); // 0~1
  
  const light = clamp01(
    baseLight * 
    lerp(0.6, 1.2, energyNorm) *      // 에너지 영향
    lerp(0.7, 1.0, 1 - stressNorm) *  // 스트레스 영향
    lerp(0.7, 1.1, sleepFactor)       // 수면 영향
  );

  // secondary color: 에너지에 따라 보색 또는 유사색
  const secondaryShift = inputs.energy > 50 ? 150 : 50; // 고에너지=보색, 저에너지=유사색
  const secondary = { 
    h: (hue + secondaryShift) % 360, 
    s: clamp01(sat * 0.75), 
    l: clamp01(light * 0.85) 
  };
  
  const color = { h: hue, s: sat, l: light };

  // score 계산
  const sleepScore = clamp01(inputs.sleepHours / 8) * 30;
  const energyScore = energyNorm * 45;
  const stressScore = (1 - stressNorm) * 25;
  const score = Math.round(sleepScore + energyScore + stressScore);

  const tags = [
    inputs.mood, inputs.weather, inputs.person,
    `수면 ${inputs.sleepHours}h`, `에너지 ${inputs.energy}`, `스트레스 ${inputs.stress}`
  ];

  return { color, secondary, score, tags };
}
