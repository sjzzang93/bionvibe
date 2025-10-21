import * as fs from 'fs';
import * as path from 'path';

const appsDir = path.join(__dirname, '../app/apps');

// 쿠팡 footer 제거 패턴들
const patterns = [
  // 패턴 1: footer with 쿠팡
  {
    regex: /\s*<footer className="mt-6 space-y-3 pb-8 text-black placeholder-gray-500">\s*\n\s*<p className="text-xs text-gray-500 text-center px-4 text-black placeholder-gray-500">\s*\n\s*이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다\.\s*\n\s*<\/p>\s*\n\s*<\/footer>/g,
    replacement: ''
  },
  // 패턴 2: footer (다른 변형)
  {
    regex: /\s*<footer[^>]*>\s*\n[^<]*<p[^>]*>\s*\n[^<]*이 포스팅은 쿠팡[^<]*<\/p>\s*\n\s*<\/footer>/g,
    replacement: ''
  },
  // 패턴 3: 단순 쿠팡 멘트만
  {
    regex: /\s*<p[^>]*>\s*[*\s]*이 포스팅은 쿠팡[^<]*<\/p>/g,
    replacement: ''
  }
];

function processFile(filePath: string) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    patterns.forEach(pattern => {
      const before = content;
      content = content.replace(pattern.regex, pattern.replacement);
      if (before !== content) {
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ ${path.basename(path.dirname(filePath))}/page.tsx`);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`❌ ${filePath}: ${err}`);
    return false;
  }
}

function processDirectory(dir: string) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pagePath = path.join(dir, entry.name, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        if (processFile(pagePath)) {
          count++;
        }
      }
    }
  }

  return count;
}

console.log('🧹 쿠팡 footer 제거 시작...\n');
const count = processDirectory(appsDir);
console.log(`\n✨ 총 ${count}개 파일 수정 완료!`);

