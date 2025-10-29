import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

import { invalidateAppsCache } from '@/lib/getApps';
import { getServerSupabase } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { appIds } = await request.json();

    if (!appIds || !Array.isArray(appIds) || appIds.length === 0) {
      return NextResponse.json({ success: false, message: 'appIds 배열이 필요합니다.' }, { status: 400 });
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
        '⚠️ SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. 권한 부족으로 인해 삭제가 실패할 수 있습니다.',
      );
    }

    const supabase = getServerSupabase();

    // Supabase에서 삭제
    const { data, error } = await supabase
      .from('apps')
      .delete()
      .in('id', appIds)
      .select();

    if (error) {
      console.error('Supabase 삭제 실패:', error);
      return NextResponse.json(
        { success: false, message: `Supabase 삭제 실패: ${error.message}` },
        { status: 500 },
      );
    }

    // 로컬 JSON 파일에서도 삭제
    const deleteFromLocalJson = (filePath: string) => {
      try {
        const absolutePath = path.join(process.cwd(), filePath);
        if (!fs.existsSync(absolutePath)) {
          return;
        }

        const json = fs.readFileSync(absolutePath, 'utf8');
        const parsed = JSON.parse(json);

        if (Array.isArray(parsed)) {
          const updatedList = parsed.filter((app: any) => !appIds.includes(app.id));
          fs.writeFileSync(absolutePath, JSON.stringify(updatedList, null, 2), 'utf8');
          return;
        }

        if (Array.isArray(parsed?.apps)) {
          parsed.apps = parsed.apps.filter((app: any) => !appIds.includes(app.id));
          fs.writeFileSync(absolutePath, JSON.stringify(parsed, null, 2), 'utf8');
        }
      } catch (err) {
        console.error(`파일 업데이트 실패: ${filePath}`, err);
      }
    };

    deleteFromLocalJson('data/apps.json');
    deleteFromLocalJson('public/data/apps.json');

    invalidateAppsCache();

    return NextResponse.json({
      success: true,
      message: `${appIds.length}개의 앱이 삭제되었습니다.`,
      deletedCount: data?.length || 0,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('앱 삭제 실패:', error);
    return NextResponse.json(
      { success: false, message: '앱 삭제 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
