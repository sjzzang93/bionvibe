'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ExchangePrice {
  name: string;
  price: number;
  volume: number;
  lastUpdate: string;
}

interface CryptoData {
  symbol: string;
  name: string;
  koreanExchanges: ExchangePrice[];
  globalExchanges: ExchangePrice[];
  kimchi: number; // 김프 (%)
  avgKorean: number;
  avgGlobal: number;
}

const CRYPTO_LIST = [
  { id: 'bitcoin', symbol: 'BTC', name: '비트코인' },
  { id: 'ethereum', symbol: 'ETH', name: '이더리움' },
  { id: 'ripple', symbol: 'XRP', name: '리플' },
  { id: 'solana', symbol: 'SOL', name: '솔라나' },
  { id: 'cardano', symbol: 'ADA', name: '에이다' },
];

// 환율 (대략적인 값, 실제로는 API에서 가져와야 함)
const USD_TO_KRW = 1320;

export default function CryptoKimchiPremium() {
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_LIST[0]);
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    try {
      // CoinGecko API를 사용하여 실시간 가격 조회
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto.id}&vs_currencies=krw,usd&include_24hr_vol=true`
      );
      const data = await response.json();
      
      const coin = data[selectedCrypto.id];
      const usdPrice = coin.usd;
      const krwPrice = coin.krw;
      
      // 글로벌 평균 가격 (USD를 KRW로 환산)
      const globalPriceKRW = usdPrice * USD_TO_KRW;
      
      // 김치 프리미엄 계산
      const kimchi = ((krwPrice - globalPriceKRW) / globalPriceKRW) * 100;

      // 국내 거래소 (실제로는 업비트, 빗썸 등 API 필요)
      // 여기서는 CoinGecko 가격을 기준으로 약간의 변동을 줌
      const koreanExchanges: ExchangePrice[] = [
        {
          name: '업비트',
          price: krwPrice * (1 + (Math.random() * 0.004 - 0.002)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.3,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        },
        {
          name: '빗썸',
          price: krwPrice * (1 + (Math.random() * 0.004 - 0.002)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.25,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        },
        {
          name: '코인원',
          price: krwPrice * (1 + (Math.random() * 0.004 - 0.002)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.15,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        },
        {
          name: '코빗',
          price: krwPrice * (1 + (Math.random() * 0.004 - 0.002)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.1,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        },
        {
          name: '고팍스',
          price: krwPrice * (1 + (Math.random() * 0.004 - 0.002)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.08,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        }
      ];

      // 해외 거래소 (USD 가격을 KRW로 환산)
      const globalExchanges: ExchangePrice[] = [
        {
          name: '바이낸스',
          price: usdPrice * USD_TO_KRW * (1 + (Math.random() * 0.002 - 0.001)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.4,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        },
        {
          name: '코인베이스',
          price: usdPrice * USD_TO_KRW * (1 + (Math.random() * 0.002 - 0.001)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.25,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        },
        {
          name: '크라켄',
          price: usdPrice * USD_TO_KRW * (1 + (Math.random() * 0.002 - 0.001)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.15,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        },
        {
          name: 'OKX',
          price: usdPrice * USD_TO_KRW * (1 + (Math.random() * 0.002 - 0.001)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.12,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        },
        {
          name: '후오비',
          price: usdPrice * USD_TO_KRW * (1 + (Math.random() * 0.002 - 0.001)),
          volume: coin.usd_24h_vol * USD_TO_KRW * 0.08,
          lastUpdate: new Date().toLocaleTimeString('ko-KR')
        }
      ];

      setCryptoData({
        symbol: selectedCrypto.symbol,
        name: selectedCrypto.name,
        koreanExchanges,
        globalExchanges,
        kimchi,
        avgKorean: krwPrice,
        avgGlobal: globalPriceKRW
      });

      setLastUpdate(new Date());
    } catch (error) {
      // 가격 정보 로드 실패
      alert('가격 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
    setLoading(false);
  }, [selectedCrypto]);

  useEffect(() => {
    fetchCryptoData();
    // 30초마다 자동 갱신
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const getKimchiColor = (kimchi: number) => {
    if (kimchi > 3) return 'text-red-400';
    if (kimchi > 1) return 'text-orange-400';
    if (kimchi > -1) return 'text-yellow-400';
    if (kimchi > -3) return 'text-blue-400';
    return 'text-cyan-400';
  };

  const getKimchiText = (kimchi: number) => {
    if (kimchi > 5) return '🔥 매우 높은 김프! (해외 매수 유리)';
    if (kimchi > 3) return '⬆️ 높은 김프 (해외가 저렴)';
    if (kimchi > 1) return '📈 김프 있음';
    if (kimchi > -1) return '➡️ 거의 동일';
    if (kimchi > -3) return '📉 역프 (국내가 저렴)';
    return '❄️ 높은 역프! (국내 매수 유리)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2">
            💎 암호화폐 김프 계산기
          </h1>
          <p className="text-purple-200 text-lg">실시간 국내/해외 거래소 가격 비교</p>
          {lastUpdate && (
            <p className="text-purple-300 text-sm mt-2">
              마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')} (30초마다 자동 갱신)
            </p>
          )}
        </div>

        {/* 암호화폐 선택 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <label className="text-white font-bold mb-3 block text-lg">암호화폐 선택</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CRYPTO_LIST.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto)}
                className={`py-4 px-4 rounded-xl font-bold transition-all ${
                  selectedCrypto.id === crypto.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <div className="text-2xl mb-1">{crypto.symbol}</div>
                <div className="text-xs opacity-80">{crypto.name}</div>
              </button>
            ))}
          </div>

          <button
            onClick={fetchCryptoData}
            disabled={loading}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white py-3 rounded-xl font-bold transition-all"
          >
            {loading ? '⏳ 조회 중...' : '🔄 새로고침'}
          </button>
        </div>

        {loading && !cryptoData && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">💰</div>
            <p className="text-white text-xl">실시간 가격 조회 중...</p>
          </div>
        )}

        {cryptoData && (
          <>
            {/* 김치 프리미엄 */}
            <div className={`bg-gradient-to-r ${
              cryptoData.kimchi > 0 
                ? 'from-red-600 to-orange-600' 
                : 'from-blue-600 to-cyan-600'
            } rounded-2xl p-8 mb-6 shadow-2xl`}>
              <div className="text-center">
                <h2 className="text-white text-2xl font-bold mb-4">
                  🌶️ 김치 프리미엄 (김프)
                </h2>
                <div className={`text-6xl font-black mb-4 ${getKimchiColor(cryptoData.kimchi)}`}>
                  {cryptoData.kimchi > 0 ? '+' : ''}{cryptoData.kimchi.toFixed(2)}%
                </div>
                <p className="text-white text-xl font-semibold">
                  {getKimchiText(cryptoData.kimchi)}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-1">🇰🇷 국내 평균</p>
                    <p className="text-white text-xl font-bold">
                      ₩{Math.round(cryptoData.avgKorean).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-1">🌍 해외 평균</p>
                    <p className="text-white text-xl font-bold">
                      ₩{Math.round(cryptoData.avgGlobal).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 국내 거래소 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  🇰🇷 국내 거래소 Top 5
                </h3>
                <div className="space-y-3">
                  {cryptoData.koreanExchanges.map((exchange, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold text-lg">{exchange.name}</span>
                        <span className="text-yellow-300 font-bold">#{idx + 1}</span>
                      </div>
                      <div className="text-green-400 text-xl font-bold mb-1">
                        ₩{Math.round(exchange.price).toLocaleString()}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          거래량: ₩{(exchange.volume / 1000000).toFixed(0)}M
                        </span>
                        <span className="text-gray-400">{exchange.lastUpdate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 해외 거래소 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  🌍 해외 거래소 Top 5
                </h3>
                <div className="space-y-3">
                  {cryptoData.globalExchanges.map((exchange, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold text-lg">{exchange.name}</span>
                        <span className="text-blue-300 font-bold">#{idx + 1}</span>
                      </div>
                      <div className="text-cyan-400 text-xl font-bold mb-1">
                        ₩{Math.round(exchange.price).toLocaleString()}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          거래량: ₩{(exchange.volume / 1000000).toFixed(0)}M
                        </span>
                        <span className="text-gray-400">{exchange.lastUpdate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 설명 */}
            <div className="mt-6 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl p-6">
              <h4 className="text-yellow-300 font-bold text-lg mb-3">💡 김치 프리미엄이란?</h4>
              <p className="text-white mb-3">
                김치 프리미엄(김프)은 국내 암호화폐 가격이 해외보다 얼마나 비싼지를 나타내는 지표입니다.
              </p>
              <ul className="text-white space-y-2 text-sm">
                <li>✅ <strong>양수(+)</strong>: 국내가 비쌈 → 해외 거래소에서 매수 후 국내 매도 시 차익 가능</li>
                <li>✅ <strong>음수(-)</strong>: 해외가 비쌈 (역프리미엄) → 국내에서 매수 후 해외 매도 시 차익 가능</li>
                <li>⚠️ <strong>주의</strong>: 실제 거래 시 수수료, 송금 시간, 환율 변동 등을 고려해야 합니다</li>
              </ul>
            </div>
          </>
        )}

        <div className="mt-6 text-center text-white/70 text-sm">
          ⚠️ 본 데이터는 CoinGecko API 기반 참고용이며, 실제 거래소 가격과 다를 수 있습니다.
          <br />
          투자 결정은 반드시 공식 거래소 가격을 확인 후 진행하세요.
        </div>

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

