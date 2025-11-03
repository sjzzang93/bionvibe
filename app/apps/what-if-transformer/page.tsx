"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

interface Scenario {
  name: string;
  emoji: string;
  title: string;
  life: string[];
  advantages: string[];
  disadvantages: string[];
  dailyLife: string;
  ending: string;
  funFact: string;
}

const SCENARIOS: Record<string, Scenario> = {
  dog: {
    name: '강아지',
    emoji: '🐕',
    title: '만약 내가 강아지였다면',
    life: [
      '아침에 눈을 뜨면 주인님의 얼굴을 핥으며 하루를 시작해요',
      '산책 시간이 되면 세상에서 가장 신나는 일이 벌어져요',
      '밥그릇을 보면 꼬리가 저절로 흔들려요',
      '주인님이 집에 돌아오면 세상을 다 가진 기분이에요',
      '낮잠은 하루 종일 자유롭게 잘 수 있어요'
    ],
    advantages: ['무조건적인 사랑을 받아요', '매일 산책으로 건강해요', '걱정 없이 살 수 있어요'],
    disadvantages: ['혼자 집을 지켜야 할 때가 외로워요', '목욕을 자주 해야 해요', '초콜릿을 먹을 수 없어요'],
    dailyLife: '아침 산책 → 낮잠 → 놀이시간 → 저녁 산책 → 주인님과 함께 TV 시청',
    ending: '충직하고 사랑스러운 반려견으로 평생을 주인님과 함께 행복하게 살았어요',
    funFact: '강아지의 후각은 사람보다 1만 배 이상 뛰어나요! 세상을 냄새로 느끼는 특별한 경험을 할 수 있어요.'
  },
  cat: {
    name: '고양이',
    emoji: '🐱',
    title: '만약 내가 고양이였다면',
    life: [
      '하루 16시간 잠을 자며 여유로운 삶을 즐겨요',
      '높은 곳에 올라가 세상을 내려다보는 걸 좋아해요',
      '내가 원할 때만 애교를 부려요',
      '햇빛이 드는 곳을 찾아다니며 일광욕을 즐겨요',
      '밤에는 활동적으로 변해 집안을 탐험해요'
    ],
    advantages: ['독립적으로 살 수 있어요', '유연한 몸으로 어디든 갈 수 있어요', '그루밍으로 항상 깨끗해요'],
    disadvantages: ['물을 싫어해서 목욕이 힘들어요', '털갈이 시즌이 괴로워요', '호기심 때문에 위험할 때가 있어요'],
    dailyLife: '아침 낮잠 → 점심 낮잠 → 간식 시간 → 저녁 낮잠 → 밤 대운동회',
    ending: '우아하고 도도한 고양이로 자신만의 왕국을 지배하며 살았어요',
    funFact: '고양이는 하루에 70%의 시간을 잠으로 보내요. 진정한 휴식의 달인이죠!'
  },
  billionaire: {
    name: '억만장자',
    emoji: '💰',
    title: '만약 내가 억만장자였다면',
    life: [
      '아침에 눈을 뜨면 펜트하우스 전망을 감상해요',
      '개인 셰프가 만든 아침 식사를 즐겨요',
      '전용기로 원하는 나라에 언제든 갈 수 있어요',
      '자선 활동으로 세상에 기여해요',
      '꿈꿔왔던 모든 취미를 마음껏 즐겨요'
    ],
    advantages: ['돈 걱정이 전혀 없어요', '세계 어디든 갈 수 있어요', '많은 사람을 도울 수 있어요'],
    disadvantages: ['진심으로 대하는 사람을 구별하기 어려워요', '세금이 엄청나요', '프라이버시가 없어요'],
    dailyLife: '요트에서 아침 → 골프 → 고급 레스토랑 점심 → 사업 미팅 → 자선 파티',
    ending: '부와 명예를 얻었지만, 진정한 행복은 사랑하는 사람들과 함께하는 시간에서 찾았어요',
    funFact: '세계 억만장자들의 평균 수면시간은 6시간이에요. 부자가 되려면 부지런해야 해요!'
  },
  celebrity: {
    name: '유명 연예인',
    emoji: '⭐',
    title: '만약 내가 유명 연예인이었다면',
    life: [
      '매일 아침 메이크업과 스타일링을 받아요',
      '공항에서 수백 명의 팬들이 환호해요',
      '드라마와 광고 촬영으로 바쁜 하루를 보내요',
      'SNS 게시물 하나로 수십만 개의 좋아요를 받아요',
      '시상식에서 상을 받으며 꿈을 이뤄요'
    ],
    advantages: ['많은 사람의 사랑을 받아요', '높은 수입을 얻어요', '영향력이 커요'],
    disadvantages: ['사생활이 전혀 없어요', '악플과 루머에 시달려요', '항상 이미지 관리를 해야 해요'],
    dailyLife: '새벽 메이크업 → 촬영장 → 인터뷰 → 팬사인회 → 저녁 스케줄',
    ending: '화려한 무대 위의 삶이었지만, 진정한 나를 찾는 여정이었어요',
    funFact: '유명 연예인들은 하루 평균 4시간을 SNS 관리에 사용한다고 해요!'
  },
  astronaut: {
    name: '우주비행사',
    emoji: '🚀',
    title: '만약 내가 우주비행사였다면',
    life: [
      '무중력 상태에서 떠다니며 하루를 시작해요',
      '우주정거장 창문으로 지구를 내려다봐요',
      '우주복을 입고 우주 유영을 해요',
      '실험을 진행하며 인류의 미래를 연구해요',
      '멀리서 보는 지구의 아름다움에 감동해요'
    ],
    advantages: ['우주를 직접 경험해요', '인류의 영웅이 돼요', '특별한 경험을 해요'],
    disadvantages: ['가족과 오래 떨어져 있어요', '위험한 상황이 많아요', '우주식을 먹어야 해요'],
    dailyLife: '건강 체크 → 우주 실험 → 운동 (근육 유지) → 지구와 통신 → 우주식 식사',
    ending: '지구의 소중함을 깨닫고, 우주에서 본 푸른 행성의 아름다움을 평생 간직했어요',
    funFact: '우주에서는 키가 5cm 정도 자라요! 무중력 상태에서 척추가 늘어나기 때문이죠.'
  },
  teacher: {
    name: '선생님',
    emoji: '👨‍🏫',
    title: '만약 내가 선생님이었다면',
    life: [
      '아침 조회에서 학생들의 밝은 인사를 받아요',
      '수업 시간에 학생들의 반짝이는 눈을 봐요',
      '점심시간에는 학생들과 함께 밥을 먹어요',
      '방과 후 상담으로 학생들의 고민을 들어줘요',
      '학생들의 성장을 지켜보며 보람을 느껴요'
    ],
    advantages: ['아이들의 성장을 함께해요', '존경받는 직업이에요', '방학이 있어요'],
    disadvantages: ['업무량이 많아요', '감정노동이 심해요', '학부모 상담이 부담스러워요'],
    dailyLife: '조회 → 1-4교시 수업 → 점심 → 5-6교시 → 방과 후 활동 → 행정업무',
    ending: '제자들의 꿈을 키워주는 보람찬 삶을 살았고, 졸업생들의 감사 인사가 큰 기쁨이었어요',
    funFact: '선생님들은 하루 평균 1만 5천 단어를 말해요. 라디오 DJ보다 많죠!'
  },
  chef: {
    name: '유명 셰프',
    emoji: '👨‍🍳',
    title: '만약 내가 유명 셰프였다면',
    life: [
      '새벽 시장에서 신선한 재료를 직접 골라요',
      '주방에서 새로운 레시피를 개발해요',
      '서비스 시간에는 긴장감 속에서 요리를 완성해요',
      '손님들의 만족스러운 표정을 보며 보람을 느껴요',
      'TV 요리 프로그램에 출연해 노하우를 공유해요'
    ],
    advantages: ['창의적인 작업을 해요', '미식의 세계를 탐험해요', '사람들을 행복하게 해요'],
    disadvantages: ['근무 시간이 불규칙해요', '체력 소모가 커요', '화상과 베임의 위험이 있어요'],
    dailyLife: '새벽 시장 → 재료 준비 → 메뉴 개발 → 서비스 → 청소 → 다음 날 준비',
    ending: '음식으로 사람들에게 행복을 선물했고, 미슐랭 스타를 받는 영예를 안았어요',
    funFact: '유명 셰프들은 하루에 100가지 이상의 맛을 봐야 해요. 미각이 정말 발달하죠!'
  },
  time_traveler: {
    name: '타임 트래블러',
    emoji: '⏰',
    title: '만약 내가 타임 트래블러였다면',
    life: [
      '과거로 가서 역사적 순간을 목격해요',
      '미래를 방문해 첨단 기술을 경험해요',
      '중요한 역사를 바꾸지 않도록 조심해요',
      '다양한 시대의 문화를 직접 체험해요',
      '시간 여행의 비밀을 지켜야 해요'
    ],
    advantages: ['모든 시대를 경험할 수 있어요', '역사를 직접 볼 수 있어요', '특별한 지식을 얻어요'],
    disadvantages: ['원래 시대로 못 돌아갈 위험이 있어요', '시간의 법칙을 지켜야 해요', '외로울 수 있어요'],
    dailyLife: '시간대 선택 → 역사 공부 → 시간 이동 → 관찰과 기록 → 현재로 귀환',
    ending: '모든 시대를 여행하며 인류의 역사를 지켜봤고, 시간의 소중함을 깨달았어요',
    funFact: '만약 과거로 돌아간다면, 나비효과로 미래가 완전히 바뀔 수 있어요!'
  },
  superhero: {
    name: '슈퍼히어로',
    emoji: '🦸',
    title: '만약 내가 슈퍼히어로였다면',
    life: [
      '아침에 도시를 날아다니며 순찰해요',
      '범죄 현장에 빠르게 출동해요',
      '악당과 치열한 전투를 벌여요',
      '시민들을 구하고 감사 인사를 받아요',
      '밤에는 비밀 기지에서 휴식을 취해요'
    ],
    advantages: ['사람들을 구할 수 있어요', '특별한 능력이 있어요', '영웅 대접을 받아요'],
    disadvantages: ['항상 위험에 노출돼요', '정체를 숨겨야 해요', '평범한 삶을 살 수 없어요'],
    dailyLife: '도시 순찰 → 범죄 진압 → 시민 구조 → 악당과 전투 → 비밀 아지트 복귀',
    ending: '세상을 지키는 영웅으로 살았지만, 가장 소중한 건 지켜야 할 사람들이었어요',
    funFact: '슈퍼히어로가 입는 망토는 실제로는 위험해요. 비행 중 걸릴 수 있거든요!'
  },
  president: {
    name: '대통령',
    emoji: '🎖️',
    title: '만약 내가 대통령이었다면',
    life: [
      '아침 브리핑으로 국가 현황을 파악해요',
      '중요한 국가 정책을 결정해요',
      '외국 정상들과 회담을 가져요',
      '국민들 앞에서 연설을 해요',
      '국가의 미래를 책임지는 결정을 내려요'
    ],
    advantages: ['국가를 이끌 수 있어요', '역사에 이름을 남겨요', '큰 영향력을 행사해요'],
    disadvantages: ['엄청난 책임감이 있어요', '프라이버시가 전혀 없어요', '비판을 많이 받아요'],
    dailyLife: '보안 브리핑 → 각료 회의 → 국회 출석 → 국민 면담 → 정상 회담',
    ending: '국가를 위해 헌신했지만, 모든 사람을 만족시킬 수 없다는 걸 배웠어요',
    funFact: '대통령은 하루 평균 300개의 문서에 서명해요. 손목이 아프겠죠?'
  },
  wizard: {
    name: '마법사',
    emoji: '🧙',
    title: '만약 내가 마법사였다면',
    life: [
      '마법 지팡이로 아침 식사를 만들어요',
      '마법 학교에서 새로운 주문을 배워요',
      '빗자루를 타고 하늘을 날아다녀요',
      '물약을 조제하며 연구를 해요',
      '어둠의 마법사와 맞서 싸워요'
    ],
    advantages: ['마법을 부릴 수 있어요', '불가능한 일을 할 수 있어요', '오래 살 수 있어요'],
    disadvantages: ['마법을 잘못 쓰면 위험해요', '마법 세계의 규칙을 지켜야 해요', '머글들과 거리가 생겨요'],
    dailyLife: '주문 연습 → 마법 수업 → 물약 제조 → 마법 생물 돌보기 → 어둠과의 전투',
    ending: '마법의 힘으로 세상을 지켰고, 진정한 마법은 사랑이라는 걸 깨달았어요',
    funFact: '마법사의 지팡이는 주인을 선택해요. 올리반더 가게에서 신중히 골라야죠!'
  },
  dinosaur: {
    name: '공룡',
    emoji: '🦕',
    title: '만약 내가 공룡이었다면',
    life: [
      '거대한 몸으로 숲을 거닐어요',
      '높은 나무의 잎을 먹어요',
      '무리 지어 다니며 안전을 지켜요',
      '육식 공룡을 조심하며 살아요',
      '거대한 발자국을 남기며 다녀요'
    ],
    advantages: ['거대한 크기로 위압적이에요', '오래 살 수 있어요', '천적이 거의 없어요'],
    disadvantages: ['운석이 떨어지면 멸종해요', '몸집이 커서 불편해요', '많이 먹어야 해요'],
    dailyLife: '아침 풀 뜯기 → 물가 방문 → 낮잠 → 저녁 식사 → 안전한 곳에서 수면',
    ending: '지구의 지배자로 살았지만, 자연의 법칙 앞에서는 누구도 영원할 수 없었어요',
    funFact: '티라노사우르스의 한 입 힘은 약 6톤! 자동차를 씹어 먹을 수 있는 힘이에요.'
  }
};

