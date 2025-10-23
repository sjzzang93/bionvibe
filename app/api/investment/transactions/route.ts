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

// GET: 거래 내역 조회
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

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

    // 거래 내역 조회
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: transactions || []
    });

  } catch (error) {
    console.error('Transactions GET Error:', error);
    return NextResponse.json(
      { success: false, error: '거래 내역 조회 실패' },
      { status: 500 }
    );
  }
}
