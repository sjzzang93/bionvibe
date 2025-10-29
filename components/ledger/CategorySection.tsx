"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import type { MenuItem, DayEntryLine, Category } from "@/lib/ledger/types"

interface CategorySectionProps {
  title: string
  category: Category
  items: MenuItem[]
  lines: DayEntryLine[]
  onChange: (lines: DayEntryLine[]) => void
}

const fmtWon = (n: number) => `₩${Math.round(n).toLocaleString("ko-KR")}`

export function CategorySection({
  title,
  category,
  items,
  lines,
  onChange,
}: CategorySectionProps) {
  const categoryItems = items.filter(
    (item) => item.category === category && item.enabled
  )

  if (categoryItems.length === 0) return null

  const getLineQty = (itemId: string): number => {
    const line = lines.find((l) => l.itemId === itemId)
    return line?.qty ?? 0
  }

  const getLineGrams = (itemId: string, defaultGrams?: number): number => {
    const line = lines.find((l) => l.itemId === itemId)
    return line?.gramsPerPortion ?? defaultGrams ?? 0
  }

  const updateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      // 수량 0이면 제거
      onChange(lines.filter((l) => l.itemId !== itemId))
    } else {
      const existing = lines.find((l) => l.itemId === itemId)
      if (existing) {
        onChange(
          lines.map((l) => (l.itemId === itemId ? { ...l, qty } : l))
        )
      } else {
        onChange([...lines, { itemId, qty }])
      }
    }
  }

  const updateGrams = (itemId: string, grams: number) => {
    const existing = lines.find((l) => l.itemId === itemId)
    if (existing) {
      onChange(
        lines.map((l) =>
          l.itemId === itemId ? { ...l, gramsPerPortion: grams } : l
        )
      )
    } else {
      // 수량이 없으면 수량 1로 설정하면서 그램수 설정
      onChange([...lines, { itemId, qty: 1, gramsPerPortion: grams }])
    }
  }

  const increment = (itemId: string) => {
    const current = getLineQty(itemId)
    updateQty(itemId, current + 1)
  }

  const decrement = (itemId: string) => {
    const current = getLineQty(itemId)
    if (current > 0) {
      updateQty(itemId, current - 1)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4 sm:pb-6 sm:pt-6 sm:px-6">
        <CardTitle className="text-lg sm:text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="space-y-2 sm:space-y-3">
          {categoryItems.map((item) => {
            const qty = getLineQty(item.id)
            const revenue = item.price * qty

            return (
              <div
                key={item.id}
                className={`p-3 sm:p-4 rounded-lg hover:bg-muted/50 border border-muted ${
                  qty === 0 ? "print:hidden" : ""
                }`}
              >
                {/* 상품명과 가격 */}
                <div className="mb-3">
                  <div className="font-medium text-base sm:text-lg">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {fmtWon(item.price)}
                    {item.gramsPerPortion && ` / ${item.gramsPerPortion}g`}
                  </div>
                </div>

                {/* 수량 조절 (모바일 터치 최적화) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-11 w-11 sm:h-10 sm:w-10 print:hidden touch-manipulation p-0"
                      onClick={() => decrement(item.id)}
                      disabled={qty === 0}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={qty || ""}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          updateQty(item.id, Math.max(0, val))
                        }}
                        className="w-20 h-11 sm:h-10 text-center text-lg sm:text-base print:border-none touch-manipulation"
                        min="0"
                      />
                      <span className="text-sm text-muted-foreground hidden print:inline">개</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-11 w-11 sm:h-10 sm:w-10 print:hidden touch-manipulation p-0"
                      onClick={() => increment(item.id)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>

                    {/* 육류는 그램수 조정 가능 */}
                    {item.gramsPerPortion && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-muted/30 rounded print:bg-transparent print:px-0">
                        <Input
                          type="number"
                          value={getLineGrams(item.id, item.gramsPerPortion)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            updateGrams(item.id, Math.max(0, val))
                          }}
                          className="w-16 h-9 sm:w-14 sm:h-8 text-center text-base sm:text-sm print:border-none print:w-auto touch-manipulation"
                          min="0"
                        />
                        <span className="text-sm text-muted-foreground">g</span>
                      </div>
                    )}
                  </div>

                  {/* 매출액 */}
                  <div className="font-bold text-xl sm:text-lg sm:ml-auto text-blue-600">
                    {qty > 0 ? fmtWon(revenue) : "-"}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
