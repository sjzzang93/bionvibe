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
      <CardHeader className="pb-3 pt-4 px-4 sm:pb-4 sm:pt-4 sm:px-6">
        <CardTitle className="text-xl sm:text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="space-y-2 sm:space-y-3">
          {categoryItems.map((item) => {
            const qty = getLineQty(item.id)
            const revenue = item.price * qty

            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 border-muted bg-white ${
                  qty === 0 ? "print:hidden" : ""
                }`}
              >
                {/* 상품명과 가격 */}
                <div className="mb-4 pb-3 border-b border-muted">
                  <div className="font-bold text-lg leading-tight mb-1">{item.name}</div>
                  <div className="text-base text-muted-foreground font-medium">
                    {fmtWon(item.price)}
                    {item.gramsPerPortion && ` / ${item.gramsPerPortion}g`}
                  </div>
                </div>

                {/* 수량 조절 */}
                <div className="space-y-3">
                  {/* 수량 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700 w-16">수량</span>
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 sm:h-10 sm:w-10 print:hidden p-0 active:scale-95 transition-transform flex-shrink-0"
                        onClick={() => decrement(item.id)}
                        disabled={qty === 0}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>

                      <Input
                        type="number"
                        value={qty || ""}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          updateQty(item.id, Math.max(0, val))
                        }}
                        className="w-24 h-12 sm:w-20 sm:h-10 text-center text-2xl font-bold border-2 !px-1 !py-0"
                        style={{ lineHeight: '1.2' }}
                        min="0"
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 sm:h-10 sm:w-10 print:hidden p-0 active:scale-95 transition-transform flex-shrink-0"
                        onClick={() => increment(item.id)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* 그램수 (육류만) */}
                  {item.gramsPerPortion && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700 w-16">그램수</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={getLineGrams(item.id, item.gramsPerPortion)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            updateGrams(item.id, Math.max(0, val))
                          }}
                          className="w-24 h-12 sm:w-20 sm:h-10 text-center text-xl font-bold border-2 !px-1 !py-0"
                          style={{ lineHeight: '1.2' }}
                          min="0"
                        />
                        <span className="text-lg font-medium text-gray-600">g</span>
                      </div>
                    </div>
                  )}

                  {/* 매출액 */}
                  <div className="flex items-center justify-between pt-2 border-t border-muted">
                    <span className="text-base font-bold text-gray-700">매출액</span>
                    <div className="text-2xl font-bold text-blue-600">
                      {qty > 0 ? fmtWon(revenue) : "-"}
                    </div>
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
