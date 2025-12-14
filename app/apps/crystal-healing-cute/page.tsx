'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 힐링 크리스탈"
            description="당신의 힐링을 위한 영롱한 3D 크리스탈. 오늘의 원석을 뽑고 에너지를 충전하세요."
            icon="💎"
            primaryColor="#e0c3fc"
            secondaryColor="#8ec5fc"
            appSlug="crystal-healing-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md text-center">
                    <h3 className="text-white text-xl font-bold mb-6">오늘 나에게 필요한 에너지는?</h3>
                    <button className="w-full p-4 bg-purple-500 rounded-xl hover:bg-purple-600 transition-colors text-white font-bold text-lg animate-pulse">
                        운명의 원석 뽑기 🔮
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
