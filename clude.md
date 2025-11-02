# Claude Code 사용 가이드 - bionvibe2

이 문서는 bionvibe2 프로젝트에서 Claude Code를 효과적으로 사용하기 위한 가이드입니다.

## 프로젝트 개요

- **프로젝트명**: bionvibe2
- **기술 스택**: Next.js, TypeScript, Supabase
- **구조**: 멀티 앱 아키텍처 (`app/apps/` 디렉토리에 개별 앱들 위치)

## 빠른 시작

### 새로운 앱 개발

```
새 앱을 만들어줘: [앱이름]
- 기능: [원하는 기능]
- 스타일: [디자인 요구사항]
```

예시:
```
새 앱을 만들어줘: personality-test
- 기능: MBTI 스타일의 성격 테스트
- 스타일: 3D 카드 애니메이션, 다크모드 지원
```

### 버그 수정

```
[파일명]에서 [문제 설명] 버그를 고쳐줘
```

예시:
```
sociopath-test의 RadarChart3D에서 TypeScript 에러를 고쳐줘
```

### 기능 추가

```
[앱이름]에 [기능] 추가해줘
```

예시:
```
모든 테스트 앱에 RelatedApps 컴포넌트 추가해줘
```

## 자주 사용하는 작업 패턴

### 1. 앱 등록 및 데이터베이스 업데이트

```bash
# 새 앱을 apps 테이블에 등록
npm run sync-apps

# 또는 수동으로:
"UPDATE_APP_NAMES.sql 파일을 참고해서 새 앱을 등록해줘"
```

### 2. 이미지 및 아이콘 관리

```
# 이미지를 Supabase로 마이그레이션
"[앱이름]의 이미지를 Supabase로 옮겨줘"

# 아이콘 및 코스트 업데이트
npm run update-icons-and-costs
```

### 3. TypeScript 에러 수정

```
# 빌드 실행 및 에러 확인
npm run build

# Claude에게 요청
"빌드 에러를 모두 고쳐줘"
```

### 4. 개발 서버 실행

```bash
npm run dev
# localhost:3000에서 확인
```

## Claude Code에 효과적으로 요청하는 방법

### ✅ 좋은 예시

1. **구체적인 요청**
   ```
   birthday-rarity 앱의 결과 페이지에 공유 버튼을 추가해줘.
   - 카카오톡, 페이스북, 트위터 공유 지원
   - 버튼은 결과 하단에 배치
   ```

2. **컨텍스트 제공**
   ```
   psychopath-test와 같은 스타일로 새로운 emotional-intelligence 앱을 만들어줘.
   RadarChart3D 컴포넌트를 재사용하고 싶어.
   ```

3. **문제 설명**
   ```
   fortune 앱에서 카드를 클릭하면 애니메이션이 끊겨.
   CSS transition을 부드럽게 수정해줘.
   ```

### ❌ 피해야 할 요청

1. **모호한 요청**
   ```
   앱 좀 만들어줘
   ```

2. **너무 많은 작업을 한 번에**
   ```
   새 앱 10개 만들고, 모든 앱에 기능 추가하고, 버그도 다 고쳐줘
   ```

## 프로젝트별 컨벤션

### 파일 구조

```
app/apps/[app-name]/
├── page.tsx           # 메인 페이지
├── components/        # 앱별 컴포넌트
└── types.ts          # 타입 정의
```

### 명명 규칙

- **앱 이름**: kebab-case (예: `personality-test`, `fortune-teller`)
- **컴포넌트**: PascalCase (예: `RadarChart3D`, `FlipCard`)
- **파일명**: kebab-case (예: `radar-chart.tsx`)

### 스타일링

- Tailwind CSS 사용
- 다크모드 지원 (`dark:` prefix)
- 반응형 디자인 (`sm:`, `md:`, `lg:` breakpoints)

## 데이터베이스 작업

### 앱 메타데이터 업데이트

```sql
-- apps 테이블에 새 앱 등록
INSERT INTO apps (slug, title, description, icon, cost, category)
VALUES ('app-slug', '앱 제목', '설명', '🎯', 0, 'entertainment');
```

### 이미지 매핑

`IMAGE_TO_JSON_MAPPING.md` 파일을 참고하여 이미지 경로를 Supabase URL로 매핑

## Git 작업 플로우

### 커밋 생성

```
"변경사항을 커밋해줘"
```

Claude가 자동으로:
1. `git status`로 변경사항 확인
2. `git diff`로 변경 내용 검토
3. 적절한 커밋 메시지 생성
4. 커밋 실행

### Pull Request 생성

```
"PR 만들어줘"
```

Claude가 자동으로:
1. 현재 브랜치 상태 확인
2. PR 요약 작성
3. `gh pr create` 실행

## 팁과 트릭

### 1. 병렬 작업

여러 독립적인 작업을 동시에 요청:
```
다음 작업들을 해줘:
1. mbti-test의 결과 페이지 스타일 개선
2. fortune 앱에 로딩 스피너 추가
3. tarot 앱의 카드 데이터 업데이트
```

### 2. 기존 코드 참고

```
psychopath-test의 RadarChart3D 컴포넌트를 참고해서
새로운 BarChart3D 컴포넌트를 만들어줘
```

### 3. 점진적 개선

한 번에 완벽하게 만들려고 하지 말고, 단계적으로:
```
1. "기본 레이아웃만 먼저 만들어줘"
2. "애니메이션 추가해줘"
3. "다크모드 지원해줘"
```

## 문제 해결

### TypeScript 에러

```
npm run build
# 에러 확인 후
"TypeScript 에러를 고쳐줘"
```

### 린트 에러

```
npm run lint
# 에러 확인 후
"린트 에러를 고쳐줘"
```

### 개발 서버 문제

```bash
# 포트 충돌 시
lsof -ti:3000 | xargs kill
npm run dev
```

## 유용한 스크립트

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "sync-apps": "앱 메타데이터 동기화",
  "update-icons-and-costs": "아이콘 및 비용 업데이트"
}
```

## 추가 리소스

- [Claude Code 공식 문서](https://docs.claude.com/claude-code)
- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Supabase 문서](https://supabase.com/docs)

## 주의사항

1. **보안**: API 키나 비밀번호를 코드에 직접 넣지 마세요
2. **성능**: 이미지는 최적화해서 사용하세요
3. **접근성**: 모든 인터랙티브 요소에 적절한 ARIA 레이블을 추가하세요
4. **반응형**: 모바일, 태블릿, 데스크톱 모두에서 테스트하세요

---

**마지막 업데이트**: 2025-11-03
