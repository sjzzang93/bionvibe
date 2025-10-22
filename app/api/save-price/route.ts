import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 (서버용)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 타임아웃 헬퍼
function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000) {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

export async function POST() {
  try {
    // 1. 비트코인 가격 가져오기
    const btcResponse = await fetchWithTimeout(
      'https://api.upbit.com/v1/ticker?markets=KRW-BTC',
      { 
        cache: 'no-store',
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!btcResponse.ok) {
      throw new Error('비트코인 가격 조회 실패');
    }

    const btcData = await btcResponse.json();
    const bitcoin = btcData[0];

    // 2. 금 가격 가져오기
    const goldResponse = await fetchWithTimeout(
      'https://www.koreagoldx.co.kr/json/site/price_market.json',
      {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    let goldData;
    if (goldResponse.ok) {
      goldData = await goldResponse.json();
    } else {
      // 금 API 실패 시 기본값
      goldData = {
        buy_price_per_gram: 85000,
        sell_price_per_gram: 87000,
        change_rate: 0.5,
        change_price: 420
      };
    }

    // 3. 환율 가져오기
    const exchangeResponse = await fetchWithTimeout(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { 
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!exchangeResponse.ok) {
      throw new Error('환율 조회 실패');
    }

    const exchangeData = await exchangeResponse.json();
    const usdKrwRate = exchangeData.rates.KRW;

    // 4. 데이터베이스에 저장
    const { data, error } = await supabase
      .from('price_history')
      .insert({
        bitcoin_price: bitcoin.trade_price,
        bitcoin_change_24h: bitcoin.signed_change_price,
        bitcoin_change_pct: bitcoin.signed_change_rate * 100,
        gold_price: goldData.buy_price_per_gram * 3.75, // 1g → 1돈(3.75g)
        gold_change: goldData.change_price * 3.75,
        gold_change_pct: goldData.change_rate,
        usd_krw_rate: usdKrwRate,
        source: 'API',
        notes: '자동 저장'
      })
      .select();

    if (error) {
      console.error('DB 저장 실패:', error);
      throw new Error(`DB 저장 실패: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: '가격 저장 완료',
      data: {
        bitcoin_price: bitcoin.trade_price,
        gold_price: goldData.buy_price_per_gram * 3.75,
        usd_krw_rate: usdKrwRate,
        saved_at: data[0].recorded_at
      }
    });

  } catch (error) {
    console.error('Price Save Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '가격 저장 실패' 
      },
      { status: 500 }
    );
  }
}

// GET 요청 - 최근 저장된 가격 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(`DB 조회 실패: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        message: '저장된 가격 없음',
        data: null
      });
    }

    return NextResponse.json({
      success: true,
      data: data[0]
    });

  } catch (error) {
    console.error('Price Get Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '가격 조회 실패' 
      },
      { status: 500 }
    );
  }
}

