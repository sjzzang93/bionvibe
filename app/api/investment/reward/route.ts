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

// POST: 리워드 지급 (다른 웹앱 이용)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const body = await request.json();
    const { app_name } = body;

    if (!app_name) {
      return NextResponse.json(
        { success: false, error: '앱 이름이 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자 확인
    const { data: user } = await supabase
      .from('investment_users')
      .select('*')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .single();

    if (!user) {
      return NextResponse.json(
        { success: false, error: '투자 앱에 먼저 가입해주세요.' },
        { status: 404 }
      );
    }

    // 오늘 해당 앱으로 이미 리워드를 받았는지 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existingReward } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', user.id)
      .eq('app_name', app_name)
      .gte('created_at', today.toISOString())
      .single();

    if (existingReward) {
      return NextResponse.json(
        { success: false, error: '오늘 이미 이 앱으로 리워드를 받았습니다.' },
        { status: 409 }
      );
    }

    const REWARD_AMOUNT = 500000; // 50만원

    // 리워드 지급 (하루 제한 없음)
    const { error: rewardError } = await supabase
      .from('rewards')
      .insert({
        user_id: user.id,
        app_name,
        reward_amount: REWARD_AMOUNT
      });

    if (rewardError) throw rewardError;

    // 잔액 증가 & 누적 리워드 증가
    const { error: balanceError } = await supabase
      .from('investment_users')
      .update({
        balance: user.balance + REWARD_AMOUNT,
        total_rewards: user.total_rewards + REWARD_AMOUNT
      })
      .eq('id', user.id);

    if (balanceError) throw balanceError;

    return NextResponse.json({
      success: true,
      data: {
        reward_amount: REWARD_AMOUNT,
        new_balance: user.balance + REWARD_AMOUNT
      },
      message: `${app_name} 이용 보상 50만원이 지급되었습니다!`
    });

  } catch (error) {
    console.error('Reward POST Error:', error);
    return NextResponse.json(
      { success: false, error: '리워드 지급에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 리워드 내역 조회
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

    // 리워드 내역 조회
    const { data: rewards, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: rewards || []
    });

  } catch (error) {
    console.error('Reward GET Error:', error);
    return NextResponse.json(
      { success: false, error: '리워드 내역 조회 실패' },
      { status: 500 }
    );
  }
}
