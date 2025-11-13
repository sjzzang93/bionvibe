const fs = require('fs');
const path = require('path');

const appsToFix = [
  'animal-face-match',
  'aura-color',
  'breakfast-what-to-eat',
  'color-finder-game',
  'crypto-calculator',
  'divorce-prevention',
  'draw-psychology',
  'dream-map',
  'exchange-rate-monitor',
  'fridge-recipe',
  'gender-language-quiz',
  'hobby-finder',
  'inner-dialog',
  'life-difficulty-meter',
  'life-os-checker',
  'news-briefing',
  'nickname-generator',
  'nonsense-escape',
  'parallel-universe-simulator',
  'real-estate-tracker',
  'salary-calculator',
  'stock-news-collector',
  'study-dev-vocab',
  'voice-dna-analyzer'
];

let fixed = 0;
let failed = 0;

appsToFix.forEach(appSlug => {
  const filePath = path.join(__dirname, '..', 'app', 'apps', appSlug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${appSlug}: file not found`);
    failed++;
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the pattern:
    // return (
    //   <AdOverlay />
    //   <main ...>
    //
    // Should be:
    // return (
    //   <main ...>
    //     <AdOverlay />

    const wrongPattern = /return \(\s*\n(\s*)<AdOverlay \/>\s*\n(\s*)<(main|div)/;
    const match = content.match(wrongPattern);

    if (match) {
      const mainIndent = match[2];
      const contentIndent = mainIndent + '  ';

      content = content.replace(
        wrongPattern,
        `return (\n${mainIndent}<$3`
      );

      // Now add AdOverlay right after the opening tag of main/div
      // Find the first closing > after the tag name
      const afterReturn = content.split('return (')[1];
      const firstTagMatch = afterReturn.match(/^(\s*<(?:main|div)[^>]*>)\s*\n/);

      if (firstTagMatch) {
        content = content.replace(
          firstTagMatch[0],
          `${firstTagMatch[1]}\n${contentIndent}<AdOverlay />\n`
        );

        fs.writeFileSync(filePath, content);
        console.log(`✅ ${appSlug}: fixed AdOverlay placement`);
        fixed++;
      } else {
        console.log(`⚠️  ${appSlug}: could not find tag end`);
        failed++;
      }
    } else {
      console.log(`⚠️  ${appSlug}: pattern not found`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ ${appSlug}: ${err.message}`);
    failed++;
  }
});

console.log(`\n✨ Done! Fixed: ${fixed}, Failed: ${failed}`);
