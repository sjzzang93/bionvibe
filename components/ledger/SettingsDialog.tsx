"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Settings } from "@/lib/ledger/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: Settings
  onSave: (settings: Settings) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
}: SettingsDialogProps) {
  const [draft, setDraft] = useState<Settings>(settings)

  const handleSave = () => {
    onSave(draft)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setDraft(settings) // 원래 값으로 복원
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>
            원가, 원가율, 월 비용을 설정합니다
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="cost" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cost">원가 설정</TabsTrigger>
            <TabsTrigger value="expense">월 비용</TabsTrigger>
          </TabsList>

          <TabsContent value="cost" className="space-y-6 mt-4">
            {/* 육류 원가 */}
            <div className="space-y-4">
              <h3 className="font-semibold">육류 원가 (원/kg)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pork-cost">돼지고기 (원/kg)</Label>
                  <Input
                    id="pork-cost"
                    type="number"
                    value={draft.porkCostPerKg}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        porkCostPerKg: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    1g당: ₩{(draft.porkCostPerKg / 1000).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beef-cost">소고기 (원/kg)</Label>
                  <Input
                    id="beef-cost"
                    type="number"
                    value={draft.beefCostPerKg}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        beefCostPerKg: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    1g당: ₩{(draft.beefCostPerKg / 1000).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* 원가율 */}
            <div className="space-y-4">
              <h3 className="font-semibold">카테고리별 원가율 (%)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meal-rate">식사류</Label>
                  <Input
                    id="meal-rate"
                    type="number"
                    value={(draft.mealCostRate * 100).toFixed(0)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        mealCostRate: parseInt(e.target.value) / 100 || 0,
                      })
                    }
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saladbar-rate">샐러드바</Label>
                  <Input
                    id="saladbar-rate"
                    type="number"
                    value={(draft.saladbarCostRate * 100).toFixed(0)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        saladbarCostRate: parseInt(e.target.value) / 100 || 0,
                      })
                    }
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alcohol-rate">주류(소주/맥주)</Label>
                  <Input
                    id="alcohol-rate"
                    type="number"
                    value={(draft.alcoholCostRate * 100).toFixed(0)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        alcoholCostRate: parseInt(e.target.value) / 100 || 0,
                      })
                    }
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drink-rate">음료</Label>
                  <Input
                    id="drink-rate"
                    type="number"
                    value={(draft.drinkCostRate * 100).toFixed(0)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        drinkCostRate: parseInt(e.target.value) / 100 || 0,
                      })
                    }
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expense" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">월 비용 (원)</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fixed">고정경비 (월)</Label>
                  <Input
                    id="fixed"
                    type="number"
                    value={draft.monthlyFixed}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        monthlyFixed: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    일할(30일): ₩
                    {Math.round(draft.monthlyFixed / 30).toLocaleString(
                      "ko-KR"
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variable">변동경비 (월)</Label>
                  <Input
                    id="variable"
                    type="number"
                    value={draft.monthlyVariable}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        monthlyVariable: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    일할(30일): ₩
                    {Math.round(draft.monthlyVariable / 30).toLocaleString(
                      "ko-KR"
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan">대출상환 (월)</Label>
                  <Input
                    id="loan"
                    type="number"
                    value={draft.monthlyLoan}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        monthlyLoan: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    일할(30일): ₩
                    {Math.round(draft.monthlyLoan / 30).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
