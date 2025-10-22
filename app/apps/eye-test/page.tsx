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

// 색맹 검사 데이터 (이시하라 스타일)
const COLOR_BLIND_TESTS = [
  { answer: '8', colors: ['#e74c3c', '#c0392b'], bgColors: ['#2ecc71', '#27ae60'] },
  { answer: '6', colors: ['#f39c12', '#e67e22'], bgColors: ['#3498db', '#2980b9'] },
  { answer: '45', colors: ['#9b59b6', '#8e44ad'], bgColors: ['#1abc9c', '#16a085'] },
  { answer: '12', colors: ['#e67e22', '#d35400'], bgColors: ['#95a5a6', '#7f8c8d'] },
  { answer: '5', colors: ['#c0392b', '#a93226'], bgColors: ['#27ae60', '#229954'] }
];

// 노안 검사 데이터
const PRESBYOPIA_TESTS = [
  { size: 18, text: '독서는 마음의 양식입니다', distance: '30cm' },
  { size: 16, text: '건강한 눈을 위해 휴식이 필요합니다', distance: '30cm' },
  { size: 14, text: '작은 글씨도 잘 보이시나요?', distance: '30cm' },
  { size: 12, text: '노안은 자연스러운 노화 현상입니다', distance: '30cm' },
  { size: 10, text: '정기적인 안과 검진을 권장합니다', distance: '30cm' }
];

