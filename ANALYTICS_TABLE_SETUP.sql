-- ============================================
-- BION VIBE 방문자 통계 테이블 설정
-- ============================================

-- 기존 테이블이 있다면 삭제 (주의: 기존 데이터 삭제됨)
DROP TABLE IF EXISTS public.analytics CASCADE;

-- analytics 테이블 생성
CREATE TABLE public.analytics (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  page_path TEXT,
  user_agent TEXT,
  referrer TEXT,
  page_views INTEGER DEFAULT 1,
  duration INTEGER DEFAULT 0, -- 초 단위 (체류시간)
  duration_seconds INTEGER DEFAULT 0, -- 호환성을 위한 별칭
  device TEXT, -- 디바이스 타입 (Mobile, Tablet, Desktop)
  device_type TEXT, -- 호환성
  browser TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  country TEXT,
  city TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스 생성 (쿼리 성능 향상)
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at DESC);
CREATE INDEX idx_analytics_session_id ON public.analytics(session_id);
CREATE INDEX idx_analytics_updated_at ON public.analytics(updated_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read analytics"
  ON public.analytics
  FOR SELECT
  TO public
  USING (true);

-- RLS 정책: 모든 사용자가 삽입 가능 (익명 사용자도 방문 기록 가능)
CREATE POLICY "Anyone can insert analytics"
  ON public.analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS 정책: 모든 사용자가 업데이트 가능
CREATE POLICY "Anyone can update analytics"
  ON public.analytics
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 자동 updated_at 업데이트 함수
CREATE OR REPLACE FUNCTION update_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS update_analytics_updated_at_trigger ON public.analytics;
CREATE TRIGGER update_analytics_updated_at_trigger
  BEFORE UPDATE ON public.analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_updated_at();

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ Analytics 테이블 설정 완료!';
  RAISE NOTICE '📊 이제 방문자 통계가 수집됩니다.';
END $$;

