"use client";

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
interface PastLifeData {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  personality: {
    introvert: boolean | null;
    logical: boolean | null;
    adventurous: boolean | null;
    creative: boolean | null;
  };
}

// 전생 직업 데이터베이스 (시대 × 직업)
const PAST_LIFE_JOBS = {
  // 조선시대
  joseon: [
    { 
      job: '양반 학자', 
      desc: '한양에서 학문을 연구하고 후학을 양성하던 선비',
      trait: '지적 호기심이 많고 원칙을 중시',
      karma: '현생에서도 배움과 가르침에 인연',
      element: '목',
      score: 95
    },
    { 
      job: '의녀', 
      desc: '궁중에서 왕실의 건강을 책임지던 여의사',
      trait: '치유와 돌봄에 천부적 재능',
      karma: '의료, 간호, 상담 분야 적성',
      element: '수',
      score: 92
    },
    { 
      job: '대장장이', 
      desc: '최고의 칼과 농기구를 만들던 장인',
      trait: '손재주가 뛰어나고 집중력 강함',
      karma: '기술직, 제조업 천직',
      element: '금',
      score: 90
    },
    { 
      job: '기생', 
      desc: '시와 노래로 사람들을 매료시키던 예인',
      trait: '예술적 감각과 표현력 탁월',
      karma: '예술, 공연, 방송 분야 재능',
      element: '화',
      score: 93
    },
    { 
      job: '상인', 
      desc: '전국을 다니며 무역하던 거상',
      trait: '사업 수완과 인맥 관리 능력',
      karma: '영업, 무역, 사업가 기질',
      element: '토',
      score: 88
    }
  ],
  
  // 고려시대
  goryeo: [
    { 
      job: '고려 장군', 
      desc: '외적을 물리치고 나라를 지키던 무장',
      trait: '용맹하고 결단력 있음',
      karma: '리더십, 위기관리 능력',
      element: '금',
      score: 94
    },
    { 
      job: '불교 승려', 
      desc: '산사에서 수행하며 중생을 제도하던 스님',
      trait: '영적 통찰력과 평온한 마음',
      karma: '상담, 힐링, 교육 분야',
      element: '수',
      score: 91
    },
    { 
      job: '청자 도공', 
      desc: '비색 청자를 빚던 최고의 장인',
      trait: '예술성과 완벽주의',
      karma: '디자인, 예술, 공예 재능',
      element: '토',
      score: 89
    }
  ],
  
  // 삼국시대
  threekingdoms: [
    { 
      job: '화랑', 
      desc: '신라의 청년 엘리트 전사',
      trait: '충의와 명예를 중시',
      karma: '리더십과 교육 능력',
      element: '목',
      score: 92
    },
    { 
      job: '고구려 철기병', 
      desc: '철갑 기병으로 전장을 누비던 전사',
      trait: '강인함과 돌파력',
      karma: '영업, 스포츠, 경쟁 직종',
      element: '금',
      score: 90
    },
    { 
      job: '백제 건축가', 
      desc: '아름다운 사찰과 궁궐을 설계하던 장인',
      trait: '공간 감각과 미적 안목',
      karma: '건축, 인테리어, 디자인',
      element: '토',
      score: 87
    }
  ],
  
  // 중국 고대
  china: [
    { 
      job: '황제의 책사', 
      desc: '제갈량처럼 전략을 짜던 군사',
      trait: '전략적 사고와 통찰력',
      karma: '기획, 전략, 컨설팅',
      element: '수',
      score: 96
    },
    { 
      job: '도교 도사', 
      desc: '산속에서 도를 닦던 신선',
      trait: '초월적 지혜',
      karma: '철학, 영성, 대체의학',
      element: '목',
      score: 91
    },
    { 
      job: '실크로드 상인', 
      desc: '동서양을 오가며 무역하던 대상',
      trait: '모험심과 사업 수완',
      karma: '글로벌 비즈니스, 무역',
      element: '화',
      score: 89
    }
  ],
  
  // 유럽 중세
  europe: [
    { 
      job: '기사', 
      desc: '명예와 충성을 지키던 중세 기사',
      trait: '정의감과 용기',
      karma: '법조인, 경찰, 군인',
      element: '금',
      score: 93
    },
    { 
      job: '연금술사', 
      desc: '비밀 실험실에서 연구하던 과학자',
      trait: '탐구심과 실험정신',
      karma: '과학자, 연구원, 개발자',
      element: '수',
      score: 90
    },
    { 
      job: '음유시인', 
      desc: '노래와 시로 사랑을 전하던 예술가',
      trait: '낭만과 감성',
      karma: '작가, 음악가, 시인',
      element: '화',
      score: 88
    }
  ],
  
  // 이집트
  egypt: [
    { 
      job: '파라오의 서기관', 
      desc: '히에로글리프를 기록하던 고위 관리',
      trait: '기록과 문서 관리 능력',
      karma: '행정, 기록, 법무',
      element: '토',
      score: 91
    },
    { 
      job: '신전의 사제', 
      desc: '신과 소통하며 제사를 주관',
      trait: '영적 능력과 카리스마',
      karma: '종교, 상담, 힐링',
      element: '수',
      score: 94
    }
  ]
};

