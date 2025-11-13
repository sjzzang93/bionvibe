"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

export default function DatingCoach() {
  const [chatText, setChatText] = useState('');
  const [result, setResult] = useState<any>(null);

  const analyzeChat = () => {
    if (!chatText.trim()) {
      alert('대화 내용을 입력해주세요!');
      return;
    }

    const text = chatText.toLowerCase();
    const lines = chatText.split('\n').filter(line => line.trim());

    // 분석 지표
    let myMessages = 0;
    let theirMessages = 0;
    let emojiCount = 0;
    let exclamationCount = 0;
    let questionCount = 0;
    let laughCount = 0;
    let heartCount = 0;

    lines.forEach(line => {
      if (line.includes('나:') || line.includes('me:')) myMessages++;
      if (line.includes('상대:') || line.includes('them:')) theirMessages++;

      emojiCount += (line.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
      exclamationCount += (line.match(/!/g) || []).length;
      questionCount += (line.match(/\?/g) || []).length;
      laughCount += (line.match(/ㅋ|ㅎ|ㄷ|하하|호호|히히/g) || []).length;
      heartCount += (line.match(/❤|💕|💖|💗|💝|♥/g) || []).length;
    });

    // 썸 진행도 계산 (0-100)
    let somScore = 0;

    // 메시지 균형 (최대 20점)
    const messageRatio = myMessages > 0 ? theirMessages / myMessages : 0;
    if (messageRatio >= 0.8 && messageRatio <= 1.2) somScore += 20;
    else if (messageRatio >= 0.5 && messageRatio <= 1.5) somScore += 15;
    else if (messageRatio >= 0.3 && messageRatio <= 2) somScore += 10;
    else somScore += 5;

    // 이모지 사용 (최대 20점)
    somScore += Math.min(20, emojiCount * 2);

    // 느낌표 사용 (최대 15점)
    somScore += Math.min(15, exclamationCount * 1.5);

    // 웃음 표현 (최대 15점)
    somScore += Math.min(15, laughCount * 2);

    // 하트 (최대 20점)
    somScore += Math.min(20, heartCount * 5);

    // 질문 (최대 10점)
    somScore += Math.min(10, questionCount);

    somScore = Math.min(100, Math.round(somScore));

    // 등급 판정
    let grade, gradeEmoji, gradeColor, advice;
    if (somScore >= 80) {
      grade = '썸 확정!';
      gradeEmoji = '💕';
      gradeColor = 'from-pink-500 to-red-500';
      advice = '완벽한 썸 타는 중! 이제 고백만 남았어요!';
    } else if (somScore >= 60) {
      grade = '썸 진행중';
      gradeEmoji = '💖';
      gradeColor = 'from-purple-500 to-pink-500';
      advice = '좋은 분위기네요! 조금만 더 적극적으로!';
    } else if (somScore >= 40) {
      grade = '호감 있음';
      gradeEmoji = '😊';
      gradeColor = 'from-yellow-500 to-orange-500';
      advice = '긍정적인 신호가 보여요. 더 다가가보세요!';
    } else if (somScore >= 20) {
      grade = '친구 같음';
      gradeEmoji = '🤝';
      gradeColor = 'from-blue-500 to-cyan-500';
      advice = '아직 친구 단계. 더 적극적인 어필이 필요해요!';
    } else {
      grade = '관심 없음';
      gradeEmoji = '😐';
      gradeColor = 'from-gray-500 to-gray-600';
      advice = '상대방이 별로 관심이 없는 것 같아요. 다른 인연을 찾아보는게...';
    }

    // 세부 피드백
    const feedback = [];
    if (messageRatio < 0.5) {
      feedback.push({ icon: '⚠️', text: '상대방이 답장을 너무 적게 해요', type: 'warning' });
    } else if (messageRatio > 2) {
      feedback.push({ icon: '⚠️', text: '너무 많이 보내고 있어요. 상대방 부담스러울 수 있어요', type: 'warning' });
    } else {
      feedback.push({ icon: '✅', text: '메시지 주고받기가 균형잡혀 있어요!', type: 'good' });
    }

    if (heartCount > 3) {
      feedback.push({ icon: '💝', text: '하트가 많아요! 좋은 신호!', type: 'good' });
    }

    if (laughCount > 5) {
      feedback.push({ icon: '😄', text: '웃음이 많은 대화! 분위기 좋아요!', type: 'good' });
    }

    if (questionCount < 2) {
      feedback.push({ icon: '💡', text: '질문을 더 해보세요! 관심을 표현하세요', type: 'tip' });
    }

    if (emojiCount < 3) {
      feedback.push({ icon: '💡', text: '이모지를 좀 더 사용하면 친근해 보여요', type: 'tip' });
    }

    setResult({
      somScore,
      grade,
      gradeEmoji,
      gradeColor,
      advice,
      feedback,
      stats: {
        myMessages,
        theirMessages,
        emojiCount,
        heartCount,
        laughCount
      }
    });
  };

  return (
    <PremiumLayout theme="pink">
      
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-200 via-red-200 to-purple-200 bg-clip-text text-transparent">
            💕 AI 썸 코치
          </h1>
          <p className="text-xl text-white/80">카톡 대화 분석으로 썸 진행도 측정</p>
        </div>

        {/* 입력 폼 */}
        <PremiumCard hover gradient className="mb-8 animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-6 text-center">💬 대화 내용 입력</h3>

          <div className="mb-4">
            <textarea
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder={"나: 안녕하세요! 오늘 날씨 좋네요 ☀️\n상대: 네! 정말요 ㅎㅎ 기분 좋아요!\n나: 저도요! 산책하기 좋은 날이에요\n상대: 맞아요~ 저도 나가볼까 생각중이에요!\n\n(나:/상대: 형식으로 입력해주세요)"}
              rows={12}
              className="w-full px-4 py-3 rounded-lg text-black resize-none font-mono"
              style={{ fontSize: '14px' }}
            />
          </div>

          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <div className="text-white text-sm space-y-2">
              <div className="font-bold mb-2">📌 입력 가이드</div>
              <div>• "나:" 또는 "me:"로 시작하는 줄은 내 메시지</div>
              <div>• "상대:" 또는 "them:"로 시작하는 줄은 상대 메시지</div>
              <div>• 최소 10줄 이상 입력하면 정확해요</div>
              <div>• 이모지, ㅋㅋ, ㅎㅎ 같은 표현도 잘 분석돼요</div>
            </div>
          </div>

          <PremiumButton
            onClick={analyzeChat}
            variant="primary"
            size="lg"
            icon="🔍"
            fullWidth
          >
            썸 진행도 분석하기
          </PremiumButton>
        </PremiumCard>

        {/* 결과 */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* 썸 진행도 */}
            <PremiumCard hover gradient>
              <div className="text-center">
                <div className="text-7xl mb-4 animate-bounce-slow">{result.gradeEmoji}</div>
                <div className={`text-6xl font-bold mb-4 bg-gradient-to-r ${result.gradeColor} bg-clip-text text-transparent`}>
                  {result.somScore}점
                </div>
                <div className={`inline-block px-8 py-3 rounded-full font-bold text-2xl text-white bg-gradient-to-r ${result.gradeColor} mb-4`}>
                  {result.grade}
                </div>
                <p className="text-xl text-white/90 mt-4">{result.advice}</p>
              </div>
            </PremiumCard>

            {/* 통계 */}
            <div className="grid md:grid-cols-3 gap-4">
              <PremiumCard hover>
                <div className="text-center">
                  <div className="text-3xl mb-2">💬</div>
                  <div className="text-white text-sm mb-1">메시지 비율</div>
                  <div className="text-2xl font-bold text-white">
                    {result.stats.myMessages} : {result.stats.theirMessages}
                  </div>
                </div>
              </PremiumCard>
              <PremiumCard hover>
                <div className="text-center">
                  <div className="text-3xl mb-2">😊</div>
                  <div className="text-white text-sm mb-1">이모지</div>
                  <div className="text-2xl font-bold text-white">{result.stats.emojiCount}개</div>
                </div>
              </PremiumCard>
              <PremiumCard hover>
                <div className="text-center">
                  <div className="text-3xl mb-2">💖</div>
                  <div className="text-white text-sm mb-1">하트</div>
                  <div className="text-2xl font-bold text-white">{result.stats.heartCount}개</div>
                </div>
              </PremiumCard>
            </div>

            {/* 피드백 */}
            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">📊 상세 분석</h4>
              <div className="space-y-3">
                {result.feedback.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      item.type === 'good' ? 'bg-green-500/20' :
                      item.type === 'warning' ? 'bg-red-500/20' :
                      'bg-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <p className="text-white flex-1">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>

            {/* 팁 */}
            <PremiumCard hover>
              <h4 className="text-white font-bold text-xl mb-4 text-center">💡 썸 성공 팁</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📱</span>
                  <p>답장은 너무 빠르지도, 늦지도 않게 (10분~1시간)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💬</span>
                  <p>질문으로 끝내서 대화를 이어가세요</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">😊</span>
                  <p>이모지와 이모티콘을 적절히 사용하세요</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <p>상대방 관심사에 대해 물어보세요</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⏰</span>
                  <p>밤 늦게까지 대화하면 친밀도 UP!</p>
                </div>
              </div>
            </PremiumCard>
          </div>
        )}

        {/* Related Apps */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <RelatedApps currentAppSlug="dating-coach" className="mt-8" />
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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
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
