'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 매듭법 가이드"
            description="어려운 매듭도 3D로 돌려보며 쉽게! 넥타이, 스카프, 선물 포장을 완벽하게 마스터하세요."
            icon="🎀"
            primaryColor="#ff0844"
            secondaryColor="#ffb199"
            appSlug="knot-guide-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <label className="block text-white mb-2 font-bold">배우고 싶은 매듭 선택</label>
                    <select className="w-full p-3 rounded-xl bg-white/20 text-white outline-none mb-6">
                        <option className="text-black">👔 넥타이 - 윈저 노트</option>
                        <option className="text-black">🧣 스카프 - 기본 매듭</option>
                        <option className="text-black">🎁 선물 리본 - 나비 매듭</option>
                        <option className="text-black">⛺ 캠핑 - 보우라인</option>
                    </select>
                    <button className="w-full p-4 bg-red-500 rounded-xl hover:bg-red-600 transition-colors text-white font-bold text-lg">
                        3D 가이드 보기 🧶
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
