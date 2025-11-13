"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';

import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';
interface QuoteDatabase {
  [key: string]: {
    quotes: string[];
    color: string;
    gradient: string;
    icon: string;
    label: string;
  };
}

const QUOTE_DB: QuoteDatabase = {
  motivation: {
    icon: '💪',
    label: '동기부여',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    quotes: [
      '불가능이란 없다. 단어 자체가 "나는 가능하다"라고 말한다. - 오드리 헵번',
      '성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다. 중요한 것은 계속할 용기다. - 윈스턴 처칠',
      '당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신이 옳다. - 헨리 포드',
      '미래는 자신의 꿈의 아름다움을 믿는 사람들의 것이다. - 엘리너 루즈벨트',
      '시작이 반이다. - 아리스토텔레스',
      '오늘 할 수 있는 일을 내일로 미루지 마라. - 벤자민 프랭클린',
      '실패는 성공의 어머니다. - 토마스 에디슨',
      '노력은 배신하지 않는다. - 이소룡',
      '꿈을 꾸고 또 꾸어라. 꿈은 이루어진다. - 월트 디즈니',
      '천 리 길도 한 걸음부터 시작된다. - 노자'
    ]
  },
  success: {
    icon: '🏆',
    label: '성공',
    color: 'yellow',
    gradient: 'from-yellow-500 to-amber-500',
    quotes: [
      '성공의 비결은 시작하는 것이다. - 마크 트웨인',
      '성공이란 실패를 거듭해도 열정을 잃지 않는 능력이다. - 윈스턴 처칠',
      '성공한 사람이 되려 하지 말고, 가치 있는 사람이 되라. - 알버트 아인슈타인',
      '성공은 준비와 기회가 만나는 곳에서 일어난다. - 바비 언서',
      '성공의 열쇠는 실패를 두려워하지 않는 것이다. - 르브론 제임스',
      '성공은 매일의 작은 노력의 합이다. - 로버트 콜리어',
      '위대한 성공은 큰 위험을 감수한 사람에게만 온다. - 닐 암스트롱',
      '성공은 끝이 아니고, 실패는 치명적이지 않다. - 무명',
      '성공하려면 남들이 하지 않는 일을 하라. - 헨리 데이비드 소로',
      '성공은 99%의 땀과 1%의 영감이다. - 토마스 에디슨'
    ]
  },
  wisdom: {
    icon: '🧠',
    label: '지혜',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-500',
    quotes: [
      '아는 것이 힘이다. - 프랜시스 베이컨',
      '배움에는 끝이 없다. - 공자',
      '지혜는 경험의 딸이다. - 레오나르도 다빈치',
      '어리석은 자는 말하고, 지혜로운 자는 듣는다. - 탈무드',
      '진정한 지혜는 자신의 무지를 아는 것이다. - 소크라테스',
      '책을 읽는 것은 다른 사람의 생각을 빌리는 것이다. - 쇼펜하우어',
      '경험은 가장 위대한 스승이다. - 율리우스 카이사르',
      '지혜로운 자는 기회를 만들어낸다. - 프랜시스 베이컨',
      '지식은 힘이고, 지혜는 자유다. - 무명',
      '배우기를 멈추는 순간 늙기 시작한다. - 헨리 포드'
    ]
  },
  love: {
    icon: '❤️',
    label: '사랑',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    quotes: [
      '사랑은 인생의 꽃이요, 행복은 그 향기다. - 빅토르 위고',
      '사랑받고 싶다면 먼저 사랑하라. - 세네카',
      '사랑은 우리가 줄 수 있는 가장 위대한 선물이다. - 마더 테레사',
      '사랑은 두려움을 몰아낸다. - 성경',
      '진정한 사랑은 기다릴 줄 안다. - 윌리엄 셰익스피어',
      '사랑은 시간과 공간을 초월한다. - 아인슈타인',
      '사랑받는 것보다 사랑하는 것이 더 행복하다. - 무명',
      '사랑은 영혼의 양식이다. - 플라톤',
      '사랑 없는 삶은 죽음과 같다. - 괴테',
      '사랑은 모든 것을 이긴다. - 베르길리우스'
    ]
  },
  life: {
    icon: '🌟',
    label: '인생',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    quotes: [
      '인생은 자전거를 타는 것과 같다. 균형을 잡으려면 계속 움직여야 한다. - 알버트 아인슈타인',
      '인생은 B와 D 사이의 C다. (Birth와 Death 사이의 Choice) - 장폴 사르트르',
      '오늘이 당신 인생의 첫날이라고 생각하라. - 무명',
      '인생은 10%는 일어나는 일이고, 90%는 그것에 대한 반응이다. - 찰스 스윈돌',
      '인생은 짧다. 미소 지을 시간도 없다. - 찰리 채플린',
      '인생은 우리가 만드는 것이다. 언제나 그래왔고 앞으로도 그럴 것이다. - 그랜마 모지스',
      '인생에서 가장 큰 영광은 넘어지지 않는 것이 아니라 넘어질 때마다 일어서는 것이다. - 넬슨 만델라',
      '인생의 목적은 행복이다. - 달라이 라마',
      '인생은 모험이거나 아무것도 아니다. - 헬렌 켈러',
      '과거에서 배우고, 오늘을 살고, 내일을 희망하라. - 알버트 아인슈타인'
    ]
  },
  happiness: {
    icon: '😊',
    label: '행복',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    quotes: [
      '행복은 습관이다. 그것을 몸에 지니라. - 허버드',
      '행복은 준비된 마음에 찾아온다. - 루이 파스퇴르',
      '행복은 목적지가 아니라 여행이다. - 무명',
      '가장 행복한 사람은 가장 적게 원하는 사람이다. - 소크라테스',
      '행복의 문이 하나 닫히면 다른 문이 열린다. - 헬렌 켈러',
      '행복은 나눌수록 배가 된다. - 무명',
      '행복해지고 싶으면 감사하라. - 무명',
      '진정한 행복은 마음의 평화에서 온다. - 달라이 라마',
      '오늘 행복하지 않으면 언제 행복할 것인가? - 무명',
      '행복은 스스로 만드는 것이다. - 링컨'
    ]
  }
};

