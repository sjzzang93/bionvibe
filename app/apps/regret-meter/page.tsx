"use client";

import { useState, useEffect, useMemo } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

interface SavedItem {
  name: string;
  price: number;
  regretScore: number;
  didBuy: boolean;
  date: string;
  category: string;
  analysis: {
    priceImpact: number;
    timeImpact: number;
    dayImpact: number;
    randomFactor: number;
  };
}

const CATEGORIES = [
  { id: 'fashion', name: '의류/패션', emoji: '👗', multiplier: 1.2 },
  { id: 'electronics', name: '전자제품', emoji: '📱', multiplier: 1.3 },
  { id: 'food', name: '음식/배달', emoji: '🍕', multiplier: 0.8 },
  { id: 'beauty', name: '화장품/미용', emoji: '💄', multiplier: 1.1 },
  { id: 'hobby', name: '취미/레저', emoji: '🎮', multiplier: 1.0 },
  { id: 'furniture', name: '가구/인테리어', emoji: '🛋️', multiplier: 1.4 },
  { id: 'book', name: '도서/교육', emoji: '📚', multiplier: 0.7 },
  { id: 'etc', name: '기타', emoji: '📦', multiplier: 1.0 },
];

export default function RegretMeter() {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result' | 'cooling' | 'decision'>('input');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('fashion');
  const [countdown, setCountdown] = useState(0);
  const [regretScore, setRegretScore] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Load saved items
  useEffect(() => {
    const saved = localStorage.getItem('regret_saved');
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (step === 'cooling' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
    } else if (countdown === 0 && step === 'cooling') {
      setStep('decision');
    }
    return () => clearInterval(interval);
  }, [step, countdown]);

  // Score animation
  useEffect(() => {
    if (step === 'result' && animatedScore < regretScore) {
      const timer = setTimeout(() => {
        setAnimatedScore(prev => Math.min(prev + 2, regretScore));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [step, animatedScore, regretScore]);

  const analyze = () => {
    if (!itemName || !price) {
      alert('상품명과 가격을 입력해주세요!');
      return;
    }

    const priceNum = parseInt(price.replace(/,/g, ''));
    if (isNaN(priceNum) || priceNum < 0) {
      alert('올바른 가격을 입력해주세요!');
      return;
    }

    setStep('analyzing');
    setTimeout(() => {
      const result = calculateRegretScore(priceNum);
      setRegretScore(result.score);
      setAnalysis(result.analysis);
      setAnimatedScore(0);
      setStep('result');

      setTimeout(() => {
        const cooltime = Math.round(result.score * 3);
        setCountdown(cooltime);
        setStep('cooling');
      }, 3000);
    }, 2000);
  };

  const calculateRegretScore = (priceNum: number) => {
    const categoryData = CATEGORIES.find(c => c.id === category);
    const multiplier = categoryData?.multiplier || 1.0;

    // 가격 영향도 (0-35점)
    let priceImpact = 0;
    if (priceNum >= 2000000) priceImpact = 35;
    else if (priceNum >= 1000000) priceImpact = 32;
    else if (priceNum >= 500000) priceImpact = 28;
    else if (priceNum >= 300000) priceImpact = 24;
    else if (priceNum >= 100000) priceImpact = 20;
    else if (priceNum >= 50000) priceImpact = 15;
    else if (priceNum >= 30000) priceImpact = 10;
    else if (priceNum >= 10000) priceImpact = 7;
    else priceImpact = 3;

    // 시간대 영향도 (0-20점)
    const hour = new Date().getHours();
    let timeImpact = 0;
    if (hour >= 23 || hour < 6) timeImpact = 20; // 밤/새벽 충동구매 위험
    else if (hour >= 21 && hour < 23) timeImpact = 18; // 저녁
    else if (hour >= 12 && hour < 14) timeImpact = 12; // 점심시간
    else if (hour >= 9 && hour < 12) timeImpact = 8; // 오전
    else if (hour >= 14 && hour < 18) timeImpact = 10; // 오후
    else timeImpact = 15; // 저녁 시간대

    // 요일 영향도 (0-15점)
    const day = new Date().getDay();
    let dayImpact = 0;
    if (day === 0) dayImpact = 15; // 일요일 (한주 마지막)
    else if (day === 6) dayImpact = 13; // 토요일
    else if (day === 5) dayImpact = 12; // 금요일 (주말 앞)
    else if (day === 1) dayImpact = 10; // 월요일 (보상심리)
    else dayImpact = 8; // 평일

    // 랜덤 요소 (심리 변수, 0-20점)
    const randomFactor = Math.random() * 20;

    // 카테고리 보정 (0-10점)
    const categoryImpact = multiplier * 10;

    const baseScore = priceImpact + timeImpact + dayImpact + randomFactor + categoryImpact;
    const finalScore = Math.min(100, Math.max(0, Math.round(baseScore)));

    return {
      score: finalScore,
      analysis: {
        priceImpact: Math.round(priceImpact),
        timeImpact: Math.round(timeImpact),
        dayImpact: Math.round(dayImpact),
        randomFactor: Math.round(randomFactor),
        categoryImpact: Math.round(categoryImpact),
        multiplier
      }
    };
  };

  const saveDecision = (didBuy: boolean) => {
    const priceNum = parseInt(price.replace(/,/g, ''));

    const newItem: SavedItem = {
      name: itemName,
      price: priceNum,
      regretScore,
      didBuy,
      date: new Date().toISOString().split('T')[0],
      category,
      analysis: analysis
    };

    const updated = [newItem, ...savedItems].slice(0, 50);
    setSavedItems(updated);
    localStorage.setItem('regret_saved', JSON.stringify(updated));

    if (!didBuy) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    // Reset
    setItemName('');
    setPrice('');
    setCategory('fashion');
    setRegretScore(0);
    setAnalysis(null);
    setCountdown(0);
    setStep('input');
    setAnimatedScore(0);
  };

  const getRegretLevel = (score: number) => {
    if (score >= 85) return {
      label: '극도로 위험!',
      emoji: '🚨',
      color: 'from-red-600 via-red-700 to-red-900',
      bgColor: 'from-red-500/30 to-red-900/50',
      message: '지금은 절대 사면 안 됩니다!',
      advice: '최소 1주일 후에 다시 생각해보세요. 이 가격이면 더 가치있는 투자가 가능합니다.'
    };
    if (score >= 70) return {
      label: '많이 후회할 확률',
      emoji: '😰',
      color: 'from-orange-500 via-red-500 to-red-600',
      bgColor: 'from-orange-500/30 to-red-500/50',
      message: '충동구매 확률이 매우 높습니다',
      advice: '비슷한 제품을 3군데 이상 비교해보고, 일주일 뒤에도 생각나면 구매하세요.'
    };
    if (score >= 50) return {
      label: '후회 가능성 있음',
      emoji: '🤔',
      color: 'from-yellow-500 via-orange-500 to-red-400',
      bgColor: 'from-yellow-500/30 to-orange-500/50',
      message: '신중한 판단이 필요합니다',
      advice: '정말 필요한지, 대체재는 없는지 고민해보세요. 3일 후에도 생각나면 구매하세요.'
    };
    if (score >= 30) return {
      label: '적당한 수준',
      emoji: '😊',
      color: 'from-green-500 via-blue-500 to-cyan-500',
      bgColor: 'from-green-500/30 to-blue-500/50',
      message: '합리적인 소비입니다',
      advice: '가격 대비 만족도가 높을 것으로 예상됩니다. 하루만 더 생각해보세요.'
    };
    return {
      label: '매우 합리적',
      emoji: '✨',
      color: 'from-emerald-500 via-green-500 to-teal-500',
      bgColor: 'from-emerald-500/30 to-green-500/50',
      message: '좋은 선택입니다!',
      advice: '필요한 물건이라면 구매해도 좋습니다. 하지만 꼭 필요한지 다시 한 번만 확인하세요.'
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Statistics
  const stats = useMemo(() => {
    const totalSaved = savedItems.filter(i => !i.didBuy).reduce((sum, i) => sum + i.price, 0);
    const totalSpent = savedItems.filter(i => i.didBuy).reduce((sum, i) => sum + i.price, 0);
    const savedCount = savedItems.filter(i => !i.didBuy).length;
    const boughtCount = savedItems.filter(i => i.didBuy).length;
    const avgRegret = savedItems.length > 0
      ? Math.round(savedItems.reduce((sum, i) => sum + i.regretScore, 0) / savedItems.length)
      : 0;

    // Monthly data
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyItems = savedItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
    });
    const monthlySaved = monthlyItems.filter(i => !i.didBuy).reduce((sum, i) => sum + i.price, 0);
    const monthlySpent = monthlyItems.filter(i => i.didBuy).reduce((sum, i) => sum + i.price, 0);

    return {
      totalSaved,
      totalSpent,
      savedCount,
      boughtCount,
      savingRate: totalSaved + totalSpent > 0
        ? Math.round((totalSaved / (totalSaved + totalSpent)) * 100)
        : 0,
      avgRegret,
      monthlySaved,
      monthlySpent
    };
  }, [savedItems]);

  const level = getRegretLevel(regretScore);

  return (
    <PremiumLayout theme="orange">
      
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-200 via-red-200 to-yellow-200 bg-clip-text text-transparent">
            💸 소비 후회도 측정기
          </h1>
          <p className="text-xl text-white/80">AI가 분석하는 충동구매 방지 시스템</p>
        </div>

        {/* Input Step */}
        {step === 'input' && (
          <div className="space-y-6 animate-slideUp">
            <PremiumCard hover gradient>
              <h3 className="text-white text-2xl font-bold mb-6 text-center">🛒 구매 고민 상품 정보</h3>

              <div className="space-y-5">
                {/* Category Selection */}
                <div>
                  <label className="text-white font-bold mb-3 block text-lg">카테고리</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 ${
                          category === cat.id
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg scale-105'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <div className="text-3xl mb-2">{cat.emoji}</div>
                        <div className="text-sm">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item Name */}
                <div>
                  <label className="text-white font-bold mb-2 block text-lg">상품명</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="예: 에어팟 맥스, 명품 가방, 최신 스마트폰"
                    maxLength={50}
                    className="w-full px-4 py-4 rounded-xl text-black font-bold text-lg border-4 border-white/20 focus:border-orange-400 outline-none transition-all"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-white font-bold mb-2 block text-lg">가격 (원)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => {
                      const num = e.target.value.replace(/[^0-9]/g, '');
                      setPrice(num ? parseInt(num).toLocaleString() : '');
                    }}
                    placeholder="예: 500,000"
                    className="w-full px-4 py-4 rounded-xl text-black font-bold text-2xl text-right border-4 border-white/20 focus:border-orange-400 outline-none transition-all"
                  />
                </div>
              </div>

              <PremiumButton
                onClick={analyze}
                variant="primary"
                size="lg"
                icon="🔍"
                fullWidth
                className="mt-6"
              >
                AI 후회도 분석 시작
              </PremiumButton>
            </PremiumCard>

            {/* Statistics if available */}
            {savedItems.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                <PremiumCard hover className="bg-gradient-to-br from-green-500/20 to-emerald-500/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <div className="text-white/80 text-sm mb-1">총 절약</div>
                    <div className="text-2xl font-bold text-green-300">{stats.totalSaved.toLocaleString()}원</div>
                  </div>
                </PremiumCard>

                <PremiumCard hover className="bg-gradient-to-br from-red-500/20 to-rose-500/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🛒</div>
                    <div className="text-white/80 text-sm mb-1">총 소비</div>
                    <div className="text-2xl font-bold text-red-300">{stats.totalSpent.toLocaleString()}원</div>
                  </div>
                </PremiumCard>

                <PremiumCard hover className="bg-gradient-to-br from-yellow-500/20 to-orange-500/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-white/80 text-sm mb-1">절약률</div>
                    <div className="text-2xl font-bold text-yellow-300">{stats.savingRate}%</div>
                  </div>
                </PremiumCard>

                <PremiumCard hover className="bg-gradient-to-br from-purple-500/20 to-pink-500/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="text-white/80 text-sm mb-1">참은 횟수</div>
                    <div className="text-2xl font-bold text-purple-300">{stats.savedCount}회</div>
                  </div>
                </PremiumCard>
              </div>
            )}
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <PremiumCard hover gradient className="animate-pulse-slow">
            <div className="text-center py-12">
              <div className="text-8xl mb-6 animate-spin-slow">🔍</div>
              <h3 className="text-white text-3xl font-bold mb-4">AI 분석 중...</h3>
              <p className="text-white/80 text-lg">가격, 시간, 심리 패턴을 분석하고 있습니다</p>
              <div className="mt-8 flex justify-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </PremiumCard>
        )}

        {/* Result Step */}
        {step === 'result' && (
          <div className="space-y-6 animate-scaleIn">
            {/* Main Score */}
            <PremiumCard hover gradient className={`bg-gradient-to-br ${level.bgColor}`}>
              <div className="text-center">
                <div className="text-8xl mb-6 animate-bounce-slow">{level.emoji}</div>

                {/* Circular Progress */}
                <div className="relative inline-block mb-6">
                  <svg className="transform -rotate-90" width="200" height="200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(animatedScore / 100) * 565} 565`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="50%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">{animatedScore}</span>
                  </div>
                </div>

                <div className={`inline-block px-8 py-4 rounded-full font-bold text-2xl text-white bg-gradient-to-r ${level.color} mb-4 shadow-2xl`}>
                  {level.label}
                </div>

                <p className="text-white text-xl font-bold mb-2">{level.message}</p>
                <p className="text-white/80 text-lg px-4">{level.advice}</p>
              </div>
            </PremiumCard>

            {/* Detailed Analysis */}
            <PremiumCard hover gradient>
              <h3 className="text-white text-2xl font-bold mb-6 text-center">📊 상세 분석</h3>
              <div className="space-y-4">
                <AnalysisBar
                  label="💰 가격 영향도"
                  value={analysis.priceImpact}
                  max={35}
                  color="from-blue-500 to-cyan-500"
                />
                <AnalysisBar
                  label="⏰ 시간대 영향도"
                  value={analysis.timeImpact}
                  max={20}
                  color="from-purple-500 to-pink-500"
                />
                <AnalysisBar
                  label="📅 요일 영향도"
                  value={analysis.dayImpact}
                  max={15}
                  color="from-green-500 to-emerald-500"
                />
                <AnalysisBar
                  label="🎲 심리 변수"
                  value={analysis.randomFactor}
                  max={20}
                  color="from-yellow-500 to-orange-500"
                />
                <AnalysisBar
                  label={`${CATEGORIES.find(c => c.id === category)?.emoji} 카테고리 보정`}
                  value={analysis.categoryImpact}
                  max={14}
                  color="from-red-500 to-rose-500"
                />
              </div>
            </PremiumCard>
          </div>
        )}

        {/* Cooling Step */}
        {step === 'cooling' && countdown > 0 && (
          <PremiumCard hover className={`animate-pulse-slow bg-gradient-to-br ${level.bgColor}`}>
            <div className="text-center">
              <h3 className="text-white text-3xl font-bold mb-6">⏳ 쿨링타임</h3>
              <div className="text-9xl font-bold text-white mb-6 font-mono animate-pulse">
                {formatTime(countdown)}
              </div>
              <p className="text-white/90 text-xl mb-8">정말 필요한 물건인지 다시 한번 생각해보세요</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-white/20 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-6 transition-all duration-1000 flex items-center justify-center text-white font-bold text-sm"
                    style={{ width: `${(countdown / (regretScore * 3)) * 100}%` }}
                  >
                    {Math.round((countdown / (regretScore * 3)) * 100)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">🤔</div>
                  <div className="text-white font-bold mb-1">대체재 검색</div>
                  <div className="text-white/70 text-sm">더 저렴한 대안은 없을까요?</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">💭</div>
                  <div className="text-white font-bold mb-1">필요성 재검토</div>
                  <div className="text-white/70 text-sm">정말 지금 필요한가요?</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-white font-bold mb-1">예산 확인</div>
                  <div className="text-white/70 text-sm">이번 달 예산은 충분한가요?</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">⏰</div>
                  <div className="text-white font-bold mb-1">미래 사용성</div>
                  <div className="text-white/70 text-sm">3개월 후에도 사용할까요?</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-white font-bold mb-1">중복 확인</div>
                  <div className="text-white/70 text-sm">비슷한 제품을 이미 가지고 있나요?</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">🏷️</div>
                  <div className="text-white font-bold mb-1">할인 대기</div>
                  <div className="text-white/70 text-sm">세일을 기다려볼 수 있나요?</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">♻️</div>
                  <div className="text-white font-bold mb-1">중고 구매</div>
                  <div className="text-white/70 text-sm">중고로 구매 가능한가요?</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">🤝</div>
                  <div className="text-white font-bold mb-1">대여/공유</div>
                  <div className="text-white/70 text-sm">빌리거나 공유할 수 있나요?</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-white font-bold mb-1">가성비 비교</div>
                  <div className="text-white/70 text-sm">가격 대비 만족도는 충분한가요?</div>
                </div>
              </div>
            </div>
          </PremiumCard>
        )}

        {/* Decision Step */}
        {step === 'decision' && (
          <PremiumCard hover gradient className="animate-scaleIn">
            <h3 className="text-white text-3xl font-bold mb-8 text-center">🎯 최종 결정</h3>
            <p className="text-white/90 text-center text-lg mb-8">
              충분히 생각해보셨나요? 이제 결정하세요!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => saveDecision(false)}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-2xl transition-all hover:shadow-2xl hover:scale-105 transform"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4">💰</div>
                  <div>참았어요!</div>
                  <div className="text-lg font-normal mt-2">현명한 선택입니다 ✨</div>
                </div>
              </button>

              <button
                onClick={() => saveDecision(true)}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-2xl transition-all hover:shadow-2xl hover:scale-105 transform"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4">🛒</div>
                  <div>샀어요</div>
                  <div className="text-lg font-normal mt-2">만족스러운 구매 되세요!</div>
                </div>
              </button>
            </div>
          </PremiumCard>
        )}

        {/* Purchase History */}
        {savedItems.length > 0 && step === 'input' && (
          <PremiumCard hover className="mt-8 animate-fadeIn">
            <h3 className="text-white text-2xl font-bold mb-6 text-center">📜 구매 기록 ({savedItems.length}개)</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedItems.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-5 transition-all hover:scale-102 ${
                    item.didBuy
                      ? 'bg-gradient-to-r from-red-500/20 to-rose-500/30 border-2 border-red-500/30'
                      : 'bg-gradient-to-r from-green-500/20 to-emerald-500/30 border-2 border-green-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{CATEGORIES.find(c => c.id === item.category)?.emoji}</span>
                        <span className="text-white font-bold text-lg">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span>💰 {item.price.toLocaleString()}원</span>
                        <span>📊 후회도 {item.regretScore}점</span>
                        <span>📅 {item.date}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-4xl mb-1">{item.didBuy ? '🛒' : '💰'}</div>
                      <div className={`text-sm font-bold ${item.didBuy ? 'text-red-300' : 'text-green-300'}`}>
                        {item.didBuy ? '구매함' : '참음'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        )}

        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  background: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}

        {/* Related Apps */}
        <div className="mt-12 animate-fadeIn">
          <RelatedApps currentAppSlug="regret-meter" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounce-slow { 0%, 100% { transform: scale(1) rotate(-5deg); } 50% { transform: scale(1.1) rotate(5deg); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes confetti-fall { to { transform: translateY(100vh) rotate(360deg); } }

        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }

        .confetti {
          position: absolute;
          width: 12px;
          height: 12px;
          top: -10px;
          opacity: 0.9;
          animation: confetti-fall 4s linear forwards;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </PremiumLayout>
  );
}

function AnalysisBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-bold">{label}</span>
        <span className="text-white/80">{value}/{max}점</span>
      </div>
      <div className="bg-white/10 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
