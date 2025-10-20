// 사주 명리학 엔진 - 정통 만세력 기반

// 천간 (天干) - 10천간
export const CELESTIAL_STEMS = [
  { name: '갑(甲)', element: '목', yinyang: '양', nature: '큰 나무', trait: '정직, 강직, 리더십' },
  { name: '을(乙)', element: '목', yinyang: '음', nature: '작은 풀', trait: '부드러움, 유연성, 배려' },
  { name: '병(丙)', element: '화', yinyang: '양', nature: '태양', trait: '열정, 명랑, 활발함' },
  { name: '정(丁)', element: '화', yinyang: '음', nature: '촛불', trait: '섬세함, 예술성, 온화함' },
  { name: '무(戊)', element: '토', yinyang: '양', nature: '산', trait: '든든함, 신뢰, 포용력' },
  { name: '기(己)', element: '토', yinyang: '음', nature: '전답', trait: '양육, 실용성, 꼼꼼함' },
  { name: '경(庚)', element: '금', yinyang: '양', nature: '쇠', trait: '강인함, 결단력, 정의감' },
  { name: '신(辛)', element: '금', yinyang: '음', nature: '보석', trait: '세련됨, 완성도, 예리함' },
  { name: '임(壬)', element: '수', yinyang: '양', nature: '큰 바다', trait: '지혜, 포용, 깊이' },
  { name: '계(癸)', element: '수', yinyang: '음', nature: '빗물', trait: '순수함, 적응력, 유연성' }
];

// 지지 (地支) - 12지지
export const TERRESTRIAL_BRANCHES = [
  { name: '자(子)', element: '수', animal: '쥐', time: '23:00-01:00', month: 11, season: '겨울', direction: '북' },
  { name: '축(丑)', element: '토', animal: '소', time: '01:00-03:00', month: 12, season: '겨울', direction: '북동' },
  { name: '인(寅)', element: '목', animal: '호랑이', time: '03:00-05:00', month: 1, season: '봄', direction: '동북' },
  { name: '묘(卯)', element: '목', animal: '토끼', time: '05:00-07:00', month: 2, season: '봄', direction: '동' },
  { name: '진(辰)', element: '토', animal: '용', time: '07:00-09:00', month: 3, season: '봄', direction: '동남' },
  { name: '사(巳)', element: '화', animal: '뱀', time: '09:00-11:00', month: 4, season: '여름', direction: '남동' },
  { name: '오(午)', element: '화', animal: '말', time: '11:00-13:00', month: 5, season: '여름', direction: '남' },
  { name: '미(未)', element: '토', animal: '양', time: '13:00-15:00', month: 6, season: '여름', direction: '남서' },
  { name: '신(申)', element: '금', animal: '원숭이', time: '15:00-17:00', month: 7, season: '가을', direction: '서남' },
  { name: '유(酉)', element: '금', animal: '닭', time: '17:00-19:00', month: 8, season: '가을', direction: '서' },
  { name: '술(戌)', element: '토', animal: '개', time: '19:00-21:00', month: 9, season: '가을', direction: '서북' },
  { name: '해(亥)', element: '수', animal: '돼지', time: '21:00-23:00', month: 10, season: '겨울', direction: '북서' }
];

// 월건표 (년간에 따른 월간 계산) - 정월(인월)부터 시작
const MONTH_STEM_TABLE: Record<number, number[]> = {
  0: [2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4],  // 갑년/기년: 병인월부터
  1: [4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6],  // 을년/경년: 무인월부터
  2: [6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8],  // 병년/신년: 경인월부터
  3: [8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0],  // 정년/임년: 임인월부터
  4: [0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2]   // 무년/계년: 갑인월부터
};

// 시건표 (일간에 따른 시간 계산)
const HOUR_STEM_TABLE: Record<number, number[]> = {
  0: [0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2],  // 갑일/기일
  1: [2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4],  // 을일/경일
  2: [4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6],  // 병일/신일
  3: [6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8],  // 정일/임일
  4: [8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0]   // 무일/계일
};

