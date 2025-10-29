/**
 * 일일 가계부 기본 설정
 */

import { Settings } from './types'

export const defaultSettings: Settings = {
  porkCostPerKg: 12222, // 11000원 + 로스율 10% 반영 (11000 ÷ 0.9)
  beefCostPerKg: 11111, // 10000원 + 로스율 10% 반영 (10000 ÷ 0.9)
  mealCostRate: 0.2,
  saladbarCostRate: 1.0,
  alcoholCostRate: 0.5,
  drinkCostRate: 0.5,
  monthlyFixed: 5000000,
  monthlyVariable: 1500000,
  monthlyLoan: 5000000,
}
