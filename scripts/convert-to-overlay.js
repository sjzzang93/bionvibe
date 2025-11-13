const fs = require('fs');
const path = require('path');

const appsToConvert = [
  'face-shape',
  'fengshui-guide',
  'lifestyle-face-fortune',
  'lifestyle-palm-reading',
  'mbti-zodiac-compat',
  'password-generator',
  'psychopath-test',
  'saju-mbti-jobs',
  'sleep-analyzer',
  'smartphone-addiction-test',
  'sociopath-test',
  'today-fortune',
  'voice-age',
  'voice-fortune',
];

let converted = 0;
let failed = 0;

appsToConvert.forEach(appSlug => {
  const filePath = path.join(__dirname, '..', 'app', 'apps', appSlug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${appSlug}: file not found`);
    failed++;
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add AdOverlay import if not present
    if (!content.includes('AdOverlay')) {
      // Find AdSense import line
      const adSenseImportRegex = /import AdSense from '@\/app\/components\/AdSense';/;
      if (content.match(adSenseImportRegex)) {
        content = content.replace(
          adSenseImportRegex,
          "import AdSense from '@/app/components/AdSense';\nimport AdOverlay from '@/app/components/AdOverlay';"
        );
      } else {
        console.log(`⚠️  ${appSlug}: Could not find AdSense import`);
        failed++;
        return;
      }
    }

    // 2. Find the return statement and add AdOverlay
    const lines = content.split('\n');
    let returnLineIndex = -1;
    let mainDivIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('return (') || lines[i].trim() === 'return (') {
        returnLineIndex = i;
        // Find the first <div or <main after return
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].match(/^\s*<(div|main)/)) {
            mainDivIndex = j;
            break;
          }
        }
        break;
      }
    }

    if (returnLineIndex === -1 || mainDivIndex === -1) {
      console.log(`⚠️  ${appSlug}: Could not find return statement or main div`);
      failed++;
      return;
    }

    // Get the indentation of the main div
    const mainIndent = lines[mainDivIndex].match(/^(\s*)/)[1];
    const contentIndent = mainIndent + '  ';

    // Check if AdOverlay is already there
    if (!lines[mainDivIndex + 1]?.includes('<AdOverlay')) {
      // Insert AdOverlay right after the opening tag
      // Find where the opening tag ends
      let tagEndIndex = mainDivIndex;
      for (let i = mainDivIndex; i < lines.length; i++) {
        if (lines[i].includes('>')) {
          tagEndIndex = i;
          break;
        }
      }

      // Insert AdOverlay after the opening tag
      lines.splice(tagEndIndex + 1, 0, `${contentIndent}<AdOverlay />`);
    }

    content = lines.join('\n');
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${appSlug}: converted to overlay`);
    converted++;

  } catch (err) {
    console.log(`❌ ${appSlug}: ${err.message}`);
    failed++;
  }
});

console.log(`\n✨ Done! Converted: ${converted}, Failed: ${failed}`);
