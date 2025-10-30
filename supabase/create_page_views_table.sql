-- 페이지 방문 통계 테이블 생성
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  visitor_ip TEXT NOT NULL,
  user_agent TEXT,
  page_path TEXT DEFAULT '/',
  visited_at TIMESTAMP DEFAULT NOW(),
  date DATE DEFAULT CURRENT_DATE
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_ip_date ON page_views(visitor_ip, date);
CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at DESC);

-- RLS (Row Level Security) 설정
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view page_views" ON page_views
  FOR SELECT USING (true);

-- 누구나 삽입 가능 (방문 기록)
CREATE POLICY "Anyone can insert page_views" ON page_views
  FOR INSERT WITH CHECK (true);

-- 오늘 방문자 수 조회 함수 (중복 IP 제거)
CREATE OR REPLACE FUNCTION get_today_visitor_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT visitor_ip)
    FROM page_views
    WHERE date = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;

-- 전체 방문자 수 조회 함수 (중복 IP 제거)
CREATE OR REPLACE FUNCTION get_total_visitor_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT visitor_ip)
    FROM page_views
  );
END;
$$ LANGUAGE plpgsql;

-- 오늘 총 방문 수 (중복 포함)
CREATE OR REPLACE FUNCTION get_today_visit_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM page_views
    WHERE date = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;

-- 전체 총 방문 수 (중복 포함)
CREATE OR REPLACE FUNCTION get_total_visit_count()
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM page_views
  );
END;
$$ LANGUAGE plpgsql;

-- 코멘트 추가
COMMENT ON TABLE page_views IS '페이지 방문 통계를 추적하는 테이블 (IP 기반 중복 제거)';
COMMENT ON COLUMN page_views.visitor_ip IS '방문자 IP 주소';
COMMENT ON COLUMN page_views.user_agent IS '브라우저 User-Agent';
COMMENT ON COLUMN page_views.page_path IS '방문한 페이지 경로';
COMMENT ON COLUMN page_views.visited_at IS '방문 시각';
COMMENT ON COLUMN page_views.date IS '방문 날짜 (중복 제거용)';
