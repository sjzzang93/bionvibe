#!/usr/bin/env ts-node
/**
 * update-apps-json.ts
 * 
 * 목적: apps.json에 마이그레이션된 앱 자동 등록
 */

import * as fs from 'fs';
import * as path from 'path';
import { APPS_TO_MIGRATE } from './batch-migrate';

interface App {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  categoryId: string;
  url: string;
  image: string;
  createdAt: string;
}

// Unsplash 이미지 매핑
const IMAGE_MAP: Record<string, string> = {
  'typing-speed-test': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  'reflex-test': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
  'eye-test': 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80',
  'quote-generator': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80',
  'dday-counter': 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&q=80',
  'focus-timer': 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&q=80',
  'sleep-analyzer': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80',
  'vitamin-check': 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80',
  'salary-divider': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
  'income-tax-calculator': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
};

// 설명 매핑
const DESCRIPTION_MAP: Record<string, string> = {
  'typing-speed-test': '타자 속도 측정 및 연습',
  'reflex-test': '반응속도 테스트',
  'eye-test': '시력 건강 체크',
  'quote-generator': '매일 새로운 명언',
  'dday-counter': '중요한 날 카운트다운',
  'focus-timer': '뽀모도로 집중 타이머',
  'sleep-analyzer': '수면 패턴 분석',
  'vitamin-check': '필요한 영양소 진단',
  'salary-divider': '월급 예산 계획',
  'income-tax-calculator': '소득세 자동 계산',
};

function updateAppsJson() {
  const appsJsonPath = path.resolve(__dirname, '..', 'data', 'apps.json');
  
  // 기존 apps.json 읽기
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  const existingApps: App[] = data.apps || [];
  
  // 기존 앱 slug 목록
  const existingSlugs = new Set(existingApps.map(app => app.slug));
  
  // 새 앱 추가
  let addedCount = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (const app of APPS_TO_MIGRATE) {
    if (!existingSlugs.has(app.slug)) {
      const newApp: App = {
        id: app.slug,
        name: app.name,
        slug: app.slug,
        icon: app.icon,
        description: DESCRIPTION_MAP[app.slug] || app.name,
        categoryId: app.category,
        url: `/apps/${app.slug}`,
        image: IMAGE_MAP[app.slug] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
        createdAt: today,
      };
      
      existingApps.push(newApp);
      addedCount++;
      console.log(`✅ 추가: ${app.name} (${app.slug})`);
    } else {
      console.log(`⏭️  스킵: ${app.name} (이미 존재)`);
    }
  }
  
  // apps.json 업데이트
  data.apps = existingApps;
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  
  console.log(`\n✅ apps.json 업데이트 완료`);
  console.log(`   총 ${existingApps.length}개 앱 (${addedCount}개 추가됨)\n`);
}

// 실행
if (require.main === module) {
  updateAppsJson();
}

export { updateAppsJson };

