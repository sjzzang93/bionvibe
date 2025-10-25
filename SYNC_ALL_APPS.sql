-- apps.json의 모든 앱을 Supabase에 동기화
-- 생성일시: 2025-10-25T20:15:41.851Z
-- 총 55개 앱

-- 1. 오늘의 운세
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'today-fortune',
  '오늘의 운세',
  'today-fortune',
  '🌟',
  '오늘 하루 어떨까?',
  'fortune-mind',
  '/apps/today-fortune',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/today-fortune-1761161065680.webp',
  '2025-01-20T00:00:00Z',
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

-- 2. MBTI 테스트
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'mbti-test',
  'MBTI 테스트',
  'mbti-test',
  '🎭',
  '32문항으로 알아보는 정확한 성격 유형',
  'fortune-mind',
  '/apps/mbti-test',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/mbti-test-1761161269054.webp',
  '2025-01-20T00:00:00Z',
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

-- 3. MBTI AI 채팅
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'mbti-ai-chat',
  'MBTI AI 채팅',
  'mbti-ai-chat',
  '💬',
  '내 MBTI 유형과 대화하기',
  'fortune-mind',
  '/apps/mbti-ai-chat',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/mbti-ai-chat-1761423324154.webp',
  '2025-01-22T00:00:00Z',
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

-- 4. MBTI+띠 궁합
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

-- 5. 물 섭취량 계산기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'water-intake',
  '물 섭취량 계산기',
  'water-intake',
  '💧',
  '하루 물 섭취량 계산',
  'health-routine',
  '/apps/water-intake',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/water-intake-1761161287991.webp',
  '2025-01-20T00:00:00Z',
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

-- 6. 칼로리 계산기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'calorie-calculator',
  '칼로리 계산기',
  'calorie-calculator',
  '🍎',
  '하루 권장 칼로리 계산',
  'health-routine',
  '/apps/calorie-calculator',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/calorie-calculator-1761161777763.webp',
  '2025-01-20T00:00:00Z',
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

-- 7. 카페인 계산기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'coffee-calculator',
  '카페인 계산기',
  'coffee-calculator',
  '☕',
  '카페인 섭취량 분석',
  'health-routine',
  '/apps/coffee-calculator',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/coffee-calculator-1761161703252.webp',
  '2025-01-20T00:00:00Z',
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

-- 8. 습관 트래커
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'habit-tracker',
  '습관 트래커',
  'habit-tracker',
  '🎯',
  '21/66/100일 습관 만들기',
  'learning-tools',
  '/apps/habit-tracker',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/habit-tracker-1761161813047.webp',
  '2025-01-20T00:00:00Z',
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

-- 9. 모의투자
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'crypto-calculator',
  '모의투자',
  'crypto-calculator',
  '⚡',
  '실시간 시세 & 투자 수익률 시뮬레이션',
  'money-calc',
  '/apps/crypto-calculator',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/crypto-calculator-1761162273481.webp',
  '2025-01-20T00:00:00Z',
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

-- 10. 부모님과 시간 계산기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'parents-time',
  '부모님과 시간 계산기',
  'parents-time',
  '💕',
  '부모님과 남은 시간 계산',
  'family-life',
  '/apps/parents-time',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/parents-time-1761161661361.webp',
  '2025-01-20T00:00:00Z',
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

-- 11. 영어 플래시카드
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'flashcard',
  '영어 플래시카드',
  'flashcard',
  '📚',
  '레벨별 영어 단어 암기',
  'learning-tools',
  '/apps/flashcard',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/flashcard-1761162036686.webp',
  '2025-01-20T00:00:00Z',
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

-- 12. 공기질 측정기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'air-quality',
  '공기질 측정기',
  'air-quality',
  '🌫️',
  '실시간 미세먼지 측정',
  'health-routine',
  '/apps/air-quality',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/air-quality-1761161937238.webp',
  '2025-01-20T00:00:00Z',
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

-- 13. 타이핑 속도 테스트
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'typing-speed-test',
  '타이핑 속도 테스트',
  'typing-speed-test',
  '⌨️',
  '타자 속도 측정 및 연습',
  'learning-tools',
  '/apps/typing-speed-test',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/typing-speed-test-1761161967661.webp',
  '2025-10-20T00:00:00Z',
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

