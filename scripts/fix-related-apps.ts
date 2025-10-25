import fs from 'fs';
import path from 'path';

const files = [
  'app/apps/vitamin-check/page.tsx',
  'app/apps/travel-destinations/page.tsx',
  'app/apps/saju-mbti-jobs/page.tsx',
  'app/apps/reflex-test/page.tsx',
  'app/apps/parents-time/page.tsx',
  'app/apps/mood-cheer-up/page.tsx',
  'app/apps/mbti-test/page.tsx',
  'app/apps/lotto-generator/page.tsx',
  'app/apps/lifestyle-palm-reading/page.tsx',
  'app/apps/lifestyle-face-fortune/page.tsx',
  'app/apps/iq-test/page.tsx',
  'app/apps/health-supplement-recommend/page.tsx',
  'app/apps/focus-timer/page.tsx',
  'app/apps/face-shape/page.tsx',
  'app/apps/envelope-recommend/page.tsx',
  'app/apps/dream-interpreter/page.tsx',
  'app/apps/compass/page.tsx',
  'app/apps/color-psychology/page.tsx',
  'app/apps/car-maintenance/page.tsx',
];

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // 폴더명에서 slug 추출
  const slug = filePath.split('/')[2]; // app/apps/[slug]/page.tsx
  
  // RelatedApps 패턴을 찾아서 교체
  // 여러 줄에 걸쳐있을 수 있으므로 정규식 사용
  const regex = /<RelatedApps\s+relatedAppIds=\{[^\}]+\}\s+currentAppId="[^"]+"\s*\/>/gs;
  
  content = content.replace(regex, `<RelatedApps currentAppSlug="${slug}" className="mt-8" />`);
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Fixed: ${filePath}`);
});

console.log('\n🎉 All files fixed!');

