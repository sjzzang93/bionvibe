"use client";

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import AdOverlay from '@/app/components/AdOverlay';

// PHQ-9 (Patient Health Questionnaire-9) 기반
// 실제 병원에서 사용하는 표준 우울증 선별 도구
const PHQ9_QUESTIONS = [
  {
    id: 1,
    question: '일상 활동에 대한 흥미나 즐거움이 거의 없음',
    category: 'interest'
  },
  {
    id: 2,
    question: '기분이 가라앉거나, 우울하거나, 희망이 없음',
    category: 'mood'
  },
  {
    id: 3,
    question: '잠들기 어렵거나 자주 깨거나 너무 많이 잠',
    category: 'sleep'
  },
  {
    id: 4,
    question: '피곤하고 기력이 없음',
    category: 'energy'
  },
  {
    id: 5,
    question: '식욕이 없거나 과식함',
    category: 'appetite'
  },
  {
    id: 6,
    question: '자신이 실패자라고 느끼거나, 자신 또는 가족을 실망시켰다고 느낌',
    category: 'selfworth'
  },
  {
    id: 7,
    question: '신문을 읽거나 TV를 보는 것과 같은 일에 집중하기 어려움',
    category: 'concentration'
  },
  {
    id: 8,
    question: '다른 사람들이 알아챌 정도로 움직임이나 말하는 속도가 느려졌거나, 반대로 너무 안절부절못해서 가만히 있지 못함',
    category: 'psychomotor'
  },
  {
    id: 9,
    question: '자신을 해치거나 차라리 죽는 것이 낫다는 생각',
    category: 'suicidal',
    critical: true
  }
];

const ANSWER_OPTIONS = [
  { value: 0, label: '전혀 없음', color: '#4ade80' },
  { value: 1, label: '며칠 동안', color: '#fbbf24' },
  { value: 2, label: '절반 이상의 날', color: '#fb923c' },
  { value: 3, label: '거의 매일', color: '#ef4444' }
];

const SEVERITY_LEVELS = [
  {
    range: [0, 4],
    level: '최소한의 우울',
    color: '#4ade80',
    description: '현재 우울증 증상이 거의 없는 상태입니다.',
    recommendation: '건강한 생활 습관을 유지하세요.'
  },
  {
    range: [5, 9],
    level: '경미한 우울',
    color: '#fbbf24',
    description: '경미한 우울 증상이 있습니다.',
    recommendation: '스트레스 관리와 충분한 휴식을 취하세요. 증상이 지속되면 전문가 상담을 고려하세요.'
  },
  {
    range: [10, 14],
    level: '중등도 우울',
    color: '#fb923c',
    description: '중등도의 우울 증상이 있습니다.',
    recommendation: '정신건강의학과 전문의 상담을 권장합니다. 적절한 치료가 도움이 될 수 있습니다.'
  },
  {
    range: [15, 19],
    level: '중증 우울',
    color: '#ef4444',
    description: '중증의 우울 증상이 있습니다.',
    recommendation: '반드시 정신건강의학과 전문의의 진료를 받으시기 바랍니다.'
  },
  {
    range: [20, 27],
    level: '매우 심각한 우울',
    color: '#dc2626',
    description: '매우 심각한 우울 증상이 있습니다.',
    recommendation: '즉시 정신건강의학과 전문의의 진료를 받으시기 바랍니다. 필요시 응급 상담(☎1577-0199, 24시간)을 이용하세요.'
  }
];

interface Answer {
  questionId: number;
  value: number;
}

