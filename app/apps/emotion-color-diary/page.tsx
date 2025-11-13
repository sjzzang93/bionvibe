"use client";

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import { useSupabase } from '@/lib/supabase-provider';
import SimpleAuth from '@/app/components/SimpleAuth';
import type { User } from '@supabase/supabase-js';
import AdOverlay from '@/app/components/AdOverlay';

const EMOTIONS = [
  { name: '행복', color: '#FFD700', emoji: '😊', description: '기쁘고 즐거운 하루' },
  { name: '사랑', color: '#FF69B4', emoji: '🥰', description: '따뜻하고 애정 넘치는 하루' },
  { name: '평온', color: '#87CEEB', emoji: '😌', description: '고요하고 평화로운 하루' },
  { name: '설렘', color: '#FF6B9D', emoji: '💖', description: '두근두근 기대되는 하루' },
  { name: '활력', color: '#FF4500', emoji: '🔥', description: '에너지 넘치는 하루' },
  { name: '피곤', color: '#696969', emoji: '😪', description: '지치고 피곤한 하루' },
  { name: '우울', color: '#4169E1', emoji: '😔', description: '슬프고 우울한 하루' },
  { name: '화남', color: '#DC143C', emoji: '😠', description: '짜증나고 화나는 하루' },
  { name: '불안', color: '#9370DB', emoji: '😰', description: '걱정되고 불안한 하루' },
  { name: '외로움', color: '#708090', emoji: '😢', description: '쓸쓸하고 외로운 하루' },
  { name: '감사', color: '#32CD32', emoji: '🙏', description: '감사한 마음이 드는 하루' },
  { name: '자신감', color: '#FFD700', emoji: '💪', description: '자신감 넘치는 하루' },
];

interface DiaryEntry {
  date: string;
  emotion: string;
  color: string;
  emoji: string;
  note: string;
}

