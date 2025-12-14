'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 불꽃놀이 스튜디오"
            description="밤하늘에 수놓는 나만의 3D 불꽃 축제. 색상과 터지는 모양을 직접 디자인해보세요."
            icon="🎆"
            primaryColor="#4facfe"
            secondaryColor="#00f2fe"
            appSlug="fireworks-studio-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button className="p-3 bg-red-500/50 rounded-xl text-white border-2 border-transparent hover:border-white">🔴 빨강</button>
                        <button className="p-3 bg-yellow-500/50 rounded-xl text-white border-2 border-transparent hover:border-white">🟡 노랑</button>
                        <button className="p-3 bg-green-500/50 rounded-xl text-white border-2 border-transparent hover:border-white">🟢 초록</button>
                        <button className="p-3 bg-blue-500/50 rounded-xl text-white border-2 border-transparent hover:border-white">🔵 파랑</button>
                    </div>
                    <button className="w-full p-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors text-white font-bold text-lg">
                        불꽃 발사! 🚀
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
