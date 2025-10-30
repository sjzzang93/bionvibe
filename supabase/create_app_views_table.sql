-- 앱 조회수 테이블 생성
CREATE TABLE IF NOT EXISTS app_views (
  app_id TEXT PRIMARY KEY,
  view_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_app_views_count ON app_views(view_count DESC);

-- RLS (Row Level Security) 설정
ALTER TABLE app_views ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view app_views" ON app_views
  FOR SELECT USING (true);

-- 인증된 사용자만 업데이트 가능 (선택사항)
CREATE POLICY "Anyone can update app_views" ON app_views
  FOR UPDATE USING (true);

-- 인증된 사용자만 삽입 가능 (선택사항)
CREATE POLICY "Anyone can insert app_views" ON app_views
  FOR INSERT WITH CHECK (true);

-- 코멘트 추가
COMMENT ON TABLE app_views IS '앱별 조회수를 추적하는 테이블';
COMMENT ON COLUMN app_views.app_id IS '앱 고유 ID (apps 테이블의 id와 매칭)';
COMMENT ON COLUMN app_views.view_count IS '총 조회수';
COMMENT ON COLUMN app_views.last_updated IS '마지막 업데이트 시간';
