#!/bin/bash

# 크롤러 시작 스크립트
cd "$(dirname "$0")"

echo "🤖 금 시세 크롤러 시작..."

# 가상환경 활성화
if [ -d "crawler_env" ]; then
    source crawler_env/bin/activate
else
    echo "❌ 가상환경이 없습니다. 먼저 setup_crawler.sh를 실행하세요."
    exit 1
fi

# 백그라운드 실행
nohup python gold_price_crawler.py > crawler.log 2>&1 &

echo "✅ 크롤러가 백그라운드에서 실행 중입니다."
echo "📄 로그 확인: tail -f scripts/crawler.log"
echo "🛑 중지: ps aux | grep gold_price_crawler.py 후 kill [PID]"

