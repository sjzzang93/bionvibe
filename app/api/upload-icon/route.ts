import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase-server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const supabase = getServerSupabase();
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

    // 파일 크기 제한 (5MB - 아이콘용)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let uploadBuffer: Buffer;
    let contentType: string;
    let optimizationApplied = false;

    // Sharp를 사용하여 아이콘 최적화
    try {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/heic', 'image/heif'];
      const fileType = file.type.toLowerCase();

      // SVG는 최적화 없이 그대로 업로드
      if (fileType === 'image/svg+xml') {
        uploadBuffer = buffer;
        contentType = 'image/svg+xml';
        optimizationApplied = false;
      } else if (fileType.includes('heic') || fileType.includes('heif') || validTypes.includes(fileType)) {
        // 정사각형 512x512 PNG로 최적화 (투명도 유지)
        uploadBuffer = await sharp(buffer)
          .resize(512, 512, {
            fit: 'contain', // 아이콘은 찌그러지지 않게
            background: { r: 0, g: 0, b: 0, alpha: 0 }, // 투명 배경
          })
          .png({
            quality: 100,
            compressionLevel: 9,
          })
          .toBuffer();
        contentType = 'image/png';
        optimizationApplied = true;
      } else {
        return NextResponse.json(
          { error: '지원하지 않는 파일 형식입니다. (jpg, png, webp, gif, svg, heic 가능)' },
          { status: 400 }
        );
      }
    } catch (sharpError) {
      console.warn('Sharp optimization failed, uploading original:', sharpError);
      uploadBuffer = buffer;
      contentType = file.type || 'image/png';
    }

    // Supabase Storage에 업로드 (app-images 버킷 사용)
    const extension = optimizationApplied ? 'png' : (file.name.split('.').pop() || 'png');
    const filename = `icons/${slug}-${Date.now()}.${extension}`;
    const { data, error } = await supabase.storage
      .from('app-images') // 기존 버킷 사용
      .upload(filename, uploadBuffer, {
        contentType: contentType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage error:', error);
      return NextResponse.json(
        { error: `아이콘 업로드 실패: ${error.message}` },
        { status: 500 }
      );
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from('app-images')
      .getPublicUrl(filename);

    const publicUrl = urlData.publicUrl;

    return NextResponse.json({
      success: true,
      iconUrl: publicUrl,
      message: optimizationApplied
        ? '아이콘이 Supabase Storage에 최적화되어 업로드되었습니다! (512x512 PNG)'
        : '아이콘이 Supabase Storage에 업로드되었습니다! (원본)',
      optimization: optimizationApplied ? {
        width: 512,
        height: 512,
        format: 'png',
        quality: 100,
        cdn: 'Supabase Storage CDN',
        path: filename,
      } : {
        format: 'original',
        cdn: 'Supabase Storage CDN',
        path: filename,
      },
    });

  } catch (error) {
    console.error('Error uploading icon:', error);
    return NextResponse.json(
      { error: `아이콘 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}
