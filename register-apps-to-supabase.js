const https = require('https');
const fs = require('fs');

// .env.local에서 환경변수 읽기
const envContent = fs.readFileSync('.env.local', 'utf8');
const SUPABASE_URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const ANON_KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('❌ Supabase 환경변수를 찾을 수 없습니다.');
  process.exit(1);
}

const apps = [
  {
    id: 'psychopath-test',
    name: '싸이코패스 성향 테스트',
    slug: 'psychopath-test',
    icon: '🧠',
    description: 'PCL-R 기반 심리 평가로 반사회적 성향을 측정합니다. 30개 질문으로 4가지 요인을 분석하여 자기 인식과 성찰의 기회를 제공합니다.',
    category_id: 'fortune-mind',
    url: '/apps/psychopath-test',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    created_at: '2025-11-02',
    hidden: false
  },
  {
    id: 'sociopath-test',
    name: '소시오패스 성향 테스트',
    slug: 'sociopath-test',
    icon: '👥',
    description: 'ASPD(반사회성 성격장애) 기반 평가로 충동성, 공격성, 무책임성 등을 측정합니다. 30개 질문으로 9가지 요인을 분석하고 개선 방향을 제시합니다.',
    category_id: 'fortune-mind',
    url: '/apps/sociopath-test',
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&auto=format&fit=crop',
    created_at: '2025-11-02',
    hidden: false
  },
  {
    id: 'emotion-diary',
    name: '감정 일기',
    slug: 'emotion-diary',
    icon: '🌈',
    description: '오늘의 감정을 색깔과 날씨로 표현해보세요',
    category_id: 'fortune-mind',
    url: '/apps/emotion-diary',
    image: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&auto=format&fit=crop',
    created_at: '2025-10-23',
    hidden: false
  },
  {
    id: 'animal-face-match',
    name: '닮은 동물 찾기',
    slug: 'animal-face-match',
    icon: '🐶',
    description: 'AI가 당신의 얼굴에서 동물상을 찾아드려요!',
    category_id: 'fortune-mind',
    url: '/apps/animal-face-match',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop',
    created_at: '2025-10-23',
    hidden: false
  },
  {
    id: 'fridge-recipe',
    name: '냉장고 파먹기',
    slug: 'fridge-recipe',
    icon: '🧊',
    description: '냉장고에 있는 재료로 뭐 해먹을까?',
    category_id: 'family-life',
    url: '/apps/fridge-recipe',
    image: 'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=800&auto=format&fit=crop',
    created_at: '2025-10-23',
    hidden: false
  },
  {
    id: 'nickname-generator',
    name: '이름/닉네임 생성기',
    slug: 'nickname-generator',
    icon: '✨',
    description: '완벽한 이름을 찾아드려요!',
    category_id: 'learning-tools',
    url: '/apps/nickname-generator',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop',
    created_at: '2025-10-23',
    hidden: false
  },
  {
    id: 'color-finder-game',
    name: '색깔 찾기 게임',
    slug: 'color-finder-game',
    icon: '🎨',
    description: '다른 색깔을 찾아보세요!',
    category_id: 'learning-tools',
    url: '/apps/color-finder-game',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop',
    created_at: '2025-10-23',
    hidden: false
  }
];

function makeRequest(app) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + '/rest/v1/apps');
    
    const postData = JSON.stringify(app);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + ANON_KEY,
        'Prefer': 'resolution=merge-duplicates'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, app: app.name, status: res.statusCode });
        } else {
          resolve({ success: false, app: app.name, status: res.statusCode, error: data });
        }
      });
    });

    req.on('error', (err) => {
      reject({ success: false, app: app.name, error: err.message });
    });

    req.write(postData);
    req.end();
  });
}

async function registerApps() {
  console.log('🚀 Supabase에 앱 등록 시작...\n');
  console.log('📍 URL: ' + SUPABASE_URL);
  console.log('📦 등록할 앱: ' + apps.length + '개\n');

  let successCount = 0;
  let failCount = 0;

  for (const app of apps) {
    try {
      const result = await makeRequest(app);
      if (result.success) {
        console.log('✅ ' + app.name + ' - 등록 성공');
        successCount++;
      } else {
        console.log('❌ ' + app.name + ' - 실패 (' + result.status + ')');
        console.log('   오류: ' + result.error);
        failCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.log('❌ ' + app.name + ' - 오류: ' + err.message);
      failCount++;
    }
  }

  console.log('\n📊 결과: 성공 ' + successCount + '개, 실패 ' + failCount + '개');
  
  if (failCount > 0) {
    console.log('\n⚠️  실패한 앱이 있습니다. ALL_APPS_REGISTER.sql 파일을 Supabase SQL Editor에서 직접 실행해주세요.');
  } else {
    console.log('\n🎉 모든 앱이 성공적으로 등록되었습니다!');
  }
}

registerApps().catch(console.error);
