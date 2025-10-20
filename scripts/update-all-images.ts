import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsJsonPath = path.join(__dirname, '../data/apps.json');

// 63개 앱 전체에 완전히 고유하고 연관성 높은 이미지 매핑
const imageMap: { [key: string]: string } = {
  // 운세/재미
  'today-fortune': 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=400&q=80', // 별자리
  'fortune-today': 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=400&q=80', // 타로카드
  'dream-interpreter': 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=400&q=80', // 꿈
  'past-life-job': 'https://images.unsplash.com/photo-1461280360983-bd93eaa5051b?w=400&q=80', // 과거 시계
  'lottery-number-generator': 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&q=80', // 복권
  
  // MBTI/성격
  'mbti-test': 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&q=80', // 사람들
  'mbti-32': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80', // 그룹
  'saju-mbti-jobs': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80', // 사주
  
  // 건강/라이프
  'water-intake': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', // 물
  'calorie-calculator': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80', // 과일
  'coffee-calculator': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80', // 커피
  'health-calorie-calculator': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', // 건강식
  'health-water-intake': 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80', // 물병
  'meat-calculator': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80', // 고기
  'vitamin-check': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', // 비타민 알약
  'health-supplement-recommend': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', // 영양제
  'bodyfat-measure': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', // 체지방
  'sleep-analyzer': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80', // 수면
  
  // 가족/사랑
  'parents-time': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80', // 가족
  'dday-counter': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80', // D-day
  'parenting-stress': 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&q=80', // 육아
  
  // 학습/성장
  'habit-tracker': 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80', // 체크리스트
  'flashcard': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', // 공부
  'study-flashcard': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80', // 플래시카드
  'focus-timer': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=80', // 타이머
  'study-dev-vocab': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', // 코딩
  'study-cursor-prompts': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', // AI
  'typing-speed-test': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80', // 타이핑
  
  // 돈/유틸리티
  'crypto-calculator': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80', // 비트코인
  'income-tax-calculator': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80', // 세금
  'compound-calculator': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80', // 복리
  'credit-card-optimizer': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80', // 신용카드
  'finance-emergency-fund': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&q=80', // 비상금
  'finance-loan-refinance': 'https://images.unsplash.com/photo-1554224311-beee060b0ec2?w=400&q=80', // 대출
  'utility-electricity-calculator': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80', // 전기
  'salary-divider': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80', // 월급
  
  // 테스트/게임
  'iq-test': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // IQ
  'eye-test': 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80', // 눈
  'reflex-test': 'https://images.unsplash.com/photo-1461773518188-b3e86f98242f?w=400&q=80', // 반사신경
  'games-puzzle': 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&q=80', // 퍼즐
  'games-multiplication': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80', // 수학
  'arcade-mini-games': 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&q=80', // 아케이드
  
  // 분석/진단
  'face-shape': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80', // 얼굴
  'analysis-handwriting': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80', // 필적
  'color-psychology': 'https://images.unsplash.com/photo-1516715094483-75da06569e1d?w=400&q=80', // 무지개
  'phone-usage-analyzer': 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80', // 스마트폰 사용
  'lifestyle-palm-reading': 'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=400&q=80', // 손금
  'lifestyle-face-fortune': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80', // 관상
  'voice-fortune': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80', // 음성
  'voice-age': 'https://images.unsplash.com/photo-1590602846989-e99596d2a6ee?w=400&q=80', // 마이크
  
  // 차량/교통/공기
  'car-maintenance': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', // 자동차
  'air-quality': 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400&q=80', // 공기
  'weather-outfit': 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=400&q=80', // 날씨 옷
  
  // 음식/식사
  'breakfast-what-to-eat': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', // 아침식사
  
  // 엔터/여행/선물
  'quote-generator': 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400&q=80', // 명언
  'travel-destinations': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80', // 여행
  'travel-packing-list': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', // 여행 짐
  'chart-melon-1st': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', // 음악
  'gift-recommend': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80', // 선물
  'envelope-recommend': 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80', // 봉투
  'mood-cheer-up': 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&q=80', // 기분전환
  'time-capsule': 'https://images.unsplash.com/photo-1501290836695-b8d1966e0f3c?w=400&q=80', // 타임캡슐
  'quit-smoking-challenge': 'https://images.unsplash.com/photo-1528270345952-b555f7b9b484?w=400&q=80', // 금연
};

