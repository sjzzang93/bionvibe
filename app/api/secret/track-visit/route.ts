import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Supabase 클라이언트 생성 함수 (런타임에만 실행)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(supabaseUrl, supabaseKey);
}

// 요청에서 실제 IP 주소 추출
function getClientIP(request: NextRequest): string {
  // Vercel/Next.js에서 실제 클라이언트 IP 가져오기
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwardedFor) {
    // x-forwarded-for는 쉼표로 구분된 IP 리스트일 수 있음
    return forwardedFor.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // 로컬 개발 환경
  return '127.0.0.1';
}

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "Desktop";

  // Detect browser
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";

  // Detect OS
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

  // Detect device type
  if (userAgent.includes("Mobile") || userAgent.includes("Android")) deviceType = "Mobile";
  else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) deviceType = "Tablet";

  return { browser, os, deviceType };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // UPSERT: 없으면 INSERT, 있으면 UPDATE
    // ip_address가 이미 있으면 visit_count 증가 & last_visit 업데이트
    const { data: existingVisitor, error: selectError } = await supabase
      .from('secret_visitors')
      .select('id, visit_count')
      .eq('ip_address', clientIP)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (정상)
      console.error('Select error:', selectError);
    }

    if (existingVisitor) {
      // 기존 방문자: visit_count 증가 & last_visit 업데이트
      const { error: updateError } = await supabase
        .from('secret_visitors')
        .update({
          visit_count: existingVisitor.visit_count + 1,
          last_visit: new Date().toISOString(),
        })
        .eq('ip_address', clientIP);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        success: true,
        message: 'Visit count updated',
      });
    } else {
      // 새 방문자: INSERT
      const { error: insertError } = await supabase
        .from('secret_visitors')
        .insert({
          ip_address: clientIP,
          user_agent: userAgent,
          visit_count: 1,
        });

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({
        success: true,
        message: 'New visitor tracked',
      });
    }
  } catch (error) {
    console.error('Track visit error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track visit',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
