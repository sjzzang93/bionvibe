"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 퍼스널 컬러 진단"
            description="입체적인 조명 시뮬레이션으로 찾는 나만의 퍼스널 컬러. 3D 드레이핑 효과로 웜톤/쿨톤을 정확하게 진단하고 베스트 컬러를 찾아보세요."
            icon="🌈"
            primaryColor="#06b6d4" // Cyan-500
            secondaryColor="#cffafe" // Cyan-100
            appSlug="personal-color-3d"
        >
            <div className="space-y-4">
                <div className="aspect-[3/4] bg-black/20 rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-cyan-500/20 mix-blend-overlay"></div>
                    <span className="text-4xl mb-2 z-10">📷</span>
                    <span className="text-slate-400 z-10">카메라 켜기</span>
                </div>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 rounded-xl text-lg font-bold">
                    진단 시작
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
