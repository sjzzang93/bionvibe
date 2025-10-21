"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  password: string;
}

interface Habit {
  id: string;
  name: string;
  goal: 21 | 66 | 100;
  startDate: string;
  checkedDates: string[];
  category: string;
}

const HABIT_TEMPLATES = {
  health: [
    '매일 2L 물 마시기', '아침 공복 물 한 잔', '하루 만보 걷기', 
    '30분 운동하기', '계단 이용하기', '스트레칭 10분',
    '채소 먼저 먹기', '간식 안 먹기', '야식 끊기',
    '비타민 챙겨먹기', '금연', '금주'
  ],
  productivity: [
    '아침 6시 기상', '할 일 목록 작성', '집중 시간 2시간',
    '독서 30분', '영어 공부 1시간', '일기 쓰기',
    '명상 10분', '핸드폰 사용 줄이기', 'SNS 안 보기',
    '뉴스 읽기', '새로운 것 배우기'
  ],
  money: [
    '커피값 아끼기', '배달음식 안 시키기', '가계부 쓰기',
    '충동구매 안 하기', '하루 만원 저축', '소비 줄이기',
    '영수증 모으기', '고정지출 체크'
  ],
  relationships: [
    '가족에게 전화하기', '감사 표현하기', '칭찬하기',
    '먼저 인사하기', '웃으며 대화하기', '경청하기'
  ],
  mental: [
    '긍정적 생각하기', '감사일기 쓰기', '불평 안 하기',
    '명상 하기', '스트레스 관리', '충분한 수면'
  ]
};

const GOAL_INFO = {
  21: {
    name: '21일 챌린지',
    description: '새로운 습관의 시작 단계',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    facts: '21일이면 뇌가 새로운 패턴을 인식하기 시작합니다'
  },
  66: {
    name: '66일 챌린지',
    description: '습관이 자동화되는 단계',
    color: 'purple',
    gradient: 'from-purple-500 to-blue-500',
    facts: '평균 66일이면 습관이 자동화됩니다 (연구 결과)'
  },
  100: {
    name: '100일 챌린지',
    description: '완전히 몸에 배는 단계',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    facts: '100일이면 습관이 완전히 정착되어 평생 유지됩니다'
  }
};

