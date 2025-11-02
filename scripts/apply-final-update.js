const fs = require('fs');

// 매핑과 수리비 로드
const mapping = require('./accurate-mapping.json');
const avgCosts = require('./avg-by-number.json');

// 비용 맵 생성
const costMap = {};
avgCosts.forEach(item => {
  costMap[item.num] = item.avg;
});

// JSON 로드
const data = JSON.parse(fs.readFileSync('./lib/car-warning-lights-data.json', 'utf8'));

// 업데이트 적용
let updatedCount = 0;
const updated = new Set();

console.log('🔄 최종 업데이트 시작...\n');

Object.entries(mapping).forEach(([imageNum, info]) => {
  const light = data.warningLights.find(l => l.id === info.id);
  const avgCost = costMap[imageNum] || 100000;
  
  if (light) {
    // 이미 업데이트된 경고등은 건너뛰기 (첫 번째 매칭만 적용)
    if (!updated.has(light.id)) {
      light.icon = info.icon;
      light.repairInfo.estimatedCost.average = avgCost;
      light.repairInfo.estimatedCost.min = Math.max(0, Math.floor(avgCost * 0.4));
      light.repairInfo.estimatedCost.max = Math.ceil(avgCost * 2.5);
      
      updated.add(light.id);
      console.log(`✓ #${imageNum} → ${light.id}: ${info.icon} (${avgCost.toLocaleString()}원)`);
      updatedCount++;
    }
  } else {
    console.log(`✗ #${imageNum} → ${info.id}: ID 없음`);
  }
});

// 백업 & 저장
fs.writeFileSync('./lib/car-warning-lights-data.json.backup', JSON.stringify(data, null, 2));
fs.writeFileSync('./lib/car-warning-lights-data.json', JSON.stringify(data, null, 2));

console.log(`\n✅ 최종 업데이트 완료: ${updatedCount}개 / 64개`);
console.log(`📁 백업: lib/car-warning-lights-data.json.backup`);
console.log(`\n🔍 업데이트된 경고등 ID 목록:`);
console.log([...updated].sort().join(', '));



































