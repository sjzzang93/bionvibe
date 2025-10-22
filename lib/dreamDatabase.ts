// dreamDatabase.ts
// 확장된 꿈해몽 데이터베이스 - BION • playBION

export interface EmotionalState {
  dreamMood: '긍정적' | '중립' | '부정적';
  wakeUpFeeling: '상쾌함' | '불안함' | '평온함' | '두려움';
  impactDescription: string;
}

export interface TimingInfo {
  general: string;
  bestPeriod: string;
  cautionPeriod: string;
}

export interface SituationsInfo {
  ifRecurring: string;
  ifVivid: string;
  ifNightmare: string;
}

export interface DreamResult {
  keyword: string;
  meaning: string;               // 2-3문장
  detailedMeaning: string;       // 5-6문장
  positiveAspects: string[];     // 3-5개
  negativeAspects: string[];     // 2-3개
  luckyNumber: number[];         // 6개
  advice: string;                // 2-3문장
  relatedKeywords: string[];     // 3-5개
  category: string;
  fortuneRating: number;         // 1-10
  traditionalMeaning: string;    // 한국 전통 해석
  modernMeaning: string;         // 현대 심리학 해석
  actionTips: string[];          // 3개
  emotionalState?: EmotionalState;
  timing?: TimingInfo;
  situations?: SituationsInfo;
}

const defaultEmotionalState: EmotionalState = {
  dreamMood: '중립',
  wakeUpFeeling: '평온함',
  impactDescription: '일상에 은은한 여운을 남기는 꿈의 인상입니다.'
};

const defaultTiming: TimingInfo = {
  general: '1~3개월 내 변화가 이어질 수 있습니다.',
  bestPeriod: '이번 달 중순 이후 실행에 유리합니다.',
  cautionPeriod: '과도한 확장이나 무리한 약속은 다음 달 초를 피하세요.'
};

const defaultSituations: SituationsInfo = {
  ifRecurring: '반복된다면 패턴을 메모하고 취침 루틴을 정돈하세요.',
  ifVivid: '생생했다면 메시지가 선명하다는 뜻이니 가장 기억나는 장면을 기록하세요.',
  ifNightmare: '악몽에 가깝다면 스트레스 관리와 수면 위생 개선이 우선입니다.'
};

