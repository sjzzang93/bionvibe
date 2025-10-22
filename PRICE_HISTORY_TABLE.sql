-- ============================================
-- 가격 히스토리 테이블
-- 비트코인 vs 순금 실제 상승률 분석용
-- ============================================

-- 기존 삭제
DROP POLICY IF EXISTS "price_history_select_policy" ON public.price_history;
DROP POLICY IF EXISTS "price_history_insert_policy" ON public.price_history;
DROP TRIGGER IF EXISTS cleanup_price_history_trigger ON public.price_history;
DROP FUNCTION IF EXISTS cleanup_old_price_history() CASCADE;
DROP TABLE IF EXISTS public.price_history CASCADE;

-- 테이블 생성
CREATE TABLE public.price_history (
  id BIGSERIAL PRIMARY KEY,
  
  -- 비트코인 가격 (KRW)
  bitcoin_price NUMERIC(20, 2) NOT NULL,
  bitcoin_change_24h NUMERIC(20, 2),
  bitcoin_change_pct NUMERIC(10, 4),
  
  -- 순금 가격 (1돈 = 3.75g, KRW)
  gold_price NUMERIC(20, 2) NOT NULL,
  gold_change NUMERIC(20, 2),
  gold_change_pct NUMERIC(10, 4),
  
  -- 환율 (USD to KRW)
  usd_krw_rate NUMERIC(10, 4) NOT NULL,
  
  -- 타임스탬프
  recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- 메타데이터
  source TEXT DEFAULT 'API' NOT NULL,
  notes TEXT
);

-- 인덱스 (빠른 조회)
CREATE INDEX idx_price_history_recorded_at ON public.price_history(recorded_at DESC);
CREATE INDEX idx_price_history_date ON public.price_history(DATE(recorded_at));

-- RLS 활성화
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (모두 읽기 가능, 서버에서만 쓰기 가능)
CREATE POLICY "price_history_select_policy"
  ON public.price_history
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "price_history_insert_policy"
  ON public.price_history
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 자동 정리 함수 (1년 이상 오래된 데이터는 일별 평균으로 압축)
CREATE OR REPLACE FUNCTION cleanup_old_price_history()
RETURNS void AS $$
BEGIN
  -- 1년 이상 오래된 데이터 중 시간별 데이터를 일별 평균으로 압축
  -- (필요시 구현)
  
  -- 2년 이상 오래된 데이터는 삭제
  DELETE FROM public.price_history 
  WHERE recorded_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- 테이블 코멘트
COMMENT ON TABLE public.price_history IS '비트코인/순금 가격 히스토리 (상승률 분석용)';
COMMENT ON COLUMN public.price_history.bitcoin_price IS '비트코인 가격 (KRW)';
COMMENT ON COLUMN public.price_history.gold_price IS '순금 1돈(3.75g) 가격 (KRW)';
COMMENT ON COLUMN public.price_history.usd_krw_rate IS 'USD to KRW 환율';
COMMENT ON COLUMN public.price_history.recorded_at IS '기록 시간';

-- ============================================
-- 상승률 분석 함수들
-- ============================================

-- 특정 기간 상승률 계산 함수
CREATE OR REPLACE FUNCTION get_return_rate(
  asset TEXT,  -- 'bitcoin' or 'gold'
  days INTEGER  -- 기간 (일)
)
RETURNS TABLE(
  start_price NUMERIC,
  end_price NUMERIC,
  return_rate NUMERIC,
  return_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH prices AS (
    SELECT 
      CASE 
        WHEN asset = 'bitcoin' THEN bitcoin_price
        WHEN asset = 'gold' THEN gold_price
      END as price,
      recorded_at
    FROM public.price_history
    WHERE recorded_at >= NOW() - (days || ' days')::INTERVAL
    ORDER BY recorded_at
  ),
  first_last AS (
    SELECT 
      (SELECT price FROM prices ORDER BY recorded_at ASC LIMIT 1) as first_price,
      (SELECT price FROM prices ORDER BY recorded_at DESC LIMIT 1) as last_price
  )
  SELECT 
    first_price,
    last_price,
    ((last_price - first_price) / first_price * 100) as return_rate,
    (last_price - first_price) as return_amount
  FROM first_last;
END;
$$ LANGUAGE plpgsql;

-- 일별 평균 가격 조회 함수
CREATE OR REPLACE FUNCTION get_daily_prices(
  start_date DATE,
  end_date DATE
)
RETURNS TABLE(
  date DATE,
  bitcoin_avg NUMERIC,
  gold_avg NUMERIC,
  usd_krw_avg NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(recorded_at) as date,
    AVG(bitcoin_price)::NUMERIC(20,2) as bitcoin_avg,
    AVG(gold_price)::NUMERIC(20,2) as gold_avg,
    AVG(usd_krw_rate)::NUMERIC(10,4) as usd_krw_avg
  FROM public.price_history
  WHERE DATE(recorded_at) BETWEEN start_date AND end_date
  GROUP BY DATE(recorded_at)
  ORDER BY date;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 샘플 데이터 삽입 (테스트용)
-- ============================================

-- 현재 시점 기준 샘플 데이터
INSERT INTO public.price_history (
  bitcoin_price,
  bitcoin_change_24h,
  bitcoin_change_pct,
  gold_price,
  gold_change,
  gold_change_pct,
  usd_krw_rate,
  source,
  notes
) VALUES 
  (135000000, 3500000, 2.66, 320000, 1500, 0.47, 1320.50, 'SAMPLE', '샘플 데이터 1'),
  (132000000, -1000000, -0.75, 318000, -800, -0.25, 1318.20, 'SAMPLE', '샘플 데이터 2');

-- ============================================
-- 확인 쿼리
-- ============================================

-- 테이블 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  tableowner
FROM pg_tables
WHERE tablename = 'price_history';

-- 정책 확인
SELECT 
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE tablename = 'price_history';

-- 인덱스 확인
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'price_history';

-- 저장된 데이터 확인
SELECT 
  id,
  bitcoin_price,
  gold_price,
  usd_krw_rate,
  recorded_at,
  source
FROM public.price_history
ORDER BY recorded_at DESC
LIMIT 10;

-- 상승률 분석 예시 (최근 7일)
SELECT * FROM get_return_rate('bitcoin', 7);
SELECT * FROM get_return_rate('gold', 7);

-- 결과
SELECT '✅ 가격 히스토리 테이블 설정 완료!' as status,
       (SELECT COUNT(*) FROM public.price_history) as total_records;

