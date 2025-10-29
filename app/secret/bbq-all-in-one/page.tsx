"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BreakEvenBasic from "./components/BreakEvenBasic"
import BreakEvenAdvanced from "./components/BreakEvenAdvanced"
import PricingSimulator from "./components/PricingSimulator"
import BBQSimulator from "./components/BBQSimulator"

export default function BBQAllInOnePage() {
  const [mainTab, setMainTab] = useState("pricing")

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">🍖 BBQ 식당 올인원 계산기</h1>
        <p className="text-muted-foreground text-lg">
          가격 시뮬레이터와 손익분기 계산을 한 곳에서
        </p>
      </div>

      {/* 메인 탭 */}
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pricing" className="text-base">
            📊 가격/메뉴 시뮬레이터
          </TabsTrigger>
          <TabsTrigger value="breakeven" className="text-base">
            📈 손익분기 계산
          </TabsTrigger>
        </TabsList>

        {/* 가격/메뉴 시뮬레이터 탭 */}
        <TabsContent value="pricing">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="basic">기본 가격 시뮬레이터</TabsTrigger>
              <TabsTrigger value="advanced">고급 시뮬레이터</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <PricingSimulator />
            </TabsContent>

            <TabsContent value="advanced">
              <BBQSimulator />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* 손익분기 계산 탭 */}
        <TabsContent value="breakeven">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="basic">기본 손익분기</TabsTrigger>
              <TabsTrigger value="advanced">고급 손익분기</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BreakEvenBasic />
            </TabsContent>

            <TabsContent value="advanced">
              <BreakEvenAdvanced />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
