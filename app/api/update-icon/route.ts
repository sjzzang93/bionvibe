import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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
    const { slug, iconUrl } = body;

    if (!slug || !iconUrl) {
      return NextResponse.json(
        { error: '앱 slug와 아이콘 URL이 필요합니다.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Supabase에서 아이콘 업데이트
    const { data, error } = await supabase
      .from('apps')
      .update({ icon: iconUrl, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `아이콘 업데이트 실패: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: '해당 앱을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // apps.json도 자동 업데이트
    try {
      const appsJsonPath = path.join(process.cwd(), 'data', 'apps.json');
      const appsData = JSON.parse(fs.readFileSync(appsJsonPath, 'utf8'));

      // 해당 앱 찾아서 아이콘 업데이트
      let updated = false;
      appsData.apps = appsData.apps.map((app: any) => {
        if (app.slug === slug) {
          updated = true;
          return { ...app, icon: iconUrl };
        }
        return app;
      });

      if (updated) {
        // data/apps.json 업데이트
        fs.writeFileSync(appsJsonPath, JSON.stringify(appsData, null, 2), 'utf8');

        // public/data/apps.json도 동기화
        const publicAppsJsonPath = path.join(process.cwd(), 'public', 'data', 'apps.json');
        fs.writeFileSync(publicAppsJsonPath, JSON.stringify(appsData, null, 2), 'utf8');

        console.log(`✅ apps.json 아이콘 자동 업데이트 완료: ${slug}`);
      }
    } catch (jsonError) {
      console.error('apps.json 업데이트 오류:', jsonError);
      // JSON 업데이트 실패해도 Supabase는 성공했으므로 계속 진행
    }

    // 캐시 무효화를 위해 클라이언트에 timestamp 전달
    return NextResponse.json({
      success: true,
      message: '아이콘이 업데이트되었습니다! (Supabase + apps.json)',
      app: data,
      timestamp: Date.now() // 클라이언트가 캐시를 무효화할 수 있도록
    });

  } catch (error) {
    console.error('Error updating icon:', error);
    return NextResponse.json(
      { error: '아이콘 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
