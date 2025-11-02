# Supabase Migrations

## 방문자 추적 시스템 설치 방법

방문자 추적 기능을 사용하려면 Supabase 데이터베이스에 테이블을 생성해야 합니다.

### 옵션 1: Supabase Dashboard (추천)

1. Supabase Dashboard에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **New Query** 버튼 클릭
5. `create_secret_visitors_table.sql` 파일의 내용을 복사하여 붙여넣기
6. **Run** 버튼 클릭하여 실행

### 옵션 2: Supabase CLI

```bash
# Supabase CLI 설치 (필요한 경우)
brew install supabase/tap/supabase

# 프로젝트 연결
supabase link --project-ref YOUR_PROJECT_REF

# 마이그레이션 실행
supabase db push
```

### 생성되는 리소스

마이그레이션을 실행하면 다음 항목이 생성됩니다:

- ✅ `secret_visitors` - 방문자 정보 저장 테이블
- ✅ `secret_visitor_stats` - 통계 조회용 뷰
- ✅ `secret_daily_stats` - 일별 통계 테이블
- ✅ 인덱스 (ip_hash, last_visit, first_visit)
- ✅ RLS 정책 (Row Level Security)
- ✅ 트리거 (updated_at 자동 갱신)

### 확인 방법

마이그레이션이 성공적으로 실행되었는지 확인하려면:

```sql
-- 테이블 존재 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('secret_visitors', 'secret_daily_stats');

-- 뷰 존재 확인
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name = 'secret_visitor_stats';
```

모두 정상적으로 생성되었다면 방문자 추적 기능이 작동합니다! 🎉
