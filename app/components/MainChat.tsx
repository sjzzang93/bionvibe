'use client';

import { useState, useEffect, useRef } from 'react';
import { useSupabase } from '@/lib/supabase-provider';
import Image from 'next/image';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { generateAutoReply, BION_BOT_NICKNAME } from '@/lib/bion-auto-reply';

interface Message {
  id: number;
  nickname: string;
  message: string;
  created_at: string;
}

export default function MainChat() {
  const supabase = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(true); // 기본값: 접힌 상태
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // 메시지 자동 스크롤 (채팅창 내부만, 페이지 전체 스크롤 방지)
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      // 채팅 컨테이너의 scrollTop을 직접 조정 (페이지 스크롤 없음)
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // 메시지 업데이트 후 약간의 딜레이를 두고 스크롤
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  // 저장된 닉네임 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem('bion_chat_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
      setIsNicknameSet(true);
    }
  }, []);

  // 메시지 로드 및 실시간 구독
  useEffect(() => {
    
    // 모든 메시지 로드
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('메시지 로드 실패:', error);
        return;
      }

      if (data) {
        setMessages(data.reverse());
      }
    };

    // 메시지 로드
    loadMessages();

    // 실시간 구독
    const channel = supabase
      .channel('bion-main-chat', {
        config: {
          broadcast: { self: true }
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        console.log('💬 새 메시지 수신:', payload.new);
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        // SUBSCRIBED만 조용히 로그 (개발/프로덕션 모두)
        if (status === 'SUBSCRIBED') {
          if (process.env.NODE_ENV !== 'production') {
            console.log('📝 방명록 연결됨');
          }
        }
        // CHANNEL_ERROR는 Fast Refresh나 일시적 연결 끊김이므로 무시
        
        if (status === 'SUBSCRIBED' && isNicknameSet) {
          await channel.track({
            user: nickname,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // 닉네임 설정되면 presence 업데이트
  useEffect(() => {
    if (isNicknameSet && channelRef.current) {
      channelRef.current.track({
        user: nickname,
        online_at: new Date().toISOString(),
      });
    }
  }, [isNicknameSet, nickname]);

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      localStorage.setItem('bion_chat_nickname', nickname.trim());
      setIsNicknameSet(true);
    }
  };

  // 욕설 필터링 함수
  const filterBadWords = (text: string): string => {
    const badWords = [
      '시발', '씨발', 'ㅅㅂ', 'ㅆㅂ', '시팔', '씨팔',
      '개새', '개세', 'ㄱㅅ',
      '병신', 'ㅂㅅ', '븅신',
      '좆', 'ㅈ같', '존나', 'ㅈㄴ',
      '지랄', 'ㅈㄹ',
      '꺼져', '닥쳐',
      '애미', '에미',
      '년', '놈',
      'fuck', 'shit', 'bitch', 'ass'
    ];

    let filtered = text;
    badWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '***');
    });

    return filtered;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    // 욕설 필터링
    const filteredMessage = filterBadWords(message.trim());
    
    // 임시 메시지 객체 (Optimistic Update)
    const tempMessage: Message = {
      id: Date.now(), // 임시 ID
      nickname: nickname,
      message: filteredMessage,
      created_at: new Date().toISOString()
    };

    // 즉시 UI에 추가
    setMessages(prev => [...prev, tempMessage]);
    setMessage('');

    // 서버에 전송
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        nickname: nickname,
        message: filteredMessage
      })
      .select();

    if (error) {
      console.error('❌ 메시지 전송 실패:', error);
      // 실패 시 임시 메시지 제거
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      alert('메시지 전송에 실패했습니다.');
      return;
    }
    
    console.log('✅ 메시지 전송 성공:', data);

    // 실제 서버 메시지로 교체 (중복 방지)
    if (data && data[0]) {
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempMessage.id);
        // Realtime에서 이미 추가했을 수도 있으니 중복 체크
        const exists = filtered.some(m => m.id === data[0].id);
        return exists ? filtered : [...filtered, data[0] as Message];
      });
      
      // 🤖 비온이 자동응답 (3초 후)
      setTimeout(async () => {
        const autoReply = generateAutoReply(filteredMessage);
        
        await supabase
          .from('chat_messages')
          .insert({
            nickname: BION_BOT_NICKNAME,
            message: autoReply
          });
      }, 3000);
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '00:00';
    }
  };

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-2" style={{ fontFamily: 'cursive' }}>
              <span className="text-orange-600 dark:text-orange-400">BION 방명록</span>
              <span className="text-orange-600 dark:text-orange-400">📖</span>
            </h2>
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-300 font-semibold">
            {isNicknameSet ? (
              <>
                💝 지금 <span className="font-bold text-orange-600 dark:text-orange-400">{onlineCount}명</span>이 함께해요!
              </>
            ) : (
              '✨ 추억을 남겨주세요! 일촌신청 환영 ✨'
            )}
          </p>
        </div>

        {/* 방명록 영역 - 싸이월드 감성 */}
        <div className="max-w-lg mx-auto bg-amber-50/80 dark:bg-orange-900/20 shadow-2xl overflow-hidden border-4 border-orange-200 dark:border-orange-800">
          {/* 방명록 헤더 - 싸이월드 스타일 */}
          <div className="bg-orange-400 dark:bg-orange-700 p-4 border-b-4 border-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xl shadow-lg">
                    <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>🐿️</span>
                  </div>
                </div>
                <div suppressHydrationWarning>
                  <h3 className="font-black text-lg flex items-center gap-1.5 text-white" style={{ fontFamily: 'cursive' }}>
                    <span>BION 방명록</span>
                    <span className="text-xl">📖</span>
                  </h3>
                  <p className="text-[10px] text-white/90 font-semibold" suppressHydrationWarning>
                    {isNicknameSet ? `🌸 ${nickname}님 환영해요!` : '💝 일촌이 되어주세요!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2" suppressHydrationWarning>
                {isNicknameSet && (
                  <button
        type="button"
                    onClick={() => {
                      if (confirm('닉네임을 변경하시겠어요?')) {
                        localStorage.removeItem('bion_chat_nickname');
                        setIsNicknameSet(false);
                        setNickname('');
                      }
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-orange-100 text-orange-600 text-xs rounded-full font-bold shadow-md transition-all border-2 border-orange-300"
                  >
                    ✏️ 변경
                  </button>
                )}
                <button
        type="button"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="px-3 py-1.5 bg-white hover:bg-orange-100 text-orange-600 text-sm rounded-full font-bold shadow-md transition-all border-2 border-orange-300"
                  aria-label={isCollapsed ? '방명록 펼치기' : '방명록 접기'}
                >
                  {isCollapsed ? '📖' : '📕'}
                </button>
              </div>
            </div>
          </div>

          {/* 메시지 영역 */}
          {!isCollapsed && (
          <div 
            ref={messagesContainerRef}
            className="h-[300px] overflow-y-auto p-4 space-y-3 bg-amber-50/90 dark:bg-orange-900/10"
            style={{
              backgroundImage: `
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fb923c' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `
            }}
            suppressHydrationWarning
          >
            {messages.length === 0 ? (
              // 메시지 없을 때
              <div className="text-center py-16">
                <div className="text-4xl mb-3 animate-bounce">💭</div>
                <p className="text-base font-bold text-gray-600 dark:text-gray-300 mb-1">아직 메시지가 없어요</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isNicknameSet ? '첫 메시지를 남겨보세요!' : '첫 메시지를 기다리고 있어요!'}
                </p>
              </div>
            ) : (
              // 메시지 목록 - 포스트잇 스타일
              messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`relative bg-gradient-to-br ${
                    msg.nickname === nickname
                      ? 'from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 border-orange-300 dark:border-orange-700'
                      : 'from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-300 dark:border-yellow-700'
                  } rounded-lg p-4 shadow-md border-2 hover:shadow-lg transition-all`}
                  style={{
                    transform: `rotate(${index % 2 === 0 ? '0.2deg' : '-0.2deg'})`,
                  }}
                >
                  {/* 압정 효과 */}
                  <div className="absolute -top-2 left-4 w-4 h-4 bg-red-400 dark:bg-red-500 rounded-full shadow-lg"></div>
                  
                  {/* 작성자 & 시간 */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-orange-800 dark:text-orange-200">
                      {msg.nickname === nickname ? '나 📝' : `${msg.nickname} 🐿️`}
                    </span>
                    <span className="text-[10px] text-orange-600 dark:text-orange-400">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  
                  {/* 메시지 내용 */}
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          )}

          {/* 입력 영역 */}
          {!isCollapsed && (
          <div className="p-2 bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-800 dark:to-gray-700 border-t-2 border-gray-500 dark:border-gray-600">
            {isNicknameSet ? (
              // 메시지 입력
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      sendMessage();
                    }
                  }}
                  placeholder="방명록을 작성하세요"
                  maxLength={200}
                  className="flex-1 px-3 py-2 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300 dark:focus:ring-red-500 border border-white dark:border-gray-600"
                />
                <button
        type="button"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm border border-red-200 dark:border-gray-600"
                >
                  전송
                </button>
              </div>
            ) : (
              // 닉네임 입력
              <div className="space-y-1.5">
                <div className="text-center">
                  <p className="text-white font-bold text-[10px]">
                    💬 대화에 참여하려면 닉네임을 입력하세요!
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNicknameSubmit();
                      }
                    }}
                    placeholder="닉네임 입력 (예: 하늘이)"
                    maxLength={10}
                    className="flex-1 px-3 py-2 font-bold text-base text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300 dark:focus:ring-red-500 border border-white dark:border-gray-600"
                  />
                  <button
        type="button"
                    onClick={handleNicknameSubmit}
                    disabled={!nickname.trim()}
                    className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm border border-red-200 dark:border-gray-600"
                  >
                    입장
                  </button>
                </div>
              </div>
            )}
          </div>
          )}
        </div>

        {/* 안내 문구 */}
        <div className="mt-4 text-center space-y-2 px-4">
          <div className="bg-amber-100/80 dark:bg-orange-900/30 rounded-lg p-3 border-2 border-orange-300 dark:border-orange-700">
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-1">
              🎉 이벤트 안내
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              방명록 작성하시고 <span className="font-bold text-orange-600 dark:text-orange-400">Event 버튼</span>으로 이벤트 참여하시면<br />
              원하시는 <span className="font-bold text-orange-700 dark:text-orange-300">웹앱 추가</span> 또는 <span className="font-bold text-orange-700 dark:text-orange-300">프로그램</span>으로 만들어드립니다!
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 italic">
              (ex: 코인자동매매 프로그램)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

