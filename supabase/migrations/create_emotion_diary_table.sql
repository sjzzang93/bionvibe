-- ============================================
-- 감정 컬러 일기 테이블 생성
-- ============================================

-- 기존 테이블이 있다면 삭제
DROP TABLE IF EXISTS public.emotion_diary CASCADE;

-- emotion_diary 테이블 생성
CREATE TABLE public.emotion_diary (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- 익명 사용자 ID (브라우저 고유값)
  date DATE NOT NULL,
  emotion TEXT NOT NULL,
  color TEXT NOT NULL,
  emoji TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, date) -- 한 사용자가 같은 날짜에 중복 기록 방지
);

-- 인덱스 생성 (쿼리 성능 향상)
CREATE INDEX idx_emotion_diary_user_id ON public.emotion_diary(user_id);
CREATE INDEX idx_emotion_diary_date ON public.emotion_diary(date DESC);
CREATE INDEX idx_emotion_diary_created_at ON public.emotion_diary(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.emotion_diary ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read emotion diary"
  ON public.emotion_diary
  FOR SELECT
  TO public
  USING (true);

-- RLS 정책: 모든 사용자가 삽입 가능
CREATE POLICY "Anyone can insert emotion diary"
  ON public.emotion_diary
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS 정책: 모든 사용자가 업데이트 가능
CREATE POLICY "Anyone can update emotion diary"
  ON public.emotion_diary
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- RLS 정책: 모든 사용자가 삭제 가능
CREATE POLICY "Anyone can delete emotion diary"
  ON public.emotion_diary
  FOR DELETE
  TO public
  USING (true);

-- 자동 updated_at 업데이트 함수
CREATE OR REPLACE FUNCTION update_emotion_diary_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS update_emotion_diary_updated_at_trigger ON public.emotion_diary;
CREATE TRIGGER update_emotion_diary_updated_at_trigger
  BEFORE UPDATE ON public.emotion_diary
  FOR EACH ROW
  EXECUTE FUNCTION update_emotion_diary_updated_at();

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ emotion_diary 테이블 생성 완료!';
  RAISE NOTICE '📊 이제 감정 일기가 서버에 저장됩니다.';
END $$;
