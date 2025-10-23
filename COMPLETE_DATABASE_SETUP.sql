-- ============================================
-- 전체 데이터베이스 셋업 (한 번에 실행)
-- apps 테이블 + 투자 앱 테이블
-- ============================================

-- ============================================
-- 1부: 앱 데이터 완전 복구
-- ============================================

-- 기존 테이블 완전 삭제
DROP POLICY IF EXISTS "apps_select_policy" ON public.apps;
DROP POLICY IF EXISTS "apps_insert_policy" ON public.apps;
DROP POLICY IF EXISTS "apps_update_policy" ON public.apps;
DROP POLICY IF EXISTS "apps_delete_policy" ON public.apps;
DROP TRIGGER IF EXISTS update_apps_updated_at ON public.apps;
DROP TABLE IF EXISTS public.apps CASCADE;

-- 테이블 생성
CREATE TABLE public.apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  category_id TEXT,
  url TEXT NOT NULL,
  image TEXT,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스
CREATE INDEX idx_apps_slug ON public.apps(slug);
CREATE INDEX idx_apps_category ON public.apps(category_id);
CREATE INDEX idx_apps_hidden ON public.apps(hidden);

-- RLS 활성화
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "apps_select_policy" ON public.apps FOR SELECT TO public USING (true);
CREATE POLICY "apps_insert_policy" ON public.apps FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "apps_update_policy" ON public.apps FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "apps_delete_policy" ON public.apps FOR DELETE TO public USING (true);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 앱 데이터 삽입 (49개)
INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, hidden) VALUES
('today-fortune', '오늘의 운세', 'today-fortune', '🌟', '오늘 하루 어떨까?', 'fortune-mind', '/apps/today-fortune', 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800&auto=format&fit=crop', false),
('mbti-test', 'MBTI 테스트', 'mbti-test', '🎭', '32문항으로 알아보는 정확한 성격 유형', 'fortune-mind', '/apps/mbti-test', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop', false),
('mbti-ai-chat', 'MBTI AI 채팅', 'mbti-ai-chat', '🤖', 'MBTI별 맞춤 AI 대화', 'fortune-mind', '/apps/mbti-ai-chat', 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop', false),
('water-intake', '물 섭취량 계산기', 'water-intake', '💧', '하루 물 섭취량 계산', 'health-routine', '/apps/water-intake', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&auto=format&fit=crop', false),
('calorie-calculator', '칼로리 계산기', 'calorie-calculator', '🍎', '하루 권장 칼로리 계산', 'health-routine', '/apps/calorie-calculator', 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&auto=format&fit=crop', false),
('coffee-calculator', '커피 카페인 계산기', 'coffee-calculator', '☕', '카페인 섭취량 분석', 'health-routine', '/apps/coffee-calculator', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop', false),
('habit-tracker', '습관 트래커', 'habit-tracker', '🎯', '21/66/100일 습관 만들기', 'learning-tools', '/apps/habit-tracker', 'https://vfoecqunkmqxktgywkdp.supabase.co/storage/v1/object/public/app-images/habit-tracker-1761056967326.webp', false),
('crypto-calculator', '비트코인 vs 순금', 'crypto-calculator', '⚡', '실시간 시세 & 투자 수익률 시뮬레이션', 'money-calc', '/apps/crypto-calculator', 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop', false),
('parents-time', '부모님과 시간 계산기', 'parents-time', '💕', '부모님과 남은 시간 계산', 'family-life', '/apps/parents-time', 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&auto=format&fit=crop', false),
('flashcard', '영어 플래시카드', 'flashcard', '📚', '레벨별 영어 단어 암기', 'learning-tools', '/apps/flashcard', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop', false),
('air-quality', '공기질 측정기', 'air-quality', '🌫️', '실시간 미세먼지 측정', 'health-routine', '/apps/air-quality', 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop', false),
('typing-speed-test', '타이핑 속도 테스트', 'typing-speed-test', '⌨️', '타자 속도 측정 및 연습', 'learning-tools', '/apps/typing-speed-test', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop', false),
('reflex-test', '반사신경 테스트', 'reflex-test', '⚡', '반응속도 테스트', 'learning-tools', '/apps/reflex-test', 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop', false),
('eye-test', '시력 테스트', 'eye-test', '👁️', '시력 건강 체크', 'health-routine', '/apps/eye-test', 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&auto=format&fit=crop', false),
('quote-generator', '명언 생성기', 'quote-generator', '💭', '매일 새로운 명언', 'fortune-mind', '/apps/quote-generator', 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&auto=format&fit=crop', false),
('dday-counter', '디데이 카운터', 'dday-counter', '📅', '중요한 날 카운트다운', 'money-calc', '/apps/dday-counter', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop', false),
('focus-timer', '집중 타이머', 'focus-timer', '⏰', '뽀모도로 집중 타이머', 'learning-tools', '/apps/focus-timer', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&auto=format&fit=crop', false),
('sleep-analyzer', '수면 분석기', 'sleep-analyzer', '😴', '수면 패턴 분석', 'health-routine', '/apps/sleep-analyzer', 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&auto=format&fit=crop', false),
('vitamin-check', '비타민 체크', 'vitamin-check', '💊', '필요한 영양소 진단', 'health-routine', '/apps/vitamin-check', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop', false),
('color-psychology', '색상 심리', 'color-psychology', '🎨', '심리 분석', 'fortune-mind', '/apps/color-psychology', 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&auto=format&fit=crop', false),
('voice-fortune', '목소리 운세', 'voice-fortune', '🎤', '오늘의 운세 확인', 'fortune-mind', '/apps/voice-fortune', 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&auto=format&fit=crop', false),
('study-cursor-prompts', 'Cursor 프롬프트', 'study-cursor-prompts', '💻', 'Cursor 서비스', 'learning-tools', '/apps/study-cursor-prompts', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop', true),
('study-dev-vocab', '개발 용어 사전', 'study-dev-vocab', '📚', '프로그래밍 용어를 쉽게 배우는 사전', 'learning-tools', '/apps/study-dev-vocab', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop', true),
('analysis-handwriting', '필적 분석', 'analysis-handwriting', '✍️', '상세 분석 결과', 'fortune-mind', '/apps/analysis-handwriting', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop', false),
('arcade-mini-games', '미니 게임', 'arcade-mini-games', '🎮', '재미있는 게임', 'learning-tools', '/apps/arcade-mini-games', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop', false),
('quit-smoking-challenge', '금연 챌린지', 'quit-smoking-challenge', '🚭', '도전 과제', 'health-routine', '/apps/quit-smoking-challenge', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop', false),
('car-maintenance', '차량 관리', 'car-maintenance', '🚗', '69개 경고등의 의미와 대처법을 한눈에', 'learning-tools', '/apps/car-maintenance', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop', false),
('health-supplement-recommend', '영양제 추천', 'health-supplement-recommend', '💊', '증상과 생활습관에 맞는 맞춤형 영양제 추천', 'health-routine', '/apps/health-supplement-recommend', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop', false),
('face-shape', '얼굴형 분석', 'face-shape', '😊', '상세 분석 결과', 'fortune-mind', '/apps/face-shape', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop', false),
('lifestyle-face-fortune', '관상 분석', 'lifestyle-face-fortune', '👁️', '상세 분석 결과', 'fortune-mind', '/apps/lifestyle-face-fortune', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop', false),
('lifestyle-palm-reading', '손금 보기', 'lifestyle-palm-reading', '👋', '전통 수상학 기반 AI 분석! 7대 손금선 정밀 분석 + 27가지 패턴 분류', 'fortune-mind', '/apps/lifestyle-palm-reading', 'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=800&auto=format&fit=crop', false),
('weather-outfit', '날씨별 옷차림', 'weather-outfit', '👔', '날씨별 서비스', 'health-routine', '/apps/weather-outfit', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop', false),
('iq-test', 'IQ 테스트', 'iq-test', '🧠', '재미있는 심리 테스트', 'fortune-mind', '/apps/iq-test', 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&auto=format&fit=crop', false),
('past-life-job', '전생 직업', 'past-life-job', '⏳', '전생 서비스', 'fortune-mind', '/apps/past-life-job', 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&auto=format&fit=crop', false),
('envelope-recommend', '봉투 추천', 'envelope-recommend', '✉️', '맞춤 추천', 'money-calc', '/apps/envelope-recommend', 'https://images.unsplash.com/photo-1520350094754-f0fdcac35c1c?w=800&auto=format&fit=crop', false),
('bodyfat-measure', '체지방 측정기', 'bodyfat-measure', '⚖️', '체지방 서비스', 'health-routine', '/apps/bodyfat-measure', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop', false),
('mood-cheer-up', '기분 전환', 'mood-cheer-up', '😊', '기분을 분석하고 맞춤 활동을 추천합니다', 'family-life', '/apps/mood-cheer-up', 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop', false),
('voice-age', '목소리 나이', 'voice-age', '🗣️', '목소리 서비스', 'fortune-mind', '/apps/voice-age', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop', false),
('games-puzzle', '퍼즐 게임', 'games-puzzle', '🧩', '재미있는 게임', 'learning-tools', '/apps/games-puzzle', 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&auto=format&fit=crop', false),
('games-multiplication', '구구단 게임', 'games-multiplication', '🔢', '재미있는 게임', 'learning-tools', '/apps/games-multiplication', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop', false),
('dream-interpreter', '꿈 해몽', 'dream-interpreter', '💤', '꿈 서비스', 'fortune-mind', '/apps/dream-interpreter', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop', false),
('travel-destinations', '여행지 추천', 'travel-destinations', '✈️', '맞춤 추천', 'money-calc', '/apps/travel-destinations', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop', false),
('travel-packing-list', '여행 짐 체크', 'travel-packing-list', '🧳', '여행 서비스', 'money-calc', '/apps/travel-packing-list', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', false),
('breakfast-what-to-eat', '아침식사 추천', 'breakfast-what-to-eat', '🍳', '맞춤 추천', 'health-routine', '/apps/breakfast-what-to-eat', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop', false),
('utility-electricity-calculator', '전기요금 계산기', 'utility-electricity-calculator', '⚡', '빠른 계산', 'money-calc', '/apps/utility-electricity-calculator', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop', false),
('compass', '디지털 나침반', 'compass', '🧭', '실시간 방향 확인! 360도 회전 나침반, 모바일 최적화', 'learning-tools', '/apps/compass', 'https://images.unsplash.com/photo-1476973422084-e0fa66ff9456?w=800&auto=format&fit=crop', false),
('saju-mbti-jobs', '사주와 MBTI의 조합', 'saju-mbti-jobs', '🔮', '성격 유형 테스트', 'fortune-mind', '/apps/saju-mbti-jobs', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop', false),
('fengshui-guide', '풍수지리 실전 도감', 'fengshui-guide', '🏠', '과학적 해석과 체크리스트로 배우는 현대 풍수', 'fortune-mind', '/apps/fengshui-guide', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop', false),
('gift-finder', '선물 추천', 'gift-finder', '🎁', '200개 이상의 선물 데이터로 완벽한 선물 찾기', 'family-life', '/apps/gift-finder', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop', false),
('lotto-generator', '로또 번호 생성기', 'lotto-generator', '🎰', '행운의 로또 번호 생성', 'money-calc', '/apps/lotto-generator', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop', false);

SELECT '✅ 앱 데이터 복구 완료!' as status, COUNT(*) as total_apps FROM apps;

-- ============================================
-- 2부: 모의투자 웹앱 데이터베이스
-- ============================================

-- 투자 사용자 테이블
CREATE TABLE IF NOT EXISTS investment_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL UNIQUE,
  ip_address VARCHAR(45) NOT NULL UNIQUE,
  balance BIGINT DEFAULT 100000000,
  total_rewards BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 포트폴리오
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES investment_users(id) ON DELETE CASCADE,
  asset_type VARCHAR(20) NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL,
  buy_price BIGINT NOT NULL,
  buy_amount BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 거래 내역
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES investment_users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(10) NOT NULL,
  asset_type VARCHAR(20) NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL,
  price BIGINT NOT NULL,
  amount BIGINT NOT NULL,
  profit BIGINT DEFAULT 0,
  profit_rate DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 가격 히스토리
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_type VARCHAR(20) NOT NULL,
  price BIGINT NOT NULL,
  change_rate DECIMAL(10, 2) DEFAULT 0,
  change_price BIGINT DEFAULT 0,
  volume BIGINT DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(asset_type, recorded_at)
);

-- 리워드 내역
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES investment_users(id) ON DELETE CASCADE,
  app_name VARCHAR(100) NOT NULL,
  reward_amount BIGINT DEFAULT 500000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 알림
CREATE TABLE IF NOT EXISTS user_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES investment_users(id) ON DELETE CASCADE,
  asset_type VARCHAR(20) NOT NULL,
  alert_type VARCHAR(20) NOT NULL,
  target_price BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_users_ip ON investment_users(ip_address);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON investment_users(nickname);
CREATE INDEX IF NOT EXISTS idx_portfolios_user ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_asset ON portfolios(asset_type);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_asset ON price_history(asset_type, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_rewards_user ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON user_alerts(user_id);

-- RLS 활성화
ALTER TABLE investment_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (재실행 대비)
DROP POLICY IF EXISTS "Public read access" ON investment_users;
DROP POLICY IF EXISTS "Public read access" ON portfolios;
DROP POLICY IF EXISTS "Public read access" ON transactions;
DROP POLICY IF EXISTS "Public read access" ON price_history;
DROP POLICY IF EXISTS "Authenticated users can insert" ON investment_users;
DROP POLICY IF EXISTS "Authenticated users can update" ON investment_users;
DROP POLICY IF EXISTS "Authenticated users can insert" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can update" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can delete" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can insert" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can insert" ON rewards;
DROP POLICY IF EXISTS "Authenticated users can insert" ON user_alerts;
DROP POLICY IF EXISTS "Authenticated users can update" ON user_alerts;
DROP POLICY IF EXISTS "Authenticated users can delete" ON user_alerts;

-- RLS 정책 생성
CREATE POLICY "Public read access" ON investment_users FOR SELECT USING (true);
CREATE POLICY "Public read access" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transactions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON price_history FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert" ON investment_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON investment_users FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can insert" ON portfolios FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON portfolios FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON portfolios FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert" ON transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can insert" ON rewards FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can insert" ON user_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON user_alerts FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON user_alerts FOR DELETE USING (true);

-- 초기 데이터
INSERT INTO price_history (asset_type, price, change_rate, change_price, recorded_at)
VALUES
  ('bitcoin', 150000000, 2.5, 3650000, NOW()),
  ('gold', 850000, 0.3, 2500, NOW())
ON CONFLICT DO NOTHING;

-- 유틸리티 함수
CREATE OR REPLACE FUNCTION get_user_total_assets(user_uuid UUID)
RETURNS BIGINT AS $$
DECLARE
  total_portfolio_value BIGINT;
  user_balance BIGINT;
BEGIN
  SELECT COALESCE(SUM(
    CASE
      WHEN p.asset_type = 'bitcoin' THEN
        p.quantity * (SELECT price FROM price_history WHERE asset_type = 'bitcoin' ORDER BY recorded_at DESC LIMIT 1)
      WHEN p.asset_type = 'gold' THEN
        p.quantity * (SELECT price FROM price_history WHERE asset_type = 'gold' ORDER BY recorded_at DESC LIMIT 1)
      ELSE 0
    END
  ), 0) INTO total_portfolio_value
  FROM portfolios p
  WHERE p.user_id = user_uuid;

  SELECT balance INTO user_balance
  FROM investment_users
  WHERE id = user_uuid;

  RETURN COALESCE(user_balance, 0) + total_portfolio_value;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_profit_rate(user_uuid UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  total_assets BIGINT;
  initial_balance BIGINT := 100000000;
BEGIN
  total_assets := get_user_total_assets(user_uuid);
  RETURN ((total_assets - initial_balance)::DECIMAL / initial_balance) * 100;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Realtime 활성화 (중요!)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE apps;

-- 완료 메시지
SELECT '✅ 전체 데이터베이스 셋업 완료!' as result;
SELECT '📊 Apps 테이블: ' || COUNT(*) || '개 앱 등록' as apps_status FROM apps;
SELECT '💰 Investment 테이블: 준비 완료' as investment_status;
SELECT '📡 Realtime: apps 테이블 활성화 완료' as realtime_status;
