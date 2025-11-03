'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// 난이도 등급
type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'hell';

// 스탯 타입
interface Stats {
  health: number; // 체력
  wealth: number; // 금전운
  social: number; // 사회성
  mental: number; // 멘탈
  luck: number; // 행운
}

// 설문 데이터
interface FormData {
  age: number;
  jobStatus: string;
  income: string;
  health: string;
  sleepHours: number;
  relationships: string[];
  housing: string;
  debt: string;
  family: string;
  hobby: string;
  exercise: string;
  stress: string;
}

// 난이도 뱃지
function DifficultyBadge({ difficulty, score }: { difficulty: DifficultyLevel; score: number }) {
  const configs = {
    easy: { name: '이지 모드', color: '#4ade80', emoji: '😊', desc: '축복받은 삶' },
    normal: { name: '노말 모드', color: '#60a5fa', emoji: '😐', desc: '평범한 일상' },
    hard: { name: '하드 모드', color: '#f59e0b', emoji: '😰', desc: '힘든 시기' },
    hell: { name: '헬 모드', color: '#ef4444', emoji: '💀', desc: '극한의 도전' },
  };

  const config = configs[difficulty];

  return (
    <group>
      {/* 메인 뱃지 */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshStandardMaterial color={config.color} emissive={config.color} emissiveIntensity={0.3} />
      </mesh>
      {/* 회전 링 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.1, 16, 100]} />
        <meshStandardMaterial color={config.color} emissive={config.color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function LifeDifficultyMeter() {
  const [step, setStep] = useState<'intro' | 'form' | 'result'>('intro');
  const [formData, setFormData] = useState<FormData>({
    age: 25,
    jobStatus: '',
    income: '',
    health: '',
    sleepHours: 7,
    relationships: [],
    housing: '',
    debt: '',
    family: '',
    hobby: '',
    exercise: '',
    stress: '',
  });
  const [stats, setStats] = useState<Stats>({ health: 0, wealth: 0, social: 0, mental: 0, luck: 0 });
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');
  const [totalScore, setTotalScore] = useState(0);

  // 난이도 계산 알고리즘 (방대한 데이터 기반)
  const calculateDifficulty = () => {
    let healthScore = 50;
    let wealthScore = 50;
    let socialScore = 50;
    let mentalScore = 50;
    let luckScore = 50;

    // 1. 체력 (Health) 계산
    if (formData.health === 'very-good') healthScore = 90;
    else if (formData.health === 'good') healthScore = 75;
    else if (formData.health === 'normal') healthScore = 60;
    else if (formData.health === 'bad') healthScore = 40;
    else if (formData.health === 'very-bad') healthScore = 20;

    // 수면 시간 보정
    if (formData.sleepHours >= 7 && formData.sleepHours <= 8) healthScore += 10;
    else if (formData.sleepHours >= 6 && formData.sleepHours < 7) healthScore += 5;
    else if (formData.sleepHours < 6) healthScore -= 15;
    else if (formData.sleepHours > 9) healthScore -= 5;

    // 운동 보정
    if (formData.exercise === 'daily') healthScore += 15;
    else if (formData.exercise === 'often') healthScore += 10;
    else if (formData.exercise === 'sometimes') healthScore += 5;
    else if (formData.exercise === 'rarely') healthScore -= 5;
    else if (formData.exercise === 'never') healthScore -= 10;

    // 2. 금전운 (Wealth) 계산
    if (formData.income === 'very-high') wealthScore = 95;
    else if (formData.income === 'high') wealthScore = 80;
    else if (formData.income === 'middle') wealthScore = 65;
    else if (formData.income === 'low') wealthScore = 45;
    else if (formData.income === 'very-low') wealthScore = 25;
    else if (formData.income === 'none') wealthScore = 10;

    // 주거 형태 보정
    if (formData.housing === 'own') wealthScore += 20;
    else if (formData.housing === 'jeonse') wealthScore += 10;
    else if (formData.housing === 'monthly') wealthScore -= 10;
    else if (formData.housing === 'parents') wealthScore += 15;
    else if (formData.housing === 'goshiwon') wealthScore -= 20;

    // 부채 보정
    if (formData.debt === 'none') wealthScore += 10;
    else if (formData.debt === 'small') wealthScore -= 5;
    else if (formData.debt === 'medium') wealthScore -= 15;
    else if (formData.debt === 'large') wealthScore -= 30;
    else if (formData.debt === 'huge') wealthScore -= 50;

    // 3. 사회성 (Social) 계산
    const relationshipCount = formData.relationships.length;
    if (relationshipCount >= 4) socialScore = 85;
    else if (relationshipCount === 3) socialScore = 70;
    else if (relationshipCount === 2) socialScore = 55;
    else if (relationshipCount === 1) socialScore = 40;
    else socialScore = 20;

    // 가족 관계 보정
    if (formData.family === 'very-good') socialScore += 15;
    else if (formData.family === 'good') socialScore += 10;
    else if (formData.family === 'normal') socialScore += 5;
    else if (formData.family === 'bad') socialScore -= 10;
    else if (formData.family === 'very-bad') socialScore -= 20;

    // 4. 멘탈 (Mental) 계산
    if (formData.stress === 'very-low') mentalScore = 90;
    else if (formData.stress === 'low') mentalScore = 75;
    else if (formData.stress === 'normal') mentalScore = 60;
    else if (formData.stress === 'high') mentalScore = 40;
    else if (formData.stress === 'very-high') mentalScore = 20;

    // 취미 보정
    if (formData.hobby === 'many') mentalScore += 15;
    else if (formData.hobby === 'some') mentalScore += 10;
    else if (formData.hobby === 'few') mentalScore += 5;
    else if (formData.hobby === 'none') mentalScore -= 10;

    // 5. 행운 (Luck) 계산 - 나이대별
    if (formData.age < 20) luckScore = 85; // 미성년 - 부모 보호
    else if (formData.age >= 20 && formData.age < 25) luckScore = 75; // 대학생 시기
    else if (formData.age >= 25 && formData.age < 30) luckScore = 60; // 취업/사회초년생
    else if (formData.age >= 30 && formData.age < 35) luckScore = 55; // 경력 쌓는 시기
    else if (formData.age >= 35 && formData.age < 40) luckScore = 50; // 커리어 중반
    else if (formData.age >= 40 && formData.age < 50) luckScore = 55; // 안정기
    else if (formData.age >= 50 && formData.age < 60) luckScore = 60; // 경제적 안정
    else luckScore = 70; // 은퇴 이후

    // 직업 상태 보정
    if (formData.jobStatus === 'stable-job') luckScore += 15;
    else if (formData.jobStatus === 'contract') luckScore += 5;
    else if (formData.jobStatus === 'freelance') luckScore += 0;
    else if (formData.jobStatus === 'business') luckScore += 10;
    else if (formData.jobStatus === 'student') luckScore += 10;
    else if (formData.jobStatus === 'job-seeking') luckScore -= 15;
    else if (formData.jobStatus === 'unemployed') luckScore -= 25;

    // 점수 제한 (0-100)
    healthScore = Math.max(0, Math.min(100, healthScore));
    wealthScore = Math.max(0, Math.min(100, wealthScore));
    socialScore = Math.max(0, Math.min(100, socialScore));
    mentalScore = Math.max(0, Math.min(100, mentalScore));
    luckScore = Math.max(0, Math.min(100, luckScore));

    // 총점 계산
    const total = Math.round((healthScore + wealthScore + socialScore + mentalScore + luckScore) / 5);

    // 난이도 판정
    let difficultyLevel: DifficultyLevel;
    if (total >= 80) difficultyLevel = 'easy';
    else if (total >= 60) difficultyLevel = 'normal';
    else if (total >= 40) difficultyLevel = 'hard';
    else difficultyLevel = 'hell';

    setStats({
      health: healthScore,
      wealth: wealthScore,
      social: socialScore,
      mental: mentalScore,
      luck: luckScore,
    });
    setTotalScore(total);
    setDifficulty(difficultyLevel);
    setStep('result');
  };

  // 난이도별 조언
  const getAdvice = () => {
    const adviceMap = {
      easy: {
        title: '🎉 축복받은 삶을 살고 계시네요!',
        desc: '현재 당신의 인생은 매우 순조롭게 흘러가고 있습니다. 이 상태를 유지하면서 더 큰 목표를 향해 나아가세요.',
        tips: [
          '✨ 현재의 안정을 바탕으로 새로운 도전을 시도해보세요',
          '💝 주변 사람들과 행복을 나누고 감사함을 표현하세요',
          '📚 자기계발에 투자하여 더 높은 단계로 성장하세요',
          '🎯 장기적인 목표를 세우고 체계적으로 실행하세요',
        ],
      },
      normal: {
        title: '😊 평범하지만 안정적인 삶',
        desc: '특별히 나쁘지도, 특별히 좋지도 않은 평범한 일상입니다. 작은 변화로 더 나은 삶을 만들 수 있습니다.',
        tips: [
          '🏃 규칙적인 운동으로 체력과 멘탈 동시 UP',
          '💰 수입을 늘리거나 지출을 줄이는 방법 모색',
          '👥 인간관계를 더 넓히고 깊게 만들기',
          '🎨 새로운 취미를 시작하여 삶의 활력 찾기',
        ],
      },
      hard: {
        title: '😰 힘든 시기를 겪고 계시는군요',
        desc: '현재 여러 어려움이 겹쳐 힘든 시기입니다. 하지만 이 또한 지나갈 것입니다. 하나씩 해결해나가세요.',
        tips: [
          '🆘 전문가의 도움이 필요하다면 주저하지 말고 요청하세요',
          '💪 가장 급한 문제부터 우선순위를 정해 해결하세요',
          '😴 충분한 수면과 휴식으로 체력을 회복하세요',
          '🤝 가족이나 친구에게 솔직하게 도움을 청하세요',
          '📝 작은 성취라도 기록하며 자신감을 회복하세요',
        ],
      },
      hell: {
        title: '💀 극한의 도전 중입니다',
        desc: '현재 매우 어려운 상황에 처해있습니다. 혼자 해결하려 하지 말고 반드시 도움을 받으세요.',
        tips: [
          '🚨 즉시 전문가(상담사, 의사, 사회복지사)의 도움을 받으세요',
          '📞 자살예방상담전화 1393, 정신건강위기상담 1577-0199',
          '🏥 가까운 보건소나 정신건강복지센터를 방문하세요',
          '💊 건강이 가장 우선입니다. 병원 진료를 받으세요',
          '🆘 정부 지원 제도를 적극 활용하세요 (복지로 www.bokjiro.go.kr)',
          '⏸️ 지금은 생존이 목표입니다. 완벽하지 않아도 괜찮습니다',
        ],
      },
    };

    return adviceMap[difficulty];
  };

  // 스탯별 개선 방법
  const getStatAdvice = (stat: keyof Stats, value: number) => {
    const adviceMap = {
      health: {
        low: ['매일 30분 걷기 시작하기', '물 2L 마시기', '규칙적인 수면 패턴', '건강검진 받기'],
        high: ['현재 건강 유지하기', '고강도 운동 도전', '균형잡힌 영양 섭취'],
      },
      wealth: {
        low: ['부업/투잡 알아보기', '고정 지출 줄이기', '정부 지원금 신청', '금융교육 받기'],
        high: ['투자 포트폴리오 구성', '비상금 만들기', '장기 재테크 계획'],
      },
      social: {
        low: ['소모임 가입하기', '먼저 연락하기', '경청하는 습관 기르기', '온라인 커뮤니티 참여'],
        high: ['깊이있는 관계 유지', '네트워킹 확장', '멘토-멘티 관계'],
      },
      mental: {
        low: ['명상 앱 사용하기', '일기 쓰기', '상담 받기', '스트레스 해소법 찾기'],
        high: ['마음챙김 실천', '감사 일기', '긍정적 사고 유지'],
      },
      luck: {
        low: ['새로운 시도하기', '긍정적 마인드', '네트워크 확장', '기회 포착하기'],
        high: ['현재 기회 활용', '도전적 목표 설정', '주변에 베풀기'],
      },
    };

    const statName = stat as keyof typeof adviceMap;
    return value < 50 ? adviceMap[statName].low : adviceMap[statName].high;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* 인트로 */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <h1 className="text-5xl font-bold mb-4">🎮 인생 난이도 측정기</h1>
              <p className="text-xl text-gray-300">당신의 삶을 RPG 게임 난이도로 분석합니다</p>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-4">
                <h2 className="text-2xl font-bold">측정 항목</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-2xl mb-1">💪</div>
                    <div className="font-semibold">체력</div>
                    <div className="text-sm text-gray-400">건강, 수면, 운동</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="font-semibold">금전운</div>
                    <div className="text-sm text-gray-400">수입, 주거, 부채</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="font-semibold">사회성</div>
                    <div className="text-sm text-gray-400">인간관계, 가족</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-2xl mb-1">🧠</div>
                    <div className="font-semibold">멘탈</div>
                    <div className="text-sm text-gray-400">스트레스, 취미</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-2xl mb-1">🍀</div>
                    <div className="font-semibold">행운</div>
                    <div className="text-sm text-gray-400">나이, 직업, 타이밍</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">난이도 등급</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-green-500/20 p-3 rounded-lg">
                    <span className="font-semibold">😊 이지 모드</span>
                    <span className="text-sm">80-100점</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-500/20 p-3 rounded-lg">
                    <span className="font-semibold">😐 노말 모드</span>
                    <span className="text-sm">60-79점</span>
                  </div>
                  <div className="flex items-center justify-between bg-orange-500/20 p-3 rounded-lg">
                    <span className="font-semibold">😰 하드 모드</span>
                    <span className="text-sm">40-59점</span>
                  </div>
                  <div className="flex items-center justify-between bg-red-500/20 p-3 rounded-lg">
                    <span className="font-semibold">💀 헬 모드</span>
                    <span className="text-sm">0-39점</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('form')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-4 rounded-full text-xl font-bold transition-all transform hover:scale-105"
              >
                측정 시작하기
              </button>
            </motion.div>
          )}

          {/* 설문 폼 */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold text-center mb-8">인생 난이도 측정</h1>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6">
                {/* 나이 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">나이</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="만 나이"
                  />
                </div>

                {/* 직업 상태 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">직업 상태</label>
                  <select
                    value={formData.jobStatus}
                    onChange={(e) => setFormData({ ...formData, jobStatus: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="stable-job" className="bg-gray-800">정규직</option>
                    <option value="contract" className="bg-gray-800">계약직</option>
                    <option value="freelance" className="bg-gray-800">프리랜서</option>
                    <option value="business" className="bg-gray-800">사업가/자영업</option>
                    <option value="student" className="bg-gray-800">학생</option>
                    <option value="job-seeking" className="bg-gray-800">취업 준비생</option>
                    <option value="unemployed" className="bg-gray-800">무직/구직 중</option>
                  </select>
                </div>

                {/* 소득 수준 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">소득 수준 (세후)</label>
                  <select
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="very-high" className="bg-gray-800">500만원 이상</option>
                    <option value="high" className="bg-gray-800">300-500만원</option>
                    <option value="middle" className="bg-gray-800">200-300만원</option>
                    <option value="low" className="bg-gray-800">100-200만원</option>
                    <option value="very-low" className="bg-gray-800">100만원 미만</option>
                    <option value="none" className="bg-gray-800">소득 없음</option>
                  </select>
                </div>

                {/* 건강 상태 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">전반적인 건강 상태</label>
                  <select
                    value={formData.health}
                    onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="very-good" className="bg-gray-800">매우 좋음</option>
                    <option value="good" className="bg-gray-800">좋음</option>
                    <option value="normal" className="bg-gray-800">보통</option>
                    <option value="bad" className="bg-gray-800">나쁨</option>
                    <option value="very-bad" className="bg-gray-800">매우 나쁨</option>
                  </select>
                </div>

                {/* 수면 시간 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">평균 수면 시간: {formData.sleepHours}시간</label>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* 운동 빈도 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">운동 빈도</label>
                  <select
                    value={formData.exercise}
                    onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="daily" className="bg-gray-800">거의 매일 (주 5회 이상)</option>
                    <option value="often" className="bg-gray-800">자주 (주 3-4회)</option>
                    <option value="sometimes" className="bg-gray-800">가끔 (주 1-2회)</option>
                    <option value="rarely" className="bg-gray-800">거의 안 함</option>
                    <option value="never" className="bg-gray-800">전혀 안 함</option>
                  </select>
                </div>

                {/* 주거 형태 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">주거 형태</label>
                  <select
                    value={formData.housing}
                    onChange={(e) => setFormData({ ...formData, housing: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="own" className="bg-gray-800">자가</option>
                    <option value="jeonse" className="bg-gray-800">전세</option>
                    <option value="monthly" className="bg-gray-800">월세</option>
                    <option value="parents" className="bg-gray-800">부모님 댁</option>
                    <option value="goshiwon" className="bg-gray-800">고시원/원룸</option>
                  </select>
                </div>

                {/* 부채 수준 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">부채/대출 수준</label>
                  <select
                    value={formData.debt}
                    onChange={(e) => setFormData({ ...formData, debt: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="none" className="bg-gray-800">없음</option>
                    <option value="small" className="bg-gray-800">소액 (1천만원 미만)</option>
                    <option value="medium" className="bg-gray-800">중간 (1천~5천만원)</option>
                    <option value="large" className="bg-gray-800">큼 (5천만원~1억)</option>
                    <option value="huge" className="bg-gray-800">매우 큼 (1억 이상)</option>
                  </select>
                </div>

                {/* 인간관계 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">만족스러운 인간관계 (중복 선택)</label>
                  <div className="space-y-2">
                    {['가족', '친구', '연인/배우자', '직장 동료'].map((rel) => (
                      <label key={rel} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.relationships.includes(rel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, relationships: [...formData.relationships, rel] });
                            } else {
                              setFormData({
                                ...formData,
                                relationships: formData.relationships.filter((r) => r !== rel),
                              });
                            }
                          }}
                          className="w-5 h-5"
                        />
                        <span>{rel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 가족 관계 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">가족과의 관계</label>
                  <select
                    value={formData.family}
                    onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="very-good" className="bg-gray-800">매우 좋음</option>
                    <option value="good" className="bg-gray-800">좋음</option>
                    <option value="normal" className="bg-gray-800">보통</option>
                    <option value="bad" className="bg-gray-800">나쁨</option>
                    <option value="very-bad" className="bg-gray-800">매우 나쁨</option>
                  </select>
                </div>

                {/* 취미 생활 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">취미 생활</label>
                  <select
                    value={formData.hobby}
                    onChange={(e) => setFormData({ ...formData, hobby: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="many" className="bg-gray-800">다양한 취미 활동</option>
                    <option value="some" className="bg-gray-800">몇 가지 취미</option>
                    <option value="few" className="bg-gray-800">가끔 취미 활동</option>
                    <option value="none" className="bg-gray-800">취미 없음</option>
                  </select>
                </div>

                {/* 스트레스 수준 */}
                <div>
                  <label className="block text-lg font-semibold mb-2">전반적인 스트레스 수준</label>
                  <select
                    value={formData.stress}
                    onChange={(e) => setFormData({ ...formData, stress: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="" className="bg-gray-800">선택하세요</option>
                    <option value="very-low" className="bg-gray-800">거의 없음</option>
                    <option value="low" className="bg-gray-800">낮음</option>
                    <option value="normal" className="bg-gray-800">보통</option>
                    <option value="high" className="bg-gray-800">높음</option>
                    <option value="very-high" className="bg-gray-800">매우 높음</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('intro')}
                  className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-full text-lg font-bold transition-all"
                >
                  이전
                </button>
                <button
                  onClick={calculateDifficulty}
                  disabled={
                    !formData.jobStatus ||
                    !formData.income ||
                    !formData.health ||
                    !formData.housing ||
                    !formData.debt ||
                    !formData.family ||
                    !formData.hobby ||
                    !formData.exercise ||
                    !formData.stress
                  }
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-full text-lg font-bold transition-all"
                >
                  결과 확인
                </button>
              </div>
            </motion.div>
          )}

          {/* 결과 */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4 sm:space-y-6"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-8">측정 결과</h1>

              {/* 3D 시각화 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 relative" style={{ height: '300px', minHeight: '280px' }}>
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <DifficultyBadge difficulty={difficulty} score={totalScore} />
                  <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
                {/* HTML 오버레이 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg text-center">
                    {
                      {
                        easy: '😊 이지 모드',
                        normal: '😐 노말 모드',
                        hard: '😰 하드 모드',
                        hell: '💀 헬 모드',
                      }[difficulty]
                    }
                  </div>
                  <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg mt-2 sm:mt-4">
                    {totalScore}점
                  </div>
                </div>
              </div>

              {/* 스탯 게이지 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { label: '💪 체력', value: stats.health, color: '#10b981' },
                    { label: '💰 금전운', value: stats.wealth, color: '#f59e0b' },
                    { label: '👥 사회성', value: stats.social, color: '#3b82f6' },
                    { label: '🧠 멘탈', value: stats.mental, color: '#8b5cf6' },
                    { label: '🍀 행운', value: stats.luck, color: '#ec4899' },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-4 text-white">
                      <span className="text-sm sm:text-base md:text-lg font-semibold w-16 sm:w-20 md:w-24 flex-shrink-0">{stat.label}</span>
                      <div className="flex-1 min-w-0">
                        <div className="h-2 sm:h-2.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
                          />
                        </div>
                      </div>
                      <span className="text-sm sm:text-base md:text-lg font-bold w-10 sm:w-12 text-right flex-shrink-0">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 조언 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">{getAdvice().title}</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{getAdvice().desc}</p>
                <div className="space-y-2">
                  {getAdvice().tips.map((tip, index) => (
                    <div key={index} className="bg-white/5 p-3 sm:p-3.5 rounded-lg text-sm sm:text-base">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              {/* 스탯별 개선 방법 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold">스탯별 개선 전략</h2>
                {Object.entries(stats).map(([stat, value]) => {
                  const statNames = {
                    health: '💪 체력',
                    wealth: '💰 금전운',
                    social: '👥 사회성',
                    mental: '🧠 멘탈',
                    luck: '🍀 행운',
                  };
                  return (
                    <div key={stat} className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-semibold">{statNames[stat as keyof Stats]}</h3>
                      <div className="space-y-1.5">
                        {getStatAdvice(stat as keyof Stats, value).map((advice, index) => (
                          <div key={index} className="bg-white/5 p-2.5 sm:p-3 rounded text-xs sm:text-sm leading-relaxed">
                            • {advice}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 다시 측정 */}
              <button
                onClick={() => {
                  setStep('intro');
                  setFormData({
                    age: 25,
                    jobStatus: '',
                    income: '',
                    health: '',
                    sleepHours: 7,
                    relationships: [],
                    housing: '',
                    debt: '',
                    family: '',
                    hobby: '',
                    exercise: '',
                    stress: '',
                  });
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-95 px-6 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all touch-manipulation min-h-[48px]"
              >
                다시 측정하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