-- 14. 여자어 남자어 맞추기
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

-- 15. 반사신경 테스트
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'reflex-test',
  '반사신경 테스트',
  'reflex-test',
  '⚡',
  '반응속도 테스트',
  'learning-tools',
  '/apps/reflex-test',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/reflex-test-1761161845350.webp',
  '2025-10-20T00:00:00Z',
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

-- 16. 시력 테스트
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'eye-test',
  '시력 테스트',
  'eye-test',
  '👁️',
  '시력 건강 체크',
  'health-routine',
  '/apps/eye-test',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/eye-test-1761161874801.webp',
  '2025-10-20T00:00:00Z',
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

-- 17. 명언 생성기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'quote-generator',
  '명언 생성기',
  'quote-generator',
  '💭',
  '매일 새로운 명언',
  'fortune-mind',
  '/apps/quote-generator',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/quote-generator-1761162003289.webp',
  '2025-10-20T00:00:00Z',
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

-- 18. 디데이 카운터
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'dday-counter',
  '디데이 카운터',
  'dday-counter',
  '📅',
  '중요한 날 카운트다운',
  'money-calc',
  '/apps/dday-counter',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/dday-counter-1761162661531.webp',
  '2025-10-20T00:00:00Z',
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

-- 19. 집중 타이머
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'focus-timer',
  '집중 타이머',
  'focus-timer',
  '⏰',
  '뽀모도로 집중 타이머',
  'learning-tools',
  '/apps/focus-timer',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/focus-timer-1761162734091.webp',
  '2025-10-20T00:00:00Z',
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

-- 20. 수면 분석기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'sleep-analyzer',
  '수면 분석기',
  'sleep-analyzer',
  '😴',
  '수면 패턴 분석',
  'health-routine',
  '/apps/sleep-analyzer',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/sleep-analyzer-1761161903920.webp',
  '2025-10-20T00:00:00Z',
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

-- 21. 비타민 체크
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'vitamin-check',
  '비타민 체크',
  'vitamin-check',
  '💊',
  '필요한 영양소 진단',
  'health-routine',
  '/apps/vitamin-check',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/vitamin-check-1761162597634.webp',
  '2025-10-20T00:00:00Z',
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

-- 22. 색상 심리
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'color-psychology',
  '색상 심리',
  'color-psychology',
  '🎨',
  '심리 분석',
  'fortune-mind',
  '/apps/color-psychology',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/color-psychology-1761162904892.webp',
  '2025-10-20T00:00:00Z',
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

-- 23. 목소리 운세
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'voice-fortune',
  '목소리 운세',
  'voice-fortune',
  '🎤',
  '오늘의 운세 확인',
  'fortune-mind',
  '/apps/voice-fortune',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/voice-fortune-1761162832085.webp',
  '2025-10-20T00:00:00Z',
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

-- 24. 필적 분석
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'analysis-handwriting',
  '필적 분석',
  'analysis-handwriting',
  '✍️',
  '상세 분석 결과',
  'fortune-mind',
  '/apps/analysis-handwriting',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/analysis-handwriting-1761423326838.webp',
  '2025-10-20T00:00:00Z',
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

-- 25. 미니 게임
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'arcade-mini-games',
  '미니 게임',
  'arcade-mini-games',
  '🎮',
  '재미있는 게임',
  'learning-tools',
  '/apps/arcade-mini-games',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/arcade-mini-games-1761161678400.webp',
  '2025-10-20T00:00:00Z',
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

-- 26. 금연 챌린지
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'quit-smoking-challenge',
  '금연 챌린지',
  'quit-smoking-challenge',
  '🚭',
  '도전 과제',
  'health-routine',
  '/apps/quit-smoking-challenge',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/quit-smoking-challenge-1761162333404.webp',
  '2025-10-20T00:00:00Z',
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

-- 27. 차량 관리
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'car-maintenance',
  '차량 관리',
  'car-maintenance',
  '🚗',
  '69개 경고등의 의미와 대처법을 한눈에',
  'learning-tools',
  '/apps/car-maintenance',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/car-maintenance-1761161538314.webp',
  '2025-01-21T00:00:00Z',
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

