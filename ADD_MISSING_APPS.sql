-- MBTI+띠 궁합, 감정일기, 닮은동물찾기, 이름/닉네임 생성기, 색깔 찾기 게임 앱 추가
-- Supabase SQL Editor에서 실행하세요

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
) VALUES
-- 감정 일기
(
  'emotion-diary',
  '감정 일기',
  'emotion-diary',
  '🌈',
  '매일의 감정을 기록하고 분석해보세요',
  'fortune-mind',
  '/apps/emotion-diary',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80',
  '2025-10-23T00:00:00Z',
  false
),
-- MBTI+띠 궁합
(
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
),
-- 닮은 동물 찾기
(
  'animal-face-match',
  '닮은 동물 찾기',
  'animal-face-match',
  '🐶',
  '사진으로 나와 닮은 동물을 찾아보세요',
  'fortune-mind',
  '/apps/animal-face-match',
  'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=80',
  '2025-10-23T00:00:00Z',
  false
),
-- 이름/닉네임 생성기
(
  'nickname-generator',
  '이름/닉네임 생성기',
  'nickname-generator',
  '✨',
  'AI가 제안하는 찰떡 이름과 닉네임',
  'learning-tools',
  '/apps/nickname-generator',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/nickname-generator-1761423330943.webp',
  '2025-10-23T00:00:00Z',
  false
),
-- 색깔 찾기 게임
(
  'color-finder-game',
  '색깔 찾기 게임',
  'color-finder-game',
  '🎨',
  '비슷한 색 중 정답을 찾는 집중력 테스트',
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
  category_id = EXCLUDED.category_id,
  url = EXCLUDED.url,
  hidden = EXCLUDED.hidden;
