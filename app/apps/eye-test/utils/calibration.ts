// 카드 가로 85.6mm 기준 보정
export const CARD_MM = 85.6;

export const pxToMm = (px: number, pxPerMm: number) => px / pxPerMm;
export const mmToPx = (mm: number, pxPerMm: number) => Math.round(mm * pxPerMm);

export const inferPxPerMmFromCard = (cardPxMeasured: number) => {
  if (!cardPxMeasured || cardPxMeasured <= 0) return null;
  return cardPxMeasured / CARD_MM;
};

