import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsJsonPath = path.join(__dirname, '../data/apps.json');

// 각 웹앱 주제에 맞는 고품질 Unsplash 이미지
const imageMap: { [key: string]: string } = {
  // 운세/재미
  'today-fortune': 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=400&q=80', // 별자리
  'mbti-test': 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&q=80', // 사람 실루엣
  'dream-interpreter': 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=400&q=80', // 꿈
  'past-life-job': 'https://images.unsplash.com/photo-1461280360983-bd93eaa5051b?w=400&q=80', // 타임라인
  'fortune-today': 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=400&q=80', // 운세
  
  // 건강/라이프
  'water-intake': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', // 물
  'calorie-calculator': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80', // 과일
  'coffee-calculator': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80', // 커피
  'health-calorie-calculator': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', // 건강식
  'health-water-intake': 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80', // 물병
  'meat-calculator': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80', // 고기
  
  // 가족/사랑
  'parents-time': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80', // 가족
  'dday-counter': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80', // D-day
  
  // 학습/성장
  'habit-tracker': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80', // 습관
  'flashcard': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', // 공부
  'focus-timer': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=80', // 타이머
  'study-dev-vocab': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', // 코딩
  
  // 돈/유틸리티
  'crypto-calculator': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80', // 암호화폐
  'income-tax-calculator': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80', // 세금
  'compound-calculator': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80', // 복리
  'credit-card-optimizer': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80', // 신용카드
  'finance-emergency-fund': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&q=80', // 비상금
  'finance-loan-refinance': 'https://images.unsplash.com/photo-1554224311-beee060b0ec2?w=400&q=80', // 대출
  
  // 테스트/게임
  'iq-test': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // IQ
  'eye-test': 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80', // 눈
  'reflex-test': 'https://images.unsplash.com/photo-1461773518188-b3e86f98242f?w=400&q=80', // 반사신경
  'games-puzzle': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80', // 퍼즐
  'games-multiplication': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80', // 수학
  'arcade-mini-games': 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&q=80', // 게임
  
  // 분석/진단
  'mbti-32': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80', // MBTI
  'saju-mbti-jobs': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80', // 사주
  'face-shape': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80', // 얼굴형
  'analysis-handwriting': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80', // 필적
  'color-psychology': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80', // 색깔
  'phone-usage-analyzer': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80', // 스마트폰
  
  // 차량/교통
  'car-maintenance': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', // 자동차
  'air-quality': 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400&q=80', // 공기질
  
  // 엔터/여행
  'quote-generator': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80', // 명언
  'travel-destinations': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80', // 여행
};

function updateImages() {
  console.log('🖼️  이미지 URL 업데이트 시작...\n');
  
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  let updateCount = 0;
  
  data.apps.forEach((app: any) => {
    if (imageMap[app.slug]) {
      const oldImage = app.image;
      app.image = imageMap[app.slug];
      
      if (oldImage !== app.image) {
        console.log(`✅ ${app.name} (${app.slug})`);
        console.log(`   🔄 ${oldImage?.substring(0, 60)}...`);
        console.log(`   ➡️  ${app.image.substring(0, 60)}...\n`);
        updateCount++;
      }
    }
  });
  
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`\n🎉 ${updateCount}개 앱의 이미지를 업데이트했습니다!`);
  console.log(`📝 apps.json 저장 완료!`);
}

updateImages();

import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appsJsonPath = path.join(__dirname, '../data/apps.json');

// 각 웹앱 주제에 맞는 고품질 Unsplash 이미지
const imageMap: { [key: string]: string } = {
  // 운세/재미
  'today-fortune': 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=400&q=80', // 별자리
  'mbti-test': 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&q=80', // 사람 실루엣
  'dream-interpreter': 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=400&q=80', // 꿈
  'past-life-job': 'https://images.unsplash.com/photo-1461280360983-bd93eaa5051b?w=400&q=80', // 타임라인
  'fortune-today': 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=400&q=80', // 운세
  
  // 건강/라이프
  'water-intake': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', // 물
  'calorie-calculator': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80', // 과일
  'coffee-calculator': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80', // 커피
  'health-calorie-calculator': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', // 건강식
  'health-water-intake': 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80', // 물병
  'meat-calculator': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80', // 고기
  
  // 가족/사랑
  'parents-time': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80', // 가족
  'dday-counter': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80', // D-day
  
  // 학습/성장
  'habit-tracker': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80', // 습관
  'flashcard': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', // 공부
  'focus-timer': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=80', // 타이머
  'study-dev-vocab': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', // 코딩
  
  // 돈/유틸리티
  'crypto-calculator': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80', // 암호화폐
  'income-tax-calculator': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80', // 세금
  'compound-calculator': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80', // 복리
  'credit-card-optimizer': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80', // 신용카드
  'finance-emergency-fund': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&q=80', // 비상금
  'finance-loan-refinance': 'https://images.unsplash.com/photo-1554224311-beee060b0ec2?w=400&q=80', // 대출
  
  // 테스트/게임
  'iq-test': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // IQ
  'eye-test': 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80', // 눈
  'reflex-test': 'https://images.unsplash.com/photo-1461773518188-b3e86f98242f?w=400&q=80', // 반사신경
  'games-puzzle': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80', // 퍼즐
  'games-multiplication': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80', // 수학
  'arcade-mini-games': 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&q=80', // 게임
  
  // 분석/진단
  'mbti-32': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80', // MBTI
  'saju-mbti-jobs': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80', // 사주
  'face-shape': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80', // 얼굴형
  'analysis-handwriting': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80', // 필적
  'color-psychology': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80', // 색깔
  'phone-usage-analyzer': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80', // 스마트폰
  
  // 차량/교통
  'car-maintenance': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', // 자동차
  'air-quality': 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400&q=80', // 공기질
  
  // 엔터/여행
  'quote-generator': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80', // 명언
  'travel-destinations': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80', // 여행
};

function updateImages() {
  console.log('🖼️  이미지 URL 업데이트 시작...\n');
  
  const data = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  let updateCount = 0;
  
  data.apps.forEach((app: any) => {
    if (imageMap[app.slug]) {
      const oldImage = app.image;
      app.image = imageMap[app.slug];
      
      if (oldImage !== app.image) {
        console.log(`✅ ${app.name} (${app.slug})`);
        console.log(`   🔄 ${oldImage?.substring(0, 60)}...`);
        console.log(`   ➡️  ${app.image.substring(0, 60)}...\n`);
        updateCount++;
      }
    }
  });
  
  fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`\n🎉 ${updateCount}개 앱의 이미지를 업데이트했습니다!`);
  console.log(`📝 apps.json 저장 완료!`);
}

updateImages();

