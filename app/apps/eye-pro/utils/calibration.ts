// 신용카드 긴 변
export const CARD_MM = 85.6;

export const inferPxPerMm = (px: number) => (px > 0 ? px / CARD_MM : null);

export const pxToMm = (px: number, ppm: number) => px / ppm;

export const mmToPx = (mm: number, ppm: number) => Math.round(mm * ppm);

