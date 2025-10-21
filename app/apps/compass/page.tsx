'use client';

import { useState, useEffect, useCallback } from 'react';
import AppFooter from "@/app/components/AppFooter";
import Link from 'next/link';
import { ChevronLeft, Compass as CompassIcon } from 'lucide-react';

export default function CompassPage() {
  const [heading, setHeading] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [error, setError] = useState<string>('');

  // 방위 계산
  const getDirection = (degree: number) => {
    if (degree >= 337.5 || degree < 22.5) return 'N 북';
    if (degree >= 22.5 && degree < 67.5) return 'NE 북동';
    if (degree >= 67.5 && degree < 112.5) return 'E 동';
    if (degree >= 112.5 && degree < 157.5) return 'SE 남동';
    if (degree >= 157.5 && degree < 202.5) return 'S 남';
    if (degree >= 202.5 && degree < 247.5) return 'SW 남서';
    if (degree >= 247.5 && degree < 292.5) return 'W 서';
    return 'NW 북서';
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

  // 360도 각도 마커 생성
  const angleMarkers = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* 헤더 */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">홈으로</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <CompassIcon className="w-6 h-6" />
            디지털 나침반
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">🧭 온라인 나침반</h2>
          <p className="text-gray-300 text-sm md:text-base">
            무료 디지털 나침반으로 정확한 방향을 확인하세요
          </p>
        </div>

        {/* 나침반 영역 */}
        <div className="relative mx-auto" style={{ width: 'min(90vw, 400px)', height: 'min(90vw, 400px)' }}>
          {/* 외부 원 - 고정 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-8 border-gray-700 shadow-2xl">
            {/* 360도 각도 표시 */}
            {angleMarkers.map((angle) => (
              <div
                key={angle}
                className="absolute top-1/2 left-1/2 origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                  height: '45%',
                }}
              >
                <div className={`w-0.5 mx-auto ${angle % 90 === 0 ? 'h-8 bg-red-500' : angle % 30 === 0 ? 'h-6 bg-white' : 'h-4 bg-gray-500'}`}></div>
                {angle % 30 === 0 && (
                  <div
                    className="text-xs font-bold mt-1 text-center"
                    style={{
                      transform: `rotate(${-angle}deg)`,
                      color: angle === 0 ? '#ef4444' : 'white',
                    }}
                  >
                    {angle}°
                  </div>
                )}
              </div>
            ))}

            {/* 고정 방위 표시 */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-red-500 z-20">
              N
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-400">
              S
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
              E
            </div>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
              W
            </div>
          </div>

          {/* 회전하는 나침반 바늘 */}
          {isActive && (
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${-heading}deg)` }}
            >
              {/* 북쪽 바늘 (빨강) */}
              <div className="absolute top-[15%] w-4 h-[35%] bg-gradient-to-t from-red-500 to-red-600 rounded-full shadow-2xl" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 50% 90%, 0% 100%)' }}></div>
              {/* 남쪽 바늘 (흰색) */}
              <div className="absolute bottom-[15%] w-4 h-[35%] bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-xl" style={{ clipPath: 'polygon(50% 100%, 100% 0%, 50% 10%, 0% 0%)' }}></div>
              {/* 중심점 */}
              <div className="absolute w-8 h-8 bg-white rounded-full shadow-2xl border-4 border-gray-800"></div>
            </div>
          )}

          {/* 비활성 상태 메시지 */}
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CompassIcon className="w-20 h-20 mx-auto mb-4 text-gray-600 animate-pulse" />
                <p className="text-gray-400 text-sm">나침반을 시작하세요</p>
              </div>
            </div>
          )}
        </div>

        {/* 각도 및 방향 표시 */}
        <div className="mt-8 text-center">
          <div className="text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {heading}°
          </div>
          <div className="text-3xl font-bold text-white mb-6">
            {getDirection(heading)}
          </div>
        </div>

        {/* 제어 버튼 */}
        <div className="flex justify-center gap-4 mb-8">
          {!isActive ? (
            <button
              onClick={startCompass}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105"
            >
              🧭 나침반 시작
            </button>
          ) : (
            <button
              onClick={stopCompass}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105"
            >
              ⏹️ 중지
            </button>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-8 text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* 사용 방법 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            📱 사용 방법
          </h3>
          <ol className="space-y-3 text-gray-300 text-sm md:text-base list-decimal list-inside">
            <li>스마트폰을 <strong className="text-white">수평으로</strong> 들어주세요</li>
            <li>"나침반 시작" 버튼을 클릭하세요</li>
            <li>iOS의 경우 권한 허용을 누르세요</li>
            <li>빨간 바늘이 <strong className="text-red-400">북쪽(N)</strong>을 가리킵니다</li>
            <li>정확도를 위해 <strong className="text-blue-400">HTTPS</strong>로 접속하세요</li>
          </ol>
        </div>

        {/* 브라우저 호환성 */}
        <div className="mt-6 bg-blue-500/20 border border-blue-500 rounded-xl p-4">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            ℹ️ 브라우저 호환성
          </h4>
          <p className="text-gray-300 text-sm">
            이 도구는 <strong>Chrome 63+, Safari (iOS 13+), Edge</strong>에서 작동합니다.
            <br />
            데스크톱에서는 작동하지 않으며, <strong>스마트폰</strong>에서만 사용 가능합니다.
          </p>
        </div>

        {/* 문제해결 */}
        <div className="mt-6 bg-yellow-500/20 border border-yellow-500 rounded-xl p-4">
          <h4 className="font-bold mb-2">⚠️ 작동하지 않나요?</h4>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Safari 설정 → 모션 및 방향 접근 켜기</li>
            <li>Chrome 설정 → 센서 권한 허용</li>
            <li>페이지 새로고침</li>
            <li>HTTPS로 접속 확인</li>
          </ul>
        </div>
        {/* 제작자 서명 */}
        <AppFooter />

      </main>

      {/* 푸터 */}
      <footer className="mt-16 py-8 border-t border-white/10 text-center text-gray-400 text-sm">
        <p>© 2025 BION - 디지털 나침반</p>
        <p className="mt-2">무료 온라인 도구 | 모바일 최적화</p>
      </footer>
    </div>
  );
}

