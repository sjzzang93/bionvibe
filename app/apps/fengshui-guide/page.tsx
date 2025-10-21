'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Home, CheckSquare, BookOpen, MapPin, Building2, Lightbulb, FileText } from 'lucide-react';

export default function FengshuiGuidePage() {
  const [activeTab, setActiveTab] = useState<'theory' | 'practice' | 'checklist' | 'cases' | 'tools' | 'faq'>('theory');
  const [checklistScores, setChecklistScores] = useState<Record<string, boolean>>({});

  // 체크리스트 점수 계산
  const calculateScore = (category: string) => {
    const categoryItems = Object.keys(checklistScores).filter(k => k.startsWith(category));
    const checked = categoryItems.filter(k => checklistScores[k]).length;
    return { checked, total: categoryItems.length, score: (checked / categoryItems.length * 100) || 0 };
  };

  const toggleCheck = (id: string) => {
    setChecklistScores(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900 dark:via-yellow-900 dark:to-orange-900 transition-colors" suppressHydrationWarning>
      {/* 헤더 */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-amber-200 dark:border-amber-700 sticky top-0 z-50" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">홈으로</span>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              🏠 풍수지리 실전 도감
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              과학적 해석과 체크리스트로 배우는 현대 풍수 (2025년판)
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" suppressHydrationWarning>
            <TabButton icon={<BookOpen className="w-4 h-4" />} label="핵심 이론" active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} />
            <TabButton icon={<Building2 className="w-4 h-4" />} label="실전 적용" active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} />
            <TabButton icon={<CheckSquare className="w-4 h-4" />} label="진단 체크" active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} />
            <TabButton icon={<MapPin className="w-4 h-4" />} label="케이스" active={activeTab === 'cases'} onClick={() => setActiveTab('cases')} />
            <TabButton icon={<Lightbulb className="w-4 h-4" />} label="빠른 진단" active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} />
            <TabButton icon={<FileText className="w-4 h-4" />} label="FAQ" active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8" suppressHydrationWarning>
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'practice' && <PracticeSection />}
        {activeTab === 'checklist' && <ChecklistSection checklistScores={checklistScores} toggleCheck={toggleCheck} calculateScore={calculateScore} />}
        {activeTab === 'cases' && <CasesSection />}
        {activeTab === 'tools' && <ToolsSection checklistScores={checklistScores} toggleCheck={toggleCheck} />}
        {activeTab === 'faq' && <FAQSection />}
      </main>
    </div>
  );
}

