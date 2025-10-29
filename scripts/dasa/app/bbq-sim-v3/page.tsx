"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, Info, Download, Upload, Plus, Trash2, Save } from "lucide-react"

// ============================================================================
// 표기 유틸리티
// ============================================================================

const fmtWon = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`
const fmtPct = (r: number) => {
  const pct = r <= 1 ? r * 100 : r
  return `${pct.toFixed(pct < 10 ? 2 : 1)}%`
}

// ============================================================================
// 타입 정의
// ============================================================================

type MenuCategory = "pork" | "beef" | "meal" | "beverage" | "alcohol"

type MenuItem = {
  id: string
  name: string
  category: MenuCategory
  pricePerPortion: number
  directCostPerUnit: number
  portionGrams?: number // 육류만 사용
  meatCostPerKg?: number // 육류만 사용
  yieldRate?: number // 육류 수율
  isActive: boolean
  notes?: string
}

type MenuMix = {
  [menuId: string]: number // 판매 비중 (%)
}

type SimulationResult = {
  totalRevenue: number
  totalCost: number
  totalProfit: number
  profitMargin: number
  menuBreakdown: {
    menuId: string
    name: string
    revenue: number
    cost: number
    profit: number
    portions: number
  }[]
}

// ============================================================================
// 기본 메뉴 데이터
// ============================================================================

const DEFAULT_MENUS: MenuItem[] = [
  // 돼지고기
  { id: "p1", name: "삼겹살", category: "pork", pricePerPortion: 15000, directCostPerUnit: 0, portionGrams: 200, meatCostPerKg: 11500, yieldRate: 0.95, isActive: true },
  { id: "p2", name: "목살", category: "pork", pricePerPortion: 15000, directCostPerUnit: 0, portionGrams: 200, meatCostPerKg: 10500, yieldRate: 0.95, isActive: true },
  { id: "p3", name: "항정살", category: "pork", pricePerPortion: 17000, directCostPerUnit: 0, portionGrams: 200, meatCostPerKg: 13500, yieldRate: 0.92, isActive: true },

  // 소고기
  { id: "b1", name: "소불고기", category: "beef", pricePerPortion: 18000, directCostPerUnit: 0, portionGrams: 200, meatCostPerKg: 16000, yieldRate: 0.90, isActive: true },
  { id: "b2", name: "차돌박이", category: "beef", pricePerPortion: 20000, directCostPerUnit: 0, portionGrams: 200, meatCostPerKg: 18000, yieldRate: 0.88, isActive: true },

  // 식사
  { id: "m1", name: "냉면", category: "meal", pricePerPortion: 8000, directCostPerUnit: 2800, isActive: true },
  { id: "m2", name: "된장찌개", category: "meal", pricePerPortion: 7000, directCostPerUnit: 2450, isActive: true },
  { id: "m3", name: "김치찌개", category: "meal", pricePerPortion: 7000, directCostPerUnit: 2450, isActive: true },
  { id: "m4", name: "공기밥", category: "meal", pricePerPortion: 1000, directCostPerUnit: 350, isActive: true },

  // 음료
  { id: "d1", name: "코카콜라", category: "beverage", pricePerPortion: 2000, directCostPerUnit: 700, isActive: true },
  { id: "d2", name: "제로콜라", category: "beverage", pricePerPortion: 2000, directCostPerUnit: 800, isActive: true },
  { id: "d3", name: "뽀로로밀크제로", category: "beverage", pricePerPortion: 2500, directCostPerUnit: 1100, isActive: true },
  { id: "d4", name: "스프라이트", category: "beverage", pricePerPortion: 2000, directCostPerUnit: 700, isActive: true },
  { id: "d5", name: "환타파인애플", category: "beverage", pricePerPortion: 2000, directCostPerUnit: 700, isActive: true },

  // 소주/청하
  { id: "a1", name: "참이슬", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1700, isActive: true },
  { id: "a2", name: "참소주", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1700, isActive: true },
  { id: "a3", name: "진로", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1700, isActive: true },
  { id: "a4", name: "새로", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1700, isActive: true },
  { id: "a5", name: "제로투", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1700, isActive: true, notes: "브랜드 실구매가 반영 권장" },
  { id: "a6", name: "찐찐", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1700, isActive: true, notes: "브랜드 실구매가 반영 권장" },
  { id: "a7", name: "청하", category: "alcohol", pricePerPortion: 6000, directCostPerUnit: 2300, isActive: true },

  // 맥주
  { id: "a8", name: "카스", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1800, isActive: true },
  { id: "a9", name: "테라", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1800, isActive: true },
  { id: "a10", name: "켈리", category: "alcohol", pricePerPortion: 5000, directCostPerUnit: 1800, isActive: true },
  { id: "a11", name: "논알콜맥주", category: "alcohol", pricePerPortion: 4000, directCostPerUnit: 1600, isActive: true, notes: "브랜드별 원가 차이 반영 권장" },
]

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  pork: "돼지고기",
  beef: "소고기",
  meal: "식사",
  beverage: "음료",
  alcohol: "주류",
}

const CATEGORY_COLORS: Record<MenuCategory, string> = {
  pork: "#ff6b6b",
  beef: "#4ecdc4",
  meal: "#ffe66d",
  beverage: "#95e1d3",
  alcohol: "#f38181",
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function BBQSimV3Page() {
  const [mounted, setMounted] = useState(false)
  const [menus, setMenus] = useState<MenuItem[]>(DEFAULT_MENUS)
  const [menuMix, setMenuMix] = useState<MenuMix>({
    p1: 30, // 삼겹살
    p2: 15, // 목살
    m1: 10, // 냉면
    m2: 8,  // 된장찌개
    d1: 8,  // 코카콜라
    a1: 15, // 참이슬
    a8: 14, // 카스
  })

  const [discountPerPortion, setDiscountPerPortion] = useState(0)
  const [targetMonthlyRevenue, setTargetMonthlyRevenue] = useState(25000000)
  const [monthlyTeams, setMonthlyTeams] = useState(430)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("bbqSimV3Data")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.menus) setMenus(data.menus)
        if (data.menuMix) setMenuMix(data.menuMix)
        if (data.discountPerPortion !== undefined) setDiscountPerPortion(data.discountPerPortion)
        if (data.targetMonthlyRevenue) setTargetMonthlyRevenue(data.targetMonthlyRevenue)
        if (data.monthlyTeams) setMonthlyTeams(data.monthlyTeams)
      } catch (e) {
        console.error("Failed to load data", e)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const data = { menus, menuMix, discountPerPortion, targetMonthlyRevenue, monthlyTeams }
    localStorage.setItem("bbqSimV3Data", JSON.stringify(data))
  }, [mounted, menus, menuMix, discountPerPortion, targetMonthlyRevenue, monthlyTeams])

  // ========== 계산 로직 ==========
  const activeMenus = useMemo(() => menus.filter((m) => m.isActive), [menus])

  const mixTotal = useMemo(() => {
    return Object.values(menuMix).reduce((sum, val) => sum + val, 0)
  }, [menuMix])

  const simulation = useMemo((): SimulationResult => {
    const baseRevenue = 100000
    let totalRevenue = 0
    let totalCost = 0
    const menuBreakdown: SimulationResult["menuBreakdown"] = []

    activeMenus.forEach((menu) => {
      const mixPct = (menuMix[menu.id] || 0) / 100
      const revenue = baseRevenue * mixPct

      let costPerPortion = menu.directCostPerUnit

      // 육류는 kg 원가 + 중량 + 수율로 계산
      if (menu.category === "pork" || menu.category === "beef") {
        if (menu.meatCostPerKg && menu.portionGrams && menu.yieldRate) {
          costPerPortion = (menu.meatCostPerKg / 1000) * menu.portionGrams / menu.yieldRate
        }
      }

      const portions = menu.pricePerPortion > 0 ? revenue / menu.pricePerPortion : 0
      const cost = portions * costPerPortion
      const profit = revenue - cost

      totalRevenue += revenue
      totalCost += cost

      if (revenue > 0) {
        menuBreakdown.push({
          menuId: menu.id,
          name: menu.name,
          revenue,
          cost,
          profit,
          portions,
        })
      }
    })

    const totalProfit = totalRevenue - totalCost
    const profitMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      menuBreakdown,
    }
  }, [activeMenus, menuMix])

  // 할인 시뮬레이션
  const discountSimulation = useMemo(() => {
    const meatMenus = simulation.menuBreakdown.filter((m) => {
      const menu = menus.find((mn) => mn.id === m.menuId)
      return menu && (menu.category === "pork" || menu.category === "beef")
    })

    const totalMeatPortions = meatMenus.reduce((sum, m) => sum + m.portions, 0)
    const discountAmount = totalMeatPortions * discountPerPortion
    const revenueNew = simulation.totalRevenue - discountAmount
    const profitNew = simulation.totalProfit - discountAmount
    const profitMarginNew = revenueNew > 0 ? profitNew / revenueNew : 0

    const liftNeeded = profitMarginNew > 0 && revenueNew > 0
      ? (simulation.totalProfit - profitNew) / (profitMarginNew * revenueNew)
      : 0

    return {
      discountAmount,
      revenueNew,
      profitNew,
      profitMarginNew,
      liftNeeded,
      totalMeatPortions,
    }
  }, [simulation, discountPerPortion, menus])

  // ========== 메뉴 관리 ==========
  const handleMenuChange = (id: string, field: keyof MenuItem, value: any) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const handleAddMenu = (category: MenuCategory) => {
    const newId = `custom_${Date.now()}`
    const newMenu: MenuItem = {
      id: newId,
      name: "새 메뉴",
      category,
      pricePerPortion: 10000,
      directCostPerUnit: 3500,
      isActive: true,
    }
    setMenus((prev) => [...prev, newMenu])
  }

  const handleDeleteMenu = (id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id))
    setMenuMix((prev) => {
      const newMix = { ...prev }
      delete newMix[id]
      return newMix
    })
  }

  const handleMixChange = (menuId: string, value: number) => {
    setMenuMix((prev) => ({ ...prev, [menuId]: value }))
  }

  // ========== CSV 가져오기/내보내기 ==========
  const handleExportCSV = () => {
    const headers = ["id", "name", "category", "portionGrams", "pricePerPortion", "meatCostPerKg", "directCostPerUnit", "yieldRate", "isActive", "notes"]
    const rows = menus.map((m) => [
      m.id,
      m.name,
      m.category,
      m.portionGrams || "",
      m.pricePerPortion,
      m.meatCostPerKg || "",
      m.directCostPerUnit,
      m.yieldRate || "",
      m.isActive,
      m.notes || "",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bbq_menus.csv"
    a.click()
  }

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split("\n").filter((l) => l.trim())
      const headers = lines[0].split(",")

      const imported: MenuItem[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",")
        const menu: any = {}

        headers.forEach((h, idx) => {
          const val = values[idx]?.trim()
          if (h === "isActive") menu[h] = val === "true"
          else if (["pricePerPortion", "directCostPerUnit", "portionGrams", "meatCostPerKg", "yieldRate"].includes(h)) {
            menu[h] = val ? parseFloat(val) : undefined
          } else {
            menu[h] = val || undefined
          }
        })

        if (menu.id && menu.name) imported.push(menu as MenuItem)
      }

      if (imported.length > 0) {
        setMenus(imported)
        alert(`${imported.length}개 메뉴를 가져왔습니다.`)
      }
    }
    reader.readAsText(file)
  }

  // ========== 차트 데이터 ==========
  const pieData = useMemo(() => {
    return simulation.menuBreakdown.map((m) => {
      const menu = menus.find((mn) => mn.id === m.menuId)
      return {
        name: m.name,
        value: m.revenue,
        color: menu ? CATEGORY_COLORS[menu.category] : "#999",
      }
    })
  }, [simulation, menus])

  const profitData = useMemo(() => {
    return simulation.menuBreakdown
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10)
      .map((m) => ({
        name: m.name,
        남는돈: Math.round(m.profit),
        원가: Math.round(m.cost),
      }))
  }, [simulation])

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  const mixWarning = Math.abs(mixTotal - 100) > 0.1
  const negativeMarginWarning = discountSimulation.profitMarginNew <= 0 && discountPerPortion > 0

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">고깃집 시뮬레이터 v3 (고급)</h1>
        <p className="text-muted-foreground">메뉴별 세밀한 관리 및 시뮬레이션</p>
      </div>

      {/* 경고 */}
      {mixWarning && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>믹스 경고</AlertTitle>
          <AlertDescription>판매 믹스의 합계는 100%여야 합니다. 현재: {mixTotal.toFixed(1)}%</AlertDescription>
        </Alert>
      )}

      {negativeMarginWarning && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>마진 경고</AlertTitle>
          <AlertDescription>할인이 너무 커서 남는 비율이 0 이하입니다.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="menu" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="menu">메뉴 관리</TabsTrigger>
          <TabsTrigger value="mix">판매 믹스</TabsTrigger>
          <TabsTrigger value="simulation">시뮬레이션</TabsTrigger>
          <TabsTrigger value="result">결과</TabsTrigger>
        </TabsList>

        {/* 메뉴 관리 탭 */}
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>메뉴 관리</CardTitle>
              <CardDescription>메뉴 추가/수정/삭제 및 CSV 가져오기/내보내기</CardDescription>

              {/* 도움말 */}
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>사용 가이드</AlertTitle>
                <AlertDescription className="text-xs space-y-1">
                  <p>• <strong>ON/OFF</strong>: 스위치로 메뉴 활성화/비활성화</p>
                  <p>• <strong>육류</strong>: 원가(원/kg), 1인분 중량(g), 수율(%)을 입력하면 자동 계산</p>
                  <p>• <strong>식사/음료/주류</strong>: 판매가와 원가를 직접 입력</p>
                  <p>• <strong>삭제</strong>: 🗑️ 아이콘 클릭</p>
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV 내보내기
                </Button>
                <Button variant="outline" onClick={() => document.getElementById("csv-upload")?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  CSV 가져오기
                </Button>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleImportCSV}
                />
              </div>
            </CardHeader>
            <CardContent>
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
                const categoryMenus = menus.filter((m) => m.category === cat)
                const isMeat = cat === "pork" || cat === "beef"

                return (
                  <div key={cat} className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{label}</h3>
                      <Button size="sm" variant="outline" onClick={() => handleAddMenu(cat as MenuCategory)}>
                        <Plus className="h-4 w-4 mr-1" />
                        추가
                      </Button>
                    </div>

                    {/* 헤더 레이블 */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b mb-2">
                      <div className="col-span-1">ON/OFF</div>
                      <div className="col-span-2">메뉴명</div>
                      <div className="col-span-2">판매가 (원)</div>
                      {isMeat ? (
                        <>
                          <div className="col-span-2">원가 (원/kg)</div>
                          <div className="col-span-2">중량 (g)</div>
                          <div className="col-span-2">수율 (%)</div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-2">원가 (원)</div>
                          <div className="col-span-4"></div>
                        </>
                      )}
                      <div className="col-span-1">삭제</div>
                    </div>

                    <div className="space-y-2">
                      {categoryMenus.map((menu) => (
                        <div key={menu.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg items-center">
                          <div className="col-span-1">
                            <Switch
                              checked={menu.isActive}
                              onCheckedChange={(val) => handleMenuChange(menu.id, "isActive", val)}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              value={menu.name}
                              onChange={(e) => handleMenuChange(menu.id, "name", e.target.value)}
                              placeholder="이름"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={menu.pricePerPortion}
                              onChange={(e) => handleMenuChange(menu.id, "pricePerPortion", parseFloat(e.target.value) || 0)}
                              placeholder="판매가"
                            />
                          </div>
                          {isMeat ? (
                            <>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  value={menu.meatCostPerKg || 0}
                                  onChange={(e) => handleMenuChange(menu.id, "meatCostPerKg", parseFloat(e.target.value) || 0)}
                                  placeholder="11500"
                                />
                              </div>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  value={menu.portionGrams || 0}
                                  onChange={(e) => handleMenuChange(menu.id, "portionGrams", parseFloat(e.target.value) || 0)}
                                  placeholder="200"
                                />
                              </div>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  value={(menu.yieldRate || 1) * 100}
                                  onChange={(e) => handleMenuChange(menu.id, "yieldRate", (parseFloat(e.target.value) || 100) / 100)}
                                  placeholder="95"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  value={menu.directCostPerUnit}
                                  onChange={(e) => handleMenuChange(menu.id, "directCostPerUnit", parseFloat(e.target.value) || 0)}
                                  placeholder="원가"
                                />
                              </div>
                              <div className="col-span-4 text-xs text-muted-foreground">
                                {menu.notes}
                              </div>
                            </>
                          )}
                          <div className="col-span-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteMenu(menu.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 판매 믹스 탭 */}
        <TabsContent value="mix">
          <Card>
            <CardHeader>
              <CardTitle>판매 믹스 설정</CardTitle>
              <CardDescription>각 메뉴의 판매 비중 설정 (합계: {mixTotal.toFixed(1)}%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeMenus.map((menu) => (
                  <div key={menu.id} className="space-y-2">
                    <Label htmlFor={`mix-${menu.id}`}>
                      {menu.name} ({CATEGORY_LABELS[menu.category]})
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`mix-${menu.id}`}
                        type="number"
                        value={menuMix[menu.id] || 0}
                        onChange={(e) => handleMixChange(menu.id, parseFloat(e.target.value) || 0)}
                        step="0.1"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 시뮬레이션 탭 */}
        <TabsContent value="simulation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>할인 시뮬레이션</CardTitle>
                <CardDescription>육류 할인 효과 분석</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>육류 인분당 할인액 (원)</Label>
                  <Input
                    type="number"
                    value={discountPerPortion}
                    onChange={(e) => setDiscountPerPortion(parseFloat(e.target.value) || 0)}
                  />
                </div>
                {discountPerPortion > 0 && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">육류 총 인분수:</span>
                      <span className="font-medium">{discountSimulation.totalMeatPortions.toFixed(2)}인분</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">매출감소액:</span>
                      <span className="font-medium text-red-600">{fmtWon(discountSimulation.discountAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">할인 후 남는 돈:</span>
                      <span className="font-medium">{fmtWon(discountSimulation.profitNew)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">할인 후 남는 비율:</span>
                      <span className="font-medium">{fmtPct(discountSimulation.profitMarginNew)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">필요 추가객수:</span>
                      <span className="font-bold text-orange-600">+{fmtPct(discountSimulation.liftNeeded)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>월 목표 설정</CardTitle>
                <CardDescription>목표 매출 및 팀수</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>목표 월매출 (원)</Label>
                  <Input
                    type="number"
                    value={targetMonthlyRevenue}
                    onChange={(e) => setTargetMonthlyRevenue(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>월 총 팀수</Label>
                  <Input
                    type="number"
                    value={monthlyTeams}
                    onChange={(e) => setMonthlyTeams(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2 text-sm pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">필요 객단가:</span>
                    <span className="font-medium">{fmtWon(monthlyTeams > 0 ? targetMonthlyRevenue / monthlyTeams : 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">기준 객단가 (10만원 믹스 기준):</span>
                    <span className="font-medium">{fmtWon(100000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 결과 탭 */}
        <TabsContent value="result">
          <div className="space-y-6">
            {/* 요약 카드 */}
            <Card>
              <CardHeader>
                <CardTitle>기준 요약 (매출 10만원 기준)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">총 매출</p>
                    <p className="text-2xl font-bold">{fmtWon(simulation.totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">총 원가</p>
                    <p className="text-2xl font-bold">{fmtWon(simulation.totalCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">남는 돈</p>
                    <p className="text-2xl font-bold text-green-600">{fmtWon(simulation.totalProfit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">남는 비율</p>
                    <p className="text-2xl font-bold">{fmtPct(simulation.profitMargin)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 차트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>매출 구성</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => fmtWon(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>메뉴별 수익성 (Top 10)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={profitData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="남는돈" fill="#82ca9d" />
                      <Bar dataKey="원가" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* 메뉴별 상세 */}
            <Card>
              <CardHeader>
                <CardTitle>메뉴별 상세</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">메뉴</th>
                        <th className="text-left py-2">분류</th>
                        <th className="text-right py-2">인분수</th>
                        <th className="text-right py-2">매출</th>
                        <th className="text-right py-2">원가</th>
                        <th className="text-right py-2">남는 돈</th>
                        <th className="text-right py-2">남는 비율</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulation.menuBreakdown
                        .sort((a, b) => b.revenue - a.revenue)
                        .map((item) => {
                          const menu = menus.find((m) => m.id === item.menuId)
                          const margin = item.revenue > 0 ? item.profit / item.revenue : 0
                          return (
                            <tr key={item.menuId} className="border-b hover:bg-muted/50">
                              <td className="py-2">{item.name}</td>
                              <td className="py-2">{menu ? CATEGORY_LABELS[menu.category] : "-"}</td>
                              <td className="text-right py-2">{item.portions.toFixed(2)}</td>
                              <td className="text-right py-2">{fmtWon(item.revenue)}</td>
                              <td className="text-right py-2">{fmtWon(item.cost)}</td>
                              <td className="text-right py-2">{fmtWon(item.profit)}</td>
                              <td className="text-right py-2">{fmtPct(margin)}</td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
