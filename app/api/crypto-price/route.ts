import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || 'BTC';

    // 1. 실시간 환율 조회
    const exchangeResponse = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { next: { revalidate: 30 } } // 30초 캐시
    );
    
    if (!exchangeResponse.ok) {
      throw new Error('환율 조회 실패');
    }
    
    const exchangeData = await exchangeResponse.json();
    const currentRate = exchangeData.rates.KRW;

    // 2. 업비트 API - 한국 시장 가격
    const upbitMarket = symbol === 'BTC' ? 'KRW-BTC' : 
                       symbol === 'ETH' ? 'KRW-ETH' :
                       symbol === 'XRP' ? 'KRW-XRP' :
                       symbol === 'SOL' ? 'KRW-SOL' :
                       'KRW-ADA';
    
    const upbitResponse = await fetch(
      `https://api.upbit.com/v1/ticker?markets=${upbitMarket}`,
      { next: { revalidate: 10 } } // 10초 캐시
    );

    if (!upbitResponse.ok) {
      throw new Error('업비트 API 조회 실패');
    }

    const upbitData = await upbitResponse.json();

    // 3. 바이낸스 API - 글로벌 시장 가격
    const binanceSymbol = `${symbol}USDT`;
    const binanceResponse = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
      { next: { revalidate: 10 } } // 10초 캐시
    );

    if (!binanceResponse.ok) {
      throw new Error('바이낸스 API 조회 실패');
    }

    const binanceData = await binanceResponse.json();

    // 응답 데이터 구성
    return NextResponse.json({
      success: true,
      data: {
        exchangeRate: currentRate,
        upbit: upbitData[0],
        binance: binanceData,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Crypto API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '가격 정보를 불러오는데 실패했습니다.' 
      },
      { status: 500 }
    );
  }
}

