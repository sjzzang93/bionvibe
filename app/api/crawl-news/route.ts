import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    console.log('🔄 뉴스 크롤링 시작...');

    // Python 스크립트 실행
    const { stdout, stderr } = await execAsync('python3 scripts/crawl-news.py', {
      timeout: 60000 // 60초 타임아웃
    });

    if (stderr && !stderr.includes('⚠️')) {
      console.error('크롤링 에러:', stderr);
    }

    console.log('✅ 크롤링 완료:', stdout);

    return NextResponse.json({
      success: true,
      message: '뉴스 업데이트 완료',
      output: stdout
    });

  } catch (error: any) {
    console.error('❌ 크롤링 실패:', error);

    return NextResponse.json({
      success: false,
      error: error.message || '알 수 없는 오류'
    }, { status: 500 });
  }
}
