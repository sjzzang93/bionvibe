# 📦 앱 데이터 동기화 가이드

## 🎯 목적

`data/apps.json` (로컬 파일)과 **Supabase apps 테이블** (온라인 DB)을 자동으로 동기화합니다.

## 📊 현재 구조

```
바이온바이브 웹사이트
├─ 메인 페이지 (/)
│  └─ 데이터 소스: data/apps.json (로컬 파일)
│     → 빠른 로딩, 빌드 타임에 포함
│
└─ 히든 페이지 (/secret)
   └─ 데이터 소스: Supabase apps 테이블
      → 실시간 업데이트, 관리자 수정 가능
```

## 🔄 동기화가 필요한 경우

### 시나리오 1: 새 앱 추가
```bash
# 1. data/apps.json에 새 앱 추가
# 2. 동기화 실행
npm run sync-apps

# 3. 완료! 메인 페이지와 히든 페이지 모두 업데이트됨
```

### 시나리오 2: 기존 앱 수정
```bash
# 1. data/apps.json에서 앱 정보 수정 (이름, 이미지, 설명 등)
# 2. 동기화 실행
npm run sync-apps

# 3. 완료! Supabase에도 동일하게 반영됨
```

### 시나리오 3: 대량 업데이트
```bash
# 여러 앱을 한번에 수정한 경우
npm run sync-apps

# 모든 변경사항이 한번에 Supabase에 반영됨
```

## 🚀 사용 방법

### 1. 동기화 실행
```bash
npm run sync-apps
```

### 2. 예상 출력
```
🔄 apps.json → Supabase 동기화 시작...

📁 data/apps.json에서 85개 앱을 읽었습니다.

✅ 추가: 나의 기운색 테스트 (aura-color)
🔄 업데이트: 그림 심리 테스트 (draw-psychology)
🔄 업데이트: 오늘의 운세 (today-fortune)
...

==================================================
✅ 동기화 완료!
==================================================
📊 전체 앱: 85개
➕ 새로 추가: 1개
🔄 업데이트: 84개
❌ 실패: 0개
==================================================
```

## 🔧 작동 원리

1. **data/apps.json 읽기**
   - 모든 앱 데이터를 로컬 파일에서 로드

2. **필드명 변환**
   ```typescript
   // apps.json → Supabase
   categoryId  → category_id
   createdAt   → created_at
   ```

3. **UPSERT 실행**
   - 앱이 이미 있으면 → 업데이트
   - 앱이 없으면 → 새로 추가

4. **결과 리포트**
   - 추가/업데이트/실패 개수 표시

## ⚠️ 주의사항

### 1. 환경변수 필수
`.env.local` 파일에 다음이 설정되어 있어야 합니다:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### 2. 데이터 손실 방지
- 동기화는 **Supabase → apps.json** 방향이 아닙니다
- **apps.json → Supabase** 방향입니다
- Supabase에서 직접 수정한 내용은 덮어써질 수 있습니다

### 3. 권장 워크플로우
```bash
# ✅ 올바른 방법
1. data/apps.json 수정
2. npm run sync-apps 실행
3. Vercel 배포

# ❌ 피해야 할 방법
1. Supabase에서 직접 수정
2. 나중에 apps.json 수정
3. 동기화 → Supabase 변경사항 덮어써짐!
```

## 📝 apps.json 필드 가이드

```json
{
  "id": "app-slug",           // 고유 ID (필수)
  "name": "앱 이름",            // 표시 이름 (필수)
  "slug": "app-slug",          // URL 경로 (필수)
  "icon": "🌈",                // 이모지 아이콘 (필수)
  "description": "앱 설명...", // 상세 설명 (필수)
  "categoryId": "fortune-mind", // 카테고리 (필수)
  "url": "/apps/app-slug",     // 앱 URL (필수)
  "image": "https://...",      // 썸네일 이미지 (필수)
  "createdAt": "2025-10-29",   // 생성일 (필수)
  "relatedApps": ["slug1", "slug2"] // 관련 앱 (선택)
}
```

## 🐛 문제 해결

### 에러: "Supabase 환경변수가 설정되지 않았습니다"
```bash
# .env.local 파일 확인
cat .env.local

# 없으면 생성
echo "NEXT_PUBLIC_SUPABASE_URL=your-url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key" >> .env.local
```

### 에러: "data/apps.json 파일을 찾을 수 없습니다"
```bash
# 프로젝트 루트에서 실행했는지 확인
pwd
# /Users/fire/Desktop/bionvibe2 이어야 함

# data 폴더 확인
ls -la data/
```

### 일부 앱만 업데이트하고 싶을 때
```bash
# 현재는 전체 동기화만 지원
# 필요하다면 Supabase 대시보드에서 직접 수정
```

## 📚 관련 파일

- `data/apps.json` - 앱 데이터 원본
- `scripts/sync-apps-json-to-supabase.ts` - 동기화 스크립트
- `app/components/HomeContent.tsx` - apps.json 사용
- `lib/getApps.ts` - Supabase 사용

## 🎓 추가 정보

동기화 후에는:
1. ✅ 메인 페이지 - 자동 반영 (빌드 타임)
2. ✅ 히든 페이지 - 즉시 반영 (실시간)

배포 후 확인:
```bash
# 1. 로컬 확인
npm run dev
→ http://localhost:3000

# 2. 프로덕션 배포
vercel --prod

# 3. 확인
→ https://bionvibe.com
→ https://bionvibe.com/secret
```

