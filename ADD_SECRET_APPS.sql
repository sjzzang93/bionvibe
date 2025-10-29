-- ============================================
-- 🔐 비온바이브 시크릿 앱 추가 (5개)
-- Supabase SQL Editor에 복사-붙여넣기 후 실행
-- ============================================

-- Step 1: apps 테이블에 hidden 컬럼 추가 (없는 경우만)
ALTER TABLE apps ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Step 2: hidden 컬럼에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_apps_hidden ON apps(hidden);

-- ============================================
-- 시크릿 앱 5개 추가
-- ============================================

-- 1. 고깃집 가격 시뮬레이터
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'pricing-sim',
  '고깃집 가격 시뮬레이터',
  'pricing-sim',
  '🥩',
  '가격 인하 및 회전율 전략을 실시간으로 검증하세요',
  'money-calc',
  '/secret/pricing-sim',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
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

-- 2. 고깃집 시뮬레이터 v3 (고급)
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'bbq-sim-v3',
  '고깃집 시뮬레이터 v3',
  'bbq-sim-v3',
  '🍖',
  '메뉴별 세밀한 관리 및 시뮬레이션',
  'money-calc',
  '/secret/bbq-sim-v3',
  'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop',
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

-- 3. 하루 손익분기 계산기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'break-even',
  '하루 손익분기 계산기',
  'break-even',
  '📊',
  '재료비와 고정비를 반영한 손익분기점 분석',
  'money-calc',
  '/secret/break-even',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop',
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

-- 4. 고급 손익분기 계산기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'break-even-advanced',
  '고급 손익분기 계산기',
  'break-even-advanced',
  '📈',
  '메뉴별 상세 분석 및 시나리오 시뮬레이션',
  'money-calc',
  '/secret/break-even-advanced',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
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

-- 5. BBQ 올인원 계산기 (4개 통합)
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
-- 완료! 5개 시크릿 앱 추가됨
-- /secret 페이지에서 확인하세요
-- ============================================
