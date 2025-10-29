"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Info, TrendingUp, Download, Upload, Trash2 } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts"

// 유틸리티 함수
const fmtWon = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`
const fmtPct = (r: number) => `${r.toFixed(1)}%`
const fmtTable = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}팀`

interface MenuItem {
  id: string
  name: string
  category: "pork" | "beef" | "meal" | "beverage" | "alcohol"
  pricePerPortion: number
  costPerPortion: number // 1인분당 원가
  isActive: boolean
  salesMix: number // 판매 비중 (%)
}

const DEFAULT_MENUS: MenuItem[] = [
  // 돼지고기
  { id: "p1", name: "삼겹살", category: "pork", pricePerPortion: 15000, costPerPortion: 7500, isActive: true, salesMix: 30 },
  { id: "p2", name: "목살", category: "pork", pricePerPortion: 15000, costPerPortion: 7200, isActive: true, salesMix: 20 },

  // 소고기
  { id: "b1", name: "한우 등심", category: "beef", pricePerPortion: 25000, costPerPortion: 15000, isActive: true, salesMix: 15 },

  // 식사류
  { id: "m1", name: "된장찌개", category: "meal", pricePerPortion: 8000, costPerPortion: 2400, isActive: true, salesMix: 10 },
  { id: "m2", name: "냉면", category: "meal", pricePerPortion: 8000, costPerPortion: 2400, isActive: true, salesMix: 10 },

  // 음료
  { id: "d1", name: "콜라", category: "beverage", pricePerPortion: 2000, costPerPortion: 700, isActive: true, salesMix: 8 },

  // 주류
  { id: "a1", name: "참이슬", category: "alcohol", pricePerPortion: 5000, costPerPortion: 1700, isActive: true, salesMix: 7 },
]

