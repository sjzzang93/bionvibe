'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RelatedApps from '@/app/components/RelatedApps';

// 질문 인터페이스
interface Question {
  id: number;
  category: 'RAM' | 'CPU' | 'GPU' | 'Storage' | 'Network' | 'Battery' | 'Security' | 'System';
  question: string;
  area: string;
}

// 35개의 심도있는 질문들
const questions: Question[] = [
  // RAM (기억력/집중력) - 5문항
  { id: 1, category: 'RAM', area: '기억력', question: '중요한 약속이나 일정을 잘 기억하고 챙긴다' },
  { id: 2, category: 'RAM', area: '집중력', question: '한 가지 일에 오래 집중할 수 있다' },
  { id: 3, category: 'RAM', area: '정보처리', question: '여러 정보를 동시에 처리하는 것이 어렵지 않다' },
  { id: 4, category: 'RAM', area: '단기기억', question: '방금 들은 이야기나 본 내용을 잘 기억한다' },
  { id: 5, category: 'RAM', area: '멀티태스킹', question: '동시에 여러 작업을 효율적으로 처리할 수 있다' },

  // CPU (사고력/문제해결) - 5문항
  { id: 6, category: 'CPU', area: '논리적 사고', question: '문제를 논리적으로 분석하고 해결책을 찾는다' },
  { id: 7, category: 'CPU', area: '의사결정', question: '중요한 결정을 빠르고 명확하게 내릴 수 있다' },
  { id: 8, category: 'CPU', area: '분석력', question: '복잡한 상황을 단순화해서 이해할 수 있다' },
  { id: 9, category: 'CPU', area: '전략적 사고', question: '장기적인 계획을 세우고 실행하는 것이 자연스럽다' },
  { id: 10, category: 'CPU', area: '비판적 사고', question: '정보를 받아들일 때 비판적으로 검토한다' },

  // GPU (창의력/상상력) - 4문항
  { id: 11, category: 'GPU', area: '창의성', question: '새로운 아이디어를 자주 떠올린다' },
  { id: 12, category: 'GPU', area: '상상력', question: '추상적이거나 창의적인 것을 상상하는 것을 즐긴다' },
  { id: 13, category: 'GPU', area: '예술적 감각', question: '예술, 디자인, 음악 등에 관심이 많다' },
  { id: 14, category: 'GPU', area: '혁신성', question: '기존 방식보다 더 나은 새로운 방법을 시도한다' },

  // Storage (경험치/학습능력) - 5문항
  { id: 15, category: 'Storage', area: '학습능력', question: '새로운 것을 배우는 것이 즐겁고 빠르다' },
  { id: 16, category: 'Storage', area: '경험 활용', question: '과거 경험을 현재 상황에 잘 적용한다' },
  { id: 17, category: 'Storage', area: '지식 축적', question: '다양한 분야에 대한 지식이 풍부하다' },
  { id: 18, category: 'Storage', area: '장기기억', question: '오래전 일이나 배운 내용을 잘 기억한다' },
  { id: 19, category: 'Storage', area: '성장 마인드', question: '실패를 배움의 기회로 삼는다' },

  // Network (사회성/소통) - 5문항
  { id: 20, category: 'Network', area: '의사소통', question: '내 생각과 감정을 명확하게 전달할 수 있다' },
  { id: 21, category: 'Network', area: '공감능력', question: '다른 사람의 감정과 입장을 잘 이해한다' },
  { id: 22, category: 'Network', area: '대인관계', question: '다양한 사람들과 원만한 관계를 유지한다' },
  { id: 23, category: 'Network', area: '협업능력', question: '팀에서 협력하여 일하는 것이 편하다' },
  { id: 24, category: 'Network', area: '갈등해결', question: '갈등 상황을 원만하게 해결할 수 있다' },

  // Battery (에너지/체력) - 4문항
  { id: 25, category: 'Battery', area: '체력', question: '일상생활에 필요한 체력이 충분하다' },
  { id: 26, category: 'Battery', area: '에너지 관리', question: '피로를 잘 관리하고 에너지를 유지한다' },
  { id: 27, category: 'Battery', area: '활력', question: '하루를 시작할 때 활력이 넘친다' },
  { id: 28, category: 'Battery', area: '회복력', question: '피곤할 때 빨리 회복된다' },

  // Security (정서적 안정/자기관리) - 4문항
  { id: 29, category: 'Security', area: '정서적 안정', question: '감정 기복이 크지 않고 안정적이다' },
  { id: 30, category: 'Security', area: '스트레스 관리', question: '스트레스를 건강하게 해소하는 방법을 알고 있다' },
  { id: 31, category: 'Security', area: '자기조절', question: '충동적인 행동을 잘 조절할 수 있다' },
  { id: 32, category: 'Security', area: '자아존중감', question: '나 자신을 긍정적으로 생각한다' },

  // System (생활습관/일관성) - 3문항
  { id: 33, category: 'System', area: '생활 패턴', question: '규칙적인 생활 패턴을 유지한다' },
  { id: 34, category: 'System', area: '목표 달성', question: '세운 목표를 끝까지 완수하는 편이다' },
  { id: 35, category: 'System', area: '시간 관리', question: '시간을 효율적으로 관리하고 사용한다' },
];

