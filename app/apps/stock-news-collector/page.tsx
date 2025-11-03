'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  stocks: string[];
  isRead: boolean;
}

interface Stock {
  symbol: string;
  name: string;
  emoji: string;
}

export default function StockNewsCollector() {
  const [stocks] = useState<Stock[]>([
    { symbol: 'AAPL', name: '애플', emoji: '🍎' },
    { symbol: 'MSFT', name: '마이크로소프트', emoji: '💻' },
    { symbol: 'GOOGL', name: '구글', emoji: '🔍' },
    { symbol: 'AMZN', name: '아마존', emoji: '📦' },
    { symbol: 'TSLA', name: '테슬라', emoji: '⚡' },
    { symbol: 'NVDA', name: '엔비디아', emoji: '🎮' },
    { symbol: 'META', name: '메타', emoji: '👤' },
    { symbol: 'NFLX', name: '넷플릭스', emoji: '🎬' },
  ]);

  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [news, setNews] = useState<NewsItem[]>([]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'positive' | 'negative'>('all');
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 로컬스토리지에서 데이터 불러오기
  useEffect(() => {
    const savedSelectedStocks = localStorage.getItem('stock-news-selected-stocks');
    const savedKeywords = localStorage.getItem('stock-news-keywords');
    const savedNews = localStorage.getItem('stock-news-items');
    const savedNotificationEnabled = localStorage.getItem('stock-news-notification-enabled');

    if (savedSelectedStocks) {
      setSelectedStocks(JSON.parse(savedSelectedStocks));
    } else {
      setSelectedStocks(['AAPL', 'TSLA']);
    }

    if (savedKeywords) {
      setKeywords(JSON.parse(savedKeywords));
    } else {
      setKeywords(['실적', '배당', '신제품']);
    }

    if (savedNews) {
      try {
        const parsed = JSON.parse(savedNews);
        const restored = parsed.map((n: any) => ({
          ...n,
          publishedAt: new Date(n.publishedAt),
        }));
        setNews(restored);
      } catch (error) {
        console.error('뉴스 데이터 로드 실패:', error);
        initializeSampleNews();
      }
    } else {
      initializeSampleNews();
    }

    if (savedNotificationEnabled) {
      setNotificationEnabled(savedNotificationEnabled === 'true');
    }

    setLoading(false);
  }, []);

  // 데이터가 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('stock-news-selected-stocks', JSON.stringify(selectedStocks));
    }
  }, [selectedStocks, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('stock-news-keywords', JSON.stringify(keywords));
    }
  }, [keywords, loading]);

  useEffect(() => {
    if (!loading && news.length > 0) {
      localStorage.setItem('stock-news-items', JSON.stringify(news));
    }
  }, [news, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('stock-news-notification-enabled', notificationEnabled.toString());
    }
  }, [notificationEnabled, loading]);

  const initializeSampleNews = () => {
    const sampleNews: NewsItem[] = [
      {
        id: '1',
        title: '애플, 아이폰 15 판매량 예상치 상회',
        summary: '애플의 최신 아이폰 15 시리즈가 출시 첫 주 판매량이 전년 대비 20% 증가하며 시장 예상을 뛰어넘었습니다.',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        url: '#',
        sentiment: 'positive',
        stocks: ['AAPL'],
        isRead: false,
      },
      {
        id: '2',
        title: '테슬라, 배터리 기술 혁신 발표',
        summary: '테슬라가 새로운 4680 배터리 셀 생산 기술을 공개하며 생산 비용 30% 절감 가능성을 제시했습니다.',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        url: '#',
        sentiment: 'positive',
        stocks: ['TSLA'],
        isRead: false,
      },
      {
        id: '3',
        title: '애플, 중국 시장 점유율 하락 우려',
        summary: '중국 내 경쟁 심화로 애플의 시장 점유율이 전분기 대비 2.5% 하락한 것으로 조사됐습니다.',
        source: 'CNBC',
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        url: '#',
        sentiment: 'negative',
        stocks: ['AAPL'],
        isRead: false,
      },
    ];
    setNews(sampleNews);
  };

  useEffect(() => {
    // 뉴스 자동 수집 시뮬레이션
    const interval = setInterval(() => {
      const chance = Math.random();
      if (chance < 0.3 && selectedStocks.length > 0) {
        // 30% 확률로 새 뉴스 추가
        const randomStock = selectedStocks[Math.floor(Math.random() * selectedStocks.length)];
        const stock = stocks.find((s) => s.symbol === randomStock);

        const newNews: NewsItem = {
          id: Date.now().toString(),
          title: generateRandomTitle(stock?.name || ''),
          summary: generateRandomSummary(),
          source: ['Bloomberg', 'Reuters', 'CNBC', 'WSJ'][Math.floor(Math.random() * 4)],
          publishedAt: new Date(),
          url: '#',
          sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
          stocks: [randomStock],
          isRead: false,
        };

        setNews((prev) => [newNews, ...prev]);

        // 키워드 알림
        const hasKeyword = keywords.some((keyword) =>
          newNews.title.includes(keyword) || newNews.summary.includes(keyword)
        );

        if (hasKeyword && notificationEnabled && Notification.permission === 'granted') {
          new Notification('주식 뉴스 알림', {
            body: `${stock?.emoji} ${newNews.title}`,
            icon: '📰',
          });
        }
      }
    }, 10000); // 10초마다 체크

    return () => clearInterval(interval);
  }, [selectedStocks, keywords, notificationEnabled]);

  const generateRandomTitle = (stockName: string) => {
    const templates = [
      `${stockName}, 신규 특허 출원 발표`,
      `${stockName} CEO, 향후 전략 공개`,
      `${stockName}, 분기 실적 발표 임박`,
      `${stockName}, 새로운 파트너십 체결`,
      `${stockName} 주가, 애널리스트 전망치 상회`,
      `${stockName}, 신제품 출시 예고`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateRandomSummary = () => {
    const summaries = [
      '업계 전문가들은 이번 발표가 향후 실적에 긍정적인 영향을 미칠 것으로 전망하고 있습니다.',
      '시장은 이번 소식에 즉각 반응하며 주가가 장중 급등세를 보였습니다.',
      '애널리스트들은 목표주가를 상향 조정하며 매수 의견을 제시했습니다.',
      '경쟁사 대비 기술적 우위를 확보하며 시장 지배력을 강화할 것으로 예상됩니다.',
      '이번 분기 실적이 시장 예상치를 크게 상회할 것으로 전망됩니다.',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationEnabled(permission === 'granted');
    } else if (Notification.permission === 'granted') {
      setNotificationEnabled(true);
    }
  };

  const toggleStock = (symbol: string) => {
    setSelectedStocks((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
      setShowKeywordModal(false);
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const markAsRead = (id: string) => {
    setNews(news.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const filteredNews = news.filter((n) => {
    if (filter === 'unread' && n.isRead) return false;
    if (filter === 'positive' && n.sentiment !== 'positive') return false;
    if (filter === 'negative' && n.sentiment !== 'negative') return false;
    return n.stocks.some((stock) => selectedStocks.includes(stock));
  });

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'text-green-400 bg-green-500/20';
    if (sentiment === 'negative') return 'text-red-400 bg-red-500/20';
    return 'text-gray-400 bg-gray-500/20';
  };

  const getSentimentEmoji = (sentiment: string) => {
    if (sentiment === 'positive') return '📈';
    if (sentiment === 'negative') return '📉';
    return '➡️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">📰 주식 뉴스 수집기</h1>
          <p className="text-base sm:text-lg text-pink-200">
            관심 종목 뉴스 자동 수집 및 키워드 알림
          </p>
        </motion.div>

        {/* 관심 종목 선택 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-6 border border-white/20"
        >
          <h2 className="text-xl font-bold mb-4">📊 관심 종목</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {stocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => toggleStock(stock.symbol)}
                className={`p-3 rounded-lg font-semibold transition-all min-h-[60px] touch-manipulation ${
                  selectedStocks.includes(stock.symbol)
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{stock.emoji}</div>
                <div className="text-xs">{stock.symbol}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 키워드 & 알림 설정 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-6 border border-white/20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-bold">🔔 키워드 알림</h2>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowKeywordModal(true)}
                className="bg-pink-500/20 hover:bg-pink-500/30 px-4 py-2 rounded-lg font-semibold transition-all min-h-[44px] touch-manipulation"
              >
                + 키워드 추가
              </button>
              <button
                onClick={requestNotificationPermission}
                className={`px-4 py-2 rounded-lg font-semibold transition-all min-h-[44px] touch-manipulation ${
                  notificationEnabled
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-gray-500/20 text-gray-300'
                }`}
              >
                {notificationEnabled ? '🔔 알림 활성' : '🔕 알림 비활성'}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="bg-pink-500/30 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </motion.div>

        {/* 필터 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/20"
        >
          <div className="flex flex-wrap gap-2">
            {(['all', 'unread', 'positive', 'negative'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all min-h-[44px] touch-manipulation ${
                  filter === f
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {f === 'all' && '전체'}
                {f === 'unread' && '안 읽음'}
                {f === 'positive' && '📈 긍정'}
                {f === 'negative' && '📉 부정'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 뉴스 목록 */}
        <div className="space-y-4 mb-8">
          <AnimatePresence>
            {filteredNews.map((item, index) => {
              const stock = stocks.find((s) => item.stocks.includes(s.symbol));
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border transition-all ${
                    item.isRead ? 'border-white/10 opacity-60' : 'border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{stock?.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-pink-300">{item.source}</span>
                        <span className="text-xs text-pink-300">
                          {Math.floor((Date.now() - item.publishedAt.getTime()) / 3600000)}시간 전
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(item.sentiment)}`}>
                          {getSentimentEmoji(item.sentiment)} {item.sentiment}
                        </span>
                        {!item.isRead && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm sm:text-base text-pink-200 mb-4">{item.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => markAsRead(item.id)}
                          className="bg-pink-500/20 hover:bg-pink-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all min-h-[44px] touch-manipulation inline-flex items-center"
                        >
                          자세히 보기
                        </a>
                        {!item.isRead && (
                          <button
                            onClick={() => markAsRead(item.id)}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                          >
                            읽음 표시
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20 text-pink-300">
            조건에 맞는 뉴스가 없습니다.
          </div>
        )}

        {/* 키워드 추가 모달 */}
        <AnimatePresence>
          {showKeywordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowKeywordModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-6">키워드 추가</h3>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                  placeholder="예: 실적, 배당, 신제품"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowKeywordModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation"
                  >
                    취소
                  </button>
                  <button
                    onClick={addKeyword}
                    disabled={!newKeyword.trim()}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation"
                  >
                    추가
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold mb-4">💡 사용 방법</h3>
          <ul className="space-y-2 text-sm text-pink-200">
            <li>• 관심 종목을 선택하여 해당 종목 뉴스만 수집</li>
            <li>• 키워드를 등록하면 관련 뉴스 발생 시 알림</li>
            <li>• 10초마다 새로운 뉴스를 자동으로 체크</li>
            <li>• 긍정/부정 감성 분석으로 뉴스 영향도 파악</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
