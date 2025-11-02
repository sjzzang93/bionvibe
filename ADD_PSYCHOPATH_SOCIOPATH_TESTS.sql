-- 싸이코패스 및 소시오패스 테스트 앱 추가

-- 1. 싸이코패스 성향 테스트
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
  'psychopath-test',
  '싸이코패스 성향 테스트',
  'psychopath-test',
  '🧠',
  'PCL-R 기반 심리 평가로 반사회적 성향을 측정합니다. 30개 질문으로 4가지 요인을 분석하여 자기 인식과 성찰의 기회를 제공합니다.',
  'fortune-mind',
  '/apps/psychopath-test',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
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

-- 2. 소시오패스 성향 테스트
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
  'sociopath-test',
  '소시오패스 성향 테스트',
  'sociopath-test',
  '👥',
  'ASPD(반사회성 성격장애) 기반 평가로 충동성, 공격성, 무책임성 등을 측정합니다. 30개 질문으로 9가지 요인을 분석하고 개선 방향을 제시합니다.',
  'fortune-mind',
  '/apps/sociopath-test',
  'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&auto=format&fit=crop',
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

-- 관련 앱 관계 추가 (선택사항)
-- psychopath-test의 관련 앱: sociopath-test, mbti-test, draw-psychology, inner-dialog
-- sociopath-test의 관련 앱: psychopath-test, mbti-test, draw-psychology, inner-dialog
