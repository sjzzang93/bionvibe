'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AdSense from '@/app/components/AdSense';

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
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

  // 총 질문 수
  const totalQuestions = 12;

  // 현재 질문이 유효한 답변을 가지고 있는지 확인
  const isCurrentQuestionValid = () => {
    switch (currentQuestion) {
      case 0: return formData.age > 0;
      case 1: return formData.jobStatus !== '';
      case 2: return formData.income !== '';
      case 3: return formData.health !== '';
      case 4: return true; // 수면 시간은 슬라이더로 항상 값이 있음
      case 5: return formData.exercise !== '';
      case 6: return formData.housing !== '';
      case 7: return formData.debt !== '';
      case 8: return true; // 인간관계는 선택 안 해도 됨
      case 9: return formData.family !== '';
      case 10: return formData.hobby !== '';
      case 11: return formData.stress !== '';
      default: return false;
    }
  };

  // 다음 질문으로
  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateDifficulty();
    }
  };

  // 이전 질문으로
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setStep('intro');
    }
  };

  // 난이도 계산 알고리즘 (방대한 데이터 기반)
  const calculateDifficulty = () => {
    let healthScore = 60;
    let wealthScore = 60;
    let socialScore = 60;
    let mentalScore = 60;
    let luckScore = 60;

    // 1. 체력 (Health) 계산
    if (formData.health === 'very-good') healthScore = 95;
    else if (formData.health === 'good') healthScore = 80;
    else if (formData.health === 'normal') healthScore = 65;
    else if (formData.health === 'bad') healthScore = 45;
    else if (formData.health === 'very-bad') healthScore = 25;

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
    if (formData.income === 'very-high') wealthScore = 98;
    else if (formData.income === 'high') wealthScore = 85;
    else if (formData.income === 'middle') wealthScore = 70;
    else if (formData.income === 'low') wealthScore = 50;
    else if (formData.income === 'very-low') wealthScore = 30;
    else if (formData.income === 'none') wealthScore = 15;

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
    if (relationshipCount >= 4) socialScore = 90;
    else if (relationshipCount === 3) socialScore = 75;
    else if (relationshipCount === 2) socialScore = 60;
    else if (relationshipCount === 1) socialScore = 45;
    else socialScore = 30;

    // 가족 관계 보정
    if (formData.family === 'very-good') socialScore += 15;
    else if (formData.family === 'good') socialScore += 10;
    else if (formData.family === 'normal') socialScore += 5;
    else if (formData.family === 'bad') socialScore -= 10;
    else if (formData.family === 'very-bad') socialScore -= 20;

    // 4. 멘탈 (Mental) 계산
    if (formData.stress === 'very-low') mentalScore = 95;
    else if (formData.stress === 'low') mentalScore = 80;
    else if (formData.stress === 'normal') mentalScore = 65;
    else if (formData.stress === 'high') mentalScore = 45;
    else if (formData.stress === 'very-high') mentalScore = 25;

    // 취미 보정
    if (formData.hobby === 'many') mentalScore += 15;
    else if (formData.hobby === 'some') mentalScore += 10;
    else if (formData.hobby === 'few') mentalScore += 5;
    else if (formData.hobby === 'none') mentalScore -= 10;

    // 5. 행운 (Luck) 계산 - 나이대별
    if (formData.age < 20) luckScore = 90; // 미성년 - 부모 보호
    else if (formData.age >= 20 && formData.age < 25) luckScore = 80; // 대학생 시기
    else if (formData.age >= 25 && formData.age < 30) luckScore = 65; // 취업/사회초년생
    else if (formData.age >= 30 && formData.age < 35) luckScore = 60; // 경력 쌓는 시기
    else if (formData.age >= 35 && formData.age < 40) luckScore = 60; // 커리어 중반
    else if (formData.age >= 40 && formData.age < 50) luckScore = 65; // 안정기
    else if (formData.age >= 50 && formData.age < 60) luckScore = 70; // 경제적 안정
    else luckScore = 75; // 은퇴 이후

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
    if (total >= 70) difficultyLevel = 'easy';
    else if (total >= 50) difficultyLevel = 'normal';
    else if (total >= 30) difficultyLevel = 'hard';
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

  // 캐릭터 타입 결정 (RPG 직업 컨셉)
  const getCharacterType = () => {
    const { health, wealth, social, mental, luck } = stats;

    // 가장 높은 스탯 2개 찾기
    const statArray = [
      { name: 'health', value: health },
      { name: 'wealth', value: wealth },
      { name: 'social', value: social },
      { name: 'mental', value: mental },
      { name: 'luck', value: luck },
    ].sort((a, b) => b.value - a.value);

    const top1 = statArray[0].name;
    const top2 = statArray[1].name;
    const key = [top1, top2].sort().join('-');

    const characterTypes: Record<string, { name: string; desc: string; emoji: string }> = {
      'health-wealth': { name: '재벌 2세', desc: '건강도 좋고 돈도 많은 완벽한 삶', emoji: '💎' },
      'health-social': { name: '인싸 운동선수', desc: '사람 좋고 몸도 건강한 에너자이저', emoji: '⚡' },
      'health-mental': { name: '요가 마스터', desc: '몸과 마음이 균형잡힌 힐링형 인간', emoji: '🧘' },
      'health-luck': { name: '타고난 강철체력', desc: '건강하고 운도 따르는 축복받은 몸', emoji: '🦾' },
      'wealth-social': { name: '인맥 부자', desc: '돈도 벌고 인간관계도 탄탄한 네트워커', emoji: '🤝' },
      'wealth-mental': { name: '현자형 투자자', desc: '돈 걱정 없고 마음도 평온한 승리자', emoji: '🧙' },
      'wealth-luck': { name: '로또 당첨인생', desc: '경제력도 있고 운도 따르는 금수저', emoji: '🍀' },
      'mental-social': { name: '힐링 친구', desc: '마음도 편하고 친구도 많은 행복형', emoji: '🌸' },
      'mental-luck': { name: '평온한 수행자', desc: '멘탈 갑이면서 운도 괜찮은 고수', emoji: '☮️' },
      'social-luck': { name: '인복 많은 행운아', desc: '사람 복도 있고 운도 따르는 매력쟁이', emoji: '✨' },
    };

    return characterTypes[key] || { name: '밸런스형 플레이어', desc: '골고루 발달한 평균형 인간', emoji: '⚖️' };
  };

  // 히든 엔딩 체크
  const getHiddenEnding = () => {
    const { health, wealth, social, mental, luck } = stats;

    // 모든 스탯이 90 이상
    if (health >= 90 && wealth >= 90 && social >= 90 && mental >= 90 && luck >= 90) {
      return {
        title: '🏆 치트키 인생 달성!',
        desc: '당신은 게임 버그를 발견했습니다. 아니면 전생에 나라를 구하셨나요?',
      };
    }

    // 모든 스탯이 30 이하
    if (health <= 30 && wealth <= 30 && social <= 30 && mental <= 30 && luck <= 30) {
      return {
        title: '🎮 하드코어 모드 선택자',
        desc: '게임을 최고 난이도로 플레이 중이시네요. 존경합니다...',
      };
    }

    // 한 가지만 엄청 높고 나머지는 낮음
    const highStats = Object.values(stats).filter(v => v >= 80).length;
    const lowStats = Object.values(stats).filter(v => v <= 40).length;
    if (highStats === 1 && lowStats >= 3) {
      return {
        title: '🎯 극한의 특화형',
        desc: '한 분야에 모든 능력치를 몰빵한 스페셜리스트!',
      };
    }

    return null;
  };

  // 난이도별 조언 (다양한 버전)
  const getAdvice = () => {
    const hidden = getHiddenEnding();
    if (hidden) {
      return {
        title: hidden.title,
        desc: hidden.desc,
        tips: [
          '🎉 당신은 특별합니다!',
          '📸 스크린샷 찍어서 친구들에게 자랑하세요',
          '🌟 이 상태를 유지하거나 개선해보세요',
        ],
      };
    }

    const characterType = getCharacterType();

    const adviceVariations = {
      easy: [
        {
          title: `🎉 ${characterType.emoji} ${characterType.name}`,
          desc: `${characterType.desc}입니다! 현재 당신의 인생은 매우 순조롭게 흘러가고 있어요.`,
          tips: [
            '✨ 현재의 안정을 바탕으로 새로운 도전을 시도해보세요',
            '💝 주변 사람들과 행복을 나누고 감사함을 표현하세요',
            '📚 자기계발에 투자하여 더 높은 단계로 성장하세요',
            '🎯 장기적인 목표를 세우고 체계적으로 실행하세요',
          ],
        },
        {
          title: '🌟 인생의 승리자 모드',
          desc: `총점 ${totalScore}점! 당신은 인생 게임에서 좋은 카드를 받았습니다. 이 운을 잘 활용하세요!`,
          tips: [
            '🚀 지금이 새로운 도전을 시작할 최적기입니다',
            '🎁 여유가 있을 때 어려운 이들을 도우면 더 큰 복이 돌아옵니다',
            '📖 성공한 사람들의 책을 읽으며 더 성장하세요',
            '💪 안주하지 말고 계속 발전하는 자세를 유지하세요',
          ],
        },
        {
          title: '👑 축복받은 인생',
          desc: `당신의 ${totalScore}점은 상위 20% 수준입니다. 인생이 쉬운 모드로 설정되어 있네요!`,
          tips: [
            '🎨 여유로운 지금, 예술이나 취미에 투자해보세요',
            '🌍 해외여행이나 새로운 경험을 쌓아보세요',
            '💼 커리어에서 더 높은 목표를 설정해보세요',
            '🤲 재능 기부나 멘토링으로 사회에 기여해보세요',
          ],
        },
      ],
      normal: [
        {
          title: `😊 ${characterType.emoji} ${characterType.name}`,
          desc: `${characterType.desc}입니다! 평범하지만 안정적인 삶을 살고 있어요.`,
          tips: [
            '🏃 규칙적인 운동으로 체력과 멘탈 동시 UP',
            '💰 수입을 늘리거나 지출을 줄이는 방법 모색',
            '👥 인간관계를 더 넓히고 깊게 만들기',
            '🎨 새로운 취미를 시작하여 삶의 활력 찾기',
          ],
        },
        {
          title: '⚖️ 평범함의 미학',
          desc: `${totalScore}점, 딱 중간입니다. 평범함도 축복이에요. 작은 변화로 큰 차이를 만들 수 있습니다!`,
          tips: [
            '📈 한 달에 한 가지씩 개선 목표를 세워보세요',
            '☕ 작은 사치로 삶의 질을 높여보세요',
            '📱 디지털 디톡스로 진짜 여유를 찾아보세요',
            '🎯 올해 안에 이루고 싶은 목표 3가지를 정해보세요',
          ],
        },
        {
          title: '🎲 보통의 인생, 특별한 가능성',
          desc: `누구나 겪는 평범한 일상이지만, 당신만의 특별함을 만들 수 있습니다!`,
          tips: [
            '💡 하루 30분, 자신에게 투자하는 시간 만들기',
            '🌱 작은 성장이 쌓여 큰 변화를 만듭니다',
            '👨‍👩‍👧‍👦 주말엔 소중한 사람들과 시간 보내기',
            '📝 감사 일기로 긍정적 마인드 키우기',
          ],
        },
      ],
      hard: [
        {
          title: `😰 ${characterType.emoji} ${characterType.name} (하드모드)`,
          desc: `${characterType.desc}이지만, 지금은 힘든 시기입니다. 하지만 이 또한 지나갈 거예요.`,
          tips: [
            '🆘 전문가의 도움이 필요하다면 주저하지 말고 요청하세요',
            '💪 가장 급한 문제부터 우선순위를 정해 해결하세요',
            '😴 충분한 수면과 휴식으로 체력을 회복하세요',
            '🤝 가족이나 친구에게 솔직하게 도움을 청하세요',
          ],
        },
        {
          title: '⛰️ 힘든 구간 통과 중',
          desc: `${totalScore}점... 지금은 인생의 오르막길입니다. 힘들지만 정상은 가까워지고 있어요.`,
          tips: [
            '🔥 포기하지 마세요. 가장 어두운 시간이 새벽 직전입니다',
            '📞 혼자 견디지 말고 주변에 SOS를 보내세요',
            '💊 건강이 우선입니다. 아프면 반드시 병원에 가세요',
            '📝 작은 일이라도 해낸 것을 기록하며 자신감 회복',
            '🌅 매일 아침 "오늘도 버텼다"고 스스로를 칭찬하세요',
          ],
        },
        {
          title: '🥊 챌린지 모드 진행 중',
          desc: `힘든 시기지만, 이 경험이 당신을 더 강하게 만들 거예요. 지금 필요한 건 작은 휴식입니다.`,
          tips: [
            '⏸️ 잠시 멈춰도 괜찮습니다. 휴식은 나약함이 아닙니다',
            '🎯 큰 목표는 잠시 내려놓고 오늘 하루만 버티기',
            '🆘 복지로(www.bokjiro.go.kr)에서 받을 수 있는 지원 찾기',
            '💚 하루에 한 가지 작은 기쁨 찾기 (맛있는 음식, 따뜻한 햇살 등)',
          ],
        },
      ],
      hell: [
        {
          title: '💀 서바이벌 모드',
          desc: `${totalScore}점... 지금은 생존이 목표입니다. 반드시 도움을 받으세요. 혼자가 아닙니다.`,
          tips: [
            '🚨 즉시 전문가(상담사, 의사, 사회복지사)의 도움을 받으세요',
            '📞 자살예방상담전화 1393, 정신건강위기상담 1577-0199',
            '🏥 가까운 보건소나 정신건강복지센터를 방문하세요',
            '💊 건강이 가장 우선입니다. 병원 진료를 받으세요',
            '🆘 정부 지원 제도를 적극 활용하세요 (복지로 www.bokjiro.go.kr)',
          ],
        },
        {
          title: '🆘 긴급 지원 필요',
          desc: `매우 어려운 상황입니다. 지금 당장 도움을 요청하세요. 이 상황은 당신 잘못이 아닙니다.`,
          tips: [
            '📱 지금 바로 주변 사람에게 연락하세요',
            '🏛️ 가까운 주민센터에 가서 긴급 지원 신청하세요',
            '💰 긴급복지지원: 보건복지부 콜센터 129',
            '🏠 주거 문제: LH 전세임대 1600-1004',
            '⏸️ 완벽하지 않아도, 실패해도 괜찮습니다. 살아있는 것만으로 충분합니다',
          ],
        },
        {
          title: '❤️‍🩹 당신은 혼자가 아닙니다',
          desc: `극한의 어려움을 겪고 계시네요. 하지만 이 순간에도 당신을 도울 수 있는 사람들이 있습니다.`,
          tips: [
            '🫂 가족, 친구, 누구에게든 지금 바로 도움을 청하세요',
            '🆘 무료 법률 상담: 대한법률구조공단 132',
            '💼 취업 지원: 고용센터 1350',
            '🏥 무료 진료: 지역 보건소',
            '📞 희망의 전화를 거세요. 전문가들이 24시간 기다리고 있습니다',
            '🌈 이 터널에도 끝이 있습니다. 포기하지 마세요',
          ],
        },
      ],
    };

    const variations = adviceVariations[difficulty];
    const randomIndex = Math.floor(Math.random() * variations.length);
    return variations[randomIndex];
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
                    <span className="text-sm">70-100점</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-500/20 p-3 rounded-lg">
                    <span className="font-semibold">😐 노말 모드</span>
                    <span className="text-sm">50-69점</span>
                  </div>
                  <div className="flex items-center justify-between bg-orange-500/20 p-3 rounded-lg">
                    <span className="font-semibold">😰 하드 모드</span>
                    <span className="text-sm">30-49점</span>
                  </div>
                  <div className="flex items-center justify-between bg-red-500/20 p-3 rounded-lg">
                    <span className="font-semibold">💀 헬 모드</span>
                    <span className="text-sm">0-29점</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep('form');
                  setCurrentQuestion(0);
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-4 rounded-full text-xl font-bold transition-all transform hover:scale-105"
              >
                측정 시작하기
              </button>
            </motion.div>
          )}

          {/* 설문 폼 - 점진적 선택 */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* 진행 상황 */}
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-400">
                  질문 {currentQuestion + 1} / {totalQuestions}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 min-h-[400px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* 질문 0: 나이 */}
                    {currentQuestion === 0 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">만 나이가 어떻게 되시나요?</h2>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-2xl text-white text-center"
                          placeholder="예: 25"
                          autoFocus
                        />
                        <p className="text-gray-400 text-center">나이는 인생 경험과 기회를 반영합니다</p>
                      </div>
                    )}

                    {/* 질문 1: 직업 상태 */}
                    {currentQuestion === 1 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">현재 직업 상태는?</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'stable-job', label: '정규직', emoji: '💼' },
                            { value: 'contract', label: '계약직', emoji: '📝' },
                            { value: 'freelance', label: '프리랜서', emoji: '💻' },
                            { value: 'business', label: '사업가/자영업', emoji: '🏢' },
                            { value: 'student', label: '학생', emoji: '📚' },
                            { value: 'job-seeking', label: '취업 준비생', emoji: '🔍' },
                            { value: 'unemployed', label: '무직/구직 중', emoji: '😔' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, jobStatus: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.jobStatus === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 2: 소득 수준 */}
                    {currentQuestion === 2 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">월 소득은? (세후)</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'very-high', label: '500만원 이상', emoji: '💎' },
                            { value: 'high', label: '300-500만원', emoji: '💰' },
                            { value: 'middle', label: '200-300만원', emoji: '💵' },
                            { value: 'low', label: '100-200만원', emoji: '💸' },
                            { value: 'very-low', label: '100만원 미만', emoji: '🪙' },
                            { value: 'none', label: '소득 없음', emoji: '😢' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, income: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.income === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 3: 건강 상태 */}
                    {currentQuestion === 3 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">건강 상태는?</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'very-good', label: '매우 좋음', emoji: '💪' },
                            { value: 'good', label: '좋음', emoji: '😊' },
                            { value: 'normal', label: '보통', emoji: '😐' },
                            { value: 'bad', label: '나쁨', emoji: '😷' },
                            { value: 'very-bad', label: '매우 나쁨', emoji: '🤒' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, health: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.health === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 4: 수면 시간 */}
                    {currentQuestion === 4 && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold mb-6">하루 평균 수면 시간은?</h2>
                        <div className="text-center">
                          <div className="text-6xl font-bold text-purple-400 mb-4">{formData.sleepHours}시간</div>
                          <input
                            type="range"
                            min="3"
                            max="12"
                            value={formData.sleepHours}
                            onChange={(e) => setFormData({ ...formData, sleepHours: parseInt(e.target.value) })}
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gray-700"
                            style={{
                              background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(59, 130, 246) ${((formData.sleepHours - 3) / 9) * 100}%, rgb(55, 65, 81) ${((formData.sleepHours - 3) / 9) * 100}%, rgb(55, 65, 81) 100%)`
                            }}
                          />
                          <div className="flex justify-between text-sm text-gray-400 mt-2">
                            <span>3시간</span>
                            <span>12시간</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-center">적정 수면 시간은 7-8시간입니다</p>
                      </div>
                    )}

                    {/* 질문 5: 운동 빈도 */}
                    {currentQuestion === 5 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">운동은 얼마나 자주?</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'daily', label: '거의 매일 (주 5회 이상)', emoji: '🏃' },
                            { value: 'often', label: '자주 (주 3-4회)', emoji: '🚴' },
                            { value: 'sometimes', label: '가끔 (주 1-2회)', emoji: '🚶' },
                            { value: 'rarely', label: '거의 안 함', emoji: '🛋️' },
                            { value: 'never', label: '전혀 안 함', emoji: '😴' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, exercise: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.exercise === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 6: 주거 형태 */}
                    {currentQuestion === 6 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">현재 주거 형태는?</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'own', label: '자가', emoji: '🏠' },
                            { value: 'jeonse', label: '전세', emoji: '🏡' },
                            { value: 'monthly', label: '월세', emoji: '🏘️' },
                            { value: 'parents', label: '부모님 댁', emoji: '👨‍👩‍👧‍👦' },
                            { value: 'goshiwon', label: '고시원/원룸', emoji: '🛏️' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, housing: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.housing === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 7: 부채 수준 */}
                    {currentQuestion === 7 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">부채/대출 수준은?</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'none', label: '없음', emoji: '✨' },
                            { value: 'small', label: '소액 (1천만원 미만)', emoji: '💳' },
                            { value: 'medium', label: '중간 (1천~5천만원)', emoji: '💰' },
                            { value: 'large', label: '큼 (5천만원~1억)', emoji: '📊' },
                            { value: 'huge', label: '매우 큼 (1억 이상)', emoji: '😰' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, debt: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.debt === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 8: 인간관계 */}
                    {currentQuestion === 8 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">만족스러운 인간관계는?</h2>
                        <p className="text-gray-400 mb-4">중복 선택 가능합니다</p>
                        <div className="space-y-3">
                          {[
                            { value: '가족', emoji: '👨‍👩‍👧‍👦' },
                            { value: '친구', emoji: '👯' },
                            { value: '연인/배우자', emoji: '💑' },
                            { value: '직장 동료', emoji: '🤝' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                if (formData.relationships.includes(option.value)) {
                                  setFormData({
                                    ...formData,
                                    relationships: formData.relationships.filter((r) => r !== option.value),
                                  });
                                } else {
                                  setFormData({ ...formData, relationships: [...formData.relationships, option.value] });
                                }
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.relationships.includes(option.value)
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.value}</span>
                              {formData.relationships.includes(option.value) && (
                                <span className="float-right text-2xl">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 9: 가족 관계 */}
                    {currentQuestion === 9 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">가족과의 관계는?</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'very-good', label: '매우 좋음', emoji: '❤️' },
                            { value: 'good', label: '좋음', emoji: '😊' },
                            { value: 'normal', label: '보통', emoji: '😐' },
                            { value: 'bad', label: '나쁨', emoji: '😔' },
                            { value: 'very-bad', label: '매우 나쁨', emoji: '💔' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, family: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.family === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 10: 취미 생활 */}
                    {currentQuestion === 10 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">취미 생활은?</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'many', label: '다양한 취미 활동', emoji: '🎨' },
                            { value: 'some', label: '몇 가지 취미', emoji: '🎸' },
                            { value: 'few', label: '가끔 취미 활동', emoji: '📺' },
                            { value: 'none', label: '취미 없음', emoji: '😶' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, hobby: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.hobby === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 11: 스트레스 수준 */}
                    {currentQuestion === 11 && (
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-6">전반적인 스트레스 수준은?</h2>
                        <div className="space-y-3">
                          {[
                            { value: 'very-low', label: '거의 없음', emoji: '😇' },
                            { value: 'low', label: '낮음', emoji: '😌' },
                            { value: 'normal', label: '보통', emoji: '😐' },
                            { value: 'high', label: '높음', emoji: '😰' },
                            { value: 'very-high', label: '매우 높음', emoji: '😫' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFormData({ ...formData, stress: option.value });
                                setTimeout(() => goToNextQuestion(), 300);
                              }}
                              className={`w-full p-4 rounded-xl text-left transition-all ${
                                formData.stress === option.value
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-105'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-2xl mr-3">{option.emoji}</span>
                              <span className="text-lg">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 네비게이션 버튼 */}
              <div className="flex gap-4">
                <button
                  onClick={goToPreviousQuestion}
                  className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-full text-lg font-bold transition-all"
                >
                  ← 이전
                </button>
                <button
                  onClick={goToNextQuestion}
                  disabled={!isCurrentQuestionValid()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-full text-lg font-bold transition-all"
                >
                  {currentQuestion === totalQuestions - 1 ? '결과 확인 →' : '다음 →'}
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
                  setCurrentQuestion(0);
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
