"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D MZ 신조어 능력고사"
            description="화려한 3D 퀴즈 쇼장에서 펼쳐지는 신조어 레벨 테스트! 트렌드 능력치를 시각적으로 확인하고 티어를 획득하세요."
            icon="🧢"
            primaryColor="#bef264" // Lime-300
            secondaryColor="#3f6212" // Lime-900
            appSlug="mz-slang-quiz"
        >
            <div className="space-y-6 text-center">
                <div className="p-6 bg-black/30 rounded-2xl border border-lime-500/30">
                    <div className="text-lime-400 text-xl font-bold mb-2">SEASON {new Date().getFullYear()}</div>
                    <p className="text-slate-300">최신 유행어, 얼마나 알고 계신가요?</p>
                </div>
                <Button className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold py-6 rounded-xl text-lg">
                    테스트 시작하기
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
