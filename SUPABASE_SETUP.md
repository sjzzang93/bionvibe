# 🚀 Supabase 연동 가이드

## 🎯 전체 테이블 한 방 생성 (기존 삭제 포함)

**빠르게 시작하기: 아래 SQL을 Supabase SQL Editor에 복사 → 실행**

```sql
-- ========================================
-- 🗑️ 기존 테이블 전체 삭제 (있는 경우)
-- ========================================
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
```

**✅ 완료 후:**
- localhost:3000 새로고침
- 비온타키 채팅 테스트
- 문의하기 폼 테스트

---

## 1️⃣ Supabase 프로젝트 생성

1. https://supabase.com 접속
2. **Start your project** 클릭
3. GitHub 계정으로 로그인
4. **New project** 클릭
5. 프로젝트 정보 입력:
   - Name: `bionvibe` (원하는 이름)
   - Database Password: 안전한 비밀번호 (저장 필수!)
   - Region: `Northeast Asia (Seoul)` 선택
6. **Create new project** 클릭 (1-2분 소요)

---

## 2️⃣ 데이터베이스 테이블 생성

### 📧 contacts 테이블 (문의하기)

1. 왼쪽 메뉴 **SQL Editor** 클릭
2. **New query** 클릭
3. 아래 SQL 복사 & 실행:

```sql
-- 문의 테이블 생성
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

-- 인덱스 추가 (빠른 검색)
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- RLS (Row Level Security) 설정
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 INSERT 가능 (문의 작성)
CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  WITH CHECK (true);

-- 정책: 인증된 사용자만 SELECT 가능 (관리자)
CREATE POLICY "Authenticated users can view all contacts"
  ON contacts
  FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 정책: 인증된 사용자만 UPDATE 가능 (관리자 답변)
CREATE POLICY "Authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  USING (auth.role() = 'authenticated');
```

### 📊 analytics 테이블 (사용 통계)

```sql
-- 웹앱 사용 통계 테이블
CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT
);

-- 인덱스
CREATE INDEX idx_analytics_app_id ON analytics(app_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);

-- RLS 설정
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 INSERT 가능
CREATE POLICY "Anyone can insert analytics"
  ON analytics
  FOR INSERT
  WITH CHECK (true);

-- 정책: 누구나 SELECT 가능
CREATE POLICY "Anyone can view analytics"
  ON analytics
  FOR SELECT
  USING (true);
```

### 🏆 rankings 테이블 (랭킹)

```sql
-- 랭킹 테이블 (반사신경, 타이핑 등)
CREATE TABLE rankings (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_rankings_app_id_score ON rankings(app_id, score);
CREATE INDEX idx_rankings_created_at ON rankings(created_at DESC);

-- RLS 설정
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 INSERT/SELECT 가능
CREATE POLICY "Anyone can insert rankings"
  ON rankings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view rankings"
  ON rankings
  FOR SELECT
  USING (true);
```

---

## 3️⃣ API 키 가져오기

1. 왼쪽 메뉴 **Settings** → **API** 클릭
2. 아래 2개 키 복사:
   - **Project URL** (예: https://abcdefgh.supabase.co)
   - **anon public** (공개 키, 클라이언트에서 사용)

---

## 4️⃣ 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성 또는 수정:

```bash
# EmailJS (기존)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google Analytics (기존)
NEXT_PUBLIC_GA_ID=G-DGQPGH00WH

# Supabase (새로 추가)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 5️⃣ 개발 서버 재시작

```bash
npm run dev
```

---

## 6️⃣ 테스트

1. http://localhost:3000/contact 접속
2. 문의 작성 및 전송
3. Supabase 대시보드 → **Table Editor** → **contacts** 테이블에서 데이터 확인
4. http://localhost:3000/secret → **문의 관리** 클릭하여 확인

---

## 🔒 보안 설정 (중요!)

### RLS (Row Level Security) 확인
- ✅ contacts: 누구나 쓰기 가능, 읽기는 제한
- ✅ analytics: 누구나 읽기/쓰기 가능
- ✅ rankings: 누구나 읽기/쓰기 가능

### 관리자 전용 기능
히든 페이지(`/secret`)에서 비밀번호로 보호된 관리자 기능:
- 문의 내역 조회
- 답변 작성
- 상태 변경

---

## 📊 데이터 확인 방법

### Supabase 대시보드
1. **Table Editor** → 각 테이블 클릭
2. 데이터 실시간 확인 및 수정

### 히든 페이지
1. http://localhost:3000 → BION 로고 7번 빠르게 클릭
2. 비밀번호: `123!8314`
3. **문의 관리** 메뉴 클릭

---

## 🆘 문제 해결

### 연결 안 됨
- `.env.local` 파일 확인
- 개발 서버 재시작
- Supabase URL과 Key 재확인

### 데이터 저장 안 됨
- Supabase 대시보드 → **Table Editor** → 테이블 생성 확인
- RLS 정책 확인
- 브라우저 콘솔 에러 확인

### 권한 에러
- RLS 정책이 올바르게 설정되었는지 확인
- `anon` 키를 사용하고 있는지 확인

---

### 💬 chat_messages 테이블 (비온타키 실시간 채팅)

```sql
-- 기존 테이블 삭제 (있는 경우)
DROP TABLE IF EXISTS chat_messages CASCADE;

-- 채팅 메시지 테이블 생성
CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (빠른 조회)
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- RLS (Row Level Security) 설정
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 메시지 읽기 가능
CREATE POLICY "Anyone can read messages"
  ON chat_messages
  FOR SELECT
  USING (true);

-- 정책: 누구나 메시지 작성 가능
CREATE POLICY "Anyone can insert messages"
  ON chat_messages
  FOR INSERT
  WITH CHECK (true);
```

---

## 💡 다음 단계

연동 완료 후 추가 가능한 기능:
1. ✅ 문의 관리 대시보드 (완료)
2. ✅ 비온타키 실시간 채팅 (완료)
3. 📊 웹앱별 사용 통계
4. 🏆 반사신경 테스트 랭킹
5. ⌨️ 타이핑 속도 랭킹
6. 🎰 로또 번호 공유 기능