export default function BreakEvenAdvanced() {
  const [mounted, setMounted] = useState(false)
  const [menus, setMenus] = useState<MenuItem[]>(DEFAULT_MENUS)

  // 고정비용
  const [rentMonth, setRentMonth] = useState(5000000) // 월 임대료
  const [laborMonth, setLaborMonth] = useState(5000000) // 월 인건비
  const [utilityMonth, setUtilityMonth] = useState(2000000) // 월 공과금
  const [debtMonth, setDebtMonth] = useState(0) // 월 부채 상환금

  // 목표
  const [targetProfitMonth, setTargetProfitMonth] = useState(3000000) // 월 목표 이익
  const [avgTablesPerDay, setAvgTablesPerDay] = useState(20) // 일 평균 테이블 수

  // localStorage 연동
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("breakEvenAdvancedAIOData")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setMenus(data.menus || DEFAULT_MENUS)
        setRentMonth(data.rentMonth ?? 5000000)
        setLaborMonth(data.laborMonth ?? 5000000)
        setUtilityMonth(data.utilityMonth ?? 2000000)
        setDebtMonth(data.debtMonth ?? 0)
        setTargetProfitMonth(data.targetProfitMonth ?? 3000000)
        setAvgTablesPerDay(data.avgTablesPerDay ?? 20)
      } catch (e) {
        console.error("Failed to load data", e)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const data = { menus, rentMonth, laborMonth, utilityMonth, debtMonth, targetProfitMonth, avgTablesPerDay }
    localStorage.setItem("breakEvenAdvancedAIOData", JSON.stringify(data))
  }, [mounted, menus, rentMonth, laborMonth, utilityMonth, debtMonth, targetProfitMonth, avgTablesPerDay])

  // 계산
  const result = useMemo(() => {
    const activeMenus = menus.filter((m) => m.isActive)
    const totalMix = activeMenus.reduce((sum, m) => sum + m.salesMix, 0)

    // 테이블당 평균 단가 및 원가
    let avgPrice = 0
    let avgCost = 0

    if (totalMix > 0) {
      activeMenus.forEach((m) => {
        const weight = m.salesMix / totalMix
        avgPrice += m.pricePerPortion * weight
        avgCost += m.costPerPortion * weight
      })
    }

    const avgGpPerTable = avgPrice - avgCost // 테이블당 평균 남는 돈
    const varCostRate = avgPrice > 0 ? (avgCost / avgPrice) * 100 : 0 // 변동비율

    // 고정비
    const fixedMonth = rentMonth + laborMonth + utilityMonth + debtMonth
    const fixedDay = fixedMonth / 30

    // 목표 이익
    const targetProfitDay = targetProfitMonth / 30

    // 손익분기점
    const bepTables = avgGpPerTable > 0 ? fixedDay / avgGpPerTable : NaN
    const bepRevenue = bepTables * avgPrice

    // 목표 이익 달성 필요 테이블
    const needTables = avgGpPerTable > 0 ? (fixedDay + targetProfitDay) / avgGpPerTable : NaN
    const needRevenue = needTables * avgPrice

    // 현재 예상 실적
    const currentRevenue = avgTablesPerDay * avgPrice
    const currentCost = avgTablesPerDay * avgCost
    const currentGp = currentRevenue - currentCost
    const currentProfit = currentGp - fixedDay

    // 차트 데이터 (테이블 수별 이익)
    const chartData = []
    for (let tables = 0; tables <= 50; tables += 5) {
      const revenue = tables * avgPrice
      const cost = tables * avgCost
      const gp = revenue - cost
      const profit = gp - fixedDay
      chartData.push({
        tables,
        매출: Math.round(revenue / 10000), // 만원 단위
        원가: Math.round(cost / 10000),
        고정비: Math.round(fixedDay / 10000),
        이익: Math.round(profit / 10000),
      })
    }

    return {
      avgPrice,
      avgCost,
      avgGpPerTable,
      varCostRate,
      fixedMonth,
      fixedDay,
      targetProfitDay,
      bepTables,
      bepRevenue,
      needTables,
      needRevenue,
      currentRevenue,
      currentCost,
      currentGp,
      currentProfit,
      chartData,
    }
  }, [menus, rentMonth, laborMonth, utilityMonth, debtMonth, targetProfitMonth, avgTablesPerDay])

  // CSV 익스포트
  const handleExport = () => {
    const header = "메뉴명,카테고리,판매가,원가,판매비중(%),활성화\n"
    const rows = menus
      .map(
        (m) =>
          `${m.name},${m.category},${m.pricePerPortion},${m.costPerPortion},${m.salesMix},${m.isActive ? "O" : "X"}`
      )
      .join("\n")
    const csv = header + rows
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "손익분기_메뉴.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // CSV 임포트
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split("\n").filter((l) => l.trim())
        const imported: MenuItem[] = []
        for (let i = 1; i < lines.length; i++) {
          const [name, category, price, cost, mix, active] = lines[i].split(",")
          if (name && category && price && cost) {
            imported.push({
              id: `import-${i}`,
              name: name.trim(),
              category: category.trim() as any,
              pricePerPortion: parseFloat(price) || 0,
              costPerPortion: parseFloat(cost) || 0,
              salesMix: parseFloat(mix) || 0,
              isActive: active?.trim() === "O",
            })
          }
        }
        if (imported.length > 0) {
          setMenus(imported)
          alert(`${imported.length}개 메뉴를 불러왔습니다.`)
        }
      } catch (err) {
        alert("CSV 파일 형식이 올바르지 않습니다.")
      }
    }
    reader.readAsText(file, "UTF-8")
  }

  // 메뉴 추가
  const addMenu = (category: MenuItem["category"]) => {
    const newMenu: MenuItem = {
      id: `menu-${Date.now()}`,
      name: "",
      category,
      pricePerPortion: 0,
      costPerPortion: 0,
      isActive: true,
      salesMix: 0,
    }
    setMenus([...menus, newMenu])
  }

  // 메뉴 삭제
  const deleteMenu = (id: string) => {
    setMenus(menus.filter((m) => m.id !== id))
  }

  // 메뉴 수정
  const updateMenu = (id: string, updates: Partial<MenuItem>) => {
    setMenus(menus.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  const categoryNames = {
    pork: "돼지고기",
    beef: "소고기",
    meal: "식사류",
    beverage: "음료",
    alcohol: "주류",
  }

  return (
    <div className="space-y-6">
      {/* CSV 임포트/익스포트 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>데이터 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              CSV 내보내기
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("csv-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              CSV 불러오기
            </Button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* 메뉴 관리 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>메뉴 관리</CardTitle>
          <CardDescription>각 메뉴의 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(categoryNames).map(([category, label]) => {
            const categoryMenus = menus.filter((m) => m.category === category)
            return (
              <div key={category} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <Button
                    size="sm"
                    onClick={() => addMenu(category as MenuItem["category"])}
                    variant="outline"
                  >
                    + 추가
                  </Button>
                </div>

                {/* 컬럼 헤더 */}
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b mb-2">
                  <div className="col-span-1">ON/OFF</div>
                  <div className="col-span-2">메뉴명</div>
                  <div className="col-span-2">판매가 (원)</div>
                  <div className="col-span-2">원가 (원)</div>
                  <div className="col-span-2">판매비중 (%)</div>
                  <div className="col-span-2">남는 돈</div>
                  <div className="col-span-1">삭제</div>
                </div>

                {categoryMenus.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">메뉴가 없습니다. 추가 버튼을 눌러주세요.</p>
                ) : (
                  categoryMenus.map((menu) => {
                    const gp = menu.pricePerPortion - menu.costPerPortion
                    const gpRate = menu.pricePerPortion > 0 ? (gp / menu.pricePerPortion) * 100 : 0
                    return (
                      <div key={menu.id} className="grid grid-cols-12 gap-2 items-center mb-2">
                        <div className="col-span-1">
                          <Switch
                            checked={menu.isActive}
                            onCheckedChange={(checked) => updateMenu(menu.id, { isActive: checked })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={menu.name}
                            onChange={(e) => updateMenu(menu.id, { name: e.target.value })}
                            placeholder="메뉴명"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={menu.pricePerPortion}
                            onChange={(e) =>
                              updateMenu(menu.id, { pricePerPortion: parseFloat(e.target.value) || 0 })
                            }
                            placeholder="15000"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={menu.costPerPortion}
                            onChange={(e) =>
                              updateMenu(menu.id, { costPerPortion: parseFloat(e.target.value) || 0 })
                            }
                            placeholder="7500"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={menu.salesMix}
                            onChange={(e) => updateMenu(menu.id, { salesMix: parseFloat(e.target.value) || 0 })}
                            placeholder="30"
                            step="0.1"
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm">
                            {fmtWon(gp)} <span className="text-xs text-muted-foreground">({fmtPct(gpRate)})</span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <Button size="sm" variant="ghost" onClick={() => deleteMenu(menu.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* 고정비 입력 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>고정비 입력 (월간)</CardTitle>
          <CardDescription>매달 고정으로 나가는 비용들</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="rentMonth">월 임대료 (원)</Label>
              <Input
                id="rentMonth"
                type="number"
                value={rentMonth}
                onChange={(e) => setRentMonth(parseFloat(e.target.value) || 0)}
                placeholder="5000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="laborMonth">월 인건비 (원)</Label>
              <Input
                id="laborMonth"
                type="number"
                value={laborMonth}
                onChange={(e) => setLaborMonth(parseFloat(e.target.value) || 0)}
                placeholder="5000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilityMonth">월 공과금 (원)</Label>
              <Input
                id="utilityMonth"
                type="number"
                value={utilityMonth}
                onChange={(e) => setUtilityMonth(parseFloat(e.target.value) || 0)}
                placeholder="2000000"
              />
              <p className="text-xs text-muted-foreground">
                전기세, 수도세, 가스비 등
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="debtMonth">월 대출 상환금 (원)</Label>
              <Input
                id="debtMonth"
                type="number"
                value={debtMonth}
                onChange={(e) => setDebtMonth(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                매달 갚아야 하는 대출금
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>월 고정비 합계:</strong> {fmtWon(result.fixedMonth)} → 하루 약 {fmtWon(result.fixedDay)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 목표 설정 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>목표 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="targetProfitMonth">월 목표 이익 (원)</Label>
              <Input
                id="targetProfitMonth"
                type="number"
                value={targetProfitMonth}
                onChange={(e) => setTargetProfitMonth(parseFloat(e.target.value) || 0)}
                placeholder="3000000"
              />
              <p className="text-xs text-muted-foreground">
                고정비 제외하고 실제로 남기고 싶은 이익 → 하루 약 {fmtWon(result.targetProfitDay)}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgTablesPerDay">일 평균 테이블 수 (참고용)</Label>
              <Input
                id="avgTablesPerDay"
                type="number"
                value={avgTablesPerDay}
                onChange={(e) => setAvgTablesPerDay(parseFloat(e.target.value) || 0)}
                placeholder="20"
              />
              <p className="text-xs text-muted-foreground">현재 예상 실적 계산용</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결과 요약 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>계산 결과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">테이블당 평균 단가</p>
              <p className="text-2xl font-bold text-blue-600">{fmtWon(result.avgPrice)}</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 mb-1">테이블당 평균 원가</p>
              <p className="text-2xl font-bold text-red-600">{fmtWon(result.avgCost)}</p>
              <p className="text-xs text-muted-foreground mt-1">원가율 {fmtPct(result.varCostRate)}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 mb-1">테이블당 남는 돈</p>
              <p className="text-2xl font-bold text-green-600">{fmtWon(result.avgGpPerTable)}</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-600 mb-1">하루 손익분기 테이블</p>
              <p className="text-2xl font-bold text-orange-600">{fmtTable(result.bepTables)}</p>
              <p className="text-xs text-muted-foreground mt-1">매출 {fmtWon(result.bepRevenue)}</p>
            </div>
          </div>

          {targetProfitMonth > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-semibold text-purple-600">목표 이익 달성 필요</p>
              </div>
              <p className="text-lg">
                <strong>하루 {fmtTable(result.needTables)}</strong> 필요 (매출 {fmtWon(result.needRevenue)})
              </p>
            </div>
          )}

          <div className="p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm font-semibold mb-2">현재 예상 실적 ({avgTablesPerDay}팀 기준)</p>
            <div className="space-y-1 text-sm">
              <p>• 매출: {fmtWon(result.currentRevenue)}</p>
              <p>• 원가: {fmtWon(result.currentCost)}</p>
              <p>• 남는 돈: {fmtWon(result.currentGp)}</p>
              <p>• 고정비: {fmtWon(result.fixedDay)}</p>
              <p className="font-bold text-base mt-2">
                • 최종 이익: {fmtWon(result.currentProfit)}{" "}
                {result.currentProfit >= 0 ? (
                  <span className="text-green-600">✓ 흑자</span>
                ) : (
                  <span className="text-red-600">✗ 적자</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>테이블 수별 손익 시뮬레이션</CardTitle>
          <CardDescription>하루 테이블 수에 따른 이익 변화 (단위: 만원)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={result.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tables" label={{ value: "테이블 수", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "금액 (만원)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="매출" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="원가" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="이익" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
