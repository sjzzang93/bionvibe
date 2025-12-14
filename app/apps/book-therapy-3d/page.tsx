"use client";

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 북 테라피"
            description="당신의 마음 상태에 맞는 책과 문장을 3D 서재에서 처방해 드립니다. 책장을 넘기는 듯한 평온한 몰입감을 느껴보세요."
            icon="📚"
            primaryColor="#8b5cf6" // Violet-500
            secondaryColor="#ede9fe" // Violet-100
            appSlug="book-therapy-3d"
        >
            <div className="space-y-4">
                <textarea
                    placeholder="요즘 어떤 고민이 있으신가요? (예: 일이 너무 힘들어요, 잠이 안 와요)"
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl text-lg font-bold">
                    책 처방받기
                </Button>
            </div>
        </ThreeAppTemplate>
    );
}
