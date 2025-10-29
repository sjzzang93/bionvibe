/**
 * 일일 가계부 계산 로직
 */

import type { MenuItem, DayEntryLine, Settings, DailySummary } from './types'

export const perGram = (perKg: number) => perKg / 1000

export const cogsForLine = (
  item: MenuItem,
  line: DayEntryLine,
  settings: Settings
): number => {
  const qty = line.qty ?? 0
  const price = item.price
  const cat = item.category

  // 우선순위: override → 카테고리 규칙
  if (cat === 'pork' || cat === 'beef') {
    const grams = (line.gramsPerPortion ?? item.gramsPerPortion ?? 0) * qty
    const costPerGram =
      line.overrideCostPerGram ??
      (cat === 'pork'
        ? perGram(settings.porkCostPerKg)
        : perGram(settings.beefCostPerKg))
    return grams * costPerGram
  } else {
    const rate =
      line.overrideCostRate ??
      (cat === 'meal'
        ? settings.mealCostRate
        : cat === 'saladbar'
        ? settings.saladbarCostRate
        : cat === 'alcohol'
        ? settings.alcoholCostRate
        : settings.drinkCostRate)
    return price * qty * rate
  }
}

export const revenueForLine = (item: MenuItem, qty: number): number =>
  (item.price ?? 0) * (qty ?? 0)

export const calculateDailySummary = (
  lines: DayEntryLine[],
  menuItems: MenuItem[],
  settings: Settings,
  daysInMonth: number,
  tableCount: number = 0
): DailySummary => {
  let revenue = 0
  let cogs = 0

  lines.forEach((line) => {
    const item = menuItems.find((m) => m.id === line.itemId)
    if (!item) return

    revenue += revenueForLine(item, line.qty)
    cogs += cogsForLine(item, line, settings)
  })

  const gp = revenue - cogs
  const opex =
    settings.monthlyFixed / daysInMonth +
    settings.monthlyVariable / daysInMonth +
    settings.monthlyLoan / daysInMonth

  const op = gp - opex
  const avgPerTable = tableCount > 0 ? revenue / tableCount : 0

  return {
    revenue,
    cogs,
    gp,
    opex,
    op,
    tableCount,
    avgPerTable,
  }
}

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate()
}

// 날짜 범위 계산
export const getDateRange = (
  endDate: string,
  mode: 'day' | 'week' | 'month'
): { startDate: string; endDate: string; days: number } => {
  const end = new Date(endDate)
  let start: Date
  let days: number

  switch (mode) {
    case 'day':
      start = new Date(endDate)
      days = 1
      break
    case 'week':
      start = new Date(end)
      start.setDate(start.getDate() - 6) // 오늘 포함 7일
      days = 7
      break
    case 'month':
      start = new Date(end)
      start.setDate(start.getDate() - 29) // 오늘 포함 30일
      days = 30
      break
  }

  const startDate = start.toISOString().split('T')[0]
  return { startDate, endDate, days }
}

// 날짜 배열 생성
export const getDateArray = (startDate: string, endDate: string): string[] => {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0])
  }

  return dates
}

// 기간 합계 계산 (여러 날짜의 데이터를 합산)
export const calculatePeriodSummary = (
  dayEntries: DayEntry[],
  menuItems: MenuItem[],
  settings: Settings,
  startDate: string,
  endDate: string
): import('./types').PeriodSummary => {
  let totalRevenue = 0
  let totalCogs = 0
  let totalTableCount = 0

  // 각 날짜의 데이터를 합산
  dayEntries.forEach((entry) => {
    entry.lines.forEach((line) => {
      const item = menuItems.find((m) => m.id === line.itemId)
      if (!item) return

      totalRevenue += revenueForLine(item, line.qty)
      totalCogs += cogsForLine(item, line, settings)
    })
    totalTableCount += entry.tableCount || 0
  })

  const gp = totalRevenue - totalCogs

  // 기간 동안의 영업비용 계산
  const dates = getDateArray(startDate, endDate)
  const days = dates.length
  let totalOpex = 0

  dates.forEach((date) => {
    const [year, month] = date.split('-').map(Number)
    const daysInMonth = getDaysInMonth(year, month)
    const dailyOpex =
      settings.monthlyFixed / daysInMonth +
      settings.monthlyVariable / daysInMonth +
      settings.monthlyLoan / daysInMonth
    totalOpex += dailyOpex
  })

  const op = gp - totalOpex
  const avgPerTable = totalTableCount > 0 ? totalRevenue / totalTableCount : 0

  return {
    revenue: totalRevenue,
    cogs: totalCogs,
    gp,
    opex: totalOpex,
    op,
    tableCount: totalTableCount,
    avgPerTable,
    startDate,
    endDate,
    days,
  }
}
