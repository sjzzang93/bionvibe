"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './styles.css';


const DEFAULT_RATES = { res: 172, comm: 175, agr: 70 };
const LS_KEY = 'electricity_rates_v1';

export default function ElectricityCalculator() {
  const [power, setPower] = useState('');
  const [unit, setUnit] = useState<'W' | 'kW'>('W');
  const [mode, setMode] = useState<'total' | 'daily'>('total');
  const [hoursTotal, setHoursTotal] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [days, setDays] = useState('');
  const [category, setCategory] = useState<'res' | 'comm' | 'agr'>('res');
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [showModal, setShowModal] = useState(false);
  const [tempRates, setTempRates] = useState(DEFAULT_RATES);
  const [result, setResult] = useState({ price: 0, kWh: 0, unitPrice: 0 });

  useEffect(() => {
    const loadRates = () => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return DEFAULT_RATES;
        const obj = JSON.parse(raw);
        return { ...DEFAULT_RATES, ...obj };
      } catch (e) {
        return DEFAULT_RATES;
      }
    };
    setRates(loadRates());
  }, []);

  const toNum = (v: string) => {
    const n = parseFloat(v.replace(/,/g, ''));
    return Number.isFinite(n) ? n : NaN;
  };

  const fmtKRW = (n: number) => 
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Math.round(n || 0));

  const calculate = () => {
    const powerVal = toNum(power);
    if (!Number.isFinite(powerVal) || powerVal <= 0) {
      alert('소비전력을 올바르게 입력해주세요.');
      return;
    }

    let hours = 0;
    if (mode === 'total') {
      const ht = toNum(hoursTotal);
      if (!Number.isFinite(ht) || ht <= 0) {
        alert('총 사용시간(시간)을 입력하세요.');
        return;
      }
      hours = ht;
    } else {
      const hpd = toNum(hoursPerDay);
      const d = toNum(days);
      if (!Number.isFinite(hpd) || hpd <= 0) {
        alert('하루 사용시간을 입력하세요.');
        return;
      }
      if (!Number.isFinite(d) || d <= 0) {
        alert('일수를 입력하세요.');
        return;
      }
      hours = hpd * d;
    }

    const kW = unit === 'W' ? powerVal / 1000 : powerVal;
    const kWh = kW * hours;
    const unitPrice = rates[category] ?? 0;
    const price = kWh * unitPrice;

    setResult({ price, kWh, unitPrice });
  };

  const resetAll = () => {
    setPower('');
    setUnit('W');
    setHoursTotal('');
    setHoursPerDay('');
    setDays('');
    setCategory('res');
    setMode('total');
    setResult({ price: 0, kWh: 0, unitPrice: 0 });
  };

  const saveRates = () => {
    if ([tempRates.res, tempRates.comm, tempRates.agr].some(v => !Number.isFinite(v) || v <= 0)) {
      alert('단가는 0보다 큰 숫자로 입력해주세요.');
      return;
    }
    setRates(tempRates);
    localStorage.setItem(LS_KEY, JSON.stringify(tempRates));
    setShowModal(false);
  };

  const restoreDefaults = () => {
    setTempRates(DEFAULT_RATES);
    setRates(DEFAULT_RATES);
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_RATES));
  };

  return (
    <>
      {/* 애드센스 상단 배너 */}
      <div style={{ backgroundColor: '#fef3c7', padding: '16px 0' }}>
        
      </div>

      <header className="header-banner">
        <div className="banner">
          
        </div>
      </header>

      <main className="wrap">
        <section className="card" aria-label="전기요금 계산기">
          <div className="pika-bar" aria-hidden="true">
            <span className="cheek"></span>
            <span className="eye"></span>
            <span className="cheek"></span>
          </div>
          
          <div className="title">
            <div className="logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-label="번개">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"></path>
              </svg>
            </div>
            <div>
              <h1>전력 사용시간 → 전기요금 계산기</h1>
              <p className="sub">피카 감성으로 똑똑하게 ⚡ 소비전력과 사용시간만 넣으면 끝!</p>
            </div>
          </div>

          <div className="grid">
            <div className="field">
              <label htmlFor="power">소비전력</label>
              <div className="row">
                <input
                  id="power"
                  type="number"
                  inputMode="decimal"
                  placeholder="예: 800"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                />
                <select value={unit} onChange={(e) => setUnit(e.target.value as 'W' | 'kW')} className="compact">
                  <option value="W">W</option>
                  <option value="kW">kW</option>
                </select>
              </div>
              <small className="muted">설명서의 정격 소비전력 값을 입력하세요.</small>
            </div>

            <div className="field">
              <label>사용시간</label>
              <div className="seg">
                <button 
                  className={mode === 'total' ? 'active' : ''} 
                  onClick={() => setMode('total')}
                >
                  총 사용시간(시간)
                </button>
                <button 
                  className={mode === 'daily' ? 'active' : ''} 
                  onClick={() => setMode('daily')}
                >
                  하루 사용시간 × 일수
                </button>
              </div>
              {mode === 'total' ? (
                <div className="row" style={{ marginTop: '8px' }}>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="예: 5 (시간)"
                    value={hoursTotal}
                    onChange={(e) => setHoursTotal(e.target.value)}
                  />
                </div>
              ) : (
                <div className="row" style={{ marginTop: '8px' }}>
                  <input
                    className="compact"
                    type="number"
                    inputMode="decimal"
                    placeholder="하루 시간"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                  />
                  <span>×</span>
                  <input
                    className="compact"
                    type="number"
                    inputMode="numeric"
                    placeholder="일수"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="category">요금 분류</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                <option value="res">가정용</option>
                <option value="comm">상업용</option>
                <option value="agr">농업용</option>
              </select>
              <div className="toolbar">
                <small className="muted">분류별 단가는 오른쪽 상단 '단가 편집'에서 변경 가능</small>
                <button className="btn secondary" onClick={() => { setTempRates(rates); setShowModal(true); }}>
                  단가 편집
                </button>
              </div>
            </div>

            <div className="field">
              <label>계산</label>
              <div className="actions">
                <button className="btn" onClick={calculate}>⚡ 확인</button>
                <button className="btn secondary" onClick={resetAll}>초기화</button>
              </div>
              <small className="muted">결과는 아래 카드에 표시됩니다.</small>
            </div>
          </div>

          {/* 애드센스 중간 배너 */}
          <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '12px', marginTop: '12px' }}>
            
          </div>

          <div className="result" style={{ marginTop: '12px' }}>
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <strong>예상 전기요금</strong>
                <span className="muted">단가 {rates[category].toFixed(1)} 원/kWh</span>
              </div>
              <div className="price">{fmtKRW(result.price)}</div>
              <div className="muted">
                사용전력량 <span className="kwh">{result.kWh.toFixed(2)}</span> kWh × {result.unitPrice.toFixed(1)} 원/kWh
              </div>
            </div>
            
            <aside className="plug">
              <div style={{ fontWeight: 800, marginBottom: '12px', fontSize: '18px' }}>💡 전기요금 절약 필수템</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="https://" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'white', borderRadius: '8px', border: '2px solid #fbbf24', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🔌</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#92400e' }}>스마트 플러그 와이파이 콘센트</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>앱으로 전원 ON/OFF 자동화</div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>구매하러가기 →</div>
                </a>
                
                <a href="https://" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'white', borderRadius: '8px', border: '2px solid #fbbf24', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>💡</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#92400e' }}>LED 전구 20W 100W 대체</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>전력 80% 절감</div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>구매하러가기 →</div>
                </a>

                <a href="https://" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'white', borderRadius: '8px', border: '2px solid #fbbf24', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>❄️</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#92400e' }}>절전형 멀티탭 개별 스위치</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>대기전력 차단</div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>구매하러가기 →</div>
                </a>
              </div>
            </aside>
          </div>

          <p className="legal">
            ※ 본 계산기는 평균 단가 기반의 간편 추정치입니다. 실제 고지서는 기본요금·누진제·부가세·전력산업기반기금 등으로 차이가 날 수 있어요.
          </p>
        </section>
      </main>

      {/* 애드센스 하단 배너 */}
      <div style={{ backgroundColor: '#fef3c7', padding: '16px 0' }}>
        
      </div>

      <footer className="footer-banner">
        <div className="banner">
          
        </div>
        <p className="legal" style={{ textAlign: 'center', padding: '12px', margin: 0, fontSize: '12px', color: '#8d6a00' }}>
          ※ 본 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>분류별 단가 편집 (원/kWh)</h3>
            <div className="row">
              <label className="compact" style={{ minWidth: '120px' }}>가정용</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                className="compact"
                value={tempRates.res}
                onChange={(e) => setTempRates({ ...tempRates, res: parseFloat(e.target.value) })}
              />
            </div>
            <div className="row">
              <label className="compact" style={{ minWidth: '120px' }}>상업용</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                className="compact"
                value={tempRates.comm}
                onChange={(e) => setTempRates({ ...tempRates, comm: parseFloat(e.target.value) })}
              />
            </div>
            <div className="row">
              <label className="compact" style={{ minWidth: '120px' }}>농업용</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                className="compact"
                value={tempRates.agr}
                onChange={(e) => setTempRates({ ...tempRates, agr: parseFloat(e.target.value) })}
              />
            </div>
            <div className="toolbar" style={{ marginTop: '14px' }}>
              <button className="btn secondary" onClick={restoreDefaults}>기본값 복원</button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn secondary" onClick={() => setShowModal(false)}>취소</button>
                <button className="btn" onClick={saveRates}>저장</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

