const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// AdOverlay 컴포넌트를 사용하는데 import가 없는 파일 찾기
const result = execSync('grep -l "<AdOverlay" app/apps/*/page.tsx app/apps/*/*/page.tsx 2>/dev/null || true').toString();
const filesWithComponent = result.trim().split('\n').filter(f => f);

let fixedCount = 0;
let alreadyHasImport = 0;

filesWithComponent.forEach(filePath => {
  if (!filePath) return;

  const content = fs.readFileSync(filePath, 'utf-8');

  // 이미 import가 있으면 스킵
  if (content.includes('AdOverlay') && content.includes("from '@/app/components/AdOverlay'")) {
    console.log(`⏭️  ${filePath}: import 있음`);
    alreadyHasImport++;
    return;
  }

  // AdOverlay 컴포넌트는 사용하는데 import가 없는 경우
  if (content.includes('<AdOverlay') && !content.includes("from '@/app/components/AdOverlay'")) {
    console.log(`🔧 ${filePath}: import 추가 필요`);

    // import 섹션 찾기 (마지막 import 다음에 추가)
    const importRegex = /^import\s+.*?;$/gm;
    const imports = content.match(importRegex);

    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const newContent = content.replace(
        lastImport,
        `${lastImport}\nimport AdOverlay from '@/app/components/AdOverlay';`
      );

      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ ${filePath}: import 추가 완료`);
      fixedCount++;
    } else {
      console.log(`❌ ${filePath}: import 섹션을 찾을 수 없음`);
    }
  }
});

console.log('\n=== 결과 ===');
console.log(`✅ 수정: ${fixedCount}개`);
console.log(`⏭️  스킵: ${alreadyHasImport}개`);
