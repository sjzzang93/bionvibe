const fs = require('fs');
const path = require('path');

const appsWithoutAds = [
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

appsWithoutAds.forEach(appSlug => {
  const filePath = path.join(__dirname, '..', 'app', 'apps', appSlug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${appSlug}: file not found`);
    failed++;
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already has AdOverlay
    if (content.includes('AdOverlay')) {
      console.log(`⏭️  ${appSlug}: already has AdOverlay`);
      return;
    }

    // Add AdOverlay import after the first import statement
    const lines = content.split('\n');
    let importAdded = false;

    for (let i = 0; i < lines.length; i++) {
      // Find the first import statement
      if (lines[i].includes('import') && lines[i].includes('from') && !importAdded) {
        // Find the end of all imports
        let lastImportIndex = i;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim().startsWith('import') || lines[j].trim() === '') {
            if (lines[j].trim().startsWith('import')) {
              lastImportIndex = j;
            }
          } else {
            break;
          }
        }

        // Insert AdOverlay import after the last import
        lines.splice(lastImportIndex + 1, 0, "import AdOverlay from '@/app/components/AdOverlay';");
        importAdded = true;
        break;
      }
    }

    if (!importAdded) {
      console.log(`⚠️  ${appSlug}: could not find import section`);
      failed++;
      return;
    }

    content = lines.join('\n');

    // Add <AdOverlay /> at the beginning of the return statement
    // Find "return (" and add <AdOverlay /> right after it
    const returnPattern = /return \(\s*\n(\s*)<(div|main)/;
    const match = content.match(returnPattern);

    if (match) {
      const indent = match[1];
      content = content.replace(
        returnPattern,
        `return (\n${indent}<AdOverlay />\n${indent}<$2`
      );

      fs.writeFileSync(filePath, content);
      console.log(`✅ ${appSlug}: added AdOverlay`);
      fixed++;
    } else {
      console.log(`⚠️  ${appSlug}: could not find return statement pattern`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ ${appSlug}: ${err.message}`);
    failed++;
  }
});

console.log(`\n✨ Done! Fixed: ${fixed}, Failed: ${failed}`);
