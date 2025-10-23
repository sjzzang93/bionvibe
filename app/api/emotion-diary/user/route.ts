import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 사용자 정보 조회
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('emotion_diary_user_id')?.value;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: '로그인이 필요합니다.'
      }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('emotion_diary_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({
      success: false,
      error: '사용자 조회 실패'
    }, { status: 500 });
  }
}

// 사용자 등록/로그인
export async function POST(request: NextRequest) {
  try {
    const { nickname } = await request.json();

    if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 20) {
      return NextResponse.json({
        success: false,
        error: '닉네임은 2~20자 사이여야 합니다.'
      }, { status: 400 });
    }

    // 닉네임으로 사용자 찾기
    const { data: existingUser } = await supabase
      .from('emotion_diary_users')
      .select('*')
      .eq('nickname', nickname.trim())
      .single();

    let userData;
    if (existingUser) {
      // 기존 사용자 로그인
      userData = existingUser;
    } else {
      // 새 사용자 생성
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { data, error } = await supabase
        .from('emotion_diary_users')
        .insert([{
          user_id: userId,
          nickname: nickname.trim()
        }])
        .select()
        .single();

      if (error) {
        console.error('User creation error:', error);
        return NextResponse.json({
          success: false,
          error: '사용자 생성 실패'
        }, { status: 500 });
      }

      userData = data;
    }

    // 쿠키 설정 (30일)
    const response = NextResponse.json({
      success: true,
      data: userData,
      message: existingUser ? '로그인 성공!' : '가입 완료! 환영합니다 🎉'
    });

    response.cookies.set('emotion_diary_user_id', userData.user_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30일
    });

    return response;
  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 로그아웃
export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: '로그아웃 성공'
    });

    response.cookies.delete('emotion_diary_user_id');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      error: '로그아웃 실패'
    }, { status: 500 });
  }
}
