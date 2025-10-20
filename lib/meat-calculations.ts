/**
 * 고기집 가격 계산기 - 계산 로직
 * 모든 계산 함수와 유틸리티 포함
 */

import type { MenuInput, CalculationResult, ServingData } from '@/types/meat'

/**
 * 5→3인분 변환 계산
 * 핵심 개념: 최소주문 총액을 유지하면서 인분수를 줄임
 * 
 * @param input - 메뉴 입력 데이터
 * @returns 기존/신규 체계 비교 결과
 */
export function convertServings(input: MenuInput): CalculationResult {
  const costPerGram = input.costPerGram
  
  // ━━━ 기존 체계 (예: 5인분) ━━━
  const original: ServingData = {
    gramsPerServing: input.gramsPerServing,
    pricePerServing: input.pricePerServing,
    costPerServing: input.gramsPerServing * costPerGram,
    profit: 0,  // 아래에서 계산
    marginPercent: 0,  // 아래에서 계산
    totalGrams: input.gramsPerServing * input.originalMinServings,
    totalPrice: input.pricePerServing * input.originalMinServings,
    totalCost: 0,  // 아래에서 계산
    totalProfit: 0  // 아래에서 계산
  }
  
  // 1인분 이익 = 판매가 - 원가
  original.profit = original.pricePerServing - original.costPerServing
  
  // 마진율 = (이익 ÷ 원가) × 100
  original.marginPercent = (original.profit / original.costPerServing) * 100
  
  // 총 원가/이익
  original.totalCost = original.costPerServing * input.originalMinServings
  original.totalProfit = original.totalPrice - original.totalCost
  
  // ━━━ 새 체계 (예: 3인분) ━━━
  let newGramsPerServing: number
  let newPricePerServing: number
  
  if (input.fixedTotalGrams && input.fixedTotalGrams > 0) {
    // 고정 총 그람수가 지정된 경우
    const fixedTotalGrams = input.fixedTotalGrams
    newGramsPerServing = fixedTotalGrams / input.newMinServings
    
    // 그람당 원가 유지
    const newCostPerServing = newGramsPerServing * costPerGram
    
    // 마진 금액 유지 또는 비율 유지
    if (input.targetMarginAmount && input.targetMarginAmount > 0) {
      newPricePerServing = newCostPerServing + input.targetMarginAmount
    } else {
      // 기존 마진율 유지
      newPricePerServing = newCostPerServing * (1 + original.marginPercent / 100)
    }
  } else if (input.targetPrice && input.targetPrice > 0) {
    // 목표 가격이 지정된 경우: 가격 고정, 그람수 조정
    newPricePerServing = input.targetPrice
    
    // 마진 금액 기반 원가 계산
    let targetCostPerServing: number
    if (input.targetMarginAmount && input.targetMarginAmount > 0) {
      targetCostPerServing = newPricePerServing - input.targetMarginAmount
    } else {
      // 기존 마진율 유지
      targetCostPerServing = newPricePerServing / (1 + original.marginPercent / 100)
    }
    
    // 그람수 = 원가 ÷ g당 원가
    newGramsPerServing = targetCostPerServing / costPerGram
  } else {
    // 기본: 총액 유지 (비율 유지)
    const targetTotalPrice = original.totalPrice
    newPricePerServing = targetTotalPrice / input.newMinServings
    newGramsPerServing = (newPricePerServing / original.pricePerServing) * input.gramsPerServing
  }
  
  const newData: ServingData = {
    gramsPerServing: Math.round(newGramsPerServing),
    pricePerServing: Math.round(newPricePerServing),
    costPerServing: Math.round(newGramsPerServing * costPerGram),
    profit: 0,  // 아래에서 계산
    marginPercent: 0,  // 아래에서 계산
    totalGrams: Math.round(newGramsPerServing * input.newMinServings),
    totalPrice: Math.round(newPricePerServing * input.newMinServings),
    totalCost: 0,  // 아래에서 계산
    totalProfit: 0  // 아래에서 계산
  }
  
  newData.profit = newData.pricePerServing - newData.costPerServing
  newData.marginPercent = (newData.profit / newData.costPerServing) * 100
  newData.totalCost = newData.costPerServing * input.newMinServings
  newData.totalProfit = newData.totalPrice - newData.totalCost
  
  // ━━━ 변화량 계산 ━━━
  return {
    original,
    new: newData,
    changes: {
      gramsPercent: ((newData.gramsPerServing - original.gramsPerServing) / original.gramsPerServing) * 100,
      pricePercent: ((newData.pricePerServing - original.pricePerServing) / original.pricePerServing) * 100,
      servingsPercent: ((input.newMinServings - input.originalMinServings) / input.originalMinServings) * 100
    }
  }
}

