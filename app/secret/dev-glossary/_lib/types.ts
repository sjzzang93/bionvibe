export interface DevTerm {
  id: string;
  term: string;           // "React" 또는 "Flutter"
  korean?: string;        // 한글명 (선택)
  category: string;       // "Frontend", "Flutter" 등
  languages?: string[];   // 주로 사용되는 언어들
  programs?: string[];    // 주로 사용되는 프로그램/도구들
  
  // 쉬운 설명 (초등학생용)
  easyExplanation?: string;       // 레거시: 쉬운 비유 설명
  simpleExplanation?: string;     // Flutter 용어: 쉬운 비유 설명
  usedForSimple?: string;         // Flutter 용어: 간단 사용처
  
  // 일반 설명 (개발자용)
  realExplanation?: string;       // 레거시: 실제 기술 정의
  generalExplanation?: string;    // Flutter 용어: 전문적 설명
  usedForReal?: string;           // Flutter 용어: 실제 사용처
  
  // 예시 및 관련 용어
  exampleCode?: string;           // 레거시: 짧은 코드 예시
  example?: string;               // Flutter 용어: 사용 예시
  relatedTerms?: string[];        // 관련 용어들
}