export const dreamDatabase: Record<string, DreamResult> = {
  // =============== 동물 (Animals) ===============
  '뱀': {
    keyword: '뱀',
    meaning: '뱀은 지혜와 재생, 변화의 에너지를 상징합니다. 전통적으로 재물과 인연이 깊고 인생 전환의 신호로 여겨집니다.',
    detailedMeaning: '큰 뱀을 보거나 쫓기는 장면은 금전운과 영향력 상승을 암시합니다. 집 안에 들어오는 뱀은 재물 혹은 귀인의 방문을 뜻합니다. 흰색·황금색일수록 길몽의 성격이 강해집니다. 반대로 뱀을 죽이거나 놓치는 장면은 기회 상실의 경고입니다. 여러 마리의 뱀이 얽히면 관계나 재정의 복잡성을 시사합니다.',
    positiveAspects: ['💰 재물운 상승', '🎯 귀인 등장', '🧠 통찰력 강화', '📈 사회적 지위 상승', '🔄 새로운 시작의 신호'],
    negativeAspects: ['⚠️ 질투·음모 주의', '💔 배신 가능성', '🚫 욕심 과다로 인한 손실'],
    luckyNumber: [3, 9, 15, 21, 27, 33],
    advice: '들어오는 제안과 기회를 신중히 검토하되 과감히 실행하세요. 다만 과욕은 금물, 분산과 안전장치를 갖추면 길합니다.',
    relatedKeywords: ['용', '돈', '금색', '물', '집'],
    category: '동물',
    fortuneRating: 9,
    traditionalMeaning: '흰 뱀·황금 뱀은 최상의 길몽으로 재물과 권위를 상징합니다. 뱀이 집에 들어오거나 잡는 꿈은 횡재수를 뜻합니다.',
    modernMeaning: '무의식의 본능·창조 에너지의 표출입니다. 변화 욕구와 잠재능력의 각성을 의미합니다. 두려움은 변화 저항을 반영할 수 있습니다.',
    actionTips: ['📈 재테크 상담 받기', '🎲 소액 투자·경품 참여', '🤝 새 협업 제안 검토'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '호랑이': {
    keyword: '호랑이',
    meaning: '호랑이는 권위, 카리스마, 보호의 상징입니다. 당신의 영향력이 커지고 주도권을 잡을 시점임을 알립니다.',
    detailedMeaning: '온화한 호랑이는 든든한 후원자 또는 강력한 내적 힘을 뜻합니다. 포효하며 다가오면 승부의 때가 다가온 것입니다. 호랑이를 타거나 길들이면 조직·가정에서 리더십이 강화됩니다. 다만 호랑이에게 쫓기면 권위자와의 갈등, 과제 압박을 시사합니다. 친근하면 길, 사납고 통제 불가하면 경계가 필요합니다.',
    positiveAspects: ['👑 리더십 강화', '🏆 명예 상승', '🛡️ 강력한 보호', '🚀 프로젝트 추진력 증가'],
    negativeAspects: ['⚔️ 권위 충돌', '😰 과도한 책임 부담', '📊 무리한 확장 유혹'],
    luckyNumber: [1, 4, 10, 14, 22, 28],
    advice: '결정권을 쥘 타이밍입니다. 목표를 좁히고 핵심 과제에 집중하십시오. 권위자는 정면승부보다 협상으로 설득하세요.',
    relatedKeywords: ['사자', '산', '권위', '리더십', '명예'],
    category: '동물',
    fortuneRating: 8,
    traditionalMeaning: '산군(山君)으로 길운과 위세를 뜻합니다. 호랑이를 제압·승마하는 꿈은 큰 출세를 상징합니다.',
    modernMeaning: '자아의 힘, 자존감, 사회적 역할에 대한 욕망을 반영합니다. 공포감은 권위 문제의 불안을 나타낼 수 있습니다.',
    actionTips: ['🎯 핵심 목표 1~2개로 압축', '🤝 협상 카드 미리 준비', '📋 권한·책임의 범위 명확화'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '용': {
    keyword: '용',
    meaning: '용은 최상급 길운, 명예, 상승 기류를 뜻합니다. 막혔던 흐름이 트이고 큰 기회가 열리는 신호입니다.',
    detailedMeaning: '하늘로 오르는 용은 승진·합격·대성공의 징조입니다. 물에서 떠오르는 용은 재물운과 귀인의 도움을 암시합니다. 용을 타거나 함께 비상하면 리더십과 영향력이 크게 확장됩니다. 다만 용이 사라지거나 탑승에 실패하면 준비 부족을 점검하라는 메시지입니다.',
    positiveAspects: ['🎓 출세·승진', '💼 대규모 프로젝트 성사', '🤝 귀인 후원', '📣 명성 확대'],
    negativeAspects: ['⚠️ 준비 부족 경고', '⬇️ 과신으로 인한 추락 위험'],
    luckyNumber: [2, 8, 16, 24, 32, 40],
    advice: '큰 기회가 보일 때 실행 창을 놓치지 마세요. 다만 체크리스트로 리스크를 사전 점검하면 더 멀리 갑니다.',
    relatedKeywords: ['뱀', '하늘', '비상', '명예', '승진'],
    category: '동물',
    fortuneRating: 10,
    traditionalMeaning: '용꿈은 임금·영웅의 상징으로 큰 복록과 영화(榮華)를 뜻합니다. 임신·출산의 길조로도 전해집니다.',
    modernMeaning: '자기초월·성취 욕망의 상징입니다. 커리어 피크나 자아실현의 갈망을 반영합니다.',
    actionTips: ['🗺️ 장기 목표 로드맵 확정', '👨‍🏫 멘토·스폰서 접촉', '📝 성공 시나리오와 비상계획 동시 준비'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '개': {
    keyword: '개',
    meaning: '개는 충성, 우정, 보호를 의미합니다. 인간관계의 신뢰와 협업 운이 좋아지는 흐름입니다.',
    detailedMeaning: '활발히 꼬리를 흔드는 개는 협력의 성사가 가깝다는 신호입니다. 개에게 물리면 신뢰의 경계가 필요함을 뜻합니다. 잃어버린 개를 찾는다면 소원했던 관계 회복의 기미가 있습니다. 새끼 강아지는 새 인연과 작은 행복을 상징합니다. 개가 길 안내를 하면 귀인의 도움을 의미합니다.',
    positiveAspects: ['🤝 협업 성사', '💞 관계 회복', '🧭 귀인 가이드', '😌 심리적 안정'],
    negativeAspects: ['🚧 경계 붕괴', '⚠️ 경솔한 약속으로 인한 갈등'],
    luckyNumber: [5, 11, 17, 23, 29, 35],
    advice: '신뢰 기반의 약속을 우선하세요. 관계 경계선은 명확히, 도움에는 즉시 감사로 보답하면 운이 이어집니다.',
    relatedKeywords: ['고양이', '친구', '가족', '집', '산책'],
    category: '동물',
    fortuneRating: 7,
    traditionalMeaning: '문전의 충견은 재복과 집안의 평안을 지킨다고 해석합니다.',
    modernMeaning: '애착과 안전욕구, 사회적 지지망의 필요를 반영합니다.',
    actionTips: ['💬 관계 체크인 메시지 보내기', '📅 약속·기한 명확화', '🎁 작은 선물로 신뢰 강화'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '고양이': {
    keyword: '고양이',
    meaning: '고양이는 자존, 독립, 미묘한 직감을 상징합니다. 섬세한 경계와 자기보호가 필요한 시그널입니다.',
    detailedMeaning: '포근히 안기는 고양이는 위로·휴식의 필요를 암시합니다. 낯선 고양이가 경계하면 인간관계에서 거리 두기가 필요합니다. 검은 고양이는 미지·오해의 상징으로 소통 개선을 권합니다. 새끼 고양이는 새로운 취미·프로젝트의 기쁨을 뜻합니다. 고양이가 창가에 앉아있다면 영감의 창구가 열리는 때입니다.',
    positiveAspects: ['🎨 창의성', '🛡️ 자기보호', '🔮 섬세한 직감', '✨ 소소한 행복'],
    negativeAspects: ['🗣️ 오해·소문', '😔 감정 기복', '🚪 회피적 태도'],
    luckyNumber: [6, 12, 18, 24, 30, 36],
    advice: '개인 공간과 경계를 우선하고, 말보다 기록으로 의사를 남기세요. 감정 기복에는 수면·영양·루틴이 해답입니다.',
    relatedKeywords: ['개', '창문', '휴식', '차분', '독립'],
    category: '동물',
    fortuneRating: 6,
    traditionalMeaning: '고양이는 잡귀를 막는 동물로도 전해지며, 때로는 시샘·구설을 경계하라는 상징입니다.',
    modernMeaning: '자기효능감과 독립 욕구, 감각 민감성의 표출입니다.',
    actionTips: ['🔄 루틴 회복', '📱 디지털 디톡스', '📝 감정기록(무드로그)'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '돼지': {
    keyword: '돼지',
    meaning: '돼지는 복·재물·풍요의 대표 상징입니다. 뜻하지 않은 수입과 실속 있는 이익을 기대할 수 있습니다.',
    detailedMeaning: '토실한 돼지는 재복이 가깝다는 신호입니다. 돼지가 집으로 들어오면 큰돈의 흐름이 열립니다. 돼지저금통을 채우는 장면은 저축·자산 축적의 의지를 반영합니다. 다만 돼지가 병들었거나 더럽다면 지출 관리 경고입니다. 새끼 돼지는 소소하지만 꾸준한 수입원을 상징합니다.',
    positiveAspects: ['💰 횡재수', '💵 수입 증가', '💳 저축 강화', '📑 실속 있는 계약'],
    negativeAspects: ['💸 과소비 경고', '😴 탐욕·게으름 주의'],
    luckyNumber: [8, 12, 20, 26, 34, 42],
    advice: '수입이 늘어날수록 예산과 리밸런싱이 필수입니다. 자산 자동이체·비상금 계좌를 준비하세요.',
    relatedKeywords: ['돈', '집', '계약', '저축', '가족'],
    category: '동물',
    fortuneRating: 9,
    traditionalMeaning: '돼지꿈은 고대부터 큰 복과 재물이 들어온다는 길몽으로 전해졌습니다.',
    modernMeaning: '보상심리, 안정지향, 물질적 안락의 욕구를 반영합니다.',
    actionTips: ['💰 예산표 업데이트', '🏦 자동저축 설정', '📊 소득원 다각화 검토'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '물고기': {
    keyword: '물고기',
    meaning: '물고기는 기회, 생명력, 유연성을 상징합니다. 흐름을 타는 투자·커리어 기회를 예고합니다.',
    detailedMeaning: '살아있는 물고기를 잡거나 받으면 좋은 소식과 재물의 상징입니다. 투명한 물에서 헤엄치는 물고기는 마음의 평온과 관계의 순탄함을 뜻합니다. 죽은 물고기는 컨디션 저하·기회 소멸 경고입니다. 큰 물고기 떼는 확장과 네트워크 확대의 징후입니다.',
    positiveAspects: ['📬 호재 유입', '⛵ 관계 순항', '🌐 네트워크 확장', '🤸 유연한 대응'],
    negativeAspects: ['❌ 기회 상실', '🏥 건강·컨디션 저하'],
    luckyNumber: [7, 13, 19, 25, 31, 37],
    advice: '기회가 오면 빠르게 포착하되, 무리한 사냥은 피하세요. 수분·수면·리듬을 회복하면 운이 붙습니다.',
    relatedKeywords: ['바다', '강', '투명한 물', '그물', '배'],
    category: '동물',
    fortuneRating: 8,
    traditionalMeaning: '물고기는 다산과 풍요, 반가운 소식의 전조로 여겨집니다.',
    modernMeaning: '적응력과 감정 흐름, 사회적 연결 욕구를 반영합니다.',
    actionTips: ['📢 핵심 공고·입찰 체크', '🤝 네트워킹 1건 실천', '💧 수면·수분 루틴 잡기'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '거북이': {
    keyword: '거북이',
    meaning: '거북이는 장수, 안정, 느리지만 확실한 성장을 뜻합니다. 조급함을 내려놓을 때 결실이 익습니다.',
    detailedMeaning: '거북이를 등에 업거나 보호하면 꾸준함이 보상을 가져옵니다. 바다로 향하는 거북이는 장기 프로젝트의 순항을 의미합니다. 다만 껍질이 깨지면 안전망 점검이 필요합니다. 집으로 들어오면 집안의 평안과 재복을 암시합니다.',
    positiveAspects: ['📈 안정 성장', '🎯 장기 성공', '🏠 가정 평안', '💊 건강 회복'],
    negativeAspects: ['⏰ 지연 스트레스', '🐌 보수성 과잉'],
    luckyNumber: [4, 6, 14, 22, 30, 38],
    advice: '장기 플랜에 충실하고, 안전망(보험·비상금·백업)을 정비하세요. 지나친 속도 경쟁은 오히려 손해입니다.',
    relatedKeywords: ['바다', '집', '느림', '장수', '안전망'],
    category: '동물',
    fortuneRating: 7,
    traditionalMeaning: '장수와 복덕의 상징으로 집안의 평안을 지킨다고 해석합니다.',
    modernMeaning: '지연 허용, 자기조절, 안정 지향의 심리를 반영합니다.',
    actionTips: ['💰 비상금 재점검', '📊 장기 적립식 자산 유지', '🔒 백업·보안 점검'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '사자': {
    keyword: '사자',
    meaning: '사자는 위엄, 자존, 지도력을 상징합니다. 무대 중앙으로 나올 때가 임박했습니다.',
    detailedMeaning: '사자와 눈을 마주치면 자신감과 존재감이 강화됩니다. 새끼 사자를 보호하면 후배·자녀·팀원의 성장을 돕게 됩니다. 포효가 두렵다면 책임 과부하를 조절해야 합니다. 사자를 타거나 조련하면 영향력의 폭이 넓어집니다.',
    positiveAspects: ['✨ 존재감 상승', '👨‍🎓 후배 성장', '🎬 프로젝트 주도', '⭐ 성과 피드백 호전'],
    negativeAspects: ['😓 책임 과부하', '👔 권위적 오해'],
    luckyNumber: [3, 11, 19, 27, 35, 43],
    advice: '무대 공포를 협상·발표 연습으로 상쇄하세요. 리더십은 권한 위임과 공로 공유로 완성됩니다.',
    relatedKeywords: ['호랑이', '명예', '무대', '후배', '자존감'],
    category: '동물',
    fortuneRating: 8,
    traditionalMeaning: '왕권과 위용의 상징으로 큰 벼슬·영예를 암시합니다.',
    modernMeaning: '자기표현 욕구, 사회적 가치 인정에 대한 갈망을 반영합니다.',
    actionTips: ['🎤 발표 리허설', '📋 권한 위임 리스트 작성', '📧 성과 공유 메일 보내기'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  // =============== 자연 (Nature) ===============
  '물': {
    keyword: '물',
    meaning: '물은 감정, 재물, 생명력의 근원입니다. 맑고 투명할수록 운세가 정돈됩니다.',
    detailedMeaning: '맑은 물은 마음의 평온과 재물 흐름의 청명함을 의미합니다. 파도치는 바다는 도전·확장을 뜻하나, 탁한 물은 감정 혼탁과 지출 경고입니다. 폭우는 강렬한 감정 분출, 잔잔한 호수는 안정과 회복을 상징합니다. 물이 집에 차면 변화·이사 가능성이 있습니다.',
    positiveAspects: ['😌 정서 안정', '💰 재물 흐름 개선', '💆 회복·힐링'],
    negativeAspects: ['💥 감정 폭발', '💸 예상치 못한 지출'],
    luckyNumber: [2, 6, 14, 18, 26, 34],
    advice: '감정기록과 가계부를 병행하세요. 수분·수면 관리가 복을 부릅니다.',
    relatedKeywords: ['바다', '강', '비', '호수', '집'],
    category: '자연 현상',
    fortuneRating: 7,
    traditionalMeaning: '수(물)는 재물과 연결되어 풍요와 이익을 상징합니다.',
    modernMeaning: '정서 상태와 에너지 레벨의 은유입니다.',
    actionTips: ['💧 물 섭취 알림 설정', '📊 지출 항목 정리', '📖 정서 일기 3줄 쓰기'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '불': {
    keyword: '불',
    meaning: '불은 열정, 정화, 변혁을 상징합니다. 적절하면 추진력, 과하면 소진입니다.',
    detailedMeaning: '따뜻한 불은 치유와 의욕 회복을 뜻합니다. 불길이 커지면 야망·경쟁이 강함을 의미하지만 과열은 소진·갈등을 부릅니다. 집이 타면 큰 변화·이사·정리의 흐름, 촛불은 소망·의례·추모를 상징합니다.',
    positiveAspects: ['🔥 동기부여', '✨ 정화·리셋', '⚡ 빠른 추진'],
    negativeAspects: ['😫 소진 위험', '💢 대립·감정 폭발'],
    luckyNumber: [1, 7, 13, 22, 28, 31],
    advice: '열정의 방향을 좁히고 휴식 루틴을 반드시 끼워 넣으세요. 정리·미니멀리즘이 약이 됩니다.',
    relatedKeywords: ['집', '촛불', '태양', '정리', '변화'],
    category: '자연 현상',
    fortuneRating: 6,
    traditionalMeaning: '화(火)는 화복을 가르는 힘으로, 정화와 재앙을 함께 상징합니다.',
    modernMeaning: '동기·분노·경쟁심 등 강렬한 정서의 메타포입니다.',
    actionTips: ['🛌 주 1회 완전 휴식일', '🗑️ 정리·기부 실행', '🎯 핵심 과제 1~2개 집중'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '비': {
    keyword: '비',
    meaning: '비는 감정의 방출과 정화를 뜻합니다. 단비는 회복, 폭우는 과부하의 신호입니다.',
    detailedMeaning: '보슬비는 차분한 치유와 소통 회복을, 소나기는 빠른 사건 전개를 상징합니다. 비를 맞아도 상쾌하면 감정 카타르시스가 긍정적입니다. 장대비에 불편하면 일시적 부담을 완충하라는 메시지입니다. 무지개가 뜨면 소망 성취의 길몽입니다.',
    positiveAspects: ['💚 치유', '💬 소통 회복', '🔍 문제 해결의 단서'],
    negativeAspects: ['😢 일시적 우울', '⏸️ 계획 차질'],
    luckyNumber: [4, 9, 12, 20, 29, 33],
    advice: '감정 정화의 시간을 갖고, 가벼운 운동과 산책으로 회복을 돕세요. 일정은 여유 버퍼를 두면 순항합니다.',
    relatedKeywords: ['구름', '무지개', '우산', '하늘', '감정'],
    category: '자연 현상',
    fortuneRating: 7,
    traditionalMeaning: '단비는 길조, 장마는 근심을 상징합니다.',
    modernMeaning: '감정 방출과 스트레스 해소의 상징입니다.',
    actionTips: ['🚶 산책·우산 준비', '⏱️ 완급 조절', '📔 감사 일기 쓰기'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '눈': {
    keyword: '눈',
    meaning: '눈은 정화·순수·새 출발을 상징합니다. 새하얀 설경은 잡념을 씻고 초심으로 돌아가라는 신호입니다.',
    detailedMeaning: '포근한 눈은 휴식·화해의 분위기를, 폭설은 계획 재조정과 안전을 경고합니다. 처음 밟는 눈길은 새로운 길의 설렘을 뜻합니다. 눈사람은 유머·놀이의 회복을 의미합니다. 더러운 눈은 미해결 문제를 비춥니다.',
    positiveAspects: ['❄️ 정화', '🆕 초심 회복', '🤗 화해·온기'],
    negativeAspects: ['⏰ 일정 지연', '⚠️ 안전 문제'],
    luckyNumber: [2, 5, 14, 18, 27, 36],
    advice: '휴식과 체력 보충으로 맑은 판단을 준비하세요. 이동 일정엔 안전 여유를 더하세요.',
    relatedKeywords: ['하양', '추위', '휴식', '초심', '정리'],
    category: '자연 현상',
    fortuneRating: 7,
    traditionalMeaning: '백설은 청정과 길복, 폭설은 재앙을 경고합니다.',
    modernMeaning: '마음의 리셋과 완급 조절의 상징입니다.',
    actionTips: ['🛌 휴식일 지정', '📅 필수 일정만 유지', '🧥 난방·보온 준비'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '바다': {
    keyword: '바다',
    meaning: '바다는 무의식의 광대함과 기회의 지평을 뜻합니다. 잔잔하면 안정, 파도가 치면 도전입니다.',
    detailedMeaning: '수평선이 맑게 보이면 비전이 또렷해집니다. 폭풍우의 바다는 변화의 파고를 넘어야 함을 의미합니다. 배를 타고 항해하면 장거리 프로젝트, 유학·출장의 신호일 수 있습니다. 바닷속 잠수는 내면 탐구를 암시합니다.',
    positiveAspects: ['🔭 비전 선명', '🏄 도전의식', '✈️ 장거리 기회', '🧠 내면 통찰'],
    negativeAspects: ['🌊 변동성 스트레스', '🧭 방향 상실'],
    luckyNumber: [3, 6, 12, 24, 30, 42],
    advice: '나침반이 될 목표·가치를 다시 정리하고, 파도에 흔들리지 않게 기본 루틴을 고정하세요.',
    relatedKeywords: ['배', '물고기', '섬', '항해', '수평선'],
    category: '자연 현상',
    fortuneRating: 8,
    traditionalMeaning: '대해는 큰 복과 먼 인연을 싣고 온다고 전합니다.',
    modernMeaning: '가능성·불확실성의 공존을 의미합니다.',
    actionTips: ['🎨 비전 보드 업데이트', '✈️ 장거리 일정 점검', '🧘 명상·일지 쓰기'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  // =============== 사람/관계 (People) ===============
  '죽은 사람': {
    keyword: '죽은 사람',
    meaning: '고인은 메시지 전달자이자 마음의 미해결 과제를 상징합니다. 그리움·미안함·지혜의 재등장을 뜻합니다.',
    detailedMeaning: '따뜻한 분위기의 만남은 보호와 격려, 차가운 분위기는 정리·이별의 필요를 암시합니다. 선물을 받으면 귀인의 도움·유산·지식의 전승을 의미합니다. 말없이 바라보기만 했다면 스스로 답을 찾으라는 메시지입니다.',
    positiveAspects: ['🛡️ 보호·격려', '📚 지혜 전수', '🔄 관계 정리의 기회'],
    negativeAspects: ['💔 미련·우울', '😞 죄책감'],
    luckyNumber: [7, 14, 21, 28, 35, 42],
    advice: '감정 기록과 추모의식을 통해 마음을 정돈하세요. 미루던 연락·정리를 실천하면 풀립니다.',
    relatedKeywords: ['장례식', '선물', '사진', '편지', '조상'],
    category: '사람/관계',
    fortuneRating: 6,
    traditionalMeaning: '선영과 조상 꿈은 집안의 기별과 복덕을 상징합니다.',
    modernMeaning: '애도 작업, 회복되지 않은 감정의 표출입니다.',
    actionTips: ['✍️ 추모·감사 편지', '📞 미해결 연락하기', '📸 사진 정리'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '부모님': {
    keyword: '부모님',
    meaning: '보호·기초 가치·근원적 지지를 의미합니다. 의존과 독립의 균형을 점검하라는 신호입니다.',
    detailedMeaning: '따뜻한 식사 장면은 안정과 화합, 다툼은 경계·의사소통 재정비의 필요입니다. 선물을 받으면 지원·자원 유입, 떠나보내면 독립·자립의 과제를 나타냅니다.',
    positiveAspects: ['🎁 지원 유입', '👨‍👩‍👧‍👦 가정 화합', '💪 기본기 강화'],
    negativeAspects: ['🤝 과보호·간섭', '😓 의존성'],
    luckyNumber: [2, 10, 16, 22, 28, 34],
    advice: '감사 표현을 늘리고, 경계는 존중 있게 세우세요. 재정·건강·돌봄 계획을 투명하게 합의하면 좋습니다.',
    relatedKeywords: ['가족', '집', '식사', '선물', '독립'],
    category: '사람/관계',
    fortuneRating: 7,
    traditionalMeaning: '효(孝)와 집안 평안의 상징입니다.',
    modernMeaning: '애착·경계·자립 이슈의 조정입니다.',
    actionTips: ['💬 감사 메시지', '📋 가사·돌봄 분담표', '💰 가족 재무 회의'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '연인': {
    keyword: '연인',
    meaning: '친밀감·욕구·미래에 대한 기대와 불안을 함께 비춥니다.',
    detailedMeaning: '함께 여행하면 관계 확장, 선물을 주고받으면 교환·균형이 핵심입니다. 다툼은 소통 방식의 업그레이드를 요구합니다. 손을 잡고 걷는 장면은 속도·리듬의 일치가 관건입니다.',
    positiveAspects: ['💕 관계 진전', '🤗 상호 배려', '📅 공동 계획'],
    negativeAspects: ['💬 의사소통 오류', '😕 기대 불일치'],
    luckyNumber: [3, 6, 15, 18, 24, 33],
    advice: '요청과 경계를 "나는 메시지"로 부드럽게 표현하세요. 공동 목표 3개만 합의해도 관계가 단단해집니다.',
    relatedKeywords: ['데이트', '선물', '여행', '약속', '결혼'],
    category: '사람/관계',
    fortuneRating: 7,
    traditionalMeaning: '합환·인연의 길조로도 해석됩니다.',
    modernMeaning: '애착 유형과 의사소통 습관의 투영입니다.',
    actionTips: ['📅 주간 데이트 1회', '📝 요청·경계 리스트 작성', '📆 공동 캘린더 만들기'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '임신': {
    keyword: '임신',
    meaning: '새로운 가능성·프로젝트·관계의 잉태를 상징합니다. 단번의 성과보다 과정을 중시하세요.',
    detailedMeaning: '기쁜 임신 소식은 창조적 성취가 가까움을 뜻합니다. 불안이 크다면 준비·지원 체계 점검이 먼저입니다. 배가 단단할수록 계획의 완성도가 높습니다. 주변의 축하는 네트워크의 도움을 의미합니다.',
    positiveAspects: ['🎨 창조성 증가', '🤝 도움 유입', '🏆 장기 성취'],
    negativeAspects: ['😰 불안·부담', '⚠️ 준비 미흡'],
    luckyNumber: [1, 5, 9, 14, 20, 28],
    advice: '작게 시작하고 꾸준히 키우세요. 도움 요청은 빠를수록 좋습니다.',
    relatedKeywords: ['아기', '출산', '가족', '새 프로젝트', '돌봄'],
    category: '사람/관계',
    fortuneRating: 8,
    traditionalMeaning: '태몽은 큰 복과 출세의 상징으로 여겨집니다.',
    modernMeaning: '창조성·책임·불확실성의 공존을 반영합니다.',
    actionTips: ['🚀 MVP 만들기', '📞 도움 요청 네트워크 작성', '🗓️ 마일스톤 설정'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '아기': {
    keyword: '아기',
    meaning: '순수·새 출발·보호본능의 상징입니다. 작은 싹을 아끼고 키울 때 결실이 납니다.',
    detailedMeaning: '건강한 아기는 희망과 행운, 우는 아기는 돌봄·자원 보강을 요구합니다. 안아 달래면 회복의 신호입니다. 잃어버린 아기를 찾으면 잊었던 재능·기회를 되찾는 의미입니다.',
    positiveAspects: ['🌱 새 기회', '✨ 희망', '🔄 재능 회복'],
    negativeAspects: ['👶 돌봄 부담', '💰 자원 부족'],
    luckyNumber: [2, 7, 11, 16, 23, 31],
    advice: '작은 성취를 칭찬하고, 돌봄 루틴을 만들면 성장 곡선이 가팔라집니다.',
    relatedKeywords: ['임신', '가족', '새 프로젝트', '보호', '희망'],
    category: '사람/관계',
    fortuneRating: 8,
    traditionalMeaning: '복덩이·경사의 상징입니다.',
    modernMeaning: '취약성과 성장 욕구의 투영입니다.',
    actionTips: ['✅ 작은 목표 체크', '🆘 도움 요청', '💪 휴식·영양 관리'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  // =============== 행동 (Actions) ===============
  '날다': {
    keyword: '날다',
    meaning: '비상·해방·창의의 상징입니다. 제한을 벗어나 시야를 넓히라는 신호입니다.',
    detailedMeaning: '가볍게 날면 자신감과 역량이 충분함을, 날기 어렵거나 추락하면 준비·체력·기술의 보강이 필요합니다. 구름 위를 나르면 장기 비전과 전략적 시야가 열립니다.',
    positiveAspects: ['🕊️ 자유감', '💡 창의성 폭발', '🔭 장기 비전'],
    negativeAspects: ['⬇️ 과신 추락 위험', '💪 기술·체력 부족'],
    luckyNumber: [4, 8, 12, 16, 24, 32],
    advice: '새 아이디어를 시제품으로 낮게 띄워보세요. 안전망과 연습이 비상의 질을 높입니다.',
    relatedKeywords: ['하늘', '구름', '비상', '비행기', '자유'],
    category: '행동',
    fortuneRating: 8,
    traditionalMeaning: '승천·출세의 상징입니다.',
    modernMeaning: '자기효능감과 통제감의 확장입니다.',
    actionTips: ['🧪 파일럿 테스트', '📋 피드백 수집', '🏋️ 체력 관리'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '떨어지다': {
    keyword: '떨어지다',
    meaning: '통제 상실·불안의 표현입니다. 그러나 착지는 새로운 시작의 신호일 수 있습니다.',
    detailedMeaning: '끝없이 추락하면 과부하·번아웃의 경고입니다. 낮은 곳에 안전 착지하면 리셋의 기회입니다. 낙하산·완충 장치가 있으면 지원체계가 있다는 뜻입니다.',
    positiveAspects: ['🔄 리셋 기회', '🆘 지원체계 확인', '👁️ 현실점검'],
    negativeAspects: ['😰 불안·번아웃', '🎮 통제 상실감'],
    luckyNumber: [5, 9, 13, 17, 21, 25],
    advice: '수면·업무 강도·관계를 점검하고 완충장치를 마련하세요.',
    relatedKeywords: ['두려움', '착지', '안전망', '리셋', '지원'],
    category: '행동',
    fortuneRating: 5,
    traditionalMeaning: '실수·낮아짐의 경고로 해석됩니다.',
    modernMeaning: '스트레스와 통제감 저하의 표현입니다.',
    actionTips: ['⛔ 업무 스톱룰 설정', '🗣️ 상담·코칭', '🛌 휴식 블록'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '쫓기다': {
    keyword: '쫓기다',
    meaning: '압박·회피 이슈의 상징입니다. 마주하면 작아집니다.',
    detailedMeaning: '알 수 없는 존재에게 쫓기면 막연한 불안, 아는 사람이라면 구체 과제의 회피를 의미합니다. 숨었을 때 안도되면 잠깐의 회복이 필요합니다.',
    positiveAspects: ['👁️ 문제 인식', '⚡ 행동 촉구', '📋 우선순위 정리'],
    negativeAspects: ['🐌 지연·회피', '😵 불면·초조'],
    luckyNumber: [1, 6, 11, 16, 21, 26],
    advice: '가장 작은 한 걸음부터 착수하세요. 체크리스트가 추격자를 약화시킵니다.',
    relatedKeywords: ['도망가다', '두려움', '우선순위', '체크리스트', '압박'],
    category: '행동',
    fortuneRating: 4,
    traditionalMeaning: '액운·관재를 경고하기도 합니다.',
    modernMeaning: '불안과 회피 성향의 표출입니다.',
    actionTips: ['⏲️ 2분 행동 규칙', '✅ 할 일 3개만', '🆘 도움 요청'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  // =============== 사물/건물 (Objects/Places) ===============
  '집': {
    keyword: '집',
    meaning: '자기 자신·가정·심리적 그릇을 상징합니다. 구조·상태가 현재 컨디션을 비춥니다.',
    detailedMeaning: '밝고 넓어지면 성장·확장, 수리하면 치유·정비입니다. 물이 새면 감정 누수·재정 관리 경고, 불이 나면 대정리·이사의 신호입니다.',
    positiveAspects: ['🏠 안정', '📈 성장', '💊 치유'],
    negativeAspects: ['💧 누수·지출', '😓 대정리 스트레스'],
    luckyNumber: [3, 7, 12, 19, 28, 37],
    advice: '생활 동선을 정돈하고 꼭 필요한 물건만 남기세요. 보험·점검으로 리스크를 줄이세요.',
    relatedKeywords: ['가족', '수리', '이사', '물', '불'],
    category: '사물/건물',
    fortuneRating: 7,
    traditionalMeaning: '가화만사성, 집안 형통을 상징합니다.',
    modernMeaning: '자기관리·경계·안전 욕구의 은유입니다.',
    actionTips: ['🧹 정리·청소', '🔍 누수 점검', '📄 보험 확인'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '차': {
    keyword: '차',
    meaning: '진행력·자율성·커리어 궤도를 나타냅니다.',
    detailedMeaning: '부드럽게 운전하면 흐름이 좋습니다. 브레이크 고장·핸들 불안은 통제감 저하를 의미합니다. 동승자는 협력자·가족을 상징합니다. 길을 잃으면 목표 재설정이 필요합니다.',
    positiveAspects: ['🚗 자율성 강화', '🤝 협력 순항', '⚡ 속도감'],
    negativeAspects: ['🎮 통제 저하', '🗺️ 방향 상실'],
    luckyNumber: [2, 9, 15, 23, 31, 39],
    advice: '목표·속도를 현실에 맞추고, 점검(보험·정비)을 놓치지 마세요.',
    relatedKeywords: ['운전', '길', '내비', '가속', '정비'],
    category: '사물/건물',
    fortuneRating: 6,
    traditionalMeaning: '여행·이동·관운의 상징입니다.',
    modernMeaning: '자기결정과 커리어 경로의 은유입니다.',
    actionTips: ['🔧 정비 예약', '🗺️ 여정 계획', '🚦 속도 제한 설정'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '비행기': {
    keyword: '비행기',
    meaning: '원대한 계획·고도 상승을 뜻합니다.',
    detailedMeaning: '이륙은 시작, 순항은 안정, 난기류는 변수 대응력을 시험합니다. 착륙은 마무리·정착의 신호입니다. 환승은 전환기의 관문입니다.',
    positiveAspects: ['🚀 원대한 비전', '📈 확장', '🔄 전환 성공'],
    negativeAspects: ['🌪️ 변수 스트레스', '⏰ 지연'],
    luckyNumber: [1, 8, 16, 20, 29, 41],
    advice: '여권·비자·플랜B 같은 서류·백업을 완비하세요.',
    relatedKeywords: ['공항', '여행', '전환', '상승', '프로젝트'],
    category: '사물/건물',
    fortuneRating: 8,
    traditionalMeaning: '먼 인연·기회의 문을 상징합니다.',
    modernMeaning: '성장 욕구·전략적 확장의 은유입니다.',
    actionTips: ['✅ 체크리스트 작성', '🔄 플랜B 마련', '⏰ 일정 버퍼 확보'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  // =============== 음식 (Food) ===============
  '밥': {
    keyword: '밥',
    meaning: '기본 에너지·돌봄·공동체의 상징입니다.',
    detailedMeaning: '따뜻한 밥상은 관계 회복과 안정, 굶주림은 자원 부족을 반영합니다. 누군가와 나눠 먹으면 연대감이 강화됩니다.',
    positiveAspects: ['🍚 안정', '🤝 연대', '💚 회복'],
    negativeAspects: ['😫 자원 부족', '😴 무기력'],
    luckyNumber: [3, 5, 9, 12, 18, 27],
    advice: '규칙 식사와 수면을 회복하세요. 함께 먹는 약속이 관계를 살립니다.',
    relatedKeywords: ['가족', '식사', '돌봄', '건강', '공동체'],
    category: '음식',
    fortuneRating: 7,
    traditionalMeaning: '곡식의 충만은 복을 의미합니다.',
    modernMeaning: '기초 체력·사회적 유대 욕구의 표현입니다.',
    actionTips: ['🍽️ 규칙 식사', '🥩 단백질 보충', '👨‍👩‍👧 가족 식사 약속'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '과일': {
    keyword: '과일',
    meaning: '결실·달콤한 보상·건강을 상징합니다.',
    detailedMeaning: '잘 익은 과일은 성숙·성과를, 썩은 과일은 타이밍을 놓쳤음을 의미합니다. 씨 있는 과일은 번식·확장 가능성을 내포합니다.',
    positiveAspects: ['🎉 성과 수확', '📈 확장 가능', '💪 건강 개선'],
    negativeAspects: ['⏰ 타이밍 상실', '😞 과도한 기대'],
    luckyNumber: [4, 7, 11, 15, 22, 33],
    advice: '수확 시점과 분배 계획을 세우세요. 과욕보다 품질 관리가 우선입니다.',
    relatedKeywords: ['사과', '배', '나무', '수확', '건강'],
    category: '음식',
    fortuneRating: 8,
    traditionalMeaning: '풍년과 다산의 상징입니다.',
    modernMeaning: '성과 관리와 웰빙에 대한 욕구입니다.',
    actionTips: ['📊 성과 분배', '🔍 품질 점검', '🏥 건강검진 예약'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  // =============== 색 (Colors) ===============
  '빨강': {
    keyword: '빨강',
    meaning: '열정·사랑·경고의 양면을 지닙니다.',
    detailedMeaning: '선명한 빨강은 추진력과 매력을, 과도한 빨강은 분노·경쟁을 의미합니다. 포인트로 쓰이면 자신감 상승의 신호입니다.',
    positiveAspects: ['💃 매력 상승', '✊ 결단력', '⚡ 행동 에너지'],
    negativeAspects: ['💥 충돌', '🔥 과열'],
    luckyNumber: [1, 9, 18, 27, 36, 45],
    advice: '강한 감정은 운동·호흡으로 해소하고, 메시지는 단호하되 부드럽게 전달하세요.',
    relatedKeywords: ['불', '사랑', '경고', '열정', '결단'],
    category: '색',
    fortuneRating: 6,
    traditionalMeaning: '화(火)의 성질로 길·흉이 극단적입니다.',
    modernMeaning: '각성·주의·동기의 컬러 심리입니다.',
    actionTips: ['🏃 격한 운동 20분', '🧘 호흡 4-7-8', '✅ 짧은 결단 실행'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '파랑': {
    keyword: '파랑',
    meaning: '안정·신뢰·지적 집중을 뜻합니다.',
    detailedMeaning: '맑은 파랑은 평온과 신뢰, 어두운 남색은 깊은 사고·집중을 상징합니다. 과도하면 냉담·고립이 될 수 있습니다.',
    positiveAspects: ['😌 평온', '🧠 집중력', '🤝 신뢰도 상승'],
    negativeAspects: ['🥶 소통 냉각', '🚪 고립'],
    luckyNumber: [2, 8, 14, 20, 26, 32],
    advice: '휴식과 집중 블록을 분리하고, 감정을 적절히 표현하세요.',
    relatedKeywords: ['물', '하늘', '집중', '신뢰', '평온'],
    category: '색',
    fortuneRating: 7,
    traditionalMeaning: '청(靑)은 성장·충절을 뜻합니다.',
    modernMeaning: '안정·인지 자원의 균형을 반영합니다.',
    actionTips: ['🍅 포모도로 집중', '🚶 차분한 산책', '💬 감정 표현 연습'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  // =============== 신체 (Body) ===============
  '이빨': {
    keyword: '이빨',
    meaning: '자신감·표현력·생체 에너지의 지표입니다.',
    detailedMeaning: '이빨이 빠지면 자신감 저하·가족 건강 염려를 상징합니다. 단단하고 희면 표현력·건강 운이 좋습니다. 치료·교정은 개선 의지의 반영입니다.',
    positiveAspects: ['💪 개선 의지', '🗣️ 표현력 강화', '🏥 건강 관리'],
    negativeAspects: ['😞 자신감 저하', '😰 가족 염려'],
    luckyNumber: [3, 6, 12, 18, 24, 30],
    advice: '검진·치료를 미루지 말고, 중요한 발표·면접 준비를 강화하세요.',
    relatedKeywords: ['입', '말하기', '건강검진', '표현', '자신감'],
    category: '신체',
    fortuneRating: 5,
    traditionalMeaning: '치아 손상은 근심을, 튼튼함은 길을 뜻했습니다.',
    modernMeaning: '자기표현·건강 불안의 상징입니다.',
    actionTips: ['🦷 치과 예약', '🎤 발표 연습', '✍️ 자기긍정 문장 쓰기'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '머리카락': {
    keyword: '머리카락',
    meaning: '생명력·매력·자존감의 표현입니다.',
    detailedMeaning: '윤기 있고 풍성하면 컨디션·매력 상승, 빠지면 스트레스·영양 불균형을 시사합니다. 머리 모양 변화는 정체성 전환의 의지입니다.',
    positiveAspects: ['✨ 매력 상승', '🔄 정체성 갱신', '💪 컨디션 호전'],
    negativeAspects: ['😰 스트레스', '🍎 영양 불균형'],
    luckyNumber: [1, 5, 11, 17, 23, 29],
    advice: '수면·영양·운동으로 기반을 다지고, 과감한 스타일 변화를 즐겨도 좋습니다.',
    relatedKeywords: ['자존감', '변화', '미용', '정체성', '건강'],
    category: '신체',
    fortuneRating: 7,
    traditionalMeaning: '발(髮)은 수기(壽期)와 복덕의 상징이었습니다.',
    modernMeaning: '자기 이미지·회복력의 메타포입니다.',
    actionTips: ['🥗 영양·수면 관리', '💇 헤어케어 루틴', '✂️ 스타일 업데이트'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  },

  '돈': {
    keyword: '돈',
    meaning: '재물운이 상승하고 있습니다. 새로운 기회가 찾아올 수 있습니다.',
    detailedMeaning: '돈을 줍거나 받는 꿈은 실제 재물 운이 상승하는 강한 길몽입니다. 특히 지폐가 많을수록, 깨끗할수록 좋은 신호입니다. 돈을 세는 장면은 계획적인 재테크의 필요성을, 돈을 잃어버리는 꿈은 지출 관리의 경고를 담고 있습니다. 타인에게 돈을 주는 꿈은 베풂이 돌아올 것을 암시합니다.',
    positiveAspects: ['💰 횡재수 상승', '💼 사업 기회 도래', '📈 투자 수익 가능성', '🎁 예상치 못한 보너스'],
    negativeAspects: ['💸 과소비 유혹', '⚠️ 사기 주의'],
    luckyNumber: [7, 14, 21, 28, 35, 42],
    advice: '투자나 재테크에 관심을 가져보세요. 다만 욕심은 금물, 안전한 범위 내에서 시작하세요.',
    relatedKeywords: ['재물', '투자', '저축', '보너스', '복권'],
    category: '재물',
    fortuneRating: 9,
    traditionalMeaning: '돈은 전통적으로 복과 재물의 직접적 상징으로, 특히 줍는 꿈은 대길입니다.',
    modernMeaning: '재정적 안정과 자기 가치에 대한 욕구를 반영합니다.',
    actionTips: ['📊 재테크 상담 예약', '🎲 복권·경품 소액 참여', '💳 지출 내역 점검'],
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations
  }
};

// ===== Helper: 안전하게 추가/갱신 =====
export function upsertDream(result: DreamResult) {
  dreamDatabase[result.keyword] = {
    emotionalState: defaultEmotionalState,
    timing: defaultTiming,
    situations: defaultSituations,
    ...result
  };
}

// ===== Helper: 키워드 검색 =====
export function findDreamByKeyword(text: string): DreamResult | null {
  for (const [key, value] of Object.entries(dreamDatabase)) {
    if (text.includes(key)) {
      return value;
    }
  }
  return null;
}

// ===== Helper: 카테고리별 조회 =====
export function getDreamsByCategory(category: string): DreamResult[] {
  return Object.values(dreamDatabase).filter(dream => dream.category === category);
}

// ===== Helper: 행운 지수 상위 조회 =====
export function getTopFortunateDreams(limit: number = 10): DreamResult[] {
  return Object.values(dreamDatabase)
    .sort((a, b) => b.fortuneRating - a.fortuneRating)
    .slice(0, limit);
}
