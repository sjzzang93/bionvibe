import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { appId, imageUrl } = await request.json();

    if (!appId || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'appId와 imageUrl이 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 이미지 URL 업데이트
    const { error } = await supabase
      .from('apps')
      .update({ image: imageUrl })
      .eq('id', appId);

    if (error) {
      console.error('Update image error:', error);
      return NextResponse.json(
        { success: false, message: '이미지 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '이미지가 성공적으로 업데이트되었습니다!'
    });
  } catch (error) {
    console.error('Update image error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
