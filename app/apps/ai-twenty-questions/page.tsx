"use client";

import { useState, useEffect, useRef } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

type GameMode = 'select' | 'ai-asks' | 'user-asks';
type Difficulty = 'easy' | 'medium' | 'hard';
type Category = 'animal' | 'food' | 'object' | 'job' | 'place' | 'celebrity' | 'random';

interface Question {
  text: string;
  answer: 'yes' | 'no' | 'maybe';
  timestamp: number;
}

interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  avgQuestions: number;
  bestScore: number;
}

// 카테고리별 단어 데이터베이스
const WORD_DATABASE = {
  animal: {
    easy: ['강아지', '고양이', '토끼', '햄스터', '금붕어', '앵무새', '거북이', '닭', '오리', '소'],
    medium: ['판다', '코알라', '캥거루', '펭귄', '돌고래', '사슴', '여우', '다람쥐', '올빼미', '독수리'],
    hard: ['카멜레온', '플라밍고', '미어캣', '왈라비', '프레리독', '카피바라', '슬로우로리스', '오카피', '타피르', '쿼카']
  },
  food: {
    easy: ['피자', '햄버거', '치킨', '라면', '김밥', '떡볶이', '짜장면', '짬뽕', '탕수육', '돈가스'],
    medium: ['리조또', '파스타', '스테이크', '초밥', '우동', '쌀국수', '팟타이', '카레', '피쉬앤칩스', '타코'],
    hard: ['부야베스', '라따뚜이', '크렘브륄레', '티라미수', '퐁듀', '파에야', '카르보나라', '리조또', '가스파초', '비스크']
  },
  object: {
    easy: ['핸드폰', '노트북', '시계', '안경', '가방', '우산', '지갑', '열쇠', '책', '연필'],
    medium: ['카메라', '헤드폰', '스피커', '태블릿', '무선이어폰', '전자책', '스마트워치', '드론', 'VR기기', '게임기'],
    hard: ['3D프린터', '레이저커터', '오실로스코프', '분광기', '현미경', '망원경', '세그웨이', '전동킥보드', '빔프로젝터', '믹서기']
  },
  job: {
    easy: ['선생님', '의사', '간호사', '경찰관', '소방관', '요리사', '운전기사', '가수', '배우', '운동선수'],
    medium: ['변호사', '판사', '검사', '건축가', '디자이너', '프로그래머', '마케터', '기자', '작가', '번역가'],
    hard: ['큐레이터', '소믈리에', '바리스타', '파티시에', '플로리스트', '조향사', '사운드디자이너', '컬러리스트', '푸드스타일리스트', '웹툰작가']
  },
  place: {
    easy: ['학교', '병원', '은행', '우체국', '도서관', '공원', '카페', '식당', '마트', '편의점'],
    medium: ['미술관', '박물관', '전시관', '공연장', '영화관', '수족관', '동물원', '놀이공원', '워터파크', '스키장'],
    hard: ['천문대', '식물원', '온실', '전망대', '등대', '수도원', '성당', '사찰', '신사', '궁전']
  },
  celebrity: {
    easy: ['BTS', '블랙핑크', '아이유', '손흥민', '박나래', '유재석', '강호동', '김연아', '이영애', '송강호'],
    medium: ['뉴진스', '르세라핌', '세븐틴', '트와이스', '박서준', '박보검', '송혜교', '전지현', '현빈', '손예진'],
    hard: ['기안84', '이말년', '침착맨', '주호민', '윤서인', '양세찬', '조세호', '김민경', '장도연', '이용진']
  }
};