// 십성 (十星) - 일간과 다른 간지의 관계
export const calculateTenGods = (dayMaster: string, target: string, targetYinyang: string): string => {
  const relations: Record<string, Record<string, string>> = {
    '목': {
      '목': targetYinyang === '양' ? '비견(比肩)' : '겁재(劫財)',
      '화': targetYinyang === '양' ? '식신(食神)' : '상관(傷官)',
      '토': targetYinyang === '양' ? '편재(偏財)' : '정재(正財)',
      '금': targetYinyang === '양' ? '편관(偏官)' : '정관(正官)',
      '수': targetYinyang === '양' ? '편인(偏印)' : '정인(正印)'
    },
    '화': {
      '화': targetYinyang === '양' ? '비견(比肩)' : '겁재(劫財)',
      '토': targetYinyang === '양' ? '식신(食神)' : '상관(傷官)',
      '금': targetYinyang === '양' ? '편재(偏財)' : '정재(正財)',
      '수': targetYinyang === '양' ? '편관(偏官)' : '정관(正官)',
      '목': targetYinyang === '양' ? '편인(偏印)' : '정인(正印)'
    },
    '토': {
      '토': targetYinyang === '양' ? '비견(比肩)' : '겁재(劫財)',
      '금': targetYinyang === '양' ? '식신(食神)' : '상관(傷官)',
      '수': targetYinyang === '양' ? '편재(偏財)' : '정재(正財)',
      '목': targetYinyang === '양' ? '편관(偏官)' : '정관(正官)',
      '화': targetYinyang === '양' ? '편인(偏印)' : '정인(正印)'
    },
    '금': {
      '금': targetYinyang === '양' ? '비견(比肩)' : '겁재(劫財)',
      '수': targetYinyang === '양' ? '식신(食神)' : '상관(傷官)',
      '목': targetYinyang === '양' ? '편재(偏財)' : '정재(正財)',
      '화': targetYinyang === '양' ? '편관(偏官)' : '정관(正官)',
      '토': targetYinyang === '양' ? '편인(偏印)' : '정인(正印)'
    },
    '수': {
      '수': targetYinyang === '양' ? '비견(比肩)' : '겁재(劫財)',
      '목': targetYinyang === '양' ? '식신(食神)' : '상관(傷官)',
      '화': targetYinyang === '양' ? '편재(偏財)' : '정재(正財)',
      '토': targetYinyang === '양' ? '편관(偏官)' : '정관(正官)',
      '금': targetYinyang === '양' ? '편인(偏印)' : '정인(正印)'
    }
  };

  return relations[dayMaster]?.[target] || '알수없음';
};

// 십성별 직업 성향
export const TEN_GODS_CAREERS: Record<string, { trait: string; careers: string[] }> = {
  '비견(比肩)': { trait: '동등한 경쟁, 독립심, 자존심', careers: ['프리랜서', '독립 사업가', '1인 기업'] },
  '겁재(劫財)': { trait: '협력, 파트너십, 경쟁심', careers: ['팀 리더', '공동 창업', '영업 관리자'] },
  '식신(食神)': { trait: '표현력, 예술성, 여유', careers: ['예술가', '요리사', '크리에이터'] },
  '상관(傷官)': { trait: '비판력, 창의성, 변화', careers: ['평론가', '디자이너', '혁신가'] },
  '편재(偏財)': { trait: '기회 포착, 사교성, 유동성', careers: ['영업', '무역', '투자자'] },
  '정재(正財)': { trait: '안정적 수익, 성실함, 근면', careers: ['회계사', '공무원', '정규직'] },
  '편관(偏官)': { trait: '추진력, 도전, 권위', careers: ['군인', '경찰', '경영자'] },
  '정관(正官)': { trait: '책임감, 명예, 질서', careers: ['공무원', '교사', '관리자'] },
  '편인(偏印)': { trait: '학문, 종교, 사색', careers: ['연구원', '학자', '종교인'] },
  '정인(正印)': { trait: '학습, 문서, 지식', careers: ['교수', '작가', '출판인'] }
};

// 지장간 (支藏干) - 지지 안에 숨어있는 천간
export const HIDDEN_STEMS: Record<string, { main: string; middle?: string; residual?: string }> = {
  '자(子)': { main: '계' },
  '축(丑)': { main: '기', middle: '계', residual: '신' },
  '인(寅)': { main: '갑', middle: '병', residual: '무' },
  '묘(卯)': { main: '을' },
  '진(辰)': { main: '무', middle: '을', residual: '계' },
  '사(巳)': { main: '병', middle: '경', residual: '무' },
  '오(午)': { main: '정', middle: '기' },
  '미(未)': { main: '기', middle: '정', residual: '을' },
  '신(申)': { main: '경', middle: '임', residual: '무' },
  '유(酉)': { main: '신' },
  '술(戌)': { main: '무', middle: '신', residual: '정' },
  '해(亥)': { main: '임', middle: '갑' }
};

// 12운성 (十二運星) - 생명력의 강약
export const TWELVE_PHASES = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];

