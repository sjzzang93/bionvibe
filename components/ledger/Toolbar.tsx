"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, FileJson, Printer, Settings, RotateCcw } from "lucide-react"

interface ToolbarProps {
  selectedDate: string
  onDateChange: (date: string) => void
  viewMode: 'day' | 'month'
  onViewModeChange: (mode: 'day' | 'month') => void
  tableCount: number
  onTableCountChange: (count: number) => void
  onSettingsClick: () => void
  onReset: () => void
  onExportCSV: () => void
  onExportJSON: () => void
  onPrint: () => void
}

export function Toolbar({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  tableCount,
  onTableCountChange,
  onSettingsClick,
  onReset,
  onExportCSV,
  onExportJSON,
  onPrint,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full sm:w-auto h-11 sm:h-10 text-base print:border-none touch-manipulation"
        />
        <div className="flex gap-2 print:hidden">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            className="flex-1 sm:flex-none h-11 sm:h-10 px-6 text-base sm:text-sm touch-manipulation"
            onClick={() => onViewModeChange('day')}
          >
            1일치
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            className="flex-1 sm:flex-none h-11 sm:h-10 px-6 text-base sm:text-sm touch-manipulation"
            onClick={() => onViewModeChange('month')}
          >
            1개월치
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">테이블 수:</label>
          <Input
            type="number"
            value={tableCount || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0
              onTableCountChange(Math.max(0, val))
            }}
            placeholder="0"
            className="w-20 h-11 sm:h-10 text-center text-base print:border-none touch-manipulation"
            min="0"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button
          variant="outline"
          className="flex-1 sm:flex-none h-11 sm:h-9 text-base sm:text-sm touch-manipulation"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4 mr-2" />
          설정
        </Button>
        <Button
          variant="outline"
          className="flex-1 sm:flex-none h-11 sm:h-9 text-base sm:text-sm touch-manipulation text-red-600 hover:text-red-700"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          초기화
        </Button>
        <Button
          variant="outline"
          className="flex-1 sm:flex-none h-11 sm:h-9 text-base sm:text-sm touch-manipulation"
          onClick={onExportCSV}
        >
          <Download className="h-4 w-4 mr-2" />
          CSV
        </Button>
        <Button
          variant="outline"
          className="flex-1 sm:flex-none h-11 sm:h-9 text-base sm:text-sm touch-manipulation"
          onClick={onExportJSON}
        >
          <FileJson className="h-4 w-4 mr-2" />
          JSON
        </Button>
        <Button
          variant="outline"
          className="flex-1 sm:flex-none h-11 sm:h-9 text-base sm:text-sm touch-manipulation"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          인쇄
        </Button>
      </div>
    </div>
  )
}
