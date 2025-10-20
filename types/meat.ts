/**
 * 고기집 가격 계산기 TypeScript 타입 정의
 */

// 계산 모드 5가지
export type CalculationMode = 
  | 'price-from-cost'    // 판매가 계산
  | 'cost-from-price'    // 원가 역산
  | 'grams-from-cost'    // 그람수 계산
  | 'margin-analysis'    // 마진 분석
  | 'serving-converter'  // 5→3인분 변환

// 고기 카테고리
export type MeatCategory = '돼지고기' | '소고기'

// 메뉴 입력 데이터
export interface MenuInput {
  name: string
  category: MeatCategory
  costPerGram: number            // g당 원가
  gramsPerServing: number        // 1인분 그람수
  pricePerServing: number        // 1인분 판매가
  originalMinServings: number    // 기존 최소 주문 인분수 (기본 5)
  newMinServings: number         // 신규 최소 주문 인분수 (기본 3)
  targetMarginAmount?: number    // 목표 마진 금액 (원)
  targetPrice?: number           // 목표 가격 (5→3인분 변환 시, 금액 고정)
  fixedTotalGrams?: number       // 고정 총 그람수 (최소주문 총량 고정)
}

// 단일 인분 계산 결과
export interface ServingData {
  gramsPerServing: number        // 1인분 그람수
  pricePerServing: number        // 1인분 판매가
  costPerServing: number         // 1인분 원가
  profit: number                 // 1인분 이익
  marginPercent: number          // 마진율 (%)
  totalGrams: number             // 최소주문 총 그람
  totalPrice: number             // 최소주문 총 가격
  totalCost: number              // 최소주문 총 원가
  totalProfit: number            // 최소주문 총 이익
}

// 변화량 데이터
export interface ChangesData {
  gramsPercent: number           // 그람 변화율 (%)
  pricePercent: number           // 가격 변화율 (%)
  servingsPercent: number        // 인분수 변화율 (%)
}

// 전체 계산 결과
export interface CalculationResult {
  original: ServingData          // 기존 체계 (5인분)
  new: ServingData               // 새 체계 (3인분)
  changes: ChangesData           // 변화량
}

// 저장된 메뉴 데이터
export interface SavedMenu extends MenuInput {
  id: string                     // 고유 ID
  createdAt: number              // 생성 시간 (timestamp)
}

