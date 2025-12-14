'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 다도 체험"
            description="따뜻한 차를 우리고 마시는 과정을 3D로 체험하며 마음의 평화를 찾으세요."
            icon="🍵"
            primaryColor="#d4a373"
            secondaryColor="#ccd5ae"
            appSlug="tea-ceremony-3d"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <p className="text-white text-center mb-4">오늘의 차를 선택하세요</p>
                    <div className="flex justify-around gap-2 mb-6">
                        <button className="flex-1 p-3 bg-green-800/40 rounded-xl hover:bg-green-700/50 text-white">녹차 🌿</button>
                        <button className="flex-1 p-3 bg-red-900/40 rounded-xl hover:bg-red-800/50 text-white">홍차 🍂</button>
                        <button className="flex-1 p-3 bg-yellow-700/40 rounded-xl hover:bg-yellow-600/50 text-white">국화차 🌼</button>
                    </div>
                    <button className="w-full p-4 bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors text-white font-bold text-lg">
                        차 우리기 시작 🫖
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
