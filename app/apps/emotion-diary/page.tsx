'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  user_id: string;
  nickname: string;
  created_at: string;
}

interface EmotionEntry {
  id: string;
  date: string;
  emotion: string;
  color: string;
  weather: string;
  intensity: number; // 1-5
  note: string;
}

const EMOTIONS = [
  { id: 'happy', name: '행복해요', emoji: '😊', color: '#FFD700' },
  { id: 'excited', name: '신나요', emoji: '🤩', color: '#FF6B6B' },
  { id: 'calm', name: '평온해요', emoji: '😌', color: '#4ECDC4' },
  { id: 'sad', name: '슬퍼요', emoji: '😢', color: '#6C63FF' },
  { id: 'angry', name: '화나요', emoji: '😠', color: '#FF4757' },
  { id: 'anxious', name: '불안해요', emoji: '😰', color: '#FFA502' },
  { id: 'tired', name: '피곤해요', emoji: '😴', color: '#95A5A6' },
  { id: 'grateful', name: '감사해요', emoji: '🙏', color: '#F8B500' },
  { id: 'loved', name: '사랑받아요', emoji: '🥰', color: '#FF69B4' },
  { id: 'lonely', name: '외로워요', emoji: '😔', color: '#5F27CD' },
];

const WEATHERS = [
  { id: 'sunny', name: '맑음', emoji: '☀️' },
  { id: 'cloudy', name: '흐림', emoji: '☁️' },
  { id: 'rainy', name: '비', emoji: '🌧️' },
  { id: 'snowy', name: '눈', emoji: '❄️' },
  { id: 'stormy', name: '폭풍', emoji: '⛈️' },
  { id: 'rainbow', name: '무지개', emoji: '🌈' },
];

