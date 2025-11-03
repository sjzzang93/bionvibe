'use client'

import { Suspense, useState } from 'react'
import CopyButton from '@/app/components/glossary/CopyButton'

function DevVocabContent() {
  const [activeTab, setActiveTab] = useState('vocab');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            개발자 언어 단어장
          </h1>
          <p className="text-sm sm:text-base text-gray-600">프로그래밍 핵심 용어를 한눈에 정리하고 학습하세요</p>
        </div>

        {/* 탭 버튼 */}
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => setActiveTab('vocab')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all ${
              activeTab === 'vocab'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            📚 단어장
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            🎯 퀴즈
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6">
          {activeTab === 'vocab' && <VocabTab />}
          {activeTab === 'quiz' && <QuizTab />}
        </div>
      </div>
    </div>
  )
}

export default function DevVocabPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">로딩 중...</p>
        </div>
      </div>
    }>
      <DevVocabContent />
    </Suspense>
  )
}

// 단어장 탭
function VocabTab() {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // 개발자 핵심 용어 데이터
  const vocabs = [
    {
      id: '1',
      term: 'API',
      pronunciation: '에이피아이',
      korean: '응용 프로그램 연결 인터페이스',
      level: 'beginner',
      category: 'backend',
      definition: '서로 다른 프로그램이 대화할 수 있게 해주는 약속된 규칙',
      analogy: '🥩 고기집 메뉴판처럼, 손님이 주문하면(요청) 주방이 요리를 내주는(응답) 정해진 방식',
      example: '날씨 앱이 기상청 서버에서 날씨 정보를 가져올 때 API를 사용합니다',
      usage: 'fetch("/api/users").then(res => res.json())'
    },
    {
      id: '2',
      term: 'Asynchronous',
      pronunciation: '어싱크러너스',
      korean: '비동기 처리',
      level: 'intermediate',
      category: 'javascript',
      definition: '일이 끝날 때까지 기다리지 않고 다른 일을 동시에 처리하는 방식',
      analogy: '🍖 고기집 주방장이 삼겹살 굽는 동안 동시에 된장찌개도 끓이는 것처럼, 한 작업 끝나길 기다리지 않고 여러 일 동시 처리',
      example: '웹사이트에서 사진을 로딩하는 동안 다른 글자나 버튼을 먼저 보여주는 것',
      usage: 'const data = await fetch("/api/data").then(r => r.json())'
    },
    {
      id: '3',
      term: 'State',
      pronunciation: '스테이트',
      korean: '상태',
      level: 'intermediate',
      category: 'frontend',
      definition: '화면에 보이는 데이터나 값들을 기억하고 관리하는 것',
      analogy: '🚗 자동차 계기판처럼, 현재 속도, 연료량, 기어 상태를 실시간으로 기억하고 표시하는 것',
      example: '좋아요 버튼을 눌렀을 때 하트 색깔이 바뀌는 것도 State가 바뀐 거예요',
      usage: 'const [count, setCount] = useState(0)'
    },
    {
      id: '4',
      term: 'CRUD',
      pronunciation: '크러드',
      korean: '생성/읽기/수정/삭제',
      level: 'beginner',
      category: 'backend',
      definition: '데이터를 만들고(Create), 보고(Read), 고치고(Update), 지우는(Delete) 4가지 기본 동작',
      analogy: '📋 고기집 예약 시스템처럼, 예약 등록(생성), 예약 확인(읽기), 시간 변경(수정), 예약 취소(삭제)',
      example: '인스타그램에서 사진 올리고, 보고, 수정하고, 삭제하는 모든 기능이 CRUD예요',
      usage: 'await prisma.user.create({ data: { name, email } })'
    },
    {
      id: '5',
      term: 'Component',
      pronunciation: '컴포넌트',
      korean: '부품',
      level: 'beginner',
      category: 'frontend',
      definition: '웹사이트를 만들 때 사용하는 재사용 가능한 작은 조각들',
      analogy: '🔧 자동차 부품처럼, 핸들, 타이어, 엔진을 조립해서 완성된 차를 만드는 것. 같은 부품을 여러 차에 재사용',
      example: '여러 페이지에서 똑같이 쓰이는 \"좋아요 버튼\"을 한 번만 만들어서 여러 곳에 붙일 수 있어요',
      usage: 'function Button({ children, onClick }) { return <button onClick={onClick}>{children}</button> }'
    },
    {
      id: '6',
      term: 'Middleware',
      pronunciation: '미들웨어',
      korean: '중간 처리기',
      level: 'intermediate',
      category: 'backend',
      definition: '요청이 들어올 때 중간에서 검사하거나 처리하는 프로그램',
      analogy: '🚪 호프집 입구 직원처럼, 손님이 들어오면 신분증 확인하고 미성년자는 막는 역할',
      example: '로그인 안 한 사람은 마이페이지 못 보게 막는 것',
      usage: 'export function middleware(request) { if (!request.cookies.token) return redirect("/login") }'
    },
    {
      id: '7',
      term: 'TypeScript',
      pronunciation: '타입스크립트',
      korean: '타입 있는 자바스크립트',
      level: 'intermediate',
      category: 'typescript',
      definition: '변수나 함수에 어떤 종류의 데이터가 들어갈지 미리 정해놓는 프로그래밍 언어',
      analogy: '🚗 자동차 주유구처럼, 휘발유 차에 경유 넣으려고 하면 \"잘못된 연료\" 경고 뜨는 것',
      example: 'age라는 변수에는 숫자만 넣을 수 있고, name에는 글자만 넣을 수 있게 정해놓기',
      usage: 'const user: { name: string; age: number } = { name: "철수", age: 25 }'
    },
    {
      id: '8',
      term: 'Props',
      pronunciation: '프랍스',
      korean: '속성',
      level: 'beginner',
      category: 'frontend',
      definition: '부모가 자식 컴포넌트한테 데이터를 전달하는 방법',
      analogy: '🍺 호프집 주문서처럼, \"테이블 5번, 생맥주 3잔, 양념치킨\" 정보를 주방에 전달',
      example: '<Button color="blue">클릭</Button> 여기서 color="blue"가 Props예요',
      usage: 'function Button({ color, size, children }) { return <button className={`${color} ${size}`}>{children}</button> }'
    },
    {
      id: '9',
      term: 'Hook',
      pronunciation: '훅',
      korean: '고리 함수',
      level: 'intermediate',
      category: 'frontend',
      definition: 'React에서 특별한 기능을 쓸 수 있게 해주는 마법 같은 함수들',
      analogy: '🔌 자동차 액세서리처럼, 블랙박스, 네비게이션 등 필요한 기능을 차에 연결해서 사용',
      example: 'useState로 숫자를 기억하고, useEffect로 화면이 뜨면 자동으로 뭔가 실행하기',
      usage: 'const [count, setCount] = useState(0); useEffect(() => { console.log(count) }, [count])'
    },
    {
      id: '10',
      term: 'REST API',
      pronunciation: '레스트 에이피아이',
      korean: 'REST 방식 인터페이스',
      level: 'intermediate',
      category: 'backend',
      definition: 'GET(가져오기), POST(만들기), PUT(수정), DELETE(삭제) 명령어로 데이터를 다루는 API 규칙',
      analogy: '🍴 고기집 주문 방식처럼, 주문하고(POST), 메뉴판 보고(GET), 추가 주문(PUT), 취소하는(DELETE) 정해진 방법',
      example: '인스타그램에서 사진 목록 보기(GET), 사진 올리기(POST), 수정(PUT), 삭제(DELETE)',
      usage: 'app.get("/api/users", async (req, res) => { const users = await db.user.findMany(); res.json(users) })'
    },
    {
      id: '11',
      term: 'Authentication',
      pronunciation: '어썬티케이션',
      korean: '인증',
      level: 'intermediate',
      category: 'security',
      definition: '\"당신이 정말 본인이 맞나요?\"를 확인하는 과정',
      analogy: '🔑 호프집 멤버십 카드처럼, 신분증 보여주고 본인 확인하는 과정',
      example: '아이디와 비밀번호를 입력해서 로그인하는 게 인증이에요',
      usage: 'const session = await getServerSession(); if (!session) redirect("/login")'
    },
    {
      id: '12',
      term: 'Authorization',
      pronunciation: '오써라이제이션',
      korean: '권한 부여',
      level: 'intermediate',
      category: 'security',
      definition: '\"이 사람이 이걸 할 수 있나요?\"를 확인하는 과정',
      analogy: '🚗 발렛파킹처럼, 키 있어도 주인만 차 가져갈 수 있는 것. 직원은 주차만 가능',
      example: '일반 유저는 글만 쓸 수 있고, 관리자만 글을 삭제할 수 있게 하는 것',
      usage: 'if (user.role !== "admin") return new Response("Unauthorized", { status: 403 })'
    },
    {
      id: '13',
      term: 'JWT',
      pronunciation: '제이더블유티',
      korean: '토큰',
      level: 'advanced',
      category: 'security',
      definition: '로그인 정보를 암호화한 출입증 같은 것',
      analogy: '🎫 호프집 스탬프 카드처럼, 한 번 찍으면 재입장할 때 다시 신분증 안 봐도 되는 출입증',
      example: '로그인하면 서버가 토큰을 주고, 이후 요청할 때마다 그 토큰을 보여주면 돼요',
      usage: 'const token = jwt.sign({ userId: user.id }, SECRET); res.setHeader("Authorization", `Bearer ${token}`)'
    },
    {
      id: '14',
      term: 'ORM',
      pronunciation: '오알엠',
      korean: '객체-DB 변환기',
      level: 'intermediate',
      category: 'database',
      definition: '어려운 데이터베이스 명령어를 쉬운 코드로 바꿔주는 도구',
      analogy: '🚗 자동차 내비게이션처럼, \"강남역\"이라고 말하면 복잡한 좌표로 자동 변환해주는 것',
      example: 'user.findAll() 이렇게만 쓰면 \"SELECT * FROM users\" 같은 복잡한 명령어로 자동 변환',
      usage: 'const users = await prisma.user.findMany({ where: { active: true } })'
    },
    {
      id: '15',
      term: 'SSR',
      pronunciation: '에스에스알',
      korean: '서버 렌더링',
      level: 'advanced',
      category: 'frontend',
      definition: '서버가 완성된 웹페이지를 만들어서 보내주는 방식',
      analogy: '🥩 고기집에서 이미 구워진 고기를 받는 것처럼, 완성된 페이지를 받아서 바로 보는 방식',
      example: '검색엔진(구글)이 페이지 내용을 바로 볼 수 있어서 검색 결과에 잘 나와요',
      usage: 'export async function generateMetadata() { const data = await fetchData(); return { title: data.title } }'
    },
    {
      id: '16',
      term: 'CSR',
      pronunciation: '씨에스알',
      korean: '클라이언트 렌더링',
      level: 'intermediate',
      category: 'frontend',
      definition: '브라우저가 받은 후에 화면을 만드는 방식',
      analogy: '🥩 고기집에서 생고기 받아서 테이블에서 직접 굽는 것처럼, 재료만 받아서 브라우저가 조리',
      example: '처음엔 빈 화면이 보이다가 로딩 후 내용이 나타나는 앱들',
      usage: 'const [data, setData] = useState(null); useEffect(() => { fetch("/api/data").then(r => r.json()).then(setData) }, [])'
    },
    {
      id: '17',
      term: 'Webhook',
      pronunciation: '웹훅',
      korean: '알림 연결',
      level: 'intermediate',
      category: 'backend',
      definition: '뭔가 일어나면 자동으로 다른 곳에 알려주는 시스템',
      analogy: '🔔 대리운전 앱처럼, 호출하면 자동으로 기사님에게 알림 가는 시스템',
      example: 'GitHub에 코드 올리면 자동으로 서버에 배포되게 하는 것',
      usage: 'app.post("/webhook/github", async (req, res) => { const event = req.body; await deployApp(); res.sendStatus(200) })'
    },
    {
      id: '18',
      term: 'Cache',
      pronunciation: '캐시',
      korean: '임시 저장소',
      level: 'intermediate',
      category: 'performance',
      definition: '자주 쓰는 데이터를 빠르게 꺼낼 수 있게 임시로 저장해두는 것',
      analogy: '🚗 자주 가는 길을 내비게이션이 기억해두는 것처럼, 빠른 경로를 저장해뒀다가 재사용',
      example: '한 번 봤던 웹사이트가 다음엔 더 빨리 뜨는 이유가 캐시 때문이에요',
      usage: 'export const revalidate = 3600; // Next.js에서 1시간마다 캐시 갱신'
    },
    {
      id: '19',
      term: 'Deployment',
      pronunciation: '디플로이먼트',
      korean: '배포',
      level: 'beginner',
      category: 'devops',
      definition: '만든 프로그램을 인터넷에 올려서 다른 사람들이 쓸 수 있게 하는 것',
      analogy: '🥩 새로 만든 고기집을 정식 오픈하는 것처럼, 웹사이트를 서버에 올려서 손님 받기 시작',
      example: '개발 끝나면 Vercel이나 Netlify 같은 곳에 올려서 친구들한테 링크 공유하기',
      usage: 'vercel --prod 또는 git push origin main (자동 배포 설정 시)'
    },
    {
      id: '20',
      term: 'Environment Variable',
      pronunciation: '인바이런먼트 베리어블',
      korean: '환경 변수',
      level: 'beginner',
      category: 'devops',
      definition: '비밀번호나 중요한 설정을 코드에 직접 안 쓰고 따로 보관하는 것',
      analogy: '🔐 차 키를 가방에 안 넣고 금고에 따로 보관하는 것처럼, 중요한 정보는 안전하게 숨김',
      example: 'API 키나 데이터베이스 비밀번호를 .env 파일에 저장해서 GitHub에 안 올리기',
      usage: 'const apiKey = process.env.NEXT_PUBLIC_API_KEY'
    },
    {
      id: '21',
      term: 'Responsive Design',
      pronunciation: '리스폰시브 디자인',
      korean: '반응형 디자인',
      level: 'beginner',
      category: 'frontend',
      definition: '화면 크기에 따라 자동으로 모양이 바뀌는 디자인',
      analogy: '🚗 자동차 사이드미러처럼, 운전자 체형에 맞춰 자동으로 각도 조절되는 것',
      example: '같은 웹사이트를 핸드폰에서 보면 세로로, 컴퓨터에서 보면 가로로 잘 보이는 것',
      usage: '<div className="w-full md:w-1/2 lg:w-1/3">...</div>'
    },
    {
      id: '22',
      term: 'Callback',
      pronunciation: '콜백',
      korean: '나중에 실행할 함수',
      level: 'beginner',
      category: 'javascript',
      definition: '\"이 일이 끝나면 이걸 해줘\"라고 미리 말해놓는 함수',
      analogy: '📞 대리운전 호출할 때 \"도착하면 전화주세요\" 번호 남기는 것처럼, 나중에 실행할 함수 지정',
      example: '버튼 클릭하면 뭘 할지 미리 정해놓기',
      usage: 'button.addEventListener("click", () => { console.log("클릭됨") })'
    },
    {
      id: '23',
      term: 'Promise',
      pronunciation: '프라미스',
      korean: '약속',
      level: 'intermediate',
      category: 'javascript',
      definition: '\"나중에 데이터 줄게\" 하는 약속을 담은 객체',
      analogy: '🚗 대리운전 예약처럼, 아직 안 왔지만 \"출발\", \"도착\" 상태를 실시간으로 확인 가능',
      example: '서버에서 데이터 가져오는 중... 성공하면 then, 실패하면 catch',
      usage: 'fetch("/api/data").then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err))'
    },
    {
      id: '24',
      term: 'GraphQL',
      pronunciation: '그래프큐엘',
      korean: '유연한 API 언어',
      level: 'advanced',
      category: 'backend',
      definition: '내가 원하는 데이터만 정확히 요청할 수 있는 방식',
      analogy: '🥩 고기집에서 \"삼겹살 200g, 된장찌개만\" 주문하면 딱 그것만 나오는 것처럼 필요한 것만 요청',
      example: 'REST는 전체 유저 정보를 다 주지만, GraphQL은 이름만 달라고 하면 이름만 줘요',
      usage: 'query { user(id: "1") { name email posts { title } } }'
    },
    {
      id: '25',
      term: 'Docker',
      pronunciation: '도커',
      korean: '컨테이너 도구',
      level: 'advanced',
      category: 'devops',
      definition: '프로그램을 상자에 담아서 어디서든 똑같이 실행되게 하는 도구',
      analogy: '🚗 자동차를 컨테이너에 실으면 어느 나라에서도 똑같이 운전 가능한 것처럼 프로그램 포장',
      example: '내 컴퓨터에서 되던 프로그램이 친구 컴퓨터에선 안 될 때, 도커로 포장하면 어디서든 작동해요',
      usage: 'docker build -t myapp . && docker run -p 3000:3000 myapp'
    },
    {
      id: '26',
      term: 'Git',
      pronunciation: '깃',
      korean: '버전 관리',
      level: 'beginner',
      category: 'devops',
      definition: '코드의 변경 기록을 저장하고 관리하는 도구',
      analogy: '🚗 블랙박스처럼, 사고 났을 때 과거 영상 확인하듯 코드 변경 기록을 저장하고 복구 가능',
      example: '실수로 코드 망쳤을 때 어제 버전으로 되돌리기, 친구랑 협업할 때 코드 합치기',
      usage: 'git add . && git commit -m "feat: 새 기능 추가" && git push origin main'
    },
    {
      id: '27',
      term: 'Closure',
      pronunciation: '클로저',
      korean: '기억하는 함수',
      level: 'advanced',
      category: 'javascript',
      definition: '함수가 만들어진 곳의 변수를 계속 기억하는 것',
      analogy: '🍺 호프집 단골 손님처럼, \"저번에 드셨던 그 메뉴요?\" 하고 기억하는 것. 함수가 외부 변수 기억',
      example: '비밀번호를 함수 안에 숨겨놓고, 그 함수만 비밀번호를 알 수 있게 하기',
      usage: 'function outer() { const count = 0; return function inner() { return count + 1 } }'
    },
    {
      id: '28',
      term: 'Debounce',
      pronunciation: '디바운스',
      korean: '멈출 때 실행',
      level: 'intermediate',
      category: 'performance',
      definition: '연타를 막고 마지막 한 번만 실행하는 기법',
      analogy: '🚗 주차장 차단기처럼, 차가 계속 지나가도 완전히 빠져나간 후에만 문 내리는 것',
      example: '검색창에 글자 입력할 때마다 검색하지 않고, 입력 멈추면 그때 검색하기',
      usage: 'const debouncedSearch = debounce((query) => fetchResults(query), 500)'
    },
    {
      id: '29',
      term: 'Throttle',
      pronunciation: '쓰로틀',
      korean: '주기적 실행',
      level: 'intermediate',
      category: 'performance',
      definition: '일정 시간마다 한 번씩만 실행하는 기법',
      analogy: '🚦 신호등처럼, 차가 아무리 많이 와도 정해진 시간 간격으로만 신호 바뀌는 것',
      example: '스크롤할 때 매번 체크하지 않고 0.1초마다 한 번씩만 체크하기',
      usage: 'const throttledScroll = throttle(() => handleScroll(), 100)'
    },
    {
      id: '30',
      term: 'Lazy Loading',
      pronunciation: '레이지 로딩',
      korean: '늦게 불러오기',
      level: 'intermediate',
      category: 'performance',
      definition: '필요할 때만 데이터나 이미지를 불러오는 기법',
      analogy: '🥩 뷔페 고기집처럼, 처음부터 모든 고기 안 가져오고 먹을 만큼만 계속 가져오는 것',
      example: '스크롤 내리면 그때 사진이 나타나는 인스타그램',
      usage: 'const LazyComponent = lazy(() => import("./HeavyComponent")); <Suspense fallback={<Loading />}><LazyComponent /></Suspense>'
    }
  ]

  const filteredVocabs = vocabs.filter(vocab => {
    const matchesSearch = search === '' ||
      vocab.term.toLowerCase().includes(search.toLowerCase()) ||
      vocab.korean.includes(search) ||
      vocab.definition.includes(search)
    const matchesLevel = levelFilter === 'all' || vocab.level === levelFilter
    const matchesCategory = categoryFilter === 'all' || vocab.category === categoryFilter

    return matchesSearch && matchesLevel && matchesCategory
  })

  const levelLabels = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 검색 & 필터 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="단어 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 난이도</option>
          <option value="beginner">초급</option>
          <option value="intermediate">중급</option>
          <option value="advanced">고급</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 카테고리</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="database">Database</option>
          <option value="security">Security</option>
          <option value="performance">Performance</option>
          <option value="devops">DevOps</option>
        </select>
      </div>

      {/* 단어 카드 목록 */}
      <div className="grid gap-2 sm:gap-3">
        {filteredVocabs.map(vocab => (
          <div key={vocab.id} className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 hover:border-blue-400 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-baseline gap-1 mb-0.5">
                  <h3 className="text-sm sm:text-lg font-bold text-blue-700">{vocab.term}</h3>
                  <span className="text-xs sm:text-sm text-gray-500 font-mono">({vocab.pronunciation})</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-600 font-medium mb-1">{vocab.korean}</p>
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-sm rounded">
                    {levelLabels[vocab.level as keyof typeof levelLabels]}
                  </span>
                  <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-700 text-sm rounded">
                    {vocab.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="bg-white border-l-2 border-blue-400 p-1.5 sm:p-2 rounded">
                <p className="font-semibold text-blue-700 mb-0.5 text-xs sm:text-sm">📖 정의</p>
                <p className="text-gray-900 text-xs sm:text-sm">{vocab.definition}</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-2 border-orange-400 p-1.5 sm:p-2 rounded">
                <p className="font-semibold text-orange-700 mb-0.5 text-xs sm:text-sm">🎯 실생활 비유</p>
                <p className="text-gray-900 text-xs sm:text-sm">{vocab.analogy}</p>
              </div>

              <div className="bg-white border-l-2 border-green-400 p-1.5 sm:p-2 rounded">
                <p className="font-semibold text-green-700 mb-0.5 text-xs sm:text-sm">💡 실제 예시</p>
                <p className="text-gray-900 text-xs sm:text-sm">{vocab.example}</p>
              </div>

              <div className="bg-gray-50 p-1.5 sm:p-2 rounded">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">💻 코드 예시</p>
                  <CopyButton text={vocab.usage} />
                </div>
                <pre className="text-xs sm:text-sm overflow-x-auto bg-gray-900 text-white p-1.5 rounded">
                  <code>{vocab.usage}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVocabs.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
          검색 결과가 없습니다
        </div>
      )}

      <div className="text-center text-sm text-gray-500 pt-4">
        총 {filteredVocabs.length}개의 용어
      </div>
    </div>
  )
}

// 퀴즈 탭
function QuizTab() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const quizData = [
    {
      question: 'API는 무엇의 약자인가요?',
      options: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Process Instruction', 'Application Process Interface'],
      correct: 'Application Programming Interface'
    },
    {
      question: '비동기 처리를 위해 사용하는 JavaScript 키워드는?',
      options: ['async/await', 'sync/wait', 'defer/await', 'wait/async'],
      correct: 'async/await'
    },
    {
      question: 'CRUD에서 R은 무엇을 의미하나요?',
      options: ['Read', 'Run', 'Restore', 'Reset'],
      correct: 'Read'
    },
    {
      question: 'React에서 상태를 관리하는 Hook은?',
      options: ['useState', 'useData', 'useStore', 'useVariable'],
      correct: 'useState'
    },
    {
      question: 'SSR은 무엇의 약자인가요?',
      options: ['Server-Side Rendering', 'Static Site Rendering', 'Single Source Rendering', 'Server Script Running'],
      correct: 'Server-Side Rendering'
    }
  ]

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    if (answer === quizData[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion + 1 < quizData.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
      }
    }, 1000)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
  }

  if (showResult) {
    return (
      <div className="text-center space-y-6 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">퀴즈 완료!</h2>
        <div className="text-4xl sm:text-6xl font-bold text-blue-700">
          {score} / {quizData.length}
        </div>
        <p className="text-lg sm:text-xl text-gray-600">
          {score === quizData.length && '완벽합니다! 🎉'}
          {score >= quizData.length * 0.7 && score < quizData.length && '잘했어요! 👏'}
          {score < quizData.length * 0.7 && '조금 더 공부해보세요! 📚'}
        </p>
        <button
          type="button"
          onClick={resetQuiz}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
        >
          다시 도전하기
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm sm:text-base text-gray-600">
          문제 {currentQuestion + 1} / {quizData.length}
        </div>
        <div className="text-sm sm:text-base font-bold text-blue-600">
          점수: {score}
        </div>
      </div>

      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          {quizData[currentQuestion].question}
        </h3>

        <div className="space-y-3">
          {quizData[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === quizData[currentQuestion].correct
            const showFeedback = selectedAnswer !== null

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-3 sm:p-4 rounded-lg font-medium transition-all ${
                  showFeedback && isCorrect
                    ? 'bg-green-500 text-white'
                    : showFeedback && isSelected && !isCorrect
                    ? 'bg-red-500 text-white'
                    : 'bg-white hover:bg-blue-100 text-gray-900'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-center text-xs sm:text-sm text-gray-500">
        정답을 선택하면 자동으로 다음 문제로 넘어갑니다
      </div>
    </div>
  )
}