// 탭 버튼 컴포넌트
function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
        active
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-gray-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Part A: 핵심 이론
function TheorySection() {
  const [expandedConcept, setExpandedConcept] = useState<string | null>('1');

  const concepts = [
    {
      id: '1',
      title: '형세론 — 용·혈·사·수 (龍穴砂水)',
      summary: '땅의 형태와 흐름으로 명당을 찾는 핵심 이론',
      traditional: '산줄기(용)가 뻗어 내려와 기운이 모이는 곳(혈)을 찾고, 주변 지형(사)과 물길(수)로 보호받는 구조',
      modern: '도로망과 지형 흐름을 분석해 접근성과 안전성을 확보하고, 주변 건물 배치로 바람을 막고 통풍을 확보하며, 교통 동선과 수계로 생활 편의와 배수를 최적화하는 입지 선정 방법론',
      diagram: `
    산줄기(용) ═══════╗
                      ║
    주변건물(사) ══ ⭐명당(혈) ══ 주변건물(사)
                      ║
    물길/도로(수) ════╝
      `,
      checklist: [
        '주변에 큰 도로나 하천이 있어 접근성이 좋은가?',
        '양쪽에 건물이나 지형이 있어 바람을 적절히 막아주는가?',
        '배수가 원활하고 침수 위험이 없는가?'
      ],
      tips: '⚠️ 산줄기는 비탈면 안전성, 물길은 침수 이력 필수 확인. 도심에선 도로망과 지하철 노선이 현대의 "용"입니다.'
    },
    {
      id: '2',
      title: '사신사 배치 (四神砂) — 청룡·백호·주작·현무',
      summary: '4방위 균형으로 안정감 확보',
      traditional: '뒤(현무)는 높고, 앞(주작)은 트이고, 좌우(청룡·백호)는 감싸는 배치',
      modern: '뒤쪽에 산이나 높은 건물로 북서풍을 막고, 앞쪽은 공터나 공원으로 조망을 확보하며, 좌우는 적당한 건물로 옆바람을 완화하고 프라이버시를 지키는 구조. 심리적 안정감과 미기후 조절 효과가 있습니다.',
      diagram: `
    🏔️ 현무(後) - 높은 건물/산
         ║
    🐯백호 ══ 🏠 ══ 🐉청룡
    (右)      명당    (左)
         ║
    🦅 주작(前) - 공터/수계
      `,
      checklist: [
        '뒤쪽에 산이나 건물이 있어 바람막이 역할을 하는가?',
        '앞쪽이 트여서 채광과 조망이 양호한가?',
        '좌우 균형이 맞아 한쪽이 지나치게 막히거나 뚫리지 않았는가?'
      ],
      tips: '⚠️ 아파트에선 동 배치, 실내에선 가구 배치에 적용. 좌우 불균형 시 커튼이나 파티션으로 보완 가능.'
    },
    {
      id: '3',
      title: '장풍득수 (藏風得水)',
      summary: '바람 막고 물 얻기 = 단열과 통풍의 균형',
      traditional: '바람은 적당히 막고(藏風), 물은 가까이 두어(得水) 기운을 보존',
      modern: '겨울철 찬바람은 차단하고(단열), 여름철 더운 공기는 배출하며(통풍), 습도는 적절히 유지하는 것. 한국은 겨울 북서풍과 여름 남동풍 대비가 핵심. 창문 위치, 방풍림, 커튼, 환기팬이 실전 도구입니다.',
      diagram: `
    겨울 북서풍 ❄️ ══╗
                     ║ 차단(방풍)
    여름 남동풍 🌬️ ══╬══> 통풍
                     ║
                    🏠
      `,
      checklist: [
        '겨울철 북서쪽 창문이 작거나 이중창인가?',
        '여름철 남동쪽에 통풍 가능한 창문이 있는가?',
        '맞통풍 구조(앞뒤 창문)가 가능한가?'
      ],
      tips: '⚠️ 과도한 밀폐는 결로 유발. 환기는 하루 3회 이상 필수. 제습기·공기청정기 활용.'
    },
    {
      id: '4',
      title: '좌향론 (坐向) — 24방위',
      summary: '건물이 어디를 향하는가 = 일조와 동선의 기준',
      traditional: '건물 뒤(坐)와 앞(向)의 방위를 24방위로 나눠 길흉 판단',
      modern: '좌(坐)는 건물 뒷면, 향(向)은 현관 방향. 남향(坐北向南)이 한국 기후에 유리한 이유는 겨울 일조 최대화, 여름 직사광 최소화. 동남향·남서향도 양호. 스마트폰 나침반으로 측정 가능.',
      diagram: `
         北(N)
          ↑
    西 ← 🏠 → 東
          ↓
         南(S)
    
    예) 좌북향남(坐北向南)
    = 뒤(北) + 앞(南) = 남향
      `,
      checklist: [
        '현관이 남향 또는 동남향/남서향인가?',
        '겨울철(12~2월) 오전 10시~오후 2시에 거실에 햇빛이 드는가?',
        '여름철 서향 직사광이 과도하지 않은가?'
      ],
      tips: '⚠️ 나침반 사용 시 철근·전자기기 피해 측정. 일조권은 법적 기준(동지 기준 2시간) 확인.'
    },
    {
      id: '5',
      title: '명당 조건 — 배산임수·전저후고',
      summary: '좋은 땅의 3요소: 뒤는 높고, 앞은 낮고, 물이 가까이',
      traditional: '뒤에 산(背山), 앞에 물(臨水), 앞은 낮고(前低) 뒤는 높음(後高)',
      modern: '뒤쪽 고지는 북풍 차단과 심리적 안정감, 앞쪽 저지는 조망과 채광 확보, 물(하천·호수)은 습도 조절과 경관 가치. 아파트에선 뒷동이 낮고 앞이 트인 구조, 단독주택에선 경사 활용.',
      diagram: `
    🏔️ 後高(뒤 높음) - 안정감
         ║
        🏠 명당
         ║
    🌊 前低(앞 낮음) - 조망
      `,
      checklist: [
        '뒤쪽에 산이나 높은 건물이 있는가?',
        '앞쪽이 낮아서 시야가 트이는가?',
        '하천·호수·공원이 도보 10분 내 있는가?'
      ],
      tips: '⚠️ 물 너무 가까우면 습기·모기 주의. 하천 범람 이력 확인(홍수위험지도).'
    },
    {
      id: '6',
      title: '흉지 판별 — 피해야 할 10가지',
      summary: '안전·건강·심리에 나쁜 입지',
      traditional: '절벽 밑, T자 도로, 막다른 골목, 고목 근처 등',
      modern: '① 고압선 50m 이내(전자파), ② T자 도로 정면(충돌 위험·소음), ③ 막다른 골목(비상 탈출로 없음), ④ 공동묘지 인접(심리적 거부감), ⑤ 쓰레기장·하수처리장(악취), ⑥ 공장 인접(소음·대기), ⑦ 급경사 위(산사태), ⑧ 범람 지역(침수), ⑨ 지하철 바로 위(진동), ⑩ 활성 단층대(지진)',
      diagram: `
    ❌ 고압선      ❌ T자로
    ❌ 막다른골목  ❌ 급경사
    ❌ 침수지역    ❌ 공장인접
      `,
      checklist: [
        '고압선·송전탑이 100m 이상 떨어져 있는가?',
        'T자 도로·큰 길 정면이 아닌가?',
        '산사태·침수 위험 지역이 아닌가? (국토부 지도 확인)'
      ],
      tips: '⚠️ 홍수위험지도, 지진지도(지질자원연구원), 토양오염도(환경부) 필수 확인. 법적 제약 사항도 체크.'
    },
    {
      id: '7',
      title: '실내 공간 오행 배치',
      summary: '5원소로 방 기능 최적화',
      traditional: '木(동쪽·서재), 火(남쪽·거실), 土(중앙·주방), 金(서쪽·침실), 水(북쪽·화장실)',
      modern: '동쪽은 아침 햇살로 서재·자녀방, 남쪽은 일조량 많아 거실·주방, 서쪽은 저녁 햇살로 침실(암막 필수), 북쪽은 그늘져 화장실·창고. 과학적으론 채광량과 온도 분포로 설명 가능.',
      diagram: `
         北(水) - 화장실
          ↑
    西(金) ← 中央(土) → 東(木)
    침실      주방      서재
          ↓
         南(火) - 거실
      `,
      checklist: [
        '거실이 남향에 위치하는가?',
        '침실이 서향일 경우 암막커튼이 있는가?',
        '화장실이 집 중앙이 아니라 구석에 있는가?'
      ],
      tips: '⚠️ 절대 규칙 아님. 실제 일조와 통풍이 우선. 평면도 보고 맞춤 조정.'
    },
    {
      id: '8',
      title: '현대 주거 형태별 적용',
      summary: '아파트·오피스텔·빌라 각각 다르게',
      traditional: '전통 풍수는 단독주택·한옥 중심',
      modern: '① 초고층 아파트: 층간 소음, 엘리베이터 대기, 바람 강도, 조망권 중시 ② 지하층·반지하: 습기·채광·방범 핵심 ③ 옥탑: 여름 고온·방수·겨울 바람 ④ 오피스텔: 환기·소음·프라이버시 ⑤ 복층: 계단 안전·냉난방 효율',
      diagram: `
    🏢 초고층 → 바람·조망
    🏠 저층 → 소음·습기
    🏚️ 반지하 → 채광·방범
    🏘️ 옥탑 → 방수·단열
      `,
      checklist: [
        '내 주거 형태의 취약점을 알고 있는가?',
        '해당 취약점에 대한 대비책이 있는가?',
        '입주 전 계절별 점검을 했는가?'
      ],
      tips: '⚠️ 형태별 필수 점검 리스트 별도 확인. 계약 전 우기·혹서기·혹한기 방문 추천.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-3">💡 이 장의 핵심 3줄</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-xl">1️⃣</span>
            <span>전통 풍수의 90%는 채광·통풍·소음·안전으로 설명됩니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">2️⃣</span>
            <span>명당 = 과학적으로 쾌적하고 안전한 입지</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">3️⃣</span>
            <span>미신이 아닌 환경심리학과 건축 상식입니다</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        {concepts.map((concept) => (
          <div key={concept.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-amber-200 dark:border-amber-700" suppressHydrationWarning>
            <button
              onClick={() => setExpandedConcept(expandedConcept === concept.id ? null : concept.id)}
              className="w-full p-6 text-left hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{concept.title}</h3>
                  <p className="text-amber-600 dark:text-amber-400 font-medium">💬 {concept.summary}</p>
                </div>
                <span className="text-2xl">{expandedConcept === concept.id ? '▼' : '▶'}</span>
              </div>
            </button>

            {expandedConcept === concept.id && (
              <div className="px-6 pb-6 space-y-4 border-t border-amber-100 dark:border-gray-700 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">📜 전통 정의</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{concept.traditional}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">🔬 현대 해석</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{concept.modern}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">📐 시각 도식</h4>
                  <pre className="text-gray-700 dark:text-gray-300 text-sm font-mono overflow-x-auto whitespace-pre">
{concept.diagram}
                  </pre>
                </div>

                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3">✅ 실무 체크</h4>
                  <ul className="space-y-2">
                    {concept.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                        <span className="text-blue-500">▪</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-400">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{concept.tips}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Part B: 실전 적용
function PracticeSection() {
  const [selectedRoom, setSelectedRoom] = useState<string>('entrance');

  const rooms = {
    entrance: {
      name: '🚪 현관',
      description: '집의 첫인상, 기운 유입의 시작점',
      checklist: [
        { category: '위치/방향', good: '남향 또는 동남향 선호', bad: '북향 + 차가운 느낌', tip: '밝은 조명 + 따뜻한 색상 벽지' },
        { category: '문/창문', good: '문이 안으로 열리고 90도 이상 개방', bad: '밖으로 열리거나 좁게 열림', tip: '경첩 점검, 자동 도어클로저' },
        { category: '신발장', good: '문 열면 보이지 않는 위치', bad: '문 바로 맞은편', tip: '파티션 또는 커튼으로 가림' },
        { category: '조명', good: '밝고 따뜻한 색온도 (3000K)', bad: '어둡거나 차가운 백색', tip: 'LED 센서등 설치' },
        { category: '청결', good: '항상 깨끗, 신발 정리', bad: '신발 산재, 먼지', tip: '매일 아침 5분 정리' }
      ]
    },
    living: {
      name: '🛋️ 거실',
      description: '가족 공간, 소통과 휴식의 중심',
      checklist: [
        { category: '소파 배치', good: '벽을 등지고, 입구가 보이는 위치', bad: '문 뒤, 창문 바로 앞', tip: '러그로 영역 구분' },
        { category: 'TV 위치', good: '창문 수직 배치 (빛 반사 최소)', bad: '창문 맞은편 (역광)', tip: '암막 커튼 또는 블라인드' },
        { category: '동선', good: '가구 사이 80cm 이상 확보', bad: '비좁아서 비틀며 지나감', tip: '가구 최소화, 코너 활용' },
        { category: '채광', good: '하루 4시간 이상 자연광', bad: '항상 어둡거나 인공조명 의존', tip: '흰색 커튼, 거울 활용' },
        { category: '환기', good: '맞통풍 가능 (2개 이상 창문)', bad: '창문 1개 또는 환기 불가', tip: '공기청정기, 하루 3회 환기' }
      ]
    },
    kitchen: {
      name: '🍳 주방',
      description: '화기와 수기의 조화, 건강의 근원',
      checklist: [
        { category: '삼각배치', good: '냉장고-싱크대-가스레인지 각 1-2m', bad: '일직선 또는 너무 멀리', tip: '동선 측정 후 가구 재배치' },
        { category: '환기', good: '레인지후드 + 창문', bad: '환기팬 없음', tip: '매 조리 시 후드 가동' },
        { category: '조명', good: '작업대 상부 직접 조명', bad: '천장 조명만 (그림자)', tip: 'LED 바 조명 부착' },
        { category: '수납', good: '조리도구 사용 빈도 순 배치', bad: '뒤섞임, 찾기 어려움', tip: '서랍 칸막이, 라벨링' },
        { category: '청결', good: '싱크대 배수구 매일 청소', bad: '악취 발생', tip: '베이킹소다 + 식초' }
      ]
    },
    bedroom: {
      name: '🛏️ 안방',
      description: '수면과 재충전, 가장 사적인 공간',
      checklist: [
        { category: '침대 방향', good: '문이 보이되 일직선 아님, 벽 지지', bad: '문-침대 일직선, 창문 바로 아래', tip: '머리를 벽에, 발끝을 문 대각선' },
        { category: '빛 차단', good: '암막커튼 + 외부 빛 0%', bad: '가로등·달빛 유입', tip: '3중 암막 커튼, 아이마스크' },
        { category: '온습도', good: '18-22도, 습도 40-60%', bad: '너무 덥거나 건조', tip: '온습도계, 가습기/제습기' },
        { category: '전자기기', good: '침대에서 2m 이상 이격', bad: '머리맡에 스마트폰 충전', tip: '비행기 모드, 거실에 충전' },
        { category: '정리', good: '침대 밑 비움, 옷장 정돈', bad: '잡동사니 쌓임', tip: '주 1회 정리, 미니멀' }
      ]
    },
    bathroom: {
      name: '🚽 화장실',
      description: '습기와 악취 제어가 핵심',
      checklist: [
        { category: '환기', good: '환풍기 + 창문, 24시간 가동', bad: '환기 안 됨', tip: '타이머 환풍기 설치' },
        { category: '문 위치', good: '침실·주방과 직접 연결 안 됨', bad: '주방 바로 옆, 침실 안', tip: '문 항상 닫기, 방향제' },
        { category: '습기', good: '바닥 항상 건조, 수건 매일 교체', bad: '곰팡이, 물기', tip: '수건 걸이 확대, 제습제' },
        { category: '조명', good: '밝고 자연광에 가까운 색', bad: '어둡거나 푸른빛', tip: '거울 조명 추가' },
        { category: '배수', good: '배수구 막힘 없음, 냄새 안 남', bad: '악취 역류', tip: '월 1회 파이프 세척제' }
      ]
    }
  };

  type RoomKey = keyof typeof rooms;
  const currentRoom = rooms[selectedRoom as RoomKey];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-3">🏠 공간별 실전 가이드</h2>
        <p>각 공간의 과학적 배치 원칙과 즉시 적용 가능한 팁을 확인하세요</p>
      </div>

      {/* 공간 선택 버튼 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3" suppressHydrationWarning>
        {Object.entries(rooms).map(([key, room]) => (
          <button
            key={key}
            onClick={() => setSelectedRoom(key)}
            className={`p-4 rounded-xl font-medium text-sm transition-all ${
              selectedRoom === key
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-1">{room.name.split(' ')[0]}</div>
            <div className="text-xs">{room.name.split(' ')[1]}</div>
          </button>
        ))}
      </div>

      {/* 선택된 공간 상세 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentRoom.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{currentRoom.description}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 text-gray-900 dark:text-white font-bold">항목</th>
                <th className="text-left p-3 text-gray-900 dark:text-white font-bold">✅ 권장사항</th>
                <th className="text-left p-3 text-gray-900 dark:text-white font-bold">❌ 피할 사항</th>
                <th className="text-left p-3 text-gray-900 dark:text-white font-bold">💡 저비용 개선</th>
              </tr>
            </thead>
            <tbody>
              {currentRoom.checklist.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 font-medium text-gray-900 dark:text-white">{item.category}</td>
                  <td className="p-3 text-green-700 dark:text-green-400">{item.good}</td>
                  <td className="p-3 text-red-700 dark:text-red-400">{item.bad}</td>
                  <td className="p-3 text-blue-700 dark:text-blue-400">{item.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 가구 배치 가이드 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🪑 주요 가구 배치 원칙</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">📚 책상</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">✅ 벽을 등지고 문이 보이는 위치 (집중력)</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">✅ 창문은 측면 (빛 측광)</p>
          </div>
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">🪞 거울</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">✅ 현관 측면 (공간 확장)</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">❌ 침대 정면 (수면 방해)</p>
          </div>
          <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">🌿 식물</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">✅ 거실·서재 (공기정화)</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">❌ 침실 (야간 산소 소모)</p>
          </div>
          <div className="bg-yellow-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">💡 조명</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">✅ 작업공간: 밝은 주광색</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">✅ 침실: 따뜻한 전구색</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Part C: 체크리스트
function ChecklistSection({ 
  checklistScores, 
  toggleCheck, 
  calculateScore 
}: { 
  checklistScores: Record<string, boolean>; 
  toggleCheck: (id: string) => void;
  calculateScore: (category: string) => { checked: number; total: number; score: number };
}) {
  const categories = [
    {
      id: 'light',
      name: '채광·통풍',
      icon: '☀️',
      items: [
        { id: 'light-1', text: '하루 중 3시간 이상 직사광이 들어오는가?', points: 2 },
        { id: 'light-2', text: '맞통풍이 가능한가? (앞뒤 창문)', points: 2 },
        { id: 'light-3', text: '창문 면적이 바닥 면적의 10% 이상인가?', points: 2 },
        { id: 'light-4', text: '결로나 곰팡이가 없는가?', points: 2 },
        { id: 'light-5', text: '여름 서향 직사광을 차단할 수 있는가?', points: 2 }
      ]
    },
    {
      id: 'flow',
      name: '동선·안전',
      icon: '🚶',
      items: [
        { id: 'flow-1', text: '현관-거실-침실 동선이 10m 이내인가?', points: 2 },
        { id: 'flow-2', text: '화장실이 침실과 가까운가?', points: 2 },
        { id: 'flow-3', text: '계단/문턱이 안전한가? (손잡이, 미끄럼방지)', points: 2 },
        { id: 'flow-4', text: '비상구가 확보되어 있는가?', points: 2 },
        { id: 'flow-5', text: '방범 취약 지점이 없는가?', points: 2 }
      ]
    },
    {
      id: 'noise',
      name: '소음·환경',
      icon: '🔇',
      items: [
        { id: 'noise-1', text: '주간 소음이 50dB 이하인가?', points: 2 },
        { id: 'noise-2', text: '야간 소음이 40dB 이하인가?', points: 2 },
        { id: 'noise-3', text: '고압선이 100m 이상 떨어져 있는가?', points: 2 },
        { id: 'noise-4', text: '주요 도로가 30m 이상 떨어져 있는가?', points: 2 },
        { id: 'noise-5', text: '악취나 매연 발생원이 없는가?', points: 2 }
      ]
    },
    {
      id: 'comfort',
      name: '심리·편의',
      icon: '😊',
      items: [
        { id: 'comfort-1', text: '천장 높이가 2.3m 이상인가?', points: 2 },
        { id: 'comfort-2', text: '수납 공간이 충분한가?', points: 2 },
        { id: 'comfort-3', text: '조망이 확보되어 있는가?', points: 2 },
        { id: 'comfort-4', text: '생활 인프라가 도보 10분 내에 있는가?', points: 2 },
        { id: 'comfort-5', text: '전반적으로 쾌적한 느낌이 드는가?', points: 2 }
      ]
    }
  ];

  const totalScore = categories.reduce((sum, cat) => {
    return sum + calculateScore(cat.id).score;
  }, 0) / categories.length;

  const getGrade = (score: number) => {
    if (score >= 80) return { grade: '최상', color: 'text-green-600 dark:text-green-400', desc: '명당 수준' };
    if (score >= 60) return { grade: '상', color: 'text-blue-600 dark:text-blue-400', desc: '양호, 소폭 개선으로 최적화' };
    if (score >= 40) return { grade: '중', color: 'text-yellow-600 dark:text-yellow-400', desc: '개선 필요 항목 다수' };
    if (score >= 20) return { grade: '하', color: 'text-orange-600 dark:text-orange-400', desc: '전면 재검토 권장' };
    return { grade: '최하', color: 'text-red-600 dark:text-red-400', desc: '즉시 개선 필요' };
  };

  const gradeInfo = getGrade(totalScore);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-3">✅ 5분 진단 체크리스트</h2>
        <p>20문항으로 현재 공간의 풍수 점수를 즉시 확인하세요</p>
      </div>

      {/* 총점 표시 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center" suppressHydrationWarning>
        <div className="text-gray-600 dark:text-gray-400 mb-2">현재 점수</div>
        <div className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
          {totalScore.toFixed(0)}점
        </div>
        <div className={`text-2xl font-bold ${gradeInfo.color} mb-2`}>{gradeInfo.grade}</div>
        <div className="text-gray-600 dark:text-gray-400">{gradeInfo.desc}</div>
      </div>

      {/* 카테고리별 체크리스트 */}
      {categories.map((category) => {
        const catScore = calculateScore(category.id);
        return (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6" suppressHydrationWarning>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                {category.name}
              </h3>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {catScore.checked}/{catScore.total} ({catScore.score.toFixed(0)}점)
              </div>
            </div>
            <div className="space-y-3">
              {category.items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  suppressHydrationWarning
                >
                  <input
                    type="checkbox"
                    checked={checklistScores[item.id] || false}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="flex-1 text-gray-700 dark:text-gray-300">{item.text}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({item.points}점)</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      {/* 점수별 조언 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-6 border-l-4 border-amber-500">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 다음 단계</h3>
        {totalScore >= 80 && (
          <p className="text-gray-700 dark:text-gray-300">
            훌륭합니다! 현재 상태를 유지하고, 계절별 점검으로 지속적으로 관리하세요.
          </p>
        )}
        {totalScore >= 60 && totalScore < 80 && (
          <p className="text-gray-700 dark:text-gray-300">
            양호한 수준입니다. 점수가 낮은 항목부터 우선 개선하면 최상 등급 달성 가능합니다. "실전 적용" 탭에서 저비용 개선 팁을 확인하세요.
          </p>
        )}
        {totalScore >= 40 && totalScore < 60 && (
          <p className="text-gray-700 dark:text-gray-300">
            개선이 필요합니다. 특히 점수가 낮은 카테고리를 집중 점검하세요. 임대의 경우 집주인과 협의 후 개선, 자가의 경우 단계별 리모델링을 권장합니다.
          </p>
        )}
        {totalScore < 40 && (
          <p className="text-gray-700 dark:text-gray-300">
            전면 재검토가 필요합니다. 건강과 안전에 영향을 줄 수 있는 항목(습기, 소음, 안전)부터 즉시 개선하고, 장기적으로는 이사를 고려하세요.
          </p>
        )}
      </div>
    </div>
  );
}

// Part D: 케이스 스터디
function CasesSection() {
  const cases = [
    {
      id: 1,
      title: '24평 소형 아파트 (신혼부부)',
      emoji: '👫',
      problem: '좁은 공간, 현관-거실-침실 일직선 배치로 프라이버시 부족',
      solution: '① 현관-거실 사이 파티션 설치 ② 침실 커튼 추가 ③ 간접조명으로 공간 분리',
      cost: '150만원',
      time: '3일',
      effect: '수면의 질 30% 개선, 공간감 2배 확보, 생활 만족도 상승',
      before: '문 열면 침실까지 다 보임 → 불안감',
      after: '공간별 영역 구분 명확 → 안정감'
    },
    {
      id: 2,
      title: '전원 단독주택 (은퇴 부부)',
      emoji: '🏡',
      problem: '배수 불량으로 장마철 침수, 겨울 북서풍 직접 노출로 난방비 과다',
      solution: '① 배수로 신설 및 경사 조정 ② 북서쪽 방풍림 조성 (측백나무 5그루) ③ 현관 풍제실 추가',
      cost: '500만원',
      time: '2주',
      effect: '침수 문제 해결, 난방비 20% 절감, 봄철 꽃가루 저감',
      before: '매년 장마 걱정, 겨울 한기',
      after: '사계절 쾌적, 유지비 절감'
    },
    {
      id: 3,
      title: '코너 상가 (카페)',
      emoji: '☕',
      problem: '2면 유리창으로 여름 고온, 시선 노출로 프라이버시 부족',
      solution: '① 서쪽 창에 차양 설치 ② 하부 블라인드로 시선 차단 ③ 좌석 재배치 (창가 바 테이블)',
      cost: '200만원',
      time: '5일',
      effect: '냉방비 15% 절감, 고객 체류시간 25% 증가, 매출 10% 상승',
      before: '오후 3-6시 너무 더움, 지나가는 사람 눈치',
      after: '쾌적한 온도, 아늑한 분위기'
    },
    {
      id: 4,
      title: '오픈 오피스 (IT 스타트업)',
      emoji: '💻',
      problem: '책상 배치 무질서, 회의 소음으로 집중 방해',
      solution: '① 책상 방향 통일 (창문 측면, 벽 등지기) ② 회의실 흡음재 부착 ③ 집중 부스 3개 설치',
      cost: '300만원',
      time: '1주',
      effect: '업무 집중도 40% 향상, 이직률 절반 감소, 직원 만족도 상승',
      before: '산만함, 소음 스트레스',
      after: '집중 환경, 협업 공간 분리'
    },
    {
      id: 5,
      title: '저층 빌라 1층 (1인 가구)',
      emoji: '🏠',
      problem: '습기로 곰팡이, 채광 부족, 방범 불안',
      solution: '① 제습기 2대 가동 ② LED 전체 교체 (밝기 2배) ③ 방범창·센서등 설치',
      cost: '100만원',
      time: '2일',
      effect: '곰팡이 제거, 심리적 안정감, 실제 침입 시도 0건',
      before: '어둡고 습함, 불안감',
      after: '밝고 건조, 안심'
    },
    {
      id: 6,
      title: '산간 전원 대지 (주말주택)',
      emoji: '⛰️',
      problem: '15도 경사지, 접도 불량, 겨울 적설로 고립',
      solution: '① 단 조성 (3단) ② 진입로 확포장 ③ 보일러 용량 2배 증설 ④ 제설장비 확보',
      cost: '2,000만원 (토목 포함)',
      time: '1개월',
      effect: '사계절 거주 가능, 안전성 확보, 자산 가치 30% 상승',
      before: '여름만 이용 가능',
      after: '연중 거주 가능'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-3">📖 실제 사례 연구</h2>
        <p>비용·시간·효과가 명확한 6가지 케이스</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-4xl">{caseItem.emoji}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{caseItem.title}</h3>
                <div className="flex gap-3 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {caseItem.cost}
                  </span>
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                    {caseItem.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 border-l-4 border-red-400">
                <div className="font-bold text-red-700 dark:text-red-400 text-sm mb-1">❌ 문제</div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{caseItem.problem}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border-l-4 border-blue-400">
                <div className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-1">🔧 해결</div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{caseItem.solution}</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border-l-4 border-green-400">
                <div className="font-bold text-green-700 dark:text-green-400 text-sm mb-1">✅ 효과</div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{caseItem.effect}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-100 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400">Before</div>
                  <div className="text-gray-700 dark:text-gray-300">{caseItem.before}</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/50 rounded p-2">
                  <div className="text-green-600 dark:text-green-400">After</div>
                  <div className="text-gray-700 dark:text-gray-300">{caseItem.after}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Part E: 빠른 진단 도구
function ToolsSection({ 
  checklistScores, 
  toggleCheck 
}: { 
  checklistScores: Record<string, boolean>; 
  toggleCheck: (id: string) => void;
}) {
  const quickItems = [
    { id: 'quick-1', text: '남향 또는 동남향인가?', points: 5 },
    { id: 'quick-2', text: '하루 3시간 이상 햇빛?', points: 5 },
    { id: 'quick-3', text: '맞통풍 가능?', points: 5 },
    { id: 'quick-4', text: '고압선 100m 이상?', points: 5 },
    { id: 'quick-5', text: '큰 도로 30m 이상?', points: 5 },
    { id: 'quick-6', text: '습기·곰팡이 없음?', points: 5 },
    { id: 'quick-7', text: '소음 적음 (주간 50dB 이하)?', points: 5 },
    { id: 'quick-8', text: '생활 인프라 도보 10분?', points: 5 },
    { id: 'quick-9', text: '비상구·탈출로 확보?', points: 5 },
    { id: 'quick-10', text: '전반적 쾌적감?', points: 5 }
  ];

  const quickChecked = quickItems.filter(item => checklistScores[item.id]).length;
  const quickScore = (quickChecked / quickItems.length) * 100;

  const getQuickGrade = (score: number) => {
    if (score >= 80) return { text: '상 - 거주 적합', color: 'text-green-600 dark:text-green-400' };
    if (score >= 50) return { text: '중 - 일부 개선 필요', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: '하 - 재검토 권장', color: 'text-red-600 dark:text-red-400' };
  };

  const quickGrade = getQuickGrade(quickScore);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-3">⚡ 5분 빠른 진단</h2>
        <p>10문항으로 즉시 거주 적합도 확인</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6" suppressHydrationWarning>
        <div className="text-center mb-6">
          <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
            {quickScore.toFixed(0)}점
          </div>
          <div className={`text-xl font-bold ${quickGrade.color}`}>{quickGrade.text}</div>
        </div>

        <div className="space-y-2">
          {quickItems.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              suppressHydrationWarning
            >
              <input
                type="checkbox"
                checked={checklistScores[item.id] || false}
                onChange={() => toggleCheck(item.id)}
                className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="flex-1 text-gray-700 dark:text-gray-300">{item.text}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">({item.points}점)</span>
            </label>
          ))}
        </div>
      </div>

      {/* 계절별 점검 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🗓️ 계절별 점검표</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">🌸 봄·가을</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>□ 환기 (미세먼지 확인)</li>
              <li>□ 에어컨·보일러 점검</li>
              <li>□ 창문·방충망 청소</li>
              <li>□ 베란다 정리</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">☀️ 여름</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>□ 제습기 가동</li>
              <li>□ 곰팡이 제거</li>
              <li>□ 모기·벌레 방제</li>
              <li>□ 서향 차양 설치</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">❄️ 겨울</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>□ 결로 점검</li>
              <li>□ 단열 보강 (문풍지)</li>
              <li>□ 보일러 효율 확인</li>
              <li>□ 동파 방지</li>
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">🌧️ 장마</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>□ 배수구 점검</li>
              <li>□ 지하 침수 대비</li>
              <li>□ 제습제 교체</li>
              <li>□ 빗물 누수 확인</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Part F: FAQ
function FAQSection() {
  const faqs = [
    {
      q: '풍수는 미신인가요?',
      a: '전통 풍수의 상당 부분은 채광·통풍·안전 등 환경심리학과 일치합니다. 과학적 근거가 있는 부분은 존중하되, 맹신하지 않는 것이 중요합니다. 이 도감은 검증된 부분만 다룹니다.'
    },
    {
      q: '남향이 아니면 안 좋은가요?',
      a: '한국 기후에서 남향이 유리하지만, 동남향·남서향도 양호합니다. 중요한 것은 일조권(겨울 오전 10시~오후 2시 사이 최소 2시간)과 여름 서향 직사광 차단입니다.'
    },
    {
      q: '아파트에도 풍수를 적용할 수 있나요?',
      a: '가능합니다. 동 배치, 층수, 향, 실내 가구 배치 모두 적용 대상입니다. "실전 적용" 탭의 아파트 체크리스트를 참고하세요.'
    },
    {
      q: '임대 주택인데 큰 공사 없이 개선할 수 있나요?',
      a: '가능합니다. 조명 교체, 커튼 설치, 가구 재배치, 제습기·공기청정기 활용 등 저비용(50-100만원) 방법이 많습니다.'
    },
    {
      q: '풍수 전문가를 꼭 불러야 하나요?',
      a: '이 도감의 체크리스트만으로도 80%는 자가 진단 가능합니다. 신축이나 대규모 리모델링 시에만 전문가 자문을 권장합니다.'
    },
    {
      q: '침대 방향이 정말 중요한가요?',
      a: '중요합니다. 문-침대 일직선은 심리적 불안, 창문 바로 아래는 소음·빛 방해, 화장실 벽 공유는 습기·소음 문제. 벽을 등지고 문이 보이는 대각선 배치가 과학적으로도 최적입니다.'
    },
    {
      q: 'T자 도로가 왜 나쁜가요?',
      a: '정면 충돌 위험(실제 사고율 높음), 헤드라이트 빛 유입, 소음이 이유입니다. 전통 풍수의 "충살"은 교통안전 경고였습니다.'
    },
    {
      q: '고압선은 얼마나 떨어져야 하나요?',
      a: '최소 50m, 권장 100m 이상입니다. 전자파 건강 영향은 논란이 있으나, 심리적 불안과 재산 가치 하락은 명확합니다.'
    },
    {
      q: '거울을 침대 정면에 두면 안 되나요?',
      a: '야간에 자신의 움직임이 반사되어 수면 방해, 심리적 불안을 유발할 수 있습니다. 침실 거울은 옷장 안이나 측면이 좋습니다.'
    },
    {
      q: '식물을 침실에 두면 안 되나요?',
      a: '야간에 식물은 산소를 소비하므로, 많은 양을 두면 공기 질이 떨어질 수 있습니다. 거실이나 서재가 더 적합합니다.'
    },
    {
      q: '화장실 문이 주방과 마주보면 정말 나쁜가요?',
      a: '악취 전파, 심리적 거부감, 위생 문제가 실제로 발생할 수 있습니다. 문을 항상 닫고, 환풍기를 24시간 가동하며, 방향제를 사용하세요.'
    },
    {
      q: '풍수 개선 효과는 언제 나타나나요?',
      a: '조명·가구 배치는 즉시, 습기·소음 개선은 1-2주, 심리적 안정감은 1개월 정도 소요됩니다.'
    },
    {
      q: '풍수와 인테리어를 함께 고려하려면?',
      a: '풍수는 배치 원칙, 인테리어는 미적 표현입니다. 기능(풍수) 먼저 정하고, 스타일(인테리어)을 입히세요.'
    },
    {
      q: '상가 풍수는 주거와 다른가요?',
      a: '다릅니다. 상가는 유동인구·가시성·접근성이 핵심, 주거는 채광·통풍·조망이 핵심입니다. "실전 적용" 탭 참조.'
    },
    {
      q: '지하층·반지하는 절대 피해야 하나요?',
      a: '습기·채광·방범이 취약하지만, 제습기·LED 조명·방범창으로 상당 부분 보완 가능합니다. 다만 장기 거주보다는 단기 추천.'
    },
    {
      q: '풍수 책과 이 도감의 차이는?',
      a: '전통 책은 이론 중심, 이 도감은 체크리스트·비용·시간이 포함된 실전 매뉴얼입니다. 한국 2025년 기준 현대 주거에 최적화되어 있습니다.'
    },
    {
      q: '명당이면 집값이 비싼가요?',
      a: '대체로 그렇습니다. 채광·통풍·조망·인프라가 좋은 곳은 시장에서도 높게 평가됩니다.'
    },
    {
      q: '풍수 때문에 이사해야 하나요?',
      a: '아닙니다. 대부분은 소규모 개선으로 충분합니다. 심각한 안전 문제(침수·산사태 위험)만 이사 고려 대상입니다.'
    },
    {
      q: '임산부·영유아가 있으면 풍수가 더 중요한가요?',
      a: '수면·공기 질·안전이 특히 중요하므로, 채광·환기·소음·온습도 항목을 더 엄격히 체크하세요.'
    },
    {
      q: '풍수와 법규가 충돌하면?',
      a: '항상 법규가 우선입니다. 건축법·소방법·전기사업법 등을 먼저 확인하세요.'
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-3">❓ 자주 묻는 질문</h2>
        <p>풍수에 대한 모든 궁금증을 해결하세요</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-indigo-200 dark:border-indigo-700" suppressHydrationWarning>
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full p-4 text-left hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-4"
            >
              <span className="font-bold text-gray-900 dark:text-white">Q{idx + 1}. {faq.q}</span>
              <span className="text-xl">{openFaq === idx ? '▼' : '▶'}</span>
            </button>
            {openFaq === idx && (
              <div className="px-4 pb-4 border-t border-indigo-100 dark:border-gray-700 pt-3">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 용어 대조표 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📚 용어 대조표</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left p-2 text-gray-900 dark:text-white">전통 용어</th>
                <th className="text-left p-2 text-gray-900 dark:text-white">현대 해석</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="p-2 text-gray-700 dark:text-gray-300">명당 (明堂)</td>
                <td className="p-2 text-gray-700 dark:text-gray-300">쾌적하고 안전한 입지</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="p-2 text-gray-700 dark:text-gray-300">배산임수 (背山臨水)</td>
                <td className="p-2 text-gray-700 dark:text-gray-300">뒤 산, 앞 물 = 방풍 + 조망</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="p-2 text-gray-700 dark:text-gray-300">장풍득수 (藏風得水)</td>
                <td className="p-2 text-gray-700 dark:text-gray-300">단열 + 통풍 균형</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="p-2 text-gray-700 dark:text-gray-300">좌향 (坐向)</td>
                <td className="p-2 text-gray-700 dark:text-gray-300">건물 방향 = 일조 기준</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="p-2 text-gray-700 dark:text-gray-300">충살 (衝煞)</td>
                <td className="p-2 text-gray-700 dark:text-gray-300">T자로 = 교통 위험</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="p-2 text-gray-700 dark:text-gray-300">살기 (殺氣)</td>
                <td className="p-2 text-gray-700 dark:text-gray-300">소음·악취·위험 요소</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

