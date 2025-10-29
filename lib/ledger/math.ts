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
