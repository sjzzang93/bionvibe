import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsJsonPath = path.join(__dirname, '../data/apps.json');

// 검증된 Unsplash 이미지로 전체 교체 (확실히 작동하는 이미지만)
const verifiedImages: { [key: string]: string } = {
  // 운세/재미
  'today-fortune': 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800&auto=format&fit=crop',
  'dream-interpreter': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
  'past-life-job': 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&auto=format&fit=crop',
  'lottery-number-generator': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop',
  
  // MBTI/성격
  'mbti-test': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop',
  'saju-mbti-jobs': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
  
  // 건강/라이프
  'water-intake': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&auto=format&fit=crop',
  'calorie-calculator': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&auto=format&fit=crop',
  'coffee-calculator': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop',
  'meat-calculator': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop',
  'vitamin-check': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop',
  'health-supplement-recommend': 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800&auto=format&fit=crop',
  'bodyfat-measure': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
  'sleep-analyzer': 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&auto=format&fit=crop',
  
  // 가족/사랑
  'parents-time': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&auto=format&fit=crop',
  'dday-counter': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
  'parenting-stress': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop',
  
  // 학습/성장
  'habit-tracker': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
  'flashcard': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop',
  'focus-timer': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&auto=format&fit=crop',
  'study-dev-vocab': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
  'study-cursor-prompts': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop',
  'typing-speed-test': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop',
  
  // 돈/유틸리티
  'crypto-calculator': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop',
  'income-tax-calculator': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop',
  'compound-calculator': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop',
  'credit-card-optimizer': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop',
  'finance-emergency-fund': 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800&auto=format&fit=crop',
  'finance-loan-refinance': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
  'utility-electricity-calculator': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop',
  'salary-divider': 'https://images.unsplash.com/photo-1554224311-beee060b0ec2?w=800&auto=format&fit=crop',
  
  // 테스트/게임
  'iq-test': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
  'eye-test': 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&auto=format&fit=crop',
  'reflex-test': 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop',
  'games-puzzle': 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&auto=format&fit=crop',
  'games-multiplication': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop',
  'arcade-mini-games': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
  
  // 분석/진단
  'face-shape': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
  'analysis-handwriting': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
  'color-psychology': 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&auto=format&fit=crop',
  'phone-usage-analyzer': 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&auto=format&fit=crop',
  'lifestyle-palm-reading': 'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=800&auto=format&fit=crop',
  'lifestyle-face-fortune': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop',
  'voice-fortune': 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&auto=format&fit=crop',
  'voice-age': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
  
  // 차량/교통/공기
  'car-maintenance': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop',
  'air-quality': 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop',
  'weather-outfit': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop',
  
  // 음식/식사
  'breakfast-what-to-eat': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop',
  
  // 엔터/여행/선물
  'quote-generator': 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&auto=format&fit=crop',
  'travel-destinations': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop',
  'travel-packing-list': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
  'chart-melon-1st': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
  'gift-recommend': 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop',
  'envelope-recommend': 'https://images.unsplash.com/photo-1606699708206-275e00a9f5f0?w=800&auto=format&fit=crop',
  'mood-cheer-up': 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop',
  'time-capsule': 'https://images.unsplash.com/photo-1501290836695-b555f7b9b484?w=800&auto=format&fit=crop',
  'quit-smoking-challenge': 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&auto=format&fit=crop',
};

