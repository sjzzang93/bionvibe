/**
 * 일일 가계부 기본 설정
 */

import { Settings } from './types'

export const defaultSettings: Settings = {
  porkCostPerKg: 13750, // 11000원 + 로스율 20% 반영 (11000 ÷ 0.8)
  beefCostPerKg: 12500, // 10000원 + 로스율 20% 반영 (10000 ÷ 0.8)
  mealCostRate: 0.2,
  saladbarCostRate: 1.0,
  alcoholCostRate: 0.5,
  drinkCostRate: 0.5,
  monthlyFixed: 6000000,
  monthlyVariable: 1500000,
  monthlyLoan: 6000000,
}
