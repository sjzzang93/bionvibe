// 자신과 대화하기 (Know Yourself) - 점수 계산 로직

import {
  Answer,
  Question,
  Domain,
  DomainScore,
  TestResult,
  QUESTIONS,
  DOMAIN_INFO,
  PROFILE_TYPES,
} from './inner-dialog-data';

/**
 * 답변을 기반으로 도메인 점수 계산
 */
export function calculateDomainScores(answers: Answer[]): DomainScore[] {
  const domains: Domain[] = [
    'VAL', 'JOY', 'STR', 'FLW', 'ENG', 'BUR',
    'SOC', 'WRK', 'LIF', 'LRN', 'ENV', 'MNY',
    'HLT', 'EMO', 'PUR',
  ];

  return domains.map(domain => {
    const domainQuestions = QUESTIONS.filter(q => q.domain === domain);
    let totalScore = 0;
    let maxScore = 0;

    domainQuestions.forEach(question => {
      const answer = answers.find(a => a.questionId === question.id);
      if (!answer) return;

      let score = answer.value; // 1-7

      // 역채점 처리 (BUR 도메인)
      if (question.reverse) {
        score = 8 - score; // 7→1, 6→2, ..., 1→7
      }

      totalScore += score;
      maxScore += 7; // Likert 7점 최대값
    });

    // 0-100 정규화
    const normalizedScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // 레벨 결정
    let level = '보통';
    if (normalizedScore >= 70) level = '높음';
    else if (normalizedScore < 50) level = '낮음';

    return {
      domain,
      score: normalizedScore,
      level,
    };
  });
}

/**
 * 복합 지수 계산
 */
export function calculateCompositeIndices(domainScores: DomainScore[]): TestResult['compositeIndices'] {
  const getScore = (domain: Domain) => domainScores.find(d => d.domain === domain)?.score || 0;

  // 웰빙 지수: 행복, 삶 만족, 건강, 감정 조절
  const wellbeing = Math.round(
    (getScore('JOY') + getScore('LIF') + getScore('HLT') + getScore('EMO')) / 4
  );

  // 활력 지수: 에너지, 몰입, 강점
  const vitality = Math.round(
    (getScore('ENG') + getScore('FLW') + getScore('STR')) / 3
  );

  // 성장 지수: 성장 의식, 목적 의식, 가치관
  const growth = Math.round(
    (getScore('LRN') + getScore('PUR') + getScore('VAL')) / 3
  );

  // 안정 지수: 재정, 환경, 사회적 연결, 일 만족
  const stability = Math.round(
    (getScore('MNY') + getScore('ENV') + getScore('SOC') + getScore('WRK')) / 4
  );

  // 균형 지수: 번아웃 역산 + 전체 도메인 분산 기반
  const burnoutScore = getScore('BUR');
  const scores = domainScores.map(d => d.score);
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // 표준편차가 작을수록 균형이 좋음 (최대 30 기준)
  const balanceFromVariance = Math.max(0, 100 - (stdDev * 3));
  const balance = Math.round((burnoutScore + balanceFromVariance) / 2);

  return {
    wellbeing,
    vitality,
    growth,
    stability,
    balance,
  };
}

/**
 * 프로필 결정
 */
export function determineProfile(result: TestResult): string {
  // 각 프로필 타입의 기준 확인
  for (const profile of PROFILE_TYPES) {
    if (profile.criteria(result)) {
      return profile.id;
    }
  }

  // 기본 프로필: 가장 높은 복합 지수에 따라
  const indices = result.compositeIndices;
  const maxIndex = Math.max(
    indices.wellbeing,
    indices.vitality,
    indices.growth,
    indices.stability,
    indices.balance
  );

  if (indices.wellbeing === maxIndex) return 'balanced-harmonist';
  if (indices.vitality === maxIndex) return 'passionate-grower';
  if (indices.growth === maxIndex) return 'passionate-grower';
  if (indices.stability === maxIndex) return 'stable-maintainer';
  return 'gentle-explorer';
}

/**
 * 추천 사항 생성
 */
