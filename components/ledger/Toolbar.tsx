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
  onCreateTestData?: () => void
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
  onCreateTestData,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 items-stretch sm:items-center">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full sm:w-auto h-14 sm:h-10 text-lg sm:text-base font-semibold print:border-none touch-manipulation border-2"
        />
        <div className="flex gap-2 print:hidden">
          <Button
            variant={viewMode === 'day' ? 'primary' : 'outline'}
            className="flex-1 sm:flex-none h-14 sm:h-10 px-6 text-lg sm:text-sm font-bold touch-manipulation active:scale-95 transition-transform"
            onClick={() => onViewModeChange('day')}
          >
            1일치
          </Button>
          <Button
            variant={viewMode === 'month' ? 'primary' : 'outline'}
            className="flex-1 sm:flex-none h-14 sm:h-10 px-6 text-lg sm:text-sm font-bold touch-manipulation active:scale-95 transition-transform"
            onClick={() => onViewModeChange('month')}
          >
            1개월치
          </Button>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-2 sm:p-0 sm:bg-transparent">
          <label className="text-base sm:text-sm font-bold whitespace-nowrap">테이블 수:</label>
          <Input
            type="number"
            value={tableCount || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0
              onTableCountChange(Math.max(0, val))
            }}
            placeholder="0"
            className="w-24 h-12 sm:w-20 sm:h-10 text-center text-xl sm:text-base font-bold print:border-none touch-manipulation border-2 !px-2 !py-0 leading-none"
            min="0"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button
          variant="outline"
          className="flex-1 min-w-0 sm:flex-none h-12 sm:h-9 text-base sm:text-sm font-semibold touch-manipulation active:scale-95 transition-transform px-3 sm:px-4"
          onClick={onSettingsClick}
        >
          <Settings className="h-5 w-5 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="truncate">설정</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 min-w-0 sm:flex-none h-12 sm:h-9 text-base sm:text-sm font-semibold touch-manipulation text-red-600 hover:text-red-700 active:scale-95 transition-transform px-3 sm:px-4"
          onClick={onReset}
        >
          <RotateCcw className="h-5 w-5 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="truncate">초기화</span>
        </Button>
        {onCreateTestData && (
          <Button
            variant="outline"
            className="flex-1 min-w-0 sm:flex-none h-12 sm:h-9 text-base sm:text-sm font-semibold touch-manipulation text-blue-600 hover:text-blue-700 active:scale-95 transition-transform px-3 sm:px-4"
            onClick={onCreateTestData}
          >
            <span className="truncate">🧪 테스트</span>
          </Button>
        )}
        <Button
          variant="outline"
          className="flex-1 min-w-0 sm:flex-none h-12 sm:h-9 text-base sm:text-sm font-semibold touch-manipulation active:scale-95 transition-transform px-3 sm:px-4"
          onClick={onExportCSV}
        >
          <Download className="h-5 w-5 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="truncate">CSV</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 min-w-0 sm:flex-none h-12 sm:h-9 text-base sm:text-sm font-semibold touch-manipulation active:scale-95 transition-transform px-3 sm:px-4"
          onClick={onExportJSON}
        >
          <FileJson className="h-5 w-5 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="truncate">JSON</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 min-w-0 sm:flex-none h-12 sm:h-9 text-base sm:text-sm font-semibold touch-manipulation active:scale-95 transition-transform px-3 sm:px-4"
          onClick={onPrint}
        >
          <Printer className="h-5 w-5 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="truncate">인쇄</span>
        </Button>
      </div>
    </div>
  )
}
