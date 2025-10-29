"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertCircle, Info } from "lucide-react"

// ============================================================================
// 표기 유틸리티
// ============================================================================

// 한글 용어 매핑
const labelMap = {
  COGS: "원가",
  GP: "남는 돈",
  GPMargin: "남는 비율(%)",
}

// 금액 포맷 (원)
const fmtWon = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`

// 퍼센트 포맷
const fmtPct = (r: number) => {
  // r이 0~1 사이면 퍼센트로, 1 이상이면 그대로 % 가정
  const pct = r <= 1 ? r * 100 : r
  return `${pct.toFixed(pct < 10 ? 2 : 1)}%`
}

// 툴팁 설명
const tooltips = {
  cogs: "고기값·식자재값 등 판매에 들어간 순수 원재료 비용",
  gp: "매출에서 원가 뺀 금액(인건비·임대료 등은 아직 제외)",
  gpMargin: "원가 뺀 뒤 매출에서 실제로 남는 비율",
}

// ============================================================================
// 타입 정의
// ============================================================================

type Mix = {
  pork: number
  beef: number
  meal: number
  bev: number
  alc: number
}

type BaselineResult = {
  totalRevenue: number
  porkRevenue: number
  beefRevenue: number
  mealRevenue: number
  bevRevenue: number
  alcRevenue: number
  porkPortions: number
  beefPortions: number
  meatPortionsTotal: number
  cogsPork: number
  cogsBeef: number
  cogsMeal: number
  cogsBev: number
  cogsAlc: number
  cogsBase: number
  gpBase: number
  gpmBase: number
}

type DiscountResult = {
  discountAmount: number
  revenueNew: number
  cogsNew: number
  gpNew: number
  gpmNew: number
  liftNeeded: number
}

type MonthlyCalculation = {
  monthlyTeams: number
  weekdayTeams: number
  weekendTeams: number
  requiredTicket: number
  achievableRevenue: number
  dailyTeamsBase: number
  dailyTeamsNeeded: number
  weekdayTeamsNeeded: number
  weekendTeamsNeeded: number
}

// ============================================================================
// 기본값 상수
// ============================================================================

const DEFAULT_VALUES = {
  porkCostPerKg: 11500,
  beefCostPerKg: 9800,
  portionGrams: 200,
  minFirstOrderPortions: 5,
  porkPricePerPortion: 6500,
  beefPricePerPortion: 8500,
  mix: { pork: 60, beef: 10, meal: 15, bev: 5, alc: 10 },
  mealCogsRate: 35,
  bevCogsRate: 25,
  alcCogsRate: 35,
  targetMonthlyRevenue: 25000000,
  weekdayDays: 22,
  weekendDays: 8,
  weekdayTeamsPerDay: 14,
  weekendTeamsPerDay: 24,
  discountPerPortion: 0,
  scenarioDiscounts: "0,500,1000",
  givenTicket: 50000,
  alwaysOpen: true,
}

// ============================================================================
// 계산 로직 함수
// ============================================================================

/**
 * 기준(할인 전) 계산
 * - 매출 10만원 단위로 계산
 * - 육류 인분수 = 매출 / 인분가
 * - 원가 = 인분수 × 원가 (육류) or 매출 × 원가율 (비육류)
 * - 남는 돈 = 매출 - 원가
 */
function calculateBaseline(
  porkCostPerKg: number,
  beefCostPerKg: number,
  portionGrams: number,
  porkPricePerPortion: number,
  beefPricePerPortion: number,
  mix: Mix,
  mealCogsRate: number,
  bevCogsRate: number,
  alcCogsRate: number
): BaselineResult {
  // 원가 환산 (원/인분)
  const porkCostPerPortion = (porkCostPerKg / 1000) * portionGrams
  const beefCostPerPortion = (beefCostPerKg / 1000) * portionGrams

  // 기준 총매출 (10만원)
  const T = 100000

  // 분류별 매출
  const porkRevenue = T * (mix.pork / 100)
  const beefRevenue = T * (mix.beef / 100)
  const mealRevenue = T * (mix.meal / 100)
  const bevRevenue = T * (mix.bev / 100)
  const alcRevenue = T * (mix.alc / 100)

  // 인분수 (육류만)
  const porkPortions = porkPricePerPortion > 0 ? porkRevenue / porkPricePerPortion : 0
  const beefPortions = beefPricePerPortion > 0 ? beefRevenue / beefPricePerPortion : 0
  const meatPortionsTotal = porkPortions + beefPortions

  // 원가(기준)
  const cogsPork = porkPortions * porkCostPerPortion
  const cogsBeef = beefPortions * beefCostPerPortion
  const cogsMeal = mealRevenue * (mealCogsRate / 100)
  const cogsBev = bevRevenue * (bevCogsRate / 100)
  const cogsAlc = alcRevenue * (alcCogsRate / 100)
  const cogsBase = cogsPork + cogsBeef + cogsMeal + cogsBev + cogsAlc

  // 남는 돈(기준)
  const gpBase = T - cogsBase
  const gpmBase = gpBase / T

  return {
    totalRevenue: T,
    porkRevenue,
    beefRevenue,
    mealRevenue,
    bevRevenue,
    alcRevenue,
    porkPortions,
    beefPortions,
    meatPortionsTotal,
    cogsPork,
    cogsBeef,
    cogsMeal,
    cogsBev,
    cogsAlc,
    cogsBase,
    gpBase,
    gpmBase,
  }
}

/**
 * 할인 후 계산
 * - 육류 인분당 d원 할인 (볼륨 동일 가정)
 * - 매출감소 = 인분수 × d
 * - 원가는 동일 (볼륨 동일)
 * - 손익 동일을 위한 필요 추가객수(%) 계산
 */
function calculateDiscount(baseline: BaselineResult, discountPerPortion: number): DiscountResult {
  const discountAmount = baseline.meatPortionsTotal * discountPerPortion
  const revenueNew = baseline.totalRevenue - discountAmount
  const cogsNew = baseline.cogsBase

  const gpNew = revenueNew - cogsNew
  const gpmNew = revenueNew > 0 ? gpNew / revenueNew : 0

  // 손익 동일을 위한 필요 추가객수(%)
  // liftNeeded = (남는돈_기준 - 남는돈_할인후) / (남는비율_할인후 × 매출_할인후)
  const liftNeeded = gpmNew > 0 && revenueNew > 0 ? (baseline.gpBase - gpNew) / (gpmNew * revenueNew) : 0

  return {
    discountAmount,
    revenueNew,
    cogsNew,
    gpNew,
    gpmNew,
    liftNeeded,
  }
}

/**
 * 월 목표/회전 계산
 */
function calculateMonthly(
  alwaysOpen: boolean,
  weekdayDays: number,
  weekendDays: number,
  weekdayTeamsPerDay: number,
  weekendTeamsPerDay: number,
  targetMonthlyRevenue: number,
  givenTicket: number,
  liftNeeded: number
): MonthlyCalculation {
  // 월 일수
  const days = alwaysOpen ? 30 : weekdayDays + weekendDays

  // 연중무휴일 경우 평일/주말 비율을 기본값 기준으로 계산
  const actualWeekdayDays = alwaysOpen ? Math.round(days * 22 / 30) : weekdayDays
  const actualWeekendDays = alwaysOpen ? Math.round(days * 8 / 30) : weekendDays

  // 월 팀수
  const monthlyTeams = actualWeekdayDays * weekdayTeamsPerDay + actualWeekendDays * weekendTeamsPerDay
  const weekdayTeams = actualWeekdayDays * weekdayTeamsPerDay
  const weekendTeams = actualWeekendDays * weekendTeamsPerDay

  // 목표 월매출 달성 위한 필요 객단가
  const requiredTicket = monthlyTeams > 0 ? targetMonthlyRevenue / monthlyTeams : 0

  // 주어진 객단가로 달성 가능한 월매출
  const achievableRevenue = monthlyTeams * givenTicket

  // 할인 반영 시 손익 동일 조건에서의 추가 팀수
  const dailyTeamsBase = days > 0 ? monthlyTeams / days : 0
  const dailyTeamsNeeded = dailyTeamsBase * (1 + liftNeeded)
  const weekdayTeamsNeeded = weekdayTeamsPerDay * (1 + liftNeeded)
  const weekendTeamsNeeded = weekendTeamsPerDay * (1 + liftNeeded)

  return {
    monthlyTeams,
    weekdayTeams,
    weekendTeams,
    requiredTicket,
    achievableRevenue,
    dailyTeamsBase,
    dailyTeamsNeeded,
    weekdayTeamsNeeded,
    weekendTeamsNeeded,
  }
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function PricingSimPage() {
  // ========== 상태 관리 ==========
  const [mounted, setMounted] = useState(false)

  // 원가/기본 단위
  const [porkCostPerKg, setPorkCostPerKg] = useState(DEFAULT_VALUES.porkCostPerKg)
  const [beefCostPerKg, setBeefCostPerKg] = useState(DEFAULT_VALUES.beefCostPerKg)
  const [portionGrams, setPortionGrams] = useState(DEFAULT_VALUES.portionGrams)

  // 메뉴 가격
  const [porkPricePerPortion, setPorkPricePerPortion] = useState(DEFAULT_VALUES.porkPricePerPortion)
  const [beefPricePerPortion, setBeefPricePerPortion] = useState(DEFAULT_VALUES.beefPricePerPortion)

  // 매출 믹스
  const [mixPork, setMixPork] = useState(DEFAULT_VALUES.mix.pork)
  const [mixBeef, setMixBeef] = useState(DEFAULT_VALUES.mix.beef)
  const [mixMeal, setMixMeal] = useState(DEFAULT_VALUES.mix.meal)
  const [mixBev, setMixBev] = useState(DEFAULT_VALUES.mix.bev)
  const [mixAlc, setMixAlc] = useState(DEFAULT_VALUES.mix.alc)

  // 비육류 원가율
  const [mealCogsRate, setMealCogsRate] = useState(DEFAULT_VALUES.mealCogsRate)
  const [bevCogsRate, setBevCogsRate] = useState(DEFAULT_VALUES.bevCogsRate)
  const [alcCogsRate, setAlcCogsRate] = useState(DEFAULT_VALUES.alcCogsRate)

  // 운영 캘린더/목표
  const [alwaysOpen, setAlwaysOpen] = useState(DEFAULT_VALUES.alwaysOpen)
  const [weekdayDays, setWeekdayDays] = useState(DEFAULT_VALUES.weekdayDays)
  const [weekendDays, setWeekendDays] = useState(DEFAULT_VALUES.weekendDays)
  const [targetMonthlyRevenue, setTargetMonthlyRevenue] = useState(DEFAULT_VALUES.targetMonthlyRevenue)
  const [weekdayTeamsPerDay, setWeekdayTeamsPerDay] = useState(DEFAULT_VALUES.weekdayTeamsPerDay)
  const [weekendTeamsPerDay, setWeekendTeamsPerDay] = useState(DEFAULT_VALUES.weekendTeamsPerDay)

  // 할인 시나리오
  const [discountPerPortion, setDiscountPerPortion] = useState(DEFAULT_VALUES.discountPerPortion)
  const [scenarioDiscounts, setScenarioDiscounts] = useState(DEFAULT_VALUES.scenarioDiscounts)
  const [givenTicket, setGivenTicket] = useState(DEFAULT_VALUES.givenTicket)

  // 차트 표시 여부
  const [showChart, setShowChart] = useState(true)

  // ========== localStorage 연동 ==========
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("pricingSimData")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setPorkCostPerKg(data.porkCostPerKg ?? DEFAULT_VALUES.porkCostPerKg)
        setBeefCostPerKg(data.beefCostPerKg ?? DEFAULT_VALUES.beefCostPerKg)
        setPortionGrams(data.portionGrams ?? DEFAULT_VALUES.portionGrams)
        setPorkPricePerPortion(data.porkPricePerPortion ?? DEFAULT_VALUES.porkPricePerPortion)
        setBeefPricePerPortion(data.beefPricePerPortion ?? DEFAULT_VALUES.beefPricePerPortion)
        setMixPork(data.mixPork ?? DEFAULT_VALUES.mix.pork)
        setMixBeef(data.mixBeef ?? DEFAULT_VALUES.mix.beef)
        setMixMeal(data.mixMeal ?? DEFAULT_VALUES.mix.meal)
        setMixBev(data.mixBev ?? DEFAULT_VALUES.mix.bev)
        setMixAlc(data.mixAlc ?? DEFAULT_VALUES.mix.alc)
        setMealCogsRate(data.mealCogsRate ?? DEFAULT_VALUES.mealCogsRate)
        setBevCogsRate(data.bevCogsRate ?? DEFAULT_VALUES.bevCogsRate)
        setAlcCogsRate(data.alcCogsRate ?? DEFAULT_VALUES.alcCogsRate)
        setAlwaysOpen(data.alwaysOpen ?? DEFAULT_VALUES.alwaysOpen)
        setWeekdayDays(data.weekdayDays ?? DEFAULT_VALUES.weekdayDays)
        setWeekendDays(data.weekendDays ?? DEFAULT_VALUES.weekendDays)
        setTargetMonthlyRevenue(data.targetMonthlyRevenue ?? DEFAULT_VALUES.targetMonthlyRevenue)
        setWeekdayTeamsPerDay(data.weekdayTeamsPerDay ?? DEFAULT_VALUES.weekdayTeamsPerDay)
        setWeekendTeamsPerDay(data.weekendTeamsPerDay ?? DEFAULT_VALUES.weekendTeamsPerDay)
        setDiscountPerPortion(data.discountPerPortion ?? DEFAULT_VALUES.discountPerPortion)
        setScenarioDiscounts(data.scenarioDiscounts ?? DEFAULT_VALUES.scenarioDiscounts)
        setGivenTicket(data.givenTicket ?? DEFAULT_VALUES.givenTicket)
      } catch (e) {
        console.error("Failed to load saved data", e)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const data = {
      porkCostPerKg,
      beefCostPerKg,
      portionGrams,
      porkPricePerPortion,
      beefPricePerPortion,
      mixPork,
      mixBeef,
      mixMeal,
      mixBev,
      mixAlc,
      mealCogsRate,
      bevCogsRate,
      alcCogsRate,
      alwaysOpen,
      weekdayDays,
      weekendDays,
      targetMonthlyRevenue,
      weekdayTeamsPerDay,
      weekendTeamsPerDay,
      discountPerPortion,
      scenarioDiscounts,
      givenTicket,
    }
    localStorage.setItem("pricingSimData", JSON.stringify(data))
  }, [
    mounted,
    porkCostPerKg,
    beefCostPerKg,
    portionGrams,
    porkPricePerPortion,
    beefPricePerPortion,
    mixPork,
    mixBeef,
    mixMeal,
    mixBev,
    mixAlc,
    mealCogsRate,
    bevCogsRate,
    alcCogsRate,
    alwaysOpen,
    weekdayDays,
    weekendDays,
    targetMonthlyRevenue,
    weekdayTeamsPerDay,
    weekendTeamsPerDay,
    discountPerPortion,
    scenarioDiscounts,
    givenTicket,
  ])

  // ========== 계산 (useMemo) ==========
  const mix: Mix = useMemo(
    () => ({
      pork: mixPork,
      beef: mixBeef,
      meal: mixMeal,
      bev: mixBev,
      alc: mixAlc,
    }),
    [mixPork, mixBeef, mixMeal, mixBev, mixAlc]
  )

  const mixTotal = useMemo(() => mixPork + mixBeef + mixMeal + mixBev + mixAlc, [mixPork, mixBeef, mixMeal, mixBev, mixAlc])

  const baseline = useMemo(
    () =>
      calculateBaseline(
        porkCostPerKg,
        beefCostPerKg,
        portionGrams,
        porkPricePerPortion,
        beefPricePerPortion,
        mix,
        mealCogsRate,
        bevCogsRate,
        alcCogsRate
      ),
    [porkCostPerKg, beefCostPerKg, portionGrams, porkPricePerPortion, beefPricePerPortion, mix, mealCogsRate, bevCogsRate, alcCogsRate]
  )

  const currentDiscount = useMemo(() => calculateDiscount(baseline, discountPerPortion), [baseline, discountPerPortion])

  const scenarios = useMemo(() => {
    const discounts = scenarioDiscounts
      .split(",")
      .map((d) => parseFloat(d.trim()))
      .filter((d) => !isNaN(d))
    return discounts.map((d) => ({
      discount: d,
      result: calculateDiscount(baseline, d),
    }))
  }, [baseline, scenarioDiscounts])

  const monthly = useMemo(
    () =>
      calculateMonthly(
        alwaysOpen,
        weekdayDays,
        weekendDays,
        weekdayTeamsPerDay,
        weekendTeamsPerDay,
        targetMonthlyRevenue,
        givenTicket,
        currentDiscount.liftNeeded
      ),
    [alwaysOpen, weekdayDays, weekendDays, weekdayTeamsPerDay, weekendTeamsPerDay, targetMonthlyRevenue, givenTicket, currentDiscount]
  )

  // ========== 검증 ==========
  const mixWarning = mixTotal !== 100
  const negativeMarginWarning = currentDiscount.gpmNew <= 0 && discountPerPortion > 0

  // ========== 기본값 관리 ==========
  const handleLoadDefaults = () => {
    setPorkCostPerKg(DEFAULT_VALUES.porkCostPerKg)
    setBeefCostPerKg(DEFAULT_VALUES.beefCostPerKg)
    setPortionGrams(DEFAULT_VALUES.portionGrams)
    setPorkPricePerPortion(DEFAULT_VALUES.porkPricePerPortion)
    setBeefPricePerPortion(DEFAULT_VALUES.beefPricePerPortion)
    setMixPork(DEFAULT_VALUES.mix.pork)
    setMixBeef(DEFAULT_VALUES.mix.beef)
    setMixMeal(DEFAULT_VALUES.mix.meal)
    setMixBev(DEFAULT_VALUES.mix.bev)
    setMixAlc(DEFAULT_VALUES.mix.alc)
    setMealCogsRate(DEFAULT_VALUES.mealCogsRate)
    setBevCogsRate(DEFAULT_VALUES.bevCogsRate)
    setAlcCogsRate(DEFAULT_VALUES.alcCogsRate)
    setAlwaysOpen(DEFAULT_VALUES.alwaysOpen)
    setWeekdayDays(DEFAULT_VALUES.weekdayDays)
    setWeekendDays(DEFAULT_VALUES.weekendDays)
    setTargetMonthlyRevenue(DEFAULT_VALUES.targetMonthlyRevenue)
    setWeekdayTeamsPerDay(DEFAULT_VALUES.weekdayTeamsPerDay)
    setWeekendTeamsPerDay(DEFAULT_VALUES.weekendTeamsPerDay)
    setDiscountPerPortion(DEFAULT_VALUES.discountPerPortion)
    setScenarioDiscounts(DEFAULT_VALUES.scenarioDiscounts)
    setGivenTicket(DEFAULT_VALUES.givenTicket)
  }

  const handleReset = () => {
    localStorage.removeItem("pricingSimData")
    handleLoadDefaults()
  }

  // ========== 차트 데이터 ==========
  const chartData = scenarios.map((s) => ({
    name: `${s.discount.toLocaleString()}원`,
    "남는 돈": Math.round(s.result.gpNew),
    "필요추가객수%": (s.result.liftNeeded * 100).toFixed(1),
  }))

  // ========== 렌더링 ==========
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">고깃집 가격 시뮬레이터</h1>
        <p className="text-muted-foreground">가격 인하 및 회전율 전략을 실시간으로 검증하세요</p>
      </div>

      {/* 기본값 관리 버튼 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleLoadDefaults}>
          기본값 로드
        </Button>
        <Button variant="outline" onClick={handleReset}>
          초기화
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Label htmlFor="show-chart">차트 표시</Label>
          <Switch id="show-chart" checked={showChart} onCheckedChange={setShowChart} />
        </div>
      </div>

      {/* 경고 표시 */}
      {mixWarning && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>매출 믹스 오류</AlertTitle>
          <AlertDescription>매출 믹스의 합계는 100%여야 합니다. 현재: {mixTotal}%</AlertDescription>
        </Alert>
      )}

      {negativeMarginWarning && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>마진 경고</AlertTitle>
          <AlertDescription>남는 비율(%)가 0 이하입니다. 가격/할인/원가율을 재검토하세요.</AlertDescription>
        </Alert>
      )}

      {/* 입력 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* 원가/기본 단위 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">원가/기본 단위</CardTitle>
            <CardDescription>고기 원가 및 1인분 중량 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pork-cost">돼지고기 원가 (원/kg)</Label>
              <Input
                id="pork-cost"
                type="number"
                value={porkCostPerKg}
                onChange={(e) => setPorkCostPerKg(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="beef-cost">소고기 원가 (원/kg)</Label>
              <Input
                id="beef-cost"
                type="number"
                value={beefCostPerKg}
                onChange={(e) => setBeefCostPerKg(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="portion-grams">1인분 중량 (g)</Label>
              <Input
                id="portion-grams"
                type="number"
                value={portionGrams}
                onChange={(e) => setPortionGrams(parseFloat(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 메뉴 가격 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">메뉴 가격</CardTitle>
            <CardDescription>인분당 판매가</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pork-price">돼지고기 판매가 (원/인분)</Label>
              <Input
                id="pork-price"
                type="number"
                value={porkPricePerPortion}
                onChange={(e) => setPorkPricePerPortion(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="beef-price">소고기 판매가 (원/인분)</Label>
              <Input
                id="beef-price"
                type="number"
                value={beefPricePerPortion}
                onChange={(e) => setBeefPricePerPortion(parseFloat(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 매출 믹스 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">매출 믹스 (%)</CardTitle>
            <CardDescription>합계: {mixTotal}% {mixWarning && <span className="text-destructive">(100%여야 함)</span>}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mix-pork">돼지고기 (%)</Label>
              <Input id="mix-pork" type="number" value={mixPork} onChange={(e) => setMixPork(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label htmlFor="mix-beef">소고기 (%)</Label>
              <Input id="mix-beef" type="number" value={mixBeef} onChange={(e) => setMixBeef(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label htmlFor="mix-meal">식사 (%)</Label>
              <Input id="mix-meal" type="number" value={mixMeal} onChange={(e) => setMixMeal(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label htmlFor="mix-bev">음료 (%)</Label>
              <Input id="mix-bev" type="number" value={mixBev} onChange={(e) => setMixBev(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label htmlFor="mix-alc">주류 (%)</Label>
              <Input id="mix-alc" type="number" value={mixAlc} onChange={(e) => setMixAlc(parseFloat(e.target.value) || 0)} />
            </div>
          </CardContent>
        </Card>

        {/* 비육류 원가율 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">비육류 원가율 (%)</CardTitle>
            <CardDescription>식사/음료/주류 원가율 (매출 대비 원가 비율)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meal-cogs">식사 원가율 (%)</Label>
              <Input id="meal-cogs" type="number" value={mealCogsRate} onChange={(e) => setMealCogsRate(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label htmlFor="bev-cogs">음료 원가율 (%)</Label>
              <Input id="bev-cogs" type="number" value={bevCogsRate} onChange={(e) => setBevCogsRate(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label htmlFor="alc-cogs">주류 원가율 (%)</Label>
              <Input id="alc-cogs" type="number" value={alcCogsRate} onChange={(e) => setAlcCogsRate(parseFloat(e.target.value) || 0)} />
            </div>
          </CardContent>
        </Card>

        {/* 운영 캘린더 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">운영 캘린더</CardTitle>
            <CardDescription>영업일 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="always-open">연중무휴</Label>
              <Switch id="always-open" checked={alwaysOpen} onCheckedChange={setAlwaysOpen} />
            </div>
            {!alwaysOpen && (
              <>
                <div>
                  <Label htmlFor="weekday-days">평일 일수 (월)</Label>
                  <Input
                    id="weekday-days"
                    type="number"
                    value={weekdayDays}
                    onChange={(e) => setWeekdayDays(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="weekend-days">주말 일수 (월)</Label>
                  <Input
                    id="weekend-days"
                    type="number"
                    value={weekendDays}
                    onChange={(e) => setWeekendDays(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </>
            )}
            {alwaysOpen && (
              <p className="text-sm text-muted-foreground">월 30일 고정 (평일 22일, 주말 8일 기준)</p>
            )}
          </CardContent>
        </Card>

        {/* 목표 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">목표 설정</CardTitle>
            <CardDescription>매출 목표 및 팀수</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-revenue">목표 월매출 (원)</Label>
              <Input
                id="target-revenue"
                type="number"
                value={targetMonthlyRevenue}
                onChange={(e) => setTargetMonthlyRevenue(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="weekday-teams">평일 목표 팀수/일</Label>
              <Input
                id="weekday-teams"
                type="number"
                value={weekdayTeamsPerDay}
                onChange={(e) => setWeekdayTeamsPerDay(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="weekend-teams">주말 목표 팀수/일</Label>
              <Input
                id="weekend-teams"
                type="number"
                value={weekendTeamsPerDay}
                onChange={(e) => setWeekendTeamsPerDay(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="given-ticket">현재 객단가 (원)</Label>
              <Input
                id="given-ticket"
                type="number"
                value={givenTicket}
                onChange={(e) => setGivenTicket(parseFloat(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 할인 시나리오 */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">할인 시나리오</CardTitle>
            <CardDescription>육류 인분당 할인액 설정 (쉼표로 구분)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">현재 할인액 (원/인분)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discountPerPortion}
                  onChange={(e) => setDiscountPerPortion(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="scenarios">비교 시나리오 (예: 0,500,1000)</Label>
                <Input id="scenarios" type="text" value={scenarioDiscounts} onChange={(e) => setScenarioDiscounts(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 결과 영역 */}
      <div className="space-y-6">
        {/* 기준 요약 */}
        <Card>
          <CardHeader>
            <CardTitle>기준 요약 (할인 전)</CardTitle>
            <CardDescription>매출 10만원 기준</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  총 남는 비율
                  <span title={tooltips.gpMargin} className="cursor-help">
                    <Info className="h-3 w-3" />
                  </span>
                </p>
                <p className="text-2xl font-bold">{fmtPct(baseline.gpmBase)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  총 원가
                  <span title={tooltips.cogs} className="cursor-help">
                    <Info className="h-3 w-3" />
                  </span>
                </p>
                <p className="text-2xl font-bold">{fmtWon(baseline.cogsBase)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">돼지 인분수</p>
                <p className="text-2xl font-bold">{baseline.porkPortions.toFixed(2)}인분</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">소 인분수</p>
                <p className="text-2xl font-bold">{baseline.beefPortions.toFixed(2)}인분</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 회전/객단가 */}
        <Card>
          <CardHeader>
            <CardTitle>회전율 및 객단가</CardTitle>
            <CardDescription>월 기준 계산</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">월 총 팀수</p>
                <p className="text-xl font-bold">{monthly.monthlyTeams.toLocaleString("ko-KR")}팀</p>
                <p className="text-xs text-muted-foreground">
                  평일: {monthly.weekdayTeams.toLocaleString("ko-KR")}팀 / 주말: {monthly.weekendTeams.toLocaleString("ko-KR")}팀
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">목표 달성 필요 객단가</p>
                <p className="text-xl font-bold">{monthly.requiredTicket.toLocaleString("ko-KR")}원</p>
                <p className="text-xs text-muted-foreground">목표: {targetMonthlyRevenue.toLocaleString("ko-KR")}원</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">현 객단가 달성 가능 매출</p>
                <p className="text-xl font-bold">{monthly.achievableRevenue.toLocaleString("ko-KR")}원</p>
                <p className="text-xs text-muted-foreground">객단가: {givenTicket.toLocaleString("ko-KR")}원</p>
              </div>
            </div>

            {discountPerPortion > 0 && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium mb-4">할인 후 손익유지 필요 팀수 (할인액: {discountPerPortion.toLocaleString("ko-KR")}원/인분)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">평일 필요 팀수/일</p>
                    <p className="text-lg font-bold">
                      {monthly.weekdayTeamsNeeded.toFixed(1)}팀
                      <span className="text-sm text-muted-foreground ml-2">
                        (+{(monthly.weekdayTeamsNeeded - weekdayTeamsPerDay).toFixed(1)})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">주말 필요 팀수/일</p>
                    <p className="text-lg font-bold">
                      {monthly.weekendTeamsNeeded.toFixed(1)}팀
                      <span className="text-sm text-muted-foreground ml-2">
                        (+{(monthly.weekendTeamsNeeded - weekendTeamsPerDay).toFixed(1)})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">필요 추가 객수</p>
                    <p className="text-lg font-bold text-orange-600">+{(currentDiscount.liftNeeded * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 할인 시나리오 비교 */}
        <Card>
          <CardHeader>
            <CardTitle>할인 시나리오 비교</CardTitle>
            <CardDescription>각 할인액별 영향 분석</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="table">표</TabsTrigger>
                {showChart && <TabsTrigger value="chart">차트</TabsTrigger>}
              </TabsList>

              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">할인액 (원/인분)</th>
                        <th className="text-right py-2 px-2">매출감소액 (원)</th>
                        <th className="text-right py-2 px-2">할인 후 남는 돈 (원)</th>
                        <th className="text-right py-2 px-2">할인 후 남는 비율 (%)</th>
                        <th className="text-right py-2 px-2">필요 추가객수 (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.map((s, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-2 font-medium">{s.discount.toLocaleString("ko-KR")}</td>
                          <td className="text-right py-2 px-2">{fmtWon(s.result.discountAmount)}</td>
                          <td className="text-right py-2 px-2">{fmtWon(s.result.gpNew)}</td>
                          <td className="text-right py-2 px-2">{fmtPct(s.result.gpmNew)}</td>
                          <td className="text-right py-2 px-2 font-bold text-orange-600">
                            +{fmtPct(s.result.liftNeeded)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {showChart && (
                <TabsContent value="chart">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="남는 돈" fill="#8884d8" name="할인 후 남는 돈 (원)" />
                        <Bar yAxisId="right" dataKey="필요추가객수%" fill="#82ca9d" name="필요 추가객수 (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* 상세 분석 */}
        <Card>
          <CardHeader>
            <CardTitle>상세 분석</CardTitle>
            <CardDescription>현재 할인액 기준 ({discountPerPortion.toLocaleString("ko-KR")}원/인분)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">기준 (할인 전)</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">매출:</span>
                      <span className="font-medium">{fmtWon(baseline.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">원가:</span>
                      <span className="font-medium">{fmtWon(baseline.cogsBase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">남는 돈:</span>
                      <span className="font-medium">{fmtWon(baseline.gpBase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">남는 비율:</span>
                      <span className="font-medium">{fmtPct(baseline.gpmBase)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">할인 후</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">매출:</span>
                      <span className="font-medium">{fmtWon(currentDiscount.revenueNew)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">원가:</span>
                      <span className="font-medium">{fmtWon(currentDiscount.cogsNew)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">남는 돈:</span>
                      <span className="font-medium">{fmtWon(currentDiscount.gpNew)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">남는 비율:</span>
                      <span className="font-medium">{fmtPct(currentDiscount.gpmNew)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">매출감소액:</span>
                      <span className="font-medium text-red-600">-{fmtWon(currentDiscount.discountAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">남는 돈 감소액:</span>
                      <span className="font-medium text-red-600">
                        -{fmtWon(baseline.gpBase - currentDiscount.gpNew)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {discountPerPortion > 0 && (
              <div className="mt-6 pt-6 border-t">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>손익 동일 유지 조건</AlertTitle>
                  <AlertDescription>
                    현재 할인 ({discountPerPortion.toLocaleString("ko-KR")}원/인분)으로 동일한 수익을 유지하려면 객수를{" "}
                    <span className="font-bold text-orange-600">+{fmtPct(currentDiscount.liftNeeded)}</span> 늘려야 합니다.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 하단 정보 */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>모든 입력은 실시간으로 localStorage에 자동 저장됩니다.</p>
      </div>
    </div>
  )
}
