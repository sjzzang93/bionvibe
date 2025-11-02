import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { appId } = await request.json();

    if (!appId) {
      return NextResponse.json({ error: 'appId is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 조회수 증가 (없으면 생성)
    const { data: existing } = await supabase
      .from('app_views')
      .select('*')
      .eq('app_id', appId)
      .single();

    if (existing) {
      // 기존 레코드 업데이트
      const { error } = await supabase
        .from('app_views')
        .update({
          view_count: existing.view_count + 1,
          last_updated: new Date().toISOString()
        })
        .eq('app_id', appId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        viewCount: existing.view_count + 1
      });
    } else {
      // 새 레코드 생성
      const { error } = await supabase
        .from('app_views')
        .insert([{
          app_id: appId,
          view_count: 1,
          last_updated: new Date().toISOString()
        }]);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        viewCount: 1
      });
    }

  } catch (error: any) {
    console.error('Error tracking view:', error);
    return NextResponse.json({
      error: error.message || 'Failed to track view'
    }, { status: 500 });
  }
}

// 조회수 가져오기
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 모든 앱 조회수 가져오기
    const { data, error } = await supabase
      .from('app_views')
      .select('*')
      .order('view_count', { ascending: false });

    // 테이블/컬럼 부재 등 에러가 있어도 프론트가 깨지지 않도록 200 + 빈 값 반환
    if (error) {
      console.warn('Error fetching views (soft-fail):', error);
      return NextResponse.json({
        data: [],
        stats: { todayActivity: 0, totalViews: 0 }
      });
    }

    // 통계 계산
    const totalViews = data?.reduce((sum, app) => sum + (app.view_count || 0), 0) || 0;

    // 오늘 날짜 (KST 기준)
    const today = new Date();
    today.setHours(today.getHours() + 9); // KST
    const todayStr = today.toISOString().split('T')[0];

    // 오늘 업데이트된 앱 수
    const todayActivity = data?.filter(app => {
      if (!app.last_updated) return false;
      const updatedDate = new Date(app.last_updated);
      updatedDate.setHours(updatedDate.getHours() + 9); // KST
      return updatedDate.toISOString().split('T')[0] === todayStr;
    }).length || 0;

    return NextResponse.json({
      data,
      stats: {
        todayActivity, // 오늘 활동한 앱 수
        totalViews,    // 누적 총 조회수
      }
    });

  } catch (error: any) {
    console.error('Error fetching views:', error);
    return NextResponse.json({
      error: error.message || 'Failed to fetch views'
    }, { status: 500 });
  }
}
