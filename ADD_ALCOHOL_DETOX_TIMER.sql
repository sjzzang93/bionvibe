-- 음주 해독 계산기 앱 추가

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
  'alcohol-detox-timer',
  '음주 해독 계산기',
  'alcohol-detox-timer',
  '🍺',
  'Widmark 공식 기반 혈중알코올농도(BAC) 계산. 마신 술과 시간을 입력하면 운전 가능 시간과 완전 해독 시간을 알려드립니다.',
  'health-calc',
  '/apps/alcohol-detox-timer',
  'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop',
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
