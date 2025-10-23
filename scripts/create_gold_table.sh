#!/bin/bash

echo "🗄️ Supabase gold_prices 테이블 생성 스크립트"
echo "=============================================="

# .env.local에서 Supabase URL과 키 읽기
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
else
    echo "❌ .env.local 파일을 찾을 수 없습니다."
    exit 1
fi

# Supabase Service Role Key 필요 (Dashboard → Settings → API)
echo "⚠️  주의: 이 스크립트는 Supabase Service Role Key가 필요합니다."
echo "Dashboard → Settings → API → service_role key 복사"
echo ""
read -p "Service Role Key를 입력하세요: " SERVICE_KEY

if [ -z "$SERVICE_KEY" ]; then
    echo "❌ Service Role Key가 필요합니다."
    exit 1
fi

echo ""
echo "📤 SQL 실행 중..."

curl -X POST \
  "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d @GOLD_PRICE_SUPABASE.sql

echo ""
echo "✅ 완료! Supabase Dashboard에서 확인하세요."

