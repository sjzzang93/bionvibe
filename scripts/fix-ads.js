const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'app', 'apps');
const apps = fs.readdirSync(appsDir);

const adBlock = `
        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>
`;

let fixed = 0;
let skipped = 0;

apps.forEach(appSlug => {
  const filePath = path.join(appsDir, appSlug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 이미 <AdSense가 있으면 스킵
  if (content.includes('<AdSense')) {
    skipped++;
    return;
  }

  // AppFooter 바로 앞에 광고 추가
  if (content.includes('<AppFooter')) {
    content = content.replace(
      /(\s*)<AppFooter/,
      `${adBlock}\n$1<AppFooter`
    );
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${appSlug}`);
    fixed++;
  } else {
    console.log(`⚠️  No AppFooter found in ${appSlug}`);
  }
});

console.log(`\n✨ Done! Fixed: ${fixed}, Skipped: ${skipped}`);
