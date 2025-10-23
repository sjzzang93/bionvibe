#!/bin/bash

echo "🤖 금 시세 크롤러 설치 스크립트"
echo "================================"

# Python 가상환경 생성
echo "📦 Python 가상환경 생성 중..."
python3 -m venv crawler_env

# 가상환경 활성화
echo "🔌 가상환경 활성화..."
source crawler_env/bin/activate

# 패키지 설치
echo "📥 필요한 패키지 설치 중..."
pip install --upgrade pip
pip install -r requirements-crawler.txt

# ChromeDriver 설치 (Mac용)
echo "🚗 ChromeDriver 설치 중..."
if ! command -v chromedriver &> /dev/null
then
    echo "ChromeDriver를 설치합니다..."
    brew install chromedriver
else
    echo "✅ ChromeDriver가 이미 설치되어 있습니다."
fi

# 실행 권한 부여
chmod +x gold_price_crawler.py

echo ""
echo "✅ 설치 완료!"
echo ""
echo "📝 사용 방법:"
echo "1. 가상환경 활성화: source crawler_env/bin/activate"
echo "2. 크롤러 실행: python gold_price_crawler.py"
echo "3. 백그라운드 실행: nohup python gold_price_crawler.py > crawler.log 2>&1 &"
echo ""

