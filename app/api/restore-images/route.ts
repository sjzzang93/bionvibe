import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase 환경변수가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // apps.json 읽기
    const appsJsonPath = path.join(process.cwd(), 'data', 'apps.json');
    const appsData = JSON.parse(fs.readFileSync(appsJsonPath, 'utf8'));

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // 모든 앱의 이미지를 Supabase에 복원
    for (const app of appsData.apps) {
      if (app.image) {
        try {
          const { error } = await supabase
            .from('apps')
            .update({
              image: app.image,
              updated_at: new Date().toISOString()
            })
            .eq('slug', app.slug);

          if (error) {
            console.error(`❌ ${app.slug} 복원 실패:`, error);
            failCount++;
            errors.push(`${app.name} (${app.slug}): ${error.message}`);
          } else {
            console.log(`✅ ${app.slug} 복원 성공`);
            successCount++;
          }
        } catch (err) {
          console.error(`❌ ${app.slug} 복원 오류:`, err);
          failCount++;
          errors.push(`${app.name} (${app.slug}): ${err}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `이미지 복원 완료: 성공 ${successCount}개, 실패 ${failCount}개`,
      successCount,
      failCount,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('Error restoring images:', error);
    return NextResponse.json(
      { error: '이미지 복원 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
