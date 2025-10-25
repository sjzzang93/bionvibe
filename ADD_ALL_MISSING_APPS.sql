-- ============================================
-- 누락된 모든 앱 한 번에 추가 (9개)
-- Supabase SQL Editor에 전체 복사-붙여넣기 후 실행
-- ============================================

-- 1. MBTI+띠 궁합
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'mbti-zodiac-compat',
  'MBTI+띠 궁합',
  'mbti-zodiac-compat',
  '🌌',
  '16 유형 × 12띠 맞춤 궁합 리포트',
  'fortune-mind',
  '/apps/mbti-zodiac-compat',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/mbti-zodiac-compat-1761423325431.webp',
  '2025-10-26T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  url = EXCLUDED.url,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 2. 이름/닉네임 생성기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'nickname-generator',
  '이름/닉네임 생성기',
  'nickname-generator',
  '✨',
  '이름/닉네임 서비스',
  'learning-tools',
  '/apps/nickname-generator',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/nickname-generator-1761423330943.webp',
  '2025-10-23T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 3. 색깔 찾기 게임
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'color-finder-game',
  '색깔 찾기 게임',
  'color-finder-game',
  '🎨',
  '재미있는 게임',
  'learning-tools',
  '/apps/color-finder-game',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/color-finder-game-1761423331614.webp',
  '2025-10-23T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 4. 감정 일기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'emotion-diary',
  '감정 일기',
  'emotion-diary',
  '🌈',
  '매일의 감정을 기록하고 분석해보세요',
  'fortune-mind',
  '/apps/emotion-diary',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/emotion-diary-1761423332269.webp',
  '2025-10-23T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 5. 닮은 동물 찾기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'animal-face-match',
  '닮은 동물 찾기',
  'animal-face-match',
  '🐶',
  '사진으로 나와 닮은 동물을 찾아보세요',
  'fortune-mind',
  '/apps/animal-face-match',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/animal-face-match-1761423332974.webp',
  '2025-10-23T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 6. 냉장고 파먹기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'fridge-recipe',
  '냉장고 파먹기',
  'fridge-recipe',
  '🧊',
  '냉장고 재료로 요리 레시피 추천',
  'family-life',
  '/apps/fridge-recipe',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/fridge-recipe-1761423333603.webp',
  '2025-10-23T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 7. 넌센스 퀴즈 탈출
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'nonsense-escape',
  '넌센스 퀴즈 탈출',
  'nonsense-escape',
  '🧪',
  '웃기지만 은근 어려운 넌센스 미션! 5문제 연속 정답으로 실험실 탈출하기',
  'learning-tools',
  '/apps/nonsense-escape',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/nonsense-escape-1761423334239.webp',
  '2025-10-24T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 8. 로또 번호 생성기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'lotto-generator',
  '로또 번호 생성기',
  'lotto-generator',
  '🍀',
  'AI가 생성하는 행운의 번호',
  'money-calc',
  '/apps/lotto-generator',
  'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop',
  '2025-10-26T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 9. 여자어 남자어 맞추기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'gender-language-quiz',
  '여자어 남자어 맞추기',
  'gender-language-quiz',
  '💬',
  '여자어 · 남자어 신조어 3D 퀴즈',
  'learning-tools',
  '/apps/gender-language-quiz',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/gender-language-quiz-1761423326169.webp',
  '2025-02-07T00:00:00Z',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  url = EXCLUDED.url,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- ============================================
-- 완료! 9개 앱 추가됨
-- 실행 후 홈페이지 새로고침하세요
-- ============================================

