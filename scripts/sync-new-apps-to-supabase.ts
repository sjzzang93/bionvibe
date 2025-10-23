#!/usr/bin/env ts-node
/**
 * sync-new-apps-to-supabase.ts
 *
 * 목적: /tmp/new-apps.json의 앱들을 Supabase에 추가
 */

import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

interface NewApp {
  source: string;
  slug: string;
  name: string;
  icon: string;
  category: string;
}

// Unsplash 이미지 풀
const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80',
  'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=80',
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&q=80',
];

// 설명 생성
const DESCRIPTION_MAP: Record<string, string> = {
  'nickname-generator': '완벽한 이름과 닉네임을 생성해드려요',
  'color-finder-game': '미묘하게 다른 색을 찾는 재미있는 게임',
  'emotion-diary': '오늘의 감정을 색깔과 날씨로 기록하세요',
  'animal-face-match': 'AI가 당신과 닮은 동물상을 찾아드려요',
  'fridge-recipe': '냉장고 재료로 만들 수 있는 레시피 추천',
};

async function syncToSupabase() {
  // Supabase 클라이언트 생성
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
    console.error('   NEXT_PUBLIC_SUPABASE_URL');
    console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 새 앱 목록 읽기
  const newAppsPath = '/tmp/new-apps.json';
  const newApps: NewApp[] = JSON.parse(fs.readFileSync(newAppsPath, 'utf-8'));

  console.log(`\n🔄 ${newApps.length}개 앱을 Supabase에 추가합니다...\n`);

  // 기존 앱 확인
  const { data: existingApps } = await supabase
    .from('apps')
    .select('slug');

  const existingSlugs = new Set((existingApps || []).map((app: any) => app.slug));

  // 새 앱 추가
  let addedCount = 0;
  const today = new Date().toISOString();

  for (let i = 0; i < newApps.length; i++) {
    const newApp = newApps[i];

    if (existingSlugs.has(newApp.slug)) {
      console.log(`⏭️  스킵: ${newApp.name} (이미 존재)`);
      continue;
    }

    const appData = {
      id: newApp.slug,
      name: newApp.name,
      slug: newApp.slug,
      icon: newApp.icon,
      description: DESCRIPTION_MAP[newApp.slug] || `${newApp.name} 서비스`,
      category_id: newApp.category,
      url: `/apps/${newApp.slug}`,
      image: IMAGE_POOL[i % IMAGE_POOL.length],
      created_at: today,
      hidden: false,
    };

    const { error } = await supabase
      .from('apps')
      .insert([appData]);

    if (error) {
      console.error(`❌ 실패: ${newApp.name} - ${error.message}`);
    } else {
      console.log(`✅ 추가: ${newApp.name} (${newApp.slug})`);
      addedCount++;
    }
  }

  console.log(`\n✅ Supabase 동기화 완료!`);
  console.log(`   ${addedCount}개 앱이 추가되었습니다.\n`);
}

// 실행
if (require.main === module) {
  syncToSupabase().catch(console.error);
}

export { syncToSupabase };
