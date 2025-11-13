const fs = require('fs');
const path = require('path');

// 모든 앱 디렉토리 가져오기
const appsDir = path.join(__dirname, '../app/apps');
const apps = fs.readdirSync(appsDir).filter(file => {
  return fs.statSync(path.join(appsDir, file)).isDirectory();
});

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

apps.forEach(app => {
  const filePath = path.join(appsDir, app, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${app}: page.tsx 파일 없음`);
    skipCount++;
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 이미 AdOverlay가 있으면 스킵
  if (content.includes('AdOverlay')) {
    console.log(`⏭️  ${app}: 이미 AdOverlay 있음`);
    skipCount++;
    return;
  }

  try {
    // 1. AdOverlay import 추가
    const importRegex = /(import.*from.*['"])/;
    if (!content.includes("import AdOverlay from '@/app/components/AdOverlay'")) {
      content = content.replace(
        /(import.*['"]@\/app\/components\/AdSense['"];?\n)/,
        `$1import AdOverlay from '@/app/components/AdOverlay';\n`
      );
    }

    // 2. AdOverlay 컴포넌트 추가 - PremiumLayout 바로 다음에 삽입
    if (content.includes('<PremiumLayout')) {
      // PremiumLayout의 시작 태그 다음에 AdOverlay 추가
      content = content.replace(
        /(<PremiumLayout[^>]*>\s*)/,
        `$1\n        <AdOverlay />`
      );
    } else if (content.includes('return (')) {
      // PremiumLayout이 없으면 return 문 다음에 추가
      content = content.replace(
        /(return \(\s*<[^>]+>\s*)/,
        `$1\n      <AdOverlay />`
      );
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${app}: AdOverlay 추가 완료`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${app}: 에러 발생 - ${error.message}`);
    errorCount++;
  }
});

console.log('\n=== 결과 ===');
console.log(`✅ 성공: ${successCount}개`);
console.log(`⏭️  스킵: ${skipCount}개`);
console.log(`❌ 실패: ${errorCount}개`);
console.log(`📊 총 앱: ${apps.length}개`);
