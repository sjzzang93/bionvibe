import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appsDir = path.join(__dirname, '../app/apps');

// 모든 page.tsx 파일 찾기
function getAllPageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      const pagePath = path.join(fullPath, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        files.push(pagePath);
      }
    }
  }
  
  return files;
}

const pageFiles = getAllPageFiles(appsDir);
console.log(`📝 Found ${pageFiles.length} app pages\n`);

let updated = 0;
let skipped = 0;

for (const file of pageFiles) {
  const appName = path.basename(path.dirname(file));
  console.log(`Processing: ${appName}`);
  
  let content = fs.readFileSync(file, 'utf-8');
  
  // 이미 AppFooter가 있는지 확인
  if (content.includes('import AppFooter') || content.includes('<AppFooter')) {
    console.log(`  ✓ Already has AppFooter, skipping...\n`);
    skipped++;
    continue;
  }
  
  // 1. Import 추가
  const importRegex = /^(import.*from ['"]react['"];?\s*\n)/m;
  if (importRegex.test(content)) {
    content = content.replace(importRegex, '$1import AppFooter from "@/app/components/AppFooter";\n');
    console.log(`  → Added import`);
  } else {
    // useState가 있는 경우
    const useStateRegex = /^(import.*useState.*\n)/m;
    if (useStateRegex.test(content)) {
      content = content.replace(useStateRegex, '$1import AppFooter from "@/app/components/AppFooter";\n');
      console.log(`  → Added import after useState`);
    } else {
      // 첫 번째 import 다음에 추가
      const firstImportRegex = /^(import.*\n)/m;
      if (firstImportRegex.test(content)) {
        content = content.replace(firstImportRegex, '$1import AppFooter from "@/app/components/AppFooter";\n');
        console.log(`  → Added import after first import`);
      }
    }
  }
  
  // 2. Footer 컴포넌트 추가 (마지막 닫는 태그 전)
  const lines = content.split('\n');
  let insertIndex = -1;
  let indentation = '';
  
  // 역순으로 찾기 - 마지막 JSX 닫는 태그 찾기
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    // </main>, </section>, 또는 return 바로 전의 마지막 </div>
    if (line === '</main>' || line === '</section>') {
      insertIndex = i;
      const match = lines[i].match(/^(\s*)/);
      indentation = match ? match[1] : '    ';
      break;
    }
    // </div>이면서 몇 줄 위에 return이 있는 경우
    if (line === '</div>') {
      // 위로 10줄 정도 체크
      for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
        if (lines[j].includes('return (') || lines[j].trim() === 'return (') {
          insertIndex = i;
          const match = lines[i].match(/^(\s*)/);
          indentation = match ? match[1] : '    ';
          break;
        }
      }
      if (insertIndex !== -1) break;
    }
  }
  
  if (insertIndex !== -1) {
    // AppFooter 추가
    const footerLine = `${indentation}  {/* 제작자 서명 */}`;
    const componentLine = `${indentation}  <AppFooter />`;
    const emptyLine = '';
    
    lines.splice(insertIndex, 0, footerLine, componentLine, emptyLine);
    content = lines.join('\n');
    console.log(`  → Added <AppFooter /> component`);
    
    // 파일 저장
    fs.writeFileSync(file, content, 'utf-8');
    updated++;
    console.log(`  ✅ Updated!\n`);
  } else {
    console.log(`  ⚠️  Could not find closing tag\n`);
    skipped++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`✅ Updated: ${updated} files`);
console.log(`⏭️  Skipped: ${skipped} files`);
console.log('='.repeat(50));

