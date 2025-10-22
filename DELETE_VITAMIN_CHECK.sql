-- 비타민 체크 앱 삭제

-- 앱 삭제 전 확인
SELECT id, name, slug 
FROM apps 
WHERE slug = 'vitamin-check';

-- 앱 삭제
DELETE FROM apps
WHERE slug = 'vitamin-check';

-- 삭제 결과 확인
SELECT COUNT(*) as remaining_apps
FROM apps;

