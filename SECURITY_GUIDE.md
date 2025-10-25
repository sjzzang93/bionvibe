# 🔐 BIONVIBE 보안 가이드

> 이 문서는 **사내 전용 문서**입니다. 외부 공개 시 민감 정보는 반드시 제거하세요.

---

## 📋 환경 변수 설정

### 1. 로컬 개발 환경 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://vfoecqunkmqxktgywkdp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmb2VjcXVua21xeGt0Z3l3a2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTc2MzAsImV4cCI6MjA0OTk5MzYzMH0.6oKPXLfOUJN2Y9HL53BdQFX1pv7QTQVvTlXGvCf2QbM

# Secret Vault Password
# ⚠️ 히든페이지 비밀번호 (사내 전용 정보)
SECRET_VAULT_PASSWORD=1218

# EmailJS (문의 폼)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx

# Google AdSense
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxx
```

⚠️ **주의**: `.env.local` 파일은 절대 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨)

---

## 🚀 Vercel 프로덕션 배포 설정

### 환경 변수 설정 방법

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - bionvibe2 프로젝트 선택

2. **Settings 메뉴 이동**
   - 프로젝트 상단 메뉴에서 "Settings" 클릭

3. **Environment Variables 설정**
   - 좌측 메뉴에서 "Environment Variables" 선택

4. **변수 추가**
   
   | Key | Value | Environment |
   |-----|-------|-------------|
   | `SECRET_VAULT_PASSWORD` | `1218` | ✅ Production, ✅ Preview, ✅ Development |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://vfoecqunkmqxktgywkdp.supabase.co` | ✅ Production, ✅ Preview, ✅ Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | ✅ Production, ✅ Preview, ✅ Development |

5. **저장 및 재배포**
   - "Save" 버튼 클릭
   - 터미널에서 재배포 실행:
   ```bash
   vercel --prod
   ```

---

## 🔒 보안 체크리스트

### ✅ 필수 보안 조치

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] Vercel 환경 변수에 `SECRET_VAULT_PASSWORD` 설정 완료
- [ ] 공개 문서(README, WORKFLOW 등)에 비밀번호가 노출되지 않았는지 확인
- [ ] Git 커밋 전 `git status`로 `.env.local`이 staging되지 않았는지 확인

### ⚠️ 절대 하지 말아야 할 것

- ❌ `.env.local` 파일을 Git에 커밋하지 마세요
- ❌ 공개 문서에 실제 비밀번호를 기재하지 마세요
- ❌ Slack, Discord 등 외부 채널에 비밀번호를 공유하지 마세요
- ❌ 스크린샷이나 화면 공유 시 환경 변수 노출 주의

### ✅ 권장 사항

- ✅ 비밀번호는 "배포 환경 변수 참조"로 표기
- ✅ 사내 문서는 별도 저장소(비공개)로 관리
- ✅ 정기적으로 비밀번호 변경 (3~6개월)
- ✅ 팀원 퇴사 시 즉시 비밀번호 변경

---

## 📝 히든페이지 접근 방법

### 로컬 개발 환경
```
1. BION 로고를 5번 클릭 (3초 안에)
2. Event(이벤트 신청) 버튼 클릭 (3초 안에)
3. 비밀번호 입력: 1218
4. "확인" 버튼 클릭
```

### 프로덕션 환경
- 동일한 방법으로 접근
- Vercel 환경 변수에 `SECRET_VAULT_PASSWORD=1218` 설정 필수

---

## 🔄 비밀번호 변경 방법

### 1. 로컬 환경
`.env.local` 파일 수정:
```env
SECRET_VAULT_PASSWORD=새비밀번호
```

### 2. Vercel 프로덕션
1. Vercel Dashboard → Settings → Environment Variables
2. `SECRET_VAULT_PASSWORD` 값 수정
3. 재배포 실행:
```bash
vercel --prod
```

### 3. 코드 기본값 변경 (선택사항)
`app/api/secret/verify/route.ts` 파일의 기본값도 변경 가능:
```typescript
const correctPassword = process.env.SECRET_VAULT_PASSWORD || '새기본값';
```

---

## 🚨 보안 사고 대응

### 비밀번호 노출 시 즉시 조치
1. **즉시 비밀번호 변경**
   - `.env.local` 수정
   - Vercel 환경 변수 변경
   - 재배포

2. **노출 경로 차단**
   - 공개 문서에서 삭제
   - Git 히스토리에서 제거 (필요 시)
   - 외부 공유 링크 무효화

3. **팀원 통지**
   - 새 비밀번호 안전하게 공유
   - 보안 정책 재교육

---

## 📞 문의

보안 관련 문의나 이슈 발견 시:
- 개발팀 내부 채널로 즉시 보고
- 외부 공개 채널 사용 금지

---

**마지막 업데이트**: 2025-10-25  
**다음 보안 점검**: 2025-11-25 (월 1회 권장)

