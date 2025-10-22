-- ============================================
-- BION 프로젝트 전체 데이터베이스 설정
-- 전체 복사-붙여넣기용 (한 번에 실행)
-- ============================================
-- 포함 테이블:
-- 1. chat_messages (방명록)
-- 2. analytics (실시간 방문자, 통계)
-- 3. contacts (연락처)
-- 4. apps (앱 데이터)
-- ============================================

-- ============================================
-- 1. chat_messages (방명록) 테이블
-- ============================================

-- 기존 삭제
DROP POLICY IF EXISTS "chat_messages_select_policy" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_policy" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete_policy" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_update_policy" ON public.chat_messages;
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON public.chat_messages;
DROP TABLE IF EXISTS public.chat_messages CASCADE;

-- 테이블 생성
CREATE TABLE public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- RLS 활성화
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "chat_messages_select_policy" ON public.chat_messages FOR SELECT TO public USING (true);
CREATE POLICY "chat_messages_insert_policy" ON public.chat_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "chat_messages_delete_policy" ON public.chat_messages FOR DELETE TO public USING (true);
CREATE POLICY "chat_messages_update_policy" ON public.chat_messages FOR UPDATE TO public USING (true) WITH CHECK (true);

-- ============================================
-- 2. analytics (실시간 방문자, 통계) 테이블
-- ============================================

-- 기존 삭제
DROP POLICY IF EXISTS "analytics_select_policy" ON public.analytics;
DROP POLICY IF EXISTS "analytics_insert_policy" ON public.analytics;
DROP POLICY IF EXISTS "analytics_update_policy" ON public.analytics;
DROP TRIGGER IF EXISTS cleanup_analytics_trigger ON public.analytics;
DROP FUNCTION IF EXISTS cleanup_old_analytics() CASCADE;
DROP TRIGGER IF EXISTS update_analytics_updated_at ON public.analytics;
DROP TABLE IF EXISTS public.analytics CASCADE;

-- 테이블 생성
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  browser TEXT,
  os TEXT,
  device TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  page_views INTEGER DEFAULT 1,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스
CREATE INDEX idx_analytics_session ON public.analytics(session_id);
CREATE INDEX idx_analytics_page ON public.analytics(page_path);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at DESC);

-- RLS 활성화
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "analytics_select_policy" ON public.analytics FOR SELECT TO public USING (true);
CREATE POLICY "analytics_insert_policy" ON public.analytics FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "analytics_update_policy" ON public.analytics FOR UPDATE TO public 
  USING (created_at > NOW() - INTERVAL '24 hours') 
  WITH CHECK (created_at > NOW() - INTERVAL '24 hours');

-- 자동 정리 함수 (90일 이상 오래된 데이터 삭제)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.analytics WHERE created_at < NOW() - INTERVAL '90 days';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 자동 정리 트리거
CREATE TRIGGER cleanup_analytics_trigger
  AFTER INSERT ON public.analytics
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_old_analytics();

-- ============================================
-- 3. contacts (연락처) 테이블
-- ============================================

-- 기존 삭제
DROP POLICY IF EXISTS "contacts_select_policy" ON public.contacts;
DROP POLICY IF EXISTS "contacts_insert_policy" ON public.contacts;
DROP POLICY IF EXISTS "contacts_delete_policy" ON public.contacts;
DROP POLICY IF EXISTS "contacts_update_policy" ON public.contacts;
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
DROP TABLE IF EXISTS public.contacts CASCADE;

-- 테이블 생성
CREATE TABLE public.contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX idx_contacts_replied ON public.contacts(replied);

-- RLS 활성화
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "contacts_select_policy" ON public.contacts FOR SELECT TO public USING (true);
CREATE POLICY "contacts_insert_policy" ON public.contacts FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "contacts_delete_policy" ON public.contacts FOR DELETE TO public USING (true);
CREATE POLICY "contacts_update_policy" ON public.contacts FOR UPDATE TO public USING (true) WITH CHECK (true);

-- ============================================
-- 4. apps (앱 데이터) 테이블
-- ============================================

-- 기존 삭제
DROP POLICY IF EXISTS "apps_select_policy" ON public.apps;
DROP POLICY IF EXISTS "apps_insert_policy" ON public.apps;
DROP POLICY IF EXISTS "apps_update_policy" ON public.apps;
DROP POLICY IF EXISTS "apps_delete_policy" ON public.apps;
DROP TRIGGER IF EXISTS update_apps_updated_at ON public.apps;
DROP TABLE IF EXISTS public.apps CASCADE;

-- 테이블 생성
CREATE TABLE public.apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  category_id TEXT,
  url TEXT NOT NULL,
  image TEXT,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스
CREATE INDEX idx_apps_slug ON public.apps(slug);
CREATE INDEX idx_apps_category ON public.apps(category_id);
CREATE INDEX idx_apps_hidden ON public.apps(hidden);

-- RLS 활성화
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "apps_select_policy" ON public.apps FOR SELECT TO public USING (true);
CREATE POLICY "apps_insert_policy" ON public.apps FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "apps_update_policy" ON public.apps FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "apps_delete_policy" ON public.apps FOR DELETE TO public USING (true);

-- ============================================
-- 공통 함수: updated_at 자동 업데이트
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 각 테이블에 트리거 추가
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at
  BEFORE UPDATE ON public.analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 테이블 코멘트
-- ============================================

COMMENT ON TABLE public.chat_messages IS '방명록 메시지';
COMMENT ON TABLE public.analytics IS '실시간 방문자 통계';
COMMENT ON TABLE public.contacts IS '연락처 문의';
COMMENT ON TABLE public.apps IS '앱 데이터';

-- ============================================
-- 확인 쿼리
-- ============================================

-- 테이블 목록
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('chat_messages', 'analytics', 'contacts', 'apps')
ORDER BY tablename;

-- 정책 목록
SELECT 
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('chat_messages', 'analytics', 'contacts', 'apps')
ORDER BY tablename, cmd, policyname;

-- 인덱스 목록
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('chat_messages', 'analytics', 'contacts', 'apps')
ORDER BY tablename, indexname;

-- 트리거 목록
SELECT 
  event_object_table as table_name,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('chat_messages', 'analytics', 'contacts', 'apps')
ORDER BY event_object_table, trigger_name;

-- 결과 요약
SELECT '✅ 데이터베이스 설정 완료!' as status,
       (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('chat_messages', 'analytics', 'contacts', 'apps')) as table_count,
       (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('chat_messages', 'analytics', 'contacts', 'apps')) as policy_count,
       (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('chat_messages', 'analytics', 'contacts', 'apps')) as index_count;

