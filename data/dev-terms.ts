import { DevTerm } from '@/app/secret/dev-glossary/_lib/types';

export const DEV_TERMS: DevTerm[] = [
  {
    id: 'react',
    term: 'React',
    category: '기본용어',
    easyExplanation:
      '레고 블록처럼 UI를 조립하는 기술이에요. 버튼·카드 같은 조각을 모아 페이지를 만듭니다.',
    realExplanation:
      '컴포넌트 기반 UI 라이브러리로, 상태 변화에 따라 선언적으로 렌더링합니다.',
    exampleCode: `function Hello() {
  return <h1>Hello</h1>
}`
  },
  {
    id: 'api',
    term: 'API',
    category: '기본용어',
    easyExplanation:
      '식당 주문서처럼, 프론트가 백엔드에 "이 데이터 주세요!"라고 전달하는 통로예요.',
    realExplanation:
      'Application Programming Interface. 프로그램 간 상호작용 규약/인터페이스.',
  },
  {
    id: 'database',
    term: 'Database',
    category: '기본용어',
    easyExplanation:
      '도서관 책장처럼 정보를 정리해 보관하는 창고예요.',
    realExplanation:
      '구조화된 데이터를 저장·검색·관리하는 시스템(예: MySQL, PostgreSQL, Supabase).'
  },
  {
    id: 'migration',
    term: 'Migration',
    category: '기본용어',
    easyExplanation:
      '이삿짐 옮기기와 같아요. 데이터를 새 집(DB/서버)으로 옮기고 배치도 새로 맞춰요.',
    realExplanation:
      '기존 환경의 데이터/스키마/코드를 새로운 환경(서버/DB/버전)으로 이전하는 절차.',
    exampleCode: `# Prisma 예시
npx prisma migrate dev --name add_user_table`
  },
  {
    id: 'typescript',
    term: 'TypeScript',
    category: '기본용어',
    easyExplanation:
      'JavaScript에 타입 체크를 추가한 언어. 오타나 실수를 미리 잡아줘요.',
    realExplanation:
      'JavaScript의 슈퍼셋. 정적 타입 검사를 통해 런타임 에러를 줄이고 개발 생산성을 높입니다.',
    exampleCode: `interface User {
  name: string;
  age: number;
}

const user: User = { name: 'Kim', age: 30 };`
  },
  {
    id: 'nextjs',
    term: 'Next.js',
    category: '기본용어',
    easyExplanation:
      'React로 만든 웹사이트를 더 빠르고 SEO에 강하게 만들어주는 프레임워크예요.',
    realExplanation:
      'React 기반 풀스택 프레임워크. SSR, SSG, ISR 등 다양한 렌더링 방식 지원.',
    exampleCode: `// app/page.tsx
export default function Home() {
  return <h1>Welcome to Next.js!</h1>
}`
  },
  {
    id: 'git',
    term: 'Git',
    category: '기본용어',
    easyExplanation:
      '작업한 코드의 타임머신이에요. 언제든 과거로 돌아가거나 여러 버전을 관리할 수 있어요.',
    realExplanation:
      '분산 버전 관리 시스템. 코드 변경 이력을 추적하고 협업을 가능하게 합니다.',
    exampleCode: `git add .
git commit -m "feat: 새 기능 추가"
git push origin main`
  },
  {
    id: 'docker',
    term: 'Docker',
    category: '기본용어',
    easyExplanation:
      '앱을 컨테이너 상자에 담아 어디서든 똑같이 실행되게 해줘요.',
    realExplanation:
      '컨테이너 기반 가상화 플랫폼. 애플리케이션과 의존성을 패키징하여 일관된 환경 제공.',
    exampleCode: `# Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]`
  },
  {
    id: 'rest',
    term: 'REST API',
    category: '기본용어',
    easyExplanation:
      'URL 주소로 데이터를 주고받는 규칙이에요. GET은 가져오기, POST는 보내기 같은 식으로요.',
    realExplanation:
      'Representational State Transfer. HTTP 메서드를 사용한 아키텍처 스타일.',
    exampleCode: `// GET /api/users
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data));`
  },
  {
    id: 'graphql',
    term: 'GraphQL',
    category: '기본용어',
    easyExplanation:
      '필요한 데이터만 딱 골라서 요청할 수 있는 똑똑한 API예요.',
    realExplanation:
      'Facebook이 개발한 쿼리 언어. 클라이언트가 필요한 데이터만 요청 가능.',
    exampleCode: `query {
  user(id: "1") {
    name
    email
  }
}`
  },
  {
    id: 'redux',
    term: 'Redux',
    category: '기본용어',
    easyExplanation:
      '앱 전체의 상태를 한 곳에 모아 관리하는 창고예요.',
    realExplanation:
      '예측 가능한 상태 관리 라이브러리. 중앙 store에서 상태를 관리하고 action/reducer로 업데이트.',
    exampleCode: `const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
}`
  },
  {
    id: 'css',
    term: 'CSS',
    category: '기본용어',
    easyExplanation:
      '웹페이지의 옷과 화장이에요. 색상, 크기, 위치를 예쁘게 꾸며줍니다.',
    realExplanation:
      'Cascading Style Sheets. HTML 요소의 시각적 표현을 정의하는 스타일시트 언어.',
    exampleCode: `.button {
  background: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}`
  },
  {
    id: 'tailwind',
    term: 'Tailwind CSS',
    category: '기본용어',
    easyExplanation:
      'CSS를 클래스 이름으로 빠르게 작성할 수 있는 도구예요. "text-red-500" 이런 식으로요.',
    realExplanation:
      '유틸리티 우선 CSS 프레임워크. 미리 정의된 클래스로 빠른 스타일링 가능.',
    exampleCode: `<button className="bg-blue-500 text-white px-4 py-2 rounded">
  클릭
</button>`
  },
  {
    id: 'webpack',
    term: 'Webpack',
    category: '기본용어',
    easyExplanation:
      '여러 파일을 하나로 묶어주는 짐 싸는 도구예요.',
    realExplanation:
      '모듈 번들러. JavaScript, CSS, 이미지 등을 번들링하고 최적화.',
  },
  {
    id: 'npm',
    term: 'npm',
    category: '기본용어',
    easyExplanation:
      '다른 사람이 만든 코드(패키지)를 쉽게 다운받아 쓸 수 있는 마켓이에요.',
    realExplanation:
      'Node Package Manager. JavaScript 패키지 관리 도구.',
    exampleCode: `npm install react
npm run dev`
  },
  {
    id: 'jwt',
    term: 'JWT',
    category: '기본용어',
    easyExplanation:
      '신분증처럼, 사용자가 누군지 증명하는 토큰이에요.',
    realExplanation:
      'JSON Web Token. 클레임 기반 인증 토큰. 서명되어 위변조 방지.',
    exampleCode: `// 토큰 생성
const token = jwt.sign({ userId: 123 }, 'secret', { expiresIn: '1h' });`
  },
  {
    id: 'cicd',
    term: 'CI/CD',
    category: '기본용어',
    easyExplanation:
      '코드를 자동으로 테스트하고 배포까지 해주는 자동화 시스템이에요.',
    realExplanation:
      'Continuous Integration / Continuous Deployment. 자동화된 빌드, 테스트, 배포 파이프라인.',
  },
  {
    id: 'kubernetes',
    term: 'Kubernetes',
    category: '기본용어',
    easyExplanation:
      '여러 컨테이너를 자동으로 관리하고 배치하는 오케스트라 지휘자예요.',
    realExplanation:
      '컨테이너 오케스트레이션 플랫폼. 자동 배포, 스케일링, 관리 기능 제공.',
  },
  {
    id: 'mongodb',
    term: 'MongoDB',
    category: '기본용어',
    easyExplanation:
      'JSON처럼 자유로운 형식으로 데이터를 저장하는 DB예요.',
    realExplanation:
      'NoSQL 문서 지향 데이터베이스. 유연한 스키마와 확장성이 특징.',
    exampleCode: `// 데이터 삽입
db.users.insertOne({
  name: 'Kim',
  age: 30,
  hobbies: ['coding', 'reading']
});`
  },
  {
    id: 'oauth',
    term: 'OAuth',
    category: '기본용어',
    easyExplanation:
      '"구글 계정으로 로그인" 같은 기능이에요. 비밀번호 안 줘도 로그인 가능.',
    realExplanation:
      '인증 및 권한 부여 프로토콜. 제3자 애플리케이션에 안전하게 접근 권한 부여.',
  }
];

