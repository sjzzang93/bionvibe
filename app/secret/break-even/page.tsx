"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, TrendingUp, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// ============================================================================
// 포맷 유틸리티
// ============================================================================

const fmtWon = (n: number) => {
  if (!isFinite(n)) return "-"
  return `${Math.round(n).toLocaleString("ko-KR")}원`
}

const fmtPct = (n: number) => {
  if (!isFinite(n)) return "-"
  return `${(n * 100).toFixed(1)}%`
}

const fmtTable = (n: number) => {
  if (!isFinite(n)) return "-"
  return `${Math.ceil(n).toLocaleString("ko-KR")} 테이블`
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function BreakEvenPage() {
  const [mounted, setMounted] = useState(false)

  // 입력값
  const [asp, setAsp] = useState(56000) // 평균 테이블 단가 (Average Selling Price)
  const [varRate, setVarRate] = useState(50) // 팔 때마다 드는 비용 비율 (%)
  const [fixedMonth, setFixedMonth] = useState(12000000) // 한달 고정비
  const [targetProfitMonth, setTargetProfitMonth] = useState(0) // 한달 목표 이익
  const [tablesHint, setTablesHint] = useState(20) // 예상 테이블 수
  const [note, setNote] = useState("") // 비고

  // localStorage 연동
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("breakEvenData")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setAsp(data.asp ?? 56000)
        setVarRate(data.varRate ?? 50)
        setFixedMonth(data.fixedMonth ?? 12000000)
        setTargetProfitMonth(data.targetProfitMonth ?? 0)
        setTablesHint(data.tablesHint ?? 20)
        setNote(data.note ?? "")
      } catch (e) {
        console.error("Failed to load data", e)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const data = { asp, varRate, fixedMonth, targetProfitMonth, tablesHint, note }
    localStorage.setItem("breakEvenData", JSON.stringify(data))
  }, [mounted, asp, varRate, fixedMonth, targetProfitMonth, tablesHint, note])

  // 계산
  const result = useMemo(() => {
    const fixedDay = fixedMonth / 30 // 한달 고정비를 30일로 나눔
    const targetProfitDay = targetProfitMonth / 30 // 한달 목표 이익을 30일로 나눔
    const varRateDecimal = Math.min(99.9, Math.max(0, varRate)) / 100
    const cmr = 1 - varRateDecimal // 남는 비율 (팔 때마다 남는 돈의 비율)

    const bepRevenue = cmr > 0 ? fixedDay / cmr : NaN // 손익분기 매출
    const bepTables = asp > 0 ? bepRevenue / asp : NaN // 손익분기 테이블 수

    const needRevenue = cmr > 0 ? (fixedDay + targetProfitDay) / cmr : NaN // 목표 이익 달성 필요 매출
    const needTables = asp > 0 ? needRevenue / asp : NaN // 목표 이익 달성 필요 테이블

    const currentRevenue = asp * tablesHint // 현재 예상 매출
    const currentProfit = currentRevenue * cmr - fixedDay // 현재 예상 이익

    return {
      fixedDay,
      targetProfitDay,
      cmr,
      bepRevenue,
      bepTables,
      needRevenue,
      needTables,
      currentRevenue,
      currentProfit,
    }
  }, [asp, varRate, fixedMonth, targetProfitMonth, tablesHint])

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">하루 손익분기 계산기</h1>
            <p className="text-muted-foreground">재료비와 고정비를 반영한 손익분기점 분석</p>
          </div>
          <Link href="/">
            <Button variant="outline">홈으로</Button>
          </Link>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>쉬운 설명</AlertTitle>
          <AlertDescription className="text-sm space-y-1">
            <p>
              <strong>팔 때마다 드는 비용</strong> = 고기값, 반찬값 등 손님 한 팀이 올 때마다 나가는 돈
            </p>
            <p>
              <strong>고정비</strong> = 손님이 와도 안 와도 매달 똑같이 나가는 돈 (임대료, 기본 인건비 등)
            </p>
            <p>
              <strong>손익분기점</strong> = 손해도 이익도 아닌 딱 본전이 되는 지점
            </p>
            <p>
              <strong>남는 비율</strong> = 손님한테 받은 돈에서 재료비 빼고 실제로 남는 돈의 비율
            </p>
          </AlertDescription>
        </Alert>
      </div>

      {/* 입력 카드 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1) 입력</CardTitle>
          <CardDescription>비용 구조 및 목표 설정</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="asp">평균 테이블 단가 (원)</Label>
              <Input
                id="asp"
                type="number"
                value={asp}
                onChange={(e) => setAsp(parseFloat(e.target.value) || 0)}
                placeholder="56000"
              />
              <p className="text-xs text-muted-foreground">한 테이블이 하루에 쓰는 평균 결제 금액</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="varRate">팔 때마다 드는 비용 비율 (%)</Label>
              <Input
                id="varRate"
                type="number"
                value={varRate}
                onChange={(e) => setVarRate(parseFloat(e.target.value) || 0)}
                min="0"
                max="99.9"
                step="0.1"
                placeholder="50"
              />
              <p className="text-xs text-muted-foreground">
                💡 <strong>쉽게 말하면:</strong> 손님이 56,000원 내면 → 고기값·반찬값으로 28,000원 나감 = 50%
                <br />
                (삼겹살 팔 때 재료비, 음료 팔 때 음료값 등 손님 수에 따라 달라지는 모든 비용)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fixedMonth">한 달 고정비 (원)</Label>
              <Input
                id="fixedMonth"
                type="number"
                value={fixedMonth}
                onChange={(e) => setFixedMonth(parseFloat(e.target.value) || 0)}
                placeholder="12000000"
              />
              <p className="text-xs text-muted-foreground">
                임대료, 인건비 등 매달 고정으로 나가는 비용 → 자동으로 하루 {fmtWon(result.fixedDay || 0)}로 계산됨
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetProfitMonth">한 달 목표 이익 (원)</Label>
              <Input
                id="targetProfitMonth"
                type="number"
                value={targetProfitMonth}
                onChange={(e) => setTargetProfitMonth(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                선택 항목, 목표 이익까지 달성하려면? → 자동으로 하루 {fmtWon(result.targetProfitDay || 0)}로 계산됨
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tablesHint">예상 테이블 수 (참고용)</Label>
              <Input
                id="tablesHint"
                type="number"
                value={tablesHint}
                onChange={(e) => setTablesHint(parseFloat(e.target.value) || 0)}
                placeholder="20"
              />
              <p className="text-xs text-muted-foreground">현재 운영 중인 예상 테이블 수</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">메모 (선택)</Label>
              <Input
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="예: 돼지 11,500원/kg, 반찬·쌈 포함"
              />
              <p className="text-xs text-muted-foreground">원가 메모</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결과 카드 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2) 결과</CardTitle>
          <CardDescription>손익분기점 및 목표 달성 분석</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 공헌이익률 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">공헌이익률 (CMR)</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{fmtPct(result.cmr)}</p>
            <p className="text-sm text-blue-700 mt-1">
              매출에서 변동비를 제외한 후 남는 비율 (고정비 충당 + 이익)
            </p>
          </div>

          {/* 손익분기점 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700 mb-1">손익분기 매출 (BEP 매출)</p>
              <p className="text-2xl font-bold text-orange-600">{fmtWon(result.bepRevenue)}</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700 mb-1">손익분기 테이블 수 (BEP 테이블)</p>
              <p className="text-2xl font-bold text-orange-600">{fmtTable(result.bepTables)}</p>
            </div>
          </div>

          {/* 목표 이익 달성 */}
          {targetProfitMonth > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-700">목표 이익 달성 필요 매출</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{fmtWon(result.needRevenue)}</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-700">목표 이익 달성 필요 테이블</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{fmtTable(result.needTables)}</p>
              </div>
            </div>
          )}

          {/* 현재 예상 */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">참고) 현재 예상 테이블 수 기준</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700 mb-1">현재 예상 매출</p>
                <p className="text-xl font-bold text-gray-900">{fmtWon(result.currentRevenue)}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700 mb-1">현재 예상 이익 (추정)</p>
                <p
                  className={`text-xl font-bold ${
                    result.currentProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {fmtWon(result.currentProfit)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 공식 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>공식 요약</CardTitle>
          <CardDescription>손익분기 계산 공식</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2 text-sm">
            <div>
              <strong>공헌이익률 (CMR)</strong> = 1 − 변동비율
            </div>
            <div>
              <strong>BEP 매출</strong> = 하루 고정비 ÷ CMR
            </div>
            <div>
              <strong>BEP 테이블</strong> = BEP 매출 ÷ 평균 테이블 단가
            </div>
            <div>
              <strong>목표 이익 포함 필요 매출</strong> = (하루 고정비 + 목표 이익) ÷ CMR
            </div>
            <div className="pt-2 border-t border-yellow-300 mt-2">
              <strong>현재 예상 이익</strong> = (현재 매출 × CMR) − 하루 고정비
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
