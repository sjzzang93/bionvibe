# 🚀 비트코인 vs 순금 모의투자 플랫폼 - 완벽 구현 가이드

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [주요 기능](#주요-기능)
3. [기술 스택](#기술-스택)
4. [데이터베이스 구조](#데이터베이스-구조)
5. [API 엔드포인트](#api-엔드포인트)
6. [설치 및 실행](#설치-및-실행)
7. [Supabase 설정](#supabase-설정)
8. [Vercel Cron 설정](#vercel-cron-설정)
9. [주요 기능 상세 설명](#주요-기능-상세-설명)
10. [추가 개선 아이디어](#추가-개선-아이디어)

---

## 프로젝트 개요

**비트코인 vs 순금 모의투자 플랫폼**은 실시간 가격 데이터를 기반으로 가상 투자를 체험할 수 있는 웹 애플리케이션입니다.

### 🎯 핵심 특징
- ✅ **IP 기반 사용자 관리** - 한 IP당 1회 가입, 1억원 시드머니
- ✅ **실시간 가격 반영** - Upbit(비트코인), 한국금거래소(순금) 실시간 API
- ✅ **가상 투자 시뮬레이션** - 매수/매도, 수익률 계산
- ✅ **24시간 가격 히스토리** - 자동 저장 및 차트 시각화
- ✅ **리워드 시스템** - 다른 웹앱 이용 시 100만원 보상
- ✅ **랭킹 시스템** - 사용자 간 수익률 경쟁
- ✅ **3D 증권앱 스타일 UI** - 다크 테마, 네온 효과, 반응형 디자인

---

## 주요 기능

### 1. 사용자 관리 시스템
- **닉네임 등록**: 최초 접속 시 닉네임 설정
- **IP 기반 인증**: 한 IP당 1회만 가입 가능
- **초기 자본**: 1억원 시드머니 자동 지급
- **잔액 관리**: 매수/매도 시 실시간 업데이트

### 2. 실시간 가격 조회
- **비트코인**: Upbit API로 실시간 원화 가격 조회
- **순금**: Supabase에서 한국금거래소 시세 조회 (1돈 = 3.75g)
- **1분 자동 갱신**: 가격 데이터 실시간 업데이트

### 3. 모의투자 기능
- **매수**: 원하는 금액만큼 비트코인/순금 구매
- **매도**: 보유 자산 매도 및 수익/손실 계산
- **포트폴리오 관리**: 보유 자산 현황, 수익률 실시간 조회
- **거래 내역**: 모든 매수/매도 기록 저장

### 4. 가격 히스토리 & 차트
- **24시간 단위 저장**: Cron Job으로 자동 가격 기록
- **차트 시각화**: Chart.js로 30일간 가격 추이 표시
- **비교 분석**: 비트코인 vs 순금 변동률 비교

### 5. 리워드 시스템
- **웹앱 연동**: 다른 웹앱 이용 시 API 호출
- **자동 지급**: 1회당 100만원 자동 충전
- **중복 방지**: 같은 앱은 하루 1회만 리워드

### 6. 랭킹 시스템
- **전체 순위**: 총 자산 기준 상위 50명 표시
- **내 순위**: 현재 사용자 순위 하이라이트
- **실시간 계산**: 포트폴리오 가치 + 잔액 기준

---

## 기술 스택

### Frontend
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 CSS
- **Chart.js + react-chartjs-2** - 차트 라이브러리

### Backend
- **Next.js API Routes** - 서버리스 API
- **Supabase** - PostgreSQL 데이터베이스
- **Vercel Cron** - 스케줄러 (가격 히스토리 저장)

### External APIs
- **Upbit API** - 비트코인 실시간 가격
- **한국금거래소** - 순금 시세 (Supabase 저장)
- **Exchange Rate API** - 환율 정보

---

## 데이터베이스 구조

### 1. investment_users (사용자)
```sql
- id: UUID (PK)
- nickname: VARCHAR(50) UNIQUE - 닉네임
- ip_address: VARCHAR(45) UNIQUE - IP 주소
- balance: BIGINT - 현금 잔액
- total_rewards: BIGINT - 누적 리워드
- created_at: TIMESTAMP - 가입일
- last_login: TIMESTAMP - 마지막 로그인
- is_active: BOOLEAN - 활성 상태
```

### 2. portfolios (포트폴리오)
```sql
- id: UUID (PK)
- user_id: UUID (FK) - 사용자 ID
- asset_type: VARCHAR(20) - 'bitcoin' | 'gold'
- quantity: DECIMAL(18,8) - 보유 수량
- buy_price: BIGINT - 매수가
- buy_amount: BIGINT - 매수 금액
- created_at: TIMESTAMP - 매수일
```

### 3. transactions (거래 내역)
```sql
- id: UUID (PK)
- user_id: UUID (FK) - 사용자 ID
- transaction_type: VARCHAR(10) - 'buy' | 'sell'
- asset_type: VARCHAR(20) - 자산 종류
- quantity: DECIMAL(18,8) - 거래 수량
- price: BIGINT - 거래 가격
- amount: BIGINT - 거래 금액
- profit: BIGINT - 수익 (매도시)
- profit_rate: DECIMAL(10,2) - 수익률 (%)
- created_at: TIMESTAMP - 거래일
```

### 4. price_history (가격 히스토리)
```sql
- id: UUID (PK)
- asset_type: VARCHAR(20) - 자산 종류
- price: BIGINT - 가격
- change_rate: DECIMAL(10,2) - 변동률 (%)
- change_price: BIGINT - 변동가
- volume: BIGINT - 거래량
- recorded_at: TIMESTAMP - 기록일
```

### 5. rewards (리워드 내역)
```sql
- id: UUID (PK)
- user_id: UUID (FK) - 사용자 ID
- app_name: VARCHAR(100) - 웹앱 이름
- reward_amount: BIGINT - 리워드 금액
- created_at: TIMESTAMP - 지급일
```

### 6. user_alerts (사용자 알림)
```sql
- id: UUID (PK)
- user_id: UUID (FK) - 사용자 ID
- asset_type: VARCHAR(20) - 자산 종류
- alert_type: VARCHAR(20) - 알림 유형
- target_price: BIGINT - 목표가
- is_active: BOOLEAN - 활성 상태
- created_at: TIMESTAMP - 생성일
```

---

## API 엔드포인트

### 사용자 관리

#### `GET /api/investment/user`
- **설명**: 현재 사용자 정보 조회 (IP 기반)
- **응답**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nickname": "투자왕",
    "balance": 100000000,
    "total_rewards": 0
  }
}
```

#### `POST /api/investment/user`
- **설명**: 신규 사용자 생성 (닉네임 등록)
- **요청**:
```json
{
  "nickname": "투자왕"
}
```
- **응답**:
```json
{
  "success": true,
  "data": { /* 사용자 정보 */ },
  "message": "환영합니다! 1억원이 지급되었습니다."
}
```

#### `PATCH /api/investment/user`
- **설명**: 사용자 잔액 수정
- **요청**:
```json
{
  "balance": 110000000
}
```

---

### 포트폴리오 관리

#### `GET /api/investment/portfolio`
- **설명**: 사용자 포트폴리오 조회
- **응답**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "asset_type": "bitcoin",
      "quantity": 0.001,
      "buy_price": 150000000,
      "buy_amount": 150000
    }
  ]
}
```

#### `POST /api/investment/portfolio`
- **설명**: 자산 매수
- **요청**:
```json
{
  "asset_type": "bitcoin",
  "quantity": 0.001,
  "buy_price": 150000000,
  "buy_amount": 150000
}
```

#### `DELETE /api/investment/portfolio`
- **설명**: 자산 매도
- **요청**:
```json
{
  "portfolio_id": "uuid",
  "sell_price": 155000000
}
```
- **응답**:
```json
{
  "success": true,
  "data": {
    "sell_amount": 155000,
    "profit": 5000,
    "profit_rate": 3.33
  },
  "message": "매도가 완료되었습니다. 수익: 5,000원"
}
```

---

### 거래 내역

#### `GET /api/investment/transactions?limit=50`
- **설명**: 거래 내역 조회
- **응답**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "transaction_type": "buy",
      "asset_type": "bitcoin",
      "amount": 1000000,
      "created_at": "2025-10-23T..."
    }
  ]
}
```

---

### 가격 히스토리

#### `GET /api/investment/price-history?asset_type=bitcoin&days=30`
- **설명**: 가격 히스토리 조회
- **파라미터**:
  - `asset_type`: 'bitcoin' | 'gold' | null (전체)
  - `days`: 조회 기간 (기본 30일)
- **응답**:
```json
{
  "success": true,
  "data": [
    {
      "asset_type": "bitcoin",
      "price": 150000000,
      "change_rate": 2.5,
      "recorded_at": "2025-10-23T00:00:00Z"
    }
  ]
}
```

#### `POST /api/investment/price-history`
- **설명**: 현재 가격 저장 (Cron 전용)
- **헤더**: `Authorization: Bearer {CRON_SECRET}`

---

### 리워드 시스템

#### `POST /api/investment/reward`
- **설명**: 리워드 지급 (다른 웹앱에서 호출)
- **요청**:
```json
{
  "app_name": "얼굴상 운세"
}
```
- **응답**:
```json
{
  "success": true,
  "data": {
    "reward_amount": 1000000,
    "new_balance": 101000000
  },
  "message": "얼굴상 운세 이용 보상 100만원이 지급되었습니다!"
}
```

#### `GET /api/investment/reward`
- **설명**: 리워드 내역 조회

---

### 랭킹 시스템

#### `GET /api/investment/ranking?limit=50`
- **설명**: 사용자 랭킹 조회
- **응답**:
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "rank": 1,
        "nickname": "투자왕",
        "total_assets": 150000000,
        "profit": 50000000,
        "profit_rate": 50.0
      }
    ],
    "my_ranking": {
      "rank": 5,
      "nickname": "나",
      "total_assets": 110000000,
      "profit_rate": 10.0
    },
    "total_users": 100
  }
}
```

---

## 설치 및 실행

### 1. 프로젝트 클론
```bash
cd /Users/fire/Desktop/bionvibe2
```

### 2. 의존성 설치
```bash
npm install
npm install chart.js react-chartjs-2
```

### 3. 환경 변수 설정 (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Cron Secret (가격 히스토리 저장용)
CRON_SECRET=your-secret-key
```

### 4. 개발 서버 실행
```bash
npm run dev
```

접속: http://localhost:3000/apps/crypto-calculator

### 5. 프로덕션 빌드
```bash
npm run build
npm start
```

---

## Supabase 설정

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 접속
2. 새 프로젝트 생성
3. URL과 API Key 복사

### 2. 데이터베이스 스키마 생성
1. Supabase SQL Editor 열기
2. `INVESTMENT_APP_DATABASE.sql` 파일 내용 전체 복사
3. 실행 (Execute)

### 3. Row Level Security (RLS) 확인
- 모든 테이블의 RLS가 활성화되었는지 확인
- Public read access 정책이 설정되었는지 확인

### 4. 금 시세 데이터 초기화
```sql
-- gold_prices 테이블에 초기 데이터 삽입
INSERT INTO gold_prices (buy_price, sell_price, change_rate, change_price, source)
VALUES (226666, 228533, 0.3, 680, '한국금거래소');
```

---

## Vercel Cron 설정

### 1. vercel.json 생성
프로젝트 루트에 다음 파일 생성:

```json
{
  "crons": [
    {
      "path": "/api/investment/price-history",
      "schedule": "0 0 * * *"
    }
  ]
}
```

이 설정은 **매일 자정(00:00)**에 가격 히스토리를 자동 저장합니다.

### 2. Vercel 환경 변수 설정
1. Vercel 프로젝트 설정 → Environment Variables
2. `CRON_SECRET` 추가 (랜덤 문자열)
3. `NEXT_PUBLIC_SUPABASE_URL` 추가
4. `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가

### 3. Cron 수동 테스트
```bash
curl -X POST https://your-domain.vercel.app/api/investment/price-history \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 주요 기능 상세 설명

### 1. IP 기반 사용자 인증

**구현 방법:**
```typescript
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  return 'unknown';
}
```

**특징:**
- 서버 측에서 IP 추출
- 한 IP당 1회만 가입 가능
- 로컬 환경에서는 'unknown'으로 표시됨 (프로덕션에서 정상 작동)

---

### 2. 실시간 가격 반영

**비트코인:**
```typescript
const btcResponse = await fetch('/api/crypto-price?symbol=BTC');
const btcData = await btcResponse.json();
const price = btcData.data.upbit.trade_price; // 원화 가격
```

**순금 (1돈 = 3.75g):**
```typescript
const goldResponse = await fetch('/api/gold-price');
const goldData = await goldResponse.json();
const price = goldData.data.buy * 3.75; // 1g → 1돈 변환
```

**자동 갱신:**
```typescript
const interval = setInterval(fetchData, 60000); // 1분마다
```

---

### 3. 수익률 계산 로직

**포트폴리오 가치:**
```typescript
const portfolioValue = portfolios.reduce((total, p) => {
  const currentPrice = p.asset_type === 'bitcoin'
    ? priceData.bitcoin.current
    : priceData.gold.buy;
  return total + (p.quantity * currentPrice);
}, 0);
```

**총 자산 & 수익률:**
```typescript
const totalAssets = user.balance + portfolioValue;
const profitRate = ((totalAssets - 100000000) / 100000000) * 100;
```

---

### 4. 리워드 연동 방법

**다른 웹앱에서 호출:**
```javascript
// 다른 웹앱 (예: 얼굴상 운세)에서 사용자가 앱을 이용한 후
fetch('https://your-domain.com/api/investment/reward', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ app_name: '얼굴상 운세' })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    alert(data.message); // "얼굴상 운세 이용 보상 100만원이 지급되었습니다!"
  }
});
```

**중복 방지:**
- 같은 앱은 하루 1회만 리워드
- 사용자 ID + 앱 이름 + 날짜로 중복 체크

---

### 5. 랭킹 계산 알고리즘

1. **모든 사용자 조회**
2. **각 사용자의 포트폴리오 가치 계산**
   - 비트코인: 수량 × 현재가
   - 순금: 수량 × 현재가
3. **총 자산 계산**: 잔액 + 포트폴리오 가치
4. **수익률 계산**: (총자산 - 1억) / 1억 × 100
5. **정렬**: 총 자산 기준 내림차순

---

### 6. 차트 데이터 처리

**데이터 필터링:**
```typescript
const labels = priceHistory
  .filter(h => h.asset_type === 'bitcoin')
  .map(h => new Date(h.recorded_at).toLocaleDateString('ko-KR'));

