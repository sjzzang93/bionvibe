'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 타임캡슐"
            description="미래의 나에게 보낼 메시지를 3D 타임캡슐에 담아 봉인해보세요."
            icon="⏳"
            primaryColor="#95e1d3"
            secondaryColor="#eaaffd"
            appSlug="time-capsule-3d"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <textarea
                        className="w-full h-32 p-4 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none resize-none mb-4"
                        placeholder="미래의 나에게 한마디..."
                    />
                    <div className="flex gap-4 mb-4">
                        <input type="date" className="p-3 rounded-xl bg-white/20 text-white flex-1" />
                    </div>
                    <button className="w-full p-4 bg-teal-500 rounded-xl hover:bg-teal-600 transition-colors text-white font-bold text-lg">
                        캡슐 봉인하기 🔒
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
