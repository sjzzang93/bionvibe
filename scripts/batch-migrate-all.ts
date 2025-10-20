#!/usr/bin/env ts-node
/**
 * batch-migrate-all.ts
 * 
 * 목적: playbion의 나머지 모든 웹앱 마이그레이션 (60개+)
 */

import { migrateApp } from './migrate-app';
import * as path from 'path';
import * as fs from 'fs';

// 제외할 특수 페이지
const EXCLUDED = [
  'about', 'ad-disclosure', 'privacy-policy', 'secret-vault', 
  'diagnostics', 'apps/[slug]'
];

// 이미 마이그레이션된 앱
const ALREADY_MIGRATED = [
  'air-quality', 'typing-speed-test', 'reflex-test', 'eye-test',
  'quote-generator', 'dday-counter', 'focus-timer', 'sleep-analyzer',
  'vitamin-check', 'salary-divider', 'income-tax-calculator',
  'parents-time', 'phone-usage-analyzer', 'habit-tracker',
  'coffee-calculator', 'crypto/calculator'
];

// 카테고리 매핑
const CATEGORY_MAP: Record<string, string> = {
  // health-life
  'health/calorie-calculator': 'health-life',
  'health/supplement-recommend': 'health-life',
  'health/water-intake': 'health-life',
  'bodyfat/measure': 'health-life',
  'quit-smoking/challenge': 'health-life',
  'meat-calculator': 'health-life',
  
  // fortune-fun
  'fortune/today': 'fortune-fun',
  'mbti-32': 'fortune-fun',
  'saju-mbti-jobs': 'fortune-fun',
  'iq-test': 'fortune-fun',
  'lottery/number-generator': 'fortune-fun',
  'dream/interpreter': 'fortune-fun',
  'lifestyle/face-fortune': 'fortune-fun',
  'lifestyle/palm-reading': 'fortune-fun',
  'voice-fortune': 'fortune-fun',
  'past-life-job': 'fortune-fun',
  'analysis/handwriting': 'fortune-fun',
  'face-shape': 'fortune-fun',
  'voice-age': 'fortune-fun',
  
  // money-utility
  'compound-calculator': 'money-utility',
  'credit-card-optimizer': 'money-utility',
  'finance/emergency-fund': 'money-utility',
  'finance/loan-refinance': 'money-utility',
  'envelope/recommend': 'money-utility',
  'utility/electricity-calculator': 'money-utility',
  
  // learn-grow
  'study/cursor-prompts': 'learn-grow',
  'study/dev-vocab': 'learn-grow',
  'study/flashcard': 'learn-grow',
  'games/multiplication': 'learn-grow',
  'games/puzzle': 'learn-grow',
  'arcade/mini-games': 'learn-grow',
  
  // family-love
  'parenting/stress': 'family-love',
  'gift/recommend': 'family-love',
  'mood/cheer-up': 'family-love',
  'time-capsule': 'family-love',
  
  // lifestyle
  'car-maintenance': 'money-utility',
  'color-psychology': 'fortune-fun',
  'weather-outfit': 'health-life',
  'travel/destinations': 'money-utility',
  'travel/packing-list': 'money-utility',
  'breakfast/what-to-eat': 'health-life',
  'chart/melon-1st': 'fortune-fun',
};

// 아이콘 매핑
const ICON_MAP: Record<string, string> = {
  'health/calorie-calculator': '🍎',
  'health/supplement-recommend': '💊',
  'health/water-intake': '💧',
  'bodyfat/measure': '⚖️',
  'quit-smoking/challenge': '🚭',
  'meat-calculator': '🥩',
  'fortune/today': '🌟',
  'mbti-32': '🎭',
  'saju-mbti-jobs': '🔮',
  'iq-test': '🧠',
  'lottery/number-generator': '🎲',
  'dream/interpreter': '💤',
  'lifestyle/face-fortune': '👁️',
  'lifestyle/palm-reading': '👋',
  'voice-fortune': '🎤',
  'past-life-job': '⏳',
  'analysis/handwriting': '✍️',
  'face-shape': '😊',
  'voice-age': '🗣️',
  'compound-calculator': '📈',
  'credit-card-optimizer': '💳',
  'finance/emergency-fund': '🏦',
  'finance/loan-refinance': '🏠',
  'envelope/recommend': '✉️',
  'utility/electricity-calculator': '⚡',
  'study/cursor-prompts': '💻',
  'study/dev-vocab': '📚',
  'study/flashcard': '📖',
  'games/multiplication': '🔢',
  'games/puzzle': '🧩',
  'arcade/mini-games': '🎮',
  'parenting/stress': '👶',
  'gift/recommend': '🎁',
  'mood/cheer-up': '😊',
  'time-capsule': '📦',
  'car-maintenance': '🚗',
  'color-psychology': '🎨',
  'weather-outfit': '👔',
  'travel/destinations': '✈️',
  'travel/packing-list': '🧳',
  'breakfast/what-to-eat': '🍳',
  'chart/melon-1st': '🎵',
};

