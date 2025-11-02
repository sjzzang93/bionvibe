"use client";

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

const CHALLENGES = {
  health: [
    { title: '물 2L 마시기', emoji: '💧', description: '하루 종일 물을 2리터 마셔보세요', difficulty: '쉬움' },
    { title: '만보 걷기', emoji: '🚶', description: '오늘 하루 10,000보를 걸어보세요', difficulty: '보통' },
    { title: '30분 운동', emoji: '💪', description: '어떤 운동이든 30분 이상 해보세요', difficulty: '보통' },
    { title: '야식 참기', emoji: '🚫', description: '저녁 8시 이후 음식 섭취 금지!', difficulty: '어려움' },
    { title: '채소 먼저 먹기', emoji: '🥗', description: '모든 식사에서 채소를 먼저 먹기', difficulty: '쉬움' },
    { title: '계단 이용하기', emoji: '🪜', description: '오늘은 엘리베이터 금지!', difficulty: '보통' },
    { title: '스트레칭 10분', emoji: '🧘', description: '아침, 점심, 저녁 각 10분씩', difficulty: '쉬움' },
    { title: '당 섭취 줄이기', emoji: '🍭', description: '오늘 하루 단 음식 먹지 않기', difficulty: '어려움' },
  ],
  productivity: [
    { title: '아침 6시 기상', emoji: '⏰', description: '알람 끄지 말고 바로 일어나기', difficulty: '어려움' },
    { title: '핸드폰 끄고 집중', emoji: '📵', description: '2시간 동안 핸드폰 없이 집중하기', difficulty: '보통' },
    { title: '독서 30분', emoji: '📚', description: '어떤 책이든 30분 이상 읽기', difficulty: '쉬움' },
    { title: '일기 쓰기', emoji: '✍️', description: '오늘 하루 일과와 감정 기록하기', difficulty: '쉬움' },
    { title: '할 일 목록 작성', emoji: '📝', description: '내일 할 일 미리 계획하기', difficulty: '쉬움' },
    { title: 'SNS 안 보기', emoji: '🙈', description: '오늘 하루 SNS 완전 차단', difficulty: '어려움' },
    { title: '명상 10분', emoji: '🧘‍♀️', description: '아침이나 저녁에 명상하기', difficulty: '보통' },
    { title: '새로운 것 배우기', emoji: '🎓', description: '30분 이상 새로운 지식 습득', difficulty: '보통' },
  ],
  social: [
    { title: '가족에게 전화', emoji: '📞', description: '부모님이나 가족에게 안부 전화', difficulty: '쉬움' },
    { title: '칭찬 3번 하기', emoji: '👏', description: '다른 사람 진심으로 칭찬하기', difficulty: '쉬움' },
    { title: '감사 표현하기', emoji: '🙏', description: '누군가에게 감사 표현하기', difficulty: '쉬움' },
    { title: '먼저 인사하기', emoji: '👋', description: '모든 사람에게 먼저 인사하기', difficulty: '보통' },
    { title: '불평 안 하기', emoji: '😇', description: '하루 종일 불평 한 마디도 안 하기', difficulty: '어려움' },
    { title: '경청하기', emoji: '👂', description: '대화할 때 진심으로 경청하기', difficulty: '보통' },
  ],
  creative: [
    { title: '그림 그리기', emoji: '🎨', description: '15분 이상 자유롭게 그리기', difficulty: '쉬움' },
    { title: '사진 10장 찍기', emoji: '📸', description: '의미 있는 순간 포착하기', difficulty: '쉬움' },
    { title: '시 한 편 쓰기', emoji: '✒️', description: '짧은 시나 글 작성하기', difficulty: '보통' },
    { title: '요리 도전', emoji: '🍳', description: '새로운 레시피로 요리하기', difficulty: '보통' },
    { title: '악기 연습', emoji: '🎸', description: '30분 이상 악기 연습하기', difficulty: '보통' },
  ],
  lifestyle: [
    { title: '방 정리하기', emoji: '🧹', description: '방 구석구석 깨끗이 청소', difficulty: '보통' },
    { title: '옷장 정리', emoji: '👔', description: '안 입는 옷 골라내기', difficulty: '보통' },
    { title: '식물 돌보기', emoji: '🌱', description: '집안 식물에 물주고 관리', difficulty: '쉬움' },
    { title: '아침 루틴 만들기', emoji: '☀️', description: '기상 후 30분 루틴 실천', difficulty: '보통' },
    { title: '디지털 디톡스', emoji: '📱', description: '잠들기 1시간 전 전자기기 금지', difficulty: '어려움' },
  ],
};

function getDailyChallenge() {
  const today = new Date().toDateString();
  const categories = Object.keys(CHALLENGES);
  const categoryIndex = new Date(today).getDate() % categories.length;
  const category = categories[categoryIndex];
  const challengeList = CHALLENGES[category as keyof typeof CHALLENGES];
  const challengeIndex = Math.floor(new Date(today).getTime() / 1000 / 60 / 60 / 24) % challengeList.length;
  return { ...challengeList[challengeIndex], category };
}