-- 28. 영양제 추천
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'health-supplement-recommend',
  '영양제 추천',
  'health-supplement-recommend',
  '💊',
  '증상과 생활습관에 맞는 맞춤형 영양제 추천',
  'health-routine',
  '/apps/health-supplement-recommend',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/health-supplement-recommend-1761161563626.webp',
  '2025-01-21T00:00:00Z',
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

-- 29. 얼굴형 분석
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'face-shape',
  '얼굴형 분석',
  'face-shape',
  '😊',
  '상세 분석 결과',
  'fortune-mind',
  '/apps/face-shape',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/face-shape-1761161493081.webp',
  '2025-10-20T00:00:00Z',
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

-- 30. 관상 분석
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'lifestyle-face-fortune',
  '관상 분석',
  'lifestyle-face-fortune',
  '👁️',
  '상세 분석 결과',
  'fortune-mind',
  '/apps/lifestyle-face-fortune',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/lifestyle-face-fortune-1761161516223.webp',
  '2025-10-20T00:00:00Z',
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

-- 31. 손금 보기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'lifestyle-palm-reading',
  '손금 보기',
  'lifestyle-palm-reading',
  '👋',
  '전통 수상학 기반 AI 분석! 7대 손금선 정밀 분석 + 27가지 패턴 분류',
  'fortune-mind',
  '/apps/lifestyle-palm-reading',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/lifestyle-palm-reading-1761161435391.webp',
  '2025-10-21T00:00:00Z',
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

-- 32. 날씨별 옷차림
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'weather-outfit',
  '날씨별 옷차림',
  'weather-outfit',
  '👔',
  '날씨별 서비스',
  'health-routine',
  '/apps/weather-outfit',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/weather-outfit-1761423327499.webp',
  '2025-10-20T00:00:00Z',
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

-- 33. IQ 테스트
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'iq-test',
  'IQ 테스트',
  'iq-test',
  '🧠',
  '재미있는 심리 테스트',
  'fortune-mind',
  '/apps/iq-test',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/iq-test-1761161589212.webp',
  '2025-10-20T00:00:00Z',
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

-- 34. 전생 위인찾기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'past-life-job',
  '전생 위인찾기',
  'past-life-job',
  '⏳',
  '전생 서비스',
  'fortune-mind',
  '/apps/past-life-job',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/past-life-job-1761423328201.webp',
  '2025-10-20T00:00:00Z',
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

-- 35. 봉투 추천
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'envelope-recommend',
  '봉투 추천',
  'envelope-recommend',
  '✉️',
  '맞춤 추천',
  'money-calc',
  '/apps/envelope-recommend',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/envelope-recommend-1761423328894.webp',
  '2025-10-20T00:00:00Z',
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

-- 36. 체지방 측정기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'bodyfat-measure',
  '체지방 측정기',
  'bodyfat-measure',
  '⚖️',
  '체지방 서비스',
  'health-routine',
  '/apps/bodyfat-measure',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/bodyfat-measure-1761161368178.webp',
  '2025-10-20T00:00:00Z',
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

-- 37. 기분 전환
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'mood-cheer-up',
  '기분 전환',
  'mood-cheer-up',
  '😊',
  '기분을 분석하고 맞춤 활동을 추천합니다',
  'family-life',
  '/apps/mood-cheer-up',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/mood-cheer-up-1761161320869.webp',
  '2025-01-21T00:00:00Z',
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

-- 38. 목소리 나이
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'voice-age',
  '목소리 나이',
  'voice-age',
  '🗣️',
  '목소리 서비스',
  'fortune-mind',
  '/apps/voice-age',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/voice-age-1761161305307.webp',
  '2025-10-20T00:00:00Z',
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

-- 39. 퍼즐 게임
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'games-puzzle',
  '퍼즐 게임',
  'games-puzzle',
  '🧩',
  '재미있는 게임',
  'learning-tools',
  '/apps/games-puzzle',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/games-puzzle-1761161469812.webp',
  '2025-10-20T00:00:00Z',
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

-- 40. 구구단 게임
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'games-multiplication',
  '구구단 게임',
  'games-multiplication',
  '🔢',
  '재미있는 게임',
  'learning-tools',
  '/apps/games-multiplication',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/games-multiplication-1761162516220.webp',
  '2025-10-20T00:00:00Z',
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

