-- 사용하지 않는 앱 7개 삭제
-- 2025-01-23

DELETE FROM apps 
WHERE id IN (
  'salary-divider',           -- 월급 쪼개기
  'income-tax-calculator',    -- 소득세 계산기
  'compound-calculator',      -- 복리 계산기
  'finance-loan-refinance',   -- 대출 갈아타기
  'credit-card-optimizer',    -- 카드 최적화
  'finance-emergency-fund',   -- 비상금 계산
  'phone-usage-analyzer'      -- 스마트폰 사용 분석
);

-- 삭제된 앱 확인
SELECT COUNT(*) as deleted_count FROM apps 
WHERE id IN (
  'salary-divider',
  'income-tax-calculator',
  'compound-calculator',
  'finance-loan-refinance',
  'credit-card-optimizer',
  'finance-emergency-fund',
  'phone-usage-analyzer'
);
-- 결과가 0이면 삭제 성공

-- 전체 앱 개수 확인
SELECT COUNT(*) as total_apps FROM apps;

