import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// MBTI 페르소나별 응답 스타일
const RESPONSE_STYLES: Record<string, { prefix: string; suffix: string; tone: string[] }> = {
  'ISTJ': {
    prefix: '정리해드리겠습니다.',
    suffix: '이상 확인 부탁드립니다.',
    tone: ['명확히', '체계적으로', '정리하면', '우선순위는']
  },
  'ISFJ': {
    prefix: '제가 도와드릴게요.',
    suffix: '도움이 되셨으면 좋겠어요!',
    tone: ['편하게', '천천히', '함께', '이해해요']
  },
  'INFJ': {
    prefix: '깊이 생각해보면',
    suffix: '당신의 내면을 이해합니다.',
    tone: ['본질적으로', '의미는', '통찰', '진심으로']
  },
  'INTJ': {
    prefix: '전략적으로 보면',
    suffix: '효율적인 방법입니다.',
    tone: ['최적화', '논리적으로', '분석하면', '목표 달성을 위해']
  },
  'ISTP': {
    prefix: '실험해보니',
    suffix: '해봐.',
    tone: ['실용적으로', '간단하게', '직접', '해보면 알지']
  },
  'ISFP': {
    prefix: '느낌적으로는',
    suffix: '지금 이 순간을 즐겨요!',
    tone: ['감성적으로', '자유롭게', '아름답게', '느껴져요']
  },
  'INFP': {
    prefix: '제 생각엔...',
    suffix: '모두가 행복했으면 좋겠어요.',
    tone: ['이상적으로', '꿈꾸듯', '진정성 있게', '의미 있는']
  },
  'INTP': {
    prefix: '논리적으로 분석하면',
    suffix: '더 파고들어볼까요?',
    tone: ['이론적으로', '가설은', '흥미롭게도', '추론하면']
  },
  'ESTP': {
    prefix: '당장',
    suffix: '고고!',
    tone: ['빠르게', '지금 바로', '액션!', '도전해봐']
  },
  'ESFP': {
    prefix: '완전',
    suffix: '재밌다!!',
    tone: ['신나게', '즐겁게', '와우', '대박']
  },
  'ENFP': {
    prefix: '와! 진짜',
    suffix: '가능성이 무한해!',
    tone: ['열정적으로', '창의적으로', '신기하게도', '기대돼']
  },
  'ENTP': {
    prefix: '논쟁의 여지가 있지만',
    suffix: '반론 있어?',
    tone: ['토론하자면', '다른 관점은', '재치있게', '역발상으로']
  },
  'ESTJ': {
    prefix: '업무 기준으로',
    suffix: '이행하시기 바랍니다.',
    tone: ['체계적으로', '규칙에 따라', '관리하면', '책임감 있게']
  },
  'ESFJ': {
    prefix: '여러분과 함께',
    suffix: '모두 화이팅!',
    tone: ['협력하여', '배려하며', '소통하면', '함께해요']
  },
  'ENFJ': {
    prefix: '여러분의 잠재력은',
    suffix: '함께 성장해요!',
    tone: ['영감을 주는', '리더십으로', '비전은', '동기부여']
  },
  'ENTJ': {
    prefix: '목표는 명확합니다.',
    suffix: '실행합시다.',
    tone: ['전략적으로', '결단력 있게', '성과 중심으로', '효율적으로']
  },
};

export async function POST(req: NextRequest) {
  try {
    const { message, mbti } = await req.json();

    if (!message || !mbti) {
      return NextResponse.json(
        { error: '메시지와 MBTI 유형이 필요합니다.' },
        { status: 400 }
      );
    }

    const style = RESPONSE_STYLES[mbti] || RESPONSE_STYLES['INTJ'];
    
    // 간단한 응답 생성 (실제로는 OpenAI API 등을 사용할 수 있음)
    const randomTone = style.tone[Math.floor(Math.random() * style.tone.length)];
    
    let response = '';
    
    // 질문/고민 감지
    if (message.includes('?') || message.includes('어떻게') || message.includes('뭐')) {
      response = `${style.prefix} "${message}"에 대해 말씀드리면, ${randomTone} 접근하시는 것이 좋겠습니다. ${style.suffix}`;
    } 
    // 감정 표현 감지
    else if (message.includes('힘들') || message.includes('우울') || message.includes('슬프')) {
      response = `${style.prefix} 지금 많이 힘드시군요. ${randomTone} 이 시간을 보내시길 바랍니다. ${style.suffix}`;
    }
    // 긍정적 표현 감지
    else if (message.includes('좋아') || message.includes('행복') || message.includes('기쁘')) {
      response = `${style.prefix} 정말 멋진 소식이네요! ${randomTone} 그 에너지를 유지하세요. ${style.suffix}`;
    }
    // 일반 대화
    else {
      response = `${style.prefix} "${message}"라고 하셨네요. ${randomTone} 더 자세히 이야기해주시겠어요? ${style.suffix}`;
    }

    return NextResponse.json({
      role: 'assistant',
      text: response,
    });
  } catch (error) {
    console.error('MBTI Chat API Error:', error);
    return NextResponse.json(
      { error: '응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

