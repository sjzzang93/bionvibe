import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsJsonPath = path.join(__dirname, '../data/apps.json');

// 제거할 중복 앱 slug 목록 (더 나중에 추가된 것들)
const duplicatesToRemove = [
  'health-water-intake',      // water-intake 남김
  'health-calorie-calculator', // calorie-calculator 남김
  'study-flashcard',           // flashcard 남김
  'mbti-32',                   // mbti-test 남김
  'fortune-today',             // today-fortune 남김
];

function removeDuplicates() {
  console.log('🗑️  중복 앱 제거 시작...\n');
  
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  const originalCount = data.apps.length;
  
  // 제거할 앱 출력
  duplicatesToRemove.forEach((slug) => {
    const app = data.apps.find((a: any) => a.slug === slug);
    if (app) {
      console.log(`🗑️  제거: ${app.name} (${slug})`);
    }
  });
  
  // 중복 제거
  data.apps = data.apps.filter((app: any) => !duplicatesToRemove.includes(app.slug));
  
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  const removedCount = originalCount - data.apps.length;
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ ${removedCount}개 중복 앱 제거 완료!`);
  console.log(`📊 전체 앱: ${originalCount}개 → ${data.apps.length}개`);
  console.log(`📝 apps.json 저장 완료!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // 남은 앱 목록 확인
  console.log('📋 남은 앱 목록:');
  const names = data.apps.map((app: any) => app.name).sort();
  const duplicateNames = names.filter((name: string, index: number) => names.indexOf(name) !== index);
  
  if (duplicateNames.length === 0) {
    console.log('✅ 중복 이름 없음! 모든 앱이 고유합니다!\n');
  } else {
    console.log(`⚠️  여전히 중복된 이름이 있습니다:\n`);
    new Set(duplicateNames).forEach((name: string) => {
      console.log(`   - ${name}`);
    });
  }
}

removeDuplicates();

import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsJsonPath = path.join(__dirname, '../data/apps.json');

// 제거할 중복 앱 slug 목록 (더 나중에 추가된 것들)
const duplicatesToRemove = [
  'health-water-intake',      // water-intake 남김
  'health-calorie-calculator', // calorie-calculator 남김
  'study-flashcard',           // flashcard 남김
  'mbti-32',                   // mbti-test 남김
  'fortune-today',             // today-fortune 남김
];

function removeDuplicates() {
  console.log('🗑️  중복 앱 제거 시작...\n');
  
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  const originalCount = data.apps.length;
  
  // 제거할 앱 출력
  duplicatesToRemove.forEach((slug) => {
    const app = data.apps.find((a: any) => a.slug === slug);
    if (app) {
      console.log(`🗑️  제거: ${app.name} (${slug})`);
    }
  });
  
  // 중복 제거
  data.apps = data.apps.filter((app: any) => !duplicatesToRemove.includes(app.slug));
  
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  const removedCount = originalCount - data.apps.length;
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ ${removedCount}개 중복 앱 제거 완료!`);
  console.log(`📊 전체 앱: ${originalCount}개 → ${data.apps.length}개`);
  console.log(`📝 apps.json 저장 완료!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // 남은 앱 목록 확인
  console.log('📋 남은 앱 목록:');
  const names = data.apps.map((app: any) => app.name).sort();
  const duplicateNames = names.filter((name: string, index: number) => names.indexOf(name) !== index);
  
  if (duplicateNames.length === 0) {
    console.log('✅ 중복 이름 없음! 모든 앱이 고유합니다!\n');
  } else {
    console.log(`⚠️  여전히 중복된 이름이 있습니다:\n`);
    new Set(duplicateNames).forEach((name: string) => {
      console.log(`   - ${name}`);
    });
  }
}

removeDuplicates();

