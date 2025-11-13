'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';

interface ExchangeRate {
  currency: string;
  name: string;
  rate: number;
  change: number;
  flag: string;
}

interface Alert {
  id: string;
  currency: string;
  targetRate: number;
  condition: 'above' | 'below';
  isActive: boolean;
}

export default function ExchangeRateMonitor() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [targetRate, setTargetRate] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('below');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [prevRates, setPrevRates] = useState<Record<string, number>>({});

  // 실제 환율 데이터 가져오기
  const fetchRates = async () => {
    try {
      const response = await fetch('/api/exchange-rate');
      const data = await response.json();

      if (data.success) {
        const newRates: ExchangeRate[] = Object.entries(data.rates).map(([currency, info]: [string, any]) => {
          const prevRate = prevRates[currency] || info.rate;
          const change = prevRate ? ((info.rate - prevRate) / prevRate) * 100 : 0;

          return {
            currency,
            name: info.name,
            rate: parseFloat(info.rate.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            flag: info.flag,
          };
        });

        setRates(newRates);
        setLastUpdate(new Date());
        setLoading(false);

        // 이전 환율 저장
        const rateMap: Record<string, number> = {};
        newRates.forEach((r) => {
          rateMap[r.currency] = r.rate;
        });
        setPrevRates(rateMap);

        // 알림 체크
        checkAlerts();
      }
    } catch (error) {
      console.error('환율 가져오기 실패:', error);
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchRates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 자동 갱신
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRates();
    }, 60000); // 1분마다 갱신

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  const checkAlerts = () => {
    alerts.forEach((alert) => {
      if (!alert.isActive) return;

      const rate = rates.find((r) => r.currency === alert.currency);
      if (!rate) return;

      if (
        (alert.condition === 'above' && rate.rate >= alert.targetRate) ||
        (alert.condition === 'below' && rate.rate <= alert.targetRate)
      ) {
        // 브라우저 알림
        if (Notification.permission === 'granted') {
          new Notification('환율 알림', {
            body: `${rate.name}이(가) ${alert.targetRate}원을 ${alert.condition === 'above' ? '돌파' : '하회'}했습니다! 현재: ${rate.rate}원`,
            icon: '💱',
          });
        }

        // 알림 비활성화
        setAlerts((prev) =>
          prev.map((a) => (a.id === alert.id ? { ...a, isActive: false } : a))
        );
      }
    });
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const addAlert = () => {
    if (!selectedCurrency || !targetRate) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      currency: selectedCurrency,
      targetRate: parseFloat(targetRate),
      condition,
      isActive: true,
    };

    setAlerts([...alerts, newAlert]);
    setShowAlertModal(false);
    setSelectedCurrency('');
    setTargetRate('');
    requestNotificationPermission();
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  };

  const calculateAmount = (amount: number, rate: number) => {
    return (amount * rate).toLocaleString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-8 px-4">
      <AdOverlay />
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">💱 실시간 환율 모니터링</h1>
          <p className="text-base sm:text-lg text-blue-200">
            실시간 환율 추적 및 목표 환율 도달 알림
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="text-sm text-blue-300">
              마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">자동 갱신 (5초)</span>
            </label>
          </div>
        </motion.div>

        {/* 환율 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {rates.map((rate, index) => (
            <motion.div
              key={rate.currency}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 hover:border-white/40 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl">{rate.flag}</span>
                <span
                  className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-full ${
                    rate.change > 0
                      ? 'bg-green-500/20 text-green-300'
                      : rate.change < 0
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}
                >
                  {rate.change > 0 ? '+' : ''}
                  {rate.change.toFixed(2)}%
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">{rate.currency}</h3>
              <p className="text-xs sm:text-sm text-blue-200 mb-3">{rate.name}</p>
              <div className="text-2xl sm:text-3xl font-bold">{rate.rate.toFixed(2)}원</div>
              <div className="text-xs text-blue-300 mt-2">
                1,000 {rate.currency} = {calculateAmount(1000, rate.rate)}원
              </div>
            </motion.div>
          ))}
        </div>

        {/* 알림 설정 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">🔔 환율 알림 설정</h2>
            <button
              onClick={() => setShowAlertModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 touch-manipulation min-h-[48px]"
            >
              + 새 알림 추가
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-8 text-blue-300">
              설정된 알림이 없습니다. 목표 환율을 설정하여 알림을 받아보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const rate = rates.find((r) => r.currency === alert.currency);
                return (
                  <div
                    key={alert.id}
                    className="bg-white/5 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{rate?.flag}</span>
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg">
                            {rate?.currency} ({rate?.name})
                          </h3>
                          <p className="text-xs sm:text-sm text-blue-300">
                            {alert.targetRate.toFixed(2)}원 {alert.condition === 'above' ? '이상' : '이하'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm">
                        현재: <span className="font-bold">{rate?.rate.toFixed(2)}원</span>
                        {alert.isActive && (
                          <span className="ml-2 text-green-400">● 활성</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all min-h-[44px] touch-manipulation ${
                          alert.isActive
                            ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                        }`}
                      >
                        {alert.isActive ? '일시정지' : '재활성화'}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* 알림 추가 모달 */}
        <AnimatePresence>
          {showAlertModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowAlertModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-6">새 알림 추가</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">통화 선택</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="" className="bg-gray-800">선택하세요</option>
                      {rates.map((rate) => (
                        <option key={rate.currency} value={rate.currency} className="bg-gray-800">
                          {rate.flag} {rate.currency} - {rate.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">목표 환율</label>
                    <input
                      type="number"
                      value={targetRate}
                      onChange={(e) => setTargetRate(e.target.value)}
                      placeholder="예: 1300"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">조건</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setCondition('below')}
                        className={`py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation ${
                          condition === 'below'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        이하일 때
                      </button>
                      <button
                        onClick={() => setCondition('above')}
                        className={`py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation ${
                          condition === 'above'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        이상일 때
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation"
                  >
                    취소
                  </button>
                  <button
                    onClick={addAlert}
                    disabled={!selectedCurrency || !targetRate}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation"
                  >
                    추가
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 정보 섹션 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/10"
        >
          <h3 className="text-lg sm:text-xl font-bold mb-4">💡 사용 방법</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-blue-200">
            <li>• 실시간으로 주요 통화의 환율을 확인할 수 있습니다</li>
            <li>• 목표 환율을 설정하여 도달 시 브라우저 알림을 받을 수 있습니다</li>
            <li>• 자동 갱신은 5초마다 환율을 업데이트합니다</li>
            <li>• 알림은 브라우저 권한 허용 후 작동합니다</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
