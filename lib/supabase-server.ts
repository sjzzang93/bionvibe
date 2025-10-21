// FILE: /lib/supabase-server.ts
// 서버 전용 클라이언트 (API Routes, Server Components, Server Actions)
import { createClient } from '@supabase/supabase-js';

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // ★ 서비스 롤 키는 서버 전용, 절대 클라이언트로 노출 금지
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(url, serviceKey, {
    auth: { 
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

