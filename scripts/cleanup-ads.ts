#!/usr/bin/env ts-node
/**
 * cleanup-ads.ts
 * 
 * 목적: unsafe-url, AdSense 등 남은 광고 흔적 자동 제거
 */

import * as fs from 'fs';
import * as path from 'path';

const FILES_TO_CLEAN = [
  'app/apps/health-supplement-recommend/page.tsx',
  'app/apps/iq-test/page.tsx',
  'app/apps/lifestyle-face-fortune/page.tsx',
  'app/apps/lifestyle-palm-reading/page.tsx',
  'app/apps/lottery-number-generator/page.tsx',
  'app/apps/mood-cheer-up/page.tsx',
  'app/apps/past-life-job/page.tsx',
  'app/apps/quit-smoking-challenge/page.tsx',
  'app/apps/saju-mbti-jobs/page.tsx',
  'app/apps/study-dev-vocab/page.tsx',
  'app/apps/travel-destinations/page.tsx',
  'app/apps/voice-fortune/page.tsx',
];

function cleanFile(filePath: string): number {
  const fullPath = path.resolve(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let removedCount = 0;
  
  // unsafe-url 속성 제거
  const unsafeUrlPattern = /\s*referrerPolicy="unsafe-url"\s*/g;
  const matches1 = content.match(unsafeUrlPattern);
  if (matches1) {
    removedCount += matches1.length;
    content = content.replace(unsafeUrlPattern, '');
  }
  
  // AdSense 주석 제거
  const adsenseCommentPattern = /\s*<!--\s*광고\s*영역.*?-->/g;
  const matches2 = content.match(adsenseCommentPattern);
  if (matches2) {
    removedCount += matches2.length;
    content = content.replace(adsenseCommentPattern, '');
  }
  
  // 빈 iframe 제거 (src=""인 경우)
  const emptyIframePattern = /<iframe[^>]*src=""[^>]*>\s*<\/iframe>/g;
  const matches3 = content.match(emptyIframePattern);
  if (matches3) {
    removedCount += matches3.length;
    content = content.replace(emptyIframePattern, '');
  }
  
  // 빈 div 제거
  content = content.replace(/<div[^>]*>\s*<\/div>\s*\n?/g, '');
  
  // 연속된 빈 줄 정리
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  
  return removedCount;
}

function main() {
  console.log('🧹 광고 흔적 자동 제거 시작...\n');
  
  let totalRemoved = 0;
  
  for (const filePath of FILES_TO_CLEAN) {
    const removed = cleanFile(filePath);
    if (removed > 0) {
      console.log(`✅ ${filePath}: ${removed}건 제거`);
      totalRemoved += removed;
    }
  }
  
  console.log(`\n✅ 총 ${totalRemoved}건의 광고 흔적 제거 완료!\n`);
}

main();

