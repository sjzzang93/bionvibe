#!/bin/bash

# 파일 목록
files=(
  "app/apps/vitamin-check/page.tsx"
  "app/apps/travel-destinations/page.tsx"
  "app/apps/saju-mbti-jobs/page.tsx"
  "app/apps/reflex-test/page.tsx"
  "app/apps/parents-time/page.tsx"
  "app/apps/mood-cheer-up/page.tsx"
  "app/apps/mbti-test/page.tsx"
  "app/apps/lotto-generator/page.tsx"
  "app/apps/lifestyle-palm-reading/page.tsx"
  "app/apps/lifestyle-face-fortune/page.tsx"
  "app/apps/iq-test/page.tsx"
  "app/apps/health-supplement-recommend/page.tsx"
  "app/apps/focus-timer/page.tsx"
  "app/apps/face-shape/page.tsx"
  "app/apps/envelope-recommend/page.tsx"
  "app/apps/dream-interpreter/page.tsx"
  "app/apps/compass/page.tsx"
  "app/apps/color-psychology/page.tsx"
  "app/apps/car-maintenance/page.tsx"
)

# 각 파일에서 relatedAppIds를 찾아서 currentAppSlug로 변경
for file in "${files[@]}"; do
  echo "Processing $file..."
  
  # 파일에서 앱 슬러그 추출 (폴더명 사용)
  slug=$(basename $(dirname "$file"))
  
  # sed로 RelatedApps 사용 패턴 찾아서 수정
  # relatedAppIds={[...]} 패턴을 currentAppSlug로 변경
  sed -i '' -E "s/<RelatedApps[^>]*relatedAppIds[^>]*currentAppId[^>]*\/>/<RelatedApps currentAppSlug=\"$slug\" className=\"mt-8\" \/>/" "$file"
  
  # 여러 줄에 걸쳐있는 경우도 처리
  # 임시 파일을 사용하여 여러 줄 패턴 교체
  perl -i -p0e "s/<RelatedApps\\s+[^>]*relatedAppIds[^>]*>/<RelatedApps currentAppSlug=\"$slug\" className=\"mt-8\" \/>/gs" "$file"
done

echo "Done!"

