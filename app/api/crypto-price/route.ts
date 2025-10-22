import { NextRequest, NextResponse } from 'next/server';

// 타임아웃을 위한 헬퍼 함수
function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000) {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || 'BTC';

    // 1. 실시간 환율 조회
    const exchangeResponse = await fetchWithTimeout(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { 
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      }
    );
    
    if (!exchangeResponse.ok) {
      console.error('환율 조회 실패:', exchangeResponse.status, exchangeResponse.statusText);
      throw new Error(`환율 조회 실패: ${exchangeResponse.status}`);
    }
    
    const exchangeData = await exchangeResponse.json();
    const currentRate = exchangeData.rates.KRW;

    // 2. 업비트 API - 한국 시장 가격
    const upbitMarket = symbol === 'BTC' ? 'KRW-BTC' : 
                       symbol === 'ETH' ? 'KRW-ETH' :
                       symbol === 'XRP' ? 'KRW-XRP' :
                       symbol === 'SOL' ? 'KRW-SOL' :
                       'KRW-ADA';
    
    const upbitResponse = await fetchWithTimeout(
      `https://api.upbit.com/v1/ticker?markets=${upbitMarket}`,
      { 
        cache: 'no-store',
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!upbitResponse.ok) {
      console.error('업비트 API 조회 실패:', upbitResponse.status, upbitResponse.statusText);
      throw new Error(`업비트 API 조회 실패: ${upbitResponse.status}`);
    }

    const upbitData = await upbitResponse.json();

    // 응답 데이터 구성 (CORS 헤더 추가)
    return NextResponse.json(
      {
        success: true,
        data: {
          exchangeRate: currentRate,
          upbit: upbitData[0],
          timestamp: new Date().toISOString()
        }
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
        }
      }
    );

  } catch (error) {
    console.error('Crypto API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '가격 정보를 불러오는데 실패했습니다.' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}

// OPTIONS 메서드 처리 (CORS Preflight)
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
