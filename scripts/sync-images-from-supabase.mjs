import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncImages() {
  try {
    console.log('🔄 Supabase에서 이미지 URL 가져오는 중...');

    // Supabase에서 모든 앱 데이터 가져오기
    const { data: supabaseApps, error } = await supabase
      .from('apps')
      .select('id, slug, image')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase 조회 실패:', error);
      process.exit(1);
    }

    console.log(`✅ Supabase에서 ${supabaseApps.length}개 앱 데이터 가져옴`);

    // apps.json 읽기
    const appsJsonPath = path.join(__dirname, '..', 'data', 'apps.json');
    const appsData = JSON.parse(fs.readFileSync(appsJsonPath, 'utf8'));

    let updatedCount = 0;

    // apps.json의 각 앱에 대해 Supabase 이미지로 업데이트
    appsData.apps = appsData.apps.map(app => {
      const supabaseApp = supabaseApps.find(sa => sa.id === app.id || sa.slug === app.slug);
      
      if (supabaseApp && supabaseApp.image && supabaseApp.image !== app.image) {
        console.log(`📸 ${app.name} 이미지 업데이트:`);
        console.log(`   기존: ${app.image}`);
        console.log(`   새로: ${supabaseApp.image}`);
        updatedCount++;
        return { ...app, image: supabaseApp.image };
      }
      
      return app;
    });

    // data/apps.json 업데이트
    fs.writeFileSync(appsJsonPath, JSON.stringify(appsData, null, 2), 'utf8');
    console.log(`✅ data/apps.json 업데이트 완료 (${updatedCount}개 변경)`);

    // public/data/apps.json도 동기화
    const publicAppsJsonPath = path.join(__dirname, '..', 'public', 'data', 'apps.json');
    fs.writeFileSync(publicAppsJsonPath, JSON.stringify(appsData, null, 2), 'utf8');
    console.log('✅ public/data/apps.json 동기화 완료');

    console.log('\n🎉 이미지 동기화 완료!');
    console.log(`   총 ${updatedCount}개 앱의 이미지가 업데이트되었습니다.`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

syncImages();

