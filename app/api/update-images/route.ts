import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, imageUrl } = body;

    if (!slug || !imageUrl) {
      return NextResponse.json(
        { error: '앱 slug와 이미지 URL이 필요합니다.' },
        { status: 400 }
      );
    }

    // apps.json 파일 경로 (두 곳 모두 업데이트)
    const dataJsonPath = path.join(process.cwd(), 'data', 'apps.json');
    const publicJsonPath = path.join(process.cwd(), 'public', 'data', 'apps.json');
    
    // public/data/apps.json 파일 읽기 (실제 사용 파일)
    const fileContents = fs.readFileSync(publicJsonPath, 'utf8');
    const data = JSON.parse(fileContents);

    // 해당 slug의 앱 찾아서 이미지 업데이트
    const appIndex = data.apps.findIndex((app: any) => app.slug === slug);
    
    if (appIndex === -1) {
      return NextResponse.json(
        { error: '해당 앱을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    data.apps[appIndex].image = imageUrl;

    // 두 파일 모두 업데이트
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(publicJsonPath, jsonString, 'utf8');
    
    // data/apps.json이 있으면 함께 업데이트
    if (fs.existsSync(dataJsonPath)) {
      fs.writeFileSync(dataJsonPath, jsonString, 'utf8');
    }

    return NextResponse.json({
      success: true,
      message: '이미지가 업데이트되었습니다!',
      app: data.apps[appIndex]
    });

  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: '이미지 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
