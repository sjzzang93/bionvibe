"use client";

import { useState, useEffect } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

const CHALLENGES = {
  health: [
    { title: '팔굽혀펴기 50개', emoji: '💪', description: '한 번에 또는 나눠서 총 50개 완성하기', difficulty: '보통' },
    { title: '스쿼트 100개', emoji: '🦵', description: '올바른 자세로 100개 도전! 10개씩 나눠도 OK', difficulty: '보통' },
    { title: '플랭크 3분', emoji: '⏱️', description: '1분씩 3세트 또는 한 번에 3분 버티기', difficulty: '어려움' },
    { title: '버피 30개', emoji: '🔥', description: '전신 운동의 끝판왕! 30개 완성하기', difficulty: '어려움' },
    { title: '계단 오르기 10층', emoji: '🪜', description: '엘리베이터 없이 계단으로 10층 오르기', difficulty: '보통' },
    { title: '점프 스쿼트 50개', emoji: '⚡', description: '폭발적인 점프와 함께 50개 완성', difficulty: '어려움' },
    { title: '런지 50개 (양쪽)', emoji: '🏃', description: '왼쪽 25개, 오른쪽 25개 번갈아가며', difficulty: '보통' },
    { title: '마운틴 클라이머 100개', emoji: '⛰️', description: '빠르게 양 무릎 번갈아가며 100개', difficulty: '어려움' },
    { title: '벽 푸시업 100개', emoji: '🧱', description: '벽에 기대어 푸시업 100개 (초보자용)', difficulty: '쉬움' },
    { title: '제자리 뛰기 500개', emoji: '🏃‍♂️', description: '양발 모아 500번 점프!', difficulty: '보통' },
    { title: '물 2L 마시기', emoji: '💧', description: '500ml 컵으로 4잔 완성하기', difficulty: '쉬움' },
    { title: '야식 참기', emoji: '🚫', description: '저녁 8시 이후 음식 섭취 금지!', difficulty: '어려움' },
  ],
  productivity: [
    { title: '새벽 5시 기상', emoji: '⏰', description: '알람과 함께 바로 일어나서 침대 정리', difficulty: '어려움' },
    { title: '핸드폰 없이 3시간', emoji: '📵', description: '핸드폰을 서랍에 넣고 집중 작업', difficulty: '어려움' },
    { title: '책 50페이지 읽기', emoji: '📚', description: '어떤 책이든 50페이지 완독하기', difficulty: '보통' },
    { title: '냉수 샤워', emoji: '🚿', description: '마지막 1분 동안 찬물로 샤워하기', difficulty: '어려움' },
    { title: 'To-do 5개 완료', emoji: '✅', description: '오늘 할 일 5개를 저녁 전까지 끝내기', difficulty: '보통' },
    { title: '아침 6시 전 산책', emoji: '🌅', description: '해 뜨기 전에 15분 산책하기', difficulty: '어려움' },
    { title: '유튜브 금지', emoji: '🎥', description: '오늘 하루 유튜브 안 보기', difficulty: '보통' },
    { title: '아침 명상 15분', emoji: '🧘', description: '조용히 앉아 호흡과 생각 관찰하기', difficulty: '쉬움' },
  ],
  mindfulness: [
    { title: '나를 사랑하는 선언', emoji: '💖', description: '거울 보며 "나는 사랑받을 자격이 있어" 10번', difficulty: '쉬움' },
    { title: '호흡 명상 20분', emoji: '🌬️', description: '편안한 자세로 코로 들이쉬고 입으로 내쉬기', difficulty: '보통' },
    { title: '자연 속 산책 30분', emoji: '🌳', description: '공원이나 산에서 자연 느끼며 걷기', difficulty: '보통' },
    { title: '감정 일기 쓰기', emoji: '✨', description: '오늘 느낀 감정을 솔직하게 10분간 적기', difficulty: '쉬움' },
    { title: '좋은 기억 회상', emoji: '🌈', description: '인생에서 가장 행복했던 순간 5분간 떠올리기', difficulty: '쉬움' },
    { title: '몸 스캔 명상', emoji: '🧘‍♀️', description: '누워서 발끝부터 머리까지 몸의 감각 느끼기', difficulty: '보통' },
    { title: '긍정 확언 30개', emoji: '💫', description: '"나는 충분히 잘하고 있어" 같은 말 30번', difficulty: '쉬움' },
    { title: '미소 짓기 50번', emoji: '😊', description: '거울 보며 진심으로 웃는 연습하기', difficulty: '쉬움' },
    { title: '고요히 앉아있기 10분', emoji: '🕉️', description: '아무것도 하지 않고 그냥 존재하기', difficulty: '보통' },
    { title: '감사 편지 쓰기', emoji: '🙏', description: '나 자신에게 감사 편지 쓰기', difficulty: '보통' },
  ],
  social: [
    { title: '부모님께 사랑한다 말하기', emoji: '💝', description: '전화로 또는 직접 "사랑해요" 말하기', difficulty: '보통' },
    { title: '나 자신에게 칭찬', emoji: '🪞', description: '거울 보며 "나는 소중한 존재야" 3번 말하기', difficulty: '쉬움' },
    { title: '감사 일기 3가지', emoji: '📔', description: '오늘 감사한 일 3가지 적고 음미하기', difficulty: '쉬움' },
    { title: '사랑하는 사람에게 편지', emoji: '✉️', description: '가족/친구에게 감동적인 긴 편지 쓰기', difficulty: '보통' },
    { title: '불평 제로 데이', emoji: '😇', description: '하루 종일 불평, 욕설, 부정적 말 금지', difficulty: '어려움' },
    { title: '옛 친구에게 연락', emoji: '💬', description: '오랜만에 연락해서 그리움 표현하기', difficulty: '보통' },
    { title: '칭찬 5번 하기', emoji: '👏', description: '다섯 명에게 진심 어린 칭찬하기', difficulty: '쉬움' },
    { title: '가족 사진 보며 추억', emoji: '📸', description: '옛 사진 보며 10분간 추억에 잠기기', difficulty: '쉬움' },
  ],
  creative: [
    { title: '15분 자유 드로잉', emoji: '🎨', description: '종이에 생각나는 대로 그림 그리기', difficulty: '쉬움' },
    { title: '사진 20장 찍기', emoji: '📸', description: '일상 속 아름다운 순간 20장 포착', difficulty: '쉬움' },
    { title: '100자 글쓰기', emoji: '✍️', description: '오늘의 생각을 100자로 표현하기', difficulty: '쉬움' },
    { title: '새 요리 만들기', emoji: '🍳', description: '레시피 보고 처음 만드는 음식 도전', difficulty: '보통' },
    { title: '종이접기 5개', emoji: '📄', description: '학, 비행기 등 종이접기 5개 완성', difficulty: '쉬움' },
    { title: '춤 5분 추기', emoji: '💃', description: '좋아하는 노래에 맞춰 자유롭게', difficulty: '쉬움' },
  ],
  lifestyle: [
    { title: '책상 완전 정리', emoji: '🗂️', description: '책상 위 물건 전부 정리하고 닦기', difficulty: '쉬움' },
    { title: '옷 10벌 정리', emoji: '👔', description: '안 입는 옷 10벌 골라서 기부 박스에', difficulty: '보통' },
    { title: '침대 시트 교체', emoji: '🛏️', description: '침대 시트와 베개 커버 빨래하기', difficulty: '보통' },
    { title: '냉장고 정리', emoji: '🧊', description: '유통기한 확인하고 정리 정돈', difficulty: '보통' },
    { title: '신발장 정리', emoji: '👟', description: '신발 전부 꺼내서 정리하고 닦기', difficulty: '보통' },
    { title: '화장실 청소', emoji: '🚽', description: '화장실 구석구석 깨끗이 청소', difficulty: '보통' },
    { title: '베란다 정리', emoji: '🌿', description: '베란다 쓸고 닦고 정리하기', difficulty: '보통' },
    { title: '서랍 하나 비우기', emoji: '📦', description: '서랍 하나를 완전히 비우고 재정리', difficulty: '쉬움' },
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
      case 'mindfulness': return '🧘‍♀️';
      case 'social': return '💝';
      case 'creative': return '🎨';
      case 'lifestyle': return '🏠';
      default: return '⭐';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'health': return '건강/운동';
      case 'productivity': return '생산성';
      case 'mindfulness': return '마음챙김';
      case 'social': return '감성/관계';
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
