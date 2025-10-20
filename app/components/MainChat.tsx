'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: number;
  nickname: string;
  message: string;
  created_at: string;
}

export default function MainChat() {
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
    
    // 24시간 지난 메시지 삭제 (Supabase Function 호출)
    const deleteOldMessages = async () => {
      try {
        const { error } = await supabase.rpc('delete_old_chat_messages');
        if (error) {
          console.log('오래된 메시지 삭제 중 오류:', error.message);
        } else {
          console.log('✅ 24시간 지난 메시지 삭제 완료');
        }
      } catch (err) {
        console.log('메시지 정리 중 오류:', err);
      }
    };
    
    // 최근 24시간 이내 메시지만 로드
    const loadMessages = async () => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .gte('created_at', twentyFourHoursAgo)  // 24시간 이내 메시지만
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

    // 먼저 오래된 메시지 삭제 후 로드
    deleteOldMessages().then(() => loadMessages());

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
        console.log('🔗 채널 구독 상태:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ 실시간 채팅 연결 성공!');
          if (isNicknameSet) {
            await channel.track({
              user: nickname,
              online_at: new Date().toISOString(),
            });
          }
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ 채널 연결 실패');
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
    <section className="py-8 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            {/* BION 반짝이는 로고 */}
            <div className="relative w-8 h-8 bg-gradient-to-br from-red-500 to-rose-500 dark:from-red-600 dark:to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-transparent opacity-100 rounded-lg animate-pulse"></div>
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 relative z-10"
                fill="none"
              >
                <g className="animate-pulse">
                  <line x1="12" y1="2" x2="12" y2="4" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="20" x2="12" y2="22" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="4" y1="12" x2="2" y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="22" y1="12" x2="20" y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
                </g>
                <circle cx="12" cy="12" r="3" fill="#FCD34D"/>
                <circle cx="12" cy="12" r="2" fill="#FFFBEB"/>
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              비온타키
            </h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {isNicknameSet ? (
              <>
                지금 <span className="font-bold text-red-600 dark:text-red-400">{onlineCount}명</span>이 대화 중이에요!
              </>
            ) : (
              '실시간으로 대화할 수 있는 공간이에요!'
            )}
          </p>
        </div>

        {/* 채팅 영역 */}
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-xl overflow-hidden border-4 border-red-400 dark:border-red-900">
          {/* 채팅 헤더 */}
          <div className="bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-800 dark:to-rose-800 p-3 border-b-2 border-red-600 dark:border-red-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg animate-pulse">
                  💬
                </div>
                <div suppressHydrationWarning>
                  <h3 className="text-white font-black text-base">BionTalk</h3>
                  <p className="text-[10px] text-white/90" suppressHydrationWarning>
                    {isNicknameSet ? `${nickname}님 접속 중` : '관전 중 · 참여하려면 닉네임 입력!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2" suppressHydrationWarning>
                {isNicknameSet && (
                  <button
                    onClick={() => {
                      if (confirm('닉네임을 변경하시겠어요?')) {
                        localStorage.removeItem('bion_chat_nickname');
                        setIsNicknameSet(false);
                        setNickname('');
                      }
                    }}
                    className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded font-bold transition-all"
                  >
                    닉네임 변경
                  </button>
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-base rounded font-bold transition-all"
                  aria-label={isCollapsed ? '채팅 펼치기' : '채팅 접기'}
                >
                  {isCollapsed ? '▼' : '▲'}
                </button>
              </div>
            </div>
          </div>

          {/* 메시지 영역 */}
          {!isCollapsed && (
          <div 
            ref={messagesContainerRef}
            className="h-[450px] overflow-y-auto p-2 space-y-1.5 bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900/50 dark:to-gray-800"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(244, 63, 94, 0.03) 20px, rgba(244, 63, 94, 0.03) 40px)'
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
              // 메시지 목록
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.nickname === nickname ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 mb-0.5 px-0.5">
                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                      {msg.nickname === nickname ? '나' : msg.nickname}
                    </span>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <div
                    className={`max-w-[75%] px-2.5 py-1.5 shadow-sm border ${
                      msg.nickname === nickname
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-700 dark:to-rose-700 text-white border-red-600 dark:border-red-800'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-red-200 dark:border-gray-600'
                    }`}
                  >
                    <p className="text-xs break-words leading-tight">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          )}

          {/* 입력 영역 */}
          {!isCollapsed && (
          <div className="p-2 bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-800 dark:to-rose-800 border-t-2 border-red-600 dark:border-red-900">
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
                  placeholder="메시지를 입력하세요..."
                  maxLength={200}
                  className="flex-1 px-3 py-2 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300 dark:focus:ring-red-500 border border-white dark:border-gray-600"
                />
                <button
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
        <div className="mt-4 text-center space-y-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 <span className="font-semibold">비온타키</span>는 누구나 자유롭게 대화할 수 있는 공간이에요!
          </p>
          <p className="text-[10px] text-yellow-600 dark:text-yellow-400 font-medium">
            🕐 채팅 메시지는 24시간 후 자동으로 삭제됩니다
          </p>
        </div>
      </div>
    </section>
  );
}

