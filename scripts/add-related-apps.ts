import * as fs from 'fs';
import * as path from 'path';

// 관련 앱 매핑 (필수 연결 + 논리적 그룹화)
const relatedAppsMap: Record<string, string[]> = {
  // 운세/심리 그룹 (필수: mbti → saju-mbti → face-shape)
  'mbti-test': ['saju-mbti-jobs', 'face-shape', 'color-psychology'],
  'saju-mbti-jobs': ['mbti-test', 'face-shape', 'today-fortune', 'past-life-job'],
  'face-shape': ['saju-mbti-jobs', 'mbti-test', 'voice-fortune', 'analysis-handwriting'],
  'today-fortune': ['saju-mbti-jobs', 'lotto-generator', 'dream-interpreter'],
  'color-psychology': ['mbti-test', 'saju-mbti-jobs', 'analysis-handwriting'],
  'voice-fortune': ['face-shape', 'voice-age', 'analysis-handwriting'],
  'analysis-handwriting': ['face-shape', 'color-psychology', 'mbti-test'],
  'iq-test': ['reflex-test', 'typing-speed-test', 'games-puzzle'],
  'past-life-job': ['saju-mbti-jobs', 'today-fortune', 'dream-interpreter'],
  'dream-interpreter': ['today-fortune', 'past-life-job', 'color-psychology'],
  'lotto-generator': ['today-fortune', 'crypto-calculator', 'compound-calculator'],
  'fengshui-guide': ['compass', 'today-fortune', 'saju-mbti-jobs'],
  'life-support': ['quote-generator', 'today-fortune', 'parents-time'],

  // 건강/루틴 그룹
  'calorie-calculator': ['water-intake', 'coffee-calculator', 'sleep-analyzer'],
  'water-intake': ['calorie-calculator', 'coffee-calculator', 'habit-tracker'],
  'coffee-calculator': ['calorie-calculator', 'water-intake', 'sleep-analyzer'],
  'sleep-analyzer': ['calorie-calculator', 'habit-tracker', 'focus-timer'],
  'phone-usage-analyzer': ['habit-tracker', 'focus-timer', 'eye-test'],
  'eye-test': ['phone-usage-analyzer', 'reflex-test', 'sleep-analyzer'],
  'air-quality': ['weather-outfit', 'eye-test', 'water-intake'],
  'weather-outfit': ['air-quality', 'travel-packing-list', 'gift-finder'],
  'dday-counter': ['habit-tracker', 'focus-timer', 'parents-time'],
  'focus-timer': ['habit-tracker', 'dday-counter', 'study-cursor-prompts'],
  'habit-tracker': ['focus-timer', 'dday-counter', 'phone-usage-analyzer'],
  'vitamin-check': ['calorie-calculator', 'water-intake', 'sleep-analyzer'],
  'voice-age': ['voice-fortune', 'eye-test', 'reflex-test'],

  // 게임/두뇌 그룹
  'gomoku': ['baduk', 'chess', 'iq-test'],
  'baduk': ['gomoku', 'chess', 'games-puzzle'],
  'chess': ['gomoku', 'baduk', 'mafia-game'],
  'mafia-game': ['chess', 'gomoku', 'arcade-mini-games'],
  'arcade-mini-games': ['mafia-game', 'games-puzzle', 'games-multiplication'],
  'games-puzzle': ['iq-test', 'arcade-mini-games', 'reflex-test'],
  'games-multiplication': ['arcade-mini-games', 'flashcard', 'typing-speed-test'],

  // 금융 그룹
  'salary-divider': ['income-tax-calculator', 'compound-calculator', 'finance-emergency-fund'],
  'income-tax-calculator': ['salary-divider', 'compound-calculator', 'crypto-calculator'],
  'compound-calculator': ['salary-divider', 'income-tax-calculator', 'credit-card-optimizer'],
  'utility-electricity-calculator': ['salary-divider', 'credit-card-optimizer', 'finance-emergency-fund'],
  'credit-card-optimizer': ['compound-calculator', 'salary-divider', 'finance-loan-refinance'],
  'finance-emergency-fund': ['salary-divider', 'compound-calculator', 'finance-loan-refinance'],
  'finance-loan-refinance': ['finance-emergency-fund', 'compound-calculator', 'credit-card-optimizer'],
  'crypto-calculator': ['income-tax-calculator', 'compound-calculator', 'lotto-generator'],

  // 생활/가족 그룹
  'parents-time': ['life-support', 'gift-finder', 'dday-counter'],
  'gift-finder': ['parents-time', 'travel-packing-list', 'weather-outfit'],
  'travel-packing-list': ['gift-finder', 'weather-outfit', 'dday-counter'],

  // 학습 그룹
  'flashcard': ['typing-speed-test', 'study-cursor-prompts', 'games-multiplication'],
  'typing-speed-test': ['reflex-test', 'flashcard', 'iq-test'],
  'reflex-test': ['typing-speed-test', 'iq-test', 'eye-test'],
  'study-cursor-prompts': ['flashcard', 'startup-naming', 'focus-timer'],
  'compass': ['fengshui-guide', 'air-quality', 'weather-outfit'],
  'quote-generator': ['life-support', 'today-fortune', 'focus-timer'],
  'startup-naming': ['study-cursor-prompts', 'quote-generator', 'flashcard'],

  // 기타
  'car-maintenance': ['utility-electricity-calculator', 'dday-counter', 'focus-timer'],
  'lifestyle-face-fortune': ['face-shape', 'saju-mbti-jobs', 'today-fortune'],
  'meat-calculator': ['calorie-calculator', 'water-intake', 'coffee-calculator']
};

// data/apps.json 처리
function updateAppsJson(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);

  data.apps = data.apps.map((app: any) => {
    const relatedApps = relatedAppsMap[app.id];
    if (relatedApps) {
      return { ...app, relatedApps };
    }
    return app;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Updated: ${filePath}`);
}

// 실행
const dataAppsPath = path.join(__dirname, '../data/apps.json');
const publicAppsPath = path.join(__dirname, '../public/data/apps.json');

console.log('🔄 Adding relatedApps to apps.json files...\n');

updateAppsJson(dataAppsPath);
updateAppsJson(publicAppsPath);

console.log('\n✨ Done! RelatedApps added to all apps.');

