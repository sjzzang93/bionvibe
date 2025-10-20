#!/usr/bin/env ts-node
/**
 * sanitize-no-ads.ts
 * 
 * 목적: 리포지토리 전체에서 광고 관련 키워드를 자동으로 탐지하고 제거
 * - 소스 코드 (.ts, .tsx, .js, .jsx)
 * - 스타일 파일 (.css, .scss)
 * - HTML/마크다운 (.html, .md)
 * - JSON 파일 (.json)
 * - 주석 포함 모든 텍스트
 */

import * as fs from 'fs';
import * as path from 'path';

// 금지 키워드 (대소문자 무시)
const FORBIDDEN_PATTERNS = [
  /pagead2\.googlesyndication\.com/gi,
  /adsbygoogle/gi,
  /google-adsense-account/gi,
  /data-ad-client/gi,
  /data-ad-slot/gi,
  /google_ad_client/gi,
  /link\.coupang\.com/gi,
  /ads-partners\.coupang/gi,
  /coupa\.ng/gi,
  /\badsense\b/gi,
  /\badmob\b/gi,
  /\baffiliate\b/gi, // 비즈니스 맥락에서의 affiliate
  /ad-banner/gi,
  /\badslot\b/gi,
  /\badunit\b/gi,
  /\bcoupang\b/gi,
  /unsafe-url/gi,
  /googlesyndication/gi,
];

// 제외할 디렉토리/파일
const EXCLUDED_PATHS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.cache',
  'coverage',
  'scripts/sanitize-no-ads.ts', // 자기 자신 제외
  'scripts/guard-no-ads.test.ts',
  'scripts/migrate-app.ts', // 마이그레이션 스크립트 (광고 패턴 포함)
  'scripts/cleanup-ads.ts', // 정화 스크립트 (광고 패턴 포함)
  'scripts/remove-coupang-data.ts', // 쿠팡 제거 스크립트 (광고 패턴 포함)
  'scripts/batch-migrate-all.ts', // 대량 마이그레이션 스크립트
  'docs/ads-audit.md',
];

// 스캔할 파일 확장자
const SCANNABLE_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx',
  '.css', '.scss', '.sass',
  '.html', '.md',
  '.json',
  '.svg', // SVG 내부 텍스트도 검사
];

interface MatchResult {
  filePath: string;
  lineNumber: number;
  line: string;
  pattern: string;
}

const matches: MatchResult[] = [];

/**
 * 경로가 제외 대상인지 확인
 */
function isExcluded(filePath: string): boolean {
  return EXCLUDED_PATHS.some(excluded => 
    filePath.includes(path.sep + excluded + path.sep) || 
    filePath.endsWith(path.sep + excluded) ||
    filePath.startsWith(excluded + path.sep)
  );
}

/**
 * 파일이 스캔 가능한 확장자인지 확인
 */
function isScannable(filePath: string): boolean {
  return SCANNABLE_EXTENSIONS.some(ext => filePath.endsWith(ext));
}

/**
 * 디렉토리를 재귀적으로 탐색
 */
function scanDirectory(dirPath: string): void {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (isExcluded(fullPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && isScannable(fullPath)) {
        scanFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`디렉토리 스캔 오류 [${dirPath}]:`, error);
  }
}

/**
 * 파일 내용을 스캔하여 금지 키워드 탐지
 */
function scanFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      FORBIDDEN_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          matches.push({
            filePath,
            lineNumber: index + 1,
            line: line.trim(),
            pattern: pattern.source,
          });
        }
      });
    });
  } catch (error) {
    console.error(`파일 스캔 오류 [${filePath}]:`, error);
  }
}

/**
 * 메인 실행
 */
function main(): void {
  console.log('🔍 광고 키워드 스캔 시작...\n');
  
  const rootDir = path.resolve(__dirname, '..');
  scanDirectory(rootDir);
  
  if (matches.length === 0) {
    console.log('✅ 광고 관련 키워드가 발견되지 않았습니다!\n');
    process.exit(0);
  }
  
  console.error('❌ 광고 관련 키워드가 발견되었습니다:\n');
  
  matches.forEach(match => {
    console.error(`  📁 ${match.filePath}`);
    console.error(`     줄 ${match.lineNumber}: ${match.line}`);
    console.error(`     패턴: ${match.pattern}\n`);
  });
  
  console.error(`\n총 ${matches.length}건의 위반 발견`);
  console.error('⚠️  해당 코드를 수동으로 제거하거나 파일을 삭제해주세요.\n');
  
  process.exit(1);
}

main();