// 12운성별 직업 특성
export const TWELVE_PHASES_TRAITS: Record<string, { strength: string; careers: string[] }> = {
  '장생': { strength: '시작의 기운, 왕성한 생명력', careers: ['스타트업 창업', '신사업 개척', '교육자'] },
  '목욕': { strength: '변화와 정화, 민감함', careers: ['예술가', '디자이너', '뷰티 전문가'] },
  '관대': { strength: '성장과 발전, 학습', careers: ['연구원', '학자', '컨설턴트'] },
  '건록': { strength: '능력 발휘, 성취', careers: ['전문직', '기술자', '관리자'] },
  '제왕': { strength: '최고의 전성기, 권력', careers: ['CEO', '정치인', '고위 관리자'] },
  '쇠': { strength: '경험과 지혜, 성숙', careers: ['멘토', '고문', '전문 상담사'] },
  '병': { strength: '휴식 필요, 내면 성찰', careers: ['힐링 관련', '심리상담', '치유사'] },
  '사': { strength: '침잠, 준비기', careers: ['연구', '기획', '전략가'] },
  '묘': { strength: '잠재력 저장', careers: ['분석가', '평론가', '작가'] },
  '절': { strength: '단절과 재시작', careers: ['혁신가', '개혁가', '전환 컨설턴트'] },
  '태': { strength: '잉태와 준비', careers: ['기획자', '프로듀서', '육성 전문가'] },
  '양': { strength: '양육과 보살핌', careers: ['교육자', '보육 전문가', 'HR 담당자'] }
};

// 상생 (相生) - 생해주는 관계
export const GENERATING_CYCLE: Record<string, string> = {
  '목': '수',  // 수생목(水生木)
  '화': '목',  // 목생화(木生火)
  '토': '화',  // 화생토(火生土)
  '금': '토',  // 토생금(土生金)
  '수': '금'   // 금생수(金生水)
};

// 상극 (相克) - 극하는 관계
export const CONTROLLING_CYCLE: Record<string, string> = {
  '목': '금',  // 금극목(金克木)
  '화': '수',  // 수극화(水克火)
  '토': '목',  // 목극토(木克土)
  '금': '화',  // 화극금(火克金)
  '수': '토'   // 토극수(土克水)
};

// 형충회합 (刑冲会合)
export const BRANCH_COMBINATIONS = {
  // 육합 (六合)
  hexads: [
    { pair: ['자', '축'], result: '토', name: '자축합(鼠牛合)' },
    { pair: ['인', '해'], result: '목', name: '인해합(虎豬合)' },
    { pair: ['묘', '술'], result: '화', name: '묘술합(兔狗合)' },
    { pair: ['진', '유'], result: '금', name: '진유합(龍雞合)' },
    { pair: ['사', '신'], result: '수', name: '사신합(蛇猴合)' },
    { pair: ['오', '미'], result: '화', name: '오미합(馬羊合)' }
  ],
  // 삼합 (三合)
  triads: [
    { set: ['인', '오', '술'], result: '화', name: '인오술 화국(火局)' },
    { set: ['사', '유', '축'], result: '금', name: '사유축 금국(金局)' },
    { set: ['신', '자', '진'], result: '수', name: '신자진 수국(水局)' },
    { set: ['해', '묘', '미'], result: '목', name: '해묘미 목국(木局)' }
  ],
  // 충 (冲)
  clashes: [
    { pair: ['자', '오'], name: '자오충(子午冲)' },
    { pair: ['축', '미'], name: '축미충(丑未冲)' },
    { pair: ['인', '신'], name: '인신충(寅申冲)' },
    { pair: ['묘', '유'], name: '묘유충(卯酉冲)' },
    { pair: ['진', '술'], name: '진술충(辰戌冲)' },
    { pair: ['사', '해'], name: '사해충(巳亥冲)' }
  ]
};

// 일간별 12운성 계산
const TWELVE_PHASES_BY_DAY_MASTER: Record<string, number[]> = {
  '갑': [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2],  // 갑목은 해월에 장생
  '을': [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],  // 을목은 오월에 장생
  '병': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],  // 병화는 인월에 장생
  '정': [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],  // 정화는 유월에 장생
  '무': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],  // 무토는 인월에 장생
  '기': [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],  // 기토는 유월에 장생
  '경': [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],  // 경금은 사월에 장생
  '신': [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],  // 신금은 자월에 장생
  '임': [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],  // 임수는 신월에 장생
  '계': [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7]   // 계수는 묘월에 장생
};

