'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabase } from '@/lib/supabase-provider';

export interface Contact {
  id?: number;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'answered' | 'closed';
  created_at?: string;
  answered_at?: string;
  admin_reply?: string;
}

export default function ContactsManagement() {
  const supabase = useSupabase();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered' | 'closed'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState('');

  // 문의 불러오기
  const loadContacts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('문의 불러오기 실패:', error);
      } else {
        setContacts(data || []);
      }
    } catch (err) {
      console.error('오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 상태 변경
  const updateStatus = async (id: number, status: Contact['status']) => {
    const { error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert('상태 변경 실패: ' + error.message);
    } else {
      loadContacts();
    }
  };

  // 답변 저장
  const saveReply = async () => {
    if (!selectedContact || !selectedContact.id) return;

    const { error } = await supabase
      .from('contacts')
      .update({
        admin_reply: replyText,
        answered_at: new Date().toISOString(),
        status: 'answered'
      })
      .eq('id', selectedContact.id);

    if (error) {
      alert('답변 저장 실패: ' + error.message);
    } else {
      alert('답변이 저장되었습니다!');
      setSelectedContact(null);
      setReplyText('');
      loadContacts();
    }
  };

  useEffect(() => {
    loadContacts();
  }, [filter]);

  // 실시간 업데이트 구독
  useEffect(() => {
    const channel = supabase
      .channel('contacts_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'contacts'
      }, () => {
        loadContacts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      answered: 'bg-green-100 text-green-800 border-green-300',
      closed: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    const labels = {
      pending: '대기중',
      answered: '답변완료',
      closed: '종료'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📧 문의 관리</h1>
            <p className="text-gray-300">총 {contacts.length}건의 문의</p>
          </div>
          <Link
            href="/secret"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            ← 돌아가기
          </Link>
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'answered', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === f
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {f === 'all' ? '전체' : f === 'pending' ? '대기중' : f === 'answered' ? '답변완료' : '종료'}
            </button>
          ))}
        </div>

        {/* 문의 목록 */}
        {loading ? (
          <div className="text-center text-white text-xl py-12">
            로딩 중...
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center text-gray-400 text-xl py-12">
            문의가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{contact.name}</h3>
                      {getStatusBadge(contact.status)}
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>📧 {contact.email}</div>
                      <div>📅 {formatDate(contact.created_at!)}</div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    {contact.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          setReplyText(contact.admin_reply || '');
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold"
                      >
                        답변하기
                      </button>
                    )}
                    {contact.status === 'answered' && (
                      <button
                        onClick={() => updateStatus(contact.id!, 'closed')}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-semibold"
                      >
                        종료
                      </button>
                    )}
                  </div>
                </div>

                {/* 문의 내용 */}
                <div className="bg-white/5 rounded-lg p-4 mb-3">
                  <div className="text-sm text-gray-400 mb-1">문의 내용:</div>
                  <div className="text-white whitespace-pre-wrap">{contact.message}</div>
                </div>

                {/* 관리자 답변 */}
                {contact.admin_reply && (
                  <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                    <div className="text-sm text-green-400 mb-1">
                      답변 ({contact.answered_at && formatDate(contact.answered_at)}):
                    </div>
                    <div className="text-white whitespace-pre-wrap">{contact.admin_reply}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 답변 모달 */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full border-2 border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">답변 작성</h2>
              
              <div className="mb-4 p-4 bg-white/5 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">문의자: {selectedContact.name}</div>
                <div className="text-white">{selectedContact.message}</div>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="답변을 입력하세요..."
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setSelectedContact(null);
                    setReplyText('');
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={saveReply}
                  disabled={!replyText.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  답변 저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

