import { NextRequest, NextResponse } from 'next/server';
import appsData from '@/data/apps.json';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    // 현재 앱 찾기
    const currentApp = appsData.apps.find((app) => app.slug === slug);

    if (!currentApp) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // 관련 앱이 없으면 빈 배열 반환
    if (!currentApp.relatedApps || currentApp.relatedApps.length === 0) {
      return NextResponse.json({ relatedApps: [] });
    }

    // 관련 앱 정보 가져오기
    const relatedApps = currentApp.relatedApps
      .map((relatedSlug) => {
        return appsData.apps.find((app) => app.slug === relatedSlug);
      })
      .filter(Boolean) // undefined 제거
      .slice(0, 3); // 최대 3개까지만

    return NextResponse.json({ relatedApps });
  } catch (error) {
    console.error('Related apps API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

