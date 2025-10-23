import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  return 'unknown';
}

// GET: 사용자 랭킹 조회
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');

    // 모든 사용자 조회
    const { data: users, error } = await supabase
      .from('investment_users')
      .select('id, nickname, balance, total_rewards, created_at')
      .eq('is_active', true);

    if (error) throw error;

    // 각 사용자의 포트폴리오 가치 계산 (buy_amount 포함)
    const { data: portfolios } = await supabase
      .from('portfolios')
      .select('user_id, asset_type, quantity, buy_amount');

    // 실시간 코인 가격 조회 (업비트 API)
    let coinPrices: { [key: string]: number } = {};
    try {
      // 업비트 API 직접 호출
      const upbitResponse = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-XRP,KRW-ADA,KRW-DOGE,KRW-SOL,KRW-MATIC,KRW-DOT,KRW-AVAX,KRW-SHIB,KRW-ATOM,KRW-LINK,KRW-CRO,KRW-UNI,KRW-ETC,KRW-XLM,KRW-BCH,KRW-LTC,KRW-ALGO,KRW-VET,KRW-ICP,KRW-FIL,KRW-TRX,KRW-EOS,KRW-AXS,KRW-SAND,KRW-MANA,KRW-THETA,KRW-KLAY,KRW-AAVE,KRW-GRT,KRW-MKR,KRW-SNX,KRW-COMP,KRW-YFI,KRW-ZRX,KRW-BAT,KRW-ENJ,KRW-CHZ,KRW-FLOW,KRW-ANKR,KRW-STORJ,KRW-SXP,KRW-CVC,KRW-OMG,KRW-KNC,KRW-SC,KRW-QTUM,KRW-ZIL,KRW-WAVES');
      if (upbitResponse.ok) {
        const upbitData = await upbitResponse.json();
        upbitData.forEach((item: any) => {
          const symbol = item.market.replace('KRW-', '');
          coinPrices[symbol] = item.trade_price;
        });
      }
    } catch (error) {
      console.error('Failed to fetch coin prices:', error);
    }

    // 금 시세 (한돈 = 3.75g)
    // 네이버 금융 기준: 1g = 190,717원 × 3.75 = 715,187원
    // 금거래소 마진 +23% 적용
    const goldPricePerGram = 190717;
    const purePricePer1Don = Math.round(goldPricePerGram * 3.75);
    const goldCurrentPrice = Math.round(purePricePer1Don * 1.23);  // 매도가 (내가 살 때)

    // 사용자별 총 자산 계산
    const rankings = (users || []).map(user => {
      const userPortfolios = (portfolios || []).filter(p => p.user_id === user.id);

      // 포트폴리오 현재 가치 (실시간 가격 적용)
      const portfolioValue = userPortfolios.reduce((sum, p) => {
        let price = 0;
        if (p.asset_type === 'GOLD') {
          price = goldCurrentPrice;
        } else {
          // 코인 심볼로 가격 찾기
          price = coinPrices[p.asset_type] || 0;
        }
        return sum + (p.quantity * price);
      }, 0);

      // 총 자산 = 현금 잔액 + 포트폴리오 가치
      const totalAssets = user.balance + portfolioValue;
      
      // 실제 투자한 금액 (buy_amount 합계)
      const investedAmount = userPortfolios.reduce((sum, p) => sum + (p.buy_amount || 0), 0);
      
      // 수익 = 포트폴리오 가치 - 실제 투자금
      const profit = portfolioValue - investedAmount;
      
      // 수익률 = (포트폴리오 가치 - 투자금) / 투자금 * 100 (투자금이 0이면 0%)
      const profitRate = investedAmount > 0 ? (profit / investedAmount) * 100 : 0;

      return {
        nickname: user.nickname,
        balance: user.balance,
        portfolio_value: portfolioValue,
        total_assets: totalAssets,
        profit: profit,
        profit_rate: profitRate,
        total_rewards: user.total_rewards,
        created_at: user.created_at
      };
    });

    // 총 자산 기준 내림차순 정렬
    rankings.sort((a, b) => b.total_assets - a.total_assets);

    // 상위 N명만 추출
    const topRankings = rankings.slice(0, limit);

    // 현재 사용자 순위 찾기
    const { data: currentUser } = await supabase
      .from('investment_users')
      .select('nickname')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .single();

    let myRanking = null;
    if (currentUser) {
      const myIndex = rankings.findIndex(r => r.nickname === currentUser.nickname);
      if (myIndex !== -1) {
        myRanking = {
          rank: myIndex + 1,
          ...rankings[myIndex]
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        rankings: topRankings.map((r, index) => ({
          rank: index + 1,
          ...r
        })),
        my_ranking: myRanking,
        total_users: rankings.length
      }
    });

  } catch (error) {
    console.error('Ranking GET Error:', error);
    return NextResponse.json(
      { success: false, error: '랭킹 조회 실패' },
      { status: 500 }
    );
  }
}
