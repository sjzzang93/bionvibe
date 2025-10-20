# 🚀 Vercel Blob Storage 설정 가이드

## 1단계: Vercel 프로젝트 연결

```bash
# Vercel CLI 설치 (이미 설치되어 있으면 건너뛰기)
npm i -g vercel

# 프로젝트를 Vercel에 연결
vercel link
```

## 2단계: Vercel Blob Storage 생성

1. **Vercel Dashboard 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Storage 탭 선택**
   - 좌측 메뉴에서 "Storage" 클릭

3. **Create Database 클릭**
   - "Blob" 선택
   - "Create" 버튼 클릭

4. **Connect to Project**
   - 현재 프로젝트 선택
   - "Connect" 버튼 클릭

## 3단계: 환경 변수 자동 설정

Vercel이 자동으로 환경 변수를 설정해줍니다!

```bash
# 로컬 환경 변수 다운로드
vercel env pull .env.local
```

이 명령어를 실행하면 `.env.local` 파일에 `BLOB_READ_WRITE_TOKEN`이 자동으로 추가됩니다!

## 4단계: 개발 서버 재시작

```bash
# 개발 서버 재시작
npm run dev
```

## 5단계: 배포

```bash
# Vercel에 배포
vercel --prod
```

---

## ✅ 확인 사항

배포 후 다음을 확인하세요:

1. ✅ 이미지 업로드 기능 작동
2. ✅ 업로드된 이미지가 전세계 어디서나 로딩됨
3. ✅ CDN을 통한 빠른 로딩 속도

---

## 📊 무료 플랜 제한

- **저장 공간**: 5GB
- **대역폭**: 100GB/월
- **파일 수**: 무제한

대부분의 프로젝트에 충분합니다! 🎉

---

## 🆘 문제 해결

**Q: BLOB_READ_WRITE_TOKEN이 없어요!**
```bash
# 해결 방법:
vercel env pull .env.local --force
```

**Q: 업로드가 안 돼요!**
- Vercel Dashboard에서 Blob Storage가 제대로 연결되었는지 확인
- `.env.local` 파일에 토큰이 있는지 확인
- 개발 서버를 재시작했는지 확인

**Q: 배포 후에도 안 돼요!**
- Vercel Dashboard → Settings → Environment Variables에서 토큰 확인
- 재배포: `vercel --prod`


## 1단계: Vercel 프로젝트 연결

```bash
# Vercel CLI 설치 (이미 설치되어 있으면 건너뛰기)
npm i -g vercel

# 프로젝트를 Vercel에 연결
vercel link
```

## 2단계: Vercel Blob Storage 생성

1. **Vercel Dashboard 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Storage 탭 선택**
   - 좌측 메뉴에서 "Storage" 클릭

3. **Create Database 클릭**
   - "Blob" 선택
   - "Create" 버튼 클릭

4. **Connect to Project**
   - 현재 프로젝트 선택
   - "Connect" 버튼 클릭

## 3단계: 환경 변수 자동 설정

Vercel이 자동으로 환경 변수를 설정해줍니다!

```bash
# 로컬 환경 변수 다운로드
vercel env pull .env.local
```

이 명령어를 실행하면 `.env.local` 파일에 `BLOB_READ_WRITE_TOKEN`이 자동으로 추가됩니다!

## 4단계: 개발 서버 재시작

```bash
# 개발 서버 재시작
npm run dev
```

## 5단계: 배포

```bash
# Vercel에 배포
vercel --prod
```

---

## ✅ 확인 사항

배포 후 다음을 확인하세요:

1. ✅ 이미지 업로드 기능 작동
2. ✅ 업로드된 이미지가 전세계 어디서나 로딩됨
3. ✅ CDN을 통한 빠른 로딩 속도

---

## 📊 무료 플랜 제한

- **저장 공간**: 5GB
- **대역폭**: 100GB/월
- **파일 수**: 무제한

대부분의 프로젝트에 충분합니다! 🎉

---

## 🆘 문제 해결

**Q: BLOB_READ_WRITE_TOKEN이 없어요!**
```bash
# 해결 방법:
vercel env pull .env.local --force
```

**Q: 업로드가 안 돼요!**
- Vercel Dashboard에서 Blob Storage가 제대로 연결되었는지 확인
- `.env.local` 파일에 토큰이 있는지 확인
- 개발 서버를 재시작했는지 확인

**Q: 배포 후에도 안 돼요!**
- Vercel Dashboard → Settings → Environment Variables에서 토큰 확인
- 재배포: `vercel --prod`

