"use client";

import { useState } from 'react';

// 이시하라 색맹 검사 데이터 (숫자가 보이면 정상)
const COLOR_BLIND_TESTS = [
  { id: 1, number: '12', type: '적록색맹', colors: ['#e74c3c', '#27ae60'] },
  { id: 2, number: '8', type: '적록색맹', colors: ['#e67e22', '#2ecc71'] },
  { id: 3, number: '6', type: '적색맹', colors: ['#c0392b', '#7f8c8d'] },
  { id: 4, number: '29', type: '녹색맹', colors: ['#16a085', '#d35400'] },
  { id: 5, number: '5', type: '청황색맹', colors: ['#3498db', '#f39c12'] }
];

// 시력 검사 (E 방향)
const VISION_TESTS = [
  { size: 120, level: '0.1', direction: 'right' },
  { size: 100, level: '0.2', direction: 'left' },
  { size: 80, level: '0.3', direction: 'up' },
  { size: 60, level: '0.5', direction: 'down' },
  { size: 40, level: '0.7', direction: 'right' },
  { size: 30, level: '0.9', direction: 'left' },
  { size: 20, level: '1.2', direction: 'up' },
  { size: 15, level: '1.5', direction: 'down' },
  { size: 12, level: '2.0', direction: 'right' }
];

// 노안 검사 텍스트
const PRESBYOPIA_TEXTS = [
  { size: 24, text: '가까이 보면 선명하게 보이나요?', distance: '30cm' },
  { size: 18, text: '이 글자가 흐릿하게 보이나요?', distance: '30cm' },
  { size: 14, text: '작은 글씨를 읽기 힘드신가요?', distance: '30cm' },
  { size: 12, text: '스마트폰 문자가 잘 안 보이나요?', distance: '30cm' },
  { size: 10, text: '신문이나 책을 멀리해야 보이나요?', distance: '30cm' }
];

