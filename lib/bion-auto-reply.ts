/**
 * 비온이 자동응답 시스템
 * 사용자 메시지 분위기를 분석해서 적절한 답변 생성
 */

// 긍정적인 키워드
const POSITIVE_KEYWORDS = ['좋', '감사', '고마', '최고', '멋', '대박', '짱', '훌륭', '완벽', '사랑', '재미', '신기'];

// 질문 키워드
const QUESTION_KEYWORDS = ['?', '뭐', '어떻', '어디', '언제', '왜', '누구', '궁금'];

// 부정적인 키워드
const NEGATIVE_KEYWORDS = ['별로', '아쉽', '불편', '오류', '에러', '안돼', '안되'];

// 인사 키워드
const GREETING_KEYWORDS = ['안녕', '하이', '헬로', '처음', '방문'];

// 응답 템플릿
const RESPONSES = {
  positive: [
    "와! 정말 기쁜 말씀이에요! 💖 자주 놀러와주세요!",
    "감사합니다! 비온이가 더 열심히 할게요! ✨",
    "그쵸? 앞으로도 좋은 서비스로 보답할게요! 🎉",
    "기쁘네요! 덕분에 비온이가 힘이 나요! 💪",
    "정말 감사해요! 더 발전하는 비온이 되겠습니다! 🌟"
  ],
  
  question: [
    "궁금하신 게 있으시군요! 🤔 도움이 필요하시면 말씀해주세요!",
    "좋은 질문이에요! 비온이가 도와드릴게요! 💡",
    "음... 어떻게 도와드릴까요? 언제든 물어봐주세요! 🙋",
    "궁금증 해결을 위해 비온이가 여기 있어요! ✨"
  ],
  
  negative: [
    "아쉬운 점을 말씀해주셨네요 😢 더 나은 서비스를 위해 노력할게요!",
    "불편을 드려 죄송해요. 개선하도록 노력하겠습니다! 💪",
    "소중한 의견 감사해요! 비온이가 더 나아지겠습니다! 🌱"
  ],
  
  greeting: [
    "안녕하세요! 비온에 오신 걸 환영해요! 👋✨",
    "반갑습니다! 편하게 둘러보세요! 🎉",
    "환영해요! 좋은 시간 보내시길 바랄게요! 💖",
    "하이하이! 비온이에요! 잘 부탁드려요! 🤗"
  ],
  
  neutral: [
    "메시지 남겨주셔서 감사해요! 😊",
    "소중한 한마디 감사드려요! 💝",
    "방문해주셔서 감사합니다! 자주 놀러와요! 🎈",
    "글 남겨주셔서 기뻐요! 좋은 하루 보내세요! ☀️",
    "덕분에 비온이가 행복해요! 또 만나요! 🌟",
    "감사합니다! 앞으로도 자주 뵈어요! 👋",
    "따뜻한 말씀 감사해요! 💖",
    "비온이가 답글 남기고 가요! 😄",
    "좋은 하루 되세요! 🌈",
    "또 놀러와주세요! 기다릴게요! 🎵"
  ]
};

/**
 * 메시지 감정/의도 분석
 */
export function analyzeMessage(message: string): 'positive' | 'question' | 'negative' | 'greeting' | 'neutral' {
  const lowerMessage = message.toLowerCase();
  
  // 인사 체크
  if (GREETING_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'greeting';
  }
  
  // 질문 체크
  if (QUESTION_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'question';
  }
  
  // 부정 체크
  if (NEGATIVE_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'negative';
  }
  
  // 긍정 체크
  if (POSITIVE_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'positive';
  }
  
  // 기본: 중립
  return 'neutral';
}

/**
 * 자동응답 생성
 */
export function generateAutoReply(userMessage: string): string {
  const messageType = analyzeMessage(userMessage);
  const responses = RESPONSES[messageType];
  
  // 랜덤으로 응답 선택
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

/**
 * 비온이 닉네임
 */
export const BION_BOT_NICKNAME = "비온이 🤖";

