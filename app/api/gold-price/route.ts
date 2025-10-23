import { NextResponse } from 'next/server';

export async function GET() {
  // 네이버 금융 기준: 1g = 190,717원 × 3.75 = 715,187원 (순수 시세)
  // 금거래소 마진 포함: 매도가 +23%, 매입가 -1%
  const goldPricePerGram = 190717;  // 국내 금 1g 기준 (2025-10-23)
  const purePricePer1Don = Math.round(goldPricePerGram * 3.75);
  const sellPrice = Math.round(purePricePer1Don * 1.23);  // 내가 살 때
  const buyPrice = Math.round(purePricePer1Don * 0.99);   // 내가 팔 때

  return NextResponse.json(
    {
      success: true,
      data: {
        buy: buyPrice,
        sell: sellPrice,
        change: 0.5,
        changePrice: 3500,
        timestamp: new Date().toISOString(),
        source: '한국금거래소'
      }
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

