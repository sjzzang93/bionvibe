"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 편의점 꿀조합"
            description="실패 없는 편의점 레시피를 3D 랜덤 룰렛으로 추천! 조리 과정을 시뮬레이션하고 맛있는 꿀조합을 즐겨보세요."
            icon="🍜"
            primaryColor="#f43f5e" // Rose-500
            secondaryColor="#ffe4e6" // Rose-100
            appSlug="cstore-mix-3d"
        >
            <div className="space-y-6 text-center">
                <div className="p-8 bg-white/5 rounded-full border-4 border-dashed border-rose-500/30 w-48 h-48 mx-auto flex items-center justify-center">
                    <span className="text-4xl animate-pulse">❓</span>
                </div>
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-6 rounded-xl text-lg font-bold">
                    랜덤 룰렛 돌리기
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
