# BIONVIBE 프로젝트 전체 워크플로우 (GPT-5용)

## 📌 프로젝트 개요
- **프로젝트명**: BIONVIBE (bionvibe2)
- **목적**: 49개의 다양한 웹앱을 제공하는 포털 사이트
- **특징**: 프리미엄 2.5D/3D 디자인, 실시간 데이터, AI 기능

---

## 🛠️ 기술 스택

### 1. **프론트엔드**
```
- Next.js 15.1.3 (React 프레임워크)
- TypeScript (타입 안전성)
- Tailwind CSS (스타일링)
- shadcn/ui (UI 컴포넌트)
```

### 2. **백엔드 & 데이터베이스**
```
- Supabase (PostgreSQL 데이터베이스)
  ├── 테이블: apps, analytics, contacts, guestbook, gold_prices 등
  ├── Storage: 이미지/파일 저장
  └── Realtime: 실시간 데이터 동기화
```

### 3. **배포 & 호스팅**
```
- Vercel (Next.js 배포)
- 도메인: https://bionvibe.vercel.app (예상)
```

### 4. **개발 도구**
```
- Visual Studio Code (Cursor AI)
- Git/GitHub (버전 관리)
- npm (패키지 매니저)
```

### 5. **추가 도구**
```
- Python + Selenium (웹 크롤링)
- EmailJS (문의 폼)
- Google AdSense (광고)
```

---

## 📁 프로젝트 구조

```
/Users/fire/Desktop/bionvibe2/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 홈페이지 (모든 앱 카드 표시)
│   ├── layout.tsx                # 전역 레이아웃
│   ├── globals.css               # 전역 스타일
│   │
│   ├── apps/                     # 49개 웹앱 폴더
│   │   ├── crypto-calculator/    # 비트코인 vs 순금 계산기
│   │   ├── mbti-ai-chat/         # MBTI AI 채팅
│   │   ├── eye-test/             # 시력/색맹/노안 테스트
│   │   ├── face-shape/           # 얼굴형 분석
│   │   ├── habit-tracker/        # 습관 트래커
│   │   └── ... (45개 더)
│   │
│   ├── api/                      # API 라우트
│   │   ├── crypto-price/         # 비트코인 가격 조회
│   │   ├── gold-price/           # 금 시세 조회 (Supabase)
│   │   └── dev-terms/            # 개발 용어 조회
│   │
│   ├── components/               # 공통 컴포넌트
│   │   ├── Navigation.tsx        # 헤더 네비게이션
│   │   ├── AppFooter.tsx         # 푸터
│   │   ├── AnalyticsTracker.tsx  # 방문자 추적
│   │   └── ui/                   # UI 컴포넌트
│   │       ├── PremiumLayout.tsx # 3D 배경 레이아웃
│   │       ├── PremiumCard.tsx   # 3D 카드
│   │       └── PremiumButton.tsx # 3D 버튼
│   │
│   └── secret/                   # 히든페이지 (관리자 도구)
│       ├── page.tsx              # 비밀 금고 (비밀번호는 환경변수 참조)
│       ├── analytics/            # 방문자 통계
│       ├── contacts/             # 문의 관리
│       ├── guestbook/            # 방명록 관리
│       ├── image-manager/        # 이미지 관리
│       ├── dev-glossary/         # 개발 용어 사전
│       └── gold-price-manager/   # 금 시세 관리
│
├── data/                         # 데이터 파일
│   ├── apps.json                 # 모든 앱 메타데이터
│   └── categories.json           # 카테고리 정의
│
├── lib/                          # 유틸리티 함수
│   ├── getApps.ts                # 앱 데이터 로드
│   ├── supabase.ts               # Supabase 클라이언트
│   └── utils.ts                  # 기타 유틸
│
├── scripts/                      # 자동화 스크립트
│   ├── gold_price_crawler.py     # 금 시세 크롤러 (Python + Selenium)
│   ├── setup_crawler.sh          # 크롤러 설치
│   ├── start_crawler.sh          # 크롤러 시작
│   └── stop_crawler.sh           # 크롤러 중지
│
├── public/                       # 정적 파일
│   ├── images/                   # 이미지
│   ├── uploads/                  # 업로드 파일
│   └── robots.txt                # SEO
│
├── .env.local                    # 환경 변수 (시크릿)
├── package.json                  # 의존성 패키지
├── next.config.mjs               # Next.js 설정
├── tailwind.config.ts            # Tailwind 설정
└── *.sql                         # Supabase SQL 스크립트
```

