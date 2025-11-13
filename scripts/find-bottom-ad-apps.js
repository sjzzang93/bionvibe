const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'app', 'apps');
const apps = fs.readdirSync(appsDir);

const bottomAdApps = [];

apps.forEach(appSlug => {
  const filePath = path.join(appsDir, appSlug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    const hasPremiumLayout = content.includes('PremiumLayout');
    const hasAdOverlay = content.includes('AdOverlay');
    const hasAdSenseImport = content.includes("import AdSense from '@/app/components/AdSense'");
    const hasAdSenseRender = content.includes('<AdSense');

    // PremiumLayout도 없고 AdOverlay도 없지만 AdSense는 있는 앱
    if (!hasPremiumLayout && !hasAdOverlay && hasAdSenseImport && hasAdSenseRender) {
      bottomAdApps.push(appSlug);
    }
  } catch (err) {
    // ignore
  }
});

console.log('📋 Apps with only bottom ads (need overlay):', bottomAdApps.length);
bottomAdApps.forEach(app => console.log(`  - ${app}`));

// Export for use in other scripts
console.log('\n// Array to use in script:');
console.log('[');
bottomAdApps.forEach(app => console.log(`  '${app}',`));
console.log(']');
