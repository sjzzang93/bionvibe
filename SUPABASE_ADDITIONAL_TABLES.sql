-- ============================================
-- BION 추가 테이블 생성 SQL
-- ============================================

-- 1. 랭킹 테이블 (반사신경, 타이핑 등)
CREATE TABLE IF NOT EXISTS rankings (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  unit TEXT DEFAULT 'ms',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rankings_app_score ON rankings(app_id, score);
CREATE INDEX idx_rankings_created ON rankings(created_at DESC);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 랭킹 등록"
  ON rankings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "누구나 랭킹 조회"
  ON rankings FOR SELECT
  USING (true);

-- 2. 로또 번호 저장 테이블
CREATE TABLE IF NOT EXISTS lotto_numbers (
  id BIGSERIAL PRIMARY KEY,
  share_code TEXT UNIQUE NOT NULL,
  numbers INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

CREATE INDEX idx_lotto_share_code ON lotto_numbers(share_code);
CREATE INDEX idx_lotto_created ON lotto_numbers(created_at DESC);

ALTER TABLE lotto_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 로또 번호 저장"
  ON lotto_numbers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "누구나 로또 번호 조회"
  ON lotto_numbers FOR SELECT
  USING (true);

CREATE POLICY "조회수 업데이트"
  ON lotto_numbers FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 3. 습관 트래커 데이터
CREATE TABLE IF NOT EXISTS habit_tracker (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  habit_name TEXT NOT NULL,
  target_days INTEGER NOT NULL,
  completed_days INTEGER DEFAULT 0,
  last_checked_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_habit_session ON habit_tracker(session_id);
CREATE INDEX idx_habit_created ON habit_tracker(created_at DESC);

ALTER TABLE habit_tracker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 습관 생성"
  ON habit_tracker FOR INSERT
  WITH CHECK (true);

CREATE POLICY "누구나 습관 조회"
  ON habit_tracker FOR SELECT
  USING (true);

CREATE POLICY "누구나 습관 업데이트"
  ON habit_tracker FOR UPDATE
  USING (true);

-- 4. 웹앱 사용 통계
CREATE TABLE IF NOT EXISTS analytics (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  event_type TEXT DEFAULT 'view',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

CREATE INDEX idx_analytics_app ON analytics(app_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX idx_analytics_event ON analytics(event_type);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 통계 기록"
  ON analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "누구나 통계 조회"
  ON analytics FOR SELECT
  USING (true);

-- 5. 디데이 목록
CREATE TABLE IF NOT EXISTS dday_list (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  title TEXT NOT NULL,
  target_date DATE NOT NULL,
  emoji TEXT DEFAULT '📅',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dday_session ON dday_list(session_id);
CREATE INDEX idx_dday_date ON dday_list(target_date);

ALTER TABLE dday_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 디데이 생성"
  ON dday_list FOR INSERT
  WITH CHECK (true);

CREATE POLICY "누구나 디데이 조회"
  ON dday_list FOR SELECT
  USING (true);

CREATE POLICY "누구나 디데이 삭제"
  ON dday_list FOR DELETE
  USING (true);

-- ============================================
-- 완료!
-- ============================================

-- 6. 넌센스 탈출 일일 참여 제한 및 당첨 기록 테이블
CREATE TABLE IF NOT EXISTS nonsense_escape_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  play_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (ip, play_date)
);

CREATE TABLE IF NOT EXISTS nonsense_escape_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 스토리지 버킷 생성 예시 (public 업로드용)
-- SELECT storage.create_bucket('nonsense-escape-proofs', public := true);

-- 7. 방명록 하트 카운터 (누적)
CREATE TABLE IF NOT EXISTS guestbook_hearts (
  id BIGSERIAL PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);
