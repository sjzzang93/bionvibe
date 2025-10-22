import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 환경변수 체크
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ 환경변수 누락:', {
        url: !!supabaseUrl,
        key: !!supabaseServiceKey,
      });
      return NextResponse.json(
        { error: 'Supabase 환경변수가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { slug, imageUrl } = body;

    if (!slug || !imageUrl) {
      return NextResponse.json(
        { error: '앱 slug와 이미지 URL이 필요합니다.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Supabase에서 이미지 업데이트
    const { data, error } = await supabase
      .from('apps')
      .update({ image: imageUrl, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `이미지 업데이트 실패: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: '해당 앱을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 캐시 무효화를 위해 클라이언트에 timestamp 전달
    return NextResponse.json({
      success: true,
      message: '이미지가 Supabase에 업데이트되었습니다!',
      app: data,
      timestamp: Date.now() // 클라이언트가 캐시를 무효화할 수 있도록
    });

  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: '이미지 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
