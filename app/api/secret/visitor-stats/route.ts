import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Supabase 클라이언트 생성 함수 (런타임에만 실행)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // 통계 뷰에서 전체 통계 가져오기
    const { data: stats, error: statsError } = await supabase
      .from('secret_visitor_stats')
      .select('*')
      .single();

    if (statsError) throw statsError;

    // 최근 7일 일별 방문자 수
    const { data: recentVisitors, error: recentError } = await supabase
      .from('secret_visitors')
      .select('last_visit, visit_count')
      .gte('last_visit', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('last_visit', { ascending: false });

    if (recentError) throw recentError;

    // 일별로 그룹화
    const dailyStats: Record<string, { unique: number; total: number }> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // 초기화
    last7Days.forEach(date => {
      dailyStats[date] = { unique: 0, total: 0 };
    });

    // 데이터 집계
    const processedIPs = new Set<string>();
    recentVisitors?.forEach(visitor => {
      const date = new Date(visitor.last_visit).toISOString().split('T')[0];
      if (dailyStats[date]) {
        dailyStats[date].total += visitor.visit_count;
        const ipKey = `${date}-${visitor.last_visit}`;
        if (!processedIPs.has(ipKey)) {
          dailyStats[date].unique += 1;
          processedIPs.add(ipKey);
        }
      }
    });

    // 상위 국가 통계
    const { data: countryStats, error: countryError } = await supabase
      .from('secret_visitors')
      .select('country')
      .not('country', 'is', null);

    if (countryError) throw countryError;

    const countryCounts: Record<string, number> = {};
    countryStats?.forEach(row => {
      if (row.country) {
        countryCounts[row.country] = (countryCounts[row.country] || 0) + 1;
      }
    });

    const topCountries = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUniqueVisitors: stats?.total_unique_visitors || 0,
        totalVisits: stats?.total_visits || 0,
        todayVisitors: stats?.today_visitors || 0,
        weekVisitors: stats?.week_visitors || 0,
        monthVisitors: stats?.month_visitors || 0,
        lastVisitorTime: stats?.last_visitor_time || null,
      },
      dailyStats: last7Days.map(date => ({
        date,
        unique: dailyStats[date].unique,
        total: dailyStats[date].total,
      })),
      topCountries,
    });
  } catch (error) {
    console.error('Visitor stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch visitor stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