---

## 🔄 개발 워크플로우 (단계별)

### **1단계: 아이디어 & 기획** 💡
```
1. 사용자가 "OO 웹앱 만들어줘" 요청
2. AI가 기능, UI, 데이터 구조 기획
3. 필요한 API, DB 테이블 확인
```

### **2단계: 앱 생성** 🛠️
```
1. app/apps/[앱이름]/page.tsx 파일 생성
2. 'use client' 추가 (클라이언트 컴포넌트)
3. PremiumLayout, PremiumCard, PremiumButton 사용
4. 상태 관리 (useState, useEffect)
5. API 호출 (fetch) 또는 Supabase 연동
```

**예시 코드 구조:**
```typescript
'use client';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';

export default function MyAppPage() {
  const [data, setData] = useState(null);
  
  return (
    <PremiumLayout theme="purple" showStars={true}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PremiumCard gradient={true} hover={true}>
          <h1>앱 제목</h1>
          <PremiumButton onClick={handleClick}>
            버튼
          </PremiumButton>
        </PremiumCard>
      </div>
    </PremiumLayout>
  );
}
```

### **3단계: 데이터 등록** 📊
```
data/apps.json에 새 앱 정보 추가:
{
  "id": "unique-id",
  "name": "앱 이름",
  "icon": "🎯",
  "url": "/apps/앱경로",
  "description": "설명",
  "category": "카테고리",
  "is_hidden": false,
  "image": "/uploads/apps/앱이미지.jpg"
}
```

### **4단계: 로컬 테스트** 🧪
```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
http://localhost:3000/apps/[앱이름]

# 모바일 테스트 (같은 Wi-Fi)
http://172.30.1.73:3000/apps/[앱이름]
```

### **5단계: Supabase 연동** (필요 시) 🗄️
```sql
-- 1. Supabase Dashboard → SQL Editor에서 테이블 생성
CREATE TABLE my_table (
  id BIGSERIAL PRIMARY KEY,
  data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS 정책 설정 (보안)
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "공개 읽기" ON my_table FOR SELECT USING (true);

-- 3. 앱에서 사용
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const { data, error } = await supabase.from('my_table').select('*');
```

### **6단계: Git 커밋** 📝
```bash
git add .
git commit -m "feat: 새 웹앱 추가 (앱이름)"
git push origin main
```

### **7단계: Vercel 배포** 🚀
```bash
# 자동 배포 (Git push 시)
# 또는 수동 배포
vercel --prod

# 배포 완료 후 URL
https://bionvibe.vercel.app/apps/[앱이름]
```

### **8단계: 모니터링** 📈
```
1. /secret 페이지 접속 (비밀번호는 배포 환경 변수 참조)
2. 📊 방문자 통계 확인
3. 📧 문의 관리
4. 🖼️ 이미지 관리
5. 💰 금 시세 관리 (필요 시)
```

---

## 🔧 주요 작업별 프로세스

### **A. 외부 API 사용 앱**
```
1. API 엔드포인트 조사
2. app/api/[이름]/route.ts 생성 (프록시)
3. 클라이언트에서 /api/[이름] 호출
4. 에러 처리 & 캐싱 설정
```

**예시: 비트코인 가격**
```typescript
// app/api/crypto-price/route.ts
export async function GET(request: NextRequest) {
  const response = await fetch('https://api.coinbase.com/...');
  const data = await response.json();
  return NextResponse.json(data);
}

// 클라이언트에서 호출
fetch('/api/crypto-price?symbol=BTC');
```

### **B. 이미지 업로드 앱**
```
1. <input type="file" accept="image/*" />
2. FileReader로 클라이언트에서 읽기
3. Canvas API로 분석 (얼굴형, 손금 등)
4. 서버 업로드 필요 시 Supabase Storage 사용
```

### **C. 실시간 데이터 앱**
```
1. Supabase Realtime 구독
2. useEffect에서 channel.subscribe()
3. 데이터 변경 시 자동 업데이트
```

