'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: number;
  nickname: string;
  message: string;
  created_at: string;
}

export default function BionChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 불러오기
  const loadMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setMessages(data.reverse());
    }
  };

  // 실시간 구독
  useEffect(() => {
    if (!isOpen) return;

    loadMessages();

    const channel = supabase
      .channel('chat_room')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!message.trim() || !nickname) return;

    await supabase
      .from('chat_messages')
      .insert({
        nickname: nickname,
        message: message.trim()
      });

    setMessage('');
  };

  // 닉네임 설정
  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      setIsNicknameSet(true);
      // 로컬 스토리지에 저장
      localStorage.setItem('bion_chat_nickname', nickname);
    }
  };

  // 닉네임 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem('bion_chat_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
      setIsNicknameSet(true);
    }
  }, []);

  // 시간 포맷
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-5 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold"
      >
        💬 광장
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* 모던 헤더 */}
      <div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-rose-500 border-b border-rose-600"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl">
            💬
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              BION 광장
            </h3>
            <p className="text-xs text-white/80">
              {onlineCount}명 접속 중
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold transition-all"
        >
          ✕
        </button>
      </div>

      {/* 닉네임 입력 */}
      {!isNicknameSet ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👋</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">환영합니다!</h3>
                <p className="text-sm text-gray-600">닉네임을 입력하고 대화를 시작하세요</p>
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNicknameSubmit()}
                placeholder="닉네임 입력"
                maxLength={10}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-3 text-center font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                autoFocus
              />
              <button
                onClick={handleNicknameSubmit}
                disabled={!nickname.trim()}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                입장하기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 메시지 영역 */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-600 font-medium">아직 메시지가 없어요</p>
                <p className="text-sm text-gray-500 mt-2">첫 메시지를 남겨보세요!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.nickname === nickname ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {msg.nickname === nickname ? '나' : msg.nickname}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                      msg.nickname === nickname
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                    style={{
                      borderRadius: msg.nickname === nickname ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                    }}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지를 입력하세요..."
                maxLength={200}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </div>
            <div className="mt-2 text-center">
              <button
                onClick={() => {
                  localStorage.removeItem('bion_chat_nickname');
                  setIsNicknameSet(false);
                  setNickname('');
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                닉네임 변경
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

