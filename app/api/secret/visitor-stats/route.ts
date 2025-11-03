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

    // 통계 뷰에서 전체 통계 가져오기 (뷰가 없으면 직접 계산)
    const { data: stats, error: statsError } = await supabase
      .from('secret_visitor_stats')
      .select('*')
      .single();

    // 뷰가 없거나 에러가 발생하면 직접 계산
    let calculatedStats = null;
    if (statsError) {
      console.log('Stats view not available, calculating manually:', statsError.message);

      // 직접 통계 계산
      const { data: allVisitors, error: visitorsError } = await supabase
        .from('secret_visitors')
        .select('ip_address, visit_count, last_visit, country');

      if (visitorsError) {
        console.error('Failed to fetch visitors:', visitorsError);
        throw new Error('Failed to fetch visitor data');
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      let todayVisitors = 0;
      let weekVisitors = 0;
      let monthVisitors = 0;
      let totalVisits = 0;
      let lastVisitorTime: string | null = null;

      allVisitors?.forEach(visitor => {
        const visitDate = new Date(visitor.last_visit);
        totalVisits += visitor.visit_count || 1;

        if (!lastVisitorTime || visitDate > new Date(lastVisitorTime)) {
          lastVisitorTime = visitor.last_visit;
        }

        if (visitDate >= today) {
          todayVisitors++;
        }
        if (visitDate >= weekAgo) {
          weekVisitors++;
        }
        if (visitDate >= monthAgo) {
          monthVisitors++;
        }
      });

      calculatedStats = {
        total_unique_visitors: allVisitors?.length || 0,
        total_visits: totalVisits,
        today_visitors: todayVisitors,
        week_visitors: weekVisitors,
        month_visitors: monthVisitors,
        last_visitor_time: lastVisitorTime,
      };
    }

    // 최근 7일 일별 방문자 수
    const { data: recentVisitors, error: recentError } = await supabase
      .from('secret_visitors')
      .select('ip_address, last_visit, visit_count')
      .gte('last_visit', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('last_visit', { ascending: false });

    if (recentError) throw recentError;

    // 일별로 그룹화 (IP당 1회만 카운팅)
    const dailyStats: Record<string, { unique: Set<string>; total: number }> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // 초기화
    last7Days.forEach(date => {
      dailyStats[date] = { unique: new Set<string>(), total: 0 };
    });

    // 데이터 집계 (각 날짜별로 IP당 1회만 카운팅)
    recentVisitors?.forEach(visitor => {
      const date = new Date(visitor.last_visit).toISOString().split('T')[0];
      if (dailyStats[date] && visitor.ip_address) {
        // IP별로 1회만 카운팅 (유니크)
        dailyStats[date].unique.add(visitor.ip_address);
        // 총 방문 횟수
        dailyStats[date].total += visitor.visit_count || 1;
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

    // 뷰 데이터 또는 계산된 데이터 사용
    const finalStats = calculatedStats || stats;

    return NextResponse.json({
      success: true,
      stats: {
        totalUniqueVisitors: finalStats?.total_unique_visitors || 0,
        totalVisits: finalStats?.total_visits || 0,
        todayVisitors: finalStats?.today_visitors || 0,
        weekVisitors: finalStats?.week_visitors || 0,
        monthVisitors: finalStats?.month_visitors || 0,
        lastVisitorTime: finalStats?.last_visitor_time || null,
      },
      dailyStats: last7Days.map(date => ({
        date,
        unique: dailyStats[date].unique.size, // Set의 크기 = 유니크 IP 수
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