export default function QuoteGenerator() {
  const [category, setCategory] = useState<string>('motivation');
  const [quote, setQuote] = useState<string>('');
  const [showQuote, setShowQuote] = useState(false);

  const generateQuote = () => {
    const quotes = QUOTE_DB[category].quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    setShowQuote(true);
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(quote);
    alert('명언이 복사되었습니다! 📋');
  };

  const shareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI 명언 생성기',
        text: quote
      });
    } else {
      copyQuote();
    }
  };

  const categoryData = QUOTE_DB[category];

  return (
    <PremiumLayout theme="indigo">
      
        <AdOverlay /><div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-3xl mx-auto">
          <PremiumHeader 
            icon="✨"
            title="AI 명언 생성기"
            subtitle="상황에 맞는 명언으로 하루를 시작하세요"
            gradient="from-yellow-200 via-pink-200 to-indigo-200"
          />

          <PremiumCard className="mb-8" gradient>
            <h3 className="text-2xl font-bold text-white mb-6">🎯 카테고리 선택</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {Object.entries(QUOTE_DB).map(([key, data]) => (
                <button
        type="button"
                  key={key}
                  onClick={() => { setCategory(key); setShowQuote(false); }}
                  className={`p-5 rounded sm:rounded-lg md:rounded-2xl font-semibold transition-all border-2 ${
                    category === key
                      ? `bg-gradient-to-r ${data.gradient} text-white shadow-2xl border-white/50 scale-105`
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="text-4xl mb-2">{data.icon}</div>
                  <div className="text-sm">{data.label}</div>
                </button>
              ))}
            </div>
          </PremiumCard>

          {!showQuote ? (
            <div className="space-y-6">
              <PremiumCard>
                <h3 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
                  <span>💡</span> 명언의 힘
                </h3>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    긍정적인 마인드셋 형성
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    동기부여와 영감 제공
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    스트레스 해소 및 힐링
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    새로운 관점과 통찰력
                  </li>
                </ul>
              </PremiumCard>

              <PremiumButton
                onClick={generateQuote}
                fullWidth
                size="lg"
              >
                {categoryData.icon} 명언 생성하기
              </PremiumButton>
            </div>
          ) : (
            <div className="space-y-6">
              <PremiumCard className={`bg-gradient-to-br ${categoryData.gradient} text-center`}>
                <div className="text-8xl mb-6 animate-float">{categoryData.icon}</div>
                <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed px-4">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </PremiumCard>

              <div className="grid grid-cols-3 gap-2">
                <button
        type="button"
                  onClick={generateQuote}
                  className="py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <div className="text-3xl mb-1">🔄</div>
                  <div className="text-sm">다시</div>
                </button>
                <button
        type="button"
                  onClick={copyQuote}
                  className="py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <div className="text-3xl mb-1">📋</div>
                  <div className="text-sm">복사</div>
                </button>
                <button
        type="button"
                  onClick={shareQuote}
                  className="py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <div className="text-3xl mb-1">📤</div>
                  <div className="text-sm">공유</div>
                </button>
              </div>

              <button
        type="button"
                onClick={() => setShowQuote(false)}
                className="w-full py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all border border-white/30"
              >
                카테고리 변경
              </button>
            </div>
          )}

          <PremiumCard className="mt-8">
            <h3 className="font-bold text-white text-xl mb-4">📚 추천 활용법</h3>
            <div className="space-y-3">
              <div className="p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-colors">
                <div className="font-semibold text-white mb-1 flex items-center gap-2">
                  <span>🌅</span> 아침 루틴
                </div>
                <div className="text-white/70 text-sm">기상 후 동기부여/성공 명언으로 하루 시작</div>
              </div>
              <div className="p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-colors">
                <div className="font-semibold text-white mb-1 flex items-center gap-2">
                  <span>💼</span> 업무 중
                </div>
                <div className="text-white/70 text-sm">지혜/인생 명언으로 집중력 회복</div>
              </div>
              <div className="p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-colors">
                <div className="font-semibold text-white mb-1 flex items-center gap-2">
                  <span>🌙</span> 취침 전
                </div>
                <div className="text-white/70 text-sm">행복/사랑 명언으로 마음의 평화</div>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
