'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 포춘쿠키 공장"
            description="바삭한 3D 포춘쿠키를 열어 오늘의 운세를 확인하거나 친구에게 보낼 행운을 담아보세요."
            icon="🥠"
            primaryColor="#fcd5ce"
            secondaryColor="#f8edeb"
            appSlug="fortune-cookie-3d"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md text-center">
                    <h3 className="text-xl font-bold text-white mb-4">오늘의 행운을 엽니다</h3>
                    <div className="animate-bounce text-6xl mb-6">🥠</div>
                    <button className="w-full p-4 bg-orange-400 rounded-xl hover:bg-orange-500 transition-colors text-white font-bold text-lg mb-4">
                        쿠키 열어보기
                    </button>
                    <button className="w-full p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-white">
                        친구에게 선물하기 🎁
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
