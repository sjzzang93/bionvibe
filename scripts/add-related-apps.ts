import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appsDir = path.join(__dirname, '../app/apps');

// 제외할 폴더 (layout.tsx만 있는 곳)
const skipFolders = ['layout.tsx'];

// 모든 앱 폴더 가져오기
const appFolders = fs.readdirSync(appsDir)
  .filter(name => {
    const fullPath = path.join(appsDir, name);
    return fs.statSync(fullPath).isDirectory() && !skipFolders.includes(name);
  });

console.log(`📁 총 ${appFolders.length}개의 앱 폴더 발견`);

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

appFolders.forEach(folderName => {
  const pagePath = path.join(appsDir, folderName, 'page.tsx');
  
  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  ${folderName}: page.tsx 없음 - 건너뜀`);
    skipCount++;
    return;
  }

  try {
    let content = fs.readFileSync(pagePath, 'utf-8');

    // 이미 RelatedApps가 있는지 확인
    if (content.includes('RelatedApps')) {
      console.log(`✅ ${folderName}: 이미 추가됨 - 건너뜀`);
      skipCount++;
      return;
    }

    // import 추가
    if (!content.includes("import RelatedApps from '@/app/components/RelatedApps'")) {
      // 기존 import 문 다음에 추가
      const importMatch = content.match(/(import.*?from.*?;[\r\n]+)+/);
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[0]);
        const insertPosition = lastImportIndex + importMatch[0].length;
        content = content.slice(0, insertPosition) + 
                  "import RelatedApps from '@/app/components/RelatedApps';\n" +
                  content.slice(insertPosition);
      }
    }

    // 컴포넌트 추가 (AppFooter 위 또는 마지막 return 블록 끝에)
    // AppFooter를 찾아서 그 위에 추가
    if (content.includes('<AppFooter')) {
      content = content.replace(
        /(\s*)(<AppFooter[^>]*\/>)/,
        `$1{/* 관련 앱 추천 */}\n$1<RelatedApps currentAppSlug="${folderName}" className="mt-8 mb-8" />\n\n$1$2`
      );
    } else {
      // AppFooter가 없으면 마지막 </div> 전에 추가
      const lastDivIndex = content.lastIndexOf('</div>\n  );');
      if (lastDivIndex !== -1) {
        content = content.slice(0, lastDivIndex) +
                  `      {/* 관련 앱 추천 */}\n` +
                  `      <RelatedApps currentAppSlug="${folderName}" className="mt-8 mb-8" />\n\n` +
                  content.slice(lastDivIndex);
      }
    }

    fs.writeFileSync(pagePath, content, 'utf-8');
    console.log(`✨ ${folderName}: 성공적으로 추가됨`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${folderName}: 에러 발생 -`, error);
    errorCount++;
  }
});

console.log('\n📊 결과:');
console.log(`✅ 성공: ${successCount}개`);
console.log(`⏭️  건너뜀: ${skipCount}개`);
console.log(`❌ 실패: ${errorCount}개`);
console.log(`📦 총: ${appFolders.length}개`);
