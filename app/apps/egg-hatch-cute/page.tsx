'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 알 키우기"
            description="따뜻하게 쓰다듬어주면 알이 깨어납니다! 어떤 귀여운 3D 친구가 태어날지 기대해보세요."
            icon="🦕"
            primaryColor="#f6d365"
            secondaryColor="#fda085"
            appSlug="egg-hatch-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md text-center">
                    <div className="text-white mb-4">알을 탭해서 온도를 높여주세요! 🔥</div>
                    <div className="w-full h-8 bg-black/20 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-orange-400 w-1/3"></div>
                    </div>
                    <button className="w-full p-4 bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors text-white font-bold text-lg">
                        쓰다듬기 👋
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
