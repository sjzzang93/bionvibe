'use client';

import ThreeAppTemplate from '@/app/components/ThreeAppTemplate';

export default function Page() {
    return (
        <ThreeAppTemplate
            title="3D 복셀 아바타"
            description="블록으로 톡톡! 레고 스타일의 귀여운 3D 아바타를 만들고 프로필 사진으로 써보세요."
            icon="🧱"
            primaryColor="#43e97b"
            secondaryColor="#38f9d7"
            appSlug="voxel-avatar-cute"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md">
                    <p className="text-white text-center mb-4">스타일 편집</p>
                    <div className="flex gap-2 mb-2">
                        <button className="flex-1 p-2 bg-white/20 rounded-lg text-white">머리</button>
                        <button className="flex-1 p-2 bg-white/20 rounded-lg text-white">눈</button>
                        <button className="flex-1 p-2 bg-white/20 rounded-lg text-white">입</button>
                    </div>
                    <div className="h-32 bg-black/20 rounded-xl mb-4 flex items-center justify-center text-white/50">
                        3D 미리보기 영역
                    </div>
                    <button className="w-full p-4 bg-green-500 rounded-xl hover:bg-green-600 transition-colors text-white font-bold text-lg">
                        이미지 저장 📸
                    </button>
                </div>
            </div>
        </ThreeAppTemplate>
    );
}
