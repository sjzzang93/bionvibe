'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/secret" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          >
            ← Secret Vault로 돌아가기
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">
                📊 방문자 통계 대시보드
              </h1>
              <p className="text-gray-400">
                실시간으로 사이트 트래픽을 모니터링하세요
              </p>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-sm">현재 시간</div>
              <div className="text-white font-mono text-lg">
                {currentTime.toLocaleTimeString('ko-KR')}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-6 border border-blue-400/30">
            <div className="text-blue-400 text-sm font-semibold mb-2">실시간 사용자</div>
            <div className="text-white text-4xl font-bold mb-1">
              <span className="animate-pulse">●</span> --
            </div>
            <div className="text-white/60 text-xs">지금 접속 중</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-xl p-6 border border-green-400/30">
            <div className="text-green-400 text-sm font-semibold mb-2">오늘 방문자</div>
            <div className="text-white text-4xl font-bold mb-1">--</div>
            <div className="text-white/60 text-xs">총 세션</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
            <div className="text-purple-400 text-sm font-semibold mb-2">페이지뷰</div>
            <div className="text-white text-4xl font-bold mb-1">--</div>
            <div className="text-white/60 text-xs">총 조회수</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-lg rounded-xl p-6 border border-pink-400/30">
            <div className="text-pink-400 text-sm font-semibold mb-2">평균 체류시간</div>
            <div className="text-white text-4xl font-bold mb-1">--</div>
            <div className="text-white/60 text-xs">분</div>
          </div>
        </div>

        {/* Google Analytics Embed */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              📈 Google Analytics 대시보드
            </h2>
            <a
              href="https://analytics.google.com/analytics/web/#/p463628542/reports/intelligenthome"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            >
              전체 대시보드 열기 →
            </a>
          </div>

          <div className="bg-white/10 rounded-xl p-8 border border-white/20">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-4">
                Google Analytics에서 상세 통계 확인
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                아래 버튼을 클릭하면 Google Analytics 대시보드로 이동합니다.
                실시간 사용자, 페이지뷰, 유입 경로, 디바이스 정보 등을 확인할 수 있습니다.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <a
                  href="https://analytics.google.com/analytics/web/#/p463628542/reports/realtime"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  🔴 실시간 사용자
                </a>
                
                <a
                  href="https://analytics.google.com/analytics/web/#/p463628542/reports/lifecycle-acquisition"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  📈 트래픽 분석
                </a>

                <a
                  href="https://analytics.google.com/analytics/web/#/p463628542/reports/engagement-pages-and-screens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  📄 인기 페이지
                </a>

                <a
                  href="https://analytics.google.com/analytics/web/#/p463628542/reports/tech-overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  📱 기기 분석
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">💡 확인 가능한 정보</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong className="text-white">실시간 사용자:</strong> 지금 사이트에 있는 사람 수</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong className="text-white">페이지뷰:</strong> 총 조회된 페이지 수</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong className="text-white">유입 경로:</strong> 방문자가 어디서 왔는지</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong className="text-white">인기 페이지:</strong> 가장 많이 본 앱</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong className="text-white">디바이스:</strong> 모바일 vs PC 비율</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong className="text-white">지역:</strong> 방문자 위치 (서울, 부산 등)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">⚡ 빠른 팁</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">●</span>
                <span>데이터는 <strong className="text-white">24시간 후부터</strong> 정확하게 쌓입니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">●</span>
                <span>실시간 데이터는 <strong className="text-white">2-3분 지연</strong>될 수 있습니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">●</span>
                <span>북마크에 추가해서 <strong className="text-white">매일 체크</strong>하세요</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">●</span>
                <span>인기 페이지를 파악해 <strong className="text-white">홍보 전략</strong>을 세우세요</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">●</span>
                <span>유입 경로를 보고 <strong className="text-white">효과적인 채널</strong>을 찾으세요</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Analytics Info */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📌</div>
            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Google Analytics ID</h3>
              <p className="text-white font-mono mb-2">G-DGQPGH00WH</p>
              <p className="text-gray-300 text-sm">
                이 ID로 모든 트래픽이 추적되고 있습니다. 
                Google Analytics 계정에 로그인하면 상세한 데이터를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/secret"
            className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/20"
          >
            ← Secret Vault로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

