import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  return 'unknown';
}

// GET: 포트폴리오 조회
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // 사용자 확인
    const { data: user } = await supabase
      .from('investment_users')
      .select('id')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .single();

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 포트폴리오 조회
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: portfolios || []
    });

  } catch (error) {
    console.error('Portfolio GET Error:', error);
    return NextResponse.json(
      { success: false, error: '포트폴리오 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: 자산 매수
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const body = await request.json();
    const { asset_type, quantity, buy_price, buy_amount } = body;

    // 사용자 확인
    const { data: user } = await supabase
      .from('investment_users')
      .select('*')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .single();

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 잔액 확인
    if (user.balance < buy_amount) {
      return NextResponse.json(
        { success: false, error: '잔액이 부족합니다.' },
        { status: 400 }
      );
    }

    // 포트폴리오 추가
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        asset_type,
        quantity,
        buy_price,
        buy_amount
      })
      .select()
      .single();

    if (portfolioError) throw portfolioError;

    // 잔액 차감
    const { error: balanceError } = await supabase
      .from('investment_users')
      .update({ balance: user.balance - buy_amount })
      .eq('id', user.id);

    if (balanceError) throw balanceError;

    // 거래 내역 기록
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'buy',
        asset_type,
        quantity,
        price: buy_price,
        amount: buy_amount
      });

    return NextResponse.json({
      success: true,
      data: portfolio,
      message: '매수가 완료되었습니다.'
    });

  } catch (error) {
    console.error('Portfolio POST Error:', error);
    return NextResponse.json(
      { success: false, error: '매수에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 자산 매도
export async function DELETE(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const body = await request.json();
    const { portfolio_id, sell_price } = body;

    // 사용자 확인
    const { data: user } = await supabase
      .from('investment_users')
      .select('*')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .single();

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 포트폴리오 조회
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolio_id)
      .eq('user_id', user.id)
      .single();

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: '포트폴리오를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 매도 금액 계산
    const sell_amount = Math.floor(portfolio.quantity * sell_price);
    const profit = sell_amount - portfolio.buy_amount;
    const profit_rate = (profit / portfolio.buy_amount) * 100;

    // 포트폴리오 삭제
    const { error: deleteError } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolio_id);

    if (deleteError) throw deleteError;

    // 잔액 증가
    const { error: balanceError } = await supabase
      .from('investment_users')
      .update({ balance: user.balance + sell_amount })
      .eq('id', user.id);

    if (balanceError) throw balanceError;

    // 거래 내역 기록
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'sell',
        asset_type: portfolio.asset_type,
        quantity: portfolio.quantity,
        price: sell_price,
        amount: sell_amount,
        profit,
        profit_rate
      });

    return NextResponse.json({
      success: true,
      data: {
        sell_amount,
        profit,
        profit_rate
      },
      message: `매도가 완료되었습니다. ${profit >= 0 ? '수익' : '손실'}: ${profit.toLocaleString()}원`
    });

  } catch (error) {
    console.error('Portfolio DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: '매도에 실패했습니다.' },
      { status: 500 }
    );
  }
}
