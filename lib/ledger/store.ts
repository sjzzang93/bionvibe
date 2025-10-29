/**
 * 일일 가계부 localStorage 래퍼
 */

import type { DayEntry, MenuItem, Settings } from './types'
import { defaultMenu } from './seed'
import { defaultSettings } from './defaultSettings'

const STORAGE_PREFIX = 'ledger:'
const SETTINGS_KEY = `${STORAGE_PREFIX}settings_v2` // v2: 로스율 20% 적용
const MENU_KEY = `${STORAGE_PREFIX}menu`

export const getDayKey = (date: string) => `${STORAGE_PREFIX}${date}`

// 설정
export const loadSettings = (): Settings => {
  if (typeof window === 'undefined') return defaultSettings
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    return saved ? JSON.parse(saved) : defaultSettings
  } catch {
    return defaultSettings
  }
}

export const saveSettings = (settings: Settings) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// 메뉴
export const loadMenu = (): MenuItem[] => {
  if (typeof window === 'undefined') return defaultMenu
  try {
    const saved = localStorage.getItem(MENU_KEY)
    return saved ? JSON.parse(saved) : defaultMenu
  } catch {
    return defaultMenu
  }
}

export const saveMenu = (menu: MenuItem[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(MENU_KEY, JSON.stringify(menu))
}

// 일일 데이터
export const loadDayEntry = (date: string): DayEntry => {
  if (typeof window === 'undefined') return { date, lines: [] }
  try {
    const saved = localStorage.getItem(getDayKey(date))
    return saved ? JSON.parse(saved) : { date, lines: [] }
  } catch {
    return { date, lines: [] }
  }
}

export const saveDayEntry = (entry: DayEntry) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(getDayKey(entry.date), JSON.stringify(entry))
}

// CSV 내보내기
export const exportToCSV = (
  entry: DayEntry,
  menuItems: MenuItem[]
): string => {
  const lines = [
    ['날짜', entry.date].join(','),
    '',
    ['메뉴명', '수량', '판매가', '매출액'].join(','),
  ]

  entry.lines.forEach((line) => {
    const item = menuItems.find((m) => m.id === line.itemId)
    if (!item) return
    const revenue = item.price * line.qty
    lines.push([item.name, line.qty, item.price, revenue].join(','))
  })

  return lines.join('\n')
}

// JSON 내보내기
export const exportToJSON = (
  entry: DayEntry,
  menuItems: MenuItem[]
): string => {
  return JSON.stringify({ entry, menuItems }, null, 2)
}