export default function EmotionColorDiary() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<any>(null);
  const [note, setNote] = useState('');
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 사용자 인증 상태 확인
  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) {
        setIsAuthLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsAuthLoading(false);
    };

    checkUser();

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    }) ?? { data: { subscription: null } };

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  // 데이터 불러오기
  useEffect(() => {
    const loadDiary = async () => {
      if (!user) return;

      if (!supabase) {
        // Supabase 없으면 localStorage 사용
        const saved = localStorage.getItem('emotion_diary');
        if (saved) {
          setDiary(JSON.parse(saved));
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('emotion_diary')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(365);

        if (error) {
          console.error('감정 일기 로드 실패:', error);
          return;
        }

        if (data) {
          setDiary(data);
        }
      } catch (error) {
        console.error('감정 일기 로드 에러:', error);
      }
    };

    loadDiary();
  }, [supabase, user]);

  const saveDiary = async () => {
    if (!user) {
      alert('로그인이 필요합니다!');
      return;
    }
    if (!selectedEmotion) {
      alert('오늘의 감정을 선택해주세요!');
      return;
    }

    setIsLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const newEntry: DiaryEntry = {
      date: today,
      emotion: selectedEmotion.name,
      color: selectedEmotion.color,
      emoji: selectedEmotion.emoji,
      note: note.trim()
    };

    try {
      if (!supabase) {
        alert('서버 연결 실패');
        setIsLoading(false);
        return;
      }

      // Supabase에 저장
      const { error } = await supabase
        .from('emotion_diary')
        .upsert({
          user_id: user.id,
          date: today,
          emotion: selectedEmotion.name,
          color: selectedEmotion.color,
          emoji: selectedEmotion.emoji,
          note: note.trim()
        }, { onConflict: 'user_id,date' });

      if (error) {
        console.error('저장 실패:', error);
        alert('저장에 실패했습니다. 다시 시도해주세요.');
        setIsLoading(false);
        return;
      }

      // 로컬 상태 업데이트
      const filtered = diary.filter(d => d.date !== today);
      const updated = [newEntry, ...filtered].slice(0, 365);
      setDiary(updated);

      alert('오늘의 감정이 저장되었습니다! 💝');
      setNote('');
      setSelectedEmotion(null);
    } catch (error) {
      console.error('저장 중 에러:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionStats = () => {
    const stats: any = {};
    diary.forEach(entry => {
      stats[entry.emotion] = (stats[entry.emotion] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setDiary([]);
    setSelectedEmotion(null);
    setNote('');
  };

  // 로딩 중
  if (isAuthLoading) {
    return (
      <PremiumLayout theme="pink">
        
        <AdOverlay /><div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">⏳</div>
            <p className="text-white text-xl">로딩 중...</p>
          </div>
        </div>
      </PremiumLayout>
    );
  }

  // 로그인하지 않은 사용자
  if (!user) {
    return (
      <PremiumLayout theme="pink">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">
              🎨 감정 컬러 일기
            </h1>
            <p className="text-xl text-white/80 mb-8">하루의 감정을 색으로 표현하세요</p>
            <p className="text-white/70 mb-4">
              📝 나만의 아이디와 비밀번호로 일기를 안전하게 저장하세요
            </p>
          </div>

          <SimpleAuth onSuccess={() => {}} />

          {/* Related Apps */}
          <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <RelatedApps currentAppSlug="emotion-color-diary" className="mt-8" />
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}</style>
      </PremiumLayout>
    );
  }

  return (
    <PremiumLayout theme="pink">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">
              🎨 감정 컬러 일기
            </h1>
          </div>
          <p className="text-xl text-white/80">하루의 감정을 색으로 표현하세요</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <span className="text-white/70 text-sm">
              👤 {user.email?.split('@')[0]}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 왼쪽: 감정 선택 */}
          <div className="space-y-6">
            <PremiumCard hover gradient>
              <h3 className="text-white text-2xl font-bold mb-6 text-center">😊 오늘의 감정은?</h3>
              <div className="grid grid-cols-3 gap-3">
                {EMOTIONS.map((emotion) => (
                  <button
                    type="button"
                    key={emotion.name}
                    onClick={() => setSelectedEmotion(emotion)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedEmotion?.name === emotion.name
                        ? 'ring-4 ring-white scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: emotion.color }}
                  >
                    <div className="text-3xl mb-1">{emotion.emoji}</div>
                    <div className="text-white font-bold text-sm">{emotion.name}</div>
                  </button>
                ))}
              </div>
            </PremiumCard>

            {selectedEmotion && (
              <PremiumCard hover className="animate-slideUp">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{selectedEmotion.emoji}</div>
                  <h3 className="text-white text-2xl font-bold mb-2">{selectedEmotion.name}</h3>
                  <p className="text-white/80">{selectedEmotion.description}</p>
                </div>

                <div className="mb-4">
                  <label className="text-white font-bold mb-2 block">📝 오늘의 한 줄</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="오늘 하루는 어땠나요? (선택사항)"
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg text-black resize-none"
                    style={{ fontSize: '16px' }}
                  />
                  <div className="text-white/70 text-sm mt-1 text-right">
                    {note.length}/200
                  </div>
                </div>

                <PremiumButton
                  onClick={saveDiary}
                  variant="primary"
                  size="lg"
                  icon={isLoading ? "⏳" : "💾"}
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? '저장 중...' : '오늘의 감정 저장하기'}
                </PremiumButton>
              </PremiumCard>
            )}
          </div>

          {/* 오른쪽: 캘린더 & 통계 */}
          <div className="space-y-6">
            {/* 통계 */}
            <PremiumCard hover>
              <h3 className="text-white text-xl font-bold mb-4 text-center">📊 감정 통계</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">📅</div>
                  <div className="text-2xl font-bold text-white">{diary.length}</div>
                  <div className="text-white/70 text-sm">기록일</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-white">
                    {diary.filter((d, i) => {
                      const prev = new Date(diary[i + 1]?.date || 0);
                      const curr = new Date(d.date);
                      const diff = Math.abs(curr.getTime() - prev.getTime());
                      return diff <= 86400000;
                    }).length}
                  </div>
                  <div className="text-white/70 text-sm">연속</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.min(30, diary.length)}
                  </div>
                  <div className="text-white/70 text-sm">최근 30일</div>
                </div>
              </div>

              {getEmotionStats().length > 0 && (
                <div>
                  <h4 className="text-white font-bold mb-3">많이 느낀 감정</h4>
                  <div className="space-y-2">
                    {getEmotionStats().map(([emotion, count]: any, index) => {
                      const emotionData = EMOTIONS.find(e => e.name === emotion);
                      return (
                        <div
                          key={emotion}
                          className="flex items-center gap-3 bg-white/10 rounded-lg p-3"
                        >
                          <div className="text-2xl">{emotionData?.emoji}</div>
                          <div className="flex-1">
                            <div className="text-white font-bold">{emotion}</div>
                            <div className="text-white/70 text-sm">{count}번</div>
                          </div>
                          <div className="text-2xl font-bold text-white">#{index + 1}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PremiumCard>

            {/* 최근 기록 */}
            {diary.length > 0 && (
              <PremiumCard hover>
                <h3 className="text-white text-xl font-bold mb-4 text-center">📖 최근 기록</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {diary.slice(0, 10).map((entry, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-4 hover:scale-105 transition-transform"
                      style={{ backgroundColor: entry.color + '40' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-2xl mb-1">{entry.emoji}</div>
                          <div className="text-white font-bold">{entry.emotion}</div>
                        </div>
                        <div className="text-white/80 text-sm">{entry.date}</div>
                      </div>
                      {entry.note && (
                        <p className="text-white/90 text-sm mt-2">{entry.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </PremiumCard>
            )}
          </div>
        </div>

        {/* Related Apps */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="emotion-color-diary" className="mt-8" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </PremiumLayout>
  );
}
