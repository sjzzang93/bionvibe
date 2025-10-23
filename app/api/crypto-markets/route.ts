import { NextResponse } from 'next/server';

// 타임아웃 헬퍼 함수
function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000) {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

export async function GET() {
  try {
    // 1. 업비트 원화 마켓 목록 조회
    const marketResponse = await fetchWithTimeout(
      'https://api.upbit.com/v1/market/all?isDetails=true',
      {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!marketResponse.ok) {
      throw new Error(`마켓 조회 실패: ${marketResponse.status}`);
    }

    const markets = await marketResponse.json();

    // KRW 마켓만 필터링
    const krwMarkets = markets
      .filter((m: any) => m.market.startsWith('KRW-'))
      .map((m: any) => m.market);

    if (krwMarkets.length === 0) {
      throw new Error('KRW 마켓을 찾을 수 없습니다');
    }

    // 2. 모든 KRW 마켓의 현재가 조회
    const tickerResponse = await fetchWithTimeout(
      `https://api.upbit.com/v1/ticker?markets=${krwMarkets.join(',')}`,
      {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      },
      15000 // 15초 타임아웃 (많은 데이터)
    );

    if (!tickerResponse.ok) {
      throw new Error(`시세 조회 실패: ${tickerResponse.status}`);
    }

    const tickers = await tickerResponse.json();

    // 3. 시가총액 기준 정렬 (거래대금으로 추정)
    const sortedCoins = tickers
      .map((ticker: any) => {
        const symbol = ticker.market.replace('KRW-', '');
        const marketCap = ticker.trade_price * ticker.acc_trade_volume_24h; // 시총 추정

        return {
          market: ticker.market,
          symbol: symbol,
          korean_name: getKoreanName(symbol),
          english_name: symbol,
          trade_price: ticker.trade_price,
          signed_change_rate: ticker.signed_change_rate,
          signed_change_price: ticker.signed_change_price,
          acc_trade_volume_24h: ticker.acc_trade_volume_24h,
          acc_trade_price_24h: ticker.acc_trade_price_24h,
          market_cap: marketCap,
          high_price: ticker.high_price,
          low_price: ticker.low_price,
          prev_closing_price: ticker.prev_closing_price
        };
      })
      .sort((a: any, b: any) => b.market_cap - a.market_cap); // 시총 내림차순

    // 4. Top 50만 추출
    const top50 = sortedCoins.slice(0, 50);

    return NextResponse.json({
      success: true,
      data: {
        total: sortedCoins.length,
        top50: top50,
        timestamp: new Date().toISOString()
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });

  } catch (error) {
    console.error('Crypto Markets API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '마켓 정보를 불러올 수 없습니다.'
      },
      { status: 500 }
    );
  }
}

// 한글 이름 매핑
function getKoreanName(symbol: string): string {
  const names: { [key: string]: string } = {
    'BTC': '비트코인',
    'ETH': '이더리움',
    'XRP': '리플',
    'SOL': '솔라나',
    'ADA': '에이다',
    'AVAX': '아발란체',
    'DOGE': '도지코인',
    'DOT': '폴카닷',
    'MATIC': '폴리곤',
    'SHIB': '시바이누',
    'TRX': '트론',
    'LINK': '체인링크',
    'UNI': '유니스왑',
    'ATOM': '코스모스',
    'LTC': '라이트코인',
    'BCH': '비트코인캐시',
    'ETC': '이더리움클래식',
    'NEAR': '니어프로토콜',
    'HBAR': '헤데라',
    'APT': '앱토스',
    'STX': '스택스',
    'SUI': '수이',
    'IMX': '이뮤터블엑스',
    'ARB': '아비트럼',
    'OP': '옵티미즘',
    'INJ': '인젝티브',
    'SEI': '세이',
    'PEPE': '페페',
    'WLD': '월드코인',
    'FIL': '파일코인',
    'GRT': '더그래프',
    'SAND': '샌드박스',
    'MANA': '디센트럴랜드',
    'AXS': '엑시인피니티',
    'THETA': '세타토큰',
    'ALGO': '알고랜드',
    'VET': '비체인',
    'ICP': '인터넷컴퓨터',
    'FTM': '팬텀',
    'AAVE': '에이브',
    'EOS': '이오스',
    'XLM': '스텔라루멘',
    'EGLD': '멀티버스엑스',
    'FLOW': '플로우',
    'XTZ': '테조스',
    'KLAY': '클레이튼',
    'CHZ': '칠리즈',
    'QTUM': '퀀텀',
    'ZIL': '질리카'
  };

  return names[symbol] || symbol;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
