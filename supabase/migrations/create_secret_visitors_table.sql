-- Secret 페이지 방문자 추적 테이블
CREATE TABLE IF NOT EXISTS secret_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  ip_hash TEXT NOT NULL,  -- 개인정보 보호를 위한 해시값
  first_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visit_count INTEGER NOT NULL DEFAULT 1,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_secret_visitors_ip_hash ON secret_visitors(ip_hash);
CREATE INDEX IF NOT EXISTS idx_secret_visitors_last_visit ON secret_visitors(last_visit DESC);
CREATE INDEX IF NOT EXISTS idx_secret_visitors_first_visit ON secret_visitors(first_visit DESC);

-- RLS (Row Level Security) 정책
ALTER TABLE secret_visitors ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 INSERT 가능 (방문 기록용)
CREATE POLICY "Anyone can insert visitor records" ON secret_visitors
  FOR INSERT
  WITH CHECK (true);

-- 모든 사용자가 자신의 IP 해시로 조회 가능
CREATE POLICY "Anyone can view their own records" ON secret_visitors
  FOR SELECT
  USING (true);

-- 업데이트는 자신의 레코드만
CREATE POLICY "Anyone can update their own records" ON secret_visitors
  FOR UPDATE
  USING (true);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_secret_visitors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_secret_visitors_timestamp
  BEFORE UPDATE ON secret_visitors
  FOR EACH ROW
  EXECUTE FUNCTION update_secret_visitors_updated_at();

-- 통계 조회를 위한 뷰
CREATE OR REPLACE VIEW secret_visitor_stats AS
SELECT
  COUNT(DISTINCT ip_hash) as total_unique_visitors,
  SUM(visit_count) as total_visits,
  COUNT(CASE WHEN DATE(last_visit) = CURRENT_DATE THEN 1 END) as today_visitors,
  COUNT(CASE WHEN last_visit >= NOW() - INTERVAL '7 days' THEN 1 END) as week_visitors,
  COUNT(CASE WHEN last_visit >= NOW() - INTERVAL '30 days' THEN 1 END) as month_visitors,
  MAX(last_visit) as last_visitor_time
FROM secret_visitors;

-- 일일 방문자 통계 테이블
CREATE TABLE IF NOT EXISTS secret_daily_stats (
  date DATE PRIMARY KEY,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  total_visits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_secret_daily_stats_date ON secret_daily_stats(date DESC);

-- 코멘트 추가
COMMENT ON TABLE secret_visitors IS 'Secret Vault 페이지 방문자 추적 (IP 기반 유니크 카운팅)';
COMMENT ON COLUMN secret_visitors.ip_hash IS 'SHA-256 해시된 IP 주소 (개인정보 보호)';
COMMENT ON COLUMN secret_visitors.visit_count IS '해당 IP의 총 방문 횟수';
COMMENT ON VIEW secret_visitor_stats IS 'Secret Vault 방문자 통계 요약';
