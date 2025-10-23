#!/bin/bash

echo "🛑 금 시세 크롤러 중지 중..."

# 프로세스 찾기
PID=$(ps aux | grep gold_price_crawler.py | grep -v grep | awk '{print $2}')

if [ -z "$PID" ]; then
    echo "❌ 실행 중인 크롤러가 없습니다."
else
    kill $PID
    echo "✅ 크롤러를 중지했습니다. (PID: $PID)"
fi