export default function EyeTest() {
  const [testType, setTestType] = useState<'menu' | 'colorblind' | 'vision' | 'presbyopia'>('menu');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const resetTest = () => {
    setTestType('menu');
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  const handleColorBlindAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentStep + 1 >= COLOR_BLIND_TESTS.length) {
      // 결과 계산
      const correctCount = newAnswers.filter((ans, idx) => ans === COLOR_BLIND_TESTS[idx].number).length;
      const percentage = Math.round((correctCount / COLOR_BLIND_TESTS.length) * 100);

      let diagnosis = '';
      let advice = '';

      if (percentage >= 80) {
        diagnosis = '정상 색각';
        advice = '색을 구분하는 능력이 정상입니다.';
      } else if (percentage >= 60) {
        diagnosis = '경미한 색약';
        advice = '약간의 색 구분 어려움이 있을 수 있습니다. 안과 검진 권장합니다.';
      } else {
        diagnosis = '색맹/색약 의심';
        advice = '정밀 검사를 위해 안과 방문을 권장합니다.';
      }

      setResult({
        type: 'colorblind',
        score: percentage,
        correct: correctCount,
        total: COLOR_BLIND_TESTS.length,
        diagnosis,
        advice
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleVisionAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    const currentTest = VISION_TESTS[currentStep];
    const isCorrect = answer === currentTest.direction;

    if (!isCorrect || currentStep + 1 >= VISION_TESTS.length) {
      // 결과 계산
      const lastCorrectIndex = newAnswers.findIndex((ans, idx) => ans !== VISION_TESTS[idx].direction);
      const visionLevel = lastCorrectIndex === -1 ? VISION_TESTS[VISION_TESTS.length - 1].level : VISION_TESTS[Math.max(0, lastCorrectIndex - 1)].level;

      let diagnosis = '';
      let advice = '';

      const vision = parseFloat(visionLevel);
      if (vision >= 1.0) {
        diagnosis = '정상 시력';
        advice = '시력이 매우 좋습니다!';
      } else if (vision >= 0.7) {
        diagnosis = '경미한 시력 저하';
        advice = '일상생활에는 문제 없으나, 정기 검진 권장합니다.';
      } else if (vision >= 0.5) {
        diagnosis = '시력 저하';
        advice = '안경이나 렌즈 착용을 고려하세요.';
      } else {
        diagnosis = '심한 시력 저하';
        advice = '안과 검진 및 시력 교정이 필요합니다.';
      }

      setResult({
        type: 'vision',
        visionLevel,
        diagnosis,
        advice
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePresbiopiaAnswer = (canSee: boolean) => {
    const newAnswers = [...answers, canSee ? 'yes' : 'no'];
    setAnswers(newAnswers);

    if (currentStep + 1 >= PRESBYOPIA_TEXTS.length) {
      // 결과 계산
      const yesCount = newAnswers.filter(ans => ans === 'yes').length;
      const noCount = newAnswers.filter(ans => ans === 'no').length;

      let diagnosis = '';
      let advice = '';

      if (noCount >= 4) {
        diagnosis = '노안 의심';
        advice = '40세 이상이라면 정상적인 노화 과정입니다. 돋보기나 노안 안경 착용을 고려하세요.';
      } else if (noCount >= 2) {
        diagnosis = '경미한 노안';
        advice = '가까운 글씨가 약간 불편할 수 있습니다. 정기 검진을 받으세요.';
      } else {
        diagnosis = '정상 근거리 시력';
        advice = '현재 노안 증상은 없습니다.';
      }

      setResult({
        type: 'presbyopia',
        yesCount,
        noCount,
        diagnosis,
        advice
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // 결과 화면
  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">👁️</h1>
              <h2 className="text-2xl font-bold text-gray-800">
                {result.type === 'colorblind' ? '색맹 검사 결과' :
                 result.type === 'vision' ? '시력 검사 결과' :
                 '노안 검사 결과'}
              </h2>
            </header>

            <div className={`mb-6 p-6 rounded-xl text-center border-4 ${
              result.diagnosis.includes('정상') ? 'bg-green-50 border-green-400' :
              result.diagnosis.includes('경미') ? 'bg-yellow-50 border-yellow-400' :
              'bg-orange-50 border-orange-400'
            }`}>
              <div className="text-5xl font-bold mb-3" style={{
                background: result.diagnosis.includes('정상') ? 'linear-gradient(135deg, #10b981, #059669)' :
                           result.diagnosis.includes('경미') ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                           'linear-gradient(135deg, #f97316, #ea580c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {result.diagnosis}
              </div>

              {result.type === 'colorblind' && (
                <div className="text-lg text-gray-700 mb-2">
                  정답: {result.correct} / {result.total} ({result.score}%)
                </div>
              )}

              {result.type === 'vision' && (
                <div className="text-4xl font-bold text-black my-3">
                  시력: {result.visionLevel}
                </div>
              )}

              <p className="text-gray-700 mt-3">{result.advice}</p>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">⚠️ 주의사항</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="bg-white rounded p-3">
                  • 이 검사는 간이 검사로 참고용입니다
                </div>
                <div className="bg-white rounded p-3">
                  • 정확한 진단은 안과 전문의 검진 필요
                </div>
                <div className="bg-white rounded p-3">
                  • 모니터 밝기와 거리를 적절히 조정하세요
                </div>
                <div className="bg-white rounded p-3">
                  • 정기적인 안과 검진 권장 (1년 1회)
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">💡 눈 건강 관리법</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="bg-white rounded p-3">
                  🥕 비타민 A 풍부한 식품: 당근, 블루베리
                </div>
                <div className="bg-white rounded p-3">
                  💧 충분한 수분 섭취와 눈 깜빡임
                </div>
                <div className="bg-white rounded p-3">
                  📱 20-20-20 규칙: 20분마다 20초간 20피트(6m) 먼 곳 보기
                </div>
                <div className="bg-white rounded p-3">
                  🕶️ 자외선 차단: 선글라스 착용
                </div>
                <div className="bg-white rounded p-3">
                  😴 충분한 수면: 하루 7-8시간
                </div>
              </div>
            </div>

            <button
              onClick={resetTest}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              다른 검사하기
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8">
            
            <p className="text-xs text-gray-500 text-center px-4">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  // 메인 메뉴
  if (testType === 'menu') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <header className="text-center mb-6">
              <h1 className="text-4xl font-bold text-black mb-2">👁️</h1>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">눈 건강 종합 검사</h2>
              <p className="text-gray-600">검사할 항목을 선택하세요</p>
            </header>

            <div className="space-y-4 mb-6">
              <button
                onClick={() => { setTestType('colorblind'); setCurrentStep(0); setAnswers([]); }}
                className="w-full p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🎨 색맹 검사 (이시하라)</h3>
                    <p className="text-sm text-gray-600">색을 구분하는 능력 검사 (5문항)</p>
                  </div>
                  <div className="text-3xl">→</div>
                </div>
              </button>

              <button
                onClick={() => { setTestType('vision'); setCurrentStep(0); setAnswers([]); }}
                className="w-full p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">👓 시력 검사 (스넬렌)</h3>
                    <p className="text-sm text-gray-600">E자 방향으로 시력 측정</p>
                  </div>
                  <div className="text-3xl">→</div>
                </div>
              </button>

              <button
                onClick={() => { setTestType('presbyopia'); setCurrentStep(0); setAnswers([]); }}
                className="w-full p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">📖 노안 검사</h3>
                    <p className="text-sm text-gray-600">근거리 시력 저하 확인 (5문항)</p>
                  </div>
                  <div className="text-3xl">→</div>
                </div>
              </button>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-black mb-2">⚠️ 검사 전 확인사항</h3>
              <ul className="text-sm text-black space-y-1">
                <li>• 모니터와 30-40cm 거리 유지</li>
                <li>• 밝은 조명 환경에서 검사</li>
                <li>• 안경/렌즈 착용 상태로 검사</li>
                <li>• 피로하지 않을 때 검사</li>
              </ul>
            </div>
          </section>

          <footer className="mt-6 space-y-3 pb-8">
            
            <p className="text-xs text-gray-500 text-center px-4">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  // 색맹 검사
  if (testType === 'colorblind') {
    const test = COLOR_BLIND_TESTS[currentStep];
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-2">문제 {currentStep + 1} / {COLOR_BLIND_TESTS.length}</div>
              <h2 className="text-2xl font-bold text-gray-800">이 원 안의 숫자는?</h2>
            </div>

            {/* 색맹 검사 이미지 시뮬레이션 */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden" style={{
                background: `radial-gradient(circle, ${test.colors[0]} 0%, ${test.colors[1]} 100%)`
              }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl font-bold opacity-30" style={{ color: test.colors[0] }}>
                    {test.number}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {['12', '8', '6', '29', '5', '74', '안보임'].map(num => (
                <button
                  key={num}
                  onClick={() => handleColorBlindAnswer(num)}
                  className="py-4 bg-gray-100 hover:bg-blue-100 border-2 border-gray-300 hover:border-blue-500 rounded-lg font-bold text-gray-800 transition-all"
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={resetTest}
              className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
            >
              처음으로
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8">
            
            <p className="text-xs text-gray-500 text-center px-4">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  // 시력 검사
  if (testType === 'vision') {
    const test = VISION_TESTS[currentStep];
    const rotations = {
      up: 'rotate(-90deg)',
      down: 'rotate(90deg)',
      left: 'rotate(180deg)',
      right: 'rotate(0deg)'
    };

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-2">시력: {test.level}</div>
              <h2 className="text-2xl font-bold text-gray-800">E자가 가리키는 방향은?</h2>
            </div>

            <div className="mb-8 flex justify-center">
              <div 
                className="font-bold text-black"
                style={{ 
                  fontSize: `${test.size}px`,
                  transform: rotations[test.direction as keyof typeof rotations],
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}
              >
                E
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {(['up', 'down', 'left', 'right'] as const).map(dir => (
                <button
                  key={dir}
                  onClick={() => handleVisionAnswer(dir)}
                  className="py-6 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 hover:border-blue-500 rounded-lg font-bold text-gray-800 transition-all"
                >
                  {dir === 'up' ? '↑ 위' : dir === 'down' ? '↓ 아래' : dir === 'left' ? '← 왼쪽' : '→ 오른쪽'}
                </button>
              ))}
            </div>

            <button
              onClick={resetTest}
              className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
            >
              처음으로
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8">
            
            <p className="text-xs text-gray-500 text-center px-4">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  // 노안 검사
  if (testType === 'presbyopia') {
    const test = PRESBYOPIA_TEXTS[currentStep];
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-2">문제 {currentStep + 1} / {PRESBYOPIA_TEXTS.length}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                화면에서 {test.distance} 떨어져서 보세요
              </h2>
            </div>

            <div className="mb-8 p-8 bg-gray-50 rounded-lg text-center">
              <p 
                className="text-black leading-relaxed"
                style={{ fontSize: `${test.size}px` }}
              >
                {test.text}
              </p>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                위 글자가 선명하게 보이나요?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePresbiopiaAnswer(true)}
                  className="py-6 bg-green-100 hover:bg-green-200 border-2 border-green-300 hover:border-green-500 rounded-lg font-bold text-black transition-all"
                >
                  ✓ 예, 잘 보여요
                </button>
                <button
                  onClick={() => handlePresbiopiaAnswer(false)}
                  className="py-6 bg-red-100 hover:bg-red-200 border-2 border-red-300 hover:border-red-500 rounded-lg font-bold text-black transition-all"
                >
                  ✗ 아니오, 흐려요
                </button>
              </div>
            </div>

            <button
              onClick={resetTest}
              className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
            >
              처음으로
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8">
            
            <p className="text-xs text-gray-500 text-center px-4">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return null;
}

