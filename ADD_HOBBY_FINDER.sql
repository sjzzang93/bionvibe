-- 성향별 취미 찾기 앱 추가

INSERT INTO apps (
  id,
  name,
  slug,
  icon,
  description,
  category_id,
  url,
  image,
  created_at,
  updated_at,
  hidden
) VALUES (
  'hobby-finder',
  '성향별 취미 찾기',
  'hobby-finder',
  '🎯',
  '35문항 테스트로 당신에게 딱 맞는 취미 추천',
  'fortune-mind',
  '/apps/hobby-finder',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
  NOW(),
  NOW(),
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  image = EXCLUDED.image,
  updated_at = NOW();

-- 완료!
SELECT 'hobby-finder 앱이 성공적으로 추가되었습니다!' as result;

