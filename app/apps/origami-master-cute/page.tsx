'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 종이접기"
            description="종이학, 비행기, 하트... 3D 가이드를 따라 접으면 똥손도 금손이 될 수 있어요!"
            icon="📜"
            primaryColor="#fa709a"
            secondaryColor="#fee140"
            appSlug="origami-master-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <h3 className="text-white font-bold mb-4">오늘의 도전 과제</h3>
                    <div className="space-y-3 mb-6">
                        <div className="p-3 bg-white/20 rounded-xl flex justify-between items-center text-white cursor-pointer hover:bg-white/30">
                            <span>🦢 종이학</span>
                            <span className="bg-green-500 px-2 py-1 rounded text-xs">쉬움</span>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl flex justify-between items-center text-white cursor-pointer hover:bg-white/30">
                            <span>✈️ 비행기</span>
                            <span className="bg-green-500 px-2 py-1 rounded text-xs">쉬움</span>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl flex justify-between items-center text-white cursor-pointer hover:bg-white/30">
                            <span>🐲 드래곤</span>
                            <span className="bg-red-500 px-2 py-1 rounded text-xs">어려움</span>
                        </div>
                    </div>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