export default function EmotionDiaryPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);

  // 새 일기 작성 상태
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'stats'>('calendar');

  useEffect(() => {
    setMounted(true);
  }, []);

  // 사용자 정보 확인
  useEffect(() => {
    if (!mounted) return;

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/emotion-diary/user');
        const result = await response.json();

        if (result.success && result.data) {
          setUser(result.data);
        } else {
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error('User fetch error:', error);
        setShowLoginModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [mounted]);

  // 일기 목록 불러오기
  useEffect(() => {
    if (!mounted || !user) return;

    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/emotion-diary/entries');
        const result = await response.json();

        if (result.success) {
          setEntries(result.data);
        }
      } catch (error) {
        console.error('Entries fetch error:', error);
      }
    };

    fetchEntries();
  }, [mounted, user]);

  // 로그인
  const handleLogin = async () => {
    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      alert('닉네임은 2~20자 사이여야 합니다.');
      return;
    }

    try {
      const response = await fetch('/api/emotion-diary/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname })
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        setShowLoginModal(false);
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠어요?')) return;

    try {
      await fetch('/api/emotion-diary/user', { method: 'DELETE' });
      setUser(null);
      setEntries([]);
      setShowLoginModal(true);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 일기 저장
  const saveEntry = async () => {
    if (!selectedEmotion || !selectedWeather) {
      alert('감정과 날씨를 선택해주세요!');
      return;
    }

    const emotion = EMOTIONS.find((e) => e.id === selectedEmotion)!;

    try {
      const response = await fetch('/api/emotion-diary/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          emotion: selectedEmotion,
          color: emotion.color,
          weather: selectedWeather,
          intensity,
          note
        })
      });

      const result = await response.json();

      if (result.success) {
        setEntries([result.data, ...entries]);
        alert(result.message);

        // 초기화
        setIsWriting(false);
        setSelectedEmotion('');
        setSelectedWeather('');
        setIntensity(3);
        setNote('');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Save entry error:', error);
      alert('일기 저장에 실패했습니다.');
    }
  };

  // 일기 삭제
  const deleteEntry = async (id: string) => {
    if (!confirm('이 일기를 삭제하시겠어요?')) return;

    try {
      const response = await fetch(`/api/emotion-diary/entries?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setEntries(entries.filter((e) => e.id !== id));
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Delete entry error:', error);
      alert('일기 삭제에 실패했습니다.');
    }
  };

  const getEmotionStats = () => {
    const stats: { [key: string]: number } = {};
    entries.forEach((entry) => {
      stats[entry.emotion] = (stats[entry.emotion] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([emotion, count]) => ({
        emotion: EMOTIONS.find((e) => e.id === emotion)!,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getAverageIntensity = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.intensity, 0);
    return (sum / entries.length).toFixed(1);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400"></div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl animate-float delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
            🌈💭✨
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
            감정 일기
          </h1>
          <p className="text-lg sm:text-xl text-white mb-2">
            오늘의 감정을 색깔과 날씨로 표현해보세요
          </p>
          {user && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white font-bold">
                👤 {user.nickname}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-all">
                로그아웃
              </button>
            </div>
          )}
        </header>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4"></div>
            <p className="text-white text-lg">로딩 중...</p>
          </div>
        ) : user ? (
          <>
            {/* 버튼 그룹 */}
            <div className="flex gap-3 justify-center mb-8 flex-wrap">
              <button
                onClick={() => setIsWriting(true)}
                className="px-6 py-3 bg-white/90 hover:bg-white rounded-2xl text-purple-600 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 touch-manipulation"
              >
                ✍️ 새 일기 쓰기
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 touch-manipulation ${
                  viewMode === 'calendar'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/30 text-white hover:bg-white/50'
                }`}
              >
                📅 목록 보기
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 touch-manipulation ${
                  viewMode === 'stats'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/30 text-white hover:bg-white/50'
                }`}
              >
                📊 통계 보기
              </button>
            </div>

            {/* 새 일기 작성 모달 */}
            {isWriting && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-3xl font-bold mb-6 text-purple-600">오늘의 감정</h2>

                  {/* 감정 선택 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">어떤 감정이신가요?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {EMOTIONS.map((emotion) => (
                        <button
                          key={emotion.id}
                          onClick={() => setSelectedEmotion(emotion.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedEmotion === emotion.id
                              ? 'border-purple-600 bg-purple-50 scale-105'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          style={{
                            backgroundColor: selectedEmotion === emotion.id ? `${emotion.color}20` : undefined,
                          }}
                        >
                          <div className="text-3xl mb-1">{emotion.emoji}</div>
                          <div className="text-xs font-medium">{emotion.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 날씨 선택 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">오늘 마음의 날씨는?</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {WEATHERS.map((weather) => (
                        <button
                          key={weather.id}
                          onClick={() => setSelectedWeather(weather.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedWeather === weather.id
                              ? 'border-purple-600 bg-purple-50 scale-105'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-3xl mb-1">{weather.emoji}</div>
                          <div className="text-xs font-medium">{weather.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 감정 강도 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">감정 강도: {intensity}/5</h3>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>약함</span>
                      <span>강함</span>
                    </div>
                  </div>

                  {/* 메모 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">오늘의 한마디 (선택)</h3>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="오늘 하루는 어땠나요?"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
                      rows={4}
                    />
                  </div>

                  {/* 버튼 */}
                  <div className="flex gap-3">
                    <button
                      onClick={saveEntry}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-bold transition-all duration-300"
                    >
                      💾 저장하기
                    </button>
                    <button
                      onClick={() => setIsWriting(false)}
                      className="px-6 py-4 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 font-bold transition-all duration-300"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 목록 보기 */}
            {viewMode === 'calendar' && (
              <div className="space-y-4">
                {entries.length === 0 ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/40">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-xl text-gray-600">아직 일기가 없어요</p>
                    <p className="text-gray-500">첫 번째 감정을 기록해보세요!</p>
                  </div>
                ) : (
                  entries.map((entry) => {
                    const emotion = EMOTIONS.find((e) => e.id === entry.emotion)!;
                    const weather = WEATHERS.find((w) => w.id === entry.weather)!;
                    return (
                      <div
                        key={entry.id}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-l-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                        style={{ borderLeftColor: entry.color }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-4xl">{emotion.emoji}</span>
                              <span className="text-3xl">{weather.emoji}</span>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{emotion.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(entry.date).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    weekday: 'short',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">강도:</span>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < entry.intensity ? 'text-yellow-400' : 'text-gray-300'}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                            {entry.note && (
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{entry.note}</p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-500 hover:text-red-700 text-2xl"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 통계 보기 */}
            {viewMode === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-3xl font-bold text-purple-600">{entries.length}</div>
                    <div className="text-gray-600">총 일기 수</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="text-3xl font-bold text-pink-600">{getAverageIntensity()}</div>
                    <div className="text-gray-600">평균 감정 강도</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl">
                    <div className="text-4xl mb-2">📅</div>
                    <div className="text-3xl font-bold text-indigo-600">
                      {entries.length > 0 ? Math.floor((Date.now() - new Date(entries[entries.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                    </div>
                    <div className="text-gray-600">기록 일수</div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">감정 분포</h3>
                  <div className="space-y-3">
                    {getEmotionStats().map(({ emotion, count }) => (
                      <div key={emotion.id} className="flex items-center gap-3">
                        <span className="text-3xl">{emotion.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{emotion.name}</span>
                            <span className="text-sm text-gray-500">{count}회</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(count / entries.length) * 100}%`,
                                backgroundColor: emotion.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🌈</div>
              <h3 className="text-3xl font-black mb-2 text-purple-600">환영합니다!</h3>
              <p className="text-gray-600">닉네임을 입력하고 감정 일기를 시작하세요</p>
              <p className="text-sm text-gray-500 mt-2">
                💾 서버에 자동 백업되어 언제 어디서나 볼 수 있어요
              </p>
            </div>

            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력 (2~20자)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-purple-400 focus:outline-none"
              maxLength={20}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />

            <button
              onClick={handleLogin}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
              시작하기
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </main>
  );
}
