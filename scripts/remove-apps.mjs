import fs from 'fs';

const appsToRemove = [
  'salary-divider',
  'income-tax-calculator',
  'compound-calculator',
  'finance-loan-refinance',
  'credit-card-optimizer',
  'finance-emergency-fund',
  'phone-usage-analyzer'
];

// data/apps.json
const dataPath = './data/apps.json';
const publicPath = './public/data/apps.json';

function removeApps(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // apps 배열에서 제거
  data.apps = data.apps.filter(app => !appsToRemove.includes(app.id));
  
  // relatedApps에서도 제거
  data.apps.forEach(app => {
    if (app.relatedApps) {
      app.relatedApps = app.relatedApps.filter(id => !appsToRemove.includes(id));
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ ${filePath} 업데이트 완료`);
}

removeApps(dataPath);
removeApps(publicPath);

console.log(`\n🗑️  삭제된 앱: ${appsToRemove.length}개`);
appsToRemove.forEach(id => console.log(`  - ${id}`));

