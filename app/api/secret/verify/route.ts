import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // 환경변수에서 비밀번호 가져오기 (없으면 기본값)
    const correctPassword = process.env.SECRET_VAULT_PASSWORD || '123!8314';
    
    if (password === correctPassword) {
      // 성공 시 간단한 토큰 생성 (timestamp + hash)
      const token = Buffer.from(
        `${Date.now()}-${Math.random().toString(36)}`
      ).toString('base64');
      
      return NextResponse.json({
        success: true,
        token,
        message: '인증 성공'
      });
    } else {
      return NextResponse.json(
        { success: false, message: '비밀번호가 틀렸습니다' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

