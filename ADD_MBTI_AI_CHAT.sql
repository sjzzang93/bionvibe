-- MBTI AI 채팅 앱 추가

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
)
VALUES (
  'mbti-ai-chat',
  'MBTI AI 채팅',
  'mbti-ai-chat',
  '💬',
  '내 MBTI 유형과 대화하기',
  'fortune-mind',
  '/apps/mbti-ai-chat',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop',
  NOW(),
  NOW(),
  false
);

-- 확인
SELECT id, name, icon, description, category_id 
FROM apps 
WHERE id = 'mbti-ai-chat';

