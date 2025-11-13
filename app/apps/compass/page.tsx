'use client';

import { useState, useEffect, useCallback } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

export default function CompassPage() {
  const [heading, setHeading] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [error, setError] = useState<string>('');

  // 방위 계산
  const getDirection = (degree: number) => {
    if (degree >= 337.5 || degree < 22.5) return { short: 'N', long: '북', emoji: '🧭' };
    if (degree >= 22.5 && degree < 67.5) return { short: 'NE', long: '북동', emoji: '↗️' };
    if (degree >= 67.5 && degree < 112.5) return { short: 'E', long: '동', emoji: '➡️' };
    if (degree >= 112.5 && degree < 157.5) return { short: 'SE', long: '남동', emoji: '↘️' };
    if (degree >= 157.5 && degree < 202.5) return { short: 'S', long: '남', emoji: '⬇️' };
    if (degree >= 202.5 && degree < 247.5) return { short: 'SW', long: '남서', emoji: '↙️' };
    if (degree >= 247.5 && degree < 292.5) return { short: 'W', long: '서', emoji: '⬅️' };
    return { short: 'NW', long: '북서', emoji: '↖️' };
  };

  // 나침반 시작
  const startCompass = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let compassHeading = 0;

      // iOS - webkitCompassHeading 사용
      if ((event as any).webkitCompassHeading !== undefined) {
        compassHeading = (event as any).webkitCompassHeading;
      }
      // Android/기타 - alpha 값 사용
      else if (event.alpha !== null) {
        compassHeading = 360 - event.alpha;
      }

      setHeading(Math.round(compassHeading));
    };

    try {
      // iOS 13+ 권한 요청
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          window.addEventListener('deviceorientationabsolute', handleOrientation, true);
          setPermission('granted');
          setIsActive(true);
          setError('');
        } else {
          setPermission('denied');
          setError('권한이 거부되었습니다. Safari 설정에서 모션 및 방향 접근을 허용해주세요.');
        }
      } else {
        // Android 및 기타
        window.addEventListener('deviceorientation', handleOrientation, true);
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        setPermission('granted');
        setIsActive(true);
        setError('');
      }
    } catch (err) {
      setError('나침반을 시작할 수 없습니다: ' + (err as Error).message);
      setPermission('denied');
    }
  }, []);

  // 나침반 중지
  const stopCompass = useCallback(() => {
    window.removeEventListener('deviceorientation', () => {}, true);
    window.removeEventListener('deviceorientationabsolute', () => {}, true);
    setIsActive(false);
    setPermission('prompt');
    setHeading(0);
  }, []);

  const direction = getDirection(heading);

  return (
    <PremiumLayout theme="indigo">
      
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            🧭 나침반
          </h1>
          <p className="text-xl text-white/80">디지털 나침반으로 방향을 찾아보세요</p>
        </div>

        {/* 메인 나침반 */}
        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          {!isActive ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-8 animate-float">🧭</div>
              <h2 className="text-white text-3xl font-bold mb-4">나침반을 시작하세요</h2>
              <p className="text-white/70 text-lg mb-8">
                기기의 방향 센서를 사용하여<br />
                현재 방위를 표시합니다
              </p>
              
              <PremiumButton
                onClick={startCompass}
                variant="primary"
                size="lg"
                icon="🚀"
                fullWidth
              >
                나침반 시작하기
              </PremiumButton>

              {error && (
                <div className="mt-6 bg-red-500/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-red-400/30">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-8 text-white/60 text-sm">
                💡 모바일 기기에서 가장 정확합니다
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              {/* 나침반 디스플레이 */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-8">
                {/* 외부 원 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border-4 border-white/30"
                  style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.2)' }}
                >
                  {/* 방위 표시 */}
                  {[
                    { deg: 0, label: 'N', color: 'text-red-400' },
                    { deg: 90, label: 'E', color: 'text-white' },
                    { deg: 180, label: 'S', color: 'text-white' },
                    { deg: 270, label: 'W', color: 'text-white' }
                  ].map((dir) => (
                    <div
                      key={dir.deg}
                      className="absolute w-full h-full"
                      style={{ transform: `rotate(${dir.deg}deg)` }}
                    >
                      <div className={`absolute top-2 left-1/2 -translate-x-1/2 ${dir.color} font-bold text-2xl`}>
                        {dir.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 회전하는 바늘 */}
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-out"
                  style={{ transform: `rotate(${-heading}deg)` }}
                >
                  {/* 북쪽 바늘 (빨강) */}
                  <div className="absolute left-1/2 top-1/2 w-2 h-32 -mt-32 -ml-1 bg-gradient-to-t from-red-600 to-red-400 rounded-full"
                    style={{ boxShadow: '0 0 20px rgba(220, 38, 38, 0.8)' }}
                  />
                  {/* 남쪽 바늘 (하양) */}
                  <div className="absolute left-1/2 top-1/2 w-2 h-32 -ml-1 bg-gradient-to-b from-white/90 to-white/50 rounded-full"
                    style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}
                  />
                  {/* 중심점 */}
                  <div className="absolute left-1/2 top-1/2 w-6 h-6 -ml-3 -mt-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white"
                    style={{ boxShadow: '0 0 15px rgba(251, 191, 36, 0.8)' }}
                  />
                </div>
              </div>

              {/* 방향 정보 */}
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/20">
                  <div className="text-white/70 text-sm mb-2">방위각</div>
                  <div className="text-white text-4xl font-bold">{heading}°</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/20">
                  <div className="text-white/70 text-sm mb-2">방향</div>
                  <div className="text-4xl mb-1">{direction.emoji}</div>
                  <div className="text-white text-xl font-bold">{direction.short}</div>
                  <div className="text-white/70 text-sm">{direction.long}</div>
                </div>
              </div>

              <PremiumButton
                onClick={stopCompass}
                variant="danger"
                size="md"
                icon="⏹️"
                fullWidth
              >
                나침반 중지
              </PremiumButton>
            </div>
          )}
        </PremiumCard>

        {/* 안내 */}
        <PremiumCard className="mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-4 text-white/80 text-sm">
            <div className="flex items-start gap-0 sm:gap-1.5 md:gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-bold mb-1">사용 팁</div>
                <p className="text-xs">• 기기를 평평하게 유지하세요</p>
                <p className="text-xs">• 자석이나 금속 물체에서 멀리하세요</p>
                <p className="text-xs">• 실내보다 실외에서 더 정확합니다</p>
              </div>
            </div>
            <div className="flex items-start gap-0 sm:gap-1.5 md:gap-3">
              <span className="text-2xl">🧭</span>
              <div>
                <div className="font-bold mb-1">방위 읽기</div>
                <p className="text-xs">빨간 바늘이 가리키는 방향이 북쪽입니다</p>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* Related Apps */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <RelatedApps currentAppSlug="compass" className="mt-8" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
