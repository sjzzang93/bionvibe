"use client";

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

export default function RegretMeter() {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [regretScore, setRegretScore] = useState(0);
  const [savedItems, setSavedItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('regret_saved');
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
    } else if (countdown === 0 && isActive) {
      setIsActive(false);
      alert('🎉 쿨링타임 종료! 정말 사시겠어요?');
    }
    return () => clearInterval(interval);
  }, [isActive, countdown]);

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

    // 후회도 계산
    let score = 0;

    // 가격대별 점수 (0-40점)
    if (priceNum >= 1000000) score += 40;
    else if (priceNum >= 500000) score += 35;
    else if (priceNum >= 300000) score += 30;
    else if (priceNum >= 100000) score += 25;
    else if (priceNum >= 50000) score += 20;
    else if (priceNum >= 30000) score += 15;
    else if (priceNum >= 10000) score += 10;
    else score += 5;

    // 랜덤 요소 (0-30점)
    score += Math.random() * 30;

    // 시간대 보정 (0-15점)
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 6) score += 15; // 밤/새벽
    else if (hour >= 12 && hour < 14) score += 10; // 점심
    else score += 5;

    // 요일 보정 (0-15점)
    const day = new Date().getDay();
    if (day === 0 || day === 6) score += 15; // 주말
    else score += 10;

    score = Math.min(100, Math.round(score));
    setRegretScore(score);

    // 쿨링타임 설정 (점수에 비례)
    const cooltime = Math.round(score * 3); // 최대 300초 (5분)
    setCountdown(cooltime);
    setIsActive(true);
  };

  const saveDecision = (didBuy: boolean) => {
    const newItem = {
      name: itemName,
      price: parseInt(price.replace(/,/g, '')),
      regretScore,
      didBuy,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newItem, ...savedItems].slice(0, 20);
    setSavedItems(updated);
    localStorage.setItem('regret_saved', JSON.stringify(updated));

    setItemName('');
    setPrice('');
    setRegretScore(0);
    setCountdown(0);
    setIsActive(false);

    if (!didBuy) {
      alert(`💰 축하합니다! ${parseInt(price.replace(/,/g, '')).toLocaleString()}원을 아꼈어요!`);
    }
  };

  const getRegretLevel = (score: number) => {
    if (score >= 80) return { label: '극도로 후회할 확률', emoji: '🚨', color: 'from-red-600 to-red-800', time: '최소 5분 기다리세요!' };
    if (score >= 60) return { label: '많이 후회할 확률', emoji: '😰', color: 'from-orange-500 to-red-500', time: '3분 기다려보세요' };
    if (score >= 40) return { label: '조금 후회할 수도', emoji: '😅', color: 'from-yellow-500 to-orange-500', time: '2분만 참아보세요' };
    return { label: '괜찮을 것 같아요', emoji: '😊', color: 'from-green-500 to-blue-500', time: '1분만 생각해보세요' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSaved = savedItems.filter(i => !i.didBuy).reduce((sum, i) => sum + i.price, 0);
  const totalSpent = savedItems.filter(i => i.didBuy).reduce((sum, i) => sum + i.price, 0);

  return (
    <PremiumLayout theme="orange">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-200 via-red-200 to-yellow-200 bg-clip-text text-transparent">
            💸 소비 후회도 측정
          </h1>
          <p className="text-xl text-white/80">충동구매 방지 쿨링타임!</p>
        </div>

        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-6 text-center">🛒 구매 고민 상품</h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-white font-bold mb-2 block">상품명</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="예: 명품 가방, 최신 스마트폰"
                maxLength={50}
                className="w-full px-4 py-3 rounded-lg text-black font-bold"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="text-white font-bold mb-2 block">가격 (원)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const num = e.target.value.replace(/[^0-9]/g, '');
                  setPrice(num ? parseInt(num).toLocaleString() : '');
                }}
                placeholder="예: 500,000"
                className="w-full px-4 py-3 rounded-lg text-black font-bold text-right"
                style={{ fontSize: '20px' }}
              />
            </div>
          </div>

          <PremiumButton onClick={analyze} variant="primary" size="lg" icon="🔍" fullWidth disabled={isActive}>
            후회도 측정하기
          </PremiumButton>
        </PremiumCard>

        {regretScore > 0 && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient>
              <div className="text-center">
                <div className="text-7xl mb-4 animate-bounce-slow">
                  {getRegretLevel(regretScore).emoji}
                </div>
                <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-200 to-orange-200 bg-clip-text text-transparent">
                  {regretScore}점
                </div>
                <div className={`inline-block px-8 py-3 rounded-full font-bold text-xl text-white bg-gradient-to-r ${getRegretLevel(regretScore).color} mb-4`}>
                  {getRegretLevel(regretScore).label}
                </div>
                <p className="text-white text-lg">{getRegretLevel(regretScore).time}</p>
              </div>
            </PremiumCard>

            {isActive && countdown > 0 && (
              <PremiumCard hover className="bg-gradient-to-br from-red-500/30 to-orange-500/30">
                <div className="text-center">
                  <h3 className="text-white text-2xl font-bold mb-4">⏳ 쿨링타임</h3>
                  <div className="text-8xl font-bold text-white mb-4 animate-pulse">
                    {formatTime(countdown)}
                  </div>
                  <p className="text-white/90">정말 필요한 물건인지 다시 한번 생각해보세요</p>
                  <div className="mt-6 bg-white/20 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-red-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${(countdown / (regretScore * 3)) * 100}%` }}
                    />
                  </div>
                </div>
              </PremiumCard>
            )}

            {!isActive && countdown === 0 && regretScore > 0 && (
              <PremiumCard hover>
                <h3 className="text-white text-xl font-bold mb-4 text-center">최종 결정</h3>
                <div className="grid grid-cols-2 gap-4">
                  <PremiumButton onClick={() => saveDecision(false)} variant="success" size="lg" icon="💰">
                    참았어요!
                  </PremiumButton>
                  <PremiumButton onClick={() => saveDecision(true)} variant="danger" size="lg" icon="🛒">
                    샀어요
                  </PremiumButton>
                </div>
              </PremiumCard>
            )}
          </div>
        )}

        {savedItems.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8 mt-8">
            <PremiumCard hover>
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-white text-sm mb-1">아낀 금액</div>
                <div className="text-3xl font-bold text-green-300">{totalSaved.toLocaleString()}원</div>
              </div>
            </PremiumCard>
            <PremiumCard hover>
              <div className="text-center">
                <div className="text-4xl mb-2">🛒</div>
                <div className="text-white text-sm mb-1">쓴 금액</div>
                <div className="text-3xl font-bold text-red-300">{totalSpent.toLocaleString()}원</div>
              </div>
            </PremiumCard>
            <PremiumCard hover>
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-white text-sm mb-1">절약률</div>
                <div className="text-3xl font-bold text-yellow-300">
                  {totalSaved + totalSpent > 0 ? Math.round((totalSaved / (totalSaved + totalSpent)) * 100) : 0}%
                </div>
              </div>
            </PremiumCard>
          </div>
        )}

        {savedItems.length > 0 && (
          <PremiumCard hover className="mb-8">
            <h3 className="text-white text-xl font-bold mb-4 text-center">📜 구매 기록</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedItems.map((item, i) => (
                <div key={i} className={`rounded-lg p-4 ${item.didBuy ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-bold mb-1">{item.name}</div>
                      <div className="text-white/70 text-sm">{item.price.toLocaleString()}원</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl mb-1">{item.didBuy ? '🛒' : '💰'}</div>
                      <div className="text-white/70 text-xs">{item.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        )}

        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="regret-meter" className="mt-8" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </PremiumLayout>
  );
}
