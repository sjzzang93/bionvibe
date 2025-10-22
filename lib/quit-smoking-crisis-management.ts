export interface CrisisAction {
  action: string;
  duration: string;
  detail: string;
}

export interface HelplineInfo {
  number: string;
  name: string;
  availableTime?: string;
}

export interface CrisisSituation {
  id: string;
  situation: string;
  severity: "높음" | "중간";
  description: string;
  immediate5MinActions: CrisisAction[];
  mindsetReset: string;
  helplineInfo?: HelplineInfo;
  apps?: string[];
  preventionTips?: string[];
  successStories: string[];
}

export interface CrisisManagementData {
  version: string;
  crisisSituations: CrisisSituation[];
}

export const CRISIS_MANAGEMENT_DATA: CrisisManagementData = {
  "version": "1.0.0",
  "crisisSituations": [
    {
      "id": "c-01",
      "situation": "강한 흡연 욕구",
      "severity": "높음",
      "description": "참을 수 없을 만큼 강한 담배 생각",
      "immediate5MinActions": [
        {"action": "냉수 세수", "duration": "30초", "detail": "자극 전환으로 욕구 파도 약화"},
        {"action": "계단 오르내리기", "duration": "2분", "detail": "심박 상승으로 엔돌핀 분비"},
        {"action": "복식 호흡 10회", "duration": "1분", "detail": "교감신경 과활성 진정"},
        {"action": "껌·사탕", "duration": "즉시", "detail": "구강 대체로 습관 차단"},
        {"action": "금연 동기 메모 읽기", "duration": "1분", "detail": "초심 복기로 의지 강화"}
      ],
      "mindsetReset": "이 욕구는 곧 사라집니다. 당신은 이미 수십 번 이겨냈어요.",
      "helplineInfo": {"number": "1544-9030", "name": "금연상담전화", "availableTime": "24시간"},
      "successStories": ["A(45세): 욕구 올 때 5분 산책으로 3개월 완전 금연."]
    },
    {
      "id": "c-02",
      "situation": "스트레스 폭증",
      "severity": "높음",
      "description": "업무/가정 스트레스가 급상승",
      "immediate5MinActions": [
        {"action": "박자 호흡 4-7-8", "duration": "2분", "detail": "긴장 완화"},
        {"action": "종이 찢기·볼펜 쥐기", "duration": "1분", "detail": "근긴장 분산"},
        {"action": "짧은 산책", "duration": "2분", "detail": "환경 전환"}
      ],
      "mindsetReset": "담배는 스트레스를 줄이지 않습니다. 당신의 호흡과 움직임이 줄입니다.",
      "apps": ["명상 앱(5분)", "호흡 타이머"],
      "successStories": ["B: 업무 스트레스마다 4-7-8로 진정, 6개월 금연 유지."]
    },
    {
      "id": "c-03",
      "situation": "술자리/회식",
      "severity": "높음",
      "description": "음주로 억제력 저하",
      "immediate5MinActions": [
        {"action": "사전 공표", "duration": "1분", "detail": "동료에게 금연 중임을 알리기"},
        {"action": "자리 이동", "duration": "즉시", "detail": "흡연자와 거리 두기"},
        {"action": "간식·물 준비", "duration": "즉시", "detail": "입 심심함 대체"},
        {"action": "조기 퇴장 계획", "duration": "즉시", "detail": "취하기 전에 자리 뜨기"}
      ],
      "mindsetReset": "술과 담배는 세트가 아닙니다. 당신은 선택할 수 있어요.",
      "preventionTips": ["배부르게 식사 후 참석", "술 양 50% 절감", "흡연 구역 근처 금지"],
      "successStories": ["C: 첫 달 회식 2번 무사 통과, 자신감 상승."]
    },
    {
      "id": "c-04",
      "situation": "다른 흡연자와 만남",
      "severity": "중간",
      "description": "사회적 트리거 노출",
      "immediate5MinActions": [
        {"action": "금연 선언", "duration": "30초", "detail": "상대 배려 요청"},
        {"action": "손 점유", "duration": "즉시", "detail": "컵·물병 들기"},
        {"action": "잠깐 자리 비우기", "duration": "2분", "detail": "후각·시각 자극 차단"}
      ],
      "mindsetReset": "상대의 선택과 나의 선택은 별개입니다.",
      "successStories": ["D: 흡연 친구와의 약속에서 껌·대화로 무사 통과."]
    },
    {
      "id": "c-05",
      "situation": "우울감/무력감",
      "severity": "중간",
      "description": "동기 저하·의욕 상실",
      "immediate5MinActions": [
        {"action": "햇빛 맞기", "duration": "5분", "detail": "기분 전환"},
        {"action": "감사 3줄", "duration": "2분", "detail": "주의 전환"},
        {"action": "친구에게 문자", "duration": "1분", "detail": "사회적 지지 연결"}
      ],
      "mindsetReset": "기분은 날씨처럼 변합니다. 금연은 당신 편이에요.",
      "apps": ["마음기록 앱", "상담 연결"],
      "successStories": ["E: 감사 일기로 2주 슬럼프 탈출."]
    },
    {
      "id": "c-06",
      "situation": "체중 증가 스트레스",
      "severity": "중간",
      "description": "체중·외모 불안",
      "immediate5MinActions": [
        {"action": "물+산책", "duration": "5분", "detail": "식욕 파도 넘기기"},
        {"action": "견과류 10알", "duration": "즉시", "detail": "포만감으로 폭식 방지"},
        {"action": "스쿼트 20회", "duration": "2분", "detail": "NEAT 상승"}
      ],
      "mindsetReset": "체중은 관리 가능한 변수예요. 건강은 장기전!",
      "successStories": ["F: 근력운동 입문 후 체중 안정."]
    },
    {
      "id": "c-07",
      "situation": "금단 증상 최고조",
      "severity": "높음",
      "description": "불면·두통·짜증 동시 폭발",
      "immediate5MinActions": [
        {"action": "온·냉찜질 교대", "duration": "5분", "detail": "긴장 완화"},
        {"action": "티(무카페인) 마시기", "duration": "3분", "detail": "진정 루틴"},
        {"action": "호흡 + 음악", "duration": "2분", "detail": "교감신경 낮추기"}
      ],
      "mindsetReset": "지금이 가장 고비일 뿐, 파도는 곧 잦아듭니다.",
      "helplineInfo": {"number": "1544-9030", "name": "금연상담전화"},
      "successStories": ["G: 2주차 밤마다 호흡음악으로 버티고 안정."]
    },
    {
      "id": "c-08",
      "situation": "재발 위기(한 개비 유혹)",
      "severity": "높음",
      "description": "'한 개비만…' 자기합리화",
      "immediate5MinActions": [
        {"action": "미래 자아 메시지 읽기", "duration": "1분", "detail": "한 개비가 만든 연쇄를 상상"},
        {"action": "대체 행동 3개 연속", "duration": "3분", "detail": "껌-물-산책"},
        {"action": "금연 커뮤니티 글 읽기", "duration": "1분", "detail": "동기 회복"}
      ],
      "mindsetReset": "한 개비는 한 갑의 문입니다. 당신은 이미 문 밖에 있어요.",
      "successStories": ["H: '한 개비' 거절로 100일 무결점 달성."]
    },
    {
      "id": "c-09",
      "situation": "여행/일상 루틴 붕괴",
      "severity": "중간",
      "description": "새 환경에서 루틴 무너짐",
      "immediate5MinActions": [
        {"action": "여행 전 금연 키트 준비", "duration": "5분", "detail": "껌·사탕·물병"},
        {"action": "아침 루틴 1개 고정", "duration": "즉시", "detail": "양치/호흡"},
        {"action": "금연 선언 카드", "duration": "1분", "detail": "동행자에게 공유"}
      ],
      "mindsetReset": "새로운 곳에서도 나는 나. 루틴 1개면 충분해요.",
      "successStories": ["I: 해외여행 7일 무사 완주."]
    },
    {
      "id": "c-10",
      "situation": "장기 슬럼프(3~6개월)",
      "severity": "중간",
      "description": "동기 하락·지루함",
      "immediate5MinActions": [
        {"action": "목표 리프레시", "duration": "5분", "detail": "체력·재정 새 지표 설정"},
        {"action": "커뮤니티 멘토링", "duration": "즉시", "detail": "도움 주며 동기 회복"},
        {"action": "새 운동 종목 맛보기", "duration": "5분", "detail": "새 자극 만들기"}
      ],
      "mindsetReset": "지루함은 끝이 아니라 '다음 단계' 신호예요.",
      "successStories": ["J: 러닝크루 합류 후 1년 마스터."]
    }
  ]
};

