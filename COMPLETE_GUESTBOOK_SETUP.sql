-- ============================================
-- 방명록 (chat_messages) 테이블 완전 재설정
-- 전체 복사-붙여넣기용 (한 번에 실행)
-- ============================================

-- 1단계: 기존 테이블 완전 삭제 (정책, 트리거, 테이블 순서로)
DROP POLICY IF EXISTS "Allow delete for everyone" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.chat_messages;
DROP POLICY IF EXISTS "Delete messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.chat_messages;
DROP POLICY IF EXISTS "Public can delete" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete_policy" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.chat_messages;
DROP POLICY IF EXISTS "Insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Public can insert" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.chat_messages;
DROP POLICY IF EXISTS "Read messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Public can read" ON public.chat_messages;

DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON public.chat_messages;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;

-- 2단계: 테이블 생성
CREATE TABLE public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3단계: 인덱스 생성
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_nickname ON public.chat_messages(nickname);

-- 4단계: updated_at 자동 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5단계: updated_at 트리거 생성
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6단계: RLS 활성화
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 7단계: RLS 정책 생성

-- SELECT (읽기) - 모든 사용자 허용
CREATE POLICY "chat_messages_select_policy"
  ON public.chat_messages
  FOR SELECT
  TO public
  USING (true);

-- INSERT (쓰기) - 모든 사용자 허용
CREATE POLICY "chat_messages_insert_policy"
  ON public.chat_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- DELETE (삭제) - 모든 사용자 허용
CREATE POLICY "chat_messages_delete_policy"
  ON public.chat_messages
  FOR DELETE
  TO public
  USING (true);

-- UPDATE (수정) - 모든 사용자 허용
CREATE POLICY "chat_messages_update_policy"
  ON public.chat_messages
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 8단계: 테이블 코멘트 추가
COMMENT ON TABLE public.chat_messages IS '방명록 메시지 테이블';
COMMENT ON COLUMN public.chat_messages.id IS '메시지 고유 ID';
COMMENT ON COLUMN public.chat_messages.nickname IS '작성자 닉네임';
COMMENT ON COLUMN public.chat_messages.message IS '메시지 내용';
COMMENT ON COLUMN public.chat_messages.created_at IS '작성 시간';
COMMENT ON COLUMN public.chat_messages.updated_at IS '수정 시간';

-- ============================================
-- 확인 쿼리
-- ============================================

-- 테이블 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  tableowner
FROM pg_tables
WHERE tablename = 'chat_messages';

-- 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'chat_messages'
ORDER BY cmd, policyname;

-- 인덱스 확인
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'chat_messages';

-- 트리거 확인
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'chat_messages';

-- 결과 확인:
-- ✅ rowsecurity = true
-- ✅ 정책 4개 (SELECT, INSERT, DELETE, UPDATE)
-- ✅ 인덱스 2개 (created_at, nickname)
-- ✅ 트리거 1개 (update_chat_messages_updated_at)

SELECT '✅ 방명록 테이블 설정 완료!' as status;

