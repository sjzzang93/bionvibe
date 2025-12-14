"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 퍼스널 향수 찾기"
            description="취향과 분위기를 분석하여 당신에게 딱 맞는 향수를 3D 보틀로 추천해 드립니다. 시각적으로 느껴지는 향기의 노트를 경험해 보세요."
            icon="✨"
            primaryColor="#a855f7" // Purple-500
            secondaryColor="#e9d5ff" // Purple-100
            appSlug="personal-perfume"
        >
            <div className="space-y-4">
                <p className="text-slate-300 mb-4">어떤 분위기를 선호하시나요?</p>
                <div className="grid grid-cols-2 gap-3">
                    {['상쾌한', '달콤한', '우아한', '시크한'].map(style => (
                        <button key={style} className="p-3 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 transition-all text-sm">
                            {style}
                        </button>
                    ))}
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl text-lg font-bold mt-4">
                    나만의 향수 찾기
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
