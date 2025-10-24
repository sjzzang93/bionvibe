import { DevTerm } from '@/app/secret/dev-glossary/_lib/types';

export const CURSOR_PROMPT_TERMS: DevTerm[] = [
  {
    id: 'cursor-vague-styling',
    term: '버튼을 예쁘게 만들어줘',
    category: '커서프롬프트',
    languages: ['React', 'Tailwind CSS'],
    programs: ['Cursor', 'VS Code'],
    simpleExplanation: '"예쁘게"는 애매해요. 구체적으로 색상·크기·모양을 말해주세요.',
    generalExplanation: '모호한 스타일링 요청 대신 Tailwind 클래스나 CSS 속성을 명시하면 정확한 결과를 얻습니다.',
    example: '❌ 버튼을 예쁘게 만들어줘\n✅ 버튼에 Tailwind CSS로 bg-blue-500, hover:bg-blue-600, text-white, px-4 py-2, rounded-lg 클래스를 적용해줘.',
    relatedTerms: ['Tailwind CSS', 'UI/UX']
  },
  {
    id: 'cursor-async-data-fetch',
    term: '데이터 가져와줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'React'],
    programs: ['Cursor', 'Next.js', 'TanStack Query'],
    simpleExplanation: '어디서(API), 어떻게(GET/POST), 실패하면 어떻게 할지 정해주세요.',
    generalExplanation: '데이터 페칭 시 엔드포인트, HTTP 메서드, 로딩/에러 처리를 명시하면 완전한 코드가 생성됩니다.',
    example: '❌ 데이터 가져와줘\n✅ /api/posts에서 GET 요청으로 게시글 목록을 가져와줘. 로딩 상태는 <Skeleton />로 표시하고, 에러 시 토스트로 "데이터 로딩 실패" 메시지를 보여줘.',
    relatedTerms: ['API', 'TanStack Query', 'Async/Await']
  },
  {
    id: 'cursor-form-validation',
    term: '폼 만들어줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'React'],
    programs: ['Cursor', 'React Hook Form', 'Zod'],
    simpleExplanation: '어떤 입력창(이메일, 비밀번호)과 검증 규칙(필수, 최소 길이)이 필요한지 알려주세요.',
    generalExplanation: 'React Hook Form과 Zod를 사용해 필드명, 검증 조건, 에러 표시 방법을 명시하면 완성도 높은 폼이 생성됩니다.',
    example: '❌ 폼 만들어줘\n✅ React Hook Form과 Zod를 사용해서 이메일(필수, 유효한 형식), 비밀번호(필수, 최소 8자) 필드가 있는 로그인 폼을 만들어줘.',
    relatedTerms: ['React Hook Form', 'Zod', 'Validation']
  },
  {
    id: 'cursor-responsive-layout',
    term: '모바일에서도 보이게 해줘',
    category: '커서프롬프트',
    languages: ['CSS', 'Tailwind CSS'],
    programs: ['Cursor', 'Next.js', 'React'],
    simpleExplanation: '화면 크기별로(모바일 1열, 태블릿 2열) 어떻게 보일지 정해주세요.',
    generalExplanation: 'Tailwind 반응형 유틸리티(md:, lg:)로 각 브레이크포인트별 레이아웃을 명시하면 정확한 반응형 디자인이 완성됩니다.',
    example: '❌ 모바일에서도 보이게 해줘\n✅ 모바일에서는 1열, 태블릿(md:)에서는 2열, 데스크탑(lg:)에서는 3열 그리드로 만들어줘. gap-4와 px-4 적용.',
    relatedTerms: ['반응형 디자인', 'Tailwind CSS', 'Grid']
  },
  {
    id: 'cursor-api-route-validation',
    term: 'API 만들어줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'Next.js'],
    programs: ['Cursor', 'Next.js App Router', 'Zod'],
    simpleExplanation: '어떤 엔드포인트(/api/users), 어떤 HTTP 메서드(POST), 어떤 데이터 검증이 필요한지 알려주세요.',
    generalExplanation: 'Next.js API Route에서 경로, 메서드, Zod 검증 스키마, 성공/실패 응답을 명시하면 완전한 API가 생성됩니다.',
    example: '❌ API 만들어줘\n✅ /app/api/users/route.ts에 POST 엔드포인트를 만들어줘. Zod로 name(string, 필수), email(email, 필수) 검증하고, 실패 시 400 에러 반환.',
    relatedTerms: ['Next.js', 'API Route', 'Zod', 'Validation']
  },
  {
    id: 'cursor-typescript-strict',
    term: '타입 좀 고쳐줘',
    category: '커서프롬프트',
    languages: ['TypeScript'],
    programs: ['Cursor', 'VS Code'],
    simpleExplanation: '어떤 변수/함수의 타입이 문제인지, 원하는 타입이 뭔지 정확히 말해주세요.',
    generalExplanation: 'TypeScript 타입 오류 시 변수명, 현재 타입, 원하는 타입을 명시하고 유틸리티 타입(Partial, Pick)을 활용하면 정확한 수정이 가능합니다.',
    example: '❌ 타입 좀 고쳐줘\n✅ User 타입을 정의할 때 id는 string, name은 string, email은 string, createdAt은 Date 타입으로 명시해줘. any는 사용하지 마.',
    relatedTerms: ['TypeScript', 'Type Safety', 'Utility Types']
  },
  {
    id: 'cursor-loading-state',
    term: '로딩 중일 때 뭔가 보여줘',
    category: '커서프롬프트',
    languages: ['React', 'TypeScript'],
    programs: ['Cursor', 'Tailwind CSS'],
    simpleExplanation: 'Skeleton(빈 박스)을 보여줄지, 스피너를 보여줄지, 어떤 모양인지 정해주세요.',
    generalExplanation: '로딩 상태 UI는 Skeleton 컴포넌트, 스피너, 메시지 중 선택하고 animate-pulse로 애니메이션을 추가하면 좋은 UX를 제공합니다.',
    example: '❌ 로딩 중일 때 뭔가 보여줘\n✅ isLoading이 true일 때 Skeleton 컴포넌트를 표시하고, animate-pulse 애니메이션을 추가해줘.',
    relatedTerms: ['Loading State', 'Skeleton', 'UX']
  },
  {
    id: 'cursor-error-handling',
    term: '에러 처리 좀',
    category: '커서프롬프트',
    languages: ['TypeScript', 'JavaScript'],
    programs: ['Cursor', 'Next.js', 'React'],
    simpleExplanation: '어떤 에러(401, 500)에 어떤 메시지를 보여줄지, 토스트로 표시할지 정해주세요.',
    generalExplanation: 'try-catch로 에러를 잡고 HTTP 상태 코드별로 사용자 친화적 메시지를 표시하며, toast 라이브러리로 알림을 보내면 좋은 에러 처리가 됩니다.',
    example: '❌ 에러 처리 좀\n✅ try-catch로 에러를 잡고, 401은 "로그인이 필요합니다", 500은 "서버 오류"로 toast에 표시해줘.',
    relatedTerms: ['Error Handling', 'Try-Catch', 'Toast']
  },
  {
    id: 'cursor-seo-metadata',
    term: 'SEO 좀 해줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'Next.js'],
    programs: ['Cursor', 'Next.js'],
    simpleExplanation: '페이지 제목, 설명, OG 이미지 URL을 알려주면 검색엔진이 잘 읽어요.',
    generalExplanation: 'Next.js Metadata API를 사용해 title, description, openGraph를 명시하면 SEO와 소셜 공유 최적화가 완성됩니다.',
    example: '❌ SEO 좀 해줘\n✅ Metadata API로 title은 "페이지명 | 사이트명", description은 150자 이내, openGraph에 이미지 URL 포함해줘.',
    relatedTerms: ['SEO', 'Metadata', 'Open Graph']
  },
  {
    id: 'cursor-performance-memo',
    term: '성능 최적화해줘',
    category: '커서프롬프트',
    languages: ['React', 'TypeScript'],
    programs: ['Cursor', 'React DevTools'],
    simpleExplanation: '어떤 컴포넌트가 너무 자주 다시 그려지는지, 무거운 계산이 어디 있는지 알려주세요.',
    generalExplanation: 'React.memo, useMemo, useCallback으로 불필요한 리렌더링을 방지하고, 의존성 배열을 정확히 명시하면 성능이 개선됩니다.',
    example: '❌ 성능 최적화해줘\n✅ React.memo로 컴포넌트를 감싸고, useMemo로 heavyCalculation을 메모이제이션해줘. 의존성 배열 정확히 명시.',
    relatedTerms: ['Performance', 'React.memo', 'useMemo', 'useCallback']
  },
  {
    id: 'cursor-accessibility-aria',
    term: '접근성 추가해줘',
    category: '커서프롬프트',
    languages: ['HTML', 'React'],
    programs: ['Cursor', 'React'],
    simpleExplanation: '버튼·모달에 aria-label, role, tabIndex를 추가하면 스크린리더가 읽어줘요.',
    generalExplanation: 'aria-label, role, tabIndex, 포커스 트랩, ESC 키 닫기를 구현하면 장애인도 사용할 수 있는 접근성 높은 UI가 됩니다.',
    example: '❌ 접근성 추가해줘\n✅ 버튼에 aria-label="메뉴 닫기"를 추가하고, 모달에 role="dialog"와 aria-modal="true"를 추가해줘.',
    relatedTerms: ['Accessibility', 'ARIA', 'Keyboard Navigation']
  },
  {
    id: 'cursor-env-variables',
    term: 'API 키 어떻게 써?',
    category: '커서프롬프트',
    languages: ['Next.js', 'TypeScript'],
    programs: ['Cursor', 'Next.js'],
    simpleExplanation: '클라이언트에서 쓰려면 NEXT_PUBLIC_ 접두사, 서버 전용은 접두사 없이 .env.local에 저장하세요.',
    generalExplanation: '클라이언트 노출 변수는 NEXT_PUBLIC_ 접두사로 저장하고, 서버 전용 변수는 접두사 없이 저장하며, API 키는 절대 클라이언트에 노출하지 않습니다.',
    example: '❌ API 키 어떻게 써?\n✅ .env.local에 NEXT_PUBLIC_API_URL=https://api.example.com로 저장하고, process.env.NEXT_PUBLIC_API_URL로 접근.',
    relatedTerms: ['Environment Variables', 'Next.js', 'Security']
  },
  {
    id: 'cursor-image-optimization',
    term: '이미지 최적화해줘',
    category: '커서프롬프트',
    languages: ['Next.js', 'React'],
    programs: ['Cursor', 'Next.js'],
    simpleExplanation: 'Next.js Image 컴포넌트를 쓰고, width, height, priority(중요한 이미지)를 정해주세요.',
    generalExplanation: 'Next.js Image 컴포넌트로 width, height, priority, loading="lazy", alt를 명시하면 자동 최적화와 SEO가 개선됩니다.',
    example: '❌ 이미지 최적화해줘\n✅ Next.js Image 컴포넌트로 width={1200} height={600} priority alt="메인 배너"를 추가해줘.',
    relatedTerms: ['Image Optimization', 'Next.js', 'LCP']
  },
  {
    id: 'cursor-state-management',
    term: '전역 상태 관리해줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'React'],
    programs: ['Cursor', 'Zustand', 'Redux'],
    simpleExplanation: 'Zustand 같은 라이브러리로 여러 페이지에서 공유할 데이터(유저 정보)를 관리하세요.',
    generalExplanation: 'Zustand create 함수로 전역 스토어를 정의하고, persist 미들웨어로 localStorage에 자동 저장하며, TypeScript 타입을 정확히 지정합니다.',
    example: '❌ 전역 상태 관리해줘\n✅ Zustand로 count 상태와 increase 함수를 가진 스토어를 만들고, persist로 localStorage에 저장해줘.',
    relatedTerms: ['State Management', 'Zustand', 'Redux', 'Context API']
  },
  {
    id: 'cursor-animation-framer',
    term: '애니메이션 추가해줘',
    category: '커서프롬프트',
    languages: ['React', 'TypeScript'],
    programs: ['Cursor', 'Framer Motion'],
    simpleExplanation: '어떤 애니메이션(페이드인, 슬라이드)을 언제(페이지 로드, 클릭) 보여줄지 정해주세요.',
    generalExplanation: 'Framer Motion으로 initial, animate, exit, transition을 정의하고, AnimatePresence로 마운트/언마운트 애니메이션을 처리합니다.',
    example: '❌ 애니메이션 추가해줘\n✅ Framer Motion으로 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}을 추가해줘.',
    relatedTerms: ['Animation', 'Framer Motion', 'Transition']
  },
  {
    id: 'cursor-infinite-scroll',
    term: '무한 스크롤 만들어줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'React'],
    programs: ['Cursor', 'TanStack Query', 'Intersection Observer'],
    simpleExplanation: '스크롤이 끝에 닿으면 자동으로 다음 페이지 데이터를 불러오는 기능이에요.',
    generalExplanation: 'TanStack Query의 useInfiniteQuery와 Intersection Observer로 스크롤 감지하여 자동으로 다음 페이지를 로드합니다.',
    example: '❌ 무한 스크롤 만들어줘\n✅ useInfiniteQuery로 getNextPageParam을 설정하고, Intersection Observer로 스크롤 끝 감지해서 fetchNextPage 호출.',
    relatedTerms: ['Infinite Scroll', 'TanStack Query', 'Intersection Observer']
  },
  {
    id: 'cursor-server-actions',
    term: '서버 액션 만들어줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'Next.js'],
    programs: ['Cursor', 'Next.js 14+'],
    simpleExplanation: '폼 제출을 서버에서 바로 처리하고, 페이지를 새로고침 없이 업데이트하는 기능이에요.',
    generalExplanation: 'Next.js Server Actions로 "use server" 지시어를 추가하고, revalidatePath로 캐시 무효화, Zod로 입력 검증을 수행합니다.',
    example: '❌ 서버 액션 만들어줘\n✅ "use server" 지시어를 추가하고, Zod로 폼 데이터 검증 후 revalidatePath("/posts")로 캐시 무효화해줘.',
    relatedTerms: ['Server Actions', 'Next.js', 'Revalidation']
  },
  {
    id: 'cursor-database-prisma',
    term: '데이터베이스 연결해줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'Prisma'],
    programs: ['Cursor', 'Prisma', 'PostgreSQL'],
    simpleExplanation: 'Prisma로 데이터베이스 모델을 정의하고, npx prisma generate로 타입을 자동 생성해요.',
    generalExplanation: 'Prisma Client를 싱글톤 패턴으로 초기화하고, schema.prisma에 모델을 정의하며, 트랜잭션은 prisma.$transaction을 사용합니다.',
    example: '❌ 데이터베이스 연결해줘\n✅ Prisma Client를 싱글톤으로 초기화하고, schema.prisma에 User 모델 정의 후 npx prisma generate 실행.',
    relatedTerms: ['Prisma', 'Database', 'ORM', 'PostgreSQL']
  },
  {
    id: 'cursor-testing-vitest',
    term: '테스트 작성해줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'React'],
    programs: ['Cursor', 'Vitest', 'Testing Library'],
    simpleExplanation: '코드가 제대로 작동하는지 자동으로 확인하는 테스트 코드를 작성해요.',
    generalExplanation: 'Vitest와 Testing Library로 describe, it, expect를 사용하고, render, screen, fireEvent로 컴포넌트를 테스트합니다.',
    example: '❌ 테스트 작성해줘\n✅ Vitest로 Button 컴포넌트를 테스트하고, fireEvent.click으로 onClick이 호출되는지 expect로 확인해줘.',
    relatedTerms: ['Testing', 'Vitest', 'Testing Library', 'TDD']
  },
  {
    id: 'cursor-auth-session',
    term: '로그인 처리해줘',
    category: '커서프롬프트',
    languages: ['TypeScript', 'Next.js'],
    programs: ['Cursor', 'NextAuth.js', 'Supabase'],
    simpleExplanation: '사용자가 로그인하면 세션을 저장하고, 보호된 페이지는 로그인한 사람만 볼 수 있게 해요.',
    generalExplanation: 'NextAuth.js로 providers를 설정하고, session callback으로 JWT에 커스텀 데이터를 추가하며, middleware.ts로 보호된 라우트를 설정합니다.',
    example: '❌ 로그인 처리해줘\n✅ NextAuth.js로 Google provider 설정하고, session callback에서 JWT에 user.id 추가, middleware.ts로 /dashboard 보호.',
    relatedTerms: ['Authentication', 'NextAuth.js', 'JWT', 'Session']
  }
];

