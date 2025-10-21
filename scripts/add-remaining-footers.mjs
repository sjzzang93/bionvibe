import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apps = [
  "water-intake", "typing-speed-test", "travel-packing-list", "today-fortune",
  "startup-naming", "phone-usage-analyzer", "meat-calculator", "mafia-game",
  "life-support", "gomoku", "gift-finder", "finance-loan-refinance",
  "finance-emergency-fund", "dream-interpreter", "crypto-calculator", "chess",
  "baduk", "arcade-mini-games", "analysis-handwriting"
];

let updated = 0;

for (const app of apps) {
  const file = path.join(__dirname, '../app/apps', app, 'page.tsx');
  
  if (!fs.existsSync(file)) {
    console.log(`⚠️  ${app}: 파일 없음`);
    continue;
  }
  
  let content = fs.readFileSync(file, 'utf-8');
  
  // 이미 있으면 스킵
  if (content.includes('AppFooter')) {
    console.log(`✓ ${app}: 이미 추가됨`);
    continue;
  }
  
  // 1. Import 추가
  if (content.includes("import { useState }")) {
    content = content.replace(
      /(import { useState }[^;]*;)/,
      "$1\nimport AppFooter from '@/app/components/AppFooter';"
    );
  } else if (content.includes("import")) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lines.splice(i + 1, 0, "import AppFooter from '@/app/components/AppFooter';");
        break;
      }
    }
    content = lines.join('\n');
  }
  
  // 2. 마지막에서 2번째 </div> 앞에 추가 (보통 마지막은 최외곽 div)
  const lines = content.split('\n');
  const divCloses = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '</div>') {
      divCloses.push(i);
    }
  }
  
  if (divCloses.length >= 2) {
    // 마지막에서 2번째 </div> 또는 마지막 </div> 전에 추가
    const insertPos = divCloses[divCloses.length - 2];
    const indent = lines[insertPos].match(/^(\s*)/)[1];
    
    lines.splice(insertPos, 0, '');
    lines.splice(insertPos + 1, 0, indent + '{/* 제작자 서명 */}');
    lines.splice(insertPos + 2, 0, indent + '<AppFooter />');
    
    content = lines.join('\n');
    fs.writeFileSync(file, content, 'utf-8');
    
    console.log(`✅ ${app}: 추가 완료`);
    updated++;
  } else {
    console.log(`⚠️  ${app}: 적절한 위치를 찾을 수 없음`);
  }
}

console.log(`\n✅ 총 ${updated}개 파일 업데이트 완료!`);

