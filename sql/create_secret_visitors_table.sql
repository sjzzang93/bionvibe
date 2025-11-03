-- Secret Vault 방문자 추적 테이블 생성/업데이트
-- Supabase SQL Editor에서 아래 SQL을 실행하세요

-- 1. 방문자 테이블 생성 (없으면)
CREATE TABLE IF NOT EXISTS secret_visitors (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  visit_count INTEGER DEFAULT 1,
  first_visit TIMESTAMPTZ DEFAULT NOW(),
  last_visit TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 기존 테이블에 컬럼 추가 (없으면)
DO $$
BEGIN
  -- country 컬럼 추가
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='secret_visitors' AND column_name='country') THEN
    ALTER TABLE secret_visitors ADD COLUMN country TEXT;
  END IF;

  -- user_agent 컬럼 추가
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='secret_visitors' AND column_name='user_agent') THEN
    ALTER TABLE secret_visitors ADD COLUMN user_agent TEXT;
  END IF;
END $$;

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_secret_visitors_ip ON secret_visitors(ip_address);
CREATE INDEX IF NOT EXISTS idx_secret_visitors_last_visit ON secret_visitors(last_visit DESC);
CREATE INDEX IF NOT EXISTS idx_secret_visitors_country ON secret_visitors(country);

-- 4. RLS (Row Level Security) 비활성화
ALTER TABLE secret_visitors DISABLE ROW LEVEL SECURITY;

-- 완료! 이제 /secret 페이지 방문 시 자동으로 방문자가 기록됩니다.
