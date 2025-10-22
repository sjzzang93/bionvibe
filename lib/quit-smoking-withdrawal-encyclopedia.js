export default {
  "version": "1.0.0",
  "scale": {
    "severity": [
      "경미",
      "보통",
      "심각"
    ]
  },
  "symptoms": [
    {
      "id": "w-01",
      "name": "니코틴 갈망",
      "severity": "심각",
      "onset": "금연 후 30분~2시간",
      "peakTime": "금연 2~3일",
      "duration": "2~4주(점감, 파도처럼 반복)",
      "description": "담배를 피우고 싶은 강렬한 욕구",
      "medicalExplanation": "니코틴이 도파민 보상회로를 자극하던 패턴의 금단 반응",
      "copingStrategies": [
        {
          "strategy": "5분 지연(파도 넘기기)",
          "detail": "욕구는 3~5분 파도처럼 사라집니다.",
          "effectiveness": "높음"
        },
        {
          "strategy": "복식 호흡 10회",
          "detail": "4초 들이마시고 6초 내쉬기 ×10.",
          "effectiveness": "높음"
        },
        {
          "strategy": "물 1컵 천천히",
          "detail": "입·손의 습관 대체.",
          "effectiveness": "중간"
        },
        {
          "strategy": "장소 바꾸기",
          "detail": "트리거 환경을 즉시 이탈.",
          "effectiveness": "높음"
        },
        {
          "strategy": "금연 메모 읽기",
          "detail": "개인 동기 목록을 소리 내어 읽기.",
          "effectiveness": "높음"
        }
      ],
      "nonPharmacologic": [
        "껌·사탕·해바라기씨로 구강 대체",
        "산책 5분",
        "차가운 물로 세수"
      ],
      "whenToSeekHelp": "갈망으로 일상 기능 저하, 재발 반복 시 전문가 상담 권장",
      "helpline": "금연상담전화 1544-9030"
    },
    {
      "id": "w-02",
      "name": "불안/초조",
      "severity": "보통",
      "onset": "1~3일",
      "peakTime": "1주",
      "duration": "2~4주",
      "description": "안절부절, 작은 자극에도 예민",
      "medicalExplanation": "니코틴 중단으로 교감/부교감 균형 재조정 과정",
      "copingStrategies": [
        {
          "strategy": "박자 호흡 4-7-8",
          "detail": "4초 들숨-7초 정지-8초 날숨 4회",
          "effectiveness": "중간"
        },
        {
          "strategy": "카페인 섭취 절반으로",
          "detail": "불안을 악화시키는 요인 감소",
          "effectiveness": "중간"
        },
        {
          "strategy": "근이완 스트레칭",
          "detail": "목·어깨 3분 스트레칭",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "명상 앱 5분",
        "따뜻한 차",
        "규칙적 수면 루틴"
      ],
      "whenToSeekHelp": "불안이 일상·수면을 심각하게 방해하면 상담 필요"
    },
    {
      "id": "w-03",
      "name": "우울감/무기력",
      "severity": "보통",
      "onset": "3~7일",
      "peakTime": "2주",
      "duration": "2~8주",
      "description": "흥미 저하, 의욕 감소",
      "medicalExplanation": "보상회로의 도파민 재설정 기간",
      "copingStrategies": [
        {
          "strategy": "햇빛 15분",
          "detail": "일광 노출로 기분 개선",
          "effectiveness": "중간"
        },
        {
          "strategy": "가벼운 운동",
          "detail": "걷기 20~30분",
          "effectiveness": "높음"
        },
        {
          "strategy": "작은 성취 과제",
          "detail": "설거지, 침구 정리 등 5분 태스크",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "사회적 지지 확보(친구 연락)",
        "감사 일기 3줄",
        "수면 위생"
      ],
      "whenToSeekHelp": "우울이 2주 이상 지속·악화되면 전문가 상담"
    },
    {
      "id": "w-04",
      "name": "두통",
      "severity": "경미",
      "onset": "1~3일",
      "peakTime": "3~7일",
      "duration": "1~3주",
      "description": "뻐근한 조이는 통증",
      "medicalExplanation": "혈관 긴장 변화·카페인 상호작용",
      "copingStrategies": [
        {
          "strategy": "수분 보충",
          "detail": "하루 물 6~8잔",
          "effectiveness": "중간"
        },
        {
          "strategy": "짧은 낮잠 15분",
          "detail": "과수면은 피하기",
          "effectiveness": "중간"
        },
        {
          "strategy": "온찜질/냉찜질",
          "detail": "목·어깨 근육 이완",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "카페인 과다 피하기",
        "규칙적 식사",
        "소음 줄이기"
      ],
      "whenToSeekHelp": "지속적·악화되는 두통, 신경학적 증상이 동반되면 진료"
    },
    {
      "id": "w-05",
      "name": "불면/수면질 저하",
      "severity": "보통",
      "onset": "1~7일",
      "peakTime": "1~2주",
      "duration": "2~6주",
      "description": "잠들기 어려움·자주 깨기",
      "medicalExplanation": "니코틴 각성효과 소실 이후 리듬 재정렬",
      "copingStrategies": [
        {
          "strategy": "취침 루틴 고정",
          "detail": "같은 시간에 불끄기·화면줄이기",
          "effectiveness": "중간"
        },
        {
          "strategy": "저녁 카페인·알코올 제한",
          "detail": "각성·수면파괴 요인 차단",
          "effectiveness": "높음"
        },
        {
          "strategy": "호흡·명상 5분",
          "detail": "이완 반응 유도",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "침실 온도 18~20℃",
        "취침 전 뜨거운 샤워",
        "화이트노이즈"
      ],
      "whenToSeekHelp": "불면이 2주 이상 지속해 기능 저하시"
    },
    {
      "id": "w-06",
      "name": "집중력 저하",
      "severity": "보통",
      "onset": "2~7일",
      "peakTime": "2주",
      "duration": "2~4주",
      "description": "쉽게 산만해짐",
      "medicalExplanation": "니코틴 의존성 주의집중 보상 소실에 따른 조정기",
      "copingStrategies": [
        {
          "strategy": "포모도로 25:5",
          "detail": "25분 집중+5분 휴식",
          "effectiveness": "중간"
        },
        {
          "strategy": "작업 쪼개기",
          "detail": "태스크를 5분 단위로",
          "effectiveness": "중간"
        },
        {
          "strategy": "물·가벼운 간식",
          "detail": "저혈당 예방",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "핸드폰 무음·시야 밖",
        "아침 가벼운 운동",
        "업무 전 할 일 3개만"
      ],
      "whenToSeekHelp": "주의력 저하가 장기·심각 시 평가 필요"
    },
    {
      "id": "w-07",
      "name": "식욕 증가/체중 증가",
      "severity": "보통",
      "onset": "수일 내",
      "peakTime": "2~4주",
      "duration": "수주~수개월(관리 가능)",
      "description": "단맛·탄수화물 탐닉",
      "medicalExplanation": "니코틴 식욕억제 소실과 미각 회복",
      "copingStrategies": [
        {
          "strategy": "단백질·식이섬유 우선",
          "detail": "포만감↑, 폭식↓",
          "effectiveness": "중간"
        },
        {
          "strategy": "물·무가당 차",
          "detail": "불필요한 칼로리 억제",
          "effectiveness": "중간"
        },
        {
          "strategy": "NEAT 증가",
          "detail": "자잘한 움직임 늘리기",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "야식 줄이기",
        "주 2~3회 근력·유산소",
        "체중 주간 체크"
      ],
      "whenToSeekHelp": "급격한 체중변화·폭식 반복 시 영양·행동상담"
    },
    {
      "id": "w-08",
      "name": "변비",
      "severity": "경미",
      "onset": "1~2주",
      "peakTime": "2~4주",
      "duration": "수주",
      "description": "배변 간격 증가",
      "medicalExplanation": "장운동성 조절 변화·수분 섭취 부족",
      "copingStrategies": [
        {
          "strategy": "물 1.5~2L",
          "detail": "하루 종일 분할 섭취",
          "effectiveness": "중간"
        },
        {
          "strategy": "섬유질 25~30g",
          "detail": "야채·과일·통곡물",
          "effectiveness": "중간"
        },
        {
          "strategy": "규칙적 배변 시도",
          "detail": "아침 식후 10분 화장실",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "걷기 20~30분",
        "프룬/요거트",
        "과도한 변비약 남용 금지"
      ],
      "whenToSeekHelp": "복통·혈변·체중감소 동반 시 즉시 진료"
    },
    {
      "id": "w-09",
      "name": "기침 증가/가래",
      "severity": "경미",
      "onset": "3~7일",
      "peakTime": "2~4주",
      "duration": "수주",
      "description": "기관지 청소 과정으로 가래 배출",
      "medicalExplanation": "섬모 기능 회복으로 분비물 제거",
      "copingStrategies": [
        {
          "strategy": "수분 섭취",
          "detail": "점액 점도↓",
          "effectiveness": "중간"
        },
        {
          "strategy": "증기 흡입",
          "detail": "따뜻한 샤워/가습",
          "effectiveness": "경미"
        },
        {
          "strategy": "가벼운 운동",
          "detail": "객담 배출 도움",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "자극적 공기 피하기",
        "수면 머리쪽 살짝 높이기",
        "기침 에티켓"
      ],
      "whenToSeekHelp": "발열·흉통·호흡곤란 동반 시 진료"
    },
    {
      "id": "w-10",
      "name": "짜증/분노",
      "severity": "보통",
      "onset": "수일 내",
      "peakTime": "1~2주",
      "duration": "2~4주",
      "description": "작은 일에 화가 치밀기",
      "medicalExplanation": "금단으로 인한 정서 조절 변동",
      "copingStrategies": [
        {
          "strategy": "타임아웃 90초",
          "detail": "감정파도 흘려보내기",
          "effectiveness": "중간"
        },
        {
          "strategy": "메시지 지연",
          "detail": "즉시 답장 금지·10분 뒤",
          "effectiveness": "중간"
        },
        {
          "strategy": "걷기",
          "detail": "분노 에너지 소모",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "감정 기록",
        "수면·영양 점검",
        "지지자에게 알리기"
      ],
      "whenToSeekHelp": "대인관계 심각 악화·폭발적 행동 시 상담"
    },
    {
      "id": "w-11",
      "name": "피로",
      "severity": "경미",
      "onset": "1주",
      "peakTime": "2주",
      "duration": "수주",
      "description": "에너지 저하",
      "medicalExplanation": "신경계 재적응",
      "copingStrategies": [
        {
          "strategy": "일정한 기상시간",
          "detail": "수면 리듬 고정",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "낮 햇빛",
        "수분"
      ],
      "whenToSeekHelp": "지속적 기능 저하"
    },
    {
      "id": "w-12",
      "name": "현기증",
      "severity": "경미",
      "onset": "수일",
      "peakTime": "1주",
      "duration": "수주",
      "description": "어지러움",
      "medicalExplanation": "자율신경 조절 변화",
      "copingStrategies": [
        {
          "strategy": "천천히 일어나기",
          "detail": "기립성 어지럼 예방",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "수분",
        "심호흡"
      ],
      "whenToSeekHelp": "실신/신경학적 증상"
    },
    {
      "id": "w-13",
      "name": "입 심심함",
      "severity": "경미",
      "onset": "즉시",
      "peakTime": "1~2주",
      "duration": "수주",
      "description": "손·입 습관 결핍",
      "medicalExplanation": "행동 습관 고리 단절",
      "copingStrategies": [
        {
          "strategy": "치실·양치",
          "detail": "구강 자극 대체",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "무설탕 껌",
        "채소 스틱"
      ],
      "whenToSeekHelp": "폭식 동반 시"
    },
    {
      "id": "w-14",
      "name": "가슴 답답함(경미)",
      "severity": "경미",
      "onset": "수일",
      "peakTime": "1~2주",
      "duration": "수주",
      "description": "불편감",
      "medicalExplanation": "기관지 점액 이동",
      "copingStrategies": [
        {
          "strategy": "쉬운 호흡운동",
          "detail": "코로 들숨·입으로 날숨",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "가습",
        "따뜻한 차"
      ],
      "whenToSeekHelp": "흉통/호흡곤란 즉시 진료"
    },
    {
      "id": "w-15",
      "name": "감정 기복",
      "severity": "보통",
      "onset": "1주",
      "peakTime": "2주",
      "duration": "4~8주",
      "description": "들쭉날쭉한 기분",
      "medicalExplanation": "신경전달물질 균형 재정렬",
      "copingStrategies": [
        {
          "strategy": "감정 라벨링",
          "detail": "감정을 단어로 명명",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "상담·지지",
        "운동"
      ],
      "whenToSeekHelp": "기분장애 의심"
    },
    {
      "id": "w-16",
      "name": "목·입 건조",
      "severity": "경미",
      "onset": "수일",
      "peakTime": "2주",
      "duration": "수주",
      "description": "구강 건조감",
      "medicalExplanation": "분비물 변화",
      "copingStrategies": [
        {
          "strategy": "수분·가습",
          "detail": "작게 자주 마시기",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "무설탕 캔디"
      ],
      "whenToSeekHelp": "연하곤란/통증"
    },
    {
      "id": "w-17",
      "name": "속쓰림",
      "severity": "경미",
      "onset": "수일",
      "peakTime": "2주",
      "duration": "수주",
      "description": "위산 역류감",
      "medicalExplanation": "식습관 변화·과식",
      "copingStrategies": [
        {
          "strategy": "소량·자주",
          "detail": "야식 피하기",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "카페인·매운 음식 줄이기"
      ],
      "whenToSeekHelp": "통증/체중감소"
    },
    {
      "id": "w-18",
      "name": "피부 트러블 일시 증가",
      "severity": "경미",
      "onset": "1~3주",
      "peakTime": "4주",
      "duration": "수주",
      "description": "뾰루지",
      "medicalExplanation": "호르몬·생활리듬 변화",
      "copingStrategies": [
        {
          "strategy": "저자극 스킨케어",
          "detail": "세안·보습",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "수면·수분"
      ],
      "whenToSeekHelp": "염증 심화"
    },
    {
      "id": "w-19",
      "name": "슬럼프",
      "severity": "보통",
      "onset": "3~4주",
      "peakTime": "4~8주",
      "duration": "가변",
      "description": "동기 저하",
      "medicalExplanation": "보상 고리 약화로 심리적 공백",
      "copingStrategies": [
        {
          "strategy": "보상 계획",
          "detail": "작은 선물·취미",
          "effectiveness": "중간"
        }
      ],
      "nonPharmacologic": [
        "커뮤니티 참여"
      ],
      "whenToSeekHelp": "재발 반복"
    },
    {
      "id": "w-20",
      "name": "악몽/생생한 꿈",
      "severity": "경미",
      "onset": "1~2주",
      "peakTime": "2~4주",
      "duration": "수주",
      "description": "수면 중 생생한 꿈",
      "medicalExplanation": "REM 수면 패턴 변화",
      "copingStrategies": [
        {
          "strategy": "취침 전 스크린 타임 축소",
          "detail": "블루라이트 줄이기",
          "effectiveness": "경미"
        }
      ],
      "nonPharmacologic": [
        "명상·호흡"
      ],
      "whenToSeekHelp": "악화·공포증"
    }
  ]
};
