'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D ASMR: 꿀잠소리"
            description="포근한 구름 위에서 듣는 나만의 3D 사운드. 빗소리, 장작 소리를 섞어 꿀잠을 선물합니다."
            icon="🎧"
            primaryColor="#a1c4fd"
            secondaryColor="#c2e9fb"
            appSlug="asmr-soundscape-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <p className="text-white text-center mb-4">소리를 믹스해보세요</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <button className="p-4 bg-white/20 rounded-xl hover:bg-white/30 text-white">🌧️ 비오는 숲</button>
                        <button className="p-4 bg-white/20 rounded-xl hover:bg-white/30 text-white">🔥 타닥 장작</button>
                        <button className="p-4 bg-white/20 rounded-xl hover:bg-white/30 text-white">🌊 파도 소리</button>
                        <button className="p-4 bg-white/20 rounded-xl hover:bg-white/30 text-white">⌨️ 타자 소리</button>
                    </div>
                    <button className="w-full p-3 bg-indigo-500 rounded-xl hover:bg-indigo-600 text-white font-bold">
                        재생 하기 ▶️
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
