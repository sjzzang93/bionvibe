-- ========================================
-- 🎯 전체 테이블 한 방 생성 (기존 삭제 포함)
-- ========================================
-- 빠르게 시작하기: 아래 SQL을 Supabase SQL Editor에 복사 → 실행

-- ========================================
-- 🗑️ 기존 테이블 전체 삭제 (있는 경우)
-- ========================================
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
-- 📊 analytics 테이블 (사용 통계)
-- ========================================
CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT
);

CREATE INDEX idx_analytics_app_id ON analytics(app_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
  ON analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view analytics"
  ON analytics FOR SELECT USING (true);

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
