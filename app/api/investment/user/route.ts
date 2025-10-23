import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// IP 주소 추출 함수
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

// GET: 사용자 정보 조회 (IP 기반)
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    const { data: user, error } = await supabase
      .from('investment_users')
      .select('*')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        data: null,
        message: '신규 사용자입니다. 닉네임을 설정해주세요.'
      });
    }

    // 마지막 로그인 시간 업데이트
    await supabase
      .from('investment_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('User GET Error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 정보를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST: 신규 사용자 생성 (닉네임 등록)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const body = await request.json();
    const { nickname } = body;

    if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 20) {
      return NextResponse.json(
        { success: false, error: '닉네임은 2~20자 사이여야 합니다.' },
        { status: 400 }
      );
    }

    // 이미 같은 IP로 가입한 사용자가 있는지 확인
    const { data: existingUser } = await supabase
      .from('investment_users')
      .select('*')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '이미 가입된 IP입니다.' },
        { status: 409 }
      );
    }

    // 닉네임 중복 확인
    const { data: nicknameCheck } = await supabase
      .from('investment_users')
      .select('id')
      .eq('nickname', nickname.trim())
      .single();

    if (nicknameCheck) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 닉네임입니다.' },
        { status: 409 }
      );
    }

    // 신규 사용자 생성 (초기 1억원)
    const { data: newUser, error } = await supabase
      .from('investment_users')
      .insert({
        nickname: nickname.trim(),
        ip_address: ip,
        balance: 100000000,
        total_rewards: 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: newUser,
      message: '환영합니다! 1억원이 지급되었습니다.'
    });

  } catch (error) {
    console.error('User POST Error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 사용자 정보 수정
export async function PATCH(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const body = await request.json();
    const { balance } = body;

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

    const { data: updatedUser, error } = await supabase
      .from('investment_users')
      .update({ balance })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    console.error('User PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 정보 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}
