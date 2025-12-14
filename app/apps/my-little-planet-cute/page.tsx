'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="마이 리틀 플래닛"
            description="작고 소중한 나만의 3D 행성. 나무를 심고 집을 지어 우주에서 하나뿐인 별을 꾸며보세요."
            icon="🌍"
            primaryColor="#84fab0"
            secondaryColor="#8fd3f4"
            appSlug="my-little-planet-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md text-center">
                    <div className="flex justify-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform">🌲</div>
                        <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform">💧</div>
                        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform">🏠</div>
                    </div>
                    <button className="w-full p-4 bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors text-white font-bold text-lg">
                        행성 생성하기 ✨
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