export default function HabitTrackerPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = sessionStorage.getItem('habit_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId || !password) {
      setError('아이디와 비밀번호를 입력하세요');
      return;
    }

    const users = JSON.parse(localStorage.getItem('habit_users') || '{}');

    if (isLoginMode) {
      // 로그인
      if (users[userId] && users[userId].password === password) {
        sessionStorage.setItem('habit_user', userId);
        setCurrentUser(userId);
      } else {
        setError('아이디 또는 비밀번호가 틀렸습니다');
      }
    } else {
      // 회원가입
      if (users[userId]) {
        setError('이미 존재하는 아이디입니다');
      } else {
        users[userId] = { password };
        localStorage.setItem('habit_users', JSON.stringify(users));
        sessionStorage.setItem('habit_user', userId);
        setCurrentUser(userId);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('habit_user');
    setCurrentUser(null);
    setUserId('');
    setPassword('');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 dark:from-teal-500 dark:via-green-500 dark:to-emerald-600 flex items-center justify-center px-4 transition-colors">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border-2 border-white/30">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-white mb-2">습관 트래커</h1>
            <p className="text-white/80">{isLoginMode ? '로그인' : '회원가입'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white font-bold mb-2 block">아이디</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border-2 border-white/30 focus:border-white focus:outline-none"
                placeholder="아이디 입력"
                style={{ fontSize: '16px', minHeight: '48px' }}
              />
            </div>

            <div>
              <label className="text-white font-bold mb-2 block">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border-2 border-white/30 focus:border-white focus:outline-none"
                placeholder="비밀번호 입력"
                style={{ fontSize: '16px', minHeight: '48px' }}
              />
            </div>

            {error && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-white text-green-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-all"
              style={{ minHeight: '48px' }}
            >
              {isLoginMode ? '로그인' : '회원가입'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
              className="w-full bg-white/20 text-white font-bold py-3 rounded-lg hover:bg-white/30 transition-all"
              style={{ minHeight: '48px' }}
            >
              {isLoginMode ? '회원가입 하기' : '로그인 하기'}
            </button>
          </form>

          {/* 돌아가기 버튼 */}
          <div className="text-center mt-6">
            <Link href="/" className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300">
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <HabitTracker userId={currentUser} onLogout={handleLogout} />;
}

function HabitTracker({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<21 | 66 | 100>(21);
  const [selectedCategory, setSelectedCategory] = useState('health');
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`habits_${userId}`);
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, [userId]);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem(`habits_${userId}`, JSON.stringify(newHabits));
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      goal: selectedGoal,
      startDate: new Date().toISOString().split('T')[0],
      checkedDates: [],
      category: selectedCategory,
    };

    saveHabits([...habits, newHabit]);
    setNewHabitName('');
    setShowAddForm(false);
    setShowTemplates(false);
  };

  const toggleCheck = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = habits.map((habit) => {
      if (habit.id === habitId) {
        const checkDate = habit.checkedDates || [];
        if (checkDate.includes(today)) {
          return { ...habit, checkedDates: checkDate.filter((d) => d !== today) };
        } else {
          return { ...habit, checkedDates: [...checkDate, today] };
        }
      }
      return habit;
    });
    saveHabits(updated);
  };

  const deleteHabit = (habitId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      saveHabits(habits.filter((h) => h.id !== habitId));
    }
  };

  const getProgress = (habit: Habit) => {
    const checked = habit.checkedDates?.length || 0;
    return Math.round((checked / habit.goal) * 100);
  };

  const getStreak = (habit: Habit) => {
    const dates = [...(habit.checkedDates || [])].sort().reverse();
    let streak = 0;
    const today = new Date();

    for (let i = 0; i <= dates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (dates.includes(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const isTodayChecked = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.checkedDates?.includes(today) || false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-green-500 to-emerald-600 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">
              🎯 습관 트래커
            </h1>
            <p className="text-white/90">👤 {userId}님의 습관 관리</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-bold transition-all"
            style={{ minHeight: '48px' }}
          >
            로그아웃
          </button>
        </div>

        {/* 습관 추가 버튼 */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-4 rounded-2xl mb-6 flex items-center justify-center gap-2 transition-all"
          >
            <span className="text-2xl">+</span>
            <span>새 습관 추가</span>
          </button>
        )}

        {/* 습관 추가 폼 */}
        {showAddForm && (
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">새 습관 추가</h3>

            <div className="space-y-4">
              <div>
                <label className="text-white font-bold mb-2 block">습관 이름</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-black"
                  placeholder="예: 매일 운동하기"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label className="text-white font-bold mb-2 block">목표 기간</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(GOAL_INFO).map(([days, info]) => (
                    <button
                      key={days}
                      onClick={() => setSelectedGoal(Number(days) as 21 | 66 | 100)}
                      className={`p-4 rounded-xl font-bold transition-all ${
                        selectedGoal === Number(days)
                          ? `bg-gradient-to-r ${info.gradient} text-white`
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {days}일
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white font-bold mb-2 block">카테고리</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-black"
                  style={{ fontSize: '16px' }}
                >
                  <option value="health">건강</option>
                  <option value="productivity">생산성</option>
                  <option value="money">금전</option>
                  <option value="relationships">관계</option>
                  <option value="mental">정신</option>
                </select>
              </div>

              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                💡 템플릿에서 선택하기
              </button>

              {showTemplates && (
                <div className="bg-white/10 rounded-xl p-4 max-h-60 overflow-y-auto">
                  {HABIT_TEMPLATES[selectedCategory as keyof typeof HABIT_TEMPLATES].map((template) => (
                    <button
                      key={template}
                      onClick={() => {
                        setNewHabitName(template);
                        setShowTemplates(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg mb-1"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={addHabit}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewHabitName('');
                    setShowTemplates(false);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 습관 목록 */}
        {habits.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-white text-xl">아직 등록된 습관이 없습니다</p>
            <p className="text-white/70 mt-2">위의 버튼을 눌러 새 습관을 추가하세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => {
              const progress = getProgress(habit);
              const streak = getStreak(habit);
              const isChecked = isTodayChecked(habit);
              const goalInfo = GOAL_INFO[habit.goal];

              return (
                <div
                  key={habit.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 ${
                    isChecked ? 'border-green-400' : 'border-white/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{habit.name}</h3>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-300 hover:text-red-100 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className={`bg-gradient-to-r ${goalInfo.gradient} text-white text-center py-2 rounded-lg mb-4`}>
                    {goalInfo.name}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-white mb-2">
                      <span>진행률</span>
                      <span className="font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${goalInfo.gradient} h-3 rounded-full transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-white/70 text-sm mt-1">
                      {habit.checkedDates?.length || 0} / {habit.goal}일
                    </p>
                  </div>

                  <div className="flex justify-between text-white mb-4">
                    <div>
                      <p className="text-sm text-white/70">연속 일수</p>
                      <p className="text-2xl font-bold">🔥 {streak}일</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">완료율</p>
                      <p className="text-2xl font-bold">{progress}%</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCheck(habit.id)}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      isChecked
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-white hover:bg-gray-100 text-green-600'
                    }`}
                  >
                    {isChecked ? '✅ 오늘 완료!' : '☐ 오늘 체크하기'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

