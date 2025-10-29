"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailySummary, Settings } from "@/lib/ledger/types"

interface SummaryCardProps {
  summary: DailySummary
  settings: Settings
  daysInMonth: number
}

const fmtWon = (n: number) => {
  if (!isFinite(n)) return "₩0"
  return `₩${Math.round(n).toLocaleString("ko-KR")}`
}

export function SummaryCard({ summary, settings, daysInMonth }: SummaryCardProps) {
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
      {/* 매출 & 원가 */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-sm font-medium text-muted-foreground">
            매출 & 원가
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm sm:text-sm">매출액</span>
            <span className="font-semibold text-base sm:text-base">{fmtWon(summary.revenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm sm:text-sm">원가(COGS)</span>
            <span className="font-semibold text-base sm:text-base">{fmtWon(summary.cogs)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold text-base">총이익(GP)</span>
            <span className="font-bold text-lg text-green-600">
              {fmtWon(summary.gp)}
            </span>
          </div>
          {summary.tableCount > 0 && (
            <>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm sm:text-sm">테이블 수</span>
                <span className="font-semibold text-base sm:text-base">{summary.tableCount}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-sm">평균 테이블 단가</span>
                <span className="font-semibold text-base sm:text-base text-blue-600">
                  {fmtWon(summary.avgPerTable)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 영업비용 */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-sm font-medium text-muted-foreground">
            영업비용 (일할)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>고정비 ({fmtWon(settings.monthlyFixed)}/월)</span>
            <span>{fmtWon(settings.monthlyFixed / daysInMonth)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>변동비 ({fmtWon(settings.monthlyVariable)}/월)</span>
            <span>{fmtWon(settings.monthlyVariable / daysInMonth)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>대출 ({fmtWon(settings.monthlyLoan)}/월)</span>
            <span>{fmtWon(settings.monthlyLoan / daysInMonth)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold text-base">합계</span>
            <span className="font-bold text-lg text-red-600">{fmtWon(summary.opex)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 영업이익 */}
      <Card className="border-4 border-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-sm font-medium text-blue-600">
            최종 영업이익
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl sm:text-3xl font-bold text-center py-2">
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
