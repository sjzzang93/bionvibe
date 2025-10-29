"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Toolbar } from "@/components/ledger/Toolbar"
import { CategorySection } from "@/components/ledger/CategorySection"
import { SummaryCard } from "@/components/ledger/SummaryCard"
import { SettingsDialog } from "@/components/ledger/SettingsDialog"
import {
  loadSettings,
  saveSettings,
  loadMenu,
  loadDayEntry,
  saveDayEntry,
  exportToCSV,
  exportToJSON,
} from "@/lib/ledger/store"
import {
  calculateDailySummary,
  getDaysInMonth,
  getDateRange,
  getDateArray,
  calculatePeriodSummary,
} from "@/lib/ledger/math"
import type { DayEntry, MenuItem, Settings, DailySummary, PeriodSummary } from "@/lib/ledger/types"

export default function DailyLedgerPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [entry, setEntry] = useState<DayEntry>({ date: "", lines: [] })
  const [periodEntries, setPeriodEntries] = useState<DayEntry[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)

  // 초기화
  useEffect(() => {
    setMounted(true)
    const today = new Date().toISOString().split("T")[0]
    setSelectedDate(today)
    setSettings(loadSettings())
    setMenuItems(loadMenu())
  }, [])

  // 날짜 변경 시 데이터 로드
  useEffect(() => {
    if (!mounted || !selectedDate) return
    const dayEntry = loadDayEntry(selectedDate)
    setEntry(dayEntry)
  }, [mounted, selectedDate])

  // 뷰모드 변경 시 기간 데이터 로드 (month 뷰용)
  useEffect(() => {
    if (!mounted || !selectedDate || viewMode !== 'month') return
    const { startDate, endDate } = getDateRange(selectedDate, 'month')
    const dates = getDateArray(startDate, endDate)
    const entries = dates.map(date => loadDayEntry(date))
    setPeriodEntries(entries)
  }, [mounted, selectedDate, viewMode])

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    if (!mounted || !selectedDate) return
    saveDayEntry(entry)
  }, [mounted, selectedDate, entry])

  // 계산
  const summary = useMemo((): (DailySummary & { startDate?: string; endDate?: string; days?: number }) | null => {
    if (!settings) return null

    if (viewMode === 'day') {
      const [year, month] = selectedDate.split("-").map(Number)
      const daysInMonth = getDaysInMonth(year, month)
      return calculateDailySummary(
        entry.lines,
        menuItems,
        settings,
        daysInMonth,
        entry.tableCount || 0
      )
    } else {
      // month view
      const { startDate, endDate } = getDateRange(selectedDate, 'month')
      return calculatePeriodSummary(
        periodEntries,
        menuItems,
        settings,
        startDate,
        endDate
      )
    }
  }, [entry.lines, menuItems, settings, selectedDate, entry.tableCount, viewMode, periodEntries])

  // 핸들러
  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleExportCSV = () => {
    const csv = exportToCSV(entry, menuItems)
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ledger-${selectedDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const json = exportToJSON(entry, menuItems)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ledger-${selectedDate}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    if (!confirm('정말로 입력을 초기화하시겠습니까?\n모든 수량과 테이블 수가 0으로 초기화됩니다.')) {
      return
    }
    const emptyEntry: DayEntry = {
      date: selectedDate,
      lines: [],
      tableCount: 0
    }
    setEntry(emptyEntry)
    saveDayEntry(emptyEntry)
  }

  if (!mounted || !settings) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Link href="/secret" className="print:hidden">
            <Button variant="outline" size="sm" className="shrink-0 h-11 w-11 sm:h-10 sm:w-10 touch-manipulation p-0">
              <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">일일 가계부</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              오늘의 매출과 손익을 기록하세요
            </p>
          </div>
        </div>
      </div>

      {/* 툴바 */}
      <Toolbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        tableCount={entry.tableCount || 0}
        onTableCountChange={(count) => setEntry({ ...entry, tableCount: count })}
        onSettingsClick={() => setSettingsOpen(true)}
        onReset={handleReset}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onPrint={handlePrint}
      />

      {/* 요약 카드 */}
      {summary && settings && (
        <div className="mb-4 sm:mb-6">
          <SummaryCard
            summary={summary}
            settings={settings}
            daysInMonth={getDaysInMonth(
              ...selectedDate.split("-").map(Number) as [number, number]
            )}
          />
        </div>
      )}

      {/* 카테고리별 입력 */}
      <div className="space-y-3 sm:space-y-4">
        <CategorySection
          title="🐷 돼지고기"
          category="pork"
          items={menuItems}
          lines={entry.lines}
          onChange={(lines) => setEntry({ ...entry, lines })}
        />

        <CategorySection
          title="🐮 소고기"
          category="beef"
          items={menuItems}
          lines={entry.lines}
          onChange={(lines) => setEntry({ ...entry, lines })}
        />

        <CategorySection
          title="🍚 식사류"
          category="meal"
          items={menuItems}
          lines={entry.lines}
          onChange={(lines) => setEntry({ ...entry, lines })}
        />

        <CategorySection
          title="🥗 샐러드바"
          category="saladbar"
          items={menuItems}
          lines={entry.lines}
          onChange={(lines) => setEntry({ ...entry, lines })}
        />

        <CategorySection
          title="🍺 주류"
          category="alcohol"
          items={menuItems}
          lines={entry.lines}
          onChange={(lines) => setEntry({ ...entry, lines })}
        />

        <CategorySection
          title="🥤 음료"
          category="drink"
          items={menuItems}
          lines={entry.lines}
          onChange={(lines) => setEntry({ ...entry, lines })}
        />
      </div>

      {/* 설정 다이얼로그 */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSave={handleSettingsSave}
      />
    </div>
  )
}