// 이름 매핑
const NAME_MAP: Record<string, string> = {
  'health/calorie-calculator': '칼로리 계산기',
  'health/supplement-recommend': '영양제 추천',
  'health/water-intake': '물 섭취량 계산기',
  'bodyfat/measure': '체지방 측정기',
  'quit-smoking/challenge': '금연 챌린지',
  'meat-calculator': '고기 계산기',
  'fortune/today': '오늘의 운세',
  'mbti-32': 'MBTI 테스트',
  'saju-mbti-jobs': '사주 MBTI 직업',
  'iq-test': 'IQ 테스트',
  'lottery/number-generator': '로또 번호 생성',
  'dream/interpreter': '꿈 해몽',
  'lifestyle/face-fortune': '관상 분석',
  'lifestyle/palm-reading': '손금 보기',
  'voice-fortune': '목소리 운세',
  'past-life-job': '전생 직업',
  'analysis/handwriting': '필적 분석',
  'face-shape': '얼굴형 분석',
  'voice-age': '목소리 나이',
  'compound-calculator': '복리 계산기',
  'credit-card-optimizer': '카드 최적화',
  'finance/emergency-fund': '비상금 계산',
  'finance/loan-refinance': '대출 갈아타기',
  'envelope/recommend': '봉투 추천',
  'utility/electricity-calculator': '전기요금 계산기',
  'study/cursor-prompts': 'Cursor 프롬프트',
  'study/dev-vocab': '개발 용어 사전',
  'study/flashcard': '영어 플래시카드',
  'games/multiplication': '구구단 게임',
  'games/puzzle': '퍼즐 게임',
  'arcade/mini-games': '미니 게임',
  'parenting/stress': '육아 스트레스',
  'gift/recommend': '선물 추천',
  'mood/cheer-up': '기분 전환',
  'time-capsule': '타임 캡슐',
  'car-maintenance': '차량 관리',
  'color-psychology': '색상 심리',
  'weather-outfit': '날씨별 옷차림',
  'travel/destinations': '여행지 추천',
  'travel/packing-list': '여행 짐 체크',
  'breakfast/what-to-eat': '아침식사 추천',
  'chart/melon-1st': '멜론 차트',
};

interface MigrationSummary {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  apps: {
    path: string;
    slug: string;
    success: boolean;
    removedAds: number;
    skipped?: boolean;
    error?: string;
  }[];
}

async function batchMigrateAll() {
  const SOURCE_BASE = '/Users/fire/Desktop/BION/playbion/app';
  
  // playbion의 모든 웹앱 목록 가져오기
  const allApps = fs.readFileSync('/tmp/all-apps.txt', 'utf-8')
    .trim()
    .split('\n')
    .filter(app => !EXCLUDED.includes(app))
    .filter(app => !ALREADY_MIGRATED.includes(app))
    .filter(app => !ALREADY_MIGRATED.includes(app.replace('/', '-')));
  
  const summary: MigrationSummary = {
    total: allApps.length,
    success: 0,
    failed: 0,
    skipped: 0,
    apps: [],
  };
  
  console.log(`🚀 ${allApps.length}개 앱 전체 마이그레이션 시작...\n`);
  
  for (const appPath of allApps) {
    const sourcePath = path.join(SOURCE_BASE, appPath);
    const slug = appPath.replace('/', '-');
    
    // 이미 존재하는지 확인
    const targetPath = path.resolve(__dirname, '..', 'app', 'apps', slug);
    if (fs.existsSync(targetPath)) {
      console.log(`⏭️  스킵: ${slug} (이미 존재)`);
      summary.skipped++;
      summary.apps.push({
        path: appPath,
        slug,
        success: true,
        removedAds: 0,
        skipped: true,
      });
      continue;
    }
    
    try {
      const result = migrateApp(sourcePath, slug);
      
      if (result.success) {
        summary.success++;
        summary.apps.push({
          path: appPath,
          slug,
          success: true,
          removedAds: result.removedAdCount,
        });
      } else {
        summary.failed++;
        summary.apps.push({
          path: appPath,
          slug,
          success: false,
          removedAds: 0,
          error: result.errors.join(', '),
        });
      }
    } catch (error: any) {
      summary.failed++;
      summary.apps.push({
        path: appPath,
        slug,
        success: false,
        removedAds: 0,
        error: error.message || String(error),
      });
    }
  }
  
  // 요약 출력
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 전체 마이그레이션 요약');
  console.log('='.repeat(60));
  console.log(`✅ 성공: ${summary.success}개`);
  console.log(`⏭️  스킵: ${summary.skipped}개`);
  console.log(`❌ 실패: ${summary.failed}개`);
  console.log(`📦 총: ${summary.total}개\n`);
  
  // 실패 목록
  if (summary.failed > 0) {
    console.log('❌ 실패한 앱:');
    summary.apps
      .filter(app => !app.success && !app.skipped)
      .forEach(app => {
        console.log(`   - ${app.slug}: ${app.error}`);
      });
    console.log();
  }
  
  // 제거된 광고 요소 통계
  const totalAdsRemoved = summary.apps.reduce((sum, app) => sum + app.removedAds, 0);
  console.log(`🧹 총 제거된 광고 요소: ${totalAdsRemoved}건\n`);
  
  // apps.json 업데이트 데이터 생성
  const appsForJson = summary.apps
    .filter(app => app.success && !app.skipped)
    .map(app => ({
      source: app.path,
      slug: app.slug,
      name: NAME_MAP[app.path] || app.slug,
      icon: ICON_MAP[app.path] || '📱',
      category: CATEGORY_MAP[app.path] || 'learn-grow',
    }));
  
  fs.writeFileSync(
    '/tmp/new-apps.json',
    JSON.stringify(appsForJson, null, 2),
    'utf-8'
  );
  
  console.log('📝 다음 단계:');
  console.log('   1. /tmp/new-apps.json 확인');
  console.log('   2. update-apps-json-bulk.ts로 일괄 등록');
  console.log('   3. npm run build로 빌드 테스트\n');
  
  return summary;
}

// 실행
if (require.main === module) {
  batchMigrateAll()
    .then(summary => {
      if (summary.failed > 0) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ 배치 마이그레이션 실패:', error);
      process.exit(1);
    });
}

export { batchMigrateAll };

