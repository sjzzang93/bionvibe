-- 금 시세 테이블 생성
DROP TABLE IF EXISTS gold_prices CASCADE;

CREATE TABLE gold_prices (
  id BIGSERIAL PRIMARY KEY,
  buy_price INTEGER NOT NULL,           -- 매수가 (내가 팔 때)
  sell_price INTEGER NOT NULL,          -- 매도가 (내가 살 때)
  change_rate DECIMAL(5,2) DEFAULT 0,   -- 변동률 (%)
  change_price INTEGER DEFAULT 0,        -- 변동가
  source VARCHAR(100) DEFAULT '한국금거래소',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 데이터 삽입 (2025년 1월 23일 기준)
INSERT INTO gold_prices (buy_price, sell_price, change_rate, change_price, source)
VALUES (850000, 857000, 0.3, 2500, '한국금거래소');

-- RLS 정책 설정 (읽기만 허용)
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;

-- 모두가 읽을 수 있도록
CREATE POLICY "금 시세는 누구나 조회 가능"
  ON gold_prices
  FOR SELECT
  USING (true);

-- 인덱스 생성
CREATE INDEX idx_gold_prices_created_at ON gold_prices(created_at DESC);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_gold_prices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER gold_prices_updated_at_trigger
  BEFORE UPDATE ON gold_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_gold_prices_updated_at();

-- 최신 금 시세 조회 뷰
CREATE OR REPLACE VIEW latest_gold_price AS
SELECT *
FROM gold_prices
ORDER BY created_at DESC
LIMIT 1;

COMMENT ON TABLE gold_prices IS '금 시세 데이터 (수동 업데이트)';
COMMENT ON COLUMN gold_prices.buy_price IS '매수가 - 내가 금을 팔 때 받는 가격';
COMMENT ON COLUMN gold_prices.sell_price IS '매도가 - 내가 금을 살 때 내는 가격';