### **D. 크롤링이 필요한 앱**
```
1. Python + Selenium 스크립트 작성
2. scripts/ 폴더에 저장
3. schedule 라이브러리로 주기적 실행
4. Supabase에 결과 저장
5. Next.js 앱에서 DB 조회
```

---

## 🔐 환경 변수 (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Secret Vault Password
# ⚠️ 보안: 실제 비밀번호는 .env.local 및 Vercel 환경변수에만 설정
SECRET_VAULT_PASSWORD=배포_환경_변수_참조

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx

# Google AdSense
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxx
```

### 🔒 보안 주의사항
- ⚠️ `.env.local` 파일은 절대 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)
- ⚠️ Vercel 배포 시: Project Settings > Environment Variables에 `SECRET_VAULT_PASSWORD` 설정 필요
- ⚠️ 공개 문서에는 실제 비밀번호를 기재하지 마세요

---

## 🎨 프리미엄 디자인 시스템

### **PremiumLayout** (3D 배경)
```typescript
<PremiumLayout theme="purple" showStars={true}>
  {children}
</PremiumLayout>

// 테마: purple, blue, orange, green, pink
```

### **PremiumCard** (3D 카드)
```typescript
<PremiumCard 
  gradient={true}    // 그라데이션 배경
  hover={true}       // 호버 3D 효과
  depth={true}       // 깊이 그림자
>
  {children}
</PremiumCard>
```

### **PremiumButton** (3D 버튼)
```typescript
<PremiumButton
  variant="primary"  // primary, secondary, success, danger
  size="lg"          // sm, md, lg
  fullWidth={true}
  icon="🎯"
  onClick={handleClick}
>
  버튼 텍스트
</PremiumButton>
```

---

## 📊 데이터 흐름

```
사용자 → Next.js 앱 → API Route → 외부 API / Supabase → 응답
         ↓
      AnalyticsTracker (자동 방문자 추적)
         ↓
      Supabase analytics 테이블
         ↓
      /secret/analytics (통계 대시보드)
```

---

## 🚨 주요 에러 해결

### 1. **Supabase 테이블 없음 에러**
```
Error: Could not find the table 'public.xxx'
→ Supabase SQL Editor에서 테이블 생성 필요
→ *.sql 파일 실행
```

### 2. **CORS 에러**
```
→ app/api/[이름]/route.ts에서 프록시 처리
→ headers에 'Access-Control-Allow-Origin': '*' 추가
```

### 3. **이미지 업로드 실패**
```
→ Vercel Blob Storage 사용
→ 또는 Supabase Storage 사용
```

---

## 🎯 현재 프로젝트 상태

### ✅ 완료된 것
- 49개 웹앱 모두 프리미엄 3D 디자인 적용
- 히든페이지 관리 도구 완비
- 방문자 Analytics 시스템
- MBTI AI 채팅 복구
- 금 시세 API Supabase 연동 준비

### 🚧 진행 중
- gold_prices 테이블 Supabase에 생성 필요
- Python 크롤러 테스트 필요

### 📋 TODO
1. Supabase에서 `GOLD_PRICE_SUPABASE.sql` 실행
2. Python 크롤러 설치 및 실행
3. 최종 테스트
4. Vercel 배포

---

## 💡 GPT-5에게 요청할 때 팁

### ✅ 좋은 요청 예시
```
"crypto-calculator 앱에서 금 시세가 안 나와. 
gold_prices 테이블 생성하고 API 수정해줘"

"새로운 명상 타이머 앱 만들어줘. 
5분/10분/15분 선택하고 종소리 나게"

"히든페이지에 새 관리 도구 추가해줘"
```

### ❌ 피해야 할 요청
```
"앱 만들어줘" (너무 모호함)
"에러 고쳐줘" (에러 로그 없음)
"배포해줘" (어디에?)
```

---

## 📞 도움이 필요할 때

1. **에러 발생 시**: 터미널 로그 전체 복사
2. **새 기능 요청**: 구체적인 동작 설명
3. **디자인 수정**: 어떤 앱의 어떤 부분인지 명시
4. **DB 관련**: 어떤 테이블, 어떤 데이터인지 설명

---

이 문서는 BIONVIBE 프로젝트의 완전한 워크플로우입니다.
GPT-5가 이 문서를 읽으면 프로젝트 구조와 개발 프로세스를 
완벽하게 이해할 수 있습니다. 🚀
