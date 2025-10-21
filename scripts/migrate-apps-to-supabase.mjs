import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local 로드
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 환경변수가 설정되지 않았습니다!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateApps() {
  try {
    console.log('📦 apps.json 읽는 중...');
    
    // apps.json 읽기
    const appsJsonPath = path.join(__dirname, '..', 'data', 'apps.json');
    const jsonData = JSON.parse(fs.readFileSync(appsJsonPath, 'utf8'));
    const apps = jsonData.apps;

    console.log(`✅ ${apps.length}개의 앱을 찾았습니다.`);

    // 기존 데이터 삭제
    console.log('🗑️  기존 데이터 삭제 중...');
    const { error: deleteError } = await supabase
      .from('apps')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      console.warn('⚠️  기존 데이터 삭제 중 오류:', deleteError.message);
    }

    // 데이터 변환 및 삽입
    console.log('📤 Supabase에 데이터 삽입 중...');
    
    let successCount = 0;
    let errorCount = 0;

    for (const app of apps) {
      const dbApp = {
        id: app.id,
        name: app.name,
        slug: app.slug,
        icon: app.icon,
        description: app.description || '',
        category_id: app.categoryId,
        url: app.url,
        image: app.image || '',
        created_at: app.createdAt ? new Date(app.createdAt).toISOString() : new Date().toISOString(),
        related_apps: app.relatedApps || [],
        metadata: {}
      };

      const { error } = await supabase
        .from('apps')
        .insert(dbApp);

      if (error) {
        console.error(`❌ ${app.name} 삽입 실패:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ ${app.name} 삽입 성공`);
        successCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`🎉 마이그레이션 완료!`);
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ 마이그레이션 중 오류 발생:', error);
    process.exit(1);
  }
}

// 실행
migrateApps();

