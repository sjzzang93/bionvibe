#!/bin/bash

# 주요 웹앱에 RelatedApps 컴포넌트 추가

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Adding RelatedApps to main app pages...${NC}\n"

# 1. Import 추가 함수
add_import() {
  local file=$1
  # RelatedApps import가 없으면 추가
  if ! grep -q "import RelatedApps from" "$file"; then
    sed -i.bak "1,/^import/ s|^\(import.*useState.*\)|import RelatedApps from '@/app/components/RelatedApps';\n\1|" "$file"
    echo -e "${GREEN}✅ Added import to $file${NC}"
  fi
}

# 2. RelatedApps 컴포넌트 추가 함수
add_component() {
  local file=$1
  local related_apps=$2
  local current_id=$3
  
  # RelatedApps가 이미 있으면 스킵
  if grep -q "<RelatedApps" "$file"; then
    echo -e "${BLUE}⏭️  Skipped $file (already has RelatedApps)${NC}"
    return
  fi
  
  # "다시 분석하기" 버튼 뒤에 RelatedApps 추가
  sed -i.bak "/다시 분석하기\|다시 테스트\|다시 하기\|새로 시작/,/button>/ {
    /button>/ a\\
\\            \\
\\            {/* 관련 앱 추천 */}\\
\\            <RelatedApps \\
\\              relatedAppIds={[$related_apps]}\\
\\              currentAppId=\"$current_id\"\\
\\            />
  }" "$file"
  
  echo -e "${GREEN}✅ Added RelatedApps to $file${NC}"
}

# 앱별 처리
# 1. 사주MBTI
FILE="app/apps/saju-mbti-jobs/page.tsx"
if [ -f "$FILE" ]; then
  add_import "$FILE"
  add_component "$FILE" "'mbti-test', 'face-shape', 'today-fortune', 'past-life-job'" "saju-mbti-jobs"
fi

# 2. 칼로리 계산기
FILE="app/apps/calorie-calculator/page.tsx"
if [ -f "$FILE" ]; then
  add_import "$FILE"
  add_component "$FILE" "'water-intake', 'coffee-calculator', 'sleep-analyzer'" "calorie-calculator"
fi

# 3. 커피 계산기
FILE="app/apps/coffee-calculator/page.tsx"
if [ -f "$FILE" ]; then
  add_import "$FILE"
  add_component "$FILE" "'calorie-calculator', 'water-intake', 'sleep-analyzer'" "coffee-calculator"
fi

# 4. IQ 테스트
FILE="app/apps/iq-test/page.tsx"
if [ -f "$FILE" ]; then
  add_import "$FILE"
  add_component "$FILE" "'reflex-test', 'typing-speed-test', 'games-puzzle'" "iq-test"
fi

# 5. 오늘의 운세
FILE="app/apps/today-fortune/page.tsx"
if [ -f "$FILE" ]; then
  add_import "$FILE"
  add_component "$FILE" "'saju-mbti-jobs', 'lotto-generator', 'dream-interpreter'" "today-fortune"
fi

# 6. 색상 심리
FILE="app/apps/color-psychology/page.tsx"
if [ -f "$FILE" ]; then
  add_import "$FILE"
  add_component "$FILE" "'mbti-test', 'saju-mbti-jobs', 'analysis-handwriting'" "color-psychology"
fi

# 7. MBTI 테스트
FILE="app/apps/mbti-test/page.tsx"
if [ -f "$FILE" ]; then
  add_import "$FILE"
  add_component "$FILE" "'saju-mbti-jobs', 'face-shape', 'color-psychology'" "mbti-test"
fi

# .bak 파일 삭제
find app/apps -name "*.bak" -delete

echo -e "\n${BLUE}✨ Done! RelatedApps added to all main pages.${NC}"

