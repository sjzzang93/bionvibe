-- 3개의 새로운 모니터링 앱 추가

-- 1. 환율 모니터링
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
  'exchange-rate-monitor',
  '실시간 환율 모니터링',
  'exchange-rate-monitor',
  '💱',
  '실시간 환율 추적 및 목표 환율 도달 알림. 주요 통화의 환율을 실시간으로 확인하고, 목표 환율 설정 시 브라우저 알림을 받을 수 있습니다.',
  'finance',
  '/apps/exchange-rate-monitor',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop',
  NOW(),
  false
) ON CONFLICT (id) DO NOTHING;

-- 2. 부동산 매물 트래커
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
  'real-estate-tracker',
  '부동산 매물 트래커',
  'real-estate-tracker',
  '🏠',
  '새 매물 자동 수집 및 가격 변동 추적. 원하는 조건의 부동산 매물을 실시간으로 모니터링하고, 새 매물 등록 시 즉시 알림을 받습니다.',
  'lifestyle',
  '/apps/real-estate-tracker',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
  NOW(),
  false
) ON CONFLICT (id) DO NOTHING;

-- 3. 주식 뉴스 수집기
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
  'stock-news-collector',
  '주식 뉴스 수집기',
  'stock-news-collector',
  '📰',
  '관심 종목 뉴스 자동 수집 및 키워드 알림. 선택한 주식 종목의 최신 뉴스를 자동으로 수집하고, 설정한 키워드가 포함된 뉴스가 나오면 알림을 보냅니다.',
  'finance',
  '/apps/stock-news-collector',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop',
  NOW(),
  false
) ON CONFLICT (id) DO NOTHING;

-- Related Apps 설정

-- 환율 모니터링 관련 앱
INSERT INTO app_related (app_id, related_app_id) VALUES
  ('exchange-rate-monitor', 'interest-calculator'),
  ('exchange-rate-monitor', 'stock-news-collector')
ON CONFLICT DO NOTHING;

-- 부동산 매물 트래커 관련 앱
INSERT INTO app_related (app_id, related_app_id) VALUES
  ('real-estate-tracker', 'moving-cost-calculator'),
  ('real-estate-tracker', 'loan-calculator')
ON CONFLICT DO NOTHING;

-- 주식 뉴스 수집기 관련 앱
INSERT INTO app_related (app_id, related_app_id) VALUES
  ('stock-news-collector', 'exchange-rate-monitor'),
  ('stock-news-collector', 'interest-calculator')
ON CONFLICT DO NOTHING;
