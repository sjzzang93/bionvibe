import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: 가격 히스토리 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const asset_type = searchParams.get('asset_type'); // 'bitcoin' or 'gold' or null (all)
    const days = parseInt(searchParams.get('days') || '30'); // 기본 30일

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from('price_history')
      .select('*')
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (asset_type) {
      query = query.eq('asset_type', asset_type);
    }

    const { data: history, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: history || []
    });

  } catch (error) {
    console.error('Price History GET Error:', error);
    return NextResponse.json(
      { success: false, error: '가격 히스토리 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: 현재 가격 저장 (스케줄러용)
export async function POST(request: NextRequest) {
  try {
    // 인증 확인 (간단한 API 키 체크)
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.CRON_SECRET || 'default-secret';

    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { success: false, error: '인증 실패' },
        { status: 401 }
      );
    }

    // 1. 비트코인 현재가 가져오기
    const btcResponse = await fetch('/api/crypto-price?symbol=BTC');
    const btcData = await btcResponse.json();

    if (btcData.success) {
      const btcPrice = btcData.data.upbit.trade_price;
      const btcChange = btcData.data.upbit.signed_change_rate * 100;
      const btcChangePrice = btcData.data.upbit.signed_change_price;

      await supabase
        .from('price_history')
        .insert({
          asset_type: 'bitcoin',
          price: btcPrice,
          change_rate: btcChange,
          change_price: btcChangePrice,
          volume: btcData.data.upbit.acc_trade_volume_24h || 0
        });
    }

    // 2. 금 현재가 가져오기
    const goldResponse = await fetch('/api/gold-price');
    const goldData = await goldResponse.json();

    if (goldData.success) {
      const goldPrice = goldData.data.buy; // 이미 한돈(3.75g) 기준
      const goldChange = goldData.data.change;
      const goldChangePrice = goldData.data.changePrice; // 이미 한돈(3.75g) 기준

      await supabase
        .from('price_history')
        .insert({
          asset_type: 'gold',
          price: goldPrice,
          change_rate: goldChange,
          change_price: goldChangePrice
        });
    }

    return NextResponse.json({
      success: true,
      message: '가격 히스토리 저장 완료'
    });

  } catch (error) {
    console.error('Price History POST Error:', error);
    return NextResponse.json(
      { success: false, error: '가격 저장 실패' },
      { status: 500 }
    );
  }
}
