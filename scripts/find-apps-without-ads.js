const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'app', 'apps');
const apps = fs.readdirSync(appsDir);

const withPremiumLayout = [];
const withAdSense = [];
const withoutAds = [];
const errors = [];

apps.forEach(appSlug => {
  const filePath = path.join(appsDir, appSlug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    const hasPremiumLayout = content.includes('PremiumLayout') || content.includes('AdOverlay');
    const hasAdSenseImport = content.includes("import AdSense from '@/app/components/AdSense'");
    const hasAdSenseRender = content.includes('<AdSense');

    if (hasPremiumLayout) {
      withPremiumLayout.push(appSlug);
    } else if (hasAdSenseImport && hasAdSenseRender) {
      withAdSense.push(appSlug);
    } else {
      withoutAds.push(appSlug);
    }
  } catch (err) {
    errors.push({ app: appSlug, error: err.message });
  }
});

console.log('✅ Apps with PremiumLayout (overlay ad):', withPremiumLayout.length);
console.log('✅ Apps with AdSense (bottom ad):', withAdSense.length);
console.log('❌ Apps WITHOUT any ads:', withoutAds.length);
withoutAds.forEach(app => console.log(`  - ${app}`));

if (errors.length > 0) {
  console.log('\n⚠️  Errors:', errors.length);
  errors.forEach(e => console.log(`  - ${e.app}: ${e.error}`));
}

console.log('\n📊 Total apps:', apps.length);
console.log('📊 Coverage:', Math.round((withPremiumLayout.length + withAdSense.length) / apps.length * 100) + '%');