export default function EyeTest() {
  const [testType, setTestType] = useState<'vision' | 'colorBlind' | 'presbyopia' | null>(null);
  const [testMode, setTestMode] = useState<'menu' | 'testing' | 'result'>('menu');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (testType === 'vision') {
      const currentTest = VISION_TESTS[currentStep];
      const isCorrect = answer === currentTest.direction;

      if (!isCorrect || currentStep + 1 >= VISION_TESTS.length) {
        // 결과 계산
        const correctAnswers = newAnswers.filter((ans, idx) => ans === VISION_TESTS[idx].direction);
        const visionLevel = correctAnswers.length > 0 ? VISION_TESTS[correctAnswers.length - 1].level : '0.1';

        setResult({
          visionLevel,
          correctCount: correctAnswers.length,
          total: VISION_TESTS.length,
          type: 'vision'
        });
        setTestMode('result');
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else if (testType === 'colorBlind') {
      const currentTest = COLOR_BLIND_TESTS[currentStep];
      const isCorrect = answer === currentTest.answer;

      if (currentStep + 1 >= COLOR_BLIND_TESTS.length) {
        // 결과 계산
        const correctAnswers = newAnswers.filter((ans, idx) => ans === COLOR_BLIND_TESTS[idx].answer);
        setResult({
          correctCount: correctAnswers.length,
          total: COLOR_BLIND_TESTS.length,
          type: 'colorBlind'
        });
        setTestMode('result');
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else if (testType === 'presbyopia') {
      // 노안 테스트는 읽을 수 있는지만 확인
      if (currentStep + 1 >= PRESBYOPIA_TESTS.length) {
        const readableCount = newAnswers.filter(ans => ans === 'yes').length;
        setResult({
          readableCount,
          total: PRESBYOPIA_TESTS.length,
          type: 'presbyopia'
        });
        setTestMode('result');
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const resetTest = () => {
    setTestType(null);
    setTestMode('menu');
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  const startTest = (type: 'vision' | 'colorBlind' | 'presbyopia') => {
    setTestType(type);
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
          <div className="space-y-6 animate-slideUp">
            <PremiumCard hover gradient className="text-center">
              <div className="text-8xl mb-8 animate-float">👁️</div>
              <h2 className="text-3xl font-bold text-white mb-4">눈 건강 테스트</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                원하시는 테스트를 선택하세요
              </p>
            </PremiumCard>

            <div className="grid md:grid-cols-3 gap-6">
              {/* 시력 테스트 */}
              <PremiumCard hover gradient className="text-center cursor-pointer" onClick={() => startTest('vision')}>
                <div className="text-6xl mb-4">👀</div>
                <h3 className="text-2xl font-bold text-white mb-3">시력 테스트</h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  화살표 방향을 맞춰<br />시력을 측정하세요
                </p>
                <PremiumButton
                  variant="primary"
                  size="md"
                  icon="▶"
                  fullWidth
                >
                  시작하기
                </PremiumButton>
              </PremiumCard>

              {/* 색맹 테스트 */}
              <PremiumCard hover gradient className="text-center cursor-pointer" onClick={() => startTest('colorBlind')}>
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-3">색맹 테스트</h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  색상판에서 숫자를<br />찾아보세요
                </p>
                <PremiumButton
                  variant="primary"
                  size="md"
                  icon="▶"
                  fullWidth
                >
                  시작하기
                </PremiumButton>
              </PremiumCard>

              {/* 노안 테스트 */}
              <PremiumCard hover gradient className="text-center cursor-pointer" onClick={() => startTest('presbyopia')}>
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-white mb-3">노안 테스트</h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  작은 글씨를<br />읽을 수 있는지 확인하세요
                </p>
                <PremiumButton
                  variant="primary"
                  size="md"
                  icon="▶"
                  fullWidth
                >
                  시작하기
                </PremiumButton>
              </PremiumCard>
            </div>

            <PremiumCard className="text-center">
              <div className="text-white/60 text-sm">
                💡 정확한 검사를 위해 밝은 곳에서 테스트하세요
              </div>
            </PremiumCard>
          </div>
        )}

        {/* Testing */}
        {testMode === 'testing' && testType && (
          <div className="space-y-6 animate-fadeIn">
            {/* Progress */}
            <PremiumCard className="text-center">
              <div className="text-white text-lg font-bold mb-2">
                {currentStep + 1} / {
                  testType === 'vision' ? VISION_TESTS.length :
                  testType === 'colorBlind' ? COLOR_BLIND_TESTS.length :
                  PRESBYOPIA_TESTS.length
                }
              </div>
              {testType === 'vision' && (
                <div className="text-white/70 text-sm mb-2">
                  현재 시력: {VISION_TESTS[currentStep].level}
                </div>
              )}
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((currentStep + 1) / (
                      testType === 'vision' ? VISION_TESTS.length :
                      testType === 'colorBlind' ? COLOR_BLIND_TESTS.length :
                      PRESBYOPIA_TESTS.length
                    )) * 100}%` 
                  }}
                ></div>
              </div>
            </PremiumCard>

            {/* 시력 테스트 */}
            {testType === 'vision' && (
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
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
            )}

            {/* 색맹 테스트 */}
            {testType === 'colorBlind' && (
              <PremiumCard hover gradient className="text-center py-16">
                <div className="mb-8">
                  <div className="text-white text-xl mb-4">이 원 안에 어떤 숫자가 보이나요?</div>
                  {/* 색맹 검사판 */}
                  <div className="inline-block relative w-80 h-80 rounded-full overflow-hidden">
                    {/* 배경 점들 */}
                    <svg width="320" height="320" viewBox="0 0 320 320">
                      {Array.from({ length: 200 }).map((_, i) => {
                        const angle = (Math.random() * Math.PI * 2);
                        const radius = Math.random() * 150;
                        const cx = 160 + Math.cos(angle) * radius;
                        const cy = 160 + Math.sin(angle) * radius;
                        const size = 8 + Math.random() * 8;
                        const bgColor = COLOR_BLIND_TESTS[currentStep].bgColors[Math.floor(Math.random() * 2)];
                        return (
                          <circle
                            key={`bg-${i}`}
                            cx={cx}
                            cy={cy}
                            r={size}
                            fill={bgColor}
                          />
                        );
                      })}
                      {/* 숫자 형성 점들 */}
                      <text
                        x="160"
                        y="190"
                        fontSize="120"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill={COLOR_BLIND_TESTS[currentStep].colors[0]}
                        style={{ fontFamily: 'Arial, sans-serif' }}
                      >
                        {COLOR_BLIND_TESTS[currentStep].answer}
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="숫자를 입력하세요"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white text-center text-2xl placeholder-white/50 focus:outline-none focus:border-white/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleAnswer(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    autoFocus
                  />
                  <div className="text-white/60 text-sm">
                    숫자가 보이지 않으면 "0"을 입력하세요
                  </div>
                </div>
              </PremiumCard>
            )}

            {/* 노안 테스트 */}
            {testType === 'presbyopia' && (
              <PremiumCard hover gradient className="text-center py-16">
                <div className="mb-8">
                  <div className="text-white text-xl mb-6">
                    📱 화면에서 {PRESBYOPIA_TESTS[currentStep].distance} 떨어져서<br />
                    아래 글씨를 읽어보세요
                  </div>
                  <div 
                    className="text-white font-medium leading-relaxed"
                    style={{ 
                      fontSize: `${PRESBYOPIA_TESTS[currentStep].size}px`
                    }}
                  >
                    {PRESBYOPIA_TESTS[currentStep].text}
                  </div>
                </div>

                <div className="text-white/80 mb-8 text-lg">이 글씨가 읽히시나요?</div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <PremiumButton
                    onClick={() => handleAnswer('yes')}
                    variant="primary"
                    size="lg"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">✅</span>
                      <span>잘 보여요</span>
                    </div>
                  </PremiumButton>
                  <PremiumButton
                    onClick={() => handleAnswer('no')}
                    variant="primary"
                    size="lg"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">❌</span>
                      <span>안 보여요</span>
                    </div>
                  </PremiumButton>
                </div>
              </PremiumCard>
            )}
          </div>
        )}

        {/* Result */}
        {testMode === 'result' && result && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient className="text-center">
              {/* 시력 테스트 결과 */}
              {result.type === 'vision' && (
                <>
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
                </>
              )}

              {/* 색맹 테스트 결과 */}
              {result.type === 'colorBlind' && (
                <>
                  <div className="text-8xl mb-6 animate-bounce-slow">
                    {result.correctCount >= 4 ? '🎨' : result.correctCount >= 2 ? '🤔' : '⚠️'}
                  </div>
                  <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                    {result.correctCount} / {result.total} 정답
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/10 mb-6">
                    <h3 className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-xl">검사 결과</h3>
                    <p className="text-white/90 leading-relaxed">
                      {result.correctCount >= 4
                        ? '색상 인식이 정상입니다! 색맹 증상이 없습니다.'
                        : result.correctCount >= 2
                          ? '일부 색상 구분에 어려움이 있을 수 있습니다. 안과 검진을 권장합니다.'
                          : '색맹 증상이 의심됩니다. 전문의 상담이 필요합니다.'}
                    </p>
                  </div>
                </>
              )}

              {/* 노안 테스트 결과 */}
              {result.type === 'presbyopia' && (
                <>
                  <div className="text-8xl mb-6 animate-bounce-slow">
                    {result.readableCount >= 4 ? '📖' : result.readableCount >= 2 ? '👓' : '🔍'}
                  </div>
                  <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                    {result.readableCount} / {result.total} 읽음
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-6 border border-white/10 mb-6">
                    <h3 className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2 text-xl">검사 결과</h3>
                    <p className="text-white/90 leading-relaxed">
                      {result.readableCount >= 4
                        ? '근거리 시력이 양호합니다! 노안 증상이 없습니다.'
                        : result.readableCount >= 2
                          ? '경미한 노안 증상이 있을 수 있습니다. 돋보기 안경을 고려해보세요.'
                          : '노안 증상이 있습니다. 안과에서 적절한 교정 렌즈를 처방받으세요.'}
                    </p>
                  </div>
                </>
              )}

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-4 border border-white/20">
                  <div className="text-white/70 text-sm mb-1">👁️ 눈 휴식</div>
                  <div className="text-white font-bold text-sm">20-20-20 규칙</div>
                  <div className="text-white/70 text-xs mt-1">20분마다 20초간 먼 곳 보기</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-4 border border-white/20">
                  <div className="text-white/70 text-sm mb-1">🥕 영양</div>
                  <div className="text-white font-bold text-sm">비타민 A</div>
                  <div className="text-white/70 text-xs mt-1">당근, 시금치 섭취</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded sm:rounded-lg md:rounded-2xl p-4 border border-white/20">
                  <div className="text-white/70 text-sm mb-1">😴 수면</div>
                  <div className="text-white font-bold text-sm">충분한 휴식</div>
                  <div className="text-white/70 text-xs mt-1">7-8시간 수면</div>
                </div>
              </div>

              <PremiumButton
                onClick={resetTest}
                variant="primary"
                size="lg"
                icon="🔄"
                fullWidth
              >
                다른 테스트 하기
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
