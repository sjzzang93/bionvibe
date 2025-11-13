'use client';

import { useState } from 'react';
import Image from 'next/image';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import { CAR_WARNING_LIGHTS_DATA, getRiskStyle, type WarningLight } from '@/lib/car-warning-lights';

export default function CarWarningLightsPage() {
  const [selectedLight, setSelectedLight] = useState<WarningLight | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 경고등 상세 보기
  const openLightDetail = (light: WarningLight) => {
    setSelectedLight(light);
    setShowModal(true);
    // 모달 열릴 때 페이지 맨 위로 스크롤
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <PremiumLayout theme="blue">
      
        <AdOverlay /><div className="py-8 px-2 sm:px-4 md:py-12" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto" suppressHydrationWarning>
          <PremiumHeader 
            icon="🚗"
            title="차량 경고등 가이드"
            subtitle="64개 경고등의 의미와 대처법을 한눈에"
            gradient="from-blue-200 via-cyan-200 to-sky-200"
          />

          {/* 경고등 가이드 이미지 */}
          <PremiumCard className="mb-8" gradient>
            <h2 className="text-white font-bold text-xl md:text-2xl mb-4 text-center">
              📊 차량 경고등 전체 가이드
            </h2>
            <div className="relative w-full overflow-hidden rounded-xl">
              <Image 
                src="/images/car-warning-lights/guide.jpeg" 
                alt="차량 경고등 가이드"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>
            <p className="text-white/70 text-sm text-center mt-4">
              위 이미지에서 경고등 번호를 확인하고 아래 리스트에서 선택하세요
            </p>
          </PremiumCard>

          {/* 경고등 목록 - 번호순 */}
          <PremiumCard className="mb-8">
            <h2 className="text-white text-xl md:text-2xl font-bold mb-6 text-center">
              📋 전체 경고등 64개 (번호순)
            </h2>
            
            <div className="space-y-2">
              {CAR_WARNING_LIGHTS_DATA.warningLights.map((light) => {
                  const style = getRiskStyle(light.risk);
                  
                  return (
                    <div 
                      key={light.num}
                      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all"
                      onClick={() => openLightDetail(light)}
                    >
                      {/* 번호 */}
                      <div className="flex-shrink-0 w-10 md:w-12">
                        <span className={`inline-flex w-8 h-8 md:w-10 md:h-10 rounded-full items-center justify-center font-bold text-sm md:text-base ${style.bg} ${style.text}`}>
                          {light.num}
                        </span>
                      </div>
                      
                      {/* 이름 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-sm md:text-base truncate">
                          {light.name}
                        </h3>
                        <p className="text-white/60 text-xs md:text-sm truncate">
                          {light.symptom}
                        </p>
                      </div>
                      
                      {/* 위험도 */}
                      <div className="flex-shrink-0 hidden sm:block">
                        <span className={`inline-block px-2 py-1 md:px-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold ${style.badge} text-white`}>
                          {style.icon} {light.risk}
                        </span>
                      </div>
                      
                      {/* 수리비용 */}
                      <div className="hidden md:block flex-shrink-0 text-white/70 text-sm font-medium" suppressHydrationWarning>
                        {light.estimatedCost.average.toLocaleString()}원
                      </div>
                    </div>
                  );
                })}
            </div>
          </PremiumCard>

          {/* Related Apps */}
          <div className="mt-12 animate-fadeIn">
            <RelatedApps currentAppSlug="car-maintenance" className="mt-8" />
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      {showModal && selectedLight && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4"
          onClick={() => setShowModal(false)}
          suppressHydrationWarning
        >
          <div className="min-h-screen flex items-start justify-center pt-8 pb-8">
            <div 
              className="bg-gradient-to-br from-blue-900/95 via-cyan-900/95 to-blue-900/95 rounded-3xl p-6 md:p-8 max-w-4xl w-full border-2 border-blue-400/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              suppressHydrationWarning
            >
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex w-12 h-12 rounded-full items-center justify-center font-bold text-lg ${getRiskStyle(selectedLight.risk).bg} ${getRiskStyle(selectedLight.risk).text}`}>
                      {selectedLight.num}
                    </span>
                    <h2 className="text-white font-bold text-2xl md:text-3xl">{selectedLight.name}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${getRiskStyle(selectedLight.risk).badge} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                      {getRiskStyle(selectedLight.risk).icon} 위험도: {selectedLight.risk}
                    </span>
                  </div>
                </div>
                <button
        type="button"
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-red-400 text-4xl font-bold transition-colors ml-4"
                >
                  ×
                </button>
              </div>

              {/* 내용 */}
              <div className="space-y-6">
                {/* 증상 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                    💡 증상 및 원인
                  </h3>
                  <p className="text-white/90 text-base leading-relaxed">{selectedLight.symptom}</p>
                </div>

                {/* 정비 정보 */}
                <div className="bg-green-500/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border border-green-400/30">
                  <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                    🔧 정비 정보
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-300 font-bold mb-2">⏱️ 정비 주기:</p>
                      <p className="text-white/80 text-base">{selectedLight.serviceInterval}</p>
                    </div>
                    <div suppressHydrationWarning>
                      <p className="text-green-300 font-bold mb-2">💰 예상 비용:</p>
                      <p className="text-green-300 text-lg md:text-xl font-bold" suppressHydrationWarning>
                        평균 {selectedLight.estimatedCost.average.toLocaleString()}원
                      </p>
                      <p className="text-white/70 text-sm mt-1" suppressHydrationWarning>
                        최소 {selectedLight.estimatedCost.min.toLocaleString()}원 ~ 최대 {selectedLight.estimatedCost.max.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>

                {/* 주의사항 */}
                <div className={`${getRiskStyle(selectedLight.risk).badge}/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border ${getRiskStyle(selectedLight.risk).badge}/30`}>
                  <h3 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                    {getRiskStyle(selectedLight.risk).icon} 위험도: {selectedLight.risk}
                  </h3>
                  <div className="space-y-2 text-white/80">
                    {selectedLight.risk === '치명' && (
                      <p className="text-red-300 font-bold">⚠️ 즉시 정차하고 전문 정비소에서 점검받으세요. 운행 시 차량 손상 및 안전사고 위험이 있습니다.</p>
                    )}
                    {selectedLight.risk === '높음' && (
                      <p className="text-orange-300 font-bold">⚠️ 가능한 빠른 시일 내에 정비소를 방문하세요. 방치 시 큰 고장으로 이어질 수 있습니다.</p>
                    )}
                    {selectedLight.risk === '중간' && (
                      <p className="text-yellow-300">⚡ 일주일 내로 점검을 권장합니다. 주행은 가능하나 주의가 필요합니다.</p>
                    )}
                    {selectedLight.risk === '낮음' && (
                      <p className="text-blue-300">ℹ️ 정보성 경고입니다. 정기 점검 시 확인하면 됩니다.</p>
                    )}
                  </div>
                </div>

                {/* 비용 안내 */}
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20">
                  <p className="text-white/60 text-xs md:text-sm text-center leading-relaxed">
                    {CAR_WARNING_LIGHTS_DATA.note}
                  </p>
                </div>
              </div>

              {/* 닫기 버튼 */}
              <div className="mt-6">
                <PremiumButton
                  onClick={() => setShowModal(false)}
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  닫기
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </PremiumLayout>
  );
}
