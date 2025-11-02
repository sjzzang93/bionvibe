#!/usr/bin/env node

/**
 * 앱 자동 동기화 스크립트
 *
 * 1. app/apps/ 폴더를 스캔해서 모든 앱 감지
 * 2. Unsplash 이미지를 Supabase Storage에 자동 업로드
 * 3. data/apps.json 자동 업데이트
 * 4. Supabase에 자동 등록
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 설정
const APPS_DIR = path.join(__dirname, 'app/apps');
const APPS_JSON_PATH = path.join(__dirname, 'data/apps.json');
const ENV_PATH = path.join(__dirname, '.env.local');

// 환경변수 로드
function loadEnv() {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  const SUPABASE_URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
  const ANON_KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
  const SERVICE_ROLE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();
  return { SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY };
}

// Unsplash 이미지 다운로드
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Supabase Storage에 이미지 업로드
async function uploadImageToSupabase(imageBuffer, fileName, SUPABASE_URL, SERVICE_ROLE_KEY) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/storage/v1/object/app-images/${fileName}`);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'image/webp',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Length': imageBuffer.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/app-images/${fileName}`;
          resolve({ success: true, url: publicUrl });
        } else {
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', (err) => {
      reject({ success: false, error: err.message });
    });

    req.write(imageBuffer);
    req.end();
  });
}

// 이미지 처리 (Unsplash → Supabase)
async function processImage(imageUrl, appSlug, SUPABASE_URL, SERVICE_ROLE_KEY) {
  try {
    // Unsplash 이미지인 경우에만 처리
    if (!imageUrl.includes('unsplash.com')) {
      return imageUrl; // 이미 Supabase에 있는 경우
    }

    console.log(`  📥 이미지 다운로드 중: ${appSlug}`);
    const imageBuffer = await downloadImage(imageUrl);

    const timestamp = Date.now();
    const fileName = `${appSlug}-${timestamp}.webp`;

    console.log(`  📤 Supabase 업로드 중: ${fileName}`);
    const result = await uploadImageToSupabase(imageBuffer, fileName, SUPABASE_URL, SERVICE_ROLE_KEY);

    if (result.success) {
      console.log(`  ✓ 이미지 업로드 완료: ${result.url}`);
      return result.url;
    } else {
      console.log(`  ✗ 이미지 업로드 실패, 원본 URL 유지`);
      return imageUrl;
    }
  } catch (error) {
    console.log(`  ✗ 이미지 처리 오류: ${error.message}`);
    return imageUrl; // 실패 시 원본 URL 유지
  }
}

// 앱 폴더에서 메타데이터 추출
function extractAppMetadata(appSlug, pagePath) {
  try {
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // 제목 추출 (h1 태그에서)
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/) || 
                       content.match(/title.*?[>"']([^<>"']+)[<"']/) ||
                       content.match(/name.*?[>"']([^<>"']+)[<"']/);
    
    // 설명 추출 (p 태그에서)
    const descMatch = content.match(/<p[^>]*>([^<]{20,200})<\/p>/) ||
                      content.match(/description.*?[>"']([^<>"']{20,200})[<"']/);
    
    // 이모지 추출
    const emojiMatch = content.match(/[🌀-🫸]/u);
    
    return {
      id: appSlug,
      name: titleMatch?.[1]?.trim() || appSlug,
      slug: appSlug,
      icon: emojiMatch?.[0] || '📱',
      description: descMatch?.[1]?.trim() || '새로운 앱입니다',
      categoryId: 'learning-tools', // 기본값
      url: '/apps/' + appSlug,
      image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop',
      createdAt: new Date().toISOString().split('T')[0],
      hidden: false
    };
  } catch (err) {
    console.warn('메타데이터 추출 실패:', appSlug, err.message);
    return null;
  }
}

// 앱 폴더 스캔
function scanAppsFolder() {
  const apps = [];
  const folders = fs.readdirSync(APPS_DIR);
  
  console.log('📂 앱 폴더 스캔 중...\n');
  
  for (const folder of folders) {
    const pagePath = path.join(APPS_DIR, folder, 'page.tsx');
    
    if (fs.existsSync(pagePath)) {
      const metadata = extractAppMetadata(folder, pagePath);
      if (metadata) {
        apps.push(metadata);
        console.log('  ✓ ' + metadata.name + ' (' + folder + ')');
      }
    }
  }
  
  console.log('\n총 ' + apps.length + '개 앱 발견\n');
  return apps;
}

// apps.json 업데이트 (이미지 업로드 포함)
async function updateAppsJson(newApps) {
  const { SUPABASE_URL, SERVICE_ROLE_KEY } = loadEnv();

  let existingData = { apps: [] };

  // 기존 데이터 로드
  if (fs.existsSync(APPS_JSON_PATH)) {
    existingData = JSON.parse(fs.readFileSync(APPS_JSON_PATH, 'utf8'));
  }

  const existingAppsMap = new Map(existingData.apps.map(app => [app.id, app]));

  // 새 앱 추가 또는 업데이트
  let addedCount = 0;
  let updatedCount = 0;
  let imageUploadedCount = 0;

  for (const newApp of newApps) {
    // 이미지 처리 (Unsplash → Supabase)
    if (newApp.image && SERVICE_ROLE_KEY) {
      const newImageUrl = await processImage(newApp.image, newApp.slug, SUPABASE_URL, SERVICE_ROLE_KEY);
      if (newImageUrl !== newApp.image) {
        newApp.image = newImageUrl;
        imageUploadedCount++;
      }
    }

    if (existingAppsMap.has(newApp.id)) {
      // 기존 앱 업데이트 (일부 필드만)
      const existing = existingAppsMap.get(newApp.id);
      existing.name = newApp.name;
      existing.icon = newApp.icon;
      existing.url = newApp.url;
      // 이미지가 업데이트된 경우에만 변경
      if (newApp.image !== existing.image) {
        existing.image = newApp.image;
      }
      updatedCount++;
    } else {
      // 새 앱 추가
      existingData.apps.push(newApp);
      addedCount++;
    }
  }

  // 파일 저장
  fs.writeFileSync(APPS_JSON_PATH, JSON.stringify(existingData, null, 2), 'utf8');

  console.log('📝 apps.json 업데이트 완료');
  console.log('   - 새로 추가: ' + addedCount + '개');
  console.log('   - 업데이트: ' + updatedCount + '개');
  console.log('   - 이미지 업로드: ' + imageUploadedCount + '개\n');

  return existingData.apps;
}

// Supabase 등록
function registerToSupabase(app, SUPABASE_URL, ANON_KEY) {
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
          resolve({ success: true, app: app.name });
        } else {
          resolve({ success: false, app: app.name, error: data });
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

// Supabase 동기화
async function syncToSupabase(apps) {
  const { SUPABASE_URL, ANON_KEY } = loadEnv();
  
  if (!SUPABASE_URL || !ANON_KEY) {
    console.warn('⚠️  Supabase 환경변수 없음. DB 동기화 건너뜀.\n');
    return;
  }
  
  console.log('☁️  Supabase 동기화 시작...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const app of apps) {
    try {
      const result = await registerToSupabase(app, SUPABASE_URL, ANON_KEY);
      if (result.success) {
        console.log('  ✓ ' + app.name);
        successCount++;
      } else {
        console.log('  ✗ ' + app.name + ' (실패)');
        failCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.log('  ✗ ' + app.name + ' (오류)');
      failCount++;
    }
  }
  
  console.log('\n📊 Supabase 동기화 완료');
  console.log('   - 성공: ' + successCount + '개');
  console.log('   - 실패: ' + failCount + '개\n');
}

// 메인 실행
async function main() {
  console.log('\n🚀 앱 자동 동기화 시작\n');
  console.log('='.repeat(50) + '\n');

  // 1. 앱 폴더 스캔
  const scannedApps = scanAppsFolder();

  // 2. apps.json 업데이트 (이미지 자동 업로드 포함)
  const allApps = await updateAppsJson(scannedApps);

  // 3. Supabase 동기화
  await syncToSupabase(allApps);

  console.log('='.repeat(50));
  console.log('\n✅ 모든 동기화 완료!\n');
  console.log('💡 이제 새 앱을 만들면 이미지가 자동으로 Supabase에 업로드됩니다!\n');
}

main().catch(console.error);
