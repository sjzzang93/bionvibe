'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GoldPriceManager() {
  const [buyPrice, setBuyPrice] = useState('850000');
  const [sellPrice, setSellPrice] = useState('857000');
  const [changeRate, setChangeRate] = useState('0.3');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPrice, setCurrentPrice] = useState<any>(null);

  // 현재 금 시세 불러오기
  const fetchCurrentPrice = async () => {
    try {
      const { data, error } = await supabase
        .from('gold_prices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setCurrentPrice(data);
        setBuyPrice(data.buy_price.toString());
        setSellPrice(data.sell_price.toString());
        setChangeRate(data.change_rate?.toString() || '0');
      }
    } catch (error) {
      console.error('금 시세 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchCurrentPrice();
  }, []);

  // 금 시세 업데이트
  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');

    try {
      const buy = parseInt(buyPrice.replace(/,/g, ''));
      const sell = parseInt(sellPrice.replace(/,/g, ''));
      const change = parseFloat(changeRate);
      const changePrice = sell - (currentPrice?.sell_price || sell);

      const { error } = await supabase
        .from('gold_prices')
        .insert({
          buy_price: buy,
          sell_price: sell,
          change_rate: change,
          change_price: changePrice,
          source: '한국금거래소'
        });

      if (error) throw error;

      setMessage('✅ 금 시세가 성공적으로 업데이트되었습니다!');
      await fetchCurrentPrice();
    } catch (error: any) {
      setMessage(`❌ 업데이트 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 숫자 포맷팅
  const formatNumber = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          💰 금 시세 관리
        </h1>

        {/* 현재 금 시세 */}
        {currentPrice && (
          <PremiumCard className="mb-6" gradient={true}>
            <h2 className="text-xl font-bold mb-4 text-white">📊 현재 금 시세</h2>
            <div className="grid grid-cols-2 gap-4 text-white/90">
              <div>
                <p className="text-sm opacity-80">매수가 (내가 팔 때)</p>
                <p className="text-2xl font-bold">{currentPrice.buy_price.toLocaleString()}원</p>
              </div>
              <div>
                <p className="text-sm opacity-80">매도가 (내가 살 때)</p>
                <p className="text-2xl font-bold">{currentPrice.sell_price.toLocaleString()}원</p>
              </div>
            </div>
            <p className="text-xs text-white/70 mt-4">
              마지막 업데이트: {new Date(currentPrice.updated_at).toLocaleString('ko-KR')}
            </p>
          </PremiumCard>
        )}

        {/* 금 시세 업데이트 폼 */}
        <PremiumCard>
          <h2 className="text-xl font-bold mb-6 text-white">🔄 금 시세 업데이트</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                매수가 (원) - 내가 팔 때
              </label>
              <input
                type="text"
                value={formatNumber(buyPrice)}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="850,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                매도가 (원) - 내가 살 때
              </label>
              <input
                type="text"
                value={formatNumber(sellPrice)}
                onChange={(e) => setSellPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="857,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                변동률 (%)
              </label>
              <input
                type="text"
                value={changeRate}
                onChange={(e) => setChangeRate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="0.3"
              />
            </div>
          </div>

          <div className="mt-6">
            <PremiumButton
              onClick={handleUpdate}
              disabled={loading}
              fullWidth
              variant="primary"
              size="lg"
            >
              {loading ? '업데이트 중...' : '💰 금 시세 업데이트'}
            </PremiumButton>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-xl ${
              message.includes('성공') 
                ? 'bg-green-500/20 text-green-200' 
                : 'bg-red-500/20 text-red-200'
            }`}>
              {message}
            </div>
          )}
        </PremiumCard>

        {/* 사용 안내 */}
        <PremiumCard className="mt-6">
          <h3 className="text-lg font-bold mb-3 text-white">📝 사용 안내</h3>
          <ul className="text-sm text-white/80 space-y-2">
            <li>• 한국금거래소(koreagoldx.co.kr)에서 최신 금 시세를 확인하세요</li>
            <li>• 매수가는 고객이 금을 팔 때 받는 가격입니다</li>
            <li>• 매도가는 고객이 금을 살 때 내는 가격입니다</li>
            <li>• 업데이트 시 자동으로 타임스탬프가 기록됩니다</li>
            <li>• 크립토 계산기 앱에서 실시간으로 반영됩니다</li>
          </ul>
        </PremiumCard>
      </div>
    </div>
  );
}

