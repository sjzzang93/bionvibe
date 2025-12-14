'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 드림캐처 만들기"
            description="나만의 드림캐처를 만들어 악몽을 걸러내고 좋은 꿈만 꾸세요."
            icon="🕸️"
            primaryColor="#a8d8ea"
            secondaryColor="#aa96da"
            appSlug="dream-catcher-3d"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <p className="text-white text-center mb-4">드림캐처의 재료를 선택하세요</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-white">🪶 깃털 추가</button>
                        <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-white">💎 비즈 장식</button>
                        <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-white">🧵 그물 패턴</button>
                        <button className="p-3 bg-indigo-500 rounded-xl hover:bg-indigo-600 transition-colors text-white font-bold">완성하기</button>
                    </div>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
