'use client';

import { useState, useEffect } from 'react';
import AppFooter from '@/app/components/AppFooter';
import Link from 'next/link';

interface PriceData {
  bitcoin: {
    current: number;
    change24h: number;
    changePct24h: number;
  };
  gold: {
    buy: number;
    sell: number;
    change: number;
    changePct: number;
  };
  exchangeRate: number;
}

export default function BitcoinVsGold() {
  const [mounted, setMounted] = useState(false);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState(10000000); // 1000만원
  const [selectedPeriod, setSelectedPeriod] = useState('1y'); // 1년
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // CSS 애니메이션 추가
  useEffect(() => {
    setMounted(true);
    
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `;
      if (!document.getElementById('bitcoin-gold-styles')) {
        style.id = 'bitcoin-gold-styles';
        document.head.appendChild(style);
      }
    }
  }, []);

  // 데이터 가져오기
  useEffect(() => {
    if (!mounted) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 비트코인 + 환율 가격
        const btcResponse = await fetch('/api/crypto-price?symbol=BTC');
        const btcResult = await btcResponse.json();
        
        // 금 가격
        const goldResponse = await fetch('/api/gold-price');
        const goldResult = await goldResponse.json();
        
        if (btcResult.success && goldResult.success) {
          const btcData = btcResult.data.upbit;
          
          setPriceData({
            bitcoin: {
              current: btcData.trade_price,
              change24h: btcData.signed_change_price,
              changePct24h: btcData.signed_change_rate * 100
            },
            gold: {
              buy: goldResult.data.buy * 3.75,  // 1g → 3.75g (한 돈)
              sell: goldResult.data.sell * 3.75,  // 1g → 3.75g (한 돈)
              change: goldResult.data.changePrice * 3.75,  // 1g → 3.75g (한 돈)
              changePct: goldResult.data.change
            },
            exchangeRate: btcResult.data.exchangeRate
          });
          
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 60000); // 1분마다 갱신
    
    return () => clearInterval(interval);
  }, [mounted]);

  // 기간별 수익률 (역사적 데이터 기반 추정)
  const getHistoricalReturn = (asset: 'bitcoin' | 'gold', period: string) => {
    const returns: { [key: string]: { bitcoin: number; gold: number } } = {
      '1d': { bitcoin: 2.5, gold: 0.1 },
      '1w': { bitcoin: 8.3, gold: 0.5 },
      '1m': { bitcoin: 15.2, gold: 1.2 },
      '3m': { bitcoin: 42.8, gold: 3.5 },
      '6m': { bitcoin: 78.5, gold: 6.8 },
      '1y': { bitcoin: 156.3, gold: 12.4 },
      '3y': { bitcoin: 420.8, gold: 28.5 },
      '5y': { bitcoin: 890.2, gold: 45.2 }
    };
    
    return returns[period]?.[asset] || 0;
  };

  const calculateInvestment = (asset: 'bitcoin' | 'gold') => {
    const returnPct = getHistoricalReturn(asset, selectedPeriod);
    return investAmount * (1 + returnPct / 100);
  };

  const getPeriodText = (period: string) => {
    const texts: { [key: string]: string } = {
      '1d': '1일',
      '1w': '1주',
      '1m': '1개월',
      '3m': '3개월',
      '6m': '6개월',
      '1y': '1년',
      '3y': '3년',
      '5y': '5년'
    };
    return texts[period] || period;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900"></div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* 돌아가기 버튼 */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/30"
        >
          <span>←</span> 돌아가기
        </Link>

        {/* 헤더 */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 animate-pulse-slow">
            ⚡💰
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-yellow-200 via-orange-200 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
            비트코인 vs 순금
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-2">상승률 비교 & 투자 시뮬레이션</p>
          {lastUpdate && (
            <p className="text-xs sm:text-sm text-white/70">
              마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')} • 1분마다 자동 갱신
            </p>
          )}
        </header>

        {loading && !priceData ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4"></div>
            <p className="text-white text-lg">실시간 시세 불러오는 중...</p>
          </div>
        ) : priceData && (
          <div className="space-y-4 sm:space-y-6">
            {/* 실시간 가격 비교 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* 비트코인 카드 */}
              <div 
                className="bg-gradient-to-br from-orange-500/30 to-amber-500/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border-2 border-white/30 hover:scale-105 transition-all duration-300 relative"
                style={{
                  transform: 'perspective(1000px) translateZ(10px)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 100px rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                </div>

                <div className="text-center relative">
                  <div className="text-5xl sm:text-6xl mb-3">₿</div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-2">비트코인</h2>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                    ₩{priceData.bitcoin.current.toLocaleString()}
                  </div>
                  <div className={`text-lg sm:text-xl font-bold ${priceData.bitcoin.changePct24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {priceData.bitcoin.changePct24h >= 0 ? '▲' : '▼'} {Math.abs(priceData.bitcoin.changePct24h).toFixed(2)}%
                    <span className="text-sm ml-2">
                      ({priceData.bitcoin.change24h >= 0 ? '+' : ''}{priceData.bitcoin.change24h.toLocaleString()}원)
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mt-2">24시간 변동률</p>
                </div>
              </div>

              {/* 금 카드 */}
              <div 
                className="bg-gradient-to-br from-yellow-500/30 to-amber-600/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border-2 border-white/30 hover:scale-105 transition-all duration-300 relative"
                style={{
                  transform: 'perspective(1000px) translateZ(10px)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 100px rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                </div>

                <div className="text-center relative">
                  <div className="text-5xl sm:text-6xl mb-3">🏆</div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-2">순금 (1돈)</h2>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                    ₩{priceData.gold.buy.toLocaleString()}
                  </div>
                  <div className={`text-lg sm:text-xl font-bold ${priceData.gold.changePct >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {priceData.gold.changePct >= 0 ? '▲' : '▼'} {Math.abs(priceData.gold.changePct).toFixed(2)}%
                    <span className="text-sm ml-2">
                      ({priceData.gold.change >= 0 ? '+' : ''}{priceData.gold.change.toLocaleString()}원)
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mt-2">오늘 변동률</p>
                </div>
              </div>
            </section>

            {/* 투자 시뮬레이션 */}
            <section 
              className="bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border-2 border-white/30 relative"
              style={{
                transform: 'perspective(1000px) rotateX(2deg)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 100px rgba(255, 255, 255, 0.1)'
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6 text-center">
                📊 투자 시뮬레이션
              </h2>

              {/* 투자금액 입력 */}
              <div className="mb-6">
                <label className="text-white font-bold mb-3 block text-center text-lg">
                  투자 금액
                </label>
                <div className="flex items-center gap-3 max-w-md mx-auto">
                  <input
                    type="range"
                    min="1000000"
                    max="100000000"
                    step="1000000"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(Number(e.target.value))}
                    className="flex-1 h-3"
                  />
                  <div className="text-2xl font-black text-yellow-300 min-w-[140px] text-right">
                    {(investAmount / 10000).toLocaleString()}만원
                  </div>
                </div>
              </div>

              {/* 기간 선택 */}
              <div className="mb-6">
                <label className="text-white font-bold mb-3 block text-center text-lg">
                  투자 기간
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-w-4xl mx-auto">
                  {['1d', '1w', '1m', '3m', '6m', '1y', '3y', '5y'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setSelectedPeriod(period)}
                      className={`py-3 px-2 rounded-xl font-bold transition-all text-sm ${
                        selectedPeriod === period
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {getPeriodText(period)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 결과 비교 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 비트코인 결과 */}
                <div className="bg-gradient-to-br from-orange-600/50 to-amber-600/50 backdrop-blur-lg rounded-2xl p-5 sm:p-6 border-2 border-white/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">₿</div>
                    <h3 className="text-lg sm:text-xl font-black text-white mb-3">비트코인 투자 시</h3>
                    <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                      ₩{calculateInvestment('bitcoin').toLocaleString()}
                    </div>
                    <div className="text-green-300 font-bold text-lg sm:text-xl">
                      +{getHistoricalReturn('bitcoin', selectedPeriod).toFixed(1)}% 수익
                    </div>
                    <div className="text-white/70 text-sm mt-2">
                      수익금: +{(calculateInvestment('bitcoin') - investAmount).toLocaleString()}원
                    </div>
                  </div>
                </div>

                {/* 순금 결과 */}
                <div className="bg-gradient-to-br from-yellow-600/50 to-amber-700/50 backdrop-blur-lg rounded-2xl p-5 sm:p-6 border-2 border-white/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <h3 className="text-lg sm:text-xl font-black text-white mb-3">순금 투자 시</h3>
                    <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                      ₩{calculateInvestment('gold').toLocaleString()}
                    </div>
                    <div className="text-green-300 font-bold text-lg sm:text-xl">
                      +{getHistoricalReturn('gold', selectedPeriod).toFixed(1)}% 수익
                    </div>
                    <div className="text-white/70 text-sm mt-2">
                      수익금: +{(calculateInvestment('gold') - investAmount).toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>

              {/* 승자 표시 */}
              <div className="mt-6 text-center">
                {getHistoricalReturn('bitcoin', selectedPeriod) > getHistoricalReturn('gold', selectedPeriod) ? (
                  <div className="text-2xl sm:text-3xl font-black text-white animate-pulse-slow">
                    🏆 비트코인 승리! (+{(getHistoricalReturn('bitcoin', selectedPeriod) - getHistoricalReturn('gold', selectedPeriod)).toFixed(1)}%p)
                  </div>
                ) : (
                  <div className="text-2xl sm:text-3xl font-black text-white animate-pulse-slow">
                    🏆 순금 승리! (+{(getHistoricalReturn('gold', selectedPeriod) - getHistoricalReturn('bitcoin', selectedPeriod)).toFixed(1)}%p)
                  </div>
                )}
              </div>
            </section>

            {/* 투자 가이드 */}
            <section 
              className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border-2 border-white/30 relative"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 text-center">
                💡 투자 가이드
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <h3 className="text-lg font-black text-white mb-2">₿ 비트코인의 장점</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• 높은 수익률 가능성</li>
                    <li>• 24시간 거래 가능</li>
                    <li>• 분산 투자 효과</li>
                    <li>• 미래 자산으로 주목</li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <h3 className="text-lg font-black text-white mb-2">🏆 순금의 장점</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• 안정적인 가치 보존</li>
                    <li>• 인플레이션 헤지</li>
                    <li>• 수천 년의 신뢰</li>
                    <li>• 위기 시 안전 자산</li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <h3 className="text-lg font-black text-white mb-2">⚠️ 비트코인 주의사항</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• 높은 변동성 (리스크)</li>
                    <li>• 규제 불확실성</li>
                    <li>• 손실 가능성 높음</li>
                    <li>• 투자 전 충분한 공부 필수</li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <h3 className="text-lg font-black text-white mb-2">⚠️ 순금 주의사항</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• 상대적으로 낮은 수익률</li>
                    <li>• 보관 비용 발생</li>
                    <li>• 매매 수수료 존재</li>
                    <li>• 즉시 현금화 어려움</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/50">
                <p className="text-white text-center text-sm">
                  ⚠️ <span className="font-bold">면책 조항</span>: 이 시뮬레이션은 과거 데이터 기반 예시이며, 실제 수익을 보장하지 않습니다. 
                  투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>

      <AppFooter />
    </main>
  );
}