// 버그 데이터베이스 (120개)
const bugDatabase = [
  // RAM 관련 버그 (15개)
  { category: 'RAM', severity: 'critical', name: '단기 메모리 누수', description: '방금 들은 이야기를 5분 뒤 기억 못함' },
  { category: 'RAM', severity: 'high', name: '집중력 타임아웃', description: '10분 이상 집중 시 강제 종료' },
  { category: 'RAM', severity: 'medium', name: '멀티태스킹 오버플로우', description: '2개 이상 작업 시 처리 지연' },
  { category: 'RAM', severity: 'high', name: '약속 캐시 삭제 버그', description: '중요한 약속이 자동으로 메모리에서 삭제됨' },
  { category: 'RAM', severity: 'low', name: '주의력 프래그먼테이션', description: '주의가 산만하게 분산됨' },
  { category: 'RAM', severity: 'critical', name: '작업 메모리 부족', description: '복잡한 생각 시 메모리 한계 도달' },
  { category: 'RAM', severity: 'medium', name: '정보 처리 지연', description: '새로운 정보 입력 시 버퍼링 발생' },
  { category: 'RAM', severity: 'high', name: '우선순위 큐 오류', description: '중요한 일과 사소한 일 구분 불가' },
  { category: 'RAM', severity: 'low', name: '주의력 디포커싱', description: '핸드폰만 보면 현실 작업이 백그라운드로' },
  { category: 'RAM', severity: 'medium', name: '집중 모드 미지원', description: '딥워크 기능이 설치되지 않음' },
  { category: 'RAM', severity: 'high', name: '이름 기억 실패', description: '사람 얼굴은 아는데 이름은 NULL' },
  { category: 'RAM', severity: 'critical', name: '방금 전 기억 404', description: '"아 뭐하려고 했더라?" 에러 빈발' },
  { category: 'RAM', severity: 'medium', name: '암기력 RAM 부족', description: '시험공부 내용이 메모리에 상주하지 않음' },
  { category: 'RAM', severity: 'low', name: '주의력 슬립모드', description: '지루한 대화 중 자동 절전' },
  { category: 'RAM', severity: 'high', name: '동시작업 크래시', description: '통화하면서 메모 불가능' },

  // CPU 관련 버그 (15개)
  { category: 'CPU', severity: 'critical', name: '결정 마비 프로세스', description: '선택지 3개 이상 시 무한 로딩' },
  { category: 'CPU', severity: 'high', name: '논리 회로 단락', description: '감정이 논리를 오버라이드함' },
  { category: 'CPU', severity: 'medium', name: '분석 성능 저하', description: '복잡한 문제 분석 시 과열' },
  { category: 'CPU', severity: 'critical', name: '우선순위 버그', description: '급한 일보다 쉬운 일을 먼저 처리' },
  { category: 'CPU', severity: 'high', name: '계획 컴파일 에러', description: '장기 계획이 런타임에서 실행 안됨' },
  { category: 'CPU', severity: 'low', name: '즉흥 모드 활성화', description: '계획보다 즉흥적 실행 우선' },
  { category: 'CPU', severity: 'medium', name: '사고 속도 저하', description: '생각 처리 속도 0.5x로 감소' },
  { category: 'CPU', severity: 'high', name: '판단력 오버클럭', description: '성급한 판단으로 인한 오작동' },
  { category: 'CPU', severity: 'critical', name: '문제해결 무한루프', description: '같은 문제를 반복적으로 고민' },
  { category: 'CPU', severity: 'medium', name: '전략적 사고 미설치', description: '장기적 관점 기능 없음' },
  { category: 'CPU', severity: 'low', name: '직관 프로세스 과다', description: '논리보다 감에 의존' },
  { category: 'CPU', severity: 'high', name: '의사결정 딜레이', description: '"나중에 생각해볼게" 무한 반복' },
  { category: 'CPU', severity: 'critical', name: '우유부단 알고리즘', description: '결정 후에도 계속 재검토' },
  { category: 'CPU', severity: 'medium', name: '비판적 사고 비활성화', description: '정보를 그대로 수용' },
  { category: 'CPU', severity: 'high', name: '계산 정확도 하락', description: '논리적 추론에 오류 빈발' },

  // GPU 관련 버그 (15개)
  { category: 'GPU', severity: 'high', name: '상상력 렌더링 실패', description: '창의적 아이디어 생성 불가' },
  { category: 'GPU', severity: 'medium', name: '창의성 드라이버 구버전', description: '2010년대 감성에서 멈춤' },
  { category: 'GPU', severity: 'low', name: '영감 파이프라인 막힘', description: '번뜩이는 아이디어가 안 떠오름' },
  { category: 'GPU', severity: 'critical', name: '디자인 센스 미설치', description: '미적 감각 모듈 누락' },
  { category: 'GPU', severity: 'high', name: '예술적 표현 손상', description: '감성을 창작물로 변환 불가' },
  { category: 'GPU', severity: 'medium', name: '혁신 알고리즘 오류', description: '기존 방식만 반복' },
  { category: 'GPU', severity: 'low', name: '시각화 성능 저하', description: '머릿속 이미지가 흐릿함' },
  { category: 'GPU', severity: 'high', name: '창의적 사고 블루스크린', description: '새로운 아이디어 요청 시 다운' },
  { category: 'GPU', severity: 'critical', name: '뮤즈 연결 끊김', description: '영감의 원천과 통신 두절' },
  { category: 'GPU', severity: 'medium', name: '예술 감상 필터 손상', description: '아름다움을 인식하지 못함' },
  { category: 'GPU', severity: 'low', name: '색채 감각 팔레트 제한', description: '감성 표현이 모노크롬' },
  { category: 'GPU', severity: 'high', name: '상상력 해상도 저하', description: '미래 비전이 720p' },
  { category: 'GPU', severity: 'critical', name: '창작 모드 접근 거부', description: '크리에이티브 권한 없음' },
  { category: 'GPU', severity: 'medium', name: '아이디어 프레임 드랍', description: '좋은 생각이 떠올라도 바로 증발' },
  { category: 'GPU', severity: 'high', name: '혁신 쉐이더 오류', description: '참신함 렌더링 실패' },

  // Storage 관련 버그 (15개)
  { category: 'Storage', severity: 'critical', name: '장기기억 디스크 조각화', description: '오래된 기억 로딩 속도 매우 느림' },
  { category: 'Storage', severity: 'high', name: '경험 인덱싱 실패', description: '과거 경험을 검색할 수 없음' },
  { category: 'Storage', severity: 'medium', name: '학습 저장소 가득 참', description: '새로운 지식 저장 공간 부족' },
  { category: 'Storage', severity: 'critical', name: '실수 로그 미저장', description: '같은 실수 반복 (학습 안됨)' },
  { category: 'Storage', severity: 'high', name: '지식 SSD 없음', description: 'HDD 속도로만 학습 (매우 느림)' },
  { category: 'Storage', severity: 'low', name: '추억 백업 손실', description: '중요한 추억이 랜덤 삭제' },
  { category: 'Storage', severity: 'medium', name: '경험치 누적 버그', description: '경험을 쌓아도 레벨업 안됨' },
  { category: 'Storage', severity: 'high', name: '스킬 저장 실패', description: '배운 스킬이 휘발성 메모리에 저장' },
  { category: 'Storage', severity: 'critical', name: '데이터 마이그레이션 오류', description: '배운 것을 실제로 적용 못함' },
  { category: 'Storage', severity: 'medium', name: '지식 파편화', description: '배운 것들이 연결되지 않음' },
  { category: 'Storage', severity: 'low', name: '학습 캐시 삭제', description: '시험 끝나면 내용 자동 삭제' },
  { category: 'Storage', severity: 'high', name: '독서 휘발성', description: '책 읽어도 3일 후 기억 0%' },
  { category: 'Storage', severity: 'critical', name: '역사 데이터 손상', description: '과거로부터 배우지 못함' },
  { category: 'Storage', severity: 'medium', name: '교훈 저장 실패', description: '인생 교훈이 저장 안됨' },
  { category: 'Storage', severity: 'high', name: '경험 검색 지연', description: '"예전에 이런 적 있는데..." 로딩 무한' },

  // Network 관련 버그 (15개)
  { category: 'Network', severity: 'critical', name: '공감 프로토콜 오류', description: '타인 감정 수신 불가' },
  { category: 'Network', severity: 'high', name: '소통 패킷 손실', description: '대화 중 내용 30% 유실' },
  { category: 'Network', severity: 'medium', name: '사회성 방화벽 과다', description: '새로운 관계 연결 차단' },
  { category: 'Network', severity: 'critical', name: '감정 전송 실패', description: '내 감정을 전달할 수 없음' },
  { category: 'Network', severity: 'high', name: '경청 모드 비활성화', description: '듣기보다 말하기만 실행됨' },
  { category: 'Network', severity: 'low', name: 'Wi-Fi 사회성', description: '연결이 불안정하고 자주 끊김' },
  { category: 'Network', severity: 'medium', name: '협업 동기화 실패', description: '팀워크 시 딜레이 발생' },
  { category: 'Network', severity: 'high', name: '갈등해결 404', description: '싸움 해결 방법을 찾을 수 없음' },
  { category: 'Network', severity: 'critical', name: '관계 유지 타임아웃', description: '연락 안 하면 관계 자동 만료' },
  { category: 'Network', severity: 'medium', name: '소셜 배터리 과방전', description: '사람 만나면 급속 충전 필요' },
  { category: 'Network', severity: 'low', name: '표현 압축 과다', description: '"ㅇㅇ" "ㄱㄱ" 등 최소 표현만' },
  { category: 'Network', severity: 'high', name: '눈치 센서 고장', description: '분위기 파악 불가' },
  { category: 'Network', severity: 'critical', name: '친밀도 게이지 손상', description: '관계 깊이 측정 불가' },
  { category: 'Network', severity: 'medium', name: '피드백 수신 거부', description: '조언이나 비판을 차단' },
  { category: 'Network', severity: 'high', name: 'DM 응답 지연', description: '카톡 확인 후 답장까지 3일' },

  // Battery 관련 버그 (15개)
  { category: 'Battery', severity: 'critical', name: '만성 배터리 부족', description: '항상 20% 이하 상태' },
  { category: 'Battery', severity: 'high', name: '고속 방전 모드', description: '오전에 충전 100%여도 오후 5%' },
  { category: 'Battery', severity: 'medium', name: '슬립모드 진입 실패', description: '밤에 잠이 안와서 방전' },
  { category: 'Battery', severity: 'critical', name: '회복 충전 불가', description: '쉬어도 에너지 회복 안됨' },
  { category: 'Battery', severity: 'high', name: '아침 부팅 실패', description: '기상 후 30분간 저전력 모드' },
  { category: 'Battery', severity: 'low', name: '에너지 누수', description: '아무것도 안 해도 배터리 소모' },
  { category: 'Battery', severity: 'medium', name: '절전모드 미작동', description: '피곤해도 쉬질 못함' },
  { category: 'Battery', severity: 'high', name: '과부하 경고 무시', description: '한계 넘어서도 계속 작동' },
  { category: 'Battery', severity: 'critical', name: '번아웃 프로텍션 없음', description: '과열 방지 장치 미설치' },
  { category: 'Battery', severity: 'medium', name: '체력 게이지 불량', description: '남은 에너지 확인 불가' },
  { category: 'Battery', severity: 'low', name: '카페인 의존성', description: '커피 없이는 부팅 불가' },
  { category: 'Battery', severity: 'high', name: '에너지 관리 AI 부재', description: '에너지 분배 최적화 안됨' },
  { category: 'Battery', severity: 'critical', name: '휴식 효율 0%', description: '쉬어도 회복 안되는 버그' },
  { category: 'Battery', severity: 'medium', name: '무선 충전 불가', description: '완전히 누워야만 충전됨' },
  { category: 'Battery', severity: 'high', name: '배터리 수명 단축', description: '20대 배터리가 이미 노후화' },

  // Security 관련 버그 (15개)
  { category: 'Security', severity: 'critical', name: '감정 방화벽 붕괴', description: '작은 일에도 감정 폭발' },
  { category: 'Security', severity: 'high', name: '스트레스 백신 만료', description: '스트레스에 무방비 노출' },
  { category: 'Security', severity: 'medium', name: '불안 바이러스 감염', description: '불안감이 시스템 전체에 확산' },
  { category: 'Security', severity: 'critical', name: '자아존중감 암호화 실패', description: '자존감이 평문 노출 상태' },
  { category: 'Security', severity: 'high', name: '우울 랜섬웨어', description: '긍정적 감정이 암호화됨' },
  { category: 'Security', severity: 'low', name: '감정 조절 패치 미적용', description: '감정 기복이 심함' },
  { category: 'Security', severity: 'medium', name: '충동 억제 실패', description: '즉흥 구매, 야식 등 통제 불가' },
  { category: 'Security', severity: 'high', name: '멘탈 SSL 인증서 만료', description: '정신 건강 보안 취약' },
  { category: 'Security', severity: 'critical', name: '번아웃 멀웨어', description: '동기부여가 강제 삭제됨' },
  { category: 'Security', severity: 'medium', name: '비교 트로이목마', description: 'SNS 볼 때마다 자존감 하락' },
  { category: 'Security', severity: 'low', name: '완벽주의 스파이웨어', description: '항상 감시당하는 느낌' },
  { category: 'Security', severity: 'high', name: '자기비난 DDoS', description: '자기 공격으로 시스템 마비' },
  { category: 'Security', severity: 'critical', name: '정서적 안정성 크래시', description: '감정이 예측 불가능하게 변함' },
  { category: 'Security', severity: 'medium', name: '회복탄력성 손상', description: '작은 실패에도 크게 좌절' },
  { category: 'Security', severity: 'high', name: '경계선 붕괴', description: '타인 요청을 거절하지 못함' },

  // System 관련 버그 (15개)
  { category: 'System', severity: 'critical', name: '미루기 커널 패닉', description: '모든 작업이 "내일"로 연기됨' },
  { category: 'System', severity: 'high', name: '생활패턴 랜덤화', description: '기상/취침 시간이 매일 다름' },
  { category: 'System', severity: 'medium', name: '루틴 프로세스 종료', description: '규칙적 생활이 불가능' },
  { category: 'System', severity: 'critical', name: '시간관리 OS 손상', description: '시간 계획 기능 전체 마비' },
  { category: 'System', severity: 'high', name: '목표 추적 중단', description: '세운 목표를 까먹음' },
  { category: 'System', severity: 'low', name: '완료율 버그', description: '90%까지 하고 마무리 안함' },
  { category: 'System', severity: 'medium', name: '일정 동기화 실패', description: '계획과 실행이 불일치' },
  { category: 'System', severity: 'high', name: '자동 시작 비활성화', description: '계획만 세우고 실행 안됨' },
  { category: 'System', severity: 'critical', name: '3일 저주 버그', description: '뭐든 3일 하면 자동 종료' },
  { category: 'System', severity: 'medium', name: '우선순위 쉘 손상', description: '급한 일과 중요한 일 구분 못함' },
  { category: 'System', severity: 'low', name: '알람 무한 스누즈', description: '알람을 끄지 않고 무한 연기' },
  { category: 'System', severity: 'high', name: '습관 형성 실패', description: '좋은 습관이 설치 안됨' },
  { category: 'System', severity: 'critical', name: '작심삼일 서비스', description: '새해 결심이 1월 3일에 다운' },
  { category: 'System', severity: 'medium', name: '일관성 체크섬 오류', description: '행동이 매번 달라짐' },
  { category: 'System', severity: 'high', name: '데드라인 인식 불가', description: '마감 직전까지 여유부림' },
];

