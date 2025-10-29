import { NextRequest, NextResponse } from 'next/server';
import { invalidateAppsCache } from '@/lib/getApps';
import { getServerSupabase } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const app = await request.json();

    if (!app.id || !app.name) {
      return NextResponse.json({ success: false, message: 'id와 name이 필요합니다.' }, { status: 400 });
    }

    const supabase = getServerSupabase();

    // Supabase에 추가
    const { data, error } = await supabase
      .from('apps')
      .insert([{
        id: app.id,
        name: app.name,
        slug: app.slug || app.id,
        icon: app.icon || '📱',
        description: app.description || '',
        category_id: app.categoryId || 'others',
        url: app.url,
        image: app.image || null,
        created_at: app.createdAt || new Date().toISOString().split('T')[0],
        hidden: app.hidden || false
      }])
      .select('id, name, slug, icon, description, category_id, url, image, created_at, hidden, updated_at')
      .single();

    if (error) {
      console.error('Supabase 추가 실패:', error);
      return NextResponse.json(
        { success: false, message: `Supabase 추가 실패: ${error.message}` },
        { status: 500 },
      );
    }

    invalidateAppsCache();

    return NextResponse.json({
      success: true,
      message: '앱이 추가되었습니다.',
      app: data,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('앱 추가 실패:', error);
    return NextResponse.json(
      { success: false, message: '앱 추가 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
