#!/bin/bash

# 다크모드 일괄 추가 스크립트
APPS=(
  "air-quality"
  "analysis-handwriting"
  "car-maintenance"
  "coffee-calculator"
  "color-psychology"
  "compound-calculator"
  "credit-card-optimizer"
  "dday-counter"
  "eye-test"
  "face-shape"
  "finance-emergency-fund"
  "finance-loan-refinance"
  "flashcard"
  "focus-timer"
  "games-multiplication"
  "games-puzzle"
  "habit-tracker"
  "income-tax-calculator"
  "lotto-generator"
  "meat-calculator"
  "parents-time"
  "phone-usage-analyzer"
  "quote-generator"
  "reflex-test"
  "saju-mbti-jobs"
  "salary-divider"
  "sleep-analyzer"
  "travel-packing-list"
  "typing-speed-test"
  "utility-electricity-calculator"
  "vitamin-check"
  "water-intake"
  "weather-outfit"
)

for app in "${APPS[@]}"; do
  FILE="app/apps/$app/page.tsx"
  if [ -f "$FILE" ]; then
    echo "Processing: $app"
    
    # bg-white에 dark:bg-gray-900 추가
    sed -i.bak 's/className="\([^"]*\)bg-white\([^"]*\)"/className="\1bg-white dark:bg-gray-900\2"/g' "$FILE"
    
    # bg-gray-50에 dark:bg-gray-800 추가
    sed -i.bak 's/className="\([^"]*\)bg-gray-50\([^"]*\)"/className="\1bg-gray-50 dark:bg-gray-800\2"/g' "$FILE"
    
    # bg-gray-100에 dark:bg-gray-700 추가
    sed -i.bak 's/className="\([^"]*\)bg-gray-100\([^"]*\)"/className="\1bg-gray-100 dark:bg-gray-700\2"/g' "$FILE"
    
    # text-gray-900에 dark:text-white 추가
    sed -i.bak 's/className="\([^"]*\)text-gray-900\([^"]*\)"/className="\1text-gray-900 dark:text-white\2"/g' "$FILE"
    
    # text-gray-800에 dark:text-gray-200 추가
    sed -i.bak 's/className="\([^"]*\)text-gray-800\([^"]*\)"/className="\1text-gray-800 dark:text-gray-200\2"/g' "$FILE"
    
    # text-gray-700에 dark:text-gray-300 추가
    sed -i.bak 's/className="\([^"]*\)text-gray-700\([^"]*\)"/className="\1text-gray-700 dark:text-gray-300\2"/g' "$FILE"
    
    # text-gray-600에 dark:text-gray-400 추가
    sed -i.bak 's/className="\([^"]*\)text-gray-600\([^"]*\)"/className="\1text-gray-600 dark:text-gray-400\2"/g' "$FILE"
    
    # border-gray-200에 dark:border-gray-700 추가
    sed -i.bak 's/className="\([^"]*\)border-gray-200\([^"]*\)"/className="\1border-gray-200 dark:border-gray-700\2"/g' "$FILE"
    
    # border-gray-300에 dark:border-gray-600 추가
    sed -i.bak 's/className="\([^"]*\)border-gray-300\([^"]*\)"/className="\1border-gray-300 dark:border-gray-600\2"/g' "$FILE"
    
    # 백업 파일 삭제
    rm -f "$FILE.bak"
  fi
done

echo "Done!"








