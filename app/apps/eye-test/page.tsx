"use client";

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';

// 시력 검사 데이터
const VISION_TESTS = [
  { size: 120, level: '0.1', direction: 'right', emoji: '→' },
  { size: 100, level: '0.2', direction: 'left', emoji: '←' },
  { size: 80, level: '0.3', direction: 'up', emoji: '↑' },
  { size: 60, level: '0.5', direction: 'down', emoji: '↓' },
  { size: 40, level: '0.7', direction: 'right', emoji: '→' },
  { size: 30, level: '0.9', direction: 'left', emoji: '←' },
  { size: 20, level: '1.2', direction: 'up', emoji: '↑' },
  { size: 15, level: '1.5', direction: 'down', emoji: '↓' },
  { size: 12, level: '2.0', direction: 'right', emoji: '→' }
];

export default function EyeTest() {
  const [testMode, setTestMode] = useState<'menu' | 'testing' | 'result'>('menu');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    const currentTest = VISION_TESTS[currentStep];
    const isCorrect = answer === currentTest.direction;

    if (!isCorrect || currentStep + 1 >= VISION_TESTS.length) {
      // 결과 계산
      const correctAnswers = newAnswers.filter((ans, idx) => ans === VISION_TESTS[idx].direction);
      const visionLevel = correctAnswers.length > 0 ? VISION_TESTS[correctAnswers.length - 1].level : '0.1';

      setResult({
        visionLevel,
        correctCount: correctAnswers.length,
        total: VISION_TESTS.length
      });
      setTestMode('result');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetTest = () => {
    setTestMode('menu');
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  const startTest = () => {
    setTestMode('testing');
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <PremiumLayout theme="blue">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            👁️ 시력 테스트
          </h1>
          <p className="text-xl text-white/80">간단한 시력 검사로 눈 건강을 체크하세요</p>
        </div>

        {/* Menu */}
        {testMode === 'menu' && (
          <PremiumCard hover gradient className="text-center animate-slideUp">
            <div className="text-8xl mb-8 animate-float">👁️</div>
            <h2 className="text-3xl font-bold text-white mb-6">시력을 테스트하세요!</h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              화면에서 50cm 정도 떨어져 주세요.<br />
              화살표 방향을 선택하세요.
            </p>
            
            <PremiumButton
              onClick={startTest}
              variant="primary"
              size="lg"
              icon="🚀"
              fullWidth
            >
              테스트 시작하기
            </PremiumButton>

            <div className="mt-8 text-white/60 text-sm">
              💡 정확한 검사를 위해 안경/렌즈를 착용하세요
            </div>
          </PremiumCard>
        )}

        {/* Testing */}
        {testMode === 'testing' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Progress */}
            <PremiumCard className="text-center">
              <div className="text-white text-lg font-bold mb-2">
                {currentStep + 1} / {VISION_TESTS.length}
              </div>
              <div className="text-white/70 text-sm mb-2">
                현재 시력: {VISION_TESTS[currentStep].level}
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / VISION_TESTS.length) * 100}%` }}
                ></div>
              </div>
            </PremiumCard>

            {/* Test */}
            <PremiumCard hover gradient className="text-center py-16">
              <div className="mb-12">
                <div 
                  className="inline-block font-bold text-white"
                  style={{ 
                    fontSize: `${VISION_TESTS[currentStep].size}px`,
                    fontFamily: 'monospace'
                  }}
                >
                  E
                </div>
              </div>

              <div className="text-white mb-8 text-xl">화살표 방향을 선택하세요</div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {[
                  { dir: 'up', icon: '↑', label: '위' },
                  { dir: 'down', icon: '↓', label: '아래' },
                  { dir: 'left', icon: '←', label: '왼쪽' },
                  { dir: 'right', icon: '→', label: '오른쪽' }
                ].map((option) => (
                  <PremiumButton
                    key={option.dir}
                    onClick={() => handleAnswer(option.dir)}
                    variant="primary"
                    size="lg"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  </PremiumButton>
                ))}
              </div>
            </PremiumCard>
          </div>
        )}

        {/* Result */}
        {testMode === 'result' && result && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient className="text-center">
              <div className="text-8xl mb-6 animate-bounce-slow">
                {parseFloat(result.visionLevel) >= 1.0 ? '😎' : parseFloat(result.visionLevel) >= 0.5 ? '👓' : '🔍'}
              </div>
              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                시력 {result.visionLevel}
              </div>
              <div className="text-white/80 text-lg mb-6">
                {result.correctCount} / {result.total} 정답
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-xl">검사 결과</h3>
                <p className="text-white/90 leading-relaxed">
                  {parseFloat(result.visionLevel) >= 1.0 
                    ? '시력이 매우 좋습니다! 현재 상태를 유지하세요.' 
                    : parseFloat(result.visionLevel) >= 0.7
                      ? '정상 시력 범위입니다. 눈 건강 관리에 신경 쓰세요.'
                      : parseFloat(result.visionLevel) >= 0.3
                        ? '시력 교정이 필요할 수 있습니다. 안과 검진을 권장합니다.'
                        : '시력이 많이 저하되었습니다. 안과 방문이 필요합니다.'}
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-4 border border-white/20">
                  <div className="text-white/70 text-sm mb-1">👁️ 눈 휴식</div>
                  <div className="text-white font-bold">20-20-20 규칙</div>
                  <div className="text-white/70 text-xs mt-1">20분마다 20초간 20피트(6m) 거리 보기</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-4 border border-white/20">
                  <div className="text-white/70 text-sm mb-1">🥕 영양</div>
                  <div className="text-white font-bold">비타민 A 섭취</div>
                  <div className="text-white/70 text-xs mt-1">당근, 시금치 등 눈 건강 식품</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-4 border border-white/20">
                  <div className="text-white/70 text-sm mb-1">😴 수면</div>
                  <div className="text-white font-bold">충분한 휴식</div>
                  <div className="text-white/70 text-xs mt-1">하루 7-8시간 수면</div>
                </div>
              </div>

              <PremiumButton
                onClick={resetTest}
                variant="primary"
                size="lg"
                icon="🔄"
                fullWidth
              >
                다시 테스트하기
              </PremiumButton>
            </PremiumCard>

            {/* Related Apps */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <RelatedApps 
                relatedAppIds={['reflex-test', 'typing-speed-test', 'focus-timer', 'habit-tracker']} 
                currentAppId="eye-test" 
              />
            </div>
          </div>
        )}
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