export function generateRecommendations(result: TestResult): string[] {
  const recommendations: string[] = [];
  const { domainScores, compositeIndices } = result;

  // 1. 가장 낮은 도메인 3개 찾기
  const weakDomains = [...domainScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  // 2. 전반적으로 낮은 경우 먼저 위로하기
  const overallScore = Math.round(
    domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length
  );

  if (overallScore < 40) {
    recommendations.push('💙 지금 많이 힘드시죠? 쉬어가도 괜찮아요. 삶은 본인을 위해 이기적으로 살아가도 되는 거예요. 당신의 존재 자체로 이미 충분히 가치있습니다.');
  }

  // 3. 도메인별 맞춤 추천 (위로 + 구체적 행동)
  weakDomains.forEach(({ domain, score }) => {
    if (score < 40) {
      recommendations.push(getDomainRecommendation(domain, 'urgent'));
    } else if (score < 60) {
      recommendations.push(getDomainRecommendation(domain, 'moderate'));
    }
  });

  // 4. 복합 지수 기반 추천 (더 따뜻한 톤)
  if (compositeIndices.balance < 50) {
    recommendations.push('⚖️ 지금 당장 가보고 싶었던 곳으로 여행을 떠나보는 건 어떨까요? 일상에서 잠시 벗어나 숨 쉴 시간이 필요해요.');
  }

  if (compositeIndices.wellbeing < 50) {
    recommendations.push('💚 매일 아침 창문을 열고 햇살을 5분만 쬐어보세요. 작은 행복도 행복입니다. 오늘 하루 딱 한 가지만 나를 위한 일을 해보는 건 어떨까요?');
  }

  if (compositeIndices.vitality < 50) {
    recommendations.push('⚡ 오늘은 일찍 퇴근하고 좋아하는 드라마를 보거나, 친구에게 전화해보세요. 에너지가 떨어질 땐 좋아하는 일을 하는 게 최고예요.');
  }

  if (compositeIndices.growth < 50) {
    recommendations.push('📈 성장은 천천히 해도 괜찮아요. 오늘 유튜브로 관심있는 분야 영상 하나만 봐도 충분합니다. 작은 호기심에서 시작하면 돼요.');
  }

  if (compositeIndices.stability < 50) {
    recommendations.push('🏡 불안한 마음, 당연해요. 일단 집 청소부터 시작해보는 건 어떨까요? 공간이 정리되면 마음도 조금 가벼워질 거예요.');
  }

  // 5. 긍정적 피드백
  const strongDomains = [...domainScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (strongDomains[0].score >= 70) {
    const domainName = DOMAIN_INFO[strongDomains[0].domain].name;
    recommendations.push(`✨ ${domainName} 영역이 정말 건강하네요! 이런 당신의 강점을 아끼는 사람들과 나눠보는 건 어떨까요? 당신은 이미 충분히 잘하고 있어요.`);
  }

  return recommendations.length > 0
    ? recommendations.slice(0, 6)
    : ['🎉 전반적으로 정말 건강한 상태예요! 지금 이 순간을 기억하고, 힘든 날이 와도 이렇게 잘 해낸 자신을 믿어주세요.'];
}

/**
 * 도메인별 맞춤 추천
 */
function getDomainRecommendation(domain: Domain, urgency: 'urgent' | 'moderate'): string {
  const recommendations: Record<Domain, { urgent: string; moderate: string }> = {
    VAL: {
      urgent: '🎯 자신이 누군지 모르겠다는 건, 그만큼 많은 가능성이 있다는 뜻이에요. 오늘 저녁 10분만 시간을 내서 "내가 진짜 좋아하는 건 뭘까?"라고 스스로에게 물어보세요. 거창한 답은 필요 없어요.',
      moderate: '🎯 결정을 내릴 때마다 흔들린다면, 지금이 나를 더 알아갈 기회예요. 매일 작은 선택을 할 때 "이게 내가 원하는 건가?"라고 물어보는 건 어떨까요?',
    },
    JOY: {
      urgent: '😊 행복이 멀게만 느껴지죠? 지금 당장 웃을 수 없어도 괜찮아요. 오늘 단 한 가지, 예전에 좋아했던 노래를 들어보는 건 어떨까요? 작은 것부터요.',
      moderate: '😊 하루에 한 번 미소 짓는 순간을 만들어보세요. 좋아하는 카페 가기, 반려동물 사진 보기 같은 작은 즐거움도 충분해요.',
    },
    STR: {
      urgent: '💪 자신의 장점을 모르겠다고요? 주변 사람들에게 "내가 잘하는 게 뭐라고 생각해?"라고 물어보세요. 타인의 눈에 보이는 당신의 빛을 발견하게 될 거예요.',
      moderate: '💪 오늘 잘했던 일 하나를 메모해보세요. 매일 반복하다 보면 자신의 강점 패턴이 보여요. 작은 성공도 성공이에요.',
    },
    FLW: {
      urgent: '🌊 시간 가는 줄 모를 정도로 몰입할 수 있는 걸 찾아보세요. 어릴 때 좋아했던 취미를 다시 꺼내보는 건 어떨까요? 퍼즐, 그림, 게임... 뭐든 좋아요.',
      moderate: '🌊 핸드폰 알림을 끄고 30분만 한 가지에 집중해보세요. 집중력은 근육처럼 키울 수 있어요.',
    },
    ENG: {
      urgent: '⚡ 많이 지쳐있네요. 오늘밤은 일찍 자보는 건 어떨까요? 8시간 수면이 안 되더라도, 평소보다 30분만 일찍 눕는 것부터 시작해요. 에너지는 쉴 때 충전돼요.',
      moderate: '⚡ 산책하며 햇빛 쬐기, 물 자주 마시기, 좋아하는 음악 듣기... 에너지를 채우는 자신만의 루틴을 만들어보세요.',
    },
    BUR: {
      urgent: '😵 지금 완전히 소진된 상태인 것 같아요. 일단 멈춰도 괜찮아요. 내일 반차라도 내거나, 오늘 하루는 최소한만 하고 쉬어가세요. 당신은 쉴 자격이 있어요.',
      moderate: '😵 번아웃 신호가 보여요. 주말에 아무것도 안 하는 시간을 만들어보세요. 생산적이지 않아도 돼요. 그냥 존재하는 시간이 필요해요.',
    },
    SOC: {
      urgent: '👥 외롭다는 감정, 인정하는 것부터 시작이에요. 오늘 가족이나 오랜 친구에게 "요즘 어때?"라고 먼저 연락해보는 건 어떨까요? 용기내도 괜찮아요.',
      moderate: '👥 혼자 있는 게 편하더라도, 가끔은 사람들과 시간을 보내보세요. 카페에서 책만 읽어도, 사람들 사이에 있다는 것만으로도 위안이 될 수 있어요.',
    },
    WRK: {
      urgent: '💼 일이 너무 힘들죠? 당장 그만둘 수 없다면, 퇴근 후 시간은 완전히 나를 위해 써보세요. 일과 나를 분리하는 연습이 필요해요. 당신은 일이 아니에요.',
      moderate: '💼 업무에서 작은 의미라도 찾아보세요. 동료를 도운 일, 잘 마무리한 프로젝트... 일의 긍정적인 순간을 기록해보는 건 어떨까요?',
    },
    LIF: {
      urgent: '🌟 삶이 막막하게 느껴지시나요? 큰 변화를 꿈꾸지 않아도 돼요. 내일 아침 창문을 열고 5분만 하늘을 보는 것부터 시작해보세요. 작은 변화가 삶을 바꿔요.',
      moderate: '🌟 인생에서 딱 한 가지만 바꿀 수 있다면 뭘 바꾸고 싶나요? 그걸 적어보고, 그 방향으로 오늘 한 걸음만 나아가보세요.',
    },
    LRN: {
      urgent: '📈 성장에 압박감을 느끼고 있나요? 멈춰있어도 괜찮아요. 호기심이 생길 때까지 기다리는 것도 성장이에요. 유튜브 5분짜리 영상 하나만 봐도 충분해요.',
      moderate: '📈 배움은 거창하지 않아도 돼요. 출퇴근길에 팟캐스트 듣기, 재미있어 보이는 온라인 강의 구경하기... 작은 호기심을 따라가보세요.',
    },
    ENV: {
      urgent: '🏡 지금 있는 공간이 답답하게 느껴지나요? 오늘 방 한 곳만 정리해보세요. 책상 위, 옷장 한 칸... 작은 공간이 깨끗해지면 마음도 조금 가벼워져요.',
      moderate: '🏡 공간에 나만의 안식처를 만들어보세요. 좋아하는 향초, 편한 쿠션, 따뜻한 조명... 집에 돌아오는 게 기다려지는 공간을 만들어보는 건 어떨까요?',
    },
    MNY: {
      urgent: '💰 돈 걱정이 크시죠? 일단 이번 달 고정 지출을 적어보세요. 숫자로 보면 막연한 불안이 조금 줄어들 거예요. 작은 것부터 통제하기 시작하면 돼요.',
      moderate: '💰 돈을 모으는 게 힘들다면, 먼저 쓰지 않는 구독을 끊어보는 건 어떨까요? 작은 절약도 재정 건강의 시작이에요.',
    },
    HLT: {
      urgent: '❤️ 건강이 걱정되시나요? 병원 예약하기가 부담스럽다면, 오늘은 물을 조금 더 마시고 10분만 스트레칭해보세요. 작은 관심이 몸을 살려요.',
      moderate: '❤️ 엘리베이터 대신 계단 오르기, 커피 대신 물 한 잔... 건강은 거창한 운동이 아니라 일상의 작은 선택에서 시작돼요.',
    },
    EMO: {
      urgent: '🧘 감정이 너무 힘들죠? 울어도 괜찮아요. 화내도 괜찮아요. 감정을 억누르지 말고 느껴보세요. 혼자 감당하기 힘들다면 전문가의 도움을 받는 것도 용기예요.',
      moderate: '🧘 감정을 글로 써보세요. 일기장이 아니어도 돼요. 메모장, 휴대폰... 어디든 좋아요. 감정을 밖으로 꺼내는 것만으로도 정리가 돼요.',
    },
    PUR: {
      urgent: '🎭 삶의 의미를 찾기 힘들죠? 거창한 목표가 없어도 괜찮아요. 오늘 하루 누군가에게 작은 친절을 베푸는 것도 충분한 의미예요. 존재 자체가 이미 의미있어요.',
      moderate: '🎭 10년 후 나는 어떤 사람이고 싶나요? 큰 꿈이 아니어도 돼요. "여유로운 사람", "따뜻한 사람"... 이런 작은 방향성만 있어도 충분해요.',
    },
  };

  return recommendations[domain][urgency];
}

/**
 * 전체 테스트 결과 계산
 */
export function calculateTestResult(answers: Answer[]): TestResult {
  // 1. 도메인 점수 계산
  const domainScores = calculateDomainScores(answers);

  // 2. 복합 지수 계산
  const compositeIndices = calculateCompositeIndices(domainScores);

  // 3. 임시 결과 객체 생성 (프로필 결정용)
  const tempResult: TestResult = {
    domainScores,
    compositeIndices,
    profile: '',
    recommendations: [],
  };

  // 4. 프로필 결정
  const profile = determineProfile(tempResult);

  // 5. 추천 사항 생성
  const recommendations = generateRecommendations(tempResult);

  // 6. 최종 결과 반환
  return {
    domainScores,
    compositeIndices,
    profile,
    recommendations,
  };
}

/**
 * 가장 취약한 영역 Top 3
 */
export function getTopVulnerableAreas(domainScores: DomainScore[]): DomainScore[] {
  return [...domainScores].sort((a, b) => a.score - b.score).slice(0, 3);
}

/**
 * 가장 강한 영역 Top 3
 */
export function getTopStrengthAreas(domainScores: DomainScore[]): DomainScore[] {
  return [...domainScores].sort((a, b) => b.score - a.score).slice(0, 3);
}

/**
 * 심리 상담사 스타일의 깊이있는 분석
 */
export function generatePsychologicalAnalysis(result: TestResult): string[] {
  const { domainScores, compositeIndices } = result;
  const analysis: string[] = [];

  const overallScore = Math.round(
    domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length
  );

  // 1. 전반적 상태 평가 (심리상담사 톤)
  if (overallScore < 40) {
    analysis.push(
      '지금 당신의 마음은 많이 지쳐있는 상태예요. 이런 상태가 된 데에는 분명한 이유가 있을 거예요. 오랫동안 스스로를 돌보지 못했거나, 버거운 상황이 계속되었거나, 혹은 내면의 갈등이 해결되지 않았을 수 있어요. 이런 감정을 느끼는 자신을 탓하지 마세요. 지금 이 순간, 당신이 느끼는 모든 감정은 타당해요.'
    );
    analysis.push(
      '지금 가장 중요한 건 "회복"이에요. 생산성이나 성과가 아니라, 당신 자신을 다시 찾는 시간이 필요해요. 작은 것부터 시작해보세요. 좋아하는 음악을 듣거나, 따뜻한 차를 마시거나, 햇살 아래 5분만 앉아있어도 괜찮아요. 회복은 거창한 게 아니에요.'
    );
  } else if (overallScore < 60) {
    analysis.push(
      '지금의 당신은 어딘가 불안정한 줄타기를 하고 있는 것 같아요. 어떤 날은 괜찮다가도, 어떤 날은 무너질 것 같은 느낌... 이런 오르락내리락이 피곤하죠. 하지만 이건 당신이 약해서가 아니에요. 지금 상황이나 환경이 당신을 충분히 지지해주지 못하고 있는 거예요.'
    );
    analysis.push(
      '중요한 건, 당신에게는 회복력이 있다는 거예요. 지금까지 버텨온 것만으로도 대단해요. 이제는 조금만 더 자신에게 친절해져보는 건 어떨까요? 완벽하지 않아도 괜찮아요. 오늘 하루 잘 버텨낸 것만으로도 충분히 잘하고 있는 거예요.'
    );
  } else {
    analysis.push(
      '전반적으로 건강한 상태를 유지하고 있네요. 하지만 "건강하다"는 말이 "완벽하다"는 뜻은 아니에요. 당신에게도 힘든 순간이 있을 거고, 그건 자연스러운 거예요. 지금의 이 균형을 유지하려고 노력하는 것만으로도 당신은 이미 많은 것을 하고 있어요.'
    );
  }

  // 2. 웰빙 지수 기반 분석
  if (compositeIndices.wellbeing < 50) {
    analysis.push(
      '행복과 감정 건강 부분에서 어려움을 겪고 있어요. 혹시 최근에 "나는 행복할 자격이 없어"라거나 "다른 사람들은 다 잘 사는데 나만..."이런 생각을 하지 않으셨나요? 이런 생각들은 당신의 현실을 왜곡해요. 작은 기쁨도 기쁨이에요. 오늘 하늘이 예뻤다거나, 따뜻한 물로 샤워했다거나... 이런 순간들을 허락해주세요.'
    );
  }

  // 3. 활력 지수 기반 분석
  if (compositeIndices.vitality < 50) {
    analysis.push(
      '에너지가 많이 소진된 상태예요. 아침에 일어나는 것부터 힘들고, 무엇을 해도 재미가 없고, 예전에 좋아하던 것들도 이제는 와닿지 않을 수 있어요. 이건 게으름이 아니에요. 마음과 몸이 "이제 쉬어야 해"라고 신호를 보내는 거예요. 쉬는 것도 능력이고, 자기 신호를 듣는 것도 용기예요.'
    );
    analysis.push(
      '에너지는 강제로 끌어올릴 수 없어요. 충전이 필요해요. 오늘 하루는 "최소한"만 하고 쉬어보세요. 내일 할 일을 오늘 다 하려고 하지 마세요. 당신의 몸은 기계가 아니에요.'
    );
  }

  // 4. 성장 지수 기반 분석
  if (compositeIndices.growth < 50) {
    analysis.push(
      '성장이나 목적 부분에서 막막함을 느끼고 있어요. "내가 뭘 하고 있는 거지?", "이렇게 살아도 되는 건가?" 같은 생각이 들 수 있어요. 이런 질문을 한다는 것 자체가 당신이 더 나은 삶을 원한다는 증거예요. 방황하는 것도 성장의 과정이에요.'
    );
    analysis.push(
      '목표는 거창하지 않아도 돼요. 1년 뒤가 아니라 내일만 생각해보세요. 내일의 나는 오늘의 나보다 1% 나아질 수 있어요. 작은 호기심을 따라가다 보면, 어느샌가 길이 보일 거예요.'
    );
  }

  // 5. 안정 지수 기반 분석
  if (compositeIndices.stability < 50) {
    analysis.push(
      '재정, 환경, 관계, 일... 삶의 기반이 흔들리고 있다는 느낌이 들 거예요. 이런 불안정함은 모든 것을 더 어렵게 만들어요. 하지만 모든 걸 한꺼번에 해결하려고 하지 마세요. 가장 시급한 것 하나만 선택해서, 그것부터 안정화시켜보세요.'
    );
    analysis.push(
      '안정감은 외부가 아니라 내부에서 시작돼요. 돈이 많아지거나, 좋은 직장을 얻거나, 완벽한 관계를 만드는 게 아니라, "지금 이 순간 내가 할 수 있는 최선"을 하고 있다는 자기 신뢰에서 시작돼요. 작은 통제권을 되찾아보세요.'
    );
  }

  // 6. 균형 지수 기반 분석
  if (compositeIndices.balance < 50) {
    analysis.push(
      '삶의 여러 영역이 불균형한 상태예요. 어떤 부분은 너무 많이 신경 쓰고, 어떤 부분은 완전히 방치되어 있을 수 있어요. 이런 불균형은 번아웃으로 이어져요. 지금 당장 여행을 떠나보는 건 어떨까요? 일상에서 완전히 벗어나는 시간이 필요해요.'
    );
    analysis.push(
      '균형은 완벽함이 아니에요. 모든 영역을 100%로 만들 수는 없어요. 대신, 어떤 영역이 지금 가장 중요한지 선택하고, 그것에 집중하는 거예요. 우선순위는 상황마다 달라질 수 있어요. 지금의 나에게 가장 필요한 게 뭔지 물어보세요.'
    );
  }

  // 7. 도메인별 깊이있는 분석 (가장 낮은 3개)
  const weakDomains = getTopVulnerableAreas(domainScores);

  if (weakDomains[0].score < 40) {
    const domainName = DOMAIN_INFO[weakDomains[0].domain].name;

    if (weakDomains[0].domain === 'BUR') {
      analysis.push(
        `${domainName} 영역이 매우 심각한 상태예요. 번아웃은 "조금 피곤한 것"이 아니라 마음과 몸이 완전히 고갈된 상태를 말해요. 지금 이 상태로 계속 가면, 건강에 큰 문제가 생길 수 있어요. 당장 업무를 조정하거나, 휴가를 내거나, 전문가의 도움을 받아야 해요. 이건 선택이 아니라 필수예요.`
      );
    } else if (weakDomains[0].domain === 'EMO') {
      analysis.push(
        `${domainName} 영역에서 많은 어려움을 겪고 있어요. 감정이 폭발하거나, 아예 무감각해지거나, 통제가 안 되는 느낌이 들 수 있어요. 이런 상태가 오래 지속되면 우울이나 불안으로 이어질 수 있어요. 혼자 감당하려고 하지 마세요. 전문 상담사와 이야기하는 것을 진지하게 고려해보세요. 도움을 요청하는 건 약함이 아니라 용기예요.`
      );
    } else if (weakDomains[0].domain === 'PUR') {
      analysis.push(
        `${domainName} 영역이 많이 약해져 있어요. "왜 사는지 모르겠다", "의미가 없다"는 생각이 들 수 있어요. 이런 실존적 공허감은 정말 견디기 힘들어요. 하지만 의미는 거창한 데 있지 않아요. 오늘 누군가에게 웃어준 것, 반려동물을 돌본 것, 식물에 물을 준 것... 이런 작은 것들도 의미예요. 존재 자체가 이미 가치있어요.`
      );
    } else {
      analysis.push(
        `${domainName} 영역이 많이 힘든 상태예요. 이 부분이 삶의 다른 영역에도 영향을 미치고 있을 가능성이 높아요. 하나가 무너지면 연쇄적으로 다른 것들도 흔들리거든요. 하지만 반대로, 이 영역을 조금만 개선해도 전체가 나아질 수 있어요. 작은 변화부터 시작해보세요.`
      );
    }
  }

  // 8. 강점 기반 희망 메시지
  const strongDomains = getTopStrengthAreas(domainScores);
  if (strongDomains[0].score >= 60) {
    const domainName = DOMAIN_INFO[strongDomains[0].domain].name;
    analysis.push(
      `하지만 당신에게는 분명한 강점도 있어요. ${domainName} 영역이 건강한 상태예요. 이건 당신이 이 부분에서는 잘 대처하고 있다는 의미예요. 이 강점을 다른 영역에도 적용해볼 수 있어요. 예를 들어, ${domainName}에서 사용한 전략이나 마음가짐을 어려운 영역에도 가져와보는 거예요.`
    );
  }

  // 9. 희망과 격려 메시지
  if (overallScore < 50) {
    analysis.push(
      '지금은 힘들 거예요. 하루하루가 버거울 수 있어요. 하지만 당신은 이 글을 읽고 있어요. 그 말은, 당신이 아직 포기하지 않았다는 뜻이에요. 변화를 원하고 있다는 뜻이에요. 그것만으로도 충분히 대단해요.'
    );
    analysis.push(
      '완전히 나아지는 데는 시간이 걸릴 거예요. 내일 당장 모든 게 바뀌지는 않을 거예요. 하지만 작은 변화는 가능해요. 오늘 하루만 버텨보세요. 그리고 내일 또 하루만 버텨보세요. 그렇게 하루하루가 모여서, 어느샌가 당신은 더 나은 곳에 서 있을 거예요.'
    );
  } else {
    analysis.push(
      '지금까지 잘 해왔어요. 힘든 순간도 있었겠지만, 여기까지 왔잖아요. 그것만으로도 당신은 충분히 강해요. 앞으로도 잘 할 수 있어요. 완벽할 필요는 없어요. 그냥 오늘의 당신으로 충분해요.'
    );
  }

  return analysis;
}
