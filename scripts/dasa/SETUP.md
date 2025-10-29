# 설치 및 실행 가이드

## 필수 요구사항

- Node.js 18 이상
- pnpm (권장) 또는 npm

## 설치 단계

### 1. 패키지 설치

pnpm을 사용하는 경우:
```bash
pnpm install
```

npm을 사용하는 경우:
```bash
npm install
```

### 2. 개발 서버 실행

```bash
pnpm dev
# 또는
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 3. 프로덕션 빌드

```bash
pnpm build
# 또는
npm run build
```

빌드 후 프로덕션 서버 실행:
```bash
pnpm start
# 또는
npm start
```

## Vercel 배포

### 방법 1: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 배포
vercel
```

### 방법 2: GitHub 연동

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com)에서 GitHub 연동
3. 프로젝트 선택 후 자동 배포

## 기술 스택 상세

### 프레임워크 및 라이브러리
- **Next.js 14.2.15**: App Router 사용
- **React 18.3.1**: UI 라이브러리
- **TypeScript 5**: 타입 안전성

### 스타일링
- **Tailwind CSS 3.4**: 유틸리티 우선 CSS
- **tailwindcss-animate**: 애니메이션 플러그인

### UI 컴포넌트
- **shadcn/ui**: 커스텀 가능한 컴포넌트 라이브러리
  - Button, Card, Input, Label, Tabs, Alert, Switch
- **lucide-react**: 아이콘 라이브러리

### 데이터 시각화
- **Recharts**: 반응형 차트 라이브러리

### 유틸리티
- **clsx**: 조건부 클래스 이름
- **tailwind-merge**: Tailwind 클래스 병합
- **class-variance-authority**: 컴포넌트 variant 관리

## 프로젝트 파일 구조

```
dasa/
├── .claude/                    # Claude Code 설정
├── .next/                      # Next.js 빌드 출력 (자동 생성)
├── node_modules/               # 패키지 (자동 생성)
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 전역 레이아웃
│   ├── page.tsx                # 홈 페이지 (리다이렉트)
│   ├── globals.css             # 전역 CSS 및 Tailwind
│   └── pricing-sim/
│       └── page.tsx            # 메인 계산기 (단일 파일 구현)
├── components/ui/              # shadcn/ui 컴포넌트
│   ├── alert.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── switch.tsx
│   └── tabs.tsx
├── lib/
│   └── utils.ts                # 유틸리티 함수
├── .env.example                # 환경 변수 예시
├── .gitignore                  # Git 무시 파일
├── next.config.js              # Next.js 설정
├── package.json                # 패키지 정보
├── postcss.config.js           # PostCSS 설정
├── README.md                   # 프로젝트 설명
├── SETUP.md                    # 이 파일
├── tailwind.config.ts          # Tailwind 설정
└── tsconfig.json               # TypeScript 설정
```

## 주요 기능 설명

### 계산기 페이지 (app/pricing-sim/page.tsx)

이 파일은 모든 기능이 단일 파일로 구현되어 있습니다:

1. **타입 정의**: Mix, BaselineResult, DiscountResult, MonthlyCalculation
2. **계산 함수**:
   - `calculateBaseline()`: 기준(할인 전) 계산
   - `calculateDiscount()`: 할인 후 계산
   - `calculateMonthly()`: 월 목표/회전 계산
3. **상태 관리**: useState로 모든 입력값 관리
4. **파생 계산**: useMemo로 계산 결과 캐싱
5. **localStorage**: useEffect로 자동 저장/복원
6. **UI**: 카드 기반 반응형 레이아웃

### localStorage 저장 구조

모든 입력값이 JSON 형태로 저장됩니다:
```json
{
  "porkCostPerKg": 11500,
  "beefCostPerKg": 9800,
  "portionGrams": 200,
  "porkPricePerPortion": 6500,
  "beefPricePerPortion": 8500,
  "mixPork": 60,
  "mixBeef": 10,
  "mixMeal": 15,
  "mixBev": 5,
  "mixAlc": 10,
  // ... 기타 설정값
}
```

## 문제 해결

### 빌드 오류

```bash
# 캐시 삭제 후 재빌드
rm -rf .next
pnpm build
```

### 포트 변경

기본 포트(3000)가 사용 중인 경우:
```bash
pnpm dev -- -p 3001
```

### 타입 오류

```bash
# 타입 체크
pnpm tsc --noEmit
```

## 개발 팁

### 새로운 shadcn/ui 컴포넌트 추가

이 프로젝트는 shadcn/ui를 수동으로 구현했습니다.
공식 CLI를 사용하려면:

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add [component-name]
```

### Hot Reload

Next.js는 자동으로 파일 변경을 감지하고 리로드합니다.
변경사항이 반영되지 않으면 개발 서버를 재시작하세요.

## 성능 최적화

- **useMemo**: 모든 계산 로직이 메모이제이션되어 불필요한 재계산 방지
- **SSR 안전**: mounted 상태로 localStorage 접근 시 hydration 오류 방지
- **반응형**: Tailwind의 반응형 유틸리티로 모바일 최적화
- **Static Generation**: 기본 페이지는 정적 생성

## 보안

- 클라이언트 측 계산만 사용 (서버 요청 없음)
- localStorage만 사용 (외부 데이터 전송 없음)
- 광고 및 추적 스크립트 없음
- HTTPS 배포 권장 (Vercel 자동 지원)

## 라이선스

MIT