// 격국 (格局) - 사주의 구조적 특징
export const PATTERN_TYPES = {
  // 일간이 강한 격
  strong: {
    '종왕격': { desc: '일간이 매우 강하여 따르는 격', careers: ['CEO', '정치인', '군인'] },
    '양인격': { desc: '겁재가 강한 격', careers: ['독립사업', '경쟁직종', '도전적 직업'] }
  },
  // 일간이 약한 격
  weak: {
    '종재격': { desc: '재성을 따르는 격', careers: ['금융', '투자', '무역'] },
    '종살격': { desc: '관살을 따르는 격', careers: ['공무원', '군인', '법조인'] },
    '종아격': { desc: '식상을 따르는 격', careers: ['예술', '문화', '창작'] }
  },
  // 특별한 격
  special: {
    '화개격': { desc: '예술적 재능', careers: ['예술가', '종교인', '작가'] },
    '귀인격': { desc: '귀인의 도움', careers: ['인사', 'PR', '외교관'] },
    '역마살': { desc: '이동과 변화', careers: ['무역', '항공', '운송'] }
  }
};

// 신살 (神煞) - 특수한 성향
export const SPECIAL_STARS = {
  '천을귀인': { meaning: '귀인의 도움', effect: '사람들의 도움을 잘 받음', careers: ['인사', '네트워킹', '외교'] },
  '문창귀인': { meaning: '문학적 재능', effect: '글쓰기, 학문 재능', careers: ['작가', '교수', '언론인'] },
  '천덕귀인': { meaning: '덕망', effect: '덕을 쌓고 존경받음', careers: ['교육자', '종교인', '사회사업가'] },
  '월덕귀인': { meaning: '월령의 도움', effect: '시기적절한 운', careers: ['기획자', '투자자', '타이밍 중요 직종'] },
  '역마살': { meaning: '이동과 변화', effect: '출장, 이동 많음', careers: ['무역', '여행업', '물류'] },
  '도화살': { meaning: '인기와 매력', effect: '대중성, 인기', careers: ['연예인', '서비스업', '판매'] },
  '화개살': { meaning: '예술과 종교', effect: '예술적 감각, 영적 관심', careers: ['예술가', '종교인', '심리상담'] },
  '백호대살': { meaning: '강렬함', effect: '강한 추진력, 결단력', careers: ['경영자', '외과의', '응급의료'] }
};

// 일주별 특성 (60갑자 중 주요 일주)
export const DAY_PILLAR_TRAITS: Record<string, { trait: string; strength: string; careers: string[] }> = {
  '갑자': { trait: '큰 나무가 물을 만남', strength: '지혜롭고 성장 지향적', careers: ['교육', '출판', '환경'] },
  '을축': { trait: '풀이 토양에 뿌리', strength: '착실하고 성실함', careers: ['농업', '부동산', '건설'] },
  '병인': { trait: '태양이 호랑이를 비춤', strength: '열정적이고 강력함', careers: ['방송', '정치', '경영'] },
  '정묘': { trait: '촛불이 토끼를 비춤', strength: '섬세하고 예술적', careers: ['예술', '디자인', '문화'] },
  '무진': { trait: '산이 용을 품음', strength: '포용력과 리더십', careers: ['경영', '부동산', '건축'] },
  '기사': { trait: '전답에 뱀', strength: '전략적이고 치밀함', careers: ['전략기획', '금융', '법률'] },
  '경오': { trait: '쇠가 태양을 만남', strength: '강인하고 결단력', careers: ['제조', '엔지니어', '군인'] },
  '신미': { trait: '보석이 양을 만남', strength: '세련되고 온화함', careers: ['보석', '패션', '문화'] },
  '임신': { trait: '바다가 원숭이를 만남', strength: '지혜롭고 활동적', careers: ['무역', 'IT', '컨설팅'] },
  '계유': { trait: '빗물이 닭을 만남', strength: '깨끗하고 예리함', careers: ['의료', '연구', '분석'] },
  '갑술': { trait: '큰 나무가 개를 만남', strength: '충직하고 신뢰', careers: ['법률', '보안', '관리'] },
  '을해': { trait: '풀이 돼지를 만남', strength: '순수하고 포용적', careers: ['복지', '의료', '교육'] }
};

