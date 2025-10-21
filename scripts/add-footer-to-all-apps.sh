#!/bin/bash

# 모든 웹앱 페이지에 AppFooter 추가하는 스크립트

APPS_DIR="/Users/fire/Desktop/bionvibe2/app/apps"

# 모든 page.tsx 파일 찾기
find "$APPS_DIR" -name "page.tsx" | while read -r file; do
  echo "Processing: $file"
  
  # 이미 AppFooter가 import되어 있는지 확인
  if grep -q "import AppFooter" "$file"; then
    echo "  → Already has AppFooter import, skipping..."
    continue
  fi
  
  # 1. import 추가 (마지막 import 문 다음에)
  # React import가 있는 줄 찾기
  if grep -q "^import.*from ['\"]react['\"]" "$file"; then
    # React import 다음에 AppFooter import 추가
    sed -i '' "/^import.*from ['\"]react['\"]/a\\
import AppFooter from \"@/app/components/AppFooter\";
" "$file"
    echo "  → Added import"
  elif grep -q "^import.*useState" "$file"; then
    # useState가 있는 줄 다음에 추가
    sed -i '' "/^import.*useState/a\\
import AppFooter from \"@/app/components/AppFooter\";
" "$file"
    echo "  → Added import after useState"
  fi
  
  # 2. Footer 컴포넌트 추가 (마지막 </section> 또는 </main> 이전)
  # 파일의 마지막 몇 줄에서 적절한 위치 찾아서 추가
  # 이 부분은 수동으로 하는 게 안전할 수 있습니다
  
done

echo ""
echo "✅ Import statements added to all app pages!"
echo "⚠️  Now manually add <AppFooter /> before closing </section> or </main> tags"

