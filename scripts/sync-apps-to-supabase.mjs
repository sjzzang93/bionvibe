#!/usr/bin/env node
/**
 * apps.json의 모든 앱 데이터를 Supabase 동기화 SQL로 생성
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// apps.json 읽기
const appsJsonPath = join(projectRoot, 'data', 'apps.json');
const appsData = JSON.parse(readFileSync(appsJsonPath, 'utf-8'));

console.log(`📦 총 ${appsData.apps.length}개 앱 발견`);

// SQL 생성
let sql = `-- apps.json의 모든 앱을 Supabase에 동기화
-- 생성일시: ${new Date().toISOString()}
-- 총 ${appsData.apps.length}개 앱

`;

appsData.apps.forEach((app, index) => {
  const isLast = index === appsData.apps.length - 1;
  
  sql += `-- ${index + 1}. ${app.name}\n`;
  sql += `INSERT INTO apps (id, name, slug, icon, description, category_id, url, image, created_at, hidden)\n`;
  sql += `VALUES (\n`;
  sql += `  '${app.id}',\n`;
  sql += `  '${app.name.replace(/'/g, "''")}',\n`;
  sql += `  '${app.slug}',\n`;
  sql += `  '${app.icon}',\n`;
  sql += `  '${app.description.replace(/'/g, "''")}',\n`;
  sql += `  '${app.categoryId}',\n`;
  sql += `  '${app.url}',\n`;
  sql += `  '${app.image || ''}',\n`;
  sql += `  '${app.createdAt}T00:00:00Z',\n`;
  sql += `  ${app.hidden || false}\n`;
  sql += `)\n`;
  sql += `ON CONFLICT (id) DO UPDATE SET\n`;
  sql += `  name = EXCLUDED.name,\n`;
  sql += `  slug = EXCLUDED.slug,\n`;
  sql += `  icon = EXCLUDED.icon,\n`;
  sql += `  description = EXCLUDED.description,\n`;
  sql += `  category_id = EXCLUDED.category_id,\n`;
  sql += `  url = EXCLUDED.url,\n`;
  sql += `  image = EXCLUDED.image,\n`;
  sql += `  hidden = EXCLUDED.hidden;\n`;
  sql += `\n`;
});

// SQL 파일 저장
const outputPath = join(projectRoot, 'SYNC_ALL_APPS.sql');
writeFileSync(outputPath, sql, 'utf-8');

console.log(`✅ SQL 파일 생성 완료: SYNC_ALL_APPS.sql`);
console.log(`📝 Supabase SQL Editor에서 실행하세요!`);

