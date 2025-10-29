#!/usr/bin/env ts-node
/**
 * sync-apps-json-to-supabase.ts
 *
 * 목적: data/apps.json의 모든 앱을 Supabase에 동기화
 * 사용법: npm run sync-apps
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// .env.local 파일 로드
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

interface AppFromJson {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  categoryId: string;
  url: string;
  image: string;
  createdAt: string;
}

async function syncAppsToSupabase() {
  console.log('\n🔄 apps.json → Supabase 동기화 시작...\n');

  // 1. Supabase 클라이언트 생성
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
    console.error('   .env.local 파일을 확인하세요:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. apps.json 읽기
  const appsJsonPath = path.join(process.cwd(), 'data', 'apps.json');
  
  if (!fs.existsSync(appsJsonPath)) {
    console.error('❌ data/apps.json 파일을 찾을 수 없습니다.');
    process.exit(1);
  }

  const appsData = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
  const apps: AppFromJson[] = appsData.apps;

  console.log(`📁 data/apps.json에서 ${apps.length}개 앱을 읽었습니다.\n`);

  // 3. Supabase에 동기화
  let updatedCount = 0;
  let addedCount = 0;
  let errorCount = 0;

  for (const app of apps) {
    try {
      // apps.json의 필드명을 Supabase 스키마에 맞게 변환
      const supabaseData = {
        id: app.id,
        name: app.name,
        slug: app.slug,
        icon: app.icon,
        description: app.description,
        category_id: app.categoryId, // categoryId → category_id
        url: app.url,
        image: app.image,
        created_at: app.createdAt,
        hidden: false,
      };

      // UPSERT: 있으면 업데이트, 없으면 추가
      const { data, error } = await supabase
        .from('apps')
        .upsert([supabaseData], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error(`❌ 실패: ${app.name} (${app.slug})`);
        console.error(`   에러: ${error.message}`);
        errorCount++;
      } else {
        // 새로 추가되었는지 업데이트되었는지 확인
        const wasExisting = await checkIfExists(supabase, app.id);
        if (wasExisting) {
          console.log(`🔄 업데이트: ${app.name} (${app.slug})`);
          updatedCount++;
        } else {
          console.log(`✅ 추가: ${app.name} (${app.slug})`);
          addedCount++;
        }
      }
    } catch (err) {
      console.error(`❌ 에러: ${app.name} - ${err}`);
      errorCount++;
    }
  }

  // 4. 결과 요약
  console.log('\n' + '='.repeat(50));
  console.log('✅ 동기화 완료!');
  console.log('='.repeat(50));
  console.log(`📊 전체 앱: ${apps.length}개`);
  console.log(`➕ 새로 추가: ${addedCount}개`);
  console.log(`🔄 업데이트: ${updatedCount}개`);
  if (errorCount > 0) {
    console.log(`❌ 실패: ${errorCount}개`);
  }
  console.log('='.repeat(50) + '\n');
}

// 앱이 이미 존재하는지 확인하는 헬퍼 함수
async function checkIfExists(supabase: any, id: string): Promise<boolean> {
  const { data } = await supabase
    .from('apps')
    .select('id')
    .eq('id', id)
    .single();
  
  return !!data;
}

// 실행
if (require.main === module) {
  syncAppsToSupabase().catch((err) => {
    console.error('\n❌ 치명적 에러:', err);
    process.exit(1);
  });
}

export { syncAppsToSupabase };

