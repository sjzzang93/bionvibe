"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 세계 수도 퀴즈"
            description="3D 지구본을 돌리며 떠나는 세계 여행! 나라별 수도와 국기를 맞추고 지구 정복 뱃지를 모으세요."
            icon="🌏"
            primaryColor="#10b981" // Emerald-500
            secondaryColor="#d1fae5" // Emerald-100
            appSlug="world-capital-quiz"
        >
            <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-300 text-sm mb-2">
                    <span>난이도 선택</span>
                    <span>나의 점수: 0</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {['쉬움', '보통', '어려움'].map(lvl => (
                        <button key={lvl} className="py-3 rounded-lg bg-emerald-900/40 hover:bg-emerald-500/40 border border-emerald-500/20 text-emerald-100">
                            {lvl}
                        </button>
                    ))}
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl text-lg font-bold mt-4">
                    여행 시작하기 ✈️
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
