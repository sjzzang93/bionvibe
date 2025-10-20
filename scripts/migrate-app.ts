#!/usr/bin/env ts-node
/**
 * migrate-app.ts
 * 
 * 목적: playbion 프로젝트에서 광고 제거 후 순수 기능만 추출하여 마이그레이션
 * 
 * 사용법:
 *   ts-node scripts/migrate-app.ts <source-app-path> <target-slug>
 * 
 * 예시:
 *   ts-node scripts/migrate-app.ts /Users/fire/Desktop/BION/playbion/app/air-quality air-quality
 */

import * as fs from 'fs';
import * as path from 'path';

// 광고 관련 제거 대상
const AD_PATTERNS = [
  // Import 문
  /import\s+.*AdSense.*from.*;\s*\n/gi,
  /import\s+.*AdBanner.*from.*;\s*\n/gi,
  /import\s+.*CoupangBanner.*from.*;\s*\n/gi,
  /import\s+.*GoogleAnalytics.*from.*;\s*\n/gi,
  /import\s+.*\{[^}]*ADSENSE[^}]*\}.*from.*;\s*\n/gi,
  
  // JSX 컴포넌트
  /<AdSense[^>]*>[\s\S]*?<\/AdSense>/gi,
  /<AdSense[^>]*\/>/gi,
  /<AdBanner[^>]*>[\s\S]*?<\/AdBanner>/gi,
  /<AdBanner[^>]*\/>/gi,
  /<CoupangBanner[^>]*>[\s\S]*?<\/CoupangBanner>/gi,
  /<CoupangBanner[^>]*\/>/gi,
  /<GoogleAnalytics[^>]*\/>/gi,
  
  // Coupang 배너 (a > img 구조)
  /<a[^>]*href="https:\/\/[^"]*"[^>]*>\s*<img[^>]*src="https:\/\/ads-partners\.coupang\.com[^"]*"[^>]*\/>\s*<\/a>/gi,
  /<div[^>]*>\s*<a[^>]*>\s*<img[^>]*ads-partners\.coupang\.com[^>]*\/>\s*<\/a>\s*<\/div>/gi,
  
  // 광고 관련 div/section
  /<div[^>]*className="[^"]*ad-banner[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
  /<section[^>]*className="[^"]*ad-section[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
  
  // 광고 관련 주석
  /\/\*\s*광고.*?\*\//gi,
  /\/\/\s*광고.*/gi,
  /\/\*\s*AdSense.*?\*\//gi,
  /\/\/\s*AdSense.*/gi,
  
  // Google AdSense 스크립트/링크
  /pagead2\.googlesyndication\.com[^\s]*/gi,
  /(ins|script)[^>]*adsbygoogle[^>]*>[\s\S]*?<\/(ins|script)>/gi,
  
  // Coupang 링크/도메인
  /link\.coupang\.com[^\s"]*/gi,
  /https?:\/\/coupa\.ng[^\s"]*/gi,
  /ads-partners\.coupang\.com[^\s"]*/gi,
];

interface MigrationResult {
  success: boolean;
  sourcePath: string;
  targetPath: string;
  removedAdCount: number;
  errors: string[];
}

/**
 * 파일 내용에서 광고 관련 코드 제거
 */
function stripAdContent(content: string): { cleaned: string; removedCount: number } {
  let cleaned = content;
  let removedCount = 0;
  
  AD_PATTERNS.forEach(pattern => {
    const matches = cleaned.match(pattern);
    if (matches) {
      removedCount += matches.length;
      cleaned = cleaned.replace(pattern, '');
    }
  });
  
  // 연속된 빈 줄을 2줄로 제한
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return { cleaned, removedCount };
}

/**
 * 디렉토리 재귀 복사 (광고 제거 포함)
 */
function copyDirectory(sourcePath: string, targetPath: string): number {
  let totalRemoved = 0;
  
  // 타깃 디렉토리 생성
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  
  const entries = fs.readdirSync(sourcePath, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(sourcePath, entry.name);
    const destPath = path.join(targetPath, entry.name);
    
    if (entry.isDirectory()) {
      totalRemoved += copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(srcPath, 'utf-8');
      const { cleaned, removedCount } = stripAdContent(content);
      fs.writeFileSync(destPath, cleaned, 'utf-8');
      totalRemoved += removedCount;
    }
  }
  
  return totalRemoved;
}

/**
 * 단일 파일 마이그레이션
 */
function migrateFile(sourcePath: string, targetPath: string): number {
  const content = fs.readFileSync(sourcePath, 'utf-8');
  const { cleaned, removedCount } = stripAdContent(content);
  
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  fs.writeFileSync(targetPath, cleaned, 'utf-8');
  return removedCount;
}

/**
 * 앱 마이그레이션 실행
 */
function migrateApp(sourceAppPath: string, targetSlug: string): MigrationResult {
  const result: MigrationResult = {
    success: false,
    sourcePath: sourceAppPath,
    targetPath: '',
    removedAdCount: 0,
    errors: [],
  };
  
  try {
    // 소스 경로 확인
    if (!fs.existsSync(sourceAppPath)) {
      result.errors.push(`소스 경로가 존재하지 않습니다: ${sourceAppPath}`);
      return result;
    }
    
    // 타깃 경로 설정
    const targetBase = path.resolve(__dirname, '..');
    const targetAppPath = path.join(targetBase, 'app', 'apps', targetSlug);
    result.targetPath = targetAppPath;
    
    // 소스가 디렉토리인 경우
    if (fs.statSync(sourceAppPath).isDirectory()) {
      result.removedAdCount = copyDirectory(sourceAppPath, targetAppPath);
    } 
    // 소스가 파일인 경우
    else {
      const targetFilePath = path.join(targetAppPath, 'page.tsx');
      result.removedAdCount = migrateFile(sourceAppPath, targetFilePath);
    }
    
    result.success = true;
    console.log(`✅ 마이그레이션 완료: ${targetSlug}`);
    console.log(`   제거된 광고 요소: ${result.removedAdCount}건`);
    console.log(`   타깃 경로: ${result.targetPath}\n`);
    
  } catch (error: any) {
    result.errors.push(error.message || String(error));
    console.error(`❌ 마이그레이션 실패: ${targetSlug}`);
    console.error(`   오류: ${error.message}\n`);
  }
  
  return result;
}

/**
 * 메인 실행
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('사용법: ts-node scripts/migrate-app.ts <source-app-path> <target-slug>');
    console.error('예시: ts-node scripts/migrate-app.ts /Users/fire/Desktop/BION/playbion/app/air-quality air-quality');
    process.exit(1);
  }
  
  const [sourceAppPath, targetSlug] = args;
  
  console.log('🚀 앱 마이그레이션 시작...');
  console.log(`   소스: ${sourceAppPath}`);
  console.log(`   타깃: ${targetSlug}\n`);
  
  const result = migrateApp(sourceAppPath, targetSlug);
  
  if (!result.success) {
    console.error('마이그레이션 실패:', result.errors.join(', '));
    process.exit(1);
  }
  
  console.log('🎉 마이그레이션 성공!');
}

// 직접 실행 시에만 main() 호출
if (require.main === module) {
  main();
}

export { migrateApp, stripAdContent };

