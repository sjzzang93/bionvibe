import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 오늘 날짜 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // 이번 주 시작일 계산 (월요일)
    const weekStart = new Date(today);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    const weekStartISO = weekStart.toISOString();

    // 1. 오늘 추가된 앱 수
    const { count: todayAppsCount } = await supabase
      .from('apps')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayISO);

    // 2. 이번 주 방문자 수
    const { count: weekVisitorsCount } = await supabase
      .from('secret_visits')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', weekStartISO);

    // 3. 전체 앱 통계
    const { data: allApps } = await supabase
      .from('apps')
      .select('id, name, hidden, created_at')
      .order('created_at', { ascending: false });

    // 4. 최근 문의 수 (7일 이내)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: recentContactsCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    // 5. 인기 앱 Top 5 (방문자 데이터가 있다면)
    // 일단은 최근 생성된 앱으로 대체
    const topApps = allApps?.slice(0, 5) || [];

    return NextResponse.json({
      success: true,
      data: {
        todayApps: todayAppsCount || 0,
        weekVisitors: weekVisitorsCount || 0,
        recentContacts: recentContactsCount || 0,
        topApps: topApps.map(app => ({
          id: app.id,
          name: app.name,
          hidden: app.hidden
        })),
        stats: {
          totalApps: allApps?.length || 0,
          hiddenApps: allApps?.filter(app => app.hidden).length || 0,
          visibleApps: allApps?.filter(app => !app.hidden).length || 0
        }
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { success: false, message: '대시보드 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
