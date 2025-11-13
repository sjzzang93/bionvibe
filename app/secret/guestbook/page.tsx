'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/supabase-provider';
import Link from 'next/link';

interface Message {
  id: number;
  nickname: string;
  message: string;
  created_at: string;
}

export default function GuestbookManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const supabase = useSupabase();

  const loadMessages = async () => {
    if (!supabase) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('메시지 로드 실패:', error);
      alert('메시지를 불러오는데 실패했습니다.');
    } else if (data) {
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('이 메시지를 삭제하시겠습니까?')) return;
    if (!supabase) return;

    setDeleting(id);
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('삭제 실패:', error);
      alert('메시지 삭제에 실패했습니다.');
    } else {
      setMessages(messages.filter(m => m.id !== id));
      alert('✅ 메시지가 삭제되었습니다.');
    }
    setDeleting(null);
  };

  const handleDeleteAll = async () => {
    if (!confirm('⚠️ 모든 방명록 메시지를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다!')) return;
    if (!confirm('정말로 삭제하시겠습니까? 한 번 더 확인합니다.')) return;
    if (!supabase) return;

    setLoading(true);
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .neq('id', 0); // 모든 행 삭제

    if (error) {
      console.error('전체 삭제 실패:', error);
      alert('전체 삭제에 실패했습니다.');
    } else {
      setMessages([]);
      alert('✅ 모든 메시지가 삭제되었습니다.');
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/secret"
            className="inline-block mb-4 text-white/60 hover:text-white transition-colors"
          >
            ← Secret Vault로 돌아가기
          </Link>
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            방명록 관리
          </h1>
          <p className="text-gray-300">
            총 {messages.length}개의 메시지
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/10 mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <button
        type="button"
              onClick={loadMessages}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all disabled:opacity-50"
            >
              🔄 새로고침
            </button>
            <button
        type="button"
              onClick={handleDeleteAll}
              disabled={loading || messages.length === 0}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all disabled:opacity-50"
            >
              🗑️ 전체 삭제
            </button>
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-spin">⏳</div>
            <p className="text-white text-xl">로딩 중...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white text-xl">방명록이 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border-2 border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-white">
                        {msg.nickname}
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-white text-base leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  <button
        type="button"
                    onClick={() => handleDelete(msg.id)}
                    disabled={deleting === msg.id}
                    className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg font-bold transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {deleting === msg.id ? '삭제 중...' : '🗑️ 삭제'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
