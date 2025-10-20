'use client'

import { Suspense, useState } from 'react'
import CopyButton from '@/app/components/glossary/CopyButton'
import krText from '@/lib/i18n/kr.json'

function CursorPromptsContent() {
  const [activeTab, setActiveTab] = useState('glossary');

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {krText.title}
          </h1>
          <p className="text-gray-600">{krText.description}</p>
        </div>

        {/* 탭 버튼 */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'glossary'
                ? 'bg-violet-600 text-white'
                : 'bg-white text-violet-600 hover:bg-violet-50'
            }`}
          >
            📚 {krText.tabs.glossary}
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'export'
                ? 'bg-violet-600 text-white'
                : 'bg-white text-violet-600 hover:bg-violet-50'
            }`}
          >
            📤 {krText.tabs.export}
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {activeTab === 'glossary' && <GlossaryTab />}
          {activeTab === 'export' && <ExportTab />}
        </div>
      </div>
    </div>
  )
}

export default function CursorPromptsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <CursorPromptsContent />
    </Suspense>
  )
}

// 프롬프트 목록 탭
function GlossaryTab() {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // 실무에서 자주 사용되는 프롬프트 데이터
  const items = [
    {
      id: '1',
      slug: 'vague-styling',
      level: 'beginner',
      category: 'react',
      antiKr: '버튼을 예쁘게 만들어줘',
      antiEn: 'Make the button pretty',
      recKr: '버튼에 Tailwind CSS로 bg-blue-500, hover:bg-blue-600, text-white, px-4 py-2, rounded-lg 클래스를 적용해줘. 포커스 시 ring-2 ring-blue-300도 추가해줘.',
      recEn: 'Apply Tailwind CSS classes to the button: bg-blue-500, hover:bg-blue-600, text-white, px-4 py-2, rounded-lg. Also add ring-2 ring-blue-300 on focus.',
      snippetPrefix: 'btn-style',
      exampleKr: '<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300">클릭</button>'
    },
    {
      id: '2',
      slug: 'async-data-fetch',
      level: 'intermediate',
      category: 'nextjs',
      antiKr: '데이터 가져와줘',
      antiEn: 'Fetch the data',
      recKr: '/api/posts에서 GET 요청으로 게시글 목록을 가져와줘. 로딩 상태는 <Skeleton />로 표시하고, 에러 시 토스트로 "데이터 로딩 실패" 메시지를 보여줘. TanStack Query의 useQuery를 사용해줘.',
      recEn: 'Fetch the post list from /api/posts using GET request. Show <Skeleton /> during loading, and display a toast with "Failed to load data" on error. Use TanStack Query\'s useQuery.',
      snippetPrefix: 'fetch-data',
      exampleKr: 'const { data, isLoading, error } = useQuery({ queryKey: ["posts"], queryFn: () => fetch("/api/posts").then(r => r.json()) })'
    },
    {
      id: '3',
      slug: 'form-validation',
      level: 'intermediate',
      category: 'react',
      antiKr: '폼 만들어줘',
      antiEn: 'Create a form',
      recKr: 'React Hook Form과 Zod를 사용해서 이메일(필수, 유효한 형식), 비밀번호(필수, 최소 8자) 필드가 있는 로그인 폼을 만들어줘. 에러는 필드 아래에 빨간색 텍스트로 표시하고, submit 버튼은 유효성 검사 통과 시에만 활성화해줘.',
      recEn: 'Create a login form using React Hook Form and Zod with email (required, valid format) and password (required, min 8 chars) fields. Display errors as red text below each field, and enable the submit button only when validation passes.',
      snippetPrefix: 'form-validation',
      exampleKr: `const schema = z.object({ email: z.string().email(), password: z.string().min(8) })
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })`
    },
    {
      id: '4',
      slug: 'responsive-layout',
      level: 'beginner',
      category: 'uiux',
      antiKr: '모바일에서도 보이게 해줘',
      antiEn: 'Make it work on mobile',
      recKr: 'Tailwind의 반응형 유틸리티를 사용해서 모바일(기본)에서는 1열, 태블릿(md:)에서는 2열, 데스크탑(lg:)에서는 3열 그리드 레이아웃을 만들어줘. gap-4를 적용하고 px-4로 양쪽 여백도 추가해줘.',
      recEn: 'Use Tailwind responsive utilities to create a grid layout: 1 column on mobile (default), 2 columns on tablet (md:), 3 columns on desktop (lg:). Apply gap-4 and px-4 for padding.',
      snippetPrefix: 'responsive-grid',
      exampleKr: '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">...</div>'
    },
    {
      id: '5',
      slug: 'api-route-validation',
      level: 'intermediate',
      category: 'nextjs',
      antiKr: 'API 만들어줘',
      antiEn: 'Create an API',
      recKr: 'Next.js App Router의 /app/api/users/route.ts에 POST 엔드포인트를 만들어줘. Zod로 name(string, 필수), email(email, 필수) 검증하고, 실패 시 400 에러와 에러 메시지를 JSON으로 반환해줘. 성공 시 201과 생성된 유저 데이터를 반환해줘.',
      recEn: 'Create a POST endpoint in /app/api/users/route.ts using Next.js App Router. Validate with Zod: name (string, required), email (email, required). Return 400 with error messages on validation failure, 201 with created user data on success.',
      snippetPrefix: 'api-route',
      exampleKr: `export async function POST(req: Request) {
  const body = await req.json()
  const result = schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  // DB 저장 로직
  return NextResponse.json(user, { status: 201 })
}`
    },
    {
      id: '6',
      slug: 'typescript-strict',
      level: 'advanced',
      category: 'typescript',
      antiKr: '타입 좀 고쳐줘',
      antiEn: 'Fix the types',
      recKr: 'User 타입을 정의할 때 id는 string, name은 string, email은 string, createdAt은 Date 타입으로 명시해줘. optional 필드는 ?를 사용하고, Partial<User>나 Pick<User, "id" | "name"> 같은 유틸리티 타입도 활용해줘. any는 절대 사용하지 말아줘.',
      recEn: 'Define User type with id: string, name: string, email: string, createdAt: Date. Use ? for optional fields, and leverage utility types like Partial<User> or Pick<User, "id" | "name">. Never use any.',
      snippetPrefix: 'ts-types',
      exampleKr: `type User = { id: string; name: string; email: string; createdAt: Date; avatar?: string }
type UserUpdate = Partial<Pick<User, "name" | "email">>`
    },
    {
      id: '7',
      slug: 'loading-state',
      level: 'beginner',
      category: 'react',
      antiKr: '로딩 중일 때 뭔가 보여줘',
      antiEn: 'Show something while loading',
      recKr: 'isLoading 상태가 true일 때 Skeleton 컴포넌트를 표시하고, 데이터가 로드되면 실제 컨텐츠를 렌더링해줘. Skeleton은 animate-pulse 클래스로 애니메이션을 추가하고, 실제 컨텐츠와 동일한 레이아웃을 유지해줘.',
      recEn: 'Display a Skeleton component when isLoading is true, then render actual content when data loads. Add animate-pulse animation to Skeleton and maintain the same layout as actual content.',
      snippetPrefix: 'loading-skeleton',
      exampleKr: `{isLoading ? (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
) : <ActualContent data={data} />}`
    },
    {
      id: '8',
      slug: 'error-handling',
      level: 'intermediate',
      category: 'nextjs',
      antiKr: '에러 처리 좀',
      antiEn: 'Handle errors',
      recKr: 'try-catch로 에러를 잡고, 에러 타입별로 다른 메시지를 표시해줘. 네트워크 에러는 "인터넷 연결을 확인해주세요", 401은 "로그인이 필요합니다", 403은 "권한이 없습니다", 500은 "서버 오류가 발생했습니다"로 처리해줘. toast 라이브러리로 사용자에게 알려줘.',
      recEn: 'Use try-catch to handle errors and display different messages by error type. Network errors: "Check your connection", 401: "Login required", 403: "Unauthorized", 500: "Server error". Show user-friendly messages via toast.',
      snippetPrefix: 'error-handling',
      exampleKr: `try {
  const res = await fetch("/api/data")
  if (!res.ok) {
    if (res.status === 401) throw new Error("로그인이 필요합니다")
    if (res.status === 403) throw new Error("권한이 없습니다")
    throw new Error("서버 오류")
  }
} catch (err) {
  toast.error(err.message)
}`
    },
    {
      id: '9',
      slug: 'seo-metadata',
      level: 'intermediate',
      category: 'nextjs',
      antiKr: 'SEO 좀 해줘',
      antiEn: 'Add SEO',
      recKr: 'Next.js의 Metadata API를 사용해서 페이지 제목, 설명, OG 이미지, 트위터 카드를 설정해줘. title은 "페이지명 | 사이트명" 형식으로, description은 150자 이내로, openGraph에 이미지 URL과 사이트 정보를 포함해줘.',
      recEn: 'Use Next.js Metadata API to set page title, description, OG image, and Twitter card. Format title as "Page | Site", keep description under 150 chars, include image URL and site info in openGraph.',
      snippetPrefix: 'seo-metadata',
      exampleKr: `export const metadata: Metadata = {
  title: "프롬프트 단어장 | BION",
  description: "커서 AI 프롬프트 작성 가이드",
  openGraph: { title: "...", description: "...", images: ["/og.png"] }
}`
    },
    {
      id: '10',
      slug: 'performance-memo',
      level: 'advanced',
      category: 'performance',
      antiKr: '성능 최적화해줘',
      antiEn: 'Optimize performance',
      recKr: '불필요한 리렌더링을 방지하기 위해 React.memo로 컴포넌트를 감싸고, useMemo로 계산 비용이 큰 값을 메모이제이션하고, useCallback으로 함수를 메모이제이션해줘. 의존성 배열을 정확하게 명시하고, React DevTools Profiler로 성능을 측정해줘.',
      recEn: 'Prevent unnecessary re-renders with React.memo, memoize expensive calculations with useMemo, memoize functions with useCallback. Specify dependency arrays accurately and measure performance with React DevTools Profiler.',
      snippetPrefix: 'perf-memo',
      exampleKr: `const MemoizedComponent = React.memo(({ data }) => { ... })
const expensiveValue = useMemo(() => heavyCalculation(data), [data])
const handleClick = useCallback(() => { ... }, [dependency])`
    },
    {
      id: '11',
      slug: 'accessibility-aria',
      level: 'intermediate',
      category: 'a11y',
      antiKr: '접근성 추가해줘',
      antiEn: 'Add accessibility',
      recKr: '버튼에 aria-label로 의미있는 레이블을 추가하고, 키보드 네비게이션을 위해 tabIndex를 설정하고, 모달에는 role="dialog"와 aria-modal="true"를 추가해줘. 포커스 트랩을 구현하고, ESC 키로 닫을 수 있게 해줘.',
      recEn: 'Add meaningful aria-label to buttons, set tabIndex for keyboard navigation, add role="dialog" and aria-modal="true" to modals. Implement focus trap and allow closing with ESC key.',
      snippetPrefix: 'a11y-aria',
      exampleKr: `<button aria-label="메뉴 닫기" onClick={close}>
  <X />
</button>
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">...</div>`
    },
    {
      id: '12',
      slug: 'env-variables',
      level: 'beginner',
      category: 'nextjs',
      antiKr: 'API 키 어떻게 써?',
      antiEn: 'How to use API keys?',
      recKr: '클라이언트에서 접근해야 하는 환경변수는 NEXT_PUBLIC_ 접두사를 붙여서 .env.local에 저장해줘. 서버 전용 변수는 접두사 없이 저장하고, process.env.VARIABLE_NAME으로 접근해줘. API 키나 비밀키는 절대 클라이언트에 노출하지 말아줘.',
      recEn: 'Store client-accessible env vars in .env.local with NEXT_PUBLIC_ prefix. Store server-only vars without prefix and access via process.env.VARIABLE_NAME. Never expose API keys or secrets to client.',
      snippetPrefix: 'env-vars',
      exampleKr: `// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...

// 사용
const apiUrl = process.env.NEXT_PUBLIC_API_URL
const dbUrl = process.env.DATABASE_URL // 서버에서만`
    },
    {
      id: '13',
      slug: 'image-optimization',
      level: 'beginner',
      category: 'nextjs',
      antiKr: '이미지 최적화해줘',
      antiEn: 'Optimize images',
      recKr: 'Next.js의 Image 컴포넌트를 사용해서 이미지를 자동 최적화해줘. width, height를 명시하고, priority 속성으로 LCP 이미지를 우선 로드하고, loading="lazy"로 나머지는 지연 로드해줘. alt 텍스트는 필수로 추가해줘.',
      recEn: 'Use Next.js Image component for automatic optimization. Specify width and height, use priority for LCP images, use loading="lazy" for others. Always add descriptive alt text.',
      snippetPrefix: 'img-opt',
      exampleKr: `import Image from "next/image"

<Image 
  src="/hero.jpg" 
  alt="메인 배너" 
  width={1200} 
  height={600} 
  priority 
/>
<Image src="/thumbnail.jpg" alt="썸네일" width={300} height={200} loading="lazy" />`
    },
    {
      id: '14',
      slug: 'state-management',
      level: 'intermediate',
      category: 'react',
      antiKr: '전역 상태 관리해줘',
      antiEn: 'Manage global state',
      recKr: 'Zustand를 사용해서 전역 스토어를 만들어줘. create 함수로 스토어를 정의하고, set으로 상태를 업데이트하고, persist 미들웨어로 localStorage에 자동 저장해줘. TypeScript 타입도 정확하게 지정해줘.',
      recEn: 'Create a global store with Zustand. Define store with create function, update state with set, auto-save to localStorage with persist middleware. Add accurate TypeScript types.',
      snippetPrefix: 'state-zustand',
      exampleKr: `import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Store = { count: number; increase: () => void }
const useStore = create<Store>()(persist((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 }))
}), { name: 'my-store' }))`
    },
    {
      id: '15',
      slug: 'animation-framer',
      level: 'intermediate',
      category: 'uiux',
      antiKr: '애니메이션 추가해줘',
      antiEn: 'Add animations',
      recKr: 'Framer Motion을 사용해서 페이드인 + 슬라이드 애니메이션을 추가해줘. initial, animate, exit을 정의하고, transition으로 duration과 easing을 설정해줘. AnimatePresence로 마운트/언마운트 애니메이션도 처리해줘.',
      recEn: 'Add fade-in + slide animation with Framer Motion. Define initial, animate, exit states, set duration and easing in transition. Handle mount/unmount animations with AnimatePresence.',
      snippetPrefix: 'anim-framer',
      exampleKr: `<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  컨텐츠
</motion.div>`
    },
    {
      id: '16',
      slug: 'infinite-scroll',
      level: 'advanced',
      category: 'react',
      antiKr: '무한 스크롤 만들어줘',
      antiEn: 'Create infinite scroll',
      recKr: 'TanStack Query의 useInfiniteQuery와 Intersection Observer를 사용해서 무한 스크롤을 구현해줘. getNextPageParam으로 다음 페이지 번호를 계산하고, fetchNextPage로 데이터를 로드하고, isFetchingNextPage로 로딩 상태를 표시해줘.',
      recEn: 'Implement infinite scroll with TanStack Query\'s useInfiniteQuery and Intersection Observer. Calculate next page with getNextPageParam, load data with fetchNextPage, show loading state with isFetchingNextPage.',
      snippetPrefix: 'infinite-scroll',
      exampleKr: `const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['items'],
  queryFn: ({ pageParam = 1 }) => fetchItems(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage
})

// Intersection Observer로 스크롤 감지
useEffect(() => {
  if (inView && hasNextPage) fetchNextPage()
}, [inView])`
    },
    {
      id: '17',
      slug: 'server-actions',
      level: 'advanced',
      category: 'nextjs',
      antiKr: '서버 액션 만들어줘',
      antiEn: 'Create server actions',
      recKr: 'Next.js 14의 Server Actions를 사용해서 "use server" 지시어를 추가하고, 폼 데이터를 처리해줘. revalidatePath로 캐시를 무효화하고, redirect로 페이지 이동하고, Zod로 입력값을 검증해줘. 에러는 try-catch로 처리해줘.',
      recEn: 'Use Next.js 14 Server Actions with "use server" directive to process form data. Invalidate cache with revalidatePath, redirect with redirect, validate input with Zod. Handle errors with try-catch.',
      snippetPrefix: 'server-action',
      exampleKr: `'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const data = { title: formData.get('title'), content: formData.get('content') }
  const validated = schema.parse(data)
  await db.post.create({ data: validated })
  revalidatePath('/posts')
}`
    },
    {
      id: '18',
      slug: 'database-prisma',
      level: 'advanced',
      category: 'database',
      antiKr: '데이터베이스 연결해줘',
      antiEn: 'Connect to database',
      recKr: 'Prisma Client를 싱글톤 패턴으로 초기화하고, schema.prisma에 모델을 정의하고, npx prisma generate로 타입을 생성해줘. 트랜잭션이 필요하면 prisma.$transaction을 사용하고, 에러는 PrismaClientKnownRequestError로 처리해줘.',
      recEn: 'Initialize Prisma Client as singleton, define models in schema.prisma, generate types with npx prisma generate. Use prisma.$transaction for transactions, handle errors with PrismaClientKnownRequestError.',
      snippetPrefix: 'db-prisma',
      exampleKr: `// lib/prisma.ts
const prisma = globalThis.prismaGlobal ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

// 사용
const user = await prisma.user.create({ data: { name, email } })
const users = await prisma.user.findMany({ where: { active: true } })`
    },
    {
      id: '19',
      slug: 'testing-vitest',
      level: 'intermediate',
      category: 'testing',
      antiKr: '테스트 작성해줘',
      antiEn: 'Write tests',
      recKr: 'Vitest와 Testing Library를 사용해서 유닛 테스트를 작성해줘. describe로 테스트 그룹을 만들고, it 또는 test로 개별 케이스를 작성하고, expect로 assertion을 추가해줘. render, screen, fireEvent를 사용해서 컴포넌트를 테스트해줘.',
      recEn: 'Write unit tests with Vitest and Testing Library. Group tests with describe, write individual cases with it/test, add assertions with expect. Test components using render, screen, fireEvent.',
      snippetPrefix: 'test-vitest',
      exampleKr: `import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})`
    },
    {
      id: '20',
      slug: 'auth-session',
      level: 'advanced',
      category: 'security',
      antiKr: '로그인 처리해줘',
      antiEn: 'Handle authentication',
      recKr: 'NextAuth.js를 사용해서 인증을 구현해줘. [...nextauth]/route.ts에서 providers를 설정하고, session callback으로 JWT에 커스텀 데이터를 추가하고, middleware.ts로 보호된 라우트를 설정해줘. getServerSession으로 서버에서 세션을 확인해줘.',
      recEn: 'Implement auth with NextAuth.js. Configure providers in [...nextauth]/route.ts, add custom data to JWT with session callback, protect routes with middleware.ts. Check session on server with getServerSession.',
      snippetPrefix: 'auth-next',
      exampleKr: `import NextAuth from 'next-auth'

export const { handlers, auth } = NextAuth({
  providers: [Google, Credentials],
  callbacks: {
    session: ({ session, token }) => ({ ...session, user: { ...session.user, id: token.sub } })
  }
})`
    }
  ]

  const filteredItems = items.filter(item => {
    const matchesSearch = search === '' || 
      item.antiKr.includes(search) || 
      item.recKr.includes(search) ||
      item.slug.includes(search)
    const matchesLevel = levelFilter === 'all' || item.level === levelFilter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

    return matchesSearch && matchesLevel && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* 검색 & 필터 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder={krText.filter.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">{krText.filter.all}</option>
          <option value="beginner">{krText.level.beginner}</option>
          <option value="intermediate">{krText.level.intermediate}</option>
          <option value="advanced">{krText.level.advanced}</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">{krText.filter.all}</option>
          <option value="react">React</option>
          <option value="nextjs">Next.js</option>
          <option value="typescript">TypeScript</option>
          <option value="testing">Testing</option>
          <option value="database">Database</option>
          <option value="security">Security</option>
          <option value="performance">Performance</option>
          <option value="a11y">Accessibility</option>
          <option value="uiux">UI/UX</option>
        </select>
      </div>

      {/* 프롬프트 카드 목록 */}
      <div className="grid gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white border-2 border-violet-200 rounded-lg p-6 hover:border-violet-400 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-violet-700">{item.slug}</h3>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded">
                    {krText.level[item.level as keyof typeof krText.level]}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="font-semibold text-red-700 mb-2">❌ 안티패턴</p>
                <p className="text-gray-900">{item.antiKr}</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-green-700">✅ 권장패턴</p>
                  <CopyButton text={item.recKr} />
                </div>
                <p className="text-gray-900">{item.recKr}</p>
              </div>

              {item.exampleKr && (
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">📝 예시</p>
                    <CopyButton text={item.exampleKr} />
                  </div>
                  <pre className="text-sm overflow-x-auto bg-gray-900 text-white p-3 rounded">
                    <code>{item.exampleKr}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {krText.message.noData}
        </div>
      )}
    </div>
  )
}

// 내보내기 탭
function ExportTab() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">데이터를 다양한 형식으로 내보낼 수 있습니다</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all">
          📄 JSON 내보내기
        </button>
        <button className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all">
          📊 CSV 내보내기
        </button>
        <button className="px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all">
          📝 Markdown 내보내기
        </button>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="font-semibold text-yellow-800 mb-2">💡 곧 추가될 기능</p>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• JSON 파일 가져오기</li>
          <li>• 대량 데이터 생성</li>
          <li>• 히스토리 관리</li>
        </ul>
      </div>
    </div>
  )
}

