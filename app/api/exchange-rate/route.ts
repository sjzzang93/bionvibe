import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // exchangerate-api.com의 무료 API 사용
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/KRW');

    if (!response.ok) {
      throw new Error('환율 데이터를 가져올 수 없습니다');
    }

    const data = await response.json();

    // 주요 통화만 추출
    const currencies = {
      USD: { rate: 1 / data.rates.USD, name: '미국 달러', flag: '🇺🇸' },
      JPY: { rate: 100 / data.rates.JPY, name: '일본 엔 (100엔)', flag: '🇯🇵' },
      EUR: { rate: 1 / data.rates.EUR, name: '유럽 유로', flag: '🇪🇺' },
      CNY: { rate: 1 / data.rates.CNY, name: '중국 위안', flag: '🇨🇳' },
      GBP: { rate: 1 / data.rates.GBP, name: '영국 파운드', flag: '🇬🇧' },
      AUD: { rate: 1 / data.rates.AUD, name: '호주 달러', flag: '🇦🇺' },
      CAD: { rate: 1 / data.rates.CAD, name: '캐나다 달러', flag: '🇨🇦' },
      CHF: { rate: 1 / data.rates.CHF, name: '스위스 프랑', flag: '🇨🇭' },
    };

    return NextResponse.json({
      success: true,
      timestamp: data.time_last_updated,
      rates: currencies,
    });
  } catch (error) {
    console.error('환율 API 에러:', error);
    return NextResponse.json(
      { success: false, error: '환율 데이터를 가져오는데 실패했습니다' },
      { status: 500 }
    );
  }
}
