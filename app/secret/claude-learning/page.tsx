'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Card {
  title: string;
  content: string;
}

const cards: Card[] = [
  {
    title: "Claude Code (클로드 코드)",
    content: "식당 종업원 로봇이에요||식당에서 주문 받고, 음식 가져다주고, 계산하는 걸 도와주는 똑똑한 로봇이에요.||VS Code에서 실행되는 AI 코딩 어시스턴트. 파일 읽기, 편집, 검색, Git 등 다양한 도구를 사용합니다.||레스토랑에서 로봇이 주문받고 음식 서빙하기||코드 작성, 버그 수정, 파일 편집, Git 커밋, 문서 작성 자동화"
  },
  {
    title: "Tool (툴)",
    content: "식당 도구들이에요||요리사가 쓰는 칼, 프라이팬, 냄비처럼 Claude가 쓰는 도구들이에요.||Claude Code가 작업을 수행하기 위해 사용하는 기능 단위. Read, Write, Edit, Bash 등이 있습니다.||칼로 자르기, 프라이팬으로 볶기, 냄비로 끓이기||Read로 파일 읽기, Edit로 코드 수정, Bash로 명령어 실행"
  },
  {
    title: "Read Tool (리드 툴)",
    content: "메뉴판 보기예요||손님이 식당 메뉴판 보듯이, 파일 내용을 읽어보는 도구예요.||파일의 내용을 읽는 도구. 절대 경로로 파일을 지정하고, offset/limit으로 범위를 조절합니다.||메뉴판에서 피자 메뉴 찾아보기||app/page.tsx 파일 읽기, package.json 확인, 이미지 파일 보기"
  },
  {
    title: "Write Tool (라이트 툴)",
    content: "새 메뉴판 만들기예요||식당에서 새로운 메뉴판을 처음부터 만드는 거예요.||새 파일을 생성하거나 기존 파일을 완전히 덮어쓰는 도구입니다.||새로운 메뉴표 종이에 처음부터 적기||새 컴포넌트 파일 생성, 설정 파일 만들기, README 작성"
  },
  {
    title: "Edit Tool (에딧 툴)",
    content: "주문 수정하기예요||고깃집에서 '삼겹살 2인분'을 '삼겹살 3인분'으로 바꾸듯이, 파일 일부만 고쳐요.||파일의 특정 부분만 정확하게 수정하는 도구. old_string과 new_string을 사용합니다.||주문서에서 2인분을 3인분으로 고치기||변수명 변경, 버그 수정, 함수 수정, 텍스트 교체"
  },
  {
    title: "Glob Tool (글롭 툴)",
    content: "메뉴 카테고리 찾기예요||'고기 메뉴만 보여줘', '디저트만 보여줘'처럼 종류별로 찾는 거예요.||파일 이름 패턴으로 파일을 검색하는 도구. **/*.js 같은 패턴을 사용합니다.||메뉴판에서 '피자' 들어간 메뉴만 찾기||모든 .tsx 파일 찾기 (**/*.tsx), test 파일 검색"
  },
  {
    title: "Grep Tool (그랩 툴)",
    content: "메뉴 검색하기예요||메뉴판에서 '치즈'라는 단어 들어간 음식 다 찾듯이, 파일 내용을 검색해요.||파일 내용에서 특정 텍스트나 패턴을 검색하는 도구. 정규표현식을 지원합니다.||메뉴에서 '매운' 들어간 음식 모두 찾기||함수 이름 검색, import 구문 찾기, TODO 주석 검색"
  },
  {
    title: "Bash Tool (배쉬 툴)",
    content: "식당 주방장에게 요청하기예요||'불 좀 세게 해주세요'처럼 주방장한테 명령하듯이, 컴퓨터에 명령해요.||터미널 명령어를 실행하는 도구. npm, git, 파일 조작 등을 수행합니다.||주방에 '불 세게', '타이머 5분' 요청하기||npm install, git commit, 서버 실행 (npm run dev)"
  },
  {
    title: "MCP (엠씨피)",
    content: "식당 주문 시스템이에요||손님 주문을 주방에 전달하는 시스템처럼, AI와 도구를 연결하는 규칙이에요.||Model Context Protocol. AI가 외부 도구와 통신하기 위한 표준 프로토콜입니다.||주문 태블릿으로 주방에 주문 전달하기||Claude Desktop 도구 연결, 외부 API 통합, 데이터베이스 연동"
  },
  {
    title: "Agent (에이전트)",
    content: "알아서 일하는 웨이터예요||손님이 물 필요하면 알아서 가져다주듯이, 스스로 판단해서 일하는 AI예요.||자율적으로 작업을 수행하는 특수 목적 AI. Explore, Plan, general-purpose 등이 있습니다.||웨이터가 빈 접시 보고 알아서 치워주기||코드베이스 탐색, 복잡한 작업 자동 수행, 멀티스텝 작업"
  },
  {
    title: "절대 경로 (Absolute Path)",
    content: "식당 전체 주소예요||'서울시 강남구 테헤란로 427 삼겹살집'처럼 처음부터 끝까지 전체 주소예요.||파일 시스템의 루트(/)부터 시작하는 전체 경로. /Users/name/Desktop/file.txt||우리집 주소: 서울시 강남구 역삼동 123-45||/Users/fire/Desktop/bionvibe2/app/page.tsx"
  },
  {
    title: "상대 경로 (Relative Path)",
    content: "식당에서 화장실 위치예요||'여기서 왼쪽으로 가면 화장실'처럼 지금 위치 기준으로 설명하는 거예요.||현재 위치를 기준으로 한 상대적인 경로. ./는 현재, ../는 상위 폴더||지금 있는 테이블 기준으로 '왼쪽 3번째 테이블'||./components/Header.tsx, ../utils/helpers.ts"
  },
  {
    title: "Line Number (라인 넘버)",
    content: "메뉴판 번호예요||메뉴판에 '1. 피자, 2. 파스타'처럼 번호 붙은 거예요.||파일에서 각 줄에 붙는 번호. 1번부터 시작합니다.||메뉴판 1번 피자, 5번 스테이크||page.tsx:42 (42번 줄), 에러 발생 위치 표시"
  },
  {
    title: "Offset & Limit (오프셋 앤 리밋)",
    content: "메뉴 일부만 보기예요||메뉴판 10페이지부터 20페이지까지만 보는 거예요.||파일을 읽을 때 시작 위치(offset)와 줄 수(limit)를 지정합니다.||메뉴판 5번부터 10개 메뉴만 보기||큰 파일 읽을 때 offset=100, limit=50 (100번 줄부터 50줄)"
  },
  {
    title: "Pattern Matching (패턴 매칭)",
    content: "비슷한 메뉴 찾기예요||'피자'로 시작하는 메뉴 다 찾기, '불고기'로 끝나는 메뉴 찾기||특정 패턴에 맞는 파일이나 텍스트를 찾는 것. 와일드카드(*)를 사용합니다.||'매운' 들어간 메뉴 전부, '세트' 들어간 메뉴 전부||*.test.ts (테스트 파일 전부), use*.ts (use로 시작하는 파일)"
  },
  {
    title: "정규표현식 (Regex)",
    content: "복잡한 메뉴 검색 규칙이에요||'매운맛 + 고기류 + 2인분 이상'처럼 여러 조건 한번에 검색하는 거예요.||복잡한 패턴을 표현하는 특수 문자열. ^, $, *, +, [] 등을 사용합니다.||'고기 들어가고, 맵고, 2만원 이하' 조건 한번에 검색||/function\\s+\\w+/ (함수 찾기), /\\d{3}-\\d{4}/ (전화번호)"
  },
  {
    title: "File Glob (파일 글롭)",
    content: "메뉴 카테고리 필터예요||'전체 / 한식 / 중식 / 일식' 카테고리로 메뉴 필터링하는 거예요.||파일 이름 패턴. **는 모든 폴더, *는 모든 파일을 의미합니다.||한식 카테고리만 보기, 디저트 카테고리만 보기||**/*.tsx (모든 tsx), app/**/*.ts (app 폴더 내 모든 ts)"
  },
  {
    title: "Content Search (컨텐츠 서치)",
    content: "메뉴 설명 검색이에요||메뉴 설명에서 '치즈', '매운맛' 같은 단어 찾는 거예요.||파일 내용에서 특정 텍스트를 검색. Grep 도구를 사용합니다.||메뉴 설명에서 '고소한' 단어 검색||코드에서 'useState' 검색, 주석에서 'TODO' 검색"
  },
  {
    title: "old_string/new_string",
    content: "주문 수정 전후예요||'삼겹살 2인분'을 '목살 3인분'으로 바꾸듯이, 이전 텍스트와 새 텍스트예요.||Edit 도구에서 사용. 바꿀 문자열(old)과 새로운 문자열(new)을 지정합니다.||주문서: 삼겹살 → 목살로 수정||old: const name, new: const userName (변수명 변경)"
  },
  {
    title: "replace_all (리플레이스 올)",
    content: "같은 메뉴 전부 바꾸기예요||메뉴판에서 '치즈피자' 나온 곳 전부 '고구마피자'로 바꾸기||Edit 도구에서 모든 일치하는 문자열을 한번에 교체하는 옵션입니다.||메뉴판 전체에서 '8,000원' 전부 '9,000원'으로||파일 전체에서 oldName을 newName으로 일괄 변경"
  },
  {
    title: "Git Commit (깃 커밋)",
    content: "영수증 발급이에요||식당에서 주문 끝나면 영수증 받듯이, 작업 끝나면 기록을 남기는 거예요.||코드 변경사항을 Git 히스토리에 저장하는 행위. 커밋 메시지와 함께 저장됩니다.||영수증에 '삼겹살 2인분, 소주 2병' 적기||git commit -m \"버튼 클릭 이벤트 추가\""
  },
  {
    title: "Commit Message (커밋 메시지)",
    content: "영수증 메모예요||영수증에 '맛있었어요', '다음엔 덜 맵게' 적듯이, 뭘 바꿨는지 메모하는 거예요.||Git 커밋에 붙이는 설명. 무엇을, 왜 바꿨는지 적습니다.||영수증 메모: '생일 축하 케이크 추가 요청'||\"로그인 버그 수정\", \"다크모드 토글 버튼 추가\""
  },
  {
    title: "Git Status (깃 스테이터스)",
    content: "주문 확인하기예요||'지금까지 뭐 주문했지?' 확인하듯이, 뭐가 바뀌었는지 확인하는 거예요.||현재 변경된 파일 목록을 보여주는 Git 명령어입니다.||주문 내역 확인: 삼겹살 2인분, 냉면 1개||git status로 수정된 파일, 새 파일, 삭제된 파일 확인"
  },
  {
    title: "Git Diff (깃 디프)",
    content: "주문 변경사항 비교예요||원래 주문 '2인분'에서 '3인분'으로 뭐가 바뀌었는지 비교하는 거예요.||변경 전후를 비교해서 보여주는 Git 명령어. +는 추가, -는 삭제입니다.||원래 주문(소주 1병) vs 바뀐 주문(소주 2병)||코드 변경사항 확인: -삭제된 줄, +추가된 줄"
  },
  {
    title: "Git Log (깃 로그)",
    content: "영수증 전체 내역이에요||지금까지 식당에서 받은 영수증 전부 모아둔 거예요.||과거 커밋 히스토리를 시간순으로 보여주는 Git 명령어입니다.||지난 달 식당 영수증 전부 확인||git log로 과거 커밋 메시지, 작성자, 날짜 확인"
  },
  {
    title: "Pull Request (풀 리퀘스트)",
    content: "요리사한테 메뉴 제안하기예요||'이 레시피 어때요?' 하고 요리사한테 검토 요청하는 거예요.||GitHub에서 코드 변경사항을 검토 요청하는 기능. 머지 전 리뷰를 받습니다.||새 메뉴 레시피 만들어서 주방장한테 확인받기||GitHub PR 생성, 코드 리뷰 요청, 승인 후 main에 병합"
  },
  {
    title: "gh CLI (깃허브 씨엘아이)",
    content: "식당 전화 주문이에요||전화로 '배달 주문이요' 하듯이, 명령어로 GitHub 조작하는 거예요.||터미널에서 GitHub를 제어하는 명령줄 도구. PR, Issue 등을 관리합니다.||전화로 배달 주문, 예약하기||gh pr create (PR 생성), gh issue list (이슈 목록)"
  },
  {
    title: "Heredoc (히어독)",
    content: "긴 주문서 작성법이에요||여러 음식을 한 번에 주문서에 적듯이, 여러 줄 텍스트를 한 번에 쓰는 방법이에요.||쉘에서 여러 줄 텍스트를 입력하는 방법. <<'EOF'로 시작합니다.||주문서에 여러 메뉴 한 번에 쭉 적기||git commit -m \"$(cat <<'EOF'...)"
  },
  {
    title: "Co-Authored-By (코어써드바이)",
    content: "공동 요리예요||두 요리사가 같이 만든 음식이라고 표시하는 거예요.||Git 커밋에 공동 작성자를 표시하는 방법입니다.||메뉴판에 '이 요리는 김셰프, 박셰프 공동 제작'||Co-Authored-By: Claude <noreply@anthropic.com>"
  },
  {
    title: "Pre-commit Hook (프리커밋 훅)",
    content: "주문 전 확인 알람이에요||주문하기 전에 '맵기 조절 안 하셨어요?' 확인해주는 거예요.||Git 커밋하기 전에 자동으로 실행되는 검사. 코드 포맷팅, 테스트 등을 수행합니다.||계산 전에 '포인트 적립 하셨어요?' 확인||커밋 전 자동 테스트 실행, 코드 포맷 검사"
  },
  {
    title: "Task Tool (태스크 툴)",
    content: "코스 요리 주문이에요||전채, 메인, 디저트를 한 번에 주문하면 순서대로 나오듯이, 복잡한 작업을 맡기는 거예요.||복잡한 작업을 자동으로 수행하는 전문 에이전트를 실행하는 도구입니다.||코스 요리 주문하면 순서대로 음식 나오기||코드베이스 탐색, 여러 파일 검색, 복잡한 리팩토링"
  },
  {
    title: "Subagent (서브에이전트)",
    content: "전문 요리사예요||파스타 전문, 스테이크 전문처럼 특정 요리만 잘하는 요리사예요.||특정 작업에 특화된 AI 에이전트. Explore, Plan 등이 있습니다.||초밥 전문 요리사, 디저트 전문 파티시에||Explore(탐색), Plan(계획), general-purpose(일반)"
  },
  {
    title: "Explore Agent (익스플로어 에이전트)",
    content: "메뉴 추천 직원이에요||'매운 거 좋아하세요?' 물어보고 메뉴 찾아주는 직원이에요.||코드베이스를 탐색하고 분석하는 전문 에이전트입니다.||손님 취향 물어보고 메뉴 추천해주기||코드 구조 파악, 관련 파일 찾기, 함수 위치 검색"
  },
  {
    title: "Plan Mode (플랜 모드)",
    content: "요리 순서 짜기예요||요리하기 전에 '먼저 물 끓이고, 그 다음 고기 굽고' 순서 정하는 거예요.||작업을 실행하기 전에 계획을 세우는 모드. 단계별로 어떻게 할지 정리합니다.||요리 레시피 순서대로 나열하기||1. 파일 찾기 → 2. 내용 확인 → 3. 수정 → 4. 테스트"
  },
  {
    title: "TodoWrite (투두라이트)",
    content: "주문 체크리스트예요||'삼겹살 ✓, 냉면 ✓, 소주 ⬜' 체크하듯이, 할 일 목록 관리하는 거예요.||작업 목록을 관리하는 도구. pending, in_progress, completed로 상태를 표시합니다.||주문 목록에서 나온 음식 체크하기||할 일 추가, 진행 중 표시, 완료 체크"
  },
  {
    title: "WebFetch (웹페치)",
    content: "배달 앱 보기예요||배달 앱에서 다른 식당 메뉴 보듯이, 웹페이지 내용 가져오는 거예요.||웹 URL의 내용을 가져와서 분석하는 도구입니다.||배달 앱에서 다른 식당 리뷰 읽기||공식 문서 확인, API 문서 읽기, 온라인 가이드 참조"
  },
  {
    title: "WebSearch (웹서치)",
    content: "맛집 검색하기예요||네이버에서 '강남 맛집' 검색하듯이, 인터넷에서 정보 찾는 거예요.||웹 검색을 수행하고 결과를 가져오는 도구입니다.||'우리 동네 삼겹살집' 검색하기||최신 라이브러리 검색, 에러 메시지 검색, 문서 찾기"
  },
  {
    title: "Context Window (컨텍스트 윈도우)",
    content: "식탁 크기예요||식탁이 작으면 음식 몇 개 밖에 못 올리듯이, 한 번에 볼 수 있는 정보량이에요.||AI가 한 번에 처리할 수 있는 정보의 양. 토큰 수로 측정됩니다.||작은 테이블에는 음식 3개만 올릴 수 있어요||200,000 토큰 = 약 15만 단어, 큰 파일 여러 개 처리 가능"
  },
  {
    title: "Token Budget (토큰 버짓)",
    content: "식사 예산이에요||2만원 예산으로 먹을 수 있는 음식 양이 정해진 것처럼, 쓸 수 있는 정보량이에요.||사용할 수 있는 최대 토큰 수. 예산을 초과하면 작업이 중단될 수 있습니다.||만원으로 먹을 수 있는 음식 양||200,000 토큰 예산, 남은 토큰 확인"
  },
  {
    title: "Thinking Mode (씽킹 모드)",
    content: "요리하기 전 생각하기예요||요리사가 '어떻게 만들지?' 생각하듯이, AI가 어떻게 할지 고민하는 거예요.||AI가 답변하기 전에 내부적으로 추론하는 과정. interleaved, auto 모드가 있습니다.||요리 전에 '순서가 뭐지?' 생각하기||복잡한 문제 해결 시 단계별 사고 과정 거치기"
  },
  {
    title: "Parallel Tool Calls (패러럴 툴 콜)",
    content: "여러 음식 동시 주문이에요||피자, 파스타, 샐러드를 한 번에 주문하면 동시에 만들어지듯이, 여러 작업 동시 수행이에요.||독립적인 여러 도구를 한 번에 호출하여 동시에 실행하는 것. 속도가 빨라집니다.||피자, 파스타, 샐러드 주문하면 동시에 조리||여러 파일 동시 읽기, 여러 검색 동시 실행"
  },
  {
    title: "Error Handling (에러 핸들링)",
    content: "주문 실수 대처예요||'피자 재료가 떨어졌어요' 하면 대체 메뉴 추천하듯이, 에러 나면 해결하는 거예요.||프로그램 실행 중 발생하는 오류를 처리하는 방법. try-catch를 사용합니다.||재료 떨어지면 비슷한 메뉴 추천||try-catch로 에러 잡기, 에러 메시지 표시, 대체 방법 실행"
  },
  {
    title: "Hydration Error (하이드레이션 에러)",
    content: "요리 모양 안 맞기예요||사진으로 본 피자랑 실제 나온 피자가 다를 때 생기는 문제예요.||서버에서 만든 HTML과 클라이언트에서 만든 HTML이 다를 때 발생하는 React 에러입니다.||메뉴판 사진과 실제 음식이 달라요||SSR/CSR 불일치, mounted 상태로 해결, localStorage 사용 시 주의"
  },
  {
    title: "SSR vs CSR",
    content: "주방 vs 테이블 조리예요||주방에서 다 만들어서 내오기(SSR) vs 테이블에서 손님이 직접 굽기(CSR)||Server-Side Rendering vs Client-Side Rendering. 서버에서 렌더링 vs 브라우저에서 렌더링||주방 조리(빠름, SEO 좋음) vs 테이블 조리(신선, 느림)||Next.js SSR (서버), React CSR (클라이언트)"
  },
  {
    title: "localStorage (로컬스토리지)",
    content: "단골 메모장이에요||단골손님 '김철수님은 맵게, 박영희님은 안 맵게' 메모해두듯이, 브라우저에 저장하는 거예요.||브라우저에 데이터를 영구 저장하는 공간. 새로고침해도 유지됩니다.||단골 손님 취향 메모장||로그인 정보, 테마 설정, 진행 상황 저장"
  },
  {
    title: "useState Hook (유즈스테이트 훅)",
    content: "주문 메모지예요||주문 받을 때마다 메모지에 적고, 바뀌면 다시 쓰듯이, 값을 저장하고 바꾸는 거예요.||React에서 상태 값을 관리하는 Hook. [값, 변경함수]를 반환합니다.||주문 메모: 삼겹살 2인분 → 3인분으로 수정||const [count, setCount] = useState(0)"
  },
  {
    title: "useEffect Hook (유즈이펙트 훅)",
    content: "타이머 알람이에요||'10분 후 불 끄기', '손님 오면 인사하기'처럼 특정 상황에 자동으로 하는 일이에요.||React에서 부수 효과를 처리하는 Hook. 컴포넌트 렌더링 후 실행됩니다.||타이머 맞춰서 요리 완성되면 벨 울리기||데이터 가져오기, 이벤트 리스너 등록, 타이머 설정"
  },
  {
    title: "Responsive Design (리스폰시브 디자인)",
    content: "접이식 식탁이에요||손님 많으면 테이블 크게, 적으면 작게 조절하듯이, 화면 크기에 맞춰 변하는 디자인이에요.||화면 크기에 따라 레이아웃이 자동으로 조절되는 디자인. 모바일/태블릿/PC 대응||큰 테이블, 중간 테이블, 작은 테이블 자동 조절||md:text-2xl (중간 화면), lg:text-3xl (큰 화면)"
  },
  {
    title: "Tailwind CSS (테일윈드 씨에스에스)",
    content: "조리 도구 세트예요||요리할 때 '간장 한 스푼', '설탕 한 꼬집'처럼 미리 정해진 양념 세트예요.||유틸리티 클래스 기반 CSS 프레임워크. 미리 만들어진 클래스를 조합합니다.||양념장 레시피: 간장 1, 설탕 2, 참기름 0.5||px-4 (좌우 여백), py-2 (상하 여백), text-xl (큰 글씨)"
  },
  {
    title: "TypeScript Interface (타입스크립트 인터페이스)",
    content: "메뉴 레시피 규칙이에요||'피자는 반드시 치즈, 토마토소스, 도우가 있어야 해'처럼 음식 재료 규칙이에요.||객체의 구조를 정의하는 타입. 어떤 속성이 있어야 하는지 명시합니다.||피자 레시피: 도우 필수, 치즈 필수, 토핑 선택||interface Card { title: string; content: string; }"
  },
  {
    title: "Terminal Integration (터미널 인티그레이션)",
    content: "식당 홀에서 바로 주문하기예요||별도 주문 앱 없이 테이블에서 직접 종업원한테 말하듯이, 터미널에서 바로 Claude 사용해요.||별도 IDE 없이 명령줄에서 직접 Claude Code 실행하고 대화하는 기능입니다.||매장에서 직접 주문 vs 배달앱 주문||SSH 원격 서버 작업, 기존 터미널 워크플로우, 스크립트 자동화"
  },
  {
    title: "Extended Thinking (익스텐디드 씽킹)",
    content: "요리사가 레시피 고민하기예요||복잡한 요리할 때 '어떤 순서로 만들지' 종이에 적으며 고민하듯이, 어려운 문제는 생각 과정을 보여줘요.||복잡한 문제에 대해 내부적으로 깊이 추론하는 기능. 최대 64,000 토큰까지 사고 가능합니다.||요리 순서를 종이에 단계별로 적기||알고리즘 설계, 대규모 리팩토링 계획, 수학 문제 풀이, 시스템 설계"
  },
  {
    title: "Rewind (리와인드)",
    content: "주문 취소하고 다시하기예요||'아, 이거 말고 저걸로 할걸' 싶을 때 주문 취소하고 다시 하듯이, 코드를 이전 시점으로 되돌려요.||코드와 대화를 과거 시점으로 복원하여 다른 방법을 시도할 수 있는 기능입니다.||주문 바꾸기, 다시 시작하기||잘못된 구현 되돌리기, 여러 해결책 탐색, 실험 후 원상복귀"
  },
  {
    title: "Slash Commands (슬래시 커맨즈)",
    content: "식당 단골 메뉴예요||'세트 1번이요'처럼 짧게 말하면 정해진 구성 나오듯이, /help, /clear 같은 단축 명령어예요.||'/' 문자로 시작하는 특수 명령어로 특정 작업을 빠르게 실행합니다.||세트 메뉴, 단골 메뉴 주문||/help (도움말), /clear (초기화), /model (모델 변경), /cost (비용 확인)"
  },
  {
    title: "Custom Slash Commands (커스텀 슬래시 커맨즈)",
    content: "나만의 단골 메뉴 만들기예요||자주 먹는 조합을 '나만의 세트'로 저장해두듯이, 자주 하는 작업을 명령어로 저장해요.||사용자가 정의한 슬래시 명령어. 자주 쓰는 프롬프트를 재사용합니다.||나만의 조합: 떡볶이+순대+튀김 세트||/review (코드 리뷰), /write-tests (테스트 작성), /document (문서화)"
  },
  {
    title: "Hooks (훅스)",
    content: "자동 서빙 로봇이에요||음식 나오면 자동으로 테이블에 가져다주듯이, 특정 일 생기면 자동으로 다른 일 실행해요.||특정 시점에 자동 실행되는 사용자 정의 명령어입니다.||음식 완성되면 자동으로 벨 울리기||파일 수정 후 자동 테스트, 커밋 전 자동 포매팅, 빌드 후 배포"
  },
  {
    title: "CLAUDE.md (클로드 닷 엠디)",
    content: "식당 운영 매뉴얼이에요||신입 직원한테 주는 '우리 가게 규칙' 책자처럼, 프로젝트 설명서예요.||프로젝트 루트의 마크다운 파일. Claude에게 프로젝트 구조와 규칙을 설명합니다.||가게 운영 매뉴얼, 신입 교육 자료||프로젝트 구조, 코딩 규칙, 배포 프로세스, 팀 워크플로우 문서화"
  },
  {
    title: "Plugin (플러그인)",
    content: "세트 메뉴 패키지예요||'파티 패키지'처럼 여러 음식을 한 번에 주문하듯이, 여러 기능을 한 번에 설치해요.||슬래시 명령어, 에이전트, MCP 서버 등을 한 번에 설치하는 확장 기능 패키지입니다.||파티 세트, 뷔페 패키지||PR 리뷰 플러그인, 보안 검사 플러그인, 풀스택 개발 플러그인"
  },
  {
    title: "Headless Mode (헤드리스 모드)",
    content: "무인 주문 키오스크예요||사람 없이 기계가 주문 받듯이, 사람 없이 Claude가 자동으로 작업해요.||사용자 상호작용 없이 자동 실행되는 모드. CI/CD, 자동화에 사용합니다.||무인 키오스크, 자동 배달 로봇||GitHub Actions 자동 리뷰, 빌드 파이프라인, 크론 작업"
  },
  {
    title: "Auto-accept Mode (오토 억셉트 모드)",
    content: "전권 위임이에요||'알아서 해주세요' 하고 맡기듯이, 모든 작업을 자동 허락하는 모드예요.||파일 편집이나 명령 실행 시 자동으로 승인하는 모드입니다.||오마카세(주방장 추천), 알아서 차려주세요||반복 리팩토링, 대규모 파일 편집, 장시간 개발 작업"
  },
  {
    title: "Output Styles (아웃풋 스타일즈)",
    content: "요리사 교체하기예요||한식 요리사, 양식 요리사, 중식 요리사처럼 전문가를 바꾸듯이, Claude 역할을 바꿔요.||시스템 프롬프트를 교체하여 다른 역할로 전환하는 기능입니다.||한식집, 양식집, 중식집으로 변신||소프트웨어 엔지니어, 데이터 과학자, DevOps 엔지니어 역할"
  },
  {
    title: "Message Queue (메시지 큐)",
    content: "주문 대기열이에요||여러 테이블 주문을 순서대로 처리하듯이, 여러 요청을 줄 세워서 처리해요.||여러 메시지를 순서대로 자동 처리하는 기능입니다.||주문 대기 번호표||여러 파일 수정 → 테스트 → 문서화 자동 진행"
  },
  {
    title: "Git Worktree (깃 워크트리)",
    content: "여러 주방 동시 운영이에요||한 식당에 한식 주방, 중식 주방 따로 있듯이, 하나 프로젝트에서 여러 작업 동시에 해요.||하나 저장소에서 여러 브랜치를 동시에 체크아웃하여 병렬 작업하는 Git 기능입니다.||여러 주방에서 동시 조리||프론트엔드와 백엔드 동시 개발, 긴급 수정과 기능 개발 병행"
  },
  {
    title: "Skills (스킬즈)",
    content: "레시피북이에요||'피자 만드는 법', '파스타 만드는 법' 레시피북처럼, 작업별 가이드가 담긴 파일이에요.||특정 작업(docx, pptx 등) 수행 모범 사례가 담긴 마크다운 파일 모음입니다.||요리책, 레시피 카드||Word 문서 생성, PowerPoint 프레젠테이션, Excel 스프레드시트"
  },
  {
    title: "Debugging (디버깅)",
    content: "요리 실패 원인 찾기예요||음식이 짜면 '소금을 너무 많이 넣었구나' 찾아내듯이, 코드 문제 원인을 찾아요.||프로그램 오류를 찾아 수정하는 과정입니다.||요리 실패 이유 찾기, 맛 조절||에러 메시지 분석, 코드 수정, 테스트 실행, 버그 수정"
  },
  {
    title: "Refactoring (리팩토링)",
    content: "주방 정리정돈이에요||요리는 똑같이 나오는데 주방을 깔끔하게 정리하듯이, 기능은 같은데 코드를 개선해요.||동작 유지하면서 코드 구조를 개선하는 과정입니다.||주방 배치 개선, 동선 정리||코드 중복 제거, 함수 분리, 변수명 개선, 복잡도 감소"
  },
  {
    title: "CI/CD (씨아이/씨디)",
    content: "자동 공장 라인이에요||재료 넣으면 자동으로 요리하고 포장해서 배달까지 하듯이, 코드가 자동으로 테스트되고 배포돼요.||코드를 자동으로 통합, 테스트, 배포하는 개발 방법론입니다.||자동 조리 기계, 자동 포장 배달||GitHub Actions, 자동 코드 검토, 자동 배포, 자동 테스트"
  },
  {
    title: "API (에이피아이)",
    content: "식당 전화 주문이에요||전화로 '짜장면 하나요' 하면 배달 오듯이, 프로그램끼리 정해진 방식으로 요청하고 받아요.||소프트웨어 간 정보를 주고받는 규칙과 방법의 집합입니다.||전화 주문, 배달 요청||Claude API로 챗봇 만들기, 데이터 분석, 자동화 스크립트"
  },
  {
    title: "Prompt Engineering (프롬프트 엔지니어링)",
    content: "정확하게 주문하기예요||'매운 거 빼고, 소스 많이, 따뜻하게'처럼 구체적으로 말하면 원하는 대로 나오듯이, AI한테 잘 물어보는 기술이에요.||AI로부터 원하는 결과를 얻기 위해 입력을 최적화하는 기술입니다.||상세한 주문, 취향 설명||명확한 지시, 예시 포함, 단계별 요청, 출력 형식 지정"
  },
  {
    title: "VS Code Extension (브이에스 코드 익스텐션)",
    content: "식당 테이블 벨이예요||테이블 벨 누르면 종업원 오듯이, 코드 편집기 안에서 버튼 누르면 Claude 나와요.||VS Code 편집기 내에서 Claude 사용하는 공식 확장 프로그램입니다.||테이블 호출 벨, 무선 호출기||편집기 내 코딩 지원, 시각적 코드 변경 검토, 초보자 친화적"
  },
  {
    title: "Permission Management (퍼미션 매니지먼트)",
    content: "주방 출입 허가증이에요||주방은 직원만 들어가듯이, 특정 작업만 허락하거나 모든 작업 허락할 수 있어요.||파일 편집, 명령 실행 시 사용자 승인을 관리하는 시스템입니다.||주방 출입 통제, VIP룸 허가||특정 도구만 자동 허용, 파괴적 명령 방지, 팀 정책 적용"
  },
  {
    title: "Think Tool (씽크 툴)",
    content: "중간 점검하기예요||요리하다가 '간 한 번 봐야지' 하고 맛보듯이, 작업 중간에 '잠깐, 확인 필요해'하고 멈춰요.||응답 생성 중에 멈춰서 추가로 생각하고 확인하는 도구입니다.||요리 중간 간 보기||긴 작업 체인, 다단계 대화, 외부 정보 처리 후 재평가"
  },
  {
    title: "Compact (컴팩트)",
    content: "주문 내역 요약하기예요||긴 주문 내역을 '치킨 2, 피자 1' 처럼 요약하듯이, 긴 대화를 핵심만 남겨요.||대화 이력을 요약하여 공간을 절약하는 기능입니다.||긴 주문서를 짧게 요약||긴 세션 유지, 토큰 비용 절감, 컨텍스트 윈도우 효율화"
  },
  {
    title: "Checkpoint (체크포인트)",
    content: "주문 저장하기예요||주문하다가 '여기까지 일단 저장'하고 나중에 이어서 하듯이, 중요한 시점을 저장해요.||코드와 대화 상태를 저장하여 나중에 복원할 수 있는 지점입니다.||주문서 임시 저장||실험적 변경 시도, 여러 방법 탐색, 실수 후 복구"
  },
  {
    title: "Baseline (베이스라인)",
    content: "원조 맛이예요||'원조 할머니 손맛'을 기준으로 얼마나 비슷한지 비교하듯이, 개선 전 기준점이에요.||성능, 품질을 비교하기 위한 기준이 되는 초기 상태입니다.||원조 맛, 기준 레시피||성능 벤치마크, 개선 효과 측정, A/B 테스트 비교 기준"
  }
];

