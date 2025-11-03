-- ADHD 자가진단 테스트 앱 추가

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
  'adhd-test',
  'ADHD 자가진단',
  'adhd-test',
  '🧠',
  'WHO ASRS-v1.1 기반 성인 ADHD 자가진단 검사. 18개 문항으로 주의력 결핍 및 과잉행동 증상을 평가하고 전문적인 분석 결과를 제공합니다.',
  'fortune-mind',
  '/apps/adhd-test',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop',
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
