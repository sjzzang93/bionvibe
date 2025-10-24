-- 개발용어사전 앱 삭제 SQL
-- Supabase SQL Editor에서 실행하세요

-- study-dev-vocab 앱 삭제
DELETE FROM apps WHERE slug = 'study-dev-vocab';
DELETE FROM apps WHERE slug = 'dev-vocab';
DELETE FROM apps WHERE slug = 'dev-vocab-old';

-- 확인
SELECT slug, name, hidden FROM apps WHERE slug LIKE '%vocab%';

