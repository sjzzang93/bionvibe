-- ========================================
-- 모의투자 웹앱 데이터베이스 스키마
-- ========================================

-- 1. 투자 사용자 테이블 (IP 기반 + 닉네임)
CREATE TABLE IF NOT EXISTS investment_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL UNIQUE,
  ip_address VARCHAR(45) NOT NULL UNIQUE, -- IPv4/IPv6 지원
  balance BIGINT DEFAULT 100000000, -- 초기 1억원
  total_rewards BIGINT DEFAULT 0, -- 누적 리워드
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 2. 포트폴리오 (보유 자산)
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES investment_users(id) ON DELETE CASCADE,
  asset_type VARCHAR(20) NOT NULL, -- 'bitcoin' or 'gold'
  quantity DECIMAL(18, 8) NOT NULL, -- 수량 (소수점 8자리)
  buy_price BIGINT NOT NULL, -- 매수가
  buy_amount BIGINT NOT NULL, -- 매수금액
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 거래 내역
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES investment_users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(10) NOT NULL, -- 'buy' or 'sell'
  asset_type VARCHAR(20) NOT NULL, -- 'bitcoin' or 'gold'
  quantity DECIMAL(18, 8) NOT NULL,
  price BIGINT NOT NULL, -- 거래 당시 가격
  amount BIGINT NOT NULL, -- 거래 금액
  profit BIGINT DEFAULT 0, -- 수익 (매도시만)
  profit_rate DECIMAL(10, 2) DEFAULT 0, -- 수익률 (%)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 가격 히스토리 (24시간 단위 기록)
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_type VARCHAR(20) NOT NULL, -- 'bitcoin' or 'gold'
  price BIGINT NOT NULL,
  change_rate DECIMAL(10, 2) DEFAULT 0, -- 변동률 (%)
  change_price BIGINT DEFAULT 0, -- 변동가
  volume BIGINT DEFAULT 0, -- 거래량 (비트코인만)
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(asset_type, recorded_at)
);

-- 5. 리워드 내역 (다른 웹앱 이용 보상)
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES investment_users(id) ON DELETE CASCADE,
  app_name VARCHAR(100) NOT NULL, -- 이용한 웹앱 이름
  reward_amount BIGINT DEFAULT 1000000, -- 리워드 금액 (기본 100만원)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 사용자 알림 설정
CREATE TABLE IF NOT EXISTS user_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES investment_users(id) ON DELETE CASCADE,
  asset_type VARCHAR(20) NOT NULL,
  alert_type VARCHAR(20) NOT NULL, -- 'target_price', 'stop_loss', 'take_profit'
  target_price BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 인덱스 생성 (성능 최적화)
-- ========================================

CREATE INDEX IF NOT EXISTS idx_users_ip ON investment_users(ip_address);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON investment_users(nickname);
CREATE INDEX IF NOT EXISTS idx_portfolios_user ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_asset ON portfolios(asset_type);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_asset ON price_history(asset_type, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_rewards_user ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON user_alerts(user_id);

-- ========================================
-- Row Level Security (RLS) 정책
-- ========================================

ALTER TABLE investment_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (재실행 시 에러 방지)
DROP POLICY IF EXISTS "Public read access" ON investment_users;
DROP POLICY IF EXISTS "Public read access" ON portfolios;
DROP POLICY IF EXISTS "Public read access" ON transactions;
DROP POLICY IF EXISTS "Public read access" ON price_history;
DROP POLICY IF EXISTS "Authenticated users can insert" ON investment_users;
DROP POLICY IF EXISTS "Authenticated users can update" ON investment_users;
DROP POLICY IF EXISTS "Authenticated users can insert" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can update" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can delete" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can insert" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can insert" ON rewards;
DROP POLICY IF EXISTS "Authenticated users can insert" ON user_alerts;
DROP POLICY IF EXISTS "Authenticated users can update" ON user_alerts;
DROP POLICY IF EXISTS "Authenticated users can delete" ON user_alerts;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Public read access" ON investment_users FOR SELECT USING (true);
CREATE POLICY "Public read access" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transactions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON price_history FOR SELECT USING (true);

-- 삽입/업데이트는 인증된 사용자만
CREATE POLICY "Authenticated users can insert" ON investment_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON investment_users FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can insert" ON portfolios FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON portfolios FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON portfolios FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert" ON transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can insert" ON rewards FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can insert" ON user_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON user_alerts FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON user_alerts FOR DELETE USING (true);

-- ========================================
-- 초기 데이터 (테스트용)
-- ========================================

-- 현재 비트코인/금 가격 초기화 (실제 데이터는 API로 수집)
INSERT INTO price_history (asset_type, price, change_rate, change_price, recorded_at)
VALUES
  ('bitcoin', 150000000, 2.5, 3650000, NOW()),
  ('gold', 850000, 0.3, 2500, NOW())
ON CONFLICT DO NOTHING;

-- ========================================
-- 유틸리티 함수
-- ========================================

-- 사용자 총 자산 계산 함수
CREATE OR REPLACE FUNCTION get_user_total_assets(user_uuid UUID)
RETURNS BIGINT AS $$
DECLARE
  total_portfolio_value BIGINT;
  user_balance BIGINT;
BEGIN
  -- 포트폴리오 가치 계산 (현재가 기준)
  SELECT COALESCE(SUM(
    CASE
      WHEN p.asset_type = 'bitcoin' THEN
        p.quantity * (SELECT price FROM price_history WHERE asset_type = 'bitcoin' ORDER BY recorded_at DESC LIMIT 1)
      WHEN p.asset_type = 'gold' THEN
        p.quantity * (SELECT price FROM price_history WHERE asset_type = 'gold' ORDER BY recorded_at DESC LIMIT 1)
      ELSE 0
    END
  ), 0) INTO total_portfolio_value
  FROM portfolios p
  WHERE p.user_id = user_uuid;

  -- 잔액 조회
  SELECT balance INTO user_balance
  FROM investment_users
  WHERE id = user_uuid;

  RETURN COALESCE(user_balance, 0) + total_portfolio_value;
END;
$$ LANGUAGE plpgsql;

-- 사용자 수익률 계산 함수
CREATE OR REPLACE FUNCTION get_user_profit_rate(user_uuid UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  total_assets BIGINT;
  initial_balance BIGINT := 100000000; -- 초기 1억원
BEGIN
  total_assets := get_user_total_assets(user_uuid);
  RETURN ((total_assets - initial_balance)::DECIMAL / initial_balance) * 100;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 완료!
-- ========================================
