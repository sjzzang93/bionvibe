'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StartupNamingPage() {
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState('');
  const [vibe, setVibe] = useState('');
  const [language, setLanguage] = useState('mixed');
  const [results, setResults] = useState<any[]>([]);

  const industries = [
    { id: 'tech', name: '🖥️ IT/테크', prefix: ['스마트', '디지털', '테크', '넥스트', '클라우드'] },
    { id: 'finance', name: '💰 금융/핀테크', prefix: ['페이', '파이낸스', '머니', '캐피탈', '인베스트'] },
    { id: 'education', name: '📚 교육/에듀테크', prefix: ['런', '에듀', '스터디', '러닝', '클래스'] },
    { id: 'health', name: '🏥 헬스케어', prefix: ['메디', '헬스', '케어', '라이프', '웰'] },
    { id: 'commerce', name: '🛒 커머스/리테일', prefix: ['마켓', '샵', '스토어', '딜', '카트'] },
    { id: 'content', name: '🎬 콘텐츠/미디어', prefix: ['미디어', '콘텐츠', '스토리', '라이브', '플레이'] },
    { id: 'logistics', name: '📦 물류/배송', prefix: ['로지', '딜리버리', '플로우', '트랜스', '고고'] },
    { id: 'food', name: '🍔 푸드테크', prefix: ['푸드', '키친', '쿡', '밀', '테이스트'] }
  ];

  const vibes = [
    { id: 'innovative', name: '🚀 혁신적', suffix: ['랩', '테크', '이노베이션', 'AI', '넥스트'] },
    { id: 'friendly', name: '😊 친근한', suffix: ['프렌즈', '버디', '메이트', '파트너', '하우스'] },
    { id: 'premium', name: '💎 프리미엄', suffix: ['프로', '엑스퍼트', '프리미엄', '마스터', '엘리트'] },
    { id: 'global', name: '🌍 글로벌', suffix: ['글로벌', '인터내셔널', '월드', '유니버설', '코스모'] },
    { id: 'simple', name: '✨ 심플한', suffix: ['심플', '이지', '원', '클릭', '고고'] }
  ];

  const generateNames = () => {
    if (!industry || !vibe) {
      alert('업종과 느낌을 선택해주세요!');
      return;
    }

    const selectedIndustry = industries.find(i => i.id === industry);
    const selectedVibe = vibes.find(v => v.id === vibe);
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);

    const names: any[] = [];
    const usedNames = new Set();

    // 1. 업종 + 느낌 조합
    if (selectedIndustry && selectedVibe) {
      for (let i = 0; i < 3; i++) {
        const prefix = selectedIndustry.prefix[Math.floor(Math.random() * selectedIndustry.prefix.length)];
        const suffix = selectedVibe.suffix[Math.floor(Math.random() * selectedVibe.suffix.length)];
        
        if (language === 'korean' || language === 'mixed') {
          const koreanName = `${prefix}${suffix}`;
          if (!usedNames.has(koreanName)) {
            names.push(createNameObject(koreanName, 'korean', selectedIndustry.name, selectedVibe.name));
            usedNames.add(koreanName);
          }
        }
        
        if (language === 'english' || language === 'mixed') {
          const englishName = romanize(`${prefix}${suffix}`);
          if (!usedNames.has(englishName)) {
            names.push(createNameObject(englishName, 'english', selectedIndustry.name, selectedVibe.name));
            usedNames.add(englishName);
          }
        }
      }
    }

    // 2. 키워드 기반 이름
    if (keywordList.length > 0) {
      keywordList.forEach(keyword => {
        const creativeEndings = ['랩', '허브', '플러스', '웨이', '존', '스페이스'];
        const ending = creativeEndings[Math.floor(Math.random() * creativeEndings.length)];
        
        if (language === 'korean' || language === 'mixed') {
          const koreanName = `${keyword}${ending}`;
          if (!usedNames.has(koreanName)) {
            names.push(createNameObject(koreanName, 'korean', '키워드 기반', '창의적'));
            usedNames.add(koreanName);
          }
        }
        
        if (language === 'english' || language === 'mixed') {
          const englishName = romanize(`${keyword}${ending}`);
          if (!usedNames.has(englishName)) {
            names.push(createNameObject(englishName, 'english', '키워드 기반', '창의적'));
            usedNames.add(englishName);
          }
        }
      });
    }

    // 3. 트렌디한 조합
    const trendyPrefixes = ['더', '오늘의', '마이', '위', '얼라이브'];
    const trendySuffixes = ['닷컴', '온', '고', '즈', '잇'];
    
    for (let i = 0; i < 5; i++) {
      const prefix = trendyPrefixes[Math.floor(Math.random() * trendyPrefixes.length)];
      const suffix = trendySuffixes[Math.floor(Math.random() * trendySuffixes.length)];
      const middle = keywordList.length > 0 
        ? keywordList[Math.floor(Math.random() * keywordList.length)]
        : selectedIndustry?.prefix[Math.floor(Math.random() * selectedIndustry.prefix.length)] || '비즈';
      
      if (language === 'korean' || language === 'mixed') {
        const koreanName = `${prefix}${middle}${suffix}`;
        if (!usedNames.has(koreanName)) {
          names.push(createNameObject(koreanName, 'korean', '트렌디', selectedVibe?.name || '현대적'));
          usedNames.add(koreanName);
        }
      }
      
      if (language === 'english' || language === 'mixed') {
        const englishName = romanize(`${prefix}${middle}${suffix}`);
        if (!usedNames.has(englishName)) {
          names.push(createNameObject(englishName, 'english', '트렌디', selectedVibe?.name || '현대적'));
          usedNames.add(englishName);
        }
      }
    }

    setResults(names.slice(0, 15));
  };

  const createNameObject = (name: string, lang: string, industryTag: string, vibeTag: string) => {
    const domains = checkDomainAvailability(name);
    return {
      name,
      language: lang,
      industryTag,
      vibeTag,
      domains,
      meaning: generateMeaning(name, lang),
      tips: generateBrandingTips(name, lang)
    };
  };

  const romanize = (koreanText: string): string => {
    const romanMap: { [key: string]: string } = {
      '스마트': 'Smart', '디지털': 'Digital', '테크': 'Tech', '넥스트': 'Next', '클라우드': 'Cloud',
      '페이': 'Pay', '파이낸스': 'Finance', '머니': 'Money', '캐피탈': 'Capital', '인베스트': 'Invest',
      '런': 'Learn', '에듀': 'Edu', '스터디': 'Study', '러닝': 'Learning', '클래스': 'Class',
      '메디': 'Medi', '헬스': 'Health', '케어': 'Care', '라이프': 'Life', '웰': 'Well',
      '마켓': 'Market', '샵': 'Shop', '스토어': 'Store', '딜': 'Deal', '카트': 'Cart',
      '미디어': 'Media', '콘텐츠': 'Contents', '스토리': 'Story', '라이브': 'Live', '플레이': 'Play',
      '로지': 'Logi', '딜리버리': 'Delivery', '플로우': 'Flow', '트랜스': 'Trans', '고고': 'Gogo',
      '푸드': 'Food', '키친': 'Kitchen', '쿡': 'Cook', '밀': 'Meal', '테이스트': 'Taste',
      '랩': 'Lab', '이노베이션': 'Innovation', 'AI': 'AI', '프렌즈': 'Friends', '버디': 'Buddy',
      '메이트': 'Mate', '파트너': 'Partner', '하우스': 'House', '프로': 'Pro', '엑스퍼트': 'Expert',
      '프리미엄': 'Premium', '마스터': 'Master', '엘리트': 'Elite', '글로벌': 'Global',
      '인터내셔널': 'International', '월드': 'World', '유니버설': 'Universal', '코스모': 'Cosmo',
      '심플': 'Simple', '이지': 'Easy', '원': 'One', '클릭': 'Click',
      '더': 'The', '오늘의': 'Today', '마이': 'My', '위': 'We', '얼라이브': 'Alive',
      '닷컴': 'com', '온': 'On', '고': 'Go', '즈': 'z', '잇': 'it',
      '허브': 'Hub', '플러스': 'Plus', '웨이': 'Way', '존': 'Zone', '스페이스': 'Space'
    };

    let result = koreanText;
    Object.keys(romanMap).forEach(korean => {
      result = result.replace(new RegExp(korean, 'g'), romanMap[korean]);
    });
    
    return result;
  };

  const checkDomainAvailability = (name: string) => {
    // 실제로는 API를 사용하지만, 여기서는 시뮬레이션
    const englishName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const random = Math.random();
    
    return {
      com: random > 0.7 ? '✅ 사용 가능' : '❌ 사용 불가',
      kr: random > 0.5 ? '✅ 사용 가능' : '❌ 사용 불가',
      io: random > 0.6 ? '✅ 사용 가능' : '❌ 사용 불가',
      ai: random > 0.8 ? '✅ 사용 가능' : '❌ 사용 불가',
      domain: englishName
    };
  };

  const generateMeaning = (name: string, lang: string): string => {
    const meanings = [
      '혁신과 성장을 상징하는 이름입니다.',
      '사용자 친화적이고 기억하기 쉬운 브랜드입니다.',
      '글로벌 시장 진출에 적합한 네이밍입니다.',
      '전문성과 신뢰를 전달하는 이름입니다.',
      '트렌디하고 미래지향적인 느낌을 줍니다.',
      '간결하면서도 임팩트 있는 브랜드입니다.',
      '업계 특성을 잘 반영한 직관적인 이름입니다.'
    ];
    return meanings[Math.floor(Math.random() * meanings.length)];
  };

  const generateBrandingTips = (name: string, lang: string): string[] => {
    const tips = [
      '💡 로고는 심플하고 모던한 디자인으로',
      '🎨 브랜드 컬러는 2-3가지로 제한',
      '📱 모바일 친화적인 UI/UX 구현',
      '🌐 소셜 미디어 계정 선점 필수',
      '✍️ 브랜드 스토리 명확히 정의',
      '🎯 타겟 고객층 분석 후 마케팅',
      '📊 초기에는 핵심 기능에 집중'
    ];
    
    return tips.sort(() => Math.random() - 0.5).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 py-8 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            🚀 스타트업 네이밍 메이커
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
            완벽한 회사 이름을 찾아드립니다 (도메인 체크 포함)
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-8 space-y-6">
          {/* 업종 선택 */}
          <div>
            <label className="block text-gray-900 dark:text-white font-bold mb-3 text-sm md:text-base">
              1️⃣ 업종을 선택하세요
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {industries.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                  className={`p-3 rounded-xl font-medium text-sm transition-all ${
                    industry === ind.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/30'
                  }`}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          </div>

          {/* 키워드 입력 */}
          <div>
            <label className="block text-gray-900 dark:text-white font-bold mb-3 text-sm md:text-base">
              2️⃣ 핵심 키워드 (선택, 최대 3개)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="예: 빠른, 쉬운, 안전한 (쉼표로 구분)"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* 느낌 선택 */}
          <div>
            <label className="block text-gray-900 dark:text-white font-bold mb-3 text-sm md:text-base">
              3️⃣ 원하는 느낌을 선택하세요
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {vibes.map(v => (
                <button
                  key={v.id}
                  onClick={() => setVibe(v.id)}
                  className={`p-3 rounded-xl font-medium text-sm transition-all ${
                    vibe === v.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/30'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          {/* 언어 타입 */}
          <div>
            <label className="block text-gray-900 dark:text-white font-bold mb-3 text-sm md:text-base">
              4️⃣ 언어 타입
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'korean', name: '🇰🇷 한글' },
                { id: 'english', name: '🇺🇸 영문' },
                { id: 'mixed', name: '🌐 혼합' }
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`p-3 rounded-xl font-medium text-sm transition-all ${
                    language === lang.id
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/30'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* 생성 버튼 */}
          <button
            onClick={generateNames}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            ✨ 이름 생성하기 (15개)
          </button>
        </div>

        {/* 결과 */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
              💡 추천 이름 ({results.length}개)
            </h2>

            {results.map((result, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {result.name}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                        {result.language === 'korean' ? '한글' : '영문'}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                        {result.industryTag}
                      </span>
                      <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
                        {result.vibeTag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 의미 */}
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    {result.meaning}
                  </p>
                </div>

                {/* 도메인 체크 */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">
                    🌐 도메인 가용성 ({result.domains.domain})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">.com</span>
                      <span>{result.domains.com}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">.kr</span>
                      <span>{result.domains.kr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">.io</span>
                      <span>{result.domains.io}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">.ai</span>
                      <span>{result.domains.ai}</span>
                    </div>
                  </div>
                </div>

                {/* 브랜딩 팁 */}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                    💼 브랜딩 팁
                  </h4>
                  <ul className="space-y-1 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                    {result.tips.map((tip: string, tipIdx: number) => (
                      <li key={tipIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 안내 */}
        <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-xl p-4 mt-8 text-gray-900 dark:text-white">
          <p className="text-xs md:text-sm text-center">
            ⚠️ 도메인 가용성은 시뮬레이션입니다. 실제 등록 전 반드시 확인하세요!
          </p>
        </div>

        {/* 돌아가기 */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block bg-gray-200 dark:bg-white/20 hover:bg-gray-300 dark:hover:bg-white/30 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-all"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}