-- 41. 꿈 해몽
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'dream-interpreter',
  '꿈 해몽',
  'dream-interpreter',
  '💤',
  '꿈 서비스',
  'fortune-mind',
  '/apps/dream-interpreter',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/dream-interpreter-1761161241812.webp',
  '2025-10-20T00:00:00Z',
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

-- 42. 여행지 추천
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'travel-destinations',
  '여행지 추천',
  'travel-destinations',
  '✈️',
  '맞춤 추천',
  'money-calc',
  '/apps/travel-destinations',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/travel-destinations-1761423329593.webp',
  '2025-10-20T00:00:00Z',
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

-- 43. 여행 짐 체크
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'travel-packing-list',
  '여행 짐 체크',
  'travel-packing-list',
  '🧳',
  '여행 서비스',
  'money-calc',
  '/apps/travel-packing-list',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/travel-packing-list-1761161453354.webp',
  '2025-10-20T00:00:00Z',
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

-- 44. 아침식사 추천
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'breakfast-what-to-eat',
  '아침식사 추천',
  'breakfast-what-to-eat',
  '🍳',
  '맞춤 추천',
  'health-routine',
  '/apps/breakfast-what-to-eat',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/breakfast-what-to-eat-1761162396609.webp',
  '2025-10-20T00:00:00Z',
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

-- 45. 전기요금 계산기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'utility-electricity-calculator',
  '전기요금 계산기',
  'utility-electricity-calculator',
  '⚡',
  '빠른 계산',
  'money-calc',
  '/apps/utility-electricity-calculator',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/utility-electricity-calculator-1761423330276.webp',
  '2025-10-20T00:00:00Z',
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

-- 46. 디지털 나침반
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'compass',
  '디지털 나침반',
  'compass',
  '🧭',
  '실시간 방향 확인! 360도 회전 나침반, 모바일 최적화',
  'learning-tools',
  '/apps/compass',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/compass-1761161216541.webp',
  '2025-01-21T00:00:00Z',
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

-- 47. 사주와 MBTI의 조합
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'saju-mbti-jobs',
  '사주와 MBTI의 조합',
  'saju-mbti-jobs',
  '🔮',
  '성격 유형 테스트',
  'fortune-mind',
  '/apps/saju-mbti-jobs',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/saju-mbti-jobs-1761161111832.webp',
  '2025-10-20T00:00:00Z',
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

-- 48. 풍수지리 점수
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'fengshui-guide',
  '풍수지리 점수',
  'fengshui-guide',
  '🏠',
  '과학적 해석과 체크리스트로 배우는 현대 풍수',
  'fortune-mind',
  '/apps/fengshui-guide',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/fengshui-guide-1761161139219.webp',
  '2025-01-21T00:00:00Z',
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

-- 49. 선물 추천
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'gift-finder',
  '선물 추천',
  'gift-finder',
  '🎁',
  '200개 이상의 선물 데이터로 완벽한 선물 찾기',
  'family-life',
  '/apps/gift-finder',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/gift-finder-1761161097597.webp',
  '2025-01-21T00:00:00Z',
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

-- 50. 이름/닉네임 생성기
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
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  url = EXCLUDED.url,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 51. 색깔 찾기 게임
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
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  url = EXCLUDED.url,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

-- 52. 감정 일기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'emotion-diary',
  '감정 일기',
  'emotion-diary',
  '🌈',
  '감정 서비스',
  'fortune-mind',
  '/apps/emotion-diary',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/emotion-diary-1761423332269.webp',
  '2025-10-23T00:00:00Z',
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

-- 53. 닮은 동물 찾기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'animal-face-match',
  '닮은 동물 찾기',
  'animal-face-match',
  '🐶',
  '닮은 서비스',
  'fortune-mind',
  '/apps/animal-face-match',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/animal-face-match-1761423332974.webp',
  '2025-10-23T00:00:00Z',
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

-- 54. 냉장고 파먹기
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)
VALUES (
  'fridge-recipe',
  '냉장고 파먹기',
  'fridge-recipe',
  '🧊',
  '냉장고 서비스',
  'family-life',
  '/apps/fridge-recipe',
  'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/fridge-recipe-1761423333603.webp',
  '2025-10-23T00:00:00Z',
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

-- 55. 넌센스 퀴즈 탈출
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
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  url = EXCLUDED.url,
  image = EXCLUDED.image,
  hidden = EXCLUDED.hidden;

