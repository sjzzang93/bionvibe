-- BION 앱 이름 업데이트
-- Supabase SQL Editor에 복사-붙여넣기 해서 실행하세요

-- "전생 직업" → "전생 위인찾기"
UPDATE apps 
SET name = '전생 위인찾기'
WHERE slug = 'past-life-job';

-- "모의투자" 이름 확인 및 업데이트 (필요시)
UPDATE apps 
SET name = '모의투자'
WHERE slug = 'crypto-calculator';

-- 변경 결과 확인
SELECT id, name, slug 
FROM apps 
WHERE slug IN ('past-life-job', 'crypto-calculator')
ORDER BY slug;






























