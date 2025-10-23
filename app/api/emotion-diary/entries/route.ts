import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 일기 목록 조회
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('emotion_diary_user_id')?.value;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: '로그인이 필요합니다.'
      }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('emotion_diary_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Entries fetch error:', error);
      return NextResponse.json({
        success: false,
        error: '일기 목록 조회 실패'
      }, { status: 500 });
    }

    // Supabase 데이터를 프론트엔드 형식으로 변환
    const entries = data.map(entry => ({
      id: entry.id,
      date: entry.date,
      emotion: entry.emotion,
      color: entry.color,
      weather: entry.weather,
      intensity: entry.intensity,
      note: entry.note || ''
    }));

    return NextResponse.json({
      success: true,
      data: entries
    });
  } catch (error) {
    console.error('Entries fetch error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 일기 작성
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('emotion_diary_user_id')?.value;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: '로그인이 필요합니다.'
      }, { status: 401 });
    }

    const body = await request.json();
    const { date, emotion, color, weather, intensity, note } = body;

    // 유효성 검사
    if (!emotion || !color || !weather || !intensity) {
      return NextResponse.json({
        success: false,
        error: '필수 항목을 입력해주세요.'
      }, { status: 400 });
    }

    if (intensity < 1 || intensity > 5) {
      return NextResponse.json({
        success: false,
        error: '감정 강도는 1~5 사이여야 합니다.'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('emotion_diary_entries')
      .insert([{
        user_id: userId,
        date: date || new Date().toISOString(),
        emotion,
        color,
        weather,
        intensity,
        note: note || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Entry creation error:', error);
      return NextResponse.json({
        success: false,
        error: '일기 저장 실패'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        date: data.date,
        emotion: data.emotion,
        color: data.color,
        weather: data.weather,
        intensity: data.intensity,
        note: data.note || ''
      },
      message: '일기가 저장되었습니다 💾'
    });
  } catch (error) {
    console.error('Entry creation error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 일기 삭제
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('emotion_diary_user_id')?.value;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: '로그인이 필요합니다.'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');

    if (!entryId) {
      return NextResponse.json({
        success: false,
        error: '일기 ID가 필요합니다.'
      }, { status: 400 });
    }

    // 본인의 일기인지 확인
    const { data: entry } = await supabase
      .from('emotion_diary_entries')
      .select('user_id')
      .eq('id', entryId)
      .single();

    if (!entry || entry.user_id !== userId) {
      return NextResponse.json({
        success: false,
        error: '권한이 없습니다.'
      }, { status: 403 });
    }

    const { error } = await supabase
      .from('emotion_diary_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) {
      console.error('Entry deletion error:', error);
      return NextResponse.json({
        success: false,
        error: '일기 삭제 실패'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '일기가 삭제되었습니다 🗑️'
    });
  } catch (error) {
    console.error('Entry deletion error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 });
  }
}
