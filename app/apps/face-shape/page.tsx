"use client";

import { useState } from 'react';

const FACE_SHAPES = {
  oval: {
    name: '계란형 (Oval)',
    icon: '🥚',
    features: [
      '이마, 광대뼈, 턱의 너비가 비슷',
      '부드러운 둥근 턱선',
      '얼굴 길이가 너비의 1.5배',
      '이상적인 얼굴형'
    ],
    hairstyles: {
      best: [
        '롱 레이어드 컷',
        '미디움 웨이브',
        '앞머리 있는 단발',
        '허쉬컷',
        '웨이브 펌',
        'C컬 단발'
      ],
      avoid: ['과도한 볼륨', '너무 짧은 헤어']
    },
    makeup: [
      '자연스러운 셰이딩',
      '볼 중앙에 블러셔',
      '자연스러운 눈썹 라인'
    ],
    celebrities: ['송혜교', '아이유', '수지', '정려원'],
    color: 'pink'
  },
  round: {
    name: '둥근형 (Round)',
    icon: '🌕',
    features: [
      '얼굴 길이와 너비가 비슷',
      '부드러운 곡선',
      '동글동글한 턱선',
      '귀여운 인상'
    ],
    hairstyles: {
      best: [
        '롱 스트레이트',
        '앞머리 없는 헤어',
        'V라인 커트',
        '웨이브 롱',
        '옆머리 볼륨',
        '레이어드 컷'
      ],
      avoid: ['단발', '앞머리 쳐진 스타일', '볼 옆 볼륨']
    },
    makeup: [
      '세로 방향 셰이딩',
      '턱 끝 음영',
      '높은 하이라이트'
    ],
    celebrities: ['박보영', '문채원', '김고은'],
    color: 'amber'
  },
  square: {
    name: '사각형 (Square)',
    icon: '◻️',
    features: [
      '각진 턱선',
      '이마, 광대, 턱의 너비가 비슷',
      '강한 인상',
      '카리스마 있는 느낌'
    ],
    hairstyles: {
      best: [
        '웨이브 펌',
        'S컬 롱',
        '부드러운 레이어드',
        '옆머리 볼륨',
        '긴 앞머리',
        '웨이비 미디움'
      ],
      avoid: ['일자 단발', '짧은 헤어', '스트레이트 단발']
    },
    makeup: [
      '턱선 둥글게 셰이딩',
      '볼에 블러셔',
      '부드러운 아이라인'
    ],
    celebrities: ['안젤리나 졸리', '올리비아 와일드', '데미 무어'],
    color: 'orange'
  },
  heart: {
    name: '하트형 (Heart)',
    icon: '❤️',
    features: [
      '넓은 이마',
      '좁은 턱',
      '뾰족한 턱선',
      '사랑스러운 인상'
    ],
    hairstyles: {
      best: [
        '턱선 레이어드',
        '옆머리 볼륨',
        '앞머리 있는 단발',
        '미디움 웨이브',
        'C컬 펌',
        '아래 볼륨'
      ],
      avoid: ['올백', '짧은 앞머리', '이마 볼륨']
    },
    makeup: [
      '이마 셰이딩',
      '턱 하이라이트',
      '자연스러운 블러셔'
    ],
    celebrities: ['스칼렛 요한슨', '리즈 위더스푼', '할리 베리'],
    color: 'red'
  },
  oblong: {
    name: '긴 얼굴형 (Oblong)',
    icon: '📏',
    features: [
      '얼굴 길이가 긺',
      '좁은 얼굴',
      '긴 턱선',
      '세련된 인상'
    ],
    hairstyles: {
      best: [
        '미디움 레이어드',
        '웨이브 펌',
        '앞머리 있는 스타일',
        '볼륨 단발',
        '옆으로 볼륨',
        '허쉬컷'
      ],
      avoid: ['롱 스트레이트', '정가운데 가르마', '올백']
    },
    makeup: [
      '이마/턱 셰이딩',
      '볼 옆 하이라이트',
      '가로 방향 블러셔'
    ],
    celebrities: ['사라 제시카 파커', '리브 타일러'],
    color: 'blue'
  },
  diamond: {
    name: '다이아몬드형 (Diamond)',
    icon: '💎',
    features: [
      '넓은 광대뼈',
      '좁은 이마와 턱',
      '각진 얼굴 라인',
      '도도한 인상'
    ],
    hairstyles: {
      best: [
        '사이드 파트',
        '앞머리 스타일',
        '웨이브 롱',
        '볼륨 미디움',
        '풀뱅 앞머리',
        '레이어드 웨이브'
      ],
      avoid: ['중앙 가르마', '짧은 헤어', '볼 옆 볼륨']
    },
    makeup: [
      '광대뼈 셰이딩',
      '이마 하이라이트',
      '부드러운 윤곽'
    ],
    celebrities: ['할 베리', '비욘세'],
    color: 'purple'
  }
};

