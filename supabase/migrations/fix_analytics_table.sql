-- Fix analytics table schema to match code requirements
-- 2025-01-03

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- page_path
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='analytics' AND column_name='page_path') THEN
        ALTER TABLE public.analytics ADD COLUMN page_path TEXT;
    END IF;

    -- device (코드에서 사용)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='analytics' AND column_name='device') THEN
        ALTER TABLE public.analytics ADD COLUMN device TEXT;
    END IF;

    -- duration_seconds (코드에서 사용)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='analytics' AND column_name='duration_seconds') THEN
        ALTER TABLE public.analytics ADD COLUMN duration_seconds INTEGER DEFAULT 0;
    END IF;

    -- screen_width
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='analytics' AND column_name='screen_width') THEN
        ALTER TABLE public.analytics ADD COLUMN screen_width INTEGER;
    END IF;

    -- screen_height
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='analytics' AND column_name='screen_height') THEN
        ALTER TABLE public.analytics ADD COLUMN screen_height INTEGER;
    END IF;

    -- duration 컬럼이 NULL 허용이면 DEFAULT 추가
    ALTER TABLE public.analytics ALTER COLUMN duration SET DEFAULT 0;

    RAISE NOTICE '✅ Analytics 테이블 스키마 수정 완료!';
END $$;
