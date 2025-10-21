"use client";

import { useState } from 'react';

// 비타민별 결핍 증상 데이터베이스
const VITAMIN_SYMPTOMS = {
  vitaminA: {
    name: '비타민 A (레티놀)',
    symptoms: [
      { id: 'night_blindness', text: '야맹증 (어두운 곳에서 잘 안 보임)', score: 10 },
      { id: 'dry_eyes', text: '눈이 건조하고 뻑뻑함', score: 8 },
      { id: 'dry_skin', text: '피부가 건조하고 거침', score: 6 },
      { id: 'acne', text: '여드름이 자주 생김', score: 5 },
      { id: 'weak_immunity', text: '감기에 자주 걸림', score: 7 }
    ],
    foods: ['당근', '시금치', '고구마', '망고', '달걀노른자', '간', '우유'],
    supplement: '하루 권장량: 남성 900μg, 여성 700μg'
  },
  vitaminB1: {
    name: '비타민 B1 (티아민)',
    symptoms: [
      { id: 'fatigue', text: '쉽게 피로하고 무기력함', score: 8 },
      { id: 'appetite_loss', text: '식욕이 없음', score: 7 },
      { id: 'numbness', text: '손발 저림', score: 9 },
      { id: 'memory', text: '기억력 감퇴', score: 6 },
      { id: 'irritability', text: '짜증이 잘 남', score: 5 }
    ],
    foods: ['현미', '돼지고기', '콩', '견과류', '시리얼'],
    supplement: '하루 권장량: 남성 1.2mg, 여성 1.1mg'
  },
  vitaminB2: {
    name: '비타민 B2 (리보플라빈)',
    symptoms: [
      { id: 'mouth_corner', text: '입꼬리가 자주 트고 헐음', score: 10 },
      { id: 'tongue_red', text: '혀가 붉고 아픔', score: 8 },
      { id: 'eye_fatigue', text: '눈의 피로와 충혈', score: 7 },
      { id: 'skin_flaky', text: '피부 각질이 많음', score: 6 },
      { id: 'light_sensitivity', text: '빛에 민감함', score: 7 }
    ],
    foods: ['우유', '요구르트', '달걀', '아몬드', '시금치', '버섯'],
    supplement: '하루 권장량: 남성 1.3mg, 여성 1.1mg'
  },
  vitaminB3: {
    name: '비타민 B3 (니아신)',
    symptoms: [
      { id: 'digestive', text: '소화불량, 설사', score: 7 },
      { id: 'skin_rash', text: '피부 발진', score: 8 },
      { id: 'headache', text: '두통이 잦음', score: 5 },
      { id: 'depression', text: '우울감', score: 6 },
      { id: 'confusion', text: '집중력 저하', score: 6 }
    ],
    foods: ['닭가슴살', '참치', '땅콩', '버섯', '아보카도'],
    supplement: '하루 권장량: 남성 16mg, 여성 14mg'
  },
  vitaminB6: {
    name: '비타민 B6 (피리독신)',
    symptoms: [
      { id: 'mood_swing', text: '기분 변화가 심함', score: 7 },
      { id: 'anemia', text: '빈혈 증상', score: 8 },
      { id: 'weak_immune', text: '면역력 약화', score: 6 },
      { id: 'cracked_lips', text: '입술이 갈라짐', score: 6 },
      { id: 'muscle_pain', text: '근육통', score: 5 }
    ],
    foods: ['바나나', '감자', '닭고기', '병아리콩', '연어'],
    supplement: '하루 권장량: 1.3-1.7mg'
  },
  vitaminB12: {
    name: '비타민 B12 (코발라민)',
    symptoms: [
      { id: 'extreme_fatigue', text: '극심한 피로', score: 9 },
      { id: 'pale_skin', text: '창백한 피부', score: 7 },
      { id: 'tingling', text: '손발 저림과 쑤심', score: 10 },
      { id: 'memory_loss', text: '기억력 감퇴', score: 8 },
      { id: 'balance', text: '균형감각 저하', score: 7 }
    ],
    foods: ['소고기', '달걀', '우유', '치즈', '조개류', '김'],
    supplement: '하루 권장량: 2.4μg (채식주의자는 보충제 필수)'
  },
  vitaminC: {
    name: '비타민 C (아스코르브산)',
    symptoms: [
      { id: 'gum_bleeding', text: '잇몸에서 피가 남', score: 9 },
      { id: 'slow_healing', text: '상처가 천천히 아물음', score: 8 },
      { id: 'bruising', text: '멍이 쉽게 듦', score: 7 },
      { id: 'joint_pain', text: '관절 통증', score: 6 },
      { id: 'frequent_cold', text: '감기에 자주 걸림', score: 7 }
    ],
    foods: ['귤', '키위', '딸기', '파프리카', '브로콜리', '토마토'],
    supplement: '하루 권장량: 100mg (흡연자는 더 필요)'
  },
  vitaminD: {
    name: '비타민 D (칼시페롤)',
    symptoms: [
      { id: 'bone_pain', text: '뼈와 근육 통증', score: 9 },
      { id: 'weak_bones', text: '골절 위험 증가', score: 8 },
      { id: 'low_mood', text: '우울감, 무기력', score: 7 },
      { id: 'hair_loss', text: '탈모', score: 6 },
      { id: 'immune_weak', text: '면역력 저하', score: 7 }
    ],
    foods: ['연어', '고등어', '참치', '달걀노른자', '버섯', '우유'],
    supplement: '하루 권장량: 600-800IU (햇빛 노출 부족 시 보충 필요)'
  },
  vitaminE: {
    name: '비타민 E (토코페롤)',
    symptoms: [
      { id: 'muscle_weakness', text: '근육 약화', score: 7 },
      { id: 'vision_problem', text: '시력 문제', score: 8 },
      { id: 'numbness_tingling', text: '손발 저림', score: 6 },
      { id: 'skin_aging', text: '피부 노화', score: 5 },
      { id: 'immune_decline', text: '면역 기능 저하', score: 6 }
    ],
    foods: ['아몬드', '해바라기씨', '아보카도', '시금치', '올리브오일'],
    supplement: '하루 권장량: 15mg'
  },
  vitaminK: {
    name: '비타민 K (필로퀴논)',
    symptoms: [
      { id: 'easy_bruising', text: '쉽게 멍이 듦', score: 9 },
      { id: 'nosebleeds', text: '코피가 자주 남', score: 8 },
      { id: 'heavy_periods', text: '생리량이 많음 (여성)', score: 7 },
      { id: 'weak_bones_k', text: '뼈가 약함', score: 7 },
      { id: 'blood_clotting', text: '상처 출혈이 멈추지 않음', score: 10 }
    ],
    foods: ['케일', '시금치', '브로콜리', '아스파라거스', '파슬리'],
    supplement: '하루 권장량: 남성 120μg, 여성 90μg'
  },
  iron: {
    name: '철분',
    symptoms: [
      { id: 'chronic_fatigue', text: '만성 피로', score: 9 },
      { id: 'pale', text: '창백한 얼굴', score: 8 },
      { id: 'dizziness', text: '어지러움', score: 8 },
      { id: 'cold_hands', text: '손발이 차가움', score: 7 },
      { id: 'brittle_nails', text: '손톱이 잘 깨짐', score: 6 }
    ],
    foods: ['소고기', '시금치', '콩', '굴', '건포도', '두부'],
    supplement: '하루 권장량: 남성 8mg, 여성 18mg (월경 중)'
  },
  magnesium: {
    name: '마그네슘',
    symptoms: [
      { id: 'muscle_cramps', text: '근육 경련', score: 9 },
      { id: 'eye_twitch', text: '눈떨림', score: 8 },
      { id: 'insomnia', text: '불면증', score: 7 },
      { id: 'anxiety', text: '불안감', score: 6 },
      { id: 'constipation', text: '변비', score: 5 }
    ],
    foods: ['아몬드', '시금치', '바나나', '다크 초콜릿', '아보카도'],
    supplement: '하루 권장량: 남성 400-420mg, 여성 310-320mg'
  }
};

