import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Admin 권한으로 Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    let uploadBuffer: Buffer;
    let contentType: string;
    let optimizationApplied = false;

    // Sharp를 사용하여 이미지 최적화 시도 (실패하면 원본 업로드)
    try {
      // 파일 형식 검증 (더 많은 형식 지원)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
      const fileType = file.type.toLowerCase();
      
      // HEIC/HEIF는 자동으로 JPEG로 변환
      if (fileType.includes('heic') || fileType.includes('heif') || validTypes.includes(fileType)) {
        uploadBuffer = await sharp(buffer)
          .resize(800, 600, {
            fit: 'cover',
            position: 'center',
          })
          .webp({
            quality: 85,
            effort: 6,
          })
          .toBuffer();
        contentType = 'image/webp';
        optimizationApplied = true;
      } else {
        // 지원하지 않는 형식
        return NextResponse.json(
          { error: '지원하지 않는 파일 형식입니다. (jpg, png, webp, gif, heic 가능)' },
          { status: 400 }
        );
      }
    } catch (sharpError) {
      // Sharp 최적화 실패 시 원본 업로드
      console.warn('Sharp optimization failed, uploading original:', sharpError);
      uploadBuffer = buffer;
      contentType = file.type || 'image/jpeg';
    }

    // Supabase Storage에 업로드
    const extension = optimizationApplied ? 'webp' : (file.name.split('.').pop() || 'jpg');
    const filename = `${slug}-${Date.now()}.${extension}`;
    const { data, error } = await supabase.storage
      .from('app-images')
      .upload(filename, uploadBuffer, {
        contentType: contentType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage error:', error);
      return NextResponse.json(
        { error: `이미지 업로드 실패: ${error.message}` },
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
      imageUrl: publicUrl,
      message: optimizationApplied 
        ? '이미지가 Supabase Storage에 최적화되어 업로드되었습니다! (800x600 WebP)'
        : '이미지가 Supabase Storage에 업로드되었습니다! (원본)',
      optimization: optimizationApplied ? {
        width: 800,
        height: 600,
        format: 'webp',
        quality: 85,
        cdn: 'Supabase Storage CDN',
        path: filename,
      } : {
        format: 'original',
        cdn: 'Supabase Storage CDN',
        path: filename,
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
