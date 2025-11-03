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

// Helper function to parse user agent
function parseUserAgent(userAgent: string | null) {
  if (!userAgent) {
    return { browser: "Unknown", os: "Unknown", deviceType: "Unknown" };
  }

  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "Desktop";

  // Detect browser (specific first)
  if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
  else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";

  // Detect OS
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

  // Detect device type
  if (userAgent.includes("Mobile") || (userAgent.includes("Android") && !userAgent.includes("Tablet"))) deviceType = "Mobile";
  else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) deviceType = "Tablet";

  return { browser, os, deviceType };
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // 모든 방문자 데이터 가져오기
    const { data: allVisitors, error: visitorsError } = await supabase
      .from('secret_visitors')
      .select('*')
      .order('last_visit', { ascending: false });

    if (visitorsError) {
      console.error('Failed to fetch visitors:', visitorsError);

      // 테이블이 없는 경우 빈 데이터 반환
      if (visitorsError.code === 'PGRST116' || visitorsError.message.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          stats: {
            totalUniqueVisitors: 0,
            totalVisits: 0,
            todayVisitors: 0,
            weekVisitors: 0,
            monthVisitors: 0,
            newVisitors: 0,
            returningVisitors: 0,
            avgVisitsPerUser: 0,
            lastVisitorTime: null,
          },
          dailyStats: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
              date: date.toISOString().split('T')[0],
              unique: 0,
              total: 0,
            };
          }),
          browserStats: [],
          osStats: [],
          deviceStats: [],
          recentVisitors: [],
        });
      }

      throw new Error('Failed to fetch visitor data');
    }

    // 데이터가 없는 경우 빈 통계 반환
    if (!allVisitors || allVisitors.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          totalUniqueVisitors: 0,
          totalVisits: 0,
          todayVisitors: 0,
          weekVisitors: 0,
          monthVisitors: 0,
          newVisitors: 0,
          returningVisitors: 0,
          avgVisitsPerUser: 0,
          lastVisitorTime: null,
        },
        dailyStats: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toISOString().split('T')[0],
            unique: 0,
            total: 0,
          };
        }),
        browserStats: [],
        osStats: [],
        deviceStats: [],
        recentVisitors: [],
      });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let todayVisitors = 0;
    let weekVisitors = 0;
    let monthVisitors = 0;
    let totalVisits = 0;
    let newVisitors = 0;
    let returningVisitors = 0;
    let lastVisitorTime: string | null = null;

    // 브라우저, OS, 디바이스 통계
    const browserCounts: Record<string, number> = {};
    const osCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};

    allVisitors.forEach(visitor => {
      const visitDate = new Date(visitor.last_visit);
      const visitCount = visitor.visit_count || 1;
      totalVisits += visitCount;

      // 신규 vs 재방문자
      if (visitCount === 1) {
        newVisitors++;
      } else {
        returningVisitors++;
      }

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

      // User agent 파싱
      const { browser, os, deviceType } = parseUserAgent(visitor.user_agent);
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      osCounts[os] = (osCounts[os] || 0) + 1;
      deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
    });

    // 평균 방문 횟수
    const avgVisitsPerUser = allVisitors.length > 0
      ? Math.round((totalVisits / allVisitors.length) * 10) / 10
      : 0;

    // 일별 통계 (최근 7일)
    const dailyStats: Record<string, { unique: Set<string>; total: number }> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // 초기화
    last7Days.forEach(date => {
      dailyStats[date] = { unique: new Set<string>(), total: 0 };
    });

    // 최근 7일 데이터만 집계
    allVisitors.forEach(visitor => {
      const visitDate = new Date(visitor.last_visit);
      if (visitDate >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        const date = visitDate.toISOString().split('T')[0];
        if (dailyStats[date] && visitor.ip_address) {
          dailyStats[date].unique.add(visitor.ip_address);
          dailyStats[date].total += visitor.visit_count || 1;
        }
      }
    });

    // 브라우저 통계 (상위 5개)
    const browserStats = Object.entries(browserCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // OS 통계 (상위 5개)
    const osStats = Object.entries(osCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // 디바이스 통계
    const deviceStats = Object.entries(deviceCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));

    // 최근 방문자 (10명)
    const recentVisitors = allVisitors.slice(0, 10).map(visitor => {
      const { browser, os, deviceType } = parseUserAgent(visitor.user_agent);
      return {
        ip: visitor.ip_address?.slice(0, 10) + '...',  // IP 일부만 표시
        visitCount: visitor.visit_count,
        lastVisit: visitor.last_visit,
        browser,
        os,
        deviceType,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUniqueVisitors: allVisitors.length,
        totalVisits,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        newVisitors,
        returningVisitors,
        avgVisitsPerUser,
        lastVisitorTime,
      },
      dailyStats: last7Days.map(date => ({
        date,
        unique: dailyStats[date].unique.size,
        total: dailyStats[date].total,
      })),
      browserStats,
      osStats,
      deviceStats,
      recentVisitors,
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
