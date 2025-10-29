/**
 * 일일 가계부 타입 정의
 */

export type Category = 'pork' | 'beef' | 'meal' | 'saladbar' | 'alcohol' | 'drink'

export interface MenuItem {
  id: string
  name: string
  category: Category
  price: number // 판매가(₩)
  gramsPerPortion?: number // 육류 전용(기본 g/인분)
  overrideCostRate?: number | null // 식사/주류/음료 등 원가율 오버라이드(0~1)
  overrideCostPerGram?: number | null // 육류 그램 원가 오버라이드(원/g)
  enabled: boolean
}

export interface Settings {
  porkCostPerKg: number // 기본 11000
  beefCostPerKg: number // 기본 10000
  mealCostRate: number // 기본 0.2
  saladbarCostRate: number // 기본 1.0
  alcoholCostRate: number // 기본 0.5
  drinkCostRate: number // 기본 0.5
  monthlyFixed: number // 기본 5000000
  monthlyVariable: number // 기본 1500000
  monthlyLoan: number // 기본 6000000
}

export interface DayEntryLine {
  itemId: string
  qty: number
  gramsPerPortion?: number
  overrideCostRate?: number | null
  overrideCostPerGram?: number | null
}

export interface DayEntry {
  date: string // yyyy-mm-dd
  lines: DayEntryLine[]
  tableCount?: number // 총 테이블 수
}

export interface DailySummary {
  revenue: number // 매출
  cogs: number // 원가
  gp: number // 매출총이익
  opex: number // 영업비용
  op: number // 영업이익
  tableCount: number // 총 테이블 수
  avgPerTable: number // 평균 테이블 단가
}

export type ViewMode = 'day' | 'week' | 'month'

export interface PeriodSummary extends DailySummary {
  startDate: string
  endDate: string
  days: number
}
