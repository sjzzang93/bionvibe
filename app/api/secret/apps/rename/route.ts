import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

import { invalidateAppsCache } from '@/lib/getApps';
import { getServerSupabase } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { appId, newName } = await request.json();

    if (!appId || typeof appId !== 'string') {
      return NextResponse.json({ success: false, message: 'appId가 필요합니다.' }, { status: 400 });
    }

    const trimmedName = typeof newName === 'string' ? newName.trim() : '';
    if (!trimmedName) {
      return NextResponse.json({ success: false, message: '새 이름을 입력해주세요.' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('NEXT_PUBLIC_SUPABASE_URL 환경변수가 필요합니다.');
      return NextResponse.json(
        { success: false, message: 'Supabase URL이 설정되지 않았습니다.' },
        { status: 500 },
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn(
        '⚠️ SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. 권한 부족으로 인해 업데이트가 실패할 수 있습니다.',
      );
    }

    const supabase = getServerSupabase();
    const updatedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from('apps')
      .update({ name: trimmedName, updated_at: updatedAt })
      .eq('id', appId)
      .select()
      .single();

    if (error) {
      console.error('Supabase 업데이트 실패:', error);
      return NextResponse.json(
        { success: false, message: `Supabase 업데이트 실패: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ success: false, message: '해당 앱을 찾을 수 없습니다.' }, { status: 404 });
    }

    const updateLocalJson = (filePath: string) => {
      const absolutePath = path.join(process.cwd(), filePath);
      const json = fs.readFileSync(absolutePath, 'utf8');
      const parsed = JSON.parse(json);

      if (Array.isArray(parsed)) {
        const updatedList = parsed.map((app: any) =>
          app.id === appId ? { ...app, name: trimmedName } : app,
        );
        fs.writeFileSync(absolutePath, JSON.stringify(updatedList, null, 2), 'utf8');
        return;
      }

      if (Array.isArray(parsed?.apps)) {
        parsed.apps = parsed.apps.map((app: any) =>
          app.id === appId ? { ...app, name: trimmedName } : app,
        );
        fs.writeFileSync(absolutePath, JSON.stringify(parsed, null, 2), 'utf8');
      }
    };

    try {
      updateLocalJson('data/apps.json');
      updateLocalJson('public/data/apps.json');
    } catch (jsonError) {
      console.error('apps.json 업데이트 실패:', jsonError);
      // JSON 업데이트 실패해도 계속 진행
    }

    invalidateAppsCache();

    return NextResponse.json({
      success: true,
      message: '앱 이름이 업데이트되었습니다.',
      app: { ...data, name: trimmedName, updated_at: updatedAt },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('비밀 앱 이름 변경 실패:', error);
    return NextResponse.json(
      { success: false, message: '앱 이름 변경 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
