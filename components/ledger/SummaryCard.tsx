"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailySummary, Settings } from "@/lib/ledger/types"

interface SummaryCardProps {
  summary: DailySummary & { startDate?: string; endDate?: string; days?: number }
  settings: Settings
  daysInMonth: number
}

const fmtWon = (n: number) => {
  if (!isFinite(n)) return "₩0"
  return `₩${Math.round(n).toLocaleString("ko-KR")}`
}

const fmtDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-')
  return `${year}-${month}-${day}`
}

export function SummaryCard({ summary, settings, daysInMonth }: SummaryCardProps) {
  const isPeriodView = summary.startDate && summary.endDate && summary.days

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
      {/* 매출 & 원가 */}
      <Card className="border-2">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            매출 & 원가
          </CardTitle>
          {isPeriodView && (
            <p className="text-xs text-muted-foreground mt-1">
              {fmtDate(summary.startDate!)} ~ {fmtDate(summary.endDate!)} ({summary.days}일)
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-2 px-4 pb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">매출액</span>
            <span className="font-semibold text-base">{fmtWon(summary.revenue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">원가(COGS)</span>
            <span className="font-semibold text-base">{fmtWon(summary.cogs)}</span>
          </div>
          <div className="flex justify-between items-center border-t pt-2 mt-2">
            <span className="font-semibold text-base">총이익(GP)</span>
            <span className="font-bold text-xl text-green-600">
              {fmtWon(summary.gp)}
            </span>
          </div>
          {summary.tableCount > 0 && (
            <>
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="text-sm">테이블 수</span>
                <span className="font-semibold text-base">{summary.tableCount}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">평균 테이블 단가</span>
                <span className="font-semibold text-base text-blue-600">
                  {fmtWon(summary.avgPerTable)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 영업비용 */}
      <Card className="border-2">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {isPeriodView ? `영업비용 (${summary.days}일 합계)` : '영업비용 (일할)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 pb-4">
          {!isPeriodView && (
            <>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="text-xs">고정비 ({fmtWon(settings.monthlyFixed)}/월)</span>
                <span className="text-xs">{fmtWon(settings.monthlyFixed / daysInMonth)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="text-xs">변동비 ({fmtWon(settings.monthlyVariable)}/월)</span>
                <span className="text-xs">{fmtWon(settings.monthlyVariable / daysInMonth)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="text-xs">대출 ({fmtWon(settings.monthlyLoan)}/월)</span>
                <span className="text-xs">{fmtWon(settings.monthlyLoan / daysInMonth)}</span>
              </div>
            </>
          )}
          <div className={!isPeriodView ? "flex justify-between items-center border-t pt-2 mt-2" : "flex justify-between items-center"}>
            <span className="font-semibold text-base">합계</span>
            <span className="font-bold text-xl text-red-600">{fmtWon(summary.opex)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 영업이익 */}
      <Card className="border-4 border-blue-500">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-medium text-blue-600">
            최종 영업이익
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-3xl font-bold text-center py-3">
            <span
              className={
                summary.op >= 0
                  ? "text-blue-600"
                  : "text-red-600"
              }
            >
              {fmtWon(summary.op)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
