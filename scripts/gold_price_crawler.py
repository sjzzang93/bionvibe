#!/usr/bin/env python3
"""
한국금거래소 금 시세 자동 크롤러
1시간마다 실행되며 Supabase에 자동 업데이트
"""

import os
import time
import schedule
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from dotenv import load_dotenv
import requests

# 환경 변수 로드
load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

def setup_driver():
    """Selenium 드라이버 설정"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # 백그라운드 실행
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
    
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def crawl_gold_price():
    """한국금거래소에서 금 시세 크롤링"""
    driver = None
    try:
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 금 시세 크롤링 시작...")
        
        driver = setup_driver()
        
        # 구글 검색을 통해 한국금거래소 접속
        print("구글에서 한국금거래소 검색 중...")
        driver.get("https://www.google.com/search?q=한국금거래소+금시세")
        time.sleep(2)
        
        # 한국금거래소 링크 클릭
        try:
            link = driver.find_element(By.PARTIAL_LINK_TEXT, "한국금거래소")
            link.click()
            time.sleep(3)
        except:
            # 직접 접속
            print("직접 한국금거래소 접속...")
            driver.get("https://www.koreagoldx.co.kr/price/gold")
            time.sleep(3)
        
        # 페이지 로딩 대기
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # 금 시세 데이터 추출 시도
        print("금 시세 데이터 추출 중...")
        
        # 방법 1: class나 id로 찾기
        try:
            # 실제 사이트 구조에 맞게 수정 필요
            buy_element = driver.find_element(By.XPATH, "//*[contains(text(), '매입가') or contains(text(), '매수')]/../following-sibling::*")
            sell_element = driver.find_element(By.XPATH, "//*[contains(text(), '매도가') or contains(text(), '판매')]/../following-sibling::*")
            
            buy_price = extract_number(buy_element.text)
            sell_price = extract_number(sell_element.text)
            
        except Exception as e:
            print(f"방법 1 실패: {e}")
            
            # 방법 2: 페이지 소스에서 직접 추출
            page_source = driver.page_source
            
            # 숫자 패턴으로 추출 (예: 850,000 형태)
            import re
            prices = re.findall(r'(\d{3},\d{3}|\d{6,})', page_source)
            
            if len(prices) >= 2:
                # 금 시세 범위 내의 숫자만 필터링 (80만~90만원대)
                valid_prices = []
                for price in prices:
                    num = int(price.replace(',', ''))
                    if 800000 <= num <= 900000:
                        valid_prices.append(num)
                
                if len(valid_prices) >= 2:
                    buy_price = valid_prices[0]
                    sell_price = valid_prices[1]
                else:
                    raise Exception("유효한 금 시세를 찾을 수 없습니다")
            else:
                raise Exception("금 시세 데이터를 찾을 수 없습니다")
        
        print(f"✅ 크롤링 완료: 매수가 {buy_price:,}원, 매도가 {sell_price:,}원")
        
        # Supabase에 저장
        update_supabase(buy_price, sell_price)
        
        return True
        
    except Exception as e:
        print(f"❌ 크롤링 실패: {e}")
        return False
        
    finally:
        if driver:
            driver.quit()

def extract_number(text):
    """텍스트에서 숫자만 추출"""
    import re
    numbers = re.sub(r'[^0-9]', '', text)
    return int(numbers) if numbers else 0

def update_supabase(buy_price, sell_price):
    """Supabase에 금 시세 업데이트"""
    try:
        # 이전 가격 가져오기 (변동률 계산용)
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/gold_prices?select=*&order=created_at.desc&limit=1",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            }
        )
        
        prev_sell = 0
        if response.status_code == 200 and response.json():
            prev_sell = response.json()[0].get('sell_price', 0)
        
        # 변동률 계산
        change_price = sell_price - prev_sell if prev_sell > 0 else 0
        change_rate = round((change_price / prev_sell * 100), 2) if prev_sell > 0 else 0
        
        # 새 데이터 삽입
        data = {
            "buy_price": buy_price,
            "sell_price": sell_price,
            "change_rate": change_rate,
            "change_price": change_price,
            "source": "한국금거래소 (자동 크롤링)"
        }
        
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/gold_prices",
            json=data,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
        )
        
        if response.status_code in [200, 201]:
            print(f"✅ Supabase 업데이트 완료 (변동: {change_price:+,}원, {change_rate:+.2f}%)")
        else:
            print(f"❌ Supabase 업데이트 실패: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Supabase 업데이트 에러: {e}")

def job():
    """스케줄러 작업"""
    print("\n" + "="*60)
    crawl_gold_price()
    print("="*60 + "\n")
    print(f"다음 실행: 1시간 후 ({datetime.now().strftime('%H:%M:%S')})")

def main():
    """메인 실행 함수"""
    print("🤖 한국금거래소 금 시세 자동 크롤러 시작!")
    print(f"📅 시작 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("⏰ 실행 주기: 1시간마다")
    print("="*60)
    
    # 즉시 1회 실행
    job()
    
    # 1시간마다 실행 스케줄 설정
    schedule.every(1).hours.do(job)
    
    # 무한 루프
    while True:
        schedule.run_pending()
        time.sleep(60)  # 1분마다 스케줄 체크

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 크롤러를 종료합니다.")

