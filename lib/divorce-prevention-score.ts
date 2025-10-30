// 이혼 예방 사전진단 - 점수 계산 로직

import { Answer, Question, ScoreBreakdown, QUESTIONS, RISK_TIERS, DOMAINS } from './divorce-prevention-data';

/**
 * 답변을 기반으로 점수를 계산합니다.
 */
export function calculateScore(answers: Answer[]): ScoreBreakdown {
  const domainScores: Record<string, number> = {};
  const redFlags: string[] = [];

  // 도메인별 점수 계산
  DOMAINS.forEach((domain) => {
    const domainQuestions = QUESTIONS.filter(q => q.domain === domain);
    let domainTotal = 0;
    let domainMax = 0;

    domainQuestions.forEach((question) => {
      const answer = answers.find(a => a.questionId === question.id);
      if (!answer) return;

      let score = 0;

      // Likert 5점 척도 처리
      if (question.type === 'likert5') {
        score = typeof answer.value === 'number' ? answer.value : 0;

        // reverse인 경우 점수 반전 (1→5, 2→4, 3→3, 4→2, 5→1)
        if (question.reverse) {
          score = 6 - score;
        }
      }
      // Boolean 타입 처리
      else if (question.type === 'boolean') {
        if (question.reverse) {
          // reverse boolean: true=위험(1점), false=안전(5점)
          score = answer.value === true ? 1 : 5;
        } else {
          // normal boolean: true=안전(5점), false=위험(1점)
          score = answer.value === true ? 5 : 1;
        }
      }

      // weight 적용
      const weightedScore = score * (question.weight || 1.0);
      domainTotal += weightedScore;
      domainMax += 5 * (question.weight || 1.0);

      // red flag 감지 (점수가 낮을수록 위험)
      if (question.redFlag && score <= 2) {
        redFlags.push(question.text);
      }
    });

    // 0~100 정규화 (점수가 낮을수록 위험)
    domainScores[domain] = domainMax > 0 ? Math.round((domainTotal / domainMax) * 100) : 0;
  });

  // 전체 점수 (도메인 평균, 낮을수록 위험)
  const total = Math.round(
    Object.values(domainScores).reduce((sum, score) => sum + score, 0) / DOMAINS.length
  );

  // 위험도 티어 결정 (점수가 낮을수록 위험도가 높음)
  // 점수를 반전시켜서 티어 매칭 (0~100 → 100~0)
  const reversedScore = 100 - total;
  let riskTier = RISK_TIERS.find(
    tier => reversedScore >= tier.range[0] && reversedScore <= tier.range[1]
  )?.tier || 'LOW';

  // red flag 오버라이드
  if (redFlags.length >= 3) {
    riskTier = 'IMMEDIATE';
  } else if (redFlags.length >= 1 && riskTier === 'LOW') {
    riskTier = 'CAUTION';
  }

  return {
    domainScores,
    total,
    riskTier,
    redFlags
  };
}

/**
 * 도메인별 점수를 기반으로 상위 취약 영역을 반환합니다.
 */
export function getTopVulnerableAreas(domainScores: Record<string, number>, count: number = 3): Array<{ domain: string; score: number }> {
  return Object.entries(domainScores)
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => a.score - b.score) // 점수가 낮은 순
    .slice(0, count);
}

/**
 * 위험도 티어에 따른 권장 사항을 반환합니다.
 */
export function getRecommendationsByTier(riskTier: string): string[] {
  switch (riskTier) {
    case 'IMMEDIATE':
      return [
        '즉시 전문가의 도움이 필요합니다. 112, 1366(여성긴급전화), 1393(정신건강상담)에 연락하세요.',
        '신뢰할 수 있는 가족이나 친구에게 상황을 알리세요.',
        '안전 계획을 세우고 필요시 안전한 장소로 이동하세요.'
      ];
    case 'HIGH':
      return [
        '전문 커플상담을 권장합니다. 공공 상담소나 민간 상담센터를 찾아보세요.',
        '의사소통 패턴 개선을 위한 워크숍이나 교육 프로그램을 고려하세요.',
        '정신건강 전문가의 개별 상담도 도움이 될 수 있습니다.'
      ];
    case 'CAUTION':
      return [
        '주 1회 20분 대화 시간을 정해 서로의 감정과 니즈를 나누세요.',
        '재정 투명성을 높이기 위해 월 지출 보드를 함께 작성하세요.',
        '갈등 해결 방법에 대한 책이나 온라인 자료를 함께 공부하세요.'
      ];
    default:
      return [
        '현재 관계가 건강한 상태입니다. 지금의 긍정적인 패턴을 유지하세요.',
        '정기적인 대화와 데이트 시간을 통해 친밀감을 유지하세요.',
        '작은 갈등도 방치하지 말고 즉시 대화로 해결하세요.'
      ];
  }
}
