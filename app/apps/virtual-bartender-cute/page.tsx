'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="가상 바텐더: 칵테일"
            description="귀여운 3D 바텐더와 함께 흔들고 섞어서 나만의 취향 저격 칵테일을 만들어보세요."
            icon="🍹"
            primaryColor="#ff9a9e"
            secondaryColor="#fecfef"
            appSlug="virtual-bartender-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md text-center">
                    <p className="text-white mb-4">베이스 음료를 선택하세요</p>
                    <div className="flex justify-around gap-2 mb-6">
                        <button className="p-3 bg-blue-500/50 rounded-xl hover:bg-blue-400/60 text-white">소다 🥤</button>
                        <button className="p-3 bg-orange-500/50 rounded-xl hover:bg-orange-400/60 text-white">주스 🍊</button>
                        <button className="p-3 bg-purple-500/50 rounded-xl hover:bg-purple-400/60 text-white">시럽 🍇</button>
                    </div>
                    <button className="w-full p-4 bg-pink-500 rounded-xl hover:bg-pink-600 transition-colors text-white font-bold text-lg">
                        쉐이킷! 쉐이킷! 🍸
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
