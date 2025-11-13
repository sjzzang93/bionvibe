"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

const QUIZ_TEMPLATES = [
  { q: '내 생일은?', type: 'date' },
  { q: '내가 가장 좋아하는 음식은?', type: 'text' },
  { q: '내 MBTI는?', type: 'text' },
  { q: '내가 가장 싫어하는 것은?', type: 'text' },
  { q: '내 취미는?', type: 'text' },
  { q: '내가 가장 좋아하는 색은?', type: 'text' },
  { q: '내가 가장 자주 하는 말버릇은?', type: 'text' },
  { q: '내가 스트레스 받을 때 하는 행동은?', type: 'text' },
  { q: '내가 좋아하는 영화/드라마는?', type: 'text' },
  { q: '내 꿈(목표)은?', type: 'text' },
];

export default function FriendshipQuiz() {
  const [mode, setMode] = useState<'create' | 'solve' | null>(null);
  const [friendName, setFriendName] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [quizCode, setQuizCode] = useState('');
  const [result, setResult] = useState<any>(null);

  const startCreate = () => {
    setMode('create');
    const selected = [...QUIZ_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(selected.map(q => ({ ...q, answer: '' })));
  };

  const saveQuiz = () => {
    if (!friendName) {
      alert('친구 이름을 입력하세요!');
      return;
    }
    if (questions.some(q => !q.answer)) {
      alert('모든 질문에 답해주세요!');
      return;
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const quiz = {
      friendName,
      questions,
      code,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(`quiz_${code}`, JSON.stringify(quiz));
    setQuizCode(code);
    alert(`퀴즈 생성 완료! 코드: ${code}`);
  };

  const loadQuiz = () => {
    const code = prompt('퀴즈 코드를 입력하세요:');
    if (!code) return;

    const saved = localStorage.getItem(`quiz_${code.toUpperCase()}`);
    if (!saved) {
      alert('존재하지 않는 코드입니다!');
      return;
    }

    const quiz = JSON.parse(saved);
    setFriendName(quiz.friendName);
    setQuestions(quiz.questions);
    setAnswers(new Array(quiz.questions.length).fill(''));
    setCurrentQ(0);
    setMode('solve');
  };

  const submitAnswer = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // 채점
      let correct = 0;
      questions.forEach((q, i) => {
        if (q.answer.toLowerCase().trim() === answers[i]?.toLowerCase().trim()) {
          correct++;
        }
      });

      const score = Math.round((correct / questions.length) * 100);
      let grade, emoji, message;

      if (score === 100) {
        grade = '찐친';
        emoji = '👯';
        message = '완벽해요! 서로를 너무 잘 알고 있어요!';
      } else if (score >= 80) {
        grade = '절친';
        emoji = '🤝';
        message = '정말 친한 사이네요!';
      } else if (score >= 60) {
        grade = '친구';
        emoji = '😊';
        message = '꽤 잘 알고 있어요!';
      } else if (score >= 40) {
        grade = '아는 사이';
        emoji = '🙂';
        message = '조금 더 친해져보세요!';
      } else {
        grade = '남';
        emoji = '😐';
        message = '많이 모르시는군요...';
      }

      setResult({
        score,
        correct,
        total: questions.length,
        grade,
        emoji,
        message
      });
    }
  };

  const reset = () => {
    setMode(null);
    setFriendName('');
    setQuestions([]);
    setAnswers([]);
    setCurrentQ(0);
    setQuizCode('');
    setResult(null);
  };

  if (!mode) {
    return (
      <PremiumLayout theme="purple">
        
        <AdOverlay /><div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
              👥 우정 테스트 퀴즈
            </h1>
            <p className="text-xl text-white/80">친구가 나를 얼마나 아는지 테스트!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="cursor-pointer" onClick={startCreate}>
              <PremiumCard hover gradient>
                <div className="text-center p-8">
                  <div className="text-8xl mb-6">✍️</div>
                  <h2 className="text-white text-3xl font-bold mb-4">퀴즈 만들기</h2>
                  <p className="text-white/80">내 정보로 퀴즈를 만들고 친구에게 공유하세요</p>
                </div>
              </PremiumCard>
            </div>

            <div className="cursor-pointer" onClick={loadQuiz}>
              <PremiumCard hover gradient>
                <div className="text-center p-8">
                  <div className="text-8xl mb-6">🎯</div>
                  <h2 className="text-white text-3xl font-bold mb-4">퀴즈 풀기</h2>
                  <p className="text-white/80">친구가 만든 퀴즈 코드를 입력하고 도전하세요</p>
                </div>
              </PremiumCard>
            </div>
          </div>
        </div>
      </PremiumLayout>
    );
  }

  if (mode === 'create' && !quizCode) {
    return (
      <PremiumLayout theme="purple">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PremiumCard hover gradient>
            <h2 className="text-white text-3xl font-bold mb-6 text-center">✍️ 퀴즈 만들기</h2>

            <div className="mb-6">
              <label className="text-white font-bold mb-2 block">내 이름</label>
              <input
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 rounded-lg text-black font-bold"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div className="space-y-4 mb-6">
              {questions.map((q, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-4">
                  <div className="text-white font-bold mb-2">Q{i + 1}. {q.q}</div>
                  <input
                    type={q.type === 'date' ? 'date' : 'text'}
                    value={q.answer}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[i].answer = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full px-4 py-2 rounded-lg text-black"
                    style={{ fontSize: '16px' }}
                    placeholder="정답 입력"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <PremiumButton onClick={reset} variant="secondary" size="lg" className="flex-1">
                취소
              </PremiumButton>
              <PremiumButton onClick={saveQuiz} variant="primary" size="lg" icon="✅" className="flex-1">
                퀴즈 생성
              </PremiumButton>
            </div>
          </PremiumCard>
        </div>
      </PremiumLayout>
    );
  }

  if (quizCode) {
    return (
      <PremiumLayout theme="purple">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PremiumCard hover gradient>
            <div className="text-center">
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-white text-4xl font-bold mb-4">퀴즈 생성 완료!</h2>
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="text-gray-600 mb-2">퀴즈 코드</div>
                <div className="text-6xl font-bold text-purple-600 tracking-wider">{quizCode}</div>
              </div>
              <p className="text-white text-lg mb-6">
                이 코드를 친구에게 공유하세요!<br />
                친구가 당신을 얼마나 아는지 테스트할 수 있어요
              </p>
              <PremiumButton onClick={reset} variant="primary" size="lg" icon="🔙">
                처음으로 돌아가기
              </PremiumButton>
            </div>
          </PremiumCard>
        </div>
      </PremiumLayout>
    );
  }

  if (result) {
    return (
      <PremiumLayout theme="purple">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PremiumCard hover gradient className="mb-6">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce-slow">{result.emoji}</div>
              <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                {result.score}점
              </div>
              <div className="inline-block px-8 py-3 rounded-full font-bold text-2xl text-white bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                {result.grade}
              </div>
              <p className="text-white text-xl mb-4">{result.message}</p>
              <p className="text-white/80">
                {result.correct}개 / {result.total}개 정답
              </p>
            </div>
          </PremiumCard>

          <PremiumCard hover>
            <h3 className="text-white text-xl font-bold mb-4 text-center">📋 정답 확인</h3>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={i} className={`rounded-lg p-4 ${answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <div className="text-white font-bold mb-2">Q{i + 1}. {q.q}</div>
                  <div className="text-white/90 mb-1">
                    <span className="text-white/70">내 답: </span>{answers[i] || '(미입력)'}
                  </div>
                  <div className="text-white/90">
                    <span className="text-white/70">정답: </span>{q.answer}
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          <div className="mt-6">
            <PremiumButton onClick={reset} variant="primary" size="lg" icon="🔙" fullWidth>
              처음으로 돌아가기
            </PremiumButton>
          </div>

          <div className="mt-8">
            <RelatedApps currentAppSlug="friendship-quiz" className="mt-8" />
          </div>
        </div>
      </PremiumLayout>
    );
  }

  // 퀴즈 풀기 모드
  return (
    <PremiumLayout theme="purple">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PremiumCard hover gradient>
          <div className="text-center mb-6">
            <h2 className="text-white text-2xl font-bold mb-2">{friendName}에 대해 얼마나 알고 있나요?</h2>
            <div className="text-white/70">
              문제 {currentQ + 1} / {questions.length}
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <h3 className="text-white text-2xl font-bold mb-4 text-center">
              {questions[currentQ]?.q}
            </h3>
            <input
              type={questions[currentQ]?.type === 'date' ? 'date' : 'text'}
              value={answers[currentQ] || ''}
              onChange={(e) => {
                const updated = [...answers];
                updated[currentQ] = e.target.value;
                setAnswers(updated);
              }}
              className="w-full px-4 py-3 rounded-lg text-black text-center text-xl"
              style={{ fontSize: '18px' }}
              placeholder="답을 입력하세요"
            />
          </div>

          <div className="flex gap-4">
            {currentQ > 0 && (
              <PremiumButton onClick={() => setCurrentQ(currentQ - 1)} variant="secondary" size="lg" className="flex-1">
                이전
              </PremiumButton>
            )}
            <PremiumButton onClick={submitAnswer} variant="primary" size="lg" icon={currentQ < questions.length - 1 ? '▶️' : '✅'} className="flex-1">
              {currentQ < questions.length - 1 ? '다음' : '제출'}
            </PremiumButton>
          </div>
        </PremiumCard>
      </div>
    </PremiumLayout>
  );
}
