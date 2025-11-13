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
-- 누락된 앱들을 Supabase에 등록

-- 1. 감정 일기
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
  'emotion-diary',
  '감정 일기',
  'emotion-diary',
  '🌈',
  '감정 서비스',
  'fortune-mind',
  '/apps/emotion-diary',
  'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&auto=format&fit=crop',
  '2025-10-23',
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

-- 2. 닮은 동물 찾기
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
  'animal-face-match',
  '닮은 동물 찾기',
  'animal-face-match',
  '🐶',
  '닮은 서비스',
  'fortune-mind',
  '/apps/animal-face-match',
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop',
  '2025-10-23',
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

-- 3. 냉장고 파먹기
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
  'fridge-recipe',
  '냉장고 파먹기',
  'fridge-recipe',
  '🧊',
  '냉장고 서비스',
  'family-life',
  '/apps/fridge-recipe',
  'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=800&auto=format&fit=crop',
  '2025-10-23',
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

-- 4. 이름/닉네임 생성기
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
  'nickname-generator',
  '이름/닉네임 생성기',
  'nickname-generator',
  '✨',
  '이름/닉네임 서비스',
  'learning-tools',
  '/apps/nickname-generator',
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop',
  '2025-10-23',
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

-- 5. 색깔 찾기 게임
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
  'color-finder-game',
  '색깔 찾기 게임',
  'color-finder-game',
  '🎨',
  '재미있는 게임',
  'learning-tools',
  '/apps/color-finder-game',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop',
  '2025-10-23',
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

-- 6. 사춘기 자가진단 검사
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
  'adolescence-test',
  '🧠 사춘기 자가진단 검사',
  'adolescence-test',
  '🧠',
  '청소년기의 나를 이해하는 첫걸음. 32개 질문으로 신체·정서·관계 변화를 종합 분석하고 맞춤형 조언을 제공합니다.',
  'fortune-mind',
  '/apps/adolescence-test',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
  '2025-11-13',
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

-- TV 설치 스케줄러 삭제
DELETE FROM apps WHERE id = 'installation-scheduler';
