/**
 * guard-no-ads.test.ts
 * 
 * 목적: 빌드 전 광고 관련 키워드가 0건임을 보장하는 테스트
 * - 테스트 실패 시 빌드 중단
 * - CI/CD 파이프라인에서 자동 실행
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// 금지 키워드 (대소문자 무시)
const FORBIDDEN_KEYWORDS = [
  'pagead2.googlesyndication.com',
  'adsbygoogle',
  'google-adsense-account',
  'data-ad-client',
  'data-ad-slot',
  'google_ad_client',
  'link.coupang.com',
  'ads-partners.coupang.com',
  'coupa.ng',
  'adsense',
  'admob',
  'affiliate',
  'ad-banner',
  'adslot',
  'adunit',
  'coupang',
  'unsafe-url',
  'googlesyndication',
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
  'scripts/sanitize-no-ads.ts',
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
  '.svg',
];

interface Violation {
  filePath: string;
  lineNumber: number;
  line: string;
  keyword: string;
}

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
 * 디렉토리를 재귀적으로 탐색하여 모든 위반 사항 수집
 */
function collectViolations(dirPath: string, violations: Violation[] = []): Violation[] {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (isExcluded(fullPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        collectViolations(fullPath, violations);
      } else if (entry.isFile() && isScannable(fullPath)) {
        checkFile(fullPath, violations);
      }
    }
  } catch (error) {
    // 디렉토리 접근 오류는 무시 (권한 문제 등)
  }
  
  return violations;
}

/**
 * 파일 내용을 검사하여 금지 키워드 탐지
 */
function checkFile(filePath: string, violations: Violation[]): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      FORBIDDEN_KEYWORDS.forEach(keyword => {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (regex.test(line)) {
          violations.push({
            filePath,
            lineNumber: index + 1,
            line: line.trim(),
            keyword,
          });
        }
      });
    });
  } catch (error) {
    // 파일 읽기 오류는 무시
  }
}

describe('광고 키워드 가드 테스트', () => {
  it('프로젝트 전체에 광고 관련 키워드가 없어야 함', () => {
    const rootDir = path.resolve(__dirname, '..');
    const violations = collectViolations(rootDir);
    
    if (violations.length > 0) {
      const errorMessage = violations.map(v => 
        `  ❌ ${v.filePath}:${v.lineNumber}\n     키워드: "${v.keyword}"\n     내용: ${v.line}`
      ).join('\n\n');
      
      throw new Error(
        `\n\n🚨 광고 관련 키워드가 ${violations.length}건 발견되었습니다!\n\n${errorMessage}\n`
      );
    }
    
    expect(violations).toHaveLength(0);
  });
  
  it('금지 키워드 목록이 비어있지 않아야 함', () => {
    expect(FORBIDDEN_KEYWORDS.length).toBeGreaterThan(0);
  });
  
  it('제외 경로 목록이 node_modules를 포함해야 함', () => {
    expect(EXCLUDED_PATHS).toContain('node_modules');
  });
});

