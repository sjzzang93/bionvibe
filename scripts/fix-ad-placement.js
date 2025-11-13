const fs = require('fs');
const path = require('path');

const appsToFix = [
  'password-generator',
  'psychopath-test',
  'smartphone-addiction-test',
  'sociopath-test'
];

let fixed = 0;
let failed = 0;

appsToFix.forEach(app => {
  const filePath = path.join(__dirname, '..', 'app', 'apps', app, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${app}: file not found`);
    failed++;
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Find the wrongly placed ad block pattern:
  // </div>
  //     </div>
  //
  //         {/* 광고 */}
  //         <div...>
  //           ...
  //         </div>
  //
  //   );

  const wrongPattern = /(      <\/div>\s*<\/div>\s*)\n\s*\n(\s*{\/\* 광고 \*\/}\s*<div className="max-w-4xl mx-auto px-4 py-8">\s*<div className="bg-white\/10 backdrop-blur-lg rounded-2xl p-4 border border-white\/20">\s*<AdSense className="min-h-\[250px\]" \/>\s*<\/div>\s*<\/div>)\s*\n\s*(\);)/;

  if (content.match(wrongPattern)) {
    // Move the ad block inside the JSX tree
    content = content.replace(
      wrongPattern,
      `\n        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>
$1
$3`
    );

    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${app}`);
    fixed++;
  } else {
    console.log(`⚠️  ${app}: pattern not found, checking manually...`);

    // Try to find the ad block location
    const lines = content.split('\n');
    const adIndex = lines.findIndex(line => line.includes('{/* 광고 */}'));

    if (adIndex > 0) {
      console.log(`   Found ad block at line ${adIndex + 1}`);
      console.log(`   Context:`, lines.slice(adIndex - 2, adIndex + 8).join('\n'));
    }

    failed++;
  }
});

console.log(`\n✨ Done! Fixed: ${fixed}, Failed: ${failed}`);