export default function WhatIfTransformer() {
  const [name, setName] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [result, setResult] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const scenarios = [
    { id: 'dog', emoji: '🐕', name: '강아지' },
    { id: 'cat', emoji: '🐱', name: '고양이' },
    { id: 'billionaire', emoji: '💰', name: '억만장자' },
    { id: 'celebrity', emoji: '⭐', name: '연예인' },
    { id: 'astronaut', emoji: '🚀', name: '우주비행사' },
    { id: 'teacher', emoji: '👨‍🏫', name: '선생님' },
    { id: 'chef', emoji: '👨‍🍳', name: '셰프' },
    { id: 'time_traveler', emoji: '⏰', name: '타임 트래블러' },
    { id: 'superhero', emoji: '🦸', name: '슈퍼히어로' },
    { id: 'president', emoji: '🎖️', name: '대통령' },
    { id: 'wizard', emoji: '🧙', name: '마법사' },
    { id: 'dinosaur', emoji: '🦕', name: '공룡' },
  ];

  const transform = () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }
    if (!selectedScenario) {
      alert('시나리오를 선택해주세요!');
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setResult(SCENARIOS[selectedScenario]);
      setCurrentStep(0);
      setIsAnimating(false);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const reset = () => {
    setResult(null);
    setName('');
    setSelectedScenario(null);
    setCurrentStep(0);
  };

  return (
    <PremiumLayout theme="purple">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
            ⏰ 내가 만약 XXX라면?
          </h1>
          <p className="text-xl text-white/80">상상 속 나의 삶을 들여다보세요</p>
        </div>

        {!result ? (
          <div className="space-y-6">
            <PremiumCard hover gradient className="animate-slideUp">
              <h3 className="text-white text-2xl font-bold mb-6 text-center">👤 이름 입력</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                maxLength={20}
                className="w-full px-6 py-4 rounded-xl text-black text-center text-2xl font-bold border-4 border-purple-300 focus:border-purple-500 outline-none transition-all"
              />
            </PremiumCard>

            <PremiumCard hover gradient className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-white text-2xl font-bold mb-6 text-center">🌟 시나리오 선택</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setSelectedScenario(scenario.id)}
                    className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
                      selectedScenario === scenario.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <div className="text-4xl mb-2">{scenario.emoji}</div>
                    <div className="font-bold text-sm">{scenario.name}</div>
                  </button>
                ))}
              </div>
            </PremiumCard>

            <PremiumButton
              onClick={transform}
              variant="primary"
              size="lg"
              icon="✨"
              fullWidth
              className="animate-slideUp"
              style={{ animationDelay: '0.2s' }}
            >
              {isAnimating ? '시간 여행 중...' : '만약의 세계로!'}
            </PremiumButton>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Title */}
            <PremiumCard hover gradient className="animate-scaleIn">
              <div className="text-center">
                <div className="text-8xl mb-4 animate-bounce-slow">{result.emoji}</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  {result.title}
                </h2>
                <div className="text-white/70 text-lg mt-4">
                  {name}님의 상상 속 인생 이야기
                </div>
              </div>
            </PremiumCard>

            {/* Step 1: Life Timeline */}
            {currentStep >= 0 && (
              <PremiumCard hover gradient className="animate-slideUp">
                <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>📖</span>
                  <span>하루 일과</span>
                </h3>
                <div className="space-y-3">
                  {result.life.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 rounded-lg p-4 transform transition-all hover:bg-white/20 hover:scale-[1.02]"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{idx === 0 ? '🌅' : idx === 1 ? '☀️' : idx === 2 ? '🌤️' : idx === 3 ? '🌆' : '🌙'}</span>
                        <p className="text-white/90">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {currentStep === 0 && (
                  <PremiumButton onClick={nextStep} variant="secondary" size="lg" fullWidth className="mt-6">
                    다음 →
                  </PremiumButton>
                )}
              </PremiumCard>
            )}

            {/* Step 2: Daily Life */}
            {currentStep >= 1 && (
              <PremiumCard hover gradient className="animate-slideUp">
                <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>⏰</span>
                  <span>일일 스케줄</span>
                </h3>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6">
                  <div className="text-white text-lg text-center font-medium leading-relaxed">
                    {result.dailyLife}
                  </div>
                </div>
                {currentStep === 1 && (
                  <PremiumButton onClick={nextStep} variant="secondary" size="lg" fullWidth className="mt-6">
                    다음 →
                  </PremiumButton>
                )}
              </PremiumCard>
            )}

            {/* Step 3: Pros & Cons */}
            {currentStep >= 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
                <PremiumCard hover>
                  <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                    <span>😊</span>
                    <span>장점</span>
                  </h3>
                  <div className="space-y-2">
                    {result.advantages.map((item, idx) => (
                      <div key={idx} className="bg-green-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <p className="text-white/90 text-sm">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PremiumCard>

                <PremiumCard hover>
                  <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                    <span>😅</span>
                    <span>단점</span>
                  </h3>
                  <div className="space-y-2">
                    {result.disadvantages.map((item, idx) => (
                      <div key={idx} className="bg-red-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-red-400">✗</span>
                          <p className="text-white/90 text-sm">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PremiumCard>

                {currentStep === 2 && (
                  <div className="md:col-span-2">
                    <PremiumButton onClick={nextStep} variant="secondary" size="lg" fullWidth>
                      다음 →
                    </PremiumButton>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Ending */}
            {currentStep >= 3 && (
              <PremiumCard hover gradient className="animate-scaleIn">
                <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🎬</span>
                  <span>인생의 결말</span>
                </h3>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6">
                  <p className="text-white text-lg leading-relaxed text-center">
                    {result.ending}
                  </p>
                </div>
                {currentStep === 3 && (
                  <PremiumButton onClick={nextStep} variant="secondary" size="lg" fullWidth className="mt-6">
                    다음 →
                  </PremiumButton>
                )}
              </PremiumCard>
            )}

            {/* Step 5: Fun Fact */}
            {currentStep >= 4 && (
              <PremiumCard hover className="animate-scaleIn bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>💡</span>
                  <span>재미있는 사실</span>
                </h3>
                <div className="bg-white/10 rounded-lg p-6">
                  <p className="text-white text-lg leading-relaxed">
                    {result.funFact}
                  </p>
                </div>
              </PremiumCard>
            )}

            {/* Reset Button */}
            {currentStep >= 4 && (
              <PremiumButton onClick={reset} variant="primary" size="lg" icon="🔄" fullWidth className="animate-fadeIn">
                다른 인생 살아보기
              </PremiumButton>
            )}
          </div>
        )}

        <div className="mt-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="what-if-transformer" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounce-slow { 0%, 100% { transform: scale(1) rotate(-5deg); } 50% { transform: scale(1.1) rotate(5deg); } }

        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </PremiumLayout>
  );
}
