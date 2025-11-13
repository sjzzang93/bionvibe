const fs = require('fs');
const path = require('path');

const appsWithoutPremiumLayout = [
  'aegyo-test',
  'animal-face-match',
  'aura-color',
  'breakfast-what-to-eat',
  'color-finder-game',
  'crypto-calculator',
  'divorce-prevention',
  'draw-psychology',
  'dream-map',
  'exchange-rate-monitor',
  'face-shape',
  'fengshui-guide',
  'fridge-recipe',
  'gender-language-quiz',
  'hobby-finder',
  'inner-dialog',
  'life-difficulty-meter',
  'life-os-checker',
  'lifestyle-face-fortune',
  'lifestyle-palm-reading',
  'mbti-zodiac-compat',
  'news-briefing',
  'nickname-generator',
  'nonsense-escape',
  'parallel-universe-simulator',
  'password-generator',
  'psychopath-test',
  'real-estate-tracker',
  'saju-mbti-jobs',
  'salary-calculator',
  'sleep-analyzer',
  'smartphone-addiction-test',
  'sociopath-test',
  'stock-news-collector',
  'study-dev-vocab',
  'today-fortune',
  'voice-age',
  'voice-dna-analyzer',
  'voice-fortune'
];

const adSenseImport = "import AdSense from '@/app/components/AdSense';";

const adBlock = `
        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>
`;

appsWithoutPremiumLayout.forEach(appSlug => {
  const filePath = path.join(__dirname, '..', 'app', 'apps', appSlug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${appSlug}: file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 이미 AdSense가 있으면 스킵
  if (content.includes("import AdSense from '@/app/components/AdSense'")) {
    console.log(`⏭️  Skipping ${appSlug}: already has AdSense`);
    return;
  }

  // import 추가 (첫 번째 import 아래에)
  const importRegex = /(import.*from.*;)/;
  const lastImportMatch = content.match(new RegExp(importRegex.source, 'g'));
  if (lastImportMatch) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    content = content.replace(lastImport, lastImport + '\n' + adSenseImport);
  }

  // AppFooter 또는 </div> 전에 광고 추가
  // RelatedApps 다음, AppFooter 전에 광고 추가
  if (content.includes('<AppFooter')) {
    content = content.replace(
      /(<RelatedApps[^>]*\/?>)\s*(<div[^>]*>\s*<AppFooter)/,
      `$1\n${adBlock}\n        $2`
    );
  } else if (content.includes('</div>\n  );\n}')) {
    // AppFooter가 없으면 마지막 return 전에 추가
    content = content.replace(
      /(      <\/div>\s*<\/div>\s*<\/div>\s*)\n(\s*\);\n})/,
      `$1\n${adBlock}\n$2`
    );
  }

  fs.writeFileSync(filePath, content);
  console.log(`✅ Added ads to ${appSlug}`);
});

console.log('\n✨ Done!');
