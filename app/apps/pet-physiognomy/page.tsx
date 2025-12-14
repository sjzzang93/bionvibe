"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 반려동물 관상"
            description="3D 스캐닝 효과로 분석하는 우리 멍냥이의 숨겨진 관상! 얼굴형과 이목구비 분석을 통해 반려동물의 성격과 운세를 재미있게 알아보세요."
            icon="🐕"
            primaryColor="#f97316" // Orange-500
            secondaryColor="#ffedd5" // Orange-100
            appSlug="pet-physiognomy"
        >
            <div className="space-y-4">
                <div className="aspect-video bg-black/20 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-black/30 transition-colors">
                    <span className="text-4xl mb-2">📸</span>
                    <span className="text-slate-400">반려동물 사진 업로드</span>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-xl text-lg font-bold">
                    관상 분석하기
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
