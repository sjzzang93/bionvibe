export interface HealthMilestone {
  id: string;
  minutes: number;
  days: number;
  title: string;
  icon: string;
  bodyChanges: string[];
  symptoms: string[];
  congratsMessage: string;
  medicalInfo: string;
  nextMilestone: string | null;
}

export interface HealthMilestonesData {
  version: string;
  units: {
    time: string;
    note: string;
  };
  milestones: HealthMilestone[];
}

export const HEALTH_MILESTONES_DATA: HealthMilestonesData = {
  "version": "1.0.0",
  "units": {
    "time": "minutes",
    "note": "minutes가 1440(=1일)을 넘으면 days 필드가 함께 제공됩니다."
  },
  "milestones": [
    {
      "id": "m-0020",
      "minutes": 20,
      "days": 0,
      "title": "혈압·맥박 안정 시작",
      "icon": "❤️",
      "bodyChanges": [
        "혈압과 심박수가 비흡연자 수준으로 향해 안정되기 시작합니다.",
        "말초혈관 수축이 완화되어 손발 온도가 올라갑니다."
      ],
      "symptoms": ["손발이 따뜻해짐", "가벼운 안정감"],
      "congratsMessage": "시작이 반이에요! 20분 만에 몸이 회복을 시작했습니다.",
      "medicalInfo": "니코틴의 급성 교감신경 자극이 줄며 혈관긴장이 완화됩니다.",
      "nextMilestone": "m-0060"
    },
    {
      "id": "m-0060",
      "minutes": 60,
      "days": 0,
      "title": "혈중 일산화탄소 감소",
      "icon": "🫁",
      "bodyChanges": [
        "혈중 일산화탄소(CO)가 감소하고 산소 운반 능력이 개선됩니다.",
        "세포 대사가 정상화 방향으로 이동합니다."
      ],
      "symptoms": ["머리가 맑아지는 느낌", "숨쉬기 약간 편안"],
      "congratsMessage": "1시간 달성! 폐와 혈액이 맑아지고 있어요.",
      "medicalInfo": "CO 해리곡선이 정상화되며 조직 산소공급이 개선됩니다.",
      "nextMilestone": "m-0480"
    },
    {
      "id": "m-0480",
      "minutes": 480,
      "days": 0,
      "title": "8시간: 산소 포화도 개선",
      "icon": "🩸",
      "bodyChanges": [
        "혈중 산소포화도가 비흡연자에 가까워집니다.",
        "심근 부담이 감소 방향으로 이동합니다."
      ],
      "symptoms": ["피로감 소폭 감소", "호흡 편안감 증가"],
      "congratsMessage": "8시간 돌파! 몸이 빠르게 균형을 되찾고 있어요.",
      "medicalInfo": "CO 반감기(약 4~6시간) 동안 체내 CO가 지속적으로 배출됩니다.",
      "nextMilestone": "m-0720"
    },
    {
      "id": "m-0720",
      "minutes": 720,
      "days": 0,
      "title": "12시간: 심혈관 위험 감소 시작",
      "icon": "🫀",
      "bodyChanges": [
        "혈중 CO가 의미 있게 낮아져 심근 허혈 위험요인이 감소 방향입니다."
      ],
      "symptoms": ["가벼운 상쾌함", "허기감 또는 입 심심함"],
      "congratsMessage": "12시간째, 심장이 가벼워지고 있어요!",
      "medicalInfo": "산소 운반능 회복은 심혈관계 부담을 줄이는 핵심 요소입니다.",
      "nextMilestone": "m-1440"
    },
    {
      "id": "m-1440",
      "minutes": 1440,
      "days": 1,
      "title": "24시간: 심근경색 위험 하향 추세",
      "icon": "⏱️",
      "bodyChanges": [
        "24시간 금연 시 급성 심장 사건 위험이 낮아지는 방향으로 이동합니다."
      ],
      "symptoms": ["니코틴 갈망 파도(3~5분 단위)", "잠귀가 밝아짐 또는 초조"],
      "congratsMessage": "하루 완주! 가장 큰 산 하나를 넘으셨어요.",
      "medicalInfo": "급성 니코틴·CO 노출 종료로 허혈성 이벤트의 유발 요인이 감소합니다.",
      "nextMilestone": "m-2880"
    },
    {
      "id": "m-2880",
      "minutes": 2880,
      "days": 2,
      "title": "48시간: 미각·후각 회복 시작",
      "icon": "👅",
      "bodyChanges": ["미각과 후각 수용체 기능이 서서히 회복됩니다."],
      "symptoms": ["음식 맛이 또렷해짐", "갈망이 주기적으로 반복"],
      "congratsMessage": "이틀째, 음식이 더 맛있게 느껴질 거예요!",
      "medicalInfo": "상피세포 재생과 염증 감소가 감각 회복에 기여합니다.",
      "nextMilestone": "m-4320"
    },
    {
      "id": "m-4320",
      "minutes": 4320,
      "days": 3,
      "title": "72시간: 기관지 이완—호흡 편안",
      "icon": "🌬️",
      "bodyChanges": [
        "기관지 평활근 이완으로 폐활량이 향상되는 경향을 보입니다."
      ],
      "symptoms": ["기침 증가(정상적인 청소 과정)", "피곤함/두통 가능"],
      "congratsMessage": "3일 고비 돌파! 숨이 한결 가벼워져요.",
      "medicalInfo": "점액섬모청소기능 회복 초기 단계로 객담 배출이 늘 수 있습니다.",
      "nextMilestone": "m-10080"
    },
    {
      "id": "m-10080",
      "minutes": 10080,
      "days": 7,
      "title": "1주: 순환 개선·피부톤 변화",
      "icon": "🧴",
      "bodyChanges": [
        "말초순환이 개선되어 피부 혈색이 좋아지는 경향이 있습니다.",
        "휴식 시 심박수 안정."
      ],
      "symptoms": [
        "갈망 빈도 감소(강도는 파도처럼 남아있음)",
        "잠들기 전 생각 증가"
      ],
      "congratsMessage": "첫 주 완료! 강한 재발 구간을 잘 넘기셨어요.",
      "medicalInfo": "혈관내피 기능 회복은 수주~수개월에 걸쳐 진행됩니다.",
      "nextMilestone": "m-20160"
    },
    {
      "id": "m-20160",
      "minutes": 20160,
      "days": 14,
      "title": "2주: 폐 기능 유의미한 향상",
      "icon": "📈",
      "bodyChanges": [
        "일상 활동 시 숨가쁨이 줄고 운동 시 회복이 빨라집니다."
      ],
      "symptoms": ["간헐적 갈망", "가벼운 변비 또는 식욕 증가"],
      "congratsMessage": "2주 성공! 몸이 비흡연자 리듬에 적응 중이에요.",
      "medicalInfo": "폐포 환기·관류 균형이 회복 방향으로 이동합니다.",
      "nextMilestone": "m-43200"
    },
    {
      "id": "m-43200",
      "minutes": 43200,
      "days": 30,
      "title": "1개월: 폐기능 향상 체감",
      "icon": "🫁✨",
      "bodyChanges": [
        "계단 오르내리기 시 숨찬 느낌이 줄어듭니다.",
        "피부 혈색·탄력 회복에 도움."
      ],
      "symptoms": ["스트레스성 흡연 기억이 불시에 떠오름", "식습관 변화"],
      "congratsMessage": "1개월 금연! 이미 의미 있는 변화를 만들었습니다.",
      "medicalInfo": "상기도 염증 감소와 섬모 기능 회복으로 기침 양상이 달라질 수 있습니다.",
      "nextMilestone": "m-86400"
    },
    {
      "id": "m-86400",
      "minutes": 86400,
      "days": 60,
      "title": "2개월: 운동 시 회복속도 개선",
      "icon": "🏃",
      "bodyChanges": [
        "운동 후 심박이 더 빠르게 안정됩니다.",
        "피로 회복 시간 단축."
      ],
      "symptoms": ["기분기복 완화", "식욕 안정 시작"],
      "congratsMessage": "2개월 돌파! 체력이 금연의 보상을 보여줍니다.",
      "medicalInfo": "순환·호흡계 적응이 누적되어 기능적 이점이 커집니다.",
      "nextMilestone": "m-129600"
    },
    {
      "id": "m-129600",
      "minutes": 129600,
      "days": 90,
      "title": "3개월: 호흡기 증상 뚜렷한 개선",
      "icon": "🌿",
      "bodyChanges": [
        "기침·가래 빈도와 강도가 전반적으로 감소하는 경향.",
        "피부·모발 상태 개선 체감."
      ],
      "symptoms": ["드문 갈망 파도", "사회적 트리거(술자리 등) 주의 필요"],
      "congratsMessage": "3개월 성공! 이미 새로운 라이프스타일을 만들고 있어요.",
      "medicalInfo": "점액섬모 시스템 기능 개선이 지속됩니다.",
      "nextMilestone": "m-259200"
    },
    {
      "id": "m-259200",
      "minutes": 259200,
      "days": 180,
      "title": "6개월: 재발 위험 큰 고비 재감소",
      "icon": "🛡️",
      "bodyChanges": ["기침·호흡 관련 자각 증상 감소.", "운동 수행능력 향상."],
      "symptoms": [
        "특정 기념일·스트레스 시 일시적 갈망",
        "체중 증가가 있었다면 정체 또는 관리국면"
      ],
      "congratsMessage": "반년 완주! 스스로가 최고의 증거입니다.",
      "medicalInfo": "만성 염증 표지자 감소가 보고되는 시기입니다(개인차 큼).",
      "nextMilestone": "m-388800"
    },
    {
      "id": "m-388800",
      "minutes": 388800,
      "days": 270,
      "title": "9개월: 섬모기능 회복—감염 위험 감소 경향",
      "icon": "🦠➡️🚫",
      "bodyChanges": [
        "기도 섬모운동 회복으로 호흡기 감염 위험이 낮아지는 경향."
      ],
      "symptoms": ["갈망 드묾", "생활 패턴 안정"],
      "congratsMessage": "9개월! 호흡기 방어력이 달라졌어요.",
      "medicalInfo": "섬모 활동 회복은 병원체 제거에 유리합니다.",
      "nextMilestone": "m-525600"
    },
    {
      "id": "m-525600",
      "minutes": 525600,
      "days": 365,
      "title": "1년: 심혈관 위험 유의미 감소",
      "icon": "🏅",
      "bodyChanges": [
        "관상동맥질환 위험이 흡연자 대비 유의하게 낮아집니다."
      ],
      "symptoms": ["극히 드문 갈망", "일상 완전 적응"],
      "congratsMessage": "1년 금연 마스터! 배지를 획득하세요.",
      "medicalInfo": "심혈관계 사건 위험이 통계적으로 의미 있게 낮아지는 구간입니다(개인차 존재).",
      "nextMilestone": "m-1051200"
    },
    {
      "id": "m-1051200",
      "minutes": 1051200,
      "days": 730,
      "title": "2년: 뇌졸중 위험 하향 추세",
      "icon": "🧠",
      "bodyChanges": [
        "혈관내피 기능 개선 누적 효과로 뇌혈관 사건 위험이 낮아지는 경향."
      ],
      "symptoms": ["흡연 기억의 감정강도 약화"],
      "congratsMessage": "2년 꾸준함이 만들어낸 건강 자산!",
      "medicalInfo": "혈관 염증과 내피 기능 지표가 장기적으로 개선됩니다.",
      "nextMilestone": "m-2628000"
    },
    {
      "id": "m-2628000",
      "minutes": 2628000,
      "days": 1825,
      "title": "5년: 여러 암·심혈관 위험 추가 하향",
      "icon": "📉",
      "bodyChanges": [
        "일부 암과 심혈관 사건 위험이 더 낮아지는 경향을 보입니다."
      ],
      "symptoms": ["흡연 트리거에 대한 내성 확립"],
      "congratsMessage": "5년 금연은 인생을 바꾸는 선택입니다.",
      "medicalInfo": "장기 금연은 누적적 위험 감소에 기여합니다.",
      "nextMilestone": "m-5256000"
    },
    {
      "id": "m-5256000",
      "minutes": 5256000,
      "days": 3650,
      "title": "10년: 폐암 등 주요 위험 큰 폭 감소 경향",
      "icon": "🎖️",
      "bodyChanges": [
        "폐암 등 주요 질환의 위험이 흡연자 대비 큰 폭으로 낮아집니다."
      ],
      "symptoms": [],
      "congratsMessage": "10년 장기 금연 달성! 건강 기대치가 완전히 달라졌어요.",
      "medicalInfo": "여러 대규모 코호트에서 장기 금연의 위험 감소가 보고됩니다.",
      "nextMilestone": null
    }
  ]
};