function updateAllImages() {
  console.log('🖼️  전체 이미지 URL 완전 재매핑 시작...\n');
  
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  let updateCount = 0;
  let missingCount = 0;
  
  data.apps.forEach((app: any) => {
    if (imageMap[app.slug]) {
      const oldImage = app.image;
      app.image = imageMap[app.slug];
      
      if (oldImage !== app.image) {
        console.log(`✅ ${app.name} (${app.slug})`);
        updateCount++;
      }
    } else {
      console.log(`⚠️  매핑 누락: ${app.name} (${app.slug})`);
      missingCount++;
    }
  });
  
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 ${updateCount}개 앱 이미지 업데이트 완료!`);
  if (missingCount > 0) {
    console.log(`⚠️  ${missingCount}개 앱 매핑 누락됨`);
  }
  console.log(`📝 apps.json 저장 완료!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // 중복 체크
  console.log('🔍 중복 이미지 확인 중...');
  const imageUrls = data.apps.map((app: any) => app.image).filter((img: any) => img);
  const duplicates = imageUrls.filter((item: string, index: number) => imageUrls.indexOf(item) !== index);
  
  if (duplicates.length === 0) {
    console.log('✅ 중복 없음! 모든 이미지가 고유합니다!\n');
  } else {
    console.log(`❌ 중복 발견: ${new Set(duplicates).size}개\n`);
    new Set(duplicates).forEach((dup: string) => {
      console.log(`   ${dup.substring(0, 70)}...`);
    });
  }
}

updateAllImages();

import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsJsonPath = path.join(__dirname, '../data/apps.json');

