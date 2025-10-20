#!/usr/bin/env ts-node
/**
 * remove-coupang-data.ts
 * 
 * 목적: 하드코딩된 쿠팡 상품 데이터 제거
 */

import * as fs from 'fs';
import * as path from 'path';

const FILES = [
  'app/apps/bodyfat-measure/page.tsx',
  'app/apps/breakfast-what-to-eat/page.tsx',
  'app/apps/study-cursor-prompts/page.tsx',
];

function removeCoupangData(filePath: string): void {
  const fullPath = path.resolve(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // coupang 관련 import 제거
  content = content.replace(/import\s+.*CoupangBanner.*;\s*\n/g, '');
  
  // coupang 관련 interface/type 제거
  content = content.replace(/interface\s+Coupang[^\{]*\{[^}]*\}\s*\n/gi, '');
  
  // coupang 관련 변수/함수 제거
  content = content.replace(/const\s+COUPANG[^;]*;[\s\S]*?\];/gi, '');
  content = content.replace(/const\s+getCoupang[^\{]*\{[\s\S]*?\n\};/gi, '');
  
  // coupangProducts 필드 제거
  content = content.replace(/,?\s*coupangProducts:\s*Array<\{[^}]*\}>/g, '');
  content = content.replace(/,?\s*coupangProducts:\s*[^,}]*/g, '');
  content = content.replace(/,?\s*coupangUrl:\s*string[,;]/g, '');
  
  // coupang URL 제거
  content = content.replace(/coupangUrl:\s*"[^"]*"/g, 'coupangUrl: ""');
  content = content.replace(/thumbnail\d+\.coupangcdn\.com[^"']*/gi, '');
  
  // coupang 관련 JSX 제거
  content = content.replace(/<a[^>]*href=\{[^}]*coupang[^}]*\}[^>]*>[\s\S]*?<\/a>/gi, '');
  
  // 빈 줄 정리
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ ${filePath} 쿠팡 데이터 제거 완료`);
}

function main() {
  console.log('🧹 쿠팡 상품 데이터 제거 시작...\n');
  
  FILES.forEach(file => {
    try {
      removeCoupangData(file);
    } catch (error) {
      console.error(`❌ ${file} 처리 실패:`, error);
    }
  });
  
  console.log('\n✅ 쿠팡 데이터 제거 완료!\n');
}

main();

