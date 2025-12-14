"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function Page() {
    const [date, setDate] = useState("");

    return (
        <ThreeAppTemplate
            title="3D 탄생화 & 탄생석"
            description="생일에 담긴 꽃과 보석의 의미를 아름다운 3D 그래픽으로 확인하세요. 당신만의 꽃이 피어나는 순간을 입체적으로 경험해 보세요."
            icon="💐"
            primaryColor="#ec4899" // Pink-500
            secondaryColor="#fbcfe8" // Pink-200
            appSlug="birth-flower-stone"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-2">생년월일 입력</label>
                    <input
                        type="date"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 rounded-xl text-lg font-bold">
                    나의 탄생화 3D로 보기
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
