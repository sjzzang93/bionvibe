#!/usr/bin/env ts-node
/**
 * update-apps-json-bulk.ts
 * 
 * 목적: /tmp/new-apps.json의 모든 앱을 apps.json에 일괄 등록
 */

import * as fs from 'fs';
import * as path from 'path';

interface NewApp {
  source: string;
  slug: string;
  name: string;
  icon: string;
  category: string;
}

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

// Unsplash 이미지 풀
const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80',
  'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=80',
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&q=80',
  'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80',
  'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=400&q=80',
  'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=400&q=80',
  'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=400&q=80',
];

// 설명 생성
const DESCRIPTION_TEMPLATES: Record<string, string> = {
  '운세': '오늘의 운세 확인',
  'MBTI': '성격 유형 테스트',
  '테스트': '재미있는 심리 테스트',
  '계산기': '빠른 계산',
  '분석': '상세 분석 결과',
  '추천': '맞춤 추천',
  '게임': '재미있는 게임',
  '챌린지': '도전 과제',
  '관리': '효율적인 관리',
  '심리': '심리 분석',
};

function generateDescription(name: string): string {
  for (const [key, desc] of Object.entries(DESCRIPTION_TEMPLATES)) {
    if (name.includes(key)) {
      return desc;
    }
  }
  return `${name.split(' ')[0]} 서비스`;
}

function updateAppsJsonBulk() {
  const newAppsPath = '/tmp/new-apps.json';
  const appsJsonPath = path.resolve(__dirname, '..', 'data', 'apps.json');
  
  // 새 앱 목록 읽기
  const newApps: NewApp[] = JSON.parse(fs.readFileSync(newAppsPath, 'utf-8'));
  
  // 기존 apps.json 읽기
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  const existingApps: App[] = data.apps || [];
  
  // 기존 앱 slug 목록
  const existingSlugs = new Set(existingApps.map(app => app.slug));
  
  // 새 앱 추가
  let addedCount = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < newApps.length; i++) {
    const newApp = newApps[i];
    
    if (!existingSlugs.has(newApp.slug)) {
      const app: App = {
        id: newApp.slug,
        name: newApp.name,
        slug: newApp.slug,
        icon: newApp.icon,
        description: generateDescription(newApp.name),
        categoryId: newApp.category,
        url: `/apps/${newApp.slug}`,
        image: IMAGE_POOL[i % IMAGE_POOL.length],
        createdAt: today,
      };
      
      existingApps.push(app);
      addedCount++;
      console.log(`✅ 추가: ${newApp.name} (${newApp.slug})`);
    } else {
      console.log(`⏭️  스킵: ${newApp.name} (이미 존재)`);
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
  updateAppsJsonBulk();
}

export { updateAppsJsonBulk };

