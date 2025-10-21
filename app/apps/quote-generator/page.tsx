"use client";

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
interface QuoteDatabase {
  [key: string]: {
    quotes: string[];
    color: string;
    gradient: string;
    icon: string;
  };
}

const QUOTE_DB: QuoteDatabase = {
  motivation: {
    icon: '💪',
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
    color: 'pink',
    gradient: 'from-blue-500 to-blue-500',
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="mx-auto max-w-[600px] px-4 py-6">
        <div className="mb-4">
          
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-6">
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">✨</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI 명언 생성기</h2>
            <p className="text-gray-600">상황에 맞는 명언으로 하루를 시작하세요</p>
          </header>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">카테고리 선택</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(QUOTE_DB).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => { setCategory(key); setShowQuote(false); }}
                  className={`p-4 rounded-xl font-semibold transition-all border-2 ${
                    category === key
                      ? `bg-gradient-to-r ${data.gradient} text-white shadow-lg border-transparent`
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{data.icon}</div>
                  <div className="text-sm">
                    {key === 'motivation' ? '동기부여' :
                     key === 'success' ? '성공' :
                     key === 'wisdom' ? '지혜' :
                     key === 'love' ? '사랑' :
                     key === 'life' ? '인생' :
                     '행복'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {!showQuote ? (
            <>
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-black mb-2">💡 명언의 힘</h3>
                <ul className="text-sm text-black space-y-1">
                  <li>• 긍정적인 마인드셋 형성</li>
                  <li>• 동기부여와 영감 제공</li>
                  <li>• 스트레스 해소 및 힐링</li>
                  <li>• 새로운 관점과 통찰력</li>
                </ul>
              </div>

              <button
                onClick={generateQuote}
                className={`w-full py-4 bg-gradient-to-r ${categoryData.gradient} text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all`}
              >
                {categoryData.icon} 명언 생성하기
              </button>
            </>
          ) : (
            <>
              <div className={`mb-6 p-6 rounded-xl bg-gradient-to-br ${categoryData.gradient} text-white shadow-xl`}>
                <div className="text-6xl text-center mb-4 opacity-90">{categoryData.icon}</div>
                <blockquote className="text-lg font-medium text-center leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={generateQuote}
                  className="py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  🔄 다시
                </button>
                <button
                  onClick={copyQuote}
                  className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  📋 복사
                </button>
                <button
                  onClick={shareQuote}
                  className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  📤 공유
                </button>
              </div>

              <button
                onClick={() => setShowQuote(false)}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
              >
                카테고리 변경
              </button>
            </>
          )}
        </section>

        <div className="mt-6 bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-gray-800 mb-3">📚 추천 활용법</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="font-semibold text-black mb-1">🌅 아침 루틴</div>
              <div className="text-black">기상 후 동기부여/성공 명언으로 하루 시작</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <div className="font-semibold text-black mb-1">💼 업무 중</div>
              <div className="text-black">지혜/인생 명언으로 집중력 회복</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="font-semibold text-black mb-1">🌙 취침 전</div>
              <div className="text-black">행복/사랑 명언으로 마음의 평화</div>
            </div>
          </div>
        </div>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}

