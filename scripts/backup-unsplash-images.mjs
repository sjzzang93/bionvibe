#!/usr/bin/env node
/**
 * Unsplash 이미지를 Supabase Storage에 백업
 */

import { readFileSync, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// .env.local 로드
config({ path: join(projectRoot, '.env.local') });

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// apps.json 읽기
const appsJsonPath = join(projectRoot, 'data', 'apps.json');
const appsData = JSON.parse(readFileSync(appsJsonPath, 'utf-8'));

console.log(`📦 총 ${appsData.apps.length}개 앱 확인 중...\n`);

// Unsplash 링크 필터링
const unsplashApps = appsData.apps.filter(app => 
  app.image && app.image.includes('unsplash.com')
);

console.log(`🔍 Unsplash 링크 사용 중인 앱: ${unsplashApps.length}개\n`);

if (unsplashApps.length === 0) {
  console.log('✅ 모든 이미지가 이미 Supabase에 백업되었습니다!');
  process.exit(0);
}

// 각 앱 출력
unsplashApps.forEach((app, index) => {
  console.log(`${index + 1}. ${app.name} (${app.id})`);
  console.log(`   현재: ${app.image}`);
});

console.log('\n📋 백업할 이미지 목록:');
console.log('-----------------------------------');

async function downloadAndUploadImage(app) {
  const { id, name, image } = app;
  
  try {
    console.log(`\n🔄 [${id}] ${name} 백업 중...`);
    
    // 이미지 다운로드
    const response = await fetch(image);
    if (!response.ok) {
      throw new Error(`다운로드 실패: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = Date.now();
    const fileName = `${id}-${timestamp}.webp`;
    
    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('app-images')
      .upload(fileName, buffer, {
        contentType: 'image/webp',
        upsert: true,
      });
    
    if (error) {
      throw error;
    }
    
    // Public URL 생성
    const { data: publicData } = supabase.storage
      .from('app-images')
      .getPublicUrl(fileName);
    
    const newUrl = publicData.publicUrl;
    
    console.log(`✅ 업로드 완료: ${fileName}`);
    console.log(`   새 URL: ${newUrl}`);
    
    return { id, oldUrl: image, newUrl };
    
  } catch (error) {
    console.error(`❌ [${id}] 백업 실패:`, error.message);
    return null;
  }
}

async function backupAllImages() {
  const results = [];
  
  for (const app of unsplashApps) {
    const result = await downloadAndUploadImage(app);
    if (result) {
      results.push(result);
    }
    // API 요청 제한 방지를 위해 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n📊 백업 완료 요약:');
  console.log('===================================');
  console.log(`성공: ${results.length}/${unsplashApps.length}개`);
  
  if (results.length > 0) {
    // apps.json 업데이트
    const updatedApps = appsData.apps.map(app => {
      const result = results.find(r => r.id === app.id);
      if (result) {
        return { ...app, image: result.newUrl };
      }
      return app;
    });
    
    const updatedData = { ...appsData, apps: updatedApps };
    writeFileSync(appsJsonPath, JSON.stringify(updatedData, null, 2), 'utf-8');
    
    console.log('\n✅ apps.json 업데이트 완료!');
    console.log('\n📝 다음 단계:');
    console.log('1. node scripts/sync-apps-to-supabase.mjs 실행');
    console.log('2. 생성된 SYNC_ALL_APPS.sql을 Supabase SQL Editor에서 실행');
  }
}

// 실행
backupAllImages().catch(console.error);