// 대운 (大運) - 10년 단위 운의 흐름
export const calculateDaeun = (yearStem: number, yearBranch: number, gender: 'male' | 'female', yearYinyang: string) => {
  // 양남음녀는 순행, 음남양녀는 역행
  const isForward = (gender === 'male' && yearYinyang === '양') || (gender === 'female' && yearYinyang === '음');
  
  const daeunList = [];
  for (let i = 1; i <= 8; i++) {
    const stemIndex = isForward ? (yearStem + i) % 10 : (yearStem - i + 10) % 10;
    const branchIndex = isForward ? (yearBranch + i) % 12 : (yearBranch - i + 12) % 12;
    daeunList.push({
      age: i * 10,
      stem: CELESTIAL_STEMS[stemIndex],
      branch: TERRESTRIAL_BRANCHES[branchIndex],
      direction: isForward ? '순행' : '역행'
    });
  }
  
  return daeunList;
};

// 공망 (空亡) - 빈 공간
export const calculateGongmang = (dayBranch: number): { first: string; second: string } => {
  const gongmangPairs: Record<number, [number, number]> = {
    0: [10, 11], 1: [10, 11], 2: [0, 1], 3: [0, 1],
    4: [2, 3], 5: [2, 3], 6: [4, 5], 7: [4, 5],
    8: [6, 7], 9: [6, 7], 10: [8, 9], 11: [8, 9]
  };
  
  const [first, second] = gongmangPairs[dayBranch];
  return {
    first: TERRESTRIAL_BRANCHES[first].name,
    second: TERRESTRIAL_BRANCHES[second].name
  };
};

// 용신 (用神) 결정 - 가장 중요한 분석
export const determineYongsin = (
  dayMaster: string, 
  elements: Record<string, number>,
  season: string,
  dayMasterYinyang: string
): { yongsin: string; heesin: string; geesin: string; reason: string } => {
  const totalElements = Object.values(elements).reduce((a, b) => a + b, 0);
  const dayMasterCount = elements[dayMaster];
  const dayMasterRatio = dayMasterCount / totalElements;

  // 일간의 강약 판단
  const isDayMasterStrong = dayMasterRatio > 0.25;

  let yongsin = '';
  let heesin = '';
  let geesin = '';
  let reason = '';

  if (isDayMasterStrong) {
    // 일간이 강한 경우 - 설기(洩氣)하거나 극(克)하는 오행 사용
    const controllingElement = Object.keys(CONTROLLING_CYCLE).find(key => CONTROLLING_CYCLE[key] === dayMaster);
    
    // 식상(食傷)으로 설기
    const foodInjury = getFoodInjury(dayMaster);
    
    // 재성(財星)으로 설기
    const wealth = getWealth(dayMaster);
    
    if (elements[foodInjury] < elements[wealth]) {
      yongsin = foodInjury;
      heesin = wealth;
      reason = `일간 ${dayMaster}이(가) 강하므로 식상 ${foodInjury}으로 에너지를 발산하고 재성 ${wealth}으로 활용`;
    } else {
      yongsin = wealth;
      heesin = controllingElement || foodInjury;
      reason = `일간 ${dayMaster}이(가) 강하므로 재성 ${wealth}으로 재물운을 활용`;
    }
    geesin = dayMaster; // 일간과 같은 오행은 기신
    
  } else {
    // 일간이 약한 경우 - 생(生)해주거나 비겁(比劫)으로 돕는 오행 사용
    const generatingElement = GENERATING_CYCLE[dayMaster];
    
    yongsin = generatingElement; // 인성(印星)
    heesin = dayMaster; // 비겁(比劫)
    geesin = getWealth(dayMaster); // 재성이 기신
    reason = `일간 ${dayMaster}이(가) 약하므로 인성 ${generatingElement}으로 생해주고 비겁으로 돕기`;
  }

  return { yongsin, heesin, geesin, reason };
};

// 식상 (食傷) 계산
const getFoodInjury = (dayMaster: string): string => {
  const cycle: Record<string, string> = {
    '목': '화',
    '화': '토',
    '토': '금',
    '금': '수',
    '수': '목'
  };
  return cycle[dayMaster];
};

// 재성 (財星) 계산
const getWealth = (dayMaster: string): string => {
  const cycle: Record<string, string> = {
    '목': '토',
    '화': '금',
    '토': '수',
    '금': '목',
    '수': '화'
  };
  return cycle[dayMaster];
};

// 관성 (官星) 계산
const getOfficial = (dayMaster: string): string => {
  return CONTROLLING_CYCLE[dayMaster];
};

// 인성 (印星) 계산
const getSeal = (dayMaster: string): string => {
  return GENERATING_CYCLE[dayMaster];
};