// 업데이트/패치 데이터베이스
const updateDatabase = {
  RAM: [
    { name: '집중력 부스터 v2.0', description: '딥워크 모드 추가, 주의력 지속시간 200% 향상' },
    { name: '메모리 최적화 패치', description: '단기 기억 용량 확장, 정보 검색 속도 개선' },
    { name: '멀티태스킹 프로 업그레이드', description: '동시 작업 처리 한계 제거' },
    { name: '약속 알림 시스템', description: '중요 일정 자동 리마인더 기능' },
  ],
  CPU: [
    { name: '논리 엔진 v3.0', description: '문제 해결 알고리즘 개선, 의사결정 속도 향상' },
    { name: '전략적 사고 모듈', description: '장기 계획 수립 및 실행 최적화' },
    { name: '우선순위 AI', description: '중요도/긴급도 자동 분석 기능' },
    { name: '비판적 사고 필터', description: '정보 진위 자동 검증 시스템' },
  ],
  GPU: [
    { name: '창의력 엔진 업그레이드', description: '아이디어 생성 속도 3배 향상' },
    { name: '상상력 렌더러 Pro', description: '4K 고해상도 비전 시각화' },
    { name: '예술 감각 DLC', description: '미적 감수성 및 표현력 확장팩' },
    { name: '혁신 알고리즘 v2', description: '기존 틀을 깨는 사고 패턴' },
  ],
  Storage: [
    { name: '학습 가속기', description: '새로운 지식 습득 속도 2배 향상' },
    { name: '경험 인덱싱 시스템', description: '과거 경험 빠른 검색 및 활용' },
    { name: '지식 SSD 업그레이드', description: 'HDD를 SSD로 교체하여 학습 속도 10배 향상' },
    { name: '실수 학습 AI', description: '같은 실수 반복 방지 자동 시스템' },
  ],
  Network: [
    { name: '공감 프로토콜 v3.0', description: '타인 감정 인식 정확도 90%↑' },
    { name: '소통 최적화 패치', description: '의사소통 명확도 및 효율성 개선' },
    { name: '관계 관리 앱', description: '인간관계 자동 유지 및 관리' },
    { name: '갈등 해결 위저드', description: '갈등 상황 자동 중재 기능' },
  ],
  Battery: [
    { name: '에너지 관리 AI', description: '에너지 소모 최적화 및 효율 개선' },
    { name: '회복 부스터', description: '휴식 효율 300% 향상, 빠른 회복' },
    { name: '배터리 수명 연장', description: '전반적 체력 및 지구력 향상' },
    { name: '슬립 모드 최적화', description: '수면의 질 개선, 아침 부팅 속도 향상' },
  ],
  Security: [
    { name: '감정 조절 시스템', description: '감정 기복 안정화, 폭발 방지' },
    { name: '스트레스 백신 업데이트', description: '스트레스 면역력 강화' },
    { name: '자존감 암호화 강화', description: '자아존중감 보안 수준 향상' },
    { name: '멘탈 방화벽 v2', description: '부정적 생각 차단 기능' },
  ],
  System: [
    { name: '습관 형성 앱', description: '21일 습관 자동 정착 시스템' },
    { name: '시간 관리 마스터', description: '일정 최적화 및 데드라인 관리' },
    { name: '목표 추적 시스템', description: '목표 설정부터 달성까지 자동 관리' },
    { name: '루틴 자동화', description: '규칙적인 생활 패턴 유지 기능' },
  ],
};

