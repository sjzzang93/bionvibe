-- Aura Color Test 앱 추가
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
  hidden
) VALUES (
  'aura-color',
  '나의 기운색 테스트',
  'aura-color',
  '🌈',
  '오늘의 감정과 상태를 입력하면 당신만의 오라 색상을 3D로 시각화해드립니다. 기운 히스토리를 기록하고 감정 패턴을 분석하세요.',
  'fortune-mind',
  '/apps/aura-color',
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop',
  NOW(),
  false
)
ON CONFLICT (id) 
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  icon = EXCLUDED.icon,
  url = EXCLUDED.url,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;