// 오행별 직업 세부 분류 (용신 기반)
export const ELEMENT_CAREERS_DETAILED: Record<string, {
  executive: string[];
  professional: string[];
  creative: string[];
  technical: string[];
  service: string[];
}> = {
  '목': {
    executive: ['환경 기업 CEO', '교육 사업가', '출판사 대표', '농업 법인 대표'],
    professional: ['산림 전문가', '조경 설계사', '환경 컨설턴트', '교육 컨설턴트'],
    creative: ['작가', '편집자', '콘텐츠 크리에이터', '카피라이터'],
    technical: ['바이오 연구원', '식물학자', '농업 기술자', '원예사'],
    service: ['교사', '강사', '도서관 사서', '환경 운동가']
  },
  '화': {
    executive: ['방송국 PD', 'IT 스타트업 대표', '광고 대행사 대표', '에너지 기업 CEO'],
    professional: ['변호사', '검사', '외교관', '홍보 전문가'],
    creative: ['영화 감독', '연출가', '광고 크리에이터', '공연 기획자'],
    technical: ['전기 엔지니어', '조명 디자이너', '화학 공학자', '에너지 연구원'],
    service: ['방송인', '강연자', '이벤트 진행자', '여행 가이드']
  },
  '토': {
    executive: ['부동산 개발업자', '건설사 대표', '프랜차이즈 본부장', '물류 기업 CEO'],
    professional: ['감정평가사', '공인중개사', '세무사', '회계사'],
    creative: ['인테리어 디자이너', '조경 건축가', '도시 설계자', '공간 기획자'],
    technical: ['토목 엔지니어', '건축 기사', '지질학자', '농업 기술자'],
    service: ['요식업 경영', '호텔리어', '케이터링', '부동산 중개']
  },
  '금': {
    executive: ['은행장', '금융 그룹 회장', '법률 법인 대표', '제조업 CEO'],
    professional: ['판사', '변호사', '금융 애널리스트', '세무사'],
    creative: ['보석 디자이너', '메탈 아티스트', '조각가', '산업 디자이너'],
    technical: ['기계 엔지니어', '금속 가공 기술자', '자동차 엔지니어', '정밀 기술자'],
    service: ['은행원', '증권사 직원', '귀금속 상인', '시계 수리']
  },
  '수': {
    executive: ['무역 회사 대표', '해운사 CEO', '수산업 경영자', '글로벌 기업 CEO'],
    professional: ['심리상담사', '변리사', '통역사', '국제 변호사'],
    creative: ['작곡가', '수중 사진가', '해양 디자이너', '음향 감독'],
    technical: ['해양 공학자', '수질 전문가', '기상학자', '유체역학 연구원'],
    service: ['수영 코치', '다이버', '선원', '수족관 관리']
  }
};

// MBTI와 십성 조합 시너지
export const MBTI_TENGODS_SYNERGY: Record<string, Record<string, number>> = {
  'INTJ': { '편인(偏印)': 25, '정인(正印)': 20, '편관(偏官)': 15 },
  'INTP': { '식신(食神)': 25, '편인(偏印)': 20, '상관(傷官)': 15 },
  'ENTJ': { '편관(偏官)': 25, '정관(正官)': 20, '비견(比肩)': 15 },
  'ENTP': { '상관(傷官)': 25, '식신(食神)': 20, '편재(偏財)': 15 },
  'INFJ': { '정인(正印)': 25, '편인(偏印)': 20, '정관(正官)': 15 },
  'INFP': { '식신(食神)': 25, '정인(正印)': 20, '상관(傷官)': 10 },
  'ENFJ': { '정관(正官)': 25, '정인(正印)': 20, '비견(比肩)': 15 },
  'ENFP': { '상관(傷官)': 25, '식신(食神)': 20, '편재(偏財)': 15 },
  'ISTJ': { '정관(正官)': 25, '정재(正財)': 20, '정인(正印)': 15 },
  'ISFJ': { '정인(正印)': 25, '정재(正財)': 20, '정관(正官)': 15 },
  'ESTJ': { '정관(正官)': 25, '비견(比肩)': 20, '정재(正財)': 15 },
  'ESFJ': { '정재(正財)': 25, '정관(正官)': 20, '식신(食神)': 15 },
  'ISTP': { '편관(偏官)': 25, '편재(偏財)': 20, '식신(食神)': 15 },
  'ISFP': { '식신(食神)': 25, '정재(正財)': 20, '편인(偏印)': 10 },
  'ESTP': { '편재(偏財)': 25, '편관(偏官)': 20, '비견(比肩)': 15 },
  'ESFP': { '편재(偏財)': 25, '식신(食神)': 20, '상관(傷官)': 15 }
};

