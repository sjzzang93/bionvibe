-- ============================================
-- BION VIBE APPS TABLE MIGRATION
-- ============================================

-- 1. 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS apps CASCADE;

-- 2. apps 테이블 생성
CREATE TABLE apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  category_id TEXT NOT NULL,
  url TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  related_apps TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. 인덱스 생성
CREATE INDEX idx_apps_slug ON apps(slug);
CREATE INDEX idx_apps_category ON apps(category_id);
CREATE INDEX idx_apps_created_at ON apps(created_at DESC);

-- 4. RLS (Row Level Security) 활성화
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- 5. 정책 생성 - 모든 사용자 읽기 가능
CREATE POLICY "Allow public read access"
  ON apps
  FOR SELECT
  TO public
  USING (true);

-- 6. 정책 생성 - 인증된 사용자만 수정 가능
CREATE POLICY "Allow authenticated users to update"
  ON apps
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. 정책 생성 - 인증된 사용자만 삽입 가능
CREATE POLICY "Allow authenticated users to insert"
  ON apps
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 8. 정책 생성 - 인증된 사용자만 삭제 가능
CREATE POLICY "Allow authenticated users to delete"
  ON apps
  FOR DELETE
  TO authenticated
  USING (true);

-- 9. updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. updated_at 트리거
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 완료! 이제 데이터를 마이그레이션하세요.
-- ============================================

