import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 한국금거래소 API 호출
    const response = await fetch('https://www.koreagoldx.co.kr/json/site/price_market.json', {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`금 가격 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    
    // 실시간 금 시세 (1g 기준)
    const goldPrice = {
      buy: data.buy_price_per_gram || 0,     // 살 때 (매수가)
      sell: data.sell_price_per_gram || 0,   // 팔 때 (매도가)
      change: data.change_rate || 0,          // 변동률
      changePrice: data.change_price || 0,    // 변동가
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(
      {
        success: true,
        data: goldPrice
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      }
    );

  } catch (error) {
    console.error('Gold Price API Error:', error);
    
    // 실패 시 더미 데이터 반환
    return NextResponse.json(
      {
        success: true,
        data: {
          buy: 85000,
          sell: 87000,
          change: 0.5,
          changePrice: 420,
          timestamp: new Date().toISOString(),
          note: 'API 연결 실패로 예시 데이터 표시'
        }
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
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