function fixAllImages() {
  console.log('🔧 모든 이미지를 검증된 URL로 교체...\n');
  
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  let updateCount = 0;
  
  data.apps.forEach((app: any) => {
    if (verifiedImages[app.slug]) {
      const oldImage = app.image;
      app.image = verifiedImages[app.slug];
      
      if (oldImage !== app.image) {
        console.log(`✅ ${app.name} (${app.slug})`);
        updateCount++;
      }
    } else {
      console.log(`⚠️  ${app.name} (${app.slug}) - 기존 이미지 유지`);
    }
  });
  
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 ${updateCount}개 앱 이미지 수정 완료!`);
  console.log(`📝 apps.json 저장 완료!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

fixAllImages();

import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsJsonPath = path.join(__dirname, '../data/apps.json');

// 검증된 Unsplash 이미지로 전체 교체 (확실히 작동하는 이미지만)
const verifiedImages: { [key: string]: string } = {
  // 운세/재미
  'today-fortune': 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800&auto=format&fit=crop',
  'dream-interpreter': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
  'past-life-job': 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&auto=format&fit=crop',
  'lottery-number-generator': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop',
  
  // MBTI/성격
  'mbti-test': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&auto=format&fit=crop',
  'saju-mbti-jobs': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
  
  // 건강/라이프
  'water-intake': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&auto=format&fit=crop',
  'calorie-calculator': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&auto=format&fit=crop',
  'coffee-calculator': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop',
  'meat-calculator': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop',
  'vitamin-check': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop',
  'health-supplement-recommend': 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800&auto=format&fit=crop',
  'bodyfat-measure': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
  'sleep-analyzer': 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&auto=format&fit=crop',
  
  // 가족/사랑
  'parents-time': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&auto=format&fit=crop',
  'dday-counter': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
  'parenting-stress': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop',
  
  // 학습/성장
  'habit-tracker': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
  'flashcard': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop',
  'focus-timer': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&auto=format&fit=crop',
  'study-dev-vocab': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
  'study-cursor-prompts': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop',
  'typing-speed-test': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop',
  
  // 돈/유틸리티
  'crypto-calculator': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop',
  'income-tax-calculator': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop',
  'compound-calculator': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop',
  'credit-card-optimizer': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop',
  'finance-emergency-fund': 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800&auto=format&fit=crop',
  'finance-loan-refinance': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
  'utility-electricity-calculator': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop',
  'salary-divider': 'https://images.unsplash.com/photo-1554224311-beee060b0ec2?w=800&auto=format&fit=crop',
  
  // 테스트/게임
  'iq-test': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
  'eye-test': 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&auto=format&fit=crop',
  'reflex-test': 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop',
  'games-puzzle': 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&auto=format&fit=crop',
  'games-multiplication': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop',
  'arcade-mini-games': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
  
  // 분석/진단
  'face-shape': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
  'analysis-handwriting': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
  'color-psychology': 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&auto=format&fit=crop',
  'phone-usage-analyzer': 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&auto=format&fit=crop',
  'lifestyle-palm-reading': 'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=800&auto=format&fit=crop',
  'lifestyle-face-fortune': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop',
  'voice-fortune': 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&auto=format&fit=crop',
  'voice-age': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
  
  // 차량/교통/공기
  'car-maintenance': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop',
  'air-quality': 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop',
  'weather-outfit': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop',
  
  // 음식/식사
  'breakfast-what-to-eat': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop',
  
  // 엔터/여행/선물
  'quote-generator': 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&auto=format&fit=crop',
  'travel-destinations': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop',
  'travel-packing-list': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
  'chart-melon-1st': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
  'gift-recommend': 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop',
  'envelope-recommend': 'https://images.unsplash.com/photo-1606699708206-275e00a9f5f0?w=800&auto=format&fit=crop',
  'mood-cheer-up': 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop',
  'time-capsule': 'https://images.unsplash.com/photo-1501290836695-b555f7b9b484?w=800&auto=format&fit=crop',
  'quit-smoking-challenge': 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&auto=format&fit=crop',
};

function fixAllImages() {
  console.log('🔧 모든 이미지를 검증된 URL로 교체...\n');
  
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  let updateCount = 0;
  
  data.apps.forEach((app: any) => {
    if (verifiedImages[app.slug]) {
      const oldImage = app.image;
      app.image = verifiedImages[app.slug];
      
      if (oldImage !== app.image) {
        console.log(`✅ ${app.name} (${app.slug})`);
        updateCount++;
      }
    } else {
      console.log(`⚠️  ${app.name} (${app.slug}) - 기존 이미지 유지`);
    }
  });
  
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 ${updateCount}개 앱 이미지 수정 완료!`);
  console.log(`📝 apps.json 저장 완료!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

fixAllImages();