export default function VitaminCheck() {
  const [selections, setSelections] = useState<{[key: string]: string[]}>({});
  const [result, setResult] = useState<any>(null);

  const toggleSymptom = (vitaminKey: string, symptomId: string) => {
    setSelections(prev => {
      const current = prev[vitaminKey] || [];
      if (current.includes(symptomId)) {
        return { ...prev, [vitaminKey]: current.filter(id => id !== symptomId) };
      } else {
        return { ...prev, [vitaminKey]: [...current, symptomId] };
      }
    });
  };

  const analyze = () => {
    const deficiencies = [];

    for (const [key, data] of Object.entries(VITAMIN_SYMPTOMS)) {
      const selected = selections[key] || [];
      if (selected.length === 0) continue;

      const totalScore = selected.reduce((sum, symptomId) => {
        const symptom = data.symptoms.find(s => s.id === symptomId);
        return sum + (symptom?.score || 0);
      }, 0);

      const maxPossibleScore = data.symptoms.reduce((sum, s) => sum + s.score, 0);
      const percentage = Math.round((totalScore / maxPossibleScore) * 100);

      if (percentage >= 30) {
        deficiencies.push({
          vitamin: data.name,
          score: totalScore,
          percentage,
          count: selected.length,
          foods: data.foods,
          supplement: data.supplement,
          severity: percentage >= 70 ? '심각' : percentage >= 50 ? '주의' : '경미'
        });
      }
    }

    deficiencies.sort((a, b) => b.percentage - a.percentage);

    setResult({
      deficiencies,
      totalSymptoms: Object.values(selections).reduce((sum, arr) => sum + arr.length, 0)
    });
  };

  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-50 dark:from-green-900 dark:via-gray-900 dark:to-blue-900 transition-colors" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 40%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
          <div className="mb-4 text-black placeholder-gray-500">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <h1 className="text-3xl font-bold text-black mb-2 text-black placeholder-gray-500">💊</h1>
              <h2 className="text-2xl font-bold text-gray-800 text-black placeholder-gray-500">비타민 결핍 진단 결과</h2>
              <p className="text-gray-600 mt-2 text-black placeholder-gray-500">총 {result.totalSymptoms}개 증상 선택됨</p>
            </header>

            {result.deficiencies.length === 0 ? (
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-400 text-center text-black placeholder-gray-500">
                <div className="text-4xl mb-3 text-black placeholder-gray-500">✅</div>
                <div className="text-2xl font-bold text-black mb-2 text-black placeholder-gray-500">비타민 상태 양호!</div>
                <p className="text-gray-700 text-black placeholder-gray-500">특별한 결핍 증상이 발견되지 않았습니다.</p>
                <p className="text-sm text-gray-600 mt-2 text-black placeholder-gray-500">균형 잡힌 식단을 계속 유지하세요.</p>
              </div>
            ) : (
              <>
                {result.deficiencies.map((def: any, i: number) => (
                  <div key={i} className={`mb-6 p-5 rounded-xl border-2 ${
                    def.severity === '심각' ? 'bg-red-50 border-red-400' :
                    def.severity === '주의' ? 'bg-orange-50 border-orange-400' :
                    'bg-yellow-50 border-yellow-400'
                  }`}>
                    <div className="flex justify-between items-start mb-3 text-black placeholder-gray-500">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 text-black placeholder-gray-500">{def.vitamin}</h3>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                          def.severity === '심각' ? 'bg-red-600 text-white' :
                          def.severity === '주의' ? 'bg-orange-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {def.severity}
                        </div>
                      </div>
                      <div className="text-right text-black placeholder-gray-500">
                        <div className="text-3xl font-bold" style={{
                          background: def.severity === '심각' ? 'linear-gradient(135deg, #dc2626, #991b1b)' :
                                     def.severity === '주의' ? 'linear-gradient(135deg, #ea580c, #c2410c)' :
                                     'linear-gradient(135deg, #ca8a04, #a16207)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {def.percentage}%
                        </div>
                        <div className="text-xs text-gray-600 text-black placeholder-gray-500">{def.count}개 증상</div>
                      </div>
                    </div>

                    <div className="mb-4 text-black placeholder-gray-500">
                      <h4 className="font-semibold text-gray-800 mb-2 text-black placeholder-gray-500">🥗 추천 식품</h4>
                      <div className="flex flex-wrap gap-2 text-black placeholder-gray-500">
                        {def.foods.map((food: string, fi: number) => (
                          <span key={fi} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-300 text-black placeholder-gray-500">
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg text-black placeholder-gray-500">
                      <div className="text-sm text-gray-700 text-black placeholder-gray-500">
                        <span className="font-semibold text-black placeholder-gray-500">💊 권장량:</span> {def.supplement}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* 종합 조언 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">💡 종합 건강 조언</h3>
              <div className="space-y-2 text-sm text-gray-700 text-black placeholder-gray-500">
                <div className="bg-white rounded p-3 text-black placeholder-gray-500">
                  • 균형 잡힌 식단: 다양한 색깔의 채소와 과일 섭취
                </div>
                <div className="bg-white rounded p-3 text-black placeholder-gray-500">
                  • 햇빛 노출: 비타민 D 합성을 위해 하루 15분
                </div>
                <div className="bg-white rounded p-3 text-black placeholder-gray-500">
                  • 보충제: 결핍이 심각하면 전문의 상담 후 복용
                </div>
                <div className="bg-white rounded p-3 text-black placeholder-gray-500">
                  • 정기 검진: 연 1회 혈액 검사로 확인
                </div>
                <div className="bg-white rounded p-3 text-black placeholder-gray-500">
                  • 조리법: 비타민 손실 최소화하는 조리 방법
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setSelections({});
              }}
              className="w-full px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              🔄 다시 진단하기
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">
            <p className="text-xs text-gray-500 text-center px-4 text-black placeholder-gray-500">
              ⚠️ 이 진단은 참고용이며, 정확한 진단은 의료기관에서 받으세요.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-black placeholder-gray-500">
      <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
        <div className="mb-4 text-black placeholder-gray-500">
          
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-6 text-black placeholder-gray-500">
          <header className="text-center mb-6 text-black placeholder-gray-500">
            <h1 className="text-4xl font-bold text-black mb-2 text-black placeholder-gray-500">💊</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-black placeholder-gray-500">비타민 부족 자가진단</h2>
            <p className="text-gray-600 text-black placeholder-gray-500">해당하는 증상을 모두 선택하세요</p>
          </header>

          <div className="space-y-6 mb-6 text-black placeholder-gray-500">
            {Object.entries(VITAMIN_SYMPTOMS).map(([key, data]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-black placeholder-gray-500">
                <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">{data.name}</h3>
                <div className="space-y-2 text-black placeholder-gray-500">
                  {data.symptoms.map(symptom => (
                    <label
                      key={symptom.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        (selections[key] || []).includes(symptom.id)
                          ? 'bg-green-100 border-2 border-green-500 shadow-md'
                          : 'bg-white border border-gray-300 hover:border-green-300 hover:shadow-sm'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={(selections[key] || []).includes(symptom.id)}
                        onChange={() => toggleSymptom(key, symptom.id)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <span className="flex-1 text-gray-700 text-black placeholder-gray-500">{symptom.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 text-black placeholder-gray-500">
            <h3 className="font-bold text-black mb-2 text-black placeholder-gray-500">⚠️ 주의사항</h3>
            <ul className="text-sm text-black space-y-1 text-black placeholder-gray-500">
              <li>• 이 진단은 참고용입니다</li>
              <li>• 정확한 진단은 병원 혈액 검사 필요</li>
              <li>• 심각한 증상은 의사와 상담하세요</li>
              <li>• 과다 복용도 문제가 될 수 있습니다</li>
            </ul>
          </div>

          <button
            onClick={analyze}
            disabled={Object.values(selections).every(arr => arr.length === 0)}
            className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              Object.values(selections).every(arr => arr.length === 0)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
            }`}
          >
            {Object.values(selections).every(arr => arr.length === 0) 
              ? '증상을 선택해주세요' 
              : `결과 확인하기 (${Object.values(selections).reduce((sum, arr) => sum + arr.length, 0)}개 선택됨)`
            }
          </button>
        </section>

        <footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">
          <p className="text-xs text-gray-500 text-center px-4 text-black placeholder-gray-500">
            ⚠️ 이 진단은 참고용이며, 정확한 진단은 의료기관에서 받으세요.
          </p>
        </footer>
      </div>
    </main>
  );
}

