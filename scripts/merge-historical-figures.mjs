#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const outputFile = path.join(dataDir, 'historical_figures_100.json');

console.log('🔄 위인 데이터 병합 시작...\n');

// Part 파일 읽기
const parts = [];
const partFiles = fs.readdirSync(dataDir)
  .filter(f => f.startsWith('historical_figures_100_part') && f.endsWith('.json'))
  .sort();

console.log(`📁 발견된 파트 파일: ${partFiles.length}개`);
partFiles.forEach(f => console.log(`   - ${f}`));
console.log();

// 각 파트 파일 읽기
for (const file of partFiles) {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (data.historical_figures && Array.isArray(data.historical_figures)) {
    parts.push(...data.historical_figures);
    console.log(`✅ ${file}: ${data.historical_figures.length}명 추가`);
  }
}

console.log(`\n📊 총 ${parts.length}명의 위인 데이터 수집`);

// ID 순으로 정렬
parts.sort((a, b) => a.id - b.id);

// 중복 제거 (같은 ID가 있을 경우)
const uniqueParts = [];
const seenIds = new Set();

for (const figure of parts) {
  if (!seenIds.has(figure.id)) {
    seenIds.add(figure.id);
    uniqueParts.push(figure);
  } else {
    console.log(`⚠️  중복 ID 발견: ${figure.id} (${figure.name_kr}) - 건너뛰기`);
  }
}

console.log(`\n✅ 중복 제거 후: ${uniqueParts.length}명`);

// 누락된 ID 확인
const missingIds = [];
for (let i = 1; i <= 100; i++) {
  if (!seenIds.has(i)) {
    missingIds.push(i);
  }
}

if (missingIds.length > 0) {
  console.log(`\n⚠️  누락된 ID: ${missingIds.join(', ')}`);
  console.log(`   총 ${missingIds.length}개 누락`);
}

// 최종 JSON 생성
const finalData = {
  metadata: {
    version: '1.0',
    total_figures: uniqueParts.length,
    created_date: new Date().toISOString().split('T')[0],
    description: '역사적 위인 데이터베이스 (병합 완료)',
    missing_count: missingIds.length,
    missing_ids: missingIds
  },
  historical_figures: uniqueParts
};

// 파일 저장
fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2), 'utf8');

console.log(`\n✅ 병합 완료!`);
console.log(`📝 출력 파일: ${outputFile}`);
console.log(`📊 최종 위인 수: ${uniqueParts.length}명`);

if (missingIds.length === 0) {
  console.log(`\n🎉 완벽! 모든 100명의 위인 데이터가 수집되었습니다!`);
} else {
  console.log(`\n⚠️  ${missingIds.length}명의 위인 데이터가 누락되었습니다.`);
  console.log(`   GPT-5에게 누락된 ID에 해당하는 위인들을 요청하세요.`);
}

