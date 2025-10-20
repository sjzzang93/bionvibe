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
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // 기본값: 접힌 상태
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // 클라이언트 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // 메시지 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 저장된 닉네임 불러오기 (클라이언트 마운트 후)
  useEffect(() => {
    if (!mounted) return;
    
    const savedNickname = localStorage.getItem('bion_chat_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
      setIsNicknameSet(true);
    }
  }, [mounted]);

  // 메시지 로드 및 실시간 구독 (클라이언트 마운트 후)
  useEffect(() => {
    if (!mounted) return;
    
    // 최근 메시지 50개 로드
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

    loadMessages();

    // 실시간 구독
    const channel = supabase
      .channel('main-chat-room')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
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
  }, [mounted]);

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

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        nickname: nickname,
        message: filteredMessage
      });

    if (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
      return;
    }

    setMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 서버 사이드에서는 간단한 로딩 표시
  if (!mounted) {
    return (
      <section className="py-8 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-2xl sm:text-3xl font-black mb-1 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              🌟 비온타키
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              실시간으로 대화할 수 있는 공간이에요!
            </p>
          </div>
          <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-xl overflow-hidden border-4 border-red-400 dark:border-red-900">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-800 dark:to-rose-800 p-3 border-b-2 border-red-600 dark:border-red-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg">
                    💬
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base">BionTalk</h3>
                    <p className="text-[10px] text-white/90">로딩 중...</p>
                  </div>
                </div>
                <button className="px-2 py-1 bg-white/20 text-white text-base rounded font-bold">
                  ▼
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 <span className="font-semibold">비온타키</span>는 누구나 자유롭게 대화할 수 있는 공간이에요!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-3">
          <h2 className="text-2xl sm:text-3xl font-black mb-1 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
            🌟 비온타키
          </h2>
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
                <div>
                  <h3 className="text-white font-black text-base">BionTalk</h3>
                  <p className="text-[10px] text-white/90">
                    {isNicknameSet ? `${nickname}님 접속 중` : '관전 중 · 참여하려면 닉네임 입력!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
            className="h-[450px] overflow-y-auto p-2 space-y-1.5 bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900/50 dark:to-gray-800"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(244, 63, 94, 0.03) 20px, rgba(244, 63, 94, 0.03) 40px)'
            }}
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
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="메시지를 입력하세요..."
                  maxLength={200}
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300 dark:focus:ring-red-500 border border-white dark:border-gray-600"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs border border-red-200 dark:border-gray-600"
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
                    onKeyDown={(e) => e.key === 'Enter' && handleNicknameSubmit()}
                    placeholder="닉네임 입력 (예: 하늘이)"
                    maxLength={10}
                    className="flex-1 px-3 py-2 font-bold text-xs text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300 dark:focus:ring-red-500 border border-white dark:border-gray-600"
                  />
                  <button
                    onClick={handleNicknameSubmit}
                    disabled={!nickname.trim()}
                    className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs border border-red-200 dark:border-gray-600"
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
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 <span className="font-semibold">비온타키</span>는 누구나 자유롭게 대화할 수 있는 공간이에요!
          </p>
        </div>
      </div>
    </section>
  );
}

