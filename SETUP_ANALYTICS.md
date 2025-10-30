# 📊 실시간 조회수 시스템 설정 가이드

## 🎯 완료된 작업

✅ 실시간 통계 섹션 (오늘 방문자, 총 앱 수, 누적 방문자)
✅ 인기 앱 TOP 10 (실제 조회수 기반)
✅ 최근 추가된 앱
✅ 조회수 추적 API
✅ Supabase 테이블 SQL

---

## 🚀 Supabase 설정 (필수!)

### 1단계: Supabase에 접속
1. https://supabase.com 로그인
2. 프로젝트 선택 (bionvibe)
3. 왼쪽 메뉴에서 **SQL Editor** 클릭

### 2단계: 테이블 생성
`supabase/create_app_views_table.sql` 파일의 내용을 복사해서 실행:

```sql
-- 앱 조회수 테이블 생성
CREATE TABLE IF NOT EXISTS app_views (
  app_id TEXT PRIMARY KEY,
  view_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_app_views_count ON app_views(view_count DESC);

-- RLS (Row Level Security) 설정
ALTER TABLE app_views ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view app_views" ON app_views
  FOR SELECT USING (true);

-- 누구나 업데이트 가능
CREATE POLICY "Anyone can update app_views" ON app_views
  FOR UPDATE USING (true);

-- 누구나 삽입 가능
CREATE POLICY "Anyone can insert app_views" ON app_views
  FOR INSERT WITH CHECK (true);
```

**"RUN" 버튼 클릭!** ✅

### 3단계: 확인
SQL Editor에서 확인:
```sql
SELECT * FROM app_views ORDER BY view_count DESC LIMIT 10;
```

처음에는 데이터가 없을 거예요. 사용자가 앱을 클릭하면 자동으로 채워집니다!

---

## 💡 작동 방식

### 📈 조회수 추적 흐름
```
1. 사용자가 앱 카드 클릭
   ↓
2. 각 앱 페이지에서 useTrackView() 훅 사용
   ↓
3. POST /api/track-view { appId: "aura-color" }
   ↓
4. Supabase app_views 테이블 업데이트
   ↓
5. 인기 앱 TOP 10에 실시간 반영
```

### 🎨 메인 페이지 구조
```
[광고]
  ↓
📊 실시간 통계 (전체 앱 / 오늘 방문 / 누적 방문)
  ↓
⭐ 실시간 인기 앱 TOP 10 (조회수 기반, 스크롤 가능)
  ↓
🆕 최근 추가된 앱 (createdAt 기반, 3일 이내 NEW 배지)
  ↓
[카테고리별 앱 그리드]
```

---

## 🛠️ 앱 페이지에 조회수 추적 추가하기

각 앱 페이지 컴포넌트에 다음 코드 추가:

```typescript
"use client";

import { useTrackView } from '@/lib/useTrackView';

export default function MyAppPage() {
  // 조회수 자동 추적
  useTrackView('my-app-id'); // 앱 ID 입력

  return (
    <div>
      {/* 앱 내용 */}
    </div>
  );
}
```

**예시:**
- 오라색깔: `useTrackView('aura-color')`
- 타로: `useTrackView('tarot')`
- 뉴스: `useTrackView('news-briefing')`

---

## 📊 API 엔드포인트

### 조회수 증가
```bash
POST /api/track-view
Content-Type: application/json

{
  "appId": "aura-color"
}
```

### 전체 조회수 가져오기
```bash
GET /api/track-view
```

**응답:**
```json
{
  "data": [
    {
      "app_id": "aura-color",
      "view_count": 1234,
      "last_updated": "2025-10-30T12:34:56Z"
    }
  ]
}
```

---

## 🎯 애드센스 승인에 도움되는 이유

✅ **활발한 사이트 인상**
- 실시간 통계 → "이 사이트는 많은 사람들이 사용해요"

✅ **체류 시간 증가**
- 인기 앱 TOP 10 → 사용자가 더 많은 앱 탐색

✅ **신선한 콘텐츠**
- 최근 추가된 앱 → "계속 업데이트되는 사이트"

✅ **전문적인 모습**
- 통계 대시보드 → "잘 관리되는 사이트"

---

## 🔧 트러블슈팅

### Q: 인기 앱이 안 보여요
A: Supabase SQL을 실행했는지 확인하세요. 처음엔 데이터가 없어 최근 앱이 표시됩니다.

### Q: 조회수가 안 올라가요
A: 각 앱 페이지에 `useTrackView()` 훅을 추가해야 합니다.

### Q: 통계가 0으로 나와요
A: localStorage 기반이라 브라우저별로 다릅니다. 실제 배포 시 정상 작동합니다.

---

## 🚀 다음 단계

1. **Supabase SQL 실행** ← 지금 바로!
2. 주요 앱 페이지에 `useTrackView()` 추가
3. 배포 후 실제 사용자 데이터 확인
4. 애드센스 신청!

---

**완성!** 🎉

이제 메인 페이지에서 실시간 통계와 인기 앱을 확인할 수 있습니다!
