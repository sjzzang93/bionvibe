const fs = require('fs');
const path = require('path');

// 중첩 라우트를 가진 앱들의 페이지 찾기
const nestedPages = [
  'app/apps/hobby-finder/result/page.tsx',
  'app/apps/hobby-finder/test/page.tsx',
  'app/apps/draw-psychology/result/page.tsx',
  'app/apps/draw-psychology/draw/page.tsx',
  'app/apps/nonsense-escape/result/page.tsx',
  'app/apps/nonsense-escape/limit/page.tsx',
  'app/apps/nonsense-escape/quiz/page.tsx',
  'app/apps/nonsense-escape/daily/page.tsx',
  'app/apps/nonsense-escape/event/page.tsx',
  'app/apps/nonsense-escape/roulette/page.tsx',
];

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

nestedPages.forEach(pagePath => {
  const filePath = path.join(__dirname, '..', pagePath);

  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${pagePath}: 파일 없음`);
    skipCount++;
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 이미 AdOverlay가 있으면 스킵
  if (content.includes('AdOverlay')) {
    console.log(`⏭️  ${pagePath}: 이미 AdOverlay 있음`);
    skipCount++;
    return;
  }

  try {
    // 1. AdOverlay import 추가
    if (!content.includes("import AdOverlay from '@/app/components/AdOverlay'")) {
      // import 문 마지막에 추가
      const lastImportMatch = content.match(/import[^;]*;(?=\n\n|\ntype|\ninterface|\nexport)/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        content = content.replace(
          lastImport,
          `${lastImport}\nimport AdOverlay from '@/app/components/AdOverlay';`
        );
      }
    }

    // 2. AdOverlay 컴포넌트 추가
    if (content.includes('<PremiumLayout')) {
      content = content.replace(
        /(<PremiumLayout[^>]*>\s*)/,
        `$1\n        <AdOverlay />`
      );
    } else if (content.includes('return (')) {
      content = content.replace(
        /(return \(\s*<[^>]+>\s*)/,
        `$1\n      <AdOverlay />`
      );
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${pagePath}: AdOverlay 추가 완료`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${pagePath}: 에러 - ${error.message}`);
    errorCount++;
  }
});

console.log('\n=== 중첩 라우트 결과 ===');
console.log(`✅ 성공: ${successCount}개`);
console.log(`⏭️  스킵: ${skipCount}개`);
console.log(`❌ 실패: ${errorCount}개`);
