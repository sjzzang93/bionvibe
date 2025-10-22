-- ===================================================================
-- 히든 페이지 이동 & 삭제 처리
-- ===================================================================
-- 1. Cursor 프롬프트 → 히든페이지 이동
-- 2. 개발 용어 사전 → 히든페이지 이동 (삭제 대신 숨김 처리)
-- ===================================================================

-- hidden 컬럼이 없으면 추가
ALTER TABLE apps 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Cursor 프롬프트를 히든 페이지로 이동
UPDATE apps 
SET hidden = true 
WHERE id = 'study-cursor-prompts' OR slug = 'study-cursor-prompts';

-- 개발 용어 사전을 히든 페이지로 이동
UPDATE apps 
SET hidden = true 
WHERE id = 'study-dev-vocab' OR slug = 'study-dev-vocab';

-- 중복된 gift-recommend 삭제 (gift-finder 유지)
DELETE FROM apps 
WHERE id = 'gift-recommend' OR slug = 'gift-recommend';

-- 확인
SELECT id, name, slug, hidden 
FROM apps 
WHERE id IN ('study-cursor-prompts', 'study-dev-vocab')
   OR slug IN ('study-cursor-prompts', 'study-dev-vocab')
ORDER BY name;

-- gift-finder만 남았는지 확인
SELECT id, name, slug 
FROM apps 
WHERE id IN ('gift-finder', 'gift-recommend')
   OR slug IN ('gift-finder', 'gift-recommend')
ORDER BY name;