/**
 * 판매가 계산 (원가 + 그람수 → 판매가)
 * 
 * @param costPerGram - g당 원가
 * @param gramsPerServing - 1인분 그람수
 * @param targetMarginAmount - 목표 마진 금액 (원, 선택)
 * @returns 적정 판매가
 */
export function calculatePrice(
  costPerGram: number, 
  gramsPerServing: number, 
  targetMarginAmount?: number
): number {
  // 1인분 원가 = g당 원가 × 그람수
  const costPerServing = costPerGram * gramsPerServing
  
  // 판매가 = 원가 + 마진 금액
  const pricePerServing = costPerServing + (targetMarginAmount || 0)
  
  return Math.round(pricePerServing)
}

/**
 * 원가 역산 (판매가 + 그람수 → 필요한 원가)
 * 
 * @param pricePerServing - 1인분 판매가
 * @param gramsPerServing - 1인분 그람수
 * @param targetMarginAmount - 목표 마진 금액 (원, 선택)
 * @returns 필요한 g당 원가
 */
export function calculateCost(
  pricePerServing: number, 
  gramsPerServing: number, 
  targetMarginAmount?: number
): number {
  // 1인분 원가 = 판매가 - 마진 금액
  const costPerServing = pricePerServing - (targetMarginAmount || 0)
  
  // g당 원가 = 1인분 원가 ÷ 그람수
  const costPerGram = costPerServing / gramsPerServing
  
  return Math.round(costPerGram * 100) / 100 // 소수점 2자리
}

/**
 * 그람수 계산 (원가 + 판매가 → 적정 그람수)
 * 
 * @param costPerGram - g당 원가
 * @param pricePerServing - 1인분 판매가
 * @param targetMarginAmount - 목표 마진 금액 (원, 선택)
 * @returns 적정 그람수
 */
export function calculateGrams(
  costPerGram: number, 
  pricePerServing: number, 
  targetMarginAmount?: number
): number {
  // 목표 1인분 원가 = 판매가 - 마진 금액
  const targetCostPerServing = pricePerServing - (targetMarginAmount || 0)
  
  // 그람수 = 목표 원가 ÷ g당 원가
  const gramsPerServing = targetCostPerServing / costPerGram
  
  return Math.round(gramsPerServing)
}

/**
 * 마진 분석 (전체 데이터 입력 → 마진율 분석)
 * 
 * @param input - 메뉴 입력 데이터
 * @returns 상세 마진 분석 결과
 */
export function analyzeMargin(input: MenuInput): CalculationResult {
  // convertServings 함수를 재사용
  // 마진 분석은 기본적으로 5→3인분 변환과 동일한 계산
  return convertServings(input)
}

/**
 * 숫자를 천단위 쉼표 포맷으로 변환
 * 
 * @param num - 숫자
 * @returns 포맷팅된 문자열 (예: "5,500")
 */
export function formatNumber(num: number): string {
  return Math.round(num).toLocaleString('ko-KR')
}

/**
 * 퍼센트를 소수점 1자리로 포맷
 * 
 * @param num - 퍼센트 값
 * @returns 포맷팅된 문자열 (예: "587.5%")
 */
export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`
}

/**
 * 입력값 유효성 검사
 * 
 * @param value - 입력값
 * @returns 유효성 여부
 */
export function validateInput(value: number): boolean {
  return !isNaN(value) && value > 0 && isFinite(value)
}

