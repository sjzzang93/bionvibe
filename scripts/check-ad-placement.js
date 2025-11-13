const fs = require('fs');
const path = require('path');

const apps = [
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

const needsFixing = [];
const alreadyFixed = [];
const notFound = [];

apps.forEach(app => {
  const filePath = path.join(__dirname, '..', 'app', 'apps', app, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    notFound.push(app);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Find if ad block exists
  const adBlockStartIndex = lines.findIndex(line => line.includes('{/* 광고 */}'));

  if (adBlockStartIndex === -1) {
    // No ad block at all
    return;
  }

  // Check if the ad block is before the closing );
  // Look for the pattern: ad block followed by closing paren
  const nextFewLines = lines.slice(adBlockStartIndex, adBlockStartIndex + 10).join('\n');

  // If we find ");}" after the ad block with only whitespace/divs between, it's wrongly placed
  if (nextFewLines.match(/{\s*\/\*\s*광고\s*\*\/\s*}\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*\s*\);\s*}/)) {
    needsFixing.push(app);
  } else {
    alreadyFixed.push(app);
  }
});

console.log('❌ Needs fixing:', needsFixing.length);
needsFixing.forEach(app => console.log(`  - ${app}`));

console.log('\n✅ Already fixed:', alreadyFixed.length);
alreadyFixed.forEach(app => console.log(`  - ${app}`));

if (notFound.length > 0) {
  console.log('\n⚠️  Not found:', notFound.length);
  notFound.forEach(app => console.log(`  - ${app}`));
}