export default function AITwentyQuestions() {
  const [gameMode, setGameMode] = useState<GameMode>('select');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [category, setCategory] = useState<Category>('random');
  const [currentWord, setCurrentWord] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionsLeft, setQuestionsLeft] = useState(20);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [userGuess, setUserGuess] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    avgQuestions: 0,
    bestScore: 20
  });
  const [isThinking, setIsThinking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 통계 로드
  useEffect(() => {
    const saved = localStorage.getItem('ai_twenty_questions_stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // 게임 시작
  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setQuestions([]);
    setQuestionsLeft(20);
    setHintsUsed(0);
    setGameStatus('playing');
    setShowConfetti(false);
    setUserGuess('');

    if (mode === 'ai-asks') {
      // AI가 문제를 내는 모드
      const word = selectRandomWord();
      setCurrentWord(word);
    }
  };

  // 랜덤 단어 선택
  const selectRandomWord = (): string => {
    let selectedCategory = category;
    if (category === 'random') {
      const categories: Category[] = ['animal', 'food', 'object', 'job', 'place', 'celebrity'];
      selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    }

    const words = WORD_DATABASE[selectedCategory as keyof typeof WORD_DATABASE][difficulty];
    return words[Math.floor(Math.random() * words.length)];
  };

  // 질문 제출 (사용자가 AI에게 질문)
  const submitQuestion = async (answer?: 'yes' | 'no' | 'maybe') => {
    if (!currentQuestion.trim() && !answer) return;

    setIsThinking(true);

    // 실제로는 AI API를 호출해야 하지만, 여기서는 간단한 로직으로 구현
    setTimeout(() => {
      const newQuestion: Question = {
        text: currentQuestion,
        answer: answer || (Math.random() > 0.5 ? 'yes' : 'no'),
        timestamp: Date.now()
      };

      setQuestions([...questions, newQuestion]);
      setQuestionsLeft(questionsLeft - 1);
      setCurrentQuestion('');
      setIsThinking(false);

      if (soundEnabled) {
        playSound('pop');
      }

      // 질문이 다 떨어지면 패배
      if (questionsLeft <= 1) {
        setGameStatus('lost');
        updateStats(false, 20);
        if (soundEnabled) playSound('lose');
      }
    }, 1000 + Math.random() * 1000);
  };

  // 정답 맞추기 시도
  const submitGuess = () => {
    if (!userGuess.trim()) return;

    const isCorrect = userGuess.trim().toLowerCase() === currentWord.toLowerCase();

    if (isCorrect) {
      setGameStatus('won');
      setShowConfetti(true);
      updateStats(true, 20 - questionsLeft);
      if (soundEnabled) playSound('win');
    } else {
      setQuestionsLeft(questionsLeft - 1);
      if (questionsLeft <= 1) {
        setGameStatus('lost');
        updateStats(false, 20);
        if (soundEnabled) playSound('lose');
      } else {
        if (soundEnabled) playSound('wrong');
      }
    }
    setUserGuess('');
  };

  // 힌트 사용
  const useHint = () => {
    if (hintsUsed >= 3) return;

    const hints = [
      `첫 글자는 "${currentWord[0]}" 입니다`,
      `총 ${currentWord.length}글자입니다`,
      `마지막 글자는 "${currentWord[currentWord.length - 1]}" 입니다`
    ];

    alert(hints[hintsUsed]);
    setHintsUsed(hintsUsed + 1);
    setQuestionsLeft(questionsLeft - 1);

    if (soundEnabled) playSound('hint');
  };

  // 통계 업데이트
  const updateStats = (won: boolean, questionsUsed: number) => {
    const newStats = {
      totalGames: stats.totalGames + 1,
      wins: stats.wins + (won ? 1 : 0),
      losses: stats.losses + (won ? 0 : 1),
      avgQuestions: ((stats.avgQuestions * stats.totalGames) + questionsUsed) / (stats.totalGames + 1),
      bestScore: won && questionsUsed < stats.bestScore ? questionsUsed : stats.bestScore
    };

    setStats(newStats);
    localStorage.setItem('ai_twenty_questions_stats', JSON.stringify(newStats));
  };

  // 사운드 재생
  const playSound = (type: 'pop' | 'win' | 'lose' | 'hint' | 'wrong') => {
    // 실제 구현시에는 오디오 파일을 사용
    const frequencies: { [key: string]: number } = {
      pop: 800,
      win: 1200,
      lose: 200,
      hint: 600,
      wrong: 400
    };

    if (typeof window !== 'undefined' && soundEnabled) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequencies[type];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        console.error('Audio playback failed:', e);
      }
    }
  };

  // 모드 선택 화면
  if (gameMode === 'select') {
    return (
      <PremiumLayout theme="purple">
        
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
              🎯 AI 스무고개
            </h1>
            <p className="text-xl text-white/80">AI와 함께하는 재미있는 추리 게임!</p>
          </div>

          {/* 설정 */}
          <PremiumCard hover gradient className="mb-8 animate-slideUp">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">⚙️ 게임 설정</h2>

            {/* 난이도 선택 */}
            <div className="mb-6">
              <label className="text-white font-bold mb-3 block">난이도 선택</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'easy', label: '쉬움', emoji: '😊', color: 'from-green-500 to-emerald-500' },
                  { value: 'medium', label: '보통', emoji: '😐', color: 'from-yellow-500 to-orange-500' },
                  { value: 'hard', label: '어려움', emoji: '😰', color: 'from-red-500 to-pink-500' }
                ].map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setDifficulty(diff.value as Difficulty)}
                    className={`p-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 ${
                      difficulty === diff.value
                        ? `bg-gradient-to-r ${diff.color} shadow-lg scale-105`
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-3xl mb-2">{diff.emoji}</div>
                    <div>{diff.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 카테고리 선택 */}
            <div className="mb-6">
              <label className="text-white font-bold mb-3 block">카테고리 선택</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { value: 'random', label: '랜덤', emoji: '🎲' },
                  { value: 'animal', label: '동물', emoji: '🐶' },
                  { value: 'food', label: '음식', emoji: '🍕' },
                  { value: 'object', label: '사물', emoji: '📱' },
                  { value: 'job', label: '직업', emoji: '👨‍💼' },
                  { value: 'place', label: '장소', emoji: '🏢' },
                  { value: 'celebrity', label: '유명인', emoji: '⭐' }
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value as Category)}
                    className={`p-3 rounded-lg text-white font-bold transition-all transform hover:scale-105 ${
                      category === cat.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-105'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className="text-xs">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 사운드 설정 */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-white font-bold">사운드 효과</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
                  soundEnabled
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-white/10 text-white/50'
                }`}
              >
                {soundEnabled ? '🔊 켜짐' : '🔇 꺼짐'}
              </button>
            </div>
          </PremiumCard>

          {/* 모드 선택 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <PremiumCard hover gradient className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-white text-2xl font-bold mb-3">AI가 문제 내기</h3>
                <p className="text-white/80 mb-6">
                  AI가 생각한 단어를 20번의 질문으로 맞춰보세요!
                </p>
              </div>
              <PremiumButton
                onClick={() => startGame('ai-asks')}
                variant="primary"
                size="lg"
                icon="🎮"
                fullWidth
              >
                게임 시작
              </PremiumButton>
            </PremiumCard>

            <PremiumCard hover gradient className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-white text-2xl font-bold mb-3">내가 문제 내기</h3>
                <p className="text-white/80 mb-6">
                  당신이 생각한 단어를 AI가 맞춰봅니다!
                </p>
              </div>
              <PremiumButton
                onClick={() => startGame('user-asks')}
                variant="secondary"
                size="lg"
                icon="🎮"
                fullWidth
              >
                게임 시작
              </PremiumButton>
            </PremiumCard>
          </div>

          {/* 통계 */}
          <PremiumCard hover className="mb-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-white text-2xl font-bold mb-6 text-center">📊 나의 전적</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-white/70 text-sm mb-1">총 게임</div>
                <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-white/70 text-sm mb-1">승리</div>
                <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💔</div>
                <div className="text-white/70 text-sm mb-1">패배</div>
                <div className="text-2xl font-bold text-red-400">{stats.losses}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-white/70 text-sm mb-1">최고 기록</div>
                <div className="text-2xl font-bold text-yellow-400">{stats.bestScore}문제</div>
              </div>
            </div>
            {stats.totalGames > 0 && (
              <div className="mt-4 text-center">
                <div className="text-white/70 text-sm">승률</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {Math.round((stats.wins / stats.totalGames) * 100)}%
                </div>
              </div>
            )}
          </PremiumCard>

          {/* Related Apps */}
          <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <RelatedApps currentAppSlug="ai-twenty-questions" />
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
            animation: slideUp 0.8s ease-out forwards;
          }
        `}</style>
      </PremiumLayout>
    );
  }

  // AI가 문제 내는 게임 화면
  if (gameMode === 'ai-asks') {
    return (
      <PremiumLayout theme="purple">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
              🤖 AI가 문제를 냈어요!
            </h1>
            <p className="text-lg text-white/80">질문을 통해 정답을 맞춰보세요</p>
          </div>

          {/* 게임 상태 표시 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <PremiumCard>
              <div className="text-center">
                <div className="text-2xl mb-2">❓</div>
                <div className="text-white/70 text-sm">남은 질문</div>
                <div className="text-3xl font-bold text-white">{questionsLeft}</div>
              </div>
            </PremiumCard>

            <PremiumCard>
              <div className="text-center">
                <div className="text-2xl mb-2">💡</div>
                <div className="text-white/70 text-sm">남은 힌트</div>
                <div className="text-3xl font-bold text-yellow-400">{3 - hintsUsed}</div>
              </div>
            </PremiumCard>

            <PremiumCard>
              <div className="text-center">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-white/70 text-sm">질문 횟수</div>
                <div className="text-3xl font-bold text-blue-400">{questions.length}</div>
              </div>
            </PremiumCard>
          </div>

          {/* 게임 종료 화면 */}
          {gameStatus !== 'playing' && (
            <PremiumCard hover gradient className="mb-8 animate-scaleIn">
              <div className="text-center">
                {gameStatus === 'won' ? (
                  <>
                    <div className="text-8xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-4xl font-bold text-white mb-3">정답입니다!</h2>
                    <p className="text-2xl text-white/90 mb-4">정답은 "{currentWord}" 였습니다!</p>
                    <p className="text-lg text-white/70 mb-6">
                      {20 - questionsLeft}번의 질문만에 맞추셨네요! 🎊
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-8xl mb-4">😢</div>
                    <h2 className="text-4xl font-bold text-white mb-3">아쉽습니다!</h2>
                    <p className="text-2xl text-white/90 mb-4">정답은 "{currentWord}" 였습니다</p>
                    <p className="text-lg text-white/70 mb-6">다음에 다시 도전해보세요!</p>
                  </>
                )}

                <div className="flex gap-4 justify-center">
                  <PremiumButton
                    onClick={() => startGame('ai-asks')}
                    variant="primary"
                    size="lg"
                    icon="🔄"
                  >
                    다시 하기
                  </PremiumButton>
                  <PremiumButton
                    onClick={() => setGameMode('select')}
                    variant="secondary"
                    size="lg"
                    icon="🏠"
                  >
                    메인으로
                  </PremiumButton>
                </div>
              </div>
            </PremiumCard>
          )}

          {/* 게임 중 화면 */}
          {gameStatus === 'playing' && (
            <>
              {/* 질문 입력 */}
              <PremiumCard hover gradient className="mb-8">
                <h3 className="text-white text-xl font-bold mb-4 text-center">💬 질문하기</h3>
                <textarea
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="예: 동물인가요? 먹을 수 있나요? 집에 있나요?"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border-2 border-white/20 focus:border-white/40 outline-none mb-4 resize-none"
                  rows={3}
                  disabled={isThinking}
                />
                <PremiumButton
                  onClick={() => submitQuestion()}
                  variant="primary"
                  size="lg"
                  icon={isThinking ? "⏳" : "❓"}
                  fullWidth
                  disabled={!currentQuestion.trim() || isThinking}
                >
                  {isThinking ? 'AI가 생각 중...' : '질문하기'}
                </PremiumButton>
              </PremiumCard>

              {/* 정답 맞추기 */}
              <PremiumCard hover gradient className="mb-8">
                <h3 className="text-white text-xl font-bold mb-4 text-center">🎯 정답 맞추기</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitGuess()}
                    placeholder="정답을 입력하세요"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border-2 border-white/20 focus:border-white/40 outline-none"
                  />
                  <PremiumButton
                    onClick={submitGuess}
                    variant="success"
                    size="lg"
                    icon="✅"
                    disabled={!userGuess.trim()}
                  >
                    제출
                  </PremiumButton>
                </div>
              </PremiumCard>

              {/* 힌트 버튼 */}
              <div className="flex justify-center mb-8">
                <PremiumButton
                  onClick={useHint}
                  variant="secondary"
                  size="lg"
                  icon="💡"
                  disabled={hintsUsed >= 3}
                >
                  힌트 사용하기 ({3 - hintsUsed}개 남음)
                </PremiumButton>
              </div>

              {/* 질문 히스토리 */}
              {questions.length > 0 && (
                <PremiumCard hover className="mb-8">
                  <h3 className="text-white text-xl font-bold mb-4 text-center">📜 질문 기록</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all animate-slideIn"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-white font-bold mb-1">
                              Q{index + 1}. {q.text}
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                            q.answer === 'yes' ? 'bg-green-500/30 text-green-300' :
                            q.answer === 'no' ? 'bg-red-500/30 text-red-300' :
                            'bg-yellow-500/30 text-yellow-300'
                          }`}>
                            {q.answer === 'yes' ? '✅ 예' : q.answer === 'no' ? '❌ 아니오' : '🤷 애매해요'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              )}
            </>
          )}

          {/* 뒤로가기 버튼 */}
          {gameStatus === 'playing' && (
            <div className="flex justify-center">
              <PremiumButton
                onClick={() => setGameMode('select')}
                variant="secondary"
                size="md"
                icon="◀️"
              >
                포기하고 돌아가기
              </PremiumButton>
            </div>
          )}
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  background: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)]
                }}
              />
            ))}
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes confetti-fall {
            to {
              transform: translateY(100vh) rotate(360deg);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }

          .animate-slideIn {
            animation: slideIn 0.5s ease-out forwards;
          }

          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out forwards;
          }

          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            top: -10px;
            opacity: 0.8;
            animation: confetti-fall 3s linear forwards;
          }
        `}</style>
      </PremiumLayout>
    );
  }

  // 사용자가 문제 내는 게임 화면
  return (
    <PremiumLayout theme="purple">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">👤 내가 문제 내기</h1>
          <p className="text-white/80 mb-8">준비 중입니다...</p>
          <PremiumButton
            onClick={() => setGameMode('select')}
            variant="primary"
            size="lg"
            icon="🏠"
          >
            메인으로 돌아가기
          </PremiumButton>
        </div>
      </div>
    </PremiumLayout>
  );
}