export default function DailyChallenge() {
  const [todayChallenge, setTodayChallenge] = useState(getDailyChallenge());
  const [isCompleted, setIsCompleted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('daily_challenge_history');
    if (saved) {
      const data = JSON.parse(saved);
      setHistory(data.history || []);
      setStreak(data.streak || 0);

      const today = new Date().toDateString();
      const lastCompleted = data.history?.[0]?.date;
      if (lastCompleted === today) {
        setIsCompleted(true);
      }
    }
  }, []);

  const completeChallenge = () => {
    const today = new Date().toDateString();
    const newHistory = [
      { date: today, challenge: todayChallenge.title, category: todayChallenge.category },
      ...history
    ].slice(0, 30); // 최근 30일만 저장

    // 연속 일수 계산
    let newStreak = 1;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (history[0]?.date === yesterdayStr) {
      newStreak = streak + 1;
    }

    setIsCompleted(true);
    setHistory(newHistory);
    setStreak(newStreak);

    localStorage.setItem('daily_challenge_history', JSON.stringify({
      history: newHistory,
      streak: newStreak
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '쉬움': return 'from-green-500 to-emerald-500';
      case '보통': return 'from-yellow-500 to-orange-500';
      case '어려움': return 'from-red-500 to-pink-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'health': return '💪';
      case 'productivity': return '🎯';
      case 'social': return '👥';
      case 'creative': return '🎨';
      case 'lifestyle': return '🏠';
      default: return '⭐';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'health': return '건강';
      case 'productivity': return '생산성';
      case 'social': return '대인관계';
      case 'creative': return '창의성';
      case 'lifestyle': return '라이프스타일';
      default: return '기타';
    }
  };

  return (
    <PremiumLayout theme="green">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
            🎯 오늘의 챌린지
          </h1>
          <p className="text-xl text-white/80">매일 새로운 미션으로 성장하세요</p>
        </div>

        {/* 오늘의 챌린지 카드 */}
        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4 animate-bounce-slow">{todayChallenge.emoji}</div>
            <div className="inline-block px-4 py-2 bg-white/20 rounded-full mb-4">
              <span className="text-white font-bold">
                {getCategoryEmoji(todayChallenge.category)} {getCategoryName(todayChallenge.category)}
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">{todayChallenge.title}</h2>
            <p className="text-xl text-white/80 mb-4">{todayChallenge.description}</p>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${getDifficultyColor(todayChallenge.difficulty)} text-white font-bold`}>
              난이도: {todayChallenge.difficulty}
            </div>
          </div>

          <PremiumButton
            onClick={completeChallenge}
            disabled={isCompleted}
            variant={isCompleted ? "success" : "primary"}
            size="lg"
            icon={isCompleted ? "✅" : "🎯"}
            fullWidth
          >
            {isCompleted ? '오늘의 챌린지 완료!' : '챌린지 완료하기'}
          </PremiumButton>
        </PremiumCard>

        {/* 통계 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <PremiumCard hover>
            <div className="text-center">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-white font-bold text-lg mb-2">연속 달성</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                {streak}일
              </div>
            </div>
          </PremiumCard>

          <PremiumCard hover>
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-white font-bold text-lg mb-2">총 달성</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                {history.length}일
              </div>
            </div>
          </PremiumCard>

          <PremiumCard hover>
            <div className="text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-white font-bold text-lg mb-2">달성률</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {history.length > 0 ? Math.round((history.length / 30) * 100) : 0}%
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* 히스토리 */}
        {history.length > 0 && (
          <PremiumCard hover className="mb-8">
            <h3 className="text-white text-2xl font-bold mb-6 text-center">📊 최근 활동</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/20 transition-all"
                >
                  <div>
                    <div className="text-white font-bold mb-1">
                      {getCategoryEmoji(item.category)} {item.challenge}
                    </div>
                    <div className="text-white/70 text-sm">{item.date}</div>
                  </div>
                  <div className="text-2xl">✅</div>
                </div>
              ))}
            </div>
          </PremiumCard>
        )}

        {/* 팁 */}
        <PremiumCard hover>
          <h4 className="text-white font-bold text-xl mb-4 text-center">💡 챌린지 성공 팁</h4>
          <div className="space-y-3 text-white/80 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <p>아침에 일어나자마자 오늘의 챌린지를 확인하세요</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <p>알람을 설정해서 잊지 않고 실천하세요</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📸</span>
              <p>인증샷을 찍어서 기록하면 더 재미있어요</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔥</span>
              <p>연속 달성 기록을 늘려보세요!</p>
            </div>
          </div>
        </PremiumCard>

        {/* Related Apps */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="daily-challenge" className="mt-8" />
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

        @keyframes bounce-slow {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
