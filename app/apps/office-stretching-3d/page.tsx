"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 오피스 스트레칭"
            description="3D 아바타가 알려주는 사무실 3분 힐링 스트레칭. 목, 어깨, 허리 통증을 완화하는 동작을 입체적으로 따라 하며 건강을 챙기세요."
            icon="🧘‍♀️"
            primaryColor="#3b82f6" // Blue-500
            secondaryColor="#dbeafe" // Blue-100
            appSlug="office-stretching-3d"
        >
            <div className="space-y-4">
                <label className="text-slate-300 block mb-2">어디가 불편하신가요?</label>
                <div className="grid grid-cols-2 gap-3">
                    {['목/어깨', '허리', '손목', '눈'].map(part => (
                        <button key={part} className="p-4 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 transition-all font-medium">
                            {part}
                        </button>
                    ))}
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-lg font-bold mt-4">
                    3D 가이드 시작
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
