import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '7'; // 기본 7일
    const days = parseInt(period);

    // 기간별 데이터 조회
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: true });

    if (error) {
      throw new Error(`DB 조회 실패: ${error.message}`);
    }

    if (!data || data.length < 2) {
      return NextResponse.json({
        success: false,
        error: '데이터가 부족합니다. 최소 2개의 기록이 필요합니다.'
      });
    }

    // 첫 번째와 마지막 데이터
    const firstRecord = data[0];
    const lastRecord = data[data.length - 1];

    // 비트코인 상승률
    const bitcoinReturn = {
      startPrice: firstRecord.bitcoin_price,
      endPrice: lastRecord.bitcoin_price,
      change: lastRecord.bitcoin_price - firstRecord.bitcoin_price,
      changePercent: ((lastRecord.bitcoin_price - firstRecord.bitcoin_price) / firstRecord.bitcoin_price) * 100,
      days: days
    };

    // 금 상승률
    const goldReturn = {
      startPrice: firstRecord.gold_price,
      endPrice: lastRecord.gold_price,
      change: lastRecord.gold_price - firstRecord.gold_price,
      changePercent: ((lastRecord.gold_price - firstRecord.gold_price) / firstRecord.gold_price) * 100,
      days: days
    };

    // 일별 평균 계산 (차트용)
    const dailyData: { [key: string]: { bitcoin: number[], gold: number[], count: number } } = {};
    
    data.forEach(record => {
      const date = new Date(record.recorded_at).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { bitcoin: [], gold: [], count: 0 };
      }
      dailyData[date].bitcoin.push(parseFloat(record.bitcoin_price));
      dailyData[date].gold.push(parseFloat(record.gold_price));
      dailyData[date].count++;
    });

    const chartData = Object.keys(dailyData).map(date => ({
      date,
      bitcoin_avg: dailyData[date].bitcoin.reduce((a, b) => a + b, 0) / dailyData[date].count,
      gold_avg: dailyData[date].gold.reduce((a, b) => a + b, 0) / dailyData[date].count,
      records_count: dailyData[date].count
    }));

    // 승자 결정
    const winner = bitcoinReturn.changePercent > goldReturn.changePercent ? 'bitcoin' : 'gold';
    const gap = Math.abs(bitcoinReturn.changePercent - goldReturn.changePercent);

    return NextResponse.json({
      success: true,
      data: {
        period: {
          days: days,
          start_date: firstRecord.recorded_at,
          end_date: lastRecord.recorded_at,
          total_records: data.length
        },
        bitcoin: bitcoinReturn,
        gold: goldReturn,
        comparison: {
          winner,
          gap: gap.toFixed(2),
          message: winner === 'bitcoin' 
            ? `비트코인이 ${gap.toFixed(2)}%p 더 상승했습니다`
            : `순금이 ${gap.toFixed(2)}%p 더 상승했습니다`
        },
        chart: chartData
      }
    });

  } catch (error) {
    console.error('Price Analysis Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '분석 실패' 
      },
      { status: 500 }
    );
  }
}

