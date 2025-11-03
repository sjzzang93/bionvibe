import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { appId } = await request.json();

    if (!appId) {
      return NextResponse.json(
        { success: false, message: 'appId가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 현재 hidden 상태 조회
    const { data: currentApp, error: fetchError } = await supabase
      .from('apps')
      .select('hidden')
      .eq('id', appId)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { success: false, message: '앱을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // hidden 상태 반전
    const newHiddenState = !currentApp.hidden;

    const { error: updateError } = await supabase
      .from('apps')
      .update({ hidden: newHiddenState })
      .eq('id', appId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { success: false, message: '업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      hidden: newHiddenState,
      message: newHiddenState ? '앱이 숨김 처리되었습니다.' : '앱이 표시 상태로 변경되었습니다.'
    });
  } catch (error) {
    console.error('Toggle hidden error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
