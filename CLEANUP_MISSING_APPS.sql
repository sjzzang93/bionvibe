-- 실제 파일이 없거나 이동한 앱들 정리

-- 1. 삭제할 앱 확인
SELECT id, name, slug 
FROM apps 
WHERE slug IN (
  'vitamin-check',        -- 삭제됨
  'travel-destinations',  -- 파일 없음
  'study-dev-vocab'       -- 히든 페이지로 이동
);

-- 2. 앱 삭제
DELETE FROM apps
WHERE slug IN (
  'vitamin-check',
  'travel-destinations',
  'study-dev-vocab'
);

-- 3. gift-recommend의 slug를 gift-finder로 수정
UPDATE apps
SET 
  slug = 'gift-finder',
  updated_at = NOW()
WHERE slug = 'gift-recommend';

-- 4. 결과 확인
SELECT COUNT(*) as total_apps FROM apps;

-- 5. 남은 앱 목록
SELECT slug, name 
FROM apps 
ORDER BY slug;