export default function FaceShape() {
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [result, setResult] = useState<any>(null);

  const questions = [
    {
      id: 'q1',
      question: '얼굴 길이와 너비 비교',
      options: [
        { value: 'longer', text: '길이가 더 김', shapes: ['oblong'] },
        { value: 'similar', text: '비슷함', shapes: ['round', 'square'] },
        { value: 'balanced', text: '1.5배 정도', shapes: ['oval', 'heart', 'diamond'] }
      ]
    },
    {
      id: 'q2',
      question: '턱선 모양',
      options: [
        { value: 'round', text: '둥근 턱', shapes: ['oval', 'round'] },
        { value: 'square', text: '각진 턱', shapes: ['square'] },
        { value: 'pointed', text: '뾰족한 턱', shapes: ['heart', 'diamond'] },
        { value: 'long', text: '긴 턱', shapes: ['oblong'] }
      ]
    },
    {
      id: 'q3',
      question: '광대뼈 위치',
      options: [
        { value: 'wide', text: '넓고 튀어나옴', shapes: ['diamond', 'square'] },
        { value: 'normal', text: '보통', shapes: ['oval', 'round'] },
        { value: 'narrow', text: '좁음', shapes: ['heart', 'oblong'] }
      ]
    },
    {
      id: 'q4',
      question: '이마 너비',
      options: [
        { value: 'wide', text: '넓은 편', shapes: ['heart', 'oval'] },
        { value: 'normal', text: '보통', shapes: ['round', 'square'] },
        { value: 'narrow', text: '좁은 편', shapes: ['diamond', 'oblong'] }
      ]
    },
    {
      id: 'q5',
      question: '얼굴의 가장 넓은 부분',
      options: [
        { value: 'forehead', text: '이마', shapes: ['heart'] },
        { value: 'cheekbone', text: '광대뼈', shapes: ['diamond', 'oval'] },
        { value: 'jaw', text: '턱', shapes: ['square'] },
        { value: 'all', text: '전체적으로 비슷', shapes: ['round', 'oblong'] }
      ]
    }
  ];

  const analyze = () => {
    const scores: {[key: string]: number} = {};

    // 각 질문의 답변에서 얼굴형에 점수 부여
    Object.values(answers).forEach(answer => {
      const question = questions.find(q => q.options.some(opt => opt.value === answer));
      const option = question?.options.find(opt => opt.value === answer);
      
      option?.shapes.forEach(shape => {
        scores[shape] = (scores[shape] || 0) + 1;
      });
    });

    // 가장 높은 점수의 얼굴형 찾기
    let maxScore = 0;
    let detectedShape = 'oval';

    Object.entries(scores).forEach(([shape, score]) => {
      if (score > maxScore) {
        maxScore = score;
        detectedShape = shape;
      }
    });

    const shapeData = FACE_SHAPES[detectedShape as keyof typeof FACE_SHAPES];

    setResult({
      shape: detectedShape,
      data: shapeData,
      confidence: Math.min(100, Math.round((maxScore / questions.length) * 100))
    });
  };

  if (result) {
    const data = result.data;
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 text-black placeholder-gray-500">
        <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
          <div className="mb-4 text-black placeholder-gray-500">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6 text-black placeholder-gray-500">
            <header className="text-center mb-6 text-black placeholder-gray-500">
              <h1 className="text-4xl mb-2 text-black placeholder-gray-500">{data.icon}</h1>
              <h2 className="text-2xl font-bold text-gray-800 text-black placeholder-gray-500">당신의 얼굴형은</h2>
              <div className="text-3xl font-bold mt-2" style={{
                background: `linear-gradient(135deg, ${
                  data.color === 'pink' ? '#ec4899, #db2777' :
                  data.color === 'amber' ? '#f59e0b, #d97706' :
                  data.color === 'orange' ? '#f97316, #ea580c' :
                  data.color === 'red' ? '#ef4444, #dc2626' :
                  data.color === 'blue' ? '#3b82f6, #2563eb' :
                  '#a855f7, #9333ea'
                })`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {data.name}
              </div>
              <p className="text-sm text-gray-600 mt-2 text-black placeholder-gray-500">정확도: {result.confidence}%</p>
            </header>

            {/* 얼굴형 특징 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">📋 얼굴형 특징</h3>
              <div className="space-y-2 text-black placeholder-gray-500">
                {data.features.map((feature: string, i: number) => (
                  <div key={i} className="bg-white rounded p-3 text-sm text-gray-700 text-black placeholder-gray-500">
                    • {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* 추천 헤어스타일 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">✨ 추천 헤어스타일</h3>
              <div className="grid grid-cols-2 gap-2 mb-4 text-black placeholder-gray-500">
                {data.hairstyles.best.map((style: string, i: number) => (
                  <div key={i} className="bg-white rounded p-3 text-center font-medium text-black border-2 border-green-400 text-black placeholder-gray-500">
                    {style}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-black placeholder-gray-500">
                <h4 className="font-semibold text-black mb-2 text-black placeholder-gray-500">🚫 피해야 할 스타일</h4>
                <div className="flex flex-wrap gap-2 text-black placeholder-gray-500">
                  {data.hairstyles.avoid.map((style: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-red-100 rounded-full text-sm text-black text-black placeholder-gray-500">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 메이크업 팁 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">💄 메이크업 팁</h3>
              <div className="space-y-2 text-black placeholder-gray-500">
                {data.makeup.map((tip: string, i: number) => (
                  <div key={i} className="bg-white rounded p-3 text-sm text-gray-700 text-black placeholder-gray-500">
                    {i + 1}. {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* 비슷한 얼굴형 연예인 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">⭐ 같은 얼굴형 연예인</h3>
              <div className="flex flex-wrap gap-2 text-black placeholder-gray-500">
                {data.celebrities.map((celeb: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-white rounded-full font-semibold text-black border-2 border-amber-400 text-black placeholder-gray-500">
                    {celeb}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3 text-black placeholder-gray-500">
                이들의 헤어스타일과 메이크업을 참고하세요!
              </p>
            </div>

            {/* 스타일링 가이드 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 text-black placeholder-gray-500">
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-black placeholder-gray-500">🎨 스타일링 꿀팁</h3>
              <div className="space-y-2 text-sm text-gray-700 text-black placeholder-gray-500">
                <div className="bg-white rounded p-3 text-black placeholder-gray-500">
                  <span className="font-semibold text-black placeholder-gray-500">가르마:</span> {
                    data.name.includes('둥근') ? '중앙 가르마 피하기' :
                    data.name.includes('긴') ? '사이드 가르마' :
                    data.name.includes('하트') ? '사이드 가르마' :
                    '자유롭게 가능'
                  }
                </div>
                <div className="bg-white rounded p-3 text-black placeholder-gray-500">
                  <span className="font-semibold text-black placeholder-gray-500">볼륨:</span> {
                    data.name.includes('둥근') ? '옆머리 볼륨 추가' :
                    data.name.includes('긴') ? '가로 볼륨' :
                    data.name.includes('사각') ? '부드러운 웨이브' :
                    '자연스러운 볼륨'
                  }
                </div>
                <div className="bg-white rounded p-3 text-black placeholder-gray-500">
                  <span className="font-semibold text-black placeholder-gray-500">안경:</span> {
                    data.name.includes('둥근') ? '각진 프레임' :
                    data.name.includes('사각') ? '둥근 프레임' :
                    data.name.includes('긴') ? '넓은 프레임' :
                    '다양한 스타일 가능'
                  }
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
              }}
              className={`w-full py-4 bg-gradient-to-r ${
                data.color === 'pink' ? 'from-blue-600 to-blue-600' :
                data.color === 'amber' ? 'from-amber-600 to-orange-600' :
                data.color === 'orange' ? 'from-orange-600 to-red-600' :
                data.color === 'red' ? 'from-red-600 to-blue-600' :
                data.color === 'blue' ? 'from-blue-600 to-indigo-600' :
                'from-purple-600 to-blue-600'
              } text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all`}
            >
              다시 분석하기
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">
            
            <p className="text-xs text-gray-500 text-center px-4 text-black placeholder-gray-500">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 text-black placeholder-gray-500">
      <div className="mx-auto max-w-[600px] px-4 py-6 text-black placeholder-gray-500">
        <div className="mb-4 text-black placeholder-gray-500">
          
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-6 text-black placeholder-gray-500">
          <header className="text-center mb-6 text-black placeholder-gray-500">
            <h1 className="text-4xl font-bold text-black mb-2 text-black placeholder-gray-500">👤</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-black placeholder-gray-500">얼굴형 분석 & 헤어스타일 추천</h2>
            <p className="text-gray-600 text-black placeholder-gray-500">5가지 질문으로 나에게 맞는 스타일 찾기</p>
          </header>

          <div className="space-y-6 mb-6 text-black placeholder-gray-500">
            {questions.map((q, i) => (
              <div key={q.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-black placeholder-gray-500">
                <h3 className="font-bold text-gray-800 mb-3 text-black placeholder-gray-500">
                  {i + 1}. {q.question}
                </h3>
                <div className="space-y-2 text-black placeholder-gray-500">
                  {q.options.map(option => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        answers[q.id] === option.value
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white border border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={option.value}
                        checked={answers[q.id] === option.value}
                        onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                        className="w-5 h-5 text-black"
                      />
                      <span className="text-gray-700 text-black placeholder-gray-500">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-black placeholder-gray-500">
            <h3 className="font-bold text-black mb-2 text-black placeholder-gray-500">💡 측정 방법</h3>
            <ul className="text-sm text-black space-y-1 text-black placeholder-gray-500">
              <li>• 거울 앞에서 머리를 뒤로 묶으세요</li>
              <li>• 얼굴 윤곽을 자세히 관찰하세요</li>
              <li>• 정면 사진을 찍어 확인하면 더 정확해요</li>
            </ul>
          </div>

          <button
            onClick={analyze}
            disabled={Object.keys(answers).length < questions.length}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            얼굴형 분석하기
          </button>
        </section>

        <footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">
          
          <p className="text-xs text-gray-500 text-center px-4 text-black placeholder-gray-500">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </footer>
      </div>
    </main>
  );
}