// 3D 레이더 차트 컴포넌트
const RadarChart3D = ({ data }: { data: Record<string, number> }) => {
  const [rotation, setRotation] = useState(0);
  const categories = Object.keys(data);
  const maxValue = 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const angleStep = (2 * Math.PI) / categories.length;
  const getPoint = (value: number, index: number, offset = 0) => {
    const angle = index * angleStep - Math.PI / 2 + (rotation * Math.PI) / 180;
    const radius = (value / maxValue) * 120;
    return {
      x: Math.cos(angle) * radius + offset,
      y: Math.sin(angle) * radius + offset,
    };
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <svg viewBox="-180 -180 360 360" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8"/>
          </linearGradient>
        </defs>

        {/* 배경 원들 */}
        {[25, 50, 75, 100].map((percent, i) => (
          <circle
            key={i}
            cx="0"
            cy="0"
            r={(percent / 100) * 120}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        ))}

        {/* 축선들 */}
        {categories.map((_, index) => {
          const point = getPoint(120, index);
          return (
            <line
              key={`axis-${index}`}
              x1="0"
              y1="0"
              x2={point.x}
              y2={point.y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* 3D 그림자 효과 */}
        <polygon
          points={categories.map((cat, i) => {
            const point = getPoint(data[cat], i, 8);
            return `${point.x},${point.y}`;
          }).join(' ')}
          fill="rgba(0,0,0,0.3)"
          stroke="none"
        />

        {/* 메인 데이터 폴리곤 */}
        <polygon
          points={categories.map((cat, i) => {
            const point = getPoint(data[cat], i);
            return `${point.x},${point.y}`;
          }).join(' ')}
          fill="url(#chartGradient)"
          stroke="#60a5fa"
          strokeWidth="3"
          filter="url(#glow)"
          className="animate-pulse-slow"
        />

        {/* 데이터 포인트 */}
        {categories.map((cat, index) => {
          const point = getPoint(data[cat], index);
          return (
            <g key={`point-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#60a5fa"
                stroke="#fff"
                strokeWidth="2"
                filter="url(#glow)"
              />
            </g>
          );
        })}

        {/* 라벨 */}
        {categories.map((cat, index) => {
          const angle = index * angleStep - Math.PI / 2 + (rotation * Math.PI) / 180;
          const x = Math.cos(angle) * 145;
          const y = Math.sin(angle) * 145;
          return (
            <text
              key={`label-${index}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold fill-white"
              style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
            >
              {cat}
            </text>
          );
        })}

        {/* 중심 점 */}
        <circle cx="0" cy="0" r="3" fill="#fff" />
      </svg>

      {/* 글래스모픽 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
    </div>
  );
};

// 메인 컴포넌트
export default function LifeOSChecker() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [showAgeInput, setShowAgeInput] = useState(true);

  const handleAgeSubmit = (inputAge: number) => {
    setAge(inputAge);
    setShowAgeInput(false);
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, number> = {
      RAM: 0,
      CPU: 0,
      GPU: 0,
      Storage: 0,
      Network: 0,
      Battery: 0,
      Security: 0,
      System: 0,
    };

    const categoryCounts: Record<string, number> = {
      RAM: 0,
      CPU: 0,
      GPU: 0,
      Storage: 0,
      Network: 0,
      Battery: 0,
      Security: 0,
      System: 0,
    };

    questions.forEach((q, idx) => {
      categoryScores[q.category] += answers[idx];
      categoryCounts[q.category]++;
    });

    // 0-100 스케일로 정규화
    const normalizedScores: Record<string, number> = {};
    Object.keys(categoryScores).forEach(cat => {
      normalizedScores[cat] = (categoryScores[cat] / (categoryCounts[cat] * 4)) * 100;
    });

    const avgScore = Object.values(normalizedScores).reduce((a, b) => a + b, 0) / Object.keys(normalizedScores).length;

    // 버전 계산
    const majorVersion = age || 25;
    const minorVersion = Math.floor(avgScore / 10);
    const patchVersion = Math.floor((avgScore % 10));

    return {
      categoryScores: normalizedScores,
      avgScore,
      version: `${majorVersion}.${minorVersion}.${patchVersion}`,
      majorVersion,
      minorVersion,
      patchVersion,
    };
  };

  const getBugs = (categoryScores: Record<string, number>) => {
    const bugs: typeof bugDatabase = [];

    Object.entries(categoryScores).forEach(([category, score]) => {
      const categoryBugs = bugDatabase.filter(bug => bug.category === category);

      if (score < 30) {
        bugs.push(...categoryBugs.filter(b => b.severity === 'critical').slice(0, 3));
        bugs.push(...categoryBugs.filter(b => b.severity === 'high').slice(0, 2));
      } else if (score < 50) {
        bugs.push(...categoryBugs.filter(b => b.severity === 'high').slice(0, 2));
        bugs.push(...categoryBugs.filter(b => b.severity === 'medium').slice(0, 1));
      } else if (score < 70) {
        bugs.push(...categoryBugs.filter(b => b.severity === 'medium').slice(0, 2));
      } else if (score < 85) {
        bugs.push(...categoryBugs.filter(b => b.severity === 'low').slice(0, 1));
      }
    });

    return bugs.slice(0, 15);
  };

  const getRecommendedUpdates = (categoryScores: Record<string, number>) => {
    const updates: Array<{ category: string; update: typeof updateDatabase.RAM[0] }> = [];

    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score < 70) {
        const categoryUpdates = updateDatabase[category as keyof typeof updateDatabase];
        const numUpdates = score < 40 ? 3 : score < 60 ? 2 : 1;
        categoryUpdates.slice(0, numUpdates).forEach(update => {
          updates.push({ category, update });
        });
      }
    });

    return updates;
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(-1));
    setShowResult(false);
    setShowAgeInput(true);
    setAge(null);
  };

  // 나이 입력 화면
  if (showAgeInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-all group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>돌아가기</span>
          </Link>

          <div className="relative">
            {/* 3D 배경 효과 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>

            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
              {/* OS 로고 */}
              <div className="text-center mb-8">
                <div className="inline-block relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                  <div className="relative text-7xl mb-4">💻</div>
                </div>
                <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  인생 OS
                </h1>
                <p className="text-2xl font-bold text-white mb-2">버전 체커</p>
                <p className="text-slate-400">Life Operating System Version Checker</p>
              </div>

              {/* 시스템 정보 스타일 */}
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-blue-500/30 font-mono">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-green-400">
                    <span>▸ System Type:</span>
                    <span>Human Life OS</span>
                  </div>
                  <div className="flex justify-between text-blue-400">
                    <span>▸ Diagnostic:</span>
                    <span>35-Point Analysis</span>
                  </div>
                  <div className="flex justify-between text-purple-400">
                    <span>▸ Features:</span>
                    <span>8-Core System Check</span>
                  </div>
                  <div className="flex justify-between text-pink-400">
                    <span>▸ Output:</span>
                    <span>3D Visualization</span>
                  </div>
                </div>
              </div>

              {/* 나이 입력 */}
              <div className="mb-8">
                <label className="block text-white font-bold mb-4 text-center text-lg">
                  나이를 입력하세요 (메이저 버전 번호가 됩니다)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className="w-full bg-slate-800/50 border-2 border-blue-500/50 rounded-xl px-6 py-4 text-white text-2xl text-center font-bold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  placeholder="예: 25"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      const value = parseInt(input.value);
                      if (value > 0 && value <= 120) {
                        handleAgeSubmit(value);
                      }
                    }
                  }}
                  id="age-input"
                />
              </div>

              <button
                onClick={() => {
                  const input = document.getElementById('age-input') as HTMLInputElement;
                  const value = parseInt(input.value);
                  if (value > 0 && value <= 120) {
                    handleAgeSubmit(value);
                  } else {
                    alert('올바른 나이를 입력해주세요 (1-120)');
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                시스템 진단 시작 →
              </button>

              <div className="mt-6 text-center text-slate-400 text-sm">
                <p>⚡ 실시간 3D 분석 • 🔒 데이터 보안 • 📊 정밀 진단</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (showResult) {
    const results = calculateResults();
    const bugs = getBugs(results.categoryScores);
    const updates = getRecommendedUpdates(results.categoryScores);

    const getSystemStatus = (score: number) => {
      if (score >= 85) return { text: 'EXCELLENT', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500' };
      if (score >= 70) return { text: 'GOOD', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500' };
      if (score >= 50) return { text: 'FAIR', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500' };
      if (score >= 30) return { text: 'POOR', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500' };
      return { text: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' };
    };

    const status = getSystemStatus(results.avgScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 pb-20">
        <div className="max-w-6xl mx-auto py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-all group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>돌아가기</span>
          </Link>

          {/* 메인 시스템 정보 카드 */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">

              {/* 헤더 */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">System Information</h2>
                  <p className="text-slate-400 font-mono text-sm">인생 운영체제 상태 보고서</p>
                </div>
                <div className={`px-6 py-3 rounded-xl ${status.bg} border-2 ${status.border} backdrop-blur-sm`}>
                  <span className={`text-xl font-black ${status.color}`}>{status.text}</span>
                </div>
              </div>

              {/* 버전 정보 - 거대하게 */}
              <div className="text-center mb-12">
                <div className="text-slate-400 mb-2 font-mono">Current Version</div>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-40"></div>
                  <div className="relative text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-tighter">
                    {results.version}
                  </div>
                </div>
                <div className="mt-4 text-slate-400 font-mono text-lg">
                  LifeOS {results.version} ({age}세 기준)
                </div>
              </div>

              {/* 시스템 사양 그리드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(results.categoryScores).map(([category, score]) => {
                  const percentage = Math.round(score);
                  const categoryStatus = getSystemStatus(score);

                  return (
                    <div key={category} className="bg-black/40 rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition-all hover:scale-105">
                      <div className="text-slate-400 text-sm mb-2 font-mono">{category}</div>
                      <div className={`text-3xl font-black ${categoryStatus.color} mb-2 font-mono`}>
                        {percentage}
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 전체 점수 */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-bold text-lg">Overall System Performance</span>
                  <span className={`text-3xl font-black ${status.color} font-mono`}>
                    {Math.round(results.avgScore)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${results.avgScore}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D 레이더 차트 */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                3D System Analysis
              </h3>
              <RadarChart3D data={results.categoryScores} />
            </div>
          </div>

          {/* 버그 리포트 */}
          {bugs.length > 0 && (
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">🐛</span>
                  Bug Report
                  <span className="ml-auto text-red-400 font-mono">{bugs.length} issues detected</span>
                </h3>

                <div className="space-y-3">
                  {bugs.map((bug, idx) => {
                    const severityColors: Record<string, string> = {
                      critical: 'border-red-500 bg-red-500/10 text-red-400',
                      high: 'border-orange-500 bg-orange-500/10 text-orange-400',
                      medium: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
                      low: 'border-blue-500 bg-blue-500/10 text-blue-400',
                    };

                    return (
                      <div key={idx} className="bg-black/40 rounded-xl p-4 border border-white/10 hover:border-red-500/50 transition-all">
                        <div className="flex items-start gap-4">
                          <div className={`px-3 py-1 rounded-lg border ${severityColors[bug.severity]} text-xs font-bold uppercase`}>
                            {bug.severity}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-bold mb-1">{bug.name}</div>
                            <div className="text-slate-400 text-sm">{bug.description}</div>
                            <div className="text-blue-400 text-xs mt-2 font-mono">Category: {bug.category}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 권장 업데이트 */}
          {updates.length > 0 && (
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">⬆️</span>
                  Recommended Updates
                  <span className="ml-auto text-green-400 font-mono">{updates.length} patches available</span>
                </h3>

                <div className="space-y-3">
                  {updates.map((item, idx) => (
                    <div key={idx} className="bg-black/40 rounded-xl p-4 border border-white/10 hover:border-green-500/50 transition-all hover:scale-102">
                      <div className="flex items-start gap-4">
                        <div className="px-3 py-1 rounded-lg border border-green-500 bg-green-500/10 text-green-400 text-xs font-bold">
                          {item.category}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-bold mb-1">{item.update.name}</div>
                          <div className="text-slate-400 text-sm">{item.update.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl p-4 border border-blue-500/30">
                  <p className="text-slate-300 text-sm">
                    💡 <strong>Tip:</strong> 업데이트를 설치하려면 해당 영역의 활동과 습관을 개선하세요.
                    점수가 70점 이상이 되면 시스템이 안정화됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative flex gap-4">
              <button
                onClick={resetTest}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
              >
                🔄 재진단하기
              </button>
              <Link
                href="/"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all text-center border border-white/10 hover:border-white/20"
              >
                🏠 홈으로
              </Link>
            </div>
          </div>

          {/* Related Apps */}
          <div className="mt-12">
            <RelatedApps currentAppSlug="life-os-checker" />
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .bg-grid-pattern {
            background-image:
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
      </div>
    );
  }

  // 질문 화면
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-all group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>돌아가기</span>
        </Link>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>

          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* 진행률 */}
            <div className="mb-8">
              <div className="flex justify-between text-white mb-3 font-mono">
                <span className="text-sm">Progress</span>
                <span className="text-sm font-bold">{currentQuestion + 1} / {questions.length}</span>
              </div>
              <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-white/10">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="text-right mt-1 text-slate-400 text-sm font-mono">{Math.round(progress)}%</div>
            </div>

            {/* 카테고리 배지 */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <span className="text-blue-400 font-mono font-bold">{question.category}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 text-sm">{question.area}</span>
              </div>
            </div>

            {/* 질문 */}
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                {question.question}
              </h2>
            </div>

            {/* 답변 옵션 */}
            <div className="space-y-3">
              {[
                { score: 4, label: '매우 그렇다', gradient: 'from-green-600 to-emerald-600' },
                { score: 3, label: '그렇다', gradient: 'from-blue-600 to-cyan-600' },
                { score: 2, label: '보통이다', gradient: 'from-yellow-600 to-orange-600' },
                { score: 1, label: '아니다', gradient: 'from-orange-600 to-red-600' },
                { score: 0, label: '전혀 아니다', gradient: 'from-red-600 to-pink-600' },
              ].map((option) => (
                <button
                  type="button"
                  key={option.score}
                  onClick={() => handleAnswer(option.score)}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                    answers[currentQuestion] === option.score
                      ? 'scale-105 shadow-2xl'
                      : 'hover:scale-102 hover:shadow-xl'
                  }`}
                >
                  {answers[currentQuestion] === option.score && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-20 blur-xl`}></div>
                  )}
                  <div className={`relative bg-gradient-to-r ${option.gradient} p-5 ${
                    answers[currentQuestion] === option.score ? '' : 'opacity-70 group-hover:opacity-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-lg">{option.label}</span>
                      {answers[currentQuestion] === option.score && (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 네비게이션 */}
            <div className="flex gap-4 mt-8">
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border border-white/10"
                >
                  ← 이전
                </button>
              )}
              {answers[currentQuestion] !== -1 && (
                <button
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    } else {
                      setShowResult(true);
                    }
                  }}
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all"
                >
                  {currentQuestion === questions.length - 1 ? '결과 보기 →' : '다음 →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
