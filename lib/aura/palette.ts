export type HSL = { h: number; s: number; l: number };

export const BaseHues = {
  joy: 50,        // yellow-gold
  calm: 200,      // sky-blue
  love: 330,      // magenta-pink
  focus: 220,     // blue
  creative: 280,  // purple
  energy: 20,     // orange-red
  grounded: 120,  // green
  stressed: 0,    // red
  melancholic: 210 // muted blue
} as const;

export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function toCssHsl({h,s,l}: HSL) {
  const hh = ((h % 360) + 360) % 360;
  return `hsl(${hh}deg ${clamp01(s)*100}% ${clamp01(l)*100}%)`;
}

