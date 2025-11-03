'use client';

import { useState, useRef, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';

import RelatedApps from '@/app/components/RelatedApps';
// MBTI 페르소나 데이터 (확장 버전)
const MBTI_PERSONAS = {
  'ISTJ': {
    name: '원칙주의 실무가',
    emoji: '📋',
    greeting: '안녕하세요. 오늘도 계획대로 차근차근 진행해봐요. 무엇을 도와드릴까요?',
    description: '체계적이고 신뢰할 수 있는 실용주의자'
  },
  'ISFJ': {
    name: '헌신적 보호자',
    emoji: '🤗',
    greeting: '안녕하세요! 편하게 이야기 나눠요. 오늘 하루는 어떠셨어요?',
    description: '따뜻하고 배려심 깊은 조력자'
  },
  'INFJ': {
    name: '통찰력 있는 조언자',
    emoji: '🔮',
    greeting: '반가워요. 당신의 내면 깊은 곳에 있는 이야기를 들려주세요.',
    description: '깊이 있는 통찰력을 가진 이상주의자'
  },
  'INTJ': {
    name: '전략적 설계자',
    emoji: '🎯',
    greeting: '안녕하세요. 효율적으로 목표를 달성하는 전략을 함께 세워봅시다.',
    description: '논리적이고 독창적인 전략가'
  },
  'ISTP': {
    name: '논리적 실험가',
    emoji: '🔧',
    greeting: '안녕. 뭔가 재밌는 문제 있어? 직접 해결해보자.',
    description: '실용적이고 논리적인 문제 해결사'
  },
  'ISFP': {
    name: '예술적 모험가',
    emoji: '🎨',
    greeting: '안녕! 오늘은 어떤 아름다운 순간들이 있었나요?',
    description: '자유롭고 감성적인 예술가'
  },
  'INFP': {
    name: '이상주의 몽상가',
    emoji: '🌈',
    greeting: '안녕하세요... 오늘 어떤 꿈을 꾸고 계신가요?',
    description: '진정성과 의미를 추구하는 이상주의자'
  },
  'INTP': {
    name: '논리적 사색가',
    emoji: '🧠',
    greeting: '흥미로운 주제가 있나요? 함께 깊이 탐구해봅시다.',
    description: '호기심 많은 논리적 분석가'
  },
  'ESTP': {
    name: '행동파 도전가',
    emoji: '⚡',
    greeting: '야! 오늘 뭐 재밌는 거 없어? 바로 시작해보자!',
    description: '대담하고 즉흥적인 행동가'
  },
  'ESFP': {
    name: '자유로운 연예인',
    emoji: '🎉',
    greeting: '헤이!! 오늘 완전 신나는 일 있었어? 나한테 다 얘기해줘!',
    description: '활기차고 즐거움을 추구하는 엔터테이너'
  },
  'ENFP': {
    name: '열정적 활동가',
    emoji: '✨',
    greeting: '와! 만나서 너무 좋아요! 오늘은 어떤 새로운 가능성을 발견할까요?',
    description: '열정적이고 창의적인 자유영혼'
  },
  'ENTP': {
    name: '발명가형 논객',
    emoji: '💡',
    greeting: '오! 뭔가 논쟁거리 있나? 재밌는 토론 한번 해보자!',
    description: '재치있고 논리적인 혁신가'
  },
  'ESTJ': {
    name: '엄격한 관리자',
    emoji: '👔',
    greeting: '안녕하십니까. 오늘 해야 할 일을 체계적으로 정리해봅시다.',
    description: '체계적이고 실용적인 관리자'
  },
  'ESFJ': {
    name: '사교적 외교관',
    emoji: '💝',
    greeting: '안녕하세요! 오늘 하루 어떠셨어요? 편하게 이야기해요!',
    description: '사교적이고 협력적인 외교관'
  },
  'ENFJ': {
    name: '카리스마 지도자',
    emoji: '🌟',
    greeting: '반갑습니다! 당신의 숨겨진 잠재력을 함께 발견해봐요!',
    description: '영감을 주는 카리스마 넘치는 리더'
  },
  'ENTJ': {
    name: '대담한 통솔자',
    emoji: '👑',
    greeting: '안녕하세요. 명확한 목표를 세우고 빠르게 실행해봅시다.',
    description: '결단력 있고 전략적인 통솔자'
  },
};

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function MBTIAIChatPage() {
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 모바일 키보드 대응: textarea 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSelectMBTI = (mbti: string) => {
    setSelectedMBTI(mbti);
    const persona = MBTI_PERSONAS[mbti as keyof typeof MBTI_PERSONAS];
    setMessages([
      {
        role: 'assistant',
        text: persona.greeting,
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedMBTI) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mbti-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, mbti: selectedMBTI }),
      });

      if (!response.ok) throw new Error('API 오류');

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', text: data.text };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        text: '죄송합니다. 응답을 생성할 수 없습니다. 다시 시도해주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // 모바일에서는 Enter만으로 전송 (Shift+Enter는 줄바꿈)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 전송 후 textarea 높이 초기화
  const handleSendWithReset = async () => {
    await handleSend();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleReset = () => {
    setSelectedMBTI(null);
    setMessages([]);
    setInput('');
  };

  if (!selectedMBTI) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
          {/* 헤더 */}
          <header className="text-center mb-8 sm:mb-12">
            <div className="text-6xl sm:text-7xl md:text-8xl mb-4 animate-bounce-slow">
              💬✨
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
              MBTI AI 채팅
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-2">
              나의 MBTI 유형과 대화해보세요
            </p>
            <p className="text-sm sm:text-base text-white/60">
              각 MBTI 유형별 특성이 반영된 AI와 자연스러운 대화를 나눠보세요
            </p>
          </header>

          {/* MBTI 선택 그리드 */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Object.entries(MBTI_PERSONAS).map(([mbti, persona]) => (
              <button
                key={mbti}
                type="button"
                onClick={() => handleSelectMBTI(mbti)}
                className="group relative bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-white/20 hover:border-white/40 active:border-white/60 hover:bg-white/20 active:bg-white/25 transition-all duration-300 hover:scale-105 active:scale-100 hover:shadow-2xl hover:shadow-purple-500/50 touch-manipulation"
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shimmer"></div>

                <div className="relative">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    {persona.emoji}
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 sm:mb-2">
                    {mbti}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 mb-1">
                    {persona.name}
                  </div>
                  <div className="text-xs sm:text-sm text-white/50 leading-tight">
                    {persona.description}
                  </div>
                </div>
              </button>
            ))}
          </section>

          {/* 안내 메시지 */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-white/20">
              <p className="text-sm sm:text-base text-white/80">
                💡 <strong>Tip:</strong> 각 MBTI 유형은 고유한 말투와 사고방식을 가지고 있어요!
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -50px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(50px, 50px) scale(1.05); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
        `}</style>
      </main>
    );
  }

  // 채팅 화면
  const persona = MBTI_PERSONAS[selectedMBTI as keyof typeof MBTI_PERSONAS];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 h-screen flex flex-col">
        {/* 헤더 */}
        <header className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 border border-white/20 mb-3 sm:mb-4 md:mb-6 shadow-2xl flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex-shrink-0">{persona.emoji}</div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white truncate">
                  {selectedMBTI}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-white/70 truncate">{persona.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-xl text-white font-bold transition-all duration-300 text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0 touch-manipulation"
            >
              <span className="hidden sm:inline">🔄 다시 선택</span>
              <span className="sm:hidden">🔄</span>
            </button>
          </div>
        </header>

        {/* 메시지 영역 - 스크롤 영역 개선 */}
        <div
          className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 overflow-y-auto shadow-2xl overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="space-y-3 sm:space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] md:max-w-[70%] px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/20 text-white border border-white/30'
                  } shadow-lg`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/20 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/30">
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 입력 영역 - 모바일 최적화 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 border border-white/20 shadow-2xl flex-shrink-0">
          <div className="flex gap-2 sm:gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지 입력... (Enter: 전송, Shift+Enter: 줄바꿈)"
              className="flex-1 bg-white/20 text-white placeholder-white/50 rounded-xl px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none text-sm sm:text-base leading-relaxed touch-manipulation transition-all duration-200"
              rows={1}
              disabled={isLoading}
              style={{
                minHeight: '44px',
                maxHeight: '120px'
              }}
            />
            <button
              type="button"
              onClick={handleSendWithReset}
              disabled={!input.trim() || isLoading}
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl text-white font-bold transition-all duration-200 shadow-lg hover:shadow-2xl active:scale-95 hover:scale-105 text-sm sm:text-base whitespace-nowrap touch-manipulation flex items-center justify-center"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <span className="hidden sm:inline">전송</span>
              <span className="sm:hidden text-lg">📤</span>
            </button>
          </div>
          {/* 모바일에서만 보이는 Shift+Enter 힌트 */}
          <div className="mt-2 text-xs text-white/40 sm:hidden text-center">
            줄바꿈: Shift + Enter
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </main>
  );
}

