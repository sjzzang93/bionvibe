-- ========================================
-- BION VIBE 데이터베이스 정리 (한방 실행용)
-- ========================================

-- 1️⃣ 삭제할 앱 확인
SELECT '=== 삭제될 앱 ===' as status;
SELECT id, name, slug 
FROM apps 
WHERE slug IN (
  'vitamin-check',
  'travel-destinations',
  'study-dev-vocab'
);

-- 2️⃣ 앱 삭제
DELETE FROM apps
WHERE slug IN (
  'vitamin-check',
  'travel-destinations',
  'study-dev-vocab'
);

-- 3️⃣ gift-recommend → gift-finder slug 수정
UPDATE apps
SET 
  slug = 'gift-finder',
  updated_at = NOW()
WHERE slug = 'gift-recommend';

-- 4️⃣ 풍수지리 앱 이름 변경
UPDATE apps
SET 
  name = '내집 풍수지리 보기',
  updated_at = NOW()
WHERE slug = 'fengshui-guide';

-- 5️⃣ 최종 결과 확인
SELECT '=== 전체 앱 개수 ===' as status;
SELECT COUNT(*) as total_apps FROM apps;

SELECT '=== 수정된 앱들 ===' as status;
SELECT slug, name, updated_at
FROM apps 
WHERE slug IN ('gift-finder', 'fengshui-guide')
ORDER BY slug;

SELECT '=== 모든 앱 목록 ===' as status;
SELECT slug, name 
FROM apps 
ORDER BY slug;

