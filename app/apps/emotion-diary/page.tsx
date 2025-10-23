'use client';

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';

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
    return <PremiumLayout theme="pink" showStars={true}><div className="h-screen"></div></PremiumLayout>;
  }

  return (
    <PremiumLayout theme="pink" showStars={true}>
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <div className="text-7xl sm:text-8xl mb-4 animate-bounce-slow drop-shadow-2xl">
            🌈💭✨
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 text-white drop-shadow-2xl">
            감정 일기
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-2 drop-shadow-lg">
            오늘의 감정을 색깔과 날씨로 표현해보세요
          </p>
          {user && (
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 flex-wrap">
              <PremiumCard className="px-4 sm:px-5 py-2 sm:py-3 bg-white/20 backdrop-blur-sm inline-flex items-center gap-2 [transform:translateZ(10px)]">
                <span className="text-xl sm:text-2xl">👤</span>
                <span className="text-white font-bold text-base sm:text-lg">{user.nickname}</span>
              </PremiumCard>
              <PremiumButton
                onClick={handleLogout}
                className="px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base">
                로그아웃
              </PremiumButton>
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
            <div className="flex gap-3 sm:gap-4 justify-center mb-8 flex-wrap">
              <PremiumButton
                onClick={() => setIsWriting(true)}
                size="lg"
                className="min-w-[140px] sm:min-w-[160px]"
              >
                <span className="text-xl mr-2">✍️</span>
                새 일기 쓰기
              </PremiumButton>
              <PremiumButton
                onClick={() => setViewMode('calendar')}
                size="lg"
                className={`min-w-[120px] sm:min-w-[140px] ${
                  viewMode === 'calendar'
                    ? ''
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-xl mr-2">📅</span>
                목록 보기
              </PremiumButton>
              <PremiumButton
                onClick={() => setViewMode('stats')}
                size="lg"
                className={`min-w-[120px] sm:min-w-[140px] ${
                  viewMode === 'stats'
                    ? ''
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-xl mr-2">📊</span>
                통계 보기
              </PremiumButton>
            </div>

            {/* 새 일기 작성 모달 */}
            {isWriting && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <PremiumCard gradient className="p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto [transform:translateZ(50px)]">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white drop-shadow-lg flex items-center gap-3">
                    <span className="text-4xl sm:text-5xl">✨</span>
                    오늘의 감정
                  </h2>

                  {/* 감정 선택 */}
                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-bold mb-3 text-white/90 drop-shadow-md">어떤 감정이신가요?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                      {EMOTIONS.map((emotion) => (
                        <div key={emotion.id} onClick={() => setSelectedEmotion(emotion.id)}>
                          <PremiumCard
                            hover
                            className={`cursor-pointer text-center ${
                              selectedEmotion === emotion.id
                                ? 'ring-4 ring-white/50'
                                : ''
                            } [transform:translateZ(10px)] hover:[transform:translateZ(20px)] min-h-[72px] sm:min-h-[80px] flex flex-col items-center justify-center`}
                            style={{
                              backgroundColor: selectedEmotion === emotion.id ? `${emotion.color}40` : 'rgba(255,255,255,0.9)',
                            }}
                          >
                            <div className="text-3xl sm:text-4xl mb-1">{emotion.emoji}</div>
                            <div className="text-xs sm:text-sm font-semibold text-gray-800">{emotion.name}</div>
                          </PremiumCard>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 날씨 선택 */}
                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-bold mb-3 text-white/90 drop-shadow-md">오늘 마음의 날씨는?</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                      {WEATHERS.map((weather) => (
                        <div key={weather.id} onClick={() => setSelectedWeather(weather.id)}>
                          <PremiumCard
                            hover
                            className={`cursor-pointer text-center ${
                              selectedWeather === weather.id
                                ? 'ring-4 ring-white/50 bg-white'
                                : 'bg-white/90'
                            } [transform:translateZ(10px)] hover:[transform:translateZ(20px)] min-h-[72px] sm:min-h-[80px] flex flex-col items-center justify-center`}
                          >
                            <div className="text-3xl sm:text-4xl mb-1">{weather.emoji}</div>
                            <div className="text-xs sm:text-sm font-semibold text-gray-800">{weather.name}</div>
                          </PremiumCard>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 감정 강도 */}
                  <PremiumCard className="mb-6 bg-white/90 [transform:translateZ(15px)]">
                    <h3 className="text-base sm:text-lg font-bold mb-3 text-gray-800">감정 강도: <span className="text-purple-600">{intensity}/5</span></h3>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                      <span>약함</span>
                      <span>강함</span>
                    </div>
                  </PremiumCard>

                  {/* 메모 */}
                  <PremiumCard className="mb-6 bg-white/90 [transform:translateZ(15px)]">
                    <h3 className="text-base sm:text-lg font-bold mb-3 text-gray-800">오늘의 한마디 <span className="text-gray-500 text-sm">(선택)</span></h3>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="오늘 하루는 어땠나요?"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none bg-white text-base leading-relaxed"
                      rows={4}
                    />
                  </PremiumCard>

                  {/* 버튼 */}
                  <div className="flex gap-3 sm:gap-4">
                    <PremiumButton
                      onClick={saveEntry}
                      fullWidth
                      size="lg"
                      className="flex-1"
                    >
                      <span className="text-xl mr-2">💾</span>
                      저장하기
                    </PremiumButton>
                    <PremiumButton
                      onClick={() => setIsWriting(false)}
                      size="lg"
                      className="px-6 bg-gray-600 hover:bg-gray-700"
                    >
                      취소
                    </PremiumButton>
                  </div>
                </PremiumCard>
              </div>
            )}

            {/* 목록 보기 */}
            {viewMode === 'calendar' && (
              <div className="space-y-4">
                {entries.length === 0 ? (
                  <PremiumCard gradient className="p-8 sm:p-12 text-center [transform:translateZ(20px)]">
                    <div className="text-6xl sm:text-7xl mb-4 animate-bounce-slow">📝</div>
                    <p className="text-xl sm:text-2xl text-white font-bold mb-2 drop-shadow-lg">아직 일기가 없어요</p>
                    <p className="text-white/80 drop-shadow-md">첫 번째 감정을 기록해보세요!</p>
                  </PremiumCard>
                ) : (
                  entries.map((entry) => {
                    const emotion = EMOTIONS.find((e) => e.id === entry.emotion)!;
                    const weather = WEATHERS.find((w) => w.id === entry.weather)!;
                    return (
                      <PremiumCard
                        key={entry.id}
                        hover
                        className="border-l-8 [transform:translateZ(15px)] hover:[transform:translateZ(25px)]"
                        style={{ borderLeftColor: entry.color }}
                      >
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <span className="text-4xl sm:text-5xl">{emotion.emoji}</span>
                              <span className="text-3xl sm:text-4xl">{weather.emoji}</span>
                              <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{emotion.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-500">
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
                              <span className="text-xs sm:text-sm text-gray-600 font-medium">강도:</span>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-lg sm:text-xl ${i < entry.intensity ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                            {entry.note && (
                              <PremiumCard className="bg-gray-50 mt-3 [transform:translateZ(5px)]">
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{entry.note}</p>
                              </PremiumCard>
                            )}
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-500 hover:text-red-700 text-2xl sm:text-3xl hover:scale-110 transition-transform flex-shrink-0"
                          >
                            🗑️
                          </button>
                        </div>
                      </PremiumCard>
                    );
                  })
                )}
              </div>
            )}

            {/* 통계 보기 */}
            {viewMode === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <PremiumCard hover gradient className="text-center [transform:translateZ(20px)] hover:[transform:translateZ(30px)]">
                    <div className="text-5xl sm:text-6xl mb-3 animate-bounce-slow">📊</div>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">{entries.length}</div>
                    <div className="text-white/90 drop-shadow-md font-medium">총 일기 수</div>
                  </PremiumCard>
                  <PremiumCard hover gradient className="text-center [transform:translateZ(20px)] hover:[transform:translateZ(30px)]">
                    <div className="text-5xl sm:text-6xl mb-3 animate-bounce-slow">⭐</div>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">{getAverageIntensity()}</div>
                    <div className="text-white/90 drop-shadow-md font-medium">평균 감정 강도</div>
                  </PremiumCard>
                  <PremiumCard hover gradient className="text-center [transform:translateZ(20px)] hover:[transform:translateZ(30px)]">
                    <div className="text-5xl sm:text-6xl mb-3 animate-bounce-slow">📅</div>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                      {entries.length > 0 ? Math.floor((Date.now() - new Date(entries[entries.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                    </div>
                    <div className="text-white/90 drop-shadow-md font-medium">기록 일수</div>
                  </PremiumCard>
                </div>

                <PremiumCard className="[transform:translateZ(15px)]">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl">📈</span>
                    감정 분포
                  </h3>
                  <div className="space-y-4">
                    {getEmotionStats().map(({ emotion, count }) => (
                      <PremiumCard key={emotion.id} hover className="bg-gray-50 [transform:translateZ(5px)] hover:[transform:translateZ(15px)]">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="text-4xl sm:text-5xl flex-shrink-0">{emotion.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-base sm:text-lg text-gray-800">{emotion.name}</span>
                              <span className="text-sm sm:text-base text-gray-600 font-semibold">{count}회</span>
                            </div>
                            <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
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
                      </PremiumCard>
                    ))}
                  </div>
                </PremiumCard>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <PremiumCard gradient className="p-8 max-w-md w-full [transform:translateZ(50px)]">
            <div className="text-center mb-6">
              <div className="text-7xl sm:text-8xl mb-4 animate-bounce-slow drop-shadow-2xl">🌈</div>
              <h3 className="text-3xl sm:text-4xl font-black mb-3 text-white drop-shadow-lg">환영합니다!</h3>
              <p className="text-white/90 mb-2 drop-shadow-md text-base sm:text-lg">닉네임을 입력하고 감정 일기를 시작하세요</p>
              <PremiumCard className="bg-white/20 backdrop-blur-sm mt-4 inline-block">
                <p className="text-sm sm:text-base text-white/90 font-medium">
                  💾 서버에 자동 백업되어 언제 어디서나 볼 수 있어요
                </p>
              </PremiumCard>
            </div>

            <PremiumCard className="bg-white/90 mb-4 [transform:translateZ(15px)]">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력 (2~20자)"
                className="w-full px-4 py-3 border-2 border-transparent rounded-xl focus:border-purple-400 focus:outline-none bg-transparent text-base"
                maxLength={20}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </PremiumCard>

            <PremiumButton
              onClick={handleLogin}
              fullWidth
              size="lg"
            >
              <span className="text-xl mr-2">🚀</span>
              시작하기
            </PremiumButton>
          </PremiumCard>
        </div>
      )}
    </PremiumLayout>
  );
}