// 63개 앱 전체에 완전히 고유하고 연관성 높은 이미지 매핑
const imageMap: { [key: string]: string } = {
  // 운세/재미
  'today-fortune': 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=400&q=80', // 별자리
  'fortune-today': 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=400&q=80', // 타로카드
  'dream-interpreter': 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=400&q=80', // 꿈
  'past-life-job': 'https://images.unsplash.com/photo-1461280360983-bd93eaa5051b?w=400&q=80', // 과거 시계
  'lottery-number-generator': 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&q=80', // 복권
  
  // MBTI/성격
  'mbti-test': 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&q=80', // 사람들
  'mbti-32': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80', // 그룹
  'saju-mbti-jobs': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80', // 사주
  
  // 건강/라이프
  'water-intake': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', // 물
  'calorie-calculator': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80', // 과일
  'coffee-calculator': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80', // 커피
  'health-calorie-calculator': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', // 건강식
  'health-water-intake': 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80', // 물병
  'meat-calculator': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80', // 고기
  'vitamin-check': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', // 비타민 알약
  'health-supplement-recommend': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', // 영양제
  'bodyfat-measure': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', // 체지방
  'sleep-analyzer': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80', // 수면
  
  // 가족/사랑
  'parents-time': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80', // 가족
  'dday-counter': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80', // D-day
  'parenting-stress': 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&q=80', // 육아
  
  // 학습/성장
  'habit-tracker': 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80', // 체크리스트
  'flashcard': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', // 공부
  'study-flashcard': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80', // 플래시카드
  'focus-timer': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=80', // 타이머
  'study-dev-vocab': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', // 코딩
  'study-cursor-prompts': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', // AI
  'typing-speed-test': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80', // 타이핑
  
  // 돈/유틸리티
  'crypto-calculator': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80', // 비트코인
  'income-tax-calculator': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80', // 세금
  'compound-calculator': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80', // 복리
  'credit-card-optimizer': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80', // 신용카드
  'finance-emergency-fund': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&q=80', // 비상금
  'finance-loan-refinance': 'https://images.unsplash.com/photo-1554224311-beee060b0ec2?w=400&q=80', // 대출
  'utility-electricity-calculator': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80', // 전기
  'salary-divider': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80', // 월급
  
  // 테스트/게임
  'iq-test': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // IQ
  'eye-test': 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80', // 눈
  'reflex-test': 'https://images.unsplash.com/photo-1461773518188-b3e86f98242f?w=400&q=80', // 반사신경
  'games-puzzle': 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&q=80', // 퍼즐
  'games-multiplication': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80', // 수학
  'arcade-mini-games': 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&q=80', // 아케이드
  
  // 분석/진단
  'face-shape': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80', // 얼굴
  'analysis-handwriting': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80', // 필적
  'color-psychology': 'https://images.unsplash.com/photo-1516715094483-75da06569e1d?w=400&q=80', // 무지개
  'phone-usage-analyzer': 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80', // 스마트폰 사용
  'lifestyle-palm-reading': 'https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=400&q=80', // 손금
  'lifestyle-face-fortune': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80', // 관상
  'voice-fortune': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80', // 음성
  'voice-age': 'https://images.unsplash.com/photo-1590602846989-e99596d2a6ee?w=400&q=80', // 마이크
  
  // 차량/교통/공기
  'car-maintenance': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', // 자동차
  'air-quality': 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400&q=80', // 공기
  'weather-outfit': 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=400&q=80', // 날씨 옷
  
  // 음식/식사
  'breakfast-what-to-eat': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', // 아침식사
  
  // 엔터/여행/선물
  'quote-generator': 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400&q=80', // 명언
  'travel-destinations': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80', // 여행
  'travel-packing-list': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', // 여행 짐
  'chart-melon-1st': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', // 음악
  'gift-recommend': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80', // 선물
  'envelope-recommend': 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80', // 봉투
  'mood-cheer-up': 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&q=80', // 기분전환
  'time-capsule': 'https://images.unsplash.com/photo-1501290836695-b8d1966e0f3c?w=400&q=80', // 타임캡슐
  'quit-smoking-challenge': 'https://images.unsplash.com/photo-1528270345952-b555f7b9b484?w=400&q=80', // 금연
};

function updateAllImages() {
  console.log('🖼️  전체 이미지 URL 완전 재매핑 시작...\n');
  
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  let updateCount = 0;
  let missingCount = 0;
  
  data.apps.forEach((app: any) => {
    if (imageMap[app.slug]) {
      const oldImage = app.image;
      app.image = imageMap[app.slug];
      
      if (oldImage !== app.image) {
        console.log(`✅ ${app.name} (${app.slug})`);
        updateCount++;
      }
    } else {
      console.log(`⚠️  매핑 누락: ${app.name} (${app.slug})`);
      missingCount++;
    }
  });
  
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 ${updateCount}개 앱 이미지 업데이트 완료!`);
  if (missingCount > 0) {
    console.log(`⚠️  ${missingCount}개 앱 매핑 누락됨`);
  }
  console.log(`📝 apps.json 저장 완료!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // 중복 체크
  console.log('🔍 중복 이미지 확인 중...');
  const imageUrls = data.apps.map((app: any) => app.image).filter((img: any) => img);
  const duplicates = imageUrls.filter((item: string, index: number) => imageUrls.indexOf(item) !== index);
  
  if (duplicates.length === 0) {
    console.log('✅ 중복 없음! 모든 이미지가 고유합니다!\n');
  } else {
    console.log(`❌ 중복 발견: ${new Set(duplicates).size}개\n`);
    new Set(duplicates).forEach((dup: string) => {
      console.log(`   ${dup.substring(0, 70)}...`);
    });
  }
}

updateAllImages();

