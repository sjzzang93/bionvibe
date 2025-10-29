"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { calc } from "@/lib/profit/calc"
import type { Inputs, Outputs } from "@/lib/profit/types"

// ============================================================================
// 포맷 유틸리티
// ============================================================================

const fmtWon = (n: number) => {
  if (!isFinite(n)) return "-"
  return `₩${Math.round(n).toLocaleString("ko-KR")}`
}

const fmtNum = (n: number, decimals = 2) => {
  if (!isFinite(n)) return "-"
  return n.toFixed(decimals)
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function BreakEvenPage() {
  const [mounted, setMounted] = useState(false)

  // 입력값 (원가율 기준 기본값: 식사 20%, 음료·주류 50%)
  const [P, setP] = useState(16000) // 판매가/인분
  const [M, setM] = useState(10000) // 원육 단가/kg (원가율 20% 맞춤)
  const [g, setG] = useState(200) // 1인분 그램수
  const [B, setB] = useState(1200) // 부자재/인분 원가
  const [s_sold, setS_sold] = useState(3.5) // 테이블당 유상 판매 인분
  const [s_free, setS_free] = useState(0.2) // 테이블당 서비스 인분
  const [L_pct, setL_pct] = useState(10) // 로스율 (%), UI용
  const [V_misc, setV_misc] = useState(1000) // 기타 변동비/테이블
  const [D_profit, setD_profit] = useState(3000) // 음료·주류 순이익/테이블 (매출 6000원 × 원가율 50% = 순이익 3000원)
  const [fixedMonth, setFixedMonth] = useState(12000000) // 월 고정비
  const [goalProfitDay, setGoalProfitDay] = useState(0) // 하루 목표이익
  const [targetTables, setTargetTables] = useState(10) // 목표 테이블 수
  const [showTargetPrice, setShowTargetPrice] = useState(false) // 역산 판매가 표시 여부

  // localStorage 연동
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("breakEvenProfitData")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.P !== undefined) setP(data.P)
        if (data.M !== undefined) setM(data.M)
        if (data.g !== undefined) setG(data.g)
        if (data.B !== undefined) setB(data.B)
        if (data.s_sold !== undefined) setS_sold(data.s_sold)
        if (data.s_free !== undefined) setS_free(data.s_free)
        if (data.L_pct !== undefined) setL_pct(data.L_pct)
        if (data.V_misc !== undefined) setV_misc(data.V_misc)
        if (data.D_profit !== undefined) setD_profit(data.D_profit)
        if (data.fixedMonth !== undefined) setFixedMonth(data.fixedMonth)
        if (data.goalProfitDay !== undefined) setGoalProfitDay(data.goalProfitDay)
        if (data.targetTables !== undefined) setTargetTables(data.targetTables)
      } catch (e) {
        console.error("localStorage 파싱 실패:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const data = {
      P,
      M,
      g,
      B,
      s_sold,
      s_free,
      L_pct,
      V_misc,
      D_profit,
      fixedMonth,
      goalProfitDay,
      targetTables,
    }
    localStorage.setItem("breakEvenProfitData", JSON.stringify(data))
  }, [mounted, P, M, g, B, s_sold, s_free, L_pct, V_misc, D_profit, fixedMonth, goalProfitDay, targetTables])

  // 계산
  const result = useMemo<{ outputs?: Outputs; error?: string }>(() => {
    try {
      const inputs: Inputs = {
        P,
        M,
        g,
        B,
        s_sold,
        s_free,
        L: L_pct / 100, // % → 0~1 변환
        V_misc,
        D_profit,
        fixedMonth,
        goalProfitDay,
        targetTables: showTargetPrice ? targetTables : undefined,
      }
      const outputs = calc(inputs)
      return { outputs }
    } catch (e: any) {
      return { error: e.message }
    }
  }, [P, M, g, B, s_sold, s_free, L_pct, V_misc, D_profit, fixedMonth, goalProfitDay, targetTables, showTargetPrice])

  // 경고 조건
  const warnings = useMemo(() => {
    const w: string[] = []
    if (L_pct >= 20) w.push("로스율 20% 이상 – 재고관리 점검 권장")
    if (g < 150 || g > 250) w.push("1인분 그램수가 업계 평균 범위(150~250g)를 벗어났습니다")
    if (result.outputs && result.outputs.CM_table < 5000)
      w.push("테이블 기여이익이 매우 낮습니다 – 수익성 점검 필요")
    return w
  }, [L_pct, g, result.outputs])

  if (!mounted) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">하루 손익분기 계산기 (인분 기준)</h1>
            <p className="text-muted-foreground">
              원가·로스·서비스 인분을 반영한 정밀 손익분기 분석
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">홈으로</Button>
          </Link>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>사용 안내</AlertTitle>
          <AlertDescription className="text-sm space-y-1">
            <p>• 1인분 단위로 원육 그램수(g), 부자재 원가, 로스율, 서비스 인분을 입력하세요</p>
            <p>• 음료·주류 순이익은 매출-원가 (마이너스 가능)</p>
            <p>• 하루 손익분기 테이블 수와 매출이 자동 계산됩니다</p>
          </AlertDescription>
        </Alert>
      </div>

      {/* 에러 표시 */}
      {result.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>계산 오류</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      {/* 경고 표시 */}
      {warnings.length > 0 && (
        <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-600">주의사항</AlertTitle>
          <AlertDescription className="text-sm space-y-1">
            {warnings.map((w, i) => (
              <p key={i}>• {w}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* 입력 섹션 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>판매 정보</CardTitle>
              <CardDescription>인분당 판매가와 테이블당 인분 수</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="P">판매가/인분 (원)</Label>
                <Input
                  id="P"
                  type="number"
                  value={P}
                  onChange={(e) => setP(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s_sold">테이블당 유상 판매 인분 (인분)</Label>
                <Input
                  id="s_sold"
                  type="number"
                  value={s_sold}
                  onChange={(e) => setS_sold(Number(e.target.value))}
                  step={0.1}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s_free">테이블당 서비스 인분 (인분)</Label>
                <Input
                  id="s_free"
                  type="number"
                  value={s_free}
                  onChange={(e) => setS_free(Number(e.target.value))}
                  step={0.1}
                  min={0}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>원가 정보</CardTitle>
              <CardDescription>원육 단가, 1인분 그램수, 부자재 원가</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="M">원육 단가/kg (원/kg)</Label>
                <Input
                  id="M"
                  type="number"
                  value={M}
                  onChange={(e) => setM(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g">1인분 그램수 (g)</Label>
                <Input
                  id="g"
                  type="number"
                  value={g}
                  onChange={(e) => setG(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="B">부자재/인분 원가 (원)</Label>
                <Input
                  id="B"
                  type="number"
                  value={B}
                  onChange={(e) => setB(Number(e.target.value))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">쌈·반찬·소스·숯 일부 등</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>변동비 및 기타</CardTitle>
              <CardDescription>로스율, 테이블당 기타 비용, 음주 순이익</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="L_pct">로스율 (%)</Label>
                <Input
                  id="L_pct"
                  type="range"
                  value={L_pct}
                  onChange={(e) => setL_pct(Number(e.target.value))}
                  min={0}
                  max={30}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">{L_pct}% (손실/폐기/시식 포함)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="V_misc">기타 변동비/테이블 (원)</Label>
                <Input
                  id="V_misc"
                  type="number"
                  value={V_misc}
                  onChange={(e) => setV_misc(Number(e.target.value))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">숯·가스·물티슈 등</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="D_profit">음료·주류 순이익/테이블 (원)</Label>
                <Input
                  id="D_profit"
                  type="number"
                  value={D_profit}
                  onChange={(e) => setD_profit(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">매출-원가 (마이너스 가능)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>고정비 및 목표</CardTitle>
              <CardDescription>월 고정비, 하루 목표이익</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fixedMonth">월 고정비 (원)</Label>
                <Input
                  id="fixedMonth"
                  type="number"
                  value={fixedMonth}
                  onChange={(e) => setFixedMonth(Number(e.target.value))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">임대료·인건비·관리비 등</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalProfitDay">하루 목표이익 (원)</Label>
                <Input
                  id="goalProfitDay"
                  type="number"
                  value={goalProfitDay}
                  onChange={(e) => setGoalProfitDay(Number(e.target.value))}
                  min={0}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>역산 판매가 (선택)</CardTitle>
              <CardDescription>목표 테이블 수 달성 위한 필요 판매가</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showTargetPrice"
                  checked={showTargetPrice}
                  onChange={(e) => setShowTargetPrice(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="showTargetPrice">역산 판매가 계산하기</Label>
              </div>
              {showTargetPrice && (
                <div className="space-y-2">
                  <Label htmlFor="targetTables">목표 테이블 수 (하루)</Label>
                  <Input
                    id="targetTables"
                    type="number"
                    value={targetTables}
                    onChange={(e) => setTargetTables(Number(e.target.value))}
                    min={1}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 출력 섹션 */}
        <div className="space-y-6">
          {result.outputs && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>원가 분석</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">원가/인분 (C)</span>
                    <span className="font-medium">{fmtWon(result.outputs.C)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">소비 인분 (실제)</span>
                    <span className="font-medium">{fmtNum(result.outputs.consumed, 2)} 인분</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>테이블 손익</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">테이블 매출</span>
                    <span className="font-medium">{fmtWon(result.outputs.revTable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">테이블 원가</span>
                    <span className="font-medium">{fmtWon(result.outputs.costTable)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground font-semibold">테이블 기여이익</span>
                    <span className="font-bold text-green-600">
                      {fmtWon(result.outputs.CM_table)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    손익분기 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">하루 고정비</span>
                    <span className="font-medium">{fmtWon(result.outputs.fixedDay)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground font-semibold">
                      손익분기 테이블 수
                    </span>
                    <span className="font-bold text-blue-600 text-xl">
                      {fmtNum(result.outputs.beTables, 2)} 테이블
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">손익분기 하루 매출</span>
                    <span className="font-bold text-blue-600 text-xl">
                      {fmtWon(result.outputs.beSalesDay)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {showTargetPrice && result.outputs.P_required !== undefined && (
                <Card className="border-2 border-amber-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <TrendingUp className="h-5 w-5" />
                      역산 판매가
                    </CardTitle>
                    <CardDescription>
                      하루 {targetTables}테이블로 목표 달성 시 필요한 판매가
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-semibold">
                        필요 판매가/인분
                      </span>
                      <span className="font-bold text-amber-600 text-xl">
                        {fmtWon(result.outputs.P_required)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>해석 가이드</AlertTitle>
                <AlertDescription className="text-sm space-y-1">
                  <p>
                    • 손익분기 테이블 수: 하루 이 정도 테이블을 받으면 고정비를 회수합니다
                  </p>
                  <p>• 손익분기 매출: 위 테이블 수 달성 시 예상 매출입니다</p>
                  <p>
                    • 역산 판매가: 목표 테이블로 본전을 맞추려면 이 가격이 필요합니다
                  </p>
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
