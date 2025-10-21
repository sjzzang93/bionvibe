// App Router, CSR 전용 브라우저 클라이언트 (HMR-안전)
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ▶ 중요한 포인트:
// - globalThis에 보관해서 HMR/리렌더 시에도 단일 인스턴스만 유지
// - storageKey를 프로젝트별로 UNIQUE 하게 설정 (도메인 공유 시 충돌 방지)
const STORAGE_KEY = 'sb-bionvibe-main-auth-v1';

declare global {
  // eslint-disable-next-line no-var
  var __SUPABASE_CLIENT__: SupabaseClient | undefined;
}

export function getBrowserSupabase(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  
  if (!globalThis.__SUPABASE_CLIENT__) {
    globalThis.__SUPABASE_CLIENT__ = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: STORAGE_KEY,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return globalThis.__SUPABASE_CLIENT__!;
}

// 기존 코드와의 호환성을 위해 export
export const supabase = getBrowserSupabase();

// 타입 정의
export interface Contact {
  id?: number;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'answered' | 'closed';
  created_at?: string;
  answered_at?: string;
  admin_reply?: string;
}

export interface Analytics {
  id?: number;
  app_id: string;
  timestamp: string;
  referrer?: string;
}

export interface Ranking {
  id?: number;
  app_id: string;
  nickname: string;
  score: number;
  created_at?: string;
}

