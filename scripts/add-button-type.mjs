#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app 디렉토리 경로
const appDir = path.join(__dirname, '..', 'app');

// tsx 파일 찾기
function findTsxFiles(dir) {
  const files = [];
  
  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// button에 type="button" 추가
function addButtonType(content) {
  // <button으로 시작하고 type=이 없는 경우 찾기
  // 정규식: <button 뒤에 공백이나 줄바꿈이 오고, type=이 나오기 전까지
  const regex = /<button(\s+(?![^>]*\btype\s*=)[^>]*)(>)/g;
  
  let modified = content.replace(regex, (match, attributes, closingBracket) => {
    // 이미 type이 있는지 다시 확인
    if (attributes.includes('type=')) {
      return match;
    }
    // type="button" 추가 (첫 번째 속성 앞에)
    return `<button\n        type="button"${attributes}${closingBracket}`;
  });
  
  return modified;
}

// 메인 실행
const files = findTsxFiles(appDir);
console.log(`📝 Found ${files.length} .tsx files`);

let modifiedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const modified = addButtonType(content);
  
  if (content !== modified) {
    fs.writeFileSync(file, modified, 'utf8');
    console.log(`✅ Modified: ${path.relative(process.cwd(), file)}`);
    modifiedCount++;
  }
}

console.log(`\n🎉 Complete! Modified ${modifiedCount} files.`);

