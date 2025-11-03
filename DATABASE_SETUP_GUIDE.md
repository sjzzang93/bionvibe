# 데이터베이스 설정 가이드

에러 모니터링 시스템을 위한 Supabase 데이터베이스 설정 가이드입니다.

## 설정 완료 항목 ✅

1. **에러 모니터링 시스템**
   - `/app/secret/error-monitor/page.tsx` - 에러 대시보드
   - `/app/api/error-log/route.ts` - 에러 로깅 API
   - `/components/ErrorLogger.tsx` - 전역 에러 캐처

2. **데이터베이스 설정 도구**
   - `/app/secret/setup-database/page.tsx` - 자동 설정 페이지
   - `/app/api/setup-database/route.ts` - 설정 API
   - `/supabase/migrations/complete_setup.sql` - 전체 SQL 스크립트

3. **환경 변수**
   - `SUPABASE_SERVICE_ROLE_KEY` 추가됨 ✅

## 필요한 작업 🔧

### 옵션 1: 자동 설정 (권장)

1. Secret Vault 페이지 접속
   ```
   http://localhost:3000/secret
   ```

2. "🔧 데이터베이스 설정" 버튼 클릭

3. "🚀 데이터베이스 설정 시작" 클릭

### 옵션 2: 수동 설정

1. Supabase SQL Editor 열기:
   ```
   https://supabase.com/dashboard/project/vfoecqunkmqxktgywkdp/sql/new
   ```

2. `supabase/migrations/complete_setup.sql` 파일 내용 복사

3. SQL Editor에 붙여넣기 후 실행

## 생성될 테이블

### 1. error_logs
에러 로그를 저장하는 테이블
- 에러 메시지, 스택 트레이스, 에러 타입
- 발생 위치 (앱 ID, URL)
- 사용자 정보 (IP, 브라우저, OS, 디바이스)
- 중복 에러 카운팅

### 2. secret_visitors
Secret Vault 방문자 추적 테이블
- IP 주소
- 브라우저, OS, 디바이스 정보
- 일별 고유 방문자 추적

### 3. secret_visitor_stats (View)
방문자 통계 뷰
- 일별 방문자 수
- 고유 방문자 수
- 디바이스 타입별 통계

## 설정 확인

데이터베이스 설정 후 다음 페이지들을 확인하세요:

1. **에러 모니터링**
   ```
   http://localhost:3000/secret/error-monitor
   ```
   - 실시간 에러 로그
   - 에러 통계 대시보드
   - 앱별 에러 필터링

2. **Secret Vault**
   ```
   http://localhost:3000/secret
   ```
   - 관리 도구 섹션에 새로운 링크 추가됨

## 기능

### 에러 모니터링
- ✅ 전역 에러 자동 캐치
- ✅ 중복 에러 자동 합산 (5분 윈도우)
- ✅ IP 기반 사용자 추적
- ✅ 브라우저/OS/디바이스 자동 감지
- ✅ 앱별 에러 필터링
- ✅ 날짜 범위 필터링
- ✅ 실시간 통계 대시보드

### 보안
- ✅ Row Level Security (RLS) 활성화
- ✅ 익명 사용자: INSERT 가능 (에러 리포팅)
- ✅ 인증된 사용자: SELECT, DELETE 가능 (관리자)

## 문제 해결

### 자동 설정이 실패하는 경우
Supabase JS 클라이언트는 직접 SQL 실행을 지원하지 않습니다.
수동으로 SQL Editor에서 스크립트를 실행해주세요.

### 테이블이 이미 존재하는 경우
SQL 스크립트는 `IF NOT EXISTS`를 사용하므로 중복 실행해도 안전합니다.

### 에러가 기록되지 않는 경우
1. `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 확인
2. Supabase 테이블이 생성되었는지 확인
3. 브라우저 콘솔에서 에러 확인

## 다음 단계

설정이 완료되면:
1. 에러 모니터 대시보드에서 실시간 에러 확인
2. 방문자 통계로 사용자 행동 분석
3. 에러 발생 빈도가 높은 앱 식별 및 개선

---

**작성일:** 2025-11-03
**작성자:** Claude Code
