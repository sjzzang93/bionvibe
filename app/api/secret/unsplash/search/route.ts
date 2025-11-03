import { NextRequest, NextResponse } from 'next/server';

// Unsplash API - 무료 API 키가 필요합니다
// https://unsplash.com/developers 에서 발급받으세요
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { success: false, message: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!UNSPLASH_ACCESS_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsplash API 키가 설정되지 않았습니다. .env.local에 UNSPLASH_ACCESS_KEY를 추가해주세요.',
          fallbackImage: `https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop`
        },
        { status: 500 }
      );
    }

    // Unsplash API 호출
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`;

    const response = await fetch(unsplashUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        success: false,
        message: `"${query}" 검색 결과가 없습니다.`,
        fallbackImage: `https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop`
      });
    }

    // 랜덤하게 하나 선택 (매번 다른 이미지)
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const photo = data.results[randomIndex];

    return NextResponse.json({
      success: true,
      image: {
        url: photo.urls.regular,
        thumbnail: photo.urls.small,
        full: photo.urls.full,
        author: photo.user.name,
        authorUrl: photo.user.links.html,
        description: photo.description || photo.alt_description,
      }
    });
  } catch (error) {
    console.error('Unsplash search error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '이미지 검색에 실패했습니다.',
        fallbackImage: `https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop`
      },
      { status: 500 }
    );
  }
}