export default function PastLifeJob() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PastLifeData>({
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    personality: {
      introvert: null,
      logical: null,
      adventurous: null,
      creative: null
    }
  });
  const [result, setResult] = useState<any>(null);

  const analyzePastLife = () => {
    // 생년월일로 시대 결정
    const yearSum = String(data.birthYear).split('').reduce((a, b) => a + parseInt(b), 0);
    const monthDaySum = data.birthMonth + data.birthDay;
    const totalSum = yearSum + monthDaySum;

    // 시대 선택
    const eras = ['joseon', 'goryeo', 'threekingdoms', 'china', 'europe', 'egypt'];
    const eraIndex = totalSum % eras.length;
    const selectedEra = eras[eraIndex];
    const eraJobs = PAST_LIFE_JOBS[selectedEra as keyof typeof PAST_LIFE_JOBS];

    // 성향으로 직업 필터링
    const jobScores = eraJobs.map(job => {
      let score = job.score;
      
      // 성향에 맞게 점수 조정
      if (data.personality.introvert === true && ['학자', '승려', '연금술사', '서기관', '사제'].some(k => job.job.includes(k))) {
        score += 10;
      }
      if (data.personality.introvert === false && ['장군', '상인', '기사', '기생'].some(k => job.job.includes(k))) {
        score += 10;
      }
      if (data.personality.logical === true && ['책사', '학자', '연금술사'].some(k => job.job.includes(k))) {
        score += 8;
      }
      if (data.personality.creative === true && ['도공', '시인', '기생', '건축가'].some(k => job.job.includes(k))) {
        score += 8;
      }
      if (data.personality.adventurous === true && ['장군', '상인', '기사'].some(k => job.job.includes(k))) {
        score += 8;
      }
      
      return { ...job, finalScore: score };
    });

    // 점수 순 정렬
    jobScores.sort((a, b) => b.finalScore - a.finalScore);
    const topJob = jobScores[0];

    // 시대명 한글화
    const eraNames: Record<string, string> = {
      'joseon': '조선시대',
      'goryeo': '고려시대',
      'threekingdoms': '삼국시대',
      'china': '중국 고대',
      'europe': '유럽 중세',
      'egypt': '고대 이집트'
    };

    // 전생 인연
    const connections = [
      `현재의 ${data.personality.creative ? '창의적' : '논리적'} 성향은 전생에서 이어진 것입니다.`,
      `${topJob.job}로 살았던 기억이 무의식에 남아있습니다.`,
      `당시 ${topJob.element} 기운이 강했던 영향이 현생에도 미칩니다.`
    ];

    setResult({
      era: eraNames[selectedEra],
      job: topJob,
      connections,
      presentCareer: getPresentCareer(topJob.karma),
      luckyItem: getLuckyItem(topJob.element)
    });

    setStep(3);
  };

  const getPresentCareer = (karma: string): string[] => {
    if (karma.includes('의료')) return ['의사', '간호사', '약사', '물리치료사'];
    if (karma.includes('예술')) return ['디자이너', '예술가', '방송인', '크리에이터'];
    if (karma.includes('사업')) return ['CEO', '창업가', '영업 전문가', '마케터'];
    if (karma.includes('기술')) return ['엔지니어', '개발자', '기술자', '연구원'];
    if (karma.includes('교육')) return ['교사', '교수', '강사', '교육 기획자'];
    return ['전문직', '관리직', '자영업'];
  };

  const getLuckyItem = (element: string): string => {
    const items: Record<string, string> = {
      '목': '나무 소품, 식물, 녹색 아이템',
      '화': '붉은색 액세서리, 캔들, 조명',
      '토': '도자기, 황토 제품, 노란색 소품',
      '금': '금속 액세서리, 시계, 흰색 아이템',
      '수': '분수, 어항, 검은색/파란색 소품'
    };
    return items[element] || '자연석';
  };

  const handlePersonality = (key: keyof PastLifeData['personality'], value: boolean) => {
    setData({
      ...data,
      personality: {
        ...data.personality,
        [key]: value
      }
    });
  };

  // Step 1: 생년월일
  if (step === 1) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 dark:from-purple-900 dark:via-indigo-900 dark:to-violet-900 transition-colors" style={{
        backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.2) 0%, transparent 50%), linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
          {/* 상단 배너 제거됨 */}

          <section className="bg-white rounded-2xl shadow-xl p-6 border border-amber-200 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <h1 className="text-4xl font-bold text-black mb-2 text-black placeholder-gray-500">⏳</h1>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-black placeholder-gray-500">나의 전생 직업 찾기</h2>
              <p className="text-gray-600 text-black placeholder-gray-500">생년월일로 전생의 인연을 찾습니다</p>
            </header>

            <div className="space-y-6 text-black placeholder-gray-500">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">출생년도</label>
                <input
                  type="number"
                  value={data.birthYear}
                  onChange={(e) => setData({...data, birthYear: Number(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  min="1950"
                  max="2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-black placeholder-gray-500">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">출생월</label>
                  <select
                    value={data.birthMonth}
                    onChange={(e) => setData({...data, birthMonth: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}월</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">출생일</label>
                  <select
                    value={data.birthDay}
                    onChange={(e) => setData({...data, birthDay: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    {Array.from({length: 31}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}일</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              >
                다음 단계
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Step 2: 성향 테스트
  if (step === 2) {
    const allAnswered = Object.values(data.personality).every(v => v !== null);
    
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 dark:from-purple-900 dark:via-indigo-900 dark:to-violet-900 transition-colors" style={{
        backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.2) 0%, transparent 50%), linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
          {/* 상단 배너 제거됨 */}

          <section className="bg-white rounded-2xl shadow-xl p-6 border border-amber-200 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <h1 className="text-3xl font-bold text-black mb-2 text-black placeholder-gray-500">🔮</h1>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-black placeholder-gray-500">성향 테스트</h2>
              <p className="text-gray-600 text-black placeholder-gray-500">전생의 기억을 찾기 위한 질문</p>
            </header>

            <div className="space-y-6 text-black placeholder-gray-500">
              {/* 질문 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-black placeholder-gray-500">
                  사람들과의 관계에서...
                </label>
                <div className="flex gap-3 text-black placeholder-gray-500">
                  <button
                    onClick={() => handlePersonality('introvert', true)}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      data.personality.introvert === true
                        ? 'border-purple-500 bg-purple-50 font-semibold shadow-md'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    혼자 있는 게 편함 🏠
                    {data.personality.introvert === true && ' ✓'}
                  </button>
                  <button
                    onClick={() => handlePersonality('introvert', false)}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      data.personality.introvert === false
                        ? 'border-blue-500 bg-blue-50 font-semibold shadow-md'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    사람들과 어울리기 좋아함 👥
                    {data.personality.introvert === false && ' ✓'}
                  </button>
                </div>
              </div>

              {/* 질문 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-black placeholder-gray-500">
                  문제를 해결할 때...
                </label>
                <div className="flex gap-3 text-black placeholder-gray-500">
                  <button
                    onClick={() => handlePersonality('logical', true)}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      data.personality.logical === true
                        ? 'border-cyan-500 bg-cyan-50 font-semibold shadow-md'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    논리적으로 분석 🧮
                    {data.personality.logical === true && ' ✓'}
                  </button>
                  <button
                    onClick={() => handlePersonality('logical', false)}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      data.personality.logical === false
                        ? 'border-blue-500 bg-blue-50 font-semibold shadow-md'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    직감으로 결정 💫
                    {data.personality.logical === false && ' ✓'}
                  </button>
                </div>
              </div>

              {/* 질문 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-black placeholder-gray-500">
                  새로운 것에 대해...
                </label>
                <div className="flex gap-3 text-black placeholder-gray-500">
                  <button
                    onClick={() => handlePersonality('adventurous', true)}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      data.personality.adventurous === true
                        ? 'border-orange-500 bg-orange-50 font-semibold shadow-md'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    도전적이고 모험 좋아함 🗺️
                    {data.personality.adventurous === true && ' ✓'}
                  </button>
                  <button
                    onClick={() => handlePersonality('adventurous', false)}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      data.personality.adventurous === false
                        ? 'border-green-500 bg-green-50 font-semibold shadow-md'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    안정적인 것 선호 🏡
                    {data.personality.adventurous === false && ' ✓'}
                  </button>
                </div>
              </div>

              {/* 질문 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-black placeholder-gray-500">
                  일할 때...
                </label>
                <div className="flex gap-3 text-black placeholder-gray-500">
                  <button
                    onClick={() => handlePersonality('creative', true)}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      data.personality.creative === true
                        ? 'border-purple-500 bg-purple-50 font-semibold shadow-md'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    창의적 작업 선호 🎨
                    {data.personality.creative === true && ' ✓'}
                  </button>
                  <button
                    onClick={() => handlePersonality('creative', false)}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      data.personality.creative === false
                        ? 'border-teal-500 bg-teal-50 font-semibold shadow-md'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    체계적 업무 선호 📋
                    {data.personality.creative === false && ' ✓'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 text-black placeholder-gray-500">
                <button
                  onClick={() => setStep(1)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                >
                  이전
                </button>
                <button
                  onClick={analyzePastLife}
                  disabled={!allAnswered}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                >
                  전생 확인하기
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Step 3: 결과
  if (step === 3 && result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 dark:from-purple-900 dark:via-indigo-900 dark:to-violet-900 transition-colors" style={{
        backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.2) 0%, transparent 50%), linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
          {/* 상단 배너 제거됨 */}

          <section className="bg-white rounded-2xl shadow-xl p-6 border border-amber-200 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <h1 className="text-3xl font-bold text-black mb-2 text-black placeholder-gray-500">✨</h1>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-black placeholder-gray-500">당신의 전생</h2>
            </header>

            {/* 전생 직업 */}
            <div className="mb-6 p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border-2 border-amber-400 text-center text-black placeholder-gray-500">
              <div className="text-sm text-black mb-2 text-black placeholder-gray-500">{result.era}</div>
              <div className="text-3xl font-bold text-black mb-3 text-black placeholder-gray-500">{result.job.job}</div>
              <div className="text-lg text-gray-700 mb-4 text-black placeholder-gray-500">{result.job.desc}</div>
              <div className="inline-block bg-amber-200 px-4 py-2 rounded-full text-black placeholder-gray-500">
                <span className="font-semibold text-black text-black placeholder-gray-500">적합도: {result.job.finalScore}점</span>
              </div>
            </div>

            {/* 전생 성격 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">🎭 전생의 성격</h3>
              <p className="text-gray-700 mb-2 text-black placeholder-gray-500">{result.job.trait}</p>
              <p className="text-sm text-black text-black placeholder-gray-500">오행: <span className="font-bold text-black placeholder-gray-500">{result.job.element}</span></p>
            </div>

            {/* 전생 인연 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">🔗 전생과의 인연</h3>
              <div className="space-y-2 text-black placeholder-gray-500">
                {result.connections.map((conn: string, i: number) => (
                  <div key={i} className="bg-white rounded p-3 text-sm text-gray-700 text-black placeholder-gray-500">
                    • {conn}
                  </div>
                ))}
              </div>
            </div>

            {/* 현생 적성 직업 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">💼 현생 적성 직업</h3>
              <p className="text-sm text-black mb-3 text-black placeholder-gray-500">{result.job.karma}</p>
              <div className="flex flex-wrap gap-2 text-black placeholder-gray-500">
                {result.presentCareer.map((career: string, i: number) => (
                  <span key={i} className="bg-green-100 text-black px-3 py-1 rounded-full text-sm font-semibold border border-green-300 text-black placeholder-gray-500">
                    {career}
                  </span>
                ))}
              </div>
            </div>

            {/* 행운 아이템 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">🍀 행운 아이템</h3>
              <p className="text-gray-700 text-black placeholder-gray-500">{result.luckyItem}</p>
              <p className="text-sm text-black mt-2 text-black placeholder-gray-500">
                {result.job.element} 기운을 강화하는 아이템을 가까이 두세요
              </p>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setResult(null);
                setData({
                  ...data,
                  personality: {
                    introvert: null,
                    logical: null,
                    adventurous: null,
                    creative: null
                  }
                });
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              다시 분석하기
            </button>
          </section>
        </div>
        {/* 제작자 서명 */}
        <AppFooter />

      </main>
    );
  }

  return null;
}

