'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface User {
  id: string;
  nickname: string;
  balance: number;
  total_rewards: number;
}

interface Portfolio {
  id: string;
  asset_type: string;
  quantity: number;
  buy_price: number;
  buy_amount: number;
  created_at: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  asset_type: string;
  quantity: number;
  price: number;
  amount: number;
  profit: number;
  profit_rate: number;
  created_at: string;
}

interface CoinData {
  market: string;
  symbol: string;
  korean_name: string;
  english_name: string;
  trade_price: number;
  signed_change_rate: number;
  signed_change_price: number;
  market_cap: number;
  high_price: number;
  low_price: number;
}

interface GoldPrice {
  buy: number;
  sell: number;
  change: number;
  changePrice: number;
}

export default function InvestmentApp() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // 검색 & 필터
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'market_cap' | 'change_rate' | 'price'>('market_cap');

  // 모달 상태
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);

  // 투자 관련
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [investMoney, setInvestMoney] = useState(1000000);
  const [nickname, setNickname] = useState('');
  const [rankings, setRankings] = useState<any[]>([]);
  const [myRanking, setMyRanking] = useState<any>(null);

  // 탭 상태
  const [activeTab, setActiveTab] = useState<'coins' | 'portfolio' | 'transactions'>('coins');

  useEffect(() => {
    setMounted(true);
  }, []);

  // 사용자 정보 불러오기
  useEffect(() => {
    if (!mounted) return;

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/investment/user');
        const result = await response.json();

        if (result.success && result.data) {
          setUser(result.data);
        } else {
          setShowNicknameModal(true);
        }
      } catch (error) {
        console.error('User fetch error:', error);
      }
    };

    fetchUser();
  }, [mounted]);

  // 코인 데이터 & 포트폴리오 불러오기
  useEffect(() => {
    if (!mounted || !user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Top 50 코인 조회
        const coinsResponse = await fetch('/api/crypto-markets');
        const coinsResult = await coinsResponse.json();

        if (coinsResult.success) {
          setCoins(coinsResult.data.top50);
          setLastUpdate(new Date());
        }

        // 금 시세 조회
        const goldResponse = await fetch('/api/gold-price');
        const goldResult = await goldResponse.json();

        if (goldResult.success) {
          setGoldPrice(goldResult.data);
        }

        // 포트폴리오
        const portfolioResponse = await fetch('/api/investment/portfolio');
        const portfolioResult = await portfolioResponse.json();
        if (portfolioResult.success) {
          setPortfolios(portfolioResult.data);
        }

        // 거래내역
        const txResponse = await fetch('/api/investment/transactions?limit=20');
        const txResult = await txResponse.json();
        if (txResult.success) {
          setTransactions(txResult.data);
        }

      } catch (error) {
        console.error('Data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // 10초마다 갱신 (실시간 수익률 반영)

    return () => clearInterval(interval);
  }, [mounted, user]);

  // 닉네임 등록
  const handleNicknameSubmit = async () => {
    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      alert('닉네임은 2~20자 사이여야 합니다.');
      return;
    }

    try {
      const response = await fetch('/api/investment/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname })
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        setShowNicknameModal(false);
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Nickname submit error:', error);
      alert('닉네임 등록에 실패했습니다.');
    }
  };

  // 매수
  const handleBuy = async () => {
    if (!selectedCoin || !user) return;

    if (investMoney > user.balance) {
      alert('잔액이 부족합니다!');
      return;
    }

    const price = selectedCoin.trade_price;
    const quantity = investMoney / price;

    try {
      const response = await fetch('/api/investment/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_type: selectedCoin.symbol,
          quantity,
          buy_price: price,
          buy_amount: investMoney
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowInvestModal(false);
        setInvestMoney(1000000);

        // 데이터 새로고침
        const userResponse = await fetch('/api/investment/user');
        const userResult = await userResponse.json();
        if (userResult.success) setUser(userResult.data);

        const portfolioResponse = await fetch('/api/investment/portfolio');
        const portfolioResult = await portfolioResponse.json();
        if (portfolioResult.success) setPortfolios(portfolioResult.data);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Buy error:', error);
      alert('매수에 실패했습니다.');
    }
  };

  // 매도
  const handleSell = async (portfolio: Portfolio) => {
    // 순금(GOLD)인 경우 goldPrice 사용, 그 외는 coins 배열에서 찾기
    let assetName = '';
    let currentPrice = 0;

    if (portfolio.asset_type === 'GOLD' && goldPrice) {
      assetName = '순금';
      currentPrice = goldPrice.sell;  // 매수/매도 모두 같은 시세
    } else {
      const currentCoin = coins.find(c => c.symbol === portfolio.asset_type);
      if (!currentCoin) return;
      assetName = currentCoin.korean_name;
      currentPrice = currentCoin.trade_price;
    }

    const sellAmount = Math.floor(portfolio.quantity * currentPrice);
    const profit = sellAmount - portfolio.buy_amount;

    const confirmed = confirm(
      `${assetName} 매도\n\n` +
      `매수가: ${Math.floor(portfolio.buy_amount).toLocaleString()}원\n` +
      `현재가: ${Math.floor(sellAmount).toLocaleString()}원\n` +
      `${profit >= 0 ? '수익' : '손실'}: ${Math.floor(profit).toLocaleString()}원\n\n` +
      `정말 매도하시겠습니까?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/investment/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolio_id: portfolio.id,
          sell_price: currentPrice
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);

        // 데이터 새로고침
        const userResponse = await fetch('/api/investment/user');
        const userResult = await userResponse.json();
        if (userResult.success) setUser(userResult.data);

        const portfolioResponse = await fetch('/api/investment/portfolio');
        const portfolioResult = await portfolioResponse.json();
        if (portfolioResult.success) setPortfolios(portfolioResult.data);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Sell error:', error);
      alert('매도에 실패했습니다.');
    }
  };

  // 랭킹 조회
  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/investment/ranking?limit=50');
      const result = await response.json();

      if (result.success) {
        setRankings(result.data.rankings);
        setMyRanking(result.data.my_ranking);
        setShowRankingModal(true);
      }
    } catch (error) {
      console.error('Ranking fetch error:', error);
    }
  };

  // 포트폴리오 총 가치 계산
  const getPortfolioValue = () => {
    return portfolios.reduce((total, p) => {
      const coin = coins.find(c => c.symbol === p.asset_type);
      if (!coin) return total;
      return total + (p.quantity * coin.trade_price);
    }, 0);
  };

  // 총 자산
  const getTotalAssets = () => {
    return (user?.balance || 0) + getPortfolioValue();
  };

  // 수익률 (초기 자본 1억원 대비)
  const getProfitRate = () => {
    const INITIAL_CAPITAL = 100000000; // 1억원
    const totalAssets = getTotalAssets();
    const profit = totalAssets - INITIAL_CAPITAL;
    return (profit / INITIAL_CAPITAL) * 100;
  };

  // 코인 필터링 & 정렬
  const filteredCoins = coins
    .filter(coin =>
      coin.korean_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'market_cap') return b.market_cap - a.market_cap;
      if (sortBy === 'change_rate') return b.signed_change_rate - a.signed_change_rate;
      if (sortBy === 'price') return b.trade_price - a.trade_price;
      return 0;
    });

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-6xl animate-bounce">💰</div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              모의투자 플랫폼
          </h1>
            <div className="text-6xl animate-bounce delay-150">📈</div>
          </div>
          <p className="text-xl text-gray-300 mb-2">업비트 Top 50 코인 실시간 투자 시뮬레이션</p>

          {/* 리워드 안내 */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-4 max-w-2xl mx-auto mb-4 border border-green-400/30">
            <p className="text-green-300 font-bold text-lg">
              🎁 다른 웹앱 이용 시 하루 제한 없이 1회 결과보기당 50만원 추가!
            </p>
            <p className="text-green-200 text-sm mt-1">
              얼굴상 운세, 손금 보기 등 다양한 웹앱을 즐기고 투자 자금을 모아보세요!
            </p>
        </div>
          {user && (
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                👤 {user.nickname}
              </span>
              <button
                onClick={fetchRankings}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg">
                🏆 랭킹 보기
              </button>
          </div>
          )}
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-2">
              🔄 실시간 업데이트 중 (10초마다 자동 갱신) • 마지막: {lastUpdate.toLocaleTimeString('ko-KR')}
            </p>
          )}
        </header>

        {loading && !user ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mb-4"></div>
            <p className="text-white text-lg">데이터 불러오는 중...</p>
          </div>
        ) : user && (
          <div className="space-y-6">
            {/* 총 자산 카드 */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all"
              style={{
                boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4), inset 0 0 100px rgba(255, 255, 255, 0.1)'
              }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">💎 내 자산</h2>
                <div className="text-right">
                  <p className="text-sm text-white/70 mb-1">수익률</p>
                  <p className={`text-3xl font-black ${getProfitRate() >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {getProfitRate() >= 0 ? '+' : ''}{getProfitRate().toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <p className="text-sm text-white/70 mb-2">총 자산</p>
                  <p className="text-3xl font-black text-white">
                    ₩{Math.floor(getTotalAssets()).toLocaleString()}
                  </p>
                  <p className={`text-sm mt-2 ${(() => {
                    const invested = portfolios.reduce((sum, p) => sum + p.buy_amount, 0);
                    const portfolioValue = getPortfolioValue();
                    return portfolioValue - invested >= 0 ? 'text-green-300' : 'text-red-300';
                  })()}`}>
                    {(() => {
                      const invested = portfolios.reduce((sum, p) => sum + p.buy_amount, 0);
                      const portfolioValue = getPortfolioValue();
                      const profit = portfolioValue - invested;
                      return `${profit >= 0 ? '+' : ''}${Math.floor(profit).toLocaleString()}원`;
                    })()}
                    </p>
                  </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <p className="text-sm text-white/70 mb-2">현금 잔액</p>
                  <p className="text-3xl font-black text-white">
                    ₩{Math.floor(user.balance).toLocaleString()}
                    </p>
                  </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <p className="text-sm text-white/70 mb-2">포트폴리오 가치</p>
                  <p className="text-3xl font-black text-white">
                    ₩{Math.floor(getPortfolioValue()).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {[
                  { key: 'coins', label: '💰 코인 목록', icon: '💰' },
                  { key: 'portfolio', label: '📊 포트폴리오', icon: '📊' },
                  { key: 'transactions', label: '📜 거래내역', icon: '📜' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white scale-105'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 코인 목록 탭 */}
              {activeTab === 'coins' && (
                <div>
                  {/* 검색 & 정렬 */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="코인 검색 (비트코인, BTC, ...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-4 py-3 bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                      <option value="market_cap" className="bg-slate-800">시가총액순</option>
                      <option value="change_rate" className="bg-slate-800">변동률순</option>
                      <option value="price" className="bg-slate-800">가격순</option>
                    </select>
                  </div>

                  {/* 순금 카드 */}
                  {goldPrice && (
                    <div className="mb-6">
                      <h3 className="text-2xl font-black mb-4 text-yellow-400">💎 순금 (1돈 = 3.75g)</h3>
                      <div
                        onClick={() => {
                          setSelectedCoin({
                            market: 'GOLD',
                            symbol: 'GOLD',
                            korean_name: '순금',
                            english_name: 'Pure Gold',
                            trade_price: goldPrice.sell,
                            signed_change_rate: goldPrice.change / 100,
                            signed_change_price: goldPrice.changePrice,
                            market_cap: 0,
                            high_price: goldPrice.sell,
                            low_price: goldPrice.buy
                          } as CoinData);
                          setShowInvestModal(true);
                        }}
                        className="bg-gradient-to-br from-yellow-500/20 via-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-6 border-2 border-yellow-400/30 hover:scale-105 hover:border-yellow-400 transition-all cursor-pointer group shadow-xl"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-5xl">💰</span>
                            <div>
                              <p className="font-black text-2xl text-yellow-300">순금 (1돈)</p>
                              <p className="text-sm text-yellow-200/70">한국금거래소</p>
                            </div>
                          </div>
                          <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
                            <span className="text-yellow-300 font-bold">SAFE</span>
                          </div>
                      </div>

                        <div className="bg-black/30 rounded-xl p-6 mb-4">
                          <p className="text-sm text-yellow-200/70 mb-2">순금 시세 (1돈 = 3.75g)</p>
                          <p className="text-4xl font-black text-yellow-300 mb-3">
                            ₩{Math.floor(goldPrice.sell).toLocaleString()}
                          </p>
                          <p className="text-xs text-yellow-200/50">
                            📊 네이버 금융 실시간 시세 반영 (1분마다 자동 갱신)
                          </p>
                      </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-yellow-200/70">24시간 변동</p>
                            <p className={`font-bold text-lg ${goldPrice.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                              {goldPrice.change >= 0 ? '▲' : '▼'} {Math.abs(goldPrice.change).toFixed(2)}%
                              <span className="text-sm ml-2">
                                ({goldPrice.change >= 0 ? '+' : ''}{Math.floor(goldPrice.changePrice).toLocaleString()}원)
                        </span>
                            </p>
                          </div>
                          <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-black rounded-xl hover:scale-110 transition-all group-hover:animate-pulse shadow-lg">
                            매수
                          </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-yellow-400/20">
                          <p className="text-xs text-yellow-200/70 text-center">
                            ⚠️ 안전자산으로 변동성이 낮지만 수익률도 제한적입니다
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 코인 리스트 */}
                  <h3 className="text-2xl font-black mb-4 text-cyan-400">🪙 암호화폐</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                    {filteredCoins.map((coin, index) => (
                      <div
                        key={coin.market}
                        onClick={() => { setSelectedCoin(coin); setShowInvestModal(true); }}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:scale-105 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-cyan-400">#{index + 1}</span>
                            <div>
                              <p className="font-bold text-lg">{coin.korean_name}</p>
                              <p className="text-xs text-gray-400">{coin.symbol}</p>
                            </div>
                </div>
              </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-400">현재가</p>
                            <p className="text-xl font-black">₩{Math.floor(coin.trade_price).toLocaleString()}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-400">24시간 변동</p>
                              <p className={`font-bold ${coin.signed_change_rate >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                {coin.signed_change_rate >= 0 ? '▲' : '▼'} {Math.abs(coin.signed_change_rate * 100).toFixed(2)}%
                              </p>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:scale-110 transition-all group-hover:animate-pulse">
                              매수
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 포트폴리오 탭 */}
              {activeTab === 'portfolio' && (
                <div>
                  <h3 className="text-2xl font-black mb-4">보유 자산 ({portfolios.length}개)</h3>
                  {portfolios.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      아직 보유한 자산이 없습니다
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {portfolios.map(p => {
                        // 순금(GOLD)인 경우 goldPrice 사용, 그 외는 coins 배열에서 찾기
                        let assetInfo: { korean_name: string; symbol: string; trade_price: number } | null = null;
                        
                        if (p.asset_type === 'GOLD' && goldPrice) {
                          assetInfo = {
                            korean_name: '순금',
                            symbol: 'GOLD',
                            trade_price: goldPrice.sell  // 매수/매도 모두 같은 시세
                          };
                        } else {
                          const coin = coins.find(c => c.symbol === p.asset_type);
                          if (coin) {
                            assetInfo = {
                              korean_name: coin.korean_name,
                              symbol: coin.symbol,
                              trade_price: coin.trade_price
                            };
                          }
                        }

                        if (!assetInfo) return null;

                        const currentValue = p.quantity * assetInfo.trade_price;
                        const profit = currentValue - p.buy_amount;
                        const profitPct = (profit / p.buy_amount) * 100;

                        return (
                          <div key={p.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="text-lg font-bold">{assetInfo.korean_name}</p>
                                <p className="text-xs text-gray-400">{assetInfo.symbol}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(p.created_at).toLocaleString('ko-KR')}
                                </p>
                              </div>
                              <button
                                onClick={() => handleSell(p)}
                                className="px-4 py-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg text-sm transition-all">
                                매도
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-400">투자금</p>
                                <p className="font-bold">₩{Math.floor(p.buy_amount).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">현재가</p>
                                <p className="font-bold">₩{Math.floor(currentValue).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">수량</p>
                                <p className="font-bold">{p.quantity.toFixed(8)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">수익률</p>
                                <p className={`font-bold ${profit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                  {profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
                                </p>
                              </div>
                      </div>
                      </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 거래내역 탭 */}
              {activeTab === 'transactions' && (
                <div>
                  <h3 className="text-2xl font-black mb-4">거래 내역 ({transactions.length}건)</h3>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      거래 내역이 없습니다
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {transactions.map(tx => {
                        // 순금(GOLD)인 경우 처리
                        let assetName = tx.asset_type;
                        if (tx.asset_type === 'GOLD') {
                          assetName = '순금';
                        } else {
                          const coin = coins.find(c => c.symbol === tx.asset_type);
                          assetName = coin?.korean_name || tx.asset_type;
                        }

                        return (
                          <div key={tx.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-bold">
                                    {tx.transaction_type === 'buy' ? '매수' : '매도'} - {assetName}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(tx.created_at).toLocaleString('ko-KR')}
                                  </p>
              </div>
            </div>
                              <div className="text-right">
                                <p className="font-bold">₩{Math.floor(tx.amount).toLocaleString()}</p>
                                {tx.transaction_type === 'sell' && (
                                  <p className={`text-sm ${tx.profit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                    {tx.profit >= 0 ? '+' : ''}{Math.floor(tx.profit).toLocaleString()}원 ({tx.profit_rate.toFixed(2)}%)
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 닉네임 등록 모달 */}
      {showNicknameModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border-2 border-white/30 shadow-2xl">
            <h3 className="text-3xl font-black mb-4">🎉 환영합니다!</h3>
            <p className="text-gray-300 mb-6">닉네임을 설정하고 1억원으로 투자를 시작하세요!</p>

            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력 (2~20자)"
              className="w-full px-4 py-3 bg-white/20 text-white rounded-xl mb-4 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              maxLength={20}
            />

            <button
              onClick={handleNicknameSubmit}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-all">
              시작하기
            </button>
          </div>
        </div>
      )}

      {/* 투자 모달 */}
      {showInvestModal && selectedCoin && user && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border-2 border-white/30 shadow-2xl">
            <h3 className="text-3xl font-black mb-4">
              {selectedCoin.korean_name} ({selectedCoin.symbol}) 매수
            </h3>

            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">현재 가격</p>
              <p className="text-3xl font-black">
                ₩{Math.floor(selectedCoin.trade_price).toLocaleString()}
              </p>
              <p className={`text-sm mt-1 ${selectedCoin.signed_change_rate >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                24시간: {selectedCoin.signed_change_rate >= 0 ? '▲' : '▼'} {Math.abs(selectedCoin.signed_change_rate * 100).toFixed(2)}%
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-2">투자 금액</p>
              <input
                type="range"
                min="100000"
                max={user.balance}
                step="100000"
                value={investMoney}
                onChange={(e) => setInvestMoney(Number(e.target.value))}
                className="w-full mb-3"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={investMoney}
                  onChange={(e) => setInvestMoney(Number(e.target.value))}
                  className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg text-right font-bold"
                  max={user.balance}
                />
                <span className="text-white">원</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                구매 수량: {(investMoney / selectedCoin.trade_price).toFixed(8)} {selectedCoin.symbol}
              </p>
        </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInvestModal(false)}
                className="flex-1 px-4 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
                취소
              </button>
              <button
                onClick={handleBuy}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:scale-105 transition-all">
                매수하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 랭킹 모달 */}
      {showRankingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 max-w-2xl w-full border-2 border-white/30 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black">🏆 투자자 랭킹</h3>
              <button
                onClick={() => setShowRankingModal(false)}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all">
                닫기
              </button>
            </div>

            {myRanking && (
              <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-400/30">
                <p className="text-sm text-gray-300 mb-2">내 순위</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black">{myRanking.rank}위 - {myRanking.nickname}</p>
                    <p className="text-lg text-gray-300">₩{Math.floor(myRanking.total_assets).toLocaleString()}</p>
                  </div>
                  <p className={`text-3xl font-black ${myRanking.profit_rate >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {myRanking.profit_rate >= 0 ? '+' : ''}{myRanking.profit_rate.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {rankings.map((r) => (
                <div key={r.rank} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-black ${r.rank <= 3 ? 'text-yellow-300' : 'text-gray-400'}`}>
                        {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `${r.rank}위`}
                      </span>
                      <div>
                        <p className="font-bold text-xl">{r.nickname}</p>
                        <p className="text-lg text-gray-300">
                          ₩{Math.floor(r.total_assets).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className={`text-3xl font-black ${r.profit_rate >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {r.profit_rate >= 0 ? '+' : ''}{r.profit_rate.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
      </div>
    </div>
      )}
    </main>
  );
}
