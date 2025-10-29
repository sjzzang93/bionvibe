import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const app = await request.json();

    if (!app.id) {
      return NextResponse.json({ success: false, message: 'App ID가 필요합니다.' }, { status: 400 });
    }

    const supabase = getServerSupabase();

    // Supabase 업데이트
    const { data, error } = await supabase
      .from('apps')
      .update({
        name: app.name,
        slug: app.slug || app.id,
        icon: app.icon || '📱',
        description: app.description || '',
        category_id: app.categoryId || 'others',
        url: app.url,
        image: app.image || null,
        hidden: app.hidden || false
      })
      .eq('id', app.id)
      .select('id, name, slug, icon, description, category_id, url, image, created_at, hidden, updated_at')
      .single();

    if (error) {
      console.error('Supabase 업데이트 실패:', error);
      return NextResponse.json(
        { success: false, message: `Supabase 업데이트 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '앱이 업데이트되었습니다.',
      app: data,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('앱 업데이트 중 오류:', error);
    return NextResponse.json(
      { success: false, message: error?.message || '앱 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
