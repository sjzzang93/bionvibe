-- ============================================
-- 🎯 BION VIBE 전체 테이블 한 방 생성
-- ============================================
-- 빠르게 시작하기: 아래 SQL을 Supabase SQL Editor에 복사 → 실행

-- ============================================
-- 🗑️ 기존 테이블 전체 삭제 (있는 경우)
-- ============================================
DROP TABLE IF EXISTS apps CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS rankings CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- ============================================
-- 📱 apps 테이블 (웹앱 목록 관리) ⭐ 신규
-- ============================================
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

CREATE INDEX idx_apps_slug ON apps(slug);
CREATE INDEX idx_apps_category ON apps(category_id);
CREATE INDEX idx_apps_created_at ON apps(created_at DESC);

ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON apps FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to update"
  ON apps FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert"
  ON apps FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete"
  ON apps FOR DELETE TO authenticated USING (true);

-- updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_apps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_apps_updated_at
  BEFORE UPDATE ON apps
  FOR EACH ROW
  EXECUTE FUNCTION update_apps_updated_at();

-- ============================================
-- 💬 chat_messages 테이블 (비온타키 실시간 채팅)
-- ============================================
CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON chat_messages FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages"
  ON chat_messages FOR INSERT WITH CHECK (true);

-- 24시간 지난 채팅 메시지 자동 삭제 함수
CREATE OR REPLACE FUNCTION delete_old_chat_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM chat_messages
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 🏆 rankings 테이블 (타이핑, 반사신경 등)
-- ============================================
CREATE TABLE rankings (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rankings_app_id_score ON rankings(app_id, score DESC);
CREATE INDEX idx_rankings_created_at ON rankings(created_at DESC);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert rankings"
  ON rankings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view rankings"
  ON rankings FOR SELECT USING (true);

-- ============================================
-- 📊 analytics 테이블 (상세 사용 통계)
-- ============================================
CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'click', 'button_click', 'feature_use'
  event_data JSONB,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_app_id ON analytics(app_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX idx_analytics_session ON analytics(session_id);
CREATE INDEX idx_analytics_app_time ON analytics(app_id, timestamp DESC);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
  ON analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view analytics"
  ON analytics FOR SELECT USING (true);

-- ============================================
-- 📈 analytics_summary 뷰 (실시간 통계 요약)
-- ============================================
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  app_id,
  COUNT(*) as total_events,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
  COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks,
  MAX(timestamp) as last_activity,
  DATE_TRUNC('hour', timestamp) as hour
FROM analytics
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY app_id, DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC, total_events DESC;

-- ============================================
-- 🔥 trending_apps 뷰 (실시간 인기 앱)
-- ============================================
CREATE OR REPLACE VIEW trending_apps AS
SELECT 
  app_id,
  COUNT(*) as activity_count,
  COUNT(DISTINCT session_id) as unique_users,
  MAX(timestamp) as last_activity
FROM analytics
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY app_id
ORDER BY activity_count DESC
LIMIT 10;

-- ============================================
-- 📧 contacts 테이블 (문의하기)
-- ============================================
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  admin_reply TEXT
);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contacts"
  ON contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contacts"
  ON contacts FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Authenticated users can update contacts"
  ON contacts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 📦 Storage 정책 설정 (app-images 버킷)
-- ============================================
-- 기존 Storage 정책 삭제
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read" ON storage.objects;

-- 공개 읽기
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'app-images');

-- 공개 업로드
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'app-images');

-- 공개 수정
CREATE POLICY "Allow public updates"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'app-images');

-- 공개 삭제
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE TO public
USING (bucket_id = 'app-images');

-- ============================================
-- ✅ 설정 완료!
-- ============================================
-- 다음 단계:
-- 1. Supabase Storage에서 'app-images' 버킷 생성 (Public 체크)
-- 2. node scripts/migrate-apps-to-supabase.mjs 실행
-- 3. /secret/image-manager 페이지에서 이미지 업로드 테스트
-- 4. 비온타키 채팅 테스트
-- ============================================

