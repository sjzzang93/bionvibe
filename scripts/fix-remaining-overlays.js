const fs = require('fs');
const path = require('path');

const appsToFix = [
  'color-finder-game',
  'crypto-calculator',
  'dream-map',
  'exchange-rate-monitor',
  'life-difficulty-meter',
  'parallel-universe-simulator',
  'real-estate-tracker',
  'stock-news-collector',
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

    // Pattern 1: Simple case - AdOverlay followed by main/div on next line
    // return (
    //   <AdOverlay />
    //   <main ...>
    if (content.includes('<AdOverlay />') && !content.match(/<(?:main|div)[^>]*>\s*\n\s*<AdOverlay \/>/)) {
      // Find the return ( pattern
      const lines = content.split('\n');
      let adOverlayLine = -1;
      let mainLine = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('<AdOverlay />')) {
          adOverlayLine = i;
        }
        if (adOverlayLine !== -1 && i > adOverlayLine && lines[i].match(/^\s*<(main|div)/)) {
          mainLine = i;
          break;
        }
      }

      if (adOverlayLine !== -1 && mainLine !== -1) {
        // Remove AdOverlay line
        const adOverlayContent = lines[adOverlayLine].trim();
        lines.splice(adOverlayLine, 1);

        // mainLine is now shifted up by 1
        mainLine = mainLine - 1;

        // Get indentation of the main tag
        const mainIndent = lines[mainLine].match(/^(\s*)/)[1];
        const contentIndent = mainIndent + '  ';

        // Insert AdOverlay after the main tag opening
        // Find the closing > of the main tag
        let insertLine = mainLine;
        for (let i = mainLine; i < lines.length; i++) {
          if (lines[i].includes('>')) {
            insertLine = i;
            break;
          }
        }

        // Insert AdOverlay on the next line
        lines.splice(insertLine + 1, 0, `${contentIndent}<AdOverlay />`);

        content = lines.join('\n');
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${appSlug}: fixed AdOverlay placement`);
        fixed++;
      } else {
        console.log(`⚠️  ${appSlug}: could not find AdOverlay or main/div`);
        failed++;
      }
    } else {
      console.log(`⚠️  ${appSlug}: already fixed or pattern not found`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ ${appSlug}: ${err.message}`);
    failed++;
  }
});

console.log(`\n✨ Done! Fixed: ${fixed}, Failed: ${failed}`);
