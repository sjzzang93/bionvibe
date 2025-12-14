'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 바이오리듬"
            description="오늘의 컨디션은 어떤가요? 신체, 감성, 지성 리듬을 귀여운 3D 파동으로 확인해보세요."
            icon="🧬"
            primaryColor="#30cfd0"
            secondaryColor="#330867"
            appSlug="biorhythm-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <label className="block text-white mb-2">생년월일 입력</label>
                    <input type="date" className="w-full p-3 rounded-xl bg-white/20 text-white mb-6" />
                    <button className="w-full p-4 bg-cyan-600 rounded-xl hover:bg-cyan-700 transition-colors text-white font-bold text-lg">
                        리듬 분석하기 📊
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
