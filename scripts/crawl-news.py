#!/usr/bin/env python3
"""
네이버 뉴스 크롤링 및 AI 요약 스크립트
매일 아침 최신 뉴스를 수집하고 3분 브리핑으로 요약합니다.
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import os
from dotenv import load_dotenv
from openai import OpenAI

# .env.local 파일 로드
load_dotenv('.env.local')

# 네이버 뉴스 카테고리
CATEGORIES = {
    '정치': '100',
    '경제': '101',
    '사회': '102',
    '생활/문화': '103',
    '세계': '104',
    'IT/과학': '105'
}

def crawl_naver_news(category_id, limit=5):
    """네이버 뉴스 크롤링"""
    url = f'https://news.naver.com/main/list.naver?mode=LSD&mid=shm&sid1={category_id}'

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        articles = []
        news_items = soup.select('.type06_headline li, .type06 li')[:limit]

        for item in news_items:
            link_tag = item.select_one('dt:not(.photo) a')
            if not link_tag:
                continue

            title = link_tag.get_text(strip=True)
            link = link_tag.get('href', '')

            # 본문 미리보기
            summary_tag = item.select_one('.lede')
            summary = summary_tag.get_text(strip=True) if summary_tag else ''

            # 언론사
            press_tag = item.select_one('.writing')
            press = press_tag.get_text(strip=True) if press_tag else '네이버뉴스'

            # 날짜
            date_tag = item.select_one('.date')
            date = date_tag.get_text(strip=True) if date_tag else ''

            articles.append({
                'title': title,
                'link': link,
                'summary': summary,
                'press': press,
                'date': date
            })

        return articles

    except Exception as e:
        print(f'❌ 크롤링 에러 ({category_id}): {str(e)}')
        return []

def summarize_with_ai(articles, openai_api_key):
    """OpenAI로 뉴스 요약"""
    if not openai_api_key:
        print('⚠️  OpenAI API 키가 없어 간단 요약만 제공합니다.')
        return None

    try:
        client = OpenAI(api_key=openai_api_key)

        # 뉴스 텍스트 준비
        news_text = '\n\n'.join([
            f"[{article['press']}] {article['title']}\n{article['summary']}"
            for article in articles
        ])

        # GPT 요약 요청
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {
                    'role': 'system',
                    'content': '당신은 뉴스 브리핑 전문가입니다. 주요 뉴스를 3분 안에 읽을 수 있도록 핵심만 간결하게 요약해주세요.'
                },
                {
                    'role': 'user',
                    'content': f'다음 뉴스들의 핵심 내용을 카테고리별로 3-5개 항목으로 요약해주세요:\n\n{news_text}'
                }
            ],
            temperature=0.7,
            max_tokens=500
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f'⚠️  AI 요약 에러: {str(e)}')
        return None

def main():
    print('\n📰 네이버 뉴스 크롤링 시작...\n')

    all_articles = []
    articles_by_category = {}

    # 각 카테고리별로 크롤링
    for category_name, category_id in CATEGORIES.items():
        print(f'🔍 {category_name} 뉴스 수집 중...')
        articles = crawl_naver_news(category_id, limit=5)

        if articles:
            articles_by_category[category_name] = articles
            all_articles.extend(articles)
            print(f'   ✅ {len(articles)}개 기사 수집 완료')
        else:
            print(f'   ⚠️  수집 실패')

    print(f'\n📊 총 {len(all_articles)}개 기사 수집 완료\n')

    # OpenAI API 키 확인
    openai_api_key = os.getenv('OPENAI_API_KEY')

    # AI 요약
    print('🤖 AI 요약 생성 중...')
    ai_summary = summarize_with_ai(all_articles, openai_api_key)

    if ai_summary:
        print('   ✅ AI 요약 완료')

    # JSON 저장
    news_data = {
        'updated_at': datetime.now().isoformat(),
        'total_articles': len(all_articles),
        'ai_summary': ai_summary,
        'categories': articles_by_category,
        'all_articles': all_articles[:20]  # 상위 20개만 저장
    }

    output_path = 'public/data/news.json'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)

    print(f'\n✅ 뉴스 데이터 저장 완료: {output_path}')
    print(f'📅 업데이트 시간: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print('\n' + '='*50 + '\n')

if __name__ == '__main__':
    main()
