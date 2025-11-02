import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

type Article = { title: string; link: string; summary: string; press: string };
type NewsData = {
  updated_at: string;
  total_articles: number;
  ai_summary: string | null;
  categories: Record<string, Article[]>;
  all_articles: Article[];
};

const CATEGORIES: Record<string, string> = {
  '정치': '100',
  '경제': '101',
  '사회': '102',
  '생활/문화': '103',
  '세계': '104',
  'IT/과학': '105',
};

async function crawlCategory(categoryId: string, limit = 5): Promise<Article[]> {
  const url = `https://news.naver.com/main/list.naver?mode=LSD&mid=shm&sid1=${categoryId}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // 인코딩 감지 및 디코딩 (네이버 일부 페이지는 EUC-KR)
  const contentType = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  const isEucKr = /euc-?kr|cp949/i.test(contentType) || /<meta[^>]+charset=["']?(euc-?kr|cp949)/i.test(buf.toString('ascii'));
  const html = isEucKr ? iconv.decode(buf, 'EUC-KR') : buf.toString('utf-8');
  const $ = cheerio.load(html);

  const items: Article[] = [];
  $('.type06_headline li, .type06 li').slice(0, limit).each((_, li) => {
    const $li = $(li);
    const linkTag = $li.find('dt:not(.photo) a').first();
    if (!linkTag || linkTag.length === 0) return;
    const title = (linkTag.text() || '').trim();
    const link = linkTag.attr('href') || '';
    const summary = ($li.find('.lede').text() || '').trim();
    const press = ($li.find('.writing').text() || '네이버뉴스').trim();
    if (title && link) items.push({ title, link, summary, press });
  });
  return items;
}

async function crawlAll(): Promise<NewsData> {
  const allArticles: Article[] = [];
  const byCategory: Record<string, Article[]> = {};

  for (const [name, id] of Object.entries(CATEGORIES)) {
    const list = await crawlCategory(id, 5);
    byCategory[name] = list;
    allArticles.push(...list);
  }

  return {
    updated_at: new Date().toISOString(),
    total_articles: allArticles.length,
    ai_summary: null,
    categories: byCategory,
    all_articles: allArticles.slice(0, 20),
  };
}

export async function POST() {
  try {
    const news = await crawlAll();

    // 로컬 개발 환경에서는 파일로도 저장 (배포 환경은 읽기 전용이므로 미저장)
    if (process.env.VERCEL !== '1') {
      const fs = await import('fs');
      const path = await import('path');
      const outputPath = path.join(process.cwd(), 'public', 'data', 'news.json');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(news, null, 2), 'utf-8');
    }

    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error('❌ 크롤링 실패:', error);
    return NextResponse.json({ success: false, error: 'crawl-failed' }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
