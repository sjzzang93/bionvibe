-- ========================================
-- 🎯 전체 테이블 한 방 생성 (기존 삭제 포함)
-- ========================================
-- 빠르게 시작하기: 아래 SQL을 Supabase SQL Editor에 복사 → 실행

-- ========================================
-- 🗑️ 기존 테이블 전체 삭제 (있는 경우)
-- ========================================
DROP TABLE IF EXISTS game_stats CASCADE;
DROP TABLE IF EXISTS game_matches CASCADE;
DROP TABLE IF EXISTS mafia_game_players CASCADE;
DROP TABLE IF EXISTS mafia_games CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS rankings CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- ========================================
-- 📧 contacts 테이블 (문의하기)
-- ========================================
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  admin_reply TEXT
);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contacts"
  ON contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contacts"
  ON contacts FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Authenticated users can update contacts"
  ON contacts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ========================================
-- 📊 analytics 테이블 (상세 사용 통계)
-- ========================================
CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'click', 'button_click', 'feature_use', etc.
  event_data JSONB, -- 추가 이벤트 데이터
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT, -- 세션 추적
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_app_id ON analytics(app_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX idx_analytics_session ON analytics(session_id);
CREATE INDEX idx_analytics_app_time ON analytics(app_id, timestamp DESC);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
  ON analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view analytics"
  ON analytics FOR SELECT USING (true);

-- ========================================
-- 📈 analytics_summary 뷰 (실시간 통계 요약)
-- ========================================
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  app_id,
  COUNT(*) as total_events,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
  COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks,
  MAX(timestamp) as last_activity,
  DATE_TRUNC('hour', timestamp) as hour
FROM analytics
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY app_id, DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC, total_events DESC;

-- ========================================
-- 🔥 실시간 인기 앱 뷰 (최근 1시간)
-- ========================================
CREATE OR REPLACE VIEW trending_apps AS
SELECT 
  app_id,
  COUNT(*) as activity_count,
  COUNT(DISTINCT session_id) as unique_users,
  MAX(timestamp) as last_activity
FROM analytics
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY app_id
ORDER BY activity_count DESC
LIMIT 10;

-- ========================================
-- 🏆 rankings 테이블 (랭킹)
-- ========================================
CREATE TABLE rankings (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rankings_app_id_score ON rankings(app_id, score);
CREATE INDEX idx_rankings_created_at ON rankings(created_at DESC);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert rankings"
  ON rankings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view rankings"
  ON rankings FOR SELECT USING (true);

-- ========================================
-- 💬 chat_messages 테이블 (비온타키 실시간 채팅)
-- ========================================
CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON chat_messages FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages"
  ON chat_messages FOR INSERT WITH CHECK (true);

-- ========================================
-- 🕐 24시간 지난 채팅 메시지 자동 삭제 함수
-- ========================================
CREATE OR REPLACE FUNCTION delete_old_chat_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM chat_messages
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION delete_old_chat_messages() OWNER TO postgres;

-- ========================================
-- 🕵️ mafia_games 테이블 (마피아 게임방)
-- ========================================
CREATE TABLE mafia_games (
  id BIGSERIAL PRIMARY KEY,
  room_code TEXT UNIQUE NOT NULL,
  host_name TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'assigning', 'playing', 'finished')),
  phase TEXT DEFAULT 'night' CHECK (phase IN ('night', 'day')),
  round INTEGER DEFAULT 1,
  player_count INTEGER NOT NULL,
  game_log TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mafia_games_room_code ON mafia_games(room_code);
CREATE INDEX idx_mafia_games_status ON mafia_games(status);
CREATE INDEX idx_mafia_games_created_at ON mafia_games(created_at DESC);

ALTER TABLE mafia_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read games"
  ON mafia_games FOR SELECT USING (true);

CREATE POLICY "Anyone can insert games"
  ON mafia_games FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update games"
  ON mafia_games FOR UPDATE USING (true);

-- ========================================
-- 👥 mafia_game_players 테이블 (마피아 게임 플레이어)
-- ========================================
CREATE TABLE mafia_game_players (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT REFERENCES mafia_games(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  role TEXT,
  is_alive BOOLEAN DEFAULT true,
  player_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mafia_players_game_id ON mafia_game_players(game_id);
CREATE INDEX idx_mafia_players_order ON mafia_game_players(game_id, player_order);

ALTER TABLE mafia_game_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read players"
  ON mafia_game_players FOR SELECT USING (true);

CREATE POLICY "Anyone can insert players"
  ON mafia_game_players FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update players"
  ON mafia_game_players FOR UPDATE USING (true);

-- ========================================
-- 🗑️ 24시간 지난 게임 자동 삭제 함수
-- ========================================
CREATE OR REPLACE FUNCTION delete_old_mafia_games()
RETURNS void AS $$
BEGIN
  DELETE FROM mafia_games
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION delete_old_mafia_games() OWNER TO postgres;

-- ========================================
-- 🎮 game_matches 테이블 (오목, 체스, 바둑 등 대전 기록)
-- ========================================
CREATE TABLE game_matches (
  id BIGSERIAL PRIMARY KEY,
  game_type TEXT NOT NULL, -- 'gomoku', 'chess', 'baduk', etc.
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  winner TEXT, -- 'player1', 'player2', 'draw', null(진행중)
  status TEXT DEFAULT 'playing' CHECK (status IN ('playing', 'finished', 'abandoned')),
  moves JSONB DEFAULT '[]'::jsonb, -- 이동 기록
  game_data JSONB, -- 게임별 추가 데이터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_game_matches_type ON game_matches(game_type);
CREATE INDEX idx_game_matches_status ON game_matches(status);
CREATE INDEX idx_game_matches_created_at ON game_matches(created_at DESC);

ALTER TABLE game_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read matches"
  ON game_matches FOR SELECT USING (true);

CREATE POLICY "Anyone can insert matches"
  ON game_matches FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update matches"
  ON game_matches FOR UPDATE USING (true);

-- ========================================
-- 🏅 game_stats 테이블 (게임별 개인 통계)
-- ========================================
CREATE TABLE game_stats (
  id BIGSERIAL PRIMARY KEY,
  game_type TEXT NOT NULL,
  player_name TEXT NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  rating INTEGER DEFAULT 1000, -- ELO 레이팅
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_type, player_name)
);

CREATE INDEX idx_game_stats_type_rating ON game_stats(game_type, rating DESC);
CREATE INDEX idx_game_stats_player ON game_stats(player_name);

ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stats"
  ON game_stats FOR SELECT USING (true);

CREATE POLICY "Anyone can insert stats"
  ON game_stats FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update stats"
  ON game_stats FOR UPDATE USING (true);

-- ========================================
-- 🗑️ 7일 지난 게임 매치 자동 삭제 함수
-- ========================================
CREATE OR REPLACE FUNCTION delete_old_game_matches()
RETURNS void AS $$
BEGIN
  DELETE FROM game_matches
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION delete_old_game_matches() OWNER TO postgres;

-- ========================================
-- 📦 Storage 정책 설정 (app-images 버킷)
-- ========================================
-- 🗑️ 기존 Storage 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read" ON storage.objects;

-- 모든 사용자가 app-images 버킷 파일 읽기 가능
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'app-images');

-- 모든 사용자가 app-images 버킷에 업로드 가능
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'app-images');

-- 모든 사용자가 app-images 버킷 파일 업데이트 가능
CREATE POLICY "Allow public updates"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'app-images');

-- 모든 사용자가 app-images 버킷 파일 삭제 가능
CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'app-images');

-- ========================================
-- ✅ 설정 완료!
-- ========================================
-- 다음 단계:
-- 1. Supabase 대시보드에서 Storage 버킷 'app-images' 생성 (Public bucket 체크)
-- 2. /secret/image-manager 페이지에서 이미지 업로드 테스트
-- 3. 비온타키 채팅 테스트
-- 4. 마피아 게임 테스트
