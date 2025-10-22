-- 방명록 삭제 기능 수정
-- chat_messages 테이블의 DELETE 정책 추가/수정

-- 기존 DELETE 정책 삭제
DROP POLICY IF EXISTS "Anyone can delete messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.chat_messages;
DROP POLICY IF EXISTS "Delete messages" ON public.chat_messages;

-- 새로운 DELETE 정책 생성 (모든 사용자가 삭제 가능)
CREATE POLICY "Allow delete for everyone"
  ON public.chat_messages
  FOR DELETE
  TO public
  USING (true);

-- 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'chat_messages'
ORDER BY cmd, policyname;

-- RLS 활성화 상태 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'chat_messages';