export default function UltraThinkDepressionTest() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<typeof SEVERITY_LEVELS[0] | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const spheresRef = useRef<THREE.Mesh[]>([]);
  const animationIdRef = useRef<number | null>(null);

  // 3D 배경 설정
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 조명
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4169e1, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // 떠다니는 구체들 생성
    const spheres: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 1 + 0.5, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
        transparent: true,
        opacity: 0.6,
        emissive: new THREE.Color().setHSL(Math.random(), 0.5, 0.3),
        emissiveIntensity: 0.5
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );

      sphere.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      };

      scene.add(sphere);
      spheres.push(sphere);
    }

    spheresRef.current = spheres;

    // 애니메이션
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      spheres.forEach((sphere) => {
        sphere.position.add(sphere.userData.velocity);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;

        // 경계 체크
        if (Math.abs(sphere.position.x) > 25) sphere.userData.velocity.x *= -1;
        if (Math.abs(sphere.position.y) > 25) sphere.userData.velocity.y *= -1;
        if (Math.abs(sphere.position.z) > 25) sphere.userData.velocity.z *= -1;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 클린업
    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);

      if (renderer && renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer?.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(mat => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });

      sceneRef.current = null;
      rendererRef.current = null;
      spheresRef.current = [];
    };
  }, []);

  // 구체 색상 업데이트 (질문 진행도에 따라)
  useEffect(() => {
    if (currentStep !== 'test') return;

    const progress = currentQuestion / PHQ9_QUESTIONS.length;
    const hue = 0.6 - progress * 0.3; // 파란색에서 빨간색으로

    spheresRef.current.forEach((sphere, index) => {
      const material = sphere.material as THREE.MeshPhongMaterial;
      material.color.setHSL(hue + (index * 0.05), 0.7, 0.5);
      material.emissive.setHSL(hue + (index * 0.05), 0.5, 0.3);
    });
  }, [currentQuestion, currentStep]);

  const startTest = () => {
    setCurrentStep('test');
    setAnswers([]);
    setCurrentQuestion(0);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, { questionId: PHQ9_QUESTIONS[currentQuestion].id, value }];
    setAnswers(newAnswers);

    if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 결과 계산
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Answer[]) => {
    const totalScore = finalAnswers.reduce((sum, answer) => sum + answer.value, 0);
    const severity = SEVERITY_LEVELS.find(
      level => totalScore >= level.range[0] && totalScore <= level.range[1]
    );

    setResult(severity || SEVERITY_LEVELS[0]);
    setCurrentStep('result');
  };

  const resetTest = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const getTotalScore = () => {
    return answers.reduce((sum, answer) => sum + answer.value, 0);
  };

  const getSuicidalAnswer = () => {
    return answers.find(a => a.questionId === 9);
  };

  return (
    <PremiumLayout theme="purple">
      
        <AdOverlay />{/* 3D 배경 */}
      <div
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-30"
        style={{ pointerEvents: 'none' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              UltraThink 우울증 자가진단
            </span>
          </h1>
          <p className="text-xl text-white/80">
            PHQ-9 기반 표준 우울증 선별검사
          </p>
        </div>

        {/* 인트로 화면 */}
        {currentStep === 'intro' && (
          <div className="space-y-6 animate-slideUp">
            <PremiumCard hover gradient>
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🧠</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  PHQ-9 우울증 선별검사
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  이 검사는 전 세계 병원과 정신건강의학과에서 사용하는<br />
                  <span className="font-bold text-white">PHQ-9 (Patient Health Questionnaire-9)</span> 표준 도구입니다.
                </p>
                <div className="bg-white/10 rounded-lg p-6 text-left space-y-3">
                  <h3 className="text-white font-bold text-xl mb-3">📋 검사 안내</h3>
                  <ul className="text-white/90 space-y-2">
                    <li>• 총 9개 문항으로 구성되어 있습니다</li>
                    <li>• 지난 2주 동안의 상태를 기준으로 답변해주세요</li>
                    <li>• 각 문항은 0~3점으로 평가됩니다</li>
                    <li>• 소요 시간: 약 3~5분</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-left">
                  <p className="text-yellow-200 text-sm leading-relaxed">
                    ⚠️ <span className="font-bold">중요한 안내사항</span><br />
                    이 검사는 선별 도구일 뿐이며, 정확한 진단은 정신건강의학과 전문의의 진료를 통해서만 가능합니다.
                    검사 결과가 우려되는 경우 반드시 전문가와 상담하시기 바랍니다.
                  </p>
                </div>

                <PremiumButton
                  onClick={startTest}
                  variant="primary"
                  size="lg"
                  icon="🎯"
                  fullWidth
                >
                  검사 시작하기
                </PremiumButton>
              </div>
            </PremiumCard>

            <PremiumCard hover>
              <div className="text-white/70 text-sm space-y-2">
                <p className="font-bold text-white mb-3">💡 도움이 필요하신가요?</p>
                <p>• 정신건강 위기상담 전화: <span className="text-white font-bold">☎ 1577-0199</span> (24시간)</p>
                <p>• 자살예방 상담전화: <span className="text-white font-bold">☎ 1393</span> (24시간)</p>
                <p>• 청소년 전화: <span className="text-white font-bold">☎ 1388</span> (24시간)</p>
              </div>
            </PremiumCard>
          </div>
        )}

        {/* 테스트 화면 */}
        {currentStep === 'test' && (
          <div className="space-y-6 animate-slideUp">
            {/* 진행도 */}
            <PremiumCard hover>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">
                  질문 {currentQuestion + 1} / {PHQ9_QUESTIONS.length}
                </span>
                <span className="text-white/70 text-sm">
                  {Math.round(((currentQuestion + 1) / PHQ9_QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / PHQ9_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </PremiumCard>

            {/* 질문 */}
            <PremiumCard hover gradient className="animate-scaleIn">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">
                  {PHQ9_QUESTIONS[currentQuestion].critical ? '⚠️' : '💭'}
                </div>
                <h3 className="text-white/70 text-sm mb-3">
                  지난 2주 동안, 다음 문제로 얼마나 자주 시달렸습니까?
                </h3>
                <p className="text-white text-2xl font-bold leading-relaxed">
                  {PHQ9_QUESTIONS[currentQuestion].question}
                </p>
              </div>

              {PHQ9_QUESTIONS[currentQuestion].critical && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200 text-sm">
                    이 문항에 '며칠 동안' 이상으로 답하시는 경우, 즉시 전문가 상담을 받으시기 바랍니다.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {ANSWER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${option.color}40, ${option.color}20)`,
                      border: `2px solid ${option.color}60`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-lg">{option.label}</span>
                      <span
                        className="text-2xl font-bold opacity-50 group-hover:opacity-100 transition-opacity"
                        style={{ color: option.color }}
                      >
                        {option.value}점
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </PremiumCard>
          </div>
        )}

        {/* 결과 화면 */}
        {currentStep === 'result' && result && (
          <div className="space-y-6 animate-fadeIn">
            <PremiumCard hover gradient className="animate-scaleIn">
              <div className="text-center space-y-6">
                <div className="text-8xl animate-bounce-slow">
                  {getTotalScore() < 5 ? '😊' : getTotalScore() < 10 ? '😐' : getTotalScore() < 15 ? '😟' : getTotalScore() < 20 ? '😢' : '😰'}
                </div>

                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">검사 결과</h2>
                  <div
                    className="inline-block px-6 py-3 rounded-full text-2xl font-bold"
                    style={{ backgroundColor: result.color + '40', color: result.color }}
                  >
                    {result.level}
                  </div>
                </div>

                <div className="text-6xl font-bold" style={{ color: result.color }}>
                  {getTotalScore()}점
                </div>

                <div className="bg-white/10 rounded-lg p-6 text-left space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">📊 결과 분석</h3>
                    <p className="text-white/90">{result.description}</p>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-2">💡 권장사항</h3>
                    <p className="text-white/90">{result.recommendation}</p>
                  </div>

                  {getSuicidalAnswer() && getSuicidalAnswer()!.value > 0 && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                      <h3 className="text-red-200 font-bold mb-2">⚠️ 긴급 알림</h3>
                      <p className="text-red-200 text-sm mb-3">
                        자해나 자살에 대한 생각이 있으시다면, 즉시 전문가의 도움을 받으시기 바랍니다.
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-white">• 정신건강 위기상담: <span className="font-bold">☎ 1577-0199</span></p>
                        <p className="text-white">• 자살예방 상담전화: <span className="font-bold">☎ 1393</span></p>
                        <p className="text-white">• 응급실 방문 또는 119 신고</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-9 gap-2">
                  {answers.map((answer, idx) => (
                    <div
                      key={idx}
                      className="relative group"
                    >
                      <div
                        className="w-full aspect-square rounded-lg flex items-center justify-center font-bold text-white cursor-pointer transition-transform hover:scale-110"
                        style={{
                          backgroundColor: ANSWER_OPTIONS[answer.value].color + '80'
                        }}
                      >
                        {answer.value}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Q{idx + 1}: {ANSWER_OPTIONS[answer.value].label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/20">
                  <p className="text-white/70 text-sm mb-4">
                    💡 이 결과는 선별검사 결과이며, 정확한 진단과 치료는 정신건강의학과 전문의와 상담하시기 바랍니다.
                  </p>
                  <PremiumButton
                    onClick={resetTest}
                    variant="secondary"
                    size="lg"
                    icon="🔄"
                    fullWidth
                  >
                    다시 검사하기
                  </PremiumButton>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard hover>
              <h3 className="text-white font-bold text-xl mb-4">🏥 전문가 상담 안내</h3>
              <div className="text-white/80 space-y-3 text-sm">
                <p>
                  우울증은 적절한 치료를 통해 충분히 회복 가능한 질환입니다.
                  혼자 고민하지 마시고 전문가의 도움을 받으시기 바랍니다.
                </p>
                <div className="bg-white/10 rounded-lg p-4 space-y-2">
                  <p className="font-bold text-white">📞 도움 받을 수 있는 곳</p>
                  <p>• 가까운 정신건강의학과</p>
                  <p>• 정신건강복지센터 (☎ 1577-0199)</p>
                  <p>• 자살예방상담전화 (☎ 1393)</p>
                  <p>• 청소년상담전화 (☎ 1388)</p>
                </div>
              </div>
            </PremiumCard>
          </div>
        )}

        <div className="mt-12">
          <RelatedApps currentAppSlug="ultrathink-depression-test" />
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: scale(1) rotate(-5deg);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </PremiumLayout>
  );
}
