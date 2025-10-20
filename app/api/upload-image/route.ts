import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: '앱 slug가 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 검증
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다. (jpg, png, webp, gif만 가능)' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB - 최적화 전)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sharp를 사용하여 이미지 최적화
    const optimizedBuffer = await sharp(buffer)
      .resize(800, 600, {
        fit: 'cover',
        position: 'center',
      })
      .webp({
        quality: 85, // 고품질 유지하면서 용량 최적화
        effort: 6,   // 압축 노력도 (0-6, 높을수록 더 최적화)
      })
      .toBuffer();

    // Vercel Blob에 업로드
    const filename = `apps/${slug}-${Date.now()}.webp`;
    const blob = await put(filename, optimizedBuffer, {
      access: 'public',
      contentType: 'image/webp',
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
      message: '이미지가 Vercel Blob에 최적화되어 업로드되었습니다! (800x600 WebP)',
      optimization: {
        width: 800,
        height: 600,
        format: 'webp',
        quality: 85,
        cdn: 'Vercel Blob CDN',
      },
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: `파일 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}


import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: '앱 slug가 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 검증
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다. (jpg, png, webp, gif만 가능)' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB - 최적화 전)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sharp를 사용하여 이미지 최적화
    const optimizedBuffer = await sharp(buffer)
      .resize(800, 600, {
        fit: 'cover',
        position: 'center',
      })
      .webp({
        quality: 85, // 고품질 유지하면서 용량 최적화
        effort: 6,   // 압축 노력도 (0-6, 높을수록 더 최적화)
      })
      .toBuffer();

    // Vercel Blob에 업로드
    const filename = `apps/${slug}-${Date.now()}.webp`;
    const blob = await put(filename, optimizedBuffer, {
      access: 'public',
      contentType: 'image/webp',
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
      message: '이미지가 Vercel Blob에 최적화되어 업로드되었습니다! (800x600 WebP)',
      optimization: {
        width: 800,
        height: 600,
        format: 'webp',
        quality: 85,
        cdn: 'Vercel Blob CDN',
      },
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: `파일 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}

