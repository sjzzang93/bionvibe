-- 풍수지리 앱 이름 변경
-- "풍수지리 실전 도감" → "내집 풍수지리 보기"

UPDATE apps
SET 
  name = '내집 풍수지리 보기',
  updated_at = NOW()
WHERE slug = 'fengshui-guide';

-- 결과 확인
SELECT id, name, slug, updated_at
FROM apps
WHERE slug = 'fengshui-guide';

