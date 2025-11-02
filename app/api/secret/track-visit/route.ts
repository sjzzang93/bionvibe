import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Supabase 클라이언트 생성 함수 (런타임에만 실행)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(supabaseUrl, supabaseKey);
}

// IP 주소를 SHA-256으로 해시 (개인정보 보호)
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
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

// 지역 정보 가져오기 (Vercel에서 제공)
function getGeoInfo(request: NextRequest) {
  // Vercel의 geo 정보는 런타임에만 사용 가능 (타입 정의에 없음)
  const req = request as any;
  return {
    country: req.geo?.country || null,
    city: req.geo?.city || null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    const userAgent = request.headers.get('user-agent') || null;
    const { country, city } = getGeoInfo(request);

    // 기존 방문자 확인
    const { data: existingVisitor, error: fetchError } = await supabase
      .from('secret_visitors')
      .select('*')
      .eq('ip_hash', ipHash)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116은 "not found" 에러
      throw fetchError;
    }

    if (existingVisitor) {
      // 기존 방문자 - 방문 횟수 증가
      const { error: updateError } = await supabase
        .from('secret_visitors')
        .update({
          last_visit: new Date().toISOString(),
          visit_count: existingVisitor.visit_count + 1,
          user_agent: userAgent,
          country: country || existingVisitor.country,
          city: city || existingVisitor.city,
        })
        .eq('ip_hash', ipHash);

      if (updateError) throw updateError;

      return NextResponse.json({
        success: true,
        isNewVisitor: false,
        visitCount: existingVisitor.visit_count + 1,
      });
    } else {
      // 새 방문자 - 레코드 생성
      const { error: insertError } = await supabase
        .from('secret_visitors')
        .insert({
          ip_address: clientIP,
          ip_hash: ipHash,
          user_agent: userAgent,
          country,
          city,
          first_visit: new Date().toISOString(),
          last_visit: new Date().toISOString(),
          visit_count: 1,
        });

      if (insertError) throw insertError;

      return NextResponse.json({
        success: true,
        isNewVisitor: true,
        visitCount: 1,
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