export default function ClaudeLearningPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [currentFilter, setCurrentFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 비밀번호 검증
  useEffect(() => {
    const savedSession = localStorage.getItem("secret_session");
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;

      if (now - sessionData.timestamp < thirtyMinutes) {
        setUnlocked(true);
      } else {
        localStorage.removeItem("secret_session");
      }
    }
  }, []);

  const handleUnlock = async () => {
    try {
      const response = await fetch('/api/secret/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setUnlocked(true);
        localStorage.setItem(
          "secret_session",
          JSON.stringify({
            timestamp: Date.now(),
            token: data.token
          })
        );
      } else {
        alert("❌ " + (data.message || "비밀번호가 틀렸습니다!"));
        setPassword("");
      }
    } catch (error) {
      alert("❌ 인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error('Auth error:', error);
    }
  };

  // 필터링된 인덱스 계산
  const filteredIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < cards.length; i++) {
      if (currentFilter === 'all') {
        indices.push(i);
      } else if (currentFilter === 'completed' && completedCards.has(i)) {
        indices.push(i);
      } else if (currentFilter === 'incomplete' && !completedCards.has(i)) {
        indices.push(i);
      }
    }
    return indices.length > 0 ? indices : [0];
  }, [currentFilter, completedCards]);

  // 초기 로드
  useEffect(() => {
    if (!unlocked) return;
    setMounted(true);
    const savedTheme = localStorage.getItem('claude-learning-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const saved = localStorage.getItem('claude-learning-progress');
    if (saved) {
      try {
        const completed = JSON.parse(saved);
        setCompletedCards(new Set(completed));
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('claude-learning-progress', JSON.stringify([...completedCards]));
    }
  }, [completedCards, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('claude-learning-theme', theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [currentFilter]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const shuffleCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetProgress = () => {
    if (confirm('모든 학습 진행상황을 초기화하시겠습니까?')) {
      setCompletedCards(new Set());
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < filteredIndices.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const toggleComplete = () => {
    const actualIndex = filteredIndices[currentIndex];
    const newCompleted = new Set(completedCards);

    if (newCompleted.has(actualIndex)) {
      newCompleted.delete(actualIndex);
    } else {
      newCompleted.add(actualIndex);
    }

    setCompletedCards(newCompleted);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      switch(e.key) {
        case ' ':
          e.preventDefault();
          flipCard();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousCard();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextCard();
          break;
        case 'c':
        case 'C':
          toggleComplete();
          break;
      }
    };

    if (mounted) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [mounted, currentIndex, isFlipped, filteredIndices, completedCards]);

  const handleFilterChange = (filter: 'all' | 'completed' | 'incomplete') => {
    setCurrentFilter(filter);
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
              <div className="mb-4 text-7xl animate-pulse">🔐</div>
              <h1 className="mb-2 text-4xl font-extrabold text-white">Claude Code 완벽 가이드</h1>
              <p className="text-gray-300">비밀번호를 입력하세요</p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder="비밀번호 입력"
                className="w-full rounded-xl border-2 border-white/30 bg-white/20 px-4 py-3 text-center text-lg font-mono text-white placeholder-white/50 outline-none focus:border-purple-400"
                autoFocus
              />

              <button
                type="button"
                onClick={handleUnlock}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-lg font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50"
              >
                🔓 열기
              </button>

              <Link
                href="/secret"
                className="block text-center text-sm text-white/70 hover:text-white transition-colors"
              >
                ← Secret Vault로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F5F1EC] flex items-center justify-center">
        <div className="text-6xl animate-bounce">📚</div>
      </div>
    );
  }

  const actualIndex = filteredIndices[currentIndex] || 0;
  const currentCard = cards[actualIndex];
  const percentage = (completedCards.size / cards.length) * 100;

  const isDark = theme === 'dark';

  const [easyExplain, detailExplain, techExplain, kidUse, realUse] = currentCard.content.split('||');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1A1410] text-[#E8DFD6]' : 'bg-[#F5F1EC] text-[#3E2F1F]'}`}>
      <style jsx global>{`
        .card-3d {
          perspective: 1000px;
        }
        .card-inner {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-inner.flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      <header className={`sticky top-0 z-50 transition-colors ${isDark ? 'bg-[#2C2416]' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
          <div className="flex justify-between items-center flex-wrap gap-3 mb-3 md:mb-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/"
                className="text-2xl md:text-3xl hover:scale-110 transition-transform"
                title="비온바이브 홈으로"
              >
                🌧️
              </Link>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#D4A574]">Claude Code 완벽 가이드</h1>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={shuffleCards}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-transparent border-2 border-[#D4A574] text-[#D4A574] rounded-lg hover:bg-[#D4A574] hover:text-white transition-all font-medium"
              >
                🔀 섞기
              </button>
              <button
                onClick={resetProgress}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-transparent border-2 border-[#D4A574] text-[#D4A574] rounded-lg hover:bg-[#D4A574] hover:text-white transition-all font-medium"
              >
                ↻ 초기화
              </button>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#D4A574] text-white rounded-full hover:bg-[#B8895E] transition-all flex items-center justify-center text-lg md:text-xl"
                title="다크모드 전환"
              >
                🌓
              </button>
            </div>
          </div>

          <div className="mb-2 flex justify-between text-xs md:text-sm">
            <span className={isDark ? 'text-[#B8ADA0]' : 'text-[#6B5D4F]'}>
              카드 {currentIndex + 1} / {filteredIndices.length}
            </span>
            <span className={isDark ? 'text-[#B8ADA0]' : 'text-[#6B5D4F]'}>
              완료: {completedCards.size}개
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1A1410]' : 'bg-[#F5F1EC]'}`}>
            <div
              className="h-full bg-gradient-to-r from-[#D4A574] to-[#B8895E] transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <Link
          href="/secret"
          className="inline-flex items-center text-[#D4A574] hover:text-[#B8895E] mb-4 md:mb-6 transition-colors font-medium text-sm md:text-base"
        >
          ← Secret Vault로 돌아가기
        </Link>

        <div className="flex gap-2 justify-center mb-4 md:mb-6 flex-wrap">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base rounded-full border-2 transition-all font-medium ${
              currentFilter === 'all'
                ? 'bg-[#D4A574] text-white border-[#D4A574]'
                : 'bg-transparent text-[#D4A574] border-[#D4A574] hover:bg-[#D4A574] hover:text-white'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            className={`px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base rounded-full border-2 transition-all font-medium ${
              currentFilter === 'completed'
                ? 'bg-[#D4A574] text-white border-[#D4A574]'
                : 'bg-transparent text-[#D4A574] border-[#D4A574] hover:bg-[#D4A574] hover:text-white'
            }`}
          >
            완료
          </button>
          <button
            onClick={() => handleFilterChange('incomplete')}
            className={`px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base rounded-full border-2 transition-all font-medium ${
              currentFilter === 'incomplete'
                ? 'bg-[#D4A574] text-white border-[#D4A574]'
                : 'bg-transparent text-[#D4A574] border-[#D4A574] hover:bg-[#D4A574] hover:text-white'
            }`}
          >
            미완료
          </button>
        </div>

        <div className="card-3d min-h-[450px] md:min-h-[500px] flex items-center justify-center mb-6 md:mb-8">
          <div
            onClick={flipCard}
            className={`card-inner w-full max-w-3xl h-[450px] md:h-[500px] relative cursor-pointer ${isFlipped ? 'flipped' : ''}`}
          >
            <div
              className={`card-face absolute w-full h-full rounded-xl md:rounded-2xl p-6 md:p-12 flex flex-col justify-center items-center text-center shadow-2xl ${
                isDark ? 'bg-gradient-to-br from-[#2C2416] to-[#1A1410]' : 'bg-gradient-to-br from-white to-[#F5F1EC]'
              }`}
            >
              <div className={`absolute top-4 md:top-6 right-4 md:right-8 text-xs md:text-sm font-medium ${isDark ? 'text-[#B8ADA0]' : 'text-[#6B5D4F]'}`}>
                {currentIndex + 1} / {filteredIndices.length}
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#D4A574] mb-2 md:mb-4 leading-tight px-2">
                {currentCard.title}
              </h2>
              <p className={`text-sm md:text-base italic mt-4 md:mt-8 px-4 ${isDark ? 'text-[#B8ADA0]' : 'text-[#6B5D4F]'}`}>
                카드를 클릭하거나 <span className="hidden md:inline">스페이스바를 눌러</span> 뒤집기
              </p>
            </div>

            <div
              className={`card-face card-back absolute w-full h-full rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col justify-start items-start text-left shadow-2xl overflow-y-auto ${
                isDark ? 'bg-[#2C2416]' : 'bg-white'
              }`}
            >
              <div className={`absolute top-3 md:top-4 right-4 md:right-6 text-xs md:text-sm font-medium ${isDark ? 'text-[#B8ADA0]' : 'text-[#6B5D4F]'}`}>
                {currentIndex + 1} / {filteredIndices.length}
              </div>
              <div className="w-full space-y-3 md:space-y-4 mt-6 md:mt-8">
                <div className={`p-3 md:p-4 rounded-lg md:rounded-xl border-l-4 border-green-500 ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1.5 md:mb-2">🍴 식당/운전 비유</p>
                  <p className={`text-sm md:text-base font-medium ${isDark ? 'text-[#E8DFD6]' : 'text-[#3E2F1F]'}`}>
                    {easyExplain}
                  </p>
                </div>

                <div className={`p-3 md:p-4 rounded-lg md:rounded-xl border-l-4 border-blue-500 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1.5 md:mb-2">📝 쉬운 설명</p>
                  <p className={`text-xs md:text-sm ${isDark ? 'text-[#E8DFD6]' : 'text-[#3E2F1F]'}`}>
                    {detailExplain}
                  </p>
                </div>

                <div className={`p-3 md:p-4 rounded-lg md:rounded-xl border-l-4 border-[#D4A574] ${isDark ? 'bg-[#1A1410]' : 'bg-[#F5F1EC]'}`}>
                  <p className="text-xs font-bold text-[#D4A574] mb-1.5 md:mb-2">💻 전문 용어</p>
                  <p className={`text-xs ${isDark ? 'text-[#E8DFD6]' : 'text-[#3E2F1F]'}`}>
                    {techExplain}
                  </p>
                </div>

                <div className={`p-3 md:p-4 rounded-lg md:rounded-xl border-l-4 border-purple-500 ${isDark ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1.5 md:mb-2">🎮 초딩도 아는 예시</p>
                  <p className={`text-xs md:text-sm ${isDark ? 'text-[#E8DFD6]' : 'text-[#3E2F1F]'}`}>
                    {kidUse}
                  </p>
                </div>

                <div className={`p-3 md:p-4 rounded-lg md:rounded-xl border-l-4 border-orange-500 ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1.5 md:mb-2">🏢 실제 사용 사례</p>
                  <p className={`text-xs md:text-sm ${isDark ? 'text-[#E8DFD6]' : 'text-[#3E2F1F]'}`}>
                    {realUse}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8">
          <button
            onClick={previousCard}
            disabled={currentIndex === 0}
            className="px-6 md:px-8 py-3 md:py-3.5 bg-[#D4A574] text-white rounded-lg md:rounded-xl hover:bg-[#B8895E] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base md:text-lg"
          >
            ← 이전
          </button>

          <button
            onClick={toggleComplete}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full transition-all flex items-center justify-center ${
              completedCards.has(actualIndex)
                ? 'bg-[#D4A574] border-[#D4A574]'
                : 'bg-transparent border-[#D4A574] border-2'
            }`}
            title="완료 표시"
          >
            {completedCards.has(actualIndex) && (
              <span className="text-white text-xl md:text-2xl">✓</span>
            )}
          </button>

          <button
            onClick={nextCard}
            disabled={currentIndex === filteredIndices.length - 1}
            className="px-6 md:px-8 py-3 md:py-3.5 bg-[#D4A574] text-white rounded-lg md:rounded-xl hover:bg-[#B8895E] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base md:text-lg"
          >
            다음 →
          </button>
        </div>

        <div className={`hidden md:block text-center p-4 rounded-lg text-sm ${isDark ? 'bg-[#2C2416] text-[#B8ADA0]' : 'bg-white text-[#6B5D4F]'}`}>
          <kbd className={`inline-block px-2 py-1 rounded ${isDark ? 'bg-[#1A1410] border border-[#B8ADA0]' : 'bg-[#F5F1EC] border border-[#6B5D4F]'} font-mono mx-1 text-xs`}>←</kbd>
          이전 카드 |
          <kbd className={`inline-block px-2 py-1 rounded ${isDark ? 'bg-[#1A1410] border border-[#B8ADA0]' : 'bg-[#F5F1EC] border border-[#6B5D4F]'} font-mono mx-1 text-xs`}>→</kbd>
          다음 카드 |
          <kbd className={`inline-block px-2 py-1 rounded ${isDark ? 'bg-[#1A1410] border border-[#B8ADA0]' : 'bg-[#F5F1EC] border border-[#6B5D4F]'} font-mono mx-1 text-xs`}>Space</kbd>
          카드 뒤집기 |
          <kbd className={`inline-block px-2 py-1 rounded ${isDark ? 'bg-[#1A1410] border border-[#B8ADA0]' : 'bg-[#F5F1EC] border border-[#6B5D4F]'} font-mono mx-1 text-xs`}>C</kbd>
          완료 표시
        </div>
      </div>
    </div>
  );
}
