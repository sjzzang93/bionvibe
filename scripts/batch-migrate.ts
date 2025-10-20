#!/usr/bin/env ts-node
/**
 * batch-migrate.ts
 * 
 * 목적: playbion 프로젝트의 여러 웹앱을 일괄 마이그레이션
 */

import { migrateApp } from './migrate-app';
import * as path from 'path';

// 마이그레이션할 앱 목록
const APPS_TO_MIGRATE = [
  { source: 'typing-speed-test', slug: 'typing-speed-test', name: '타이핑 속도 테스트', icon: '⌨️', category: 'learn-grow' },
  { source: 'reflex-test', slug: 'reflex-test', name: '반사신경 테스트', icon: '⚡', category: 'learn-grow' },
  { source: 'eye-test', slug: 'eye-test', name: '시력 테스트', icon: '👁️', category: 'health-life' },
  { source: 'quote-generator', slug: 'quote-generator', name: '명언 생성기', icon: '💭', category: 'fortune-fun' },
  { source: 'dday-counter', slug: 'dday-counter', name: '디데이 카운터', icon: '📅', category: 'money-utility' },
  { source: 'focus-timer', slug: 'focus-timer', name: '집중 타이머', icon: '⏰', category: 'learn-grow' },
  { source: 'sleep-analyzer', slug: 'sleep-analyzer', name: '수면 분석기', icon: '😴', category: 'health-life' },
  { source: 'vitamin-check', slug: 'vitamin-check', name: '비타민 체크', icon: '💊', category: 'health-life' },
  { source: 'salary-divider', slug: 'salary-divider', name: '월급 쪼개기', icon: '💰', category: 'money-utility' },
  { source: 'income-tax-calculator', slug: 'income-tax-calculator', name: '소득세 계산기', icon: '🧾', category: 'money-utility' },
];

interface MigrationSummary {
  total: number;
  success: number;
  failed: number;
  apps: {
    slug: string;
    success: boolean;
    removedAds: number;
    error?: string;
  }[];
}

async function batchMigrate() {
  const SOURCE_BASE = '/Users/fire/Desktop/BION/playbion/app';
  
  const summary: MigrationSummary = {
    total: APPS_TO_MIGRATE.length,
    success: 0,
    failed: 0,
    apps: [],
  };
  
  console.log(`🚀 ${APPS_TO_MIGRATE.length}개 앱 일괄 마이그레이션 시작...\n`);
  
  for (const app of APPS_TO_MIGRATE) {
    const sourcePath = path.join(SOURCE_BASE, app.source);
    
    try {
      const result = migrateApp(sourcePath, app.slug);
      
      if (result.success) {
        summary.success++;
        summary.apps.push({
          slug: app.slug,
          success: true,
          removedAds: result.removedAdCount,
        });
      } else {
        summary.failed++;
        summary.apps.push({
          slug: app.slug,
          success: false,
          removedAds: 0,
          error: result.errors.join(', '),
        });
      }
    } catch (error: any) {
      summary.failed++;
      summary.apps.push({
        slug: app.slug,
        success: false,
        removedAds: 0,
        error: error.message || String(error),
      });
    }
  }
  
  // 요약 출력
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 마이그레이션 요약');
  console.log('='.repeat(60));
  console.log(`✅ 성공: ${summary.success}개`);
  console.log(`❌ 실패: ${summary.failed}개`);
  console.log(`📦 총: ${summary.total}개\n`);
  
  // 실패 목록
  if (summary.failed > 0) {
    console.log('❌ 실패한 앱:');
    summary.apps
      .filter(app => !app.success)
      .forEach(app => {
        console.log(`   - ${app.slug}: ${app.error}`);
      });
    console.log();
  }
  
  // 제거된 광고 요소 통계
  const totalAdsRemoved = summary.apps.reduce((sum, app) => sum + app.removedAds, 0);
  console.log(`🧹 총 제거된 광고 요소: ${totalAdsRemoved}건\n`);
  
  // apps.json 업데이트 안내
  console.log('📝 다음 단계:');
  console.log('   1. data/apps.json에 마이그레이션된 앱 등록');
  console.log('   2. npm run build로 빌드 테스트');
  console.log('   3. git commit으로 변경사항 저장\n');
  
  return summary;
}

// 실행
if (require.main === module) {
  batchMigrate()
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

export { batchMigrate, APPS_TO_MIGRATE };