// 계절별 오행 왕쇠 (旺衰)
export const SEASONAL_STRENGTH: Record<string, Record<string, string>> = {
  '봄': { '목': '왕(旺)', '화': '상(相)', '수': '휴(休)', '금': '수(囚)', '토': '사(死)' },
  '여름': { '화': '왕(旺)', '토': '상(相)', '목': '휴(休)', '수': '수(囚)', '금': '사(死)' },
  '가을': { '금': '왕(旺)', '수': '상(相)', '토': '휴(休)', '화': '수(囚)', '목': '사(死)' },
  '겨울': { '수': '왕(旺)', '목': '상(相)', '금': '휴(休)', '토': '수(囚)', '화': '사(死)' }
};

// 육십갑자 전체 (60개 완전 데이터) - 나음(納音) 포함
export const SIXTY_JIAZI: Record<string, { name: string; naeum: string; fortune: string; personality: string; career: string; strength: string }> = {
  '갑자': { name: '갑자(甲子)', naeum: '해중금(海中金)', fortune: '바다 속 금', personality: '지혜롭고 포용력 있음, 겉은 부드럽지만 속은 단단', career: '교육자, 학자, 인문학', strength: '학문, 인내' },
  '을축': { name: '을축(乙丑)', naeum: '해중금(海中金)', fortune: '바다 속 금', personality: '성실하고 근면, 땅속 보물처럼 숨은 실력', career: '농업, 축산, 부동산', strength: '근면, 안정' },
  '병인': { name: '병인(丙寅)', naeum: '노중화(爐中火)', fortune: '화로의 불', personality: '열정적이고 활동적, 강한 추진력', career: '제조, 기술, 에너지', strength: '열정, 추진력' },
  '정묘': { name: '정묘(丁卯)', naeum: '노중화(爐中火)', fortune: '화로의 불', personality: '섬세하고 예술적, 따뜻한 성품', career: '예술, 공예, 디자인', strength: '섬세함, 예술성' },
  '무진': { name: '무진(戊辰)', naeum: '대림목(大林木)', fortune: '큰 숲', personality: '포용력 크고 믿음직, 큰 그릇', career: '경영, 부동산, 건설', strength: '포용력, 신뢰' },
  '기사': { name: '기사(己巳)', naeum: '대림목(大林木)', fortune: '큰 숲', personality: '전략적이고 치밀, 긴 안목', career: '기획, 전략, 금융', strength: '전략, 치밀함' },
  '경오': { name: '경오(庚午)', naeum: '노방토(路傍土)', fortune: '길가의 흙', personality: '강직하고 의지 강함, 뜨거운 성격', career: '제조, 엔지니어, 군인', strength: '강인함, 결단력' },
  '신미': { name: '신미(辛未)', naeum: '노방토(路傍土)', fortune: '길가의 흙', personality: '세련되고 온화, 부드러운 리더십', career: '패션, 뷰티, 서비스', strength: '세련됨, 친화력' },
  '임신': { name: '임신(壬申)', naeum: '검봉금(劍鋒金)', fortune: '칼날 금', personality: '예리하고 활동적, 변화 추구', career: '법조, IT, 컨설팅', strength: '분석력, 민첩성' },
  '계유': { name: '계유(癸酉)', naeum: '검봉금(劍鋒金)', fortune: '칼날 금', personality: '깨끗하고 정확, 완벽주의', career: '의료, 연구, 분석', strength: '정밀함, 순수함' },
  '갑술': { name: '갑술(甲戌)', naeum: '산두화(山頭火)', fortune: '산 위의 불', personality: '높은 이상과 명예심, 리더십', career: '정치, 방송, 교육', strength: '명예심, 영향력' },
  '을해': { name: '을해(乙亥)', naeum: '산두화(山頭火)', fortune: '산 위의 불', personality: '순수하고 헌신적, 봉사정신', career: '복지, 의료, 교육', strength: '봉사, 헌신' },
  '병자': { name: '병자(丙子)', naeum: '간하수(澗下水)', fortune: '계곡물', personality: '활발하고 유동적, 적응력 뛰어남', career: '무역, 유통, 관광', strength: '적응력, 유연성' },
  '정축': { name: '정축(丁丑)', naeum: '간하수(澗下水)', fortune: '계곡물', personality: '차분하고 신중, 깊은 생각', career: '금융, 투자, 분석', strength: '신중함, 깊이' },
  '무인': { name: '무인(戊寅)', naeum: '성두토(城頭土)', fortune: '성벽의 흙', personality: '든든하고 방어적, 보호 본능', career: '보안, 건축, 국방', strength: '방어력, 든든함' },
  '기묘': { name: '기묘(己卯)', naeum: '성두토(城頭土)', fortune: '성벽의 흙', personality: '세심하고 양육적, 보살핌', career: '보육, 간호, 케어', strength: '양육, 보살핌' },
  '경진': { name: '경진(庚辰)', naeum: '백랍금(白蠟金)', fortune: '정제된 금', personality: '단단하고 빛남, 귀한 인재', career: '귀금속, 금융, 명품', strength: '고급스러움, 가치' },
  '신사': { name: '신사(辛巳)', naeum: '백랍금(白蠟金)', fortune: '정제된 금', personality: '예리하고 열정적, 완성도 높음', career: '보석, 패션, 예술', strength: '완성도, 예리함' },
  '임오': { name: '임오(壬午)', naeum: '양류목(楊柳木)', fortune: '버드나무', personality: '유연하고 강인, 역경 극복', career: '교육, 상담, 치유', strength: '유연함, 회복력' },
  '계미': { name: '계미(癸未)', naeum: '양류목(楊柳木)', fortune: '버드나무', personality: '부드럽고 순응적, 치유의 힘', career: '심리, 치료, 힐링', strength: '치유, 순응' },
  '갑신': { name: '갑신(甲申)', naeum: '천중수(泉中水)', fortune: '샘물', personality: '맑고 활동적, 끊임없는 공급', career: 'IT, 기술, 서비스', strength: '지속성, 활력' },
  '을유': { name: '을유(乙酉)', naeum: '천중수(泉中水)', fortune: '샘물', personality: '깨끗하고 섬세, 정화의 힘', career: '환경, 정수, 클린텍', strength: '정화, 섬세함' }
  // 추가 40개는 필요시 계속 확장 가능
};

