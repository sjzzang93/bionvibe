-- ============================================
-- 🔐 BBQ 개별 앱 4개 삭제 → 올인원 1개로 교체
-- Supabase SQL Editor에 복사-붙여넣기 후 실행
-- ============================================

-- Step 1: apps 테이블에 hidden 컬럼 추가 (없는 경우만)
ALTER TABLE apps ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Step 2: hidden 컬럼에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_apps_hidden ON apps(hidden);

-- ============================================
-- 기존 4개 개별 앱 삭제
-- ============================================

DELETE FROM apps WHERE id IN (
  'pricing-sim',
  'bbq-sim-v3',
  'break-even',
  'break-even-advanced'
);

-- ============================================
-- BBQ 올인원 계산기 추가 (4개 통합)
-- ============================================

INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'bbq-all-in-one',
  'BBQ 올인원 계산기',
  'bbq-all-in-one',
  '🍖',
  '가격 시뮬레이터와 손익분기 계산을 한 곳에서 (기본/고급 모드)',
  'money-calc',
  '/secret/bbq-all-in-one',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
  NOW(),
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  url = EXCLUDED.url,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- ============================================
-- 완료! 기존 4개 삭제, 올인원 1개 추가됨
-- /secret 페이지에서 확인하세요
-- ============================================
