import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * POST: 페이지 방문 기록
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // IP 주소 가져오기 (Vercel, Cloudflare, 로컬 지원)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    const visitorIp = cfConnectingIp || forwardedFor?.split(',')[0] || realIp || 'unknown';

    // User-Agent 가져오기
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 페이지 경로 (요청에서 받거나 기본값)
    const body = await request.json().catch(() => ({}));
    const pagePath = body.pagePath || '/';

    // 오늘 날짜 (KST 기준으로 저장)
    const now = new Date();
    now.setHours(now.getHours() + 9); // KST
    const today = now.toISOString().split('T')[0];

    // 모든 방문 기록 (재방문 포함, IP 중복 체크 제거)
    const { error } = await supabase
      .from('page_views')
      .insert([{
        visitor_ip: visitorIp,
        user_agent: userAgent,
        page_path: pagePath,
        date: today,
      }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Visit tracked',
    });

  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET: 실시간 통계 조회
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 오늘 날짜 (KST 기준 - 한국시간 00시부터)
    const now = new Date();
    now.setHours(now.getHours() + 9); // KST
    const today = now.toISOString().split('T')[0];

    // 오늘 활성 사용자 수 (재방문 포함)
    const { count: todayActiveUsers } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('date', today);

    // 오늘 신규 유입 (unique IP)
    const { data: todayUniqueData } = await supabase
      .from('page_views')
      .select('visitor_ip')
      .eq('date', today);
    const todayUniqueVisitors = new Set(todayUniqueData?.map(v => v.visitor_ip) || []).size;

    // 전체 페이지뷰 (재방문 포함)
    const { count: totalPageViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      data: {
        todayActiveUsers: todayActiveUsers || 0,        // 오늘 활성 사용자 (재방문 포함)
        todayUniqueVisitors: todayUniqueVisitors || 0,  // 오늘 신규 유입 (unique IP)
        totalPageViews: totalPageViews || 0,            // 누적 페이지뷰 (재방문 포함)
      },
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