const bitcoinData = priceHistory
  .filter(h => h.asset_type === 'bitcoin')
  .map(h => h.price);

const goldData = priceHistory
  .filter(h => h.asset_type === 'gold')
  .map(h => h.price * 2000); // 스케일 조정
```

**Chart.js 설정:**
```typescript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { color: '#fff' } },
    tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
  },
  scales: {
    y: { ticks: { color: '#9ca3af' } },
    x: { ticks: { color: '#9ca3af' } }
  }
};
```

---

## 추가 개선 아이디어

### 1. 고급 기능
- [ ] **실시간 알림**: WebSocket으로 목표가 도달 시 푸시 알림
- [ ] **자동 매매**: 지정가 자동 매수/매도
- [ ] **손절/익절**: 자동 손절/익절 설정
- [ ] **포트폴리오 분석**: AI 기반 투자 조언
- [ ] **소셜 기능**: 사용자 간 팔로우, 투자 전략 공유

### 2. 데이터 확장
- [ ] **더 많은 암호화폐**: 이더리움, 리플, 솔라나 등
- [ ] **귀금속 추가**: 은, 백금, 팔라듐
- [ ] **주식 연동**: 코스피, 나스닥 모의투자
- [ ] **환율 거래**: 달러, 엔화, 유로 등

### 3. UI/UX 개선
- [ ] **다국어 지원**: 영어, 일본어, 중국어
- [ ] **다크/라이트 모드**: 테마 전환
- [ ] **커스텀 대시보드**: 사용자 맞춤 레이아웃
- [ ] **모바일 앱**: React Native로 네이티브 앱 제작
- [ ] **PWA**: 오프라인 지원, 앱 설치

### 4. 성능 최적화
- [ ] **Redis 캐싱**: 가격 데이터 캐싱으로 API 호출 감소
- [ ] **CDN**: 정적 자산 글로벌 배포
- [ ] **서버 사이드 렌더링**: SEO 최적화
- [ ] **이미지 최적화**: Next.js Image 컴포넌트 활용

### 5. 보안 강화
- [ ] **JWT 인증**: 세션 기반 인증 추가
- [ ] **Rate Limiting**: API 요청 제한
- [ ] **CSRF 보호**: 크로스 사이트 요청 위조 방지
- [ ] **입력 검증**: Zod로 스키마 검증

---

## 📊 프로젝트 구조

```
bionvibe2/
├── app/
│   ├── api/
│   │   ├── crypto-price/route.ts      # 비트코인 가격 API
│   │   ├── gold-price/route.ts        # 금 가격 API
│   │   └── investment/
│   │       ├── user/route.ts          # 사용자 관리
│   │       ├── portfolio/route.ts     # 포트폴리오 관리
│   │       ├── transactions/route.ts  # 거래 내역
│   │       ├── price-history/route.ts # 가격 히스토리
│   │       ├── reward/route.ts        # 리워드 시스템
│   │       └── ranking/route.ts       # 랭킹 시스템
│   └── apps/
│       └── crypto-calculator/
│           └── page.tsx               # 메인 페이지
├── INVESTMENT_APP_DATABASE.sql        # DB 스키마
├── INVESTMENT_APP_README.md           # 이 문서
├── package.json
└── vercel.json                        # Cron 설정
```

---

## 🎨 디자인 컨셉

### 색상 팔레트
- **배경**: Slate-900 → Blue-900 → Slate-900 그라디언트
- **강조**:
  - 비트코인: Orange-500 → Amber-500
  - 순금: Yellow-500 → Amber-600
  - 수익: Green-300
  - 손실: Red-300
- **3D 효과**: box-shadow, backdrop-blur, border, transform

### 타이포그래피
- **제목**: font-black (900), text-5xl
- **본문**: font-bold, text-base
- **숫자**: font-black, tabular-nums

### 애니메이션
- **호버**: scale-105, transition-all
- **배경**: animate-pulse, blur-3xl
- **로딩**: animate-spin

---

## 🐛 트러블슈팅

### 문제 1: IP 주소가 'unknown'으로 표시됨
**원인**: 로컬 환경에서는 IP를 추출할 수 없음
**해결**: Vercel 배포 후 정상 작동

### 문제 2: 가격 데이터 불러오기 실패
**원인**: API 타임아웃 또는 CORS 에러
**해결**: fetchWithTimeout 함수로 8초 타임아웃 설정

### 문제 3: Chart.js 렌더링 에러
**원인**: SSR 환경에서 Chart.js 초기화 문제
**해결**: 'use client' 지시어 추가 및 mounted 상태 체크

### 문제 4: Supabase RLS 권한 에러
**원인**: Row Level Security 정책 미설정
**해결**: SQL 파일에서 정책 자동 생성 코드 포함

---

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

## 👨‍💻 개발자

**Claude Code AI Assistant**
구현일: 2025년 10월 23일

---

## 🚀 배포 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 실행
- [ ] 환경 변수 설정
- [ ] Vercel 배포
- [ ] Vercel Cron 설정
- [ ] 도메인 연결
- [ ] HTTPS 확인
- [ ] 모바일 반응형 테스트
- [ ] 브라우저 호환성 테스트
- [ ] 성능 모니터링 설정

---

## 📞 문의

버그 리포트나 기능 제안은 GitHub Issues를 이용해주세요.

**프로젝트 완료! 🎉**
