"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw, Clock, Calendar } from 'lucide-react';

interface Article {
  title: string;
  link: string;
  summary: string;
  press: string;
}

interface NewsData {
  updated_at: string;
  total_articles: number;
  ai_summary: string | null;
  categories: Record<string, Article[]>;
  all_articles: Article[];
}

const categoryEmojis: Record<string, string> = {
  '정치': '🏛️',
  '경제': '💰',
  '사회': '👥',
  '생활/문화': '🎨',
  '세계': '🌍',
  'IT/과학': '💻'
};

export default function NewsBriefingPage() {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/news.json');
      const data = await response.json();
      setNewsData(data);
    } catch (error) {
      console.error('뉴스 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleRefresh = async () => {
    const confirmed = confirm('최신 뉴스를 새로 불러올까요? (약 10초 소요)');
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch('/api/crawl-news', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        await loadNews();
        alert('✅ 최신 뉴스를 불러왔습니다!');
      } else {
        alert('❌ 뉴스 불러오기 실패: ' + result.error);
      }
    } catch (error) {
      alert('❌ 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 animate-spin text-neutral-800 mx-auto mb-4" />
          <p className="text-2xl font-bold text-neutral-900">뉴스 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-neutral-900 mb-4">뉴스 데이터가 없습니다</p>
          <Button onClick={handleRefresh} size="lg" className="bg-neutral-900 hover:bg-neutral-800">
            <RefreshCw className="w-5 h-5 mr-2" />
            뉴스 불러오기
          </Button>
        </div>
      </div>
    );
  }

  const updatedDate = new Date(newsData.updated_at);
  const categories = ['3분만에 보기', '전체', ...Object.keys(newsData.categories)];

  // 3분만에 보기: 각 카테고리에서 1개씩만 보여주기
  const get3MinArticles = () => {
    const quickRead: Article[] = [];
    Object.values(newsData.categories).forEach((articles) => {
      if (articles.length > 0) {
        quickRead.push(articles[0]); // 각 카테고리의 첫 번째 기사만
      }
    });
    return quickRead.slice(0, 6); // 최대 6개만
  };

  const displayArticles = selectedCategory === '3분만에 보기'
    ? get3MinArticles()
    : selectedCategory === '전체'
    ? newsData.all_articles
    : newsData.categories[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {updatedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {updatedDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="font-semibold">총 {newsData.total_articles}개 기사</div>
        </div>
      </div>

      {/* Masthead */}
      <div className="bg-white border-b-4 border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-neutral-900 mb-2 tracking-tight" style={{ fontFamily: '"Noto Serif KR", "Nanum Myeongjo", Georgia, serif', lineHeight: '1.1' }}>
              3분 뉴스
            </h1>
            <p className="text-sm text-neutral-600 font-semibold tracking-widest uppercase border-t-2 border-neutral-200 pt-3 mt-3 inline-block px-6">
              빠르게 읽는 오늘의 주요 뉴스
            </p>
          </div>

          <div className="text-center mt-6">
            <Button
              onClick={handleRefresh}
              className="bg-neutral-900 hover:bg-neutral-700 text-white font-bold text-sm px-6 py-2 border-none"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              최신 뉴스
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-6 py-3 text-sm font-bold whitespace-nowrap transition-all
                  ${selectedCategory === category
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                  }
                `}
              >
                {category === '3분만에 보기' ? '⚡ 3분만에 보기' : category === '전체' ? '전체' : `${categoryEmojis[category]} ${category}`}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* AI Summary */}
        {newsData.ai_summary && selectedCategory === '전체' && (
          <div className="mb-12 border-l-8 border-neutral-900 bg-neutral-100 p-8">
            <h2 className="text-3xl font-black text-neutral-900 mb-4 uppercase tracking-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              AI 요약
            </h2>
            <p className="text-neutral-900 text-lg leading-relaxed whitespace-pre-line font-medium">
              {newsData.ai_summary}
            </p>
          </div>
        )}

        {/* Featured Articles Grid */}
        {displayArticles.length === 0 ? (
          <p className="text-center text-neutral-500 py-12 text-lg font-semibold">뉴스가 없습니다</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {displayArticles.map((article, index) => (
              <article
                key={index}
                className="border-b-2 border-neutral-200 pb-8"
              >
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block bg-neutral-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    {article.press}
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-4 leading-tight hover:text-neutral-600 transition-colors cursor-pointer" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h2>

                {/* Summary */}
                {article.summary && (
                  <p className="text-base md:text-lg text-neutral-700 mb-6 leading-relaxed">
                    {article.summary}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <span className="text-sm text-neutral-500 font-semibold">
                    No. {index + 1}
                  </span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors group"
                  >
                    <span className="border-b-2 border-neutral-900 group-hover:border-neutral-600">전문 보기</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-10 border-t-4 border-neutral-900">
          <div className="text-center">
            <p className="text-sm text-neutral-600 font-bold mb-1">출처: 네이버 뉴스</p>
            <p className="text-xs text-neutral-500">매일 아침 자동으로 업데이트됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
