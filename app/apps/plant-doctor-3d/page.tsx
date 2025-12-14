"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 반려식물 처방전"
            description="내 식물의 상태를 3D 모델로 진단하고 맞춤형 관리법을 처방받으세요. 잎의 색 변화와 성장 과정을 시각적으로 관리할 수 있습니다."
            icon="🌿"
            primaryColor="#22c55e" // Green-500
            secondaryColor="#dcfce7" // Green-100
            appSlug="plant-doctor-3d"
        >
            <div className="space-y-4">
                <div className="border border-white/10 bg-white/5 rounded-xl p-4">
                    <h3 className="text-green-400 font-bold mb-2">식물 증상 체크</h3>
                    <div className="space-y-2 text-sm text-slate-300">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded bg-white/10 border-white/20 text-green-500" />
                            잎이 노랗게 변했어요
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded bg-white/10 border-white/20 text-green-500" />
                            잎이 시들고 쳐져요
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded bg-white/10 border-white/20 text-green-500" />
                            벌레가 생겼어요
                        </label>
                    </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl text-lg font-bold">
                    처방전 받기
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