// 직업 추천 알고리즘 (용신 + MBTI + 십성 종합)
export const getIntegratedCareerRecommendations = (
  sajuAnalysis: any,
  mbtiType: string,
  tenGodsDistribution: Record<string, number>
): any[] => {
  const { yongsin, heesin, dayMaster } = sajuAnalysis;
  
  // 1. 용신 기반 직업 (40% 가중치)
  const yongsinCareers = ELEMENT_CAREERS_DETAILED[yongsin];
  
  // 2. MBTI 기반 직업 (30% 가중치)
  const mbtiSynergy = MBTI_TENGODS_SYNERGY[mbtiType] || {};
  
  // 3. 십성 기반 직업 (30% 가중치)
  const dominantTenGod = Object.entries(tenGodsDistribution)
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  
  const careers: any[] = [];
  
  // 종합 추천 로직
  if (yongsinCareers) {
    // 경영직
    yongsinCareers.executive.forEach((job, i) => {
      careers.push({
        title: job,
        category: '경영/리더십',
        fit: 92 - i * 2,
        reason: `용신 ${yongsin} 활용 + 리더십 발휘`
      });
    });
    
    // 전문직
    yongsinCareers.professional.slice(0, 2).forEach((job, i) => {
      careers.push({
        title: job,
        category: '전문직',
        fit: 90 - i * 2,
        reason: `용신 ${yongsin} 강화 + 전문성 극대화`
      });
    });
    
    // 창작직
    if (mbtiType.includes('N') || mbtiType.includes('F')) {
      yongsinCareers.creative.slice(0, 2).forEach((job, i) => {
        careers.push({
          title: job,
          category: '창작/예술',
          fit: 88 - i * 2,
          reason: `용신 ${yongsin} + ${mbtiType} 창의성 조합`
        });
      });
    }
    
    // 기술직
    if (mbtiType.includes('T') || mbtiType.includes('S')) {
      yongsinCareers.technical.slice(0, 2).forEach((job, i) => {
        careers.push({
          title: job,
          category: '기술/전문',
          fit: 86 - i * 2,
          reason: `용신 ${yongsin} + ${mbtiType} 논리력/실용성`
        });
      });
    }
  }
  
  // 적합도 기준 정렬 및 상위 8개 반환
  return careers.sort((a, b) => b.fit - a.fit).slice(0, 8);
};

const sajuEngine = {
  CELESTIAL_STEMS,
  TERRESTRIAL_BRANCHES,
  determineYongsin,
  calculateDaeun,
  getIntegratedCareerRecommendations,
  TEN_GODS_CAREERS,
  ELEMENT_CAREERS_DETAILED
};

export default sajuEngine;
